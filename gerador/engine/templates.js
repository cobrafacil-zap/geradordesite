/* ==========================================================================
   TEMPLATES — Define a estrutura de páginas/seções por segmento
   ========================================================================== */

// MODEL_PRESETS — copy distinto por modelo (slogan, about, serviços, etc.)
// São templates editáveis do segmento — não inventam números/certificações.
// Cada modelo ganha um heroStyle (A..G) que o site-generator usa para escolher layout.
// `company` é um nome sugerido para o usuário editar — nunca fica vazio.
const MODEL_PRESETS = {
  'corporate':{
    company:'Grupo Sólida',
    slogan:'Estrutura sólida para empresas que pensam no longo prazo',
    about:'Atuamos com metodologia, governança e processos maduros para entregar resultados consistentes em cada projeto.',
    segment:'Empresarial',city:'São Paulo',state:'SP',
    heroStyle:'A',
    services:[
      {name:'Consultoria Estratégica',desc:'Diagnóstico e plano de ação sob medida para o seu negócio.'},
      {name:'Gestão de Projetos',desc:'Execução com cronograma, marcos e governança.'},
      {name:'Compliance e Riscos',desc:'Adequação às normas e mitigação de riscos operacionais.'},
    ],
    differentials:[
      {name:'Atendimento Personalizado',desc:'Cada cliente recebe um tratamento exclusivo.'},
      {name:'Equipe Qualificada',desc:'Profissionais com experiência e certificação.'},
      {name:'Garantia de Qualidade',desc:'Compromisso com a excelência em todas as entregas.'},
    ],
    faq:[
      {q:'Como funciona o primeiro contato?',a:'Agendamos uma reunião para entender o desafio e propor um diagnóstico.'},
      {q:'Vocês atuam em quais estados?',a:'Atendemos clientes em todo o território nacional.'},
    ],
  },
  'modern':{
    company:'Nexus Digital',
    slogan:'Tecnologia que move o seu negócio para frente',
    about:'Combinamos estratégia, design e engenharia para construir produtos digitais que geram resultado mensurável.',
    segment:'Tecnologia',city:'Florianópolis',state:'SC',
    heroStyle:'C',
    services:[
      {name:'Software Sob Medida',desc:'Aplicações web, mobile e integrações sob medida.'},
      {name:'Cloud e DevOps',desc:'Infraestrutura escalável, monitorada e segura.'},
      {name:'Produtos Digitais',desc:'Do MVP ao produto maduro, com métricas e validação.'},
    ],
    differentials:[
      {name:'Time-to-value curto',desc:'Squads enxutas com iteração rápida e entregas quinzenais.'},
      {name:'Stack moderna',desc:'React, Node, Python, Kubernetes, AWS e as ferramentas mais atuais.'},
      {name:'Segurança por padrão',desc:'Boas práticas de segurança desde a primeira linha de código.'},
    ],
    faq:[
      {q:'Qual o prazo médio?',a:'Depende do escopo, mas normalmente entre 8 e 16 semanas para MVP.'},
      {q:'Vocês fazem manutenção?',a:'Sim, oferecemos planos de evolução contínua após a entrega.'},
    ],
  },
  'premium':{
    company:'Maison Réserve',
    slogan:'Experiências de alto padrão para clientes seletos',
    about:'Cada detalhe é desenhado para refletir exclusividade, sofisticação e a identidade do cliente.',
    segment:'Premium',city:'São Paulo',state:'SP',
    heroStyle:'B',
    services:[
      {name:'Atendimento Concierge',desc:'Acompanhamento dedicado e personalizado.'},
      {name:'Curadoria de Produtos',desc:'Seleção criteriosa das melhores marcas e parceiros.'},
      {name:'Eventos Exclusivos',desc:'Experiências privativas para convidados especiais.'},
    ],
    differentials:[
      {name:'Discrição',desc:'Confidencialidade e respeito à privacidade em todas as relações.'},
      {name:'Curadoria',desc:'Trabalhamos apenas com fornecedores aprovados pelo nosso comitê.'},
      {name:'Raridade',desc:'Acesso a produtos e serviços fora do alcance do público geral.'},
    ],
    faq:[
      {q:'Como é feita a seleção de clientes?',a:'Trabalhamos com agenda limitada para garantir exclusividade.'},
    ],
  },
  'minimal':{
    company:'Estúdio Linha',
    slogan:'Menos é mais. Design que comunica com clareza',
    about:'Projetos limpos, funcionais e sem ruído. Cada elemento tem um propósito claro.',
    segment:'Design',city:'Curitiba',state:'PR',
    heroStyle:'B',
    services:[
      {name:'Branding',desc:'Identidade visual simples, memorável e aplicável.'},
      {name:'Design Digital',desc:'Interfaces claras, rápidas e centradas no usuário.'},
      {name:'Design Editorial',desc:'Materiais impressos e digitais com tipografia apurada.'},
    ],
    differentials:[
      {name:'Clareza',desc:'Comunicação direta, sem rodeios ou excessos.'},
      {name:'Coerência',desc:'Sistemas visuais consistentes em todos os pontos de contato.'},
      {name:'Durabilidade',desc:'Projetos pensados para envelhecer bem.'},
    ],
    faq:[
      {q:'Vocês trabalham com que tipo de cliente?',a:'Empresas e profissionais que valorizam clareza sobre aparência.'},
    ],
  },
  'local':{
    company:'Empório da Vila',
    slogan:'O negócio da sua região com cara de cidade grande',
    about:'Negócios locais com atendimento próximo, agilidade e o profissionalismo que o cliente merece.',
    segment:'Comércio Local',city:'Campinas',state:'SP',
    heroStyle:'E',
    services:[
      {name:'Atendimento Presencial',desc:'Loja física com equipe pronta para atender e tirar dúvidas.'},
      {name:'Entrega Local',desc:'Logística ágil para a sua região com prazos claros.'},
      {name:'WhatsApp Ágil',desc:'Resposta rápida no canal que o cliente já usa.'},
    ],
    differentials:[
      {name:'Proximidade',desc:'Estamos perto, prontos para resolver qualquer questão.'},
      {name:'Agilidade',desc:'Resposta em poucas horas, sem ficar esperando dias.'},
      {name:'Confiança',desc:'Negócio instalado, com endereço fixo e responsabilidade.'},
    ],
    faq:[
      {q:'Vocês entregam para minha cidade?',a:'Atendemos a região metropolitana e cidades vizinhas. Consulte nosso atendimento.'},
    ],
  },
  'construction':{
    company:'Construtora Alicerce',
    slogan:'Da fundação ao acabamento, com qualidade',
    about:'Construção, reforma e arquitetura com equipe própria, cronograma cumprido e acabamento impecável.',
    segment:'Construção',city:'Belo Horizonte',state:'MG',
    heroStyle:'A',
    services:[
      {name:'Construção Civil',desc:'Obras residenciais e comerciais completas, do zero à entrega.'},
      {name:'Reformas',desc:'Modernização de ambientes com planejamento e pouca quebra.'},
      {name:'Projetos Arquitetônicos',desc:'Aprovação em prefeituras e acompanhamento de obra.'},
    ],
    differentials:[
      {name:'Equipe Própria',desc:'Pedreiros, eletricistas e pintores no nosso quadro.'},
      {name:'Cronograma Cumprido',desc:'Comprometimento com prazos em contrato.'},
      {name:'Garantia da Obra',desc:'Cobertura de defeitos após a entrega.'},
    ],
    faq:[
      {q:'Como é feito o orçamento?',a:'Visita técnica sem compromisso com medições detalhadas.'},
    ],
  },
  'clinic':{
    company:'Clínica Vida Plena',
    slogan:'Cuidar de pessoas é a nossa especialidade',
    about:'Atendimento humanizado em saúde, com estrutura completa e profissionais especializados.',
    segment:'Saúde',city:'Rio de Janeiro',state:'RJ',
    heroStyle:'B',
    services:[
      {name:'Consultas Especializadas',desc:'Profissionais com formação e experiência comprovadas.'},
      {name:'Exames',desc:'Equipamentos modernos e laudos rápidos.'},
      {name:'Acompanhamento',desc:'Plano de cuidado contínuo e individualizado.'},
    ],
    differentials:[
      {name:'Atendimento Humanizado',desc:'Paciente no centro, com tempo e escuta qualificada.'},
      {name:'Estrutura Moderna',desc:'Equipamentos atualizados e ambiente confortável.'},
      {name:'Profissionais Especializados',desc:'Equipe com formação em instituições de referência.'},
    ],
    faq:[
      {q:'Vocês atendem convênios?',a:'Atendemos particular e os principais convênios. Consulte nossa recepção.'},
    ],
  },
  'realestate':{
    company:'Imobiliária Raiz',
    slogan:'O imóvel perfeito está mais perto do que você imagina',
    about:'Acompanhamos você em todas as etapas da compra, venda ou aluguel do seu imóvel.',
    segment:'Imóveis',city:'São Paulo',state:'SP',
    heroStyle:'F',
    services:[
      {name:'Compra e Venda',desc:'Assessoria completa do início ao fim da transação.'},
      {name:'Aluguel',desc:'Cadastro de imóveis e análise de fiadores.'},
      {name:'Lançamentos',desc:'Acesso antecipado a empreendimentos exclusivos.'},
    ],
    differentials:[
      {name:'CRECI Regular',desc:'Imobiliária e corretores regulares.'},
      {name:'Equipe Própria',desc:'Corretores especializados por região.'},
      {name:'Acompanhamento Jurídico',desc:'Suporte jurídico em toda a operação.'},
    ],
    faq:[
      {q:'Como funciona a visita?',a:'Agendamento por WhatsApp, visita acompanhada com corretor.'},
    ],
  },
  'services':{
    company:'ServMais Soluções',
    slogan:'Soluções completas para sua casa e empresa',
    about:'Profissionais certificados para resolver desde a manutenção do dia a dia até projetos maiores.',
    segment:'Serviços',city:'Niterói',state:'RJ',
    heroStyle:'E',
    services:[
      {name:'Manutenção Predial',desc:'Reparos gerais com equipe própria.'},
      {name:'Instalações',desc:'Serviços de instalações elétricas, hidráulicas e acabamento.'},
      {name:'Atendimento Emergencial',desc:'Resposta rápida em casos urgentes.'},
    ],
    differentials:[
      {name:'Profissionais Certificados',desc:'Equipe com NR-10, NR-35 e certificações específicas.'},
      {name:'Orçamento Sem Compromisso',desc:'Visita e orçamento sem custo.'},
      {name:'Garantia do Serviço',desc:'Cobertura após a conclusão do trabalho.'},
    ],
    faq:[
      {q:'Vocês emitem NF?',a:'Sim, nota fiscal eletrônica em todos os serviços.'},
    ],
  },
  'electrician':{
    company:'Elétrica Volt Amper',
    slogan:'Energia segura, instalação profissional',
    about:'Serviços elétricos residenciais e comerciais com normas técnicas e equipe certificada.',
    segment:'Eletricidade',city:'Curitiba',state:'PR',
    heroStyle:'A',
    services:[
      {name:'Instalações Elétricas',desc:'Projetos novos, com padrões e normas técnicas.'},
      {name:'Manutenção e Reparos',desc:'Diagnóstico e correção de falhas com rapidez.'},
      {name:'Eficiência Energética',desc:'Troca de iluminação, painéis solares e redução de conta.'},
    ],
    differentials:[
      {name:'NR-10',desc:'Equipe treinada em segurança em instalações elétricas.'},
      {name:'Laudo e ART',desc:'Documentação técnica emitida quando aplicável.'},
      {name:'Atendimento Emergencial',desc:'Resposta rápida em casos de falta de energia ou curto-circuito.'},
    ],
    faq:[
      {q:'Vocês fazem emergência?',a:'Sim, atendemos chamados urgentes com taxa de visita.'},
    ],
  },
  'plumber':{
    company:'Hidro Pró Encanamentos',
    slogan:'Hidráulica sem dor de cabeça, do reparo à reforma',
    about:'Soluções hidráulicas residenciais e comerciais com diagnóstico claro antes de qualquer serviço.',
    segment:'Encanamento',city:'Porto Alegre',state:'RS',
    heroStyle:'A',
    services:[
      {name:'Desentupimento',desc:'Pias, ralos, vasos e colunas com equipamento profissional.'},
      {name:'Reparo de Vazamentos',desc:'Detecção e correção sem quebra desnecessária.'},
      {name:'Instalações Hidráulicas',desc:'Projeto e execução para obras novas e reformas.'},
    ],
    differentials:[
      {name:'Orçamento Antes',desc:'Diagnóstico e valor antes de iniciar o serviço.'},
      {name:'Equipamento Profissional',desc:'Máquinas de desentupimento e detecção eletrônica.'},
      {name:'Garantia do Reparo',desc:'Cobertura sobre o serviço executado.'},
    ],
    faq:[
      {q:'Quanto custa a visita?',a:'A visita técnica tem valor, descontado do orçamento se aprovado.'},
    ],
  },
  'mechanic':{
    company:'Auto Center Confiança',
    slogan:'Seu carro nas mãos certas — diagnóstico honesto',
    about:'Oficina mecânica com diagnóstico detalhado, orçamento claro e peças de procedência.',
    segment:'Automotivo',city:'São Paulo',state:'SP',
    heroStyle:'A',
    services:[
      {name:'Revisão Periódica',desc:'Troca de óleo, filtros, fluidos e checagem geral.'},
      {name:'Motor e Câmbio',desc:'Diagnóstico e reparo com equipamento de ponta.'},
      {name:'Suspensão e Freios',desc:'Alinhamento, balanceamento e sistema de freios.'},
    ],
    differentials:[
      {name:'Orçamento Aprovado',desc:'Iniciamos o serviço só após sua aprovação.'},
      {name:'Peças com Nota',desc:'Peças originais com nota fiscal e garantia de fábrica.'},
      {name:'Diagnóstico por Imagem',desc:'Scanner e análise computadorizada antes de desmontar.'},
    ],
    faq:[
      {q:'Vocês trabalham com todas as marcas?',a:'Atendemos as principais marcas nacionales e importadas.'},
    ],
  },
  'techassist':{
    company:'Fix Cel & Cia',
    slogan:'Conserto rápido com garantia para seus equipamentos',
    about:'Assistência técnica especializada em celulares, notebooks e eletrodomésticos.',
    segment:'Reparos',city:'Recife',state:'PE',
    heroStyle:'E',
    services:[
      {name:'Celulares',desc:'Troca de tela, bateria, conectores e software.'},
      {name:'Notebooks',desc:'Formatação, troca de peças e reparo de placas.'},
      {name:'Eletrodomésticos',desc:'Reparo em geladeiras, máquinas de lavar e micro-ondas.'},
    ],
    differentials:[
      {name:'Diagnóstico em 24h',desc:'Avaliação inicial em até um dia útil.'},
      {name:'Garantia de 90 dias',desc:'Cobertura sobre os serviços e peças trocadas.'},
      {name:'Acompanhamento por OS',desc:'Ordem de serviço com status atualizado.'},
    ],
    faq:[
      {q:'Vale a pena consertar?',a:'Avaliamos tecnicamente e damos parecer honesto antes de qualquer orçamento.'},
    ],
  },
  'cleaning':{
    company:'Brilho Já Limpeza',
    slogan:'Imóvel impecável, atendimento pontual',
    about:'Limpeza residencial e comercial com equipe treinada, produtos profissionais e agendamento flexível.',
    segment:'Limpeza',city:'Goiânia',state:'GO',
    heroStyle:'A',
    services:[
      {name:'Limpeza Residencial',desc:'Faxina completa com atendimento semanal, quinzenal ou mensal.'},
      {name:'Limpeza Comercial',desc:'Condomínios, escritórios e lojas com equipe fixa.'},
      {name:'Pós-obra',desc:'Limpeza pesada após reforma ou mudança.'},
    ],
    differentials:[
      {name:'Equipe Própria',desc:'Profissionais uniformizados, com crachá e treinamento.'},
      {name:'Produtos Profissionais',desc:'Materiais e equipamentos adequados a cada superfície.'},
      {name:'Garantia de Reposição',desc:'Substituição imediata em caso de falta.'},
    ],
    faq:[
      {q:'Vocês fornecem material?',a:'Sim, com produtos profissionais inclusos no orçamento.'},
    ],
  },
  'agency':{
    company:'Agência Faísca',
    slogan:'Criatividade com estratégia que converte',
    about:'Agência criativa focada em resultado. Briefing afiado, conceito forte e entrega no prazo.',
    segment:'Agência',city:'São Paulo',state:'SP',
    heroStyle:'C',
    services:[
      {name:'Campanhas Integradas',desc:'Mídia, conteúdo e performance trabalhando juntos.'},
      {name:'Branding',desc:'Posicionamento, identidade verbal e visual.'},
      {name:'Conteúdo Digital',desc:'Social media, redação publicitária e produção audiovisual.'},
    ],
    differentials:[
      {name:'Time Senior',desc:'Profissionais com passagem por grandes agências.'},
      {name:'Métricas Reais',desc:'Relatórios com números, não impressões.'},
      {name:'Curto Prazo',desc:'Squads pequenas com iteração rápida.'},
    ],
    faq:[
      {q:'Vocês fazem só criação?',a:'Atendemos do estratégico à entrega final, com flexibilidade.'},
    ],
  },
  'photographer':{
    company:'Estúdio Enquadro',
    slogan:'Cada clique conta uma história',
    about:'Fotografia autoral para ensaios, casamentos, marcas e eventos.',
    segment:'Fotografia',city:'Florianópolis',state:'SC',
    heroStyle:'G',
    services:[
      {name:'Ensaio Pessoal',desc:'Retratos em estúdio ou locação, com direção de arte.'},
      {name:'Casamentos',desc:'Cobertura completa do making of à festa.'},
      {name:'Fotografia de Marca',desc:'Produtos, gastronomia, moda e arquitetura.'},
    ],
    differentials:[
      {name:'Direção de Arte',desc:'Planejamento de cenário, luz e figurino.'},
      {name:'Edição Cuidadosa',desc:'Pós-produção com cores calibradas e entrega em alta.'},
      {name:'Garantia de Entrega',desc:'Prazo contratual combinado por escrito.'},
    ],
    faq:[
      {q:'Quantas fotos vêm no pacote?',a:'Depende do serviço. Cada orçamento inclui um quantitativo acordado.'},
    ],
  },
  'lp-product':{
    company:'Produto Aurora',
    slogan:'O produto que faltava para o seu dia a dia',
    about:'Landing page focada em conversão. Um produto, uma decisão, um botão.',
    segment:'E-commerce',city:'São Paulo',state:'SP',
    heroStyle:'D',
    services:[
      {name:'Produto em Destaque',desc:'Apresentação visual completa com benefícios e garantias.'},
      {name:'Prova Social',desc:'Espaço para depoimentos reais de clientes.'},
      {name:'Checkout Direto',desc:'Botão para compra ou contato em poucos cliques.'},
    ],
    differentials:[
      {name:'Carregamento Rápido',desc:'Página otimizada para abrir em menos de 2 segundos.'},
      {name:'Mobile-first',desc:'Pensada primeiro para celular, onde 70% do tráfego está.'},
      {name:'SEO Local',desc:'Estrutura para indexação no Google.'},
    ],
    faq:[
      {q:'Vocês enviam o produto?',a:'Consulte nosso atendimento para logística e prazo.'},
    ],
  },
  'offer':{
    company:'Oferta Relâmpago',
    slogan:'Oferta por tempo limitado. Garanta a sua',
    about:'Página de oferta com contagem regressiva, escassez e CTA único. Foco em conversão rápida.',
    segment:'Vendas',city:'Brasília',state:'DF',
    heroStyle:'A',
    services:[
      {name:'Oferta Completa',desc:'Bônus, garantia e preço destacado.'},
      {name:'Countdown Real',desc:'Timer que se reinicia ao entrar na página.'},
      {name:'FAQ de Objeções',desc:'Respostas para as dúvidas que travam a compra.'},
    ],
    differentials:[
      {name:'Garantia Estendida',desc:'Devolução sem burocracia.'},
      {name:'Frete Grátis',desc:'Para as regiões atendidas.'},
      {name:'Suporte Ágil',desc:'WhatsApp em horário comercial.'},
    ],
    faq:[
      {q:'A oferta é real?',a:'Sim, com regras claras e prazo determinado.'},
    ],
  },
  'sales':{
    company:'Loja Central',
    slogan:'Tudo o que você precisa em um só lugar',
    about:'Página de vendas com vitrine ampla, blocos de benefícios e funil claro do clique à compra.',
    segment:'Loja',city:'São Paulo',state:'SP',
    heroStyle:'D',
    services:[
      {name:'Vitrine Completa',desc:'Catálogo organizado por categorias.'},
      {name:'Selos de Confiança',desc:'Site seguro, política de troca e dados protegidos.'},
      {name:'Múltiplas Formas de Pagamento',desc:'Cartão, PIX, boleto e parcelamento.'},
    ],
    differentials:[
      {name:'Frete Calculado',desc:'Simulador por CEP antes do checkout.'},
      {name:'Troca Facilitada',desc:'Política clara de troca e devolução.'},
      {name:'Atendimento Humano',desc:'WhatsApp para dúvidas pré e pós-venda.'},
    ],
    faq:[
      {q:'Como funciona o frete?',a:'Calculado por CEP e peso. Veja simulador no site.'},
    ],
  },
  'premium-prod':{
    company:'Coleção Atelier',
    slogan:'Produto premium para quem exige o melhor',
    about:'Apresentação sofisticada para produtos de alto valor agregado. Detalhes, especificação e curadoria.',
    segment:'Premium',city:'São Paulo',state:'SP',
    heroStyle:'B',
    services:[
      {name:'Página Premium',desc:'Design minimalista e detalhado.'},
      {name:'Vídeo ou Showcase',desc:'Espaço para mídia em alta resolução.'},
      {name:'Compra Personalizada',desc:'Atendimento via consultores treinados.'},
    ],
    differentials:[
      {name:'Edição Limitada',desc:'Poucas unidades por tiragem.'},
      {name:'Garantia Vitalícia',desc:'Em produtos selecionados.'},
      {name:'Embalagem Especial',desc:'Presenteável por padrão.'},
    ],
    faq:[
      {q:'Vocês têm loja física?',a:'Atendimento por agendamento para apresentar a coleção.'},
    ],
  },
  'catalog':{
    company:'Catálogo Geral',
    slogan:'Catálogo completo para escolher com calma',
    about:'Catálogo extenso de produtos com filtros, busca e categorias bem definidas.',
    segment:'Catálogo',city:'São Paulo',state:'SP',
    heroStyle:'D',
    services:[
      {name:'Catálogo por Categoria',desc:'Organização clara com filtros laterais.'},
      {name:'Especificações Técnicas',desc:'Ficha detalhada em cada produto.'},
      {name:'Carrinho e Cotação',desc:'Cotação por e-mail ou WhatsApp para grandes pedidos.'},
    ],
    differentials:[
      {name:'Estoque Real',desc:'Disponibilidade atualizada.'},
      {name:'Desconto por Volume',desc:'Tabela progressiva para atacado.'},
      {name:'Atendimento Especial',desc:'Consultor dedicado para pedidos acima de X unidades.'},
    ],
    faq:[
      {q:'Vocês vendem no atacado?',a:'Sim, com tabela progressiva por volume.'},
    ],
  },
  'local-prod':{
    company:'Sabor da Roça',
    slogan:'Da nossa região para a sua casa',
    about:'Produtos locais com identidade regional, produção artesanal e procedência rastreada.',
    segment:'Regional',city:'Vitória',state:'ES',
    heroStyle:'A',
    services:[
      {name:'Produção Local',desc:'Feito em pequenas tiragens na nossa região.'},
      {name:'Ingredientes Rastreáveis',desc:'Origem de cada matéria-prima documentada.'},
      {name:'Entrega Refrigerada',desc:'Quando aplicável, com embalagem específica.'},
    ],
    differentials:[
      {name:'Artesanal',desc:'Cada peça feita com cuidado manual.'},
      {name:'Sem Conservantes',desc:'Produção fresca sem aditivos industriais.'},
      {name:'Apoio ao Produtor',desc:'Parte da renda fica na região.'},
    ],
    faq:[
      {q:'Vocês entregam para fora?',a:'Atendemos outras regiões com embalagem adequada.'},
    ],
  },
  'lawyer':{
    company:'Advocacia Pires & Associados',
    slogan:'Defesa técnica com transparência total',
    about:'Escritório de advocacia com atendimento reservado e estratégia clara para cada caso.',
    segment:'Advocacia',city:'São Paulo',state:'SP',
    heroStyle:'A',
    services:[
      {name:'Direito Civil',desc:'Contratos, família, consumidor e responsabilidade civil.'},
      {name:'Direito Trabalhista',desc:'Defesa e propositura de ações trabalhistas.'},
      {name:'Direito Empresarial',desc:'Assessoria preventiva e contencioso para empresas.'},
    ],
    differentials:[
      {name:'Sigilo Profissional',desc:'Atendimento reservado e protegido por lei.'},
      {name:'Honorários Claros',desc:'Tabela de honorários apresentada antes da contratação.'},
      {name:'Atualização Constante',desc:'Equipe em educação permanente.'},
    ],
    faq:[
      {q:'Vocês cobram pela consulta?',a:'Sim, valor acordado previamente e abatido dos honorários.'},
    ],
  },
  'accountant':{
    company:'Contábil Prime',
    slogan:'Contabilidade sem complicação, decisão com clareza',
    about:'Escritório contábil com atendimento próximo, obrigações em dia e relatórios que fazem sentido.',
    segment:'Contábil',city:'Curitiba',state:'PR',
    heroStyle:'B',
    services:[
      {name:'Contabilidade Mensal',desc:'Escrituração, impostos e obrigações fiscais.'},
      {name:'Folha de Pagamento',desc:'Funcionários, encargos e rescisões.'},
      {name:'Abertura e Alteração',desc:'Constituição, alteração e encerramento de empresas.'},
    ],
    differentials:[
      {name:'Atendimento Próximo',desc:'Contador fixo para sua empresa, com WhatsApp direto.'},
      {name:'Relatórios Claros',desc:'Demonstrativos com linguagem acessível.'},
      {name:'Suporte à Decisão',desc:'Análise de cenários para investimentos e fechamentos.'},
    ],
    faq:[
      {q:'Vocês atendem qual regime?',a:'Simples Nacional, Lucro Presumido e Real.'},
    ],
  },
  'broker':{
    company:'Corretor Carlos Andrade',
    slogan:'O corretor que entende o que você procura',
    about:'Corretor de imóveis com carteira CRECI, atendimento personalizado e curadoria de regiões.',
    segment:'Corretagem',city:'Florianópolis',state:'SC',
    heroStyle:'F',
    services:[
      {name:'Compra Assistida',desc:'Acompanhamento em toda a jornada, da escolha ao registro.'},
      {name:'Venda do seu Imóvel',desc:'Marketing, visitas e negociação com estratégia.'},
      {name:'Aluguel',desc:'Cadastro do imóvel e análise de fiadores.'},
    ],
    differentials:[
      {name:'CRECI Regular',desc:'Atuação regular junto ao conselho.'},
      {name:'Acompanhamento Jurídico',desc:'Suporte em toda a parte contratual.'},
      {name:'Tabela de Comissões',desc:'Valores claros e combinados antes do serviço.'},
    ],
    faq:[
      {q:'Vocês cobram para anunciar?',a:'Não, a comissão só incide sobre a venda ou locação efetivada.'},
    ],
  },
  'trainer':{
    company:'Personal Trainer Renato Silva',
    slogan:'Treino personalizado, resultado real',
    about:'Personal trainer com avaliação física, plano periodizado e acompanhamento semanal.',
    segment:'Fitness',city:'São Paulo',state:'SP',
    heroStyle:'A',
    services:[
      {name:'Avaliação Física',desc:'Composição, força, mobilidade e cardio.'},
      {name:'Plano de Treino',desc:'Periodização ajustada a objetivo e rotina.'},
      {name:'Acompanhamento Nutricional',desc:'Parceria com nutricionista para ajustes finos.'},
    ],
    differentials:[
      {name:'CREF Regular',desc:'Profissional regular no conselho de educação física.'},
      {name:'Atendimento Domiciliar',desc:'Na sua casa, condomínio ou academia parceira.'},
      {name:'Avaliação Mensal',desc:'Reavaliação periódica para ajustes.'},
    ],
    faq:[
      {q:'Vocês dão treino online?',a:'Sim, com check-in semanal e vídeos.'},
    ],
  },
  'consultant':{
    company:'Consultoria Rumo Certo',
    slogan:'Diagnóstico claro, plano sob medida',
    about:'Consultoria empresarial com diagnóstico claro, plano executável e acompanhamento de marcos.',
    segment:'Consultoria',city:'Rio de Janeiro',state:'RJ',
    heroStyle:'C',
    services:[
      {name:'Diagnóstico',desc:'Mapeamento de processos, gargalos e oportunidades.'},
      {name:'Plano de Ação',desc:'Estratégia com cronograma, responsáveis e metas.'},
      {name:'Implementação Assistida',desc:'Acompanhamento quinzenal durante a execução.'},
    ],
    differentials:[
      {name:'Senioridade',desc:'Profissionais com vivência em diferentes setores.'},
      {name:'Curto Prazo',desc:'Sprints de 6 a 12 semanas para resultados.'},
      {name:'Transparência',desc:'Reporte executivo semanal.'},
    ],
    faq:[
      {q:'Vocês assinam NDA?',a:'Sim, sigilo contratual desde o primeiro briefing.'},
    ],
  },
  'autonomo':{
    company:'Profissional Especializado',
    slogan:'Atendimento pessoal, profissional e direto',
    about:'Profissional autônomo com agenda flexível, atendimento personalizado e orçamento claro.',
    segment:'Autônomo',city:'Sua cidade',state:'SP',
    heroStyle:'A',
    services:[
      {name:'Atendimento Personalizado',desc:'Trabalho direto com o profissional, sem intermediários.'},
      {name:'Orçamento Claro',desc:'Valor combinado antes do início do serviço.'},
      {name:'Cronograma Comprometido',desc:'Prazos respeitados em contrato.'},
    ],
    differentials:[
      {name:'Contato Direto',desc:'WhatsApp e e-mail direto com o profissional.'},
      {name:'NF Emitida',desc:'Nota fiscal em todos os serviços.'},
      {name:'Garantia',desc:'Cobertura sobre o trabalho executado.'},
    ],
    faq:[
      {q:'Como é feito o orçamento?',a:'Briefing rápido + visita técnica quando necessário.'},
    ],
  },
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
