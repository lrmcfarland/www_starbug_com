import React from "react";

export const Home: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        lineHeight: "1.6",
        color: "#ffffff",
        textAlign: "left",
      }}
    >
      <h1>Welcome</h1>
      <p>
        This is the home page of Lincoln Randall McFarland (a.k.a. Randy),
        online since 1995, back when domain names were free and spam was meat in
        a can. It has no purpose other than to display my résumé and support my
        projects.
      </p>
      <p>
        This iteration explores the use of React/Vite as the frontend, Flask as
        the backend API, and Nginx as a TLS-enabled reverse proxy server. It is
        deployed from a GitHub CI/CD pipeline to an AWS EC2 instance as a
        collection of microservices running in Docker containers.
      </p>
    </div>
  );
};

export default Home;
