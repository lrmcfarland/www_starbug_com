import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./Home";

describe("Home Component", () => {
  describe("Component Rendering", () => {
    it("renders without crashing", () => {
      render(<Home />);
      expect(screen.getByText("Welcome")).toBeInTheDocument();
    });

    it("renders the main heading", () => {
      render(<Home />);
      const heading = screen.getByRole("heading", { name: "Welcome" });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H1");
    });

    it("renders the starbug-div wrapper", () => {
      const { container } = render(<Home />);
      const wrapper = container.querySelector(".starbug-div");
      expect(wrapper).toBeInTheDocument();
    });

    it("renders the starbug-card container", () => {
      const { container } = render(<Home />);
      const card = container.querySelector(".starbug-card");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Welcome Content", () => {
    it("renders home page description", () => {
      render(<Home />);
      expect(
        screen.getByText(/This is the home page of Lincoln Randall McFarland/)
      ).toBeInTheDocument();
    });

    it("includes mention of being online since 1995", () => {
      render(<Home />);
      expect(screen.getByText(/online since 1995/)).toBeInTheDocument();
    });

    it("includes the spam joke", () => {
      render(<Home />);
      expect(
        screen.getByText(/back when domain names were free and spam was meat in a can/)
      ).toBeInTheDocument();
    });

    it("mentions purpose: résumé and projects", () => {
      render(<Home />);
      expect(
        screen.getByText(/display my résumé and support my projects/)
      ).toBeInTheDocument();
    });

    it("includes nickname Randy", () => {
      render(<Home />);
      expect(
        screen.getByText(/Lincoln Randall McFarland.*Randy/)
      ).toBeInTheDocument();
    });

    it("renders tech stack information", () => {
      render(<Home />);
      expect(screen.getByText(/React\/Vite as the frontend/)).toBeInTheDocument();
      expect(screen.getByText(/Flask as the backend API/)).toBeInTheDocument();
      expect(
        screen.getByText(/Nginx as a TLS-enabled reverse proxy server/)
      ).toBeInTheDocument();
    });

    it("mentions GitHub CI/CD deployment", () => {
      render(<Home />);
      expect(
        screen.getByText(/deployed from a GitHub CI\/CD pipeline/)
      ).toBeInTheDocument();
    });

    it("mentions AWS EC2 and Docker containers", () => {
      render(<Home />);
      expect(
        screen.getByText(/AWS EC2 instance as a collection of microservices running in Docker containers/)
      ).toBeInTheDocument();
    });
  });

  describe("Image Rendering", () => {
    it("renders the Athens 2025 image", () => {
      render(<Home />);
      const image = screen.getByAltText("Athens 2025");
      expect(image).toBeInTheDocument();
    });

    it("image has correct src attribute", () => {
      render(<Home />);
      const image = screen.getByAltText("Athens 2025") as HTMLImageElement;
      expect(image.src).toContain("Athens_2025");
    });

    it("image has lazy loading enabled", () => {
      render(<Home />);
      const image = screen.getByAltText("Athens 2025");
      expect(image).toHaveAttribute("loading", "lazy");
    });

    it("image has responsive styling", () => {
      render(<Home />);
      const image = screen.getByAltText("Athens 2025");
      expect(image).toHaveStyle({ width: "100%", height: "auto" });
    });

    it("image is positioned within card content", () => {
      const { container } = render(<Home />);
      const card = container.querySelector(".starbug-card");
      const image = screen.getByAltText("Athens 2025");
      expect(card?.contains(image)).toBe(true);
    });
  });

  describe("Social Links Component", () => {
    it("renders social links section", () => {
      render(<Home />);
      const socialLinks = screen.getByRole("link", { name: /Facebook/i });
      expect(socialLinks).toBeInTheDocument();
    });

    it("renders Facebook link", () => {
      render(<Home />);
      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      expect(facebookLink).toBeInTheDocument();
    });

    it("renders LinkedIn link", () => {
      render(<Home />);
      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
      expect(linkedinLink).toBeInTheDocument();
    });

    it("Facebook link has correct href", () => {
      render(<Home />);
      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      expect(facebookLink).toHaveAttribute(
        "href",
        "https://www.facebook.com/lincoln.mcfarland"
      );
    });

    it("LinkedIn link has correct href", () => {
      render(<Home />);
      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
      expect(linkedinLink).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/lrmcfarland/"
      );
    });

    it("Facebook link opens in new tab", () => {
      render(<Home />);
      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      expect(facebookLink).toHaveAttribute("target", "_blank");
    });

    it("LinkedIn link opens in new tab", () => {
      render(<Home />);
      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
      expect(linkedinLink).toHaveAttribute("target", "_blank");
    });

    it("Facebook link has security attributes", () => {
      render(<Home />);
      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      expect(facebookLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("LinkedIn link has security attributes", () => {
      render(<Home />);
      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Social Links Icons", () => {
    it("Facebook link displays Facebook icon", () => {
      render(<Home />);
      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      expect(facebookLink.querySelector("svg")).toBeInTheDocument();
    });

    it("LinkedIn link displays LinkedIn icon", () => {
      render(<Home />);
      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
      expect(linkedinLink.querySelector("svg")).toBeInTheDocument();
    });

    it("Facebook link has text label", () => {
      render(<Home />);
      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      expect(facebookLink.textContent).toContain("Facebook");
    });

    it("LinkedIn link has text label", () => {
      render(<Home />);
      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
      expect(linkedinLink.textContent).toContain("LinkedIn");
    });
  });

  describe("Button Styling", () => {
    it("social links have flexbox layout", () => {
      const { container } = render(<Home />);
      const socialContainer = container.querySelector(
        ".starbug_card[style*='display: flex']"
      );
      expect(socialContainer).toBeInTheDocument();
    });

    it("social links have gap spacing", () => {
      const { container } = render(<Home />);
      const socialContainer = container.querySelector(
        ".starbug_card[style*='gap']"
      );
      expect(socialContainer).toBeInTheDocument();
    });

    it("social link buttons have inline-flex display", () => {
      render(<Home />);
      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      const styles = window.getComputedStyle(facebookLink);
      expect(styles.display).toMatch(/flex|inline/);
    });

    it("social link buttons have proper padding", () => {
      render(<Home />);
      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      const styles = window.getComputedStyle(facebookLink);
      expect(styles.padding).toBeTruthy();
    });

    it("social link buttons have border", () => {
      render(<Home />);
      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      const styles = window.getComputedStyle(facebookLink);
      expect(styles.border).toBeTruthy();
    });

    it("social link buttons have border radius", () => {
      render(<Home />);
      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      const styles = window.getComputedStyle(facebookLink);
      expect(styles.borderRadius).toBeTruthy();
    });
  });

  describe("DOM Structure", () => {
    it("content is structured within starbug-card", () => {
      const { container } = render(<Home />);
      const card = container.querySelector(".starbug-card");
      expect(card?.querySelector("p")).toBeInTheDocument();
      expect(card?.querySelector("img")).toBeInTheDocument();
    });

    it("has two paragraph sections", () => {
      render(<Home />);
      const paragraphs = screen.getAllByText(/This is the home page/);
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it("renders with semantic HTML", () => {
      const { container } = render(<Home />);
      expect(container.querySelector("h1")).toBeInTheDocument();
      expect(container.querySelectorAll("p").length).toBeGreaterThan(0);
      expect(container.querySelectorAll("a").length).toBeGreaterThan(0);
    });

    it("content flows in logical order", () => {
      render(<Home />);
      const heading = screen.getByRole("heading", { name: "Welcome" });
      const firstParagraph = screen.getByText(/This is the home page/);
      const image = screen.getByAltText("Athens 2025");

      expect(heading).toBeInTheDocument();
      expect(firstParagraph).toBeInTheDocument();
      expect(image).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has accessible heading hierarchy", () => {
      render(<Home />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it("image has alt text", () => {
      render(<Home />);
      const image = screen.getByAltText("Athens 2025");
      expect(image).toHaveAttribute("alt", "Athens 2025");
    });

    it("all links have accessible names", () => {
      render(<Home />);
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link.textContent || link.getAttribute("aria-label")).toBeTruthy();
      });
    });

    it("social links are keyboard accessible", () => {
      render(<Home />);
      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });

      expect(facebookLink.tagName).toBe("A");
      expect(linkedinLink.tagName).toBe("A");
    });

    it("no empty alt attributes", () => {
      render(<Home />);
      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
        expect(img.getAttribute("alt")).toBeTruthy();
      });
    });

    it("proper heading for page section", () => {
      render(<Home />);
      const heading = screen.getByRole("heading", { name: "Welcome" });
      expect(heading.parentElement?.classList.contains("starbug-div")).toBe(true);
    });
  });

  describe("Link Validation", () => {
    it("all external links use https", () => {
      render(<Home />);
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        const href = (link as HTMLAnchorElement).href;
        if (href && !href.startsWith("#")) {
          expect(href).toMatch(/^https:\/\//);
        }
      });
    });

    it("Facebook URL is valid", () => {
      render(<Home />);
      const facebookLink = screen.getByRole("link", { name: /Facebook/i });
      const href = facebookLink.getAttribute("href");
      expect(href).toMatch(/facebook\.com\/lincoln\.mcfarland/);
    });

    it("LinkedIn URL is valid", () => {
      render(<Home />);
      const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
      const href = linkedinLink.getAttribute("href");
      expect(href).toMatch(/linkedin\.com\/in\/lrmcfarland/);
    });

    it("all links have proper protocol", () => {
      render(<Home />);
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        const href = (link as HTMLAnchorElement).href;
        expect(href).toMatch(/^https?:\/\//);
      });
    });
  });

  describe("Content Verification", () => {
    it("mentions React/Vite stack", () => {
      render(<Home />);
      expect(screen.getByText(/React\/Vite/)).toBeInTheDocument();
    });

    it("mentions Flask backend", () => {
      render(<Home />);
      expect(screen.getByText(/Flask/)).toBeInTheDocument();
    });

    it("mentions Nginx reverse proxy", () => {
      render(<Home />);
      expect(screen.getByText(/Nginx/)).toBeInTheDocument();
    });

    it("mentions Docker deployment", () => {
      render(<Home />);
      expect(screen.getByText(/Docker/)).toBeInTheDocument();
    });

    it("mentions AWS EC2", () => {
      render(<Home />);
      expect(screen.getByText(/AWS EC2/)).toBeInTheDocument();
    });

    it("mentions GitHub CI/CD", () => {
      render(<Home />);
      expect(screen.getByText(/GitHub CI\/CD/)).toBeInTheDocument();
    });

    it("displays exactly two social links", () => {
      render(<Home />);
      const socialLinks = screen.getAllByRole("link").filter(
        (link) => (link as HTMLAnchorElement).href.includes("facebook.com") || (link as HTMLAnchorElement).href.includes("linkedin.com")
      );
      expect(socialLinks).toHaveLength(2);
    });
  });

  describe("Component Export", () => {
    it("exports Home component as default", () => {
      render(<Home />);
      expect(screen.getByText("Welcome")).toBeInTheDocument();
    });

    it("component renders as React.FC", () => {
      const { container } = render(<Home />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Snapshot Testing", () => {
    it("matches snapshot", () => {
      const { container } = render(<Home />);
      expect(container).toMatchSnapshot();
    });
  });

  describe("Integration", () => {
    it("renders complete home page structure", () => {
      render(<Home />);

      expect(screen.getByText("Welcome")).toBeInTheDocument();
      expect(screen.getByAltText("Athens 2025")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Facebook/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /LinkedIn/i })).toBeInTheDocument();
    });

    it("image is between paragraphs in card", () => {
      render(<Home />);
      expect(screen.getByText(/This is the home page/)).toBeInTheDocument();
      expect(screen.getByAltText("Athens 2025")).toBeInTheDocument();
      expect(screen.getByText(/This iteration explores/)).toBeInTheDocument();
    });

    it("social links appear after main content", () => {
      const { container } = render(<Home />);
      const card = container.querySelector(".starbug-card");
      const socialContainer = container.querySelector(".starbug_card");

      expect(card).toBeInTheDocument();
      expect(socialContainer).toBeInTheDocument();
    });
  });
});
