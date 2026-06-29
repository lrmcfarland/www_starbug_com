import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    const headings = screen.getAllByText(/www.starbug.com/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  it("renders Home sections", () => {
    render(<App />);
    expect(screen.getByText(/Lincoln Randall McFarland/i)).toBeInTheDocument();
  });
});
