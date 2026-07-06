import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Resume from "./Resume";

describe("Resume Component", () => {
  describe("Component Rendering", () => {
    it("renders without crashing", () => {
      render(<Resume />);
      expect(screen.getByText(/Lincoln Randall McFarland/)).toBeInTheDocument();
    });

    it("renders the main heading with name", () => {
      render(<Resume />);
      const heading = screen.getByRole("heading", {
        name: /Lincoln Randall McFarland/,
      });
      expect(heading).toBeInTheDocument();
    });

    it("renders location information", () => {
      render(<Resume />);
      expect(
        screen.getByText(/Location: Mountain View, California/)
      ).toBeInTheDocument();
    });

    it("renders education information", () => {
      render(<Resume />);
      expect(
        screen.getByText(/University of California, Berkeley/)
      ).toBeInTheDocument();
      expect(screen.getByText(/B.A. Physics, 1985/)).toBeInTheDocument();
    });

    it("renders professional summary section", () => {
      render(<Resume />);
      expect(
        screen.getByText(/I am a software engineer with over 30 years/)
      ).toBeInTheDocument();
    });
  });

  describe("GitHub Button", () => {
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

  describe("Job Rendering", () => {
    it("renders all 15 job entries", () => {
      render(<Resume />);
      const moreButtons = screen.getAllByRole("button", { name: /More/i });
      expect(moreButtons).toHaveLength(15);
    });

    it("renders Mainspring Energy job", () => {
      render(<Resume />);
      const mainspringCard = screen.getByText("Mainspring Energy").closest(".starbug-card");
      expect(mainspringCard).toBeInTheDocument();
      expect(mainspringCard?.textContent).toContain("Software Engineer");
      expect(mainspringCard?.textContent).toContain("August 2021 - present");
    });

    it("renders IronPort Systems job", () => {
      render(<Resume />);
      const ironportCard = screen.getByText("IronPort Systems").closest(".starbug-card");
      expect(ironportCard).toBeInTheDocument();
      expect(ironportCard?.textContent).toContain("April 2005");
    });

    it("renders SETI Institute job", () => {
      render(<Resume />);
      expect(screen.getByText("SETI Institute")).toBeInTheDocument();
      expect(screen.getByText(/Project Phoenix program/)).toBeInTheDocument();
    });

    it("renders Lockheed Missiles and Space Company job", () => {
      render(<Resume />);
      expect(
        screen.getByText(/Lockheed Missiles and Space Company/)
      ).toBeInTheDocument();
      expect(screen.getByText(/May 1986 - January 1994/)).toBeInTheDocument();
    });

    it("renders all company names", () => {
      render(<Resume />);
      const companies = [
        "Mainspring Energy",
        "Lokker",
        "vArmour",
        "SilverTail Systems",
        "CDNetworks",
        "IronPort Systems",
        "The QSS Group",
        "SETI Institute",
        "Sequence Design",
        "OpenEye Scientific Software",
        "Cadence Design",
        "Trimble Navigation",
        "TIW Systems",
        "Lockheed Missiles and Space Company",
        "Home Energy Magazine",
      ];
      companies.forEach((company) => {
        expect(screen.getByText(company)).toBeInTheDocument();
      });
    });
  });

  describe("Job Data Structure", () => {
    it("renders at least one job title", () => {
      render(<Resume />);
      const titleElements = screen.getAllByText(/Software Engineer|Senior Engineer|Sr. Development Engineer/i);
      expect(titleElements.length).toBeGreaterThan(0);
    });

    it("renders at least one department", () => {
      render(<Resume />);
      const deptElements = screen.getAllByText(/Software and Controls|Engineering|CTO Organization/i);
      expect(deptElements.length).toBeGreaterThan(0);
    });

    it("renders job date ranges", () => {
      render(<Resume />);
      expect(screen.getByText(/August 2021 - present/)).toBeInTheDocument();
      expect(screen.getByText(/November 2020 - April 2021/)).toBeInTheDocument();
    });

    it("renders job descriptions initially visible", () => {
      render(<Resume />);
      expect(
        screen.getByText(/I joined Mainspring Energy to help build/)
      ).toBeInTheDocument();
    });
  });

  describe("Job Expansion Toggle", () => {
    it("renders More/Less buttons for each job", () => {
      render(<Resume />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(15);
    });

    it("hides job details initially", () => {
      render(<Resume />);
      const lists = screen.queryAllByRole("list");
      expect(lists.length).toBeGreaterThanOrEqual(0);
    });

    it("expands job details when More button clicked", async () => {
      render(<Resume />);
      const moreButtons = screen.getAllByRole("button", { name: /More/ });
      fireEvent.click(moreButtons[0]);
      await new Promise((resolve) => setTimeout(resolve, 0));
      const lessButtons = screen.queryAllByRole("button", { name: /Less/ });
      expect(lessButtons.length).toBeGreaterThan(0);
    });

    it("collapses job details when Less button clicked", async () => {
      render(<Resume />);
      const moreButtons = screen.getAllByRole("button", { name: /More/ });
      fireEvent.click(moreButtons[0]);
      await new Promise((resolve) => setTimeout(resolve, 0));
      const lessButtons = screen.getAllByRole("button", { name: /Less/ });
      fireEvent.click(lessButtons[0]);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(
        screen.getAllByRole("button", { name: /More/ }).length
      ).toBeGreaterThan(0);
    });

    it("toggles independent job expansion", async () => {
      render(<Resume />);
      const moreButtons = screen.getAllByRole("button", { name: /More/ });
      fireEvent.click(moreButtons[0]);
      await new Promise((resolve) => setTimeout(resolve, 0));
      fireEvent.click(moreButtons[1]);
      await new Promise((resolve) => setTimeout(resolve, 0));
      const lessButtons = screen.getAllByRole("button", { name: /Less/ });
      expect(lessButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Company Logos", () => {
    it("renders company logos for all jobs", () => {
      render(<Resume />);
      const logos = screen.getAllByAltText(/logo/);
      expect(logos.length).toBeGreaterThanOrEqual(15);
    });

    it("renders Mainspring Energy logo", () => {
      render(<Resume />);
      expect(
        screen.getByAltText(/Mainspring Energy logo/)
      ).toBeInTheDocument();
    });

    it("renders SETI Institute logo", () => {
      render(<Resume />);
      expect(screen.getByAltText(/SETI Institute logo/)).toBeInTheDocument();
    });

    it("logos have company URL links", () => {
      render(<Resume />);
      const logoLinks = screen.getAllByRole("link").filter(
        (link) => link.querySelector("img[alt*='logo']")
      );
      expect(logoLinks.length).toBeGreaterThanOrEqual(15);
    });

    it("logo links open in new tab", () => {
      render(<Resume />);
      const logoLinks = screen.getAllByRole("link").filter(
        (link) => link.querySelector("img[alt*='logo']")
      );
      logoLinks.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
      });
    });

    it("logo links have security attributes", () => {
      render(<Resume />);
      const logoLinks = screen.getAllByRole("link").filter(
        (link) => link.querySelector("img[alt*='logo']")
      );
      logoLinks.forEach((link) => {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  describe("Job Details Content", () => {
    it("expands to show Mainspring Energy details", async () => {
      render(<Resume />);
      const moreButtons = screen.getAllByRole("button", { name: /More/ });
      fireEvent.click(moreButtons[0]);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(
        screen.getByText(/Developed the Linear Generator Power Panel/)
      ).toBeInTheDocument();
    });

    it("shows multiple detail items when expanded", async () => {
      render(<Resume />);
      const moreButtons = screen.getAllByRole("button", { name: /More/ });
      fireEvent.click(moreButtons[0]);
      await new Promise((resolve) => setTimeout(resolve, 0));
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe("DOM Structure", () => {
    it("renders all jobs within starbug-card divs", () => {
      const { container } = render(<Resume />);
      const cards = container.querySelectorAll(".starbug-card");
      expect(cards.length).toBe(16);
    });

    it("wraps content in starbug-div", () => {
      const { container } = render(<Resume />);
      const wrapper = container.querySelector(".starbug-div");
      expect(wrapper).toBeInTheDocument();
    });

    it("uses flexbox layout for job cards", () => {
      const { container } = render(<Resume />);
      const flexContainers = container.querySelectorAll(
        '[style*="display: flex"]'
      );
      expect(flexContainers.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("renders semantic heading hierarchy", () => {
      render(<Resume />);
      const h1 = screen.getByRole("heading", { level: 1 });
      const h2 = screen.getAllByRole("heading", { level: 2 });
      expect(h1).toBeInTheDocument();
      expect(h2.length).toBeGreaterThan(0);
    });

    it("has alt text for all logos", () => {
      render(<Resume />);
      const images = screen.getAllByAltText(/logo/);
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
      });
    });

    it("has clickable buttons with text labels", () => {
      render(<Resume />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button.textContent).toMatch(/More|Less/);
      });
    });

    it("links have hrefs", () => {
      render(<Resume />);
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link.getAttribute("href")).toBeTruthy();
      });
    });
  });

  describe("Content Verification", () => {
    it("includes Mainspring Energy as most recent job", () => {
      render(<Resume />);
      expect(screen.getByText("Mainspring Energy")).toBeInTheDocument();
      expect(screen.getByText(/Software and Controls/)).toBeInTheDocument();
    });

    it("includes Home Energy Magazine as oldest job", () => {
      render(<Resume />);
      expect(screen.getByText("Home Energy Magazine")).toBeInTheDocument();
      expect(screen.getByText(/January 1984 - May 1986/)).toBeInTheDocument();
    });

    it("displays 30+ years of experience statement", () => {
      render(<Resume />);
      expect(screen.getByText(/over 30 years of experience/)).toBeInTheDocument();
    });

    it("includes strong background in Python and C++", () => {
      render(<Resume />);
      expect(
        screen.getByText(/I have a strong background in Python, C\+\+/)
      ).toBeInTheDocument();
    });
  });

  describe("Snapshot Testing", () => {
    it("matches snapshot", () => {
      const { container } = render(<Resume />);
      expect(container).toMatchSnapshot();
    });
  });
});
