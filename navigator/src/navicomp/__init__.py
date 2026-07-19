"""Starbug navigational computer."""

from enum import Enum

import numpy as np


class Space:
    """Space coordinate."""

    π = np.pi

    @classmethod
    def deg2rad(cls, an_angle: np.float64) -> np.float64:
        """Convert degrees to radians."""
        return an_angle * cls.π / 180.0

    @classmethod
    def rad2deg(cls, an_angle: np.float64) -> np.float64:
        """Convert radians to degrees."""
        return an_angle * 180.0 / cls.π

    def __init__(self, x: np.float64 = 0, y: np.float64 = 0, z: np.float64 = 0):
        self._space = np.array([x, y, z])

    def __repr__(self):
        return f"Space({self.x}, {self.y}, {self.z})"

    def __str__(self):
        return f"Space(x={self.x}, y={self.y}, z={self.z})"

    def __hash__(self):
        return hash((float(self.x), float(self.y), float(self.z)))

    def __eq__(self, other: object) -> bool:
        # Handle UnitVector Enum members with Space values
        if hasattr(other, "value") and isinstance(other.value, Space):
            other = other.value
        if not isinstance(other, Space):
            return False
        return self.x == other.x and self.y == other.y and self.z == other.z

    @property
    def x(self) -> np.float64:
        return self._space[0]

    @property
    def y(self) -> np.float64:
        return self._space[1]

    @property
    def z(self) -> np.float64:
        return self._space[2]

    # Physics Standard (ISO 80000-2:2019
    @property
    def ρ(self) -> np.float64:
        return np.sqrt(self.x**2 + self.y**2 + self.z**2)

    @property
    def r(self) -> np.float64:
        return self.ρ

    @property
    def θ(self) -> np.float64:
        return np.arctan2(np.sqrt(self.x**2 + self.y**2), self.z)

    @property
    def theta(self) -> np.float64:
        return self.θ

    @property
    def φ(self) -> np.float64:
        return np.arctan2(self.y, self.x)

    @property
    def phi(self) -> np.float64:
        return self.φ

    # Geography / MATLAB Standard

    @property
    def h(self) -> np.float64:
        """Height or altitude.

        This is has a rounding difference from r and ρ
        """
        hxy = np.hypot(self.x, self.y)
        return np.hypot(hxy, self.z)

    @property
    def az(self) -> np.float64:
        """Azimuth."""
        return np.arctan2(self.y, self.x)

    @property
    def el(self) -> np.float64:
        """Elevation."""
        hxy = np.hypot(self.x, self.y)
        return np.arctan2(self.z, hxy)


class UnitVectors(Enum):
    """Unit vectors"""

    Uo = Space(0, 0, 0)
    Ux = Space(1, 0, 0)
    Uy = Space(0, 1, 0)
    Uz = Space(0, 0, 1)
