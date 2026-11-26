"""Time and date calculations for astronomical purposes."""

import json
import logging
import math
import re
from datetime import datetime
from math import floor
from zoneinfo import ZoneInfo, available_timezones

import numpy as np

from navicomp import Space, ValueWithUnits
from navicomp.transforms import dms_to_degrees

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S%z",
)

timezone_pattern = re.compile(
    r"^(?P<continent>[A-Za-z0-9_+-]+)(?:/(?P<city>[A-Za-z0-9_+-/]*))*$"
)


def timezones() -> str:
    """List of available timezones.

    Returns:
        str: JSON string of IANA timezones grouped by continent.
    """
    continents = {"Other": []}
    for tz in available_timezones():
        if match := timezone_pattern.match(tz):
            continent = match.group("continent")
            city = match.group("city")

            if city is None:
                continents["Other"].append(continent)
                continue

            if continent not in continents:
                continents[continent] = []
            continents[continent].append(city)
        else:
            logging.warning(f"tz: {tz} does not match pattern. Skipping.")
            continue
    zones = []
    for continent, tz_list in sorted(continents.items()):
        zones.append({"zone": continent, "zones": []})
        for city in sorted(tz_list):
            if continent == "Other":
                code = city
            else:
                code = f"{continent}/{city}"
            zones[-1]["zones"].append({"city": city, "code": code})
    return json.dumps(zones)


class Transforms:
    """Time transformations for astronomical calculations.

    Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009.
    https://www.willbell.com/math/mc1.htm

    Astronomy on the Personal Computer, Montenbruck and Pfleger, 1999.
    https://link.springer.com/book/10.1007/978-3-642-03436-7

    US Naval Observatory Astronomical Algorithms.
    https://aa.usno.navy.mil/
    """

    JD2k = 2451545.0  # 2000-01-01 12:00:00 UTC
    JULIAN_EPOCH_BEGIN_NBCE = datetime(
        4713, 1, 1, 12, 0, tzinfo=ZoneInfo("UTC")
    )  # TODO not BCE see https://aa.usno.navy.mil/data/JulianDate
    JULIAN_EPOCH_END = datetime(1582, 10, 4, tzinfo=ZoneInfo("UTC"))
    GREGORIAN_EPOCH = datetime(1582, 10, 15, tzinfo=ZoneInfo("UTC"))
    MJD_EPOCH = datetime(1858, 11, 17, tzinfo=ZoneInfo("UTC"))

    @classmethod
    def Julian_day(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates Julian day number from a datetime adjusted to UTC.

        Meeus, 2009, p. 62 eq. 7.1

        modified with fractional day for Julian Day Ephemeris.

        4716 has been added for negative years but they are not supported
        by datetime.

        Args:
            a_datetime (datetime): The input datetime.

        Returns:
            ValueWithUnits: A dictionary containing the Julian day.
        """
        utc_time = a_datetime.astimezone(ZoneInfo("UTC"))

        if utc_time.month > 2:
            year = utc_time.year
            month = utc_time.month
        else:
            year = utc_time.year - 1
            month = utc_time.month + 12

        if (
            utc_time.year < cls.GREGORIAN_EPOCH.year
            or (utc_time.year == cls.GREGORIAN_EPOCH.year and utc_time.month < 10)
            or (
                utc_time.year == cls.GREGORIAN_EPOCH.year
                and utc_time.month == cls.GREGORIAN_EPOCH.month
                and utc_time.day < cls.GREGORIAN_EPOCH.day
            )
        ):
            b = 0
        else:
            a = year // 100
            b = 2 - a + a // 4

        julian_day = (
            int(365.25 * (year + 4716))
            + int(30.6001 * (month + 1))
            + utc_time.day
            + b
            - 1524.5
        )

        # Add the time of day as a fraction of a day for JDE
        julian_day += (
            (utc_time.hour / 24.0)
            + (utc_time.minute / 1440.0)
            + (utc_time.second / 86400.0)
        )

        return {"value": julian_day, "units": "days"}


class Meeus(Transforms):
    """Astronomical Algorithms by Meeus.

    Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009.

    https://www.willbell.com/math/mc1.htm
    """

    @classmethod
    def nutations_simple(cls, a_datetime: datetime) -> dict[str, ValueWithUnits]:
        """Nutations of longitude and obliquity simplified.

        Meeus, 2nd, p. 144

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            ValueWithUnits: A dictionary containing the nutations
            of longitude and obliquity.
        """
        JDE = cls.Julian_day(a_datetime)["value"]
        T = (JDE - cls.JD2k) / 36525
        Ω = (
            125.04452
            - 1934.136261 * T
            + 0.0020708 * math.pow(T, 2)
            + math.pow(T, 3) / 450000
        )
        Ωrad = np.radians(Ω)

        Lsun_rad = np.radians(280.4665 + 36000.7698 * T)
        Lmoon_rad = np.radians(218.3165 + 481267.8813 * T)

        Δψ = (
            dms_to_degrees(0, 0, -17.2) * np.sin(Ωrad)
            - dms_to_degrees(0, 0, 1.32) * np.sin(2 * Lsun_rad)
            - dms_to_degrees(0, 0, 0.23) * np.sin(2 * Lmoon_rad)
            + dms_to_degrees(0, 0, 0.21) * np.sin(2 * Ωrad)
        )
        Δε = (
            dms_to_degrees(0, 0, 9.2) * np.cos(Ωrad)
            + dms_to_degrees(0, 0, 0.57) * np.cos(2 * Lsun_rad)
            + dms_to_degrees(0, 0, 0.1) * np.cos(2 * Lmoon_rad)
            - dms_to_degrees(0, 0, 0.09) * np.cos(2 * Ωrad)
        )

        return {
            "nutation longitude": ValueWithUnits(value=np.degrees(Δψ), units="degrees"),
            "nutation obliquity": ValueWithUnits(value=np.degrees(Δε), units="degrees"),
        }

    @classmethod
    def GMST(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates Greenwich Mean Sidereal Time (GMST) in hours from a datetime.

        Meeus, 2nd, p. 87-88, eq. 12.4

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            ValueWithUnits: A dictionary containing the GMST value in hours.
        """
        jd = cls.Julian_day(a_datetime)["value"]
        t = (jd - cls.JD2k) / 36525.0  # eq. 12.1
        gmst = (
            280.46061837
            + 360.98564736629 * (jd - cls.JD2k)
            + 0.000387933 * t**2
            - t**3 / 38710000
        )  # eq. 12.4
        gmst %= 360.0
        return {"value": gmst / 15.0, "units": "hours"}  # Convert degrees to hours

    @staticmethod
    def Julian_date(a_Julian_day: float) -> datetime:
        """Calculates datetime from Julian day number.

        Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009, p. 63

        Args:
            a_Julian_day (float): The input Julian day number.

        Returns:
            datetime: The corresponding datetime in UTC.
        """
        jd = a_Julian_day + 0.5
        z = int(jd)
        f = jd - z

        if z < 2299161:
            a = z
        else:
            alpha = int((z - 1867216.25) / 36524.25)
            a = z + 1 + alpha - int(alpha / 4)

        b = a + 1524
        c = int((b - 122.1) / 365.25)
        d = int(365.25 * c)
        e = int((b - d) / 30.6001)

        day = b - d - int(30.6001 * e) + f
        month = e - 1 if e < 14 else e - 13
        year = c - 4716 if month > 2 else c - 4715

        # Extract the time of day from the fractional part of the day
        day_fraction = day - int(day)
        hour = int(day_fraction * 24)
        minute = int((day_fraction * 24 - hour) * 60)
        second = int((((day_fraction * 24 - hour) * 60) - minute) * 60)

        return datetime(
            year, month, int(day), hour, minute, second, tzinfo=ZoneInfo("UTC")
        )

    @classmethod
    def obliquity_mean(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates the mean obliquity of the ecliptic given the datetime

        from Meeus, 2nd. 22.2 matches IAU

        TODO 22.3

        a_datetime (coords.datetime): The time of the observation.

        Returns:
            ValueWithUnits: obliquity in degrees
        """
        obe = [
            dms_to_degrees(23, 26, 21.448),
            dms_to_degrees(0, 0, -46.815),
            dms_to_degrees(0, 0, -0.00059),
            dms_to_degrees(0, 0, 0.001813),
        ]

        T = (cls.Julian_day(a_datetime)["value"] - cls.JD2k) / 36525.0
        ε = 0
        for i in range(len(obe)):
            ε += obe[i] * math.pow(T, i)

        return {"value": ε, "units": "degrees"}


class USN(Transforms):
    """US Naval Observatory Astronomical Algorithms.

    https://aa.usno.navy.mil/faq/GAST
    """

    @classmethod
    def JDo(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates the Julian date of the previous midnight.

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            float: The Julian date of the previous midnight.
        """
        JDtt = cls.Julian_day(a_datetime)["value"]
        jd_floor = floor(JDtt)
        if JDtt - jd_floor >= 0.5:
            jdo = jd_floor + 0.5
        else:
            jdo = jd_floor - 0.5
        return {"value": jdo, "units": "days"}

    @classmethod
    def GMST(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates Greenwich Mean Sidereal Time (GMST) in hours from a datetime.

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            ValueWithUnits: A dictionary containing the GMST value in hours.
        """
        JDtt = cls.Julian_day(a_datetime)["value"]

        # Julian date of the previous midnight
        jdo = cls.JDo(a_datetime)["value"]

        Dut = jdo - cls.JD2k
        h = (JDtt - jdo) * 24.0
        t = (JDtt - cls.JD2k) / 36525.0

        gmst = (
            6.697375
            + 0.065707485828 * Dut
            + 1.0027379 * h
            + 0.0854103 * t
            + 0.0000258 * t**2
        )
        gmst = gmst % 24.0
        return {"value": gmst, "units": "hours"}

    @classmethod
    def GMST_simplified(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates Greenwich Mean Sidereal Time (GMST) in hours from a datetime.

        US Naval Observatory simplified algorithm.

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            ValueWithUnits: A dictionary containing the GMST value in hours.
        """
        JDtt = cls.Julian_day(a_datetime)["value"]
        gmst = 18.697375 + 24.065709824279 * (JDtt - cls.JD2k)
        gmst = gmst % 24.0
        return {"value": gmst, "units": "hours"}

    @classmethod
    def obliquity_mean(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates the mean obliquity of the ecliptic in degrees.

        US Naval Observatory Astronomical Algorithms.

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            ValueWithUnits: the mean obliquity of the ecliptic in degrees.
        """
        JDtt = cls.Julian_day(a_datetime)["value"]
        Dtt = JDtt - cls.JD2k
        obliquity = 23.4393 - 0.0000004 * Dtt
        return {"value": obliquity, "units": "degrees"}

    @classmethod
    def GAST(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates Greenwich Apparent Sidereal Time (GAST) in hours from a datetime.

        US Naval Observatory Astronomical Algorithms.

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            ValueWithUnits: A dictionary containing the GAST value in hours.
        """
        JDtt = cls.Julian_day(a_datetime)["value"]
        Dtt = JDtt - cls.JD2k
        gmst = cls.GMST(a_datetime)["value"]
        obliquity = cls.obliquity_mean(a_datetime)["value"]
        ε = Space.deg2rad(obliquity)
        Ω = Space.deg2rad(125.04 - 0.052954 * Dtt)
        L = Space.deg2rad(280.47 + 0.98565 * Dtt)
        # equation of the equinoxes
        Δψ = -0.000319 * np.sin(Ω) - 0.000024 * np.sin(2 * L)
        gast = gmst + (Δψ * np.cos(ε)) / 15.0
        gast = gast % 24.0
        return {"value": gast, "units": "hours"}

    @classmethod
    def LMST(cls, a_datetime: datetime, a_longitude: ValueWithUnits) -> ValueWithUnits:
        """Calculates Local Mean Sidereal Time (LMST) in hours from a datetime.

        Meeus, 2009, p. 88

        Args:
            a_datetime (datetime): The input datetime in UTC.
            a_longitude (ValueWithUnits): Observer's longitude
            (positive east, negative west).

        Returns:
            ValueWithUnits: A dictionary containing the LMST value in hours.
        """
        if a_longitude["units"] != "degrees":
            raise ValueError("Longitude must be in degrees.")
        gmst = cls.GMST(a_datetime)["value"]
        lmst = (gmst + a_longitude["value"] / 15.0) % 24.0
        return {"value": lmst, "units": "hours"}

    @classmethod
    def LAST(cls, a_datetime: datetime, a_longitude: ValueWithUnits) -> ValueWithUnits:
        """Calculates Local Apparent Sidereal Time (LAST) in hours from a datetime.

        Meeus, 2009, p. 88

        Args:
            a_datetime (datetime): The input datetime in UTC.
            a_longitude (ValueWithUnits): Observer's longitude
            (positive east, negative west).

        Returns:
            ValueWithUnits: A dictionary containing the LAST value in hours.
        """
        if a_longitude["units"] != "degrees":
            raise ValueError("Longitude must be in degrees.")
        gast = cls.GAST(a_datetime)["value"]
        last = (gast + a_longitude["value"] / 15.0) % 24.0
        return {"value": last, "units": "hours"}


class Wikipedia(Transforms):
    """Astronomical Algorithms from Wikipedia."""

    @classmethod
    def obliquity_mean(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates the mean obliquity of the ecliptic given the datetime

        from http://en.wikipedia.org/wiki/Axial_tilt

        a_datetime (coords.datetime): The time of the observation.

        Returns:
            ValueWithUnits: obliquity in degrees
        """
        obe = [
            dms_to_degrees(23, 26, 21.448),
            dms_to_degrees(0, 0, -46.815),
            dms_to_degrees(0, 0, -0.00059),
            dms_to_degrees(0, 0, 0.001813),
        ]

        T = (cls.Julian_day(a_datetime)["value"] - cls.JD2k) / 36525.0
        ε = 0
        for i in range(len(obe)):
            ε += obe[i] * math.pow(T, i)

        return {"value": ε, "units": "degrees"}

    @classmethod
    def ERA(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates Earth Rotation Angle (ERA) in hours from a datetime.

        https://en.wikipedia.org/wiki/Sidereal_time

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            ValueWithUnits: A dictionary containing the ERA value in degrees.
        """
        ut1 = cls.Julian_day(a_datetime)["value"] - cls.JD2k
        era_radians = 2 * np.pi * (0.7790572732640 + 1.00273781191135448 * ut1)
        return {"value": np.degrees(era_radians) % 360.0, "units": "degrees"}
