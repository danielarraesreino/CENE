import { TrailConfig } from "@/types/trail-content";

/**
 * Trilha 7 — Gestão de Recaída e Manutenção
 * Categoria: Recaída (Premium)
 *
 * Objetivo: Desmistificar a recaída como "fim do mundo" e capacitar o
 * paciente com um protocolo claro de resposta e retomada. Esta é a trilha
 * de conclusão — ao terminar o quiz com aprovação, o certificado é gerado.
 *
 * Renderer: interactive — usa o componente Trail7Interactive para a aba Estudar.
 * Aba Avaliar usa o quizContent abaixo.
 */
export const trail007: TrailConfig = {
  id: 7,
  title: "Gestão de Recaída e Manutenção",
  category: "Recaída",
  order: 7,
  isPremium: true,
  audioUrl: "/audio/GESTAO_DE_RECAIDA.MP3",
  intro:
    "Recaída não é derrota — é dados. É uma informação valiosa sobre o que ainda precisa ser trabalhado. Esta trilha finaliza sua jornada com os protocolos de resposta e o Plano de Manutenção da Sobriedade.",
  type: "interactive",
  content: {
    // Conteúdo exibido pelo Trail7Interactive (Rádio Stinking Thinking, Radar de Recaída, Plano de Manutenção)
    // O engine delega para Trail7Interactive via type='interactive' + id=7
    stages: []
  },
  quizContent: {
    passingScore: 70,
    questions: [
      {
        id: "q1-recaida-definicao",
        text: "De acordo com o modelo do REIBB, a recaída começa:",
        options: [
          "No momento em que a substância é usada pela primeira vez após a abstinência.",
          "Dias ou semanas antes do uso, com mudanças sutis de pensamento e comportamento.",
          "Apenas quando há uma situação de alto risco externa (festa, pressão social).",
          "Quando a pessoa abandona o grupo de apoio.",
        ],
        correctIndex: 1,
        explanation:
          "Correto. A recaída é um processo, não um evento. Começa com pensamentos como 'estou curado, posso controlar', seguidos de isolamento e abandono gradual do programa antes do uso acontecer.",
      },
      {
        id: "q2-primeiros-30-min",
        text: "Nos primeiros 30 minutos após uma recaída, a ação mais importante é:",
        options: [
          "Esconder o que aconteceu para não decepcionar a família.",
          "Continuar usando para 'aproveitar' já que 'estragou tudo'.",
          "Acionar o Plano de Segurança: ligar para o padrinho, terapeuta ou CVV (188).",
          "Fazer uma análise racional dos erros cometidos nas últimas semanas.",
        ],
        correctIndex: 2,
        explanation:
          "Correto. O pensamento 'já que errei, vou errar mais' é a armadilha do efeito de violação da abstinência (EVA). O protocolo é interromper o ciclo imediatamente acionando a rede de suporte.",
      },
      {
        id: "q3-gatilho-har",
        text: "A sigla HAR (ou HALT em inglês) representa os estados que aumentam o risco de recaída. HAR significa:",
        options: [
          "Histeria, Agitação, Raiva",
          "Humilhado, Agredido, Rejeitado",
          "Faminto (Hungry), Ansioso/Solitário (Anxious/Lonely), Cansado (Tired)",
          "Hábito, Automatismo, Recaída",
        ],
        correctIndex: 2,
        explanation:
          "Correto. HAR/HALT são estados fisiológicos e emocionais que reduzem drasticamente a capacidade de resistir a gatilhos. Monitorar esses estados diariamente é parte essencial do Plano de Manutenção.",
      },
      {
        id: "q4-manutencao",
        text: "O que diferencia a fase de 'Manutenção' da fase de 'Ação' na recuperação?",
        options: [
          "Na Manutenção, a pessoa não precisa mais de suporte profissional.",
          "Na Manutenção, o foco muda de parar de usar para construir uma vida que valha a pena ser vivida.",
          "A Manutenção é quando a pessoa já está curada e pode usar socialmente.",
          "Na fase de Ação, o suporte é intenso; na Manutenção, tudo é automático.",
        ],
        correctIndex: 1,
        explanation:
          "Correto. A Manutenção é o trabalho de longo prazo: construir propósito, relações saudáveis e identidade além da sobriedade. É quando se passa de 'não usar' para 'querer uma vida diferente'.",
      },
      {
        id: "q5-projeto-vida",
        text: "Por que o 'Projeto de Vida' é considerado o principal fator protetivo contra a recaída a longo prazo?",
        options: [
          "Porque ocupa o tempo livre e não deixa espaço para pensar em usar.",
          "Porque cria metas financeiras que motivam a sobriedade.",
          "Porque substitui a substância por uma visão de futuro significativa — a sobriedade deixa de ser uma privação e passa a ser uma escolha por algo maior.",
          "Porque é exigido pelo programa de 12 passos para concluir o processo.",
        ],
        correctIndex: 2,
        explanation:
          "Correto. A neurociência confirma: o cérebro dependente precisa de um substituto para a dopamina da substância. Um projeto de vida com propósito real ativa os mesmos circuitos de recompensa de forma saudável.",
      },
    ],
  },
};
