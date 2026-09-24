export const ESTIMATOR_CONFIG = Object.freeze({
  prices: {
    diagnostic: { label: 'Growth Systems Diagnostic', display: 'From $1,500' },
    foundation: { label: '90-Day Growth Foundation Launch', display: 'From $7,500' },
    operations: { label: 'Growth Operations', display: 'From $3,500/month' },
  },
  questions: [
    { id: 'business_type', label: 'What kind of business do you run?', options: [['medical_wellness', 'Medical wellness, aesthetics, or med spa'], ['allied_health', 'Chiropractic, physio, or allied health'], ['other_health', 'Other health & wellness (IV therapy, functional medicine, etc.)'], ['consulting', 'Consulting or professional services'], ['training', 'Training, education, or membership'], ['local_service', 'Local service business'], ['ecommerce', 'Online store only (ecommerce)'], ['other', 'Something else']] },
    { id: 'location_count', label: 'How many locations do you have?', options: [['one', 'One'], ['two_five', 'Two to five'], ['six_plus', 'Six or more'], ['remote', 'Online / remote only'], ['not_sure', 'Not sure']] },
    { id: 'monthly_inquiries', label: 'About how many new inquiries do you get each month?', helper: 'Calls, forms, bookings, and messages combined.', options: [['under_10', 'Fewer than 10'], ['10_25', '10–25'], ['26_50', '26–50'], ['51_100', '51–100'], ['over_100', 'More than 100'], ['not_sure', 'Not sure']] },
    { id: 'primary_problem', label: "What's the biggest thing you want to fix?", options: [['more_inquiries', 'We need more inquiries'], ['not_enough_book', 'We get inquiries, but not enough book'], ['no_show', "People book, but don't show up or don't convert"], ['cant_tell', "We can't tell which marketing actually works"], ['dont_connect', "Our website, CRM, booking, and follow-up don't connect"], ['launching', "We're launching a new offer or location"], ['ongoing', 'Things work. We want ongoing improvement'], ['not_sure', 'Not sure']] },
    { id: 'follow_up_process', label: 'When a new inquiry comes in, what usually happens?', options: [['crm_automatic', 'It goes into a CRM, gets assigned, and follow-up is automatic'], ['manual', 'Someone on the team replies manually'], ['depends', 'It depends on who sees it first'], ['self_booking', 'They book online themselves'], ['not_sure', 'Not sure']] },
    { id: 'response_speed', label: 'How quickly do new inquiries usually get a reply?', options: [['within_hour', 'Within an hour'], ['same_day', 'Same day'], ['next_day', 'Next day or later'], ['not_sure', 'Not sure']] },
    { id: 'current_systems', label: 'Which of these do you have?', helper: 'Select all that apply.', multiple: true, options: [['crm', 'CRM'], ['booking', 'Online booking'], ['tracking', 'Conversion tracking (GA4 / Tag Manager)'], ['call_tracking', 'Call tracking'], ['auto_followup', 'Automated email or SMS follow-up'], ['ads', 'Running Google or Meta ads'], ['none', 'None of these'], ['not_sure', 'Not sure']] },
    { id: 'marketing_spend', label: 'Roughly what do you spend on marketing and ads each month?', options: [['none', 'Nothing right now'], ['under_1000', 'Under $1,000'], ['1000_2499', '$1,000–$2,499'], ['2500_4999', '$2,500–$4,999'], ['5000_9999', '$5,000–$9,999'], ['10000_plus', '$10,000+'], ['prefer_not', 'Prefer not to say']] },
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
    automate: 'This week, write down when each new inquiry arrives and when it gets a reply. That one number shows whether follow-up is your bottleneck.',
    measure: "Ask 'How did you hear about us?' at every booking and log answers in one place.",
    convert: 'Try booking on your own website from your phone. Count the taps and note anywhere you hesitate.',
    acquire: 'Check your Google Business Profile: hours, services, photos, and whether recent reviews have replies.',
    optimize: 'Pick one number to review monthly: inquiries that became bookings.',
  },
});

export const RESULT_COPY = Object.freeze({
  A: {
    summary: 'The most useful next step is finding exactly where leads are being lost before spending more.',
    heading: 'Recommended next step: Growth Systems Diagnostic',
    body: 'Before I recommend more ads, SEO, automation, or a rebuild, I map how inquiries move from first contact through follow-up, booking, and reporting. You get a clear view of the biggest bottleneck and a prioritized 90-day plan.',
    nextStage: 'Next step decided by what the Diagnostic finds',
  },
  B: {
    summary: 'Your answers suggest the path from inquiry to booking needs building before more marketing will pay off.',
    heading: 'Likely path: Diagnostic, then a 90-Day Foundation Launch',
    body: "The Foundation Launch connects your booking path, lead capture, CRM, routing, follow-up, tracking, and reporting. It isn't the fastest or cheapest option. It's designed so you don't spend more on traffic before the process after an inquiry works.",
    nextStage: 'foundation',
  },
  C: {
    summary: 'You have a working foundation and may be ready for ongoing improvement.',
    heading: 'Likely path: Diagnostic, then Growth Operations',
    body: "Growth Operations is active monthly work: I review the evidence, find the highest-impact constraint, and improve acquisition, conversion, follow-up, booking, or reporting. It's ongoing growth work, not maintenance.",
    nextStage: 'operations',
  },
  D: {
    summary: 'More traffic may not be your first priority. What happens after someone reaches out matters more right now.',
    heading: 'Start with what happens after the inquiry',
    body: "Your answers point to a gap in reply speed, ownership, or follow-up. More traffic can mean more missed opportunities until that's fixed. A Diagnostic shows exactly where to start.",
    nextStage: 'foundation',
  },
  E: {
    summary: 'Optivue may not be the right fit for what you need right now.',
    heading: 'A different kind of help may suit you better',
    body: "Optivue is built for businesses improving the full path from inquiry to booked client. If you mainly need an online store, a one-off website, or a single campaign, a specialist in that area may serve you better. If your needs change, I'd be glad to hear from you.",
    nextStage: null,
  },
});
