# Optivue Growth OS — Unified Digital Ecosystem Product Specification

## Product Definition

Optivue Growth OS is a unified digital ecosystem for **Optivue Digital** and **Rahmel Dela Cruz**.

It is not a conventional agency website and it is not six unrelated tools placed on one page.

It is one connected system that performs six business functions simultaneously:

1. **Interactive Digital Growth Portfolio**
2. **Business Transformation Showcase**
3. **Growth Diagnosis Platform**
4. **Project Estimation Tool**
5. **Pricing Experience**
6. **Lead-Generation System**

Every module should reinforce the others and contribute context to one prospect journey.

## Core System Loop

```text
Visitor
  ↓
Understands Optivue
  ↓
Sees proof of execution
  ↓
Understands business transformations
  ↓
Diagnoses own growth problem
  ↓
Scopes likely project requirements
  ↓
Explores pricing / ownership model
  ↓
Shares contact details with consent
  ↓
Prospect context is persisted
  ↓
Books a discovery call / requests proposal
  ↓
Optivue enters the conversation with context
```

## Function 1 — Interactive Digital Growth Portfolio

Purpose:
Show what Rahmel has actually built and how the work operates.

The portfolio should prove execution rather than act as a screenshot gallery.

Content should answer:
- What business problem existed?
- What was built?
- What systems were connected?
- Which tools were involved?
- What operational outcome changed?
- What evidence can be shown safely?

Primary interface:
**Work Lab**

The Work Lab is system-level proof.

Examples:
- Lead routing architecture
- Landing page / CRO systems
- GA4 / GTM measurement
- Search and local visibility workflows
- CRM automation
- Dashboards and reporting
- Custom portal / UI systems

Portfolio interactions should contribute to prospect context:
- viewed work categories
- opened work items
- capability interests

## Function 2 — Business Transformation Showcase

Purpose:
Show how Optivue thinks at the business-system level.

This is distinct from the portfolio.

Portfolio = what was built.
Transformation = what changed in the business system.

Primary interface:
**Transformations**

Each transformation should communicate:
- Before
- Diagnosis
- Strategy
- Build
- Automation
- Measurement
- Results / operational change
- Related work evidence

Only verified facts may be used.

If no verified metric exists, describe the operational change.

Transformation interactions should contribute to prospect context:
- industries viewed
- transformations opened
- systems that appear relevant to the visitor

## Function 3 — Growth Diagnosis Platform

Purpose:
Help the visitor identify the highest-priority growth bottleneck before speaking with Optivue.

The diagnosis is not a fake scientific score.

It should classify:
- Acquisition
- Conversion
- Automation
- Tracking
- SEO / local visibility
- Digital infrastructure

Output:
- primary bottleneck
- why it matters
- recommended next action
- relevant systems to review
- related transformation / work evidence

Diagnosis answers and results become part of the shared prospect context.

The visitor may see the directional result before giving contact information.

A clear lead-capture step should then allow the visitor to:
- save the diagnosis
- request the fuller roadmap
- continue to a discovery call

## Function 4 — Project Estimation Tool

Purpose:
Let prospects self-scope likely project complexity and investment before speaking with Optivue.

Inputs:
- primary need
- business complexity
- channels
- infrastructure
- urgency
- support model

Outputs:
- recommended engagement
- implementation complexity
- likely duration
- systems involved
- starting investment / range
- assumptions and exclusions

The estimator is planning guidance, not a binding quote.

Estimator selections become part of the shared prospect context.

## Function 5 — Pricing Experience

Purpose:
Help prospects understand how far they want to build and what they retain ownership of.

Core plans:
- Growth Starter
- Growth Accelerator
- Growth Lab

The pricing experience should connect to:
- Diagnosis result
- Estimator recommendation
- selected capabilities
- ownership model

Pricing should not exist as a static brochure.

Where prospect context exists, the pricing section may visually indicate:
- likely fit
- why that plan matches the stated needs

It must still allow the visitor to freely inspect every plan.

## Function 6 — Lead-Generation System

Purpose:
Convert anonymous product exploration into a contextual sales conversation.

The lead-generation system should not rely on one generic contact form.

It should collect context progressively from the visitor's actual journey.

Shared prospect context may contain:

### Identity
- name
- email
- company
- website

### Business
- industry
- primary offer
- service area
- growth goal
- biggest challenge

### Diagnosis
- channels
- systems
- conversion maturity
- follow-up maturity
- diagnosis statuses
- primary bottleneck
- recommended action

### Estimator
- primary need
- complexity
- selected channels
- selected infrastructure
- urgency
- support model
- recommended plan
- starting investment guidance

### Behavioral intent
- work categories viewed
- transformations viewed
- pricing plans interacted with
- proposal intent
- booking intent

### Consent
- explicit consent state
- consent timestamp
- source / page

The system should submit one normalized prospect payload to the Optivue intake backend.

## Prospect Context Principle

The visitor should never feel like they are repeatedly starting over.

Data entered in one tool should be reusable by later tools where appropriate.

Examples:
- Business name entered in Diagnosis should be available to lead capture.
- Estimator plan recommendation should carry into Request a Custom Proposal.
- Diagnosis bottleneck should be available when booking.
- Viewed transformations may inform the recommended related case study.

## Data Architecture

```text
Portfolio / Transformations / Diagnosis / Estimator / Pricing / Booking
                              ↓
                    Prospect Context Store
                              ↓
                    Explicit Lead Capture
                              ↓
                     Growth OS Intake API
                              ↓
                            Make
                              ↓
              Optivue Intelligence Sheet / CRM
```

The browser may keep non-sensitive journey context locally.

Personally identifiable information should only be transmitted after explicit visitor submission.

## Existing Optivue Intelligence System

The current Optivue discovery workflow already writes to:
- Discovery Responses
- Diagnosis Inputs

It initializes these diagnosis categories:
- Positioning & Offer Clarity
- Audience & Ideal Client Fit
- Competitive Differentiation
- Website & Conversion
- GBP & Local SEO
- Trust, Proof & Portfolio
- Tracking & Data Quality
- Lead Funnel & Follow-Up

The Growth OS website intake should eventually feed the same intelligence system through a dedicated real-time webhook rather than replacing the current Google Form workflow.

## Success Criteria

The system succeeds when a prospect can arrive knowing little about Optivue and leave with:

- a clear understanding of what Optivue does
- proof that Rahmel can execute
- evidence of business-level systems thinking
- a diagnosis of their own growth problem
- a realistic sense of project scope
- transparent pricing context
- a clear reason to share their details
- a contextual path into a discovery call

Optivue should receive the lead with enough context to begin the sales conversation intelligently rather than asking the prospect to repeat everything.
