"use client";

import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import { lazy, useState, useEffect } from "react";
import BGImage from "./components/bg-image";
const Ticketing = lazy(() => import("./pages/ticketing"));
const Splash = lazy(() => import("./pages/splash"));
const Booking = lazy(() => import("./pages/booking"));
const Faq = lazy(() => import("./pages/faq"));
const GuestBook = lazy(() => import("./pages/guestbook"));
const Details = lazy(() => import("./pages/details"));
const LookAhead = lazy(() => import("./pages/look-ahead"));
import "./app.css";

// ------- app_setup ------- //
enum View {
    Splash,
    Ticketing,
    Details,
    LookAhead,
    Faq,
    Booking,
    GuestBook,
    _num_views,
}

// -------- react_app_entry ---------- //
const App = () => {
    const [view, setView] = useState<View>(View.Splash);



    const [data, setData] = useState([]);

    const [guest, setGuest] = useState(null);
    const [storeData, setStoreData] = useState(null);


    useEffect(() => {
        // console.log("storeData", storeData);
    }, [storeData]);
    useEffect(() => {
        // console.log("guestChanged", guest);
    }, [guest]);

    // On mount, get guest from localStorage and fetch their store data
    useEffect(() => {
        const saved = localStorage.getItem("guest");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setGuest(parsed);
                if (parsed.id) {
                    fetch(`/api/store?id=${parsed.id}`)
                        .then(res => res.json())
                        .then(setStoreData)
                        .catch(err => {
                            setStoreData(null);
                            // console.error("Error fetching store data:", err);
                        });
                }
            } catch (e) {
                setGuest(null);
                setStoreData(null);
            }
        }
    }, []);

    const handlers = useSwipeable({
        onSwipedLeft: () => nextView(),
        onSwipedRight: () => prevView(),
        trackMouse: false // TODOPANDA // allows swipe with mouse for testing
    });

    // -------- functions ------------ //
    function goHome() {
        setView(View.Splash);
    }

    function goto(v) {
        // console.log("v", v, "view", view);
        if (view < v && v - view > 1) {
            // alert("only can go forward one at this time!");
            // return;
        }
        if (v < 0 || v >= View._num_views) {
            alert("Not gonna fly son!");
            return;
        }
        setView(v);
    }


    function prevView() {
        if (view - 1 < 0) {
            // alert("Sorry compadre, you can't go back any further, you are already in the 1960s");
            return;
        }
        setView(view - 1);
    }

    function nextView() {
        if (view + 1 >= View._num_views) {
            // alert("Sorry compadre, you can't go any further, it's now or never");
            return;
        }
        setView(view + 1);
    }

    // ------ inner components ------ //
    const Lost = () => (
        <p className="relative z-20 text-white p-8">
            I believe you may be lost friend <a href="/" className="underline">back</a>
        </p>
    );

    const Footer = () => {
        const [hoverIndex, setHoverIndex] = useState<number | null>(null);

        return (
            <footer className="max-w-4xl fixed bottom-0 mx-auto left-0 right-0 h-auto flex items-center space-x-4 px-8 z-30 mt-auto flex flex-col items-center space-y-3 p-4 sm:px-8">
                <div className="flex justify-center items-center w-full max-w-md space-x-3">
                    {Array.from({ length: View._num_views }).map((_, i) => {
                        const isActive = i === view;
                        const isHovered = i === hoverIndex;

                        let bgClass = "";

                        if (isHovered) {
                            bgClass = "bg-[var(--green-full)] shadow-lg";
                        } else if (isActive) {
                            bgClass =
                                hoverIndex !== null
                                    ? "bg-[var(--green-full)]/70"
                                    : "bg-[var(--green-full)] shadow-lg";
                        } else if (i < view) {
                            bgClass = "bg-[var(--blue-full)]/70 hover:bg-[var(--blue-full)]/90";
                        } else {
                            bgClass = "bg-[var(--blonde-full)]/20 hover:bg-[var(--blonde-full)]/30";
                        }

                        return (
                            <div
                                key={i}
                                onClick={() => goto(i)}
                                onMouseEnter={() => setHoverIndex(i)}
                                onMouseLeave={() => setHoverIndex(null)}
                                className={`
        flex-1 h-6 rounded-full cursor-pointer transition-all duration-300 border border-[var(--blonde-half)]
        ${bgClass}
      `}
                            />
                        );
                    })}

                </div>
            </footer>
        );
    }

    const Fiiooter = () => (
        <footer className="max-w-4xl fixed bottom-0 mx-auto left-0 right-0 h-auto flex items-center space-x-4 px-8 z-30 mt-auto flex flex-col items-center space-y-3 p-4 sm:px-8">
            <div className="flex justify-center items-center w-full max-w-md space-x-3">
                {Array.from({ length: View._num_views }).map((_, i) => (
                    <div
                        onClick={() => goto(i)}
                        key={i}
                        className={`
                        flex-1 h-6 rounded-full cursor-pointer transition-all duration-300 border border-[var(--blonde-half)]
                        ${i < view
                                ? "bg-[var(--blue-full)]/70"
                                : i === view
                                    ? "bg-[var(--green-full)]/90 shadow-lg"
                                    : "bg-[var(--blonde-full)]/20 hover:bg-[var(--blonde-full)]/30"
                            }
                    `}
                    />
                ))}
            </div>
        </footer>
    );

    const CurrentView = () => {
        switch (view) {
            case View.Splash:
                return <Splash data={storeData} guest={guest} />;
            case View.Ticketing:
                return <Ticketing setGuest={setGuest} />;
            case View.Details:
                return <Details />;
            case View.LookAhead:
                return <LookAhead />;
            case View.Faq:
                return <Faq />;
            case View.Booking:
                return <Booking data={storeData} guest={guest} />;
            case View.GuestBook:
                return <GuestBook data={storeData} guest={guest} />;
            default:
                return <Lost />;
        }
    }

    return (
        <main {...handlers} className="relative min-h-screen flex flex-col">
            < CurrentView />
            <Footer />
        </main >
    );
}

export default App;

