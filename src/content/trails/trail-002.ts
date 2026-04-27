import { TrailConfig } from "@/types/trail-content";

/** Trilha 2 — Máscaras e Mitos da Personalidade (tipo: myth_reveal) */
export const trail002: TrailConfig = {
  id: 2,
  title: "Máscaras e Mitos da Personalidade",
  category: "Fundamentos",
  order: 2,
  isPremium: false,
  audioUrl: "/audio/MASCARAS_E_MITOS.MP3",
  type: "myth_reveal",
  content: {
    revealAll: true,
    myths: [
      {
        id: "myth-control",
        title: "Mito do Controle",
        description: "\"Eu consigo controlar quando quiser. Só não quero parar agora.\"",
        truth: "A dependência química é uma doença neurobiológica. O controle voluntário sobre o uso foi perdido desde que a dependência se instalou.",
        endGame: "A ilusão do controle impede a busca por tratamento até o fundo do poço.",
      },
      {
        id: "myth-willpower",
        title: "Mito da Força de Vontade",
        description: "\"É só ter força de vontade. Quem larga é porque quer.\"",
        truth: "A dependência altera o córtex pré-frontal — a sede da vontade. Pedir força de vontade a um dependente é como pedir a um cego que veja mais forte.",
        endGame: "Culpa e vergonha bloqueiam o pedido de ajuda e alimentam o ciclo de uso.",
      },
      {
        id: "myth-bottom",
        title: "Mito do Fundo do Poço",
        description: "\"Ele precisa chegar ao fundo antes de mudar.\"",
        truth: "Intervenções precoces têm melhores prognósticos. O 'fundo do poço' pode ser a morte. A mudança é possível em qualquer estágio.",
        endGame: "A família aguarda enquanto o familiar se deteriora, perdendo janelas de tratamento.",
      },
      {
        id: "myth-weakness",
        title: "Mito do Fraco de Caráter",
        description: "\"Dependente químico é fraco, sem caráter, sem moral.\"",
        truth: "A dependência afeta pessoas de todas as classes, profissões e personalidades. É uma doença, não uma falha moral.",
        endGame: "Estigma impede que profissionais, líderes e figuras públicas busquem ajuda.",
      },
    ],
  },
  quizContent: {
    questions: [
      {
        id: "q1",
        text: "Segundo a ciência, a dependência química é:",
        options: [
          "Uma escolha moral e um sinal de fraqueza de caráter.",
          "Um problema de vontade que pode ser resolvido com disciplina.",
          "Uma doença neurobiológica que altera o córtex pré-frontal.",
          "Um comportamento aprendido que pode ser desaprendido facilmente."
        ],
        correctIndex: 2,
        explanation: "A dependência é uma doença que altera a estrutura e a função cerebral — especialmente o córtex pré-frontal, responsável pela tomada de decisões e controle de impulsos."
      },
      {
        id: "q2",
        text: "O 'Mito do Fundo do Poço' afirma que:",
        options: [
          "O tratamento deve começar antes que a pessoa reconheça o problema.",
          "A pessoa precisa chegar ao pior momento antes de aceitar ajuda.",
          "Intervir cedo piora o prognóstico do tratamento.",
          "O fámilia deve se afastar para não reforçar o comportamento."
        ],
        correctIndex: 1,
        explanation: "Este é um mito perigoso. Intervenções precoces têm melhores prognósticos. O 'fundo do poço' pode ser a morte."
      },
      {
        id: "q3",
        text: "Por que o estigma social impede a recuperação?",
        options: [
          "Porque torna o tratamento mais caro e menos acessível.",
          "Porque reduz a autoestima e motivação para buscar ajuda.",
          "Porque profissionais e líderes têm medo de prejudicar a reputação ao buscar tratamento.",
          "As duas anteriores são corretas."
        ],
        correctIndex: 3,
        explanation: "O estigma atua em múltiplas camadas: reduz a autoestima do dependente E impede que pessoas em posições de visibilidade busquem ajuda por medo de julgamento social."
      }
    ]
  }
};
