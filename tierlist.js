/* =========================================================
   LA TIER LIST DES SOTTISES
   Chacun range les histoires dans ses étages, de S à D.
   - Glisser-déposer à la souris, ou appui long puis glisser au doigt
   - Ou : toucher une histoire, puis toucher l'étage où la poser
   - Au clavier : S, A, B, C, D pour ranger, R pour la réserve,
     flèches gauche/droite pour la décaler dans son étage
   Le classement reste dans le navigateur ; il peut être partagé par un lien.
   ========================================================= */

const CLE_TIERLIST = "tierlist-v1";
const CLE_PRENOM = "tierlist-prenom";
const ETAGES = [
  { id: "S", nom: "Au-delà du multivers" },
  { id: "A", nom: "Délire cosmique" },
  { id: "B", nom: "Franchement insensé" },
  { id: "C", nom: "Presque raisonnable" },
  { id: "D", nom: "Apnée éternelle" }
];
const parId = new Map(TEXTES.map(t => [t.id, t]));
const zoneTier = $("tierlist");
const annonceTier = $("tierlist-annonce");

/* ---------- État ---------- */

function etatVide() {
  return Object.fromEntries(ETAGES.map(e => [e.id, []]));
}

// Ne garde que des histoires qui existent, une seule fois chacune
function nettoyer(rangs) {
  const vus = new Set();
  const propre = etatVide();
  for (const e of ETAGES) {
    for (const id of (rangs && Array.isArray(rangs[e.id]) ? rangs[e.id] : [])) {
      if (parId.has(id) && !vus.has(id)) { propre[e.id].push(id); vus.add(id); }
    }
  }
  return propre;
}

function lireTierlist() {
  try { return nettoyer(JSON.parse(lire(CLE_TIERLIST) || "null")); }
  catch (e) { return etatVide(); }
}

let rangs = lireTierlist();
let choisie = null;          // id de l'histoire sélectionnée (mode « toucher puis poser »)

function enregistrerTierlist() {
  ecrire(CLE_TIERLIST, JSON.stringify(rangs));
}

function reserve() {
  const classees = new Set(ETAGES.flatMap(e => rangs[e.id]));
  return TEXTES.map(t => t.id).filter(id => !classees.has(id));
}

function etageDe(id) {
  return ETAGES.find(e => rangs[e.id].includes(id))?.id || "reserve";
}

function deplacer(id, vers, position) {
  for (const e of ETAGES) rangs[e.id] = rangs[e.id].filter(x => x !== id);
  if (vers !== "reserve") {
    const liste = rangs[vers];
    liste.splice(position === undefined ? liste.length : position, 0, id);
  }
  enregistrerTierlist();
}

function annoncer(texte) {
  annonceTier.textContent = texte;
}

/* ---------- Partage par lien ---------- */
// Format : #partage=S.3.5_A.1.2_B..._C..._D...&de=Simon (numéros des histoires en base 36)

function lienDePartage() {
  const code = ETAGES.map(e => e.id + "." + rangs[e.id].map(id => parId.get(id).index.toString(36)).join(".")).join("_");
  const prenom = (lire(CLE_PRENOM) || "").trim();
  const url = new URL(location.href);
  url.hash = "partage=" + code + (prenom ? "&de=" + encodeURIComponent(prenom) : "");
  return url.toString();
}

function lirePartage() {
  const m = location.hash.match(/^#partage=([^&]*)(?:&de=(.*))?$/);
  if (!m) return null;
  const parIndex = new Map(TEXTES.map(t => [t.index.toString(36), t.id]));
  const partage = etatVide();
  for (const bloc of m[1].split("_")) {
    const [etage, ...nums] = bloc.split(".");
    if (partage[etage]) partage[etage] = nums.map(n => parIndex.get(n)).filter(Boolean);
  }
  let prenom = "";
  try { prenom = decodeURIComponent(m[2] || "").slice(0, 30); } catch (e) { }
  return { rangs: nettoyer(partage), prenom };
}

async function partager() {
  const url = lienDePartage();
  const prenom = (lire(CLE_PRENOM) || "").trim();
  const titre = prenom ? "La tier list de " + prenom : "Ma tier list des sottises";
  if (navigator.share && matchMedia("(pointer: coarse)").matches) {
    try { await navigator.share({ title: titre, url }); return; } catch (e) { if (e.name === "AbortError") return; }
  }
  try {
    await navigator.clipboard.writeText(url);
    annoncer("Lien copié ! Envoie-le pour montrer ta tier list.");
    $("tl-lien").hidden = true;
  } catch (e) {
    const champ = $("tl-lien");
    champ.hidden = false;
    champ.value = url;
    champ.select();
    annoncer("Copie le lien ci-dessous pour partager ta tier list.");
  }
}

/* ---------- Pré-remplir depuis la Mêlée ---------- */

function classementDeLaMelee() {
  let etat;
  try { etat = JSON.parse(lire("tournoi-histoires-v2") || "null"); } catch (e) { return null; }
  if (!etat || !etat.fini || !Array.isArray(etat.tours)) return null;
  const perdant = d => d.gagnant === d.a ? d.b : d.a;
  const resultat = etatVide();
  const tours = etat.tours.filter(t => !t.barrage).slice().reverse();     // finale, demies, quarts…
  const finale = tours[0]?.duels[0];
  if (!finale) return null;
  resultat.S.push(finale.gagnant);
  resultat.A.push(perdant(finale));
  if (tours[1]) resultat.A.push(...tours[1].duels.map(perdant));       // demi-finalistes
  if (tours[2]) resultat.B.push(...tours[2].duels.map(perdant));       // quarts
  if (tours[3]) resultat.C.push(...tours[3].duels.map(perdant));       // huitièmes
  for (const t of tours.slice(4)) resultat.D.push(...t.duels.map(perdant));
  for (const t of etat.tours.filter(t => t.barrage)) resultat.D.push(...t.duels.map(perdant));
  return nettoyer(resultat);
}

/* ---------- Affichage ---------- */

function titreCourtTier(titre, n = 46) {
  return titre.length > n ? titre.slice(0, titre.lastIndexOf(" ", n)) + "…" : titre;
}

function carte(id, lectureSeule) {
  const t = parId.get(id);
  const classe = { Jules: "jules", Simon: "simon" }[t.auteur] || "autre";
  const contenu = '<span class="tl-titre">' + echappe(titreCourtTier(t.titre)) + "</span>" +
    '<span class="tl-auteur">' + echappe(t.auteur) + "</span>";
  if (lectureSeule) return '<a class="tl-carte ' + classe + '" href="index.html#' + t.id + '" title="' + echappe(t.titre) + '">' + contenu + "</a>";
  return '<button type="button" class="tl-carte ' + classe + (choisie === id ? " choisie" : "") + '" data-id="' + t.id +
    '" aria-pressed="' + (choisie === id) + '" title="' + echappe(t.titre) + '">' + contenu + "</button>";
}

function rangees(r, lectureSeule) {
  return '<div class="tl-etages">' + ETAGES.map(e =>
    '<div class="tl-rangee tl-' + e.id + '">' +
      (lectureSeule
        ? '<div class="tl-etiquette"><span class="tl-lettre">' + e.id + '</span><span class="tl-nom">' + e.nom + "</span></div>"
        : '<button type="button" class="tl-etiquette" data-vers="' + e.id + '" aria-label="Ranger dans l’étage ' + e.id + " : " + e.nom + '">' +
            '<span class="tl-lettre">' + e.id + '</span><span class="tl-nom">' + e.nom + "</span></button>") +
      '<div class="tl-zone" data-rang="' + e.id + '" aria-label="Étage ' + e.id + '">' + r[e.id].map(id => carte(id, lectureSeule)).join("") + "</div>" +
    "</div>"
  ).join("") + "</div>";
}

function rendreTierlist() {
  const partage = lirePartage();
  if (partage) return rendrePartage(partage);

  const enReserve = reserve();
  const nbClassees = TEXTES.length - enReserve.length;
  const melee = classementDeLaMelee();
  const prenom = lire(CLE_PRENOM) || "";

  zoneTier.innerHTML =
    '<div class="tl-barre-outils">' +
      '<p class="tl-compteur"><strong>' + nbClassees + "</strong> histoire" + (nbClassees > 1 ? "s" : "") + " classée" + (nbClassees > 1 ? "s" : "") + " sur " + TEXTES.length + "</p>" +
      '<p class="tl-aide">' + (choisie
        ? "Touche l’étage où poser « " + echappe(titreCourtTier(parId.get(choisie).titre, 40)) + " »."
        : matchMedia("(pointer: coarse)").matches
          ? "Touche une histoire puis l’étage où la poser, ou appuie longuement dessus pour la glisser."
          : "Glisse les histoires dans les étages, ou clique sur l’une puis sur son étage.") + "</p>" +
    "</div>" +
    rangees(rangs, false) +
    '<div class="tl-reserve' + (choisie ? " en-attente" : "") + '">' +
      '<button type="button" class="tl-reserve-titre" data-vers="reserve">La réserve <span>' +
        (enReserve.length ? enReserve.length + " à classer" : "vide, tout est rangé !") + "</span></button>" +
      '<div class="tl-zone" data-rang="reserve" aria-label="Réserve">' + enReserve.map(id => carte(id, false)).join("") + "</div>" +
    "</div>" +
    '<div class="tl-actions">' +
      '<label class="tl-prenom">Ton prénom <input id="tl-prenom" type="text" maxlength="30" autocomplete="given-name" value="' + echappe(prenom) + '" placeholder="pour signer le partage"></label>' +
      '<button type="button" class="outil plein" id="tl-partager"' + (nbClassees ? "" : " disabled") + ">Partager ma tier list</button>" +
      (melee ? '<button type="button" class="outil" id="tl-melee">Pré-remplir avec ma Mêlée</button>' : "") +
      '<button type="button" class="outil" id="tl-vider"' + (nbClassees ? "" : " disabled") + ">Tout remettre en réserve</button>" +
      '<input class="tl-lien" id="tl-lien" type="text" readonly hidden aria-label="Lien de partage">' +
    "</div>" +
    '<p class="tl-clavier">Au clavier : sur une histoire, appuie sur <kbd>S</kbd> <kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd> pour la ranger, <kbd>R</kbd> pour la renvoyer en réserve, <kbd>←</kbd> <kbd>→</kbd> pour la décaler.</p>';

  brancherEvenements(melee);
}

function rendrePartage({ rangs: r, prenom }) {
  const nb = ETAGES.reduce((s, e) => s + r[e.id].length, 0);
  zoneTier.innerHTML =
    '<div class="tl-partage-entete">' +
      '<p class="sur-titre-quiz">Tier list partagée</p>' +
      "<h2>" + (prenom ? "La tier list de " + echappe(prenom) : "Une tier list qu’on t’a envoyée") + "</h2>" +
      "<p>" + nb + " histoire" + (nb > 1 ? "s" : "") + " classée" + (nb > 1 ? "s" : "") + ". Touche un titre pour le lire.</p>" +
    "</div>" +
    rangees(r, true) +
    '<div class="tl-actions"><a class="outil plein" href="tierlist.html" id="tl-la-mienne">Voir ou faire la mienne</a></div>';
}

/* ---------- Interactions ---------- */

function choisir(id) {
  choisie = choisie === id ? null : id;
  rendreTierlist();
  if (choisie) zoneTier.querySelector('[data-id="' + choisie + '"]')?.focus();
}

function poserChoisie(vers) {
  if (!choisie) return;
  const id = choisie;
  choisie = null;
  deplacer(id, vers);
  rendreTierlist();
  annoncer("« " + titreCourtTier(parId.get(id).titre, 40) + " » " + (vers === "reserve" ? "retourne en réserve." : "rangée en " + vers + "."));
  zoneTier.querySelector('[data-id="' + id + '"]')?.focus();
}

function brancherEvenements(melee) {
  zoneTier.querySelectorAll(".tl-carte[data-id]").forEach(b => {
    b.onclick = () => {
      if (ignorerClic) { ignorerClic = false; return; }
      if (choisie && choisie !== b.dataset.id) {
        // Toucher une autre histoire pendant une sélection : on pose la première juste avant
        const vers = etageDe(b.dataset.id);
        if (vers !== "reserve") {
          const id = choisie; choisie = null;
          deplacer(id, "reserve");
          deplacer(id, vers, rangs[vers].indexOf(b.dataset.id));
          rendreTierlist();
          annoncer("« " + titreCourtTier(parId.get(id).titre, 40) + " » rangée en " + vers + ".");
          return;
        }
      }
      choisir(b.dataset.id);
    };
    b.onkeydown = e => clavier(e, b.dataset.id);
    b.oncontextmenu = e => e.preventDefault();
    b.onpointerdown = e => debutGlisser(e, b);
  });
  zoneTier.querySelectorAll("[data-vers]").forEach(b => b.onclick = () => poserChoisie(b.dataset.vers));
  zoneTier.querySelectorAll(".tl-zone").forEach(z => z.onclick = e => {
    if (choisie && !e.target.closest(".tl-carte")) poserChoisie(z.dataset.rang);
  });
  $("tl-partager").onclick = partager;
  $("tl-prenom").oninput = e => ecrire(CLE_PRENOM, e.target.value.trim());
  $("tl-vider").onclick = () => {
    if (!confirm("Remettre toutes les histoires dans la réserve ?")) return;
    rangs = etatVide(); choisie = null; enregistrerTierlist(); rendreTierlist();
    annoncer("Tout est revenu en réserve.");
  };
  if (melee) $("tl-melee").onclick = () => {
    const deja = ETAGES.some(e => rangs[e.id].length);
    if (deja && !confirm("Remplacer ta tier list par le résultat de ta Mêlée ?")) return;
    rangs = melee; choisie = null; enregistrerTierlist(); rendreTierlist();
    annoncer("Tier list pré-remplie avec ta Mêlée : le vainqueur en S, les éliminées de chaque tour en dessous.");
  };
}

function clavier(e, id) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const touche = e.key.toUpperCase();
  const vers = ETAGES.some(x => x.id === touche) ? touche : touche === "R" ? "reserve" : null;
  if (vers) {
    e.preventDefault();
    choisie = id;
    poserChoisie(vers);
    return;
  }
  if (e.key === "Escape" && choisie) { e.preventDefault(); choisie = null; rendreTierlist(); zoneTier.querySelector('[data-id="' + id + '"]')?.focus(); return; }
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    const etage = etageDe(id);
    if (etage === "reserve") return;
    e.preventDefault();
    const liste = rangs[etage], i = liste.indexOf(id), j = i + (e.key === "ArrowLeft" ? -1 : 1);
    if (j < 0 || j >= liste.length) return;
    [liste[i], liste[j]] = [liste[j], liste[i]];
    enregistrerTierlist(); rendreTierlist();
    zoneTier.querySelector('[data-id="' + id + '"]')?.focus();
  }
}

/* ---------- Glisser-déposer (souris et doigt) ---------- */

let glisse = null;
let ignorerClic = false;

function debutGlisser(e, carteEl) {
  if (e.button !== 0) return;
  glisse = { carte: carteEl, id: carteEl.dataset.id, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, actif: false, doigt: e.pointerType !== "mouse", minuteur: null };
  // Au doigt, on attend un appui long pour ne pas bloquer le défilement de la page
  if (glisse.doigt) glisse.minuteur = setTimeout(() => { if (glisse && !glisse.actif) demarrerGlisser(); }, 280);
}

function demarrerGlisser() {
  const g = glisse;
  g.actif = true;
  choisie = null;
  const r = g.carte.getBoundingClientRect();
  g.dx = g.x - r.left; g.dy = g.y - r.top;
  g.fantome = g.carte.cloneNode(true);
  g.fantome.classList.add("tl-fantome");
  g.fantome.classList.remove("choisie");
  g.fantome.style.width = r.width + "px";
  g.fantome.style.height = r.height + "px";
  document.body.append(g.fantome);
  g.carte.classList.add("tl-emplacement");
  document.body.classList.add("tl-glisse-en-cours");
  if (navigator.vibrate && g.doigt) navigator.vibrate(15);
  bougerFantome();
}

function bougerFantome() {
  const g = glisse;
  g.fantome.style.transform = "translate(" + (g.x - g.dx) + "px," + (g.y - g.dy) + "px) rotate(-3deg)";
  const sous = document.elementFromPoint(g.x, g.y);
  const zone = sous && sous.closest(".tl-zone, .tl-rangee, .tl-reserve");
  const cible = zone && (zone.classList.contains("tl-zone") ? zone : zone.querySelector(".tl-zone"));
  zoneTier.querySelectorAll(".tl-zone.survolee").forEach(z => z !== cible && z.classList.remove("survolee"));
  if (!cible) return;
  cible.classList.add("survolee");
  const cartes = [...cible.querySelectorAll(".tl-carte:not(.tl-emplacement)")];
  const avant = cartes.find(c => {
    const r = c.getBoundingClientRect();
    return g.y < r.top || (g.y <= r.bottom && g.x < r.left + r.width / 2);
  }) || null;
  if (g.carte.parentElement !== cible || g.carte.nextElementSibling !== avant) cible.insertBefore(g.carte, avant);
  // Défilement automatique près des bords
  if (g.y < 70) scrollBy(0, -14);
  else if (g.y > innerHeight - 70) scrollBy(0, 14);
}

function finGlisser(annule) {
  const g = glisse;
  glisse = null;
  if (!g) return;
  clearTimeout(g.minuteur);
  if (!g.actif) return;
  ignorerClic = true;
  setTimeout(() => { ignorerClic = false; }, 0);
  g.fantome.remove();
  document.body.classList.remove("tl-glisse-en-cours");
  if (!annule) {
    // On relit l'ordre directement dans la page
    const nouveau = etatVide();
    zoneTier.querySelectorAll(".tl-zone").forEach(z => {
      if (z.dataset.rang !== "reserve") nouveau[z.dataset.rang] = [...z.querySelectorAll(".tl-carte")].map(c => c.dataset.id);
    });
    rangs = nettoyer(nouveau);
    enregistrerTierlist();
    const vers = etageDe(g.id);
    annoncer("« " + titreCourtTier(parId.get(g.id).titre, 40) + " » " + (vers === "reserve" ? "retourne en réserve." : "rangée en " + vers + "."));
  }
  rendreTierlist();
}

document.addEventListener("pointermove", e => {
  if (!glisse) return;
  glisse.x = e.clientX; glisse.y = e.clientY;
  const distance = Math.hypot(e.clientX - glisse.x0, e.clientY - glisse.y0);
  if (!glisse.actif) {
    if (glisse.doigt) { if (distance > 10) { clearTimeout(glisse.minuteur); glisse = null; } }   // l'utilisateur fait défiler
    else if (distance > 6) demarrerGlisser();
    return;
  }
  bougerFantome();
});
document.addEventListener("pointerup", () => finGlisser(false));
document.addEventListener("pointercancel", () => finGlisser(!glisse || !glisse.actif));
// Empêche la page de défiler pendant qu'on glisse au doigt
document.addEventListener("touchmove", e => { if (glisse && glisse.actif) e.preventDefault(); }, { passive: false });
document.addEventListener("keydown", e => { if (e.key === "Escape" && glisse && glisse.actif) finGlisser(true); });

addEventListener("hashchange", rendreTierlist);

rendreTierlist();

(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => dessinerLogo($("logo-mot")));
