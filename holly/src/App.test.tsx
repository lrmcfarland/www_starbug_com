import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    const headings = screen.getAllByText(/www.starbug.com/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  // it("renders all major sections", () => {
  //   render(<App />);
  //   expect(screen.getByText(/This web app is built with React\/Vite/i)).toBeInTheDocument();
  // });
});
