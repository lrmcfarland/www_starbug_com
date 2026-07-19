"""Starbug navigational computer."""

import datetime

import numpy as np


class Space:
    """Space coordinate."""

    def __init__(self, x=0, y=0, z=0):
        self._space = np.array([x, y, z])

    @property
    def x(self):
        return self._space[0]

    @property
    def y(self):
        return self._space[1]

    @property
    def z(self):
        return self._space[2]

    def __str__(self):
        """Print"""
        return f"({self.x}, {self.y}, {self.z})"


def toModifiedJulianDateAPC(a_datetime: datetime.datetime):
    return a_datetime
