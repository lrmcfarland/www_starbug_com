"""Time and date calculations for astronomical purposes."""

import json

from datetime import datetime
from math import floor
from zoneinfo import ZoneInfo, available_timezones

import numpy as np


def timezones():
    """List of available timezones."""
    return json.dumps(list(available_timezones()))


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
    def Julian_day(a_datetime: datetime) -> np.float64:
        """Calculates Julian day number from a datetime adjusted to UTC.

        Meeus, 2009, p. 62
        Montenbruck and Pfleger, p. 15

        Args:
            a_datetime (datetime): The input datetime.

        Returns:
            np.float64: The Modified Julian Date in local time.
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

        # TODO adjust for timezone offset?
        # julian_day -= a_datetime.utcoffset().total_seconds() / 86400.0

        return julian_day

    @staticmethod
    def Julian_date(a_Julian_day: np.float64) -> datetime:
        """Calculates datetime from Julian day number.

        Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009, p. 63

        Args:
            a_Julian_day (np.float64): The input Julian day number.

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


class Meeus(AstronomicalAlgorithms):
    """Astronomical Algorithms by Meeus.

    Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009.

    https://www.willbell.com/math/mc1.htm
    """

    @classmethod
    def GMST(cls, a_datetime: datetime) -> np.float64:
        """Calculates Greenwich Mean Sidereal Time (GMST) in hours from a datetime.

        Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009, p. 87-88

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            np.float64: The GMST in hours.
        """
        jd = cls.Julian_day(a_datetime)
        t = (jd - cls.JD2k) / 36525.0
        gmst = (
            280.46061837
            + 360.98564736629 * (jd - cls.JD2k)
            + 0.000387933 * t**2
            - t**3 / 38710000
        )
        gmst = gmst % 360.0
        return gmst / 15.0  # Convert degrees to hours


class USN(AstronomicalAlgorithms):
    """US Naval Observatory Astronomical Algorithms.

    https://aa.usno.navy.mil/faq/GAST
    """

    @classmethod
    def GMST(cls, a_datetime: datetime) -> np.float64:
        """Calculates Greenwich Mean Sidereal Time (GMST) in hours from a datetime.

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            np.float64: The GMST in hours.
        """
        jd = cls.Julian_day(a_datetime)

        # Julian date of the previous midnight
        jd_floor = floor(jd)
        if jd - jd_floor >= 0.5:
            jdo = jd_floor + 0.5
        else:
            jdo = jd_floor - 0.5

        dut = jdo - cls.JD2k
        h = (jd - jdo) * 24.0
        t = (jd - cls.JD2k) / 36525.0

        gmst = (
            6.697375
            + 0.065707485828 * dut
            + 1.0027379 * h
            + 0.0854103 * t
            + 0.0000258 * t**2
        )
        gmst = gmst % 24.0
        return gmst

    @classmethod
    def GMST_simplified(cls, a_datetime: datetime) -> np.float64:
        """Calculates Greenwich Mean Sidereal Time (GMST) in hours from a datetime.

        US Naval Observatory simplified algorithm.

        Args:
            a_datetime (datetime): The input datetime in UTC.

        Returns:
            np.float64: The GMST in hours.
        """
        jd = cls.Julian_day(a_datetime)
        gmst = 18.697375 + 24.065709824279 * (jd - cls.JD2k)
        gmst = gmst % 24.0
        return gmst
