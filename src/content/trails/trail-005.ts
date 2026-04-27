import { TrailConfig } from "@/types/trail-content";

/**
 * Trilha 5 — Curando a Criança Assustada
 * Categoria: Emoções (Premium)
 *
 * Objetivo: Conduzir o paciente ao contato com a criança interior ferida —
 * origem da dependência emocional — e iniciar o processo de reparentalização.
 *
 * Renderer: reflection — pergunta aberta que exige introspecção escrita.
 * A reflexão é o coração desta trilha: sem produção de texto, não há avanço.
 */
export const trail005: TrailConfig = {
  id: 5,
  title: "Curando a Criança Assustada",
  category: "Emoções",
  order: 5,
  isPremium: true,
  audioUrl: "/audio/CURANDO_A_CRIANCA_ASSUSTADA.MP3",
  intro:
    "Toda dependência tem uma história. Por trás do adulto que usa substâncias, existe uma criança que aprendeu que o mundo não é seguro. Esta trilha é o caminho de volta para ela.",
  type: "reflection",
  content: {
    prompt:
      "Feche os olhos por um momento. Imagine-se com 8 anos de idade. O que essa criança mais precisava ouvir que nunca ouviu? O que ela sentia quando estava sozinha? Escreva uma carta para ela — sem julgamentos, com toda a compaixão que você teria por um filho.",
    minWords: 30,
  },
  quizContent: {
    questions: [
      {
        id: "q1",
        text: "A 'criança interior' ferida é associada à dependência porque:",
        options: [
          "Dependíntes químicos são emocionalmente imaturos.",
          "Traumas e necessidades emocionais não atendidas na infância criam padrões de sofrimento que alimentam o ciclo do vício.",
          "A maioria dos dependentes começou a usar na infância.",
          "O cérebro adulto reage como uma criança sob efeito de substâncias."
        ],
        correctIndex: 1,
        explanation: "A dependência frequentemente radica em feridas emocionais da infância. A criança que não foi vista, amada ou protegida adequadamente busca na substância o alívio que nunca recebeu."
      },
      {
        id: "q2",
        text: "O processo de 'reparentalização' consiste em:",
        options: [
          "Reconstruir a relação com os pais biológicos.",
          "Oferecer a si mesmo o cuidado, a validação e a compaixso que a criança interior precisava e não recebeu.",
          "Encontrar novos modelos parentais em grupos de apoio.",
          "Trabalhar os traumas com hipnoterapia regressiva."
        ],
        correctIndex: 1,
        explanation: "Reparentalizar-se é aprender a dar a si mesmo o que faltou: segurança, validação e amor incondicional. É um dos pilares do processo de cura emocional na TCC."
      },
      {
        id: "q3",
        text: "Por que a auto-compaixso é essencial no processo de recuperação?",
        options: [
          "Porque elimina a culpa e a responsabilidade pelas ações passadas.",
          "Porque cria uma nova relação com o sofrimento, substituindo a auto-punição pelo cuidado, reduzindo o gatilho emocional que alimenta o vício.",
          "Porque é mais eficaz do que a terapia clássica.",
          "Porque evita que a pessoa revisit a eventos traumaticos do passado."
        ],
        correctIndex: 1,
        explanation: "A auto-punição e a vergonha são gatilhos potentes de recaida. A auto-compaixso quebra esse ciclo ao criar uma relação mais saudável com o próprio sofrimento."
      }
    ]
  }
};
