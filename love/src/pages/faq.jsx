import { useState, useEffect } from "react";
import BGImage from "../components/bg-image";
import large from "../assets/9.jpeg";
import small from "../assets/9s.jpeg";

const Faq = () => {
    return (
        <BGImage
            small_src={small}
            large_src={large}
            alt="booking california background"
        >
            <section className="backsplash">
                <h2 className="mb-4 w-full text-right">FAQ</h2>
                <aside className="p-4 bg-[var(--brown-half)] rounded-lg flex flex-col md:flex-wrap gap-4 max-h-[calc(100vh-12rem)] overflow-y-auto">

                    <fieldset>
                        <h3 className="mb-2">What to prepare for?</h3>
                        <ul className="list-disc list-inside mb-4 text-xl">
                            <li>Classy not Hippy 1960s</li>
                            <li>Old Hollywood, Lana del Rey, Cali Vibes</li>
                            <li>No children at wedding or reception</li>
                        </ul>
                    </fieldset>
                    <fieldset>
                        <h3 className="mb-2">Gifts:</h3>
                        <p className="mb-4 text-xl">
                            *Unfortunately due to space in our apartment and the fact that we are look
                        </p>
                        <p>We accept Cash, Check, Zelle, PayPal and Venmo, more info to come here.</p>
                        <p>A small registry may be curated, do check back!</p>
                    </fieldset>
                    <fieldset className="flex-1/2">
                        <h3 className="mb-2">Where to Stay?</h3>
                        <p className="w-auto">
                            Most of you may be flying into LAX, which falls about 12 miles, but will generally play much further with traffic.
                        </p>
                        <h3 className="mb-2">Suggestions</h3>
                        <ul className="decoration-0 list-disc list-inside text-xl">
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
                        <p>Tip, you'll likely want to stay closer to the area to best join us on our events throughout the week!</p>
                    </fieldset>
                    <fieldset className="flex-1/2">
                        <h3 className="">Weather</h3>
                        <p className="text-xl">It's always sunny</p>
                        <p className="text-xl">Be prepared for sunny with highs in the 80s and lows in the feels like 40s</p>
                        <p className="text-xl">Dry air is built different!</p>
                    </fieldset>
                </aside>
            </section>
        </BGImage>
    );
}

export default Faq;
