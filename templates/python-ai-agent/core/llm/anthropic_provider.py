"""Anthropic (Claude) LLM provider."""

from __future__ import annotations

import asyncio
import logging
from typing import TYPE_CHECKING

from .provider import LLMMessage, LLMProvider, LLMResponse

if TYPE_CHECKING:
    from kura_agents.core.config import KuraConfig

log = logging.getLogger(__name__)

_MAX_RETRIES = 2
_RETRY_DELAY = 1.0  # seconds


class AnthropicProvider(LLMProvider):
    name = "anthropic"

    def __init__(self, config: KuraConfig) -> None:
        # Lazy import so the package is optional at install time
        try:
            from anthropic import AsyncAnthropic
        except ImportError as exc:
            raise ImportError("pip install anthropic") from exc

        self._client = AsyncAnthropic(api_key=config.anthropic_api_key)
        self._model = config.model_anthropic

    async def complete(
        self,
        messages: list[LLMMessage],
        *,
        system: str = "",
        temperature: float = 0.0,
        max_tokens: int = 1024,
    ) -> LLMResponse:
        api_msgs = [{"role": m.role, "content": m.content} for m in messages]

        last_err: Exception | None = None
        for attempt in range(_MAX_RETRIES + 1):
            try:
                resp = await self._client.messages.create(
                    model=self._model,
                    system=system or "You are a helpful assistant.",
                    messages=api_msgs,
                    temperature=temperature,
                    max_tokens=max_tokens,
                )
                return LLMResponse(
                    content=resp.content[0].text,
                    model=resp.model,
                    provider=self.name,
                    usage={
                        "input_tokens": resp.usage.input_tokens,
                        "output_tokens": resp.usage.output_tokens,
                    },
                )
            except Exception as exc:
                last_err = exc
                log.warning("anthropic attempt %d failed: %s", attempt + 1, exc)
                if attempt < _MAX_RETRIES:
                    await asyncio.sleep(_RETRY_DELAY * (attempt + 1))

        raise RuntimeError(f"Anthropic failed after {_MAX_RETRIES + 1} attempts: {last_err}")
