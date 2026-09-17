from datetime import datetime, timedelta
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.auth import create_access_token, get_current_user, get_password_hash, verify_password


class Query:
    def __init__(self, value):
        self.value = value

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return self.value


class Database:
    def __init__(self, user, session):
        self.user = user
        self.session = session

    def query(self, model):
        return Query(self.user if model.__name__ == "User" else self.session)


def test_passwords_are_hashed():
    password = "correct horse battery staple"
    assert verify_password(password, get_password_hash(password))


def test_access_token_requires_a_persisted_session():
    user = SimpleNamespace(id=7)
    token = create_access_token(user.id, "access", "missing-session")
    credentials = SimpleNamespace(credentials=token)

    with pytest.raises(HTTPException) as error:
        get_current_user(credentials=credentials, access_token=None, db=Database(user, None))

    assert error.value.status_code == 401


def test_revoked_access_token_is_rejected():
    user = SimpleNamespace(id=7)
    session = SimpleNamespace(user_id=7, revoked_at=datetime.utcnow(), expires_at=datetime.utcnow() + timedelta(minutes=5))
    token = create_access_token(user.id, "access", "revoked-session")
    credentials = SimpleNamespace(credentials=token)

    with pytest.raises(HTTPException) as error:
        get_current_user(credentials=credentials, access_token=None, db=Database(user, session))

    assert error.value.status_code == 401