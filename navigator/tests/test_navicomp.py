import pytest
import numpy as np

from navicomp import Space, UnitVectors

sqrt2over2 = np.sqrt(2) / 2


class TestDegrees2Radians:
    @pytest.mark.parametrize(
        "degrees, radians",
        [
            (0, 0),
            (45, Space.π / 4),
            (90, Space.π / 2),
            (180, Space.π),
            (270, 3 * 2 * Space.π / 4),
            (360, 2 * Space.π),
            (-45, -Space.π / 4),
            (-90, -Space.π / 2),
            (-180, -Space.π),
            (-270, -3 * 2 * Space.π / 4),
            (-360, -2 * Space.π),
        ],
    )
    def test_deg2rad(self, degrees, radians):
        assert Space.deg2rad(degrees) == radians
        assert Space.rad2deg(radians) == degrees


class TestUnitVectors:
    """Test unit vectors."""

    def test_Uo(self):
        """Test unit vector x."""
        assert UnitVectors.Uo.value.x == 0
        assert UnitVectors.Uo.value.y == 0
        assert UnitVectors.Uo.value.z == 0

        with pytest.raises(AttributeError):
            UnitVectors.Uo = UnitVectors.Ux

    def test_Ux(self):
        """Test unit vector x."""
        assert UnitVectors.Ux.value.x == 1
        assert UnitVectors.Ux.value.y == 0
        assert UnitVectors.Ux.value.z == 0

        with pytest.raises(AttributeError):
            UnitVectors.Ux = Space(0, 0, 0)

    def test_Uy(self):
        """Test unit vector y."""
        assert UnitVectors.Uy.value.x == 0
        assert UnitVectors.Uy.value.y == 1
        assert UnitVectors.Uy.value.z == 0

        with pytest.raises(AttributeError):
            UnitVectors.Uy = UnitVectors.Ux

    def test_Uz(self):
        """Test unit vector z."""
        assert UnitVectors.Uz.value.x == 0
        assert UnitVectors.Uz.value.y == 0
        assert UnitVectors.Uz.value.z == 1

        with pytest.raises(AttributeError):
            UnitVectors.Uz = UnitVectors.Ux

    def test_add_Uo(self):
        s0 = Space(1, 2, 3)
        s1 = s0 + UnitVectors.Uo.value
        assert s1 == s0

    def test_add_Ux_00(self):
        s0 = Space(1, 2, 3)
        s1 = s0 + UnitVectors.Ux.value
        assert s1 == Space(2, 2, 3)

    def test_add_Ux_01(self):
        s0 = Space(1, 2, 3)
        s1 = UnitVectors.Ux.value + s0
        assert s1 == Space(2, 2, 3)

    def test_sub_Uo(self):
        s0 = Space(1, 2, 3)
        s1 = s0 - UnitVectors.Uo.value
        assert s1 == s0

    def test_sub_Ux(self):
        s0 = Space(1, 2, 3)
        s1 = UnitVectors.Ux.value - s0
        assert s1 == Space(0, -2, -3)

    def test_sub_Uy(self):
        s0 = Space(1, 2, 3)
        s1 = UnitVectors.Uy.value - s0
        assert s1 == Space(-1, -1, -3)

    def test_sub_Uz(self):
        s0 = Space(1, 2, 3)
        s1 = s0 - UnitVectors.Uz.value
        assert s1 == Space(1, 2, 2)


class TestAccessorsReprStrEval:
    def test_cartesian_accessors(self):
        """Test x, y, z accessors are read only."""
        space = Space(1.23, 2.0, 3)

        assert space.x == 1.23
        with pytest.raises(AttributeError):
            space.x = 4.5

        assert space.y == 2
        with pytest.raises(AttributeError):
            space.y = -14.5

        assert space.z == 3.0
        with pytest.raises(AttributeError):
            space.z = 404.5346

    def test_repr_01(self):
        space = Space(2, -3, 5)
        assert repr(space) == "Space(2, -3, 5)"

    def test_eval_repr_01(self):
        space_0 = Space(2, -3, 5)
        space_1 = eval(repr(space_0))
        assert space_0 == space_1

    def test_str_01(self):
        space = Space(1, 2, 3)
        assert str(space) == "Space(x=1, y=2, z=3)"

    def test_eval_str_01(self):
        space_0 = Space(2, -3, 5)
        space_1 = eval(str(space_0))
        assert space_0 == space_1


class TestMixingTypeSetsExceptions:
    """Mixing type sets is not supported."""

    def test_physics_1_2_combo_exception_00(self):
        with pytest.raises(ValueError):
            Space(ρ=1, r=2)

    def test_physics_1_2_combo_exception_01(self):
        with pytest.raises(ValueError):
            Space(θ=0, r=2)

    def test_physics_geo_combo_exception_01(self):
        with pytest.raises(ValueError):
            Space(h=10, r=2)

    def test_cartesian_geo_combo_exception_01(self):
        with pytest.raises(ValueError):
            Space(h=10, x=2)

    def test_cartesian_physics_combo_exception_01(self):
        with pytest.raises(ValueError):
            Space(theta=10, z=2)


class TestDefaultPartialConstructors:
    def test_default_space_constructor(self):
        """Test default space constructor."""
        space = Space()
        assert space == UnitVectors.Uo
        assert space.x == 0
        assert space.y == 0
        assert space.z == 0
        assert space.ρ == 0
        assert space.θ == 0
        assert space.φ == 0

    def test_x(self):
        space = Space(x=1)
        assert space.x == 1
        assert space.y == 0
        assert space.z == 0
        assert space.ρ == 1
        assert space.θ == Space.π / 2
        assert space.φ == 0

    def test_y(self):
        space = Space(y=1)
        assert space.x == 0
        assert space.y == 1
        assert space.z == 0
        assert space.ρ == 1
        assert space.θ == Space.π / 2
        assert space.φ == Space.π / 2

    def test_z(self):
        space = Space(z=1)
        assert space.x == 0
        assert space.y == 0
        assert space.z == 1
        assert space.ρ == 1
        assert space.θ == 0
        assert space.φ == 0

    def test_ρ(self):
        space = Space(ρ=1)
        assert space.x == 0
        assert space.y == 0
        assert space.z == 1
        assert space.ρ == 1
        assert space.θ == 0
        assert space.φ == 0

    def test_θ(self):
        space = Space(θ=Space.π / 2)
        assert space.x == 1
        assert space.y == 0
        assert space.z == pytest.approx(0, abs=1e-16)
        assert space.ρ == 1
        assert space.θ == Space.π / 2
        assert space.φ == 0

    def test_φ(self):
        space = Space(φ=Space.π / 2)
        assert space.x == 0
        assert space.y == 0
        assert space.z == 1
        assert space.ρ == 1
        assert space.θ == 0
        assert space.φ == 0


class TestCartesianConstructors:
    def test_default_space_constructor(self):
        """Test default space constructor."""
        space = Space()
        assert space == UnitVectors.Uo

    @pytest.mark.parametrize(
        "x, y, z, expect",
        [
            (1, 2, 3, Space(1, 2, 3)),
            (-1, 2, 3, Space(-1, 2, 3)),
            (1, -2, 3, Space(1, -2, 3)),
            (-1, -2, 3, Space(-1, -2, 3)),
            (-1, -2, -3, Space(-1, -2, -3)),
            (-1, 2, -3, Space(-1, 2, -3)),
            (1, -2, -3, Space(1, -2, -3)),
        ],
    )
    def test_x_y_z(self, x, y, z, expect):
        space = Space(x, y, z)
        assert space == expect
        assert space.x == x
        assert space.y == y
        assert space.z == z


class TestSphericalPhysics1RangeExceptions:
    @pytest.mark.parametrize(
        "ρ, θ, φ",
        [
            (-1, 0, 0),
            (1, -Space.π / 2, 0),
            (1, 0, -Space.π / 2),
            (1, 2 * Space.π, 0),
            (1, Space.π / 3, 2.0000001 * Space.π),
        ],
    )
    def test_ρ_θ_φ(self, ρ, θ, φ):
        with pytest.raises(ValueError):
            Space(ρ=ρ, θ=θ, φ=φ)


class TestSphericalPhysics1Constructors:
    @pytest.mark.parametrize(
        "ρ, θ, φ, x, y, z",
        [
            (0, 0, 0, 0, 0, 0),
            # down the prime meridian
            (1, 0, 0, 0, 0, 1),
            (1, Space.π / 4, 0, sqrt2over2, 0, sqrt2over2),
            (1, Space.π / 2, 0, 1, 0, 0),
            (1, 3 * Space.π / 4, 0, sqrt2over2, 0, -sqrt2over2),
            (1, Space.π, 0, 0.0, 0, -1),
            # around the equator
            (1, Space.π / 2, 0, 1.0, 0.0, 0),
            (1, Space.π / 2, Space.π / 4.0, sqrt2over2, sqrt2over2, 0),
            (1, Space.π / 2, Space.π / 2, 0, 1, 0),
            (
                1,
                Space.π / 2,
                3 * Space.π / 4,
                -sqrt2over2,
                sqrt2over2,
                0,
            ),
            (1, Space.π / 2, Space.π, -1, 0, 0),
            (1, Space.π / 2, 5 * Space.π / 4, -sqrt2over2, -sqrt2over2, 0),
            (1, Space.π / 2, 3 * Space.π / 2, 0, -1, 0),
            (1, Space.π / 2, 2 * Space.π, 1, 0, 0),
            # around the tropic of Cancer-ish
            (1, Space.π / 4, 0, sqrt2over2, 0, sqrt2over2),
            (1, Space.π / 4, Space.π / 4.0, 0.5, 0.5, sqrt2over2),
            (1, Space.π / 4, Space.π / 2, 0, sqrt2over2, sqrt2over2),
            (1, Space.π / 4, 3 * Space.π / 4, -0.5, 0.5, sqrt2over2),
            (1, Space.π / 4, Space.π, -sqrt2over2, 0, sqrt2over2),
            (1, Space.π / 4, 5 * Space.π / 4, -0.5, -0.5, sqrt2over2),
            (1, Space.π / 4, 3 * Space.π / 2, 0, -sqrt2over2, sqrt2over2),
            (1, Space.π / 4, 2 * Space.π, sqrt2over2, 0, sqrt2over2),
            # around the tropic of Capricorn-ish
            (1, 3 * Space.π / 4, 0, sqrt2over2, 0, -sqrt2over2),
            (1, 3 * Space.π / 4, Space.π / 4.0, 0.5, 0.5, -sqrt2over2),
            (
                1,
                3 * Space.π / 4,
                Space.π / 2,
                0,
                sqrt2over2,
                -sqrt2over2,
            ),
            (1, 3 * Space.π / 4, Space.π, -sqrt2over2, 0, -sqrt2over2),
            (1, 3 * Space.π / 4, 3 * Space.π / 4, -0.5, 0.5, -sqrt2over2),
            (1, 3 * Space.π / 4, Space.π, -sqrt2over2, 0, -sqrt2over2),
            (1, 3 * Space.π / 4, 5 * Space.π / 4, -0.5, -0.5, -sqrt2over2),
            (1, 3 * Space.π / 4, 3 * Space.π / 2, 0, -sqrt2over2, -sqrt2over2),
            (1, 3 * Space.π / 4, 2 * Space.π, sqrt2over2, 0, -sqrt2over2),
            # world size
            (Space.Re, Space.π / 2, Space.π / 2, 0, Space.Re, 0),
        ],
    )
    def test_ρ_θ_φ(self, ρ, θ, φ, x, y, z):
        space = Space(ρ=ρ, θ=θ, φ=φ)
        assert space.ρ == ρ
        assert space.θ == pytest.approx(θ, abs=1e-9)
        assert space.φ == pytest.approx(φ, abs=1e-9)
        assert space.x == pytest.approx(x, abs=1e-9)
        assert space.y == pytest.approx(y, abs=1e-9)
        assert space.z == pytest.approx(z, abs=1e-9)
        assert space.r == ρ
        assert space.theta == pytest.approx(θ, abs=1e-9)
        assert space.phi == pytest.approx(φ, abs=1e-9)


class TestSphericalPhysics2RangeExceptions:
    @pytest.mark.parametrize(
        "r, theta, phi",
        [
            (-1, 0, 0),
            (1, -Space.π / 2, 0),
            (1, 0, -1.000001 * Space.π / 2),
            (1, 2 * Space.π, 0),
            (1, Space.π / 3, 2.0000001 * Space.π),
        ],
    )
    def test_r_theta_phi(self, r, theta, phi):
        with pytest.raises(ValueError):
            Space(r=r, theta=theta, phi=phi)


class TestSphericalPhysics2Constructors:
    @pytest.mark.parametrize(
        "r, theta, phi, x, y, z",
        [
            (0, 0, 0, 0, 0, 0),
            # down the prime meridian
            (1, 0, 0, 0, 0, 1),
            (1, Space.π / 4, 0, sqrt2over2, 0, sqrt2over2),
            (1, Space.π / 2, 0, 1, 0, 0),
            (1, Space.π, 0, 0, 0, -1),
            (1, 3 * Space.π / 4, 0, sqrt2over2, 0, -sqrt2over2),
            (1, Space.π, 0, 0.0, 0, -1),
            # around the equator
            (1, Space.π / 2, 0, 1.0, 0.0, 0),
            (1, Space.π / 2, Space.π / 4.0, sqrt2over2, sqrt2over2, 0),
            (1, Space.π / 2, Space.π / 2, 0, 1, 0),
            (
                1,
                Space.π / 2,
                3 * Space.π / 4,
                -sqrt2over2,
                sqrt2over2,
                0,
            ),
            (1, Space.π / 2, Space.π, -1, 0, 0),
            (1, Space.π / 2, 5 * Space.π / 4, -sqrt2over2, -sqrt2over2, 0),
            (1, Space.π / 2, 3 * Space.π / 2, 0, -1, 0),
            (1, Space.π / 2, 2 * Space.π, 1, 0, 0),
            # around the tropic of Cancer-ish
            (1, Space.π / 4, 0, sqrt2over2, 0, sqrt2over2),
            (1, Space.π / 4, Space.π / 4.0, 0.5, 0.5, sqrt2over2),
            (1, Space.π / 4, Space.π / 2, 0, sqrt2over2, sqrt2over2),
            (1, Space.π / 4, 3 * Space.π / 4, -0.5, 0.5, sqrt2over2),
            (1, Space.π / 4, Space.π, -sqrt2over2, 0, sqrt2over2),
            (1, Space.π / 4, 5 * Space.π / 4, -0.5, -0.5, sqrt2over2),
            (1, Space.π / 4, 3 * Space.π / 2, 0, -sqrt2over2, sqrt2over2),
            (1, Space.π / 4, 2 * Space.π, sqrt2over2, 0, sqrt2over2),
            # around the tropic of Capricorn-ish
            (1, 3 * Space.π / 4, 0, sqrt2over2, 0, -sqrt2over2),
            (1, 3 * Space.π / 4, Space.π / 4.0, 0.5, 0.5, -sqrt2over2),
            (
                1,
                3 * Space.π / 4,
                Space.π / 2,
                0,
                sqrt2over2,
                -sqrt2over2,
            ),
            (1, 3 * Space.π / 4, 3 * Space.π / 4, -0.5, 0.5, -sqrt2over2),
            (1, 3 * Space.π / 4, Space.π, -sqrt2over2, 0, -sqrt2over2),
            (1, 3 * Space.π / 4, 3 * Space.π / 4, -0.5, 0.5, -sqrt2over2),
            (1, 3 * Space.π / 4, Space.π, -sqrt2over2, 0, -sqrt2over2),
            (1, 3 * Space.π / 4, 5 * Space.π / 4, -0.5, -0.5, -sqrt2over2),
            (1, 3 * Space.π / 4, 3 * Space.π / 2, 0, -sqrt2over2, -sqrt2over2),
            (1, 3 * Space.π / 4, 2 * Space.π, sqrt2over2, 0, -sqrt2over2),
            # world size
            (Space.Re, Space.π / 2, Space.π / 2, 0, Space.Re, 0),
        ],
    )
    def test_r_theta_phi(self, r, theta, phi, x, y, z):
        space = Space(r=r, theta=theta, phi=phi)
        assert space.ρ == r
        assert space.θ == pytest.approx(theta, abs=1e-9)
        assert space.φ == pytest.approx(phi, abs=1e-9)
        assert space.x == pytest.approx(x, abs=1e-9)
        assert space.y == pytest.approx(y, abs=1e-9)
        assert space.z == pytest.approx(z, abs=1e-9)
        assert space.r == r
        assert space.theta == pytest.approx(theta, abs=1e-9)
        assert space.phi == pytest.approx(phi, abs=1e-9)


class TestSphericalGeo1RangeExceptions:
    @pytest.mark.parametrize(
        "h, az, el",
        [
            (-1.0000001 * Space.Re, 0, 0),
            (1, -0.0000001, 0),
            (1, -2.000001 * Space.π, 0),
            (1, 0, -1.00001 * Space.π / 2),
            (1, 0, 1.00001 * Space.π / 2),
        ],
    )
    def test_h_az_el(self, h, az, el):
        with pytest.raises(ValueError):
            Space(h=h, az=az, el=el)


class TestSphericalGeo1Constructors:
    @pytest.mark.parametrize(
        "h, el, az, x, y, z",
        [
            (0, 0, 0, Space.Re, 0, 0),
            # down the prime meridian
            (1, Space.π / 2, 0, 0, 0, Space.Re + 1),
            (0, Space.π / 4, 0, sqrt2over2 * Space.Re, 0, sqrt2over2 * Space.Re),
            (1, 0, 0, Space.Re + 1, 0, 0),
            (0, -Space.π / 4, 0, sqrt2over2 * Space.Re, 0, -sqrt2over2 * Space.Re),
            (0, -Space.π / 2, 0, 0, 0, -Space.Re),
            # around the equator
            (0, 0, 0, Space.Re, 0, 0),
            (0, 0, Space.π / 4.0, sqrt2over2 * Space.Re, sqrt2over2 * Space.Re, 0),
            (0, 0, Space.π / 2, 0, Space.Re, 0),
            (
                0,
                0,
                3 * Space.π / 4,
                -sqrt2over2 * Space.Re,
                sqrt2over2 * Space.Re,
                0,
            ),
            (0, 0, Space.π, -Space.Re, 0, 0),
            (0, 0, 5 * Space.π / 4, -sqrt2over2 * Space.Re, -sqrt2over2 * Space.Re, 0),
            (0, 0, 3 * Space.π / 2, 0, -Space.Re, 0),
            (0, 0, 2 * Space.π, Space.Re, 0, 0),
            # around the tropic of Cancer-ish
            (0, Space.π / 4, 0, sqrt2over2 * Space.Re, 0, sqrt2over2 * Space.Re),
            (
                0,
                Space.π / 4,
                Space.π / 4.0,
                0.5 * Space.Re,
                0.5 * Space.Re,
                sqrt2over2 * Space.Re,
            ),
            (
                0,
                Space.π / 4,
                Space.π / 2,
                0,
                sqrt2over2 * Space.Re,
                sqrt2over2 * Space.Re,
            ),
            (
                0,
                Space.π / 4,
                3 * Space.π / 4,
                -0.5 * Space.Re,
                0.5 * Space.Re,
                sqrt2over2 * Space.Re,
            ),
            (0, Space.π / 4, Space.π, -sqrt2over2 * Space.Re, 0, sqrt2over2 * Space.Re),
            (
                0,
                Space.π / 4,
                5 * Space.π / 4,
                -0.5 * Space.Re,
                -0.5 * Space.Re,
                sqrt2over2 * Space.Re,
            ),
            (
                0,
                Space.π / 4,
                3 * Space.π / 2,
                0,
                -sqrt2over2 * Space.Re,
                sqrt2over2 * Space.Re,
            ),
            (
                0,
                Space.π / 4,
                2 * Space.π,
                sqrt2over2 * Space.Re,
                0,
                sqrt2over2 * Space.Re,
            ),
            # around the tropic of Capricorn-ish
            (0, -Space.π / 4, 0, sqrt2over2 * Space.Re, 0, -sqrt2over2 * Space.Re),
            (
                0,
                -Space.π / 4,
                Space.π / 4.0,
                0.5 * Space.Re,
                0.5 * Space.Re,
                -sqrt2over2 * Space.Re,
            ),
            (
                0,
                -Space.π / 4,
                Space.π / 2,
                0,
                sqrt2over2 * Space.Re,
                -sqrt2over2 * Space.Re,
            ),
            (
                0,
                -Space.π / 4,
                3 * Space.π / 4,
                -0.5 * Space.Re,
                0.5 * Space.Re,
                -sqrt2over2 * Space.Re,
            ),
            (0, Space.π / 4, Space.π, -sqrt2over2 * Space.Re, 0, sqrt2over2 * Space.Re),
            (
                0,
                -Space.π / 4,
                5 * Space.π / 4,
                -0.5 * Space.Re,
                -0.5 * Space.Re,
                -sqrt2over2 * Space.Re,
            ),
            (
                0,
                -Space.π / 4,
                3 * Space.π / 2,
                0,
                -sqrt2over2 * Space.Re,
                -sqrt2over2 * Space.Re,
            ),
            (
                0,
                -Space.π / 4,
                2 * Space.π,
                sqrt2over2 * Space.Re,
                0,
                -sqrt2over2 * Space.Re,
            ),
        ],
    )
    def test_h_az_el(self, h, az, el, x, y, z):
        space = Space(h=h, el=el, az=az)
        assert space.h == pytest.approx(h, abs=1e-9)
        assert space.az == pytest.approx(az, abs=1e-9)
        assert space.el == pytest.approx(el, abs=1e-9)
        assert space.x == pytest.approx(x, abs=1)
        assert space.y == pytest.approx(y, abs=1)
        assert space.z == pytest.approx(z, abs=1)


class TestSphericalGeo2RangeExceptions:
    @pytest.mark.parametrize(
        "alt, lat, lon",
        [
            (-1.0000001 * Space.Re, 0, 0),
            (0, -1.0000001 * Space.π / 2, 0),
            (0, 1.0000001 * Space.π / 2, 0),
            (0, 0, -0.000000001),
            (0, 0, 2.000000001 * Space.π),
        ],
    )
    def test_alt_lat_lon(self, alt, lat, lon):
        with pytest.raises(ValueError):
            Space(alt=alt, lat=lat, lon=lon)


class TestSphericalGeo2Constructors:
    @pytest.mark.parametrize(
        "alt, lat, lon, x, y, z",
        [
            (0, 0, 0, Space.Re, 0, 0),
            # down the prime meridian
            (1, Space.π / 2, 0, 0, 0, Space.Re + 1),
            (0, Space.π / 4, 0, sqrt2over2 * Space.Re, 0, sqrt2over2 * Space.Re),
            (1, 0, 0, Space.Re + 1, 0, 0),
            (0, -Space.π / 4, 0, sqrt2over2 * Space.Re, 0, -sqrt2over2 * Space.Re),
            (0, -Space.π / 2, 0, 0, 0, -Space.Re),
            # around the equator
            (0, 0, 0, Space.Re, 0, 0),
            (0, 0, Space.π / 4.0, sqrt2over2 * Space.Re, sqrt2over2 * Space.Re, 0),
            (0, 0, Space.π / 2, 0, Space.Re, 0),
            (
                0,
                0,
                3 * Space.π / 4,
                -sqrt2over2 * Space.Re,
                sqrt2over2 * Space.Re,
                0,
            ),
            (0, 0, Space.π, -Space.Re, 0, 0),
            (0, 0, 5 * Space.π / 4, -sqrt2over2 * Space.Re, -sqrt2over2 * Space.Re, 0),
            (0, 0, 3 * Space.π / 2, 0, -Space.Re, 0),
            (0, 0, 2 * Space.π, Space.Re, 0, 0),
            # around the tropic of Cancer-ish
            (0, Space.π / 4, 0, sqrt2over2 * Space.Re, 0, sqrt2over2 * Space.Re),
            (
                0,
                Space.π / 4,
                Space.π / 4.0,
                0.5 * Space.Re,
                0.5 * Space.Re,
                sqrt2over2 * Space.Re,
            ),
            (
                0,
                Space.π / 4,
                Space.π / 2,
                0,
                sqrt2over2 * Space.Re,
                sqrt2over2 * Space.Re,
            ),
            (
                0,
                Space.π / 4,
                3 * Space.π / 4,
                -0.5 * Space.Re,
                0.5 * Space.Re,
                sqrt2over2 * Space.Re,
            ),
            (0, Space.π / 4, Space.π, -sqrt2over2 * Space.Re, 0, sqrt2over2 * Space.Re),
            (
                0,
                Space.π / 4,
                5 * Space.π / 4,
                -0.5 * Space.Re,
                -0.5 * Space.Re,
                sqrt2over2 * Space.Re,
            ),
            (
                0,
                Space.π / 4,
                3 * Space.π / 2,
                0,
                -sqrt2over2 * Space.Re,
                sqrt2over2 * Space.Re,
            ),
            (
                0,
                Space.π / 4,
                2 * Space.π,
                sqrt2over2 * Space.Re,
                0,
                sqrt2over2 * Space.Re,
            ),
            # around the tropic of Capricorn-ish
            (0, -Space.π / 4, 0, sqrt2over2 * Space.Re, 0, -sqrt2over2 * Space.Re),
            (
                0,
                -Space.π / 4,
                Space.π / 4.0,
                0.5 * Space.Re,
                0.5 * Space.Re,
                -sqrt2over2 * Space.Re,
            ),
            (
                0,
                -Space.π / 4,
                Space.π / 2,
                0,
                sqrt2over2 * Space.Re,
                -sqrt2over2 * Space.Re,
            ),
            (
                0,
                -Space.π / 4,
                3 * Space.π / 4,
                -0.5 * Space.Re,
                0.5 * Space.Re,
                -sqrt2over2 * Space.Re,
            ),
            (0, Space.π / 4, Space.π, -sqrt2over2 * Space.Re, 0, sqrt2over2 * Space.Re),
            (
                0,
                -Space.π / 4,
                5 * Space.π / 4,
                -0.5 * Space.Re,
                -0.5 * Space.Re,
                -sqrt2over2 * Space.Re,
            ),
            (
                0,
                -Space.π / 4,
                3 * Space.π / 2,
                0,
                -sqrt2over2 * Space.Re,
                -sqrt2over2 * Space.Re,
            ),
            (
                0,
                -Space.π / 4,
                2 * Space.π,
                sqrt2over2 * Space.Re,
                0,
                -sqrt2over2 * Space.Re,
            ),
        ],
    )
    def test_alt_lat_lon(self, alt, lat, lon, x, y, z):
        space = Space(alt=alt, lat=lat, lon=lon)
        assert space.alt == pytest.approx(alt, abs=1e-9)
        assert space.lat == pytest.approx(lat, abs=1e-9)
        assert space.lon == pytest.approx(lon, abs=1e-9)
        assert space.x == pytest.approx(x, abs=1)
        assert space.y == pytest.approx(y, abs=1)
        assert space.z == pytest.approx(z, abs=1)


class TestOperators:
    def test_equality_00(self):
        space = Space(-1, 2, 3)
        assert space == Space(-1, 2, 3)

    def test_equality_01(self):
        space = Space(-1, 2, 3)
        assert space != Space(1, 2, 3)

    def test_equality_Uo(self):
        space = Space()
        assert space == UnitVectors.Uo

    def test_vector_unitary_minus_00(self):
        s0 = Space(1, 2, 3)
        s1 = -Space(2, 3, 4)
        s3 = s0 + s1
        assert s3 == Space(-1, -1, -1)

    def test_vector_add_00(self):
        s0 = Space(1, 2, 3)
        s1 = s0 + UnitVectors.Uo.value
        assert s1 == s0

    def test_vector_add_01(self):
        s0 = Space(1, 2, 3)
        s1 = UnitVectors.Uo.value + s0
        assert s1 == s0

    def test_vector_add_02(self):
        s0 = Space(1, 2, 3)
        s1 = s0 + UnitVectors.Ux.value
        assert s1 == Space(2, 2, 3)

    def test_vector_add_03(self):
        s0 = Space(1, 2, 3)
        s1 = UnitVectors.Ux.value + s0
        assert s1 == Space(2, 2, 3)

    def test_vector_add_10(self):
        s0 = Space(1, 2, 3)
        s1 = Space(2, 3, 4)
        s3 = s0 + s1
        assert s3 == Space(3, 5, 7)

    def test_vector_radd_10(self):
        s0 = Space(1, 2, 3)
        s1 = Space(2, 3, 4)
        s3 = s1 + s0
        assert s3 == Space(3, 5, 7)

    def test_vector_iadd_str_error_00(self):
        with pytest.raises(TypeError):
            s0 = Space(1, 2, 3)
            s0 += "asdf"

    def test_vector_iadd_00(self):
        s0 = Space(1, 2, 3)
        s0 += UnitVectors.Uz.value
        assert s0 == Space(1, 2, 4)

    def test_vector_iadd_01(self):
        s0 = Space(1, 2, 3)
        s0 += -3
        assert s0 == Space(-2, -1)

    def test_vector_add_float_error_00(self):
        with pytest.raises(TypeError):
            Space(1, 2, 3) + Space.π

    def test_vector_add_float_error_01(self):
        with pytest.raises(TypeError):
            Space.π + Space(1, 2, 3)

    def test_vector_add_negative_00(self):
        s0 = Space(1, 2, 3)
        s1 = -1 * Space(2, 3, 4)
        s3 = s0 + s1
        assert s3 == Space(-1, -1, -1)

    def test_vector_sub_float_error_00(self):
        with pytest.raises(TypeError):
            Space(1, 2, 3) - Space.π

    def test_vector_sub_float_error_01(self):
        with pytest.raises(TypeError):
            Space.π - Space(1, 2, 3)

    def test_vector_sub_00(self):
        s0 = Space(1, 2, 3)
        s1 = s0 - UnitVectors.Uo.value
        assert s1 == s0

    def test_vector_sub_01(self):
        s0 = Space(1, 2, 3)
        s1 = UnitVectors.Uy.value - s0
        assert s1 == Space(-1, -1, -3)

    def test_vector_rsub_01(self):
        s0 = Space(1, 2, 3)
        s1 = s0 - UnitVectors.Uy.value
        assert s1 == Space(1, 1, 3)

    def test_vector_isub_str_error_00(self):
        with pytest.raises(TypeError):
            s0 = Space(1, 2, 3)
            s0 -= "asdf"

    def test_vector_isub_00(self):
        s0 = Space(1, -4, 3)
        s0 -= UnitVectors.Uy.value
        assert s0 == Space(1, -5, 3)

    def test_vector_isub_01(self):
        s0 = Space(1, -4, 3)
        s0 -= 4
        assert s0 == Space(-3, -8, -1)

    def test_scalar_mul_00(self):
        space = 0.0 * UnitVectors.Ux.value
        assert space.x == 0.0
        assert space.y == 0.0
        assert space.z == 0

    def test_scalar_mul_01(self):
        space = Space(1, 1, 1) * 2
        assert space.x == 2
        assert space.y == 2
        assert space.z == 2
        assert space.ρ == np.sqrt(2 * 2 + 2 * 2 + 2 * 2)  # 3.4641016151377544
        assert space.θ == pytest.approx(0.9553166181245093, abs=1e-9)
        assert space.φ == 0.7853981633974483
        assert space.h == -6370996.535898385  # x, y, z too small for this
        assert space.az == space.φ
        assert space.el == 0.6154797086703873

    def test_scalar_mul_02(self):
        space = Space.π * UnitVectors.Uz.value
        assert space.x == 0.0
        assert space.y == 0.0
        assert space.z == space.π

    def test_scalar_imul_exception_00(self):
        """Test scalar inplace multiply exception.

        Not dot or cross product.
        """
        with pytest.raises(TypeError):
            s0 = Space(1, -2, 3)
            s0 *= Space(2)

    def test_scalar_imul_00(self):
        space = Space(1, -2, 3)
        space *= 3
        assert space.x == 3
        assert space.y == -6
        assert space.z == 9

    def test_scalar_itruediv_exception_00(self):
        """Test scalar inplace div exception."""
        with pytest.raises(ZeroDivisionError):
            s0 = Space(-1, -2, 3)
            s0 /= 0

    def test_scalar_itruediv_exception_01(self):
        """Test scalar inplace multiply exception.

        Not dot or cross product.
        """
        with pytest.raises(TypeError):
            s0 = Space(1, -2, 3)
            s0 /= Space(2, 4, 6)

    def test_scalar_itruediv_00(self):
        s0 = Space(2, 4, 6)
        s0 /= 2
        assert s0 == Space(1, 2, 3)

    def test_scalar_itruediv_01(self):
        s0 = Space(2, 4, 6)
        s0 /= 2
        assert s0 == Space(1, 2, 3)

    def test_scalar_div_00(self):
        with pytest.raises(ZeroDivisionError):
            Space(1, 1, 1) / 0.0

    def test_scalar_div_000(self):
        with pytest.raises(ZeroDivisionError):
            1.0 / Space(0, 0, 0)

    def test_scalar_div_01(self):
        space = Space(1, 1, 1) / 1.0
        assert space == Space(1.0, 1.0, 1.0)

    def test_scalar_div_02(self):
        space = Space(1, 1, 1) / 2.0
        assert space == Space(0.5, 0.5, 0.5)

    @pytest.mark.skip(reason="double exceptions?")
    def test_scalar_div_03(self):
        with pytest.raises(TypeError):
            Space(ρ=1, θ=Space.π / 4, φ=-Space.π / 4) / 2.0

    def test_scalar_div_04(self):
        space = Space(1.2, -31.5, -2.71) / 2.0
        assert space == Space(0.6, -15.75, -1.355)

    def test_scalar_div_05(self):
        space = 1.0 / Space(0.5, 0.5, 0.5)
        assert space == Space(2, 2, 2)

    def test_scalar_div_06(self):
        space = 1.0 / Space(-1.0, 2.0, 3.5)
        assert space == Space(-1.0, 0.5, 0.2857142857142857)

    def test_scalar_ifloordiv_00(self):
        with pytest.raises(ZeroDivisionError):
            s1 = Space(1, 1, 1)
            s1 //= 0.0

    def test_scalar_ifloordiv_000(self):
        with pytest.raises(TypeError):
            s1 = Space(1, 1, 1)
            s1 //= Space(2, 3, 4)

    def test_scalar_ifloordiv_01(self):
        s1 = Space(1, 1, 1)
        s1 //= 3
        assert s1 == Space(0, 0, 0)

    def test_scalar_ifloordiv_02(self):
        s1 = Space(10, 10, 10)
        s1 //= 3
        assert s1 == Space(3, 3, 3)

    def test_scalar_ifloordiv_03(self):
        s1 = Space(100, -99, 10)
        s1 //= 7
        assert s1 == Space(14, -15, 1)
