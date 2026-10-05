import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import "react-datepicker/dist/react-datepicker.css";

const MARKED_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";

type KeyboardTimeInputProps = {
    date?: Date;
    timeZone: string;
    value: string;
    onChange: (time: string) => void;
};

function KeyboardTimeInput({ date, timeZone, value, onChange }: KeyboardTimeInputProps) {
    const displayedTime = date
        ? formatInTimeZone(date, timeZone, "HH:mm:ss")
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

function MarkTime() {

    const [error, setError] = useState<string | null>(null);
    const [julianDay, setJulianDay] = useState<number | null>(null);
    const [markedTime, setMarkedTime] = useState<string>(new Date().toISOString());
    const [timezoneIANA, setTimezoneIANA] = useState<string>("UTC");

    function handleTimezoneChange(timezone: string) {
        setTimezoneIANA(timezone);
        setMarkedTime(formatInTimeZone(new Date(markedTime), timezone, MARKED_TIME_FORMAT));
    }

    function handleMarkCurrentTime() {
        const timestamp = formatInTimeZone(new Date(), timezoneIANA, MARKED_TIME_FORMAT);
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
                <label htmlFor="timezone-select">Timezone: </label>
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

        return (
            <div>
                <button onClick={handleGetJulianDay}>
                    Get Julian Day
                </button>
                {julianDayLink}: {julianDay !== null ? julianDay : "TBD"}
            </div>
        );
    }

    function renderDatePicker() {
        const timeString = formatInTimeZone(new Date(markedTime), timezoneIANA, "HH:mm:ss");

        return (
            <div>
                <button onClick={handleMarkCurrentTime}>
                    Mark Current Time
                </button>

                <DatePicker
                    className="date-time-picker"
                    selected={new Date(markedTime)}
                    onChange={(date: Date | null) => date && setMarkedTime(formatInTimeZone(date, timezoneIANA, MARKED_TIME_FORMAT))}
                    showTimeInput
                    dateFormat={MARKED_TIME_FORMAT}
                    customTimeInput={React.createElement(KeyboardTimeInput, {
                        timeZone: timezoneIANA,
                        value: timeString,
                        onChange: (time: string) => {
                            const localDate = formatInTimeZone(new Date(markedTime), timezoneIANA, "yyyy-MM-dd");
                            const updatedDate = fromZonedTime(`${localDate}T${time}`, timezoneIANA);
                            setMarkedTime(formatInTimeZone(updatedDate, timezoneIANA, MARKED_TIME_FORMAT));
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
                {renderDatePicker()}
            </div>
            <div>
                {renderTimezoneSelect()}
            </div>
            <div><p>Time: {markedTime} ({timezoneIANA})</p></div>
            <div>
                {renderJulianDay()}
                {error && <div role="alert"><p>{error}</p></div>}
            </div>

            <div>
                <h2>References</h2>
                <ol>
                    <li>
                        <a href="https://www.epochconverter.com/" target="_blank" rel="noopener noreferrer">
                            Epoch Converter
                        </a>
                    </li>
                    <li>
                        <a href="https://www.iana.org/time-zones" target="_blank" rel="noopener noreferrer">
                            IANA Time Zone Database
                        </a>
                    </li>
                    <li>
                        <a href="https://www.timeanddate.com/worldclock/converter.html" target="_blank" rel="noopener noreferrer">
                            Time Zone Converter
                        </a>
                    </li>
                    <li>
                        <a href="https://www.timeanddate.com/time/zones/" target="_blank" rel="noopener noreferrer">
                            Time Zone List
                        </a>
                    </li>
                    <li>
                        <a href="https://aa.usno.navy.mil/data/JulianDate" target="_blank" rel="noopener noreferrer">
                            USN Julian Date Converter
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
        <MarkTime />
      </div>
    </div>
  );
};

export default Navigator;
