import React from "react";
import "./ParallaxSection.css";

function ParallaxSection({ backgroundImage, title, scrollLabel = "Scroll to explore" }) {
    return (
        <section
            className="parallax"
            style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        >
            <div className="lost-found-dup">
                <div className="frame-main">
                    <span className="lost-found-orig">{title}</span>
                    <span className="lost-found-lit" aria-hidden="true">
                        {title}
                    </span>
                </div>
            </div>
            <div className="scroll-to-explore">{scrollLabel}</div>
        </section>
    );
}

export default ParallaxSection;
