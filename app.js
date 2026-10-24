const grid = document.querySelector('#project-grid');
const search = document.querySelector('#search');
const filters = [...document.querySelectorAll('.filter')];
const status = document.querySelector('#results-status');
let projects = [];
let category = 'All';

const art = {
  skills: '<g fill="none" stroke="currentColor" stroke-width="1.4"><rect x="63" y="40" width="137" height="111" rx="5"/><path d="M63 62h137"/><circle cx="76" cy="51" r="2"/><circle cx="85" cy="51" r="2"/><path d="m79 80 7 6-7 6m17 0h25m-42 19h77m-77 11h54"/><rect x="171" y="78" width="93" height="68" rx="5" fill="var(--art-paper)"/><path d="m193 101-8 9 8 9m48-18 8 9-8 9m-20-20-8 22"/></g><text x="211" y="51" fill="currentColor" font-size="10" font-family="monospace">SKILL.md</text>',
  papers: '<g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M99 33h103v122H99z" transform="rotate(-10 150 95)"/><path d="M106 29h103v122H106z" transform="rotate(6 150 95)"/><path d="M110 27h102v125H110z" fill="var(--art-paper)"/><path d="M125 46h31m-31 9h55m-55 63h71m-71 8h48"/><rect x="126" y="71" width="19" height="24" rx="3"/><rect x="177" y="71" width="19" height="24" rx="3"/><path d="M145 83h32m-9-5 9 5-9 5"/><circle cx="161" cy="105" r="3"/></g><text x="46" y="147" fill="currentColor" font-size="12" font-family="monospace">[ attention ]</text>',
  blueprint: '<g fill="none" stroke="currentColor" stroke-width="1.5"><rect x="55" y="43" width="77" height="47" rx="3"/><rect x="194" y="43" width="77" height="47" rx="3"/><rect x="125" y="122" width="77" height="35" rx="3"/><path d="M132 66h62m-8-5 8 5-8 5m47 19v15H164v17m-5-8 5 8 5-8"/><path d="M72 59h44m-44 11h24m116-11h42m-42 11h22M141 139h45"/><circle cx="55" cy="43" r="3" fill="var(--art-paper)"/><circle cx="132" cy="90" r="3" fill="var(--art-paper)"/></g><path d="m277 122 9 23-10-4-5 9z" fill="currentColor"/>',
  space: '<g fill="none" stroke="currentColor" stroke-width="1.4"><rect x="64" y="27" width="200" height="128" rx="7"/><path d="M64 50h200"/><circle cx="77" cy="39" r="2"/><circle cx="87" cy="39" r="2"/><circle cx="97" cy="39" r="2"/><path d="M135 83 163 67l28 16v32l-28 16-28-16z"/><path d="m135 83 28 16 28-16m-28 16v32"/><path d="m85 76 6 6-6 6m14 1h16"/><path d="M216 111h27m-27 8h17"/></g><text x="82" y="143" fill="currentColor" font-size="9" font-family="monospace">SANDBOX_01</text>',
  library: '<g stroke="currentColor" stroke-width="1.3"><path d="M48 139h232v5H48z" fill="currentColor"/><rect x="69" y="57" width="28" height="81" rx="3" fill="none"/><rect x="101" y="46" width="35" height="92" rx="3" fill="currentColor" fill-opacity=".14"/><rect x="140" y="65" width="23" height="73" rx="2" fill="none"/><rect x="172" y="48" width="29" height="90" rx="3" fill="none" transform="rotate(-10 186 137)"/><rect x="213" y="72" width="29" height="66" rx="3" fill="currentColor" fill-opacity=".2"/><path d="M77 71h12m-12 6h12m19-17h21m-21 9h21m91 19h14" fill="none"/></g><text x="256" y="57" fill="currentColor" font-size="24">✳</text>',
  atlas: '<g fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="164" cy="93" r="28"/><circle cx="164" cy="93" r="50" stroke-dasharray="3 6"/><path d="m78 54 59 25m54 27 56 26m-61-57 53-33m-99 69-57 28m80-74V30m0 91v37"/><circle cx="78" cy="54" r="11" fill="var(--art-paper)"/><circle cx="247" cy="132" r="11" fill="var(--art-paper)"/><rect x="228" y="31" width="22" height="22" rx="3" fill="var(--art-paper)"/><rect x="72" y="128" width="22" height="22" rx="3" fill="var(--art-paper)"/><path d="m151 91 9 9 17-19" stroke-width="2"/></g><text x="221" y="94" fill="currentColor" font-size="10" font-family="monospace">evidence ↗</text>',
  profile: '<g fill="none" stroke="currentColor" stroke-width="1.4"><rect x="69" y="34" width="187" height="117" rx="6"/><circle cx="113" cy="81" r="18"/><path d="M89 123c0-22 48-22 48 0m18-57h72m-72 12h49m-49 19h72m-72 11h60m-60 11h33"/></g><text x="79" y="24" fill="currentColor" font-size="9" font-family="monospace">HELLO, WORLD.</text><path d="m245 138 7 16 7-16m-7 16v-25" fill="none" stroke="currentColor" stroke-width="1.4"/>'
};

function card(project) {
  const article = document.createElement('article');
  article.className = `project-card art-${project.art}`;
  const url = new URL(project.url);
  // All content comes from the curated local catalog; text is assigned separately.
  article.innerHTML = `<a class="card-link" target="_blank" rel="noopener noreferrer"><div class="card-art" aria-hidden="true"><div class="art-caption"><span class="art-number"></span><span class="art-label"></span></div><svg viewBox="0 0 328 184" fill="none">${art[project.art] || art.papers}</svg><span class="art-corner">↗</span></div><div class="card-body"><div class="card-meta"><span class="category-tag"></span><span class="card-domain"></span></div><h3><span class="project-name"></span><span class="card-arrow" aria-hidden="true">↗</span></h3><p class="project-description"></p><span class="card-visit">Explore website <span aria-hidden="true">↗</span></span></div></a>`;
  const link = article.querySelector('a');
  link.href = url.href;
  link.setAttribute('aria-label', `${project.name} — opens in a new tab`);
  article.querySelector('.art-number').textContent = `W / ${project.number}`;
  article.querySelector('.art-label').textContent = project.label;
  article.querySelector('.category-tag').textContent = project.category;
  article.querySelector('.card-domain').textContent = url.hostname.replace(/^www\./, '');
  article.querySelector('.project-name').textContent = project.name;
  article.querySelector('.project-description').textContent = project.description;
  if (project.access) article.querySelector('.card-visit').firstChild.textContent = `${project.access} `;
  return article;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const visible = projects.filter(p => (category === 'All' || p.category === category) && `${p.name} ${p.description} ${p.category} ${p.url}`.toLocaleLowerCase().includes(query));
  grid.replaceChildren(...visible.map(card));
  document.querySelector('#empty-state').hidden = visible.length > 0;
  document.querySelector('#clear-search').hidden = !search.value;
  document.querySelector('.search-box kbd').hidden = !!search.value;
  status.textContent = !query && category === 'All' ? `Showing all ${projects.length} projects` : `${visible.length} ${visible.length === 1 ? 'project' : 'projects'}${category !== 'All' ? ` in ${category}` : ''}${query ? ` matching “${search.value.trim()}”` : ''}`;
  filters.forEach(button => {
    const selected = button.dataset.category === category;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.category; render(); }));
search.addEventListener('input', render);
document.querySelector('#clear-search').addEventListener('click', () => { search.value = ''; render(); search.focus(); });
document.querySelector('#reset-filters').addEventListener('click', () => { category = 'All'; search.value = ''; render(); search.focus(); });
document.querySelector('#reload-projects').addEventListener('click', () => location.reload());
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) { event.preventDefault(); search.focus(); }
});
document.querySelector('#back-to-top').addEventListener('click', event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });

try {
  const response = await fetch('/projects.json');
  if (!response.ok) throw new Error('Catalog unavailable');
  projects = await response.json();
  if (!Array.isArray(projects) || projects.some(p => !p.name || !p.description || !p.category || new URL(p.url).protocol !== 'https:')) throw new Error('Invalid catalog');
  document.querySelector('[data-category="All"] span').textContent = projects.length;
  document.querySelector('.section-index').textContent = `/ 01—${String(projects.length).padStart(2, '0')}`;
  render();
} catch {
  status.textContent = 'Collection unavailable';
  document.querySelector('#load-error').hidden = false;
} finally {
  grid.setAttribute('aria-busy', 'false');
}
