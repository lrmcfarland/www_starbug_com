"""Starbug navigational computer."""

from __future__ import annotations

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
        h (np.float64, optional): Geographical height/radius.
            Defaults to 1.
        az (np.float64, optional): Geographical azimuth.
            Defaults to 0.
        el (np.float64, optional): Geographical elevation.
            Defaults to 0.
        alt (np.float64, optional): Geographical altitude/radius.
            Defaults to 1.
        lat (np.float64, optional): Geographical latitude.
            Defaults to 0.
        lon (np.float64, optional): Geographical longitude.
            Defaults to 0.

    Raises
        ValueError: If parameters from multiple coordinate systems are
            mixed.

    Note
        Only one coordinate system may be used per instance. Origin
        defaults to (0, 0, 0).
    """

    π = np.pi
    Re = 6.371e6  # mean radius of Earth in meters

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
        alt: np.float64 = None,
        lat: np.float64 = None,
        lon: np.float64 = None,
    ):
        is_cartesian = x is not None or y is not None or z is not None
        is_spherical_physics_1 = ρ is not None or θ is not None or φ is not None
        is_spherical_physics_2 = r is not None or theta is not None or phi is not None
        is_spherical_geo_1 = h is not None or az is not None or el is not None
        is_spherical_geo_2 = alt is not None or lat is not None or lon is not None

        if is_cartesian and not (
            is_spherical_physics_1
            or is_spherical_physics_2
            or is_spherical_geo_1
            or is_spherical_geo_2
        ):
            self._space = np.array(
                [
                    x if x is not None else 0,
                    y if y is not None else 0,
                    z if z is not None else 0,
                ]
            )
        elif is_spherical_physics_1 and not (
            is_cartesian
            or is_spherical_physics_2
            or is_spherical_geo_1
            or is_spherical_geo_2
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
            is_cartesian
            or is_spherical_physics_1
            or is_spherical_geo_1
            or is_spherical_geo_2
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
        elif is_spherical_geo_1 and not (
            is_cartesian
            or is_spherical_physics_1
            or is_spherical_physics_2
            or is_spherical_geo_2
        ):
            h0 = h + self.Re if h is not None else self.Re
            az0 = az if az is not None else 0
            el0 = el if el is not None else 0

            self._space = np.array(
                [
                    h0 * np.cos(el0) * np.cos(az0),
                    h0 * np.cos(el0) * np.sin(az0),
                    h0 * np.sin(el0),
                ]
            )
        elif is_spherical_geo_2 and not (
            is_cartesian
            or is_spherical_physics_1
            or is_spherical_physics_2
            or is_spherical_geo_1
        ):
            alt0 = alt + self.Re if alt is not None else self.Re
            lon0 = lon if lon is not None else 0
            lat0 = lat if lat is not None else 0

            self._space = np.array(
                [
                    alt0 * np.cos(lat0) * np.cos(lon0),
                    alt0 * np.cos(lat0) * np.sin(lon0),
                    alt0 * np.sin(lat0),
                ]
            )
        elif is_spherical_physics_1 and is_spherical_physics_2:
            raise ValueError(
                "Unsupported combination of spherical physics parameter sets."
            )
        elif is_spherical_geo_1 and is_spherical_geo_2:
            raise ValueError("Unsupported combination of spherical geo parameter sets.")
        elif (
            is_cartesian
            or is_spherical_physics_1
            or is_spherical_physics_2
            or is_spherical_geo_1
            or is_spherical_geo_2
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
            return NotImplemented
        return self.x == other.x and self.y == other.y and self.z == other.z

    def __neg__(self) -> Space:
        return Space(x=-self.x, y=-self.y, z=-self.z)

    # ---- add ----

    def __add__(self, other) -> Space:
        if isinstance(other, Space):
            return Space(self.x + other.x, self.y + other.y, self.z + other.z)
        raise TypeError(
            f"unsupported operand type(s) for +: 'Space' and '{type(other).__name__}'"
        )

    def __radd__(self, other) -> Space:
        """Commute vector addition."""
        return self.__add__(other)

    def __iadd__(self, other) -> Space:
        if isinstance(other, Space):
            self._space[0] += other.x
            self._space[1] += other.y
            self._space[2] += other.z
            return self
        if isinstance(other, (int, float, np.float64)):
            self._space[0] += other
            self._space[1] += other
            self._space[2] += other
            return self
        raise TypeError(
            f"unsupported operand type(s) for +: 'Space' and '{type(other).__name__}'"
        )

    # ----- subtract -----

    def __sub__(self, other) -> Space:
        if isinstance(other, Space):
            return Space(self.x - other.x, self.y - other.y, self.z - other.z)
        raise TypeError(
            f"unsupported operand type(s) for -: 'Space' and '{type(other).__name__}'"
        )

    def __rsub__(self, other) -> Space:
        """Commute vector subtraction."""
        if isinstance(other, Space):
            return Space(other.x - self.x, other.y - self.y, other.z - self.z)
        raise TypeError(
            f"unsupported operand type(s) for -: '{type(other).__name__}' and 'Space'"
        )

    def __isub__(self, other) -> Space:
        if isinstance(other, Space):
            self._space[0] -= other.x
            self._space[1] -= other.y
            self._space[2] -= other.z
            return self
        if isinstance(other, (int, float, np.float64)):
            self._space[0] -= other
            self._space[1] -= other
            self._space[2] -= other
            return self
        raise TypeError(
            f"unsupported operand type(s) for -: 'Space' and '{type(other).__name__}'"
        )

    # ----- multiply -----

    def __mul__(self, other: np.float64) -> Space:
        """Scalar multiplication."""
        if isinstance(other, (int, float, np.float64)):
            return Space(other * self.x, other * self.y, other * self.z)
        raise TypeError(
            f"unsupported operand type(s) for *: 'Space' and '{type(other).__name__}'"
        )

    def __rmul__(self, other: np.float64):
        """Commute scalar multiplication."""
        return self.__mul__(other)

    def __imul__(self, other) -> Space:
        if isinstance(other, (int, float, np.float64)):
            self._space[0] *= other
            self._space[1] *= other
            self._space[2] *= other
            return self
        raise TypeError(
            f"unsupported operand type(s) for *=: 'Space' and '{type(other).__name__}'"
        )

    # ----- true divide -----

    def __truediv__(self, other) -> Space:
        """Scalar division self / other."""
        if other == 0:
            raise ZeroDivisionError("Division by zero")
        if isinstance(other, (int, float, np.float64)):
            return Space(self.x / other, self.y / other, self.z / other)
        raise TypeError(
            f"unsupported operand type(s) for /: 'Space' and '{type(other).__name__}'"
        )

    def __rtruediv__(self, other) -> Space:
        """Scalar division other / self."""
        if self.x == 0 or self.y == 0 or self.z == 0:
            raise ZeroDivisionError("Division by zero")
        if isinstance(other, (int, float, np.float64)):
            return Space(other / self.x, other / self.y, other / self.z)
        raise TypeError(
            f"unsupported operand type(s) for /: '{type(other).__name__}' and 'Space'"
        )

    def __itruediv__(self, other) -> Space:
        if other == 0:
            raise ZeroDivisionError("Inplace division by zero")
        if isinstance(other, (int, float, np.float64)):
            self._space[0] /= other
            self._space[1] /= other
            self._space[2] /= other
            return self
        raise TypeError(
            f"unsupported operand type(s) for /=: 'Space' and '{type(other).__name__}'"
        )

    def __ifloordiv__(self, other):
        if other == 0:
            raise ZeroDivisionError("Inplace division by zero")
        if isinstance(other, (int, float, np.float64)):
            self._space[0] //= other
            self._space[1] //= other
            self._space[2] //= other
            return self
        raise TypeError(
            f"unsupported operand type(s) for /=: 'Space' and '{type(other).__name__}'"
        )

    # ----------------------
    # ----- properties -----
    # ----------------------

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
        """Height or altitude, a.k.a. radius.

        This has a rounding difference from r and ρ.
        """
        hxy = np.hypot(self.x, self.y)
        return np.hypot(hxy, self.z) - self.Re

    @property
    def az(self) -> np.float64:
        """Azimuth."""
        return np.arctan2(self.y, self.x)

    @property
    def el(self) -> np.float64:
        """Elevation above the horizon."""
        hxy = np.hypot(self.x, self.y)
        return np.arctan2(self.z, hxy)

    @property
    def alt(self) -> np.float64:
        """Altitude."""
        return self.ρ - self.Re

    @property
    def lon(self) -> np.float64:
        """Longitude, -180 to 180."""
        return np.arctan2(self.y, self.x)

    @property
    def lat(self) -> np.float64:
        """Latitude, -90 to 90."""
        hxy = np.hypot(self.x, self.y)
        return np.arctan2(self.z, hxy)


class UnitVectors(Enum):
    """Unit vectors."""

    Uo = Space(0, 0, 0)
    Ux = Space(1, 0, 0)
    Uy = Space(0, 1, 0)
    Uz = Space(0, 0, 1)
