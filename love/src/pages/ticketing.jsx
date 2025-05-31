import BGImage from "../components/bg-image";
import large from "../assets/24.jpeg";
import small from "../assets/24s.jpeg";
import largeMobile from "../assets/22.jpeg";
import smallMobile from "../assets/22s.jpeg";
import DataForm from "../components/data-form";
// import Drawer from "../components/drawer";
import { useState, useEffect } from "react";

const useIsPortrait = () => {
    const [isPortrait, setIsPortrait] = useState(
        typeof window !== "undefined"
            ? window.matchMedia("(orientation: portrait)").matches
            : true
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(orientation: portrait)");

        const handler = (e) => setIsPortrait(e.matches);

        mediaQuery.addEventListener
            ? mediaQuery.addEventListener("change", handler)
            : mediaQuery.addListener(handler);

        return () => {
            mediaQuery.removeEventListener
                ? mediaQuery.removeEventListener("change", handler)
                : mediaQuery.removeListener(handler);
        };
    }, []);

    return isPortrait;
}

const Ticketing = ({ setGuest }) => {
    const [name, setName] = useState("");
    const [zip, setZip] = useState("");
    const [id, setId] = useState("");
    const [matches, setMatches] = useState(null);

    const isPortrait = useIsPortrait();

    function onSuccess() {
        console.log("onSuccess");
    }

    function signIn(e) {
        if (!name.length || !zip.length) {
            alert("Please enter both name and zip code!");
            return;
        }
        e.preventDefault();
        fetch(`/api/guests?name=${name}&zip=${zip}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then((res) => res.json())
            .then((res) => {
                console.log("res is", res);
                if (res)
                    setMatches(res);
                else setMatches([]);
            })
            .catch((err) => { setMatches([]); alert("Network error: " + err) });
    }

    function handleKeyPress(e) {
        if (e.key === "Enter") {
            signIn(e);
        }
    }

    function confirmGuest(guest) {
        console.log("confirmGuest", guest);
        setGuest(guest);
        alert(`You are checking in for ${guest.name} & ${guest.guests.join(", ")}`);
        localStorage.setItem("guest", JSON.stringify(guest));
        setId(guest.id);
    }

    const small_src = isPortrait ? smallMobile : small;
    const large_src = isPortrait ? largeMobile : large;

    return (
        <BGImage
            small_src={small_src}
            large_src={large_src}
            alt="booking california background"
        >
            <section className="backsplash">
                <div className={`flex flex-col items-end w-full max-w-md mx-auto transition-all duration-700 ease-in-out ${matches !== null ? 'justify-start pt-8' : 'justify-center'
                    }`}>
                    <h2 className="text-center mb-8">Welcome!</h2>

                    <fieldset className="p-4 bg-[var(--brown-half)] rounded-lg space-y-6 mb-8 w-full">
                        <h3 className="text-[var(--brown-full)] p-2">Pass me your name and zip code to begin your journey!</h3>
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                            <input
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="LAST NAME"
                                className="flex-1 border-1"
                            />
                            <input
                                type="number"
                                onChange={(e) => setZip(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="ZIP CODE"
                                className="flex-1 border-1"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button onClick={signIn} className="border-1">
                                RETRIEVE RESERVATION
                            </button>
                        </div>
                    </fieldset>
                </div>

                {/* Results container with slide-up animation */}
                <div className={`fixed bottom-20 left-0 right-0 transition-all duration-700 ease-in-out ${matches !== null
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-full opacity-0'
                    }`}>
                    <aside className="p-6 pt-12 max-h-96 overflow-y-auto">
                        <div className="max-w-md mx-auto space-y-4">
                            {matches && matches.length > 0 ? (
                                <ul className="space-y-3">
                                    {matches.map((el, index) => (
                                        <li
                                            key={index}
                                            onClick={() => confirmGuest(el)}
                                            className="cursor-pointer hover:opacity-80 p-4 bg-white/20 rounded-lg border border-white/30 transform transition-all duration-300 hover:scale-105"
                                        >
                                            <div className="font-semibold">{el.name}</div>
                                            {el.guests && <div className="text-sm opacity-80">+ {el.guests.join(", ")}</div>}
                                        </li>
                                    ))}
                                </ul>
                            ) : matches !== null && (
                                <p className="text-center p-4 bg-white/10 rounded-lg">
                                    No results matched!
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </section>
        </BGImage>
    );
}

export default Ticketing;

