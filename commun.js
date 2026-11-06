/* =========================================================
   OUTILS COMMUNS aux deux pages (index.html et quiz.html)
   Thème jour/nuit, recherche sans accents, liens du bestiaire,
   chargement des textes, logo. Pas besoin d'y toucher.
   ========================================================= */

const slug = t => "texte-" + t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const paragraphes = t => t.trim().split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
const nbMots = t => t.trim() ? t.trim().split(/\s+/).length : 0;
const tempsLecture = t => Math.max(1, Math.round(nbMots(t) / 230));
const echappe = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

TEXTES.forEach((t, i) => { t.id = slug(t.titre); t.index = i; });

const $ = id => document.getElementById(id);

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

async function chargerTextes() {
  await Promise.all(TEXTES.map(async t => {
    const r = await fetch(t.fichier);
    if (!r.ok) throw new Error(`Le fichier « ${t.fichier} » est introuvable (erreur ${r.status}).`);
    t.contenu = (await r.text()).replace(/\r\n/g, "\n");
  }));
}

/* ---------- Outils : recherche sans tenir compte des accents ni des majuscules ---------- */

const cacheNormalise = new Map();
function normaliser(s) {
  if (s.length > 200 && cacheNormalise.has(s)) return cacheNormalise.get(s);
  const res = normaliserSansCache(s);
  if (s.length > 200) cacheNormalise.set(s, res);
  return res;
}

function normaliserSansCache(s) {
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

/* Les mots-clés du bestiaire doivent correspondre à une expression entière,
   afin qu'un terme générique ne crée pas de renvois dans des mots plus longs. */
function occurrencesReference(texte, terme) {
  const q = normaliser(terme.trim()).n;
  if (!q) return [];
  const { n, map } = normaliser(texte);
  const res = [];
  let i = n.indexOf(q);
  while (i >= 0) {
    const avant = i === 0 || !/[\p{L}\p{N}]/u.test(n[i - 1]);
    const apres = i + q.length === n.length || !/[\p{L}\p{N}]/u.test(n[i + q.length]);
    if (avant && apres) res.push([map[i], map[i + q.length - 1] + 1]);
    i = n.indexOf(q, i + q.length);
  }
  return res;
}

const slugFiche = nom => "fiche-" + nom.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
BESTIAIRE.forEach(f => { f.id = slugFiche(f.nom); });

function textesDeLaFiche(f) {
  return TEXTES.filter(t => f.mots.some(mot => occurrencesReference(t.contenu, mot).length));
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

/* ---------- Petits outils de hasard ---------- */
const melanger = liste => {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const auHasard = liste => liste[Math.floor(Math.random() * liste.length)];


/* ---------- Menu burger (téléphone) ---------- */
(function initMenu() {
  const burger = $("burger"), menu = $("menu");
  if (!burger || !menu) return;
  const barre = burger.closest(".barre");
  const ouvrir = oui => {
    barre.classList.toggle("menu-ouvert", oui);
    burger.setAttribute("aria-expanded", oui);
    burger.setAttribute("aria-label", oui ? "Fermer le menu" : "Ouvrir le menu");
  };
  burger.onclick = () => ouvrir(!barre.classList.contains("menu-ouvert"));
  menu.addEventListener("click", e => { if (e.target.closest("a")) ouvrir(false); });
  addEventListener("hashchange", () => ouvrir(false));
  addEventListener("keydown", e => {
    if (e.key === "Escape" && barre.classList.contains("menu-ouvert")) { ouvrir(false); burger.focus(); }
  });
  document.addEventListener("click", e => { if (!barre.contains(e.target)) ouvrir(false); });
})();
