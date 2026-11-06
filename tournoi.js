/* =========================================================
   TOURNOI DES HISTOIRES
   Un tri par duels place chaque récit dans un classement complet.
   Les choix restent dans le navigateur et le tournoi est reprenable.
   ========================================================= */

const CLE_TOURNOI = "tournoi-histoires-v1";
const histoiresTournoi = new Map(TEXTES.map(h => [h.id, h]));
const zoneTournoi = $("tournoi");
const annonceTournoi = $("tournoi-annonce");

function etatTournoiValide(etat) {
  if (!etat || etat.version !== 1 || !Array.isArray(etat.ordre) || !Array.isArray(etat.classement)) return false;
  const ids = TEXTES.map(h => h.id);
  const ensemble = new Set(ids);
  if (etat.ordre.length !== ids.length || new Set(etat.ordre).size !== ids.length) return false;
  if (!etat.ordre.every(id => ensemble.has(id))) return false;
  if (etat.prochain < 1 || etat.prochain > ids.length || etat.classement.length !== etat.prochain) return false;
  if (new Set(etat.classement).size !== etat.classement.length || !etat.classement.every(id => ensemble.has(id))) return false;
  if (!Number.isInteger(etat.bas) || !Number.isInteger(etat.haut) || etat.bas < 0 || etat.haut < etat.bas || etat.haut > etat.classement.length) return false;
  if (!Number.isInteger(etat.duels) || etat.duels < 0 || typeof etat.fini !== "boolean") return false;
  if (etat.fini) return etat.prochain === ids.length && etat.classement.length === ids.length;
  if (etat.comparaison) {
    const c = etat.comparaison;
    if (!Number.isInteger(c.milieu) || c.milieu < etat.bas || c.milieu >= etat.haut) return false;
    if (c.adversaireId !== etat.classement[c.milieu]) return false;
    if (c.coteCandidat !== "gauche" && c.coteCandidat !== "droite") return false;
  }
  return true;
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

function creerTournoi() {
  const ordre = melanger(TEXTES.map(h => h.id));
  return {
    version: 1,
    ordre,
    classement: [ordre[0]],
    prochain: 1,
    bas: 0,
    haut: 1,
    duels: 0,
    comparaison: null,
    fini: false
  };
}

function preparerDuelTournoi() {
  while (tournoi.prochain < tournoi.ordre.length && tournoi.bas === tournoi.haut) {
    tournoi.classement.splice(tournoi.bas, 0, tournoi.ordre[tournoi.prochain]);
    tournoi.prochain++;
    tournoi.bas = 0;
    tournoi.haut = tournoi.classement.length;
    tournoi.comparaison = null;
  }

  if (tournoi.prochain >= tournoi.ordre.length) {
    tournoi.fini = true;
    tournoi.comparaison = null;
    enregistrerTournoi();
    return;
  }

  const milieu = Math.floor((tournoi.bas + tournoi.haut) / 2);
  const adversaireId = tournoi.classement[milieu];
  const actuelle = tournoi.comparaison;
  if (!actuelle || actuelle.milieu !== milieu || actuelle.adversaireId !== adversaireId) {
    tournoi.comparaison = {
      milieu,
      adversaireId,
      coteCandidat: Math.random() < 0.5 ? "gauche" : "droite"
    };
  }
  enregistrerTournoi();
}

function annoncerTournoi(texte) {
  annonceTournoi.textContent = texte;
}

function rendreAccueilTournoi() {
  const peutReprendre = tournoi && !tournoi.fini;
  const dejaFini = tournoi && tournoi.fini;
  const dejaClassees = tournoi ? tournoi.classement.length : 0;
  const bouton = peutReprendre ? "Reprendre le tournoi" : "Lancer le tournoi";
  let resume = "";

  if (peutReprendre) {
    resume = '<p class="tournoi-aide">Tu as déjà placé ' + dejaClassees + " histoire" + (dejaClassees > 1 ? "s" : "") +
      " sur " + TEXTES.length + " ; " + tournoi.duels + " duel" + (tournoi.duels > 1 ? "s ont été joués" : " a été joué") + ".</p>";
  } else if (dejaFini) {
    resume = '<p class="tournoi-aide">Ton précédent classement est prêt. Tu peux le revoir ou repartir de zéro.</p>';
  } else {
    resume = '<p class="tournoi-aide">Les résumés servent de cartes de duel. Tes choix forment un classement personnel enregistré sur cet appareil.</p>';
  }

  zoneTournoi.innerHTML =
    '<div class="tournoi-accueil">' +
      '<p class="tournoi-nombre" aria-hidden="true">' + TEXTES.length + "</p>" +
      '<h2>Le grand face-à-face du recueil</h2>' +
      '<p>Deux histoires se présentent. Tu en choisis une. Elle avance dans le classement, l’autre attend son prochain duel. À la fin, tout le monde a sa place — même le récit qui sort du premier round.</p>' +
      resume +
      '<div class="tournoi-actions">' +
        '<button type="button" class="outil plein" id="tournoi-demarrer">' + bouton + "</button>" +
        (peutReprendre || dejaFini ? '<button type="button" class="outil" id="tournoi-reinitialiser">Repartir de zéro</button>' : "") +
      "</div>" +
    "</div>";

  $("tournoi-demarrer").onclick = () => {
    if (!tournoi || tournoi.fini) {
      tournoi = creerTournoi();
      preparerDuelTournoi();
    }
    annoncerTournoi("Le tournoi reprend. Choisis l’histoire que tu préfères dans ce duel.");
    rendreDuelTournoi();
  };
  const reset = $("tournoi-reinitialiser");
  if (reset) reset.onclick = demanderReinitialisationTournoi;
}

function carteDuelTournoi(histoire, autre) {
  const titre = echappe(histoire.titre);
  const auteur = echappe(histoire.auteur);
  const resume = echappe(histoire.resume || "Le résumé officiel attend encore son heure de gloire.");
  return '<article class="tournoi-carte">' +
    '<button type="button" class="tournoi-choix" data-choix="' + histoire.id +
      '" aria-label="Je préfère « ' + titre + ' » à « ' + echappe(autre.titre) + ' »">' +
      '<span class="tournoi-auteur">' + auteur + "</span>" +
      '<span class="tournoi-titre-carte">' + titre + "</span>" +
      '<span class="tournoi-resume">' + resume + "</span>" +
      '<span class="tournoi-choix-libelle">Je choisis cette histoire</span>' +
    "</button>" +
    '<a class="tournoi-relire" href="index.html#' + histoire.id + '" target="_blank" rel="noopener">Relire « ' + titre + " »</a>" +
  "</article>";
}

function rendreDuelTournoi() {
  if (!tournoi || tournoi.fini) return rendreResultatTournoi();
  if (!tournoi.comparaison) preparerDuelTournoi();
  if (tournoi.fini) return rendreResultatTournoi();

  const candidat = histoiresTournoi.get(tournoi.ordre[tournoi.prochain]);
  const adversaire = histoiresTournoi.get(tournoi.comparaison.adversaireId);
  const gauche = tournoi.comparaison.coteCandidat === "gauche" ? candidat : adversaire;
  const droite = tournoi.comparaison.coteCandidat === "gauche" ? adversaire : candidat;
  const places = tournoi.classement.length;
  const pourcentage = Math.round(places / TEXTES.length * 100);
  const prochaineHistoire = Math.min(tournoi.prochain + 1, TEXTES.length);

  zoneTournoi.innerHTML =
    '<div class="tournoi-entete">' +
      "<span><strong>Duel " + (tournoi.duels + 1) + "</strong></span>" +
      "<span>Histoire " + prochaineHistoire + " sur " + TEXTES.length + " en cours de classement</span>" +
    "</div>" +
    '<div class="tournoi-progression" role="progressbar" aria-label="Histoires déjà placées dans le classement" aria-valuemin="0" aria-valuemax="' +
      TEXTES.length + '" aria-valuenow="' + places + '" aria-valuetext="' + places + " sur " + TEXTES.length + ' histoires placées">' +
      '<span style="width:' + pourcentage + '%"></span>' +
    "</div>" +
    '<div class="tournoi-question">' +
      "<h2>Laquelle tu préfères ?</h2>" +
      "<p>Choisis celle qui mérite la meilleure place. Tu peux relire un texte dans un nouvel onglet.</p>" +
    "</div>" +
    '<div class="tournoi-duel">' +
      carteDuelTournoi(gauche, droite) +
      '<div class="tournoi-vs" aria-hidden="true">OU</div>' +
      carteDuelTournoi(droite, gauche) +
    "</div>" +
    '<div class="tournoi-reinitialiser"><button type="button" class="q-oubli" id="tournoi-reinitialiser">Effacer mes choix et recommencer</button></div>";

  zoneTournoi.querySelectorAll("[data-choix]").forEach(bouton => {
    bouton.onclick = () => choisirHistoireTournoi(bouton.dataset.choix);
  });
  $("tournoi-reinitialiser").onclick = demanderReinitialisationTournoi;
  annoncerTournoi("Duel " + (tournoi.duels + 1) + ". Histoire " + prochaineHistoire + " sur " + TEXTES.length + " en cours de classement.");
}

function choisirHistoireTournoi(choixId) {
  if (!tournoi || tournoi.fini || !tournoi.comparaison) return;
  const candidatId = tournoi.ordre[tournoi.prochain];
  if (choixId === candidatId) {
    tournoi.haut = tournoi.comparaison.milieu;
  } else if (choixId === tournoi.comparaison.adversaireId) {
    tournoi.bas = tournoi.comparaison.milieu + 1;
  } else {
    return;
  }

  tournoi.duels++;
  tournoi.comparaison = null;
  preparerDuelTournoi();

  if (tournoi.fini) {
    annoncerTournoi("Classement terminé en " + tournoi.duels + " duels. Le top 20 est prêt.");
    rendreResultatTournoi();
  } else {
    annoncerTournoi("Choix enregistré. Duel " + (tournoi.duels + 1) + " : une nouvelle histoire se place dans le top.");
    rendreDuelTournoi();
  }
}

function rendreResultatTournoi() {
  const vainqueur = histoiresTournoi.get(tournoi.classement[0]);
  const lignes = tournoi.classement.map((id, i) => {
    const h = histoiresTournoi.get(id);
    return '<li class="tournoi-ligne">' +
      '<span class="tournoi-rang" aria-label="Place ' + (i + 1) + '">' + String(i + 1).padStart(2, "0") + "</span>" +
      '<div><strong class="tournoi-resultat-titre">' + echappe(h.titre) +
        '<span class="tournoi-resultat-auteur">' + echappe(h.auteur) + "</span></strong>" +
        '<p class="tournoi-resultat-resume">' + echappe(h.resume || "") + "</p></div>" +
      '<a class="tournoi-lire" href="index.html#' + h.id + '">Lire</a>' +
    "</li>";
  }).join("");

  zoneTournoi.innerHTML =
    '<div class="tournoi-finale">' +
      '<p class="sur-titre-quiz">🏆 Le podium du n’importe quoi</p>' +
      "<h2>Ton numéro un est…</h2>" +
      '<p class="tournoi-vainqueur">' + echappe(vainqueur.titre) + "</p>" +
      '<p class="tournoi-finale-intro">Tu as départagé les vingt histoires en ' + tournoi.duels + " duels. Voici ton classement personnel ; chaque place vient de tes choix.</p>" +
      '<h3 class="q-recap-titre">Le top 20 du recueil</h3>' +
      '<ol class="tournoi-classement" aria-label="Classement final des histoires">' + lignes + "</ol>" +
      '<div class="tournoi-actions"><button type="button" class="outil plein" id="tournoi-reinitialiser">Rejouer le tournoi</button></div>' +
    "</div>";

  $("tournoi-reinitialiser").onclick = demanderReinitialisationTournoi;
  annoncerTournoi("Classement terminé en " + tournoi.duels + " duels. Le top 20 est prêt.");
}

function demanderReinitialisationTournoi() {
  if (!window.confirm("Effacer ce classement et recommencer le tournoi depuis le début ?")) return;
  try { localStorage.removeItem(CLE_TOURNOI); } catch (e) { }
  tournoi = null;
  annoncerTournoi("Classement effacé.");
  rendreAccueilTournoi();
}

if (tournoi && !tournoi.fini && !tournoi.comparaison) preparerDuelTournoi();
if (tournoi && tournoi.fini) rendreResultatTournoi();
else rendreAccueilTournoi();
