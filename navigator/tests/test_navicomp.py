import datetime
import pytest

import navicomp


def test_default_space_constructor():
    """Test default space constructor."""
    space = navicomp.Space()
    assert str(space) == "(0, 0, 0)"


def test_space_accessors():
    """Test x, y, z accessors."""
    space = navicomp.Space(1.23, 2.0, 3)

    assert space.x == 1.23
    with pytest.raises(AttributeError):
        space.x = 4.5

    assert space.y == 2
    with pytest.raises(AttributeError):
        space.y = -14.5

    assert space.z == 3.0
    with pytest.raises(AttributeError):
        space.z = 404.5346


def test_hello_time():
    bday = datetime.datetime(1962, 7, 10)
    dday = navicomp.toModifiedJulianDateAPC(bday)
    assert str(dday) == "1962-07-10 00:00:00"
