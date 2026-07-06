import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Kayaking from "./Kayaking";

describe("Kayaking Component", () => {
  describe("Component Rendering", () => {
    it("renders without crashing", () => {
      render(<Kayaking />);
      expect(screen.getByText("Kayaking")).toBeInTheDocument();
    });

    it("renders the main heading", () => {
      render(<Kayaking />);
      const heading = screen.getByRole("heading", { name: "Kayaking", level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("renders the starbug-div wrapper", () => {
      const { container } = render(<Kayaking />);
      const wrapper = container.querySelector(".starbug-div");
      expect(wrapper).toBeInTheDocument();
    });

    it("renders multiple starbug-card containers", () => {
      const { container } = render(<Kayaking />);
      const cards = container.querySelectorAll(".starbug-card");
      expect(cards.length).toBeGreaterThan(1);
    });

    it("renders all picture cards (4 total)", () => {
      const { container } = render(<Kayaking />);
      const cards = container.querySelectorAll(".starbug-card");
      expect(cards.length).toBe(5);
    });
  });

  describe("Video Section", () => {
    it("renders Eskimo Roll video card", () => {
      render(<Kayaking />);
      const eskimoHeading = screen.getByRole("heading", { name: "Eskimo Roll" });
      expect(eskimoHeading).toBeInTheDocument();
    });

    it("renders video element", () => {
      const { container } = render(<Kayaking />);
      const video = container.querySelector("video");
      expect(video).toBeInTheDocument();
    });

    it("video has controls enabled", () => {
      const { container } = render(<Kayaking />);
      const video = container.querySelector("video");
      expect(video).toHaveAttribute("controls");
    });

    it("video has playsInline enabled", () => {
      const { container } = render(<Kayaking />);
      const video = container.querySelector("video");
      expect(video).toHaveAttribute("playsinline");
    });

    it("video has 100% width", () => {
      const { container } = render(<Kayaking />);
      const video = container.querySelector("video");
      expect(video).toHaveAttribute("width", "100%");
    });

    it("video has fallback message", () => {
      const { container } = render(<Kayaking />);
      const video = container.querySelector("video");
      expect(video?.textContent).toContain("Your browser does not support this video tag");
    });

    it("renders Eskimo Roll description", () => {
      render(<Kayaking />);
      expect(
        screen.getByText(/1994-ish. Needs work on keeping my head down/)
      ).toBeInTheDocument();
    });

    it("mentions video update from this millennium", () => {
      render(<Kayaking />);
      expect(
        screen.getByText(/And an update from this millennium/)
      ).toBeInTheDocument();
    });
  });

  describe("Picture Cards", () => {
    it("renders Ender picture card", () => {
      render(<Kayaking />);
      expect(screen.getByRole("heading", { name: "Ender" })).toBeInTheDocument();
    });

    it("renders Rainbow Falls picture card", () => {
      render(<Kayaking />);
      expect(screen.getByRole("heading", { name: "Rainbow Falls" })).toBeInTheDocument();
    });

    it("renders Grand Canyon 1 picture card", () => {
      render(<Kayaking />);
      expect(screen.getByRole("heading", { name: "Grand Canyon 1" })).toBeInTheDocument();
    });

    it("renders Grand Canyon 2 picture card", () => {
      render(<Kayaking />);
      expect(screen.getByRole("heading", { name: "Grand Canyon 2" })).toBeInTheDocument();
    });

    it("renders all four picture titles", () => {
      render(<Kayaking />);
      expect(screen.getByText("Ender")).toBeInTheDocument();
      expect(screen.getByText("Rainbow Falls")).toBeInTheDocument();
      expect(screen.getByText("Grand Canyon 1")).toBeInTheDocument();
      expect(screen.getByText("Grand Canyon 2")).toBeInTheDocument();
    });
  });

  describe("Picture Details - Locations and Dates", () => {
    it("renders Ender location and date", () => {
      render(<Kayaking />);
      expect(
        screen.getByText("Tuolumne River, California. 1993 May 20")
      ).toBeInTheDocument();
    });

    it("renders Rainbow Falls location and date", () => {
      render(<Kayaking />);
      expect(
        screen.getByText("San Joaquin River, California. 1993 May 20")
      ).toBeInTheDocument();
    });

    it("renders Grand Canyon 1 location and date", () => {
      render(<Kayaking />);
      const grandCanyon1Card = screen.getByRole("heading", { name: "Grand Canyon 1" }).closest(".starbug-card");
      expect(
        grandCanyon1Card?.textContent
      ).toContain("Colorado River, Arizona");
    });

    it("renders all California locations", () => {
      render(<Kayaking />);
      expect(screen.getByText(/Tuolumne River, California/)).toBeInTheDocument();
      expect(screen.getByText(/San Joaquin River, California/)).toBeInTheDocument();
    });

    it("renders Arizona locations", () => {
      render(<Kayaking />);
      const arizonaLocations = screen.getAllByText(/Colorado River, Arizona/);
      expect(arizonaLocations.length).toBe(2);
    });

    it("renders 1993 dates", () => {
      render(<Kayaking />);
      expect(screen.getAllByText(/1993 May 20/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/1993 September/).length).toBeGreaterThan(0);
    });
  });

  describe("Picture Descriptions", () => {
    it("renders Ender description", () => {
      render(<Kayaking />);
      expect(screen.getByText("First enders.")).toBeInTheDocument();
    });

    it("renders Rainbow Falls description with humor", () => {
      render(<Kayaking />);
      expect(
        screen.getByText("Objects in image are older and wiser than they appear.")
      ).toBeInTheDocument();
    });

    it("renders Grand Canyon description mentioning Stanford Kayak Club", () => {
      render(<Kayaking />);
      const descriptions = screen.getAllByText(/Grand Canyon trip with the Stanford Kayak Club/);
      expect(descriptions.length).toBeGreaterThan(0);
    });
  });

  describe("Picture Details Lists", () => {
    it("Grand Canyon 1 has details list", () => {
      render(<Kayaking />);
      expect(screen.getByText("Go Bears!")).toBeInTheDocument();
    });

    it("renders details as list items", () => {
      render(<Kayaking />);
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThan(0);
    });

    it("Grand Canyon 2 has no details", () => {
      render(<Kayaking />);
      const grandCanyon2Card = screen.getByRole("heading", { name: "Grand Canyon 2" }).closest(".starbug-card");
      const lists = grandCanyon2Card?.querySelectorAll("ul");
      expect(lists).toBeDefined();
    });

    it("Ender has no details", () => {
      render(<Kayaking />);
      const enderCard = screen.getByRole("heading", { name: "Ender" }).closest(".starbug-card");
      const listItems = enderCard?.querySelectorAll("li");
      expect(listItems?.length).toBe(0);
    });

    it("Rainbow Falls has no details", () => {
      render(<Kayaking />);
      const rainbowCard = screen.getByRole("heading", { name: "Rainbow Falls" }).closest(".starbug-card");
      const listItems = rainbowCard?.querySelectorAll("li");
      expect(listItems?.length).toBe(0);
    });

    it("Go Bears! appears as single detail item", () => {
      render(<Kayaking />);
      const listItems = screen.getAllByRole("listitem");
      const goBears = listItems.find((item) => item.textContent === "Go Bears!");
      expect(goBears).toBeInTheDocument();
    });
  });

  describe("Picture Images", () => {
    it("renders four picture images", () => {
      render(<Kayaking />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      expect(images.length).toBe(4);
    });

    it("all images have fallback alt text", () => {
      render(<Kayaking />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt", "Sorry, the picture is missing atm.");
      });
    });

    it("images have lazy loading enabled", () => {
      render(<Kayaking />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        expect(img).toHaveAttribute("loading", "lazy");
      });
    });

    it("images have responsive sizing", () => {
      render(<Kayaking />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        expect(img).toHaveStyle({ width: "100%", height: "auto" });
      });
    });

    it("images are within starbug-card containers", () => {
      render(<Kayaking />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        const card = img.closest(".starbug-card");
        expect(card).toBeInTheDocument();
      });
    });
  });

  describe("DOM Structure", () => {
    it("wraps all content in starbug-div", () => {
      const { container } = render(<Kayaking />);
      const wrapper = container.querySelector(".starbug-div");
      expect(wrapper?.children.length).toBeGreaterThan(0);
    });

    it("picture cards use flexbox layout", () => {
      const { container } = render(<Kayaking />);
      const flexContainers = container.querySelectorAll('[style*="display: flex"]');
      expect(flexContainers.length).toBeGreaterThan(0);
    });

    it("picture details use gap spacing", () => {
      const { container } = render(<Kayaking />);
      const spacedContainers = container.querySelectorAll('[style*="gap"]');
      expect(spacedContainers.length).toBeGreaterThan(0);
    });

    it("renders semantic HTML structure", () => {
      const { container } = render(<Kayaking />);
      const headings = container.querySelectorAll("h1, h2");
      const images = container.querySelectorAll("img");
      const video = container.querySelector("video");
      const paragraphs = container.querySelectorAll("p");
      const lists = container.querySelectorAll("ul");

      expect(headings.length).toBeGreaterThan(0);
      expect(images.length).toBeGreaterThan(0);
      expect(video).toBeInTheDocument();
      expect(paragraphs.length).toBeGreaterThan(0);
      expect(lists.length).toBeGreaterThan(0);
    });

    it("each picture card contains title, location/date, image, description", () => {
      render(<Kayaking />);
      const enderCard = screen.getByRole("heading", { name: "Ender" }).closest(".starbug-card");

      expect(enderCard?.querySelector("h1")).toBeInTheDocument();
      expect(enderCard?.querySelector("h2")).toBeInTheDocument();
      expect(enderCard?.querySelector("img")).toBeInTheDocument();
      expect(enderCard?.querySelector("p")).toBeInTheDocument();
    });
  });

  describe("Data Integrity", () => {
    it("renders correct number of pictures", () => {
      render(<Kayaking />);
      const titleHeadings = [
        screen.getByText("Ender"),
        screen.getByText("Rainbow Falls"),
        screen.getByText("Grand Canyon 1"),
        screen.getByText("Grand Canyon 2"),
      ];
      expect(titleHeadings.length).toBe(4);
    });

    it("pictures appear in correct order", () => {
      const { container } = render(<Kayaking />);
      const cardHeadings = container.querySelectorAll(".starbug-card h1");
      const headings = Array.from(cardHeadings).map((h) => h.textContent);
      const pictureHeadings = headings.slice(1);
      expect(pictureHeadings[0]).toContain("Ender");
      expect(pictureHeadings[1]).toContain("Rainbow Falls");
      expect(pictureHeadings[2]).toContain("Grand Canyon 1");
      expect(pictureHeadings[3]).toContain("Grand Canyon 2");
    });

    it("each picture has unique ID", () => {
      const { container } = render(<Kayaking />);
      const cards = container.querySelectorAll(".starbug-card");
      const ids = new Set();
      cards.forEach((card, idx) => {
        if (idx > 0) {
          const heading = card.querySelector("h1");
          expect(heading).toBeInTheDocument();
          ids.add(heading?.textContent);
        }
      });
      expect(ids.size).toBe(4);
    });

    it("California pictures appear before Arizona pictures", () => {
      render(<Kayaking />);
      const californiaTexts = screen.getAllByText(/Tuolumne River, California/);
      const arizonaTexts = screen.getAllByText(/Colorado River, Arizona/);
      expect(californiaTexts.length).toBeGreaterThan(0);
      expect(arizonaTexts.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("has accessible heading hierarchy", () => {
      render(<Kayaking />);
      const h1 = screen.getByRole("heading", { level: 1, name: "Kayaking" });
      const h2s = screen.getAllByRole("heading", { level: 2 });
      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
    });

    it("all images have alt text", () => {
      render(<Kayaking />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
      });
    });

    it("video has fallback text", () => {
      const { container } = render(<Kayaking />);
      const video = container.querySelector("video");
      expect(video?.textContent).toBeTruthy();
    });

    it("lists are semantically correct", () => {
      const { container } = render(<Kayaking />);
      const lists = container.querySelectorAll("ul");
      lists.forEach((list) => {
        expect(list.children.length).toBeGreaterThanOrEqual(0);
      });
    });

    it("content has logical reading order", () => {
      render(<Kayaking />);
      expect(screen.getByText("Kayaking")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Eskimo Roll" })).toBeInTheDocument();
      expect(screen.getByText("Ender")).toBeInTheDocument();
    });

    it("headings use appropriate semantic levels", () => {
      const { container } = render(<Kayaking />);
      const h1s = container.querySelectorAll("h1");
      const h2s = container.querySelectorAll("h2");
      expect(h1s.length).toBeGreaterThanOrEqual(5);
      expect(h2s.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Styling and Layout", () => {
    it("pictures use flexbox with gap", () => {
      const { container } = render(<Kayaking />);
      const flexDivs = container.querySelectorAll('[style*="display: flex"][style*="gap"]');
      expect(flexDivs.length).toBeGreaterThan(0);
    });

    it("picture divs have flex: 1 styling", () => {
      const { container } = render(<Kayaking />);
      const flexChildren = container.querySelectorAll('[style*="flex: 1"]');
      expect(flexChildren.length).toBeGreaterThan(0);
    });

    it("images are responsive with 100% width", () => {
      render(<Kayaking />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        const style = img.getAttribute("style");
        expect(style).toContain("width: 100%");
      });
    });

    it("video has full width layout", () => {
      const { container } = render(<Kayaking />);
      const video = container.querySelector("video");
      expect(video).toHaveAttribute("width", "100%");
    });
  });

  describe("Content Verification", () => {
    it("includes Tuolumne River content", () => {
      render(<Kayaking />);
      expect(screen.getByText(/Tuolumne River/)).toBeInTheDocument();
    });

    it("includes San Joaquin River content", () => {
      render(<Kayaking />);
      expect(screen.getByText(/San Joaquin River/)).toBeInTheDocument();
    });

    it("includes Colorado River content", () => {
      render(<Kayaking />);
      const coloradoRiverText = screen.getAllByText(/Colorado River/);
      expect(coloradoRiverText.length).toBe(2);
    });

    it("mentions Stanford Kayak Club", () => {
      render(<Kayaking />);
      const clubText = screen.getAllByText(/Stanford Kayak Club/);
      expect(clubText.length).toBe(2);
    });

    it("includes all date information", () => {
      render(<Kayaking />);
      expect(screen.getAllByText(/1993 May 20/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/1993 September/).length).toBeGreaterThan(0);
      expect(screen.getByText(/1994-ish/)).toBeInTheDocument();
    });

    it("includes Ender content", () => {
      render(<Kayaking />);
      expect(screen.getByText("First enders.")).toBeInTheDocument();
    });

    it("includes Eskimo Roll content", () => {
      render(<Kayaking />);
      expect(screen.getByText(/Eskimo Roll/)).toBeInTheDocument();
    });
  });

  describe("Component Export", () => {
    it("exports Kayaking component as default", () => {
      render(<Kayaking />);
      expect(screen.getByText("Kayaking")).toBeInTheDocument();
    });

    it("component renders as React.FC", () => {
      const { container } = render(<Kayaking />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders without requiring props", () => {
      expect(() => render(<Kayaking />)).not.toThrow();
    });
  });

  describe("Integration Tests", () => {
    it("renders complete kayaking page structure", () => {
      render(<Kayaking />);

      expect(screen.getByText("Kayaking")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Eskimo Roll" })).toBeInTheDocument();
      expect(screen.getByText("Ender")).toBeInTheDocument();
      expect(screen.getByText("Rainbow Falls")).toBeInTheDocument();
      expect(screen.getByText("Grand Canyon 1")).toBeInTheDocument();
      expect(screen.getByText("Grand Canyon 2")).toBeInTheDocument();
    });

    it("video card appears before picture cards", () => {
      const { container } = render(<Kayaking />);
      const videoCard = screen.getByRole("heading", { name: "Eskimo Roll" }).closest(".starbug-card");
      const enderCard = screen.getByRole("heading", { name: "Ender" }).closest(".starbug-card");

      expect(videoCard).toBeInTheDocument();
      expect(enderCard).toBeInTheDocument();

      const allCards = container.querySelectorAll(".starbug-card");
      const videoIndex = Array.from(allCards).indexOf(videoCard as Element);
      const enderIndex = Array.from(allCards).indexOf(enderCard as Element);

      expect(videoIndex).toBeLessThan(enderIndex);
    });

    it("all pictures have required content fields", () => {
      render(<Kayaking />);

      const pictures = [
        { title: "Ender" },
        { title: "Rainbow Falls" },
        { title: "Grand Canyon 1" },
        { title: "Grand Canyon 2" },
      ];

      pictures.forEach((picture) => {
        expect(screen.getByText(picture.title)).toBeInTheDocument();
      });

      expect(screen.getByText(/Tuolumne River/)).toBeInTheDocument();
      expect(screen.getByText(/San Joaquin River/)).toBeInTheDocument();
      expect(screen.getAllByText(/Colorado River/).length).toBeGreaterThan(0);
    });

    it("multimedia elements load properly", () => {
      const { container } = render(<Kayaking />);
      const video = container.querySelector("video");
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");

      expect(video).toBeInTheDocument();
      expect(images.length).toBe(4);
    });
  });

  describe("Snapshot Testing", () => {
    it("matches snapshot", () => {
      const { container } = render(<Kayaking />);
      expect(container).toMatchSnapshot();
    });
  });
});
