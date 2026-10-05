import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Navigator from "./Navigator";

describe("Navigator", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("posts the marked time and displays the returned Julian day", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ julian_day: 2461311.5 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Navigator />);
    fireEvent.click(screen.getByRole("button", { name: /Get Julian Day/i }));

    const julianDayElement = await screen.findByText(/2461311.5/);
    expect(julianDayElement).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/julian_day",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );

    const requestOptions = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(requestOptions.body as string).datetime).toBeTruthy();
  });

  it("shows an API error when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "Invalid datetime" }),
      }),
    );

    render(<Navigator />);
    fireEvent.click(screen.getByRole("button", { name: /Get Julian Day/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid datetime");
  });
});
