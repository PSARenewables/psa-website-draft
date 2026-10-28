// Header and footer shared by every page. Rendered from script (not fetched) so the pages also
// work when opened straight from disk. Each page names itself in <body data-page="…">.
(() => {
  const site = window.PSA_SITE;
  const pages = [
    ['about', 'About', 'about.html'],
    ['solutions', 'Solutions', 'solutions.html'],
    ['projects', 'Projects', 'projects.html'],
    ['leadership', 'Leadership', 'leadership.html'],
    ['careers', 'Careers', 'careers.html'],
  ];
  const current = document.body.dataset.page;
  const link = ([key, label, href]) => `<a href="${href}"${key === current ? ' aria-current="page"' : ''}>${label}</a>`;
  const lockup = `
    <img src="assets/logo-mark.png" alt="" class="brand-mark">
    <span class="brand-text"><span class="brand-psa">PSA</span><span class="brand-ren">Renewables</span><span class="brand-sub">Powered by Purshotam Profiles Pvt Ltd</span></span>`;

  document.body.insertAdjacentHTML('afterbegin', `
    <div class="cursor" aria-hidden="true"></div>
    <div class="cursor-ring" aria-hidden="true"></div>
    <a class="skip" href="#main">Skip to content</a>
    <header class="nav">
      <div class="wrap nav-inner">
        <a href="index.html" class="brand" aria-label="PSA Renewables home">${lockup}</a>
        <nav class="nav-links" id="nav-links" aria-label="Primary">
          ${pages.map(link).join('')}
          <a href="contact.html" class="btn btn-primary nav-cta"${current === 'contact' ? ' aria-current="page"' : ''}>Contact</a>
        </nav>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links"><span></span><span></span></button>
      </div>
    </header>`);

  document.body.insertAdjacentHTML('beforeend', `
    <footer class="footer">
      <div class="wrap footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="brand" aria-label="PSA Renewables home">${lockup}</a>
          <p>An Independent Power Producer developing, building and operating utility-scale renewable energy projects across India.</p>
        </div>
        <nav aria-label="Footer">
          <h2>Company</h2>
          ${pages.map(([, label, href]) => `<a href="${href}">${label}</a>`).join('')}
          <a href="contact.html">Contact</a>
        </nav>
        <div>
          <h2>Reach us</h2>
          <a href="mailto:${site.email}">${site.email}</a>
          <p>${site.hq}</p>
          <p>${site.hours}</p>
        </div>
        <div>
          <h2>Group company</h2>
          <a href="https://www.purshotamgroup.com" target="_blank" rel="noopener">Purshotam Profiles Pvt Ltd ↗</a>
          <p>${site.pipelineMW} MW under construction</p>
        </div>
      </div>
      <div class="wrap footer-bottom">
        <span>© ${new Date().getFullYear()} PSA Renewables Pvt. Ltd. All rights reserved.</span>
        <a href="https://incsight.psarenewables.com" target="_blank" rel="noopener">IncSight sign-in</a>
      </div>
    </footer>`);
})();
