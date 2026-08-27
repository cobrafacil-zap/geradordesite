/* ==========================================================================
   TEMPLATES — Define a estrutura de páginas/seções por segmento
   ========================================================================== */

// MODEL_PRESETS — copy distinto por modelo (slogan, about, serviços, etc.)
// São templates editáveis do segmento — não inventam números/certificações.
// Cada modelo ganha um heroStyle (A..G) que o site-generator usa para escolher layout.
// `company` é um nome sugerido para o usuário editar — nunca fica vazio.
// URLs de imagens livres (Unsplash) por categoria de empresa
// Cada preset traz um `image` para o hero/about — visível no preview e nos cards.
const IMG = {
  corporate:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop',
  modern:'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80&auto=format&fit=crop',
  premium:'https://images.unsplash.com/photo-1564013434775-f71db0030976?w=1200&q=80&auto=format&fit=crop',
  minimal:'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=1200&q=80&auto=format&fit=crop',
  local:'https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=1200&q=80&auto=format&fit=crop',
  construction:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80&auto=format&fit=crop',
  clinic:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format&fit=crop',
  realestate:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80&auto=format&fit=crop',
  services:'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200&q=80&auto=format&fit=crop',
  electrician:'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80&auto=format&fit=crop',
  plumber:'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&q=80&auto=format&fit=crop',
  mechanic:'https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?w=1200&q=80&auto=format&fit=crop',
  techassist:'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=1200&q=80&auto=format&fit=crop',
  cleaning:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80&auto=format&fit=crop',
  agency:'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80&auto=format&fit=crop',
  photographer:'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80&auto=format&fit=crop',
  'lp-product':'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80&auto=format&fit=crop',
  offer:'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&q=80&auto=format&fit=crop',
  sales:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&auto=format&fit=crop',
  'premium-prod':'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80&auto=format&fit=crop',
  catalog:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop',
  'local-prod':'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80&auto=format&fit=crop',
  lawyer:'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80&auto=format&fit=crop',
  accountant:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop',
  broker:'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80&auto=format&fit=crop',
  trainer:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80&auto=format&fit=crop',
  consultant:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop',
  autonomo:'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80&auto=format&fit=crop',
};

const MODEL_PRESETS = {
  'corporate':{
    "company": "Aurélio & Bastos Advogados Associados",
    "slogan": "Quarenta anos defendendo empresas que constroem o Brasil",
    "about": "Sociedade de advocacia full service com atuação em direito empresarial, contratos, M&A e contencioso estratégico. Atendemos grupos econômicos, médias empresas e investidores.",
    "segment": "Advocacia Empresarial",
    "city": "São Paulo",
    "state": "SP",
    "heroStyle": "A",
    "services": [
      {
        "name": "Direito Societário e M&A",
        "desc": "Estruturação, aquisição e reorganização societária."
      },
      {
        "name": "Contratos Complexos",
        "desc": "Negociação, redação e revisão de contratos nacionais e internacionais."
      },
      {
        "name": "Contencioso Estratégico",
        "desc": "Atuação em tribunais superiores e câmaras arbitrais."
      }
    ],
    "differentials": [
      {
        "name": "Bancas de Elite",
        "desc": "Sócios formados em universidades de referência, com passagem por firmas internacionais."
      },
      {
        "name": "Atendimento por Sócio",
        "desc": "Cada cliente é acompanhado por um sócio responsável, não por estagiário."
      },
      {
        "name": "SLA de Resposta",
        "desc": "24h úteis para retorno em qualquer demanda."
      }
    ],
    "faq": [
      {
        "q": "Vocês atuam em arbitragem?",
        "a": "Sim, somos árbitros e advogados em câmaras como CAM-CCBC e CIESP/FIESP."
      },
      {
        "q": "Como é a forma de cobrança?",
        "a": "Honorários por hora, valor fixo ou êxito, sempre combinados antes do início."
      }
    ]
  },
  'modern':{
    "company": "Stack Lab",
    "slogan": "Engenharia de software com obsessão por produto",
    "about": "Time senior de engenheiros e product designers que entrega software robusto, escalável e observável. Atuamos como squad embarcada ou projeto fechado.",
    "segment": "Engenharia de Software",
    "city": "Florianópolis",
    "state": "SC",
    "heroStyle": "C",
    "services": [
      {
        "name": "Squads Embarcadas",
        "desc": "Engenheiros e QAs alocados no seu time com cultura e processo definidos."
      },
      {
        "name": "Plataformas e APIs",
        "desc": "Backend assíncrono, microsserviços e GraphQL para alto tráfego."
      },
      {
        "name": "Modernização de Legado",
        "desc": "Migração incremental de monolitos para arquiteturas evolutivas."
      }
    ],
    "differentials": [
      {
        "name": "Só Engenheiro Senior",
        "desc": "Nenhum dev júnior no projeto. Média de 8 anos de experiência."
      },
      {
        "name": "Observabilidade desde o dia 1",
        "desc": "Logs estruturados, métricas, tracing e alertas desde a primeira sprint."
      },
      {
        "name": "On-call com SLA",
        "desc": "Plantão com tempo de resposta contratual."
      }
    ],
    "faq": [
      {
        "q": "Vocês fazem outsourcing ou fixed-price?",
        "a": "Trabalhamos nos dois modelos. Recomenda-se squad embarcada para evolução contínua."
      },
      {
        "q": "Qual stack?",
        "a": "TypeScript, Go, Python, Rust, Kubernetes, PostgreSQL, Kafka, AWS e GCP."
      }
    ]
  },
  'premium':{
    "company": "Atelier Fiamma",
    "slogan": "Alta relojoaria, ourivesaria e objetos de coleção",
    "about": "Casa especializada em relógios suíços de alta gama, joias sob encomenda e objetos de arte. Atendimento exclusivo por agendamento.",
    "segment": "Alta Relojoaria",
    "city": "São Paulo",
    "state": "SP",
    "heroStyle": "B",
    "services": [
      {
        "name": "Curadoria de Relógios",
        "desc": "Pequenas tiragens de maisons independentes e peças usadas certificadas."
      },
      {
        "name": "Joias sob Encomenda",
        "desc": "Peças únicas desenhadas em conjunto com ourives e lapidários."
      },
      {
        "name": "Manutenção Especializada",
        "desc": "Revisão periódica por relojoeiro formado na Suíça."
      }
    ],
    "differentials": [
      {
        "name": "Procedência Garantida",
        "desc": "Cada peça acompanha certificado e nota de procedência."
      },
      {
        "name": "Atendimento por Agenda",
        "desc": "Showroom particular, sem fila e sem pressão."
      },
      {
        "name": "Garantia Estendida",
        "desc": "Cobertura adicional após a entrega, com revisão anual cortesia."
      }
    ],
    "faq": [
      {
        "q": "Vocês compram peças usadas?",
        "a": "Avaliamos peças de grifes como Rolex, Patek, Audemars e Cartier para venda ou consignação."
      }
    ]
  },
  'minimal':{
    "company": "Estúdio Linha Mínima",
    "slogan": "Menos ornamento. Mais intenção.",
    "about": "Estúdio de design independente focado em branding e identidade verbal. Atendemos marcas que valorizam clareza, tipografia e sistemas visuais duráveis.",
    "segment": "Design Independente",
    "city": "Curitiba",
    "state": "PR",
    "heroStyle": "B",
    "services": [
      {
        "name": "Branding Essencial",
        "desc": "Identidade visual enxuta com tipografia, paleta e sistema de aplicação."
      },
      {
        "name": "Direção de Arte",
        "desc": "Posicionamento visual e verbal coerente em todos os pontos de contato."
      },
      {
        "name": "Edição Tipográfica",
        "desc": "Livros, catálogos e materiais impressos com diagramação autoral."
      }
    ],
    "differentials": [
      {
        "name": "Sem Stock Photos",
        "desc": "Trabalhamos só com fotografia autoral ou direção de arte."
      },
      {
        "name": "Projeto por Fase",
        "desc": "Entregas incrementais, com aprovação a cada etapa."
      },
      {
        "name": "Manual Vivo",
        "desc": "Identidade documentada como sistema, não como pacote de logos."
      }
    ],
    "faq": [
      {
        "q": "Vocês fazem só logo?",
        "a": "Não. Acreditamos em identidade como sistema, não como símbolo isolado."
      }
    ]
  },
  'local':{
    "company": "Mercado da Esquina",
    "slogan": "Pão quente todo dia, café do interior e gente conhecida",
    "about": "Mercearia de bairro com produção diária de pães, bolos, frios e hortifruti. Funcionamos como ponto de encontro do quarteirão.",
    "segment": "Comércio de Bairro",
    "city": "Campinas",
    "state": "SP",
    "heroStyle": "E",
    "services": [
      {
        "name": "Padaria Artesanal",
        "desc": "Pão francês, integral e fermentação natural, assado durante o dia."
      },
      {
        "name": "Hortifruti do Dia",
        "desc": "Frutas, legumes e verduras de produtores da região."
      },
      {
        "name": "Café da Manhã Pronto",
        "desc": "Pão na chapa, café coado e sucos naturais a qualquer hora."
      }
    ],
    "differentials": [
      {
        "name": "Produção Diária",
        "desc": "Nada de ontem. Tudo fresco, feito durante a madrugada."
      },
      {
        "name": "Atendentes do Bairro",
        "desc": "Você vai conhecer quem te atende pelo nome."
      },
      {
        "name": "Encomendas pelo WhatsApp",
        "desc": "Reservas para festas, cafés corporativos e datas especiais."
      }
    ],
    "faq": [
      {
        "q": "Vocês entregam?",
        "a": "Sim, para a região do bairro. Pedidos pelo WhatsApp com taxa de entrega."
      }
    ]
  },
  'construction':{
    "company": "Alvarez & Sena Engenharia",
    "slogan": "Estrutura, alvenaria e acabamento entregues no prazo",
    "about": "Construtora de pequeno e médio porte com equipe própria e orçamento detalhado. Atuamos em Belo Horizonte e região metropolitana.",
    "segment": "Construção Civil",
    "city": "Belo Horizonte",
    "state": "MG",
    "heroStyle": "A",
    "services": [
      {
        "name": "Construção Residencial",
        "desc": "Casas térreas e sobrados, do projeto à entrega das chaves."
      },
      {
        "name": "Reforma Estrutural",
        "desc": "Reforço, ampliação e mudança de layout com acompanhamento técnico."
      },
      {
        "name": "Gerenciamento de Obra",
        "desc": "Gestão completa de equipe, cronograma e suprimentos."
      }
    ],
    "differentials": [
      {
        "name": "Equipe Própria",
        "desc": "Pedreiros, armadores e eletricistas no nosso quadro — sem terceirização."
      },
      {
        "name": "Cronograma em Contrato",
        "desc": "Aditivo financeiro por atraso da construtora, jamais do cliente."
      },
      {
        "name": "ART e Habite-se",
        "desc": "Toda documentação técnica e legal emitida por nossa conta."
      }
    ],
    "faq": [
      {
        "q": "Vocês fazem projeto arquitetônico?",
        "a": "Temos arquitetos parceiros, mas aceitamos projeto do cliente."
      }
    ]
  },
  'clinic':{
    "company": "Instituto Bem Cuidar",
    "slogan": "Saúde integral para quem entende que tempo é qualidade de vida",
    "about": "Centro médico multidisciplinar com consultas, exames e acompanhamento em um só lugar. Foco em cardiologia, endocrinologia, nutrição e psicologia.",
    "segment": "Saúde Multidisciplinar",
    "city": "Rio de Janeiro",
    "state": "RJ",
    "heroStyle": "B",
    "services": [
      {
        "name": "Cardiologia",
        "desc": "Consulta, mapa, holter, ecocardiograma e teste ergométrico."
      },
      {
        "name": "Endocrinologia e Metabologia",
        "desc": "Tratamento de diabetes, tireoide e obesidade."
      },
      {
        "name": "Nutrição e Psicologia",
        "desc": "Equipe de apoio para plano alimentar e saúde mental."
      }
    ],
    "differentials": [
      {
        "name": "Médicos com Título",
        "desc": "Especialistas registrados nas sociedades de classe."
      },
      {
        "name": "Exames no Mesmo Dia",
        "desc": "Coleta, imagem e consulta no mesmo endereço."
      },
      {
        "name": "Convênios e Particular",
        "desc": "Atendemos Bradesco Saúde, SulAmérica, Amil e particular."
      }
    ],
    "faq": [
      {
        "q": "Vocês atendem emergência?",
        "a": "Não. Para urgências, procure uma UPA ou pronto-socorro."
      }
    ]
  },
  'realestate':{
    "company": "Lopes Imóveis Vila Madalena",
    "slogan": "Especialistas em apartamentos de médio e alto padrão na Zona Oeste",
    "about": "Imobiliária com foco em Vila Madalena, Pinheiros, Perdizes e Pompeia. Carteira selecionada de imóveis prontos, lançamentos e locação curta.",
    "segment": "Imóveis Zona Oeste SP",
    "city": "São Paulo",
    "state": "SP",
    "heroStyle": "F",
    "services": [
      {
        "name": "Compra e Venda",
        "desc": "Assessoria completa, do registro à entrega das chaves."
      },
      {
        "name": "Locação Residencial",
        "desc": "Residencial de curta e longa temporada, com análise de fiador."
      },
      {
        "name": "Lançamentos Direto da Construtora",
        "desc": "Condições especiais em empreendimentos na região."
      }
    ],
    "differentials": [
      {
        "name": "CRECI 12.345-J",
        "desc": "Imobiliária regular e com selo de qualidade da seção regional."
      },
      {
        "name": "Visita Acompanhada",
        "desc": "Corretor especialista na região em cada visita."
      },
      {
        "name": "Análise Jurídica Inclusa",
        "desc": "Suporte jurídico na due diligence do imóvel."
      }
    ],
    "faq": [
      {
        "q": "Vocês cobram para visitar?",
        "a": "Não. Visita e consultoria são gratuitas, comissionadas apenas na efetivação."
      }
    ]
  },
  'services':{
    "company": "Pratique Reparos",
    "slogan": "Marido de aluguel com hora marcada e preço combinado",
    "about": "Equipe de manutenção residencial e comercial para reparos rápidos: elétrica, hidráulica, montagem de móveis, pequenas obras.",
    "segment": "Manutenção Residencial",
    "city": "Niterói",
    "state": "RJ",
    "heroStyle": "E",
    "services": [
      {
        "name": "Reparos Elétricos",
        "desc": "Troca de disjuntor, instalação de chuveiro, ventiladores e tomadas."
      },
      {
        "name": "Hidráulica Leve",
        "desc": "Vazamentos, sifões, registros e instalação de filtros."
      },
      {
        "name": "Montagem e Instalação",
        "desc": "Móveis planejados, cortinas, TVs e suportes."
      }
    ],
    "differentials": [
      {
        "name": "Hora Marcada",
        "desc": "Janela de 2 horas. Sem \"entre 8h e 18h\"."
      },
      {
        "name": "Preço Combinado",
        "desc": "Valor combinado por WhatsApp antes da visita."
      },
      {
        "name": "NF Emitida",
        "desc": "Nota fiscal eletrônica em todos os serviços."
      }
    ],
    "faq": [
      {
        "q": "Atendem fim de semana?",
        "a": "Sim, sábados até 14h com taxa adicional."
      }
    ]
  },
  'electrician':{
    "company": "Faísca Engenharia Elétrica",
    "slogan": "Engenheiro CREA responsável por cada projeto que sai daqui",
    "about": "Empresa de instalações elétricas de baixa tensão com ART e projeto assinado por engenheiro. Residências, comércios e pequenas indústrias.",
    "segment": "Instalações Elétricas",
    "city": "Curitiba",
    "state": "PR",
    "heroStyle": "A",
    "services": [
      {
        "name": "Entrada de Energia",
        "desc": "Aumento de carga, adequação de padrão e homologação na concessionária."
      },
      {
        "name": "Quadro e Disjuntores",
        "desc": "Montagem e substituição de quadros com DRC e DPS."
      },
      {
        "name": "Iluminação e Eficiência",
        "desc": "Projeto luminotécnico com LED e dimerização."
      }
    ],
    "differentials": [
      {
        "name": "ART por Engenheiro",
        "desc": "Cada projeto sai com ART registrada no CREA-PR."
      },
      {
        "name": "Laudo de Aterramento",
        "desc": "Medição de resistência com laudo técnico."
      },
      {
        "name": "Garantia de 3 Anos",
        "desc": "Cobertura sobre serviço executado e materiais instalados."
      }
    ],
    "faq": [
      {
        "q": "Vocês fazem energia solar?",
        "a": "Sim, em parceria com integrador homologado."
      }
    ]
  },
  'plumber':{
    "company": "Encanador Residencial Aldo",
    "slogan": "Vazamento, desentupimento e instalação — orçamento antes da mão na massa",
    "about": "Encano profissional com atendimento residencial em Porto Alegre e Canoas. Equipamento de detecção eletrônica, sem quebra desnecessária.",
    "segment": "Encanamento Residencial",
    "city": "Porto Alegre",
    "state": "RS",
    "heroStyle": "A",
    "services": [
      {
        "name": "Desentupimento",
        "desc": "Pia, vaso, ralo, coluna e rede de esgoto com máquina rotativa."
      },
      {
        "name": "Detecção de Vazamento",
        "desc": "Geofone e câmera para localizar sem quebrar parede."
      },
      {
        "name": 'Reparo de Caixa-dagua',
        "desc": "Limpeza, impermeabilização e troca de boia."
      }
    ],
    "differentials": [
      {
        "name": "Sem Quebra Desnecessária",
        "desc": "Detecção eletrônica antes de qualquer intervenção."
      },
      {
        "name": "Orçamento Verbal por Vídeo",
        "desc": "Mande um vídeo pelo WhatsApp e receba valor estimado."
      },
      {
        "name": "Garantia de 90 Dias",
        "desc": "Cobertura sobre o reparo executado."
      }
    ],
    "faq": [
      {
        "q": "Atendem à noite?",
        "a": "Sim, para emergências, com taxa adicional."
      }
    ]
  },
  'mechanic':{
    "company": "Oficina do Bairro Pinheiros",
    "slogan": "Mecânica honesta a dois quarteirões da sua casa",
    "about": "Oficina de bairro com mecânico formado pelo SENAI e mais de 20 anos de experiência. Atendemos carros nacionais e importados.",
    "segment": "Mecânica Geral",
    "city": "São Paulo",
    "state": "SP",
    "heroStyle": "A",
    "services": [
      {
        "name": "Revisão Periódica",
        "desc": "Troca de óleo, filtros, pastilhas e check-up dos 50 itens."
      },
      {
        "name": "Injeção Eletrônica",
        "desc": "Diagnóstico com scanner e limpeza de bicos."
      },
      {
        "name": "Suspensão e Freios",
        "desc": "Alinhamento, balanceamento e troca de amortecedores."
      }
    ],
    "differentials": [
      {
        "name": "Orçamento em 24h",
        "desc": "Avaliação e valor enviado por WhatsApp em até um dia útil."
      },
      {
        "name": "Peças com Nota",
        "desc": "Peças originais ou genuínas com NF e garantia."
      },
      {
        "name": "Não Rodamos Peça",
        "desc": "Não indicamos troca do que ainda tem vida útil."
      }
    ],
    "faq": [
      {
        "q": "Aceitam cartão?",
        "a": "Sim, em até 6x sem juros para serviços acima de R$ 500."
      }
    ]
  },
  'techassist':{
    "company": "Recife Smart Fix",
    "slogan": "Conserto de celular, notebook e console com prazo e garantia",
    "about": "Assistência técnica especializada em smartphones, notebooks e videogames. Laboratório próprio com peças originais e原装（originais）.",
    "segment": "Assistência Técnica",
    "city": "Recife",
    "state": "PE",
    "heroStyle": "E",
    "services": [
      {
        "name": "Celulares",
        "desc": "Troca de tela, bateria, conector de carga e software."
      },
      {
        "name": "Notebooks",
        "desc": "Formatação, upgrade de SSD/RAM, troca de teclado e reparo de placa."
      },
      {
        "name": "Videogames",
        "desc": "Reparo de PS5, Xbox e Switch, com limpeza e pasta térmica."
      }
    ],
    "differentials": [
      {
        "name": "Orçamento em 24h",
        "desc": "Diagnóstico inicial em até um dia útil."
      },
      {
        "name": "Garantia de 90 Dias",
        "desc": "Cobertura sobre serviço e peças trocadas."
      },
      {
        "name": "Acompanhamento por OS",
        "desc": "Ordem de serviço digital com status atualizado por e-mail."
      }
    ],
    "faq": [
      {
        "q": "Vale a pena consertar?",
        "a": "Damos parecer técnico honesto antes de qualquer orçamento."
      }
    ]
  },
  'cleaning':{
    "company": "Brilho Já Diaristas",
    "slogan": "Faxina pesada com equipe fixa e produtos inclusos",
    "about": "Equipe de diaristas treinadas para faxina residencial e comercial. Atendemos Goiânia e Aparecida. Material e produtos por nossa conta.",
    "segment": "Diaristas e Limpeza",
    "city": "Goiânia",
    "state": "GO",
    "heroStyle": "A",
    "services": [
      {
        "name": "Faxina Residencial",
        "desc": "Apartamento, casa, cobertura e pós-mudança."
      },
      {
        "name": "Limpeza Comercial",
        "desc": "Salas, clínicas, escritórios e lojas."
      },
      {
        "name": "Pós-obra",
        "desc": "Faxina pesada após reforma com máquina e produto específico."
      }
    ],
    "differentials": [
      {
        "name": "Equipe Fixa",
        "desc": "Sempre a mesma equipe. Você conhece quem entra na sua casa."
      },
      {
        "name": "Produtos Inclusos",
        "desc": "Não precisa comprar nada. Levamos tudo."
      },
      {
        "name": "Substituição Imediata",
        "desc": "Em caso de falta, mandamos substituta sem custo."
      }
    ],
    "faq": [
      {
        "q": "Atendem aos domingos?",
        "a": "Sim, com taxa de 30%."
      }
    ]
  },
  'agency':{
    "company": "Coletivo Cru",
    "slogan": "Branding, conteúdo e campanha com direção autoral",
    "about": "Agência independente com 12 pessoas. Atendemos marcas que precisam de conceito forte e produção própria.",
    "segment": "Agência Independente",
    "city": "São Paulo",
    "state": "SP",
    "heroStyle": "C",
    "services": [
      {
        "name": "Posicionamento de Marca",
        "desc": "Plataforma estratégica, manifesto e território de marca."
      },
      {
        "name": "Campanhas Integradas",
        "desc": "On e off, com produção de mídia e redação."
      },
      {
        "name": "Conteúdo Social",
        "desc": "Planejamento, redação e direção de arte para redes."
      }
    ],
    "differentials": [
      {
        "name": "Produção Própria",
        "desc": "Estúdio interno para foto, vídeo e áudio."
      },
      {
        "name": "Time Pequeno, Senior",
        "desc": "Nenhum estagiário na conta. Só gente com 7+ anos."
      },
      {
        "name": "Trabalho com Direitos",
        "desc": "Trabalho registrado para a marca, com cessão total."
      }
    ],
    "faq": [
      {
        "q": "Atendem fora de SP?",
        "a": "Sim, com direção remota e produção local."
      }
    ]
  },
  'photographer':{
    "company": "Cris Becker Fotografia",
    "slogan": "Ensaios, casamentos e fotografia gastronômica com direção autoral",
    "about": "Estúdio de fotografia com base em Florianópolis e atuação nacional. Direção de arte, cenário e tratamento autoral.",
    "segment": "Fotografia Autoral",
    "city": "Florianópolis",
    "state": "SC",
    "heroStyle": "G",
    "services": [
      {
        "name": "Ensaios em Família",
        "desc": "Ensaios externos e em estúdio, com produção de cenário."
      },
      {
        "name": "Casamentos",
        "desc": "Cobertura completa do making of à festa, com segundo fotógrafo."
      },
      {
        "name": "Fotografia Gastronômica",
        "desc": "Still para restaurantes, cardápios e-commerce."
      }
    ],
    "differentials": [
      {
        "name": "Segundo Fotógrafo",
        "desc": "Em casamentos, sempre com segundo profissional."
      },
      {
        "name": "Galeria Online",
        "desc": "Entrega por galeria protegida com senha."
      },
      {
        "name": "Álbum Fine Art",
        "desc": "Impressão em papel de algodão Hahnemühle."
      }
    ],
    "faq": [
      {
        "q": "Quantas fotos vêm?",
        "a": "Cada orçamento inclui o quantitativo acordado em contrato."
      }
    ]
  },
  'lp-product':{
    "company": "Fone Ouvido Pro",
    "slogan": "Fone over-ear com cancelamento ativo e 40h de bateria",
    "about": "Lançamento de fone premium com som Hi-Res, app de equalização e case rígido. Garantia de 12 meses e troca em 7 dias.",
    "segment": "Eletrônicos · Áudio",
    "city": "São Paulo",
    "state": "SP",
    "heroStyle": "D",
    "services": [
      {
        "name": "Compra em 12x sem juros",
        "desc": "Parcelamento no cartão ou 5% off no PIX."
      },
      {
        "name": "Troca em 7 Dias",
        "desc": "Devolução gratuita se não gostar."
      },
      {
        "name": "Garantia de 12 Meses",
        "desc": "Assistência técnica no Brasil."
      }
    ],
    "differentials": [
      {
        "name": "Cancelamento Ativo",
        "desc": "Reduz até 35dB de ruído ambiente."
      },
      {
        "name": "Bateria 40h",
        "desc": "Uso contínuo sem precisar recarregar."
      },
      {
        "name": "Bluetooth 5.3 + Multiponto",
        "desc": "Conecta em dois dispositivos ao mesmo tempo."
      }
    ],
    "faq": [
      {
        "q": "Funciona em iPhone?",
        "a": "Sim. Codecs suportados: SBC, AAC, aptX HD e LDAC."
      }
    ]
  },
  'offer':{
    "company": "Kit Cozinha Inox 7 Peças",
    "slogan": "De R$ 1.299 por R$ 749 — só até domingo",
    "about": "Oferta por tempo limitado do kit de panelas inox com 7 peças. Frete grátis Sul e Sudeste, troca garantida em 7 dias.",
    "segment": "Utilidades Domésticas",
    "city": "Brasília",
    "state": "DF",
    "heroStyle": "A",
    "services": [
      {
        "name": "7 Peças Inox 18/10",
        "desc": "Panelas com fundo triplo e cabo ergonômico."
      },
      {
        "name": "Frete Grátis",
        "desc": "Para as regiões Sul e Sudeste."
      },
      {
        "name": "Garantia de 5 Anos",
        "desc": "Defeito de fabricação coberto."
      }
    ],
    "differentials": [
      {
        "name": "Indução e Gás",
        "desc": "Funciona em qualquer tipo de fogão."
      },
      {
        "name": "Pode ir à Lava-louças",
        "desc": "Sem rebarba, fácil higienização."
      },
      {
        "name": "Troca em 7 Dias",
        "desc": "Devolução por arrependimento sem burocracia."
      }
    ],
    "faq": [
      {
        "q": "A oferta é real mesmo?",
        "a": "Sim. O preço volta ao valor original na segunda-feira."
      }
    ]
  },
  'sales':{
    "company": "Mercado Centro Utilidades",
    "slogan": "Tudo para casa, cozinha e decoração em um só lugar",
    "about": "Loja online com mais de 3 mil produtos em estoque. Entrega para todo o Brasil e troca facilitada em 30 dias.",
    "segment": "Casa e Decoração",
    "city": "São Paulo",
    "state": "SP",
    "heroStyle": "D",
    "services": [
      {
        "name": "Catálogo por Categoria",
        "desc": "Cozinha, organização, decoração, banheiro, lavanderia e ferramentas."
      },
      {
        "name": "Frete por CEP",
        "desc": "Simulador calcula prazo e valor antes do checkout."
      },
      {
        "name": "Troca em 30 Dias",
        "desc": "Devolução sem burocracia por qualquer motivo."
      }
    ],
    "differentials": [
      {
        "name": "Site Seguro",
        "desc": "Certificado SSL e pagamento processado por gateway PCI."
      },
      {
        "name": "Atendimento Humano",
        "desc": "WhatsApp das 8h às 20h."
      },
      {
        "name": "Boleto a Vista 5% Off",
        "desc": "Desconto adicional no pagamento à vista."
      }
    ],
    "faq": [
      {
        "q": "Atendem atacado?",
        "a": "Sim, com tabela progressiva para revendas e empresas."
      }
    ]
  },
  'premium-prod':{
    "company": "Relógio Marlin Cronógrafo",
    "slogan": "Edição limitada de 50 peças. Movimento suíço Sellita SW510.",
    "about": "Cronógrafo automático de pulso com caixa de aço escovado, mostrador azul e pulseira de couro italiano. Numerados e entregues com estojo de madeira.",
    "segment": "Relógios Premium",
    "city": "São Paulo",
    "state": "SP",
    "heroStyle": "B",
    "services": [
      {
        "name": "Edição Limitada",
        "desc": "50 peças numeradas, com certificado de origem."
      },
      {
        "name": "Garantia de 5 Anos",
        "desc": "Defeito de fabricação coberto por nossa oficina."
      },
      {
        "name": "Revisão Cortesia",
        "desc": "Primeira revisão gratuita após 5 anos."
      }
    ],
    "differentials": [
      {
        "name": "Movimento Suíço",
        "desc": "Sellita SW510 com 48h de reserva de marcha."
      },
      {
        "name": "Caixa em Aço 316L",
        "desc": "Aço cirúrgico com resistência a maresia."
      },
      {
        "name": "Pulseira Italiana",
        "desc": "Couro bovino curtido vegetal, sem costuras aparentes."
      }
    ],
    "faq": [
      {
        "q": "Vocês entregam pessoalmente?",
        "a": "Sim, em São Paulo. Para outras regiões, envio por transportadora com seguro."
      }
    ]
  },
  'catalog':{
    "company": "Casa Inox Catálogo",
    "slogan": "Catálogo técnico de equipamentos em aço inox para food service",
    "about": "Distribuidora de equipamentos em aço inox para restaurantes, padarias, açougues e cozinhas industriais.",
    "segment": "Equipamentos Food Service",
    "city": "São Paulo",
    "state": "SP",
    "heroStyle": "D",
    "services": [
      {
        "name": "Catálogo por Linha",
        "desc": "Cozinha, refrigeração, manipulação, armazenagem e higiene."
      },
      {
        "name": "Cotação Personalizada",
        "desc": "Orçamento sob medida por WhatsApp para projetos grandes."
      },
      {
        "name": "Instalação Técnica",
        "desc": "Equipe própria para entrega e instalação."
      }
    ],
    "differentials": [
      {
        "name": "Estoque Real",
        "desc": "Disponibilidade atualizada no site e no WhatsApp."
      },
      {
        "name": "Desconto por Volume",
        "desc": "Tabela progressiva para pedidos acima de R$ 5 mil."
      },
      {
        "name": "Garantia de Fábrica",
        "desc": "12 a 24 meses conforme o fabricante."
      }
    ],
    "faq": [
      {
        "q": "Vocês importam sob demanda?",
        "a": "Sim, em parceria com trading de equipamentos industriais."
      }
    ]
  },
  'local-prod':{
    "company": "Cafés do Suleste Capixaba",
    "slogan": "Café arábica de altitude torrado em micro-lotes",
    "about": "Cafés especiais cultivados em fazendas do Espírito Santo, torrados em pequenos lotes com torra clara a média. Grãos selecionados e rastreáveis.",
    "segment": "Cafés Especiais",
    "city": "Vitória",
    "state": "ES",
    "heroStyle": "A",
    "services": [
      {
        "name": "Torra por Encomenda",
        "desc": "Cada pedido é torrado após confirmação."
      },
      {
        "name": "Assinatura Mensal",
        "desc": "250g ou 500g todo mês, com torra de até 7 dias."
      },
      {
        "name": "Curso de Barista",
        "desc": "Aula em grupo na nossa cafeteria para novos clientes."
      }
    ],
    "differentials": [
      {
        "name": "Origem Rastreável",
        "desc": "Lote, fazenda, altitude e variedade em cada embalagem."
      },
      {
        "name": "Torra Fresca",
        "desc": "Sai da torra direto para sua casa em até 5 dias úteis."
      },
      {
        "name": "Sem Conservantes",
        "desc": "Café puro, sem aditivos ou aromatizantes."
      }
    ],
    "faq": [
      {
        "q": "Vocês entregam para fora do ES?",
        "a": "Sim, para todo o Brasil via Correios ou transportadora."
      }
    ]
  },
  'lawyer':{
    "company": "Dr. Mateus Fontes — Advocacia Criminal",
    "slogan": "Defesa criminal técnica em primeira instância e tribunais",
    "about": "Advocacia criminal com atendimento pessoal pelo próprio Dr. Mateus. Atuação em inquéritos, audiências de custódia, júri e recursos.",
    "segment": "Direito Criminal",
    "city": "São Paulo",
    "state": "SP",
    "heroStyle": "A",
    "services": [
      {
        "name": "Inquéritos Policiais",
        "desc": "Acompanhamento desde oitivas até indiciamento."
      },
      {
        "name": "Audiência de Custódia",
        "desc": "Atuação nas primeiras 24h após prisão em flagrante."
      },
      {
        "name": "Tribunal do Júri",
        "desc": "Defesa em plenário com produção de prova e sustentação oral."
      }
    ],
    "differentials": [
      {
        "name": "Sigilo Total",
        "desc": "Atendimento reservado, em sala fechada, sem estagiários."
      },
      {
        "name": "OAB/SP 412.938",
        "desc": "Inscrito na OAB-SP desde 2012, sem sanções disciplinares."
      },
      {
        "name": "Honorarios Claros",
        "desc": "Tabela detalhada apresentada na primeira reunião."
      }
    ],
    "faq": [
      {
        "q": "Atende em flagrante?",
        "a": "Sim, com disponibilidade 24h em casos urgentes."
      }
    ]
  },
  'accountant':{
    "company": "Becker Contabilidade Empresarial",
    "slogan": "Contabilidade consultiva para PMEs que tomam decisão com dados",
    "about": "Escritório contábil com foco em pequenas e médias empresas. Atendimento por contador fixo, demonstrações mensais e suporte à decisão.",
    "segment": "Contabilidade Empresarial",
    "city": "Curitiba",
    "state": "PR",
    "heroStyle": "B",
    "services": [
      {
        "name": "Escrituração Fiscal",
        "desc": "Simples Nacional, Lucro Presumido e Lucro Real."
      },
      {
        "name": "Folha e Rescisão",
        "desc": "Funcionários, pró-labore, FGTS e INSS."
      },
      {
        "name": "BPO Financeiro",
        "desc": "Conciliação, contas a pagar/receber e fluxo de caixa."
      }
    ],
    "differentials": [
      {
        "name": "Contador Fixo",
        "desc": "Você fala sempre com o mesmo contador, não com central."
      },
      {
        "name": "Reunião Trimestral",
        "desc": "Demonstrativo explicado em vídeo ou presencial."
      },
      {
        "name": "Suporte Fiscal",
        "desc": "Resposta em até 24h úteis para qualquer dúvida."
      }
    ],
    "faq": [
      {
        "q": "Atendem MEI?",
        "a": "Não. Atendemos ME e EPP em diante."
      }
    ]
  },
  'broker':{
    "company": "Carlos Andrade — Corretor CRECI/SC 12.345",
    "slogan": "Apartamentos de 2 e 3 dormitórios na Zona Sul de Florianópolis",
    "about": "Corretor especializado em imóveis residenciais na Zona Sul de Florianópolis. Campeche, Joaquina, Lagoa e Ribeirão da Ilha.",
    "segment": "Corretagem Florianópolis",
    "city": "Florianópolis",
    "state": "SC",
    "heroStyle": "F",
    "services": [
      {
        "name": "Compra Assistida",
        "desc": "Seleção de imóveis, visitas e negociação."
      },
      {
        "name": "Venda do seu Imóvel",
        "desc": "Fotografia profissional, tour virtual e anúncios em portais."
      },
      {
        "name": "Aluguel de Temporada",
        "desc": "Administração de aluguel por temporada para proprietários."
      }
    ],
    "differentials": [
      {
        "name": "CRECI Regular",
        "desc": "Inscrição ativa e sem advertências."
      },
      {
        "name": "Tour Virtual 360",
        "desc": "Todos os imóveis visitados com câmera 360."
      },
      {
        "name": "Acompanhamento Jurídico",
        "desc": "Suporte de advogado imobiliário parceiro."
      }
    ],
    "faq": [
      {
        "q": "Cobram para anunciar?",
        "a": "Não. Comissão apenas sobre a venda ou locação efetivada."
      }
    ]
  },
  'trainer':{
    "company": "Personal Trainer Renato Oliveira — CREF 012345",
    "slogan": "Treino periodizado em casa, condomínio ou academia parceira",
    "about": "Personal trainer com 12 anos de experiência em hipertrofia, emagrecimento e reabilitação. Atendimento individual ou em dupla.",
    "segment": "Personal Trainer",
    "city": "São Paulo",
    "state": "SP",
    "heroStyle": "A",
    "services": [
      {
        "name": "Avaliação Física",
        "desc": "Composição corporal, força, mobilidade e cardio."
      },
      {
        "name": "Periodização",
        "desc": "Plano de treino em ciclos de 4 a 12 semanas."
      },
      {
        "name": "Acompanhamento Online",
        "desc": "App de treino com vídeos e check-in semanal."
      }
    ],
    "differentials": [
      {
        "name": "CREF Ativo",
        "desc": "Registro regular no conselho regional."
      },
      {
        "name": "Avaliação Mensal",
        "desc": "Reavaliação periódica para ajuste do plano."
      },
      {
        "name": "Especialização em Reabilitação",
        "desc": "Atendimento pós-cirúrgico com fisioterapeuta parceiro."
      }
    ],
    "faq": [
      {
        "q": "Vocês atendem em casa?",
        "a": "Sim, na região metropolitana de SP. Levo os equipamentos."
      }
    ]
  },
  'consultant':{
    "company": "Rota Estratégica Consultoria",
    "slogan": "Diagnóstico operacional e plano de execução em 90 dias",
    "about": "Consultoria de gestão para PMEs industriais e de serviços. Atuamos com diagnóstico em 2 semanas, plano em 6 e execução assistida em 12.",
    "segment": "Consultoria Empresarial",
    "city": "Rio de Janeiro",
    "state": "RJ",
    "heroStyle": "C",
    "services": [
      {
        "name": "Diagnóstico 360",
        "desc": "Mapeamento de processos, gargalos e oportunidades."
      },
      {
        "name": "Plano de Ação",
        "desc": "Estratégia com cronograma, responsáveis e metas."
      },
      {
        "name": "Execução Assistida",
        "desc": "Sprints quinzenais com reporte executivo."
      }
    ],
    "differentials": [
      {
        "name": "Senioridade",
        "desc": "Sócios com passagem por indústria, varejo e serviços."
      },
      {
        "name": "NDA Pré-contrato",
        "desc": "Sigilo contratual antes mesmo da assinatura."
      },
      {
        "name": "SLA de Resposta",
        "desc": "48h úteis para qualquer demanda do cliente."
      }
    ],
    "faq": [
      {
        "q": "Vocês implantam ERP?",
        "a": "Não. Indicamos e acompanhamos a implementação com parceiro homologado."
      }
    ]
  },
  'autonomo':{
    "company": "Pedro Henrique — Eletricista Autônomo",
    "slogan": "Reparos e instalações elétricas residenciais com nota fiscal",
    "about": "Eletricista autônomo com mais de 15 anos de experiência. Pequenos reparos, troca de fiação e instalação de chuveiros.",
    "segment": "Eletricista Autônomo",
    "city": "Belo Horizonte",
    "state": "MG",
    "heroStyle": "A",
    "services": [
      {
        "name": "Troca de Chuveiro",
        "desc": "Instalação e troca de chuveiros elétricos e eletrônicos."
      },
      {
        "name": "Tomadas e Interruptores",
        "desc": "Instalação, substituição e manutenção."
      },
      {
        "name": "Pequenos Reparos",
        "desc": "Identificação e correção de curtos e quedas de disjuntor."
      }
    ],
    "differentials": [
      {
        "name": "NF Emitida",
        "desc": "Nota fiscal eletrônica em todos os serviços."
      },
      {
        "name": "Orçamento Verbal",
        "desc": "Mande foto/vídeo pelo WhatsApp e receba valor estimado."
      },
      {
        "name": "Sem Surpresa",
        "desc": "Valor combinado antes da execução."
      }
    ],
    "faq": [
      {
        "q": "Atendem apartamento?",
        "a": "Sim, em prédios residenciais e comerciais."
      }
    ]
  }
};

const TEMPLATES = {
  'clinica-premium': {
    id:'clinica-premium', name:'Clínica Premium', segment:'clinica', archetype:'clinica',
    desc:'Site completo para clínicas, consultórios e profissionais da saúde',
    pages:[
      {slug:'/', name:'Home', sections:['header','hero','specialties','about','differentials','team','testimonials','faq','cta','footer']},
      {slug:'/sobre', name:'Sobre', sections:['header','hero-simple','about','team','history','cta','footer']},
      {slug:'/especialidades', name:'Especialidades', sections:['header','hero-simple','specialties','differentials','cta','footer']},
      {slug:'/equipe', name:'Equipe', sections:['header','hero-simple','team','cta','footer']},
      {slug:'/contato', name:'Contato', sections:['header','hero-simple','contact','map','footer']},
      {slug:'/politica-de-privacidade', name:'Política de Privacidade', sections:['header','legal','footer']},
    ],
    needsBlog:false, needsProducts:false, hasTeam:true, hasTestimonials:true, hasFAQ:true, hasGallery:false,
    defaultTheme:{primary:'#0d9488',secondary:'#134e4a',accent:'#06b6d4',style:'elegante'},
  },
  'imobiliaria': {
    id:'imobiliaria', name:'Imobiliária Completa', segment:'imobiliaria', archetype:'imobiliaria',
    desc:'Imobiliárias, corretores e lançamentos',
    pages:[
      {slug:'/', name:'Home', sections:['header','hero','featured-properties','about','differentials','testimonials','cta','footer']},
      {slug:'/imoveis', name:'Imóveis', sections:['header','hero-simple','property-list','cta','footer']},
      {slug:'/sobre', name:'Sobre', sections:['header','hero-simple','about','team','cta','footer']},
      {slug:'/corretores', name:'Corretores', sections:['header','hero-simple','team','cta','footer']},
      {slug:'/contato', name:'Contato', sections:['header','hero-simple','contact','map','footer']},
    ],
    needsBlog:false, needsProducts:false, hasTeam:true, hasTestimonials:true, hasFAQ:false, hasGallery:true,
    defaultTheme:{primary:'#0f172a',secondary:'#1e293b',accent:'#d4af37',style:'premium'},
  },
  'restaurante': {
    id:'restaurante', name:'Restaurante', segment:'restaurante', archetype:'restaurante',
    desc:'Restaurantes, bares, pizzarias e similares',
    pages:[
      {slug:'/', name:'Home', sections:['header','hero','menu-preview','about','gallery','testimonials','cta','footer']},
      {slug:'/cardapio', name:'Cardápio', sections:['header','hero-simple','menu-full','cta','footer']},
      {slug:'/sobre', name:'Sobre', sections:['header','hero-simple','about','gallery','cta','footer']},
      {slug:'/reservas', name:'Reservas', sections:['header','hero-simple','reservation','contact','footer']},
      {slug:'/contato', name:'Contato', sections:['header','hero-simple','contact','map','footer']},
    ],
    needsBlog:false, needsProducts:false, hasTeam:false, hasTestimonials:true, hasFAQ:false, hasGallery:true,
    defaultTheme:{primary:'#7c2d12',secondary:'#431407',accent:'#f59e0b',style:'elegante'},
  },
  'empresa-corporativa': {
    id:'empresa-corporativa', name:'Empresa Corporativa', segment:'empresa', archetype:'empresa',
    desc:'Empresas, B2B, indústria, tecnologia',
    pages:[
      {slug:'/', name:'Home', sections:['header','hero','services','about','differentials','cases','testimonials','cta','footer']},
      {slug:'/sobre', name:'Sobre', sections:['header','hero-simple','about','team','history','cta','footer']},
      {slug:'/servicos', name:'Serviços', sections:['header','hero-simple','services','differentials','cta','footer']},
      {slug:'/cases', name:'Cases', sections:['header','hero-simple','cases','cta','footer']},
      {slug:'/blog', name:'Blog', sections:['header','hero-simple','blog-list','cta','footer']},
      {slug:'/contato', name:'Contato', sections:['header','hero-simple','contact','map','footer']},
    ],
    needsBlog:true, needsProducts:false, hasTeam:true, hasTestimonials:true, hasFAQ:false, hasGallery:false,
    defaultTheme:{primary:'#1e3a8a',secondary:'#0f172a',accent:'#0ea5e9',style:'corporativo'},
  },
  'servicos-gerais': {
    id:'servicos-gerais', name:'Prestador de Serviços', segment:'servicos', archetype:'servicos',
    desc:'Eletricistas, encanadores, mecânicos, assistência técnica',
    pages:[
      {slug:'/', name:'Home', sections:['header','hero','services','about','differentials','testimonials','faq','cta','footer']},
      {slug:'/servicos', name:'Serviços', sections:['header','hero-simple','services','cta','footer']},
      {slug:'/sobre', name:'Sobre', sections:['header','hero-simple','about','differentials','cta','footer']},
      {slug:'/contato', name:'Contato', sections:['header','hero-simple','contact','footer']},
    ],
    needsBlog:false, needsProducts:false, hasTeam:false, hasTestimonials:true, hasFAQ:true, hasGallery:false,
    defaultTheme:{primary:'#0f172a',secondary:'#334155',accent:'#22c55e',style:'corporativo'},
  },
  'loja-produtos': {
    id:'loja-produtos', name:'Loja / Catálogo', segment:'loja', archetype:'loja',
    desc:'Catálogo de produtos, e-commerce simples, vendas',
    pages:[
      {slug:'/', name:'Home', sections:['header','hero','products-featured','differentials','about','testimonials','cta','footer']},
      {slug:'/produtos', name:'Produtos', sections:['header','hero-simple','product-list','cta','footer']},
      {slug:'/sobre', name:'Sobre', sections:['header','hero-simple','about','cta','footer']},
      {slug:'/contato', name:'Contato', sections:['header','hero-simple','contact','footer']},
    ],
    needsBlog:false, needsProducts:true, hasTeam:false, hasTestimonials:true, hasFAQ:false, hasGallery:false,
    defaultTheme:{primary:'#7c3aed',secondary:'#1e1b4b',accent:'#f59e0b',style:'criativo'},
  },
  'profissional-liberal': {
    id:'profissional-liberal', name:'Profissional Liberal', segment:'profissional', archetype:'profissional',
    desc:'Advogados, contadores, consultores, personal trainers',
    pages:[
      {slug:'/', name:'Home', sections:['header','hero','services','about','differentials','testimonials','faq','cta','footer']},
      {slug:'/sobre', name:'Sobre', sections:['header','hero-simple','about','cta','footer']},
      {slug:'/servicos', name:'Serviços', sections:['header','hero-simple','services','faq','cta','footer']},
      {slug:'/contato', name:'Contato', sections:['header','hero-simple','contact','footer']},
    ],
    needsBlog:false, needsProducts:false, hasTeam:false, hasTestimonials:true, hasFAQ:true, hasGallery:false,
    defaultTheme:{primary:'#0c0a09',secondary:'#44403c',accent:'#d4af37',style:'premium'},
  },
};

const MODEL_TO_TEMPLATE = {
  'corporate':'empresa-corporativa',
  'modern':'empresa-corporativa',
  'premium':'empresa-corporativa',
  'minimal':'empresa-corporativa',
  'local':'servicos-gerais',
  'construction':'empresa-corporativa',
  'clinic':'clinica-premium',
  'realestate':'imobiliaria',
  'services':'servicos-gerais',
  'electrician':'servicos-gerais',
  'plumber':'servicos-gerais',
  'mechanic':'servicos-gerais',
  'techassist':'servicos-gerais',
  'cleaning':'servicos-gerais',
  'agency':'empresa-corporativa',
  'photographer':'profissional-liberal',
  'lp-product':'loja-produtos',
  'offer':'loja-produtos',
  'sales':'loja-produtos',
  'premium-prod':'loja-produtos',
  'catalog':'loja-produtos',
  'local-prod':'loja-produtos',
  'lawyer':'profissional-liberal',
  'accountant':'profissional-liberal',
  'broker':'imobiliaria',
  'trainer':'profissional-liberal',
  'consultant':'profissional-liberal',
  'autonomo':'profissional-liberal',
};

const MODELS = [
  // 28 modelos (catálogo) — secondary + mockLayout para preview distinto
  {id:'corporate',name:'Corporate',cat:'institucional',desc:'Empresa tradicional e sólida',primary:'#1e3a8a',secondary:'#0f172a',accent:'#0ea5e9',style:'corporativo',mockLayout:'split'},
  {id:'modern',name:'Modern Business',cat:'institucional',desc:'Empresa moderna e tecnológica',primary:'#0f172a',secondary:'#1e293b',accent:'#22d3ee',style:'moderno',mockLayout:'magazine'},
  {id:'premium',name:'Premium',cat:'institucional',desc:'Alto padrão e sofisticação',primary:'#0c0a09',secondary:'#1c1917',accent:'#d4af37',style:'premium',mockLayout:'centered'},
  {id:'minimal',name:'Minimal',cat:'institucional',desc:'Design limpo e sofisticado',primary:'#18181b',secondary:'#27272a',accent:'#f59e0b',style:'minimalista',mockLayout:'centered-light'},
  {id:'local',name:'Empresa Local',cat:'institucional',desc:'Negócios regionais',primary:'#15803d',secondary:'#052e16',accent:'#fbbf24',style:'popular',mockLayout:'service-grid'},
  {id:'construction',name:'Construção',cat:'institucional',desc:'Construtoras e arquitetura',primary:'#b45309',secondary:'#451a03',accent:'#facc15',style:'corporativo',mockLayout:'split'},
  {id:'clinic',name:'Clínica',cat:'institucional',desc:'Clínicas e consultórios',primary:'#0d9488',secondary:'#042f2e',accent:'#06b6d4',style:'elegante',mockLayout:'centered-light'},
  {id:'realestate',name:'Imobiliária',cat:'institucional',desc:'Imobiliárias e corretores',primary:'#0f172a',secondary:'#1e293b',accent:'#d4af37',style:'premium',mockLayout:'property'},
  {id:'services',name:'Serviços Gerais',cat:'servicos',desc:'Prestadores diversos',primary:'#0369a1',secondary:'#082f49',accent:'#f59e0b',style:'corporativo',mockLayout:'service-grid'},
  {id:'electrician',name:'Eletricista',cat:'servicos',desc:'Serviços elétricos',primary:'#facc15',secondary:'#713f12',accent:'#0ea5e9',style:'impactante',mockLayout:'split'},
  {id:'plumber',name:'Encanador',cat:'servicos',desc:'Encanamento e hidráulica',primary:'#1d4ed8',secondary:'#172554',accent:'#06b6d4',style:'corporativo',mockLayout:'split'},
  {id:'mechanic',name:'Mecânica',cat:'servicos',desc:'Oficinas e autopeças',primary:'#dc2626',secondary:'#450a0a',accent:'#facc15',style:'impactante',mockLayout:'split-bold'},
  {id:'techassist',name:'Assistência Técnica',cat:'servicos',desc:'Reparos e manutenção',primary:'#0ea5e9',secondary:'#082f49',accent:'#fbbf24',style:'moderno',mockLayout:'service-grid'},
  {id:'cleaning',name:'Limpeza',cat:'servicos',desc:'Limpeza residencial e comercial',primary:'#16a34a',secondary:'#052e16',accent:'#84cc16',style:'popular',mockLayout:'centered-light'},
  {id:'agency',name:'Agência',cat:'servicos',desc:'Agências criativas',primary:'#7c3aed',secondary:'#2e1065',accent:'#ec4899',style:'criativo',mockLayout:'magazine'},
  {id:'photographer',name:'Fotógrafo',cat:'servicos',desc:'Fotógrafos profissionais',primary:'#18181b',secondary:'#000000',accent:'#f59e0b',style:'elegante',mockLayout:'gallery'},
  {id:'lp-product',name:'Landing Page de Produto',cat:'vendas',desc:'Página de produto',primary:'#0f172a',secondary:'#1e293b',accent:'#22c55e',style:'moderno',mockLayout:'product'},
  {id:'offer',name:'Página de Oferta',cat:'vendas',desc:'Oferta com urgência',primary:'#dc2626',secondary:'#450a0a',accent:'#fbbf24',style:'impactante',mockLayout:'split-bold'},
  {id:'sales',name:'Página de Vendas',cat:'vendas',desc:'Página de vendas completa',primary:'#7c3aed',secondary:'#2e1065',accent:'#f59e0b',style:'criativo',mockLayout:'product'},
  {id:'premium-prod',name:'Produto Premium',cat:'vendas',desc:'Produto de alto valor',primary:'#0c0a09',secondary:'#1c1917',accent:'#d4af37',style:'premium',mockLayout:'centered'},
  {id:'catalog',name:'Catálogo',cat:'vendas',desc:'Catálogo de produtos',primary:'#0f172a',secondary:'#1e293b',accent:'#06b6d4',style:'moderno',mockLayout:'product'},
  {id:'local-prod',name:'Produto Local',cat:'vendas',desc:'Produto regional',primary:'#16a34a',secondary:'#052e16',accent:'#f59e0b',style:'popular',mockLayout:'split'},
  {id:'lawyer',name:'Advogado',cat:'profissionais',desc:'Escritórios de advocacia',primary:'#0c0a09',secondary:'#1c1917',accent:'#a16207',style:'premium',mockLayout:'split'},
  {id:'accountant',name:'Contador',cat:'profissionais',desc:'Escritórios contábeis',primary:'#0f766e',secondary:'#042f2e',accent:'#fbbf24',style:'corporativo',mockLayout:'centered-light'},
  {id:'broker',name:'Corretor',cat:'profissionais',desc:'Corretores de imóveis',primary:'#1e3a8a',secondary:'#172554',accent:'#d4af37',style:'corporativo',mockLayout:'property'},
  {id:'trainer',name:'Personal Trainer',cat:'profissionais',desc:'Personal e academias',primary:'#0f172a',secondary:'#1e293b',accent:'#22c55e',style:'moderno',mockLayout:'split-bold'},
  {id:'consultant',name:'Consultor',cat:'profissionais',desc:'Consultoria empresarial',primary:'#1e293b',secondary:'#0f172a',accent:'#0ea5e9',style:'elegante',mockLayout:'magazine'},
  {id:'autonomo',name:'Profissional Autônomo',cat:'profissionais',desc:'Profissionais liberais',primary:'#7c3aed',secondary:'#2e1065',accent:'#f59e0b',style:'criativo',mockLayout:'split'},
];

// Restaurante fica agrupado junto — o array acima já tem 28 modelos do catálogo.

const CATS = [
  {id:'all',name:'Todos'},
  {id:'institucional',name:'Institucional'},
  {id:'servicos',name:'Serviços'},
  {id:'vendas',name:'Vendas'},
  {id:'profissionais',name:'Profissionais'},
];

function catName(c){return{institucional:'Institucional',servicos:'Serviços',vendas:'Vendas',profissionais:'Profissional'}[c]||'Outro'}
