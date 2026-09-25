import pytest

from navicomp.transforms import dms_to_decimal, decimal_to_dms


class TestDecimalDegrees:

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
                dms_to_decimal(13, 10, 46.3668),
                1e-8,
            ),  # Meeus p. 88, Example 12.a
            (
                8,
                34,
                57.0896,
                dms_to_decimal(8, 34, 57.0896),
                1e-8,
            ),  # Meeus p. 89, Example 12.b
        ],
    )
    def test_dms_to_decimal(
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

        result = dms_to_decimal(degrees, minutes, seconds)
        assert result == pytest.approx(expected, abs=absolute_tolerance)

    @pytest.mark.parametrize(
        ("decimal_degrees", "expected", "absolute_tolerance"),
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
    def test_decimal_to_dms(
        self, decimal_degrees: float, expected: tuple, absolute_tolerance: float
    ):
        """Test decimal degrees calculation for various UTC datetimes.

        Args:
            decimal_degrees (float): The input decimal degrees.
            expected (tuple): The expected degrees, minutes, and seconds.
            absolute_tolerance (float): The absolute tolerance for the approximation.
        """

        result = decimal_to_dms(decimal_degrees)
        assert result[0] == expected[0]
        assert result[1] == expected[1]
        assert result[2] == pytest.approx(expected[2], abs=absolute_tolerance)
