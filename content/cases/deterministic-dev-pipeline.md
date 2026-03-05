---
title: "Deterministic Multi-Agent Dev Pipeline"
date: 2026-03-02
category: "Development"
difficulty: "Expert"
tags: ["development", "multi-agent", "lobster", "workflow", "ci-cd", "automation"]
---

# Deterministic Multi-Agent Dev Pipeline

## Overview

A fully deterministic code → review → test pipeline using OpenClaw's Lobster workflow engine with newly-contributed loop support. This architecture separates creative work (LLMs) from orchestration (code).

## The Innovation

**Contributor:** Gustavo Gondim (DEV Community)  
**Date:** February 23, 2026  
**Achievement:** Contributed sub-workflow steps with loop support to Lobster (PR #20)

## Architecture

### Agent Roles

| Agent | Model | Access | Responsibility |
|-------|-------|--------|----------------|
| Programmer | Claude Opus | Full tools | Write code |
| Reviewer | Claude Sonnet | Read-only | Review code |
| Tester | Various | Test runners | Run tests |

### Key Technical Breakthroughs

1. **Sub-workflow loops** - Code→review cycle loops up to 3 times until approved
2. **Deterministic routing** - Via `agentToAgent` and `sessions_send`
3. **Session key addressing** - Pattern: `pipeline:<project>:<role>`
4. **YAML state machine** - Controls flow, not LLM

## Workflow

```yaml
# dev-pipeline.lobster
name: dev-pipeline
steps:
  - id: code-review-loop
    lobster: ./code-review.lobster
    loop:
      maxIterations: 3
      condition: 'approved == false'
  
  - id: test
    command: notify_tester
    condition: approved == true
```

## Key Insight

> "Don't orchestrate with LLMs. Use them for creative work, use code for plumbing."

## Implementation Details

### Session Addressing
- `pipeline:project-a:programmer`
- `pipeline:project-a:reviewer`
- `pipeline:project-b:tester`

### Communication Primitives
- `agentToAgent` - Native peer messaging
- `sessions_send` - Addressable session messaging
- Webhooks with session routing

## Results

- **100% autonomous** pipeline execution
- **Deterministic** flow control
- **Cost-optimized** model routing
- **GitHub Copilot** wrote the implementation

## Use Cases

- Automated code review pipelines
- Multi-stage testing workflows
- Continuous integration automation
- Quality assurance gates

## References

- DEV Community Article (February 23, 2026)
- Lobster PR #20
- GitHub Copilot coding agent
