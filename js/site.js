// Every figure and contact detail the pages repeat lives here, so a correction is one edit.
// Pages mark the spot with data-site="key" (text) or data-site-href="key" (link target).
window.PSA_SITE = {
  email: 'info@psarenewables.com',
  phone: '+91 XXXXX XXXXX',
  website: 'www.psarenewables.com',
  hq: 'New Delhi, India',
  addressLine1: '[Office Address Line 1]',
  addressLine2: '[Area], New Delhi – 110 XXX',
  hours: 'Mon–Sat · 9AM–6PM IST',
  linkedin: '',
  careersPortal: '',

  pipelineMW: '401.4',
  pipelineMWp: '450',
  projects: '10',
  states: 'four',
  target: '1 GW by 2030',
  netZero: 'Net Zero by 2040',
};

window.PSA_PIPELINE = [
  { range: '1–5', state: 'Madhya Pradesh', capacity: '315.9 MW' },
  { range: '6–8', state: 'Gujarat', capacity: '35.5 MW' },
  { range: '9', state: 'Maharashtra', capacity: '–' },
  { range: '10', state: 'Uttar Pradesh', capacity: '–' },
];

window.PSA_PHASES = [
  { when: 'Phase 1 · 2024–25', title: 'Foundation & Incorporation', text: 'Company established, governance set up, initial pipeline secured.', done: true },
  { when: 'Phase 2 · 2026–27', title: '401.4 MW Pipeline', text: '10 projects across MP, Gujarat, Maharashtra & UP under active construction.', done: true },
  { when: 'Phase 3 · 2026–27', title: 'First MW Operational', text: 'Commissioning of initial projects, DISCOM revenue commences.' },
  { when: 'Phase 4 · 2027–29', title: '100+ MW Scale-Up & C&I', text: 'Commercial & industrial captive power segment expansion.' },
  { when: 'Phase 5 · 2030+', title: '1 GW & Net Zero', text: 'Achieve 1 GW installed capacity and complete carbon neutrality.' },
];

// Leadership seed, structured like the ERP's Administration department and department heads.
// Replace each "Name Surname"; `photo` is a path under assets/, and until one exists the card
// shows initials.
window.PSA_TEAM = {
  directors: [
    { name: 'Name Surname', role: 'Director', org: 'PSA Renewables', bio: '', photo: '' },
    { name: 'Name Surname', role: 'Executive', org: 'PSA Renewables', bio: '', photo: '' },
  ],
  management: [
    { name: 'Name Surname', role: 'Head, Design and Engineering', photo: '' },
    { name: 'Name Surname', role: 'Head, Project Management Office', photo: '' },
    { name: 'Name Surname', role: 'Quality Manager', photo: '' },
    { name: 'Name Surname', role: 'Accounts Head', photo: '' },
    { name: 'Name Surname', role: 'Head of Human Resources', photo: '' },
  ],
};
