import { ESTIMATOR_CONFIG } from './estimator-config.js';
export const PRICING_BREAKDOWNS = {
  "diagnostic": {
    "name": "Growth Systems Audit",
    "items": [
      {
        "label": "Multi-channel review",
        "text": "Up to 3 channels, such as Google Ads, Meta, and Google Business Profile."
      },
      {
        "label": "Website and booking path",
        "text": "I test your contact and booking steps as a new lead would."
      },
      {
        "label": "Follow-up and CRM",
        "text": "How inquiries are logged, assigned, and followed up."
      },
      {
        "label": "Tracking check",
        "text": "Whether your reports show real bookings, not just clicks."
      },
      {
        "label": "Competitor gaps",
        "text": "How 3 nearby competitors capture and follow up with leads."
      },
      {
        "label": "Baseline numbers",
        "text": "Reply time, lead-to-booking rate, and show rate."
      },
      {
        "label": "Your 90-day plan",
        "text": "Top gaps ranked. Do now, do next, don't do yet. A 30-minute walkthrough call."
      }
    ],
    "timeline": "5–7 business days after payment and access. Paid upfront. Covers one location. Credited toward Fix or Fix + Grow within 30 days.",
    "needs": "View access to your website, CRM, booking tool, analytics, and ad accounts.",
    "excluded": "Building or changing anything. Legal, privacy, or compliance review."
  },
  "foundation": {
    "name": "Growth System Fix",
    "items": [
      {
        "label": "Booking path",
        "text": "Fix your main landing page or booking path."
      },
      {
        "label": "CRM routing",
        "text": "Clear stages and lead routing to your team."
      },
      {
        "label": "Follow-up",
        "text": "One consent-based follow-up sequence."
      },
      {
        "label": "Tracking",
        "text": "Fix tracking for calls, forms, and bookings."
      },
      {
        "label": "Handoff",
        "text": "Built in your accounts, documented, with one recorded walkthrough."
      },
      {
        "label": "Post-launch fixes",
        "text": "30 days included."
      }
    ],
    "timeline": "4–6 weeks. 50% to start, 50% on day 30.",
    "needs": "Admin access, approvals within 2 business days, one staff contact for testing.",
    "excluded": "Ongoing management, ad management, extra pages or locations, CRM data migration.",
    "intro": "Typical scope. Your exact scope comes from your Audit."
  },
  "operations": {
    "name": "Growth OS Partnership",
    "items": [
      {
        "label": "Setup (8 weeks)",
        "text": "Everything in Fix, plus campaign setup on 1–2 ad channels."
      },
      {
        "label": "Monthly growth",
        "text": "Up to 3 agreed changes per month, such as a follow-up message, a booking-page fix, or a campaign update."
      },
      {
        "label": "Ad management",
        "text": "1–2 channels. Ad spend is separate."
      },
      {
        "label": "Reporting",
        "text": "A monthly report on leads and bookings, and a 30-minute call."
      },
      {
        "label": "Support",
        "text": "Reply within 1 business day, Monday to Friday."
      }
    ],
    "timeline": `Setup paid upfront. Then ${ESTIMATOR_CONFIG.prices.operations.monthly}, billed monthly in advance, month-to-month. 12-month commitment: ${ESTIMATOR_CONFIG.prices.operations.annualMonthly}.`,
    "needs": "Timely approvals and access to your ad and CRM accounts.",
    "excluded": "Ad spend, new locations or service launches, major rebuilds.",
    "intro": "Typical scope. Your exact scope comes from your Audit."
  },
  "care": {
    "name": "Systems Care",
    "items": [
      {
        "label": "Monthly checks",
        "text": "Forms, booking paths, and automations tested."
      },
      {
        "label": "Small fixes",
        "text": "Up to 1 hour per month."
      },
      {
        "label": "Support",
        "text": "Reply within 2 business days, Monday to Friday."
      }
    ],
    "timeline": "Billed monthly. For systems I built.",
    "excluded": "Ad management, new pages, and new automations."
  }
};
