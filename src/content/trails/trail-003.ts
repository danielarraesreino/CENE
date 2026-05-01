import { TrailConfig } from "@/types/trail-content";

export const trail003: TrailConfig = {
  id: 3,
  title: "O Ciclo Vicioso",
  category: "Fundamentos",
  order: 3,
  audioUrl: "/audio/trilha-003.mp3",
  intro: "Compreenda como a mente dependente entra em loops autodestrutivos e como quebrar esses padrões.",
  type: "interactive",
  content: {
    // Conteúdo exibido pelo Trail3Interactive (componente hardcoded rico)
    // O engine delega para Trail3Interactive via type='interactive' + id=3
    stages: []
  },
  quizContent: {
    questions: [
      {
        id: "q1",
        text: "Os 'Três S' do ciclo vicioso são:",
        options: [
          "Sofrer, Sonhar, Superar.",
          "Sentir, Sofrer, Servir ao vício.",
          "Saber, Sentir, Superar.",
          "Sofrer, Silenciar, Sobreviver."
        ],
        correctIndex: 1,
        explanation: "O ciclo começa no pensamento que gera um sentimento intenso (Sentir), que se transforma em sofrimento (Sofrer) que busca alívio no vício (Servir)."
      },
      {
        id: "q2",
        text: "O que é um 'gatilho' no contexto da dependência?",
        options: [
          "Qualquer situação que cause alegria e bem-estar.",
          "Um evento externo ou interno que inicia o pensamento obsessivo.",
          "O momento exato em que a substância é consumida.",
          "Uma técnica de relaxamento para reduzir a ansíedade."
        ],
        correctIndex: 1,
        explanation: "Gatilhos são estímulos (pessoas, lugares, sentimentos, horários) que ativam automaticamente o desejo pela substância."
      },
      {
        id: "q3",
        text: "A técnica 'Adiar e Substituir' serve para:",
        options: [
          "Eliminar permanentemente o desejo pela substância.",
          "Intervir entre o desejo e a ação, quebrando o automatismo do ciclo.",
          "Substituir uma dependência por outra mais saudável.",
          "Adiar o tratamento até encontrar o momento certo."
        ],
        correctIndex: 1,
        explanation: "O objetivo é criar uma janela de tempo entre a fissura e o consumo — tempo suficiente para que o córtex pré-frontal reassuma o controle."
      }
    ]
  }
};
