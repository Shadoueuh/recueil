/* =========================================================
   QUESTIONS POUR UN CHAMPION DU N'IMPORTE QUOI (page quiz.html)
   1. Le générateur : il fabrique des questions tout seul en
      lisant les textes et le bestiaire (donnees.js).
   2. Le jeu télé : « Neuf points gagnants », puis
      « Quatre à la suite » contre la montre.
   ========================================================= */

/* =========================================================
   1. LE GÉNÉRATEUR DE QUESTIONS
   Six familles de questions, tirées au hasard :
   - texte à trous : un passage dont un élément a disparu
   - le chiffre exact : un passage dont le nombre a disparu
   - l'intrus : trois éléments d'une histoire, un venu d'ailleurs
   - qui suis-je : la description d'une fiche, à reconnaître
   - où se cache : dans quelle histoire apparaît un élément
   - le jury : les questions écrites à la main (QUESTIONS_CHAMPION)
   ========================================================= */

const FAMILLES = [
  { id: "trou", rubrique: "Texte à trous", poids: 3 },
  { id: "chiffre", rubrique: "Le chiffre exact", poids: 2 },
  { id: "intrus", rubrique: "L'intrus", poids: 2 },
  { id: "portrait", rubrique: "Qui suis-je ?", poids: 1.5 },
  { id: "ou", rubrique: "Où se cache…", poids: 1 },
  { id: "jury", rubrique: "La question du jury", poids: 1 },
];

/* Tout ce que le générateur sait du recueil, calculé une seule fois. */
let savoir = null;

function preparerSavoir() {
  if (savoir) return savoir;
  const textes = TEXTES.filter(t => nbMots(t.contenu));
  // Pour chaque fiche : ses apparitions (texte + position)
  const fiches = [];
  for (const f of BESTIAIRE) {
    const apparitions = [];
    for (const t of textes) {
      for (const mot of f.mots) {
        for (const [s, e] of occurrencesReference(t.contenu, mot)) apparitions.push({ t, s, e, mot });
      }
    }
    if (apparitions.length) fiches.push({ f, apparitions, textes: [...new Set(apparitions.map(a => a.t))] });
  }
  // Les nombres écrits dans les textes
  const nombres = [];
  const reNombre = /(?<![\p{L}\d.,])\d{1,3}(?:[  ]\d{3})+(?![\d\p{L}]|[.,]\d)|(?<![\p{L}\d.,])\d+(?:[.,]\d+)?(?![\d\p{L}]|[.,]\d)/gu;
  for (const t of textes) {
    for (const m of t.contenu.matchAll(reNombre)) {
      const brut = m[0];
      const valeur = parseFloat(brut.replace(/[  ]/g, "").replace(",", "."));
      const decimal = /[.,]/.test(brut);
      if (!decimal && valeur < 5) continue;                     // « 2 », « 3 » : trop faciles
      if (!decimal && valeur >= 1900 && valeur <= 2100) continue; // les années
      nombres.push({ t, s: m.index, e: m.index + brut.length, brut, valeur });
    }
  }
  savoir = { textes, fiches, nombres, parTexte: new Map(textes.map(t => [t, fiches.filter(c => c.textes.includes(t))])) };
  return savoir;
}

/* La phrase qui entoure un passage [s, e], coupée proprement si elle est longue. */
function finDePhrase(txt, i) {
  const c = txt[i];
  if (c === "\n" || c === "!" || c === "?") return true;
  return c === "." && !(/\d/.test(txt[i - 1] || "") && /\d/.test(txt[i + 1] || ""));
}

function phraseAutour(txt, s, e, max = 170) {
  let a = s, b = e;
  while (a > 0 && !finDePhrase(txt, a - 1)) a--;
  while (b < txt.length && !finDePhrase(txt, b)) b++;
  if (b < txt.length) b++;
  // Phrase trop courte pour donner un indice : on ajoute la phrase d'avant
  if ((s - a) + (b - e) < 80 && a > 0) {
    a--;
    while (a > 0 && !finDePhrase(txt, a - 1)) a--;
  }
  let avant = txt.slice(a, s).replace(/\s+/g, " ").trimStart();
  let apres = txt.slice(e, b).replace(/\s+/g, " ").trimEnd();
  if (avant.length > max) avant = "…" + avant.slice(avant.indexOf(" ", avant.length - max) + 1);
  if (apres.length > max) apres = apres.slice(0, apres.lastIndexOf(" ", max)) + "…";
  return { avant, mot: txt.slice(s, e), apres };
}

const memeMot = (a, b) => normaliser(a).n.trim() === normaliser(b).n.trim();
const cite = t => `<em>${echappe(t.titre)}</em>`;

/* Choisit n éléments au hasard dans une liste, sans doublon selon cle(). */
function piocher(liste, n, cle = x => x) {
  const vus = new Set(), res = [];
  for (const x of melanger(liste)) {
    const k = cle(x);
    if (vus.has(k)) continue;
    vus.add(k); res.push(x);
    if (res.length === n) break;
  }
  return res;
}

/* Fiches de même type (pour des leurres crédibles), sinon n'importe lesquelles. */
function leurresFiches(exclure, type, n, filtre = () => true) {
  const S = preparerSavoir();
  const ok = c => !exclure.some(x => x === c.f || memeMot(x.nom || x, c.f.nom)) && filtre(c);
  let pool = S.fiches.filter(c => c.f.type === type && ok(c));
  if (pool.length < n) pool = pool.concat(S.fiches.filter(c => c.f.type !== type && ok(c)));
  return piocher(pool, n, c => normaliser(c.f.nom).n);
}

/* Parmi des propositions, garde celles qui ressemblent le plus à la bonne réponse :
   même nombre de mots environ, même majuscule (nom propre ou non), chiffres ou pas. */
function ressemblants(modele, propositions, n) {
  const forme = x => ({ mots: x.trim().split(/\s+/).length, majuscule: /^\p{Lu}/u.test(x), chiffre: /\d/.test(x) });
  const m = forme(modele);
  const distance = x => {
    const f = forme(x);
    return Math.abs(f.mots - m.mots) + (f.majuscule !== m.majuscule ? 2 : 0) + (f.chiffre !== m.chiffre ? 3 : 0) + Math.random() * 1.5;
  };
  const uniques = [...new Set(propositions)].filter(x => !memeMot(x, modele));
  return uniques.sort((a, b) => distance(a) - distance(b)).slice(0, n);
}

/* ---------- Les six familles ---------- */

const GENERATEURS = {
  trou(theme) {
    const S = preparerSavoir();
    const c = auHasard(S.fiches.filter(c => theme.fiche(c)));
    if (!c) return null;
    const a = auHasard(c.apparitions.filter(x => theme.texte(x.t)));
    if (!a) return null;
    const p = phraseAutour(a.t.contenu, a.s, a.e);
    const phrase = normaliser(p.avant + " " + p.apres).n;
    const candidats = leurresFiches([c.f], c.f.type, 40, x => !x.f.mots.some(m => phrase.includes(normaliser(m).n)));
    const leurres = ressemblants(p.mot, candidats.map(x => x.f.mots[0]), 3);
    if (leurres.length < 3) return null;
    return {
      cle: "trou:" + c.f.id,
      texte: a.t, surligner: a.mot,
      enonce: `Complète ce passage de ${cite(a.t)} :`,
      citation: `${echappe(p.avant)}<span class="c-trou">……</span>${echappe(p.apres)}`,
      choix: [{ label: p.mot, juste: true }, ...leurres.map(label => ({ label }))],
      explication: `${echappe(p.avant)}<mark>${echappe(p.mot)}</mark>${echappe(p.apres)}`,
    };
  },

  chiffre(theme) {
    const S = preparerSavoir();
    const n = auHasard(S.nombres.filter(x => theme.texte(x.t)));
    if (!n) return null;
    const p = phraseAutour(n.t.contenu, n.s, n.e);
    const propositions = fauxNombres(n);
    if (propositions.length < 3) return null;
    return {
      cle: "chiffre:" + n.t.id + ":" + n.s,
      texte: n.t, surligner: n.brut,
      enonce: `Quel nombre manque dans ce passage de ${cite(n.t)} ?`,
      citation: `${echappe(p.avant)}<span class="c-trou">……</span>${echappe(p.apres)}`,
      choix: [{ label: n.brut, juste: true }, ...propositions.map(x => ({ label: x }))],
      explication: `${echappe(p.avant)}<mark>${echappe(n.brut)}</mark>${echappe(p.apres)}`,
    };
  },

  intrus(theme) {
    const S = preparerSavoir();
    const t = auHasard(S.textes.filter(t => theme.texte(t) && (S.parTexte.get(t) || []).filter(theme.fiche).length >= 3));
    if (!t) return null;
    const presents = piocher(S.parTexte.get(t).filter(theme.fiche), 3, c => normaliser(c.f.nom).n);
    const intrus = auHasard(S.fiches.filter(c => !c.textes.includes(t) && theme.fiche(c) && !presents.some(p => memeMot(p.f.nom, c.f.nom))));
    if (presents.length < 3 || !intrus) return null;
    const origine = auHasard(intrus.textes);
    return {
      cle: "intrus:" + t.id + ":" + intrus.f.id,
      texte: t, surligner: null,
      enonce: `Lequel de ces éléments n'apparaît <strong>pas</strong> dans ${cite(t)} ?`,
      choix: [{ label: intrus.f.nom, juste: true }, ...presents.map(c => ({ label: c.f.nom }))],
      explication: `${echappe(intrus.f.nom)} vient en réalité de ${cite(origine)}. ${echappe(intrus.f.description)}`,
    };
  },

  portrait(theme) {
    const S = preparerSavoir();
    const devoile = c => {
      const d = normaliser(c.f.description).n;
      const nom = normaliser(c.f.nom.replace(/^(le|la|les|l'|l’|un|une|des)\s*/i, "")).n;
      return c.f.mots.some(m => d.includes(normaliser(m).n)) || d.includes(nom);
    };
    const c = auHasard(S.fiches.filter(c => theme.fiche(c) && c.textes.some(theme.texte) && c.f.description && !devoile(c)));
    if (!c) return null;
    const leurres = leurresFiches([c.f], c.f.type, 3);
    if (leurres.length < 3) return null;
    const t = auHasard(c.textes.filter(theme.texte));
    return {
      cle: "portrait:" + c.f.id,
      texte: t, surligner: c.apparitions.find(a => a.t === t).mot,
      enonce: `Qui suis-je ? <span class="c-indice">${echappe(c.f.type)}</span>`,
      citation: echappe(c.f.description),
      choix: [{ label: c.f.nom, juste: true }, ...leurres.map(x => ({ label: x.f.nom }))],
      explication: `C'était ${echappe(c.f.nom)}, que l'on croise dans ${cite(t)}.`,
    };
  },

  ou(theme) {
    const S = preparerSavoir();
    const c = auHasard(S.fiches.filter(c => theme.fiche(c) && c.textes.some(theme.texte) && S.textes.length - c.textes.length >= 3));
    if (!c) return null;
    const t = auHasard(c.textes.filter(theme.texte));
    const autres = piocher(S.textes.filter(x => !c.textes.includes(x)), 3);
    const a = c.apparitions.find(x => x.t === t);
    const p = phraseAutour(t.contenu, a.s, a.e);
    return {
      cle: "ou:" + c.f.id,
      texte: t, surligner: a.mot,
      enonce: `Dans quelle histoire trouve-t-on <span class="q-nom">${echappe(c.f.nom)}</span> ?`,
      choix: [{ label: t.titre, juste: true }, ...autres.map(x => ({ label: x.titre }))],
      explication: `${echappe(p.avant)}<mark>${echappe(p.mot)}</mark>${echappe(p.apres)}`,
    };
  },

  jury(theme) {
    if (typeof QUESTIONS_CHAMPION === "undefined") return null;
    const d = auHasard(QUESTIONS_CHAMPION.filter(q => {
      const t = TEXTES.find(x => x.titre === q.texte);
      return t && theme.texte(t) && theme.jury;
    }));
    if (!d) return null;
    const t = TEXTES.find(x => x.titre === d.texte);
    return {
      cle: "jury:" + d.question,
      texte: t, surligner: null,
      enonce: `${echappe(d.question)} <span class="c-indice">${echappe(t.titre)}</span>`,
      choix: d.choix.map((label, i) => ({ label, juste: i === d.reponse })),
      explication: echappe(d.explication),
    };
  },
};

/* Faux nombres crédibles : même ordre de grandeur, même écriture que l'original. */
function fauxNombres(n) {
  const v = n.valeur, brut = n.brut;
  const decimales = (brut.split(/[.,]/)[1] || "").length;
  const sep = brut.includes(",") ? "," : ".";
  const groupe = /[  ]/.test(brut);
  const ecrire = x => {
    let s = decimales ? x.toFixed(decimales).replace(".", sep) : String(Math.round(x));
    if (groupe) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return s;
  };
  const S = preparerSavoir();
  const idees = [v * 2, v / 2, v * 10, v / 10, v * 1.5, v * 0.75, v + 1, v - 1, v + 7, v * 3];
  if (v < 30) idees.push(v + 2, v + 3, v - 2, v - 3, v + 5);
  // Des nombres d'autres textes, de taille voisine
  idees.push(...piocher(S.nombres.filter(x => x.valeur > v / 20 && x.valeur < v * 20 && x.brut !== brut), 3).map(x => x.valeur));
  const res = [];
  for (const x of melanger(idees)) {
    if (!(x > 0)) continue;
    const s = ecrire(decimales ? x : Math.round(x));
    if (s === brut || res.includes(s) || s === "0") continue;
    res.push(s);
    if (res.length === 3) break;
  }
  return res;
}

/* ---------- Les thèmes : filtres appliqués au générateur ---------- */

function themesDisponibles() {
  const S = preparerSavoir();
  const tous = { nom: "Tout le recueil", texte: () => true, fiche: () => true, jury: true };
  const themes = [];
  for (const auteur of Object.keys(AUTEURS)) {
    themes.push({ nom: `Les histoires de ${auteur}`, texte: t => t.auteur === auteur, fiche: c => c.textes.some(t => t.auteur === auteur), jury: true });
  }
  const types = [...new Set(S.fiches.map(c => c.f.type))];
  for (const type of types) {
    const n = S.fiches.filter(c => c.f.type === type).length;
    if (n >= 12) themes.push({ nom: PLURIELS_TYPES[type] || type + "s", texte: () => true, fiche: c => c.f.type === type, familles: ["trou", "portrait", "ou", "intrus"] });
  }
  if (S.nombres.length >= 15) themes.push({ nom: "Les chiffres délirants", texte: () => true, fiche: () => true, familles: ["chiffre"] });
  return { tous, themes };
}

const PLURIELS_TYPES = {
  Lieu: "Les lieux", Créature: "Les créatures", Objet: "Les objets", Substance: "Les substances", Châtiment: "Les châtiments",
  Personnage: "Les personnages", Organisation: "Les organisations", Institution: "Les institutions", Groupe: "Les groupes",
  Événement: "Les événements", Œuvre: "Les œuvres", Marque: "Les marques", Détail: "Les détails",
};

/* Fabrique une question nouvelle (jamais posée dans la partie) dans le thème donné. */
function genererQuestion(theme, dejaPosees) {
  const familles = FAMILLES.filter(f => !theme.familles || theme.familles.includes(f.id));
  for (let essai = 0; essai < 60; essai++) {
    // Tirage pondéré de la famille
    let r = Math.random() * familles.reduce((s, f) => s + f.poids, 0), famille = familles[0];
    for (const f of familles) { r -= f.poids; if (r <= 0) { famille = f; break; } }
    const q = GENERATEURS[famille.id](theme);
    if (!q || dejaPosees.has(q.cle)) continue;
    // Les quatre réponses doivent être bien distinctes
    if (new Set(q.choix.map(c => normaliser(c.label).n)).size < 4) continue;
    dejaPosees.add(q.cle);
    q.rubrique = famille.rubrique;
    q.choix = melanger(q.choix);
    return q;
  }
  return null;
}


/* =========================================================
   2. LE JEU TÉLÉ
   ========================================================= */

const NEUF = { objectif: 9, maxQuestions: 12, dureeQuestion: 20 };
const QUATRE = { objectif: 4, duree: 60 };
const champion = {};
let chronoEnCours = null;

const enSecondes = ms => (ms / 1000).toFixed(1).replace(".", ",");

function recordChampion() {
  try { return JSON.parse(lire("quiz-record-champion")) || null; } catch (e) { return null; }
}
function texteRecordChampion() {
  const r = recordChampion();
  if (!r) return "Pas encore de record";
  return r.champion ? `Record : champion en ${enSecondes(r.temps)} s` : `Record : ${r.points} points`;
}

/* ---------- Chronomètre ---------- */

function lancerChrono(dureeMs, auTic, alaFin) {
  arreterChrono();
  const debut = performance.now();
  const c = { debut, dureeMs, pause: 0, enPause: null, actif: true };
  const boucle = now => {
    if (!c.actif) return;
    if (c.enPause === null) {
      const ecoule = now - c.debut - c.pause;
      const reste = Math.max(0, dureeMs - ecoule);
      auTic(reste, ecoule);
      if (reste <= 0) { c.actif = false; alaFin(); return; }
    }
    c.raf = requestAnimationFrame(boucle);
  };
  c.raf = requestAnimationFrame(boucle);
  c.ecoule = () => (c.enPause ?? performance.now()) - c.debut - c.pause;
  c.suspendre = () => { if (c.enPause === null) c.enPause = performance.now(); };
  c.reprendre = () => { if (c.enPause !== null) { c.pause += performance.now() - c.enPause; c.enPause = null; } };
  chronoEnCours = c;
  return c;
}
function arreterChrono() {
  if (chronoEnCours) { chronoEnCours.actif = false; cancelAnimationFrame(chronoEnCours.raf); chronoEnCours = null; }
}
function afficherChrono(reste, total) {
  const barre = $("c-chrono-barre"), txt = $("c-chrono-texte");
  if (!barre) return;
  barre.style.width = (reste / total * 100) + "%";
  barre.classList.toggle("urgent", reste < total * 0.25);
  txt.textContent = Math.ceil(reste / 1000) + " s";
}

/* ---------- Écran de présentation ---------- */

function ouvrirChampion() {
  arreterChrono();
  preparerSavoir();
  const avecChrono = lire("quiz-chrono") !== "non";
  $("quiz").innerHTML = `
    <div class="c-intro">
      <p class="q-type">Le jeu télé du recueil</p>
      <h2 class="q-accueil-titre">Questions pour un champion du n'importe quoi</h2>
      <ol class="c-manches">
        <li><strong>Neuf points gagnants.</strong> Des questions de tous les genres, fabriquées à partir des textes.
          Plus tu réponds vite, plus tu marques : 3 points en moins de 6 secondes, 2 en moins de 12, 1 sinon.
          Atteins 9 points en ${NEUF.maxQuestions} questions maximum pour te qualifier.</li>
        <li><strong>Quatre à la suite.</strong> Choisis un thème, puis enchaîne quatre bonnes réponses d'affilée
          en moins de ${QUATRE.duree} secondes. Une erreur, et le compteur retombe à zéro.</li>
      </ol>
      <label class="c-option"><input type="checkbox" id="c-chrono" ${avecChrono ? "" : "checked"}> Jouer sans chronomètre
        <span>(chaque bonne réponse vaut alors 2 points, et la finale se joue en ${NEUF.maxQuestions} questions maximum)</span></label>
      <div class="q-actions c-actions-intro">
        <button type="button" class="outil plein q-rejouer" id="c-lancer">Lancer l'émission</button>
        <button type="button" class="outil" id="c-retour">Revenir aux modes</button>
      </div>
      <p class="q-record">${texteRecordChampion()}</p>
    </div>`;
  $("c-lancer").onclick = () => {
    const sansChrono = $("c-chrono").checked;
    ecrire("quiz-chrono", sansChrono ? "non" : "oui");
    demarrerChampion(!sansChrono);
  };
  $("c-retour").onclick = () => { rendreAccueilQuiz(); focaliserQuiz(); };
}

function demarrerChampion(avecChrono) {
  const { tous } = themesDisponibles();
  Object.assign(champion, {
    chrono: avecChrono, phase: "neuf", theme: tous, points: 0, n: 0,
    deja: new Set(), historique: [], suite: 0, meilleureSuite: 0, debutQuatre: 0, tempsQuatre: 0, nQuatre: 0,
  });
  questionSuivante();
}

/* ---------- Les questions ---------- */

function questionSuivante() {
  const q = genererQuestion(champion.theme, champion.deja);
  if (!q) return finirChampion("panne");
  champion.question = q;
  champion.n++;
  if (champion.phase === "quatre") champion.nQuatre++;
  rendreQuestionChampion(q);
  if (champion.phase === "neuf" && champion.chrono) {
    const total = NEUF.dureeQuestion * 1000;
    lancerChrono(total, reste => afficherChrono(reste, total), () => repondreChampion(-1));
  } else if (champion.phase === "quatre" && champion.chrono) {
    chronoEnCours && chronoEnCours.reprendre();
  }
  champion.debutQuestion = performance.now();
  calerQuiz();
}

/* Le chrono tourne : la question et ses réponses doivent être à l'écran tout de suite. */
function calerQuiz() {
  const haut = $("quiz").getBoundingClientRect().top;
  if (haut < 0 || haut > 90) $("quiz").scrollIntoView({ block: "start" });
  const premiere = $("quiz").querySelector(".q-option");
  if (premiere) premiere.focus({ preventScroll: true });
}

function enteteChampion() {
  if (champion.phase === "neuf") {
    return `
      <div class="c-plateau">
        <span class="c-manche">Neuf points gagnants</span>
        <span class="c-compteur"><strong>${champion.points}</strong> / ${NEUF.objectif} points</span>
        <span class="c-question-n">Question ${champion.n} sur ${NEUF.maxQuestions} au maximum</span>
      </div>
      <div class="c-jauge-points"><span style="width:${Math.min(100, champion.points / NEUF.objectif * 100)}%"></span></div>`;
  }
  return `
    <div class="c-plateau">
      <span class="c-manche">Quatre à la suite</span>
      <span class="c-theme">${echappe(champion.theme.nom)}</span>
    </div>
    <div class="c-cases" aria-label="${champion.suite} bonne${champion.suite > 1 ? "s" : ""} réponse${champion.suite > 1 ? "s" : ""} d'affilée sur 4">
      ${[0, 1, 2, 3].map(i => `<span class="${i < champion.suite ? "pleine" : ""}"></span>`).join("")}
    </div>`;
}

function rendreQuestionChampion(q) {
  const chrono = champion.chrono
    ? `<div class="c-chrono"><div class="c-chrono-piste"><span id="c-chrono-barre"></span></div><span id="c-chrono-texte" class="c-chrono-texte"></span></div>`
    : "";
  $("quiz").innerHTML = `
    ${enteteChampion()}
    ${chrono}
    <p class="q-type">${echappe(q.rubrique)}</p>
    <h2 class="q-question c-enonce">${q.enonce}</h2>
    ${q.citation ? `<blockquote class="q-extrait c-citation">${q.citation}</blockquote>` : ""}
    <div class="q-choix">
      ${q.choix.map((c, k) => `<button type="button" class="q-option" data-k="${k}">${echappe(c.label)}</button>`).join("")}
    </div>
    <div class="q-reponse" id="q-reponse" hidden></div>`;
  $("quiz").querySelectorAll(".q-option").forEach(b => b.onclick = () => repondreChampion(Number(b.dataset.k)));
  if (champion.phase === "quatre" && champion.chrono && chronoEnCours) {
    const total = QUATRE.duree * 1000;
    afficherChrono(Math.max(0, total - chronoEnCours.ecoule()), total);
  }
}

function repondreChampion(k) {
  const q = champion.question;
  if (!q || q.repondu) return;
  q.repondu = true;
  const temps = performance.now() - champion.debutQuestion;
  const juste = k >= 0 && q.choix[k].juste;
  let gain = 0;
  if (champion.phase === "neuf") {
    arreterChrono();
    if (juste) gain = champion.chrono ? (temps <= 6000 ? 3 : temps <= 12000 ? 2 : 1) : 2;
    champion.points += gain;
  } else {
    if (chronoEnCours) chronoEnCours.suspendre();
    champion.suite = juste ? champion.suite + 1 : 0;
    champion.meilleureSuite = Math.max(champion.meilleureSuite, champion.suite);
  }
  champion.historique.push({ q, juste, phase: champion.phase, temps, gain, horsDelai: k < 0 });

  // Bonne réponse en vert moutarde, mauvaise barrée
  $("quiz").querySelectorAll(".q-option").forEach((b, j) => {
    b.disabled = true;
    if (q.choix[j].juste) b.classList.add("juste");
    else if (j === k) b.classList.add("faux");
  });
  const verdict = k < 0 ? "Temps écoulé !" : juste ? auHasard(BRAVO) : auHasard(RATE);
  const detail = champion.phase === "neuf"
    ? (juste ? `+${gain} point${gain > 1 ? "s" : ""}${champion.chrono ? ` en ${enSecondes(temps)} s` : ""}.` : "Aucun point.")
    : (juste ? `${champion.suite} sur 4.` : "Le compteur retombe à zéro.");

  const el = $("q-reponse");
  el.hidden = false;
  el.classList.toggle("bonne", juste);

  if (champion.phase === "quatre") {
    // En finale, on enchaîne vite : verdict court, puis question suivante
    el.innerHTML = `<p class="q-verdict">${verdict} <span class="c-detail">${detail}</span></p>`;
    rafraichirCases();
    if (champion.suite >= QUATRE.objectif) return setTimeout(() => finirChampion("champion"), 900);
    if (!champion.chrono && champion.nQuatre >= NEUF.maxQuestions) return setTimeout(() => finirChampion("battu"), 1200);
    return setTimeout(() => { if (champion.phase === "quatre") questionSuivante(); }, juste ? 900 : 1500);
  }

  const qualifie = champion.points >= NEUF.objectif;
  const elimine = !qualifie && champion.n >= NEUF.maxQuestions;
  el.innerHTML = `
    <p class="q-verdict">${verdict} <span class="c-detail">${detail}</span></p>
    <blockquote class="q-extrait">${q.explication}</blockquote>
    <div class="q-actions">
      ${q.texte ? lienVersTexte(q.texte, q.surligner).replace("Lire ce passage", "Relire le passage") : ""}
      <button type="button" class="outil plein" id="q-suivant">${qualifie ? "Passer en finale" : elimine ? "Voir le résultat" : "Question suivante"}</button>
    </div>`;
  const en = $("quiz").querySelector(".c-compteur strong");
  if (en) en.textContent = champion.points;
  const jauge = $("quiz").querySelector(".c-jauge-points span");
  if (jauge) jauge.style.width = Math.min(100, champion.points / NEUF.objectif * 100) + "%";
  $("q-suivant").onclick = () => {
    if (qualifie) return choisirTheme();
    if (elimine) return finirChampion("elimine");
    questionSuivante();
  };
  $("q-suivant").focus({ preventScroll: true });
}

function rafraichirCases() {
  const cases = $("quiz").querySelectorAll(".c-cases span");
  cases.forEach((c, i) => c.classList.toggle("pleine", i < champion.suite));
  const bloc = $("quiz").querySelector(".c-cases");
  if (bloc && champion.suite === 0) { bloc.classList.remove("rate"); void bloc.offsetWidth; bloc.classList.add("rate"); }
}

/* ---------- Choix du thème de la finale ---------- */

function choisirTheme() {
  arreterChrono();
  const { themes } = themesDisponibles();
  const proposes = piocher(themes.filter(th => {
    // Le thème doit pouvoir fournir assez de questions
    const essai = new Set(champion.deja);
    let n = 0;
    for (let i = 0; i < 8 && genererQuestion(th, essai); i++) n++;
    return n >= 6;
  }), 2, th => th.nom);
  $("quiz").innerHTML = `
    <div class="c-qualifie">
      <p class="q-type">Qualifié avec ${champion.points} points</p>
      <h2 class="q-accueil-titre">Finale : Quatre à la suite</h2>
      <p class="q-description">Choisis ton thème. Il faudra ensuite enchaîner quatre bonnes réponses d'affilée${champion.chrono ? `, en moins de ${QUATRE.duree} secondes au total` : ""}.</p>
      <div class="c-themes">
        ${proposes.map((th, i) => `<button type="button" class="q-mode c-theme-choix" data-i="${i}"><span class="q-mode-nom">${echappe(th.nom)}</span></button>`).join("")}
      </div>
    </div>`;
  $("quiz").querySelectorAll(".c-theme-choix").forEach(b => b.onclick = () => {
    Object.assign(champion, { phase: "quatre", theme: proposes[Number(b.dataset.i)], suite: 0, nQuatre: 0 });
    champion.debutQuatre = performance.now();
    if (champion.chrono) {
      const total = QUATRE.duree * 1000;
      lancerChrono(total, reste => afficherChrono(reste, total), () => finirChampion("battu"));
      chronoEnCours.suspendre();
    }
    questionSuivante();
  });
  focaliserQuiz();
  const premier = $("quiz").querySelector(".c-theme-choix");
  if (premier) premier.focus({ preventScroll: true });
}

/* ---------- Résultat ---------- */

function finirChampion(issue) {
  const tempsQuatre = chronoEnCours ? chronoEnCours.ecoule() : performance.now() - champion.debutQuatre;
  arreterChrono();
  champion.phase = "fin";
  const ancien = recordChampion();
  const resultat = issue === "champion" ? { champion: true, temps: champion.chrono ? tempsQuatre : null, points: champion.points } : { champion: false, points: champion.points };
  const meilleur = !ancien
    || (resultat.champion && (!ancien.champion || (resultat.temps && (!ancien.temps || resultat.temps < ancien.temps))))
    || (!resultat.champion && !ancien.champion && resultat.points > ancien.points);
  if (meilleur) ecrire("quiz-record-champion", JSON.stringify(resultat));

  const titres = {
    champion: ["Champion du n'importe quoi", champion.chrono ? `Quatre à la suite en ${enSecondes(tempsQuatre)} secondes. Le jury s'incline, puis se relève pour s'incliner à nouveau.` : "Quatre à la suite sans faiblir. Le jury s'incline, puis se relève pour s'incliner à nouveau."],
    battu: ["Finaliste malheureux", "Qualifié, mais la finale a eu raison de toi. Le multivers retient surtout que tu étais à deux doigts, et il en a 26."],
    elimine: ["Éliminé avec les honneurs", `${champion.points} points sur les 9 nécessaires. Les galaxies stoïciennes commentent : « hmmm ».`],
    panne: ["Plateau en panne", "Le générateur n'a plus trouvé de question inédite. Ajoute des textes ou des fiches au bestiaire pour relancer la machine."],
  };
  const [titre, commentaire] = titres[issue];
  const justes = champion.historique.filter(h => h.juste).length;
  $("quiz").innerHTML = `
    <div class="q-fin">
      <p class="q-type">Fin de l'émission</p>
      <h2 class="q-titre-fin">${titre}</h2>
      <p class="q-description">${commentaire}</p>
      <p class="q-record">${justes} bonne${justes > 1 ? "s" : ""} réponse${justes > 1 ? "s" : ""} sur ${champion.historique.length}, ${champion.points} points en première manche${champion.meilleureSuite >= 2 ? `, meilleure série en finale : ${champion.meilleureSuite}` : ""}.
        ${meilleur ? " Nouveau record !" : ` ${texteRecordChampion()}.`}</p>
      <div class="q-actions">
        <button type="button" class="outil plein q-rejouer" id="c-rejouer">Rejouer</button>
        <button type="button" class="outil" id="q-modes">Changer de mode</button>
      </div>
    </div>
    <h3 class="q-recap-titre">Le récapitulatif</h3>
    <ol class="q-recap">
      ${champion.historique.map(h => `<li class="${h.juste ? "juste" : "faux"}">
        <span class="q-recap-signe" aria-label="${h.juste ? "Bonne réponse" : "Mauvaise réponse"}">${h.juste ? "✓" : "✗"}</span>
        <span class="q-recap-question">${echappe(h.q.rubrique)} : ${h.q.enonce.replace(/<[^>]+>/g, "")}</span>
        <span class="q-recap-texte">Réponse : <strong>${echappe(h.q.choix.find(c => c.juste).label)}</strong>${h.horsDelai ? " (temps écoulé)" : ""}</span>
      </li>`).join("")}
    </ol>`;
  $("c-rejouer").onclick = () => demarrerChampion(champion.chrono);
  $("q-modes").onclick = () => { rendreAccueilQuiz(); focaliserQuiz(); };
  focaliserQuiz();
}
