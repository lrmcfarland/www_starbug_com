import React from "react";

import "../App.css";
import eskimo_roll from "../assets/images/Kayaking/eskimo_roll.mp4"

export const Kayaking: React.FC = () => {
  return (
    <div className="starbug-div">
      <h1>Kayaking</h1>
      <div className="starbug-card">
        <h2>Eskimo Roll</h2>
        <video
          src={eskimo_roll}
          controls
          playsInline
          width="100%"
          >
            Your browser does not support this video tag.
        </video>
        <p>
          1994-ish. Needs work on keeping my head down.
          And an update from this millennium.
        </p>
      </div>
    </div>
  );
};

export default Kayaking;
