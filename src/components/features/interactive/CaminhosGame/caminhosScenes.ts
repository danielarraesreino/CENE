export const caminhosScenes: Record<string, any> = {
  "cena1": {
    "speaker": "Pensamentos",
    "text": "A luz da manhã entra pela janela. Hoje é o dia de começar a oficina no Instituto Padre Haroldo. O cansaço é grande, mas a oportunidade também.",
    "emoji": "🛏️",
    "bgColor": "#1a3050",
    "choices": [
      {
        "text": "Levantar e ir para o Instituto.",
        "resEffect": 5,
        "socEffect": 0,
        "nextScene": "cena2_a"
      },
      {
        "text": "Dormir mais um pouco e ignorar.",
        "resEffect": -10,
        "socEffect": -5,
        "nextScene": "cena2_b"
      }
    ]
  },
  "cena2_a": {
    "speaker": "João",
    "text": "Ei, bom te ver por aqui! A oficina vai começar em 10 minutos. Quer sentar com a gente?",
    "emoji": "🏫",
    "bgColor": "#1e3b2e",
    "choices": [
      {
        "text": "Aceitar a ajuda e sentar com o grupo.",
        "resEffect": 5,
        "socEffect": 10,
        "item": {
          "icon": "🤝",
          "name": "Apoio de Amigo",
          "desc": "Uma conexão importante foi formada."
        },
        "nextScene": "cena3_a"
      },
      {
        "text": "Agradecer, mas sentar isolado no fundo.",
        "resEffect": 0,
        "socEffect": -5,
        "nextScene": "cena3_b"
      }
    ]
  },
  "cena2_b": {
    "speaker": "Coordenadora",
    "text": "Você chegou bem tarde hoje. Quase perdeu a vaga na oficina. Tudo bem com você?",
    "emoji": "🏫",
    "bgColor": "#3b1e1e",
    "choices": [
      {
        "text": "Pedir desculpas e explicar a dificuldade.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena3_a"
      },
      {
        "text": "Dar uma desculpa qualquer e se isolar.",
        "resEffect": -5,
        "socEffect": -10,
        "nextScene": "cena3_b"
      }
    ]
  },
  "cena3_a": {
    "speaker": "Narrador",
    "text": "Ao interagir com o grupo, você percebeu que não está sozinho. A oficina foi produtiva e a sensação de pertencimento trouxe um novo ânimo.",
    "emoji": "✨",
    "bgColor": "#1e3b50",
    "choices": [
      {
        "text": "Continuar a jornada com foco.",
        "resEffect": 10,
        "socEffect": 5,
        "item": {
          "icon": "📜",
          "name": "Certificado Inicial",
          "desc": "Primeiro passo na oficina."
        },
        "nextScene": "cena4"
      }
    ]
  },
  "cena3_b": {
    "speaker": "Narrador",
    "text": "O isolamento fez o dia parecer mais longo e difícil. A oficina passou, mas você não conseguiu absorver muito. A resiliência foi testada.",
    "emoji": "🌧️",
    "bgColor": "#2a3b4a",
    "choices": [
      {
        "text": "Tentar melhorar no dia seguinte.",
        "resEffect": -5,
        "socEffect": 0,
        "nextScene": "cena4"
      }
    ]
  },
  "cena4": {
    "speaker": "Narrador",
    "text": "A Almoço no Refeitório flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "🍽️",
    "bgColor": "#3b3a1e",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena5"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena5"
      }
    ]
  },
  "cena5": {
    "speaker": "Narrador",
    "text": "Na Oficina de Panificação, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "🥖",
    "bgColor": "#3b1e1e",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena6"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena6"
      }
    ]
  },
  "cena6": {
    "speaker": "Narrador",
    "text": "Durante a Jardinagem Comunitária, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "🌻",
    "bgColor": "#1e3b1e",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena7"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena7"
      }
    ]
  },
  "cena7": {
    "speaker": "Narrador",
    "text": "A Oficina de Informática flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "💻",
    "bgColor": "#1a3050",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena8"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena8"
      }
    ]
  },
  "cena8": {
    "speaker": "Narrador",
    "text": "Na Roda de Conversa, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "🗣️",
    "bgColor": "#1e3b2e",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena9"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena9"
      }
    ]
  },
  "cena9": {
    "speaker": "Narrador",
    "text": "Durante a Atividade Esportiva, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "⚽",
    "bgColor": "#3b2a1e",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena10"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena10"
      }
    ]
  },
  "cena10": {
    "speaker": "Narrador",
    "text": "A Sessão com Assistente Social flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "📋",
    "bgColor": "#2a1e3b",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena11",
        "item": {
          "icon": "⭐",
          "name": "Destaque em Sessão com Assistente Social",
          "desc": "Reconhecimento pelo esforço."
        }
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena11"
      }
    ]
  },
  "cena11": {
    "speaker": "Narrador",
    "text": "Na Almoço no Refeitório, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "🍽️",
    "bgColor": "#3b3a1e",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena12"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena12"
      }
    ]
  },
  "cena12": {
    "speaker": "Narrador",
    "text": "Durante a Oficina de Panificação, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "🥖",
    "bgColor": "#3b1e1e",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena13"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena13"
      }
    ]
  },
  "cena13": {
    "speaker": "Narrador",
    "text": "A Jardinagem Comunitária flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "🌻",
    "bgColor": "#1e3b1e",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena14"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena14"
      }
    ]
  },
  "cena14": {
    "speaker": "Narrador",
    "text": "Na Oficina de Informática, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "💻",
    "bgColor": "#1a3050",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena15"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena15"
      }
    ]
  },
  "cena15": {
    "speaker": "Narrador",
    "text": "Durante a Roda de Conversa, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "🗣️",
    "bgColor": "#1e3b2e",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena16"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena16"
      }
    ]
  },
  "cena16": {
    "speaker": "Narrador",
    "text": "A Atividade Esportiva flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "⚽",
    "bgColor": "#3b2a1e",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena17"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena17"
      }
    ]
  },
  "cena17": {
    "speaker": "Narrador",
    "text": "Na Sessão com Assistente Social, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "📋",
    "bgColor": "#2a1e3b",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena18"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena18"
      }
    ]
  },
  "cena18": {
    "speaker": "Narrador",
    "text": "Durante a Almoço no Refeitório, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "🍽️",
    "bgColor": "#3b3a1e",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena19"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena19"
      }
    ]
  },
  "cena19": {
    "speaker": "Narrador",
    "text": "A Oficina de Panificação flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "🥖",
    "bgColor": "#3b1e1e",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena20"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena20"
      }
    ]
  },
  "cena20": {
    "speaker": "Narrador",
    "text": "Na Jardinagem Comunitária, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "🌻",
    "bgColor": "#1e3b1e",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena21"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena21"
      }
    ]
  },
  "cena21": {
    "speaker": "Narrador",
    "text": "Durante a Oficina de Informática, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "💻",
    "bgColor": "#1a3050",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena22"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena22"
      }
    ]
  },
  "cena22": {
    "speaker": "Narrador",
    "text": "A Roda de Conversa flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "🗣️",
    "bgColor": "#1e3b2e",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena23"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena23"
      }
    ]
  },
  "cena23": {
    "speaker": "Narrador",
    "text": "Na Atividade Esportiva, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "⚽",
    "bgColor": "#3b2a1e",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena24"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena24"
      }
    ]
  },
  "cena24": {
    "speaker": "Narrador",
    "text": "Durante a Sessão com Assistente Social, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "📋",
    "bgColor": "#2a1e3b",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena25"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena25"
      }
    ]
  },
  "cena25": {
    "speaker": "Narrador",
    "text": "A Almoço no Refeitório flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "🍽️",
    "bgColor": "#3b3a1e",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena26",
        "item": {
          "icon": "⭐",
          "name": "Destaque em Almoço no Refeitório",
          "desc": "Reconhecimento pelo esforço."
        }
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena26"
      }
    ]
  },
  "cena26": {
    "speaker": "Narrador",
    "text": "Na Oficina de Panificação, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "🥖",
    "bgColor": "#3b1e1e",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena27"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena27"
      }
    ]
  },
  "cena27": {
    "speaker": "Narrador",
    "text": "Durante a Jardinagem Comunitária, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "🌻",
    "bgColor": "#1e3b1e",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena28"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena28"
      }
    ]
  },
  "cena28": {
    "speaker": "Narrador",
    "text": "A Oficina de Informática flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "💻",
    "bgColor": "#1a3050",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena29"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena29"
      }
    ]
  },
  "cena29": {
    "speaker": "Narrador",
    "text": "Na Roda de Conversa, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "🗣️",
    "bgColor": "#1e3b2e",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena30"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena30"
      }
    ]
  },
  "cena30": {
    "speaker": "Narrador",
    "text": "Durante a Atividade Esportiva, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "⚽",
    "bgColor": "#3b2a1e",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena31"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena31"
      }
    ]
  },
  "cena31": {
    "speaker": "Narrador",
    "text": "A Sessão com Assistente Social flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "📋",
    "bgColor": "#2a1e3b",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena32"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena32"
      }
    ]
  },
  "cena32": {
    "speaker": "Narrador",
    "text": "Na Almoço no Refeitório, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "🍽️",
    "bgColor": "#3b3a1e",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena33"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena33"
      }
    ]
  },
  "cena33": {
    "speaker": "Narrador",
    "text": "Durante a Oficina de Panificação, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "🥖",
    "bgColor": "#3b1e1e",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena34"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena34"
      }
    ]
  },
  "cena34": {
    "speaker": "Narrador",
    "text": "A Jardinagem Comunitária flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "🌻",
    "bgColor": "#1e3b1e",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena35"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena35"
      }
    ]
  },
  "cena35": {
    "speaker": "Narrador",
    "text": "Na Oficina de Informática, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "💻",
    "bgColor": "#1a3050",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena36"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena36"
      }
    ]
  },
  "cena36": {
    "speaker": "Narrador",
    "text": "Durante a Roda de Conversa, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "🗣️",
    "bgColor": "#1e3b2e",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena37"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena37"
      }
    ]
  },
  "cena37": {
    "speaker": "Narrador",
    "text": "A Atividade Esportiva flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "⚽",
    "bgColor": "#3b2a1e",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena38"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena38"
      }
    ]
  },
  "cena38": {
    "speaker": "Narrador",
    "text": "Na Sessão com Assistente Social, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "📋",
    "bgColor": "#2a1e3b",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena39"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena39"
      }
    ]
  },
  "cena39": {
    "speaker": "Narrador",
    "text": "Durante a Almoço no Refeitório, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "🍽️",
    "bgColor": "#3b3a1e",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena40"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena40"
      }
    ]
  },
  "cena40": {
    "speaker": "Narrador",
    "text": "A Oficina de Panificação flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "🥖",
    "bgColor": "#3b1e1e",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena41",
        "item": {
          "icon": "⭐",
          "name": "Destaque em Oficina de Panificação",
          "desc": "Reconhecimento pelo esforço."
        }
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena41"
      }
    ]
  },
  "cena41": {
    "speaker": "Narrador",
    "text": "Na Jardinagem Comunitária, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "🌻",
    "bgColor": "#1e3b1e",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena42"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena42"
      }
    ]
  },
  "cena42": {
    "speaker": "Narrador",
    "text": "Durante a Oficina de Informática, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "💻",
    "bgColor": "#1a3050",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena43"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena43"
      }
    ]
  },
  "cena43": {
    "speaker": "Narrador",
    "text": "A Roda de Conversa flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "🗣️",
    "bgColor": "#1e3b2e",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena44"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena44"
      }
    ]
  },
  "cena44": {
    "speaker": "Narrador",
    "text": "Na Atividade Esportiva, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "⚽",
    "bgColor": "#3b2a1e",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena45"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena45"
      }
    ]
  },
  "cena45": {
    "speaker": "Narrador",
    "text": "Durante a Sessão com Assistente Social, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "📋",
    "bgColor": "#2a1e3b",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena46"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena46"
      }
    ]
  },
  "cena46": {
    "speaker": "Narrador",
    "text": "A Almoço no Refeitório flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "🍽️",
    "bgColor": "#3b3a1e",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena47"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena47"
      }
    ]
  },
  "cena47": {
    "speaker": "Narrador",
    "text": "Na Oficina de Panificação, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "🥖",
    "bgColor": "#3b1e1e",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena48"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena48"
      }
    ]
  },
  "cena48": {
    "speaker": "Narrador",
    "text": "Durante a Jardinagem Comunitária, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "🌻",
    "bgColor": "#1e3b1e",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena49"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena49"
      }
    ]
  },
  "cena49": {
    "speaker": "Narrador",
    "text": "A Oficina de Informática flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "💻",
    "bgColor": "#1a3050",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena50"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena50"
      }
    ]
  },
  "cena50": {
    "speaker": "Narrador",
    "text": "Na Roda de Conversa, alguém faz um comentário que te chateia um pouco. Como você reage?",
    "emoji": "🗣️",
    "bgColor": "#1e3b2e",
    "choices": [
      {
        "text": "Respirar fundo e ignorar a provocação.",
        "resEffect": 10,
        "socEffect": 0,
        "nextScene": "cena51"
      },
      {
        "text": "Discutir com a pessoa.",
        "resEffect": -10,
        "socEffect": -10,
        "nextScene": "cena51"
      }
    ]
  },
  "cena51": {
    "speaker": "Narrador",
    "text": "Durante a Atividade Esportiva, você se depara com um desafio técnico. Você tenta resolver, mas a frustração começa a aparecer.",
    "emoji": "⚽",
    "bgColor": "#3b2a1e",
    "choices": [
      {
        "text": "Pedir ajuda a um colega.",
        "resEffect": 5,
        "socEffect": 5,
        "nextScene": "cena52"
      },
      {
        "text": "Tentar resolver sozinho e se irritar.",
        "resEffect": -5,
        "socEffect": -2,
        "nextScene": "cena52"
      }
    ]
  },
  "cena52": {
    "speaker": "Narrador",
    "text": "A Sessão com Assistente Social flui muito bem hoje. Você até ajudou um colega que estava com dificuldades.",
    "emoji": "📋",
    "bgColor": "#2a1e3b",
    "choices": [
      {
        "text": "Ficar feliz pela colaboração.",
        "resEffect": 5,
        "socEffect": 10,
        "nextScene": "cena53"
      },
      {
        "text": "Focar no seu próprio trabalho depois.",
        "resEffect": 2,
        "socEffect": 0,
        "nextScene": "cena53"
      }
    ]
  },
  "cena53": {
    "speaker": "Diretor do Instituto",
    "text": "Você chegou ao fim desta etapa da jornada. Olhando para trás, viu o quanto evoluiu. Estamos orgulhosos.",
    "emoji": "🎓",
    "bgColor": "#1a3050",
    "choices": [
      {
        "text": "Receber o diploma final.",
        "resEffect": 20,
        "socEffect": 20,
        "item": {
          "icon": "🎓",
          "name": "Diploma de Superação",
          "desc": "A prova da sua resiliência."
        },
        "nextScene": null
      }
    ]
  }
};