"""Multi-provider LLM router with automatic fallback."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from .provider import LLMMessage, LLMProvider, LLMResponse

if TYPE_CHECKING:
    from kura_agents.core.config import KuraConfig

log = logging.getLogger(__name__)


class LLMRouter:
    """Routes LLM calls to the default provider, falling back to the other on failure."""

    def __init__(self, config: KuraConfig) -> None:
        self._providers: dict[str, LLMProvider] = {}
        self._order: list[str] = []

        # Build provider list based on available keys
        if config.has_anthropic:
            from .anthropic_provider import AnthropicProvider
            self._providers["anthropic"] = AnthropicProvider(config)

        if config.has_openai:
            from .openai_provider import OpenAIProvider
            self._providers["openai"] = OpenAIProvider(config)

        # Default first, then fallback
        default = config.default_llm
        if default in self._providers:
            self._order.append(default)
        for name in self._providers:
            if name not in self._order:
                self._order.append(name)

    @property
    def available(self) -> bool:
        return len(self._providers) > 0

    @property
    def provider_names(self) -> list[str]:
        return list(self._order)

    @property
    def default_provider(self) -> str | None:
        return self._order[0] if self._order else None

    async def complete(
        self,
        messages: list[LLMMessage],
        *,
        system: str = "",
        temperature: float = 0.0,
        max_tokens: int = 1024,
    ) -> LLMResponse:
        if not self._order:
            raise RuntimeError("No LLM provider configured — set ANTHROPIC_API_KEY or OPENAI_API_KEY")

        last_err: Exception | None = None
        for name in self._order:
            provider = self._providers[name]
            try:
                log.debug("trying provider %s", name)
                return await provider.complete(
                    messages,
                    system=system,
                    temperature=temperature,
                    max_tokens=max_tokens,
                )
            except Exception as exc:
                log.warning("provider %s failed: %s", name, exc)
                last_err = exc

        raise RuntimeError(f"All LLM providers failed. Last error: {last_err}")
