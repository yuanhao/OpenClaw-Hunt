---
title: Deterministic Multi-Agent Dev Pipeline
title_zh: 确定性多代理开发流水线
author: "@gustavogondim"
category: deep
date: 2026-02-23
source: DEV Community
---

# Deterministic Multi-Agent Dev Pipeline

A fully deterministic code → review → test pipeline using OpenClaw's Lobster workflow engine with newly-contributed loop support.

## The Problem with LLM Orchestration

Traditional multi-agent systems rely on LLMs to decide what happens next. This leads to:
- Non-deterministic behavior
- Difficult debugging
- Unpredictable costs
- Hard to reproduce issues

## The Solution: YAML State Machine

```yaml
workflow:
  steps:
    - name: code
      agent: programmer
      output: code_result
    - name: review
      agent: reviewer
      input: code_result
      output: review_result
    - name: test
      agent: tester
      input: review_result
      loop: until_pass
```

## Key Innovation

- **Deterministic routing** - YAML controls flow, not LLM
- **Agent-to-agent messaging** - `sessions_send` for reliable communication
- **Session keys as addressing** - `pipeline:<project>:<role>`

## Workflow

1. **Programmer Agent** - Writes code based on requirements
2. **Reviewer Agent** - Reviews code for quality and bugs
3. **Tester Agent** - Runs tests, reports results
4. **Loop until pass** - Cycles back if tests fail

## Results

- Predictable execution
- Reproducible builds
- Lower token costs
- Easier debugging

## Source

Gustavo Gondim on DEV Community, February 23, 2026.

**Key Quote:** "Don't orchestrate with LLMs. Use them for creative work, use code for plumbing."

---

## 中文

# 确定性多代理开发流水线

使用 OpenClaw 的 Lobster 工作流引擎和新贡献的循环支持，实现完全确定性的代码→审查→测试流水线。

## LLM 编排的问题

传统的多代理系统依赖 LLM 决定下一步做什么。这导致：
- 非确定性行为
- 难以调试
- 不可预测的成本
- 难以复现问题

## 解决方案：YAML 状态机

```yaml
workflow:
  steps:
    - name: code
      agent: programmer
      output: code_result
    - name: review
      agent: reviewer
      input: code_result
      output: review_result
    - name: test
      agent: tester
      input: review_result
      loop: until_pass
```

## 关键创新

- **确定性路由** - YAML 控制流程，不是 LLM
- **代理间消息传递** - `sessions_send` 实现可靠通信
- **会话键作为地址** - `pipeline:<project>:<role>`

## 工作流

1. **程序员代理** - 根据需求编写代码
2. **审查员代理** - 审查代码质量和 bug
3. **测试员代理** - 运行测试，报告结果
4. **循环直到通过** - 如果测试失败则循环回去

## 结果

- 可预测的执行
- 可复现的构建
- 更低的 token 成本
- 更容易调试

## 来源

Gustavo Gondim，DEV Community，2026年2月23日。

**名言：** "不要用 LLM 编排。让它们做创造性工作，用代码做管道。"
