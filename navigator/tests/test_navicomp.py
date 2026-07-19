import pytest
import numpy as np

from navicomp import Space, UnitVectors


class TestConstructors:

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
        assert starbug.θ == np.pi/2.0
        assert starbug.φ == 0

    def test_spherical_back(self):
        starbug = Space(-1, 0, 0)
        assert starbug.ρ == 1
        assert starbug.θ == starbug.π/2
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
        assert starbug.θ == np.pi/2.0
        assert starbug.φ == starbug.π/2

    def test_spherical_starboard(self):
        starbug = Space(0, -16.0, 0.0)
        assert starbug.ρ == 16.0
        assert starbug.θ == np.pi/2.0
        assert starbug.φ == -Space.π/2


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
        assert starbug.az == Space.π/4
        assert starbug.el == 0.6154797086703873
