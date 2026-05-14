const docSections = [
  {
    id: "backtest-results",
    group: "Performance",
    title: "Résultats de Backtest",
    badge: "Optimization",
    intro: "Cette section documente les configurations optimales trouvées lors des simulations sur données réelles.",
    blocks: [
      {
        type: "callout",
        tone: "success",
        title: "Configuration Optimale Gold (XAUUSDm)",
        body: "Résultat obtenu le 14/05/2026 : +8.0% de profit net sur 6 mois avec 53 trades."
      },
      {
        type: "code",
        title: "Commande de reproduction",
        code: "python run_backtest.py --symbol XAUUSDm --period 6mo --balance 1000 --risk 2 --sl-mult 3.0 --tp-rr 2.0 --min-confidence 0.80 --no-be"
      },
      {
        type: "subsections",
        items: [
          {
            heading: "Dernier Rapport",
            paragraphs: [
              "Le rapport complet de cette simulation est disponible localement dans le dossier du projet :",
              "agent_trading_ia/backtest/140520261843/report.html"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "project-overview",
    group: "Projet",
    title: "Vue d’ensemble du projet",
    badge: "Project",
    intro:
      "OpenFutur / Agent Trading est un projet de trading algorithmique structuré autour d’une application web Next.js et d’un service IA Python. Le système combine interface utilisateur, orchestration de signaux, exécution MT5, apprentissage automatique et roadmap stratégique centrée sur la qualité des entrées.",
    blocks: [
      {
        type: "cards",
        title: "Composants principaux",
        items: [
          {
            title: "agent_trading",
            body: "Application Next.js 16 fullstack. Elle gère l’interface, Better Auth, Prisma, PostgreSQL, les préférences de trading et l’historique local."
          },
          {
            title: "agent_trading_ia",
            body: "Service web FastAPI dédié au ML, au bridge MetaTrader 5, à l’auto-trader, au CommandBus et à l’exécution."
          },
          {
            title: "MetaTrader 5",
            body: "Terminal d’exécution réel, piloté depuis Python via le package MetaTrader5 et étendu par un EA MQL5."
          },
          {
            title: "Documentation",
            body: "Le projet dispose désormais d’une documentation structurée par service, plus une documentation web centralisée pour la consultation rapide."
          }
        ]
      },
      {
        type: "code",
        title: "Architecture globale",
        code: `Utilisateur
   |
   v
Next.js 16 / React 19 / App Router
   |
   +-- Better Auth
   +-- Prisma / PostgreSQL
   +-- Actions serveur
   +-- API internes protégés
   |
   v
FastAPI (agent_trading_ia)
   |
   +-- MT5 Gateway
   +-- AutoTraderEngine
   +-- ML Agent
   +-- CommandBus
   |
   v
MetaTrader 5 + EA MQL5`
      },
      {
        type: "callout",
        tone: "info",
        title: "Orientation actuelle",
        body: "Le projet est orienté service web. Les interactions entre les briques principales passent par HTTP, sans dépendance au mode CLI pour les parcours métier principaux."
      }
    ]
  },
  {
    id: "agent-trading",
    group: "Services",
    title: "Service agent_trading",
    badge: "Next.js App",
    intro:
      "Le service agent_trading constitue le cockpit applicatif principal. Il gère l’authentification, la persistance, l’interface de pilotage et la coordination avec le service IA.",
    blocks: [
      {
        type: "feature-grid",
        title: "Responsabilités clés",
        items: [
          {
            title: "Authentification",
            body: "Better Auth avec email / mot de passe, session cookie, Google OAuth et GitHub OAuth si configurés."
          },
          {
            title: "Dashboard",
            body: "Vue centrale de marché, plans de trade, signaux, performance auto-trading et alertes."
          },
          {
            title: "Persistance",
            body: "Prisma + PostgreSQL pour utilisateurs, sessions, préférences de trading et historique des trades."
          },
          {
            title: "Orchestration IA",
            body: "Appels HTTP vers agent_trading_ia pour la configuration, les statuts, les signaux MT5 et les auto-trades."
          }
        ]
      },
      {
        type: "subsections",
        items: [
          {
            heading: "Pages et zones fonctionnelles",
            paragraphs: [
              "Les points d’entrée UI principaux sont `app/page.tsx`, `app/dashboard/page.tsx`, `app/dashboard/trade-plan/page.tsx`, `app/dashboard/ml/page.tsx`, `app/dashboard/performance/page.tsx`, `app/dashboard/signals/page.tsx` et `app/dashboard/alerts/page.tsx`.",
              "Le dashboard utilise des snapshots métier unifiés, ce qui permet d’afficher une représentation cohérente de la décision, des timeframes, du plan swing et du plan scalping."
            ],
            list: [
              "auth-shell.tsx pour l’authentification",
              "dashboard-workspace.tsx et dashboard-ui.tsx pour la structure visuelle",
              "trade-plan/actions.ts pour les actions serveur critiques"
            ]
          },
          {
            heading: "Données persistées",
            paragraphs: [
              "Le schéma Prisma structure l’authentification et le suivi trading. Les modèles les plus importants sont `User`, `TradingPreference`, `TradeRecord`, `Session`, `Account` et `Verification`."
            ],
            list: [
              "Préférences utilisateur par symbole / provider / gestion du risque",
              "Historique des trades avec snapshots JSON",
              "Statuts d’issue de trade et source d’exécution"
            ]
          }
        ]
      },
      {
        type: "api-grid",
        title: "APIs internes du service",
        items: [
          {
            method: "GET",
            title: "/api/internal/trading-settings",
            body: "Expose la configuration utilisateur attendue par agent_trading_ia, avec mapping des champs vers le format du moteur Python."
          },
          {
            method: "POST",
            title: "/api/internal/auto-trades",
            body: "Permet au service IA de remonter un auto-trade exécuté pour création d’un `TradeRecord` côté application."
          }
        ]
      }
    ]
  },
  {
    id: "agent-trading-ia",
    group: "Services",
    title: "Service agent_trading_ia",
    badge: "FastAPI + MT5",
    intro:
      "Le service Python est le moteur d’intelligence et d’exécution du projet. Il centralise le ML, le bridge MT5, la boucle d’auto-trading et le transport des commandes vers l’EA MQL5.",
    blocks: [
      {
        type: "feature-grid",
        title: "Modules principaux",
        items: [
          {
            title: "web_service.py",
            body: "Expose l’API FastAPI, gère le CORS, la clé d’API, les endpoints ML, MT5, bridge et auto-trader."
          },
          {
            title: "mt5_gateway.py",
            body: "Encapsule MetaTrader5 pour la connexion terminal, le tick, les rates, les positions, les deals et les ordres."
          },
          {
            title: "auto_trader.py",
            body: "Porte la boucle d’évaluation, la logique de protection des positions et l’exécution directe des ordres."
          },
          {
            title: "command_bus.py",
            body: "Gère une file persistante en JSON pour l’EA MQL5 ou d’autres consumers."
          },
          {
            title: "ml_agent.py",
            body: "Expose les fonctions applicatives de train et predict utilisées par FastAPI."
          },
          {
            title: "algorithms/ml/",
            body: "Contient les briques de données, features, entraînement, sérialisation et chargement Yahoo."
          }
        ]
      },
      {
        type: "callout",
        tone: "warn",
        title: "Dépendance runtime",
        body: "Les fonctions critiques du service IA dépendent fortement d’un environnement Windows / MetaTrader 5 correctement installé et accessible au Python de l’environnement virtuel."
      },
      {
        type: "subsections",
        items: [
          {
            heading: "AutoTraderEngine",
            paragraphs: [
              "Le moteur charge ou synchronise les préférences utilisateur, scanne les symboles configurés, récupère H1 / M15 / M5, calcule le signal, construit un stop ATR, un take-profit, un volume selon le risque puis exécute l’ordre dans MT5.",
              "Une logique de break-even et trailing stop permet ensuite de protéger les positions déjà ouvertes."
            ],
            list: [
              "Gestion du cooldown",
              "Contrôle du nombre maximum de positions",
              "Volume dynamique si `risk_percent > 0`",
              "Protection break-even / trailing"
            ]
          },
          {
            heading: "ML et artefacts",
            paragraphs: [
              "Le sous-système ML supporte actuellement les providers `demo` et `yahoo`. Il génère des features de tendance, volatilité, liquidité, structure de bougies et sessions de marché.",
              "Les modèles sont persistés dans `artifacts/` avec un fichier `.pkl` et des métadonnées `.meta.json`."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "api-reference",
    group: "Référence",
    title: "Référence API",
    badge: "HTTP Endpoints",
    intro:
      "Le projet fonctionne autour d’endpoints HTTP clairs entre l’application Next.js, le service FastAPI et l’EA/MT5. Cette section rassemble les endpoints principaux à connaître.",
    blocks: [
      {
        type: "api-grid",
        title: "Endpoints ML",
        items: [
          {
            method: "POST",
            title: "/ml/train",
            body: "Entraîne un modèle pour un symbole, un provider, un interval et une période."
          },
          {
            method: "POST",
            title: "/ml/predict",
            body: "Retourne l’action recommandée, la confiance, les probabilités et les signaux de liquidité."
          }
        ]
      },
      {
        type: "api-grid",
        title: "Endpoints MT5",
        items: [
          {
            method: "GET",
            title: "/mt5/status",
            body: "État de la connexion MT5, compte, serveur, balance et equity si disponibles."
          },
          {
            method: "POST",
            title: "/mt5/connect",
            body: "Initialise la connexion terminal via les credentials explicites ou les variables d’environnement."
          },
          {
            method: "POST",
            title: "/mt5/disconnect",
            body: "Ferme la connexion MT5."
          },
          {
            method: "GET",
            title: "/mt5/symbols/{symbol}/tick",
            body: "Retourne bid, ask, last et time pour le symbole demandé."
          },
          {
            method: "GET",
            title: "/mt5/symbols/{symbol}/rates",
            body: "Retourne des bougies OHLCV normalisées pour un timeframe donné."
          },
          {
            method: "GET",
            title: "/mt5/positions",
            body: "Liste les positions ouvertes et leurs métriques principales."
          },
          {
            method: "GET",
            title: "/mt5/history/deals",
            body: "Expose l’historique des deals avec net profit, magic et timestamps."
          },
          {
            method: "POST",
            title: "/mt5/orders/market",
            body: "Envoie un ordre market direct via le gateway MT5."
          },
          {
            method: "PATCH",
            title: "/mt5/positions/{ticket}/sl-tp",
            body: "Met à jour les niveaux de protection d’une position."
          }
        ]
      },
      {
        type: "api-grid",
        title: "Endpoints Bridge et moteur",
        items: [
          {
            method: "POST",
            title: "/bridge/commands",
            body: "Empile une commande dans le CommandBus pour MT5 / EA."
          },
          {
            method: "GET",
            title: "/bridge/commands/next",
            body: "Permet à un worker de réclamer la prochaine commande pending."
          },
          {
            method: "POST",
            title: "/bridge/commands/{command_id}/ack",
            body: "Marque une commande comme done ou failed."
          },
          {
            method: "GET",
            title: "/auto-trader/status",
            body: "Expose l’état runtime et la configuration du moteur automatique."
          },
          {
            method: "POST",
            title: "/auto-trader/configure",
            body: "Met à jour la configuration de l’auto-trader."
          },
          {
            method: "POST",
            title: "/auto-trader/start",
            body: "Démarre la boucle d’auto-trading."
          },
          {
            method: "POST",
            title: "/auto-trader/stop",
            body: "Arrête la boucle."
          },
          {
            method: "POST",
            title: "/auto-trader/run-once",
            body: "Lance une seule évaluation de cycle sans attente."
          }
        ]
      }
    ]
  },
  {
    id: "data-models",
    group: "Référence",
    title: "Modèles de données et flux",
    badge: "Data Model",
    intro:
      "Les données du projet sont réparties entre PostgreSQL, les snapshots de trade, les artefacts ML et les fichiers runtime du service IA.",
    blocks: [
      {
        type: "subsections",
        items: [
          {
            heading: "Base PostgreSQL",
            paragraphs: [
              "Le service Next.js persiste les utilisateurs, sessions, comptes OAuth, préférences de trading et historique de trades via Prisma.",
              "Le modèle `TradeRecord` est central car il conserve l’action, le contexte du snapshot, l’état du trade, la source d’exécution et les métadonnées Telegram."
            ],
            list: [
              "User",
              "TradingPreference",
              "TradeRecord",
              "Session",
              "Account",
              "Verification"
            ]
          },
          {
            heading: "Artefacts agent_trading_ia",
            paragraphs: [
              "Le workspace Python stocke des modèles `.pkl`, des métadonnées `.meta.json`, un `command_bus.json` et des datasets de travail dans `artifacts/`."
            ]
          }
        ]
      },
      {
        type: "timeline",
        title: "Flux métier principal",
        steps: [
          {
            title: "Configuration utilisateur",
            body: "L’utilisateur configure symboles, risque, provider et cadence côté agent_trading."
          },
          {
            title: "Synchronisation vers le service IA",
            body: "Les préférences sont envoyées à agent_trading_ia via l’endpoint de configuration."
          },
          {
            title: "Analyse / décision",
            body: "Le moteur IA récupère les données marché, évalue le signal et prépare l’ordre."
          },
          {
            title: "Exécution MT5",
            body: "Un ordre direct ou une commande bridge est envoyé vers l’environnement MT5."
          },
          {
            title: "Journalisation",
            body: "Le trade exécuté est remonté côté Next.js pour être historisé dans PostgreSQL."
          }
        ]
      }
    ]
  },
  {
    id: "workflows",
    group: "Opérations",
    title: "Workflows opérationnels",
    badge: "Operations",
    intro:
      "Cette section résume les parcours opérationnels principaux pour un usage quotidien du projet, du démarrage au suivi des performances.",
    blocks: [
      {
        type: "timeline",
        title: "Démarrage local",
        steps: [
          {
            title: "1. Préparer agent_trading",
            body: "Installer les dépendances, configurer `.env.local`, préparer PostgreSQL et exécuter Prisma."
          },
          {
            title: "2. Préparer agent_trading_ia",
            body: "Créer le virtualenv, installer `requirements.txt`, renseigner `.env` et vérifier MetaTrader5."
          },
          {
            title: "3. Lancer les services",
            body: "Démarrer Next.js côté frontend et FastAPI côté service IA."
          },
          {
            title: "4. Connecter MT5",
            body: "Initialiser la connexion terminal et vérifier `GET /mt5/status`."
          },
          {
            title: "5. Superviser le moteur",
            body: "Consulter le dashboard, les positions et l’auto-trader status."
          }
        ]
      },
      {
        type: "callout",
        tone: "success",
        title: "Usage recommandé",
        body: "Le parcours recommandé passe par l’application web pour la supervision et la configuration, et par le service FastAPI pour toute exécution, prédiction ML ou interaction MT5."
      }
    ]
  },
  {
    id: "future-roadmap",
    group: "Roadmap",
    title: "Futures fonctionnalités",
    badge: "Roadmap",
    intro:
      "Le projet doit évoluer vers un moteur de décision plus discipliné sur les points d’entrée et vers un code IA plus modulaire. Cette roadmap condense les futures directions déjà identifiées.",
    blocks: [
      {
        type: "feature-grid",
        title: "Évolutions attendues sur les entrées",
        items: [
          {
            title: "Base de SND",
            body: "Attendre le retour du prix sur la base d’une zone SND valide avant toute entrée, au lieu d’entrer sur simple impulsion."
          },
          {
            title: "Retest SNR",
            body: "Valider les entrées après cassure puis retest propre d’une zone devenue support ou résistance active."
          },
          {
            title: "QML / QMPL / QMTR",
            body: "Utiliser les structures Quasimodo et assimilées comme modèles d’entrée explicites, avec niveau clé et confirmation."
          },
          {
            title: "Key Levels",
            body: "Intégrer les high/low importants, opens, niveaux psychologiques et zones historiques comme filtres de haute priorité."
          }
        ]
      },
      {
        type: "timeline",
        title: "Pipeline cible de validation d’entrée",
        steps: [
          {
            title: "Biais",
            body: "Définir le contexte et le sens privilégié."
          },
          {
            title: "Zone ou structure",
            body: "Identifier une zone SND/SNR ou une structure QML/QMPL/QMTR."
          },
          {
            title: "Retest",
            body: "Attendre le retour sur la base ou sur le niveau d’entrée défendable."
          },
          {
            title: "Confirmation",
            body: "Confirmer la réaction du prix sur le timeframe d’exécution."
          },
          {
            title: "Exécution",
            body: "N’autoriser l’ordre qu’après validation finale."
          }
        ]
      },
      {
        type: "subsections",
        items: [
          {
            heading: "Restructuration future du code du service IA",
            paragraphs: [
              "Le service `agent_trading_ia` doit être restructuré pour supporter proprement la croissance des stratégies et des filtres d’entrée.",
              "Aujourd’hui, `AutoTraderEngine` concentre beaucoup de logique. Demain, l’objectif est de mieux séparer le domaine métier, les stratégies, les validations d’entrée, le risque, l’exécution et les adapters."
            ],
            list: [
              "domain/ pour la logique métier pure",
              "strategies/ pour les versions de stratégie",
              "entries/ pour retests et confirmations",
              "risk/ pour ATR, volume, SL/TP, break-even, trailing",
              "execution/ pour les ordres et l’orchestration",
              "adapters/ pour MT5, HTTP, stockage, telemetry",
              "schemas/ pour les contrats de données"
            ]
          },
          {
            heading: "Bénéfices attendus",
            paragraphs: [
              "Cette restructuration doit améliorer la lisibilité, la maintenabilité, la testabilité et la stabilité des futurs contrats API, tout en rendant la roadmap SND / SNR / QML plus réaliste à implémenter."
            ]
          }
        ]
      }
    ]
  }
];

function render() {
  renderNavigation();
  renderSections();
  bindSearch();
  bindMobileMenu();
  observeSections();
}

function renderNavigation() {
  const navRoot = document.getElementById("navList");
  const groups = [...new Set(docSections.map((section) => section.group))];

  navRoot.innerHTML = groups
    .map((group) => {
      const links = docSections
        .filter((section) => section.group === group)
        .map(
          (section) =>
            `<a class="nav-link" href="#${section.id}" data-nav-link="${section.id}">${section.title}</a>`
        )
        .join("");

      return `
        <div class="nav-group">
          <p class="nav-group-title">${group}</p>
          ${links}
        </div>
      `;
    })
    .join("");
}

function renderSections() {
  const root = document.getElementById("docRoot");
  root.innerHTML = docSections.map(renderSection).join("");
}

function renderSection(section) {
  return `
    <section class="doc-section" id="${section.id}" data-searchable="${escapeHtml(
      buildSearchText(section)
    )}">
      <div class="section-head">
        <div>
          <span class="section-kicker">${section.group}</span>
          <h2>${section.title}</h2>
          <p>${section.intro}</p>
        </div>
        <span class="badge">${section.badge}</span>
      </div>
      ${section.blocks.map(renderBlock).join("")}
    </section>
  `;
}

function renderBlock(block) {
  if (block.type === "cards") {
    return `
      <div class="subsection">
        <h3>${block.title}</h3>
        <div class="cards-grid">
          ${block.items
            .map(
              (item) => `
                <article>
                  <span class="mini-label">Bloc</span>
                  <h4>${item.title}</h4>
                  <p>${item.body}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  if (block.type === "code") {
    return `
      <div class="subsection">
        <h3>${block.title}</h3>
        <div class="diagram-card">
          <pre>${escapeHtml(block.code)}</pre>
        </div>
      </div>
    `;
  }

  if (block.type === "callout") {
    return `
      <div class="subsection">
        <div class="callout ${block.tone}">
          <strong>${block.title}</strong>
          <p>${block.body}</p>
        </div>
      </div>
    `;
  }

  if (block.type === "feature-grid") {
    return `
      <div class="subsection">
        <h3>${block.title}</h3>
        <div class="feature-grid">
          ${block.items
            .map(
              (item) => `
                <article>
                  <h4>${item.title}</h4>
                  <p>${item.body}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  if (block.type === "api-grid") {
    return `
      <div class="subsection">
        <h3>${block.title}</h3>
        <div class="api-grid">
          ${block.items
            .map(
              (item) => `
                <article>
                  <span class="api-method">${item.method}</span>
                  <h4>${item.title}</h4>
                  <p>${item.body}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  if (block.type === "timeline") {
    return `
      <div class="subsection">
        <h3>${block.title}</h3>
        <div class="timeline">
          ${block.steps
            .map(
              (step, index) => `
                <article class="timeline-step" data-step="${index + 1}">
                  <h4>${step.title}</h4>
                  <p>${step.body}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  if (block.type === "subsections") {
    return block.items
      .map(
        (item) => `
          <div class="subsection">
            <h3>${item.heading}</h3>
            ${item.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
            ${
              item.list
                ? `<ul>${item.list.map((entry) => `<li>${entry}</li>`).join("")}</ul>`
                : ""
            }
          </div>
        `
      )
      .join("");
  }

  return "";
}

function bindSearch() {
  const input = document.getElementById("searchInput");
  const sections = [...document.querySelectorAll(".doc-section")];

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();

    sections.forEach((section) => {
      const searchable = section.dataset.searchable.toLowerCase();
      const visible = !query || searchable.includes(query);
      section.classList.toggle("hidden-by-search", !visible);
    });
  });
}

function bindMobileMenu() {
  const button = document.getElementById("mobileMenuButton");
  const sidebar = document.getElementById("sidebar");

  button.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => sidebar.classList.remove("open"));
  });
}

function observeSections() {
  const links = [...document.querySelectorAll("[data-nav-link]")];
  const sections = [...document.querySelectorAll(".doc-section")];

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const id = visible.target.id;
      links.forEach((link) => link.classList.toggle("active", link.dataset.navLink === id));
    },
    { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.2, 0.4, 0.6] }
  );

  sections.forEach((section) => observer.observe(section));
}

function buildSearchText(section) {
  return JSON.stringify(section);
}

function escapeHtml(input) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

render();
