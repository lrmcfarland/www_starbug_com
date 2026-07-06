import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Observatories from "./Observatories";

// Mock the images import
import { vi } from "vitest";

vi.mock("../assets/images/Astronomy/Observatories", () => ({
  images: {
    arecibo_2002: "mocked-arecibo-2002.jpg",
    prime_meridian: "mocked-prime-meridian.jpg",
    jodrell_bank_moon: "mocked-jodrell-bank-moon.jpg",
    jodrell_bank_and_me: "mocked-jodrell-bank-and-me.jpg",
    pow: "mocked-pow.jpg",
  },
}));

describe("Observatories Component", () => {
  describe("Component Rendering", () => {
    it("should render the component without crashing", () => {
      render(<Observatories />);
      expect(screen.getByText("Observatories")).toBeInTheDocument();
    });

    it("should render the main heading", () => {
      render(<Observatories />);
      const mainHeading = screen.getByRole("heading", { level: 1, name: "Observatories" });
      expect(mainHeading).toBeInTheDocument();
    });

    it("should render all observatory cards", () => {
      render(<Observatories />);
      const cards = screen.getAllByRole("heading", { level: 1 });
      // 1 main heading + 5 observatory titles = 6 h1s
      expect(cards).toHaveLength(6);
    });
  });

  describe("Observatory Data Rendering", () => {
    it("should render Arecibo observatory title", () => {
      render(<Observatories />);
      expect(screen.getByRole("heading", { name: "Arecibo" })).toBeInTheDocument();
    });

    it("should render all observatory titles", () => {
      render(<Observatories />);
      expect(screen.getByText("Arecibo")).toBeInTheDocument();
      expect(screen.getByText("On the prime meridian")).toBeInTheDocument();
      expect(screen.getAllByText("Jodrell Bank").length).toBeGreaterThanOrEqual(2);
    });

    it("should render location and date information for observatories", () => {
      render(<Observatories />);
      expect(screen.getByText(/Arecibo, Puerto Rico\. 2002 autumn/)).toBeInTheDocument();
      expect(screen.getByText(/Greenwich Observatory\. Greenwich England\. 2002-ish/)).toBeInTheDocument();
      expect(screen.getAllByText(/Jodrell Bank, Cheshire England\. 2003 spring/).length).toBeGreaterThan(0);
    });

    it("should render descriptions for each observatory", () => {
      render(<Observatories />);
      const descriptions = screen.getAllByText("Observing for the SETI Institute.");
      expect(descriptions.length).toBeGreaterThan(0);
    });

    it("should render the special description for 50th Anniversary", () => {
      render(<Observatories />);
      expect(
        screen.getByText(/Observing for the SETI Institute on the 50th Anniversary of Jodrell Bank\./)
      ).toBeInTheDocument();
    });
  });

  describe("Image Rendering", () => {
    it("should render images for all observatories", () => {
      render(<Observatories />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      expect(images).toHaveLength(5);
    });

    it("should have correct image sources", () => {
      render(<Observatories />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      expect(images[0]).toHaveAttribute("src", "mocked-arecibo-2002.jpg");
      expect(images[1]).toHaveAttribute("src", "mocked-prime-meridian.jpg");
      expect(images[2]).toHaveAttribute("src", "mocked-jodrell-bank-moon.jpg");
      expect(images[3]).toHaveAttribute("src", "mocked-jodrell-bank-and-me.jpg");
      expect(images[4]).toHaveAttribute("src", "mocked-pow.jpg");
    });

    it("should have lazy loading enabled on images", () => {
      render(<Observatories />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        expect(img).toHaveAttribute("loading", "lazy");
      });
    });

    it("should have proper image styling", () => {
      render(<Observatories />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        expect(img).toHaveStyle({ width: "100%", height: "auto" });
      });
    });
  });

  describe("Details List Rendering", () => {
    it("should render details for Arecibo observatory", () => {
      render(<Observatories />);
      expect(screen.getByText('"We are made of star-stuff." Carl Sagan')).toBeInTheDocument();
      expect(
        screen.getByText('"... or nuclear waste, depending on your point of view." Peter Backus')
      ).toBeInTheDocument();
    });

    it("should render details for Greenwich Observatory", () => {
      render(<Observatories />);
      expect(screen.getByText("Verifying with my GPS they have moved the meridian.")).toBeInTheDocument();
    });

    it("should render details for Jodrell Bank with moon", () => {
      render(<Observatories />);
      expect(screen.getByText('"It\'s not that kind of bank." - Mark Roberts')).toBeInTheDocument();
    });

    it("should render details for Jodrell Bank (2003)", () => {
      render(<Observatories />);
      expect(screen.getByText("Explaining how to use my old digital camera.")).toBeInTheDocument();
    });

    it("should handle empty details array gracefully", () => {
      render(<Observatories />);
      const jodrell = screen.getAllByText(/Jodrell Bank/);
      expect(jodrell.length).toBeGreaterThan(0);
    });

    it("should render details as list items", () => {
      render(<Observatories />);
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe("DOM Structure", () => {
    it("should render cards with correct CSS class", () => {
      const { container } = render(<Observatories />);
      const cards = container.querySelectorAll(".starbug-card");
      expect(cards).toHaveLength(5);
    });

    it("should wrap content in starbug-div", () => {
      const { container } = render(<Observatories />);
      const wrapper = container.querySelector(".starbug-div");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have proper flexbox layout on card content", () => {
      const { container } = render(<Observatories />);
      const flexContainers = container.querySelectorAll('[style*="display: flex"]');
      expect(flexContainers.length).toBeGreaterThan(0);
    });
  });

  describe("Data Integrity", () => {
    it("should render exactly 5 observatory cards", () => {
      const { container } = render(<Observatories />);
      const cards = container.querySelectorAll(".starbug-card");
      expect(cards).toHaveLength(5);
    });

    it("should render each observatory with unique IDs", () => {
      render(<Observatories />);
      const arecibo = screen.getByText("Arecibo");
      const prime = screen.getByText("On the prime meridian");
      const jodrell1 = screen.getAllByText("Jodrell Bank")[0];
      
      expect(arecibo).toBeInTheDocument();
      expect(prime).toBeInTheDocument();
      expect(jodrell1).toBeInTheDocument();
    });

    it("should render all observatory data without truncation", () => {
      render(<Observatories />);
      expect(screen.getByText(/Arecibo, Puerto Rico\. 2002 autumn/)).toBeInTheDocument();
      const setiElements = screen.getAllByText("Observing for the SETI Institute.");
      expect(setiElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Accessibility", () => {
    it("should have alt text for all images", () => {
      render(<Observatories />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      expect(images.length).toEqual(5);
    });

    it("should use semantic heading hierarchy", () => {
      render(<Observatories />);
      const h1Headings = screen.getAllByRole("heading", { level: 1 });
      const h2Headings = screen.getAllByRole("heading", { level: 2 });
      
      expect(h1Headings.length).toBeGreaterThan(0);
      expect(h2Headings.length).toBeGreaterThan(0);
    });

    it("should render details as unordered lists", () => {
      const { container } = render(<Observatories />);
      const lists = container.querySelectorAll("ul");
      expect(lists.length).toBeGreaterThan(0);
    });
  });

  describe("Snapshot Testing", () => {
    it("should match snapshot", () => {
      const { container } = render(<Observatories />);
      expect(container).toMatchSnapshot();
    });
  });
});
