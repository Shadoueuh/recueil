/* =========================================================
   SCRIPT DU SITE « Recueil de sottises insensées et incongrues »
   1. Vos données : textes, auteurs, photos, bestiaire (à modifier)
   2. Fonctionnement de base : sommaire, galerie, lecture, zoom…
   3. Fonctionnalités bonus : recherche, sottisomètre, bestiaire,
      reprise de lecture, lecture à voix haute
   4. Démarrage
   ========================================================= */

/* =========================================================
   1. VOS DONNÉES

   VOS TEXTES
   Chaque texte est un fichier .txt dans le dossier « recueil ».
   Écrivez-y normalement : une ligne vide entre deux paragraphes.

   - titre   : le titre affiché
   - auteur  : doit correspondre à un nom dans AUTEURS
   - fichier : le chemin du .txt
   - affiche (facultatif) : le chemin de l'image dans « affiches ».
     Un texte avec une affiche apparaît dans la galerie et reçoit
     une vignette encadrée dans le sommaire.

   Attention : les .txt sont chargés avec fetch, qui ne marche pas
   en ouvrant index.html par double-clic. En local, utilisez
   l'extension Live Server de VS Code (clic droit > Open with Live
   Server). En ligne (Netlify, GitHub Pages), ça marche tout seul.
   ========================================================= */

const AUTEURS = {
  Jules: "Jules, un être humain sans vergogne, aux intentions néfastes envers tout els sujets qui lui trainent sous la plume. Il adore inventer des systèmes aussi gigantesques que frauduleux, et se complaît dans le fait d'imposer à des individus parfois innocents, aussi blancs que neiges, parfois des personnes qu'on ne qualifierait pas d'être à la moralité humaine. Ses punitions sont des corvées éternelles plongeait les personnes qui doivent les effectuer dans un enfer réel et sasn échappatoire.",
  Simon: "Simon n’est pas Simon. C’est en réalité une nuée de lutins-mouches souriantes qui forment, de loin, la silhouette d’un étudiant. Chacune de ses phrases cache une autre phrase, qui cache elle-même un cochon-tirelire, qui s’avère être son grand frère. Il écrit comme il respire, c’est-à-dire en révélant à chaque inspiration que l’air est quelqu’un d’autre. Tous ses textes finissent de la même façon : l’espace et le temps sont détruits à jamais, mais seulement après le goûter."
};

/* Photos des auteurs (dossier « photos »). Laissez vide ("") pour ne pas en mettre. */
const PHOTOS = {
  Jules: "photos/jules.jpg",
  Simon: "photos/simon.jpg"
};

/* =========================================================
   LE BESTIAIRE
   - nom         : le nom affiché sur la fiche
   - type        : "Créature", "Lieu", "Objet", "Châtiment" (ou un type à vous)
   - mots        : les mots à repérer dans les textes. Le premier trouvé
                   devient un lien vers la fiche, et la fiche liste
                   automatiquement les textes où il apparaît.
   - description : quelques lignes de présentation
   Ces premières fiches sont une base : réécrivez-les à votre sauce.
   ========================================================= */
const BESTIAIRE = [
  { nom: "Les galaxies stoïciennes", type: "Lieu", mots: ["galaxies stoïciennes"],
    description: "Un amas de galaxies dont les habitants pratiquent le stoïcisme avec un sérieux absolu. De toute leur vie, ils ne prononcent qu'un seul mot : « hmmm »." },
  { nom: "Petit Pois industriel", type: "Lieu", mots: ["Petit Pois industriel"],
    description: "Galaxie miniature, ronde, compacte et d'un vert foncé surprenant. Elle doit son nom à sa ressemblance troublante avec un légume en conserve." },
  { nom: "Balactica", type: "Lieu", mots: ["Balactica"],
    description: "Planète au système dangereusement proche du nôtre. Ses habitants ont tous au moins 26 doigts de pied, mais aucun pouce aux mains." },
  { nom: "La pipistrelle-loutre", type: "Créature", mots: ["loutre de mer", "pipistrelle"],
    description: "Hybride créé dans un laboratoire secret du Grand Nord : une pipistrelle atteinte de psoriasis croisée avec une loutre de mer à trois pattes et 17 nageoires." },
  { nom: "Les gobelins à carreaux", type: "Créature", mots: ["gobelins"],
    description: "Petits gobelins malicieux en pantalon rouge à carreaux vert pomme. Ils ne se sont pas coupé l'ongle de l'auriculaire du pied gauche depuis la 13e lune d'hiver." },
  { nom: "Les mules indonésiennes", type: "Créature", mots: ["mules Indonésiennes"],
    description: "Seule monture capable de faire le tour des anneaux de Saturne en 13,7 secondes. Résistante aux bombardements de mini-frigos en feu." },
  { nom: "Le béluga géant", type: "Créature", mots: ["beluga", "béluga"],
    description: "Béluga géant, albinos et aveugle, dont la salive sert de liant au carton prémâché sur les plus grands chantiers de l'univers." },
  { nom: "Le dernier Lombax", type: "Créature", mots: ["Lombax"],
    description: "Dernier survivant de son espèce, perdu quelque part dans le multivers. Il ne connaît qu'une phrase, mais traduit tout le reste en morse avec ses ongles de pouce." },
  { nom: "La toupie géante", type: "Objet", mots: ["toupie géante"],
    description: "Engin à l'inertie démentielle, conçu pour emmener tous les dinosaures de la Terre coloniser une autre planète. Le plan comporte quelques failles." },
  { nom: "La brique d'argile de Mauritanie", type: "Objet", mots: ["argile"],
    description: "Brique d'argile molle, à façonner à volonté. Indispensable en cas d'ennui morbide pendant une traque cosmique." },
  { nom: "L'unique tube de colle UHU", type: "Objet", mots: ["colle UHU"],
    description: "Seul tube de colle disponible pour bâtir un édifice d'un million de milliards de mètres. À utiliser avec la sagesse cumulée des moines shaolin." },
  { nom: "Le train bolchévique", type: "Objet", mots: ["train Bolchévique"],
    description: "Convoi gigantesque dont l'itinéraire et la cargaison peuvent changer du tout au tout sans le moindre préavis. Personne ne sait vraiment qui tient la locomotive." },
  { nom: "Les cornichons de mer", type: "Créature", mots: ["cornichons de mer"],
    description: "Espèce marine voyageant en vrac, cargaison d'origine du train bolchévique. On ignore s'ils sont saumurés de naissance." },
  { nom: "Les châteaux de sable éternels", type: "Châtiment", mots: ["chateaux de sable", "châteaux de sable"],
    description: "Le sort des candidats malchanceux : chaque atome changé en grain de sable, puis dispersé au gré du vent pour l'éternité." },
  { nom: "Le podium à vie", type: "Objet", mots: ["podium"],
    description: "Récompense suprême des vainqueurs d'Indre-et-Loire. Il est formellement interdit d'en descendre, jusqu'à la fin de ses jours." },
  { nom: "L'apnée éternelle", type: "Châtiment", mots: ["apnée éternelle"],
    description: "Punition des perdants d'Indre-et-Loire : de l'apnée au fond de la mer Baltique, pour toujours. Aucune remontée n'est prévue au règlement." },
];

const TEXTES = [
  { titre: "Le Kirkversary", auteur: "Jules", fichier: "recueil/kirkversary.txt", affiche: "affiches/kirkversary.webp" },
  { titre: "Chasse à l'Homme Cosmique", auteur: "Jules", fichier: "recueil/chasse-a-l-homme-cosmique.txt", affiche: "affiches/chasse-a-l-homme.webp" },
  { titre: "La Route de la Pénitence Infernale", auteur: "Jules", fichier: "recueil/route-infernale.txt", affiche: "affiches/route-infernale.webp" },
  { titre: "Le Démantèlement Galactique", auteur: "Jules", fichier: "recueil/demantelement-galactique.txt" },
  { titre: "Le Tournoi du Lesotho Démoniaque", auteur: "Jules", fichier: "recueil/tournoi-lesotho.txt" },
  { titre: "Le Train Bolchévique aux Cornichons", auteur: "Jules", fichier: "recueil/train-cornichon.txt", affiche:"affiches/train-bolchevique.webp" },
  { titre: "La Secte Hindu de François Bayrou", auteur: "Jules", fichier: "recueil/secte-hindu.txt", affiche:'affiches/secte_hindu.webp' },
  { titre: "Le Tournoi des Membres", auteur: "Jules", fichier: "recueil/tournoi-des-membres.txt", affiche:'affiches/tournoi-membres.webp'},
  { titre: "Le Podium d'Indre-et-Loire", auteur: "Jules", fichier: "recueil/indre-et-loire.txt"},
  { titre: "La Farandole Saturnienne", auteur: "Simon", fichier: "recueil/farandole-saturnienne.txt", affiche: "affiches/farandole.webp" },
  { titre: "La Parade d'Astérion", auteur: "Simon", fichier: "recueil/parade-d-asterion.txt" },
  { titre: "La baignoire cosmique", auteur: "Simon", fichier: "recueil/baignoire-cosmique.txt" },
];

/* =========================================================
   2. FONCTIONNEMENT DE BASE (pas besoin d'y toucher)
   ========================================================= */

const slug = t => "texte-" + t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const paragraphes = t => t.trim().split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
const nbMots = t => t.trim() ? t.trim().split(/\s+/).length : 0;
const tempsLecture = t => Math.max(1, Math.round(nbMots(t) / 230));
const echappe = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

TEXTES.forEach((t, i) => { t.id = slug(t.titre); t.index = i; });

const $ = id => document.getElementById(id);
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
    const debut = premier ? premier.split(/\s+/).slice(0, 26).join(" ") + "…" : "Texte à venir.";
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
  img.onerror = () => { zoom.img = null; $("v-image").innerHTML = `<p class="vide-message">L'image « ${echappe(t.affiche)} » est introuvable. Vérifiez qu'elle est bien dans le dossier à côté de index.html.</p>`; };
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
    $("l-affiche").innerHTML = `<button type="button" aria-label="Agrandir l'affiche">${cadre(t)}</button><span>L'affiche de ce texte. Cliquez pour l'agrandir.</span>`;
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

/* Préférences du lecteur (gardées dans son navigateur si possible) */
const lire = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const ecrire = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } };

function appliquerTheme(nuit) {
  document.documentElement.dataset.theme = nuit ? "nuit" : "jour";
  $("theme").textContent = nuit ? "Jour" : "Nuit";
  $("theme").setAttribute("aria-label", nuit ? "Passer en mode jour" : "Passer en mode nuit");
}
let nuit = lire("theme") ? lire("theme") === "nuit" : matchMedia("(prefers-color-scheme: dark)").matches;
appliquerTheme(nuit);
$("theme").onclick = () => { nuit = !nuit; appliquerTheme(nuit); ecrire("theme", nuit ? "nuit" : "jour"); };

const tailles = ["1.05rem", "1.2rem", "1.38rem"];
let taille = Number(lire("taille") ?? 1) || 1;
document.documentElement.style.setProperty("--taille-texte", tailles[taille]);
$("taille").onclick = () => {
  taille = (taille + 1) % tailles.length;
  document.documentElement.style.setProperty("--taille-texte", tailles[taille]);
  ecrire("taille", taille);
  majProgression();
};

async function chargerTextes() {
  await Promise.all(TEXTES.map(async t => {
    const r = await fetch(t.fichier);
    if (!r.ok) throw new Error(`Le fichier « ${t.fichier} » est introuvable (erreur ${r.status}).`);
    t.contenu = (await r.text()).replace(/\r\n/g, "\n");
  }));
}

function afficherErreur(message) {
  $("vue-accueil").hidden = false;
  $("sommaire").innerHTML = `<li class="erreur"><strong>Les textes n'ont pas pu être chargés.</strong> ${echappe(message)}
${location.protocol === "file:" ? "<br>Vous avez ouvert la page par double-clic : ouvrez-la plutôt avec Live Server dans VS Code." : ""}</li>`;
}


/* =========================================================
   3. FONCTIONNALITÉS BONUS
   ========================================================= */

/* ---------- Outils : recherche sans tenir compte des accents ni des majuscules ---------- */

function normaliser(s) {
  let n = "";
  const map = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    for (const k of c) { n += k; map.push(i); }
  }
  map.push(s.length);
  return { n, map };
}

/* Renvoie les positions [début, fin] de chaque occurrence de « terme » dans « s ». */
function occurrences(s, terme) {
  const q = normaliser(terme.trim()).n;
  if (!q) return [];
  const { n, map } = normaliser(s);
  const res = [];
  let i = n.indexOf(q);
  while (i >= 0) {
    res.push([map[i], map[i + q.length - 1] + 1]);
    i = n.indexOf(q, i + q.length);
  }
  return res;
}

const slugFiche = nom => "fiche-" + nom.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
BESTIAIRE.forEach(f => { f.id = slugFiche(f.nom); });

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
      const occ = occurrences(p, mot)[0];
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
    $("resultats").innerHTML = `<li class="aucun">Aucune sottise ne contient « ${echappe(q)} ». Essayez un autre mot, sans vous soucier des accents.</li>`;
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

function textesDeLaFiche(f) {
  return TEXTES.filter(t => f.mots.some(mot => occurrences(t.contenu, mot).length));
}

function rendreBestiaire() {
  const types = ["Tous", ...new Set(BESTIAIRE.map(f => f.type))];
  $("filtres-bestiaire").innerHTML = types.map(ty =>
    `<button class="filtre" type="button" aria-pressed="${ty === filtreBestiaire}" data-type="${echappe(ty)}">${echappe(ty === "Tous" ? "Tout" : ty + "s")}</button>`).join("");
  $("filtres-bestiaire").querySelectorAll("button").forEach(b => b.onclick = () => { filtreBestiaire = b.dataset.type; rendreBestiaire(); });
  const liste = BESTIAIRE.filter(f => filtreBestiaire === "Tous" || f.type === filtreBestiaire);
  $("liste-bestiaire").innerHTML = liste.map(f => {
    const textes = textesDeLaFiche(f);
    return `<li><article class="fiche" id="${f.id}">
      <span class="f-type">${echappe(f.type)}</span>
      <h3>${echappe(f.nom)}</h3>
      <p>${echappe(f.description)}</p>
      <p class="f-textes">${textes.length
        ? "Apparaît dans " + textes.map(t => `<a href="#${t.id}">${echappe(t.titre)}</a>`).join(", ")
        : "N'apparaît encore dans aucun texte."}</p>
    </article></li>`;
  }).join("");
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
  el.innerHTML = `<span>Vous lisiez <strong>${echappe(t.titre)}</strong>, arrêté à ${Math.round(r * 100)} %.</span>
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
      $("l-reprise").innerHTML = `<span>Vous vous étiez arrêté à ${Math.round(r * 100)} % de ce texte.</span>
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


/* ---------- Le logo « Sottises » désarticulé ----------
   Lettre par lettre, chacune de travers ; le « o » est Saturne,
   le dernier « s » tombe sur le surligneur moutarde.
   Les positions sont mesurées avec la police du site, d'où le
   dessin une fois la police chargée. */
function dessinerLogo(svg) {
  if (!svg) return;
  const ns = "http://www.w3.org/2000/svg";
  svg.replaceChildren();
  const el = (tag, attrs, parent = svg) => { const e = document.createElementNS(ns, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  const lettres = [["S", -6, 0], ["o", 0, 0], ["t", 5, 4], ["t", -4, -3], ["i", 7, 5], ["s", -5, -2], ["e", 8, 6], ["s", -9, 0]];
  const base = 128, taille = 96, ecart = 5;
  let x = 14;
  lettres.forEach(([c, rot, dy], i) => {
    if (c === "o") {
      const g = el("g", { transform: `translate(${x + 44} ${base - 32})` });
      const anneau = d => el("path", { d, fill: "none", stroke: "#C6C565", "stroke-width": 8, "stroke-linecap": "round", transform: "rotate(-18)" }, g);
      anneau("M -44 0 A 44 12 0 0 1 44 0");
      el("circle", { r: 28, fill: "#5B47C9" }, g);
      el("circle", { cx: -9, cy: -10, r: 6, fill: "#7A69DA" }, g);
      anneau("M -44 0 A 44 12 0 0 0 44 0");
      x += 92;
      return;
    }
    const g = el("g", {});
    const t = el("text", { x, y: base + dy, class: "logo-lettre", "font-size": taille }, g);
    t.textContent = c;
    const w = t.getComputedTextLength();
    const pivot = `rotate(${rot} ${x + w / 2} ${base - 34})`;
    t.setAttribute("transform", pivot);
    if (i === lettres.length - 1) {
      g.insertBefore(el("rect", { x: x - 6, y: base - 72, width: w + 12, height: 84, rx: 4, fill: "#C6C565", transform: pivot }, g), t);
      t.classList.add("sur-moutarde");
    }
    x += w + ecart;
  });
  const largeur = x + 14;
  svg.setAttribute("viewBox", `0 0 ${largeur} 200`);
  const sous = el("text", { x: largeur / 2, y: 186, "text-anchor": "middle", class: "logo-sous-titre" });
  sous.textContent = "insensées et incongrues";
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
  .then(() => { rendreFiltres(); rendreSommaire(); rendreGalerie(); rendreAuteurs(); rendreBestiaire(); initRecherche(); initEcoute(); router(); })
  .catch(e => afficherErreur(location.protocol === "file:" ? "Le navigateur bloque la lecture des fichiers .txt en local." : e.message));
