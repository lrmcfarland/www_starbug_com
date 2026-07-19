"""Starbug navigational computer."""

import datetime
from enum import Enum

import numpy as np


class Space:
    """Space coordinate."""

    def __init__(self, x: np.float64 = 0, y: np.float64 = 0, z: np.float64 = 0):
        self._space = np.array([x, y, z])

    def __repr__(self):
        return f"Space({self.x}, {self.y}, {self.z})"

    def __str__(self):
        return f"Space(x={self.x}, y={self.y}, z={self.z})"

    def __eq__(self, other: object) -> bool:
        # Handle Enum members with Space values
        if hasattr(other, 'value') and isinstance(other.value, Space):
            other = other.value
        if not isinstance(other, Space):
            return False
        return self.x == other.x and self.y == other.y and self.z == other.z

    def __hash__(self):
        return hash((float(self.x), float(self.y), float(self.z)))

    @property
    def x(self) -> np.float64:
        return self._space[0]

    @property
    def y(self) -> np.float64:
        return self._space[1]

    @property
    def z(self) -> np.float64:
        return self._space[2]

    def __str__(self):
        """Print"""
        return f"({self.x}, {self.y}, {self.z})"


class UnitVectors(Enum):
    """Unit vectors"""

    Uo = Space(0, 0, 0)
    Ux = Space(1, 0, 0)
    Uy = Space(0, 1, 0)
    Uz = Space(0, 0, 1)


def toModifiedJulianDateAPC(a_datetime: datetime.datetime):
    return a_datetime
