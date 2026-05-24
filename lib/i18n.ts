export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      services: "Services",
      skills: "Compétences",
      portfolio: "Portfolio",
      team: "Équipe",
      contact: "Contact",
      cta: "Discuter du projet",
    },
    hero: {
      eyebrow: "Là où la créativité rencontre l'intelligence.",
      title: "On code, on design, on pense en PhiBrain.",
      description:
        "Agence tech qui conçoit des produits numériques où le design, l'intelligence artificielle et l'ingénierie travaillent ensemble — pas l'un contre l'autre.",
      cta1: "Démarrer un projet",
      cta2: "Voir nos réalisations",
    },
    slider: {
      phrases: [
        "On transforme vos idées en code.",
        "Du premier croquis au déploiement.",
        "Une marque qui se reconnaît partout.",
        "Chaque pixel a une raison d'être.",
        "Le futur, on le construit maintenant.",
        "L'ingénierie au service de l'ambition.",
      ],
    },
    services: {
      eyebrow: "Services",
      title: "Ce que PhiBrain fabrique",
      description:
        "Du premier croquis au déploiement en production, une équipe pluridisciplinaire qui prend en charge l'ensemble du cycle produit.",
    },
    skills: {
      eyebrow: "Compétences",
      title: "Une stack complète.",
      description: "Du pixel au serveur, on maîtrise chaque couche.",
    },
    stats: {
      eyebrow: "Statistiques",
      title1: "Chaque ligne compilée.",
      title2: "Chaque pixel justifié.",
      description:
        "Quatre ans à transformer des idées en produits qui existent vraiment.",
      items: [
        "Projets livrés",
        "Apps mobiles",
        "Sites web",
        "Identités & designs",
      ],
    },
    portfolio: {
      eyebrow: "Portfolio",
      title1: "Quelques projets livrés",
      title2: "récemment",
      filters: ["Tous", "Apps", "Design", "Sites"],
    },
    team: {
      eyebrow: "Équipe",
      title1: "Les cerveaux derrière",
      title2: "PhiBrain",
      expanding: "Équipe en expansion",
      expandingDesc:
        "Notre équipe est en pleine expansion — nous recrutons designers, mobile engineers et back-end developers. Envie de nous rejoindre ?",
      joinBtn: "Rejoindre l'équipe",
    },
    testimonials: {
      eyebrow: "Témoignages",
      title: "Ils nous ont fait confiance",
    },
    contact: {
      eyebrow: "Contact",
      title: "Démarrons quelque chose.",
      send: "Envoyer le message",
      sending: "Envoi...",
      sent: "Message envoyé !",
      fullName: "Nom complet",
      email: "Email",
      subject: "Sujet",
      message: "Votre message",
    },
    footer: {
      rights: "Tous droits réservés.",
      tagline: "Là où la créativité rencontre l'intelligence.",
      navigation: "NAVIGATION",
      contact: "CONTACT",
      description:
        "PhiBrain Inc — agence tech qui conçoit des sites web, des applications mobiles et des identités de marque qui mêlent design, IA et performance.",
    },
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      skills: "Skills",
      portfolio: "Portfolio",
      team: "Team",
      contact: "Contact",
      cta: "Start a project",
    },
    hero: {
      eyebrow: "Where creativity meets intelligence.",
      title: "We code, we design, we think PhiBrain.",
      description:
        "A tech agency crafting digital products where design, artificial intelligence and engineering work together — not against each other.",
      cta1: "Start a project",
      cta2: "See our work",
    },
    slider: {
      phrases: [
        "We turn your ideas into code.",
        "From first sketch to deployment.",
        "A brand that stands out everywhere.",
        "Every pixel has a purpose.",
        "The future, we build it now.",
        "Engineering at the service of ambition.",
      ],
    },
    services: {
      eyebrow: "Services",
      title: "What PhiBrain builds",
      description:
        "From the first sketch to production deployment, a multidisciplinary team handling the entire product cycle.",
    },
    skills: {
      eyebrow: "Skills",
      title: "A complete stack.",
      description: "From pixel to server, we master every layer.",
    },
    stats: {
      eyebrow: "Statistics",
      title1: "Every line compiled.",
      title2: "Every pixel justified.",
      description:
        "Four years turning ideas into products that actually exist.",
      items: ["Projects delivered", "Mobile apps", "Websites", "Identities & designs"],
    },
    portfolio: {
      eyebrow: "Portfolio",
      title1: "Some recently",
      title2: "delivered projects",
      filters: ["All", "Apps", "Design", "Sites"],
    },
    team: {
      eyebrow: "Team",
      title1: "The brains behind",
      title2: "PhiBrain",
      expanding: "Team is growing",
      expandingDesc:
        "Our team is expanding — hiring designers, mobile engineers and back-end developers. Want to join us?",
      joinBtn: "Join the team",
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "They trusted us",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's build something.",
      send: "Send message",
      sending: "Sending...",
      sent: "Message sent!",
      fullName: "FULL NAME",
      email: "EMAIL",
      subject: "SUBJECT",
      message: "YOUR MESSAGE",
    },
    footer: {
      rights: "All rights reserved.",
      tagline: "Where creativity meets intelligence.",
      navigation: "NAVIGATION",
      contact: "CONTACT",
      description:
        "PhiBrain Inc — a tech agency crafting websites, mobile apps and brand identities that blend design, AI and performance.",
    },
  },
};

export type Lang = "fr" | "en";
export type Translations = (typeof translations)["fr"];
