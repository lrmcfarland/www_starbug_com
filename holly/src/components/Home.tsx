import React from "react";
import athens_2025 from "../assets/images/Athens_2025.jpeg";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import "../App.css";

const linkButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 16px",
  textDecoration: "none",
  color: "#d4d7e4",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
};

function SocialLinks() {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <a
        href="https://www.facebook.com/lincoln.mcfarland"
        target="_blank"
        rel="noopener noreferrer"
        style={linkButtonStyle}
      >
        <FaFacebook color="#1877F2" size={20} />
        <span>Facebook</span>
      </a>
      <br />
      <a
        href="https://www.linkedin.com/in/lrmcfarland/"
        target="_blank"
        rel="noopener noreferrer"
        style={linkButtonStyle}
      >
        <FaLinkedin color="#0A66C2" size={20} />
        <span>LinkedIn</span>
      </a>
    </div>
  );
}

export const Home: React.FC = () => {
  return (
    <div className="starbug-div">
      <h1>Welcome</h1>
      <p>
        This is the home page of Lincoln Randall McFarland
        (a.k.a. Randy), online since 1995, back when domain
        names were free and spam was meat in a can. It has no
        purpose other than to display my résumé and support my
        projects.
      </p>
      <img
        src={athens_2025}
        alt="Athens 2025"
        style={{
          width: "100%",
          marginTop: "1rem",
          borderRadius: "8px",
        }}
      />
      <p>
        This iteration explores the use of React/Vite as the
        frontend, Flask as the backend API, and Nginx as a
        TLS-enabled reverse proxy server. It is deployed from a
        GitHub CI/CD pipeline to an AWS EC2 instance as a
        collection of microservices running in Docker
        containers.
      </p>
      <br />
      <div>
        <SocialLinks />
      </div>
    </div>
  );
};

export default Home;
