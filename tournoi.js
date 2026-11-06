/* =========================================================
   LA MÊLÉE DES SOTTISES — tournoi à élimination directe
   - Têtes de série : les histoires les mieux notées au sottisomètre
     sont placées aux quatre coins du tableau (comme au tennis),
     pour ne pas se croiser trop tôt.
   - Si le nombre d'histoires n'est pas une puissance de 2 (16, 32…),
     les moins bien classées passent par des barrages.
   - Chaque duel sort une histoire : 20 textes = 19 duels (+ la petite finale).
   - La perdante reste à l'étage où elle est tombée.
   Les choix restent dans le navigateur et la mêlée est reprenable.
   ========================================================= */

const CLE_TOURNOI = "tournoi-histoires-v2";
const histoiresTournoi = new Map(TEXTES.map(h => [h.id, h]));
const zoneTournoi = $("tournoi");
const annonceTournoi = $("tournoi-annonce");

/* ---------- Têtes de série ---------- */

// Note d'une histoire au sottisomètre « du sens » (LECTURES), si elle existe
function noteDeSerie(h) {
  if (typeof LECTURES === "undefined" || !h.fichier) return null;
  const cle = h.fichier.normalize("NFC");
  const l = Object.entries(LECTURES).find(([f]) => f.normalize("NFC") === cle)?.[1];
  if (!l) return null;
  return (l.demesure + l.collisions + l.serieux + l.precision + l.chute) / 5;
}

// Classe les histoires de la tête de série n°1 à la dernière
function ordreDesTetesDeSerie() {
  const notes = TEXTES.map(h => ({ id: h.id, note: noteDeSerie(h), alea: Math.random() }));
  const avecNotes = notes.some(n => n.note !== null);
  if (!avecNotes) return melanger(TEXTES.map(h => h.id));
  // Une histoire sans analyse reçoit une note moyenne : ni favorite, ni sacrifiée
  const connues = notes.filter(n => n.note !== null).map(n => n.note);
  const moyenne = connues.reduce((s, x) => s + x, 0) / connues.length;
  notes.forEach(n => { if (n.note === null) n.note = moyenne; });
  return notes.sort((a, b) => b.note - a.note || a.alea - b.alea).map(n => n.id);
}

// Ordre des places dans un tableau de taille 2^k : 1 et 2 aux extrémités,
// 3 et 4 en demi-finale, etc. (1, 16, 8, 9, 5, 12, 4, 13, 3, 14, 6, 11, 7, 10, 2, 15)
function placesDuTableau(taille) {
  let places = [1];
  while (places.length < taille) {
    const n = places.length * 2 + 1;
    places = places.flatMap(p => [p, n - p]);
  }
  return places;
}

/* ---------- Les tours ---------- */

function nomDuTour(nbHistoires, barrage) {
  if (barrage) return "Barrages";
  return { 2: "Finale", 4: "Demi-finales", 8: "Quarts de finale", 16: "Huitièmes de finale", 32: "Seizièmes de finale", 64: "Trente-deuxièmes de finale" }[nbHistoires]
    || nbHistoires + "es de finale";
}

function creerTournoi() {
  const series = ordreDesTetesDeSerie();
  const n = series.length;
  let taille = 1;
  while (taille * 2 <= n) taille *= 2;          // 20 histoires → tableau de 16
  const nbBarrages = n - taille;                // 20 - 16 = 4 barrages
  const tours = [];
  // Barrages : les 2 × nbBarrages dernières têtes de série s'affrontent
  // (13 contre 20, 14 contre 19…) ; la gagnante prend la place de la mieux classée.
  const directes = taille - nbBarrages;
  if (nbBarrages > 0) {
    const duels = [];
    for (let i = 0; i < nbBarrages; i++) {
      duels.push({ a: series[directes + i], b: series[n - 1 - i], gagnant: null, place: directes + i + 1 });
    }
    tours.push({ nom: nomDuTour(0, true), barrage: true, duels });
  }
  const tournoi = {
    version: 2,
    series,
    taille,
    tours,
    petiteFinale: null,
    duelsJoues: 0,
    totalDuels: (n - 1) + (n >= 4 ? 1 : 0),
    fini: false
  };
  if (!nbBarrages) lancerTableau(tournoi);
  return tournoi;
}

// Le premier tour du tableau principal, une fois les barrages joués
function lancerTableau(tournoi) {
  const occupant = new Map();                  // place (tête de série) → id de l'histoire
  tournoi.series.forEach((id, i) => { if (i < tournoi.taille) occupant.set(i + 1, id); });
  const barrage = tournoi.tours.find(t => t.barrage);
  if (barrage) barrage.duels.forEach(d => occupant.set(d.place, d.gagnant));
  const places = placesDuTableau(tournoi.taille);
  const duels = [];
  for (let i = 0; i < places.length; i += 2) {
    duels.push({ a: occupant.get(places[i]), b: occupant.get(places[i + 1]), gagnant: null });
  }
  tournoi.tours.push({ nom: nomDuTour(tournoi.taille), duels });
}

function tourEnCours(tournoi) {
  return tournoi.tours[tournoi.tours.length - 1];
}

// Le prochain duel à jouer (dans l'ordre : tour en cours, puis petite finale avant la finale)
function prochainDuel(tournoi) {
  if (tournoi.fini) return null;
  const tour = tourEnCours(tournoi);
  if (tournoi.petiteFinale && !tournoi.petiteFinale.gagnant) {
    return { duel: tournoi.petiteFinale, nom: "Petite finale", indice: 0, nb: 1 };
  }
  const i = tour.duels.findIndex(d => !d.gagnant);
  return i < 0 ? null : { duel: tour.duels[i], nom: tour.nom, indice: i, nb: tour.duels.length };
}

function avancerTournoi(tournoi) {
  const tour = tourEnCours(tournoi);
  if (tour.duels.some(d => !d.gagnant)) return;
  if (tournoi.petiteFinale && !tournoi.petiteFinale.gagnant) return;
  if (tour.barrage) return lancerTableau(tournoi);
  const gagnants = tour.duels.map(d => d.gagnant);
  if (gagnants.length === 1) { tournoi.fini = true; return; }
  // Après les demi-finales : petite finale entre les deux perdantes
  if (gagnants.length === 2 && tournoi.series.length >= 4 && !tournoi.petiteFinale) {
    const perdants = tour.duels.map(d => d.gagnant === d.a ? d.b : d.a);
    tournoi.petiteFinale = { a: perdants[0], b: perdants[1], gagnant: null };
  }
  const duels = [];
  for (let i = 0; i < gagnants.length; i += 2) duels.push({ a: gagnants[i], b: gagnants[i + 1], gagnant: null });
  tournoi.tours.push({ nom: nomDuTour(gagnants.length), duels });
}

/* ---------- Classement final ---------- */

// Chaque histoire reste à l'étage où elle est tombée ; les ex aequo partagent le même rang.
function classementFinal(tournoi) {
  const finale = tourEnCours(tournoi).duels[0];
  const lignes = [];
  const ajouter = (ids, rangDebut) => {
    const triees = ids.slice().sort((a, b) => tournoi.series.indexOf(a) - tournoi.series.indexOf(b));
    triees.forEach(id => lignes.push({ id, rang: rangDebut, nb: ids.length }));
  };
  ajouter([finale.gagnant], 1);
  ajouter([finale.gagnant === finale.a ? finale.b : finale.a], 2);
  let rang = 3;
  if (tournoi.petiteFinale) {
    const pf = tournoi.petiteFinale;
    ajouter([pf.gagnant], 3);
    ajouter([pf.gagnant === pf.a ? pf.b : pf.a], 4);
    rang = 5;
  }
  // Puis les éliminées de chaque tour, du plus tardif au plus précoce (sans la finale ni les demies déjà placées)
  const tours = tournoi.tours.slice(0, -1).reverse();
  for (const tour of tours) {
    if (tournoi.petiteFinale && tour.duels.length === 2 && !tour.barrage) continue;
    const perdants = tour.duels.map(d => d.gagnant === d.a ? d.b : d.a);
    ajouter(perdants, rang);
    rang += perdants.length;
  }
  return lignes;
}

const libelleRang = (rang, nb) => nb > 1 ? rang + "e–" + (rang + nb - 1) + "e" : (rang === 1 ? "1er" : rang + "e");

/* ---------- Sauvegarde ---------- */

function etatTournoiValide(etat) {
  if (!etat || etat.version !== 2 || !Array.isArray(etat.series) || !Array.isArray(etat.tours)) return false;
  const ids = TEXTES.map(h => h.id);
  if (etat.series.length !== ids.length || !ids.every(id => etat.series.includes(id))) return false;
  return etat.tours.every(t => Array.isArray(t.duels) && t.duels.every(d => histoiresTournoi.has(d.a) && histoiresTournoi.has(d.b)));
}

function lireEtatTournoi() {
  try {
    const etat = JSON.parse(lire(CLE_TOURNOI) || "null");
    return etatTournoiValide(etat) ? etat : null;
  } catch (e) {
    return null;
  }
}

let tournoi = lireEtatTournoi();

function enregistrerTournoi() {
  if (tournoi) ecrire(CLE_TOURNOI, JSON.stringify(tournoi));
}

/* ---------- Affichage ---------- */

function annoncerTournoi(texte) {
  annonceTournoi.textContent = texte;
}

function rendreAccueilTournoi() {
  const peutReprendre = tournoi && !tournoi.fini;
  const dejaFini = tournoi && tournoi.fini;
  const n = TEXTES.length;
  let taille = 1;
  while (taille * 2 <= n) taille *= 2;
  const nbBarrages = n - taille;
  const total = (n - 1) + (n >= 4 ? 1 : 0);
  const bouton = peutReprendre ? "Retourner dans la mêlée" : "Entrer dans la mêlée";
  let resume = "";

  if (peutReprendre) {
    resume = '<p class="tournoi-aide">Tu en es au duel ' + (tournoi.duelsJoues + 1) + " sur " + tournoi.totalDuels +
      " (" + echappe(prochainDuel(tournoi).nom.toLowerCase()) + ").</p>";
  } else if (dejaFini) {
    resume = '<p class="tournoi-aide">Ton précédent classement est prêt. Tu peux le revoir ou repartir de zéro.</p>';
  } else {
    resume = '<p class="tournoi-aide">' + (typeof LECTURES !== "undefined"
      ? "Les têtes de série sont tirées du sottisomètre : les histoires les mieux notées ne se croisent pas avant les demi-finales."
      : "Le tableau est tiré au sort.") + " Tes choix sont enregistrés sur cet appareil.</p>";
  }

  zoneTournoi.innerHTML =
    '<div class="tournoi-accueil">' +
      '<p class="tournoi-nombre" aria-hidden="true">' + total + "</p>" +
      "<h2>" + total + " duels, une seule couronne</h2>" +
      "<p>Élimination directe : à chaque duel, l’histoire que tu choisis passe au tour suivant, l’autre reste à l’étage où elle est tombée." +
      (nbBarrages ? " Avec " + n + " histoires, " + nbBarrages * 2 + (typeof LECTURES !== "undefined" ? " têtes de série parmi les moins bien classées" : " histoires tirées au sort") + " commencent par des barrages pour remplir un tableau de " + taille + "." : "") +
      " Une petite finale départage la 3e place.</p>" +
      resume +
      '<div class="tournoi-actions">' +
        '<button type="button" class="outil plein" id="tournoi-demarrer">' + (dejaFini ? "Revoir mon classement" : bouton) + "</button>" +
        (peutReprendre || dejaFini ? '<button type="button" class="outil" id="tournoi-reinitialiser">Repartir de zéro</button>' : "") +
      "</div>" +
    "</div>";

  $("tournoi-demarrer").onclick = () => {
    if (dejaFini) return rendreResultatTournoi();
    if (!tournoi) tournoi = creerTournoi();
    enregistrerTournoi();
    annoncerTournoi("La mêlée commence. Choisis l’histoire que tu préfères dans ce duel.");
    rendreDuelTournoi();
  };
  const reset = $("tournoi-reinitialiser");
  if (reset) reset.onclick = demanderReinitialisationTournoi;
}

function carteDuelTournoi(histoire, autre) {
  const titre = echappe(histoire.titre);
  const auteur = echappe(histoire.auteur);
  const resume = echappe(histoire.resume || "Le résumé officiel attend encore son heure de gloire.");
  const serie = tournoi.series.indexOf(histoire.id) + 1;
  const badge = typeof LECTURES !== "undefined" && serie <= 4
    ? '<span class="tournoi-serie">Tête de série n°' + serie + "</span>" : "";
  return '<article class="tournoi-carte">' +
    '<button type="button" class="tournoi-choix" data-choix="' + histoire.id +
      '" aria-label="Je préfère « ' + titre + ' » à « ' + echappe(autre.titre) + ' »">' +
      '<span class="tournoi-auteur">' + auteur + "</span>" + badge +
      '<span class="tournoi-titre-carte">' + titre + "</span>" +
      '<span class="tournoi-resume">' + resume + "</span>" +
      '<span class="tournoi-choix-libelle">Je choisis cette histoire</span>' +
    "</button>" +
    '<a class="tournoi-relire" href="index.html#' + histoire.id + '" target="_blank" rel="noopener">Relire « ' + titre + " »</a>" +
  "</article>";
}

function rendreDuelTournoi() {
  if (!tournoi || tournoi.fini) return rendreResultatTournoi();
  const p = prochainDuel(tournoi);
  const a = histoiresTournoi.get(p.duel.a), b = histoiresTournoi.get(p.duel.b);
  // On mélange les côtés pour ne pas avantager toujours la tête de série
  const [gauche, droite] = (tournoi.duelsJoues + p.indice) % 2 ? [b, a] : [a, b];
  const pourcentage = Math.round(tournoi.duelsJoues / tournoi.totalDuels * 100);
  const enjeu = { "Finale": "La couronne est en jeu.", "Petite finale": "Pour la 3e place du podium.", "Demi-finales": "La gagnante file en finale." }[p.nom]
    || "La perdante s’arrête ici.";

  zoneTournoi.innerHTML =
    '<div class="tournoi-entete">' +
      "<span><strong>" + echappe(p.nom) + "</strong>" + (p.nb > 1 ? " · duel " + (p.indice + 1) + " sur " + p.nb : "") + "</span>" +
      "<span>Duel " + (tournoi.duelsJoues + 1) + " sur " + tournoi.totalDuels + "</span>" +
    "</div>" +
    '<div class="tournoi-progression" role="progressbar" aria-label="Duels joués" aria-valuemin="0" aria-valuemax="' +
      tournoi.totalDuels + '" aria-valuenow="' + tournoi.duelsJoues + '">' +
      '<span style="width:' + pourcentage + '%"></span>' +
    "</div>" +
    '<div class="tournoi-question">' +
      "<h2>Laquelle tu préfères ?</h2>" +
      "<p>" + enjeu + " Tu peux relire un texte dans un nouvel onglet.</p>" +
    "</div>" +
    '<div class="tournoi-duel">' +
      carteDuelTournoi(gauche, droite) +
      '<div class="tournoi-vs" aria-hidden="true">OU</div>' +
      carteDuelTournoi(droite, gauche) +
    "</div>" +
    '<div class="tournoi-reinitialiser"><button type="button" class="q-oubli" id="tournoi-reinitialiser">Effacer mes choix et recommencer</button></div>';

  zoneTournoi.querySelectorAll("[data-choix]").forEach(bouton => {
    bouton.onclick = () => choisirHistoireTournoi(bouton.dataset.choix);
  });
  $("tournoi-reinitialiser").onclick = demanderReinitialisationTournoi;
}

function choisirHistoireTournoi(choixId) {
  if (!tournoi || tournoi.fini) return;
  const p = prochainDuel(tournoi);
  if (!p || (choixId !== p.duel.a && choixId !== p.duel.b)) return;
  const nomTour = p.nom;
  p.duel.gagnant = choixId;
  tournoi.duelsJoues++;
  const tourAvant = tournoi.tours.length;
  avancerTournoi(tournoi);
  enregistrerTournoi();

  if (tournoi.fini) {
    annoncerTournoi("La mêlée est terminée en " + tournoi.duelsJoues + " duels.");
    rendreResultatTournoi();
  } else {
    const suivant = prochainDuel(tournoi);
    const singulier = nom => nom === "Finale" || nom === "Petite finale";
    annoncerTournoi(tournoi.tours.length > tourAvant || suivant.nom !== nomTour
      ? nomTour + (singulier(nomTour) ? " terminée" : " terminés") + ". Place " +
        (singulier(suivant.nom) ? "à la " : "aux ") + suivant.nom.toLowerCase() + " !"
      : "Choix enregistré. " + suivant.nom + ", duel " + (suivant.indice + 1) + " sur " + suivant.nb + ".");
    rendreDuelTournoi();
    annonceTournoi.scrollIntoView({ block: "start", behavior: "auto" });
  }
}

function rendreTableau() {
  const tours = tournoi.tours.map(t => ({ nom: t.nom, duels: t.duels }));
  if (tournoi.petiteFinale) tours.splice(tours.length - 1, 0, { nom: "Petite finale", duels: [tournoi.petiteFinale] });
  return '<div class="tournoi-tableau">' + tours.map(t =>
    '<section class="tt-tour"><h4>' + echappe(t.nom) + "</h4><ul>" + t.duels.map(d =>
      "<li>" + [d.a, d.b].map(id => '<span class="' + (id === d.gagnant ? "tt-gagnant" : "tt-perdant") + '">' +
        echappe(titreCourtTournoi(histoiresTournoi.get(id).titre)) + "</span>").join('<span class="tt-vs">contre</span>') + "</li>"
    ).join("") + "</ul></section>"
  ).join("") + "</div>";
}

function titreCourtTournoi(titre, n = 42) {
  return titre.length > n ? titre.slice(0, titre.lastIndexOf(" ", n)) + "…" : titre;
}

function rendreResultatTournoi() {
  const lignes = classementFinal(tournoi);
  const vainqueur = histoiresTournoi.get(lignes[0].id);
  const html = lignes.map(({ id, rang, nb }) => {
    const h = histoiresTournoi.get(id);
    return '<li class="tournoi-ligne' + (rang <= 3 ? " tournoi-podium" : "") + '">' +
      '<span class="tournoi-rang" aria-label="Place ' + libelleRang(rang, nb) + '">' + libelleRang(rang, nb) + "</span>" +
      '<div><strong class="tournoi-resultat-titre">' + echappe(h.titre) +
        '<span class="tournoi-resultat-auteur">' + echappe(h.auteur) + "</span></strong>" +
        (rang <= 4 ? '<p class="tournoi-resultat-resume">' + echappe(h.resume || "") + "</p>" : "") + "</div>" +
      '<a class="tournoi-lire" href="index.html#' + h.id + '">Lire</a>' +
    "</li>";
  }).join("");

  zoneTournoi.innerHTML =
    '<div class="tournoi-finale">' +
      '<p class="sur-titre-quiz">🏆 Le podium du n’importe quoi</p>' +
      "<h2>La sottise couronnée est…</h2>" +
      '<p class="tournoi-vainqueur">' + echappe(vainqueur.titre) + "</p>" +
      '<p class="tournoi-finale-intro">' + TEXTES.length + " histoires, " + tournoi.duelsJoues +
        " duels, une seule survivante. Les autres restent à l’étage où elles sont tombées.</p>" +
      '<h3 class="q-recap-titre">Ton classement</h3>' +
      '<ol class="tournoi-classement" aria-label="Classement final des histoires">' + html + "</ol>" +
      '<details class="tournoi-revoir"><summary>Revoir tout le tableau</summary>' + rendreTableau() + "</details>" +
      '<div class="tournoi-actions"><button type="button" class="outil plein" id="tournoi-reinitialiser">Retourner dans la mêlée</button></div>' +
    "</div>";

  $("tournoi-reinitialiser").onclick = demanderReinitialisationTournoi;
}

function demanderReinitialisationTournoi() {
  if (!window.confirm("Effacer ce classement et recommencer la mêlée depuis le début ?")) return;
  try { localStorage.removeItem(CLE_TOURNOI); } catch (e) { }
  tournoi = null;
  annoncerTournoi("Classement effacé.");
  rendreAccueilTournoi();
}

if (tournoi && tournoi.fini) rendreResultatTournoi();
else rendreAccueilTournoi();

(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => dessinerLogo($("logo-mot")));
