document.addEventListener('DOMContentLoaded', () => {
  const GITHUB_USER = 'eudk';
  const STARRED_LIMIT = 6;
  const CACHE_KEY = 'eudkStarredReposV6';
  const CACHE_MAX_AGE = 60 * 60 * 1000;
  const REPO_CACHE_PREFIX = 'eudkRepoMetadataV2:';

  const projectRepos = {
    eugdatacore: [
      ['eugdatacore', 'Projektets kildekode og dokumentation', 'Project source code and documentation']
    ],
    museum: [
      ['weird-ai-test-museum', 'Museets kildekode og indhold', 'Museum source code and content']
    ],
    ev: [],
    naturdanmark: [
      ['naturdanmark-api', 'C# REST API og unit tests', 'C# REST API and unit tests'],
      ['naturdanmark-frontend', 'Vue-baseret kort og observationsside', 'Vue-based map and observation interface'],
      ['naturdanmark-raspberrypi', 'Raspberry Pi GPS-klient med UDP', 'Raspberry Pi GPS client using UDP'],
      ['naturdanmark-tests', 'Selenium-tests af frontend', 'Selenium frontend tests']
    ],
    arena: [
      ['ArenaMapApp-Frontend', 'Vue, Leaflet, bestilling og QR-koder', 'Vue, Leaflet, ordering, and QR codes'],
      ['ArenaMapApp-Backend', 'C# REST API, database og tests', 'C# REST API, database, and tests']
    ]
  };

  const projectActions = {
    eugdatacore: [
      ['github', 'https://github.com/eudk/eugdatacore']
    ],
    museum: [
      ['site', 'https://eudk.dev/weird-ai-test-museum/'],
      ['github', 'https://github.com/eudk/weird-ai-test-museum']
    ]
  };

  const fallbackRepos = [
    {
      name: 'awesome-ai-tools',
      description: 'Curated list of AI tools, updated in 2026.',
      stargazers_count: 502,
      language: null,
      html_url: 'https://github.com/eudk/awesome-ai-tools',
      forks_count: 58,
      license: { spdx_id: 'CC0-1.0' },
      created_at: '2023-05-10T00:00:00Z',
      open_issues_count: 0,
      size: 520,
      default_branch: 'main',
      visibility: 'public',
      topics: ['artificial-intelligence', 'awesome-list', 'ai-tools'],
      pushed_at: '2026-06-07T00:00:00Z'
    },
    {
      name: 'awesome-cybersecurity-tools',
      description: 'Curated list of security and cybersecurity tools.',
      stargazers_count: 12,
      language: null,
      html_url: 'https://github.com/eudk/awesome-cybersecurity-tools',
      forks_count: 2,
      license: null,
      created_at: '2025-08-01T00:00:00Z',
      open_issues_count: 0,
      size: 180,
      default_branch: 'main',
      visibility: 'public',
      topics: ['cybersecurity', 'security-tools'],
      pushed_at: '2025-09-01T00:00:00Z'
    },
    {
      name: 'awesome-edu-deals',
      description: 'Curated student and education deals for software, cloud services, and learning platforms.',
      stargazers_count: 6,
      language: null,
      html_url: 'https://github.com/eudk/awesome-edu-deals',
      forks_count: 0,
      license: null,
      created_at: '2025-12-01T00:00:00Z',
      open_issues_count: 0,
      size: 120,
      default_branch: 'main',
      visibility: 'public',
      topics: ['education', 'student'],
      pushed_at: '2026-01-01T00:00:00Z'
    },
    {
      name: 'naturdanmark-tests',
      description: 'Frontend Selenium tests for the NaturDanmark third-semester project.',
      stargazers_count: 2,
      language: 'C#',
      html_url: 'https://github.com/eudk/naturdanmark-tests',
      forks_count: 0,
      license: null,
      created_at: null,
      open_issues_count: 0,
      size: 0,
      default_branch: 'main',
      visibility: 'public',
      topics: ['selenium', 'testing'],
      pushed_at: null
    },
    {
      name: 'ArenaMapApp-Backend',
      description: 'C# backend API and tests for the final AP Computer Science project.',
      stargazers_count: 1,
      language: 'C#',
      html_url: 'https://github.com/eudk/ArenaMapApp-Backend',
      forks_count: 0,
      license: null,
      created_at: null,
      open_issues_count: 0,
      size: 0,
      default_branch: 'main',
      visibility: 'public',
      topics: ['api', 'csharp'],
      pushed_at: null
    },
    {
      name: 'eudk.github.io',
      description: 'Personal portfolio website.',
      stargazers_count: 1,
      language: 'HTML',
      html_url: 'https://github.com/eudk/eudk.github.io',
      forks_count: 0,
      license: null,
      created_at: null,
      open_issues_count: 0,
      size: 0,
      default_branch: 'main',
      visibility: 'public',
      topics: ['portfolio'],
      pushed_at: null
    }
  ];

  const translations = {
    da: {
      eyebrow: 'Portfolio',
      page_title: 'Projekter',
      page_intro: 'Et udvalg af projekter, eksperimenter og arbejde under udvikling.',
      all_projects: 'Udvalgte projekter',
      top_starred: 'Flest stjerner',
      repo_label: 'GitHub repository',
      security_project_label: 'IT-sikkerhedsprojekt',
      live_project_label: 'Live projekt',
      ongoing_label: 'Under udvikling',
      development_eyebrow: 'Aktuelt projekt',
      under_development: 'Under udvikling',
      active_development: 'Aktiv udvikling',
      ev_short: 'Intelligent kort til ladestationer, ruteplanlægning og relevant information for elbiler.',
      semester_project_label: '3. semesterprojekt',
      final_project_label: 'Afsluttende datamatikerprojekt',
      ev_title: 'EV Charging Intelligence Map (In Development)',
      naturdanmark_title: 'NaturDanmark',
      arena_title: 'Arena Map App',
      back_home: 'Tilbage til forsiden',
      project_details: 'Projektdetaljer',
      related_repositories: 'Repositories',
      loading_projects: 'Henter projekter...',
      stars_label: 'stjerner',
      no_description: 'Ingen beskrivelse tilgængelig.',
      view_github: 'Se på GitHub',
      visit_site: 'Besøg live side',
      loading_metadata: 'Henter repository-data...',
      metadata_unavailable: 'Repository-data kunne ikke hentes.',
      stars: 'Stjerner',
      forks: 'Forks',
      contributors: 'Bidragydere',
      commits: 'Commits',
      license: 'Licens',
      created: 'Oprettet',
      last_commit: 'Seneste commit',
      unpublished: 'Ikke offentliggjort',
      no_license: 'Ingen licens',
      open_issues: 'Åbne issues',
      details_hint: 'Åbn alle repository-detaljer',
      branch: 'Standardgren',
      repo_size: 'Størrelse',
      visibility: 'Synlighed',
      topics: 'Emner',
      per_repository: 'Licens og aktivitet vises for hvert repository nedenfor.',
      close: 'Luk',
      projects: {
        eugdatacore: {
          title: 'eugdatacore',
          description: 'En lokal sikkerhedsprototype udviklet til et IT-sikkerhedsprojekt om adgangskontrol for AI-agenters værktøjsbrug. Systemet sammenligner en usikker baseline med runtime policy, auditlog og kontrolleret API-adgang i et simuleret virksomhedsmiljø.',
          note: 'Bygget med blandt andet Python og FastAPI som et lokalt AI-agent adgangskontrol-lab.'
        },
        museum: {
          title: 'The Weird AI Test Museum',
          description: 'Et uofficielt, visuelt museum og en field guide til mindeværdige AI-tests, mærkelige edge cases og forskningsbenchmarks. Samlingen dækker blandt andet billedgenerering, sprogtricks, spil, lyd, video og robusthed.',
          note: 'Projektet er lavet for nysgerrighed og dokumenterer øjebliksbilleder af AI-udviklingen.'
        },
        ev: {
          title: 'EV Charging Intelligence Map (In Development)',
          description: 'Personligt projekt under udvikling med fokus på ladestationer, ruteplanlægning og anden relevant information for elbiler.',
          note: 'Projektet er aktivt under udvikling. Repositories tilføjes senere.'
        },
        naturdanmark: {
          title: 'NaturDanmark',
          description: '3. semesterprojekt på datamatikeruddannelsen. En webapp til at se og oprette observationer af dyr på et kort med billeder, beskrivelser, tidspunkt og placering. Løsningen omfatter en C# REST API, Vue-frontend, Selenium- og unit tests samt GPS-data fra en Raspberry Pi sendt via UDP.',
          note: 'Skoleprojekt udviklet som en samlet løsning på tværs af fire repositories.'
        },
        arena: {
          title: 'Arena Map App',
          description: 'Afsluttende hovedopgave på datamatikeruddannelsen. En responsiv event- og arenaløsning med interaktivt kort, boder og menuer, bestilling, QR-koder, ordrehåndtering og administratorfunktioner. Frontend er bygget med Vue og Leaflet og kommunikerer med en C# REST API og SQL-database.',
          note: 'Den samlede løsning er fordelt på frontend- og backend-repositories.'
        }
      }
    },
    en: {
      eyebrow: 'Portfolio',
      page_title: 'Projects',
      page_intro: 'A selection of projects, experiments, and work in progress.',
      all_projects: 'Selected projects',
      top_starred: 'Top starred',
      repo_label: 'GitHub repository',
      security_project_label: 'IT security project',
      live_project_label: 'Live project',
      ongoing_label: 'Work in progress',
      development_eyebrow: 'Current project',
      under_development: 'Under development',
      active_development: 'Active development',
      ev_short: 'An intelligent map for charging stations, route planning, and relevant electric vehicle information.',
      semester_project_label: 'Third-semester project',
      final_project_label: 'Final computer science project',
      ev_title: 'EV Charging Intelligence Map (In Development)',
      naturdanmark_title: 'NaturDanmark',
      arena_title: 'Arena Map App',
      back_home: 'Back to the front page',
      project_details: 'Project details',
      related_repositories: 'Repositories',
      loading_projects: 'Loading projects...',
      stars_label: 'stars',
      no_description: 'No description available.',
      view_github: 'View on GitHub',
      visit_site: 'Visit live site',
      loading_metadata: 'Loading repository data...',
      metadata_unavailable: 'Repository data could not be loaded.',
      stars: 'Stars',
      forks: 'Forks',
      contributors: 'Contributors',
      commits: 'Commits',
      license: 'License',
      created: 'Created',
      last_commit: 'Last commit',
      unpublished: 'Not published',
      no_license: 'No license',
      open_issues: 'Open issues',
      details_hint: 'Open all repository details',
      branch: 'Default branch',
      repo_size: 'Size',
      visibility: 'Visibility',
      topics: 'Topics',
      per_repository: 'License and activity are shown for each repository below.',
      close: 'Close',
      projects: {
        eugdatacore: {
          title: 'eugdatacore',
          description: 'A local security prototype developed for an IT security project about access control around AI agent tool use. It compares an insecure baseline with runtime policy, audit logging, and controlled API access in a simulated business environment.',
          note: 'Built with Python and FastAPI as a local AI agent access-control lab.'
        },
        museum: {
          title: 'The Weird AI Test Museum',
          description: 'An unofficial visual museum and field guide to memorable AI tests, strange edge cases, and research benchmarks. The collection covers image generation, language tricks, games, audio, video, and robustness.',
          note: 'Made for curiosity, documenting snapshots of AI development rather than permanent verdicts.'
        },
        ev: {
          title: 'EV Charging Intelligence Map (In Development)',
          description: 'A personal project in development focused on charging stations, route planning, and other relevant information for electric vehicles.',
          note: 'This project is actively in development. Repositories will be added later.'
        },
        naturdanmark: {
          title: 'NaturDanmark',
          description: 'A third-semester AP Computer Science project. The web app lets users view and create animal observations on a map with photos, descriptions, time, and location. It includes a C# REST API, a Vue frontend, Selenium and unit tests, and Raspberry Pi GPS data sent over UDP.',
          note: 'A school project built as one solution across four repositories.'
        },
        arena: {
          title: 'Arena Map App',
          description: 'The final AP Computer Science project. A responsive event and arena solution with an interactive map, stalls and menus, ordering, QR codes, order management, and administrator tools. The Vue and Leaflet frontend communicates with a C# REST API and SQL database.',
          note: 'The complete solution is split across frontend and backend repositories.'
        }
      }
    }
  };

  const dialog = document.getElementById('project-dialog');
  const dialogTitle = document.getElementById('dialog-title');
  const dialogDescription = document.getElementById('dialog-description');
  const dialogNote = document.getElementById('dialog-note');
  const dialogMetadata = document.getElementById('dialog-metadata');
  const dialogActions = document.getElementById('dialog-actions');
  const dialogRepositories = document.getElementById('dialog-repositories');
  const repoHeading = document.querySelector('.repo-heading');
  const closeButton = dialog.querySelector('.dialog-close');
  const starredProjects = document.getElementById('starred-projects');
  const starredCount = document.getElementById('starred-count');
  const selectedCount = document.getElementById('selected-count');
  const developmentCount = document.getElementById('development-count');
  let currentLang = localStorage.getItem('siteLang') === 'en' ? 'en' : 'da';
  let activeProject = null;
  let activeRepo = null;
  let lastTrigger = null;
  let starredRepos = fallbackRepos;

  function updateProjectCounts() {
    const selectedProjects = document.querySelectorAll('.project-list [data-project]');
    const developmentProjects = document.querySelectorAll('.development-card[data-project]');

    selectedCount.textContent = String(selectedProjects.length).padStart(2, '0');
    developmentCount.textContent = String(developmentProjects.length).padStart(2, '0');

    developmentProjects.forEach((project, index) => {
      const projectIndex = project.querySelector('.development-index');
      if (projectIndex) projectIndex.textContent = String(index + 1).padStart(2, '0');
    });
  }

  function createTextElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function formatDate(value) {
    if (!value) return '—';
    return new Intl.DateTimeFormat(currentLang === 'da' ? 'da-DK' : 'en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(value));
  }

  function formatCreatedDate(value) {
    if (!value) return '—';
    const created = new Date(value);
    const years = Math.max(0, Math.floor((Date.now() - created.getTime()) / 31557600000));
    const age = currentLang === 'da'
      ? `${years} år`
      : `${years} ${years === 1 ? 'year' : 'years'}`;
    return `${formatDate(value)} · ${age}`;
  }

  function formatRepoSize(sizeInKb) {
    if (!Number.isFinite(sizeInKb) || sizeInKb <= 0) return '—';
    if (sizeInKb < 1024) return `${sizeInKb} KB`;
    return `${(sizeInKb / 1024).toFixed(1)} MB`;
  }

  function metadataItem(label, value) {
    const item = document.createElement('div');
    item.className = 'metadata-item';
    item.appendChild(createTextElement('small', '', label));
    item.appendChild(createTextElement('strong', '', String(value)));
    return item;
  }

  function renderMetadata(metadata) {
    const dict = translations[currentLang];
    dialogMetadata.replaceChildren(
      metadataItem(dict.stars, metadata.stars),
      metadataItem(dict.forks, metadata.forks),
      metadataItem(dict.contributors, metadata.contributors),
      metadataItem(dict.commits, metadata.commits),
      metadataItem(dict.license, metadata.license === 'No license' ? dict.no_license : metadata.license),
      metadataItem(dict.created, formatCreatedDate(metadata.createdAt)),
      metadataItem(dict.last_commit, formatDate(metadata.lastCommitAt))
    );
  }

  function renderMetadataStatus(text) {
    dialogMetadata.replaceChildren(createTextElement('p', 'metadata-status', text));
  }

  function readRepoCache(name) {
    try {
      const cached = JSON.parse(localStorage.getItem(`${REPO_CACHE_PREFIX}${name}`));
      if (!cached || Date.now() - cached.savedAt > CACHE_MAX_AGE || !cached.metadata) return null;
      return cached.metadata;
    } catch {
      return null;
    }
  }

  async function fetchRepoMetadata(name) {
    const cached = readRepoCache(name);
    if (cached) return cached;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 6000);
    const options = {
      headers: { Accept: 'application/vnd.github+json' },
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller.signal
    };

    try {
      const [repoResponse, contributorsResponse, commitsResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${GITHUB_USER}/${encodeURIComponent(name)}`, options),
        fetch(`https://api.github.com/repos/${GITHUB_USER}/${encodeURIComponent(name)}/contributors?per_page=1&anon=1`, options),
        fetch(`https://api.github.com/repos/${GITHUB_USER}/${encodeURIComponent(name)}/commits?per_page=1`, options)
      ]);

      if (!repoResponse.ok) throw new Error('Repository request failed');
      const repo = await repoResponse.json();
      const contributors = contributorsResponse.ok ? await contributorsResponse.json() : [];
      const commits = commitsResponse.ok ? await commitsResponse.json() : [];
      const contributorLink = contributorsResponse.headers.get('Link') || '';
      const commitLink = commitsResponse.headers.get('Link') || '';
      const lastPageMatch = contributorLink.match(/[?&]page=(\d+)>;\s*rel="last"/);
      const lastCommitPageMatch = commitLink.match(/[?&]page=(\d+)>;\s*rel="last"/);
      const contributorCount = lastPageMatch
        ? Number(lastPageMatch[1])
        : (Array.isArray(contributors) ? contributors.length : 0);
      const commitCount = lastCommitPageMatch
        ? Number(lastCommitPageMatch[1])
        : (Array.isArray(commits) ? commits.length : 0);

      const metadata = {
        stars: Number.isFinite(repo.stargazers_count) ? repo.stargazers_count : 0,
        forks: Number.isFinite(repo.forks_count) ? repo.forks_count : 0,
        contributors: contributorCount,
        commits: commitCount,
        license: repo.license?.spdx_id || repo.license?.name || 'No license',
        createdAt: repo.created_at || null,
        lastCommitAt: commits[0]?.commit?.author?.date || repo.pushed_at || null
      };

      localStorage.setItem(
        `${REPO_CACHE_PREFIX}${name}`,
        JSON.stringify({ savedAt: Date.now(), metadata })
      );
      return metadata;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function isSafeRepo(repo) {
    return repo
      && typeof repo.name === 'string'
      && (repo.description === null || typeof repo.description === 'string')
      && Number.isFinite(repo.stargazers_count)
      && (repo.forks_count === undefined || Number.isFinite(repo.forks_count))
      && (repo.open_issues_count === undefined || Number.isFinite(repo.open_issues_count))
      && (repo.language === null || typeof repo.language === 'string')
      && typeof repo.html_url === 'string'
      && repo.html_url.startsWith(`https://github.com/${GITHUB_USER}/`)
      && repo.owner
      && typeof repo.owner.login === 'string'
      && repo.owner.login.toLowerCase() === GITHUB_USER;
  }

  function sanitizeRepo(repo) {
    return {
      name: repo.name,
      description: repo.description,
      stargazers_count: repo.stargazers_count,
      forks_count: Number.isFinite(repo.forks_count) ? repo.forks_count : 0,
      language: repo.language,
      license: repo.license && typeof repo.license.spdx_id === 'string'
        ? { spdx_id: repo.license.spdx_id }
        : null,
      created_at: typeof repo.created_at === 'string' ? repo.created_at : null,
      open_issues_count: Number.isFinite(repo.open_issues_count) ? repo.open_issues_count : 0,
      size: Number.isFinite(repo.size) ? repo.size : 0,
      default_branch: typeof repo.default_branch === 'string' ? repo.default_branch : null,
      visibility: typeof repo.visibility === 'string' ? repo.visibility : 'public',
      topics: Array.isArray(repo.topics)
        ? repo.topics.filter((topic) => typeof topic === 'string').slice(0, 3)
        : [],
      pushed_at: typeof repo.pushed_at === 'string' ? repo.pushed_at : null,
      html_url: repo.html_url,
      owner: { login: repo.owner.login }
    };
  }

  function renderStarredProjects() {
    starredProjects.replaceChildren();
    starredProjects.setAttribute('aria-busy', 'false');
    starredCount.textContent = String(starredRepos.length).padStart(2, '0');

    starredRepos.forEach((repo, index) => {
      const button = document.createElement('button');
      button.className = 'featured-project starred-project';
      button.type = 'button';
      button.dataset.repoIndex = String(index);

      button.appendChild(createTextElement('span', 'featured-number', String(index + 1).padStart(2, '0')));

      const content = document.createElement('div');
      content.appendChild(createTextElement('h3', '', repo.name));
      content.appendChild(createTextElement(
        'p',
        '',
        repo.description || translations[currentLang].no_description
      ));

      const meta = document.createElement('div');
      meta.className = 'featured-meta';
      meta.appendChild(createTextElement(
        'span',
        '',
        `★ ${repo.stargazers_count} ${translations[currentLang].stars_label}`
      ));
      if (repo.language) meta.appendChild(createTextElement('span', '', repo.language));
      content.appendChild(meta);

      const details = document.createElement('div');
      details.className = 'starred-details';
      details.appendChild(createTextElement('span', 'starred-detail', `${translations[currentLang].forks}: ${repo.forks_count || 0}`));
      details.appendChild(createTextElement(
        'span',
        'starred-detail',
        `${translations[currentLang].license}: ${repo.license?.spdx_id || translations[currentLang].no_license}`
      ));
      if (repo.pushed_at) {
        details.appendChild(createTextElement(
          'span',
          'starred-detail',
          `${translations[currentLang].last_commit}: ${formatDate(repo.pushed_at)}`
        ));
      }
      if (repo.created_at) {
        details.appendChild(createTextElement(
          'span',
          'starred-detail',
          `${translations[currentLang].created}: ${formatCreatedDate(repo.created_at)}`
        ));
      }
      details.appendChild(createTextElement(
        'span',
        'starred-detail',
        `${translations[currentLang].open_issues}: ${repo.open_issues_count || 0}`
      ));
      content.appendChild(details);

      const technical = document.createElement('div');
      technical.className = 'starred-technical';
      technical.appendChild(createTextElement(
        'span',
        'starred-technical-item',
        `${translations[currentLang].branch}: ${repo.default_branch || 'main'}`
      ));
      technical.appendChild(createTextElement(
        'span',
        'starred-technical-item',
        `${translations[currentLang].repo_size}: ${formatRepoSize(repo.size)}`
      ));
      technical.appendChild(createTextElement(
        'span',
        'starred-technical-item',
        `${translations[currentLang].visibility}: ${repo.visibility || 'public'}`
      ));
      content.appendChild(technical);

      if (repo.topics.length) {
        const topics = document.createElement('div');
        topics.className = 'starred-topics';
        repo.topics.forEach((topic) => {
          topics.appendChild(createTextElement('span', 'starred-topic', `#${topic}`));
        });
        content.appendChild(topics);
      }
      content.appendChild(createTextElement('small', 'starred-hint', translations[currentLang].details_hint));
      button.appendChild(content);
      button.appendChild(createTextElement('span', 'arrow', '+'));
      starredProjects.appendChild(button);
    });
  }

  function readCachedRepos() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (!cached || Date.now() - cached.savedAt > CACHE_MAX_AGE || !Array.isArray(cached.repos)) {
        return null;
      }
      const validRepos = cached.repos.filter(isSafeRepo);
      return validRepos.length ? validRepos.slice(0, STARRED_LIMIT) : null;
    } catch {
      return null;
    }
  }

  async function loadStarredProjects() {
    const cachedRepos = readCachedRepos();
    if (cachedRepos) {
      starredRepos = cachedRepos;
      renderStarredProjects();
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=user:${GITHUB_USER}+fork:false+archived:false&sort=stars&order=desc&per_page=${STARRED_LIMIT}`,
        {
          headers: { Accept: 'application/vnd.github+json' },
          credentials: 'omit',
          referrerPolicy: 'no-referrer',
          signal: controller.signal
        }
      );
      if (!response.ok) throw new Error('GitHub request failed');

      const data = await response.json();
      if (!data || !Array.isArray(data.items)) throw new Error('Unexpected GitHub response');

      const repos = data.items
        .filter(isSafeRepo)
        .sort((a, b) => b.stargazers_count - a.stargazers_count || a.name.localeCompare(b.name))
        .slice(0, STARRED_LIMIT)
        .map(sanitizeRepo);

      if (!repos.length) throw new Error('No repositories found');
      starredRepos = repos;
      localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), repos }));
    } catch {
      starredRepos = fallbackRepos;
    } finally {
      window.clearTimeout(timeoutId);
      renderStarredProjects();
    }
  }

  function renderDialogRepositories(projectId) {
    dialogRepositories.replaceChildren();
    const repos = projectRepos[projectId] || [];
    repoHeading.hidden = repos.length === 0;
    dialogRepositories.hidden = repos.length === 0;

    repos.forEach(([name, daDescription, enDescription]) => {
      const link = document.createElement('a');
      link.className = 'repo-link';
      link.href = `https://github.com/${GITHUB_USER}/${name}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const text = document.createElement('span');
      text.appendChild(createTextElement('strong', '', name));
      text.appendChild(createTextElement('small', '', currentLang === 'da' ? daDescription : enDescription));
      link.appendChild(text);
      link.appendChild(createTextElement('span', 'arrow', '↗'));
      const details = createTextElement('div', 'repo-details', translations[currentLang].loading_metadata);
      link.appendChild(details);
      dialogRepositories.appendChild(link);

      fetchRepoMetadata(name)
        .then((metadata) => {
          if (!link.isConnected || activeProject !== projectId) return;
          const dict = translations[currentLang];
          const license = metadata.license === 'No license' ? dict.no_license : metadata.license;
          details.replaceChildren(
            createTextElement('span', '', `${dict.license}: ${license}`),
            createTextElement('span', '', `★ ${metadata.stars}`),
            createTextElement('span', '', `${dict.forks}: ${metadata.forks}`),
            createTextElement('span', '', `${dict.contributors}: ${metadata.contributors}`),
            createTextElement('span', '', `${dict.commits}: ${metadata.commits}`),
            createTextElement('span', '', `${dict.created}: ${formatCreatedDate(metadata.createdAt)}`),
            createTextElement('span', '', `${dict.last_commit}: ${formatDate(metadata.lastCommitAt)}`)
          );
        })
        .catch(() => {
          if (link.isConnected) details.textContent = translations[currentLang].metadata_unavailable;
        });
    });
  }

  function renderDialogActions(actions) {
    dialogActions.replaceChildren();
    dialogActions.hidden = actions.length === 0;

    actions.forEach(([type, url], index) => {
      const link = document.createElement('a');
      link.className = `dialog-action${index > 0 ? ' secondary' : ''}`;
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = type === 'site'
        ? `${translations[currentLang].visit_site} ↗`
        : `${translations[currentLang].view_github} ↗`;
      dialogActions.appendChild(link);
    });
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('siteLang', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (translations[lang][key]) element.textContent = translations[lang][key];
    });

    document.querySelectorAll('.language-button').forEach((button) => {
      const isActive = button.dataset.lang === lang;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    closeButton.setAttribute('aria-label', translations[lang].close);
    document.querySelector('.language-toggle').setAttribute(
      'aria-label',
      lang === 'da' ? 'Vælg sprog' : 'Choose language'
    );

    renderStarredProjects();
    if (activeProject) fillDialog(activeProject);
    if (activeRepo) fillRepoDialog(activeRepo);
  }

  function fillDialog(projectId) {
    const project = translations[currentLang].projects[projectId];
    const repos = projectRepos[projectId] || [];
    dialogTitle.textContent = project.title;
    dialogDescription.textContent = project.description;
    dialogNote.textContent = project.note;
    renderDialogActions(projectActions[projectId] || []);
    renderDialogRepositories(projectId);

    if (repos.length === 0) {
      dialogMetadata.replaceChildren(
        metadataItem(translations[currentLang].license, translations[currentLang].unpublished)
      );
    } else if (repos.length > 1) {
      renderMetadataStatus(translations[currentLang].per_repository);
    } else {
      const repoName = repos[0][0];
      renderMetadataStatus(translations[currentLang].loading_metadata);
      fetchRepoMetadata(repoName)
        .then((metadata) => {
          if (activeProject === projectId) renderMetadata(metadata);
        })
        .catch(() => {
          if (activeProject === projectId) {
            renderMetadataStatus(translations[currentLang].metadata_unavailable);
          }
        });
    }
  }

  function fillRepoDialog(repo) {
    dialogTitle.textContent = repo.name;
    dialogDescription.textContent = repo.description || translations[currentLang].no_description;
    dialogNote.textContent = repo.language || '';
    renderDialogActions([['github', repo.html_url]]);
    repoHeading.hidden = true;
    dialogRepositories.hidden = true;
    dialogRepositories.replaceChildren();
    renderMetadataStatus(translations[currentLang].loading_metadata);
    fetchRepoMetadata(repo.name)
      .then((metadata) => {
        if (activeRepo?.name === repo.name) renderMetadata(metadata);
      })
      .catch(() => {
        if (activeRepo?.name === repo.name) {
          renderMetadataStatus(translations[currentLang].metadata_unavailable);
        }
      });
  }

  function showDialog() {
    dialog.hidden = false;
    document.body.classList.add('dialog-open');
    closeButton.focus();
  }

  function openDialog(projectId, trigger) {
    activeProject = projectId;
    activeRepo = null;
    lastTrigger = trigger;
    fillDialog(projectId);
    showDialog();
  }

  function openRepoDialog(repo, trigger) {
    activeProject = null;
    activeRepo = repo;
    lastTrigger = trigger;
    fillRepoDialog(repo);
    showDialog();
  }

  function closeDialog() {
    dialog.hidden = true;
    document.body.classList.remove('dialog-open');
    activeProject = null;
    activeRepo = null;
    if (lastTrigger) lastTrigger.focus();
    lastTrigger = null;
  }

  document.querySelectorAll('.language-button').forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang));
  });

  document.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => openDialog(button.dataset.project, button));
  });

  starredProjects.addEventListener('click', (event) => {
    const button = event.target.closest('[data-repo-index]');
    if (!button || !starredProjects.contains(button)) return;
    const repo = starredRepos[Number(button.dataset.repoIndex)];
    if (repo) openRepoDialog(repo, button);
  });

  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dialog.hidden) closeDialog();
  });

  const matrixCanvas = document.getElementById('matrix-canvas');
  const matrixContext = matrixCanvas?.getContext('2d');
  let matrixFrameId = null;
  let matrixDrops = [];

  function resizeMatrix() {
    if (!matrixCanvas) return;
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    matrixDrops = Array(Math.ceil(matrixCanvas.width / 14)).fill(1);
  }

  function drawMatrix() {
    if (!matrixCanvas || !matrixContext) return;

    matrixContext.fillStyle = 'rgba(248, 248, 250, 0.08)';
    matrixContext.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    matrixContext.fillStyle = '#e8e8ed';
    matrixContext.font = '14px Arial';

    matrixDrops.forEach((drop, index) => {
      matrixContext.fillText(Math.random() > .5 ? '0' : '1', index * 14, drop * 14);
      if (drop * 14 > matrixCanvas.height && Math.random() > .99) {
        matrixDrops[index] = 0;
      } else {
        matrixDrops[index] += 1;
      }
    });

    matrixFrameId = window.requestAnimationFrame(drawMatrix);
  }

  resizeMatrix();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    drawMatrix();
  }

  window.addEventListener('resize', () => {
    if (matrixFrameId) window.cancelAnimationFrame(matrixFrameId);
    resizeMatrix();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawMatrix();
    }
  });

  updateProjectCounts();
  applyLanguage(currentLang);
  loadStarredProjects();
});
