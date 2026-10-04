import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type KeyboardTimeInputProps = {
    date?: Date;
    value: string;
    onChange: (time: string) => void;
};

function KeyboardTimeInput({ value, onChange }: KeyboardTimeInputProps) {
    return (
        <input
            type="time"
            step="1"
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
        />
    );
}

function MarkTime() {

    const [error, setError] = useState<string | null>(null);
    const [julianDay, setJulianDay] = useState<number | null>(null);
    const [markedTime, setMarkedTime] = useState<string>(new Date().toISOString());
    const [timezoneIANA, setTimezoneIANA] = useState<string>("America/Los_Angeles");

    function handleMarkCurrentTime() {
        const timestamp = new Date().toISOString();
        setMarkedTime(timestamp);
        setError(null);
        console.log(`Marked time at ${timestamp}`);
    }

    function renderTimezoneSelect() {
        const timezones = [
            "UTC",
            "America/New_York",
            "America/Los_Angeles",
            "America/Phoenix",
            "Europe/London",
            "Europe/Paris",
            "Asia/Tokyo",
            "Australia/Sydney"
        ];

        return (
            <div>
                <label htmlFor="timezone-select">Select Timezone: </label>
                <select
                    id="timezone-select"
                    value={timezoneIANA}
                    onChange={(e) => setTimezoneIANA(e.target.value)}
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

    async function handleGetJulianDay() {
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

    function renderJulianDay() {
        const julianDayLink = (
            <a href="https://en.wikipedia.org/wiki/Julian_day" target="_blank" rel="noopener noreferrer">
                Julian day
            </a>
        );

        if (julianDay === null) {
            return <p>{julianDayLink}:</p>;
        } else {
            return <p>{julianDayLink}: {julianDay}</p>;
        }
    }

    function renderDatePicker() {
        // Extract HH:mm from ISO string (which is in UTC)
        const timeString = markedTime.slice(11, 16);

        return (
            <div>
                <DatePicker
                    className="date-time-picker"
                    selected={new Date(markedTime)}
                    onChange={(date: Date | null) => date && setMarkedTime(date.toISOString())}
                    showTimeInput
                    dateFormat="yyyy-MM-dd HH:mm:ss XXX"
                    customTimeInput={React.createElement(KeyboardTimeInput, {
                        value: timeString,
                        onChange: (time: string) => {
                            const [hours, minutes] = time.split(':');
                            const newDate = new Date(markedTime);
                            newDate.setUTCHours(parseInt(hours), parseInt(minutes), 0);
                            setMarkedTime(newDate.toISOString());
                        }
                    })}
                    timeZone={timezoneIANA}
                />
            </div>
        );
    }

    return (
        <div>
            <div>
                {renderTimezoneSelect()}
            </div>
            <div>
                <button onClick={handleMarkCurrentTime}>
                    Mark Current Time
                </button>

                {renderDatePicker()}

                <button onClick={handleGetJulianDay}>
                    Get Julian Day
                </button>
            </div>
            <div><p>UTC: {markedTime}</p></div>
            <div>
                {renderJulianDay()}
                {error && <div role="alert"><p>{error}</p></div>}
            </div>

            <p>
                For more information, visit the {" "}
                <a href="https://en.wikipedia.org/wiki/Julian_day" target="_blank" rel="noopener noreferrer">
                    Julian day Wikipedia page
                </a>
                {" "} or the {" "}
                <a href="https://aa.usno.navy.mil/data/JulianDate" target="_blank" rel="noopener noreferrer">
                    USN Julian Date Converter
                </a>
            </p>
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
        <MarkTime />
      </div>
    </div>
  );
};

export default Navigator;
