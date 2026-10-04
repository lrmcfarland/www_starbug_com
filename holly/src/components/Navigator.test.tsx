import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Navigator from "./Navigator";

describe("Navigator", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("accepts keyboard changes in the datepicker time input", async () => {
    const { container } = render(<Navigator />);
    fireEvent.click(screen.getByRole("textbox"));

    const timeInput = container.querySelector<HTMLInputElement>('input[type="time"]');
    if (!timeInput) {
      throw new Error("Datepicker time input was not rendered");
    }

    const initialTime = screen.getByText(/^Selected time \(/).textContent;

    // Determine a different time than current
    const newTime = timeInput.value === "23:59" ? "00:01" : "23:59";

    // Directly set the input value and trigger change event
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(timeInput, newTime);
    fireEvent.change(timeInput, { target: { value: newTime } });

    // The selected timestamp should change when the time changes.
    await waitFor(() => {
      const newTime = screen.getByText(/^Selected time \(/).textContent;
      expect(newTime).not.toBe(initialTime);
    }, { timeout: 1000 });
  });

  it("updates markedTime to the selected timezone without changing the instant", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:34:56.789Z"));

    const { container } = render(<Navigator />);

    const markedTime = () => screen.getByText(/^Selected time \(/).textContent?.split(": ").slice(1).join(": ");
    const originalTimestamp = markedTime();
    const originalInstant = new Date(originalTimestamp!).getTime();

    fireEvent.click(screen.getByRole("textbox"));
    const timeInput = container.querySelector<HTMLInputElement>('input[type="time"]');
    expect(timeInput).toHaveValue("04:34:56");

    fireEvent.change(screen.getByRole("combobox", { name: /Select Timezone/i }), {
      target: { value: "Asia/Tokyo" },
    });

    const updatedTimestamp = markedTime();
    expect(updatedTimestamp).toContain("+09:00");
    expect(new Date(updatedTimestamp!).getTime()).toBe(originalInstant);
    expect(screen.getByText(/^Selected time \(/)).toHaveTextContent("Selected time (Asia/Tokyo)");
    expect(timeInput).toHaveValue("21:34:56");
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
