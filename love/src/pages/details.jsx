import BGImage from "../components/bg-image";
import large from "../assets/18.jpeg";
import small from "../assets/18s.jpeg";

const Details = () => (
    <BGImage
        small_src={small}
        large_src={large}
        alt="booking california background"
    >
        <section className="backsplash justify-center items-center">
            <h2 className="w-full text-center">Wedding Day Details</h2>
            <aside className="rounded-lg pl-8 pr-8 pt-2 pb-4 bg-[var(--brown-half)] flex space-x-8 flex-col sm:flex-row md:flex-wrap gap-4">
                <fieldset>
                    <h3 className="mt-4">La Venta Inn</h3>
                    <p className="">
                        796 Vía Del Monte
                        <br />
                        Palos Verdes Estates
                        <br />
                        CA 90274
                    </p>
                </fieldset>
                <fieldset className="mt-4">
                    <h4 className="w-full">August 28, 2025</h4>
                    <ul className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                        <li className="contents">
                            <span>5:00PM</span>
                            <span>Guests arrive</span>
                        </li>
                        <li className="contents">
                            <span>5:30PM</span>
                            <span>Ceremony begins</span>
                        </li>
                        <li className="contents">
                            <span>6:00PM</span>
                            <span>Cocktail hour</span>
                        </li>
                        <li className="contents">
                            <span>7:00PM</span>
                            <span>Reception</span>
                        </li>
                        <li className="contents">
                            <span>7:15PM</span>
                            <span>Dinner served</span>
                        </li>
                        <li className="contents">
                            <span>10:00PM</span>
                            <span>Guests exit</span>
                        </li>
                    </ul>
                </fieldset>
            </aside>
            <aside className="w-full flex" />
        </section>
    </BGImage>
);

export default Details;
