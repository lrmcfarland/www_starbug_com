import React from "react";
import "../App.css";
import { images } from "../assets/images/Astronomy/Observatories";

const pictures = [
  {
    id: 1,
    title: "Arecibo",
    location: "Arecibo, Puerto Rico.",
    date: "2001 February",
    description: "Observing for the SETI Institute.",
    details: [
        `"We are made of star-stuff." Carl Sagan`,
        `"... or nuclear waste, depending on your point of view." Peter Backus`
    ],
    image: images.arecibo_2002,
  },
  {
    id: 2,
    title: "On the prime meridian",
    location: "Greenwich Observatory. Greenwich England.",
    date: "2002 November",
    description: "Observing for the SETI Institute.",
    details: [
        `Verifying with my GPS they have moved the meridian.`,
    ],
    image: images.prime_meridian,
  },
  {
    id: 3,
    title: "Jodrell Bank with moon",
    location: "Jodrell Bank, Cheshire England.",
    date: "2002 November",
    description: "Observing for the SETI Institute.",
    details: [
        `"It's not that kind of bank." - Mark Roberts`,
    ],
    image: images.jodrell_bank_moon,
  },
  {
    id: 4,
    title: "Jodrell Bank",
    location: "Jodrell Bank, Cheshire England.",
    date: "2003 April",
    description: "Observing for the SETI Institute.",
    details: [
        `Explaining how to use my old digital camera.`,
    ],
    image: images.jodrell_bank_and_me,
  },
  {
    id: 5,
    title: "Jodrell Bank",
    location: "Jodrell Bank, Cheshire England.",
    date: "2003 April",
    description: "Observing for the SETI Institute on the 45th Anniversary of Jodrell Bank.",
    details: [],
    image: images.pow,
  },
];

export const Observatories: React.FC = () => {
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
      <h1>Observatories</h1>
      {pictureList}
    </div>
  );
};

export default Observatories;
