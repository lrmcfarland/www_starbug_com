"""Transformations between various unit formats."""

import numpy as np

from navicomp import ValueWithUnits


class Error(Exception):
    """Base class for exceptions in this module."""

    pass


def degrees_to_dms(degrees: float) -> tuple[int, int, float]:
    """Convert decimal degrees to degrees, minutes, and seconds.

    Args:
        degrees (float): The decimal degrees.

    Returns:
        tuple[int, int, float]: The equivalent degrees, minutes, and seconds.
    """
    sign = 1 if degrees >= 0 else -1
    decimal_degrees = abs(degrees)
    degree_component = int(decimal_degrees)
    minutes = int((decimal_degrees - degree_component) * 60)
    seconds = (decimal_degrees - degree_component - minutes / 60) * 3600
    return sign * degree_component, minutes, seconds


def dms_to_degrees(degrees: int, minutes: int, seconds: float) -> float:
    """Convert degrees, minutes, and seconds to decimal degrees.

    Args:
        degrees (int): degrees.
        minutes (int): minutes.
        seconds (float): seconds.

    Returns:
        float: The equivalent decimal degrees.
    """
    sign = 1 if degrees >= 0 else -1
    return sign * (abs(degrees) + minutes / 60.0 + seconds / 3600.0)


def hms_to_hours(hours: int, minutes: int, seconds: float) -> float:
    """Convert hours, minutes, and seconds to decimal hours.

    Args:
        hours (int): hours, e.g. Right Ascension
        minutes (int): minutes
        seconds (float): seconds.
    """
    return dms_to_degrees(degrees=hours, minutes=minutes, seconds=seconds)


def hours_to_hms(hours: float) -> tuple[int, int, float]:
    """Convert degress into hours into hours, minutes, and seconds.

    Args:
        hours (float): degrees.
    """
    return degrees_to_dms(degrees=hours)


def find_radians(vwu: ValueWithUnits, emsg: str = "Unsupported") -> float:
    """Find the radians in the ValueWithUnits.

    Args:
        vwu (ValueWithUnits): a value with units
        emsg (str): message to raise

    Returns:
        value in radians

    Raises: Error if not supported
    """
    if vwu["units"].lower() == "radians" or vwu["units"].lower() == "rad":
        return vwu["value"]
    elif vwu["units"].lower() == "degrees" or vwu["units"].lower() == "deg":
        return np.radians(vwu["value"])
    elif vwu["units"].lower() == "hours" or vwu["units"].lower() == "hrs":
        return np.radians(15.0 * vwu["value"])
    else:
        raise Error(f"{emsg} values must be in radians, degrees or hours.")
