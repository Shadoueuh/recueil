/* =========================================================
   PAGE PRINCIPALE (index.html)
   Sommaire, galerie, lecture, zoom, recherche, sottisomètre,
   bestiaire, reprise de lecture, lecture à voix haute.
   Les données sont dans donnees.js, les outils dans commun.js.
   ========================================================= */

let filtreActif = "Tous";

function rendreFiltres() {
  const noms = ["Tous", ...Object.keys(AUTEURS)];
  $("filtres").innerHTML = noms.map(n =>
    `<button class="filtre" type="button" aria-pressed="${n === filtreActif}" data-nom="${echappe(n)}">${echappe(n)}</button>`
  ).join("");
  $("filtres").querySelectorAll("button").forEach(b => b.onclick = () => {
    filtreActif = b.dataset.nom; rendreFiltres(); rendreSommaire();
  });
}

function rendreSommaire() {
  const liste = TEXTES.filter(t => filtreActif === "Tous" || t.auteur === filtreActif);
  $("sommaire").innerHTML = liste.map(t => {
    const premier = paragraphes(t.contenu)[0];
    const debut = t.resume || (premier ? premier.split(/\s+/).slice(0, 26).join(" ") + "…" : "Texte à venir.");
    return `<li><a class="ligne" href="#${t.id}">
  <span class="num">${String(t.index + 1).padStart(2, "0")}</span>
  <h3>${echappe(t.titre)}</h3>
  <span class="meta">${echappe(t.auteur)}, ${tempsLecture(t.contenu)} min${t.affiche ? ", avec affiche" : ""}</span>
  ${t.affiche ? cadre(t, "vignette") : ""}
  <p class="extrait">${echappe(debut)}</p>
</a></li>`;
  }).join("");
}

/* Une affiche dans son cadre. Si l'image ne charge pas, on affiche le titre à la place. */
function cadre(t, classe = "") {
  return `<span class="cadre ${classe}">
<img src="${echappe(t.affiche)}" alt="Affiche de ${echappe(t.titre)}" loading="lazy" onerror="this.parentNode.classList.add('vide')">
<span class="remplace">${echappe(t.titre)}</span>
  </span>`;
}

function rendreGalerie() {
  const avec = TEXTES.filter(t => t.affiche);
  $("bloc-galerie").hidden = avec.length === 0;
  $("nav-galerie").hidden = avec.length === 0;
  $("liste-galerie").innerHTML = avec.map(t => `<li>
<button type="button" data-id="${t.id}" aria-label="Agrandir l'affiche de ${echappe(t.titre)}">${cadre(t)}</button>
<h3>${echappe(t.titre)}</h3>
<a href="#${t.id}">Lire le texte</a>
  </li>`).join("");
  $("liste-galerie").querySelectorAll("button").forEach(b => b.onclick = () => ouvrirAffiche(TEXTES.find(x => x.id === b.dataset.id)));
}

/* Les textes qui ont une affiche, dans l'ordre du sommaire */
const textesAvecAffiche = () => TEXTES.filter(x => x.affiche);
let afficheCourante = null;

function changerAffiche(sens) {
  const liste = textesAvecAffiche();
  if (liste.length < 2 || !afficheCourante) return;
  const i = liste.indexOf(afficheCourante);
  ouvrirAffiche(liste[(i + sens + liste.length) % liste.length]);
}

function ouvrirAffiche(t) {
  afficheCourante = t;
  const liste = textesAvecAffiche();
  $("v-navigation").hidden = liste.length < 2;
  $("v-compteur").textContent = (liste.indexOf(t) + 1) + " / " + liste.length;
  const img = new Image();
  img.alt = "Affiche de " + t.titre;
  img.draggable = false;
  img.onload = () => ajusterZoom(false);
  img.onerror = () => { zoom.img = null; $("v-image").innerHTML = `<p class="vide-message">L'image « ${echappe(t.affiche)} » est introuvable. Vérifie qu’elle est bien dans le dossier à côté de index.html.</p>`; };
  zoom.img = img;
  img.src = t.affiche;
  $("v-image").replaceChildren(img);
  $("v-legende").textContent = t.titre + ", par " + t.auteur;
  const d = $("visionneuse");
  if (!d.open) { if (d.showModal) d.showModal(); else d.setAttribute("open", ""); }
  if (img.complete && img.naturalWidth) ajusterZoom(false);
}

/* ===== Zoom et déplacement dans l'affiche ===== */
const zoom = { img: null, s: 1, x: 0, y: 0, min: 1, max: 4 };
const pointeurs = new Map();
let pince = null;
const sansAnim = matchMedia("(prefers-reduced-motion: reduce)").matches;
const borne = (v, a, b) => Math.min(Math.max(v, a), b);

function appliquerZoom(anime) {
  if (!zoom.img) return;
  zoom.img.style.transition = anime && !sansAnim ? "transform .2s ease" : "none";
  zoom.img.style.transform = `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.s})`;
  $("v-scene").classList.toggle("zoome", zoom.s > zoom.min * 1.01);
}

function bornerZoom() {
  const sc = $("v-scene").getBoundingClientRect();
  const w = zoom.img.naturalWidth * zoom.s, h = zoom.img.naturalHeight * zoom.s;
  zoom.x = w <= sc.width ? (sc.width - w) / 2 : borne(zoom.x, sc.width - w, 0);
  zoom.y = h <= sc.height ? (sc.height - h) / 2 : borne(zoom.y, sc.height - h, 0);
}

function ajusterZoom(anime) {
  const img = zoom.img;
  if (!img || !img.naturalWidth) return;
  const sc = $("v-scene").getBoundingClientRect();
  zoom.min = Math.min(sc.width / img.naturalWidth, sc.height / img.naturalHeight);
  zoom.max = Math.max(zoom.min * 8, 2);
  zoom.s = zoom.min;
  bornerZoom();
  appliquerZoom(anime);
}

function zoomerVers(cx, cy, facteur, anime) {
  if (!zoom.img) return;
  const ns = borne(zoom.s * facteur, zoom.min, zoom.max);
  zoom.x = cx - (cx - zoom.x) * (ns / zoom.s);
  zoom.y = cy - (cy - zoom.y) * (ns / zoom.s);
  zoom.s = ns;
  bornerZoom();
  appliquerZoom(anime);
}

function centreScene() {
  const sc = $("v-scene").getBoundingClientRect();
  return [sc.width / 2, sc.height / 2];
}
function pointLocal(e) {
  const sc = $("v-scene").getBoundingClientRect();
  return [e.clientX - sc.left, e.clientY - sc.top];
}

const scene = $("v-scene");
scene.addEventListener("wheel", e => {
  e.preventDefault();
  const [x, y] = pointLocal(e);
  zoomerVers(x, y, Math.exp(-e.deltaY * 0.0015), false);
}, { passive: false });

scene.addEventListener("pointerdown", e => {
  if (!zoom.img) return;
  scene.setPointerCapture(e.pointerId);
  pointeurs.set(e.pointerId, pointLocal(e));
  if (pointeurs.size === 2) {
    const [a, b] = [...pointeurs.values()];
    pince = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
  }
  scene.classList.add("glisse");
});

scene.addEventListener("pointermove", e => {
  if (!pointeurs.has(e.pointerId) || !zoom.img) return;
  const avant = pointeurs.get(e.pointerId);
  const apres = pointLocal(e);
  pointeurs.set(e.pointerId, apres);
  if (pointeurs.size === 1) {
    zoom.x += apres[0] - avant[0];
    zoom.y += apres[1] - avant[1];
    bornerZoom();
    appliquerZoom(false);
  } else if (pointeurs.size === 2 && pince) {
    const [a, b] = [...pointeurs.values()];
    const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    zoom.x += m[0] - pince.m[0];
    zoom.y += m[1] - pince.m[1];
    zoomerVers(m[0], m[1], d / pince.d, false);
    pince = { d, m };
  }
});

function finPointeur(e) {
  pointeurs.delete(e.pointerId);
  if (pointeurs.size < 2) pince = null;
  if (pointeurs.size === 0) scene.classList.remove("glisse");
}
scene.addEventListener("pointerup", finPointeur);
scene.addEventListener("pointercancel", finPointeur);

scene.addEventListener("dblclick", e => {
  if (zoom.s > zoom.min * 1.05) ajusterZoom(true);
  else { const [x, y] = pointLocal(e); zoomerVers(x, y, 3, true); }
});

$("v-plus").onclick = () => { const [x, y] = centreScene(); zoomerVers(x, y, 1.5, true); };
$("v-moins").onclick = () => { const [x, y] = centreScene(); zoomerVers(x, y, 1 / 1.5, true); };
$("v-ajuster").onclick = () => ajusterZoom(true);
$("v-prec").onclick = () => changerAffiche(-1);
$("v-suiv").onclick = () => changerAffiche(1);
$("v-fermer").onclick = () => $("visionneuse").close();

$("visionneuse").addEventListener("keydown", e => {
  if (!zoom.img) return;
  const [x, y] = centreScene();
  const pas = 80;
  const actions = {
    "+": () => zoomerVers(x, y, 1.5, true), "=": () => zoomerVers(x, y, 1.5, true),
    "-": () => zoomerVers(x, y, 1 / 1.5, true), "0": () => ajusterZoom(true),
    ArrowLeft: () => { if (zoom.s <= zoom.min * 1.01) changerAffiche(-1); else { zoom.x += pas; bornerZoom(); appliquerZoom(true); } },
    ArrowRight: () => { if (zoom.s <= zoom.min * 1.01) changerAffiche(1); else { zoom.x -= pas; bornerZoom(); appliquerZoom(true); } },
    ArrowUp: () => { zoom.y += pas; bornerZoom(); appliquerZoom(true); },
    ArrowDown: () => { zoom.y -= pas; bornerZoom(); appliquerZoom(true); },
  };
  if (actions[e.key]) { e.preventDefault(); actions[e.key](); }
});

addEventListener("resize", () => { if ($("visionneuse").open) ajusterZoom(false); });

function rendreAuteurs() {
  $("liste-auteurs").innerHTML = Object.entries(AUTEURS).map(([nom, bio]) => {
    const n = TEXTES.filter(t => t.auteur === nom).length;
    const photo = PHOTOS[nom]
      ? `<img class="portrait" src="${echappe(PHOTOS[nom])}" alt="Photo de ${echappe(nom)}" loading="lazy" onerror="this.remove()">`
      : "";
    return `<div class="auteur">${photo}<div><h3>${echappe(nom)}</h3><p>${echappe(bio)}</p>
  <span class="compte">${n} texte${n > 1 ? "s" : ""} dans le recueil</span></div></div>`;
  }).join("");
}

function rendreLecture(t) {
  $("l-titre").textContent = t.titre;
  const m = nbMots(t.contenu);
  $("l-infos").innerHTML = `Par <strong>${echappe(t.auteur)}</strong>, ${m.toLocaleString("fr-FR")} mots, environ ${tempsLecture(t.contenu)} min de lecture`;
  $("l-affiche").hidden = !t.affiche;
  if (t.affiche) {
    $("l-affiche").innerHTML = `<button type="button" aria-label="Agrandir l'affiche">${cadre(t)}</button><span>L'affiche de ce texte. Clique dessus pour l'agrandir.</span>`;
    $("l-affiche").querySelector("button").onclick = () => ouvrirAffiche(t);
  }
  const paras = paragraphes(t.contenu);
  $("l-corps").innerHTML = paras.length ? rendreCorps(paras, t) : "<p>Ce texte est encore vide.</p>";
  apresRenduLecture(t);
  $("l-signature").textContent = "Par " + t.auteur;
  const prec = TEXTES[t.index - 1], suiv = TEXTES[t.index + 1];
  $("l-suite").innerHTML =
    (prec ? `<a href="#${prec.id}"><small>Texte précédent</small><span>${echappe(prec.titre)}</span></a>` : "") +
    (suiv ? `<a class="suivant" href="#${suiv.id}"><small>Texte suivant</small><span>${echappe(suiv.titre)}</span></a>` : "");
  document.title = t.titre + " · Sottises insensées";
}

function router() {
  const h = location.hash.slice(1);
  const t = TEXTES.find(x => x.id === h);
  const best = h === "bestiaire" || h.startsWith("fiche-");
  arreterEcoute();
  $("vue-accueil").hidden = !!t || best;
  $("vue-lecture").hidden = !t;
  $("vue-bestiaire").hidden = !best;
  $("taille").hidden = !t;
  $("retour-barre").hidden = !t && !best;
  $("nav-auteurs").hidden = !!t || best;
  $("nav-galerie").hidden = !!t || best || !TEXTES.some(x => x.affiche);
  $("nav-bestiaire").hidden = best;
  if (t) rendreLecture(t);
  else if (best) document.title = "Le bestiaire · Sottises insensées";
  else { document.title = "Recueil de sottises insensées et incongrues"; majReprise(); }
  const ancre = (h === "galerie" || h === "auteurs" || h.startsWith("fiche-")) && document.getElementById(h);
  if (ancre) {
    ancre.scrollIntoView({ block: h.startsWith("fiche-") ? "center" : "start" });
    if (h.startsWith("fiche-")) flasher(ancre);
  }
  else window.scrollTo(0, 0);
  if (t) positionnerLecture(t);
  majProgression();
}

function majProgression() {
  if ($("vue-lecture").hidden) { $("progression").style.width = 0; return; }
  const max = document.documentElement.scrollHeight - innerHeight;
  $("progression").style.width = (max > 0 ? Math.min(100, scrollY / max * 100) : 100) + "%";
}

const tailles = ["1.05rem", "1.2rem", "1.38rem"];
let taille = Number(lire("taille") ?? 1) || 1;
document.documentElement.style.setProperty("--taille-texte", tailles[taille]);
$("taille").onclick = () => {
  taille = (taille + 1) % tailles.length;
  document.documentElement.style.setProperty("--taille-texte", tailles[taille]);
  ecrire("taille", taille);
  majProgression();
};


function afficherErreur(message) {
  $("vue-accueil").hidden = false;
  $("sommaire").innerHTML = `<li class="erreur"><strong>Les textes n'ont pas pu être chargés.</strong> ${echappe(message)}
${location.protocol === "file:" ? "<br>Tu as ouvert la page par double-clic : lance-la plutôt avec Live Server dans VS Code." : ""}</li>`;
}


/* =========================================================
   3. FONCTIONNALITÉS BONUS
   ========================================================= */

/* ---------- Rendu du corps d'un texte : surlignage de recherche + liens vers le bestiaire ---------- */

let rechercheEnCours = null;   // { id, terme } quand on arrive depuis un résultat de recherche
let repriseEnAttente = null;   // id du texte à rouvrir à la position mémorisée
let termeAffiche = null;

function rendreParagraphe(p, terme, dejaLies) {
  const zones = [];
  if (terme) for (const [s, e] of occurrences(p, terme)) zones.push({ s, e, type: "mark" });
  for (const f of BESTIAIRE) {
    if (dejaLies.has(f.id)) continue;
    for (const mot of f.mots) {
      const occ = occurrencesReference(p, mot)[0];
      if (occ && !zones.some(z => z.s < occ[1] && occ[0] < z.e)) {
        zones.push({ s: occ[0], e: occ[1], type: "lien", href: "#" + f.id, nom: f.nom });
        dejaLies.add(f.id);
        break;
      }
    }
  }
  zones.sort((a, b) => a.s - b.s);
  let html = "", pos = 0;
  for (const z of zones) {
    if (z.s < pos) continue;
    html += echappe(p.slice(pos, z.s));
    const morceau = echappe(p.slice(z.s, z.e));
    html += z.type === "mark"
      ? `<mark>${morceau}</mark>`
      : `<a class="lien-bestiaire" href="${z.href}" title="Voir « ${echappe(z.nom)} » dans le bestiaire">${morceau}</a>`;
    pos = z.e;
  }
  return `<p>${html + echappe(p.slice(pos))}</p>`;
}

function rendreCorps(paras, t) {
  termeAffiche = rechercheEnCours && rechercheEnCours.id === t.id ? rechercheEnCours.terme : null;
  rechercheEnCours = null;
  const dejaLies = new Set();
  return paras.map(p => rendreParagraphe(p, termeAffiche, dejaLies)).join("");
}

/* ---------- Recherche ---------- */

function extrait(texte, s, e) {
  let a = Math.max(0, s - 70), b = Math.min(texte.length, e + 70);
  if (a > 0) a = texte.indexOf(" ", a) + 1 || a;
  if (b < texte.length) b = texte.lastIndexOf(" ", b) > e ? texte.lastIndexOf(" ", b) : b;
  const avant = texte.slice(a, s), milieu = texte.slice(s, e), apres = texte.slice(e, b);
  const net = x => echappe(x.replace(/\s+/g, " "));
  return (a > 0 ? "…" : "") + net(avant) + "<mark>" + net(milieu) + "</mark>" + net(apres) + (b < texte.length ? "…" : "");
}

function lancerRecherche() {
  const q = $("recherche").value.trim();
  const actif = q.length >= 2;
  $("sommaire").hidden = actif;
  $("filtres").hidden = actif;
  $("resultats").hidden = !actif;
  if (!actif) return;
  const trouves = TEXTES.map(t => ({ t, occ: occurrences(t.contenu, q), dansTitre: occurrences(t.titre, q).length > 0 }))
    .filter(r => r.occ.length || r.dansTitre);
  const total = trouves.reduce((n, r) => n + r.occ.length, 0);
  if (!trouves.length) {
    $("resultats").innerHTML = `<li class="aucun">Aucune sottise ne contient « ${echappe(q)} ». Essaie un autre mot ; les accents ne changent rien.</li>`;
    return;
  }
  $("resultats").innerHTML =
    `<li class="bilan">${total} résultat${total > 1 ? "s" : ""} dans ${trouves.length} texte${trouves.length > 1 ? "s" : ""}</li>` +
    trouves.map(({ t, occ }) => `<li><a class="resultat" href="#${t.id}" data-id="${t.id}">
      <span class="r-titre">${echappe(t.titre)}</span>
      <span class="r-meta">${echappe(t.auteur)}, ${occ.length} occurrence${occ.length > 1 ? "s" : ""}</span>
      ${occ.slice(0, 2).map(([s, e]) => `<span class="r-extrait">${extrait(t.contenu, s, e)}</span>`).join("")}
    </a></li>`).join("");
  $("resultats").querySelectorAll("a.resultat").forEach(a => a.onclick = () => {
    rechercheEnCours = { id: a.dataset.id, terme: q };
  });
}

function initRecherche() {
  $("recherche").addEventListener("input", lancerRecherche);
  $("recherche-vider").onclick = () => { $("recherche").value = ""; lancerRecherche(); $("recherche").focus(); };
}

/* ---------- Sottisomètre ---------- */

const MULTIPLICATEURS = {
  mille: 1e3, million: 1e6, milliard: 1e9, billion: 1e12, billiard: 1e15, trillion: 1e18,
  trilliard: 1e21, quadrillion: 1e24, quadrilliard: 1e27, quintillion: 1e30, quintilliard: 1e33,
  sextillion: 1e36, septillion: 1e42, octillion: 1e48, nonillion: 1e54, decillion: 1e60,
  gazillion: 1e100, tartillion: 1e100, zillion: 1e100
};
const EXPOSANTS = { "⁰": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9 };
const MOT_MULT = "(?:mille|millions?|milliards?|billions?|billiards?|trillions?|trilliards?|quadrillions?|quadrilliards?|quintillions?|quintilliards?|sextillions?|septillions?|octillions?|nonillions?|decillions?|gazillions?|tartillions?|zillions?)";
const RE_NOMBRE = new RegExp(
  "(?<![\\p{L}\\d])(\\d{1,3}(?:[ \\u00a0\\u202f]\\d{3})+|\\d+(?:[.,]\\d+)?)" +
  "(?:\\s*[×x]\\s*10([⁰¹²³⁴⁵⁶⁷⁸⁹]+))?" +
  "((?:\\s+(?:de\\s+)?" + MOT_MULT + ")*)", "giu");
const RE_COSMOS = /(plan[eè]tes?|galaxies?|univers|multi-?vers(?:es?)?|trous? noirs?|saturne|soleils?|astres?|satellites?|ann[ée]es?[- ]lumi[eè]res?|cosmos|cosmiques?|voie lact[ée]e|androm[eè]de|intergalactiques?|interstellaires?|nébuleuses?|météorites?)/gi;

/* Détecteur de « spécificité absurde » : les détails beaucoup trop précis
   (codes, chiffres au centime près, mesures, lieux et marques nommés,
   insistance sur la précision) sont une forme de sottise à part entière. */
const RE_CODE = /(?<![\p{L}\d])(?=[\p{L}\d₀-₉-]*[\d₀-₉])(?=[\p{L}\d₀-₉-]*\p{L})[\p{L}\d₀-₉][\p{L}\d₀-₉.,-]*[\p{L}\d₀-₉](?![\p{L}\d])/gu;
const RE_ORDINAL = /^\d+(?:e|er|ère|eme|ème|nd|nde)$/i;
const RE_UNITE_COLLEE = /^(?:\d+(?:[.,]\d+)?(?:€|%|km|m|cm|mm|kg|t|g|s|h|min)|(?:km|m|cm)\d)$/i;
const RE_NUM_PRECIS = /(?<![\p{L}\d])\d{1,3}(?:[   ]\d{3})+(?!\d)|(?<![\p{L}\d])\d+(?:[.,]\d+)?(?![\p{L}\d])/gu;
const RE_MESURE = /\d(?:[\d   .,]*\d)?\s*(?:%|€|km\/h|km3|km²|km|m²|m|cm|mm|kg|t|g|s|h|ans?|jours?|minutes?|secondes?|heures?|picosecondes?|chevaux|becquerels?|mégajoules|tonnes|litres?|shillings|années?[- ]lumières?)(?![\p{L}])/giu;
const RE_NOM_PROPRE = /(?<=[\p{L}\d,;)'’”»] )\p{Lu}[\p{Ll}\p{Lu}'’-]{2,}/gu;
const RE_INSISTANCE = /(?<![\p{L}])(?:précisément|exactement|strictement|spécifiquement|minutieusement|et je dis bien|pas moins de|au minimum|minimum|record)(?![\p{L}])/giu;

function specificite(texte) {
  let points = 0;
  for (const m of texte.matchAll(RE_CODE)) {
    const c = m[0].replace(/[.,]$/, "");
    if (!RE_ORDINAL.test(c) && !RE_UNITE_COLLEE.test(c)) points += 5;   // c6c565, D341, F-35, H2O…
  }
  for (const m of texte.matchAll(RE_NUM_PRECIS)) {
    const chiffres = m[0].replace(/\D/g, "").replace(/^0+/, "").replace(/0+$/, "");
    if (chiffres.length > 1) points += Math.min(chiffres.length - 1, 4);  // 4567, 1.63, 154 892…
  }
  points += (texte.match(RE_MESURE) || []).length;                       // 15 mm, 1.63€, 13 années-lumière…
  points += nomsPropres(texte).length;              // Netto, Poitiers, Sodebo…
  points += 2 * (texte.match(RE_INSISTANCE) || []).length;               // « précisément », « et je dis bien »…
  return points;
}

/* Le nombre tel qu'il est écrit, avec son unité collée (13.7s, 1.63€, 77 %)
   et jusqu'à 4 mots de contexte, sans s'arrêter sur un « de » ou un « la ». */
const PETITS_MOTS = /^(?:de|du|des|d'|d’|à|au|aux|en|et|ou|la|le|les|l'|l’|un|une|par|pour|sur|dans|avec)$/i;
function extraitNombre(texte, debut, nombre) {
  let reste = texte.slice(debut + nombre.length);
  const colle = reste.match(/^[^\s.,;:!?()«»"“”]*/)[0];
  reste = reste.slice(colle.length);
  const mots = (reste.match(/^(?:[ \u00a0\u202f]+[^\s.,;:!?()«»"“”]+){0,4}/)[0].trim().split(/\s+/)).filter(Boolean);
  while (mots.length && PETITS_MOTS.test(mots[mots.length - 1])) mots.pop();
  return [nombre + colle, ...mots].join(" ").replace(/\s+/g, " ").trim();
}

const nomsPropres = texte => [...new Set(texte.match(RE_NOM_PROPRE) || [])];

function sottisometre(texte) {
  const mots = nbMots(texte);
  if (!mots) return null;
  let max = 0, maxTxt = "", nb = 0, m;
  RE_NOMBRE.lastIndex = 0;
  while ((m = RE_NOMBRE.exec(texte))) {
    nb++;
    let v = parseFloat(m[1].replace(/[   ]/g, "").replace(",", "."));
    if (m[2]) v *= Math.pow(10, Number([...m[2]].map(c => EXPOSANTS[c]).join("")));
    for (const w of (m[3].toLowerCase().match(new RegExp(MOT_MULT, "gi")) || [])) {
      v *= MULTIPLICATEURS[w.toLowerCase().replace(/s$/, "")] || 1;
    }
    if (v > max) {
      max = v;
      maxTxt = extraitNombre(texte, m.index, m[0]);
    }
  }
  const cosmos = (texte.match(RE_COSMOS) || []).length;
  // Quatre critères ramenés entre 0 et 1, puis pondérés
  const densiteChiffres = Math.min(nb / mots * 100 / 3, 1);                 // 3 chiffres pour 100 mots = plafond
  const densiteCosmique = Math.min(cosmos / mots * 100 / 2, 1);             // 2 références pour 100 mots = plafond
  const demesure = max > 0 ? Math.min(Math.log10(max) / 30, 1) : 0;         // 10^30 et au-delà = plafond
  const precision = Math.min(specificite(texte) / mots * 100 / 8, 1);       // 8 points pour 100 mots = plafond
  const score = Math.round((0.25 * densiteChiffres + 0.15 * densiteCosmique + 0.25 * demesure + 0.35 * precision) * 100) / 10;
  const verdict = score < 3 ? "Presque raisonnable" : score < 6 ? "Franchement insensé" : score < 8.5 ? "Délire cosmique" : "Au-delà du multivers";
  return { score, verdict, nb, cosmos, maxTxt, propres: nomsPropres(texte) };
}

function rendreSottisometre(t) {
  const r = sottisometre(t.contenu);
  const el = $("l-sottise");
  el.hidden = !r;
  if (!r) { el.innerHTML = ""; return; }
  el.innerHTML = `
    <div class="s-ligne">
      <span class="s-label">Sottisomètre</span>
      <span class="s-jauge" role="meter" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${r.score}" aria-label="Sottisomètre"><span style="width:${r.score * 10}%"></span></span>
      <strong class="s-score">${r.score.toLocaleString("fr-FR")}<small>/10</small></strong>
      <span class="s-verdict">${r.verdict}</span>
    </div>
    <dl class="s-stats">
      ${r.maxTxt ? `<div><dt>Le chiffre le plus démesuré</dt><dd>${echappe(r.maxTxt)}</dd></div>` : ""}
      <div><dt>Chiffres cités</dt><dd>${r.nb}</dd></div>
      <div><dt>Références cosmiques</dt><dd>${r.cosmos}</dd></div>
      <div><dt>Noms propres</dt><dd title="${echappe(r.propres.join(", "))}">${r.propres.length}</dd></div>
    </dl>`;
}

/* ---------- Bestiaire ---------- */

let filtreBestiaire = "Tous";
let rechercheBestiaire = "";


function rendreBestiaire() {
  const champRecherche = $("recherche-bestiaire");
  champRecherche.oninput = () => { rechercheBestiaire = champRecherche.value.trim(); rendreBestiaire(); };
  $("recherche-bestiaire-vider").onclick = () => {
    champRecherche.value = "";
    rechercheBestiaire = "";
    rendreBestiaire();
    champRecherche.focus();
  };
  const types = ["Tous", ...new Set(BESTIAIRE.map(f => f.type))];
  $("filtres-bestiaire").innerHTML = types.map(ty => {
    const pluriels = {
      Lieu: "Lieux", Créature: "Créatures", Objet: "Objets", Substance: "Substances", Châtiment: "Châtiments",
      Personnage: "Personnages", Organisation: "Organisations", Institution: "Institutions",
      Groupe: "Groupes", Événement: "Événements", Œuvre: "Œuvres", Marque: "Marques",
      Détail: "Détails"
    };
    const libelle = ty === "Tous" ? "Tout" : (pluriels[ty] || ty + "s");
    return `<button class="filtre" type="button" aria-pressed="${ty === filtreBestiaire}" data-type="${echappe(ty)}">${echappe(libelle)}</button>`;
  }).join("");
  $("filtres-bestiaire").querySelectorAll("button").forEach(b => b.onclick = () => { filtreBestiaire = b.dataset.type; rendreBestiaire(); });
  const q = normaliser(rechercheBestiaire).n;
  const liste = BESTIAIRE.flatMap(f => {
    if (filtreBestiaire !== "Tous" && f.type !== filtreBestiaire) return [];
    const textes = textesDeLaFiche(f);
    const index = normaliser(`${f.nom} ${f.type} ${f.description} ${textes.map(t => t.titre).join(" ")}`).n;
    return !q || index.includes(q) ? [{ f, textes }] : [];
  });
  $("bilan-bestiaire").textContent = `${liste.length} fiche${liste.length > 1 ? "s" : ""} affichée${liste.length > 1 ? "s" : ""}${rechercheBestiaire ? ` pour « ${rechercheBestiaire} »` : ""}.`;
  $("liste-bestiaire").innerHTML = liste.length ? liste.map(({ f, textes }) => {
    return `<li><article class="fiche" id="${f.id}">
      <span class="f-type">${echappe(f.type)}</span>
      <h3>${echappe(f.nom)}</h3>
      <p>${echappe(f.description)}</p>
      <p class="f-textes">${textes.length
        ? "Apparaît dans " + textes.map(t => `<a href="#${t.id}">${echappe(t.titre)}</a>`).join(", ")
        : "N'apparaît encore dans aucun texte."}</p>
    </article></li>`;
  }).join("") : `<li class="aucun-bestiaire">Aucune fiche ne correspond à cette recherche et à ce filtre.</li>`;
}

function flasher(el) {
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
}

/* ---------- Reprendre la lecture ---------- */

const clePos = id => "position:" + id;

function lirePosition(id) {
  const v = parseFloat(lire(clePos(id)));
  return isNaN(v) ? 0 : v;
}

let minuteurPos = null;
function memoriserPosition() {
  if ($("vue-lecture").hidden) return;
  const id = location.hash.slice(1);
  clearTimeout(minuteurPos);
  minuteurPos = setTimeout(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (max <= 0) return;
    const r = scrollY / max;
    if (r > 0.97) { try { localStorage.removeItem(clePos(id)); } catch (e) { } }
    else if (r > 0.03) { ecrire(clePos(id), r.toFixed(3)); ecrire("derniere-lecture", id); }
  }, 300);
}

function allerA(ratio) {
  const max = document.documentElement.scrollHeight - innerHeight;
  window.scrollTo(0, ratio * max);
}

function majReprise() {
  const id = lire("derniere-lecture");
  const t = TEXTES.find(x => x.id === id);
  const r = t ? lirePosition(id) : 0;
  const el = $("reprendre");
  el.hidden = !(t && r > 0.03);
  if (el.hidden) return;
  el.innerHTML = `<span>Tu lisais <strong>${echappe(t.titre)}</strong>, arrêté à ${Math.round(r * 100)} %.</span>
    <a class="outil plein" href="#${t.id}" id="reprendre-go">Reprendre la lecture</a>
    <button class="outil" type="button" id="reprendre-oublier">Oublier</button>`;
  $("reprendre-go").onclick = () => { repriseEnAttente = t.id; };
  $("reprendre-oublier").onclick = () => {
    try { localStorage.removeItem(clePos(t.id)); localStorage.removeItem("derniere-lecture"); } catch (e) { }
    el.hidden = true;
  };
}

/* Appelé par le routeur juste après l'affichage d'un texte. */
function positionnerLecture(t) {
  const r = lirePosition(t.id);
  $("l-reprise").hidden = true;
  requestAnimationFrame(() => {
    if (termeAffiche) {
      const premier = $("l-corps").querySelector("mark");
      if (premier) premier.scrollIntoView({ block: "center" });
    } else if (repriseEnAttente === t.id && r > 0.03) {
      allerA(r);
    } else if (r > 0.03) {
      $("l-reprise").hidden = false;
      $("l-reprise").innerHTML = `<span>Ta lecture en était à ${Math.round(r * 100)} % de ce texte.</span>
        <button class="outil plein" type="button">Reprendre</button>`;
      $("l-reprise").querySelector("button").onclick = () => { $("l-reprise").hidden = true; allerA(r); };
    }
    repriseEnAttente = null;
    majProgression();
  });
}

/* ---------- Lecture à voix haute ---------- */

const voixDispo = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
const ecoute = { actif: false, pause: false, i: 0, jeton: 0 };

function voixFrancaise() {
  const voix = speechSynthesis.getVoices().filter(v => /^fr/i.test(v.lang));
  return voix.find(v => /fr-FR/i.test(v.lang) && /google|natural|neural|online/i.test(v.name)) || voix.find(v => /fr-FR/i.test(v.lang)) || voix[0] || null;
}

function parasLecture() { return [...$("l-corps").querySelectorAll("p")]; }

function majBoutonsEcoute() {
  const b = $("ecouter");
  b.textContent = !ecoute.actif ? "▶ Écouter le texte" : ecoute.pause ? "▶ Reprendre l'écoute" : "❚❚ Pause";
  b.setAttribute("aria-pressed", ecoute.actif && !ecoute.pause);
  $("stop-ecoute").hidden = !ecoute.actif;
  $("l-ecoute").classList.toggle("actif", ecoute.actif);
}

function lireParagraphe(i) {
  const paras = parasLecture();
  paras.forEach(p => p.classList.remove("en-lecture"));
  if (i >= paras.length) { arreterEcoute(); return; }
  ecoute.i = i;
  const p = paras[i];
  p.classList.add("en-lecture");
  const rect = p.getBoundingClientRect();
  if (rect.top < 140 || rect.bottom > innerHeight) p.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  const jeton = ++ecoute.jeton;
  const u = new SpeechSynthesisUtterance(p.textContent);
  u.lang = "fr-FR";
  const v = voixFrancaise();
  if (v) u.voice = v;
  u.onend = () => { if (ecoute.actif && !ecoute.pause && jeton === ecoute.jeton) lireParagraphe(i + 1); };
  u.onerror = () => { if (jeton === ecoute.jeton && ecoute.actif && !ecoute.pause) arreterEcoute(); };
  speechSynthesis.speak(u);
}

function premierParagrapheVisible() {
  const paras = parasLecture();
  const i = paras.findIndex(p => p.getBoundingClientRect().bottom > 140);
  return i < 0 ? 0 : i;
}

function basculerEcoute() {
  if (!ecoute.actif) {
    ecoute.actif = true; ecoute.pause = false;
    speechSynthesis.cancel();
    lireParagraphe(premierParagrapheVisible());
  } else if (!ecoute.pause) {
    ecoute.pause = true; ecoute.jeton++;
    speechSynthesis.cancel();
  } else {
    ecoute.pause = false;
    lireParagraphe(ecoute.i);
  }
  majBoutonsEcoute();
}

function arreterEcoute() {
  if (!voixDispo) return;
  ecoute.actif = false; ecoute.pause = false; ecoute.jeton++;
  speechSynthesis.cancel();
  parasLecture().forEach(p => p.classList.remove("en-lecture"));
  majBoutonsEcoute();
}

function initEcoute() {
  $("l-ecoute").hidden = !voixDispo;
  if (!voixDispo) return;
  speechSynthesis.getVoices();
  $("ecouter").onclick = basculerEcoute;
  $("stop-ecoute").onclick = arreterEcoute;
  majBoutonsEcoute();
}

/* Appelé à chaque ouverture d'un texte. */
function apresRenduLecture(t) {
  rendreSottisometre(t);
  $("l-ecoute").hidden = !voixDispo || !paragraphes(t.contenu).length;
}


/* ---------- Encart du quiz sur l'accueil ---------- */
function rendreEncartQuiz() {
  const jouables = BESTIAIRE.filter(f => textesDeLaFiche(f).length);
  const el = $("encart-quiz");
  if (!jouables.length) { el.hidden = true; return; }
  const f = auHasard(jouables);
  const bonne = auHasard(textesDeLaFiche(f));
  const autres = melanger(TEXTES.filter(t => t !== bonne && nbMots(t.contenu))).slice(0, 2);
  $("eq-fiche").textContent = f.nom;
  $("eq-nb").textContent = `${jouables.length} fiches, ${TEXTES.filter(t => nbMots(t.contenu)).length} histoires, une seule bonne réponse à chaque fois.`;
  $("eq-cartes").innerHTML = melanger([...autres.map(t => ({ t, mystere: false })), { t: bonne, mystere: true }])
    .map(({ t, mystere }) => `<span class="eq-carte${mystere ? " mystere" : ""}">${mystere ? "?" : echappe(t.titre)}</span>`).join("");
}

/* Arrivée depuis le quiz : le mot à surligner a voyagé dans sessionStorage. */
function surlignageDepuisQuiz() {
  try {
    const s = JSON.parse(sessionStorage.getItem("surlignage"));
    sessionStorage.removeItem("surlignage");
    if (s && s.id && s.terme && location.hash.slice(1) === s.id) rechercheEnCours = s;
  } catch (e) { }
}

/* =========================================================
   4. DÉMARRAGE
   ========================================================= */

addEventListener("hashchange", router);
addEventListener("scroll", majProgression, { passive: true });
addEventListener("resize", majProgression);
addEventListener("scroll", memoriserPosition, { passive: true });
addEventListener("pagehide", () => { if (voixDispo) speechSynthesis.cancel(); });

(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => dessinerLogo($("logo-mot")));

chargerTextes()
  .then(() => { rendreFiltres(); rendreSommaire(); rendreGalerie(); rendreAuteurs(); rendreBestiaire(); rendreEncartQuiz(); initRecherche(); initEcoute(); surlignageDepuisQuiz(); router(); })
  .catch(e => afficherErreur(location.protocol === "file:" ? "Le navigateur bloque la lecture des fichiers .txt en local." : e.message));
