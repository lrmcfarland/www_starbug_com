"""tests for navicomp.transforms module."""

import pytest

from navicomp.transforms import (
    degrees_to_dms,
    dms_to_degrees,
    hms_to_hours,
    hours_to_hms,
)


class TestDMS:
    """Test converting degree, minutes, seconds"""

    @pytest.mark.parametrize(
        ("degrees", "minutes", "seconds", "expected", "absolute_tolerance"),
        [
            (0, 0, 0, 0.0, 1e-15),
            (12, 0, 0, 12.0, 1e-15),
            (18, 0, 0, 18.0, 1e-15),
            (23, 59, 0, 23.983333333333334, 1e-11),
            (
                13,
                10,
                46.3668,
                dms_to_degrees(13, 10, 46.3668),
                1e-8,
            ),  # Meeus p. 88, Example 12.a
            (
                8,
                34,
                57.0896,
                dms_to_degrees(8, 34, 57.0896),
                1e-8,
            ),  # Meeus p. 89, Example 12.b
        ],
    )
    def test_dms_to_degrees(
        self,
        degrees: int,
        minutes: int,
        seconds: float,
        expected: float,
        absolute_tolerance: float,
    ):
        """Test decimal degrees calculation for various UTC datetimes.

        Args:
            degrees (int): The degrees component.
            minutes (int): The minutes component.
            seconds (float): The seconds component.
            expected (float): The expected decimal degrees.
            absolute_tolerance (float): The absolute tolerance for the approximation.
        """

        result = dms_to_degrees(degrees, minutes, seconds)
        assert result == pytest.approx(expected, abs=absolute_tolerance)

    @pytest.mark.parametrize(
        ("degrees", "expected", "absolute_tolerance"),
        [
            (0.0, (0, 0, 0.0), 1e-15),
            (12.0, (12, 0, 0.0), 1e-15),
            (18.0, (18, 0, 0.0), 1e-15),
            (23.983333333333334, (23, 59, 0.0000000000000568), 1e-11),
            (
                13.1795463393908,
                (13, 10, 46.3668),
                1e-4,
            ),  # Meeus p. 88, Example 12.a
            (
                8.582524882955477,
                (8, 34, 57.0896),
                1e-4,
            ),  # Meeus p. 89, Example 12.b
        ],
    )
    def test_degrees_to_dms(
        self, degrees: float, expected: tuple, absolute_tolerance: float
    ):
        """Test decimal degrees calculation for various UTC datetimes.

        Args:
            decimal_degrees (float): The input decimal degrees.
            expected (tuple): The expected degrees, minutes, and seconds.
            absolute_tolerance (float): The absolute tolerance for the approximation.
        """

        result = degrees_to_dms(degrees)
        assert result[0] == expected[0]
        assert result[1] == expected[1]
        assert result[2] == pytest.approx(expected[2], abs=absolute_tolerance)


class TestHMS:
    """Test converting hour minutes seconds."""

    @pytest.mark.parametrize(
        ("hours", "minutes", "seconds", "expected", "absolute_tolerance"),
        [
            (0, 0, 0, 0.0, 1e-15),
            (12, 0, 0, 12.0, 1e-15),
            (18, 0, 0, 18.0, 1e-15),
            (23, 59, 0, 23.983333333333334, 1e-11),
            (
                13,
                10,
                46.3668,
                hms_to_hours(13, 10, 46.3668),
                1e-8,
            ),  # Meeus p. 88, Example 12.a
            (
                8,
                34,
                57.0896,
                hms_to_hours(8, 34, 57.0896),
                1e-8,
            ),  # Meeus p. 89, Example 12.b
        ],
    )
    def test_hms_to_hours(
        self,
        hours: int,
        minutes: int,
        seconds: float,
        expected: float,
        absolute_tolerance: float,
    ):
        """Test decimal degrees calculation for various UTC datetimes.

        Args:
            hours (int): The hours component.
            minutes (int): The minutes component.
            seconds (float): The seconds component.
            expected (float): The expected decimal degrees.
            absolute_tolerance (float): The absolute tolerance for the approximation.
        """
        result = hms_to_hours(hours=hours, minutes=minutes, seconds=seconds)
        assert result == pytest.approx(expected, abs=absolute_tolerance)

    @pytest.mark.parametrize(
        ("hours", "expected", "absolute_tolerance"),
        [
            (0.0, (0, 0, 0.0), 1e-15),
            (12.0, (12, 0, 0.0), 1e-15),
            (18.0, (18, 0, 0.0), 1e-15),
            (23.983333333333334, (23, 59, 0.0000000000000568), 1e-11),
            (
                13.1795463393908,
                (13, 10, 46.3668),
                1e-4,
            ),  # Meeus p. 88, Example 12.a
            (
                8.582524882955477,
                (8, 34, 57.0896),
                1e-4,
            ),  # Meeus p. 89, Example 12.b
        ],
    )
    def test_hours_to_hms(
        self, hours: float, expected: tuple, absolute_tolerance: float
    ):
        """Test decimal degrees calculation for various UTC datetimes.

        Args:
            hours (float): The input decimal degrees.
            expected (tuple): The expected degrees, minutes, and seconds.
            absolute_tolerance (float): The absolute tolerance for the approximation.
        """
        result = hours_to_hms(hours)
        assert result[0] == expected[0]
        assert result[1] == expected[1]
        assert result[2] == pytest.approx(expected[2], abs=absolute_tolerance)
