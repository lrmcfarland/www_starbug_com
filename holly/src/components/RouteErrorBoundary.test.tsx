import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { RouteErrorBoundary } from "./RouteErrorBoundary";

const FailedRoute = () => {
  throw new Error("Failed to fetch dynamically imported module");
};

describe("RouteErrorBoundary", () => {
  it("offers a refresh when a route fails to load", () => {
    const router = createMemoryRouter([
      {
        path: "/",
        element: <FailedRoute />,
        errorElement: <RouteErrorBoundary />,
      },
    ]);

    render(<RouterProvider router={router} />);

    expect(
      screen.getByRole("heading", { name: /page couldn't load/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /refresh page/i })
    ).toBeInTheDocument();
  });
});
