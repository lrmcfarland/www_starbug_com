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

    const [julianDayError, setJulianDayError] = useState<string | null>(null);
    const [gmstError, setGmstError] = useState<string | null>(null);
    const [gastError, setGastError] = useState<string | null>(null);
    const [timezoneError, setTimezoneError] = useState<string | null>(null);

    const [currentTimezone, setCurrentTimezone] = useState<string>(timezone);
    const [ianaTimezones, setIanaTimezones] = useState<TimezoneGroup[]>([]);
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");

    const [markedTime, setMarkedTime] = useState<string>(formatInTimeZone(new Date(), timezone, MARKED_TIME_FORMAT));
    const [julianDay, setJulianDay] = useState<{ timestamp: number; value: number } | null>(null);
    const [gmst, setGmst] = useState<{ timestamp: number; value: number } | null>(null);
    const [gast, setGast] = useState<{ timestamp: number; value: number } | null>(null);


    useEffect(() => {
        getIANAtimezones();
    }, []);

    useEffect(() => {
        let isCurrentRequest = true;
        void fetchJulianDay(markedTime, () => isCurrentRequest);
        void fetchGMST(markedTime, () => isCurrentRequest);
        void fetchGAST(markedTime, () => isCurrentRequest);

        return () => {
            isCurrentRequest = false;
        };
    }, [markedTime]);

    function handleTimezoneChange(timezone: string) {
        setCurrentTimezone(timezone);
        setMarkedTime(formatInTimeZone(new Date(markedTime), timezone, MARKED_TIME_FORMAT));
    }

    function handleMarkCurrentTime() {
        const timestamp = formatInTimeZone(new Date(), currentTimezone, MARKED_TIME_FORMAT);
        setMarkedTime(timestamp);
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

    async function fetchJulianDay(datetime: string, isCurrentRequest: () => boolean = () => true) {
        try {
            const response = await fetch("/api/julian_day", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ datetime }),
            });
            const data: { julian_day?: number; error?: string } = await response.json();

            if (!response.ok || data.julian_day === undefined) {
                throw new Error(data.error ?? "Unable to retrieve Julian day");
            }

            if (isCurrentRequest()) {
                setJulianDay({ timestamp: new Date(datetime).getTime(), value: data.julian_day });
                setJulianDayError(null);
            }

        } catch (requestError) {
            if (isCurrentRequest()) {
                setJulianDayError(requestError instanceof Error ? requestError.message : "Request failed");
            }
        }
    }

    async function fetchGMST(datetime: string, isCurrentRequest: () => boolean = () => true) {
        try {
            const response = await fetch("/api/gmst", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ datetime }),
            });
            const data: { gmst?: number; error?: string } = await response.json();

            if (!response.ok || data.gmst === undefined) {
                throw new Error(data.error ?? "Unable to retrieve GMST");
            }

            if (isCurrentRequest()) {
                setGmst({ timestamp: new Date(datetime).getTime(), value: data.gmst });
                setGmstError(null);
            }

        } catch (requestError) {
            if (isCurrentRequest()) {
                setGmstError(requestError instanceof Error ? requestError.message : "Request failed");
            }
        }
    }

    async function fetchGAST(datetime: string, isCurrentRequest: () => boolean = () => true) {
        try {
            const response = await fetch("/api/gast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ datetime }),
            });
            const data: { gast?: number; error?: string } = await response.json();

            if (!response.ok || data.gast === undefined) {
                throw new Error(data.error ?? "Unable to retrieve GAST");
            }

            if (isCurrentRequest()) {
                setGast({ timestamp: new Date(datetime).getTime(), value: data.gast });
                setGastError(null);
            }

        } catch (requestError) {
            if (isCurrentRequest()) {
                setGastError(requestError instanceof Error ? requestError.message : "Request failed");
            }
        }
    }

    return (
        <div>
            <div>
                {renderDatePicker()}
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
            <div>
                <table className="navigator-data-table">
                    <tbody>
                        <tr>
                            <th scope="row">Marked Time</th>
                            <td>{markedTime}</td>
                            <td><a href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noopener noreferrer">ISO 8601</a></td>
                        </tr>
                        <tr>
                            <th scope="row">Julian Day</th>
                            <td className="navigator-julian-day-value">
                                {julianDay?.timestamp === new Date(markedTime).getTime() ? julianDay.value : "TBD"}
                            </td>
                            <td>days</td>
                        </tr>
                        <tr>
                            <th title="Greenwich Mean Sidereal Time" scope="row">GMST</th>
                            <td className="navigator-gmst-value">
                                {gmst?.timestamp === new Date(markedTime).getTime() ? gmst.value : "TBD"}
                            </td>
                            <td>hours</td>
                        </tr>
                        <tr>
                            <th title="Greenwich Apparent Sidereal Time" scope="row">GAST</th>
                            <td className="navigator-gast-value">
                                {gast?.timestamp === new Date(markedTime).getTime() ? gast.value : "TBD"}
                            </td>
                            <td>hours</td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    {(julianDayError || gmstError || gastError) && (
                        <div role="alert">
                            Error Messages:
                            <p>
                                {julianDayError || gmstError || gastError}
                            </p>
                        </div>
                    )}
                </div>
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
                            <a href="https://en.wikipedia.org/wiki/Astronomical_coordinate_system" target="_blank" rel="noopener noreferrer">
                                Wikipedia: Astronomical coordinate system
                            </a>
                        </li>
                        <li>
                            <a href="https://en.wikipedia.org/wiki/Geographic_coordinate_system" target="_blank" rel="noopener noreferrer">
                                Wikipedia: Geographic coordinate system
                            </a>
                        </li>
                        <li>
                            <a href="https://en.wikipedia.org/wiki/Julian_day" target="_blank" rel="noopener noreferrer">
                                Wikipedia: Julian day
                            </a>
                        </li>
                        <li>
                            <a href="https://en.wikipedia.org/wiki/Sidereal_time" target="_blank" rel="noopener noreferrer">
                                Wikipedia: Sidereal time
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
