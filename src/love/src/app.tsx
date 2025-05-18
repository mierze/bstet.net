"use client";

import "./app.css";
import { useRef, useState } from "react";
import useWebsocket from "./hooks/websocket";
import bgImage from "./assets/9.jpeg";

enum View {
    Splash,
    Ticketing,
    EventDetails,
    WeeksGlance,
    Faq,
    Booking,
    GuestBook,
    _num_views
};

const App = () => {

    const [messages, setMessages] = useState<string[]>([]);
    const [view, setView] = useState<View>(View.Splash);

    useWebsocket("127.0.0.1", setMessages);

    function goHome() {
        setView(0);
    }

    function prevView() {
        if (view - 1 < 0) {
            return alert("sorry compadre, you can't go back any further, you are already inthe 1960s");
        }
        setView(view - 1);
    }

    function nextView() {
        if (view + 1 >= View._num_views) {
            return alert("sorry compadre, you can't go any further, it's now or never");
        }
        setView(view + 1);
    }


    ////////////////////// 
    //  ***         *** //
    //      views       //
    //  ***         *** //
    ////////////////////// 
    const Splash = () => {
        return (
            <section className="bg-[url('./assets/12.jpeg')] splash">
                <div className="flex items-center flex-wrap absolute inset-0 bg-amber-950/34">
                    <h1 className="text-left pt-20 pl-40 w-full">Califonia Dreaming</h1>
                    <h2 className="text-right w-full block">Brett & Kaitlyn</h2>
                    <h3 className="text-right w-full">August 28, 2025</h3>
                </div>
            </section>
        );
    }

    const Ticketing = () => {
        return (
            <section className="bg-[url('./assets/15.JPG')] ticketing">
                <div className="flex items-center absolute inset-0 bg-amber-950/34">
                    <h2>Welcome!</h2>
                    <fieldset>What is your ticket <strong>#</strong>?
                    </fieldset>
                </div>
            </section>
        );
    }

    const EventDetails = () => {
        return (
            <section className="bg-[url('./assets/9.jpeg')] event-details">
                <div className="flex items-center absolute inset-0 bg-amber-950/34">
                    <h2>Event Details</h2>
                    <h3>August 28, 2025</h3>
                    <h4>5:30pm PT</h4>
                    <h3>La Venta Inn</h3>
                    <h4>Address</h4>
                    <p>
                        796 Vía Del Monte
                        Palos Verdes Estates
                        CA 90274
                    </p>
                </div>
            </section>
        );
    }

    const WeeksGlance = () => {
        return (
            <section className="bg-[url('./assets/16.jpeg')] week-view">
                <div className="flex items-center absolute inset-0 bg-amber-950/34">
                    <h2>A Look at the Week</h2>
                    <h3>Wednesday</h3>
                    <label>630pm:</label>
                    <p>DOCKWEILER</p>
                    <h3>Thursday</h3>
                    <label>630pm</label>
                    <p>Rehearsal Dinner at La Venta</p>
                    <h2>Weather</h2>
                    <p>It's always sunny</p>
                    <p>Be prepared for highs in the 80s and lows in the feels like 40s</p>
                    <p>Dry air is built different!</p>
                </div>
            </section>
        );
    }

    const Faq = () => {
        return (
            <section className="bg-[url('./assets/21.jpeg')] faq">
                <div className="flex items-center absolute inset-0 bg-amber-950/34">
                    <h2>FAQ</h2>
                    <h3>What to prepare for?</h3>
                    <ul>
                        <li>Classy not Hippy 1960s</li>
                        <li>Old Hollywood, Lana del Rey, Cali Vibes</li>
                        <li>No children at wedding or reception</li>
                    </ul>
                    <h3>Gifts:</h3>
                    <p>*Unfortunately due to space in our apartment and the fact that we are look</p>
                    <h3>Where to Stay?</h3>
                    <p>This falls about 12 miles from LAX, that may seem very close but with traffic it is going to be between 30 minute and an hour away</p>
                    <h3>Suggestions</h3>
                    <ul>
                        <li><strong>CLOSEST</strong></li>
                        <li>Ranchos Palos Verdes (5m)</li>
                        <li>Redondo Beach (10m)</li>
                        <li>Hermosa (20m)</li>
                        <li><strong>CHEAPER SIDE</strong></li>
                        <li>Torrance (20m)</li>
                        <li>San Pedro (20m)</li>
                        <li>El Segundo (30m)</li>
                        <li>Long Beach (35m)</li>
                    </ul>
                </div>
            </section>
        );
    }

    const Booking = () => {
        return (
            <section className="bg-[url('./assets/21.jpeg')] booking">
                <div className="flex items-center absolute inset-0 bg-amber-950/34">
                    <h2>Book Your Journey</h2>
                    <p>You can always return until <strong>7/11/2025</strong></p>
                    <h2>Dinner options</h2>
                    <h2>Plus ones</h2>
                    <button>Book</button>
                </div>
            </section>
        );
    }

    const GuestBook = () => {
        return (
            <section className="bg-[url('./assets/18.jpeg')] guest-book">
                <div className="flex items-center absolute inset-0 bg-amber-950/34">
                    <h2>Guestbook</h2>
                    <h3>messages:</h3>
                    <ul>
                        {
                            messages.map((msg, i) => (
                                <li key={i}>{msg}</li>
                            ))
                        }
                    </ul>
                </div>
            </section>
        );
    }

    const Lost = () => {
        return <p>I believe you may be lost friend <a href="/">back</a></p>;
    }

    const Footer = () => {
        return (
            <footer className="w-full justify-items-center flex h-20 bg-gray-200 items-center">
                <span className="flex-start p-4">m1erze_m💜de</span>
                <button className="flex-end flex p-4" onClick={goHome}>home</button>
                <button className="flex p-4" disabled={view < 1} onClick={prevView}>prev</button>
                <button className="flex p-4" disabled={view >= View._num_views - 1} onClick={nextView}>next</button>
            </footer >
        );
    }

    const CurrentView = () => {
        switch (view) {
            case View.Splash: return Splash();
            case View.Ticketing: return Ticketing();
            case View.EventDetails: return EventDetails();
            case View.Faq: return Faq();
            case View.WeeksGlance: return WeeksGlance();
            case View.Booking: return Booking();
            case View.GuestBook: return GuestBook();
            default: return Lost();
        }
    }
    ////////////////////////// 
    //  ***  end_views  *** //
    ////////////////////////// 


    return (
        <main>
            <CurrentView />
            <Footer />
        </main>
    );

}

export default App;
