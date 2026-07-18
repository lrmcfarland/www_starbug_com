"""Starbug navigational computer."""

import datetime


class Space:
    """Space coordinate."""

    def __init__(self, x=0, y=0, z=0):
        self._x = x
        self._y = y
        self._z = z

    def __str__(self):
        """Print"""
        return f"({self._x}, {self._y}, {self._z})"


def toModifiedJulianDateAPC(a_datetime: datetime.datetime):
    return a_datetime
