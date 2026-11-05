/* =========================================================
   QUIZ DU BESTIAIRE (page quiz.html)
   Trois modes tirent leurs questions du bestiaire et des textes.
   Le quatrième reprend dix questions écrites à la main.
   ========================================================= */

const MODES = [
  { id: "express", nom: "Express", nb: 5, description: "Cinq questions, le temps d'un café." },
  { id: "classique", nom: "Classique", nb: 10, description: "Dix questions, la partie normale." },
  { id: "marathon", nom: "Marathon", nb: 20, description: "Vingt questions, pour les vrais érudits." },
  { id: "champion", nom: "Champion du n’importe quoi", nb: 10, description: "Dix questions piochées dans les histoires. Le jury est une passoire." },
];

const BRAVO = ["Bien vu.", "Exactement.", "Évidemment.", "Hmmm. Approbation stoïcienne.", "Parfait, et je dis bien parfait."];
const RATE = ["Raté.", "Perdu dans le multivers.", "Pas du tout.", "Même les gobelins à carreaux le savaient."];

const QUESTIONS_CHAMPION = [
  {
    texte: "Le Train Bolchévique aux Cornichons",
    question: "Quelle cargaison le train transporte-t-il au départ ?",
    choix: [
      "Des cornichons de mer, passagers prioritaires par décret ferroviaire",
      "Du sable saharien déjà muni d’un billet pour l’Antarctique",
      "Des noix de cajou en route vers leur avenir sibérien",
      "Des enceintes Marshall homologuées pour le vol intergalactique"
    ],
    reponse: 0,
    explication: "Au départ, les cornichons de mer occupent les wagons. Leur séjour ferroviaire sera bref, mais leur importance historique est déjà démesurée."
  },
  {
    texte: "La Farandole Saturnienne",
    question: "En quoi la population terrestre est-elle transformée avant la farandole ?",
    choix: [
      "En poissons d’un kilomètre de long et d’un millimètre de large, parfaits pour le tourisme saturnien",
      "En lutins-mouches promues poissons par décret et sans consultation",
      "En boules de chair, nouvelle catégorie aquatique homologuée à la hâte",
      "En mules indonésiennes recrutées pour leur expérience des anneaux"
    ],
    reponse: 0,
    explication: "Toute la population devient une espèce de poissons d’un kilomètre de long et d’un millimètre de large. Le tour des anneaux de Saturne figure ensuite au programme."
  },
  {
    texte: "Le Démantèlement Galactique",
    question: "Quel duo d’animaux fournit l’ADN utilisé dans l’opération ?",
    choix: [
      "Une pipistrelle à psoriasis et une loutre de mer à trois pattes et dix-sept nageoires",
      "Un béluga géant et un gobelin liés par une clause génétique obscure",
      "Un mammouth radioactif et une chauve-souris en stage de laboratoire",
      "Une mule indonésienne et un poisson diplômé en ingénierie ADN"
    ],
    reponse: 0,
    explication: "La formule associe une pipistrelle atteinte de psoriasis et une loutre de mer à trois pattes et dix-sept nageoires. Le laboratoire n’a pas jugé utile de consulter un vétérinaire."
  },
  {
    texte: "La Secte Hindu de François Bayrou",
    question: "Quels objets sont au cœur du culte de la secte ?",
    choix: [
      "Des horloges à pendule antiques, seules autorités consultées à l’heure pile",
      "Des toupies géantes dont le centre de gravité fait office de gourou",
      "Des enceintes volantes équipées d’une batterie cosmique",
      "Des lunettes à zoom réglées sur un éternel agrandissement"
    ],
    reponse: 0,
    explication: "Les horloges à pendule antiques sont au centre du culte. Chaque heure apporte son oracle, ponctualité comprise."
  },
  {
    texte: "Le Tournoi du Lesotho Démoniaque",
    question: "Sur quelle monture les candidats parcourent-ils les anneaux de Saturne ?",
    choix: [
      "Des mules indonésiennes, détentrices du permis Saturne",
      "Des poissons géants, titulaires d’un abonnement aux anneaux",
      "Un traîneau homologué pour les virages planétaires",
      "Un Rafale stationné sur une orbite réglementaire"
    ],
    reponse: 0,
    explication: "La deuxième épreuve se déroule à dos de mules indonésiennes, sur les anneaux de Saturne. La vitesse annoncée n’a pas été certifiée par le contrôle technique."
  },
  {
    texte: "L'Odyssée des Boules Humaines",
    question: "Où les boules humaines deviennent-elles des ballons de football ?",
    choix: [
      "Dans les grottes de Lascaux, terrain homologué pour le ballon humain",
      "Sur les anneaux de Saturne, après le tour réglementaire",
      "En Sibérie, près du marché officiel de cajou",
      "À UY Scuti, pendant le concert à guitare amplifiée"
    ],
    reponse: 0,
    explication: "Les boules humaines servent de ballons pour une Coupe du monde organisée dans les grottes de Lascaux. Le règlement sportif n’a pas été retrouvé."
  },
  {
    texte: "La Parade d'Astérion",
    question: "Quels êtres minuscules forment la silhouette géante d’Astérion ?",
    choix: [
      "Des lutins-mouches souriantes assemblées avec une précision municipale",
      "Des gobelins à carreaux conduits par leur auriculaire gauche",
      "Des galaxies stoïciennes, muettes mais très ponctuelles",
      "Des pipistrelles-loutres sorties d’un laboratoire sans supervision"
    ],
    reponse: 0,
    explication: "Les lutins-mouches microscopiques s’assemblent en nombre suffisant pour former la silhouette d’Astérion. Le défilé dispose d’un effectif supérieur aux prévisions."
  },
  {
    texte: "Le Concert de Trop",
    question: "Sur quelle étoile le concert doit-il avoir lieu ?",
    choix: [
      "UY Scuti, réservée par le bureau cosmique des spectacles",
      "Balactica, sous réserve d’obtenir un permis orbital",
      "Le Soleil, après les heures de pointe",
      "Saturne, en première partie de ses propres anneaux"
    ],
    reponse: 0,
    explication: "Le concert se déroule sur UY Scuti, étoile réquisitionnée pour accueillir la scène. Les gradins ont été prévus à l’échelle du désastre musical."
  },
  {
    texte: "Trafic de Chaud et de Froid",
    question: "Quel instrument géant sert à attirer les personnes vers le Sahara ?",
    choix: [
      "Une contrebasse de huit mètres, assez majestueuse pour convoquer le Sahara",
      "Un violoncelle de poche homologué par le ministère du désert",
      "Une guitare électrique accordée sur la neige antarctique",
      "Un cor de chasse monté sur un bateau supersonique"
    ],
    reponse: 0,
    explication: "Une contrebasse de huit mètres ouvre l’opération en attirant ses auditeurs dans le désert du Sahara. La musique n’annonce pas encore le trafic de neige."
  },
  {
    texte: "La baignoire cosmique",
    question: "Dans quel objet les personnes endormies sont-elles rassemblées pour le voyage spatial ?",
    choix: [
      "Une baignoire gargantuesque conçue pour un départ sans escale vers le cosmos",
      "Un cochon-tirelire aspirateur avec option UY Scuti",
      "Un train bolchévique, wagon baignoire inclus",
      "Un igloo géant modèle transportable pour marché de cajou"
    ],
    reponse: 0,
    explication: "La baignoire gargantuesque accueille les personnes endormies puis traverse le cosmos vers le trou noir le plus massif. La plomberie ordinaire n’est pas incluse."
  }
];

const quiz = { mode: null, questions: [], i: 0, score: 0, serie: 0, meilleureSerie: 0, reponses: [], fini: false };

/* ---------- Mémoire des fiches déjà posées (dans le navigateur du joueur) ---------- */

function fichesVues() {
  try { return new Set(JSON.parse(lire("quiz-vues")) || []); } catch (e) { return new Set(); }
}
function marquerVue(id) {
  const vues = fichesVues();
  vues.add(id);
  ecrire("quiz-vues", JSON.stringify([...vues]));
}
const record = mode => Number(lire("quiz-record-" + mode.id)) || 0;

/* ---------- Préparation d'une partie ---------- */

let candidats = null;   // fiches utilisables, calculées une seule fois

function fichesJouables() {
  if (candidats) return candidats;
  const remplis = TEXTES.filter(t => nbMots(t.contenu));
  candidats = BESTIAIRE
    .map(f => ({ f, textes: textesDeLaFiche(f) }))
    .filter(c => c.textes.length && remplis.length - c.textes.length >= 3);
  candidats.remplis = remplis;
  return candidats;
}

function preparerQuiz(mode) {
  if (mode.id === "champion") {
    quiz.questions = melanger(QUESTIONS_CHAMPION).slice(0, mode.nb).map(data => {
      const histoire = TEXTES.find(t => t.titre === data.texte);
      if (!histoire) throw new Error("Histoire absente du recueil : " + data.texte);
      const choix = melanger(data.choix.map((texte, i) => ({
        titre: texte, contenu: histoire.contenu, id: histoire.id, juste: i === data.reponse
      })));
      const bonne = choix.find(c => c.juste);
      return {
        champion: true, question: data.question, explication: data.explication, histoire,
        f: { type: "Question d’histoire", nom: data.question, description: data.explication, mots: [], id: histoire.id },
        bonne, choix
      };
    });
  } else {
    const tout = fichesJouables();
    let vues = fichesVues();
    let jamais = tout.filter(c => !vues.has(c.f.id));
    if (jamais.length === 0) { ecrire("quiz-vues", "[]"); vues = new Set(); jamais = tout; }
    const choisies = [...melanger(jamais), ...melanger(tout.filter(c => vues.has(c.f.id)))].slice(0, mode.nb);
    quiz.questions = choisies.map(({ f, textes }) => {
      const bonne = auHasard(textes);
      const leurres = melanger(tout.remplis.filter(t => !textes.includes(t))).slice(0, 3);
      return { f, bonne, choix: melanger([bonne, ...leurres]) };
    });
  }
  Object.assign(quiz, { mode, i: 0, score: 0, serie: 0, meilleureSerie: 0, reponses: [], fini: false });
}

/* La phrase du texte où apparaît la fiche, avec le mot surligné. */
function passageDeLaFiche(f, t) {
  for (const mot of f.mots) {
    const occ = occurrencesReference(t.contenu, mot)[0];
    if (!occ) continue;
    const [s, e] = occ, txt = t.contenu;
    let a = s, b = e;
    while (a > 0 && !/[.!?\n]/.test(txt[a - 1])) a--;
    while (b < txt.length && !/[.!?\n]/.test(txt[b])) b++;
    if (b < txt.length) b++;
    let debut = txt.slice(a, s), fin = txt.slice(e, b);
    if (debut.length > 140) debut = "…" + debut.slice(debut.indexOf(" ", debut.length - 140) + 1);
    if (fin.length > 160) fin = fin.slice(0, fin.lastIndexOf(" ", 160)) + "…";
    const net = x => echappe(x.replace(/\s+/g, " "));
    return { mot, html: net(debut.trimStart()) + "<mark>" + net(txt.slice(s, e)) + "</mark>" + net(fin.trimEnd()) };
  }
  return null;
}

/* Les liens vers la page principale gardent le mot à surligner pour le trajet. */
function lienVersTexte(t, mot) {
  return `<a class="q-lien" href="index.html#${t.id}" data-surligner="${echappe(mot || "")}" data-texte="${t.id}">Lire ce passage</a>`;
}
document.addEventListener("click", e => {
  const a = e.target.closest("a[data-surligner]");
  if (!a || !a.dataset.surligner) return;
  try { sessionStorage.setItem("surlignage", JSON.stringify({ id: a.dataset.texte, terme: a.dataset.surligner })); } catch (err) { }
});

/* ---------- Écran d'accueil du quiz ---------- */

function rendreAccueilQuiz() {
  $("quiz").innerHTML = `
    <div class="q-accueil">
      <h2 class="q-accueil-titre">Choisis ta partie</h2>
      <p class="q-description">En mode bestiaire, retrouve l’histoire liée à chaque fiche. En mode Champion, réponds aux questions écrites à la main dans le recueil.</p>
      <div class="q-modes">
        ${MODES.map(m => `
          <button type="button" class="q-mode" data-mode="${m.id}">
            <span class="q-mode-nb">${m.nb}</span>
            <span class="q-mode-nom">${m.nom}</span>
            <span class="q-mode-desc">${m.description}</span>
            <span class="q-mode-record">${record(m) ? `Record : ${record(m)}/${m.nb}` : "Pas encore de record"}</span>
          </button>`).join("")}
      </div>
      <p class="q-memoire">
        Le bestiaire privilégie les fiches que tu n’as pas encore croisées.
        <button type="button" class="q-oubli" id="q-oubli">Tout oublier</button>
        <br>Le mode Champion du n’importe quoi tire dix questions au hasard parmi celles des histoires.
      </p>
    </div>`;
  $("quiz").querySelectorAll(".q-mode").forEach(b => b.onclick = () => {
    preparerQuiz(MODES.find(m => m.id === b.dataset.mode));
    rendreQuestion();
    focaliserQuiz();
  });
  const oubli = $("q-oubli");
  if (oubli) oubli.onclick = () => { ecrire("quiz-vues", "[]"); rendreAccueilQuiz(); };
}

/* ---------- Une question ---------- */

function rendreQuestion() {
  if (!quiz.questions.length) {
    $("quiz").innerHTML = '<p class="q-vide">Pas encore assez de fiches reliées aux histoires pour lancer ce mode. Ajoute quelques références au bestiaire et reviens tenter ta chance.</p>';
    return;
  }
  if (quiz.fini) return rendreFinQuiz();
  const q = quiz.questions[quiz.i], n = quiz.questions.length;
  const question = q.champion
    ? echappe(q.question)
    : 'Dans quelle histoire trouve-t-on <span class="q-nom">' + echappe(q.f.nom) + '</span> ?';
  const choix = q.choix.map((t, k) =>
    '<button type="button" class="q-option" data-k="' + k + '">' + echappe(t.titre) + '</button>'
  ).join("");
  $("quiz").innerHTML =
    '<div class="q-entete"><span>' + echappe(quiz.mode.nom) + ', question ' + (quiz.i + 1) + ' sur ' + n + '</span>' +
    '<span class="q-serie" id="q-serie"></span><span>Score : <strong id="q-score">' + quiz.score + '</strong></span></div>' +
    '<div class="q-progression"><span style="width:' + (quiz.i / n * 100) + '%"></span></div>' +
    '<p class="q-type">' + (q.champion ? 'Question tirée d’une histoire' : echappe(q.f.type)) + '</p>' +
    '<h2 class="q-question">' + question + '</h2>' +
    '<div class="q-choix">' + choix + '</div><div class="q-reponse" id="q-reponse" hidden></div>';
  majSerie();
  $("quiz").querySelectorAll(".q-option").forEach(b => b.onclick = () => repondre(Number(b.dataset.k)));
  if (quiz.reponses[quiz.i] !== undefined) afficherReponse(quiz.reponses[quiz.i], false);
}

function majSerie() {
  const el = $("q-serie");
  if (!el) return;
  el.textContent = quiz.serie >= 2 ? `${quiz.serie} bonnes réponses d'affilée` : "";
  el.classList.toggle("chaude", quiz.serie >= 5);
}

function repondre(k) {
  if (quiz.reponses[quiz.i] !== undefined) return;
  quiz.reponses[quiz.i] = k;
  const q = quiz.questions[quiz.i];
  if (!q.champion) marquerVue(q.f.id);
  if (q.choix[k] === q.bonne) {
    quiz.score++;
    quiz.serie++;
    quiz.meilleureSerie = Math.max(quiz.meilleureSerie, quiz.serie);
  } else quiz.serie = 0;
  afficherReponse(k, true);
}

function afficherReponse(k, focaliser) {
  const q = quiz.questions[quiz.i];
  const juste = q.choix[k] === q.bonne;
  $("quiz").querySelectorAll(".q-option").forEach((b, j) => {
    b.disabled = true;
    if (q.choix[j] === q.bonne) b.classList.add("juste");
    else if (j === k) b.classList.add("faux");
  });
  $("q-score").textContent = quiz.score;
  majSerie();
  const passage = q.champion ? null : passageDeLaFiche(q.f, q.bonne);
  const derniere = quiz.i === quiz.questions.length - 1;
  const el = $("q-reponse");
  el.hidden = false;
  el.classList.toggle("bonne", juste);
  const verdict = juste ? auHasard(BRAVO) : auHasard(RATE) +
    ' La bonne réponse était <em>' + echappe(q.bonne.titre) + '</em>.';
  const liens = q.champion
    ? '<a class="q-lien" href="index.html#' + q.histoire.id + '">Relire « ' + echappe(q.histoire.titre) + ' »</a>'
    : lienVersTexte(q.bonne, passage && passage.mot) +
      ' <a class="q-lien" href="index.html#' + q.f.id + '">Voir la fiche</a>';
  el.innerHTML =
    '<p class="q-verdict">' + verdict + '</p>' +
    '<p class="q-description">' + echappe(q.champion ? q.explication : q.f.description) + '</p>' +
    (passage ? '<blockquote class="q-extrait">' + passage.html + '</blockquote>' : '') +
    '<div class="q-actions">' + liens +
    '<button type="button" class="outil plein" id="q-suivant">' +
    (derniere ? 'Voir mon score' : 'Question suivante') + '</button></div>';
  $("q-suivant").onclick = () => {
    if (derniere) quiz.fini = true; else quiz.i++;
    rendreQuestion();
    focaliserQuiz();
  };
  if (focaliser) $("q-suivant").focus({ preventScroll: true });
}

function focaliserQuiz() {
  const cible = $("quiz").querySelector(".q-option, .q-rejouer");
  if (cible) cible.focus({ preventScroll: true });
  if ($("quiz").getBoundingClientRect().top < 0) $("quiz").scrollIntoView({ block: "start" });
}

/* ---------- Fin de partie ---------- */

function rendreFinQuiz() {
  const n = quiz.questions.length, s = quiz.score, ratio = s / n;
  const ancien = record(quiz.mode);
  const nouveauRecord = s > ancien;
  if (nouveauRecord) ecrire("quiz-record-" + quiz.mode.id, s);
  const titre = ratio === 1 ? "Gardien du bestiaire" : ratio >= .7 ? "Érudit des sottises" : ratio >= .4 ? "Lecteur assidu" : "Simple touriste du multivers";
  const commentaire = ratio === 1 ? "Un sans-faute. Les galaxies stoïciennes en restent sans voix, ce qui chez elles ne change pas grand-chose."
    : ratio >= .7 ? "Tu connais le recueil mieux que ses auteurs. Le jury demande une contre-enquête."
    : ratio >= .4 ? "Honorable. Une relecture attentive et quelques années-lumière de plus feront l'affaire."
    : "Le recueil t’attend. Pioche une histoire au hasard et laisse le multivers faire le reste.";
  $("quiz").innerHTML = `
    <div class="q-fin">
      <p class="q-type">Score final, partie ${echappe(quiz.mode.nom.toLowerCase())}</p>
      <p class="q-score">${s}<small>/${n}</small></p>
      <h2 class="q-titre-fin">${titre}</h2>
      <p class="q-description">${commentaire}</p>
      <p class="q-record">${nouveauRecord ? `Nouveau record ! L'ancien était de ${ancien}/${n}.` : `Ton record : ${Math.max(ancien, s)}/${n}.`}
        ${quiz.meilleureSerie >= 2 ? ` Meilleure série : ${quiz.meilleureSerie} d'affilée.` : ""}</p>
      <div class="q-actions">
        <button type="button" class="outil plein q-rejouer" id="q-rejouer">Rejouer en ${echappe(quiz.mode.nom.toLowerCase())}</button>
        <button type="button" class="outil" id="q-modes">Changer de mode</button>
      </div>
    </div>
    <h3 class="q-recap-titre">Le récapitulatif</h3>
    <ol class="q-recap">
      ${quiz.questions.map((q, i) => {
        const juste = q.choix[quiz.reponses[i]] === q.bonne;
        if (q.champion) return '<li class="' + (juste ? "juste" : "faux") + '">' +
          '<span class="q-recap-signe" aria-label="' + (juste ? "Bonne réponse" : "Mauvaise réponse") + '">' + (juste ? "✓" : "✗") + '</span>' +
          '<span class="q-recap-question">' + echappe(q.question) + '</span>' +
          '<span class="q-recap-texte">Réponse : <strong>' + echappe(q.bonne.titre) + '</strong> · ' +
          '<a href="index.html#' + q.histoire.id + '">Relire « ' + echappe(q.histoire.titre) + ' »</a></span></li>';
        return '<li class="' + (juste ? "juste" : "faux") + '">' +
          '<span class="q-recap-signe" aria-label="' + (juste ? "Bonne réponse" : "Mauvaise réponse") + '">' + (juste ? "✓" : "✗") + '</span>' +
          '<a href="index.html#' + q.f.id + '">' + echappe(q.f.nom) + '</a>' +
          '<span class="q-recap-texte">dans ' +
          lienVersTexte(q.bonne, (q.f.mots.find(m => occurrencesReference(q.bonne.contenu, m).length)) || "").replace("Lire ce passage", echappe(q.bonne.titre)) +
          '</span></li>';
      }).join("")}
    </ol>`;
  $("q-rejouer").onclick = () => { preparerQuiz(quiz.mode); rendreQuestion(); focaliserQuiz(); };
  $("q-modes").onclick = () => { rendreAccueilQuiz(); focaliserQuiz(); };
}

/* ---------- Démarrage de la page ---------- */

(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => dessinerLogo($("logo-mot")));

chargerTextes()
  .then(() => rendreAccueilQuiz())
  .catch(e => {
    $("quiz").innerHTML = `<p class="q-vide"><strong>Les textes n'ont pas pu être chargés.</strong> ${echappe(location.protocol === "file:" ? "Le navigateur bloque la lecture des fichiers .txt en local : ouvrez la page avec Live Server dans VS Code." : e.message)}</p>`;
  });
