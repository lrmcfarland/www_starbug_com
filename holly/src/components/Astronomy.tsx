import React from "react";
import "../App.css";
import { images } from "../assets/images/Astronomy/MLC404";


const pictures = [
  {
    id: 1,
    title: "404 MLC",
    location: "Mountain View, California.",
    date: "2018 March 10",
    description: "My home setup.",
    details: [
        `Estimating from Google earth the antenna is about 500 meters away.`,
    ],
    image: images.mlc404_00,
  },
  {
    id: 2,
    title: "Antenna at 500 m",
    location: "Mountain View, California.",
    date: "2018 March 10",
    description: "Antenna using the telescope at 500m",
    details: [],
    image: images.mv_police_antenna,
  },
  {
    id: 3,
    title: "Black Mountain",
    location: "Mountain View, California.",
    date: "2018 March 10",
    description: "I think this is the mountain view.",
    details: [
        `Estimating from Google earth the antenna is about 10 kilometers away.`,
    ],
    image: images.black_mountain_01,
  },
  {
    id: 4,
    title: "Antenna at 10 km",
    location: "Mountain View, California.",
    date: "2018 March 10",
    description: "The antennas on Black Mountain.",
    details: [],
    image: images.black_mountain_03,
  },
  {
    id: 5,
    title: "Saturn",
    location: "Mountain View, California.",
    date: "2018 July 08",
    description: "",
    details: [],
    image: images.saturn_20180708,
  },
];

export const Astronomy: React.FC = () => {

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
    <h1>Astronomy</h1>
    <div className="starbug-card">
        <p>
            This is my home observatory with
            a Celestron	8se telescope (Aperture 200 mm, Focal length 2032 mm) and a
            Skyris 132C camera.	I use oaCapture on a MacBook Pro to get the images.
        </p>
    </div>
    {pictureList}
    </div>
);
};

export default Astronomy;