import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(
      screen.getByText(/Welcome/i)
    ).toBeInTheDocument();
  });

  it("renders Home sections", () => {
    render(<App />);
    expect(
      screen.getByText(/Lincoln Randall McFarland/i)
    ).toBeInTheDocument();
  });

  it("Has link to Facebook", () => {
    render(<App />);
    const link = screen.getByRole("link", {
      name: /facebook/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "https://www.facebook.com/lincoln.mcfarland"
    );
  });

  it("Has link to LinkedIn", () => {
    render(<App />);
    const link = screen.getByRole("link", {
      name: /linkedin/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/lrmcfarland/"
    );
  });

  it("Has Resume page", () => {
    render(<App />);
    const resumeLink = Array.from(
      screen.getAllByRole("link")
    ).find((a) => a.getAttribute("href") === "/resume");
    expect(resumeLink).toBeInTheDocument();
  });

  it("Has Observatories page", () => {
    render(<App />);
    const observatoriesLink = Array.from(
      screen.getAllByRole("link")
    ).find((a) => a.getAttribute("href") === "/observatories");
    expect(observatoriesLink).toBeInTheDocument();
  });

});
