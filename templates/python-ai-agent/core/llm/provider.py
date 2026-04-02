"""Abstract base for LLM providers."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class LLMMessage:
    role: str  # "user" | "assistant" | "system"
    content: str


@dataclass
class LLMResponse:
    content: str
    model: str
    provider: str  # "anthropic" | "openai"
    usage: dict = field(default_factory=dict)


class LLMProvider(ABC):
    """Thin async interface that every provider must implement."""

    name: str  # "anthropic" | "openai"

    @abstractmethod
    async def complete(
        self,
        messages: list[LLMMessage],
        *,
        system: str = "",
        temperature: float = 0.0,
        max_tokens: int = 1024,
    ) -> LLMResponse:
        ...
