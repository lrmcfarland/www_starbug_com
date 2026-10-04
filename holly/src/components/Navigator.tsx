import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MarkTime() {

    const [error, setError] = useState<string | null>(null);
    const [julianDay, setJulianDay] = useState<number | null>(null);
    const [markedTime, setMarkedTime] = useState<string>(new Date().toISOString());
    const [timezoneOffset, setTimezoneOffset] = useState<number>(new Date().getTimezoneOffset());

    function handleMarkCurrentTime() {
        const timestamp = new Date().toISOString();
        setMarkedTime(timestamp);
        setError(null);
        console.log(`Marked time at ${timestamp}`);
    }

    function handleTimezoneChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newOffset = parseInt(event.target.value, 10);
        if (!isNaN(newOffset)) {
            setTimezoneOffset(newOffset);
        }
    }

    function renderTimezoneInput() {
        return (
            <div>
                <label htmlFor="timezone-offset">Timezone Offset (minutes): </label>
                <input
                    id="timezone-offset"
                    type="number"
                    value={timezoneOffset}
                    onChange={handleTimezoneChange}
                />
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

    return (
        <div>
            <div>
                {renderTimezoneInput()}
            </div>
            <div>
                <button onClick={handleMarkCurrentTime}>
                    Mark Current Time
                </button>
            
                <DatePicker
                className="date-time-picker"
                selected={new Date(markedTime)}
                onChange={(date: Date | null) => date && setMarkedTime(date.toISOString())}
                showTimeInput
                dateFormat="yyyy-MM-dd HH:mm:ss XXX"

                customTimeInput={
                    <input
                    type="time"
                    step="1"
                    style={{}} 
                    />
                }
                />
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
