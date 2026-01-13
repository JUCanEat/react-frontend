import pytest
from utils import get_frontend_url

@pytest.fixture()
def frontend_url():
    return get_frontend_url()

@pytest.fixture()
def api_load_timeout():
    return 10_000

@pytest.fixture()
def safety_timeout():
    """
    brief timeout in case our Python code is faster than the
    webpage for simple loading
    """
    return 500