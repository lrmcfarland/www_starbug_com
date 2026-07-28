import json

from datetime import datetime
from zoneinfo import ZoneInfo, available_timezones

import numpy as np

JULIAN_EPOCH_BEGIN_NBCE = datetime(
    4713, 1, 1, 12, 0, tzinfo=ZoneInfo("UTC")
)  # TODO not BCE
JULIAN_EPOCH_END = datetime(1582, 10, 4, tzinfo=ZoneInfo("UTC"))
GREGORIAN_EPOCH = datetime(1582, 10, 15, tzinfo=ZoneInfo("UTC"))
MJD_EPOCH = datetime(1858, 11, 17, tzinfo=ZoneInfo("UTC"))


def timezones():
    """List of available timezones."""
    return json.dumps(list(available_timezones()))


def Julian_day(a_datetime: datetime) -> np.float64:
    """Calculates Julian day number from a datetime adjusted to UTC.

    Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009, p. 62
    Astronomy on the Personal Computer, Montenbruck and Pfleger, p. 15

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

    # adjust for timezone offset
    # julian_day -= a_datetime.utcoffset().total_seconds() / 86400.0

    return julian_day


def Julian_date(a_julian_day: np.float64) -> datetime:
    """Calculates datetime from Julian day number.

    Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009, p. 63

    Args:
        a_julian_day (np.float64): The input Julian day number.

    Returns:
        datetime: The corresponding datetime in UTC.
    """
    jd = a_julian_day + 0.5
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

    return datetime(year, month, int(day), hour, minute, second, tzinfo=ZoneInfo("UTC"))
