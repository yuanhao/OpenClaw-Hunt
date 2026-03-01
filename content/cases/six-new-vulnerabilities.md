---
title: "Six New Critical Vulnerabilities Patched"
date: 2026-03-02
category: "Security"
difficulty: "Advanced"
tags: ["security", "cve", "vulnerability", "patch", "best-practices"]
---

# Six New Critical Vulnerabilities Patched

## Overview

Endor Labs security researchers disclosed six new vulnerabilities in OpenClaw in February 2026, highlighting the importance of security best practices for AI agent frameworks.

## Vulnerabilities Disclosed

| CVE | Severity | Description |
|-----|----------|-------------|
| CVE-2026-26322 | CVSS 7.6 | SSRF in Gateway tool |
| CVE-2026-26319 | CVSS 7.5 | Missing Telnyx webhook authentication |
| CVE-2026-26329 | High | Path traversal in browser upload |
| GHSA-56f2-hvwg-5743 | CVSS 7.6 | SSRF in image tool |
| GHSA-pg2v-8xwh-qhcc | CVSS 6.5 | SSRF in Urbit authentication |
| GHSA-c37p-4qqg-3p76 | CVSS 6.5 | Twilio webhook authentication bypass |

## Security Lessons Learned

### 1. Data Flow Analysis is Essential
The multi-layer architecture of AI agent frameworks means vulnerabilities often span multiple files and components. Understanding the complete source-to-sink path is critical.

### 2. Trust Boundaries Extend Beyond Traditional Input
Configuration values, LLM outputs, and tool parameters are potential attack surfaces that require validation.

### 3. Defense in Depth
Validation must occur at every layer. Several vulnerabilities existed because validation was missing at all stages.

### 4. AI-Specific Patterns Require Specialized Analysis
Traditional SAST tools designed for regular web apps can't identify issues in:
- LLM-to-tool flows
- Conversation state management
- Agent-specific trust boundaries

## Impact

- **71 malicious ClawHub skills** identified spreading malware and crypto scams
- **VirusTotal partnership** implemented for skill scanning
- **GitHub account verification** now required for skill publishing

## Mitigation

Update to OpenClaw 2026.2.23 or newer immediately.

## References

- Endor Labs Security Research (February 18, 2026)
- Infosecurity Magazine
- OpenClaw GitHub Security Advisories
