import React from "react";
import "../App.css";
import { images } from "../assets/images/Kayaking";


const pictures = [
  {
    id: 1,
    title: "Ender",
    location: "Tuolumne River, California.",
    date: "1993 May 20",
    description: "First enders.",
    details: [],
    image: images.ender,
  },
  {
    id: 2,
    title: "Rainbow Falls",
    location: "San Joaquin River, California.",
    date: "1993 May 20",
    description: "Objects in image are older and wiser than they appear.",
    details: [],
    image: images.waterfall,
  },
  {
    id: 3,
    title: "Grand Canyon 1",
    location: "Colorado River, Arizona.",
    date: "1993 September",
    description: "Grand Canyon trip with the Stanford Kayak Club.",
    details: ['Go Bears!'],
    image: images.grand_canyon_1,
  },
  {
    id: 4,
    title: "Grand Canyon 2",
    location: "Colorado River, Arizona.",
    date: "1993 September",
    description: "Grand Canyon trip with the Stanford Kayak Club.",
    details: [],
    image: images.grand_canyon_2,
  },
];

export const Kayaking: React.FC = () => {

 const pictureList = pictures.map((picture) => {
    return (
      <div key={picture.id} className="starbug-card" >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "2rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <h1>{picture.title}</h1>
            <h2>{picture.location} {picture.date}</h2>
            <img
              src={picture.image}
              alt="Sorry, the picture is missing atm."
              loading="lazy"
              style={{
                width: "100%",
                height: "auto"
              }}
            />
            <p>{picture.description}</p>
            <ul>
                {picture.details.map((detail, id) => (
                    <li key={id}>{detail}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="starbug-div">
      <h1>Kayaking</h1>
      <div className="starbug-card">
        <h1>Eskimo Roll</h1>
        <video
          src={images.eskimo_roll}
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
      {pictureList}
    </div>
  );
};

export default Kayaking;
