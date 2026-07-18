import datetime

import navicomp


def test_default_space_constructor():
    """Test default space constructor."""
    space = navicomp.Space()
    assert str(space) == "(0, 0, 0)"


def test_hello_time():
    bday = datetime.datetime(1962, 7, 10)
    dday = navicomp.toModifiedJulianDateAPC(bday)
    assert str(dday) == "1962-07-10 00:00:00"
