export const ESTIMATOR_CONFIG = Object.freeze({
  prices: {
    diagnostic: { label: 'Growth Systems Diagnostic', display: 'From $1,500' },
    foundation: { label: '90-Day Growth Foundation Launch', display: 'From $7,500' },
    operations: { label: 'Growth Operations', display: 'From $3,500/month' },
  },
  questions: [
    { id: 'business_type', label: 'What kind of business do you run?', options: [['medical_wellness', 'Medical wellness, aesthetics, or med spa'], ['allied_health', 'Chiropractic, physio, or allied health'], ['other_health', "Other health and wellness, such as IV therapy or functional medicine"], ['consulting', 'Consulting or professional services'], ['training', 'Training, education, or membership'], ['local_service', 'Local service business'], ['ecommerce', 'Online store only (ecommerce)'], ['other', 'Something else']] },
    { id: 'location_count', label: 'How many locations do you have?', options: [['one', 'One'], ['two_five', 'Two to five'], ['six_plus', 'Six or more'], ['remote', 'Online / remote only'], ['not_sure', 'Not sure']] },
    { id: 'monthly_inquiries', label: "How many new leads contact you each month?", helper: 'Calls, forms, bookings, and messages combined.', options: [['under_10', 'Fewer than 10'], ['10_25', '10–25'], ['26_50', '26–50'], ['51_100', '51–100'], ['over_100', 'More than 100'], ['not_sure', 'Not sure']] },
    { id: 'primary_problem', label: "What's the biggest thing you want to fix?", options: [['more_inquiries', "We need more leads"], ['not_enough_book', "Too few leads book a visit"], ['no_show', "People book but miss visits or choose not to buy"], ['cant_tell', "We don't know which marketing brings clients"], ['dont_connect', "Our website, CRM, booking, and follow-up don't connect"], ['launching', "We're launching a new offer or location"], ['ongoing', 'Things work. We want ongoing improvement'], ['not_sure', 'Not sure']] },
    { id: 'follow_up_process', label: "What happens when a new lead contacts you?", options: [['crm_automatic', "Our CRM assigns the lead and sends follow-up messages"], ['manual', "Someone on the team writes each reply"], ['depends', "Whoever sees the lead first handles the reply"], ['self_booking', 'They book online themselves'], ['not_sure', 'Not sure']] },
    { id: 'response_speed', label: "How long do new leads wait for a reply?", options: [['within_hour', 'Within an hour'], ['same_day', 'Same day'], ['next_day', 'Next day or later'], ['not_sure', 'Not sure']] },
    { id: 'current_systems', label: 'Which of these do you have?', helper: 'Select all that apply.', multiple: true, options: [['crm', 'CRM'], ['booking', 'Online booking'], ['tracking', 'Conversion tracking (GA4 / Tag Manager)'], ['call_tracking', 'Call tracking'], ['auto_followup', 'Automated email or SMS follow-up'], ['ads', 'Running Google or Meta ads'], ['none', 'None of these'], ['not_sure', 'Not sure']] },
    { id: 'marketing_spend', label: "What do you spend on marketing and ads each month?", options: [['none', 'Nothing right now'], ['under_1000', 'Under $1,000'], ['1000_2499', '$1,000–$2,499'], ['2500_4999', '$2,500–$4,999'], ['5000_9999', '$5,000–$9,999'], ['10000_plus', '$10,000+'], ['prefer_not', 'Prefer not to say']] },
    { id: 'decision_role', label: "What's your role in this decision?", options: [['owner', "I'm the owner or decision-maker"], ['influencer', 'I influence the decision'], ['researcher', "I'm researching for someone else"]] },
  ],
  notedInsightDuration: 2000,
  maximumNotedInsights: 3,
  phase2Acceptance: ['Send a Note restored on Result E'],
  systemFlags: {
    crm: 'has_crm', booking: 'has_booking', tracking: 'has_tracking', call_tracking: 'has_call_tracking',
    auto_followup: 'has_auto_followup', ads: 'runs_ads',
  },
  statusPresentation: {
    'Looks solid': { icon: 'check', colorToken: 'green' },
    'Worth reviewing': { icon: 'review', colorToken: 'amber' },
    'Likely gap': { icon: 'alert', colorToken: 'danger' },
    Unknown: { icon: 'question', colorToken: 'subtle' },
    'Comes after Measure': { icon: 'next', colorToken: 'subtle' },
    Ready: { icon: 'check', colorToken: 'green' },
  },
  quickWins: {
    automate: "Log when each lead arrives and when your team replies. Use the gap to set a reply target.",
    measure: "Ask each new client how they found you. Keep the answers in one place.",
    convert: "Try booking on your website from your phone. Count the taps. Note any step which feels unclear.",
    acquire: "Check your Google Business Profile. Update hours, services and photos. Reply to recent reviews.",
    optimize: "Each month, check how many leads became bookings.",
  },
});

export const RESULT_COPY = Object.freeze({
  A: {
    summary: "Find the gaps in your booking process before you spend more.",
    heading: 'Recommended next step: Growth Systems Diagnostic',
    body: "I map each step from first contact to booking and reporting. You get a clear view of the main gap and a 90-day plan.",
    nextStage: "The Diagnostic guides your next step",
  },
  B: {
    summary: "Your answers point to gaps in the path to booking.",
    heading: 'Likely path: Diagnostic, then a 90-Day Foundation Launch',
    body: "The Foundation Launch gives your team a clear way to handle leads. I connect forms, CRM, follow-up, booking and reports. Your team sees who needs a reply and what comes next.",
    nextStage: 'foundation',
  },
  C: {
    summary: "Your answers suggest a working base for the next growth phase.",
    heading: 'Likely path: Diagnostic, then Growth Operations',
    body: "Growth Operations gives you a clear focus each month. I review results and work on the main gap. Work covers lead generation, booking, follow-up or tracking.",
    nextStage: 'operations',
  },
  D: {
    summary: "Focus on replies and follow-up before adding more traffic.",
    heading: "Start with the response to each lead",
    body: "Your answers point to gaps in reply times, team roles or follow-up. A Diagnostic shows where to start.",
    nextStage: 'foundation',
  },
  E: {
    summary: "Your answers suggest a different service fits your needs.",
    heading: "Consider a specialist for your next step",
    body: "Optivue focuses on the full path from lead to booked client. For a store, single website or campaign, consider a specialist. If your needs change, I'd be glad to hear from you.",
    nextStage: null,
  },
});
