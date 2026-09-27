import React, { useState } from "react";

function MarkTime({ message }: { message: string }) {

    const [markedTime, setmarkedTime] = useState<string>(new Date().toISOString());
    const [julianDay, setJulianDay] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleJulianDayClick() {
        const timestamp = new Date().toISOString();
        setmarkedTime(timestamp);
        setError(null);
        console.log(`${message} at ${timestamp}`);

        try {
            const response = await fetch("/api/julian_day", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ datetime: timestamp }),
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
    return (
        <>
            <p>Click the button to mark the current time and get the corresponding
                <a href="https://en.wikipedia.org/wiki/Julian_day" target="_blank" rel="noopener noreferrer">
                    Julian day
                </a>
                . See also
                <a href="https://aa.usno.navy.mil/data/JulianDate" target="_blank" rel="noopener noreferrer">
                    USN Julian Date Converter
                </a>
            </p>
            <button onClick={handleJulianDayClick}>
                Get Julian Day
            </button>
            <button onClick={() => setJulianDay(null)}>
                Clear Julian Day
            </button>
            <div>
                <div><p>Marked time: {markedTime}</p></div>
                {julianDay !== null && <div><p>Julian day: {julianDay}</p></div>}
                {error && <div role="alert"><p>{error}</p></div>}
            </div>
        </>
    );
}

export const Navigator: React.FC = () => {
  return (
    <div className="starbug-div">
      <div>
        <h1>Navigator</h1>
      </div>
      <div className="starbug-card">
        <MarkTime message="Mark Time" />
      </div>
    </div>
  );
};

export default Navigator;
