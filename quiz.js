/* =========================================================
   QUIZ DU BESTIAIRE (page quiz.html)
   Les questions se fabriquent toutes seules à partir du bestiaire
   et des textes (donnees.js) : rien à écrire à la main.
   ========================================================= */

const MODES = [
  { id: "express", nom: "Express", nb: 5, description: "Cinq questions, le temps d'un café." },
  { id: "classique", nom: "Classique", nb: 10, description: "Dix questions, la partie normale." },
  { id: "marathon", nom: "Marathon", nb: 20, description: "Vingt questions, pour les vrais érudits." },
];

const BRAVO = ["Bien vu.", "Exactement.", "Évidemment.", "Hmmm. Approbation stoïcienne.", "Parfait, et je dis bien parfait."];
const RATE = ["Raté.", "Perdu dans le multivers.", "Pas du tout.", "Même les gobelins à carreaux le savaient."];

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
  const tout = fichesJouables();
  let vues = fichesVues();
  let jamais = tout.filter(c => !vues.has(c.f.id));
  // Tout a déjà été vu : on repart de zéro
  if (jamais.length === 0) { ecrire("quiz-vues", "[]"); vues = new Set(); jamais = tout; }
  // D'abord les fiches jamais vues, puis les autres si ça ne suffit pas
  const choisies = [...melanger(jamais), ...melanger(tout.filter(c => vues.has(c.f.id)))].slice(0, mode.nb);
  quiz.questions = choisies.map(({ f, textes }) => {
    const bonne = auHasard(textes);
    const leurres = melanger(tout.remplis.filter(t => !textes.includes(t))).slice(0, 3);
    return { f, bonne, choix: melanger([bonne, ...leurres]) };
  });
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
  const tout = fichesJouables();
  const vues = fichesVues();
  const restantes = tout.filter(c => !vues.has(c.f.id)).length;
  $("quiz").innerHTML = `
    <div class="q-accueil">
      <h2 class="q-accueil-titre">Choisissez votre partie</h2>
      <p class="q-description">À chaque question, une fiche du bestiaire et quatre histoires. Une seule est la bonne.</p>
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
        ${restantes === tout.length
          ? `${tout.length} fiches à découvrir, piochées d'abord parmi celles que vous n'avez jamais vues.`
          : `Encore <strong>${restantes}</strong> fiche${restantes > 1 ? "s" : ""} jamais vue${restantes > 1 ? "s" : ""} sur ${tout.length}.
             <button type="button" class="q-oubli" id="q-oubli">Tout oublier</button>`}
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
    $("quiz").innerHTML = `<p class="q-vide">Pas assez de fiches reliées à des textes pour lancer un quiz. Ajoutez des fiches au bestiaire, ou des textes au recueil.</p>`;
    return;
  }
  if (quiz.fini) return rendreFinQuiz();
  const q = quiz.questions[quiz.i], n = quiz.questions.length;
  $("quiz").innerHTML = `
    <div class="q-entete">
      <span>${echappe(quiz.mode.nom)}, question ${quiz.i + 1} sur ${n}</span>
      <span class="q-serie" id="q-serie"></span>
      <span>Score : <strong id="q-score">${quiz.score}</strong></span>
    </div>
    <div class="q-progression"><span style="width:${quiz.i / n * 100}%"></span></div>
    <p class="q-type">${echappe(q.f.type)}</p>
    <h2 class="q-question">Dans quelle histoire trouve-t-on <span class="q-nom">${echappe(q.f.nom)}</span> ?</h2>
    <div class="q-choix">
      ${q.choix.map((t, k) => `<button type="button" class="q-option" data-k="${k}">${echappe(t.titre)}</button>`).join("")}
    </div>
    <div class="q-reponse" id="q-reponse" hidden></div>`;
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
  marquerVue(q.f.id);
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
  const passage = passageDeLaFiche(q.f, q.bonne);
  const derniere = quiz.i === quiz.questions.length - 1;
  const el = $("q-reponse");
  el.hidden = false;
  el.classList.toggle("bonne", juste);
  el.innerHTML = `
    <p class="q-verdict">${juste ? auHasard(BRAVO) : `${auHasard(RATE)} C'était <em>${echappe(q.bonne.titre)}</em>.`}</p>
    <p class="q-description">${echappe(q.f.description)}</p>
    ${passage ? `<blockquote class="q-extrait">${passage.html}</blockquote>` : ""}
    <div class="q-actions">
      ${lienVersTexte(q.bonne, passage && passage.mot)}
      <a class="q-lien" href="index.html#${q.f.id}">Voir la fiche</a>
      <button type="button" class="outil plein" id="q-suivant">${derniere ? "Voir mon score" : "Question suivante"}</button>
    </div>`;
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
    : ratio >= .7 ? "Vous connaissez le recueil mieux que ses auteurs, ce qui n'est pas très difficile."
    : ratio >= .4 ? "Honorable. Une relecture attentive et quelques années-lumière de plus feront l'affaire."
    : "Le recueil vous attend. Commencez par un texte au hasard et laissez-vous dériver.";
  $("quiz").innerHTML = `
    <div class="q-fin">
      <p class="q-type">Score final, partie ${echappe(quiz.mode.nom.toLowerCase())}</p>
      <p class="q-score">${s}<small>/${n}</small></p>
      <h2 class="q-titre-fin">${titre}</h2>
      <p class="q-description">${commentaire}</p>
      <p class="q-record">${nouveauRecord ? `Nouveau record ! L'ancien était de ${ancien}/${n}.` : `Votre record : ${Math.max(ancien, s)}/${n}.`}
        ${quiz.meilleureSerie >= 2 ? ` Meilleure série : ${quiz.meilleureSerie} d'affilée.` : ""}</p>
      <div class="q-actions">
        <button type="button" class="outil plein q-rejouer" id="q-rejouer">Rejouer en ${echappe(quiz.mode.nom.toLowerCase())}</button>
        <button type="button" class="outil" id="q-modes">Changer de partie</button>
      </div>
    </div>
    <h3 class="q-recap-titre">Le récapitulatif</h3>
    <ol class="q-recap">
      ${quiz.questions.map((q, i) => {
        const juste = q.choix[quiz.reponses[i]] === q.bonne;
        return `<li class="${juste ? "juste" : "faux"}">
          <span class="q-recap-signe" aria-label="${juste ? "Bonne réponse" : "Mauvaise réponse"}">${juste ? "✓" : "✗"}</span>
          <a href="index.html#${q.f.id}">${echappe(q.f.nom)}</a>
          <span class="q-recap-texte">dans ${lienVersTexte(q.bonne, (q.f.mots.find(m => occurrencesReference(q.bonne.contenu, m).length)) || "").replace("Lire ce passage", echappe(q.bonne.titre))}</span>
        </li>`;
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
