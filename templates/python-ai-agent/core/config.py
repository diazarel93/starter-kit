"""Centralised configuration loaded from environment variables."""

from __future__ import annotations

import os
from dataclasses import dataclass, field


@dataclass(frozen=True)
class KuraConfig:
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    default_llm: str = "anthropic"  # "anthropic" | "openai"
    model_anthropic: str = "claude-sonnet-4-5-20250929"
    model_openai: str = "gpt-4o-mini"
    log_level: str = "INFO"
    wada_version: str = "2026"

    # Derived helpers
    @property
    def has_anthropic(self) -> bool:
        return bool(self.anthropic_api_key and self.anthropic_api_key != "sk-ant-...")

    @property
    def has_openai(self) -> bool:
        return bool(self.openai_api_key and self.openai_api_key != "sk-...")

    @property
    def has_any_llm(self) -> bool:
        return self.has_anthropic or self.has_openai

    @classmethod
    def from_env(cls) -> KuraConfig:
        return cls(
            anthropic_api_key=os.getenv("ANTHROPIC_API_KEY", ""),
            openai_api_key=os.getenv("OPENAI_API_KEY", ""),
            default_llm=os.getenv("KURA_DEFAULT_LLM", "anthropic"),
            model_anthropic=os.getenv("KURA_LLM_MODEL_ANTHROPIC", "claude-sonnet-4-5-20250929"),
            model_openai=os.getenv("KURA_LLM_MODEL_OPENAI", "gpt-4o-mini"),
            log_level=os.getenv("KURA_LOG_LEVEL", "INFO"),
        )
