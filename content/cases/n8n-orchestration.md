---
title: n8n Workflow Orchestration
title_zh: n8n 工作流编排
author: "@caprihan"
category: deep
date: 2026-02-28
source: GitHub
---

# n8n Workflow Orchestration

Combine OpenClaw as the conversational "brain" with n8n as the deterministic "execution engine."

## The Stack

- **OpenClaw** - Conversational AI, decision making, natural language understanding
- **n8n** - 400+ app integrations, visual workflow builder, approval gates
- **Webhooks** - Secure communication between OpenClaw and n8n

## How It Works

1. User asks OpenClaw to perform a complex task
2. OpenClaw breaks it down and calls n8n webhooks
3. n8n executes the workflow with proper credentials
4. Results return to OpenClaw for user-friendly response

## Benefits

- **Security** - Credentials stay in n8n, never exposed to LLM
- **Reliability** - Deterministic execution, error handling, retries
- **Auditability** - Full workflow visualization in n8n
- **Self-healing** - Built-in error recovery and notifications

## Example Workflows

- CRM updates across Salesforce, HubSpot, and custom APIs
- Multi-step approval processes with human-in-the-loop
- Data synchronization between 5+ different services
- Automated reporting with scheduled execution

## Source

Community resource: `caprihan/openclaw-n8n-stack` - Complete Docker Compose setup.

---

## 中文

# n8n 工作流编排

将 OpenClaw 作为对话"大脑"，n8n 作为确定性"执行引擎"。

## 技术栈

- **OpenClaw** - 对话 AI、决策、自然语言理解
- **n8n** - 400+ 应用集成、可视化工作流构建器、审批节点
- **Webhooks** - OpenClaw 和 n8n 之间的安全通信

## 工作原理

1. 用户让 OpenClaw 执行复杂任务
2. OpenClaw 拆解任务并调用 n8n webhooks
3. n8n 使用正确的凭证执行工作流
4. 结果返回给 OpenClaw，以用户友好的方式呈现

## 优势

- **安全性** - 凭证留在 n8n，不会暴露给 LLM
- **可靠性** - 确定性执行、错误处理、重试机制
- **可审计** - n8n 中完整的工作流可视化
- **自愈能力** - 内置错误恢复和通知

## 示例工作流

- 跨 Salesforce、HubSpot 和自定义 API 的 CRM 更新
- 带人工审批的多步骤审批流程
- 5+ 不同服务之间的数据同步
- 定时执行的自动化报告

## 来源

社区资源：`caprihan/openclaw-n8n-stack` - 完整的 Docker Compose 配置。
