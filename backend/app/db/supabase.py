"""Utilities for future user-scoped Supabase REST access.

Repositories should use the caller's access token so Supabase RLS evaluates the
same authenticated identity as the frontend. Do not use service-role access for
ordinary user requests.
"""
from __future__ import annotations

from app.core.config import Settings


def user_scoped_headers(settings: Settings, access_token: str) -> dict[str, str]:
    if not settings.supabase_anon_key:
        raise RuntimeError("SUPABASE_ANON_KEY is not configured")
    return {
        "apikey": settings.supabase_anon_key,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
