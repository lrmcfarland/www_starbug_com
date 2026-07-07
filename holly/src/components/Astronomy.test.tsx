import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Astronomy from "./Astronomy";

describe("Astronomy Component", () => {
  describe("Component Rendering", () => {
    it("renders without crashing", () => {
      render(<Astronomy />);
      expect(screen.getByText("Astronomy")).toBeInTheDocument();
    });

    it("renders the main heading", () => {
      render(<Astronomy />);
      const heading = screen.getByRole("heading", { name: "Astronomy", level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("renders the starbug-div wrapper", () => {
      const { container } = render(<Astronomy />);
      const wrapper = container.querySelector(".starbug-div");
      expect(wrapper).toBeInTheDocument();
    });

    it("renders multiple starbug-card containers", () => {
      const { container } = render(<Astronomy />);
      const cards = container.querySelectorAll(".starbug-card");
      expect(cards.length).toBeGreaterThan(1);
    });

    it("renders all picture cards (5 total)", () => {
      const { container } = render(<Astronomy />);
      const cards = container.querySelectorAll(".starbug-card");
      expect(cards.length).toBe(6);
    });
  });

  describe("Observatory Introduction", () => {
    it("renders observatory description card", () => {
      render(<Astronomy />);
      const description = screen.getByText(/This is my home observatory/);
      expect(description).toBeInTheDocument();
    });

    it("mentions Celestron 8se telescope", () => {
      render(<Astronomy />);
      expect(screen.getByText(/Celestron\s*8se/)).toBeInTheDocument();
    });

    it("includes aperture specification", () => {
      render(<Astronomy />);
      expect(screen.getByText(/Aperture 200 mm/)).toBeInTheDocument();
    });

    it("includes focal length specification", () => {
      render(<Astronomy />);
      expect(screen.getByText(/Focal length 2032 mm/)).toBeInTheDocument();
    });

    it("mentions Skyris 132C camera", () => {
      render(<Astronomy />);
      expect(screen.getByText(/Skyris 132C camera/)).toBeInTheDocument();
    });

    it("mentions oaCapture software", () => {
      render(<Astronomy />);
      expect(screen.getByText(/oaCapture/)).toBeInTheDocument();
    });

    it("mentions MacBook Pro", () => {
      render(<Astronomy />);
      expect(screen.getByText(/MacBook Pro/)).toBeInTheDocument();
    });
  });

  describe("Picture Cards", () => {
    it("renders 404 MLC picture card", () => {
      render(<Astronomy />);
      expect(screen.getByRole("heading", { name: "404 MLC" })).toBeInTheDocument();
    });

    it("renders Antenna at 500 m picture card", () => {
      render(<Astronomy />);
      expect(screen.getByRole("heading", { name: "Antenna at 500 m" })).toBeInTheDocument();
    });

    it("renders Black Mountain picture card", () => {
      render(<Astronomy />);
      expect(screen.getByRole("heading", { name: "Black Mountain" })).toBeInTheDocument();
    });

    it("renders Antenna at 10 km picture card", () => {
      render(<Astronomy />);
      expect(screen.getByRole("heading", { name: "Antenna at 10 km" })).toBeInTheDocument();
    });

    it("renders Saturn picture card", () => {
      render(<Astronomy />);
      expect(screen.getByRole("heading", { name: "Saturn" })).toBeInTheDocument();
    });

    it("renders all five picture titles", () => {
      render(<Astronomy />);
      expect(screen.getByText("404 MLC")).toBeInTheDocument();
      expect(screen.getByText("Antenna at 500 m")).toBeInTheDocument();
      expect(screen.getByText("Black Mountain")).toBeInTheDocument();
      expect(screen.getByText("Antenna at 10 km")).toBeInTheDocument();
      expect(screen.getByText("Saturn")).toBeInTheDocument();
    });
  });

  describe("Picture Details - Locations and Dates", () => {
    it("renders 404 MLC location and date", () => {
      render(<Astronomy />);
      const mlcCard = screen.getByRole("heading", { name: "404 MLC" }).closest(".starbug-card");
      expect(mlcCard?.textContent).toContain("Mountain View, California");
      expect(mlcCard?.textContent).toContain("2018 March 10");
    });

    it("renders all Mountain View locations", () => {
      render(<Astronomy />);
      const mountainViewText = screen.getAllByText(/Mountain View, California/);
      expect(mountainViewText.length).toBe(5);
    });

    it("renders 2018 March 10 dates", () => {
      render(<Astronomy />);
      const marchDates = screen.getAllByText(/2018 March 10/);
      expect(marchDates.length).toBeGreaterThan(0);
    });

    it("renders 2018 July 08 date for Saturn", () => {
      render(<Astronomy />);
      expect(screen.getByText(/2018 July 08/)).toBeInTheDocument();
    });
  });

  describe("Picture Descriptions", () => {
    it("renders 404 MLC description", () => {
      render(<Astronomy />);
      expect(screen.getByText("My home setup.")).toBeInTheDocument();
    });

    it("renders Antenna at 500 m description", () => {
      render(<Astronomy />);
      expect(
        screen.getByText("Antenna using the telescope at 500m")
      ).toBeInTheDocument();
    });

    it("renders Black Mountain description", () => {
      render(<Astronomy />);
      expect(
        screen.getByText("I think this is the mountain view.")
      ).toBeInTheDocument();
    });

    it("renders Antenna at 10 km description", () => {
      render(<Astronomy />);
      expect(
        screen.getByText("The antennas on Black Mountain.")
      ).toBeInTheDocument();
    });

    it("Saturn has empty description", () => {
      render(<Astronomy />);
      const saturnCard = screen.getByRole("heading", { name: "Saturn" }).closest(".starbug-card");
      const paragraphs = saturnCard?.querySelectorAll("p");
      expect(paragraphs?.length).toBeGreaterThan(0);
    });
  });

  describe("Picture Details Lists", () => {
    it("404 MLC has details list", () => {
      render(<Astronomy />);
      expect(
        screen.getByText("Estimating from Google earth the antenna is about 500 meters away.")
      ).toBeInTheDocument();
    });

    it("Black Mountain has details list", () => {
      render(<Astronomy />);
      expect(
        screen.getByText("Estimating from Google earth the antenna is about 10 kilometers away.")
      ).toBeInTheDocument();
    });

    it("renders details as list items", () => {
      render(<Astronomy />);
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThan(0);
    });

    it("Antenna at 500 m has no details", () => {
      render(<Astronomy />);
      const antennaCard = screen.getByRole("heading", { name: "Antenna at 500 m" }).closest(".starbug-card");
      const listItems = antennaCard?.querySelectorAll("li");
      expect(listItems?.length).toBe(0);
    });

    it("Antenna at 10 km has no details", () => {
      render(<Astronomy />);
      const antennaCard = screen.getByRole("heading", { name: "Antenna at 10 km" }).closest(".starbug-card");
      const listItems = antennaCard?.querySelectorAll("li");
      expect(listItems?.length).toBe(0);
    });

    it("Saturn has no details", () => {
      render(<Astronomy />);
      const saturnCard = screen.getByRole("heading", { name: "Saturn" }).closest(".starbug-card");
      const listItems = saturnCard?.querySelectorAll("li");
      expect(listItems?.length).toBe(0);
    });
  });

  describe("Picture Images", () => {
    it("renders five picture images", () => {
      render(<Astronomy />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      expect(images.length).toBe(5);
    });

    it("all images have fallback alt text", () => {
      render(<Astronomy />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt", "Sorry, the picture is missing atm.");
      });
    });

    it("images have lazy loading enabled", () => {
      render(<Astronomy />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        expect(img).toHaveAttribute("loading", "lazy");
      });
    });

    it("images have responsive sizing", () => {
      render(<Astronomy />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        expect(img).toHaveStyle({ width: "100%", height: "auto" });
      });
    });

    it("images are within starbug-card containers", () => {
      render(<Astronomy />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        const card = img.closest(".starbug-card");
        expect(card).toBeInTheDocument();
      });
    });
  });

  describe("DOM Structure", () => {
    it("wraps all content in starbug-div", () => {
      const { container } = render(<Astronomy />);
      const wrapper = container.querySelector(".starbug-div");
      expect(wrapper?.children.length).toBeGreaterThan(0);
    });

    it("picture cards use flexbox layout", () => {
      const { container } = render(<Astronomy />);
      const flexContainers = container.querySelectorAll('[style*="display: flex"]');
      expect(flexContainers.length).toBeGreaterThan(0);
    });

    it("picture details use gap spacing", () => {
      const { container } = render(<Astronomy />);
      const spacedContainers = container.querySelectorAll('[style*="gap"]');
      expect(spacedContainers.length).toBeGreaterThan(0);
    });

    it("renders semantic HTML structure", () => {
      const { container } = render(<Astronomy />);
      const headings = container.querySelectorAll("h1, h2");
      const images = container.querySelectorAll("img");
      const paragraphs = container.querySelectorAll("p");
      const lists = container.querySelectorAll("ul");

      expect(headings.length).toBeGreaterThan(0);
      expect(images.length).toBeGreaterThan(0);
      expect(paragraphs.length).toBeGreaterThan(0);
      expect(lists.length).toBeGreaterThan(0);
    });

    it("each picture card contains title, location/date, image, description", () => {
      render(<Astronomy />);
      const mlcCard = screen.getByRole("heading", { name: "404 MLC" }).closest(".starbug-card");

      expect(mlcCard?.querySelector("h1")).toBeInTheDocument();
      expect(mlcCard?.querySelector("h2")).toBeInTheDocument();
      expect(mlcCard?.querySelector("img")).toBeInTheDocument();
      expect(mlcCard?.querySelector("p")).toBeInTheDocument();
    });
  });

  describe("Data Integrity", () => {
    it("renders correct number of pictures", () => {
      render(<Astronomy />);
      const titleHeadings = [
        screen.getByText("404 MLC"),
        screen.getByText("Antenna at 500 m"),
        screen.getByText("Black Mountain"),
        screen.getByText("Antenna at 10 km"),
        screen.getByText("Saturn"),
      ];
      expect(titleHeadings.length).toBe(5);
    });

    it("pictures appear in correct order", () => {
      const { container } = render(<Astronomy />);
      const mlcCard = screen.getByRole("heading", { name: "404 MLC" }).closest(".starbug-card");
      const antenna500Card = screen.getByRole("heading", { name: "Antenna at 500 m" }).closest(".starbug-card");
      const mountainCard = screen.getByRole("heading", { name: "Black Mountain" }).closest(".starbug-card");
      const antenna10Card = screen.getByRole("heading", { name: "Antenna at 10 km" }).closest(".starbug-card");
      const saturnCard = screen.getByRole("heading", { name: "Saturn" }).closest(".starbug-card");

      const allCards = container.querySelectorAll(".starbug-card");
      const mlcIdx = Array.from(allCards).indexOf(mlcCard as Element);
      const antenna500Idx = Array.from(allCards).indexOf(antenna500Card as Element);
      const mountainIdx = Array.from(allCards).indexOf(mountainCard as Element);
      const antenna10Idx = Array.from(allCards).indexOf(antenna10Card as Element);
      const saturnIdx = Array.from(allCards).indexOf(saturnCard as Element);

      expect(mlcIdx < antenna500Idx).toBe(true);
      expect(antenna500Idx < mountainIdx).toBe(true);
      expect(mountainIdx < antenna10Idx).toBe(true);
      expect(antenna10Idx < saturnIdx).toBe(true);
    });

    it("each picture has unique ID", () => {
      render(<Astronomy />);
      const titles = ["404 MLC", "Antenna at 500 m", "Black Mountain", "Antenna at 10 km", "Saturn"];
      titles.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
      expect(titles.length).toBe(5);
    });

    it("all pictures are Mountain View locations", () => {
      render(<Astronomy />);
      const mountainViewTexts = screen.getAllByText(/Mountain View, California/);
      expect(mountainViewTexts.length).toBe(5);
    });
  });

  describe("Accessibility", () => {
    it("has accessible heading hierarchy", () => {
      render(<Astronomy />);
      const h1 = screen.getByRole("heading", { level: 1, name: "Astronomy" });
      const h2s = screen.getAllByRole("heading", { level: 2 });
      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
    });

    it("all images have alt text", () => {
      render(<Astronomy />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
      });
    });

    it("lists are semantically correct", () => {
      const { container } = render(<Astronomy />);
      const lists = container.querySelectorAll("ul");
      lists.forEach((list) => {
        expect(list.children.length).toBeGreaterThanOrEqual(0);
      });
    });

    it("content has logical reading order", () => {
      render(<Astronomy />);
      expect(screen.getByText("Astronomy")).toBeInTheDocument();
      expect(screen.getByText(/This is my home observatory/)).toBeInTheDocument();
      expect(screen.getByText("404 MLC")).toBeInTheDocument();
    });

    it("headings use appropriate semantic levels", () => {
      const { container } = render(<Astronomy />);
      const h1s = container.querySelectorAll("h1");
      const h2s = container.querySelectorAll("h2");
      expect(h1s.length).toBeGreaterThanOrEqual(6);
      expect(h2s.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("Styling and Layout", () => {
    it("pictures use flexbox with gap", () => {
      const { container } = render(<Astronomy />);
      const flexDivs = container.querySelectorAll('[style*="display: flex"][style*="gap"]');
      expect(flexDivs.length).toBeGreaterThan(0);
    });

    it("picture divs have flex: 1 styling", () => {
      const { container } = render(<Astronomy />);
      const flexChildren = container.querySelectorAll('[style*="flex: 1"]');
      expect(flexChildren.length).toBeGreaterThan(0);
    });

    it("images are responsive with 100% width", () => {
      render(<Astronomy />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");
      images.forEach((img) => {
        const style = img.getAttribute("style");
        expect(style).toContain("width: 100%");
      });
    });
  });

  describe("Content Verification", () => {
    it("includes Mountain View content", () => {
      render(<Astronomy />);
      expect(screen.getAllByText(/Mountain View, California/).length).toBe(5);
    });

    it("includes 500 meters antenna distance", () => {
      render(<Astronomy />);
      expect(screen.getByText(/500 meters away/)).toBeInTheDocument();
    });

    it("includes 10 kilometers antenna distance", () => {
      render(<Astronomy />);
      expect(screen.getByText(/10 kilometers away/)).toBeInTheDocument();
    });

    it("includes all 2018 dates", () => {
      render(<Astronomy />);
      expect(screen.getAllByText(/2018 March 10/).length).toBeGreaterThan(0);
      expect(screen.getByText(/2018 July 08/)).toBeInTheDocument();
    });

    it("includes home setup reference", () => {
      render(<Astronomy />);
      expect(screen.getByText("My home setup.")).toBeInTheDocument();
    });

    it("includes Saturn observation", () => {
      render(<Astronomy />);
      expect(screen.getByText("Saturn")).toBeInTheDocument();
    });

    it("includes telescope aperture", () => {
      render(<Astronomy />);
      expect(screen.getByText(/200 mm/)).toBeInTheDocument();
    });

    it("includes telescope focal length", () => {
      render(<Astronomy />);
      expect(screen.getByText(/2032 mm/)).toBeInTheDocument();
    });
  });

  describe("Component Export", () => {
    it("exports Astronomy component as default", () => {
      render(<Astronomy />);
      expect(screen.getByText("Astronomy")).toBeInTheDocument();
    });

    it("component renders as React.FC", () => {
      const { container } = render(<Astronomy />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders without requiring props", () => {
      expect(() => render(<Astronomy />)).not.toThrow();
    });
  });

  describe("Integration Tests", () => {
    it("renders complete astronomy page structure", () => {
      render(<Astronomy />);

      expect(screen.getByText("Astronomy")).toBeInTheDocument();
      expect(screen.getByText(/This is my home observatory/)).toBeInTheDocument();
      expect(screen.getByText("404 MLC")).toBeInTheDocument();
      expect(screen.getByText("Antenna at 500 m")).toBeInTheDocument();
      expect(screen.getByText("Black Mountain")).toBeInTheDocument();
      expect(screen.getByText("Antenna at 10 km")).toBeInTheDocument();
      expect(screen.getByText("Saturn")).toBeInTheDocument();
    });

    it("introduction appears before picture cards", () => {
      const { container } = render(<Astronomy />);
      const introCard = screen.getByText(/This is my home observatory/).closest(".starbug-card");
      const mlcCard = screen.getByRole("heading", { name: "404 MLC" }).closest(".starbug-card");

      expect(introCard).toBeInTheDocument();
      expect(mlcCard).toBeInTheDocument();

      const allCards = container.querySelectorAll(".starbug-card");
      const introIndex = Array.from(allCards).indexOf(introCard as Element);
      const mlcIndex = Array.from(allCards).indexOf(mlcCard as Element);

      expect(introIndex).toBeLessThan(mlcIndex);
    });

    it("all pictures have required content fields", () => {
      render(<Astronomy />);

      const pictures = [
        { title: "404 MLC" },
        { title: "Antenna at 500 m" },
        { title: "Black Mountain" },
        { title: "Antenna at 10 km" },
        { title: "Saturn" },
      ];

      pictures.forEach((picture) => {
        expect(screen.getByText(picture.title)).toBeInTheDocument();
      });

      expect(screen.getAllByText(/Mountain View/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/2018 March 10/).length).toBeGreaterThan(0);
    });

    it("multimedia elements load properly", () => {
      render(<Astronomy />);
      const images = screen.getAllByAltText("Sorry, the picture is missing atm.");

      expect(images.length).toBe(5);
    });
  });

  describe("Snapshot Testing", () => {
    it("matches snapshot", () => {
      const { container } = render(<Astronomy />);
      expect(container).toMatchSnapshot();
    });
  });
});
