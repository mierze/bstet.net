package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/labstack/echo/v4"
)

const (
	dbGuests = "_guests.json" // read-only
	dbStore  = "_store.json"  // mutable
)

var (
	guests     []map[string]interface{}          // loaded from _guests.json, read-only
	store      map[string]map[string]interface{} // loaded from _store.json, mutable
	storeMutex sync.RWMutex
)

func main() {
	if err := loadGuests(); err != nil {
		log.Fatalf("Could not load guests: %v", err)
	}
	if err := loadStore(); err != nil {
		log.Printf("Could not load store: %v", err)
		store = make(map[string]map[string]interface{})
	}

	go periodicFlush()

	e := echo.New()

	e.GET("/", serveIndex)
	e.GET("/wedding", serveIndex)
	e.GET("/wedding/*", serveStatic)
	e.GET("/api/guests", getGuests)
	e.GET("/api/store", getStore)
	e.POST("/api/store", postStore)

	certFile := "/etc/letsencrypt/live/bstet.net/fullchain.pem"
	keyFile := "/etc/letsencrypt/live/bstet.net/privkey.pem"

	port := os.Getenv("PORT")
	if port == "" {
		port = "4000" // for local
	}

	if _, err := os.Stat(certFile); err == nil {
		go func() {
			redirect := echo.New()
			redirect.Any("/*", func(c echo.Context) error {
				return c.Redirect(http.StatusMovedPermanently,
					"https://bstet.net"+c.Request().RequestURI)
			})
			log.Println("HTTP redirect server starting on :80")
			redirect.Logger.Fatal(redirect.Start(":80"))
		}()

		log.Println("Serving HTTPS on :443")
		e.Logger.Fatal(e.StartTLS(":443", certFile, keyFile))
	} else {
		log.Printf("Serving HTTP on :%s (development mode)", port)
		e.Logger.Fatal(e.Start(":" + port))
	}
}

func serveIndex(c echo.Context) error {
	return c.File("_dist/index.html")
}

func serveStatic(c echo.Context) error {
	path := c.Request().URL.Path[len("/wedding/"):]
	filePath := "_dist/" + path
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return c.File("_dist/index.html")
	}
	return c.File(filePath)
}

func getGuests(c echo.Context) error {
	name := c.QueryParam("name")
	zip := c.QueryParam("zip")
	fmt.Println("getGuests (?)", name, zip)

	if name == "" && zip == "" {
		return c.JSON(http.StatusOK, guests)
	}

	var filtered []map[string]interface{}
	for _, item := range guests {
		nameMatch := false
		zipMatch := false

		if name != "" {
			nameMatch = checkNameMatch(item, name)
		} else {
			nameMatch = true
		}

		if zip != "" {
			if code, ok := item["code"].(string); ok {
				zipMatch = strings.EqualFold(code, zip)
			}
		} else {
			zipMatch = true // If no zip provided, consider it a match
		}

		if nameMatch && zipMatch {
			filtered = append(filtered, item)
		}
	}
	return c.JSON(http.StatusOK, filtered)
}

func checkNameMatch(item map[string]interface{}, searchName string) bool {
	searchName = strings.ToLower(strings.TrimSpace(searchName))

	if mainName, ok := item["name"].(string); ok {
		if containsLastName(mainName, searchName) {
			return true
		}
	}

	if guestsInterface, ok := item["guests"]; ok {
		if guests, ok := guestsInterface.([]interface{}); ok {
			for _, guest := range guests {
				if guestName, ok := guest.(string); ok {
					if containsLastName(guestName, searchName) {
						return true
					}
				}
			}
		}
	}

	return false
}

func containsLastName(fullName, searchLastName string) bool {
	fullName = strings.ToLower(strings.TrimSpace(fullName))
	searchLastName = strings.ToLower(strings.TrimSpace(searchLastName))

	nameParts := strings.Fields(fullName)

	for _, part := range nameParts {
		if strings.Contains(part, searchLastName) || strings.Contains(searchLastName, part) {
			return true
		}
	}

	return false
}

// GET /api/store
func getStore(c echo.Context) error {
	id := c.QueryParam("id")
	storeMutex.RLock()
	defer storeMutex.RUnlock()
	fmt.Println("id", id)
	if id != "" {
		if data, ok := store[id]; ok {
			return c.JSON(http.StatusOK, data)
		}
		return c.JSON(http.StatusNotFound, map[string]string{"error": "not found"})
	}
	return c.JSON(http.StatusOK, store)
}

// POST /api/store
// expects: { "id": "tseat2", "data": { ... } }
func postStore(c echo.Context) error {
	var req struct {
		ID   string                 `json:"id"`
		Data map[string]interface{} `json:"data"`
	}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
	}
	if req.ID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "missing id"})
	}
	storeMutex.Lock()
	if store == nil {
		store = make(map[string]map[string]interface{})
	}
	if store[req.ID] == nil {
		store[req.ID] = map[string]interface{}{"d": map[string]interface{}{}}
	}
	d, ok := store[req.ID]["d"].(map[string]interface{})
	if !ok {
		d = map[string]interface{}{}
		store[req.ID]["d"] = d
	}
	for k, v := range req.Data {
		d[k] = v
	}
	storeMutex.Unlock()
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}

func mapContainsValue(m map[string]interface{}, query string) bool {
	query = strings.ToLower(query)
	for _, v := range m {
		s := strings.ToLower(fmt.Sprintf("%v", v))
		if strings.Contains(s, query) {
			return true
		}
	}
	return false
}

func periodicFlush() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()
	for range ticker.C {
		if err := saveStore(); err != nil {
			log.Printf("Error saving store: %v", err)
		}
	}
}

func saveStore() error {
	fmt.Println("saveStore")
	storeMutex.RLock()
	defer storeMutex.RUnlock()
	f, err := os.Create(dbStore)
	if err != nil {
		return err
	}
	defer f.Close()
	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	return enc.Encode(store)
}

func loadGuests() error {
	f, err := os.Open(dbGuests)
	if err != nil {
		if os.IsNotExist(err) {
			guests = []map[string]interface{}{}
			return nil
		}
		return err
	}
	defer f.Close()
	bytes, err := io.ReadAll(f)
	if err != nil {
		return err
	}
	var loaded []map[string]interface{}
	if err := json.Unmarshal(bytes, &loaded); err != nil {
		return err
	}
	guests = loaded
	return nil
}

func loadStore() error {
	f, err := os.Open(dbStore)
	if err != nil {
		if os.IsNotExist(err) {
			store = make(map[string]map[string]interface{})
			return nil
		}
		return err
	}
	defer f.Close()
	bytes, err := io.ReadAll(f)
	if err != nil {
		return err
	}
	var loaded map[string]map[string]interface{}
	if err := json.Unmarshal(bytes, &loaded); err != nil {
		return err
	}
	store = loaded
	return nil
}

