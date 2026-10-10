/* ===================== I18N DICTIONARY ===================== */
const I18N = {
  fr: {
    nav: { histoire: "Histoire", parcours: "Parcours", competences: "Compétences", certifications: "Certifications", contact: "Contact" },
    hero: {
      label0: "Curiosity", label1: "Learn", label2: "Build", label3: "Impact",
      role: "IA &amp; Data Science",
      tagline: "Comprendre <em class=\"c-blue\">l'esprit</em>, révéler le <em class=\"c-red\">potentiel,</em><br>bâtir un avenir <em class=\"c-blue\">meilleur</em>."
    },
    photo: { hero: "Votre photo ici", contact: "Votre photo ici" },
    symbols: {
      gradient: "Descente de gradient : la méthode qui permet à un modèle d'apprendre en corrigeant peu à peu ses erreurs.",
      sigmoid: "Fonction sigmoïde : transforme n'importe quel signal en une probabilité entre 0 et 1.",
      rag: "RAG (Retrieval-Augmented Generation) : une IA qui va chercher ses sources avant de répondre, pour des réponses fiables et vérifiables.",
      ocr: "OCR, reconnaissance optique de caractères : extraire et structurer automatiquement des informations à partir de documents scannés.",
      hash: "SHA-256 : une empreinte cryptographique utilisée pour sécuriser et vérifier des données sur une blockchain.",
      tensor: "ℝⁿˣᴹ : matrice des données organisées en n lignes et M colonnes."
    },
    manifesto: {
      eyebrow: "Qui je suis",
      p1: "Je suis Malika Fofana, Ingénieure en IA &amp; Data, passionnée par la manière dont la technologie peut transformer une idée en une solution concrète.",
      p2: "Mon parcours s'est construit autour d'une conviction simple&nbsp;: la technologie prend toute sa valeur lorsqu'elle répond à un véritable besoin. Au fil de mes expériences, j'ai exploré des domaines variés, de l'intelligence artificielle et l'analyse de données au développement logiciel, en passant par l'automatisation, le traitement du langage, l'OCR et la blockchain.",
      p3: "J'aime intervenir à chaque étape d'un projet&nbsp;: comprendre un besoin, explorer les données, concevoir une solution, la développer et la rendre réellement utile. Avec plusieurs cordes à mon arc, je peux croiser différentes compétences et approches pour m'adapter à chaque problématique et transformer des idées ambitieuses en produits concrets, utiles et utilisés.",
      valuesTitle: "Ma manière de travailler",
      v1: { title: "Curiosité", text: "Comprendre en profondeur avant de construire." },
      v2: { title: "Rigueur", text: "Transformer des données et des problématiques complexes en solutions structurées." },
      v3: { title: "Créativité", text: "Explorer différentes approches pour dépasser les solutions évidentes." },
      v4: { title: "Impact", text: "Privilégier les technologies qui répondent à des besoins réels." }
    },
    parcours: {
      title: "Le parcours",
      subtitle: "De mes premières lignes de code à la conception de solutions intelligentes."
    },
    t: {
      bac: { date: "2022 — 2023", title: "Baccalauréat Général, mention Très Bien", org: "Lycée Jules Verne · Abidjan, CI", body: "<p class=\"t-narrative-p\">Mon parcours scientifique commence avec un Baccalauréat Général obtenu avec la mention Très Bien et 17,21 de moyenne, avec pour spécialités Numérique et Sciences de l'Informatique, Mathématiques, et Physique-Chimie.</p><p class=\"t-narrative-p\">Cette formation m'a donné mes premières bases en programmation, raisonnement logique et résolution de problèmes, tout en développant une approche rigoureuse fondée sur l'observation, la formulation d'hypothèses et l'analyse des résultats.</p>", skills: "<span>Algorithmique</span><span>Programmation</span><span>Mathématiques</span><span>Logique</span><span>Résolution de problèmes</span><span>Rigueur scientifique</span>" },
      aivancity: { date: "Depuis 2023", title: "Master en IA &amp; Data, major de promotion", org: "Aivancity, School of AI &amp; Data · Paris, FR", body: "<p class=\"t-narrative-p\">Formation à Aivancity, dans un domaine à la croisée de la data, de l'intelligence artificielle et du développement technologique, au sein d'une école reconnue par le MESR et classée 1ʳᵉ école spécialisée en IA &amp; Data par Eduniversal.</p><p class=\"t-narrative-p\">Un programme qui couvre l'ensemble de la chaîne de valeur de la donnée&nbsp;: collecte, analyse, modélisation, intégration, ainsi que des enjeux transverses comme la cybersécurité, l'éthique de l'IA, l'IA agentique et la robotique. De nombreux projets pratiques sur des secteurs variés, ainsi que des voyages d'études, notamment au Maroc, m'ont permis de développer ma curiosité, mon ouverture et ma capacité à travailler dans des environnements différents. Major de promotion depuis 2023.</p>", skills: "<span>Artificial Intelligence</span><span>Data Science</span><span>Machine Learning</span><span>Data Engineering</span><span>LLM</span><span>NLP</span><span>SQL</span><span>Python</span><span>Software Engineering</span><span>Cybersécurité</span><span>Éthique de l'IA</span><span>IA Agentique</span><span>Robotique</span>" },
      bash: { title: "Collaboratrice projet, analyse retail", body: "<p class=\"t-narrative-p\">Découverte concrète de l'analyse de données dans un contexte retail, à travers l'étude des retours clients.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Analyse des retours clients.</li><li>Exploitation de données avec Excel.</li><li>Création de visualisations et d'indicateurs avec Power BI.</li><li>Utilisation des données pour contribuer à l'amélioration continue.</li></ul></div>", skills: "<span>Excel</span><span>Power BI</span><span>Data Analysis</span><span>Data Visualization</span><span>Customer Analytics</span>" },
      puissance: { title: "Collaboratrice projet, automatisation data", org: "Puissance de Femmes · Paris, FR", body: "<p class=\"t-tagline\"><em>Automatiser la collecte pour mieux exploiter la donnée.</em></p><p class=\"t-narrative-p\">Au sein de Puissance de Femmes, automatisation de la collecte de données à partir du web, afin de réduire les tâches manuelles et de faciliter la récupération des informations nécessaires aux projets.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Développement de scripts Python.</li><li>Automatisation de la collecte de données.</li><li>Mise en place de processus de web scraping.</li><li>Structuration des données collectées.</li></ul></div>", skills: "<span>Python</span><span>Web Scraping</span><span>Automatisation</span><span>Data Collection</span><span>Data Processing</span>" },
      orange: { title: "Chef de projet IA / Data Analyst Intern", org: "Orange Côte d'Ivoire · Abidjan, CI", body: "<p class=\"t-tagline\"><em>Transformer la donnée en outils de pilotage.</em></p><p class=\"t-narrative-p\">Deux expériences successives au sein d'Orange Côte d'Ivoire autour de la data, de l'intelligence artificielle et du développement web, pour renforcer le pilotage financier et commercial de l'entreprise.</p><div class=\"t-contrib\"><div class=\"t-contrib-groups\"><div class=\"t-contrib-group\"><h5>Data &amp; pilotage</h5><ul><li>Création de dashboards de pilotage.</li><li>Mise en place de KPIs en temps réel.</li><li>Intégration de mécanismes de scoring IA.</li></ul></div><div class=\"t-contrib-group\"><h5>Développement</h5><ul><li>Conception et développement d'interfaces web.</li><li>Optimisation des performances grâce à la virtualisation des listes.</li><li>Mise en place de filtres dynamiques.</li><li>Développement d'un système d'import Excel intelligent.</li></ul></div><div class=\"t-contrib-group\"><h5>Expérience utilisateur</h5><ul><li>Conception d'interfaces fluides et orientées utilisateur.</li><li>Amélioration de la navigation et de l'exploitation des données.</li></ul></div></div></div>", tools: "<span>Next.js</span><span>TypeScript</span><span>Tailwind CSS</span><span>Zustand</span><span>SheetJS</span>", skills: "<span>Data Analysis</span><span>Dashboarding</span><span>KPI</span><span>Scoring IA</span><span>Frontend Development</span><span>UX</span><span>Gestion de projet</span><span>Data Processing</span>" },
      groupeimage: { title: "Collaboratrice projet R&amp;D en IA", org: "Groupe Image et Concept · Paris, FR", body: "<p class=\"t-tagline\"><em>Faire dialoguer la voix et l'intelligence artificielle.</em></p><p class=\"t-narrative-p\">Projet de R&amp;D consacré à la conception d'un système interactif combinant reconnaissance vocale, traitement du langage naturel et modèles de langage, pour une interaction plus naturelle avec la technologie.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Développement d'un pipeline de traitement vocal.</li><li>Intégration d'une étape Speech-to-Text.</li><li>Traitement des données textuelles obtenues.</li><li>Intégration d'un LLM.</li><li>Participation à la conception d'une chaîne complète allant de la voix à l'interaction avec le système.</li></ul></div>", skills: "<span>Speech-to-Text</span><span>NLP</span><span>LLM</span><span>IA conversationnelle</span><span>Pipeline IA</span>" },
      sursaut: { title: "Développeuse Web", org: "Sursaut Technologie", body: "<p class=\"t-narrative-p\">Sursaut Technologie est un think tank qui catalyse l'appropriation de la technologie en Afrique autour de trois axes&nbsp;: propulser les innovations à fort potentiel, accompagner l'éclosion des entreprises manufacturières et célébrer les novateurs.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Développement du site avec Next.js.</li><li>Conception d'une interface reflétant l'identité et les axes stratégiques du think tank.</li><li>Mise en ligne et déploiement du site.</li></ul></div>", skills: "<span>Next.js</span><span>Développement Web</span><span>Web Design</span><span>Déploiement</span>" },
      kaufman: { title: "Chef de projet IA", org: "Kaufman &amp; Broad · Paris, FR", body: "<p class=\"t-tagline\"><em>Exploiter l'IA pour mieux comprendre les données territoriales.</em></p><p class=\"t-narrative-p\">Projet consacré à l'analyse de données territoriales, pour accompagner les problématiques liées à la planification urbaine.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Analyse de données territoriales à grande échelle.</li><li>Exploration des possibilités d'utilisation de l'IA dans l'analyse des données.</li><li>Conception d'un chatbot interne intelligent.</li><li>Utilisation du NLP et des LLM pour automatiser l'assistance interne.</li></ul></div>", skills: "<span>Data Analysis</span><span>NLP</span><span>LLM</span><span>Chatbot</span><span>IA appliquée</span><span>Gestion de projet</span>" },
      craftai: { title: "Chef de projet IA R&amp;D, Juridique", org: "CraftAI · Paris, FR", body: "<p class=\"t-tagline\"><em>Rendre l'information juridique plus accessible grâce à l'IA.</em></p><p class=\"t-narrative-p\">JurisIA est un assistant juridique basé sur les données de Légifrance, conçu pour permettre une interaction plus naturelle avec l'information juridique grâce à une architecture IA générant des réponses à partir de sources identifiables.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Intégration de l'API PISTE de Légifrance.</li><li>Conception d'une architecture RAG (Retrieval-Augmented Generation).</li><li>Mise en place d'une génération contrôlée.</li><li>Intégration de mécanismes de traçabilité des sources.</li><li>Recherche de réponses vérifiables et documentées.</li></ul></div>", skills: "<span>RAG</span><span>LLM</span><span>NLP</span><span>API</span><span>Architecture IA</span><span>Gestion de projet</span><span>Recherche documentaire</span><span>Traçabilité</span>" },
      veltis: { title: "Projet Data Engineering, santé (R&amp;D)", org: "Veltis · Paris, FR", body: "<p class=\"t-tagline\"><em>Structurer la donnée pour la rendre exploitable et fiable.</em></p><p class=\"t-narrative-p\">Conception d'une plateforme de données cliniques destinée à centraliser et faciliter l'exploitation d'informations provenant de différentes sources, avec pour objectif de construire une base structurée et une interface permettant aux utilisateurs de rechercher, filtrer et exporter les informations nécessaires.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Connexion à différentes sources via des APIs.</li><li>Mise en place de collecte de données par web scraping conforme.</li><li>Structuration d'une base de données.</li><li>Mise en place de fonctionnalités de recherche, filtrage et export.</li><li>Contrôles de qualité des données.</li><li>Prise en compte des problématiques de sécurité et de conformité RGPD.</li></ul></div>", skills: "<span>Data Engineering</span><span>API</span><span>Web Scraping</span><span>Data Quality</span><span>Power Pages</span><span>Data Management</span><span>RGPD</span><span>Sécurité des données</span>" },
      kaydan: { title: "Ingénieure IA et Data", org: "Kaydan Technology · Abidjan, CI", body: "<p class=\"t-tagline\"><em>IA, blockchain et automatisation au service de solutions métiers.</em></p><p class=\"t-narrative-p\">Au sein de Kaydan Technology, plusieurs problématiques technologiques combinant intelligence artificielle, développement full-stack, blockchain et traitement automatisé de documents.</p><div class=\"t-contrib\"><div class=\"t-contrib-groups\"><div class=\"t-contrib-group\"><h5>Blockchain</h5><p>Blockchain de vérification basée sur Hyperledger Fabric, avec architecture on-chain/off-chain et gestion des accès multi-organisations.</p></div><div class=\"t-contrib-group\"><h5>ATS intelligent</h5><p>ATS full-stack (Node.js, TypeScript, React) avec portail candidat et plateforme RH interne.</p></div><div class=\"t-contrib-group\"><h5>Pipeline OCR</h5><p>Pipeline OCR d'extraction et de structuration automatique de données à partir de documents administratifs.</p></div></div></div>", skills: "<span>Hyperledger Fabric</span><span>Blockchain</span><span>OCR</span><span>Node.js</span><span>TypeScript</span><span>React</span><span>Full-Stack Development</span><span>Data Processing</span><span>Architecture logicielle</span>" },
      holyconnect: { date: "06/2026 — Présent", title: "Fondatrice &amp; Product Developer", org: "HolyConnect", body: "<p class=\"t-tagline\"><em>Créer un produit de zéro, de l'idée au déploiement.</em></p><p class=\"t-narrative-p\">HolyConnect est un projet entrepreneurial autour d'une application mobile dédiée au partage et à la communion autour de la foi chrétienne, avec un rôle de fondatrice et Product Developer couvrant tout le cycle produit&nbsp;: vision, conception, développement, expérience utilisateur, tests et déploiement.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Réalisations</p><div class=\"t-contrib-groups\"><div class=\"t-contrib-group\"><h5>Conception produit</h5><p>Définition de la vision du produit, des fonctionnalités et de l'expérience utilisateur.</p></div><div class=\"t-contrib-group\"><h5>Développement full-stack</h5><p>Conception et développement de l'application mobile avec Next.js, Capacitor et Firebase.</p></div><div class=\"t-contrib-group\"><h5>Fonctionnalités intelligentes</h5><p>Chatbot IA et moteur de recherche biblique intelligent.</p></div><div class=\"t-contrib-group\"><h5>Expérience sociale</h5><p>Fil d'actualité et fonctionnalités sociales (publications, messages, stories).</p></div><div class=\"t-contrib-group\"><h5>Déploiement</h5><p>Tests utilisateurs, publication sur l'App Store et Google Play, amélioration continue.</p></div></div></div>", skills: "<span>Product Management</span><span>Full-Stack Development</span><span>Mobile Development</span><span>IA générative</span><span>UX/UI</span><span>Firebase</span><span>Next.js</span><span>Capacitor</span><span>Gestion de projet</span>" },
      next: { date: "Dès octobre 2026", title: "Prochain chapitre, une alternance", org: "3 sem. entreprise / 1 sem. école", desc: "À la recherche d'une équipe pour approfondir mon expertise et contribuer à des projets IA &amp; Data à impact&hellip; <span class=\"glow-word pulse-scale glow-blue\">une alternance</span> ou <span class=\"glow-word pulse-scale glow-red\">une collaboration</span>&nbsp;?" }
    },
    preview: { appScreen: "Aperçu de l'app", visitSite: "Visiter le site ↗" },
    skills: {
      title: "Boîte à outils",
      subtitle: "Ce qui relie la conception à la mise en production.",
      langages: "Langages", ml: "Machine Learning", web: "Développement web", outils: "Outils",
      linux: "Linux shell", langues: "Langues",
      fr: "Français, C2, langue maternelle", en: "Anglais, B2",
      agentic: "IA Agentique", aiethics: "Éthique de l'IA",
      blockchain: "Blockchain &amp; Sécurité", gdpr: "RGPD", security: "Sécurité des données"
    },
    certs: {
      title: "Certifications",
      subtitle: "Cliquez sur une carte pour voir ce qu'elle couvre.",
      flipHint: "Cliquer pour retourner",
      domainsLabel: "Domaines&nbsp;:",
      genai: { title: "Generative AI in Action", back: "Certification consacrée à l'intelligence artificielle générative et à ses applications.", domains: "<span>Generative AI</span><span>LLM</span><span>AI</span>" },
      sustain: { title: "Fundamentals of Sustainability", back: "Formation consacrée aux fondamentaux de la durabilité et aux enjeux associés.", domains: "<span>Sustainability</span><span>Environmental Awareness</span>" },
      impacts: { title: "Impacts environnementaux du numérique", back: "Formation portant sur les impacts environnementaux liés au numérique.", domains: "<span>Numérique responsable</span><span>Impact environnemental</span>" },
      redd: { back: "Formation autour des enjeux liés à la réduction des émissions issues de la déforestation et de la dégradation des forêts.", domains: "<span>Climat</span><span>Développement durable</span>" },
      asteroid: { title: "Recherche d'astéroïdes", back: "Participation à une initiative de recherche d'astéroïdes basée sur l'analyse de données astronomiques.", domains: "<span>Astronomie</span><span>Recherche</span><span>Analyse de données</span>" }
    },
    contact: {
      eyebrow: "Prochain chapitre",
      title: "Construisons quelque chose<br>d'intelligent, ensemble.",
      sub: "<span class=\"glow-word glow-blue\">Alternance</span> en Ingénierie IA &amp; Data, disponible dès octobre 2026<br>(3&nbsp;sem. entreprise / 1&nbsp;sem. école)",
      copyHint: "cliquer pour copier",
      copied: "Adresse copiée !",
      open: "Au-delà de l'<span class=\"glow-word glow-blue\">alternance</span>, je reste ouverte à toute forme de <span class=\"glow-word glow-red\">collaboration</span>.",
      form: {
        eyebrow: "Ou écrivez-moi directement",
        name: "Nom et prénom",
        email: "Email",
        message: "Message",
        submit: "Envoyer le message",
        sending: "Envoi en cours…",
        success: "Message envoyé, merci ! Je vous réponds rapidement.",
        error: "Une erreur est survenue, réessayez ou écrivez-moi directement par email.",
        missing: "Merci de remplir tous les champs."
      }
    },
    footer: { note: "Malika Fofana, Ingénieure IA &amp; Data" }
  },

  en: {
    nav: { histoire: "Story", parcours: "Journey", competences: "Skills", certifications: "Certifications", contact: "Contact" },
    hero: {
      label0: "Curiosity", label1: "Learn", label2: "Build", label3: "Impact",
      role: "AI &amp; Data Science",
      tagline: "Understanding <em class=\"c-blue\">the mind</em>, revealing <em class=\"c-red\">potential,</em><br>building a <em class=\"c-blue\">better</em> future."
    },
    photo: { hero: "Add your photo here", contact: "Add your photo here" },
    symbols: {
      gradient: "Gradient descent: the method that lets a model learn by gradually correcting its own errors.",
      sigmoid: "Sigmoid function: turns any signal into a probability between 0 and 1.",
      rag: "RAG (Retrieval-Augmented Generation): an AI that retrieves its sources before answering, for reliable, verifiable responses.",
      ocr: "OCR, optical character recognition: automatically extracting and structuring information from scanned documents.",
      hash: "SHA-256: a cryptographic fingerprint used to secure and verify data on a blockchain.",
      tensor: "ℝⁿˣᴹ: data matrix organized in n rows and M columns."
    },
    manifesto: {
      eyebrow: "Who I am",
      p1: "I'm Malika Fofana, an AI &amp; Data Engineer, passionate about how technology can turn an idea into a concrete solution.",
      p2: "My path was built around a simple conviction: technology only reaches its full value when it answers a real need. Through my experiences, I've explored a wide range of fields, from artificial intelligence and data analysis to software development, by way of automation, language processing, OCR and blockchain.",
      p3: "I love being involved at every stage of a project: understanding a need, exploring the data, designing a solution, building it and making it genuinely useful. With several strings to my bow, I can combine different skills and approaches to adapt to each problem and turn ambitious ideas into concrete, useful, used products.",
      valuesTitle: "How I work",
      v1: { title: "Curiosity", text: "Understand deeply before building." },
      v2: { title: "Rigor", text: "Turn complex data and problems into structured solutions." },
      v3: { title: "Creativity", text: "Explore different approaches to go beyond the obvious solution." },
      v4: { title: "Impact", text: "Favor technologies that answer real needs." }
    },
    parcours: {
      title: "The journey",
      subtitle: "From my first lines of code to designing intelligent solutions."
    },
    t: {
      bac: { date: "2022 — 2023", title: "High School Diploma, Highest Honours", org: "Lycée Jules Verne · Abidjan, CI", body: "<p class=\"t-narrative-p\">My scientific path began with a French Baccalauréat earned with Highest Honours and a 17.21/20 average, majoring in Digital & Computer Science, Mathematics, and Physics-Chemistry.</p><p class=\"t-narrative-p\">This foundation gave me my first grounding in programming, logical reasoning and problem-solving, while developing a rigorous approach built on observation, forming hypotheses and analyzing results.</p>", skills: "<span>Algorithms</span><span>Programming</span><span>Mathematics</span><span>Logic</span><span>Problem solving</span><span>Scientific rigor</span>" },
      aivancity: { date: "Since 2023", title: "Master's in AI &amp; Data, top of the class", org: "Aivancity, School of AI &amp; Data · Paris, FR", body: "<p class=\"t-narrative-p\">A program at Aivancity to specialize in a field at the crossroads of data, artificial intelligence and technology development, at a school recognized by the French Ministry of Higher Education (MESR) and ranked the #1 school specialized in AI &amp; Data by Eduniversal.</p><p class=\"t-narrative-p\">A program covering the full data value chain: collection, analysis, modeling, integration, along with cross-cutting topics like cybersecurity, AI ethics, agentic AI and robotics. Numerous hands-on projects across varied sectors, along with study trips, notably to Morocco, helped me develop my curiosity, openness and ability to work across different environments. Top of the class since 2023.</p>", skills: "<span>Artificial Intelligence</span><span>Data Science</span><span>Machine Learning</span><span>Data Engineering</span><span>LLM</span><span>NLP</span><span>SQL</span><span>Python</span><span>Software Engineering</span><span>Cybersecurity</span><span>AI Ethics</span><span>Agentic AI</span><span>Robotics</span>" },
      bash: { title: "Project Contributor, Retail Analysis", body: "<p class=\"t-narrative-p\">A first hands-on look at data analysis in a retail context, through the study of customer feedback.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Analyzed customer feedback.</li><li>Worked with data in Excel.</li><li>Built visualizations and indicators with Power BI.</li><li>Used data to support continuous improvement.</li></ul></div>", skills: "<span>Excel</span><span>Power BI</span><span>Data Analysis</span><span>Data Visualization</span><span>Customer Analytics</span>" },
      puissance: { title: "Project Contributor, Data Automation", org: "Puissance de Femmes · Paris, FR", body: "<p class=\"t-tagline\"><em>Automating collection to make better use of data.</em></p><p class=\"t-narrative-p\">At Puissance de Femmes, automation of web data collection to reduce manual tasks and make it easier to gather the information projects needed.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Developed Python scripts.</li><li>Automated data collection.</li><li>Set up web scraping processes.</li><li>Structured the collected data.</li></ul></div>", skills: "<span>Python</span><span>Web Scraping</span><span>Automation</span><span>Data Collection</span><span>Data Processing</span>" },
      orange: { title: "AI Project Lead / Data Analyst Intern", org: "Orange Côte d'Ivoire · Abidjan, CI", body: "<p class=\"t-tagline\"><em>Turning data into decision-making tools.</em></p><p class=\"t-narrative-p\">Two successive roles at Orange Côte d'Ivoire around data, artificial intelligence and web development, to strengthen the company's financial and commercial performance tracking.</p><div class=\"t-contrib\"><div class=\"t-contrib-groups\"><div class=\"t-contrib-group\"><h5>Data &amp; tracking</h5><ul><li>Built performance dashboards.</li><li>Set up real-time KPIs.</li><li>Integrated AI scoring mechanisms.</li></ul></div><div class=\"t-contrib-group\"><h5>Development</h5><ul><li>Designed and developed web interfaces.</li><li>Improved performance through list virtualization.</li><li>Implemented dynamic filters.</li><li>Built a smart Excel import system.</li></ul></div><div class=\"t-contrib-group\"><h5>User experience</h5><ul><li>Designed smooth, user-focused interfaces.</li><li>Improved navigation and data exploration.</li></ul></div></div></div>", tools: "<span>Next.js</span><span>TypeScript</span><span>Tailwind CSS</span><span>Zustand</span><span>SheetJS</span>", skills: "<span>Data Analysis</span><span>Dashboarding</span><span>KPI</span><span>AI Scoring</span><span>Frontend Development</span><span>UX</span><span>Project Management</span><span>Data Processing</span>" },
      groupeimage: { title: "R&amp;D Project Contributor, AI", org: "Groupe Image et Concept · Paris, FR", body: "<p class=\"t-tagline\"><em>Bringing voice and artificial intelligence together.</em></p><p class=\"t-narrative-p\">An R&amp;D project focused on building an interactive system combining voice recognition, natural language processing and language models, for a more natural interaction with the technology.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Built a voice processing pipeline.</li><li>Integrated a Speech-to-Text step.</li><li>Processed the resulting text data.</li><li>Integrated an LLM.</li><li>Helped design a complete chain from voice input to system interaction.</li></ul></div>", skills: "<span>Speech-to-Text</span><span>NLP</span><span>LLM</span><span>Conversational AI</span><span>AI Pipeline</span>" },
      sursaut: { title: "Web Developer", org: "Sursaut Technologie", body: "<p class=\"t-narrative-p\">Sursaut Technologie is a think tank that catalyzes technology adoption across Africa around three pillars: propelling high-potential innovations, supporting emerging manufacturing companies, and celebrating innovators.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Built the site with Next.js.</li><li>Designed an interface reflecting the think tank's identity and strategic pillars.</li><li>Deployed and launched the site.</li></ul></div>", skills: "<span>Next.js</span><span>Web Development</span><span>Web Design</span><span>Deployment</span>" },
      kaufman: { title: "AI Project Lead", org: "Kaufman &amp; Broad · Paris, FR", body: "<p class=\"t-tagline\"><em>Using AI to better understand territorial data.</em></p><p class=\"t-narrative-p\">A project focused on analyzing territorial data to support urban planning challenges.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Analyzed large-scale territorial data.</li><li>Explored ways to use AI in data analysis.</li><li>Designed an intelligent internal chatbot.</li><li>Used NLP and LLMs to automate internal support.</li></ul></div>", skills: "<span>Data Analysis</span><span>NLP</span><span>LLM</span><span>Chatbot</span><span>Applied AI</span><span>Project Management</span>" },
      craftai: { title: "AI R&amp;D Project Lead, Legal", org: "CraftAI · Paris, FR", body: "<p class=\"t-tagline\"><em>Making legal information more accessible through AI.</em></p><p class=\"t-narrative-p\">JurisIA is an AI legal assistant built on Légifrance data, designed to enable a more natural interaction with legal information through an AI architecture that generates answers from identifiable sources.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Integrated Légifrance's PISTE API.</li><li>Designed a RAG (Retrieval-Augmented Generation) architecture.</li><li>Implemented controlled generation.</li><li>Integrated source-traceability mechanisms.</li><li>Focused on verifiable, documented answers.</li></ul></div>", skills: "<span>RAG</span><span>LLM</span><span>NLP</span><span>API</span><span>AI Architecture</span><span>Project Management</span><span>Document Research</span><span>Traceability</span>" },
      veltis: { title: "Data Engineering Project, Healthcare (R&amp;D)", org: "Veltis · Paris, FR", body: "<p class=\"t-tagline\"><em>Structuring data to make it usable and reliable.</em></p><p class=\"t-narrative-p\">Design of a clinical data platform meant to centralize and make it easier to use information from different sources, with the goal of building a structured database and an interface letting users search, filter and export the information they needed.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Contributions</p><ul class=\"t-contrib-list\"><li>Connected to different sources via APIs.</li><li>Set up compliant web-scraping data collection.</li><li>Structured a database.</li><li>Built search, filtering and export features.</li><li>Ran data quality checks.</li><li>Addressed security and GDPR compliance.</li></ul></div>", skills: "<span>Data Engineering</span><span>API</span><span>Web Scraping</span><span>Data Quality</span><span>Power Pages</span><span>Data Management</span><span>GDPR</span><span>Data Security</span>" },
      kaydan: { title: "AI &amp; Data Engineer", org: "Kaydan Technology · Abidjan, CI", body: "<p class=\"t-tagline\"><em>AI, blockchain and automation for business solutions.</em></p><p class=\"t-narrative-p\">At Kaydan Technology, several technology challenges combining artificial intelligence, full-stack development, blockchain and automated document processing.</p><div class=\"t-contrib\"><div class=\"t-contrib-groups\"><div class=\"t-contrib-group\"><h5>Blockchain</h5><p>Verification blockchain based on Hyperledger Fabric, with an on-chain/off-chain architecture and multi-organization access management.</p></div><div class=\"t-contrib-group\"><h5>Intelligent ATS</h5><p>Full-stack ATS (Node.js, TypeScript, React) with a candidate portal and internal HR platform.</p></div><div class=\"t-contrib-group\"><h5>OCR pipeline</h5><p>OCR pipeline for automatic extraction and structuring of data from administrative documents.</p></div></div></div>", skills: "<span>Hyperledger Fabric</span><span>Blockchain</span><span>OCR</span><span>Node.js</span><span>TypeScript</span><span>React</span><span>Full-Stack Development</span><span>Data Processing</span><span>Software Architecture</span>" },
      holyconnect: { date: "06/2026 — Present", title: "Founder &amp; Product Developer", org: "HolyConnect", body: "<p class=\"t-tagline\"><em>Building a product from scratch, from idea to launch.</em></p><p class=\"t-narrative-p\">HolyConnect is an entrepreneurial project centered on a mobile app dedicated to sharing and fellowship around the Christian faith, with a founder and Product Developer role spanning the full product cycle: vision, design, development, user experience, testing and deployment.</p><div class=\"t-contrib\"><p class=\"t-contrib-label\">Achievements</p><div class=\"t-contrib-groups\"><div class=\"t-contrib-group\"><h5>Product design</h5><p>Defined the product vision, features and user experience.</p></div><div class=\"t-contrib-group\"><h5>Full-stack development</h5><p>Designed and developed the mobile app with Next.js, Capacitor and Firebase.</p></div><div class=\"t-contrib-group\"><h5>Smart features</h5><p>AI chatbot and AI-powered Bible search engine.</p></div><div class=\"t-contrib-group\"><h5>Social experience</h5><p>News feed and social features (posts, messages, stories).</p></div><div class=\"t-contrib-group\"><h5>Deployment</h5><p>User testing, App Store and Google Play publishing, ongoing improvement.</p></div></div></div>", skills: "<span>Product Management</span><span>Full-Stack Development</span><span>Mobile Development</span><span>Generative AI</span><span>UX/UI</span><span>Firebase</span><span>Next.js</span><span>Capacitor</span><span>Project Management</span>" },
      next: { date: "From October 2026", title: "Next chapter, a Work-study apprentice", org: "3 weeks company / 1 week school", desc: "Looking for a team to deepen my expertise and contribute to impactful AI &amp; Data projects&hellip; <span class=\"glow-word pulse-scale glow-blue\">a Work-study apprentice</span> role or <span class=\"glow-word pulse-scale glow-red\">a collaboration</span>&nbsp;?" }
    },
    preview: { appScreen: "App preview", visitSite: "Visit the site ↗" },
    skills: {
      title: "Toolbox",
      subtitle: "What connects design to production.",
      langages: "Languages", ml: "Machine Learning", web: "Web Development", outils: "Tools",
      linux: "Linux shell", langues: "Languages",
      fr: "French, C2, native", en: "English, B2",
      agentic: "Agentic AI", aiethics: "AI Ethics",
      blockchain: "Blockchain &amp; Security", gdpr: "GDPR", security: "Data Security"
    },
    certs: {
      title: "Certifications",
      subtitle: "Click a card to see what it covered.",
      flipHint: "Click to flip",
      domainsLabel: "Areas:",
      genai: { title: "Generative AI in Action", back: "A certification focused on generative AI and its applications.", domains: "<span>Generative AI</span><span>LLM</span><span>AI</span>" },
      sustain: { title: "Fundamentals of Sustainability", back: "A course covering the fundamentals of sustainability and related challenges.", domains: "<span>Sustainability</span><span>Environmental Awareness</span>" },
      impacts: { title: "Environmental Impacts of Digital Technology", back: "A course on the environmental impacts linked to digital technology.", domains: "<span>Responsible Tech</span><span>Environmental Impact</span>" },
      redd: { back: "A course on the challenges of reducing emissions from deforestation and forest degradation.", domains: "<span>Climate</span><span>Sustainable Development</span>" },
      asteroid: { title: "Asteroid Search", back: "Took part in an asteroid-search initiative based on real astronomical data analysis.", domains: "<span>Astronomy</span><span>Research</span><span>Data Analysis</span>" }
    },
    contact: {
      eyebrow: "Next chapter",
      title: "Let's build something<br>intelligent, together.",
      sub: "<span class=\"glow-word glow-blue\">Work-study apprentice</span> in AI &amp; Data Engineering, available from October 2026<br>(3&nbsp;weeks company / 1&nbsp;week school)",
      copyHint: "click to copy",
      copied: "Address copied!",
      open: "Beyond the <span class=\"glow-word glow-blue\">Work-study apprentice</span> role, I'm open to any kind of <span class=\"glow-word glow-red\">collaboration</span>.",
      form: {
        eyebrow: "Or message me directly",
        name: "Full name",
        email: "Email",
        message: "Message",
        submit: "Send message",
        sending: "Sending…",
        success: "Message sent, thank you! I'll get back to you soon.",
        error: "Something went wrong, please try again or email me directly.",
        missing: "Please fill in all fields."
      }
    },
    footer: { note: "Malika Fofana, AI &amp; Data Engineer" }
  }
};

/* ===================== APPLY LANGUAGE ===================== */
function getNested(obj, path){
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : null, obj);
}

function applyLanguage(lang){
  const dict = I18N[lang] || I18N.fr;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = getNested(dict, el.getAttribute('data-i18n'));
    if (value !== null) el.innerHTML = value;
  });
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const active = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  try { localStorage.setItem('mf-lang', lang); } catch(e){ /* ignore */ }
}

function initLanguage(){
  let saved = null;
  try { saved = localStorage.getItem('mf-lang'); } catch(e){ /* ignore */ }
  const lang = saved || 'fr';
  applyLanguage(lang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')));
  });
}

document.addEventListener('DOMContentLoaded', initLanguage);
