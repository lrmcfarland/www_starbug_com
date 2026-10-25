import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import "react-datepicker/dist/react-datepicker.css";
import { CascadeSelect } from 'primereact/cascadeselect';

const MARKED_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";
const DATE_PICKER_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

type KeyboardTimeInputProps = {
    value: string;
    onChange: (time: string) => void;
};

type TimezoneGroup = {
    zone: string;
    zones: { city: string; code: string }[];
};

function isTimezoneGroups(value: unknown): value is TimezoneGroup[] {
    return (
        Array.isArray(value) &&
        value.every(
            (group) =>
                typeof group.zone === "string" &&
                Array.isArray(group.zones) &&
                group.zones.every(
                    (timezone: unknown) =>
                        typeof timezone === "object" &&
                        timezone !== null &&
                        "city" in timezone &&
                        typeof timezone.city === "string" &&
                        "code" in timezone &&
                        typeof timezone.code === "string",
                ),
        )
    );
}

function KeyboardTimeInput({ value, onChange }: KeyboardTimeInputProps) {
    const displayedTime = value;

    return (
        <input
            type="time"
            step="1"
            value={displayedTime}
            onChange={(event) => onChange(event.currentTarget.value)}
        />
    );
}

function Location({ timezone = "UTC" }: { timezone?: string }) {

    const [error, setError] = useState<string | null>(null);
    const [timezoneError, setTimezoneError] = useState<string | null>(null);
    const [julianDay, setJulianDay] = useState<{ timestamp: number; value: number } | null>(null);
    const [ianaTimezones, setIanaTimezones] = useState<TimezoneGroup[]>([]);
    const [currentTimezone, setCurrentTimezone] = useState<string>(timezone);
    const [markedTime, setMarkedTime] = useState<string>(formatInTimeZone(new Date(), timezone, MARKED_TIME_FORMAT));
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");

    useEffect(() => {
        getIANAtimezones();
    }, []);

    function handleTimezoneChange(timezone: string) {
        setCurrentTimezone(timezone);
        setMarkedTime(formatInTimeZone(new Date(markedTime), timezone, MARKED_TIME_FORMAT));
    }

    function handleMarkCurrentTime() {
        const timestamp = formatInTimeZone(new Date(), currentTimezone, MARKED_TIME_FORMAT);
        setMarkedTime(timestamp);
        setError(null);
    }

    async function getIANAtimezones() {
        try {
            const response = await fetch("/api/timezones", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data: unknown = await response.json();

            if (!response.ok || !isTimezoneGroups(data)) {
                throw new Error("Unable to retrieve timezones");
            }

            setIanaTimezones(data);
        } catch (error) {
            console.error("Error fetching timezones:", error);
            setTimezoneError("Unable to load timezones.");
        }
    }

    function renderDatePicker() {
        const timeString = formatInTimeZone(new Date(markedTime), currentTimezone, "HH:mm:ss");
        const selectedDate = toZonedTime(new Date(markedTime), currentTimezone);

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
                            const utcDate = fromZonedTime(date, currentTimezone);
                            setMarkedTime(formatInTimeZone(utcDate, currentTimezone, MARKED_TIME_FORMAT));
                        }
                    }}
                    showTimeInput
                    dateFormat={DATE_PICKER_FORMAT}
                    customTimeInput={React.createElement(KeyboardTimeInput, {
                        value: timeString,
                        onChange: (time: string) => {
                            const localDate = formatInTimeZone(new Date(markedTime), currentTimezone, "yyyy-MM-dd");
                            const updatedDate = fromZonedTime(`${localDate}T${time}`, currentTimezone);
                            setMarkedTime(formatInTimeZone(updatedDate, currentTimezone, MARKED_TIME_FORMAT));
                        }
                    })}
                />
                <CascadeSelect
                    value={currentTimezone}
                    options={ianaTimezones}
                    optionLabel="city"
                    optionValue="code"
                    optionGroupLabel="zone"
                    optionGroupChildren={["zones"]}
                    onChange={(tz: { value: string }) => handleTimezoneChange(tz.value)}
                    placeholder="Select a City"
                    className="navigator-timezone-select"
                />
                {timezoneError && <div role="alert">{timezoneError}</div>}
            </div>
        );
    }

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

            setJulianDay({ timestamp: new Date(markedTime).getTime(), value: data.julian_day });
            setError(null);

        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Request failed");
        }
    }

    function renderJulianDay() {
        return (
            <div className="navigator-control-row">
                <button onClick={handleJulianDay}>
                    Julian Day
                </button>
                <span className="navigator-julian-day-value">
                    {julianDay?.timestamp === new Date(markedTime).getTime() ? julianDay.value : "TBD"}
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
            <div className="navigator-control-row navigator-location-row">
                <label>
                    Latitude
                    <input
                        className="navigator-location-input"
                        type="number"
                        min="-90"
                        max="90"
                        step="any"
                        value={latitude}
                        onChange={(event) => setLatitude(event.currentTarget.value)}
                        placeholder="e.g. 37.7749"
                    />
                </label>

                <label>
                    Longitude
                    <input
                        className="navigator-location-input"
                        type="number"
                        min="-180"
                        max="180"
                        step="any"
                        value={longitude}
                        onChange={(event) => setLongitude(event.currentTarget.value)}
                        placeholder="e.g. -122.4194"
                    />
                </label>
            </div>
        </div>
    );
}

export const Navigator: React.FC = () => {
  return (
    <div className="navigator-container">
        <div className="starbug-div">
            <div>
                <h1>Navigator</h1>
            </div>

            <div className="starbug-card">
                <Location timezone="UTC"/>
            </div>

            <div className="starbug-card">
                <div>
                    <h2>References</h2>
                    <ol>
                        <li>
                            <a href="https://www.iana.org/time-zones" target="_blank" rel="noopener noreferrer">
                                IANA Time Zone Database
                            </a>
                        </li>
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
        </div>
    </div>
  );
};

export default Navigator;
