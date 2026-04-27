import { TrailConfig } from "@/types/trail-content";

/**
 * Trilha 6 — Ferramentas de Reconstrução do Eu
 * Categoria: Emoções (Premium)
 *
 * Objetivo: Apresentar e internalizar as ferramentas práticas de TCC para
 * construção de uma nova identidade — do "Rei Bebê" ao "Adulto Responsável".
 *
 * Renderer: resistance — o usuário literalmente "quebra" as paredes dos
 * mecanismos de defesa que impedem a mudança. Cada fase é uma ferramenta
 * diferente sendo assimilada contra uma resistência interna diferente.
 */
export const trail006: TrailConfig = {
  id: 6,
  title: "Ferramentas de Reconstrução do Eu",
  category: "Emoções",
  order: 6,
  isPremium: true,
  audioUrl: "/audio/FERRAMENTAS_DE_RECONSTRUCAO.MP3",
  intro:
    "Conhecer a doença é metade do caminho. A outra metade é equipar-se. Cada ferramenta abaixo é uma chave para desmontar o Rei Bebê e erguer o adulto que você sempre foi capaz de ser.",
  type: "resistance",
  content: {
    wallLabel: "Mecanismos de Defesa do Ego",
    wallHitSteps: 5,
    phases: [
      {
        id: "registro-rpd",
        title: "Ferramenta 1: O Registro de Pensamentos (RPD)",
        body: "Pensamentos automáticos disfuncionais disparam o ciclo do vício. O RPD é o bisturi da TCC: identifique o pensamento, questione a evidência, substitua pela realidade. 'Preciso usar para aguentar esse dia' → 'Já aguentei dias difíceis sem usar. Posso usar outras estratégias.'",
        ctaLabel: "Entendi o RPD. Próxima ferramenta.",
      },
      {
        id: "diario-gatilhos",
        title: "Ferramenta 2: O Diário de Gatilhos",
        body: "Nenhuma fissura surge do nada. Sempre há um gatilho: uma pessoa, um lugar, um sentimento, um horário. Mapear os seus gatilhos pessoais é a diferença entre ser surpreendido e estar preparado.",
        ctaLabel: "Vou começar a mapear meus gatilhos.",
      },
      {
        id: "plano-seguranca",
        title: "Ferramenta 3: O Plano de Segurança",
        body: "Escrever o plano em momentos de clareza, para usar em momentos de crise. Inclui: quem ligar, o que fazer nos primeiros 30 minutos, quais técnicas funcionam para você. A memória falha sob pressão — o plano não.",
        ctaLabel: "Meu plano de segurança está ativo.",
      },
      {
        id: "projeto-vida",
        title: "Ferramenta 4: O Projeto de Vida",
        body: "A sobriedade precisa de um motivo maior que o medo. O Projeto de Vida é a visão de quem você quer ser em 1, 5 e 10 anos — nas 7 áreas fundamentais: saúde, família, trabalho, espiritualidade, lazer, finanças e comunidade.",
        ctaLabel: "Meu projeto de vida começa hoje.",
      },
      {
        id: "comunidade",
        title: "Ferramenta 5: A Comunidade Terapêutica",
        body: "O ego do Rei Bebê diz 'não preciso de ninguém'. A recuperação prova o contrário. Grupos de apoio, padrinho/madrinha, terapia e família comprometida formam a rede que sustenta a mudança quando a força individual falha.",
        ctaLabel: "Não estou sozinho. Aceito suporte.",
      },
    ],
  },
  quizContent: {
    questions: [
      {
        id: "q1",
        text: "O Registro de Pensamentos (RPD) é uma ferramenta de TCC que serve para:",
        options: [
          "Registrar todos os pensamentos do dia em um diário.",
          "Identificar, questionar e substituir pensamentos automáticos disfuncionais.",
          "Monitorar o humor e a qualidade do sono.",
          "Documentar os episódios de uso para apresentar ao terapeuta."
        ],
        correctIndex: 1,
        explanation: "O RPD é o 'bisturi' da TCC: identifique o pensamento disfuncional → questione a evidência real → substitua por uma resposta mais realista e saudável."
      },
      {
        id: "q2",
        text: "Por que um Plano de Segurança deve ser escrito em momentos de clareza?",
        options: [
          "Para que a família possa acessá-lo sem depender do paciente.",
          "Porque em momentos de crise a memória e a capacidade de decisão ficam comprometidas.",
          "Para que o terapeuta possa revisar e aprovar o plano.",
          "Porque a lei exige documentação clínica assinada."
        ],
        correctIndex: 1,
        explanation: "Sob pressão emocional intensa, o córtex pré-frontal (responsável pela tomada de decisões) fica prejudicado. Um plano pré-escrito funciona como uma 'memória externa' quando a própria falha."
      },
      {
        id: "q3",
        text: "As 7 áreas do Projeto de Vida incluem:",
        options: [
          "Saúde, Família, Trabalho, Espiritualidade, Lazer, Finanças e Comunidade.",
          "Saúde, Educação, Esporte, Arte, Lazer, Finanças e Religiosíade.",
          "Corpo, Mente, Espírito, Relações, Trabalho, Sonhos e Propósito.",
          "Abatinência, Estabilidade, Relações, Propósito, Saúde, Comunidade e Fé."
        ],
        correctIndex: 0,
        explanation: "O Projeto de Vida no modelo REIBB cobre as 7 dimensões fundamentais da existência humana. O equilíbrio entre elas cria uma vida que vale a pena ser vivida — o melhor protetor contra a recaída."
      }
    ]
  }
};
