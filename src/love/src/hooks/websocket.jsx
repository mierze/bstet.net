import { useRef, useEffect } from "react";

const useWebsocket = (ip, setMessages) => {

    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(`ws://${ip}:3000`);

        ws.current.onopen = () => {
            console.log("Connected to WebSocket server");
            ws.current?.send("Hello from client");
        };

        ws.current.onmessage = (event) => {
            console.log("Received:", event.data);
            setMessages((prev) => [...prev, event.data]);
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.current.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            ws.current?.close();
        };
    }, []);

}

export default useWebsocket;
