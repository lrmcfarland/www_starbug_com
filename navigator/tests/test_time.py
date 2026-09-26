"""tests for navicomp.time module."""

import json
import numpy as np
import pytest

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from navicomp.time import (
    Julian_date,
    Julian_day,
    timezones,
    GMST,
)

from navicomp.transforms import dms_to_decimal


class TestTimeZones:

    def test_available_timezones(self):
        tzones = json.loads(timezones())
        assert isinstance(tzones, list)
        assert "UTC" in tzones

    @pytest.mark.parametrize(
        ("a_datetime", "expected"),
        [
            (datetime(2000, 1, 1, tzinfo=ZoneInfo("UTC")), "UTC"),
            (datetime(2000, 1, 1, tzinfo=ZoneInfo("America/New_York")), "EST"),
            (datetime(2000, 1, 1, tzinfo=ZoneInfo("America/Los_Angeles")), "PST"),
            (datetime(2000, 1, 1, tzinfo=ZoneInfo("America/Phoenix")), "MST"),
        ],
    )
    def test_utc(self, a_datetime: datetime, expected: str):
        assert a_datetime.tzname() == expected


class TestJulianDay:

    @pytest.mark.parametrize(
        ("a_datetime", "expected"),
        [
            (datetime(2000, 1, 1, 12, 0, tzinfo=ZoneInfo("UTC")), 2451545.0),
            (datetime(1999, 1, 1, 0, 0, tzinfo=ZoneInfo("UTC")), 2451179.5),
            (datetime(1987, 1, 27, 0, 0, tzinfo=ZoneInfo("UTC")), 2446822.5),
            (datetime(1987, 6, 19, 12, 0, tzinfo=ZoneInfo("UTC")), 2446966.0),
            (datetime(1988, 1, 27, 0, 0, tzinfo=ZoneInfo("UTC")), 2447187.5),
            (datetime(1988, 6, 19, 12, 0, tzinfo=ZoneInfo("UTC")), 2447332.0),
            (datetime(1977, 4, 26, 9, 36, tzinfo=ZoneInfo("UTC")), 2443259.9),
            (datetime(1900, 1, 1, 0, 0, tzinfo=ZoneInfo("UTC")), 2415020.5),
            (datetime(1858, 11, 17, tzinfo=ZoneInfo("UTC")), 2400000.5),  # MJD epoch
            (datetime(1600, 1, 1, 0, 0, tzinfo=ZoneInfo("UTC")), 2305447.5),
            (datetime(1600, 12, 31, 0, 0, tzinfo=ZoneInfo("UTC")), 2305812.5),
            (
                datetime(837, 4, 10, 7, 12, 0, tzinfo=ZoneInfo("UTC")),
                2026871.8,
            ),  # Halley's Comet
            (datetime(333, 1, 27, 12, 0, tzinfo=ZoneInfo("UTC")), 1842713.0),
        ],
    )
    def test_Julian_day_AA(self, a_datetime: datetime, expected: np.float64):
        """Test Modified Julian Date calculation for various UTC datetimes.

        Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009, p. 62

        Args:
            a_datetime (datetime): The input datetime in UTC.
            expected (np.float64): The expected Modified Julian Date.
        """

        result = Julian_day(a_datetime)
        assert result == expected

    @pytest.mark.parametrize(
        ("a_datetime", "expected", "absolute_tolerance"),
        [
            (datetime(2026, 9, 26, 12, 0, tzinfo=ZoneInfo("UTC")), 2461310.0, 1e-10),
            (
                datetime(2024, 7, 10, 18, 12, 41, tzinfo=ZoneInfo("UTC")),
                2460502.258808,
                1e-6,
            ),
        ],
    )
    def test_Julian_day_USN(
        self, a_datetime: datetime, expected: np.float64, absolute_tolerance: float
    ):
        """Test Modified Julian Date calculation for various datetimes.

        US Naval Observatory data with Meeus' algorithm

        https://aa.usno.navy.mil/data/JulianDate

        Args:
            a_datetime (datetime): The input datetime in UTC.
            expected (np.float64): The expected Modified Julian Date.
            absolute_tolerance (float): The absolute tolerance for the comparison.
        """

        result = Julian_day(a_datetime)
        assert abs(result - expected) < absolute_tolerance

    @pytest.mark.parametrize(
        ("a_datetime", "expected"),
        [
            (
                datetime(1957, 10, 4, 10, 29, tzinfo=ZoneInfo("Europe/Moscow")),
                2436115.8118055556,
            ),  # Sputnik 1 launch, TODO different from AA p.61 2436116.31.
        ],
    )
    def test_Julian_day_with_timezone(self, a_datetime: datetime, expected: np.float64):
        """Test Modified Julian Date calculation for various non-UTC datetimes.

        Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009, p. 62

        Args:
            a_datetime (datetime): The input datetime in UTC.
            expected (np.float64): The expected Modified Julian Date.
        """

        result = Julian_day(a_datetime)
        assert result == expected


class TestJulianDate:

    @pytest.mark.parametrize(
        ("a_julian_day", "expected"),
        [
            (2451545.0, datetime(2000, 1, 1, 12, 0, tzinfo=ZoneInfo("UTC"))),
            (2451179.5, datetime(1999, 1, 1, 0, 0, tzinfo=ZoneInfo("UTC"))),
            (2446822.5, datetime(1987, 1, 27, 0, 0, tzinfo=ZoneInfo("UTC"))),
            (2446966.0, datetime(1987, 6, 19, 12, 0, tzinfo=ZoneInfo("UTC"))),
            (2447187.5, datetime(1988, 1, 27, 0, 0, tzinfo=ZoneInfo("UTC"))),
            (2447332.0, datetime(1988, 6, 19, 12, 0, tzinfo=ZoneInfo("UTC"))),
            (
                2443259.9,
                datetime(1977, 4, 26, 9, 35, 59, tzinfo=ZoneInfo("UTC")),
            ),  # rounds different from AA p.61 2443259.9 == 1977, 4, 26, 9, 36, 0
            (2415020.5, datetime(1900, 1, 1, 0, 0, tzinfo=ZoneInfo("UTC"))),
            (2400000.5, datetime(1858, 11, 17, tzinfo=ZoneInfo("UTC"))),  # MJD epoch
            (2305447.5, datetime(1600, 1, 1, 0, 0, tzinfo=ZoneInfo("UTC"))),
            (2305812.5, datetime(1600, 12, 31, 0, 0, tzinfo=ZoneInfo("UTC"))),
            (
                2026871.8,
                datetime(837, 4, 10, 7, 12, 0, tzinfo=ZoneInfo("UTC")),
            ),  # Halley's Comet
            (1842713.0, datetime(333, 1, 27, 12, 0, tzinfo=ZoneInfo("UTC"))),
        ],
    )
    def test_Julian_date_AA(self, a_julian_day: np.float64, expected: datetime):
        """Test Modified Julian Date calculation for various UTC datetimes.

        Astronomical Algorithms, 2nd Edition, Jean Meeus, 2009, p. 62

        Args:
            a_julian_day (np.float64): The input Modified Julian Date.
            expected (datetime): The expected datetime in UTC.
        """

        result = Julian_date(a_julian_day)
        assert result == expected

    @pytest.mark.parametrize(
        ("a_julian_day", "expected", "absolute_tolerance"),
        [
            (
                2461305.312604,
                datetime(2026, 9, 21, 19, 30, 9, tzinfo=ZoneInfo("UTC")),
                timedelta(seconds=2),
            ),
            (
                2460502.258808,
                datetime(2024, 7, 10, 18, 12, 41, tzinfo=ZoneInfo("UTC")),
                timedelta(microseconds=1),
            ),
        ],
    )
    def test_Julian_date_USN(
        self,
        a_julian_day: np.float64,
        expected: datetime,
        absolute_tolerance: timedelta,
    ):
        """Test Modified Julian Date calculation for various UTC datetimes.

        US Naval Observatory data with Meeus' algorithm

        https://aa.usno.navy.mil/data/JulianDate

        Args:
            a_julian_day (np.float64): The input Modified Julian Date.
            expected (datetime): The expected datetime in UTC.
            absolute_tolerance (timedelta): The absolute tolerance for the comparison.
        """

        result = Julian_date(a_julian_day)

        assert abs(result - expected) < absolute_tolerance


class TestGMST:

    @pytest.mark.parametrize(
        ("a_datetime", "expected", "absolute_tolerance"),
        [
            (
                datetime(1987, 4, 10, 0, 0, tzinfo=ZoneInfo("UTC")),
                dms_to_decimal(13, 10, 46.3668),
                1e-7,
            ),  # Meeus p. 88, Example 12.a
            (
                datetime(1987, 4, 10, 19, 21, tzinfo=ZoneInfo("UTC")),
                dms_to_decimal(8, 34, 57.0896),
                1e-7,
            ),  # Meeus p. 89, Example 12.b
        ],
    )
    def test_GMST(self, a_datetime: datetime, expected: str, absolute_tolerance: float):
        """Test GMST calculation for various UTC datetimes.

        Args:
            a_datetime (datetime): The input datetime in UTC.
            expected (str): The expected GMST string representation.
            absolute_tolerance (float): The absolute tolerance for the approximation.
        """

        result = GMST(a_datetime)
        assert result == pytest.approx(expected, abs=absolute_tolerance)
