import BGImage from "../components/bg-image";
import large from "../assets/16.jpeg";
import small from "../assets/16s.jpeg";

const LookAhead = () => (
    <BGImage
        small_src={small}
        large_src={large}
        alt="booking california background"
    >
        <section className="backsplash">
            <h2 className="ml-4 mb-8">A look at the week</h2>
            <aside className="p-4 bg-[var(--brown-half)] rounded-lg flex flex-col gap-4 md:flex-wrap">
                <fieldset className="w-1/2 space-y-3">
                    <h3 className="font-semibold">Tuesday - August 26 - 5pm</h3>
                    <ul className="space-y-2">
                        <li>
                            <p className="mb-2">Dockweiler State Beach</p>
                            <p>12000 Vista Del Mar, Playa Del Rey, CA 90293</p>
                            <span>Join us by the campfire, be sure to dress toasty as it can get chilly even in the summer here!</span>
                        </li>
                    </ul>
                </fieldset>

                <fieldset className="w-1/2 space-y-3">
                    <h3 className="font-semibold">Wednesday - August 25 - 3:30pm</h3>
                    <p>Rehearsal at La Venta.</p>
                    <p>NOTE: Not all are required leave a note at the end of checkin if you must ask.</p>
                </fieldset>

                <fieldset className="w-1/2 space-y-3">
                    <ul>
                        <li>
                            <h3 className="font-semibold mb-2">Thursday - August 28 - 5pm</h3>
                        </li>
                    </ul>
                </fieldset>

                <fieldset className="md:w-1/2 space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold">Friday - August 29 - </h3>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold">Saturday - August 30 - 2pm</h3>
                        <p>Hollywood tour</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold">Sunday - August 31 - </h3>
                    </div>
                </fieldset>
            </aside>
        </section>
    </BGImage>
);

export default LookAhead;

