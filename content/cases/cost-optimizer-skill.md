---
title: "OpenClaw Cost Optimizer Skill"
date: 2026-03-02
category: "Infrastructure"
difficulty: "Medium"
tags: ["cost-optimization", "token-tracking", "model-routing", "monitoring", "skill"]
---

# OpenClaw Cost Optimizer Skill

## Overview

A community-created skill addressing one of the most common pain points in multi-provider AI agent setups: cost visibility and optimization.

## The Problem

> "The BIGGEST problem is no one knows what APIs are being called and how much it costs."

## Solution Features

### Token Usage Tracking
- Real-time token consumption monitoring
- Per-provider cost breakdown
- Per-skill usage attribution
- Historical trend analysis

### Cost Optimization
- Automatic model routing based on cost/performance
- Alerts on unusual spending patterns
- Budget thresholds and limits
- Recommendations for cost reduction

### Provider Comparison

| Provider | Model | Cost per 1M tokens | Use Case |
|----------|-------|-------------------|----------|
| Anthropic | Haiku | $0.25 | Routine tasks |
| Anthropic | Sonnet | $3.00 | General tasks |
| Anthropic | Opus | $15.00 | Complex reasoning |
| OpenAI | GPT-4o | $5.00 | General tasks |
| Google | Gemini Flash | $0.35 | Fast responses |

## Implementation

### Configuration
```json
{
  "cost_optimizer": {
    "enabled": true,
    "daily_budget": 10.00,
    "alert_threshold": 0.80,
    "track_by_skill": true,
    "optimize_routing": true
  }
}
```

### Commands
```
/cost status          - Show current usage
/cost breakdown       - Per-skill breakdown
/cost optimize        - Get optimization suggestions
/cost alert set 5.00  - Set budget alert
/cost report daily    - Daily usage report
```

## Optimization Strategies

### 1. Model Routing
- Route routine tasks to cheaper models (Haiku, Gemini Flash)
- Reserve expensive models (Opus) for complex tasks
- Automatic fallback if cheaper model fails

### 2. Token Efficiency
- Compact prompts
- Response caching
- Context window management

### 3. Batch Processing
- Group similar requests
- Process during off-peak hours
- Async execution where possible

## Real-World Impact

### Before Optimization
- Average: 20-40k tokens per request
- Cost: ~$0.50-1.00 per complex task

### After Optimization
- Average: ~1.5k tokens per request
- Cost: ~$0.05-0.10 per task
- **Savings: 80-90%**

## Installation

```bash
openclaw skills install cost-optimizer
openclaw secrets configure cost-optimizer
openclaw cost-optimizer init
```

## References

- Facebook Community (March 2026)
- OpenClaw Cost Optimization Guide
