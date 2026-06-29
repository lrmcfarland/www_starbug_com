import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });

  it("renders Home sections", () => {
    render(<App />);
    expect(screen.getByText(/Lincoln Randall McFarland/i)).toBeInTheDocument();
  });
});
