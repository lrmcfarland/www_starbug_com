import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import "react-datepicker/dist/react-datepicker.css";
import { CascadeSelect } from "primereact/cascadeselect";

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

type Measurement = { value: number; units: string };
type TimestampedMeasurement = Measurement & { timestamp: number };

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

function getRequestErrorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return "Navigator service is unavailable. Please check your connection and try again.";
  }

  if (error instanceof SyntaxError) {
    return "Navigator service returned an unexpected response. Please check that the service is running and try again.";
  }

  return error instanceof Error ? error.message : "Request failed";
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

/**
 * Converts a decimal coordinate into Degrees, Minutes, and Seconds (DMS).
 */
interface DMS {
  degrees: number;
  minutes: number;
  seconds: number;
}

interface FormatOptions {
  decimalPlaces?: number;
  hourFormat?: boolean; // Format as hours, minutes, and seconds instead of degrees, minutes, and seconds
}

/**
 * Converts a decimal coordinate into Degrees, Minutes, and Seconds (DMS).
 */
function decimalToDMS(decimal: number, options: FormatOptions = {}): DMS {
  const decimalPlaces = options.decimalPlaces ?? 2;
  const absolute = Math.abs(decimal);

  const degrees = Math.floor(absolute);

  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);

  // Calculate seconds and fix floating point precision based on desired decimal places
  const secondsRaw = (minutesNotTruncated - minutes) * 60;
  const multiplier = Math.pow(10, decimalPlaces);
  const seconds = Math.round(secondsRaw * multiplier) / multiplier;

  const signedDegrees = decimal < 0 ? -degrees : degrees;

  return { degrees: signedDegrees, minutes, seconds };
}

/**
 * Formats a DMS object into a zero-padded string: DD°MM'SS.SS"
 */
function formatDMSString(dms: DMS, options: FormatOptions = {}): string {
  const decimalPlaces = options.decimalPlaces ?? 2;

  // Separate the sign from degrees for padding calculation
  const isNegative = dms.degrees < 0;
  const absDegrees = Math.abs(dms.degrees);

  // Pad degrees to 2 digits, minutes to 2 digits
  const padDegrees = String(absDegrees).padStart(2, "0");
  const padMinutes = String(dms.minutes).padStart(2, "0");

  // Format seconds with fixed decimal places, then pad the whole number part to 2 digits
  const secondsStr = dms.seconds.toFixed(decimalPlaces);
  const [wholeSeconds, fractionalSeconds] = secondsStr.split(".");
  const padWholeSeconds = wholeSeconds.padStart(2, "0");

  // Reconstruct seconds string depending on if there are decimal places
  const padSeconds = fractionalSeconds
    ? `${padWholeSeconds}.${fractionalSeconds}`
    : padWholeSeconds;
  const sign = isNegative ? "-" : "";

  if (options.hourFormat) {
    return `${sign}${padDegrees}:${padMinutes}:${padSeconds} h:m:s`;
  } else {
    return `${sign}${padDegrees}°${padMinutes}'${padSeconds}"`;
  }
}

/**
 * Formats a decimal precision.
 */
function formatDecimal(
  decimal: number,
  units: string,
  options: FormatOptions = {},
): string {
  const decimalPlaces = options.decimalPlaces ?? 2;
  const decimalStr = decimal.toFixed(decimalPlaces);
  return `${decimalStr} ${units}`;
}

function formatSiderealMeasurement(
  measurement: Measurement,
  isDMSFormat: boolean,
  options: FormatOptions = {},
): string {
  if (!isDMSFormat) {
    return formatDecimal(measurement.value, measurement.units, options);
  }

  return formatDMSString(
    decimalToDMS(measurement.value, options),
    options,
  );
}

type LocationDisplayProps = {
  markedTime: string;
  handleMarkCurrentTime: () => void;
  selectedDate: Date;
  timeString: string;
  currentTimezone: string;
  ianaTimezones: TimezoneGroup[];
  handleTimezoneChange: (timezone: string) => void;
  setMarkedTime: (value: string) => void;
  latitude: string;
  longitude: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
};

function LocationDisplay({
  markedTime,
  handleMarkCurrentTime,
  selectedDate,
  timeString,
  currentTimezone,
  ianaTimezones,
  handleTimezoneChange,
  setMarkedTime,
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
}: LocationDisplayProps) {
  return (
    <>
      <div className="navigator-location-header">
        <h2>Location</h2>
      </div>
      <div className="navigator-location-content">
        <table className="navigator-location-table">
          <tbody>
            <tr>
              <th scope="row">
                <button
                  title="Mark Current Time"
                  onClick={handleMarkCurrentTime}
                >
                  Mark
                </button>
              </th>
              <td>
                <DatePicker
                  className="date-time-picker"
                  selected={selectedDate}
                  onChange={(date: Date | null) => {
                    if (date) {
                      const utcDate = fromZonedTime(date, currentTimezone);
                      setMarkedTime(
                        formatInTimeZone(
                          utcDate,
                          currentTimezone,
                          MARKED_TIME_FORMAT,
                        ),
                      );
                    }
                  }}
                  showTimeInput
                  dateFormat={DATE_PICKER_FORMAT}
                  customTimeInput={React.createElement(KeyboardTimeInput, {
                    value: timeString,
                    onChange: (time: string) => {
                      const localDate = formatInTimeZone(
                        new Date(markedTime),
                        currentTimezone,
                        "yyyy-MM-dd",
                      );
                      const updatedDate = fromZonedTime(
                        `${localDate}T${time}`,
                        currentTimezone,
                      );
                      setMarkedTime(
                        formatInTimeZone(
                          updatedDate,
                          currentTimezone,
                          MARKED_TIME_FORMAT,
                        ),
                      );
                    },
                  })}
                />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="navigator-timezone">Timezone</label>
              </th>
              <td>
                <CascadeSelect
                  value={currentTimezone}
                  options={ianaTimezones}
                  optionLabel="city"
                  optionValue="code"
                  optionGroupLabel="zone"
                  optionGroupChildren={["zones"]}
                  onChange={(tz: { value: string }) =>
                    handleTimezoneChange(tz.value)
                  }
                  placeholder="Select a City"
                  className="navigator-timezone-select"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">Latitude</th>
              <td>
                <input
                  className="navigator-location-input"
                  type="number"
                  min="-90"
                  max="90"
                  step="any"
                  value={latitude}
                  onChange={(event) =>
                    onLatitudeChange(event.currentTarget.value)
                  }
                  placeholder="e.g. 37.7749"
                />
              </td>
              <td>degrees</td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="navigator-longitude">Longitude</label>
              </th>
              <td>
                <input
                  id="navigator-longitude"
                  className="navigator-location-input"
                  type="number"
                  min="-180"
                  max="180"
                  step="any"
                  value={longitude}
                  onChange={(event) =>
                    onLongitudeChange(event.currentTarget.value)
                  }
                  placeholder="e.g. -122.4194"
                />
              </td>
              <td>degrees</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

type SiderealTimeDisplayProps = {
  markedTime: string;
  julianDay: TimestampedMeasurement | null;
  gmst: TimestampedMeasurement | null;
  lmst: TimestampedMeasurement | null;
  gast: TimestampedMeasurement | null;
  last: TimestampedMeasurement | null;
  era: TimestampedMeasurement | null;
  decimalPlaces: number;
  isDMSFormat: boolean;
};

function SiderealTimeDisplay({
  markedTime,
  julianDay,
  gmst,
  lmst,
  gast,
  last,
  era,
  decimalPlaces,
  isDMSFormat,
}: SiderealTimeDisplayProps) {
  const markedTimestamp = new Date(markedTime).getTime();

  return (
    <>
      <div className="navigator-sidereal-header">
        <h2>Sidereal Time</h2>
      </div>
      <div className="navigator-sidereal-content">
        <table className="navigator-data-table">
          <tbody>
            <tr>
              <th scope="row">Time</th>
              <td>{markedTime}</td>
            </tr>
            <tr>
              <th scope="row">Julian Day</th>
              <td className="navigator-julian-day-value">
                {julianDay?.timestamp === markedTimestamp
                  ? formatDecimal(julianDay.value, julianDay.units, {
                      decimalPlaces,
                    })
                  : "TBD"}
              </td>
            </tr>
            <tr>
              <th title="Greenwich Mean Sidereal Time" scope="row">
                GMST
              </th>
              <td className="navigator-gmst-value">
                {gmst?.timestamp === markedTimestamp
                  ? formatSiderealMeasurement(gmst, isDMSFormat, {
                      hourFormat: true,
                      decimalPlaces,
                    })
                  : "TBD"}
              </td>
            </tr>
            <tr>
              <th title="Local Mean Sidereal Time" scope="row">
                LMST
              </th>
              <td className="navigator-lmst-value">
                {lmst?.timestamp === markedTimestamp
                  ? formatSiderealMeasurement(lmst, isDMSFormat, {
                      hourFormat: true,
                      decimalPlaces,
                    })
                  : "TBD"}
              </td>
            </tr>
            <tr>
              <th title="Greenwich Apparent Sidereal Time" scope="row">
                GAST
              </th>
              <td className="navigator-gast-value">
                {gast?.timestamp === markedTimestamp
                  ? formatSiderealMeasurement(gast, isDMSFormat, {
                      hourFormat: true,
                      decimalPlaces,
                    })
                  : "TBD"}
              </td>
            </tr>
            <tr>
              <th title="Local Apparent Sidereal Time" scope="row">
                LAST
              </th>
              <td className="navigator-last-value">
                {last?.timestamp === markedTimestamp
                  ? formatSiderealMeasurement(last, isDMSFormat, {
                      hourFormat: true,
                      decimalPlaces,
                    })
                  : "TBD"}
              </td>
            </tr>
            <tr>
              <th title="Earth Rotation Angle" scope="row">
                ERA
              </th>
              <td className="navigator-era-value">
                {era?.timestamp === markedTimestamp
                  ? formatSiderealMeasurement(era, isDMSFormat, {
                      hourFormat: false,
                      decimalPlaces,
                    })
                  : "TBD"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function NavigatorDisplay({ timezone = "UTC" }: { timezone?: string }) {
  const [markedTime, setMarkedTime] = useState<string>(
    formatInTimeZone(new Date(), timezone, MARKED_TIME_FORMAT),
  );
  const [currentTimezone, setCurrentTimezone] = useState<string>(timezone);
  const [ianaTimezones, setIanaTimezones] = useState<TimezoneGroup[]>([]);
  const [timezoneError, setTimezoneError] = useState<string | null>(null);

  const timeString = formatInTimeZone(
    new Date(markedTime),
    currentTimezone,
    "HH:mm:ss",
  );
  const selectedDate = toZonedTime(new Date(markedTime), currentTimezone);

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const [julianDay, setJulianDay] =
    useState<TimestampedMeasurement | null>(null);
  const [julianDayError, setJulianDayError] = useState<string | null>(null);

  const [gmst, setGmst] = useState<TimestampedMeasurement | null>(null);
  const [gmstError, setGmstError] = useState<string | null>(null);

  const [gast, setGast] = useState<TimestampedMeasurement | null>(null);
  const [gastError, setGastError] = useState<string | null>(null);

  const [lmst, setLmst] = useState<TimestampedMeasurement | null>(null);
  const [lmstError, setLmstError] = useState<string | null>(null);

  const [last, setLast] = useState<TimestampedMeasurement | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const [era, setEra] = useState<TimestampedMeasurement | null>(null);
  const [eraError, setEraError] = useState<string | null>(null);

  const [decimalPlaces, setDecimalPlaces] = useState<number>(2);

  const [isDMSFormat, setIsDMSFormat] = useState<boolean>(true);

  useEffect(() => {
    getIANAtimezones();
  }, []);

  useEffect(() => {
    let isCurrentRequest = true;
    void fetchJulianDay(markedTime, () => isCurrentRequest);
    void fetchGMST(markedTime, () => isCurrentRequest);
    void fetchGAST(markedTime, () => isCurrentRequest);
    void fetchERA(markedTime, () => isCurrentRequest);
    return () => {
      isCurrentRequest = false;
    };
  }, [markedTime]);

  useEffect(() => {
    let isCurrentRequest = true;
    void fetchLMST(markedTime, Number(longitude || 0), () => isCurrentRequest);
    void fetchLAST(markedTime, Number(longitude || 0), () => isCurrentRequest);
    return () => {
      isCurrentRequest = false;
    };
  }, [markedTime, longitude]);

  const handleDMSFormatToggle = (isDMS: boolean) => {
    setIsDMSFormat(isDMS);
  };

  function handleTimezoneChange(timezone: string) {
    setCurrentTimezone(timezone);
    setMarkedTime(
      formatInTimeZone(new Date(markedTime), timezone, MARKED_TIME_FORMAT),
    );
  }

  function handleMarkCurrentTime() {
    const timestamp = formatInTimeZone(
      new Date(),
      currentTimezone,
      MARKED_TIME_FORMAT,
    );
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
      setTimezoneError(getRequestErrorMessage(error));
    }
  }

  async function fetchJulianDay(
    datetime: string,
    isCurrentRequest: () => boolean = () => true,
  ) {
    try {
      const response = await fetch("/api/julian_day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datetime }),
      });
      const data: {
        julian_day?: { value: number; units: string };
        error?: string;
      } = await response.json();

      if (!response.ok || data.julian_day === undefined) {
        throw new Error(data.error ?? "Unable to retrieve Julian day");
      }

      if (isCurrentRequest()) {
        setJulianDay({
          timestamp: new Date(datetime).getTime(),
          ...data.julian_day,
        });
        setJulianDayError(null);
      }
    } catch (requestError) {
      if (isCurrentRequest()) {
        setJulianDayError(getRequestErrorMessage(requestError));
      }
    }
  }

  async function fetchGMST(
    datetime: string,
    isCurrentRequest: () => boolean = () => true,
  ) {
    try {
      const response = await fetch("/api/gmst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datetime }),
      });
      const data: { gmst?: { value: number; units: string }; error?: string } =
        await response.json();

      if (!response.ok || data.gmst === undefined) {
        throw new Error(data.error ?? "Unable to retrieve GMST");
      }

      if (isCurrentRequest()) {
        setGmst({ timestamp: new Date(datetime).getTime(), ...data.gmst });
        setGmstError(null);
      }
    } catch (requestError) {
      if (isCurrentRequest()) {
        setGmstError(getRequestErrorMessage(requestError));
      }
    }
  }

  async function fetchGAST(
    datetime: string,
    isCurrentRequest: () => boolean = () => true,
  ) {
    try {
      const response = await fetch("/api/gast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datetime }),
      });
      const data: { gast?: { value: number; units: string }; error?: string } =
        await response.json();

      if (!response.ok || data.gast === undefined) {
        throw new Error(data.error ?? "Unable to retrieve GAST");
      }

      if (isCurrentRequest()) {
        setGast({ timestamp: new Date(datetime).getTime(), ...data.gast });
        setGastError(null);
      }
    } catch (requestError) {
      if (isCurrentRequest()) {
        setGastError(getRequestErrorMessage(requestError));
      }
    }
  }

  async function fetchLMST(
    datetime: string,
    longitude: number,
    isCurrentRequest: () => boolean = () => true,
  ) {
    try {
      const response = await fetch("/api/lmst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datetime, longitude }),
      });
      const data: { lmst?: { value: number; units: string }; error?: string } =
        await response.json();

      if (!response.ok || data.lmst === undefined) {
        throw new Error(data.error ?? "Unable to retrieve LMST");
      }

      if (isCurrentRequest()) {
        setLmst({ timestamp: new Date(datetime).getTime(), ...data.lmst });
        setLmstError(null);
      }
    } catch (requestError) {
      if (isCurrentRequest()) {
        setLmstError(getRequestErrorMessage(requestError));
      }
    }
  }

  async function fetchLAST(
    datetime: string,
    longitude: number,
    isCurrentRequest: () => boolean = () => true,
  ) {
    try {
      const response = await fetch("/api/last", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datetime, longitude }),
      });
      const data: { last?: { value: number; units: string }; error?: string } =
        await response.json();

      if (!response.ok || data.last === undefined) {
        throw new Error(data.error ?? "Unable to retrieve LAST");
      }

      if (isCurrentRequest()) {
        setLast({ timestamp: new Date(datetime).getTime(), ...data.last });
        setLastError(null);
      }
    } catch (requestError) {
      if (isCurrentRequest()) {
        setLastError(getRequestErrorMessage(requestError));
      }
    }
  }

  async function fetchERA(
    datetime: string,
    isCurrentRequest: () => boolean = () => true,
  ) {
    try {
      const response = await fetch("/api/era", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datetime }),
      });
      const data: { era?: { value: number; units: string }; error?: string } =
        await response.json();

      if (!response.ok || data.era === undefined) {
        throw new Error(data.error ?? "Unable to retrieve ERA");
      }

      if (isCurrentRequest()) {
        setEra({ timestamp: new Date(datetime).getTime(), ...data.era });
        setEraError(null);
      }
    } catch (requestError) {
      if (isCurrentRequest()) {
        setEraError(getRequestErrorMessage(requestError));
      }
    }
  }

  const errors = Array.from(
    new Set(
      [
        timezoneError,
        julianDayError,
        gmstError,
        gastError,
        lmstError,
        lastError,
        eraError,
      ].filter((error): error is string => error !== null),
    ),
  );

  return (
    <div>
      {errors.length > 0 && (
        <div className="navigator-error-messages" role="alert" aria-live="assertive">
          <strong>Navigator error</strong>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="starbug-card">
        <LocationDisplay
          handleMarkCurrentTime={handleMarkCurrentTime}
          selectedDate={selectedDate}
          timeString={timeString}
          currentTimezone={currentTimezone}
          ianaTimezones={ianaTimezones}
          handleTimezoneChange={handleTimezoneChange}
          setMarkedTime={setMarkedTime}
          markedTime={markedTime}
          latitude={latitude}
          longitude={longitude}
          onLatitudeChange={setLatitude}
          onLongitudeChange={setLongitude}
        />
      </div>
      <div className="starbug-card">
        <SiderealTimeDisplay
          markedTime={markedTime}
          julianDay={julianDay}
          gmst={gmst}
          lmst={lmst}
          gast={gast}
          last={last}
          era={era}
          decimalPlaces={decimalPlaces}
          isDMSFormat={isDMSFormat}
        />
      </div>
      <div className="starbug-card">
        <h2>Options</h2>
        <table className="navigator-options-table">
          <tbody>
            <tr>
              <th scope="row">
                <label htmlFor="decimalPlaces">Decimal Places</label>
              </th>
              <td>
                <input
                  id="decimalPlaces"
                  type="number"
                  min="0"
                  max="16"
                  value={decimalPlaces}
                  onChange={(e) => setDecimalPlaces(Number(e.target.value))}
                />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="dmsFormatToggle">DMS Format</label>
              </th>
              <td>
                <input
                  id="dmsFormatToggle"
                  type="checkbox"
                  checked={isDMSFormat}
                  onChange={(e) => handleDMSFormatToggle(e.target.checked)}
                />
              </td>
            </tr>
          </tbody>
        </table>
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
          <NavigatorDisplay timezone="UTC" />
        </div>

        <div className="starbug-card">
          <div>
            <h2>References</h2>
            <ol>
              <li>
                <a
                  href="https://www.iana.org/time-zones"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IANA Time Zone Database
                </a>
              </li>
              <li>
                <a
                  href="https://aa.usno.navy.mil/data/JulianDate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  USN Julian Date Converter
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Astronomical_coordinate_system"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia: Astronomical coordinate system
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Geographic_coordinate_system"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia: Geographic coordinate system
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Julian_day"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia: Julian day
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Sidereal_time"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
