import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Resume } from "./Resume";

describe("Resume", () => {

  it("renders without crashing", () => {
    render(<Resume />);
    expect(
      screen.getByText(/Lincoln Randall McFarland/)
    ).toBeInTheDocument();
  });

  it("renders the GitHub button with correct href", () => {
    render(<Resume />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/lrmcfarland"
    );
  });

  it("GitHub button opens in a new tab", () => {
    render(<Resume />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute("target", "_blank");
  });

  it("GitHub button has proper security attributes", () => {
    render(<Resume />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("GitHub button displays the GitHub icon", () => {
    render(<Resume />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink.querySelector("svg")).toBeInTheDocument();
  });

  it("GitHub button has the correct text label", () => {
    render(<Resume />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink.textContent).toContain("GitHub");
  });
});
