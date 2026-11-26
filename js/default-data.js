/**
 * Dados padrão do site — Tecla - Informática (Tecla JO / Tecla Precisa)
 * Para publicar alterações feitas em /admin para todos os visitantes:
 * 1. Aceda a /admin -> "Publicar & Backup" -> "Descarregar default-data.js"
 * 2. Substitua este ficheiro (js/default-data.js) pelo ficheiro descarregado.
 */
window.DEFAULT_SITE_DATA = {
  meta: {
    version: 2,
    updatedAt: "2026-11-26T16:50:00Z"
  },
  admin: {
    // Palavra-passe inicial: admin123
    passwordHash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"
  },
  brand: {
    name: "Tecla - Informática",
    subBrand: "Tecla JO · Tecla Precisa",
    tagline: "Tecnologia, Reparações e Soluções Informáticas na Póvoa de Lanhoso",
    shortCode: "TI",
    logoUrl: "assets/logo-tecla.png",
    iconUrl: "assets/icon-tecla.png",
    primaryColor: "#005bb5",
    accentColor: "#0095e8",
    darkColor: "#0b1324",
    backgroundColor: "#f8fafc",
    topBarLocation: "Rua Neuves Maisons, n.º 49 · Póvoa de Lanhoso",
    topBarHours: "Seg–Sex: 09:00–19:00 | Sáb: 09:30–13:00",
    footerText: "Tecla Precisa — Informática e Programação, Lda. Loja de informática, reparações técnicas, mundo gaming e soluções empresariais na Póvoa de Lanhoso.",
    copyright: "© 2026 Tecla - Informática (Tecla JO / Tecla Precisa). Todos os direitos reservados.",
    social: {
      facebook: "https://www.facebook.com/infotecla/?locale=pt_PT",
      facebookBusiness: "https://www.facebook.com/teclaprecisa/?locale=pt_PT",
      instagram: "https://www.instagram.com/teclainformaticapvl/",
      whatsapp: "351253067976"
    },
    legal: {
      complaintsBookUrl: "https://www.livroreclamacoes.pt/",
      ralText: "Em caso de litígio o consumidor pode recorrer a uma Entidade de Resolução Alternativa de Litígios de consumo: CNIACC — Centro Nacional de Informação e Arbitragem de Conflitos de Consumo (www.cniacc.pt).",
      privacyText: "A Tecla Precisa — Informática e Programação, Lda. respeita a sua privacidade nos termos do RGPD. Os dados enviados através dos formulários de contacto ou pedido de orçamento são utilizados exclusivamente para responder ao seu pedido e não são partilhados com terceiros."
    }
  },
  sectionsVisible: {
    hero: true,
    pillars: true,
    catalog: true,
    repairs: true,
    business: true,
    gallery: true,
    about: true,
    team: true,
    testimonials: true,
    news: true,
    contact: true
  },
  hero: {
    badge: "Póvoa de Lanhoso · Loja, Assistência Técnica & Empresas",
    title: "Tecnologia, Reparações e Soluções Informáticas na Póvoa de Lanhoso.",
    subtitle: "Computadores, telemóveis novos e recondicionados, setups gaming, consumíveis, assistência técnica rápida e software de faturação certificado XD para empresas.",
    primaryCtaText: "Ver Equipamentos",
    primaryCtaLink: "#catalogo",
    secondaryCtaText: "Marcar Reparação",
    secondaryCtaLink: "#reparacoes",
    imageUrl: "assets/hero-bg.svg",
    stats: [
      { value: "Diagnóstico", label: "Rápido e Transparente" },
      { value: "Garantia", label: "Equipamentos & Reparações" },
      { value: "Software XD", label: "Parceiro para Empresas" }
    ],
    pillars: [
      {
        icon: "🎮",
        title: "Loja & Mundo Gaming",
        description: "Telemóveis novos e recondicionados, portáteis, PCs gaming por medida, impressoras, tinteiros e toners.",
        linkText: "Explorar catálogo",
        linkHref: "#catalogo"
      },
      {
        icon: "🛠️",
        title: "Assistência Técnica",
        description: "Reparação de computadores, smartphones e periféricos. Ecrãs, baterias, limpeza térmica e recuperação de dados.",
        linkText: "Pedir orçamento",
        linkHref: "#reparacoes"
      },
      {
        icon: "💼",
        title: "Empresas & Software",
        description: "Software de gestão e faturação certificada (XD), sistemas POS para restauração e retalho, redes e formação.",
        linkText: "Ver soluções B2B",
        linkHref: "#empresas"
      }
    ]
  },
  catalog: {
    eyebrow: "Loja & Destaques da Semana",
    title: "Catálogo de Equipamentos & Consumíveis",
    subtitle: "Reserve diretamente na loja ou encomende via WhatsApp com a referência já preenchida.",
    items: [
      {
        id: "prod-1",
        ref: "TEC-TEL-101",
        category: "Telemóveis",
        badge: "Recondicionado c/ Garantia",
        title: "iPhone 13 128GB — Grau A+",
        description: "Testado em loja, bateria verificada, desbloqueado a todas as redes e pronto a usar com garantia.",
        price: "399€",
        imageUrl: "assets/prod-phone.svg"
      },
      {
        id: "prod-2",
        ref: "TEC-PC-204",
        category: "Computadores & Portáteis",
        badge: "Destaque da Semana",
        title: "Portátil 15.6\" Intel Core i5 / 16GB / 512GB SSD",
        description: "Ideal para trabalho, escola e uso diário. Entregue pronto a trabalhar com configuração inicial incluída.",
        price: "589€",
        imageUrl: "assets/prod-laptop.svg"
      },
      {
        id: "prod-3",
        ref: "TEC-GAM-308",
        category: "Mundo Gaming",
        badge: "Setup Gaming",
        title: "PC Gaming Tecla Custom — RTX 4060 / 32GB",
        description: "Montado à medida na nossa oficina com excelente fluxo de ar, SSD NVMe 1TB e iluminação ARGB.",
        price: "995€",
        imageUrl: "assets/prod-gaming.svg"
      },
      {
        id: "prod-4",
        ref: "TEC-IMP-412",
        category: "Impressoras & Consumíveis",
        badge: "Em Stock",
        title: "Packs de Tinteiros & Toners (HP, Epson, Brother, Canon)",
        description: "Originais e compatíveis de alta qualidade com aconselhamento pelo modelo exato da sua impressora.",
        price: "Desde 9,90€",
        imageUrl: "assets/prod-printer.svg"
      },
      {
        id: "prod-5",
        ref: "TEC-GAM-315",
        category: "Mundo Gaming",
        badge: "Novo",
        title: "Monitor Gaming 27\" 165Hz IPS Full HD",
        description: "Tempo de resposta de 1ms, cores vibrantes e fluidez máxima para jogos e produtividade.",
        price: "179€",
        imageUrl: "assets/prod-gaming.svg"
      },
      {
        id: "prod-6",
        ref: "TEC-TEL-118",
        category: "Telemóveis",
        badge: "Promoção",
        title: "Smartphone Android 5G 256GB (Novo)",
        description: "Ecrã AMOLED 120Hz, carregamento rápido e capa + película de vidro aplicadas na hora.",
        price: "249€",
        imageUrl: "assets/prod-phone.svg"
      }
    ]
  },
  repairs: {
    eyebrow: "Assistência Técnica Especializada",
    title: "Reparação de Computadores, Smartphones & Periféricos",
    subtitle: "Laboratório próprio na Póvoa de Lanhoso com técnicos experientes. Descreva a avaria e receba uma estimativa rápida.",
    services: [
      {
        id: "rep-1",
        icon: "📱",
        title: "Substituição de Ecrãs & Baterias",
        description: "Troca rápida de ecrãs partidos, baterias viciadas, conectores de carga e câmaras em smartphones e tablets.",
        eta: "No próprio dia / 24h"
      },
      {
        id: "rep-2",
        icon: "❄️",
        title: "Limpeza Interna & Massa Térmica",
        description: "Elimine sobreaquecimento e ruído excessivo em portáteis, desktops e consolas prolongando a vida útil.",
        eta: "Serviço preventivo"
      },
      {
        id: "rep-3",
        icon: "💾",
        title: "Formatação, Upgrades SSD & Dados",
        description: "Dê nova vida ao seu computador lento com SSD/RAM, reinstalação limpa e recuperação de ficheiros importantes.",
        eta: "Diagnóstico na hora"
      },
      {
        id: "rep-4",
        icon: "🖥️",
        title: "Montagem de PCs por Medida",
        description: "Configuração e montagem de PCs Gaming, estações de trabalho e edição de vídeo ajustados ao seu orçamento.",
        eta: "Aconselhamento incluído"
      },
      {
        id: "rep-5",
        icon: "🛡️",
        title: "Remoção de Vírus & Segurança",
        description: "Limpeza de malware, proteção antivírus, backups automáticos e configuração de e-mail e cloud.",
        eta: "Proteção total"
      },
      {
        id: "rep-6",
        icon: "🖨️",
        title: "Impressoras & Periféricos",
        description: "Manutenção de impressoras, configuração em rede Wi-Fi e resolução de falhas de hardware.",
        eta: "Particulares e empresas"
      }
    ]
  },
  business: {
    eyebrow: "Tecla Precisa · Tecla JO",
    title: "Soluções Empresariais, Faturação & Software XD",
    subtitle: "Apoiamos cafés, restaurantes, lojas, oficinas e PMEs da região com tecnologia fiável, faturação certificada e suporte técnico de proximidade.",
    ctaText: "Agendar Demonstração Gratuita",
    ctaLink: "#contactos",
    highlights: [
      {
        id: "biz-1",
        icon: "🧾",
        title: "Software de Gestão & Faturação XD",
        description: "Implementação, migração de dados, ligação à Autoridade Tributária (AT), SAF-T e faturação eletrónica."
      },
      {
        id: "biz-2",
        icon: "🍽️",
        title: "Pontos de Venda (POS) Retalho & Restauração",
        description: "Ecrãs táteis, gavetas, impressoras térmicas, comandas móveis e controlo de mesas e stocks."
      },
      {
        id: "biz-3",
        icon: "🌐",
        title: "Redes, Servidores & Manutenção",
        description: "Redes estruturadas, Wi-Fi profissional, backups seguros e contratos de assistência informática prioritária."
      },
      {
        id: "biz-4",
        icon: "🎓",
        title: "Consultoria & Formação",
        description: "Acompanhamento próximo na digitalização do negócio e formação prática para a sua equipa."
      }
    ]
  },
  gallery: {
    eyebrow: "O Nosso Espaço & Trabalhos",
    title: "Galeria Tecla - Informática",
    subtitle: "Conheça a nossa loja na Póvoa de Lanhoso, setups montados e soluções instaladas.",
    items: [
      {
        id: "gal-1",
        title: "Loja na Rua Neuves Maisons, n.º 49",
        category: "Loja",
        imageUrl: "assets/gallery-1.svg"
      },
      {
        id: "gal-2",
        title: "Setups Gaming Montados à Medida",
        category: "Gaming",
        imageUrl: "assets/prod-gaming.svg"
      },
      {
        id: "gal-3",
        title: "Bancada de Assistência & Reparações",
        category: "Reparações",
        imageUrl: "assets/gallery-2.svg"
      },
      {
        id: "gal-4",
        title: "Sistemas POS & Faturação XD",
        category: "Empresas",
        imageUrl: "assets/gallery-4.svg"
      }
    ]
  },
  about: {
    eyebrow: "Sobre a Tecla",
    title: "A Sua Loja de Informática de Confiança na Póvoa de Lanhoso",
    description: "A Tecla - Informática (Tecla JO / Tecla Precisa — Informática e Programação, Lda.) combina o atendimento próximo de uma equipa local com soluções tecnológicas completas para particulares e empresas.\n\nSeja para escolher um telemóvel recondicionado com garantia, montar um PC gaming, encontrar o tinteiro certo, reparar um equipamento ou implementar software de faturação XD no seu negócio, estamos sempre cá para ajudar com transparência.",
    imageUrl: "assets/about-img.svg",
    values: [
      {
        icon: "⚡",
        title: "Rapidez & Rigor",
        description: "Sabemos que hoje ninguém pode ficar sem computador ou telemóvel. Damos prioridade a respostas rápidas."
      },
      {
        icon: "🤝",
        title: "Atendimento Próximo",
        description: "Explicamos sem linguagem complicada e aconselhamos apenas o que faz realmente sentido para si."
      },
      {
        icon: "✅",
        title: "Garantia & Confiança",
        description: "Equipamentos verificados, peças de qualidade e acompanhamento pós-venda real na loja."
      }
    ]
  },
  team: {
    eyebrow: "Quem Está Consigo",
    title: "A Nossa Equipa",
    subtitle: "Técnicos e especialistas prontos a resolver o seu problema informático.",
    members: [
      {
        id: "tm-1",
        name: "Equipa Técnica & Gerência",
        role: "Soluções Empresariais & Software XD",
        bio: "Implementação de software de gestão, sistemas POS, consultoria informática e apoio direto a empresas da região.",
        photoUrl: "assets/icon-tecla.png"
      },
      {
        id: "tm-2",
        name: "Atendimento & Loja",
        role: "Equipamentos, Gaming & Consumíveis",
        bio: "Aconselhamento na escolha de telemóveis, portáteis, periféricos gaming, impressoras, tinteiros e toners.",
        photoUrl: "assets/icon-tecla.png"
      },
      {
        id: "tm-3",
        name: "Laboratório de Reparações",
        role: "Assistência de PCs & Smartphones",
        bio: "Diagnóstico eletrónico, substituição de ecrãs e baterias, limpeza térmica, upgrades e recuperação de dados.",
        photoUrl: "assets/icon-tecla.png"
      }
    ]
  },
  testimonials: {
    eyebrow: "Avaliações de Clientes",
    title: "O Que Dizem na Póvoa de Lanhoso",
    subtitle: "A confiança de clientes particulares e empresas locais é o nosso maior cartão de visita.",
    items: [
      {
        id: "tst-1",
        name: "Pedro Silva",
        location: "Póvoa de Lanhoso",
        rating: 5,
        text: "Levei o meu portátil que não ligava e no dia seguinte já estava pronto, limpo e muito mais rápido com disco SSD. Serviço impecável!"
      },
      {
        id: "tst-2",
        name: "Mariana Fernandes",
        location: "Cliente Loja",
        rating: 5,
        text: "Comprei um iPhone recondicionado que parece completamente novo e ainda me ajudaram a passar os dados todos na hora. Recomendo muito."
      },
      {
        id: "tst-3",
        name: "Restaurante Local",
        location: "Cliente Empresas · Software XD",
        rating: 5,
        text: "Instalaram o nosso sistema POS com software XD e sempre que precisamos de apoio respondem rapidamente. Parceiros de total confiança."
      }
    ]
  },
  news: {
    eyebrow: "Novidades & Campanhas",
    title: "Destaques & Atualidade",
    subtitle: "Acompanhe as últimas promoções, chegadas de stock e novidades da Tecla.",
    items: [
      {
        id: "nws-1",
        date: "2026-11-20",
        tag: "Recondicionados",
        title: "Nova remessa de smartphones recondicionados com garantia",
        summary: "Chegaram novos equipamentos testados e certificados com excelente relação qualidade/preço.",
        content: "Recebemos novos modelos de smartphones recondicionados Grau A+, totalmente verificados pela nossa equipa técnica.\n\nTodos os equipamentos incluem garantia, opção de transferência de dados em loja e aplicação de película protetora na hora.",
        imageUrl: "assets/prod-phone.svg"
      },
      {
        id: "nws-2",
        date: "2026-11-10",
        tag: "Gaming",
        title: "Montamos o seu PC Gaming à medida do seu orçamento",
        summary: "Escolha os componentes connosco e receba o setup montado, testado e pronto a jogar.",
        content: "Quer um computador para jogar com fluidez, fazer streaming ou editar vídeo? Fazemos o orçamento peça a peça, garantimos total compatibilidade e entregamos o PC montado com cablagem organizada e testes de temperatura.",
        imageUrl: "assets/prod-gaming.svg"
      },
      {
        id: "nws-3",
        date: "2026-10-29",
        tag: "Empresas",
        title: "Atualize a faturação do seu negócio com Software XD",
        summary: "Soluções certificadas para comércio, restauração e serviços com suporte local na Póvoa de Lanhoso.",
        content: "Se vai abrir um negócio ou pretende modernizar o seu ponto de venda, agende uma demonstração gratuita do Software XD.\n\nTratamos do equipamento POS, instalação, configuração de artigos e formação da sua equipa.",
        imageUrl: "assets/gallery-4.svg"
      }
    ]
  },
  contact: {
    eyebrow: "Contactos & Localização",
    title: "Visite-nos na Póvoa de Lanhoso",
    subtitle: "Passe pela nossa loja na Rua Neuves Maisons, ligue-nos ou envie mensagem pelo WhatsApp.",
    address: "Rua Neuves Maisons, n.º 49, 4830-550 Póvoa de Lanhoso",
    phone: "+351 253 067 976",
    mobile: "+351 253 067 976",
    email: "geral@tecla-precisa.pt",
    hours: [
      { days: "Segunda a Sexta", time: "09:00 – 13:00 | 14:30 – 19:00" },
      { days: "Sábado", time: "09:30 – 13:00" },
      { days: "Domingo e Feriados", time: "Encerrado" }
    ],
    mapEmbedUrl: "https://maps.google.com/maps?q=Rua+Neuves+Maisons+49,+4830-550+Povoa+de+Lanhoso&t=&z=16&ie=UTF8&iwloc=&output=embed",
    mapLinkUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Neuves+Maisons+49,+4830-550+Povoa+de+Lanhoso",
    formDestination: "whatsapp"
  }
};
