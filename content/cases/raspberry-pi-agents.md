---
title: Raspberry Pi Agents — LinkedIn Job Discovery + Coffee Scout
title_zh: Raspberry Pi 代理——LinkedIn 职位发现 + 咖啡侦察
category: automation
date: 2026-03-08
author: "@sanketpath"
source: Community (X/Twitter)
---

# Raspberry Pi Agents — LinkedIn Job Discovery + Coffee Scout

Two agents running on a Raspberry Pi: one surfaces fresh LinkedIn job postings, another monitors specialty coffee shops for new beans.

## The Setup

**Hardware**: Raspberry Pi (sub-$35)
**Model**: Kimi 2.5 (instead of Claude)
**Cost**: $0.50 per extensive test run (vs $5 burnthrough on Sonnet)

## Agent 1: LinkedIn Job Discovery

LinkedIn's algorithm deprioritizes recent posts in favor of promoted listings — this agent cuts through:

- **Finds buried jobs**: Surfaces postings on page 4+ that the algorithm hides
- **Fresh listings**: Prioritizes recent posts over promoted ones
- **Fully autonomous**: Runs 24/7 on the Pi

## Agent 2: Coffee Scout

Custom agent monitors specialty coffee shops for:
- New bean arrivals
- Limited releases
- Roaster updates

## Why Kimi 2.5?

| Model | Cost per test run |
|-------|-------------------|
| Claude Sonnet | $5 |
| Kimi 2.5 | $0.50 |

**10x cost savings** with comparable performance for these tasks.

## The Philosophy

Raspberry Pi = fully autonomous, sub-$35 hardware, zero cloud dependency.

This is the "edge AI" model: small, cheap, local, always-on agents that don't need cloud connectivity to function.

## Source

- Original post by @sanketpath (6 likes)
- February 20, 2026

---

## 中文

# Raspberry Pi 代理——LinkedIn 职位发现 + 咖啡侦察

在 Raspberry Pi 上运行的两个代理：一个发现新鲜的 LinkedIn 职位发布，另一个监控精品咖啡店的新豆。

## 设置

**硬件**：Raspberry Pi（低于 35 美元）
**模型**：Kimi 2.5（而非 Claude）
**成本**：每次广泛测试运行 0.50 美元（对比 Sonnet 的 5 美元消耗）

## 代理 1：LinkedIn 职位发现

LinkedIn 的算法将最近帖子降级，优先显示推广列表——这个代理突破限制：

- **发现隐藏的工作**：显示算法隐藏在第 4 页以上的帖子
- **新鲜列表**：优先显示最近帖子而非推广帖子
- **完全自主**：在 Pi 上 24/7 运行

## 代理 2：咖啡侦察

自定义代理监控精品咖啡店：
- 新豆到货
- 限量发布
- 烘焙商更新

## 为什么选择 Kimi 2.5？

| 模型 | 每次测试运行成本 |
|------|------------------|
| Claude Sonnet | 5 美元 |
| Kimi 2.5 | 0.50 美元 |

**10 倍成本节省**，对于这些任务具有可比的性能。

## 理念

Raspberry Pi = 完全自主、低于 35 美元的硬件、零云依赖。

这是"边缘 AI"模式：小型、便宜、本地、始终在线的代理，不需要云连接即可运行。
