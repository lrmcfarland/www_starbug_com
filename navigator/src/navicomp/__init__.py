"""Starbug navigational computer."""

from enum import Enum

import numpy as np


class Space:
    """Space coordinate.

    Supports cartesian, Spherical Physics (with and without greek letters)
    and Geographical (height, azimuth and elevation).

    All angles are assumed to be in radians.

    Parameters
        x (np.float64, optional): Cartesian x coordinate.
            Defaults to 0.
        y (np.float64, optional): Cartesian y coordinate.
            Defaults to 0.
        z (np.float64, optional): Cartesian z coordinate.
            Defaults to 0.
        ρ (np.float64, optional): Spherical physics radial distance
            (rho). Defaults to 1.
        r (np.float64, optional): Spherical physics radial distance
            (alternative to ρ). Defaults to 1.
        θ (np.float64, optional): Spherical physics polar angle
            (theta, greek). Defaults to 0.
        theta (np.float64, optional): Spherical physics polar angle
            (alternative to θ). Defaults to 0.
        φ (np.float64, optional): Spherical physics azimuthal angle
            (phi, greek). Defaults to 0.
        phi (np.float64, optional): Spherical physics azimuthal angle
            (alternative to φ). Defaults to 0.
        h (np.float64, optional): Geographical height/altitude.
            Defaults to 1.
        az (np.float64, optional): Geographical azimuth.
            Defaults to 0.
        el (np.float64, optional): Geographical elevation.
            Defaults to 0.

    Raises
        ValueError: If parameters from multiple coordinate systems are
            mixed.

    Note
        Only one coordinate system may be used per instance. Origin
        defaults to (0, 0, 0).
    """

    π = np.pi

    @classmethod
    def deg2rad(cls, an_angle: np.float64) -> np.float64:
        """Convert degrees to radians."""
        return an_angle * cls.π / 180.0

    @classmethod
    def rad2deg(cls, an_angle: np.float64) -> np.float64:
        """Convert radians to degrees."""
        return an_angle * 180.0 / cls.π

    def __init__(
        self,
        x: np.float64 = None,
        y: np.float64 = None,
        z: np.float64 = None,
        ρ: np.float64 = None,
        r: np.float64 = None,
        θ: np.float64 = None,
        theta: np.float64 = None,
        φ: np.float64 = None,
        phi: np.float64 = None,
        h: np.float64 = None,
        az: np.float64 = None,
        el: np.float64 = None,
    ):
        is_cartesian = x is not None or y is not None or z is not None
        is_spherical_physics_1 = ρ is not None or θ is not None or φ is not None
        is_spherical_physics_2 = r is not None or theta is not None or phi is not None
        is_spherical_geo = h is not None or az is not None or el is not None

        if is_cartesian and not (
            is_spherical_physics_1 or is_spherical_physics_2 or is_spherical_geo
        ):
            self._space = np.array(
                [
                    x if x is not None else 0,
                    y if y is not None else 0,
                    z if z is not None else 0,
                ]
            )
        elif is_spherical_physics_1 and not (
            is_cartesian or is_spherical_physics_2 or is_spherical_geo
        ):
            ρ0 = ρ if ρ is not None else 1
            θ0 = θ if θ is not None else 0
            φ0 = φ if φ is not None else 0

            self._space = np.array(
                [
                    ρ0 * np.sin(θ0) * np.cos(φ0),
                    ρ0 * np.sin(θ0) * np.sin(φ0),
                    ρ0 * np.cos(θ0),
                ]
            )
        elif is_spherical_physics_2 and not (
            is_cartesian or is_spherical_physics_1 or is_spherical_geo
        ):
            ρ0 = r if r is not None else 1
            θ0 = theta if theta is not None else 0
            φ0 = phi if phi is not None else 0

            self._space = np.array(
                [
                    ρ0 * np.sin(θ0) * np.cos(φ0),
                    ρ0 * np.sin(θ0) * np.sin(φ0),
                    ρ0 * np.cos(θ0),
                ]
            )
        elif is_spherical_geo and not (
            is_cartesian or is_spherical_physics_1 or is_spherical_physics_2
        ):
            h0 = h if h is not None else 1
            az0 = az if az is not None else 0
            el0 = el if el is not None else 0

            self._space = np.array(
                [
                    h0 * np.cos(el0) * np.cos(az0),
                    h0 * np.cos(el0) * np.sin(az0),
                    h0 * np.sin(el0),
                ]
            )
        elif is_spherical_physics_1 and is_spherical_physics_2:
            raise ValueError(
                "Unsupported combination of spherical physics " "parameter sets."
            )
        elif (
            is_cartesian
            or is_spherical_physics_1
            or is_spherical_physics_2
            or is_spherical_geo
        ):
            raise ValueError("Unsupported combination of all parameter sets.")
        else:
            self._space = np.array([0, 0, 0])

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

    def __mul__(self, other):
        """Scalar multiplication."""
        if isinstance(other, (int, float, np.float64)):
            return Space(other * self.x, other * self.y, other * self.z)
        return NotImplemented  # Try commute.

    def __rmul__(self, other):
        """Commute scalar multiplication."""
        return self.__mul__(other)

    @property
    def x(self) -> np.float64:
        return self._space[0]

    @property
    def y(self) -> np.float64:
        return self._space[1]

    @property
    def z(self) -> np.float64:
        return self._space[2]

    # Physics Standard (ISO 80000-2:2019)
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

        This has a rounding difference from r and ρ.
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
    """Unit vectors."""

    Uo = Space(0, 0, 0)
    Ux = Space(1, 0, 0)
    Uy = Space(0, 1, 0)
    Uz = Space(0, 0, 1)
