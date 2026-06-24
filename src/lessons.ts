import type { Lang } from "./i18n";

export interface Example {
  setup: { fr: string; en: string };
  punch: { fr: string; en: string };
  // the dissection — why it works, keyed to this lesson's mechanic
  why: { fr: string; en: string };
}

export interface Lesson {
  id: string;
  emoji: string;
  title: { fr: string; en: string };
  oneLiner: { fr: string; en: string };
  body: { fr: string[]; en: string[] }; // paragraphs
  example: Example;
  tryThis: { fr: string; en: string }; // a small exercise prompt
}

export function L(l: Lesson, key: "title" | "oneLiner", lang: Lang): string {
  return l[key][lang];
}

export const LESSONS: Lesson[] = [
  {
    id: "setup-punch",
    emoji: "🎯",
    title: { fr: "Setup pis chute", en: "Setup & punchline" },
    oneLiner: {
      fr: "Le mot drôle s'en va à la FIN. Toujours.",
      en: "The funny word goes LAST. Always.",
    },
    body: {
      fr: [
        "Une joke, c'est deux temps : le setup installe une attente, la chute la fait dérailler. Le setup ne doit jamais être drôle — il doit être clair. Garde le rire pour la fin.",
        "La règle d'or : le mot le plus drôle, le mot qui surprend, est le DERNIER mot de la phrase. Dès que tu mets un mot après lui, tu écrases le rire. La salle rit sur un silence — donne-lui le silence.",
        "Test rapide : lis ta joke à voix haute. Sur quel mot la salle rirait ? Si c'est pas le dernier, ré-écris jusqu'à ce qu'il le devienne.",
      ],
      en: [
        "A joke has two beats: the setup builds an expectation, the punchline derails it. The setup should never be funny — it should be clear. Save the laugh for the end.",
        "The golden rule: the funniest word, the surprise word, is the LAST word of the line. The second you put a word after it, you smother the laugh. The room laughs into silence — give them the silence.",
        "Quick test: read your joke out loud. On which word would the room laugh? If it's not the last one, rewrite until it is.",
      ],
    },
    example: {
      setup: {
        fr: "J'ai dit à mon médecin que je me brisais partout où je me touchais.",
        en: "I told my doctor I break everywhere I touch myself.",
      },
      punch: {
        fr: "Il m'a dit : « T'as un doigt cassé. »",
        en: "He said: \"You've got a broken finger.\"",
      },
      why: {
        fr: "Le mot « cassé » arrive en dernier — la révélation tombe pile sur le silence. Mets « cassé » au milieu (« T'as un doigt cassé, mon gars ») et le rire s'écrase sur « mon gars ».",
        en: "The word \"finger\" / \"broken\" lands last — the reveal hits right on the silence. Bury it (\"You've got a broken finger, buddy\") and the laugh dies on \"buddy.\"",
      },
    },
    tryThis: {
      fr: "Prends une de tes jokes. Trouve le mot drôle. Ré-écris pour qu'il soit le dernier mot.",
      en: "Take one of your jokes. Find the funny word. Rewrite so it's the last word.",
    },
  },
  {
    id: "misdirection",
    emoji: "↪️",
    title: { fr: "La fausse piste (le « turn »)", en: "Misdirection (the turn)" },
    oneLiner: {
      fr: "Fais-les penser à A, livre B.",
      en: "Make them think A, deliver B.",
    },
    body: {
      fr: [
        "Le rire vient de la surprise — d'un sens caché qui contredit celui qu'on attendait. Le setup doit pointer FORT dans une direction pour que la chute puisse virer ailleurs.",
        "Le « turn », c'est le point de bascule. Un bon setup a deux interprétations possibles : tu pousses la salle vers la plate, pis tu révèles l'absurde. Plus la première lecture est évidente, plus le turn frappe.",
        "Piège classique : un setup qui annonce déjà la chute. Si on voit venir le coup, y'a pas de surprise, y'a pas de rire.",
      ],
      en: [
        "Laughter comes from surprise — a hidden meaning that contradicts the one you expected. The setup must point HARD in one direction so the punchline can swerve somewhere else.",
        "The turn is the pivot. A good setup has two possible readings: you steer the room toward the boring one, then reveal the absurd one. The more obvious the first reading, the harder the turn hits.",
        "Classic trap: a setup that telegraphs its own punchline. If they see it coming, there's no surprise, no laugh.",
      ],
    },
    example: {
      setup: {
        fr: "Ma femme m'a demandé d'aller chercher six pintes de lait, pis si y'avait des œufs, d'en prendre une douzaine.",
        en: "My wife told me to grab six pints of milk, and if they had eggs, to get a dozen.",
      },
      punch: {
        fr: "Je suis revenu avec douze pintes de lait. « Y'avaient des œufs. »",
        en: "I came home with twelve pints of milk. \"They had eggs.\"",
      },
      why: {
        fr: "On lit « une douzaine » comme « douze œufs ». Le turn révèle une seconde lecture logique — absurde mais grammaticalement valide. La fausse piste était dans nos têtes tout du long.",
        en: "We read \"a dozen\" as \"a dozen eggs.\" The turn reveals a second, technically-valid reading. The misdirection was in our own heads the whole time.",
      },
    },
    tryThis: {
      fr: "Écris un setup avec deux sens. Cache le sens absurde jusqu'au dernier mot.",
      en: "Write a setup with two meanings. Hide the absurd one until the last word.",
    },
  },
  {
    id: "rule-of-three",
    emoji: "3️⃣",
    title: { fr: "La règle de trois", en: "The rule of three" },
    oneLiner: {
      fr: "Deux pour le motif, le troisième pour le casser.",
      en: "Two to set the pattern, the third to break it.",
    },
    body: {
      fr: [
        "Le cerveau adore les motifs. Deux exemples qui vont ensemble créent une attente ; le troisième doit la trahir. C'est la structure de joke la plus fiable qui existe.",
        "Les deux premiers items doivent être plausibles et de même registre. Le troisième fait le turn — plus petit, plus gros, ou complètement à côté. L'écart entre les deux premiers pis le dernier, c'est le rire.",
        "Garde le plus drôle pour la troisième position. Jamais la première (tu gâches le motif), jamais la deuxième (tu fais traîner).",
      ],
      en: [
        "The brain loves patterns. Two items that belong together create an expectation; the third must betray it. It's the most reliable joke structure there is.",
        "The first two items should be plausible and in the same register. The third makes the turn — smaller, bigger, or wildly off. The gap between the first two and the last is the laugh.",
        "Keep the funniest in the third slot. Never first (you spoil the pattern), never second (you stall).",
      ],
    },
    example: {
      setup: {
        fr: "Pour réussir dans la vie, ça prend trois choses :",
        en: "To succeed in life, you need three things:",
      },
      punch: {
        fr: "de la discipline, de la patience, pis quelqu'un d'autre qui fait la discipline pis la patience.",
        en: "discipline, patience, and someone else to do the discipline and the patience.",
      },
      why: {
        fr: "« Discipline » pis « patience » installent un motif sérieux. Le troisième item le démolit en restant dans la même grammaire de liste. Le mot drôle (« la patience ») tombe en dernier.",
        en: "\"Discipline\" and \"patience\" set a sincere pattern. The third item demolishes it while keeping the same list grammar. The funny beat lands last.",
      },
    },
    tryThis: {
      fr: "Liste deux choses vraies pis sérieuses sur un sujet. Casse le motif avec une troisième absurde.",
      en: "List two true, sincere things about a topic. Break the pattern with an absurd third.",
    },
  },
  {
    id: "the-game",
    emoji: "🎲",
    title: { fr: "Le « game » de la joke", en: "The game of the joke" },
    oneLiner: {
      fr: "Trouve LA chose absurde — pis monte-la.",
      en: "Find the ONE absurd thing — then heighten it.",
    },
    body: {
      fr: [
        "Le concept le plus important de l'écriture comique : le « game ». C'est la seule chose illogique ou inattendue dans ta prémisse. Une joke a UN game, pas trois.",
        "Une fois le game trouvé, tu le répètes en l'escaladant : tu le rends plus extrême, plus précis, plus conséquent. Chaque nouvelle ligne, c'est le même game « heighté » d'un cran. C'est comme ça qu'un one-liner devient un bit de trois minutes.",
        "Si tu ris pas à la deuxième ligne, c'est souvent que t'as changé de game au lieu de monter le premier. Reste sur ta seule idée folle.",
      ],
      en: [
        "The single most important idea in comedy writing: the game. It's the one illogical or unexpected thing in your premise. A joke has ONE game, not three.",
        "Once you've found the game, you repeat it by escalating: make it more extreme, more specific, with bigger consequences. Each new line is the same game heightened a notch. That's how a one-liner becomes a three-minute bit.",
        "If the second line doesn't land, usually it's because you switched games instead of heightening the first. Stay on your one crazy idea.",
      ],
    },
    example: {
      setup: {
        fr: "Game : mon chat se comporte comme un colocataire qui paie pas son loyer.",
        en: "Game: my cat behaves like a roommate who doesn't pay rent.",
      },
      punch: {
        fr: "Heighten : il dort le jour, mange ma bouffe la nuit, pis quand je rentre il me regarde comme si c'était MOI le visiteur.",
        en: "Heighten: sleeps all day, eats my food at night, and when I come home he looks at me like I'M the guest.",
      },
      why: {
        fr: "Un seul game (le chat-coloc) monté de trois crans : horaire, bouffe, autorité sur le territoire. On change jamais d'idée, on l'escalade.",
        en: "One game (cat-as-deadbeat-roommate) heightened three notches: schedule, food, territorial authority. We never change the idea, we escalate it.",
      },
    },
    tryThis: {
      fr: "Nomme le game d'une de tes prémisses en une phrase. Écris trois lignes qui le montent.",
      en: "Name the game of one of your premises in a sentence. Write three lines that heighten it.",
    },
  },
  {
    id: "specificity",
    emoji: "🔬",
    title: { fr: "La précision", en: "Specificity" },
    oneLiner: {
      fr: "Le concret est drôle. L'abstrait, jamais.",
      en: "Concrete is funny. Abstract never is.",
    },
    body: {
      fr: [
        "« Un char » n'est pas drôle. « Une Tercel 1997 avec une porte d'une autre couleur » l'est. Le détail précis crée une image, pis une image crée la complicité — on voit exactement ce que tu vois.",
        "La spécificité signale aussi que tu parles de quelque chose de vrai, de vécu. Le public fait plus confiance au comique qui nomme la marque, la rue, l'heure exacte.",
        "Remplace chaque mot générique par le plus précis qui reste vrai. « De la nourriture » → « un Pogo réchauffé au micro-ondes ». Le rire est dans le Pogo.",
      ],
      en: [
        "\"A car\" isn't funny. \"A 1997 Tercel with one mismatched door\" is. The precise detail builds an image, and an image builds complicity — we see exactly what you see.",
        "Specificity also signals you're talking about something real, lived. Audiences trust the comic who names the brand, the street, the exact time.",
        "Replace every generic word with the most specific one that's still true. \"Some food\" → \"a microwaved corn dog.\" The laugh is in the corn dog.",
      ],
    },
    example: {
      setup: {
        fr: "Faible : « Mon oncle est weird avec son argent. »",
        en: "Weak: \"My uncle is weird about money.\"",
      },
      punch: {
        fr: "Fort : « Mon oncle réutilise le papier d'aluminium pis garde le change exact dans des pots Mason étiquetés par année. »",
        en: "Strong: \"My uncle reuses tinfoil and keeps exact change in Mason jars labelled by year.\"",
      },
      why: {
        fr: "Les détails (papier d'alu, pots Mason, étiquetés par année) transforment un trait vague en personnage qu'on voit. Chaque détail est une petite chute en soi.",
        en: "The details (tinfoil, Mason jars, labelled by year) turn a vague trait into a character we can see. Each detail is a tiny punchline of its own.",
      },
    },
    tryThis: {
      fr: "Prends une joke « correcte ». Remplace trois mots génériques par des détails précis pis vrais.",
      en: "Take an okay joke. Replace three generic words with specific, true details.",
    },
  },
  {
    id: "act-out",
    emoji: "🎭",
    title: { fr: "L'act-out", en: "The act-out" },
    oneLiner: {
      fr: "Montre, joue-le — au lieu de le raconter.",
      en: "Show it, perform it — don't narrate it.",
    },
    body: {
      fr: [
        "Un act-out, c'est quand tu ARRÊTES de raconter pis que tu DEVIENS le personnage : sa voix, son visage, son corps. « Pis là il était fâché » est plate. Devenir le gars fâché pendant trois secondes, ça tue.",
        "Le public rit deux fois : une fois pour la reconnaissance (« je connais ce gars-là »), une fois pour l'engagement physique. Un bon act-out vaut trois punchlines verbales.",
        "Sur papier, écris l'act-out comme une réplique entre guillemets, avec une note de jeu. C'est ta chute physique — place-la à la fin du beat.",
      ],
      en: [
        "An act-out is when you STOP narrating and BECOME the character: their voice, their face, their body. \"And then he got mad\" is flat. Becoming the angry guy for three seconds kills.",
        "The audience laughs twice: once for recognition (\"I know that guy\"), once for the physical commitment. A good act-out is worth three verbal punchlines.",
        "On paper, write the act-out as a line in quotes with a performance note. It's your physical punchline — put it at the end of the beat.",
      ],
    },
    example: {
      setup: {
        fr: "Mon père qui essaie de comprendre son cellulaire :",
        en: "My dad trying to figure out his phone:",
      },
      punch: {
        fr: "[le tenir à bout de bras, plisser les yeux, crier] « POURQUOI ÇA M'ENVOIE À LA MÉTÉO ?! »",
        en: "[hold it at arm's length, squint, shout] \"WHY IS IT TAKING ME TO THE WEATHER?!\"",
      },
      why: {
        fr: "La chute n'est pas une phrase drôle — c'est une INCARNATION. La voix pis la posture font la moitié du travail. Note bien le geste : c'est lui qui déclenche le rire.",
        en: "The punchline isn't a clever line — it's an embodiment. Voice and posture do half the work. Note the gesture: that's what triggers the laugh.",
      },
    },
    tryThis: {
      fr: "Trouve un moment où tu « racontes » une personne. Ré-écris-le comme une réplique que tu JOUES.",
      en: "Find a moment where you narrate a person. Rewrite it as a line you PERFORM.",
    },
  },
  {
    id: "callbacks",
    emoji: "🔁",
    title: { fr: "Le callback", en: "The callback" },
    oneLiner: {
      fr: "Ramène une vieille joke — gratis, le rire est déjà payé.",
      en: "Bring back an old joke — the laugh's already paid for.",
    },
    body: {
      fr: [
        "Un callback, c'est référer à une joke d'avant dans ton set, au moment où on s'y attend le moins. Le public a déjà ri de l'original ; le ramener leur donne le plaisir d'être dans le club.",
        "Le meilleur callback se fait à la toute fin, comme bouton final. Il soude ton set en un seul objet — d'un coup ça avait l'air planifié, intelligent, complet.",
        "Règle : choisis pour callback ta ligne la plus distinctive (une image précise, un mot bizarre). Plus elle est unique, plus le rappel est satisfaisant.",
      ],
      en: [
        "A callback is referencing an earlier joke in your set at the moment they least expect it. The audience already laughed at the original; bringing it back gives them the pleasure of being in the club.",
        "The best callback comes at the very end, as the final button. It welds your set into one object — suddenly it all looks planned, smart, complete.",
        "Rule: pick your most distinctive line to call back (a precise image, a weird word). The more unique it is, the more satisfying the recall.",
      ],
    },
    example: {
      setup: {
        fr: "[plus tôt : le bit sur l'oncle pis ses pots Mason] … [trois jokes plus tard, sujet totalement différent : les rencontres en ligne]",
        en: "[earlier: the bit about uncle and his Mason jars] … [three jokes later, totally different topic: online dating]",
      },
      punch: {
        fr: "« … pis son profil disait qu'il cherchait quelqu'un de stable. Mon oncle aussi est stable. Il a du change de 1997. »",
        en: "\"… his profile said he wanted someone stable. My uncle's stable too. He's got change from 1997.\"",
      },
      why: {
        fr: "On ramène un détail précis (« 1997 », « le change ») dans un contexte neuf. Le rire vient de la reconnaissance — pas besoin de re-setup, c'est déjà investi.",
        en: "We bring a specific detail (\"1997,\" \"the change\") into a fresh context. The laugh comes from recognition — no need to re-setup, it's already invested.",
      },
    },
    tryThis: {
      fr: "Repère la ligne la plus précise de ton set. Trouve un endroit plus loin pour la ramener.",
      en: "Spot the most specific line in your set. Find a later spot to bring it back.",
    },
  },
  {
    id: "tags",
    emoji: "🏷️",
    title: { fr: "Les tags", en: "Tags" },
    oneLiner: {
      fr: "Une chute, plusieurs rires — sans re-setup.",
      en: "One punchline, several laughs — no re-setup.",
    },
    body: {
      fr: [
        "Un tag, c'est une punchline supplémentaire qui s'accroche à la première SANS nouveau setup. Tu viens de faire rire ; au lieu de passer à autre chose, tu presses le même citron une fois de plus.",
        "Les tags fonctionnent parce que le contexte est encore chaud. Chaque tag doit escalader — un angle plus extrême ou plus précis sur la même image. Trois bons tags transforment une joke en avalanche.",
        "Place ton tag le plus fort en dernier (encore la règle de trois). Si un tag fait moins rire que la ligne d'avant, coupe-le.",
      ],
      en: [
        "A tag is an extra punchline that hooks onto the first one WITHOUT a new setup. You just got a laugh; instead of moving on, you squeeze the same lemon once more.",
        "Tags work because the context is still warm. Each tag should escalate — a more extreme or specific angle on the same image. Three good tags turn a joke into an avalanche.",
        "Put your strongest tag last (rule of three again). If a tag gets less than the line before it, cut it.",
      ],
    },
    example: {
      setup: {
        fr: "Mon gym a un panneau « pas de jugement ». [chute] C'est là que j'ai compris qu'ils m'avaient déjà jugé.",
        en: "My gym has a \"no judgement\" sign. [punch] That's how I knew they'd already judged me.",
      },
      punch: {
        fr: "[tag 1] Ils ont mis le panneau à MA hauteur. [tag 2] En braille, au cas où je serais aussi gêné qu'aveugle.",
        en: "[tag 1] They hung the sign at MY eye level. [tag 2] In braille, in case I was as embarrassed as I was blind.",
      },
      why: {
        fr: "Aucun nouveau setup : chaque tag presse la même idée (le gym me juge) un cran plus loin. Le dernier tag, le plus absurde, ferme le beat.",
        en: "No new setup: each tag presses the same idea (the gym judges me) one notch further. The last, most absurd tag closes the beat.",
      },
    },
    tryThis: {
      fr: "Prends une de tes chutes qui marche. Écris 3 tags qui escaladent sans re-setup.",
      en: "Take a punchline that works. Write 3 tags that escalate without a new setup.",
    },
  },
  {
    id: "persona",
    emoji: "🕴️",
    title: { fr: "La persona (le POV)", en: "Persona (your POV)" },
    oneLiner: {
      fr: "C'est pas QUOI tu dis, c'est QUI le dit.",
      en: "It's not WHAT you say, it's WHO's saying it.",
    },
    body: {
      fr: [
        "La même phrase est drôle ou plate selon qui la dit. Ta persona, c'est l'attitude constante derrière toutes tes jokes : le perdant lucide, l'arrogant délirant, l'anxieux, le naïf, le vieux tanné. Choisis-en une pis défends-la.",
        "Le POV donne un angle automatique à n'importe quel sujet. Avant d'écrire sur quelque chose, demande : « comment MON personnage voit ça ? » Le filtre fait la moitié du travail.",
        "La cohérence paie : quand la salle connaît ta persona, elle rit AVANT la chute, juste à anticiper comment TU vas réagir.",
      ],
      en: [
        "The same line is funny or flat depending on who says it. Your persona is the constant attitude behind all your jokes: the lucid loser, the deluded egomaniac, the anxious one, the naïf, the tired old-timer. Pick one and commit.",
        "POV gives you an automatic angle on any subject. Before writing about anything, ask: \"how does MY character see this?\" The filter does half the work.",
        "Consistency pays: once the room knows your persona, they laugh BEFORE the punchline, just anticipating how YOU'll react.",
      ],
    },
    example: {
      setup: {
        fr: "Sujet neutre : « Le camping. » POV de l'anxieux urbain :",
        en: "Neutral topic: \"Camping.\" POV of the anxious city person:",
      },
      punch: {
        fr: "« Le camping, c'est payer pour vivre comme un sans-abri, mais avec une date de retour pis aucune des compétences de survie. »",
        en: "\"Camping is paying to live like you're homeless, but with a return date and none of the survival skills.\"",
      },
      why: {
        fr: "La joke vient pas du camping — elle vient du PERSONNAGE qui le voit comme une menace gérée. Change la persona (le gars de bois fier) pis la même prémisse donne une autre joke.",
        en: "The joke isn't about camping — it's about the CHARACTER who sees it as a managed threat. Swap the persona (proud outdoorsman) and the same premise yields a different joke.",
      },
    },
    tryThis: {
      fr: "Décris ta persona en 3 mots. Ré-écris une vieille joke depuis CE point de vue.",
      en: "Describe your persona in 3 words. Rewrite an old joke from THAT point of view.",
    },
  },
  {
    id: "brevity",
    emoji: "✂️",
    title: { fr: "La brièveté", en: "Brevity" },
    oneLiner: {
      fr: "Coupe tout ce qui retarde le rire.",
      en: "Cut everything that delays the laugh.",
    },
    body: {
      fr: [
        "Chaque mot inutile dans le setup est un mot entre la salle pis le rire. Le « word economy » est la dernière passe de tout bon auteur : enlève les articles de trop, les « pis là », les explications, les seconds adjectifs.",
        "Le danger n'est pas d'être trop court — c'est d'enterrer la chute sous du contexte. Si une info ne sert pas DIRECTEMENT le turn, coupe-la. La salle remplit les trous mieux que toi.",
        "Test final : peux-tu enlever un mot sans casser la joke ? Si oui, c'est déjà fait. Recommence jusqu'à ce que rien ne bouge.",
      ],
      en: [
        "Every unnecessary word in the setup is a word between the room and the laugh. Word economy is every good writer's last pass: kill the extra articles, the \"and so,\" the explanations, the second adjectives.",
        "The danger isn't being too short — it's burying the punchline under context. If a piece of info doesn't DIRECTLY serve the turn, cut it. The room fills the gaps better than you can.",
        "Final test: can you remove a word without breaking the joke? If yes, it's already gone. Repeat until nothing moves.",
      ],
    },
    example: {
      setup: {
        fr: "Avant : « L'autre jour je marchais dans la rue pis j'ai vu un gars qui essayait vraiment fort de stationner son gros char dans un p'tit espace. »",
        en: "Before: \"The other day I was walking down the street and I saw a guy really trying hard to park his big car in a small spot.\"",
      },
      punch: {
        fr: "Après : « J'ai vu un gars stationner son char comme s'il négociait une prise d'otages. »",
        en: "After: \"I watched a guy park like he was negotiating a hostage situation.\"",
      },
      why: {
        fr: "On coupe le décor (« l'autre jour », « dans la rue ») pour foncer sur l'image. La version courte a UNE idée nette, le mot drôle (« otages ») en dernier. Moins de mots, plus de rire.",
        en: "We cut the scenery (\"the other day,\" \"down the street\") and drive straight at the image. The short version has ONE clean idea, the funny word last. Fewer words, bigger laugh.",
      },
    },
    tryThis: {
      fr: "Prends ta joke la plus longue. Coupe-la de moitié sans perdre la chute.",
      en: "Take your longest joke. Cut it in half without losing the punch.",
    },
  },
];
