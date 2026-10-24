"""Transformations between degrees, minutes, seconds and decimal degrees."""

import numpy as np


def dms_to_decimal(degrees: int, minutes: int, seconds: np.float64) -> np.float64:
    """Convert degrees, minutes, and seconds to decimal degrees.

    Args:
        degrees (int): The degrees component.
        minutes (int): The minutes component.
        seconds (np.float64): The seconds component.

    Returns:
        np.float64: The equivalent decimal degrees.
    """
    sign = 1 if degrees >= 0 else -1
    return sign * (abs(degrees) + minutes / 60.0 + seconds / 3600.0)


def decimal_to_dms(decimal_degrees: np.float64) -> tuple[int, int, np.float64]:
    """Convert decimal degrees to degrees, minutes, and seconds.

    Args:
        decimal_degrees (np.float64): The decimal degrees.

    Returns:
        tuple[int, int, np.float64]: The equivalent degrees, minutes, and seconds.
    """
    sign = 1 if decimal_degrees >= 0 else -1
    decimal_degrees = abs(decimal_degrees)
    degrees = int(decimal_degrees)
    minutes = int((decimal_degrees - degrees) * 60)
    seconds = (decimal_degrees - degrees - minutes / 60) * 3600
    return sign * degrees, minutes, seconds
