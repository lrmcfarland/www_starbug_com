import datetime
import pytest

import navicomp


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
        print("*****", space_0, space_1)
        assert space_0 == space_1

    def test_str_01(self):
        space = Space(1, 2, 3)
        assert str(space) == "Space(x=1, y=2, z=3)"

    def test_eval_str_01(self):
        space_0 = Space(2, -3, 5)
        space_1 = eval(str(space_0))
        print("*****", space_0, space_1)
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

    assert space.x == 1.23
    with pytest.raises(AttributeError):
        space.x = 4.5

    assert space.y == 2
    with pytest.raises(AttributeError):
        space.y = -14.5

    assert space.z == 3.0
    with pytest.raises(AttributeError):
        space.z = 404.5346


def test_unit_vector_o():
    """Test unit vector x."""
    assert navicomp.UnitVectors.Uo.value.x == 0
    assert navicomp.UnitVectors.Uo.value.y == 0
    assert navicomp.UnitVectors.Uo.value.z == 0

    with pytest.raises(AttributeError):
        navicomp.UnitVectors.Uo = navicomp.UnitVectors.Ux


def test_unit_vector_x():
    """Test unit vector x."""
    assert navicomp.UnitVectors.Ux.value.x == 1
    assert navicomp.UnitVectors.Ux.value.y == 0
    assert navicomp.UnitVectors.Ux.value.z == 0

    with pytest.raises(AttributeError):
        navicomp.UnitVectors.Ux = navicomp.Space(0, 0, 0)


def test_unit_vector_y():
    """Test unit vector y."""
    assert navicomp.UnitVectors.Uy.value.x == 0
    assert navicomp.UnitVectors.Uy.value.y == 1
    assert navicomp.UnitVectors.Uy.value.z == 0

    with pytest.raises(AttributeError):
        navicomp.UnitVectors.Uy = navicomp.UnitVectors.Ux


def test_unit_vector_z():
    """Test unit vector z."""
    assert navicomp.UnitVectors.Uz.value.x == 0
    assert navicomp.UnitVectors.Uz.value.y == 0
    assert navicomp.UnitVectors.Uz.value.z == 1

    with pytest.raises(AttributeError):
        navicomp.UnitVectors.Uz = navicomp.UnitVectors.Ux


def test_hello_time():
    bday = datetime.datetime(1962, 7, 10)
    dday = navicomp.toModifiedJulianDateAPC(bday)
    assert str(dday) == "1962-07-10 00:00:00"
