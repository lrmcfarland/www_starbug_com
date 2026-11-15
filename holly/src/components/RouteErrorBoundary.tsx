import React from "react";
import { useRouteError } from "react-router-dom";

export const RouteErrorBoundary: React.FC = () => {
  useRouteError();

  return (
    <main
      role="alert"
      style={{
        maxWidth: "40rem",
        margin: "10vh auto",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1>Page couldn&apos;t load</h1>
      <p>
        This page may have been updated while you were browsing. Refresh to
        load the latest version.
      </p>
      <button onClick={() => window.location.reload()}>Refresh page</button>
    </main>
  );
};
