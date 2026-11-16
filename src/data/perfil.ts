export const DADOS_PERFIL = {
  identidade: {
    nome: "Gislane Sena",
    curso: "Análise e Desenvolvimento de Sistemas (ADS)",
    previsaoConclusao: "Dezembro de 2026",
    github: "https://github.com/Gislanesena",
    focoProfissional:
      "Desenvolvimento de Software (com forte atuação em Front-end com HTML, CSS e JavaScript e automações em Python) aliado à Segurança da Informação (AppSec, Purple Team, criptografia e conformidade)."
  },

  motivacoesEVisao: {
    segurancaDaInformacao:
      "Meu interesse por Segurança da Informação nasceu da vontade de ir além de apenas fazer o código funcionar: eu quero entender como os sistemas falham na prática e como protegê-los desde a arquitetura até o deploy, unindo análise ofensiva e defensiva (Purple Team), criptografia e governança.",
    desenvolvimentoEAutomacao:
      "Gosto de construir interfaces diretas e bem estruturadas com HTML, CSS e JavaScript, e de usar Python para automatizar tarefas repetitivas, monitoramento e integração entre serviços.",
    comunidadeELideranca:
      "Acredito no compartilhamento de conhecimento técnico e na inclusão na área de tecnologia, atuando ativamente em iniciativas acadêmicas e comunidades de mulheres na cibersegurança."
  },

  habilidadesTecnicas: {
    frontend: {
      principal: ["HTML5", "CSS3", "JavaScript"],
      complementar: ["React", "Next.js", "Tailwind CSS"],
      observacao:
        "Minha base mais forte e frequente no front-end é HTML, CSS e JavaScript; utilizo React e Next.js de forma mais pontual em projetos específicos."
    },
    backendEAutomacao: [
      "Python",
      "Scripts de automação e monitoramento",
      "Integração de APIs (Groq, Gemini, Discord, Slack)",
      "GitHub Actions (CI/CD e agendamento de rotinas)"
    ],
    segurancaDaInformacao: [
      "AppSec (Application Security)",
      "Operações Purple Team (reconhecimento, análise de portas e headers HTTP)",
      "Criptografia simétrica e proteção de dados em bancos SQL",
      "Simulação de resposta a incidentes"
    ],
    normasEConformidade: [
      "ISO/IEC 27001",
      "ISO/IEC 27002",
      "ISA/IEC 62443 (Segurança em automação e sistemas industriais)",
      "LGPD (Lei Geral de Proteção de Dados)"
    ],
    cloudEDevOps: [
      "Fundamentos de Cloud Computing (AWS e Azure)",
      "Git e GitHub",
      "GitHub Actions"
    ]
  },

  projetos: [
    {
      id: "Scanner_purple",
      nome: "Scanner_purple (redteam-recon-scanner)",
      categoria: "Segurança da Informação / Purple Team",
      tecnologias: ["Python", "ThreadPoolExecutor", "Slack Webhooks"],
      descricao:
        "Scanner de reconhecimento desenvolvido em Python com execução multi-thread para auditoria rápida de portas e verificação de headers de segurança HTTP, enviando alertas automatizados diretamente para o Slack."
    },
    {
      id: "Alerta_Vagas",
      nome: "Alerta de Vagas (alerta.vagas)",
      categoria: "Automação & IA",
      tecnologias: ["Python", "Groq API", "Discord Webhooks", "GitHub Actions"],
      descricao:
        "Bot automatizado executado via GitHub Actions que filtra oportunidades nas áreas de Python, dados e sistemas de informação e envia notificações estruturadas para o Discord."
    },
    {
      id: "SatVantage",
      nome: "SatVantage",
      categoria: "Hackathon / Finanças & IA",
      tecnologias: ["HTML", "CSS", "JavaScript", "Análise de Dados"],
      descricao:
        "Projeto idealizado e validado em hackathon focado em análise e acompanhamento inteligente de métricas ligadas ao ecossistema Bitcoin."
    },
    {
      id: "OrbitMatter",
      nome: "OrbitMatter",
      categoria: "Hackathon NASA Space Apps",
      tecnologias: ["HTML", "CSS", "JavaScript"],
      descricao:
        "Solução desenvolvida durante o hackathon da NASA voltada à exploração e visualização de dados espaciais."
    },
    {
      id: "BuildXP",
      nome: "BuildXP",
      categoria: "Educação & Open Source",
      tecnologias: ["HTML", "CSS", "JavaScript"],
      descricao:
        "Plataforma open source idealizada para tornar o aprendizado em tecnologia mais prático e acessível, combinando desafios e sistema de progressão por experiência (XP)."
    },
    {
      id: "Sala_de_Crise",
      nome: "Sala de Crise (Simulador de Incidentes)",
      categoria: "Segurança da Informação & LGPD",
      tecnologias: ["HTML", "CSS", "JavaScript", "LGPD"],
      descricao:
        "Simulador interativo de resposta a incidentes de cibersegurança com cenários práticos envolvendo proteção de dados, LGPD e tomada de decisão sob pressão."
    }
  ],

  liderancaEVoluntariado: [
    {
      organizacao: "WoHackers",
      papel: "Desenvolvimento e liderança técnica de sistema",
      descricao:
        "Atuação no desenvolvimento e organização técnica de soluções para a comunidade voltada ao fortalecimento de mulheres na cibersegurança."
    },
    {
      organizacao: "Banca da Ciência — USP Leste",
      papel: "Tech Lead / Voluntariado",
      descricao:
        "Liderança técnica e apoio em iniciativas de divulgação científica e tecnológica na USP Leste."
    },
    {
      organizacao: "Connect Bytes",
      papel: "Voluntariado e colaboração técnica",
      descricao:
        "Participação ativa em projetos colaborativos de tecnologia e impacto educacional."
    }
  ]
};

export const GRAFO_INICIAL = {
  nodes: [
    { id: "Gislane_Sena", label: "Gislane Sena (Core)" },
    { id: "Scanner_purple", label: "Scanner_purple" },
    { id: "Seguranca_Info", label: "Segurança & AppSec" },
    { id: "Normas_LGPD", label: "ISO 27001 / IEC 62443 / LGPD" },
    { id: "Python_Automacao", label: "Python & Automação" },
    { id: "Alerta_Vagas", label: "Alerta de Vagas (IA)" },
    { id: "SatVantage", label: "SatVantage" },
    { id: "OrbitMatter", label: "OrbitMatter (NASA)" },
    { id: "BuildXP", label: "BuildXP (Open Source)" },
    { id: "Frontend_React", label: "HTML, CSS & JavaScript" },
    { id: "Lideranca_Voluntaria", label: "Liderança (WoHackers / USP)" },
    { id: "Cloud_DevOps", label: "Cloud & GitHub Actions" }
  ]
};