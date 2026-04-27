import { TrailConfig } from "@/types/trail-content";

/** Trilha 4 — O Ponto de Ruptura (Rendição) — tipo: resistance */
export const trail004: TrailConfig = {
  id: 4,
  title: "O Ponto de Ruptura (Rendição)",
  category: "Fundamentos",
  order: 4,
  isPremium: false,
  audioUrl: "/audio/PONTO_DE_RUPTURA.MP3",
  type: "resistance",
  content: {
    wallLabel: "Orgulho do Rei Bebê",
    wallHitSteps: 4,
    phases: [
      {
        id: "exaustao",
        title: "Cansado de Estar Farto",
        body: "O estilo de vida do Rei Bebê exige tudo no mesmo instante. Você está exausto de tentar levar a melhor em tudo. O pânico provocado pela sensação de nó no estômago se torna um medo devastador.",
        ctaLabel: "Admitir que não aguenta mais",
      },
      {
        id: "derrota",
        title: "A Muralha do Ego",
        body: "O ego imaturo insiste: \"Posso fazer sozinho\". Mas do seu jeito nunca funcionou. Golpeie a negação para encarar a realidade.",
        ctaLabel: "\"Do meu jeito não funcionou. Eu admito a derrota.\"",
      },
      {
        id: "rendicao",
        title: "Nós Somos Capazes",
        body: "A forma de escapar da ratoeira é mudar o pensamento: \"Eu não sou capaz, NÓS somos capazes\". Antes de fazer o Primeiro Passo, o Rei Bebê precisa confiar: Se outros são capazes, eu também sou.",
        ctaLabel: "Aceitar Ajuda e Concluir",
      },
    ],
  },
  quizContent: {
    questions: [
      {
        id: "q1",
        text: "O que é a 'rendição' no contexto da recuperação?",
        options: [
          "Desistir da luta e aceitar o vício como parte da vida.",
          "Reconhecer que o caminho próprio não funcionou e aceitar ajuda externa.",
          "Ceder à pressão social para usar a substância.",
          "Parar abruptamente sem apoio profissional."
        ],
        correctIndex: 1,
        explanation: "Rendição é a virágem do ego: reconhecer que 'do meu jeito nunca funcionou' e abrir mão do controle ilusionado para aceitar suporte real."
      },
      {
        id: "q2",
        text: "O ego imaturo do Rei Bebê bloqueia a recuperação ao afirmar:",
        options: [
          "'Preciso de ajuda profissional imediatamente.'",
          "'Estou pronto para mudar meus comportamentos.'",
          "'Posso fazer sozinho — não preciso de ninguém.'",
          "'O grupo de apoio é fundamental para minha recuperação.'"
        ],
        correctIndex: 2,
        explanation: "A ilusão de autossuficiência é a muralha mais resistente do ego. 'Do meu jeito nunca funcionou' é a chave para quebrá-la."
      },
      {
        id: "q3",
        text: "A sentença 'NÓS somos capazes' representa:",
        options: [
          "A transferência de responsabilidade para o grupo.",
          "A mudança de uma mentalidade individualista e onipotente para uma de comunidade.",
          "A dependência emocional de outras pessoas.",
          "Um mecanismo de defesa coletivo."
        ],
        correctIndex: 1,
        explanation: "A passagem do 'eu' para o 'nós' é o ponto de ruptura do narcisismo do Rei Bebê — a base sobre a qual a recuperação sustentável é construída."
      }
    ]
  }
};
