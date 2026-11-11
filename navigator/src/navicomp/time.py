"""Time and date calculations for astronomical purposes."""

import json
import logging
import math
import re
from datetime import datetime
from math import floor
from typing import TypedDict
from zoneinfo import ZoneInfo, available_timezones

import numpy as np

from navicomp import Space
from navicomp.transforms import dms_to_decimal


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S%z",
)

timezone_pattern = re.compile(
    r"^(?P<continent>[A-Za-z0-9_+-]+)(?:/(?P<city>[A-Za-z0-9_+-/]*))*$"
)


class ValueWithUnits(TypedDict):
    value: float
    units: str


def timezones():
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


class AstronomicalAlgorithms:
    """Astronomical Algorithms by Meeus and US Naval Observatory.

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

    @staticmethod
    def Julian_day(a_datetime: datetime) -> ValueWithUnits:
        """Calculates Julian day number from a datetime adjusted to UTC.

        Meeus, 2009, p. 62
        Montenbruck and Pfleger, p. 15

        Args:
            a_datetime (datetime): The input datetime.

        Returns:
            dict: A dictionary containing the Julian day.
        """
        utc_time = a_datetime.astimezone(ZoneInfo("UTC"))

        if utc_time.month <= 2:
            year = utc_time.year - 1
            month = utc_time.month + 12
        else:
            year = utc_time.year
            month = utc_time.month

        if (
            utc_time.year < 1582
            or (utc_time.year == 1582 and utc_time.month < 10)
            or (utc_time.year == 1582 and utc_time.month == 10 and utc_time.day < 15)
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

        # Add the time of day as a fraction of a day
        julian_day += (
            (utc_time.hour / 24.0)
            + (utc_time.minute / 1440.0)
            + (utc_time.second / 86400.0)
        )

        return {"value": julian_day, "units": "days"}


class Meeus(AstronomicalAlgorithms):
    """Astronomical Algorithms by Meeus.

    Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009.

    https://www.willbell.com/math/mc1.htm
    """

    @classmethod
    def GMST(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates Greenwich Mean Sidereal Time (GMST) in hours from a datetime.

        Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009, p. 87-88

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            dict: A dictionary containing the GMST value in hours.
        """
        jd = cls.Julian_day(a_datetime)["value"]
        t = (jd - cls.JD2k) / 36525.0
        gmst = (
            280.46061837
            + 360.98564736629 * (jd - cls.JD2k)
            + 0.000387933 * t**2
            - t**3 / 38710000
        )
        gmst = gmst % 360.0
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


class USN(AstronomicalAlgorithms):
    """US Naval Observatory Astronomical Algorithms.

    https://aa.usno.navy.mil/faq/GAST
    """

    @classmethod
    def JDo(cls, a_datetime: datetime) -> float:
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
        return jdo

    @classmethod
    def GMST(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates Greenwich Mean Sidereal Time (GMST) in hours from a datetime.

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            dict: A dictionary containing the GMST value in hours.
        """
        JDtt = cls.Julian_day(a_datetime)["value"]

        # Julian date of the previous midnight
        jdo = cls.JDo(a_datetime)

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
            dict: A dictionary containing the GMST value in hours.
        """
        JDtt = cls.Julian_day(a_datetime)["value"]
        gmst = 18.697375 + 24.065709824279 * (JDtt - cls.JD2k)
        gmst = gmst % 24.0
        return {"value": gmst, "units": "hours"}

    @classmethod
    def obliquity(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates the mean obliquity of the ecliptic in degrees.

        US Naval Observatory Astronomical Algorithms.

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            dict: A dictionary containing the mean obliquity of the ecliptic in degrees.
        """
        JDtt = cls.Julian_day(a_datetime)["value"]
        Dtt = JDtt - cls.JD2k
        obliquity = 23.4393 - 0.0000004 * Dtt
        return {"value": obliquity, "units": "degrees"}  # TODO radians?

    @classmethod
    def GAST(cls, a_datetime: datetime) -> ValueWithUnits:
        """Calculates Greenwich Apparent Sidereal Time (GAST) in hours from a datetime.

        US Naval Observatory Astronomical Algorithms.

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            dict: A dictionary containing the GAST value in hours.
        """
        JDtt = cls.Julian_day(a_datetime)["value"]
        Dtt = JDtt - cls.JD2k
        gmst = cls.GMST(a_datetime)["value"]
        obliquity = cls.obliquity(a_datetime)["value"]
        ε = Space.deg2rad(obliquity)
        Ω = Space.deg2rad(125.04 - 0.052954 * Dtt)
        L = Space.deg2rad(280.47 + 0.98565 * Dtt)
        # equation of the equinoxes
        Δψ = -0.000319 * np.sin(Ω) - 0.000024 * np.sin(2 * L)
        gast = gmst + (Δψ * np.cos(ε)) / 15.0
        gast = gast % 24.0
        return {"value": gast, "units": "hours"}

    @classmethod
    def LMST(
        cls, a_datetime: datetime, a_longitude: float
    ) -> ValueWithUnits:
        """Calculates Local Mean Sidereal Time (LMST) in hours from a datetime.

        Meeus, 2009, p. 88 with obliquity correction from the US Naval Observatory
        Astronomical Algorithms.

        Args:
            a_datetime (datetime): The input datetime in UTC.
            a_longitude (float): The longitude in degrees
            (positive east, negative west).

        Returns:
            dict: A dictionary containing the LMST value in hours.
        """
        gmst = cls.GMST(a_datetime)["value"]
        lmst = (gmst + a_longitude / 15.0) % 24.0
        return {"value": lmst, "units": "hours"}

    @classmethod
    def LAST(cls, a_datetime: datetime, a_longitude: float) -> ValueWithUnits:
        """Calculates Local Apparent Sidereal Time (LAST) in hours from a datetime.

        Meeus, 2009, p. 88 with obliquity correction from the US Naval Observatory
        Astronomical Algorithms.

        Args:
            a_datetime (datetime): The input datetime in UTC.
            a_longitude (float): The longitude in degrees
            (positive east, negative west).

        Returns:
            dict: A dictionary containing the LAST value in hours.
        """
        gast = cls.GAST(a_datetime)["value"]
        last = (gast + a_longitude / 15.0) % 24.0
        return {"value": last, "units": "hours"}


class Wikipedia(AstronomicalAlgorithms):


    # from http://en.wikipedia.org/wiki/Axial_tilt
    obe = list()
    obe.append(dms_to_decimal(23, 26, 21.45))
    obe.append(dms_to_decimal(-1, 0, 46.815))
    obe.append(dms_to_decimal(-1, 0, 0.0006))
    obe.append(dms_to_decimal(0, 0, 0.00181))
    # TODO more terms, updated


    @classmethod
    def obliquity(cls, a_datetime: datetime) -> np.float64:
        """Calculates the obliquity of the ecliptic given the datetime

        a_datetime (coords.datetime): The time of the observation.
        """
        T = cls.Julian_day(a_datetime)["value"] - cls.JD2k
        eps = 0
        for i in range(len(cls.obe)):
            eps += cls.obe[i] * math.pow(T, i)
        return eps

    @classmethod
    def ERA(cls, a_datetime: datetime) -> dict[str, float | str]:
        """Calculates Earth Rotation Angle (ERA) in hours from a datetime.

        https://en.wikipedia.org/wiki/Sidereal_time

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            dict: A dictionary containing the ERA value in degrees.
        """
        ut1 = cls.Julian_day(a_datetime)["value"] - cls.JD2k
        era_radians = 2 * np.pi * (0.7790572732640 + 1.00273781191135448 * ut1)
        return {"value": np.degrees(era_radians) % 360.0, "units": "degrees"}
