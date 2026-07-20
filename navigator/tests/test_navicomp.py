import pytest
import numpy as np

from navicomp import Space, UnitVectors


class TestCartesianConstructors:

    def test_default_space_constructor(self):
        """Test default space constructor."""
        space = Space()
        assert space == UnitVectors.Uo

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

    def test_space_accessors(self):
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


class TestSphericalPhysicsConstructors:

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

    def test_spherical_physics_1_00(self):
        space = Space(ρ=1)
        assert space == Space(z=1.0)

    def test_spherical_physics_1_01(self):
        space = Space(θ=Space.π)
        assert space.z == -1.0
        assert space.y == 0
        assert space.x == pytest.approx(0, abs=1e-15)
        # TODO assert space == Space(z=-1.0)

    def test_spherical_physics_2_00(self):
        space = Space(r=2)
        assert space == Space(z=2.0)

    def test_spherical_physics_2_01(self):
        space = Space(r=2, theta=Space.π / 3.0)
        assert space.x == 1.7320508075688772
        assert space.y == 0.0
        assert space.z == pytest.approx(1.0, abs=1e-15)
        # TODO assert space == Space(x=1.7320508075688772, z=1.0)


class TestSphericalGeoConstructors:

    def test_cartesian_geo_combo_exception_01(self):
        with pytest.raises(ValueError):
            Space(el=10, z=2)

    def test_spherical_geo_00(self):
        space = Space(az=Space.π)
        assert space.z == 0.0
        assert space.y == pytest.approx(0, abs=1e-15)
        assert space.x == -1

    def test_spherical_geo_01(self):
        space = Space(az=0, el=Space.π / 4)
        assert space.z == 0.7071067811865475
        assert space.y == pytest.approx(0, abs=1e-15)
        assert space.x == 0.7071067811865476

    def test_spherical_geo_02(self):
        space = Space(az=Space.π, el=Space.π / 4)
        assert space.z == 0.7071067811865475
        assert space.y == pytest.approx(0, abs=1e-15)
        assert space.x == -0.7071067811865476


class TestDegrees2Radians:

    def test_deg2rad_00(self):
        assert Space.deg2rad(0) == 0

    def test_deg2rad_01(self):
        assert Space.deg2rad(180) == Space.π

    def test_deg2rad_02(self):
        assert Space.deg2rad(90) == Space.π / 2.0

    def test_deg2rad_03(self):
        assert Space.deg2rad(-90) == -Space.π / 2.0

    def test_deg2rad_04(self):
        assert Space.deg2rad(360) == 2 * Space.π

    def test_deg2rad_05(self):
        assert Space.deg2rad(270) == 1.5 * Space.π

    def test_deg2rad_06(self):
        assert Space.deg2rad(45) == Space.π / 4


class TestRadians2Degrees:

    def test_rad2deg_00(self):
        assert Space.rad2deg(0) == 0

    def test_rad2deg_01(self):
        assert Space.rad2deg(Space.π) == 180.0

    def test_rad2deg_02(self):
        assert Space.rad2deg(Space.π / 2) == 90.0

    def test_rad2deg_03(self):
        assert Space.rad2deg(-Space.π / 2) == -90.0

    def test_rad2deg_04(self):
        assert Space.rad2deg(2.0 * Space.π) == 360.0

    def test_rad2deg_05(self):
        assert Space.rad2deg(3 / 2 * Space.π) == 270.0

    def test_rad2deg_06(self):
        assert Space.rad2deg(-Space.π / 4.0) == -45.0


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
        assert space.θ == 0.9553166181245093
        assert space.φ == 0.7853981633974483
        assert space.h == 3.464101615137755  # rounding difference with ρ
        assert space.az == space.φ  # 0.7853981633974483
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

    def test_scalar_div_03(self):
        space = Space(ρ=1, θ=Space.π / 4, φ=-Space.π / 4) / 2.0
        assert space == Space(0.25, -0.24999999999999994, 0.3535533905932738)

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


class TestUnitVectors:
    """Test unit vectors."""

    def test_unit_vector_o(self):
        """Test unit vector x."""
        assert UnitVectors.Uo.value.x == 0
        assert UnitVectors.Uo.value.y == 0
        assert UnitVectors.Uo.value.z == 0

        with pytest.raises(AttributeError):
            UnitVectors.Uo = UnitVectors.Ux

    def test_unit_vector_x(self):
        """Test unit vector x."""
        assert UnitVectors.Ux.value.x == 1
        assert UnitVectors.Ux.value.y == 0
        assert UnitVectors.Ux.value.z == 0

        with pytest.raises(AttributeError):
            UnitVectors.Ux = Space(0, 0, 0)

    def test_unit_vector_y(self):
        """Test unit vector y."""
        assert UnitVectors.Uy.value.x == 0
        assert UnitVectors.Uy.value.y == 1
        assert UnitVectors.Uy.value.z == 0

        with pytest.raises(AttributeError):
            UnitVectors.Uy = UnitVectors.Ux

    def test_unit_vector_z(self):
        """Test unit vector z."""
        assert UnitVectors.Uz.value.x == 0
        assert UnitVectors.Uz.value.y == 0
        assert UnitVectors.Uz.value.z == 1

        with pytest.raises(AttributeError):
            UnitVectors.Uz = UnitVectors.Ux


class TestPhysicsStandardSphericalCoordinates:
    """Test physics standard spherical coordinates."""

    def test_spherical_00(self):
        starbug = Space(3, 4, 0)
        assert starbug.ρ == 5
        assert starbug.r == 5
        assert starbug.θ == 1.5707963267948966
        assert starbug.theta == 1.5707963267948966
        assert starbug.φ == 0.9272952180016122
        assert starbug.phi == 0.9272952180016122

    def test_spherical_01(self):
        starbug = Space(1, 1, 1)
        assert starbug.ρ == 1.7320508075688772
        assert starbug.r == 1.7320508075688772
        assert starbug.θ == 0.9553166181245093
        assert starbug.theta == 0.9553166181245093
        assert starbug.φ == 0.7853981633974483
        assert starbug.phi == 0.7853981633974483

    def test_spherical_02(self):
        starbug = Space(-1, -1, -1)
        assert starbug.ρ == 1.7320508075688772
        assert starbug.r == 1.7320508075688772
        assert starbug.θ == 2.186276035465284
        assert starbug.theta == 2.186276035465284
        assert starbug.φ == -2.356194490192345
        assert starbug.phi == -2.356194490192345


class TestSphericalStableAtPoles:
    """Test spherical coordinates are numerically stable at the poles."""

    def test_spherical_front(self):
        starbug = Space(1, 0, 0)
        assert starbug.ρ == 1
        assert starbug.θ == np.pi / 2.0
        assert starbug.φ == 0

    def test_spherical_back(self):
        starbug = Space(-1, 0, 0)
        assert starbug.ρ == 1
        assert starbug.θ == starbug.π / 2
        assert starbug.φ == Space.π

    def test_spherical_up(self):
        starbug = Space(0, 0, 1)
        assert starbug.ρ == 1
        assert starbug.θ == 0
        assert starbug.φ == 0

    def test_spherical_down(self):
        starbug = Space(0, 0, -10.0)
        assert starbug.ρ == 10.0
        assert starbug.θ == np.pi
        assert starbug.θ == starbug.π
        assert starbug.φ == 0

    def test_spherical_port(self):
        starbug = Space(0, 8, 0.0)
        assert starbug.ρ == 8.0
        assert starbug.θ == np.pi / 2.0
        assert starbug.φ == starbug.π / 2

    def test_spherical_starboard(self):
        starbug = Space(0, -16.0, 0.0)
        assert starbug.ρ == 16.0
        assert starbug.θ == np.pi / 2.0
        assert starbug.φ == -Space.π / 2


class TestGeographyStandardSphericalCoordinates:
    """Test geography / MATLAB standard spherical coordinates."""

    def test_spherical_00(self):
        starbug = Space(3, 4, 0)
        assert starbug.ρ == 5
        assert starbug.r == 5
        assert starbug.h == 5
        assert starbug.az == 0.9272952180016122
        assert starbug.el == 0

    def test_spherical_01(self):
        starbug = Space(1, 1, 1)
        assert starbug.ρ == 1.7320508075688772
        assert starbug.r == 1.7320508075688772
        assert starbug.h == 1.7320508075688774  # rounding difference!
        assert starbug.az == Space.π / 4
        assert starbug.el == 0.6154797086703873
