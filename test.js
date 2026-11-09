/* =========================================================
   QUELLE SOTTISE ES-TU ? — le test de personnalité du recueil
   Chaque réponse nourrit 8 traits de caractère. Chaque histoire a
   son propre profil sur ces 8 traits. Le résultat, c'est l'histoire
   dont le profil ressemble le plus au tien (similarité cosinus).
   ========================================================= */

const TRAITS = {
  cosmique:     { nom: "Démesure cosmique",     aide: "Tout doit être plus grand qu'un trou noir" },
  maniaque:     { nom: "Précision maniaque",    aide: "Le code hexadécimal, la picoseconde, le centime" },
  reglement:    { nom: "Bureaucratie du chaos", aide: "Règlements, épreuves, tournois et formulaires" },
  metamorphose: { nom: "Métamorphose",          aide: "Rien ne reste longtemps ce qu'il était" },
  spectacle:    { nom: "Sens du spectacle",     aide: "Tout peut devenir un concert, une parade ou une émission" },
  combine:      { nom: "Esprit de combine",     aide: "Il y a un marché pour tout, même le sable" },
  justicier:    { nom: "Justice implacable",    aide: "Chaque faute mérite son châtiment, de préférence éternel" },
  terroir:      { nom: "Ancrage local",         aide: "La D341, le Netto de Poitiers, l'Indre-et-Loire" }
};
const CLES_TRAITS = Object.keys(TRAITS);

/* ---------- Les profils des histoires ----------
   v : intensité de chaque trait (0 à 3), dans l'ordre de CLES_TRAITS.
   b : petit ajustement calculé par simulation (des milliers de parties)
       pour que chaque histoire sorte à peu près aussi souvent. */
const PROFILS = {
  "recueil/chasse-a-l-homme-cosmique.txt": {
    b: -0.036,
    v: [2, 3, 2, 0, 3, 1, 1, 2],
    accroche: "Tu as toujours un objet de secours sur toi. Quinze, en fait.",
    portrait: "Tu prévois tout : un nanorobot en cas de poursuite, une brique d'argile en cas d'ennui, un trou noir en cas de piercing mal placé. Ta vie est un inventaire, et chaque ligne est plus précise que la précédente. On te court souvent après, mais on ne t'attrape jamais.",
    fetiche: "La galaxie miniature « Petit Pois industriel »"
  },
  "recueil/kirkversary.txt": {
    b: 0.136,
    v: [3, 3, 1, 3, 1, 2, 3, 1],
    accroche: "Tu commences par le Kirkversary et tu finis par une guerre spatiale. C'est ton charme.",
    portrait: "Chez toi, rien ne se passe comme prévu, et c'est exactement le plan : un paquet cadeau devient une catapulte, des invités deviennent des sauterelles à tronçonneuse, une peau devient du papier à bulles. Tu as le goût des punitions interminables et des durées impossibles, comme 17 minutes et 512 secondes et trois quarts.",
    fetiche: "Une feuille A5 et un pot de fiente de pigeon"
  },
  "recueil/secte-hindu.txt": {
    b: 0.3,
    v: [3, 3, 3, 2, 1, 3, 2, 0],
    accroche: "Tu as un règlement pour tout, même pour compter les soleils.",
    portrait: "Tu parles comme un rapport ministériel, même pour décrire l'indescriptible. Tu aimes les rituels (cinq corvées suprêmes, trois fois par semaine), les prix au centime de shilling près et les horloges qui rendent des oracles. Ton point faible : une simple peau de banane peut faire tomber ton empire galactique.",
    fetiche: "Une horloge à pendule antique"
  },
  "recueil/route-infernale.txt": {
    b: -0.335,
    v: [0, 3, 1, 1, 0, 1, 3, 3],
    accroche: "Tu connais la limitation de vitesse de chaque départementale de France.",
    portrait: "Pas besoin du cosmos pour être absurde : une départementale, un fossé et quelques nids-de-poule te suffisent. Tu as un sens aigu de la justice, et un sens encore plus aigu du code de la route. Les escrocs n'ont qu'à bien se tenir : chez toi, la pénitence se fait au bord de la D341.",
    fetiche: "Une nouvelle recette de mastic"
  },
  "recueil/demantelement-galactique.txt": {
    b: -0.001,
    v: [2, 3, 1, 1, 0, 1, 3, 0],
    accroche: "Tu choisis tes couleurs au code hexadécimal près.",
    portrait: "Seul contre mille, avec un plan qui passe par une pipistrelle et une loutre à dix-sept nageoires : c'est tout toi. Tu as le goût des missions impossibles et des détails inutiles, et tu ne laisses jamais une injustice impunie. Personne ne copie ton vert moutarde sans en subir les conséquences.",
    fetiche: "Une dalle de 3,6 t de béton armé"
  },
  "recueil/tournoi-lesotho.txt": {
    b: 0,
    v: [3, 3, 3, 1, 1, 2, 1, 2],
    accroche: "Pour toi, une élection se gagne en sept épreuves, dont deux troisièmes.",
    portrait: "Tu ne fais rien à moitié : quand tu organises quelque chose, il y a un règlement, un chronomètre et au moins une mule indonésienne. Ton cerveau mélange Saturne, Sodebo et les Fournils de Bretagne sans jamais perdre le fil. Tu es exigeant, et tu as bien raison.",
    fetiche: "Le tube de colle UHU unique"
  },
  "recueil/train-cornichon.txt": {
    b: -0.101,
    v: [0, 1, 1, 3, 2, 1, 0, 0],
    accroche: "Pour toi, tout finit en gag. Au sens propre.",
    portrait: "Tu as l'art du détournement : un train de cornichons change de route, sa cargaison change de nature, et à la fin quelqu'un glisse sur une peau de banane. Tu fais court, tu vas droit au but, et ta logique est implacable.",
    fetiche: "Un cornichon de mer"
  },
  "recueil/tournoi-des-membres.txt": {
    b: -0.04,
    v: [1, 1, 3, 2, 1, 0, 2, 0],
    accroche: "Tu commences toujours par l'épreuve la plus difficile.",
    portrait: "Chez toi, l'échauffement, c'est une éruption volcanique. Tu aimes les compétitions à enjeux maximaux et les règlements sans sortie de secours. Mais il y a aussi une âme de poète en toi : qui d'autre aurait pensé aux châteaux de sable dispersés au gré du vent ?",
    fetiche: "Le sommet d'un volcan"
  },
  "recueil/indre-et-loire.txt": {
    b: -0.321,
    v: [0, 2, 3, 0, 1, 0, 2, 3],
    accroche: "Une seule phrase te suffit pour inventer un jeu télévisé entier.",
    portrait: "Tu es efficace : là où d'autres écrivent des pages, toi tu poses un concept en une ligne. Tu aimes ta région, tu aimes les podiums, et tu as une idée très arrêtée de ce que mérite chaque perdant. Les récompenses à vie, c'est ton truc.",
    fetiche: "Un podium, pour la vie"
  },
  "recueil/farandole-saturnienne.txt": {
    b: 0.022,
    v: [3, 2, 0, 3, 2, 0, 3, 0],
    accroche: "Tu mènes l'enquête, même quand tu arrêtes la mauvaise personne.",
    portrait: "Tu vois grand, très grand : des chaussures de deux années-lumière, une humanité changée en poissons, une farandole autour de Saturne. Tu adores les retournements de situation, surtout ceux que personne n'a vus venir. Et quand tu te trompes, tu te trompes en grand : tu arrêtes Dieu.",
    fetiche: "Le filet plus grand que le multivers"
  },
  "recueil/parade-d-asterion.txt": {
    b: -0.172,
    v: [3, 0, 0, 1, 3, 0, 1, 0],
    accroche: "Tu ne fais jamais d'entrée discrète. Jamais.",
    portrait: "Pour toi, tout est prétexte à défilé : de la musique, des lutins-mouches par milliards et un sourire géant pour couronner le tout. Tu vas vite, tu vas fort, et tu ne t'encombres pas des détails. La fin de l'Univers ? Une simple formalité après le spectacle.",
    fetiche: "Un lutin-mouche souriant"
  },
  "recueil/baignoire-cosmique.txt": {
    b: 0.082,
    v: [3, 1, 1, 0, 1, 3, 0, 0],
    accroche: "Tu prends les montées en puissance très au sérieux.",
    portrait: "Tu as un esprit de manga : chaque problème appelle un adversaire dix fois plus grand que le précédent. Tu sais vendre du rêve, et tu sais aussi organiser le transport le moins homologué du cosmos. Avec toi, un simple bain finit en combat cosmique entre deux anciens présidents.",
    fetiche: "Une baignoire gargantuesque"
  },
  "recueil/grand_mensonge_noel": {
    b: 0.135,
    v: [0, 0, 1, 3, 0, 3, 0, 0],
    accroche: "Tu as toujours un plan B, et il passe par le pôle Nord.",
    portrait: "Tu as le goût des promesses qui tournent mal : on annonce un paradis des bonbons, on livre un atelier de lutins. Tu aimes les transformations radicales et les voyages en enceinte Marshall volante. Derrière ton air de magie de Noël se cache un vrai sens des affaires.",
    fetiche: "Une enceinte Marshall volante"
  },
  "recueil/heure_des_pros.txt": {
    b: 0.055,
    v: [2, 3, 1, 0, 3, 1, 1, 1],
    accroche: "Tu calcules le nombre exact de pinceaux qu'il te faut. Il t'en faut 3,6 × 10⁸⁹.",
    portrait: "Tu es un perfectionniste de l'absurde : peindre la carte du monde directement sur la planète, à l'échelle 1, en 13 picosecondes, ne te fait pas peur. Tu adores les plateaux télé et les chroniques en direct. Ton défaut : quand le projet dérape, tu pars dans tous les sens.",
    fetiche: "Un pinceau de la taille d'un proton"
  },
  "recueil/le_concert_de_trop.txt": {
    b: 0.022,
    v: [3, 2, 2, 0, 3, 0, 2, 0],
    accroche: "Pour toi, un concert sans règlement n'est pas un concert.",
    portrait: "Tu es exigeant avec ton public comme avec tes musiciens : une fausse note, et c'est l'aiguille d'une année-lumière. Tu aimes les scènes démesurées, les partitions impossibles et les voyages à un mètre par an. Tu as le sens du spectacle total, de la première note jusqu'à la destruction de l'espace-temps.",
    fetiche: "Une guitare de la taille d'UY Scuti"
  },
  "recueil/marche_noir_noel": {
    b: 0,
    v: [0, 0, 0, 2, 0, 3, 0, 1],
    accroche: "Tu changes souvent d'itinéraire en cours de route.",
    portrait: "Tu vas à l'essentiel : un aller simple, un détour imprévu par la Laponie, et le tour est joué. Tu as un vrai sens de la combine et une préférence pour les plans courts. Le Père Noël a toujours besoin de main-d'œuvre, et tu le sais mieux que personne.",
    fetiche: "Un billet pour la Laponie"
  },
  "recueil/odysee_boules_humaines.txt": {
    b: -0.138,
    v: [0, 2, 1, 3, 2, 0, 0, 1],
    accroche: "Tu voyages en baleine bleue, et tu prends ton temps.",
    portrait: "Tu aimes les expériences scientifiques improbables et les collisions d'époques : une Coupe du monde dans les grottes de Lascaux, pourquoi pas ? Tu es d'une patience à toute épreuve (cinquante ans de quarantaine ne te font pas peur) et tu as un goût prononcé pour les transformations.",
    fetiche: "Une baleine bleue de 1 km³"
  },
  "recueil/operation_cajou_polaire": {
    b: 0.113,
    v: [0, 2, 1, 0, 0, 3, 0, 0],
    accroche: "Tu montes des projets gigantesques pour des objectifs minuscules.",
    portrait: "Un traîneau géant, des tireurs de 2,30 m minimum, un igloo plus haut que la Burj Khalifa… tout ça pour un trafic de noix de cajou. Tu as le sens de la logistique et un faible pour les petits commerces très bien organisés.",
    fetiche: "Une noix de cajou"
  },
  "recueil/tournoi_interplanétaire": {
    b: 0.199,
    v: [2, 3, 3, 1, 3, 2, 2, 0],
    accroche: "Tu caches toujours une punition dans le règlement.",
    portrait: "Tu organises, tu sponsorises, tu diffuses en direct : tu es une agence événementielle à toi seul. Tu as le goût des mesures absurdes (une usine de 8245 km de large sur 35 cm de haut) et des sanctions sournoises. Ceux qui perdent contre toi ne s'en remettent pas.",
    fetiche: "Une usine de 35 cm de haut"
  },
  "recueil/trafic_chaud_froid.txt": {
    b: 0.079,
    v: [0, 1, 1, 0, 1, 3, 1, 0],
    accroche: "Tu vendrais du sable au Sahara. D'ailleurs, tu le fais.",
    portrait: "Tu as un sens des affaires à toute épreuve : là où les autres voient un désert, toi tu vois un marché. Tu sais attirer les foules (une contrebasse de 8 m, ça aide) et tu as toujours une solution de repli, même si elle passe par l'Antarctique.",
    fetiche: "Une contrebasse géante de 8 m"
  }
};

/* ---------- Les questions ----------
   Chaque réponse : [texte, { trait: points }] */
const QUESTIONS_TEST = [
  ["Tu dois organiser l'anniversaire de ta grand-tante. Ton premier réflexe ?", [
    ["Réserver UY Scuti : c'est la seule salle assez grande pour le gâteau.", { cosmique: 2, spectacle: 1 }],
    ["Rédiger un règlement intérieur de 14 pages, annexes comprises.", { reglement: 2, maniaque: 1 }],
    ["Revendre les invitations à 1,63 € pièce.", { combine: 2, maniaque: 1 }],
    ["Transformer les invités en guirlandes vivantes. C'est plus festif.", { metamorphose: 2, spectacle: 1 }]]],
  ["Quelqu'un te double dans la file du Netto. Tu fais quoi ?", [
    ["Je le condamne à porter tous les orangs-outans d'Amazonie pour l'éternité.", { justicier: 2, cosmique: 1 }],
    ["Je note son heure de passage à la seconde près : 17 h 42 min 08 s.", { maniaque: 2, terroir: 1 }],
    ["Je lui propose de monter un trafic de noix de cajou. Il a l'air motivé.", { combine: 2 }],
    ["Je lance un débat télévisé en direct sur le sujet.", { spectacle: 2 }]]],
  ["Ton moyen de transport idéal ?", [
    ["Une baignoire tirée par un quintilliard de créatures.", { cosmique: 2, spectacle: 1 }],
    ["Un train dont j'ai changé l'itinéraire et la cargaison en route.", { metamorphose: 2, reglement: 1 }],
    ["Une mule indonésienne : le tour des anneaux de Saturne en 13,7 s.", { maniaque: 2, cosmique: 1 }],
    ["Ma voiture, sur la D341, à 50 km/h à cause des nids-de-poule.", { terroir: 2, maniaque: 1 }]]],
  ["Ta plus grande qualité ?", [
    ["Le sens du détail : je connais le code hexadécimal de ma couleur préférée.", { maniaque: 3 }],
    ["Le sens du spectacle : tout peut devenir un concert.", { spectacle: 3 }],
    ["Le sens des affaires : tout se revend, même le sable.", { combine: 3 }],
    ["Le sens de la justice : chaque faute mérite son châtiment.", { justicier: 3 }]]],
  ["Et ton plus grand défaut ?", [
    ["Je vois toujours trop grand. Genre, dix fois plus grand qu'un trou noir.", { cosmique: 2 }],
    ["Je ne sais pas laisser une chose telle qu'elle est. Il faut qu'elle devienne autre chose.", { metamorphose: 2 }],
    ["Je transforme tout en compétition, même le petit-déjeuner.", { reglement: 2 }],
    ["Je ne sors jamais de mon département.", { terroir: 2 }]]],
  ["Quelle peine pour quelqu'un qui ne ramène pas son caddie ?", [
    ["L'apnée éternelle dans la mer Baltique.", { justicier: 2, terroir: 1 }],
    ["Être changé en château de sable, puis dispersé au gré du vent.", { metamorphose: 2, justicier: 1 }],
    ["Nettoyer les toilettes de Galactus.", { cosmique: 2, justicier: 1 }],
    ["Aucune. Je lui revends son caddie.", { combine: 2 }]]],
  ["Tu gagnes un concours. Quel lot choisis-tu ?", [
    ["Une camionnette assez grande pour accueillir tout un pays.", { cosmique: 1, combine: 1 }],
    ["Un podium… sur lequel il faut rester toute sa vie.", { reglement: 2, terroir: 1 }],
    ["Une galaxie miniature vert foncé, ronde et compacte.", { cosmique: 2, maniaque: 1 }],
    ["Un tube de colle UHU unique, à utiliser avec une immense sagesse.", { maniaque: 2, reglement: 1 }]]],
  ["Ton émission de télé idéale ?", [
    ["Une chasse à l'homme diffusée obligatoirement sur tous les écrans.", { spectacle: 2, reglement: 1 }],
    ["Un documentaire sur la fosse des Mariannes, filmé de très, très près.", { justicier: 2, maniaque: 1 }],
    ["Du télé-achat, mais pour des igloos.", { combine: 2, metamorphose: 1 }],
    ["Une émission de relooking… vraiment radicale.", { metamorphose: 2, spectacle: 1 }]]],
  ["On te confie une planète entière. Tu en fais quoi ?", [
    ["Je peins toutes les frontières directement dessus, à l'échelle 1.", { maniaque: 2, cosmique: 1 }],
    ["J'y organise un tournoi interplanétaire, avec sponsors.", { reglement: 2, spectacle: 1 }],
    ["Je la loue. À l'heure.", { combine: 2, cosmique: 1 }],
    ["Je la mets dans une toupie géante pour voir ce que ça donne.", { cosmique: 2, metamorphose: 1 }]]],
  ["Ton repas préféré ?", [
    ["Un sandwich thon crudités de chez Sodebo, lancé à pleine vitesse.", { terroir: 2, spectacle: 1 }],
    ["Des cacahuètes mi-cuites mi-salées, à 1,63 € pièce au Netto du centre-ville de Poitiers.", { terroir: 1, maniaque: 2 }],
    ["Des croissants beurrés. 54 tartillions minimum.", { cosmique: 2, terroir: 1 }],
    ["Peu importe, tant qu'il a d'abord été autre chose.", { metamorphose: 2 }]]],
  ["Un ami te demande un service. Tu réponds :", [
    ["« D'accord, mais c'est moi qui fixe les règles, et il y aura sept épreuves. »", { reglement: 3 }],
    ["« D'accord, mais tu me le devras 21 519 818 fois. »", { maniaque: 2, combine: 1 }],
    ["« D'accord, si on le fait sur scène, devant tout l'Univers. »", { spectacle: 2, cosmique: 1 }],
    ["« D'accord, mais si tu échoues, tu sais ce qui t'attend. »", { justicier: 2, reglement: 1 }]]],
  ["Comment tu comptes le temps ?", [
    ["En picosecondes.", { maniaque: 2 }],
    ["En milliards de millénaires.", { cosmique: 2 }],
    ["En éternités de punition.", { justicier: 2 }],
    ["Jusqu'à ce que ça devienne rentable.", { combine: 2 }]]],
  ["Ta pièce préférée dans une maison ?", [
    ["La salle de bain : la baignoire est assez grande pour l'humanité entière.", { cosmique: 1, combine: 1, spectacle: 1 }],
    ["Le garage, pour bricoler des croisements entre une loutre et une chauve-souris.", { metamorphose: 2, maniaque: 1 }],
    ["Le salon, pour accueillir un concert devant des gradins gigantesques.", { spectacle: 2 }],
    ["La cave, pour stocker ma contrebande de neige.", { combine: 2 }]]],
  ["Face à une injustice, tu…", [
    ["…montes une opération pour la démanteler, seul s'il le faut.", { justicier: 3 }],
    ["…en fais une chronique télé, le soir même.", { spectacle: 2, maniaque: 1 }],
    ["…la changes en peau de banane, et tout le monde glisse dessus.", { metamorphose: 2, spectacle: 1 }],
    ["…cherches comment en tirer un petit bénéfice.", { combine: 2 }]]],
  ["Si tu étais un objet du bestiaire ?", [
    ["Le filet plus grand que le multivers.", { cosmique: 2, justicier: 1 }],
    ["L'aiguille d'une année-lumière de long et un nanomètre de large.", { maniaque: 2, justicier: 1 }],
    ["Le cochon-tirelire aspirateur.", { combine: 2, spectacle: 1 }],
    ["Le podium d'Indre-et-Loire.", { reglement: 2, terroir: 1 }]]],
  ["Comment tu te présentes à quelqu'un ?", [
    ["Ma taille, mon poids, mon code postal et l'heure exacte.", { maniaque: 2, terroir: 1 }],
    ["« Je suis le Grand Monarque. »", { cosmique: 2, spectacle: 1 }],
    ["« Je vends des choses. Tu veux quoi ? »", { combine: 2 }],
    ["« En fait, je suis un Lombax. »", { metamorphose: 2, spectacle: 1 }]]],
  ["Où passes-tu tes vacances ?", [
    ["En Indre-et-Loire. Évidemment.", { terroir: 3 }],
    ["Sur les anneaux de Saturne.", { cosmique: 2 }],
    ["En Laponie, mais j'y travaille.", { combine: 1, metamorphose: 1 }],
    ["Au fond de la mer Baltique. J'ai un rendez-vous éternel.", { justicier: 2 }]]],
  ["Quel super-pouvoir choisirais-tu ?", [
    ["Changer les molécules d'eau en n'importe quoi d'autre.", { metamorphose: 3 }],
    ["Avoir quinze nombrils, chacun rempli d'un objet indispensable.", { maniaque: 2, cosmique: 1 }],
    ["Un coup de paume capable de renvoyer une baignoire sur Terre.", { cosmique: 2, justicier: 1 }],
    ["Convaincre n'importe qui d'acheter n'importe quoi.", { combine: 3 }]]],
  ["Projet de groupe à l'IUT. Ton rôle ?", [
    ["Je fais le diagramme de Gantt. À la picoseconde près.", { maniaque: 2, reglement: 1 }],
    ["Je fais l'oral, avec effets pyrotechniques.", { spectacle: 2 }],
    ["Je fixe les sanctions pour ceux qui ne font rien.", { justicier: 2, reglement: 1 }],
    ["Je négocie la note avec le prof.", { combine: 2 }]]],
  ["Quel bruit fais-tu le matin ?", [
    ["« Hmmm. » Comme un habitant des galaxies stoïciennes.", { reglement: 1, cosmique: 1 }],
    ["Un solo de guitare à plus d'un million de km par nanoseconde.", { spectacle: 2, cosmique: 1 }],
    ["Le bruit d'une affaire qui se conclut.", { combine: 2 }],
    ["Le petit « clic » d'un trombone qui sauve les dinosaures.", { maniaque: 1, metamorphose: 1 }]]],
  ["Ta couleur préférée ?", [
    ["#c6c565, et pas une nuance de plus.", { maniaque: 3 }],
    ["Le vert foncé d'une galaxie en forme de petit pois.", { cosmique: 2 }],
    ["La couleur de l'argent.", { combine: 2 }],
    ["Ça dépend de ce en quoi je l'ai transformée.", { metamorphose: 2 }]]],
  ["Que mets-tu dans ta valise ?", [
    ["Un pinceau de la taille d'un proton, puis un d'1 mm³ de plus, et ainsi de suite.", { maniaque: 2, cosmique: 1 }],
    ["Une salopette, soit trop grande, soit trop petite. Jamais la bonne taille.", { reglement: 1, justicier: 1 }],
    ["Rien. J'ai revendu la valise.", { combine: 2 }],
    ["Des souliers de lutin de deux années-lumière.", { cosmique: 2, metamorphose: 1 }]]],
  ["La fin du monde, c'est demain. Ta dernière action ?", [
    ["Organiser le plus grand concert de l'Univers.", { spectacle: 3 }],
    ["Finir de remplir mon formulaire, en trois exemplaires.", { reglement: 2, maniaque: 1 }],
    ["Vendre des billets pour assister à la fin du monde.", { combine: 2, spectacle: 1 }],
    ["Régler mes comptes avec tout le monde, une bonne fois pour toutes.", { justicier: 2 }]]],
  ["On t'offre un animal de compagnie.", [
    ["Une loutre de mer à trois pattes et dix-sept nageoires.", { maniaque: 2, metamorphose: 1 }],
    ["Une mule, entraînée pour les records de vitesse.", { reglement: 1, maniaque: 1 }],
    ["Un cochon-tirelire vivant.", { combine: 2 }],
    ["Une baleine bleue de 1 km³, pour les trajets.", { cosmique: 2, metamorphose: 1 }]]],
  ["Ton rapport aux règles ?", [
    ["Je les écris.", { reglement: 3 }],
    ["Je les applique. Sévèrement.", { justicier: 2, reglement: 1 }],
    ["Je les contourne, moyennant finance.", { combine: 2 }],
    ["Je les transforme en autre chose.", { metamorphose: 2 }]]],
  ["Ton endroit préféré en France ?", [
    ["Le Netto du centre-ville de Poitiers.", { terroir: 2, maniaque: 1 }],
    ["La D341, entre Calais et Lens.", { terroir: 3 }],
    ["Les grottes de Lascaux, pour y jouer au foot.", { terroir: 1, spectacle: 2 }],
    ["La France, c'est un peu petit, non ?", { cosmique: 2 }]]],
  ["Comment tu règles une dispute ?", [
    ["Par un combat cosmique qui détruit l'existence elle-même.", { cosmique: 2, justicier: 1 }],
    ["Par un tournoi à élimination directe, petite finale comprise.", { reglement: 2, spectacle: 1 }],
    ["Par un passage à tabac jusqu'à la fin des temps.", { justicier: 3 }],
    ["Je fais payer l'entrée aux spectateurs.", { combine: 2, spectacle: 1 }]]],
  ["Qu'est-ce qui te fait rire ?", [
    ["Quelqu'un qui glisse sur une peau de banane.", { metamorphose: 1, spectacle: 2 }],
    ["Une mesure absurde : 8245 km de large sur 1,30 m de long.", { maniaque: 3 }],
    ["Une punition qui ne dit pas son nom.", { justicier: 2, combine: 1 }],
    ["Une échelle complètement démesurée.", { cosmique: 2 }]]],
  ["Ton héros ?", [
    ["Le caporal-sergent-chef de Jordanie, seul contre mille.", { justicier: 2, maniaque: 1 }],
    ["Le candidat qui récite toutes les conditions d'utilisation d'Internet en 1 h.", { reglement: 2, maniaque: 1 }],
    ["Le méchant à la retraite, qui s'en est très bien sorti.", { combine: 2, metamorphose: 1 }],
    ["Le Christ Cosmique de 13 années-lumière de haut.", { cosmique: 2, spectacle: 1 }]]],
  ["Ta philosophie, en une phrase ?", [
    ["« Plus c'est grand, plus c'est vrai. »", { cosmique: 3 }],
    ["« Le diable est dans les détails, et je les ai tous notés. »", { maniaque: 3 }],
    ["« Rien ne se perd, tout se transforme. »", { metamorphose: 3 }],
    ["« Il y a un marché pour tout. »", { combine: 3 }]]],
  ["Tu ouvres un commerce. Lequel ?", [
    ["Une boulangerie, en partenariat avec tous les Fournils de Bretagne.", { terroir: 3 }],
    ["Une agence de voyages… vers le trou noir le plus massif du cosmos.", { cosmique: 2, combine: 1 }],
    ["Un bureau des réclamations, ouvert le 13e jour de chaque Lune d'hiver.", { reglement: 2, maniaque: 1 }],
    ["Un cirque, avec des artistes qui n'ont pas vraiment signé.", { spectacle: 2, metamorphose: 1 }]]],
  ["Ton entrée sur scène idéale ?", [
    ["Poussé par quelqu'un d'une année-lumière de haut, à 1 m par an.", { cosmique: 2, spectacle: 1 }],
    ["Sur un matelas de 50 × 70 cm, après un saut sans parachute.", { maniaque: 2, justicier: 1 }],
    ["Dans une enceinte Marshall volante.", { spectacle: 2, metamorphose: 1 }],
    ["Par la petite porte, en faisant payer ceux qui entrent par la grande.", { combine: 2 }]]]
];

/* =========================================================
   MOTEUR
   ========================================================= */
const zoneTest = $("test");
const CLE_RESULTAT = "test-resultat";
const fichierNFC = f => (f || "").normalize("NFC");
const histoireDuProfil = new Map(Object.keys(PROFILS).map(f => [f, TEXTES.find(t => fichierNFC(t.fichier) === fichierNFC(f))]).filter(([, t]) => t));

// Le maximum de points possible par trait, pour une série de questions
function maximaDes(questions) {
  const max = Object.fromEntries(CLES_TRAITS.map(k => [k, 0]));
  for (const [, reponses] of questions) for (const k of CLES_TRAITS) max[k] += Math.max(...reponses.map(([, p]) => p[k] || 0));
  return max;
}

function cosinus(a, b) {
  let ab = 0, aa = 0, bb = 0;
  for (let i = 0; i < a.length; i++) { ab += a[i] * b[i]; aa += a[i] * a[i]; bb += b[i] * b[i]; }
  return aa && bb ? ab / Math.sqrt(aa * bb) : 0;
}

// Le profil du joueur : chaque trait ramené entre 0 et 1 selon les questions posées
function profilDuJoueur(partie) {
  const brut = Object.fromEntries(CLES_TRAITS.map(k => [k, 0]));
  partie.reponses.forEach((r, i) => {
    if (r === null) return;
    const points = QUESTIONS_TEST[partie.ordre[i]][1][r][1];
    for (const k in points) brut[k] += points[k];
  });
  const max = maximaDes(partie.ordre.map(i => QUESTIONS_TEST[i]));
  return CLES_TRAITS.map(k => max[k] ? brut[k] / max[k] : 0);
}

function classerLesHistoires(profil) {
  // On centre les profils : ce qui compte, c'est ce qui te distingue, pas le niveau moyen
  const moyenne = profil.reduce((s, x) => s + x, 0) / profil.length;
  const centre = profil.map(x => x - moyenne);
  return [...histoireDuProfil.entries()].map(([f, t]) => {
    const v = PROFILS[f].v;
    const m = v.reduce((s, x) => s + x, 0) / v.length;
    const score = cosinus(centre, v.map(x => x - m));
    return { f, t, score, rang: score + (PROFILS[f].b || 0) };
  }).sort((a, b) => b.rang - a.rang);
}

// Le pourcentage affiché correspond exactement au classement (ajustement compris)
const pourcentage = rang => Math.min(99, Math.max(1, Math.round((rang + 1) / 2 * 100)));

/* ---------- Partie en cours ---------- */
let partie = null;

function nouvellePartie(nb) {
  const indices = melanger(QUESTIONS_TEST.map((_, i) => i)).slice(0, nb);
  partie = {
    ordre: indices,
    melanges: indices.map(() => melanger([0, 1, 2, 3])),
    reponses: indices.map(() => null),
    courante: 0
  };
  rendreQuestion();
}

/* ---------- Écrans ---------- */

function rendreAccueilTest() {
  const ancien = (() => { try { return JSON.parse(lire(CLE_RESULTAT) || "null"); } catch (e) { return null; } })();
  const ancienT = ancien && TEXTES.find(t => t.id === ancien.id);
  zoneTest.innerHTML =
    '<div class="pt-accueil">' +
      "<h2>Quelle histoire du recueil sommeille en toi ?</h2>" +
      "<p>Réponds sans trop réfléchir. Chaque réponse révèle un peu de ta démesure, de ta précision maniaque, de ton sens du spectacle ou de ton esprit de combine. À la fin, on te dit quelle sottise te ressemble le plus.</p>" +
      '<div class="pt-modes">' +
        '<button type="button" class="pt-mode" data-nb="12"><strong>Version express</strong><span>12 questions · 3 minutes</span></button>' +
        '<button type="button" class="pt-mode pt-mode-complet" data-nb="' + QUESTIONS_TEST.length + '"><strong>Version intégrale</strong><span>' + QUESTIONS_TEST.length + " questions · le résultat le plus précis</span></button>" +
      "</div>" +
      '<p class="pt-note">Les ' + histoireDuProfil.size + ' histoires du recueil peuvent sortir.</p>' +
      (ancienT ? '<p class="pt-ancien">La dernière fois, tu étais <a href="index.html#' + ancienT.id + '">' + echappe(ancienT.titre) + "</a>. Voyons si ça a changé.</p>" : "") +
    "</div>";
  zoneTest.querySelectorAll(".pt-mode").forEach(b => b.onclick = () => nouvellePartie(Number(b.dataset.nb)));
}

function rendreQuestion() {
  const i = partie.courante, n = partie.ordre.length;
  const [question, reponses] = QUESTIONS_TEST[partie.ordre[i]];
  const choisie = partie.reponses[i];
  zoneTest.innerHTML =
    '<div class="pt-entete"><span><strong>Question ' + (i + 1) + "</strong> sur " + n + "</span>" +
      (i > 0 ? '<button type="button" class="pt-retour" id="pt-retour">← Question précédente</button>' : "") + "</div>" +
    '<div class="pt-progression" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + i + '"><span style="width:' + Math.round(i / n * 100) + '%"></span></div>' +
    '<h2 class="pt-question" id="pt-question" tabindex="-1">' + echappe(question) + "</h2>" +
    '<ol class="pt-reponses" type="A">' + partie.melanges[i].map((r, j) =>
      '<li><button type="button" class="pt-reponse' + (choisie === r ? " choisie" : "") + '" data-r="' + r + '">' +
        '<span class="pt-lettre" aria-hidden="true">' + "ABCD"[j] + "</span>" + echappe(reponses[r][0]) + "</button></li>"
    ).join("") + "</ol>" +
    '<p class="pt-abandon"><button type="button" class="q-oubli" id="pt-abandon">Abandonner le test</button></p>';
  zoneTest.querySelectorAll(".pt-reponse").forEach(b => b.onclick = () => repondre(Number(b.dataset.r)));
  if (i > 0) $("pt-retour").onclick = () => { partie.courante--; rendreQuestion(); };
  $("pt-abandon").onclick = () => { if (confirm("Abandonner le test ? Tes réponses seront perdues.")) { partie = null; rendreAccueilTest(); } };
  const titre = $("pt-question");
  if (titre.getBoundingClientRect().top < 70 || titre.getBoundingClientRect().top > innerHeight * .5) {
    zoneTest.scrollIntoView({ block: "start" });
  }
  titre.focus({ preventScroll: true });
}

function repondre(r) {
  partie.reponses[partie.courante] = r;
  if (partie.courante < partie.ordre.length - 1) {
    partie.courante++;
    rendreQuestion();
  } else {
    terminer();
  }
}

function terminer() {
  const profil = profilDuJoueur(partie);
  const classement = classerLesHistoires(profil);
  const gagnant = classement[0];
  ecrire(CLE_RESULTAT, JSON.stringify({ id: gagnant.t.id, profil }));
  partie = null;
  rendreResultat(profil, classement, false);
}

function barresDeTraits(profil) {
  return '<ul class="pt-traits">' + CLES_TRAITS.map((k, i) => {
    const v = Math.round(profil[i] * 100);
    return '<li title="' + echappe(TRAITS[k].aide) + '"><span class="pt-t-nom">' + TRAITS[k].nom + "</span>" +
      '<span class="pt-t-barre" aria-hidden="true"><span style="width:' + v + '%"></span></span>' +
      '<span class="pt-t-val">' + v + "</span></li>";
  }).join("") + "</ul>";
}

function rendreResultat(profil, classement, partage) {
  const g = classement[0], p = PROFILS[g.f], t = g.t;
  // Les deux traits qui te définissent le plus
  const forts = partage ? [] : CLES_TRAITS.map((k, i) => [k, profil[i]]).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => TRAITS[k].nom.toLowerCase());
  zoneTest.innerHTML =
    '<div class="pt-resultat">' +
      '<p class="sur-titre-quiz">' + (partage ? "On t’a envoyé un résultat" : "Ton résultat") + "</p>" +
      "<h2>" + (partage ? "Cette personne est…" : "Tu es…") + "</h2>" +
      '<div class="pt-carte">' +
        (t.affiche ? '<img class="pt-affiche" src="' + t.affiche + '" alt="Affiche de ' + echappe(t.titre) + '" loading="lazy">' : "") +
        '<div class="pt-carte-texte">' +
          '<p class="pt-titre">' + echappe(t.titre) + "</p>" +
          '<p class="pt-auteur">une histoire de ' + echappe(t.auteur) + " · " + pourcentage(g.rang) + " % de ressemblance</p>" +
          '<p class="pt-accroche">' + echappe(p.accroche) + "</p>" +
          '<p class="pt-portrait">' + echappe(p.portrait) + "</p>" +
          '<p class="pt-fetiche"><span>Ton objet fétiche</span> ' + echappe(p.fetiche) + "</p>" +
          '<a class="outil plein" href="index.html#' + t.id + '">Lire ' + (partage ? "cette" : "ton") + " histoire</a>" +
        "</div>" +
      "</div>" +
      (partage ? "" :
        '<h3 class="q-recap-titre">Ton profil de sottise</h3>' +
        '<p class="pt-forts">Ce qui te définit le plus : ' + forts.join(" et ") + ".</p>" +
        barresDeTraits(profil) +
        '<h3 class="q-recap-titre">Ta ressemblance avec chaque histoire</h3>' +
        '<ol class="pt-affinites">' + classement.map((x, i) =>
          '<li class="' + (i === 0 ? "pt-premier" : i > 3 ? "pt-loin" : "") + '"><a href="index.html#' + x.t.id + '">' + echappe(x.t.titre) + "</a>" +
            '<span class="pt-a-barre" aria-hidden="true"><span style="width:' + pourcentage(x.rang) + '%"></span></span>' +
            "<strong>" + pourcentage(x.rang) + " %</strong></li>").join("") + "</ol>" +
        (classement.length > 4 ? '<button type="button" class="q-oubli pt-tout-voir" id="pt-tout-voir">Voir les ' + classement.length + " histoires</button>" : "") +
        '<p class="pt-oppose">Ton contraire absolu : <a href="index.html#' + classement[classement.length - 1].t.id + '">' +
          echappe(classement[classement.length - 1].t.titre) + "</a>.</p>") +
      '<div class="pt-actions">' +
        (partage
          ? '<a class="outil plein" href="test.html">Faire le test à mon tour</a>'
          : '<button type="button" class="outil plein" id="pt-partager">Partager mon résultat</button>' +
            '<button type="button" class="outil" id="pt-rejouer">Refaire le test</button>') +
      "</div>" +
      '<input class="tl-lien" id="pt-lien" type="text" readonly hidden aria-label="Lien de partage">' +
    "</div>";
  if (!partage) {
    $("pt-rejouer").onclick = rendreAccueilTest;
    $("pt-partager").onclick = () => partagerResultat(t, g.rang);
    const toutVoir = $("pt-tout-voir");
    if (toutVoir) toutVoir.onclick = () => { zoneTest.querySelector(".pt-affinites").classList.add("pt-tout"); toutVoir.remove(); };
  }
  zoneTest.scrollIntoView({ block: "start" });
}

async function partagerResultat(t, score) {
  const url = new URL(location.href);
  url.hash = "resultat=" + t.index.toString(36) + "." + pourcentage(score);
  const lien = url.toString();
  const texte = "J'ai fait le test « Quelle sottise es-tu ? » : je suis " + t.titre + " !";
  if (navigator.share && matchMedia("(pointer: coarse)").matches) {
    try { await navigator.share({ title: "Quelle sottise es-tu ?", text: texte, url: lien }); return; } catch (e) { if (e.name === "AbortError") return; }
  }
  const champ = $("pt-lien"), bouton = $("pt-partager");
  champ.hidden = false;
  champ.value = lien;
  try {
    await navigator.clipboard.writeText(texte + " " + lien);
    bouton.textContent = "Copié ✓";
    bouton.classList.add("tl-copie");
    setTimeout(() => { bouton.textContent = "Partager mon résultat"; bouton.classList.remove("tl-copie"); }, 2500);
  } catch (e) {
    champ.focus();
    champ.select();
  }
}

function lireResultatPartage() {
  const m = location.hash.match(/^#resultat=([0-9a-z]+)\.(\d+)$/);
  if (!m) return null;
  const t = TEXTES.find(x => x.index.toString(36) === m[1]);
  const f = t && [...histoireDuProfil.entries()].find(([, x]) => x === t)?.[0];
  if (!f) return null;
  // Un « classement » minimal pour l'affichage : seul le premier compte
  return [{ f, t, rang: Number(m[2]) / 50 - 1 }];
}

function demarrer() {
  const partage = lireResultatPartage();
  if (partage) rendreResultat(null, partage, true);
  else rendreAccueilTest();
}
addEventListener("hashchange", demarrer);
demarrer();

(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => dessinerLogo($("logo-mot")));
