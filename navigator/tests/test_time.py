import json
import numpy as np
import pytest

from datetime import datetime
from zoneinfo import ZoneInfo

from navicomp.time import Julian_date, Julian_day, timezones


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
