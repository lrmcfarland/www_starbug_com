import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText(/www.starbug.com/i)).toBeInTheDocument();
  });

  it("renders all major sections", () => {
    render(<App />);
    expect(screen.getByText(/This web app is built with React\/Vite/i)).toBeInTheDocument();
  });
});
