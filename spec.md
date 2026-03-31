# Valorant Improvement Hub

## Current State
New project, no existing files.

## Requested Changes (Diff)

### Add
- Agents Pool page: grid of Valorant agents with roles, abilities overview, and AI tips per agent
- AI Guidance system: chat/tip interface powered by backend that provides agent-specific coaching and strategy advice
- Three subscription tiers gating AI guidance access:
  - Silver ($2.99/mo): basic AI tips
  - Diamond ($5.99/mo): advanced AI analysis
  - Radiant ($10.99/mo): full AI coaching + priority responses
- Stripe-powered subscription billing for all three tiers
- User authentication (authorization component)
- Landing page with hero, agents preview, pricing section
- Dashboard showing user's current tier and AI guidance interface

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Select components: authorization, stripe, http-outcalls
2. Generate Motoko backend: user profiles, subscription tier tracking, AI guidance message storage, agent data
3. Build frontend: landing page, agents pool grid, pricing/subscription page, dashboard with AI chat, dark Valorant-inspired theme
