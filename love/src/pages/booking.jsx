import React, { useEffect, useState } from "react";
import BGImage from "../components/bg-image";
import large from "../assets/12.jpeg";
import small from "../assets/12s.jpeg";

const DINNER_OPTIONS = [
    { value: "pasta", label: "Pasta w/ marinara" },
    { value: "burger", label: "Veggie Burger" },
    { value: "salad", label: "Chef Salad" }
];

const Booking = ({ data, guest }) => {
    const [dinner, setDinner] = useState("");
    const [going, setGoing] = useState([]);
    const [notGoing, setNotGoing] = useState([]);
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (data?.d?.dinner) setDinner(data.d.dinner);

        if (data?.d?.going || data?.d?.not_going) {
            setGoing(data.d.going || []);
            setNotGoing(data.d.not_going || []);
        } else if (guest?.guests) {
            setGoing([...guest.guests, guest.name]);
            setNotGoing([]);
        }
    }, [data, guest]);

    const handleDinnerChange = (e) => setDinner(e.target.value);

    const moveToNotGoing = (name) => {
        setGoing(going.filter(g => g !== name));
        setNotGoing([...notGoing, name]);
    };

    const moveToGoing = (name) => {
        setNotGoing(notGoing.filter(g => g !== name));
        setGoing([...going, name]);
    };

    const handleBook = async () => {
        setStatus("Submitting...");
        try {
            const res = await fetch("/api/store", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: guest?.id,
                    data: { dinner, going, not_going: notGoing }
                })
            });
            const result = await res.json();
            if (res.ok && result.status === "ok") {
                setStatus("Booking successful!");
            } else {
                setStatus("Booking failed: " + (result.error || "Unknown error"));
            }
        } catch (err) {
            setStatus("Network error: " + err.message);
        }
    };

    return (
        <BGImage small_src={small} large_src={large} alt="booking california background">
            <section className="backsplash">
                <h2 className="mb-4">Book Your Journey</h2>

                <div className="p-4 bg-[var(--brown-half)] rounded-lg grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                    <fieldset className="p-0">
                        <h3 className="mb-4">Dinner options</h3>
                        <caption className="flex w-full text-xs">Not yet set, please check back soon as we are finalizing that now!</caption>
                        {false && <div className="mb-4">
                            {DINNER_OPTIONS.map(opt => (
                                <label key={opt.value} className="block mb-2">
                                    <input
                                        type="radio"
                                        name="dinner"
                                        value={opt.value}
                                        checked={dinner === opt.value}
                                        onChange={handleDinnerChange}
                                        className="mr-2"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>}
                    </fieldset>

                    <fieldset className="p-0">
                        <legend className="font-bold text-lg sr-only">Attendance</legend>
                        <div>
                            <h3 className="mt-10 mb-4 flex">Going</h3>
                            <ul>
                                {going.map(g => (
                                    <li
                                        key={g}
                                        className="cursor-pointer hover:underline"
                                        onClick={() => moveToNotGoing(g)}
                                    >
                                        {g}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="mt-10 mb-4 flex">Not going</h3>
                            <ul>
                                {notGoing.map(g => (
                                    <li
                                        key={g}
                                        className="cursor-pointer hover:underline"
                                        onClick={() => moveToGoing(g)}
                                    >
                                        {g}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </fieldset>
                </div>
                {
                    status &&
                    <div className="mt-4">
                        {status}
                    </div>
                }
            </section>
        </BGImage>
    );
}

// TODO:sniff_it ++ make it like emojis but not emojis checking out with there options labeled clearly with color maybe or jomez style
// <p className="mb-4 text-xl">
//     You can continue to make changes until <strong>July 20th 2025</strong>
// </p >
// <fieldset className="w-full">
//                     <button
//                         className="px-6 py-3 bg-[var(--soft-pink-full)] hover:bg-[var(--lavender-purple-full)] rounded"
//                         onClick={handleBook}
//                         disabled={!dinner || !guest?.id}
//                     >
//                         Save
//                     </button>
//                 </fieldset>

export default Booking;

