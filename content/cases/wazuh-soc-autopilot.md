---
title: Wazuh SOC Autopilot with OpenClaw
title_zh: Wazuh 安全运营中心自动化
author: "@gensecaihq"
category: deep
date: 2026-02-28
source: GitHub
github: https://github.com/gensecaihq/Wazuh-Openclaw-Autopilot
---

# Wazuh SOC Autopilot with OpenClaw

Autonomous SOC (Security Operations Center) layer for Wazuh using OpenClaw agents with MCP. Auto-triage alerts, correlate incidents, generate response plans with human-in-the-loop approval.

## Features

- **Auto-triage alerts** - Automatically categorize and prioritize security alerts
- **Incident correlation** - Connect related security events across the infrastructure
- **Response plan generation** - Create actionable response plans automatically
- **Human-in-the-loop** - Require approval before executing critical actions
- **Evidence packs** - Collect and organize evidence for investigations
- **Prometheus metrics** - Export security metrics for monitoring
- **Slack integration** - Notify security team via Slack

## Tech Stack

- Wazuh (Security monitoring)
- OpenClaw (AI agent orchestration)
- MCP (Model Context Protocol)
- Prometheus (Metrics)
- Slack API (Notifications)

## Use Case

Security teams can reduce alert fatigue by having OpenClaw agents handle routine triage and initial investigation, only escalating complex issues to human analysts.

---

## 中文

# Wazuh 安全运营中心自动化

使用 OpenClaw 代理和 MCP 为 Wazuh 打造的自主 SOC（安全运营中心）层。自动分类警报、关联事件、生成响应计划，并保留人工审批环节。

## 功能

- **自动分类警报** - 自动分类和优先处理安全警报
- **事件关联** - 跨基础设施连接相关安全事件
- **生成响应计划** - 自动创建可执行的响应计划
- **人工审批** - 执行关键操作前需要人工批准
- **证据包** - 收集和整理调查证据
- **Prometheus 指标** - 导出安全指标用于监控
- **Slack 集成** - 通过 Slack 通知安全团队

## 技术栈

- Wazuh（安全监控）
- OpenClaw（AI 代理编排）
- MCP（模型上下文协议）
- Prometheus（指标）
- Slack API（通知）

## 用例

安全团队可以通过 OpenClaw 代理处理常规分类和初步调查来减少警报疲劳，只将复杂问题升级给人工分析师。