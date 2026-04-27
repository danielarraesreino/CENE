import { TrailConfig } from "@/types/trail-content";

/** Trilha 1 — A Gênese do Rei Bebê (tipo: narrative) */
export const trail001: TrailConfig = {
  id: 1,
  title: "A Gênese do Rei Bebê",
  category: "Fundamentos",
  order: 1,
  isPremium: false,
  audioUrl: "/audio/A_GENESE_DO_REI_BEBE.MP3",
  type: "narrative",
  content: {
    stages: [
      {
        id: "womb",
        title: "O Ventre: A Ilusão de Onipotência",
        description:
          "No ventre, o bebê tem todas as suas necessidades atendidas instantaneamente. Esse estado cria a ilusão de que o mundo existe para satisfazê-lo — a semente do 'Rei Bebê'.",
      },
      {
        id: "birth",
        title: "O Trauma do Nascimento",
        description:
          "O nascimento é o primeiro grande trauma: a expulsão do paraíso. O bebê descobre que nem todas as suas necessidades são atendidas imediatamente, gerando frustração.",
      },
      {
        id: "ego",
        title: "O Surgimento do Rei Bebê",
        description:
          "O ego imaturo emerge como defesa: 'O mundo precisa se adequar a mim.' Quando a vida adulta não cumpre essa promessa, a dor se torna insuportável.",
      },
      {
        id: "addiction",
        title: "A Substância como Solução",
        description:
          "A substância psicoativa oferece uma promessa: devolver a sensação de onipotência do ventre. É o atalho para o paraíso perdido — mas com prazo de validade.",
      },
    ],
  },
  quizContent: {
    questions: [
      {
        id: "q1",
        text: "O que representa o 'Rei Bebê' no contexto do programa?",
        options: [
          "Uma pessoa infantil e irresponsável por escolha própria.",
          "Um ego imaturo que acredita que o mundo deve satisfazê-lo imediatamente.",
          "Uma criança real que precisa de cuidados especiais.",
          "Um arquetipo de liderança autoritaria."
        ],
        correctIndex: 1,
        explanation: "O Rei Bebê é a metáfora para o ego imaturo que nunca deixou de exigir satisfação imediata — a semente psicológica da dependência."
      },
      {
        id: "q2",
        text: "O que a substância psicoativa promete, segundo a gênese do Rei Bebê?",
        options: [
          "Alivívio permanente da ansiedade.",
          "Integração social e popularidade.",
          "Devolver a sensação de onipotência vivida no ventre.",
          "Controle emocional sobre situações difíceis."
        ],
        correctIndex: 2,
        explanation: "A substância é o 'atalho para o paraíso perdido' — uma promessa falsa de devolver o estado de plenitude onipotente do período intra-uterino."
      },
      {
        id: "q3",
        text: "Qual foi o 'primeiro grande trauma' descrito no conteúdo?",
        options: [
          "A primeira experência com drogas.",
          "O afastamento da família na adolescência.",
          "O nascimento e a expulsão do período de plena satisfação.",
          "A primeira rejeição social na escola."
        ],
        correctIndex: 2,
        explanation: "O nascimento é a primeira grande frustração: a descober ta de que nem todas as necessidades serão atendidas imediatamente — o início do conflito entre desejo e realidade."
      }
    ]
  }
};
