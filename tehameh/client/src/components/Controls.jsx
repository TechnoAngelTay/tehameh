import React from "react";

const ControlsBar = () => {
    const controls = [
        { key: "Mouse Drag", action: "Rotate View" },
        { key: "Scroll", action: "Zoom Nav" },
        { key: "[⌃]Scroll", action: "Pos Nav" },
        { key: "WASD", action: "Per Nav" },
        { key: "ARROW", action: "Rel Nav" },
        { key: "R", action: "Orientation_0" },
        { key: "[⇧]R", action: "Focus_0" },
        { key: "[⇧][⌥]R", action: "Position_0" },
    ];

    return (
        <div
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                padding: "8px 12px",
                display: "flex",
                justifyContent: "space-around",
                fontFamily: "monospace",
                fontSize: "14px",
            }}
        >
            {controls.map((c, i) => (
                <div><span key={i}>
                    <b>{c.key}</b>: {c.action}
                </span></div>
            ))}
        </div>
    );
};

export default ControlsBar;