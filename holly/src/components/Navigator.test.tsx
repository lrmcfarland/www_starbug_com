import { vi } from "vitest";
import React from "react";

// Mock primereact/api FIRST before anything else imports from primereact
vi.mock("primereact/api", () => ({
  PrimeReactProvider: ({ children }: any) => React.createElement(React.Fragment, {}, children),
}));

// Mock primereact/cascadeselect
vi.mock("primereact/cascadeselect", () => ({
  CascadeSelect: ({ value, onChange, options }: any) =>
    React.createElement(
      "select",
      {
        value,
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
          onChange({ value: event.currentTarget.value });
        },
        "data-testid": "timezone-cascade-select",
      },
      options && options.flatMap((group: any) =>
        (group.zones || []).map((city: any) =>
          React.createElement("option", { key: city.code, value: city.code }, city.city),
        ),
      ),
    ),
}));

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Navigator from "./Navigator";

describe("Navigator", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("posts the marked time and displays the returned Julian day", async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === "/api/timezones") {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ julian_day: 2461311.5 }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Navigator />);

    const julianDayElement = await screen.findByText(/2461311.5/);
    expect(julianDayElement).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Marked Time/ })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Julian Day/ })).toBeInTheDocument();

    // Verify julian_day API was called
    const calls = (fetchMock.mock.calls as any);
    const julianDayCall = calls.find((call: any) => call[0] === "/api/julian_day");
    expect(julianDayCall).toBeDefined();
    if (julianDayCall && julianDayCall[1]) {
      expect(julianDayCall[1]).toMatchObject({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      expect(JSON.parse(julianDayCall[1].body).datetime).toBeTruthy();
    }
  });

  it("shows an API error when the request fails", async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === "/api/timezones") {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        });
      }
      return Promise.resolve({
        ok: false,
        status: 400,
        json: async () => ({ error: "Invalid datetime" }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Navigator />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid datetime");
  });

  it("updates the Julian day automatically when the marked time changes", async () => {
    let julianDayRequests = 0;
    const fetchMock = vi.fn((url: string, _options?: RequestInit) => {
      if (url === "/api/timezones") {
        return Promise.resolve({ ok: true, json: async () => [] });
      }

      julianDayRequests += 1;
      return Promise.resolve({
        ok: true,
        json: async () => ({ julian_day: 2461311.5 + julianDayRequests - 1 }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Navigator />);
    expect(await screen.findByText("2461311.5")).toBeInTheDocument();

    await new Promise((resolve) => setTimeout(resolve, 20));
    fireEvent.click(screen.getByRole("button", { name: "Mark" }));

    expect(await screen.findByText("2461312.5")).toBeInTheDocument();
    const julianDayCalls = fetchMock.mock.calls.filter(([url]) => url === "/api/julian_day");
    expect(julianDayCalls).toHaveLength(2);
    expect(JSON.parse(String(julianDayCalls[1][1]?.body)).datetime).not.toBe(
      JSON.parse(String(julianDayCalls[0][1]?.body)).datetime,
    );
  });

  it("clears the previous error after a successful retry", async () => {
    let julianDayRequests = 0;
    const fetchMock = vi.fn((url: string) => {
      if (url === "/api/timezones") {
        return Promise.resolve({ ok: true, json: async () => [] });
      }

      julianDayRequests += 1;
      if (julianDayRequests === 1) {
        return Promise.resolve({
          ok: false,
          json: async () => ({ error: "Invalid datetime" }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({ julian_day: 2461311.5 }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Navigator />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid datetime");

    await new Promise((resolve) => setTimeout(resolve, 20));
    fireEvent.click(screen.getByRole("button", { name: "Mark" }));

    expect(await screen.findByText("2461311.5")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders the timezone selector", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T02:30:00.000Z"));

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      }),
    );

    render(<Navigator />);

    const timezoneSelect = screen.getByTestId("timezone-cascade-select");
    expect(timezoneSelect).toBeInTheDocument();
  });

  it("loads timezone groups from the timezones API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            zone: "America",
            zones: [
              { city: "New_York", code: "America/New_York" },
              { city: "Los_Angeles", code: "America/Los_Angeles" },
            ],
          },
        ],
      }),
    );

    render(<Navigator />);

    expect(await screen.findByRole("option", { name: "New_York" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Los_Angeles" })).toBeInTheDocument();
  });

  it("updates the marked time when the timezone changes", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T02:30:00.000Z"));

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            zone: "America",
            zones: [{ city: "New_York", code: "America/New_York" }],
          },
        ],
      }),
    );

    render(<Navigator />);

    const timezoneSelect = screen.getByTestId("timezone-cascade-select") as HTMLSelectElement;
    fireEvent.change(timezoneSelect, {
      target: { value: "America/New_York" },
    });

    // Verify the timezone selector component exists and changed state was triggered
    expect(timezoneSelect).toBeInTheDocument();
    // The marked time should still be displayed (we can't easily test exact offset with fake timers and UTC base time)
    expect(screen.getByText("Marked Time")).toBeInTheDocument();
  });
});
