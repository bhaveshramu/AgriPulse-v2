"""Utilities for future user-scoped Supabase REST access.

Repositories should use the caller's access token so Supabase RLS evaluates the
same authenticated identity as the frontend. Do not use service-role access for
ordinary user requests.
"""
from __future__ import annotations

from typing import Any

import httpx
from fastapi import Depends, HTTPException

from app.core.config import Settings, get_settings
from app.core.security import AuthenticatedUser, get_current_user


def user_scoped_headers(settings: Settings, access_token: str) -> dict[str, str]:
    if not settings.supabase_anon_key:
        raise RuntimeError("SUPABASE_ANON_KEY is not configured")
    return {
        "apikey": settings.supabase_anon_key,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }


class SupabaseRepository:
    """Minimal PostgREST client that always executes as the calling user."""

    def __init__(self, settings: Settings, user: AuthenticatedUser):
        self.settings = settings
        self.user = user

    async def request(
        self,
        method: str,
        table: str,
        *,
        params: dict[str, str] | None = None,
        json: dict[str, Any] | None = None,
        return_representation: bool = True,
    ) -> list[dict[str, Any]]:
        if not self.settings.supabase_url:
            raise HTTPException(status_code=503, detail="Database is not configured")
        headers = user_scoped_headers(self.settings, self.user.access_token)
        if return_representation:
            headers["Prefer"] = "return=representation"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.request(
                    method,
                    f"{self.settings.supabase_url.rstrip('/')}/rest/v1/{table}",
                    headers=headers,
                    params=params,
                    json=json,
                )
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=503, detail="Database service is unavailable") from exc

        if response.status_code >= 400:
            raise HTTPException(status_code=502, detail="Database operation failed")
        if response.status_code == 204 or not response.content:
            return []
        data = response.json()
        return data if isinstance(data, list) else [data]


async def get_repository(
    user: AuthenticatedUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
) -> SupabaseRepository:
    return SupabaseRepository(settings, user)
