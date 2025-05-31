import BGImage from "../components/bg-image";
import large from "../assets/xa.jpeg";
import small from "../assets/xas.jpeg";

const GuestBook = ({ guest, data }) => (
    <BGImage
        small_src={small}
        large_src={large}
        alt="booking california background"
    >
        <section className="backsplash">
            <h2 className="">Congratulations you made it to the end!</h2>
            <h3 className="w-full text-right">Can't wait to celebrate with you!</h3>
            <aside className="p-4 bg-[var(--brown-half)] rounded-lg">
                <p>Your checkin options are all saved. You can continue to make edits until July 20th 2025</p>
                <h3 className="">Summary</h3>
                <ul className="decoration-0 list-disc list-inside text-xl max-h-96 overflow-y-auto">
                    <li>rsvp</li>
                    <li>{guest?.name}</li>
                    <li>{data?.dinner}</li>
                </ul>
            </aside>
        </section>
    </BGImage>
);

export default GuestBook;
