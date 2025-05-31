import React, { useState, useEffect } from "react";

const BGImage = ({
    small_src,
    large_src,
    classes = "",
    alt = "",
    children,
}) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative w-full h-full overflow-hidden ${classes}`}>
            {/* Blurred low-res image */}
            <img
                src={small_src}
                alt={alt}
                className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-105"
                aria-hidden="true"
                decoding="async"
                draggable={false}
            />

            <img
                src={large_src}
                alt={alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${loaded ? "opacity-100" : "opacity-0"
                    }`}
                onLoad={() => setLoaded(true)}
                loading="lazy"
                decoding="async"
                draggable={false}
            />

            <div className="relative z-10">{children}</div>
        </div>
    );
}
export default BGImage;
