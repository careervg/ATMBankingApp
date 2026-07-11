import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


@pytest.fixture()
def client(tmp_path, monkeypatch):
    database_url = f"sqlite:///{tmp_path / 'test_atm.db'}"
    monkeypatch.setenv("ATM_DATABASE_URL", database_url)

    from app.core.config import get_settings

    get_settings.cache_clear()

    if "app.main" in sys.modules:
        del sys.modules["app.main"]

    from app.main import create_app

    return TestClient(create_app())
