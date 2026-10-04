import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import "react-datepicker/dist/react-datepicker.css";

const MARKED_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";
const DATE_PICKER_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

type KeyboardTimeInputProps = {
    date?: Date;
    value: string;
    onChange: (time: string) => void;
};

function KeyboardTimeInput({ date, value, onChange }: KeyboardTimeInputProps) {
    const displayedTime = date
        ? format(date, "HH:mm:ss")
        : value;

    return (
        <input
            type="time"
            step="1"
            value={displayedTime}
            onChange={(event) => onChange(event.currentTarget.value)}
        />
    );
}

function MarkTime({ timezone = "UTC" }: { timezone?: string }) {

    const [error, setError] = useState<string | null>(null);
    const [julianDay, setJulianDay] = useState<number | null>(null);
    const [timezoneIANA, setTimezoneIANA] = useState<string>(timezone);
    const [markedTime, setMarkedTime] = useState<string>(formatInTimeZone(new Date(), timezone, MARKED_TIME_FORMAT));

    async function handleJulianDay() {
        try {
            const response = await fetch("/api/julian_day", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ datetime: markedTime }),
            });
            const data: { julian_day?: number; error?: string } = await response.json();

            if (!response.ok || data.julian_day === undefined) {
                throw new Error(data.error ?? "Unable to retrieve Julian day");
            }

            setJulianDay(data.julian_day);

        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Request failed");
        }
    }

    function handleTimezoneChange(timezone: string) {
        setTimezoneIANA(timezone);
        setMarkedTime(formatInTimeZone(new Date(markedTime), timezone, MARKED_TIME_FORMAT));
    }

    function handleMarkCurrentTime() {
        const timestamp = formatInTimeZone(new Date(), timezoneIANA, MARKED_TIME_FORMAT);
        setMarkedTime(timestamp);
        setError(null);
    }

    function renderDatePicker() {
        const timeString = formatInTimeZone(new Date(markedTime), timezoneIANA, "HH:mm:ss");
        const selectedDate = toZonedTime(new Date(markedTime), timezoneIANA);
        const timezones = [
            "UTC",
            "America/New_York",
            "America/Los_Angeles",
            "America/Phoenix",
            "Europe/London",
            "Europe/Paris",
            "Asia/Tokyo",
            "Australia/Sydney"
        ];  // TODO from navigator timezones list

        return (
            <div className="navigator-control-row">
                <button
                    title="Mark Current Time"
                    onClick={handleMarkCurrentTime}
                >
                    Mark
                </button>

                <DatePicker
                    className="date-time-picker"
                    selected={selectedDate}
                    onChange={(date: Date | null) => {
                        if (date) {
                            const utcDate = fromZonedTime(date, timezoneIANA);
                            setMarkedTime(formatInTimeZone(utcDate, timezoneIANA, MARKED_TIME_FORMAT));
                        }
                    }}
                    showTimeInput
                    dateFormat={DATE_PICKER_FORMAT}
                    customTimeInput={React.createElement(KeyboardTimeInput, {
                        value: timeString,
                        onChange: (time: string) => {
                            const localDate = formatInTimeZone(new Date(markedTime), timezoneIANA, "yyyy-MM-dd");
                            const updatedDate = fromZonedTime(`${localDate}T${time}`, timezoneIANA);
                            setMarkedTime(formatInTimeZone(updatedDate, timezoneIANA, MARKED_TIME_FORMAT));
                        }
                    })}
                />
                <select
                    id="timezone-select"
                    value={timezoneIANA}
                    onChange={(e) => handleTimezoneChange(e.target.value)}
                >
                    {timezones.map((tz) => (
                        <option key={tz} value={tz}>
                            {tz}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    function renderJulianDay() {
        return (
            <div className="navigator-control-row">
                <button onClick={handleJulianDay}>
                    Julian Day
                </button>
                <span className="navigator-julian-day-value">
                    {julianDay !== null ? julianDay : "TBD"}
                </span>
            </div>
        );
    }

    return (
        <div>
            <div>
                {renderDatePicker()}
            </div>
            <div>
                <span>Marked Time: {markedTime}</span>
            </div>
            <div>
                {renderJulianDay()}
                {error && <div role="alert"><p>{error}</p></div>}
            </div>

            <div>
                <h2>References</h2>
                <ol>
                    <li>
                        <a href="https://aa.usno.navy.mil/data/JulianDate" target="_blank" rel="noopener noreferrer">
                            USN Julian Date Converter
                        </a>
                    </li>
                    <li>

                        <a href="https://en.wikipedia.org/wiki/Julian_day" target="_blank" rel="noopener noreferrer">
                            Wikipedia: Julian day
                        </a>
                    </li>
                </ol>
            </div>
        </div>
    );
}

export const Navigator: React.FC = () => {
  return (
    <div className="starbug-div">
      <div>
        <h1>Navigator</h1>
      </div>
      <div className="starbug-card">
        <MarkTime timezone="UTC"/>
      </div>
    </div>
  );
};

export default Navigator;
