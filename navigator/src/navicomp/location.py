"""Location module for astronomical calculations."""

import datetime

import numpy as np

from navicomp import ValueWithUnits, time
from navicomp.transforms import find_radians


class Error(Exception):
    """Base class for exceptions in this module."""

    pass


class Meeus:
    """Location transformations for astronomical calculations."""

    @staticmethod
    def Eq2Ec(
        α: ValueWithUnits,
        δ: ValueWithUnits,
        a_datetime: datetime,
    ) -> dict[str, ValueWithUnits]:
        """Convert equatorial to ecliptic coordinates.

        Meeus, 2009, Astronomical Algorithms, 2nd Edition, Chapter 13, page 93,
        13.1. Conversion of Equatorial Coordinates to Ecliptic Coordinates.

        Args:
            α (ValueWithUnits): Right ascension.
            δ (ValueWithUnits): Declination.

        Returns:
            A dictionary containing the ecliptic longitude and latitude in
                ValueWithUnits.
        """
        α_rad = find_radians(α, "Right ascension")
        δ_rad = find_radians(δ, "Declination")
        ε_rad = find_radians(time.Meeus.obliquity_mean(a_datetime), "obliquity")

        λ_rad = np.arctan2(
            np.sin(α_rad) * np.cos(ε_rad) + np.tan(δ_rad) * np.sin(ε_rad),
            np.cos(α_rad),
        )
        β_rad = np.arcsin(
            np.sin(δ_rad) * np.cos(ε_rad)
            - np.cos(δ_rad) * np.sin(ε_rad) * np.sin(α_rad)
        )

        return {
            "ecliptic_longitude": ValueWithUnits(
                value=np.degrees(λ_rad), units="degrees"
            ),
            "ecliptic_latitude": ValueWithUnits(
                value=np.degrees(β_rad), units="degrees"
            ),
        }

    @staticmethod
    def Ec2Eq(
        λ: ValueWithUnits,
        β: ValueWithUnits,
        a_datetime: datetime,
    ) -> dict[str, ValueWithUnits]:
        """Convert ecliptic to equatorial coordinates.

        Meeus, 2009, Astronomical Algorithms, 2nd Edition, Chapter 13, page 93,

        13.3 13.4 Conversion of Ecliptic Coordinates to Equatorial Coordinates.

        Args:
            λ (ValueWithUnits): Ecliptic longitude.
            β (ValueWithUnits): Ecliptic latitude.
            a_datetime (datetime): datetime of observation.

        Returns:
            A dictionary containing the right ascension α and declination δ
                in ValueWithUnits.
        """
        λ_rad = find_radians(λ, "Ecliptic longitude")
        β_rad = find_radians(β, "Ecliptic latitude")

        ε = time.Meeus.obliquity_mean(a_datetime)["value"]
        ε_rad = np.radians(ε)

        α_rad = np.arctan2(
            np.sin(λ_rad) * np.cos(ε_rad) - np.tan(β_rad) * np.sin(ε_rad),
            np.cos(λ_rad),
        )
        δ_rad = np.arcsin(
            np.sin(β_rad) * np.cos(ε_rad)
            + np.cos(β_rad) * np.sin(ε_rad) * np.sin(λ_rad)
        )

        return {
            "right_ascension": ValueWithUnits(
                value=np.degrees(α_rad) / 15.0, units="hours"
            ),
            "declination": ValueWithUnits(value=np.degrees(δ_rad), units="degrees"),
        }

    @staticmethod
    def Eq2Hz(
        α: ValueWithUnits,
        δ: ValueWithUnits,
        φ: ValueWithUnits,
        L: ValueWithUnits,
        a_datetime: datetime,
    ) -> dict[str, ValueWithUnits]:
        """Convert horizontal to equatorial coordinates

        Meeus, 2009, 13.6 and 13.6

        Args:
            α (ValueWithUnits): Right ascension.
            δ (ValueWithUnits): Declination.
            φ (ValueWithUnits): observer's latitude positive north,
                negative south of the equator.
            L (ValueWithUnits): observer's longitude positive west,
                negative east of Greenwich.

        TODO: GAST, azimuth north and IAU longitude positive east options

        Returns:
            A dictionary of ValueWithUnits containing the azimuth A
                measured westward from south and altitude h positive
                above the horizon, negative below.
        """
        α_rad = find_radians(α, "Right ascension")
        δ_rad = find_radians(δ, "Declination")
        φ_rad = find_radians(φ, "Latitude")
        L_rad = find_radians(L, "Longitude")
        θ_rad = find_radians(time.Meeus.GMST(a_datetime=a_datetime), "GMST")

        print(f"**** θ_rad {θ_rad} degrees {np.degrees(θ_rad)}")

        H_rad = θ_rad - L_rad - α_rad

        A_rad = np.arctan2(
            np.sin(H_rad), np.cos(H_rad) * np.sin(φ_rad) - np.tan(δ_rad) * np.cos(φ_rad)
        )

        h_rad = np.arcsin(
            np.sin(φ_rad) * np.sin(δ_rad)
            + np.cos(φ_rad) * np.cos(δ_rad) * np.cos(H_rad)
        )

        return {
            "azimuth": ValueWithUnits(value=np.degrees(A_rad), units="degrees"),
            "altitude": ValueWithUnits(value=np.degrees(h_rad), units="degrees"),
        }

    @staticmethod
    def Hz2Eq(
        A: ValueWithUnits,
        h: ValueWithUnits,
        φ: ValueWithUnits,
        L: ValueWithUnits,
        a_datetime: datetime,
    ) -> dict[str, ValueWithUnits]:
        """Convert equatorial to horizontal coordinates

        Meeus, 2009, p. 94

        Args:
            A (ValueWithUnits): Azimuth measured westward from south.
            h (ValueWithUnits): Altitude positive above the horizon.
            φ (ValueWithUnits): observer's latitude positive north,
                negative south of the equator.
            L (ValueWithUnits): observer's longitude positive west,
                negative east of Greenwich.

        TODO: GAST, azimuth north and IAU longitude positive east options

        Returns:
            A dictionary of ValueWithUnits containing the Right Ascension
            and declination of the observed object.
        """

        A_rad = find_radians(A, "Azimuth")
        h_rad = find_radians(h, "Altitude")
        φ_rad = find_radians(φ, "Latitude")
        L_rad = find_radians(L, "Longitude")
        θ_rad = find_radians(time.Meeus.GMST(a_datetime=a_datetime), "GMST")

        H_rad = np.arctan2(
            np.sin(A_rad), np.cos(A_rad) * np.sin(h_rad) + np.tan(h_rad) * np.cos(φ_rad)
        )

        δ_rad = np.arcsin(
            np.sin(φ_rad) * np.sin(h_rad)
            - np.cos(φ_rad) * np.cos(h_rad) * np.cos(A_rad)
        )

        α_rad = H_rad - θ_rad + L_rad

        return {
            "right_ascension": ValueWithUnits(
                value=np.degrees(α_rad) / 15.0, units="hours"
            ),
            "declination": ValueWithUnits(value=np.degrees(δ_rad), units="degrees"),
        }
