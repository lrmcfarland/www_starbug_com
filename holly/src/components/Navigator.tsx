import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MarkTime() {

    const [markedTime, setmarkedTime] = useState<string>(new Date().toISOString());
    const [julianDay, setJulianDay] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    function handleMarkCurrentTime() {
        const timestamp = new Date().toISOString();
        setmarkedTime(timestamp);
        setError(null);
        console.log(`Marked time at ${timestamp}`);
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
                <button onClick={handleMarkCurrentTime}>
                    Mark Current Time
                </button>
            
                <DatePicker
                className="date-time-picker"
                selected={new Date(markedTime)}
                onChange={(date: Date | null) => date && setmarkedTime(date.toISOString())}
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
