import BGImage from "../components/bg-image";
import large from "../assets/11.jpeg";
import small from "../assets/11s.jpeg";

const Splash = ({ guest, data }) => (
    <BGImage
        small_src={small}
        large_src={large}
        alt="booking california background"
    >
        <section className="backsplash">
            <h1 className="text-right w-full block">Brett & Kaitlyn</h1>
            <h2 className="text-right w-full m-0">California Dreaming</h2>
            <h3 className="text-right w-full">August 28, 2025</h3>
        </section>
    </BGImage>
);

export default Splash;
