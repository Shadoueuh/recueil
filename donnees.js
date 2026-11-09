/* =========================================================
   DONNÉES DU SITE : c'est le seul fichier à modifier au quotidien.
   Il est utilisé par les deux pages (index.html et quiz.html).

   VOS TEXTES
   Chaque texte est un fichier texte dans le dossier « recueil ».
   Il faut aussi l'ajouter à TEXTES ci-dessous pour qu'il apparaisse sur le site.
   Écrivez-y normalement : une ligne vide entre deux paragraphes.

   - titre   : le titre affiché
   - auteur  : doit correspondre à un nom dans AUTEURS
   - fichier : le chemin du fichier texte
   - resume  : résumé saugrenu affiché dans le sommaire
   - affiche (facultatif) : le chemin de l'image placée dans « affiches ».
     Un texte avec une affiche apparaît dans la galerie et reçoit
     une vignette encadrée dans le sommaire.

   Attention : les .txt sont chargés avec fetch, qui ne marche pas
   en ouvrant index.html par double-clic. En local, utilisez
   l'extension Live Server de VS Code (clic droit > Open with Live
   Server). En ligne (Netlify, GitHub Pages), ça marche tout seul.
   ========================================================= */

const AUTEURS = {
  Jules: "Jules est un être humain sans vergogne, aux intentions néfastes envers tous les sujets qui lui tombent sous la plume. Il adore inventer des systèmes aussi gigantesques que frauduleux, et se complaît à imposer ses châtiments à des individus tantôt innocents, blancs comme neige, tantôt si peu recommandables qu'on hésiterait à leur prêter la moindre moralité humaine. Ses punitions sont des corvées éternelles qui plongent ceux qui doivent les accomplir dans un enfer bien réel et sans échappatoire.",
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
   - type        : la catégorie, par exemple personnage, lieu ou détail
   - mots        : variantes exactes à repérer dans les textes ; elles
                   créent les liens vers la fiche et ses renvois aux textes.
   - description : quelques lignes de présentation
   Pour ajouter une référence, ajoutez une fiche avec ces quatre champs.
   ========================================================= */
const BESTIAIRE = [
  {
    nom: "Les galaxies stoïciennes", type: "Lieu", mots: ["galaxies stoïciennes"],
    description: "Un amas de galaxies dont les habitants pratiquent le stoïcisme avec un sérieux absolu. De toute leur vie, ils ne prononcent qu'un seul mot : « hmmm »."
  },
  {
    nom: "Petit Pois industriel", type: "Lieu", mots: ["Petit Pois industriel"],
    description: "Galaxie miniature, ronde, compacte et d'un vert foncé surprenant. Elle doit son nom à sa ressemblance troublante avec un légume en conserve."
  },
  {
    nom: "Balactica", type: "Lieu", mots: ["Balactica"],
    description: "Planète au système dangereusement proche du nôtre. Ses habitants ont tous au moins 26 doigts de pied, mais aucun pouce aux mains."
  },
  {
    nom: "La pipistrelle-loutre", type: "Créature", mots: ["loutre de mer", "pipistrelle"],
    description: "Hybride créé dans un laboratoire secret du Grand Nord : une pipistrelle atteinte de psoriasis croisée avec une loutre de mer à trois pattes et 17 nageoires."
  },
  {
    nom: "Les gobelins à carreaux", type: "Créature", mots: ["gobelins"],
    description: "Petits gobelins malicieux en pantalon rouge à carreaux vert pomme. Ils ne se sont pas coupé l'ongle de l'auriculaire du pied gauche depuis la 13e lune d'hiver."
  },
  {
    nom: "Les mules indonésiennes", type: "Créature", mots: ["mules Indonésiennes"],
    description: "Seule monture capable de faire le tour des anneaux de Saturne en 13,7 secondes. Résistante aux bombardements de mini-frigos en feu."
  },
  {
    nom: "Le béluga géant", type: "Créature", mots: ["beluga", "béluga"],
    description: "Béluga géant, albinos et aveugle, dont la salive sert de liant au carton prémâché sur les plus grands chantiers de l'univers."
  },
  {
    nom: "Le dernier Lombax", type: "Créature", mots: ["Lombax"],
    description: "Dernier survivant de son espèce, perdu quelque part dans le multivers. Il ne connaît qu'une phrase, mais traduit tout le reste en morse avec ses ongles de pouce."
  },
  {
    nom: "La toupie géante", type: "Objet", mots: ["toupie géante"],
    description: "Engin à l'inertie démentielle, conçu pour emmener tous les dinosaures de la Terre coloniser une autre planète. Le plan comporte quelques failles."
  },
  {
    nom: "La brique d'argile de Mauritanie", type: "Objet", mots: ["argile"],
    description: "Brique d'argile molle, à façonner à volonté. Indispensable en cas d'ennui morbide pendant une traque cosmique."
  },
  {
    nom: "L'unique tube de colle UHU", type: "Objet", mots: ["colle UHU"],
    description: "Seul tube de colle disponible pour bâtir un édifice d'un million de milliards de mètres. À utiliser avec la sagesse cumulée des moines shaolin."
  },
  {
    nom: "Le train bolchévique", type: "Objet", mots: ["train Bolchévique"],
    description: "Convoi gigantesque dont l'itinéraire et la cargaison peuvent changer du tout au tout sans le moindre préavis. Personne ne sait vraiment qui tient la locomotive."
  },
  {
    nom: "Les cornichons de mer", type: "Créature", mots: ["cornichons de mer"],
    description: "Espèce marine voyageant en vrac, cargaison d'origine du train bolchévique. On ignore s'ils sont saumurés de naissance."
  },
  {
    nom: "Les châteaux de sable éternels", type: "Châtiment", mots: ["chateaux de sables éternel"],
    description: "Le sort des candidats malchanceux : chaque atome changé en grain de sable, puis dispersé au gré du vent pour l'éternité."
  },
  {
    nom: "Le podium à vie", type: "Objet", mots: ["podium"],
    description: "Récompense suprême des vainqueurs d'Indre-et-Loire. Il est formellement interdit d'en descendre, jusqu'à la fin de ses jours."
  },
  {
    nom: "L'apnée éternelle", type: "Châtiment", mots: ["apnée éternelle"],
    description: "Punition des perdants d'Indre-et-Loire : de l'apnée au fond de la mer Baltique, pour toujours. Aucune remontée n'est prévue au règlement."
  },
  {
    nom: "Le passage à tabac jusqu'à la fin des temps", type: "Châtiment", mots: ["rouer de coups indéfiniment", "roués de coups"],
    description: "Le tarif officiel pour avoir arrêté le mauvais suspect : l'humanité entière tabasse les enquêteurs sur un radeau qui fait le tour de la Terre, sans date de fin."
  },
  {
    nom: "La prison du filet multiversel", type: "Châtiment", mots: ["en emprisonnant le vilain"],
    description: "Une prison sans barreaux mais plus grande que le multivers. Petit souci : le prisonnier n'était pas le vilain mais Dieu, son frère jumeau. Le vrai coupable, lui, profite de sa retraite."
  },
  {
    nom: "La sanction de la fausse note", type: "Châtiment", mots: ["fausse note"],
    description: "Au concert sur UY Scuti, chaque fausse note vaut une aiguille d'une année-lumière plantée dans un atome du musicien. Sur la partition la plus dure de l'Univers, personne ne tient plus de quelques secondes."
  },
  {
    nom: "Le collage éternel au cochon", type: "Châtiment", mots: ["resteront collés jusqu'à la fin des temps"],
    description: "Pas vraiment une punition, plutôt un défaut de visée du cochon-tirelire aspirateur. Mais pour ceux qui s'écrasent sur sa peau et y restent collés pour l'éternité, la nuance est mince."
  },
  {
    nom: "Les gargouilles mangeuses de migrants", type: "Créature", mots: ["gargouilles cannibales géantes mangeuses de migrants"],
    description: "Des gargouilles sauvages sans pitié, robustes et extrêmement dangereuses. Elles se nourrissent uniquement de migrants, c'est à se demander comment elles sont encore en vie !"
  },
  {
    nom: "Les mammouths radioactifs nucléaires", type: "Créature", mots: ["mammouths Radioactif Nucléaires"],
    description: "Une espèce atypique de mammouth qui s'est éteinte il y a très longtemps. Ils sont pourvus d'un nombre absurde de membres, de défenses en uranium et de crachats hautement toxiques."
  },
  {
    nom: "Les boules de chair difformes", type: "Châtiment", mots: ["boules de chair"],
    description: "Les gargouilles, transformées en boules de chair, sont condamnées à être accrochées à un sapin de Noël chez un proche de Michael Jackson."
  },
  {
    nom: "Le grand gros et gras rat gris et rabougri", type: "Créature", mots: ["grands gros et gras rat gris et rabougri"],
    description: "Le juge des crimes financiers de Montceau-les-Mines, il a suivi des affaires mondialement connues. Impitoyable et impartial, il a beaucoup d'imagination quant à ses punitions."
  },
  {
    nom: "La rédaction absurde et déraisonnable", type: "Châtiment", mots: ["21 519 818 fois"],
    description: "Les repris de justice doivent écrire un nombre incalculable de fois une phrase idiote, avec de l'encre limitée par les ressources"
  },
  {
    nom: "Les poissons kilométriques", type: "Créature", mots: ["poissons longs de 1 km"],
    description: "Une humanité transformée en poissons d'un kilomètre de long, mobilisée pour une farandole qui dépasse largement les anneaux de Saturne."
  },
  {
    nom: "Les lutins-mouches souriantes", type: "Créature", mots: ["lutins-mouches souriantes"],
    description: "Êtres microscopiques si nombreux qu'ils peuvent former une figure cosmique à l'effigie d'un célèbre youtubeur."
  },
  {
    nom: "La baignoire cosmique", type: "Objet", mots: ["baignoire gargantuesque"],
    description: "Vaisseau sanitaire démesuré, conçu pour traverser le cosmos avec une cargaison de promesses et quelques imprévus."
  },
  {
    nom: "Les enceintes volantes du Père Noël", type: "Objet", mots: ["enceintes Marshall géantes"],
    description: "Moyen de transport aérien choisi pour conduire les enfants jusqu'à l'atelier de Noël, sans passer par les voies habituelles."
  },
  {
    nom: "Les pinceaux planétaires", type: "Objet", mots: ["3,6 × 10⁸⁹ pinceaux", "pinceaux de tailles diverses"],
    description: "Collection de pinceaux couvrant toutes les échelles imaginables, réunie pour repeindre la carte du monde jusque sur la planète elle-même."
  },
  {
    nom: "Le cochon-tirelire aspirateur", type: "Créature", mots: ["cochon tirelire immense"],
    description: "Un cochon vivant doté d'une fente suffisamment puissante pour aspirer la population terrestre et l'expédier vers une scène stellaire."
  },
  {
    nom: "La Laponie du marché de Noël", type: "Lieu", mots: ["Laponie"],
    description: "Destination annoncée comme une visite festive, mais dont le programme réserve une tout autre organisation du travail."
  },
  {
    nom: "Le sous-marin des abysses", type: "Lieu", mots: ["sous-marin posé à 30km de profondeur marine"],
    description: "Laboratoire de quarantaine installé à une profondeur qui complique sérieusement les retours à la surface."
  },
  {
    nom: "L'igloo cajou de Sibérie", type: "Lieu", mots: ["igloo gigantesque", "trafic de noix de cajou"],
    description: "Construction polaire hors gabarit, destinée à abriter un commerce de noix de cajou à l'échelle continentale."
  },
  {
    nom: "Les usines confiseuses interplanétaires", type: "Lieu", mots: ["usine gigantesque"],
    description: "Installations de confiserie aux proportions déraisonnables, au cœur d'un tournoi où les sponsors ont eux-mêmes droit à leurs épreuves."
  },
  {
    nom: "La contrebasse géante", type: "Objet", mots: ["contrebasse géante"],
    description: "Instrument de huit mètres utilisé pour lancer un trafic qui joue sur deux extrêmes météorologiques."
  },
  // Personnages et noms cités
  { nom: "Charlie Kirk", type: "Personnage", mots: ["Charlie Kirk"], description: "Après une longue transformation, il pousse un cochon-tirelire jusqu'à UY Scuti et y joue le plus grand solo de l'Univers." },
  { nom: "François, chef des gargouilles", type: "Personnage", mots: ["grands chefs des gargouilles, François"], description: "Chef des gargouilles, assassiné par son grand frère… plus jeune que lui de 173 ans." },
  { nom: "Le frère de François", type: "Personnage", mots: ["我想吃中国菜"], description: "Frère cadet de François, désigné par une phrase en chinois dans le récit." },
  { nom: "Hugo Décrypte", type: "Personnage", mots: ["Hugo Décrypte"], description: "Magnat de la décoration festive qui vend les boules de Noël morbides, et sénateur vénézuélien à ses heures perdues." },
  { nom: "Elon Musk", type: "Personnage", mots: ["Elon Musk"], description: "Sa fortune sert d'unité de comparaison dans la chasse cosmique." },
  { nom: "Sylvain-Pierre Durif, Christ Cosmique", type: "Personnage", mots: ["Sylvain-Pierre Durif", "Sylvain Durif", "Christ Cosmique", "Grand Monarque"], description: "Figure cosmique invoquée dans la chasse à l'homme et la parade d'Astérion." },
  { nom: "Galactus", type: "Personnage", mots: ["Galactus"], description: "Entité cosmique dont les toilettes constituent une destination punitive." },
  { nom: "Michael Jackson, alias Belzébuth", type: "Personnage", mots: ["Michael Jackson", "Belzébuth"], description: "Figure de plusieurs récits, notamment la parade d'Astérion et le concert sur UY Scuti." },
  { nom: "François Bayrou", type: "Personnage", mots: ["François Bayrou"], description: "Ancien homme politique exilé après le vol d'un emmental affiné 110 ans, reconverti en gourou galactique pour financer sa consommation de Burger King." },
  { nom: "Baptiste Vrigneau", type: "Personnage", mots: ["Baptiste Vrigneau"], description: "Voix qui prononce les oracles des pendules de la secte." },
  { nom: "Justin Trudeau", type: "Personnage", mots: ["Justin Trudeau"], description: "Dirige le Canada autour duquel se trouve le laboratoire du démantèlement galactique." },
  { nom: "Jeffrey Epstein", type: "Personnage", mots: ["Jeffrey Epstein"], description: "Nom cité dans le démantèlement galactique et le tournoi interplanétaire." },
  { nom: "Donald Trump Jr.", type: "Personnage", mots: ["Donald Trump Jr."], description: "Grand Régent auquel est associé le gang de la secte Proucafion." },
  { nom: "Le gourou de Proucafion", type: "Personnage", mots: ["grand gourou de la secte de Proucafion"], description: "Personnage dont l'ADN sert au plan du caporal dans le démantèlement galactique." },
  { nom: "Raphaël Glucksmannson", type: "Personnage", mots: ["Raphaël Glucksmannson"], description: "Jumeau intergalactique norvégien lancé dans les épreuves du tournoi du Lesotho." },
  { nom: "Raphaël Glucksmann", type: "Personnage", mots: ["Raphaël Glucksmann"], description: "Enquêteur dans la farandole saturnienne." },
  { nom: "Grégoire Cliquet", type: "Personnage", mots: ["Grégoire Cliquet"], description: "Membre de l'équipe d'enquêteurs de la farandole saturnienne." },
  { nom: "Pierre Bueno", type: "Personnage", mots: ["Pierre Bueno"], description: "Membre de l'équipe d'enquêteurs de la farandole saturnienne." },
  { nom: "Adolf Hitler", type: "Personnage", mots: ["Adolf Hitler"], description: "Membre de l'équipe d'enquêteurs de la farandole saturnienne." },
  { nom: "Astérion", type: "Personnage", mots: ["Astérion"], description: "Youtubeur dont la figure est formée par les lutins-mouches." },
  { nom: "François Hollande", type: "Personnage", mots: ["François Hollande"], description: "Rival cosmique qui renvoie la baignoire sur Terre d'un coup de paume." },
  { nom: "Nicolas Sarkozy", type: "Personnage", mots: ["Nicolas Sarkozy"], description: "Rival cosmique de François Hollande, réveillé par la chute de la baignoire." },
  { nom: "Netero et ses mille paumes", type: "Personnage", mots: ["déesse au 1000 paumes de Netero"], description: "Référence de combat utilisée pour décrire le coup de paume de François Hollande." },
  { nom: "Pascal Praud", type: "Personnage", mots: ["Pascal Praud"], description: "Présentateur qui détourne le projet de cartographie dans L'Heure des Pros." },
  { nom: "Marine Le Pen", type: "Personnage", mots: ["Marine Le Pen"], description: "Personnalité dessinée sur le voile dans L'Heure des Pros." },
  { nom: "Alain Soral", type: "Personnage", mots: ["Alain Soral"], description: "Invité de la chronique télé aux côtés de Dieudonné et Daniel Conversano." },
  { nom: "Dieudonné", type: "Personnage", mots: ["Dieudonné"], description: "Invité de L'Heure des Pros dans le récit de la cartographie." },
  { nom: "Daniel Conversano", type: "Personnage", mots: ["Daniel Conversano"], description: "Invité et adversaire d'Alain Soral dans L'Heure des Pros." },
  { nom: "Norman Thavaud", type: "Personnage", mots: ["Norman Thavaud", "Norman Fait Des Vidéos"], description: "Président d'une équipe du tournoi interplanétaire et nom de la chaîne qui le diffuse." },
  { nom: "Squeezie, Lucas Hauchard", type: "Personnage", mots: ["Squeezie", "Lucas Hauchard"], description: "Youtubeur associé à la marque de kombucha qui sponsorise le tournoi interplanétaire." },
  { nom: "P. Diddy", type: "Personnage", mots: ["P. Diddy"], description: "Président de l'équipe adverse dans le tournoi interplanétaire." },
  { nom: "Drake", type: "Personnage", mots: ["Drake"], description: "Membre de l'équipe de P. Diddy dans le tournoi interplanétaire." },
  { nom: "Maître Gims", type: "Personnage", mots: ["Maitre Gims", "Maître Gims"], description: "Destinataire des bénéfices des usines dans le tournoi interplanétaire." },
  { nom: "Kev Adams", type: "Personnage", mots: ["Kev Adams"], description: "Destinataire des bénéfices des usines dans le tournoi interplanétaire." },
  { nom: "Gabriel Attal, petit-fils d'Hadès", type: "Personnage", mots: ["Gabriel Attal", "Hadès"], description: "Monarque infernal du tournoi du Lesotho, présenté comme le petit-fils d'Hadès." },
  { nom: "Panoramix", type: "Personnage", mots: ["Panoramix"], description: "Fournisseur d'une potion de jeunesse dans le tournoi du Lesotho." },
  { nom: "Brann Dailor", type: "Personnage", mots: ["Brann Dailor"], description: "Batteur associé au culte de la batterie dans le tournoi du Lesotho." },
  { nom: "Le groupe Mastodon", type: "Groupe", mots: ["Mastodon"], description: "Groupe auquel appartient le batteur Brann Dailor." },
  { nom: "Le Père Noël", type: "Personnage", mots: ["Père Noël"], description: "Personnage au centre de plusieurs détournements de Noël dans les textes." },
  // Lieux, pays et institutions
  { nom: "Le Sud-Soudan", type: "Lieu", mots: ["Sud-Soudan"], description: "Pays qui finance l'émission de chasse à l'homme." },
  { nom: "Le Vatican et les papes", type: "Institution", mots: ["pays tout entier du Vatican", "totalité des papes"], description: "Le Vatican et l'ensemble de ses papes deviennent un objet de survie intergalactique." },
  { nom: "La tour Montparnasse de Nantes", type: "Lieu", mots: ["tour Montparnasse, présente à Nantes"], description: "Tour parisienne déplacée par le texte jusqu'à Nantes." },
  { nom: "Le Netto du centre-ville de Poitiers", type: "Lieu", mots: ["Netto du centre-ville de Poitiers"], description: "Magasin où l'on peut acheter une chaussure cosmique à prix très précis." },
  { nom: "La secte des vélos électriques auto-alimentés", type: "Organisation", mots: ["secte prêchant les vélos électriques"], description: "Culte associé à des vélos qui s'alimentent par leur propre rotation." },
  { nom: "Detroit", type: "Lieu", mots: ["Detroit"], description: "Ville du Michigan où les terrains vagues attirent les spéculateurs de la Route de la Pénitence." },
  { nom: "La D341 entre Calais et Lens", type: "Lieu", mots: ["D341", "entre Calais et Lens"], description: "Départementale au bord de laquelle se tient le rassemblement de la Route de la Pénitence." },
  { nom: "La fosse des Mariannes", type: "Lieu", mots: ["fosse Marianne"], description: "Destination sous-marine des dirigeants du cartel dans le démantèlement galactique." },
  { nom: "Les dirigeants angolais", type: "Groupe", mots: ["mille dirigeants les plus sanguinaires d'Angola"], description: "Mille dirigeants qui composent l'organisation criminelle du démantèlement galactique." },
  { nom: "La Jordanie", type: "Lieu", mots: ["présent en Jordanie"], description: "Lieu où se trouve le caporal chargé de faire tomber le cartel." },
  { nom: "Le laboratoire secret du Grand Nord canadien", type: "Lieu", mots: ["laboratoire secret", "nord extrême du Canada"], description: "Laboratoire où sont créés les animaux hybrides du démantèlement galactique." },
  { nom: "Le Lesotho", type: "Lieu", mots: ["présidentiel de Lesotho"], description: "Pays enclavé dans l'Afrique du Sud où se déroule le tournoi présidentiel." },
  { nom: "L'Afrique du Sud", type: "Lieu", mots: ["dans l'Afrique du Sud"], description: "Pays qui encercle le Lesotho." },
  { nom: "La base militaire amérindienne", type: "Lieu", mots: ["base militaire amérindienne secrète"], description: "Base où les candidats doivent s'emparer d'un Rafale ou d'un F-35." },
  { nom: "Phoenix, en Arizona", type: "Lieu", mots: ["Phoenix, en Arizona"], description: "Ville où l'une des épreuves détourne le réseau d'eau en immense pool-party." },
  { nom: "Felucia", type: "Lieu", mots: ["Felucia"], description: "Planète à la flore particulière choisie pour accueillir les dinosaures." },
  { nom: "Papouasie-Nouvelle-Guinée", type: "Lieu", mots: ["Papouasie-Nouvelle-Guinée"], description: "Lieu d'origine attribué aux fondateurs de l'entité politique de la secte." },
  { nom: "La Mésopotamie", type: "Lieu", mots: ["Mésopotamie"], description: "Région où la secte hindoue est décrite comme belliqueuse." },
  { nom: "Le Moyen-Orient", type: "Lieu", mots: ["Moyen-Orient"], description: "Zone où la secte cible les enfants dans le texte." },
  { nom: "New York", type: "Lieu", mots: ["New York"], description: "Ville où les adeptes déambulent après la corvée de peau." },
  { nom: "La place publique de Guérin", type: "Lieu", mots: ["place publique de Guérin"], description: "Place mentionnée dans la punition infligée aux adeptes de la secte." },
  { nom: "La péninsule secrète d'Écosse", type: "Lieu", mots: ["péninsule secrète en Écosse"], description: "Lieu où se trouve le pigment rare de L'Heure des Pros." },
  { nom: "CNews", type: "Organisation", mots: ["Cnews"], description: "Chaîne sur laquelle se déroule la chronique de L'Heure des Pros." },
  { nom: "UY Scuti", type: "Lieu", mots: ["UY Scuti"], description: "Étoile géante choisie comme scène du Concert de Trop." },
  { nom: "Les grottes de Lascaux", type: "Lieu", mots: ["grottes de Lascaux"], description: "Destination finale des boules humaines dans l'Odyssée." },
  { nom: "La Sibérie", type: "Lieu", mots: ["Sibérie"], description: "Destination du traîneau géant de l'Opération Cajou Polaire." },
  { nom: "Le Burj Khalifa", type: "Lieu", mots: ["Burj Khalifa"], description: "Gratte-ciel qui sert de repère de hauteur pour l'igloo et le matelas du tournoi." },
  { nom: "Le Sahara", type: "Lieu", mots: ["Sahara"], description: "Désert où le trafic de sable doit être organisé." },
  { nom: "L'Antarctique", type: "Lieu", mots: ["Antarctique"], description: "Destination du trafic de neige dans Trafic de Chaud et de Froid." },
  { nom: "Le Zimbabwe", type: "Lieu", mots: ["Zimbabwé"], description: "L'un des trois pays concernés par la distribution de confiseries du tournoi." },
  { nom: "L'Inde", type: "Lieu", mots: ["Inde"], description: "Pays cité dans L'Heure des Pros et parmi les destinations du tournoi interplanétaire." },
  { nom: "L'Équateur", type: "Lieu", mots: ["Equateur"], description: "Pays dont tous les enfants doivent pouvoir tenir dans la camionnette du tournoi." },
  { nom: "Le Saint-Empire Germanique", type: "Institution", mots: ["Saint-Empire Germanique"], description: "Gouvernement qui finance un bus scolaire dans le tournoi interplanétaire." },
  { nom: "La chaîne YouTube Norman Fait Des Vidéos", type: "Œuvre", mots: ["Norman Fait Des Vidéos"], description: "Chaîne qui retransmet le tournoi interplanétaire." },
  { nom: "Les Trois Petits Cochons", type: "Œuvre", mots: ["3 petits cochons"], description: "Conte auquel le récit de L'Heure des Pros compare le souffle d'Alain Soral." },
  { nom: "Le tableau La Vague de Hokusai", type: "Œuvre", mots: ["La Vague", "Hokusai"], description: "Estampe reproduite par la transformation des victimes de la secte." },
  // Groupes, organisations et événements
  { nom: "La Grande Guerre Spatiale Migratoire", type: "Événement", mots: ["Grande Guerre Spatiale Migratoire"], description: "Conflit déclenché lorsque les invités du Festival se révèlent être des sauterelles." },
  { nom: "Les enfants croates et libanais", type: "Groupe", mots: ["enfants croates et libanais"], description: "Enfants mentionnés dans le récit du mur et des barres d'acier." },
  { nom: "Le parti conservateur d'extrême droite du Venezuela", type: "Organisation", mots: ["parti conservateur d'extrême droite du Venezuela"], description: "Parti auquel le texte rattache Hugo Décrypte." },
  { nom: "Les spéculateurs de la D341", type: "Groupe", mots: ["acheté des terrains vagues"], description: "Spéculateurs immobiliers convoqués dans la Route de la Pénitence." },
  { nom: "L'organisation criminelle de la Voie lactée", type: "Organisation", mots: ["organisation criminelle de l'histoire de l'univers"], description: "Cartel composé de dirigeants qui règnent chacun sur une planète." },
  { nom: "La secte Proucafion", type: "Organisation", mots: ["secte de Proucafion"], description: "Secte associée au gang recherché par la police intergalactique." },
  { nom: "Les réseaux sociaux d'Internet", type: "Organisation", mots: ["réseaux sociaux existant sur Internet"], description: "Leurs conditions d'utilisation font partie d'une épreuve du tournoi du Lesotho." },
  { nom: "Les enfants entomologistes", type: "Groupe", mots: ["métier de rêve de devenir entomologue"], description: "Public devant lequel les candidats récitent textes religieux et conditions d'utilisation." },
  { nom: "Le culte de la batterie de Brann Dailor", type: "Organisation", mots: ["culte de la batterie de Brann Dailor"], description: "Culte recherché dans le tournoi du Lesotho pour y trouver une potion." },
  { nom: "L'Angoulême's Portal To an Imminent and Painful Death", type: "Événement", mots: ["Angoulême's Portal To an Imminent and Painful Death"], description: "Festival métal mentionné dans l'épreuve consacrée au culte de la batterie." },
  { nom: "Les Grandes Corvées Suprêmes et Irrévocables", type: "Événement", mots: ["Grandes Corvées Suprêmes et Irrévocables"], description: "Série de cinq tâches imposées aux disciples de la secte de François Bayrou." },
  { nom: "Les Fidèles Destroyeurs de l'Espace Multi Planétaire", type: "Groupe", mots: ["Fidèles Destroyeurs de l’Espace Multi Planétaire", "Fidèles Destroyeurs"], description: "Grade supérieur attribué aux adeptes après des décennies de manipulations." },
  { nom: "L'équipe d'enquêteurs de la farandole", type: "Groupe", mots: ["équipe d'enquêteurs"], description: "Groupe composé de Grégoire Cliquet, Pierre Bueno, Raphaël Glucksmann et Adolf Hitler." },
  { nom: "Dieu et son frère jumeau", type: "Personnage", mots: ["Dieu étant son frère jumeau"], description: "Le récit révèle que le criminel et Dieu sont frères jumeaux." },
  { nom: "La population transformée en poissons", type: "Groupe", mots: ["population terrestre en poissons"], description: "Humanité transformée en poissons kilométriques pour tourner autour de Saturne." },
  { nom: "Les personnes visées par l'expérience de la baignoire", type: "Groupe", mots: ["individus en dessous du seuil de pauvreté"], description: "Personnes sous le seuil de pauvreté, en situation de handicap moteur ou atteintes de schizophrénie, ciblées par une promesse de monde meilleur avant leur enlèvement." },
  { nom: "Les migrants algériens", type: "Groupe", mots: ["migrants algériens"], description: "Personnes détournées vers le village du Père Noël dans Le Marché Noir de Noël." },
  { nom: "Les enfants du monde entier", type: "Groupe", mots: ["intégralité des enfants de tous les pays du monde entier"], description: "Enfants conduits chez le Père Noël dans Le Grand Mensonge de Noël." },
  { nom: "Les personnes sans bras, jambes et cheveux", type: "Groupe", mots: ["personnes sans jambes et sans bras et chauves"], description: "Participants de l'expérience scientifique germano-rwandaise." },
  { nom: "Les enfants sans bras ni jambes du tournoi", type: "Groupe", mots: ["sans bras ni jambes"], description: "Enfants auxquels le tournoi promet une vitesse de galipette hors norme." },
  { nom: "Les candidats du tournoi interplanétaire", type: "Groupe", mots: ["présidée par Norman Thavaud", "P. Diddy"], description: "Équipes présidées par Norman et Michael Jackson, puis P. Diddy et Drake." },
  { nom: "Les personnes attirées par la contrebasse", type: "Groupe", mots: ["personnes atteintes de trisomie 21"], description: "Public attiré vers le Sahara par la contrebasse géante." },
  { nom: "Le tournoi présidentiel du Lesotho", type: "Événement", mots: ["élection présidentiel de Lesotho"], description: "Élection transformée en sept épreuves de plus en plus difficiles." },
  { nom: "Le Tournoi des Membres", type: "Événement", mots: ["évènement d'une ampleur planétaire"], description: "Compétition où les parties du corps manquantes deviennent des récompenses." },
  { nom: "L'émission mondiale de chasse à l'homme", type: "Œuvre", mots: ["émission diffusée obligatoirement"], description: "Programme retransmis sur tous les appareils audiovisuels." },
  { nom: "Le projet détourné de cartographie planétaire", type: "Événement", mots: ["cartographie complète de la planète entière"], description: "Projet consistant à peindre les cartes et les noms directement sur la planète." },
  { nom: "Le tournoi interplanétaire des bandits", type: "Événement", mots: ["tournoi interplanétaire"], description: "Compétition diffusée en direct et financée par plusieurs sponsors." },
  { nom: "La course au trafic de sable et de neige", type: "Événement", mots: ["organiser un trafic de sable"], description: "Trafic organisé au Sahara, ou remplacé par un trafic de neige en Antarctique." },
  { nom: "Les trois fondateurs de Papouasie-Nouvelle-Guinée", type: "Groupe", mots: ["trois principaux fondateurs"], description: "Fondateurs impliqués dans une opération de carburant de fusée liée à la secte." },
  { nom: "Les adeptes de la secte hindoue", type: "Groupe", mots: ["adeptes sont contraints"], description: "Disciples forcés d'accomplir les Grandes Corvées et les opérations de la secte." },
  { nom: "Les banques à sperme du monde entier", type: "Institution", mots: ["banques à sperme accessibles"], description: "Cibles du braquage destiné à financer la secte de François Bayrou." },
  { nom: "Les deux personnes derrière Pégase", type: "Groupe", mots: ["deux individus en situation critique"], description: "Personnes endettées révélées derrière la créature mythique Pégase." },
  { nom: "Les gourous rivaux de la secte", type: "Groupe", mots: ["rival gourou philippin"], description: "Rivalité entre François Bayrou et un gourou philippin." },
  { nom: "L'arsenal nucléaire de François Bayrou", type: "Organisation", mots: ["arsenal nucléaire détenu par ses soins"], description: "Arsenal qui explose après la chute du gourou." },
  { nom: "La famine de la Voie lactée", type: "Événement", mots: ["famine d’ampleur planétaire"], description: "Catastrophe déclenchée par la détonation de l'arsenal nucléaire." },
  { nom: "La Voie lactée", type: "Lieu", mots: ["Voie lactée"], description: "Galaxie touchée par plusieurs catastrophes des récits." },
  { nom: "Andromède", type: "Lieu", mots: ["Andromède"], description: "Galaxie qui abrite des planètes contrôlées par le cartel." },
  { nom: "Les anneaux de Saturne", type: "Lieu", mots: ["anneaux de Saturne"], description: "Destination de la farandole de poissons et du parcours à dos de mule." },
  { nom: "Le Système solaire", type: "Lieu", mots: ["Système Solaire"], description: "Système dont la secte tente de compter les soleils." },
  { nom: "La destruction de l'espace et du temps", type: "Événement", mots: ["Espace et le Temps à jamais"], description: "Dénouement cosmique de plusieurs histoires du recueil." },
  // Objets, créatures, œuvres et détails singuliers
  { nom: "Le paquet-trampoline géant", type: "Objet", mots: ["paquet cadeau en forme de trampoline géant"], description: "Cadeau-trampoline haut de 500 milliards de kilomètres et large de 17 mètres." },
  { nom: "Les sauterelles à tête de tronçonneuse", type: "Créature", mots: ["grandes sauterelles avec une tronçonneuse à la place de la tête"], description: "Les prétendus invités du Festival, dotés d'une tronçonneuse en guise de tête." },
  { nom: "Le mur de béton et d'acier", type: "Objet", mots: ["murs de 154 892 m d'épaisseur"], description: "Mur de dimensions absurdes bâti avec du béton armé et des barres d'acier." },
  { nom: "La toilette de 666 kilomètres", type: "Objet", mots: ["toilette de 666 km"], description: "Construction des enfants rebelles pour y envoyer les vieilles dames de Montceau-les-Mines." },
  { nom: "La fiente de pigeon sans ailes ni pattes", type: "Substance", mots: ["fiente de pigeon sans ailes ni pattes"], description: "Seule encre autorisée pour la punition des 21 519 818 lignes." },
  { nom: "L'hybride chat-mille-pattes", type: "Créature", mots: ["hybride chat-mille pattes"], description: "Adversaire des pigeons qui auraient perdu leur bec dans un affrontement." },
  { nom: "La fosse beurrée de 500 kilomètres", type: "Lieu", mots: ["fosse de 500 km de profondeur"], description: "Gouffre huilé où les personnes réhabilitées sont envoyées après leurs punitions." },
  { nom: "La chaise criblée de pics", type: "Objet", mots: ["chaise criblée de pics"], description: "Siège placé au fond de la fosse pour recevoir les postérieurs des condamnés." },
  { nom: "Les sabots taille 56", type: "Objet", mots: ["sabots de la taille 56"], description: "Chaussures que les condamnés doivent vendre par téléphone." },
  { nom: "Les quinze nombrils de l'homme recherché", type: "Détail", mots: ["quinzaine de nombrils"], description: "Réserve d'outils de survie dissimulés sur le corps du fugitif." },
  { nom: "La poignée de nanorobots", type: "Objet", mots: ["mini poignée de nanorobots"], description: "Nanorobots destinés à boucher les pores des ravisseurs." },
  { nom: "La fausse capsule de cyanure", type: "Objet", mots: ["capsule de faux cyanure"], description: "Le faux poison contient de la poussière de peaux mortes accumulée pendant quinze ans." },
  { nom: "La Toyota Supra bi-turbo", type: "Objet", mots: ["Toyota Supra bi-turbo"], description: "Voiture de survie dissimulée dans un nombril." },
  { nom: "Le trou noir qui aspire les piercings", type: "Lieu", mots: ["trou noir qui pourra aspirer"], description: "Trou noir réglé pour aspirer uniquement les piercings des nombrils des poursuivants." },
  { nom: "L'usine de la plus grosse entreprise de l'univers", type: "Lieu", mots: ["usine de la plus grosse entreprise de tout l'univers"], description: "Usine gigantesque censée procurer une fortune incommensurable au fugitif." },
  { nom: "La chaussure de l'entité cosmique", type: "Objet", mots: ["chaussure portée par une entité cosmique"], description: "Chaussure d'une entité qui avale des univers et coûte 1,63 € au Netto de Poitiers." },
  { nom: "Le multivers respirant du cuivre", type: "Lieu", mots: ["multi-verse tout entier"], description: "Multivers où les êtres respirent de la poudre de cuivre et ont des jambes aux dimensions extrêmes." },
  { nom: "Le mastic de béton fait de mains et de pieds", type: "Substance", mots: ["alliage de béton naturel en mains et pieds"], description: "Recette de béton créée à partir des mains et pieds sacrifiés des spéculateurs." },
  { nom: "Les terrains vagues de Detroit", type: "Lieu", mots: ["terrains vagues"], description: "Terrains achetés à bas prix par les spéculateurs de la Route de la Pénitence." },
  { nom: "Le bitume et les nids-de-poule de la D341", type: "Détail", mots: ["nids de poules"], description: "État de la route qui sert de décor au rassemblement des spéculateurs." },
  { nom: "Le code vert moutarde c6c565", type: "Détail", mots: ["c6c565"], description: "Code hexadécimal imposé pour la couleur des cheveux du cartel." },
  { nom: "La dalle de béton armé de 3,6 tonnes", type: "Objet", mots: ["3.6t de béton armé"], description: "Dalle fixée aux chevilles des dirigeants envoyés au fond de la fosse." },
  { nom: "Le Rafale", type: "Objet", mots: ["Rafale"], description: "Avion de chasse que les candidats doivent voler pendant la première épreuve." },
  { nom: "Le F-35", type: "Objet", mots: ["F-35"], description: "Avion de chasse alternatif dans la première épreuve du tournoi du Lesotho." },
  { nom: "Les mini-frigidaires en feu", type: "Objet", mots: ["mini frigidaires pour étudiant en feu"], description: "Projectiles lancés sur les candidats pendant l'épreuve à dos de mule." },
  { nom: "Les sandwichs Sodebo", type: "Objet", mots: ["sandwich thons crudité de chez Sodebo"], description: "Sandwichs au thon et crudités transportés dans les mini-frigidaires." },
  { nom: "Les roches norvégiennes au lithium et au néodyme", type: "Objet", mots: ["77% de granites"], description: "Roches dont la composition fournit une force démesurée au jumeau norvégien." },
  { nom: "La formule C₂H₆Hg", type: "Substance", mots: ["C₂H₆Hg"], description: "Molécule nocive censée remplacer l'eau de Phoenix." },
  { nom: "Le jacuzzi aux 54 tartillion de croissants", type: "Objet", mots: ["54 tartillion de croissants beurré"], description: "Jacuzzi gigantesque installé pour la pool-party de Phoenix." },
  { nom: "Les Fournils des Provinces de Bretagne", type: "Organisation", mots: ["Fournils des Provinces de Bretagne"], description: "Partenaire de la pool-party aux croissants." },
  { nom: "Le trombone à papier", type: "Objet", mots: ["trombone à papier"], description: "Outil unique fourni pour survivre à l'extinction des dinosaures." },
  { nom: "La potion de jeunesse au GHB", type: "Objet", mots: ["GHB en gélule"], description: "Boisson incapacitante présentée comme une potion de jeunesse dans le tournoi du Lesotho." },
  { nom: "L'orchestre aux ongles de pieds", type: "Groupe", mots: ["orchestre de 200 personnes", "ongles de pieds démesurément longs"], description: "Orchestre de violoncelles dont les musiciens jouent avec leurs ongles de pieds." },
  { nom: "Le bâtiment cubique au dôme doré", type: "Lieu", mots: ["dôme doré"], description: "Édifice immense à construire sur une île privatisée dans l'épreuve finale." },
  { nom: "Les moines Shaolin", type: "Groupe", mots: ["moines shao lin"], description: "Sagesse à laquelle les candidats doivent faire appel pour économiser la colle UHU." },
  { nom: "Le Boeing 854", type: "Objet", mots: ["Boeing 854"], description: "Avion utilisé pour l'épreuve de parachutisme sans parachute." },
  { nom: "Le matelas à ressort de 50 × 70 cm", type: "Objet", mots: ["matelas de 50cm par 70 cm"], description: "Cible minuscule sur laquelle les candidats doivent atterrir avant de rebondir." },
  { nom: "Les orangs-outans d'Amazonie", type: "Créature", mots: ["ourangs outans d'amazonie"], description: "Animaux que les perdants doivent porter dans le châtiment final." },
  { nom: "Les candidats amputés du Tournoi des Membres", type: "Groupe", mots: ["personnes avec au moins un membre atrophié ou amputé"], description: "Mille participants dont les membres manquants deviennent des récompenses." },
  { nom: "Le volcan de l'Armageddon", type: "Lieu", mots: ["sommet d'un volcan"], description: "Première épreuve du Tournoi des Membres, liée à la fin de l'humanité." },
  { nom: "La formule de la peau de banane", type: "Créature", mots: ["cellules de ces personnes en peau de banane"], description: "Bactérie travaillée dans les laboratoires indo-pakistanais du Train Bolchévique." },
  { nom: "La peau de banane à sketchs", type: "Objet", mots: ["cellules de ces personnes en peau de banane"], description: "Résultat de la transformation des personnes transportées dans le train." },
  { nom: "L'emmental affiné 110 ans", type: "Objet", mots: ["emmental affiné durant 110 années"], description: "Fromage dont le vol provoque l'exil de François Bayrou." },
  { nom: "Les pendules antiques de la secte", type: "Objet", mots: ["horloges à pendule antique"], description: "Pendules vénérées par la secte et associées aux oracles de Baptiste Vrigneau." },
  { nom: "Le compte variable des soleils", type: "Détail", mots: ["200 et 400 milliards"], description: "Nombre de soleils que les disciples doivent quantifier en se tenant sur une jambe." },
  { nom: "Le bâtiment résonnant de 1 700 kilomètres", type: "Lieu", mots: ["structure monumentale de 1700 km"], description: "Édifice où les sons font gonfler les globules rouges à la taille d'une balle de ping-pong." },
  { nom: "Les globules rouges taille ping-pong", type: "Détail", mots: ["taille comparable à une balle de ping-pong"], description: "Conséquence sonore de la troisième corvée de la secte." },
  { nom: "La 17e symphonie du trou du fion", type: "Œuvre", mots: ["17e symphonie du trou du fion"], description: "Œuvre attribuée à Beethoven et utilisée comme torture sonore dans la secte." },
  { nom: "Le Petit Pouce-merde", type: "Châtiment", mots: ["Petit Pouce-merde"], description: "Torture sonore qui oblige les disciples à expulser leurs entrailles." },
  { nom: "Les shillings somaliens", type: "Détail", mots: ["116818,62 shillings somaliens"], description: "Prix plancher imposé à la revente de biomasse génétique." },
  { nom: "La commode Giorgio Armani", type: "Objet", mots: ["commode de luxe Giorgio Armani"], description: "Meuble de luxe auquel François Bayrou s'agrippe après sa chute." },
  { nom: "La baleine bleue de l'Odyssée", type: "Créature", mots: ["baleine bleue"], description: "Véhicule vivant qui transporte les participants à travers les abysses." },
  { nom: "La quarantaine de cinquante ans", type: "Événement", mots: ["50 ans de quarantaine"], description: "Période passée dans le sous-marin avant la transformation en ballons de football." },
  { nom: "Les scientifiques aveugles, sourds et muets", type: "Groupe", mots: ["scientifiques aveugles, sourds et muets"], description: "Équipe chargée de transformer les participants de l'Odyssée en boules de football." },
  { nom: "Le traîneau géant de l'Opération Cajou", type: "Objet", mots: ["traineau géant pouvant tous les accueillir"], description: "Traîneau destiné à transporter toute la population africaine jusqu'en Sibérie." },
  { nom: "Les tireurs du traîneau : nains et géants", type: "Groupe", mots: ["nains et des personnes très grandes"], description: "Équipe de traction composée de nains et de personnes mesurant au moins 2,30 mètres." },
  { nom: "La marque Ciao Kombucha", type: "Marque", mots: ["Ciao Kombucha"], description: "Boisson naturelle de Squeezie, sponsor du tournoi interplanétaire." },
  { nom: "Les Italiens à la tomate, au basilic et à la mozzarella", type: "Groupe", mots: ["italiens badigeonnés de sauce tomate"], description: "Candidats du tournoi interplanétaire recouverts des ingrédients d'une pizza." },
  { nom: "Le chemin de fer construit en confiseries", type: "Objet", mots: ["chemin de fer démesuré"], description: "Voie ferrée fabriquée par les enfants à partir des confiseries distribuées au tournoi." },
  { nom: "La camionnette pour les enfants d'Équateur", type: "Objet", mots: ["immense camionnette"], description: "Récompense de l'équipe gagnante, assez grande pour accueillir tous les enfants d'Équateur." },
  { nom: "Le bus scolaire du Saint-Empire", type: "Objet", mots: ["bus scolaire prêt à l'emploi"], description: "Autre récompense promise aux membres de l'équipe gagnante." },
  { nom: "Le bateau de trafic de sable et de neige", type: "Objet", mots: ["bateau géant pouvant atteindre les 1000 km/h"], description: "Bateau qui tire les personnes vers le Sahara ou l'Antarctique." },
  { nom: "Les somnolents", type: "Substance", mots: ["sous forme de gaz"], description: "Gaz inventé pour endormir les personnes avant leur embarquement dans la baignoire." },
  { nom: "Les chimistes aux pouvoirs magiques", type: "Groupe", mots: ["chimistes dotés de pouvoirs magiques"], description: "Chimistes recrutés pour produire les somnolents en grande quantité." },
  { nom: "Les êtres non humanoïdes qui tirent la baignoire", type: "Créature", mots: ["êtres extraordinaires totalement dénués d'une morphologie humanoïde"], description: "Êtres extraordinaires chargés de tirer la baignoire volante à travers l'univers." },
  { nom: "Le trou noir le plus massif du cosmos", type: "Lieu", mots: ["trou noir le plus massif du cosmos"], description: "Destination promise aux personnes endormies dans la baignoire." },
  { nom: "Les rennes du Père Noël", type: "Créature", mots: ["en rennes"], description: "Animaux en lesquels les enfants sont transformés pour faire voler le traîneau." },
  { nom: "La fabrique industrielle de cadeaux", type: "Lieu", mots: ["faire tous les cadeaux de manière industrielle"], description: "Atelier où les enfants transformés en lutins doivent fabriquer tous les cadeaux." },
  { nom: "Le voile de cartographie", type: "Objet", mots: ["voile de 1 milliard de kilomètre de haut"], description: "Support gigantesque sur lequel Pascal Praud doit peindre Marine Le Pen." },
  { nom: "Les hommes siamois de la péninsule écossaise", type: "Groupe", mots: ["tous les hommes sont des siamois", "Chaque frère est gay"], description: "Habitants siamois de la péninsule, l'un gay et l'autre homophobe." },
  { nom: "Le pigment secret d'Écosse", type: "Substance", mots: ["pigment extrêmement rare"], description: "Pigment rare utilisé comme seule peinture pour la cartographie." },
  { nom: "L'Heure des Pros", type: "Œuvre", mots: ["heure des pros"], description: "Émission télé détournée par Pascal Praud pour sa chronique de cartographie." },
  { nom: "La guitare électrique de la taille d'UY Scuti", type: "Objet", mots: ["guitare électrique démesurément titanesque"], description: "Scène-instrument sur laquelle les participants sont placés sur les touches." },
  { nom: "Les 126 touches humaines", type: "Détail", mots: ["126 personnes"], description: "Nombre de participants involontaires fixés sur les touches de la guitare." },
  { nom: "La partition géante", type: "Objet", mots: ["partition immense de guitare"], description: "Partition de guitare de la hauteur de l'étoile-scène." },
  { nom: "L'aiguille d'une année-lumière", type: "Objet", mots: ["aiguille de 1 année lumière de long"], description: "Aiguille infligée aux musiciens après chaque fausse note." },
  { nom: "Les laboratoires indo-pakistanais", type: "Lieu", mots: ["laboratoires Indo-Pakistanais"], description: "Laboratoires qui travaillent sur la bactérie du Train Bolchévique." },
  { nom: "L'anévrisme du bras droit", type: "Détail", mots: ["anévrisme dans le bras droit"], description: "Condition médicale attribuée aux personnes qui remplacent les cornichons dans le train." },
  { nom: "Les sketchs de peau de banane", type: "Œuvre", mots: ["créer des sketchs"], description: "Gags que les personnes transformées en peau de banane doivent produire." },
  { nom: "Les parties du corps comme récompense", type: "Objet", mots: ["partie du corps manquant(e) sera donné en récompense"], description: "Récompenses réservées aux gagnants du Tournoi des Membres." },
  { nom: "Les enfants à mobilité empêchée", type: "Groupe", mots: ["enfants disposant d'une déficience mentale"], description: "Enfants que les candidats doivent chercher pendant une épreuve du tournoi." },
  { nom: "L'homme aux cheveux bleus d'Indre-et-Loire", type: "Personnage", mots: ["homme homosexuel de 23 ans aux cheveux bleus"], description: "Adversaire des habitants dans le court récit du Podium d'Indre-et-Loire." },
  { nom: "Indre-et-Loire", type: "Lieu", mots: ["Indre et Loire"], description: "Département où se tiennent les affrontements du Podium d'Indre-et-Loire." },
  { nom: "La mer Baltique", type: "Lieu", mots: ["mer Baltique"], description: "Mer où les perdants d'Indre-et-Loire doivent faire une apnée éternelle." },
  { nom: "Israël", type: "Lieu", mots: ["Israël"], description: "Finance en partie le tournoi interplanétaire." },
  { nom: "L'Afghanistan", type: "Lieu", mots: ["Afghanistan"], description: "Pays touché par le souffle d'Alain Soral dans L'Heure des Pros." },
  { nom: "La poudre de cuivre nano-robotique", type: "Substance", mots: ["poudre de nano-robot pacifique"], description: "Poudre respirée par les habitants des mondes du multivers de la chasse cosmique." },
  // Références secondaires et détails singuliers relevés dans les vingt textes
  { nom: "Montceau-les-Mines", type: "Lieu", mots: ["Montceau-les-Mines"], description: "Ville d'où partent les voyageurs envoyés dans les canalisations de la toilette géante." },
  { nom: "Les vieilles dames de Montceau-les-Mines", type: "Groupe", mots: ["vieilles dames gâteuses"], description: "Elles traversent les canalisations avant d'être jugées pour des investissements frauduleux." },
  { nom: "Les spéculateurs boursiers", type: "Groupe", mots: ["spéculateurs boursiers"], description: "Condamnés à une rédaction interminable après leurs investissements frauduleux." },
  { nom: "Les pigeons sans ailes, pattes ni bec", type: "Créature", mots: ["perdu leurs becs"], description: "Pigeons mutilés à l'encre desquels les spéculateurs doivent écrire." },
  { nom: "Les plantes carnivores des sabots", type: "Créature", mots: ["plantes carnivore"], description: "Plantes qui doivent pousser dans les grands sabots vendus par téléphone." },
  { nom: "Les personnes vulnérables appelées depuis la fosse", type: "Groupe", mots: ["personnes vulnérables"], description: "Cibles des appels commerciaux passés au fond de la fosse beurrée." },
  { nom: "Les barres d'acier des mines indiennes", type: "Objet", mots: ["bars en acier inoxydable", "mines indiennes"], description: "Barres forgées dans les mines indiennes pour compléter le mur de Mr Hugo Décrypte." },
  { nom: "La feuille A5", type: "Objet", mots: ["feuille A5"], description: "Support de la punition d'écriture infligée aux spéculateurs." },
  { nom: "Le fugitif innocent", type: "Personnage", mots: ["personne absolument innocente"], description: "Homme recherché dans l'émission cosmique, équipé de quinze nombrils et de nombreux outils." },
  { nom: "Les poursuivants âgés de 78 ans et 17 jours", type: "Groupe", mots: ["78 ans et 17 jours"], description: "Chasseurs auxquels le récit retire le lobe frontal et le fémur droit." },
  { nom: "Le satellite de Balactica", type: "Lieu", mots: ["satellite de la planète Balactica"], description: "Septième outil de survie, présenté comme un satellite de Balactica." },
  { nom: "L'astre de la secte des vélos auto-alimentés", type: "Lieu", mots: ["astre habitant une créature légendaire"], description: "Astre associé à la créature du folklore de la secte des vélos électriques." },
  { nom: "Les cacahuètes mi-cuites mi-salées", type: "Substance", mots: ["cacahuètes mi-cuites mi-salées"], description: "La chaussure de l'entité cosmique est comparée à ces cacahuètes avalées avec des univers." },
  { nom: "L'entité cosmique créatrice et destructrice", type: "Personnage", mots: ["entité cosmique et céleste"], description: "Être qui avale des univers et dont la chaussure se trouve au Netto de Poitiers." },
  { nom: "Les personnes dont l'IMC dépasse 37", type: "Groupe", mots: ["IMC dépasse les 37"], description: "Population que le fugitif doit porter à bout de bras s'il est capturé." },
  { nom: "La dette infinie du fugitif", type: "Détail", mots: ["dette infinie"], description: "Dette qui apparaît sur le compte du fugitif s'il est capturé." },
  { nom: "Le lobbyisme des grandes firmes", type: "Organisation", mots: ["lobbyisme de masse"], description: "Réseau mobilisé par les spéculateurs immobiliers de la Route de la Pénitence." },
  { nom: "Les sociétés offshore", type: "Organisation", mots: ["sociétés off-shore"], description: "Sociétés utilisées pour acheter les terrains vagues de Detroit à bas prix." },
  { nom: "La densité de 100 personnes au mètre carré", type: "Détail", mots: ["100 personnes par m²"], description: "Disposition imposée aux spéculateurs rassemblés dans le fossé de la D341." },
  { nom: "La limitation à 50 km/h sur la D341", type: "Détail", mots: ["limitation de vitesse", "50 à cause de travaux"], description: "Limite temporaire mise en place pendant les travaux sur la départementale." },
  { nom: "Les travaux de bitume de la D341", type: "Événement", mots: ["travaux de manutention du bitume"], description: "Travaux qui ont laissé la D341 couverte de nids-de-poule." },
  { nom: "Le caporal-sergent-chef de Jordanie", type: "Personnage", mots: ["caporal sergent chef présent en Jordanie"], description: "Seul survivant d'un accident mystérieux, il démantèle l'organisation criminelle galactique malgré sa paralysie." },
  { nom: "La famille et les amis du caporal", type: "Groupe", mots: ["toute sa famille et ses amis"], description: "Proches du caporal, morts dans un mystérieux accident de voiture." },
  { nom: "L'accident de voiture mystérieux", type: "Événement", mots: ["mystérieux accident de voiture"], description: "Accident qui tue les proches du caporal et le laisse seul survivant." },
  { nom: "Les personnes unijambistes et borgnes", type: "Groupe", mots: ["personnes unijambistes et borne de l'oeil droit"], description: "Personnes victimes du trafic de l'organisation criminelle de la Voie lactée." },
  { nom: "La paralysie à partir de la mâchoire", type: "Détail", mots: ["paralysie totale du corps à partir de la mâchoire"], description: "Handicap dont le caporal réchappe presque après l'accident qui tue ses proches." },
  { nom: "Les ongles d'auriculaire du pied gauche", type: "Détail", mots: ["ongles d'auriculaire du pieds gauche"], description: "Les gobelins ne les ont pas coupés depuis la treizième lune d'hiver." },
  { nom: "La treizième lune d'hiver", type: "Détail", mots: ["13ème Lune d'hiver"], description: "Date depuis laquelle les gobelins laissent pousser leurs ongles d'auriculaire." },
  { nom: "Le record de 13,7 secondes autour de Saturne", type: "Détail", mots: ["13.7s"], description: "Temps record exigé pour parcourir les anneaux de Saturne à dos de mule." },
  { nom: "La brasse scandinave", type: "Détail", mots: ["brasse scandinave"], description: "Style de nage imposé pendant l'épreuve du jacuzzi au diméthylmercure." },
  { nom: "Les 375 picosecondes", type: "Détail", mots: ["375 picosecondes"], description: "Temps accordé pour faire un aller-retour dans le jacuzzi de Phoenix." },
  { nom: "La molécule d'eau H₂O", type: "Substance", mots: ["molécule H2O"], description: "Molécule de l'eau que l'agent chimique du tournoi transforme en composé nocif." },
  { nom: "Le diméthylmercure", type: "Substance", mots: ["diméthylmercure"], description: "Substance qui remplace l'eau du jacuzzi de Phoenix." },
  { nom: "Les enfants tibétains", type: "Groupe", mots: ["enfants tibétains"], description: "Le texte compare à leurs billes de jeu les boulettes de carton prémâché du tournoi." },
  { nom: "Les billes de jeu des enfants tibétains", type: "Objet", mots: ["bille de la taille environ d'une bille", "enfants tibétains jouent dans la cour"], description: "Billes utilisées comme comparaison pour les boulettes de carton et de salive." },
  { nom: "La météorite et les éruptions volcaniques", type: "Événement", mots: ["météorite et les éruptions volcaniques"], description: "Cataclysmes auxquels les candidats doivent faire survivre les dinosaures." },
  { nom: "L'île privatisée du tournoi", type: "Lieu", mots: ["île privatisée"], description: "Île où les candidats doivent bâtir le bâtiment cubique au dôme doré." },
  { nom: "Les films et séries avec des youtubeurs français", type: "Œuvre", mots: ["films et séries dans lesquels des Youtubeurs français"], description: "Corpus audiovisuel que les candidats doivent regarder intégralement." },
  { nom: "La salopette trop grande ou trop petite", type: "Objet", mots: ["salopette soit trop grande soit trop petite"], description: "Tenue imposée aux candidats pendant le saut sans parachute." },
  { nom: "Les Enfers du Grand Monarque", type: "Lieu", mots: ["enfers du grands monarques infernal"], description: "Lieu où les perdants du tournoi du Lesotho portent les orangs-outans d'Amazonie." },
  { nom: "La secte de François Bayrou", type: "Organisation", mots: ["secte hindoue notoirement célèbre"], description: "Organisation galactique fondée par François Bayrou, qui impose cinq Grandes Corvées à ses adeptes." },
  { nom: "Les enfants du Moyen-Orient ciblés par la secte", type: "Groupe", mots: ["population infantile située", "ciblée à attribuer la crédibilité"], description: "Enfants que la secte cherche à convaincre de suivre son gourou." },
  { nom: "Le carburant de fusée", type: "Substance", mots: ["carburant de fusée récolté"], description: "Carburant transmis pendant l'opération des fondateurs de Papouasie-Nouvelle-Guinée." },
  { nom: "La lobotomie et le changement d'identité", type: "Châtiment", mots: ["lobotomie totale ainsi qu’à une procédure de changement d’identité"], description: "Procédure infligée aux nouvelles recrues pour les soumettre au gourou." },
  { nom: "Burger King", type: "Marque", mots: ["Burger King"], description: "Enseigne de restauration rapide citée dans les habitudes de François Bayrou." },
  { nom: "Les solstices d'hiver et d'été", type: "Événement", mots: ["solstices d’hiver et d’été"], description: "Échéances qui règlent les oracles prononcés par Baptiste Vrigneau." },
  { nom: "La peau arrachée des fesses", type: "Châtiment", mots: ["S’arracher la peau des fesses"], description: "Épreuve où les adeptes étirent leur peau jusqu'à la faire passer sur leur visage." },
  { nom: "L'immolation et la lapidation publiques", type: "Châtiment", mots: ["immolation ou lapidation"], description: "Exécutions publiques brandies contre les adeptes qui relâchent leur peau." },
  { nom: "Le violoncelle joué avec les ongles de pieds", type: "Objet", mots: ["jouer du violoncelle"], description: "Instrument joué par l'orchestre des corvées avec des ongles de pieds démesurément longs." },
  { nom: "La goutte de sang sur la peau", type: "Détail", mots: ["une seule goutte de sang"], description: "La troisième corvée interdit d'en laisser tomber une sur une surface de peau minuscule." },
  { nom: "Les comptes maltais de François Bayrou", type: "Détail", mots: ["comptes bancaires maltais"], description: "Comptes qui reçoivent les fonds illicites de la secte." },
  { nom: "Les personnes au QI inférieur à 100", type: "Groupe", mots: ["quotient intellectuel (QI) inférieur à la moyenne de 100 points"], description: "Personnes ciblées pour le rachat de biomasse génétique par la secte." },
  { nom: "Le missile nucléaire dirigé vers un pays africain", type: "Objet", mots: ["missile nucléaire sur un pays africain"], description: "Menace de François Bayrou si les adeptes n'atteignent pas leur objectif financier." },
  { nom: "La dette de plus d'un milliard d'euros de Pégase", type: "Détail", mots: ["dette dépassant un milliard d'euros"], description: "Dette des deux personnes qui se cachent derrière Pégase." },
  { nom: "Le traînage des victimes sur des dizaines de kilomètres", type: "Châtiment", mots: ["traîner dans la durée ces personnes par les membres inférieurs"], description: "Supplice imposé aux deux personnes derrière Pégase jusqu'à leur transformation en tableau vivant." },
  { nom: "Les 57 années d'initiation", type: "Détail", mots: ["57 années"], description: "Durée des manipulations avant la promotion des adeptes au rang supérieur." },
  { nom: "Les 2,5 trillions de fidèles de la secte", type: "Groupe", mots: ["2,5 trillions de fidèles actifs"], description: "Effectif annoncé de la secte de François Bayrou." },
  { nom: "La peau de banane usagée", type: "Objet", mots: ["peau de banane usagée"], description: "Peau déposée par le gourou rival philippin pour faire trébucher François Bayrou." },
  { nom: "Les chaussures pointues du malfrat", type: "Objet", mots: ["chaussures de lutins pointus"], description: "Chaussures de deux années-lumière qui permettent d'identifier le criminel de la Farandole Saturnienne." },
  { nom: "Le filet plus grand que le multivers", type: "Objet", mots: ["filet plus grande que le multiverse"], description: "Filet utilisé pour capturer le malfrat sans laisser ses chaussures le déchirer." },
  { nom: "Le radeau géant de l'humanité", type: "Objet", mots: ["radeau gigantesque accueillant l'ensemble des humains"], description: "Radeau où les enquêteurs sont roués de coups jusqu'à la fin des temps." },
  { nom: "Les enfants chauves et sans conscience", type: "Groupe", mots: ["enfants difformes chauves et dénués de conscience"], description: "Enfants que le criminel enlève pour les envoyer vers le Soleil." },
  { nom: "Les océans dans les noyaux atomiques", type: "Détail", mots: ["noyaux des atomes des organismes"], description: "Transformation qui convertit les noyaux des enfants en océans de plus d'un million de litres." },
  { nom: "La parade cosmique de Sylvain Durif", type: "Événement", mots: ["plus grande parade du monde"], description: "Parade de lutins-mouches dont la figure géante représente Astérion." },
  { nom: "Le sourire de Joker d'Astérion", type: "Détail", mots: ["fameux sourire de Joker"], description: "Sourire affiché par Astérion lors de la parade cosmique." },
  { nom: "Le monde meilleur imaginaire", type: "Lieu", mots: ["monde meilleur au-delà de l'univers"], description: "Monde fictif sans douleur ni haine promis aux personnes enlevées dans la baignoire." },
  { nom: "L'horizon des événements du trou noir", type: "Lieu", mots: ["horizon des évènements du trou noir"], description: "Frontière que la baignoire cosmique s'apprête à franchir avant l'intervention de Hollande." },
  { nom: "La destruction de la Terre par la baignoire", type: "Événement", mots: ["détruit également en intégralité"], description: "Impact de la baignoire renvoyée par François Hollande, qui détruit la Terre et déclenche un combat cosmique." },
  { nom: "Les lutins du Père Noël", type: "Groupe", mots: ["lutins du Père Noël"], description: "Enfants transformés pour fabriquer les cadeaux à la chaîne." },
  { nom: "Le paradis des bonbons et des jouets", type: "Lieu", mots: ["paradis des bonbons et des jouets"], description: "Destination festive promise aux enfants avant leur enlèvement vers le village du Père Noël." },
  { nom: "Le traîneau du Père Noël", type: "Objet", mots: ["traineau du Père Noël"], description: "Traîneau que les enfants transformés en rennes doivent faire voler." },
  { nom: "Les pinceaux de 3,6 × 10⁸⁹ tailles", type: "Détail", mots: ["3,6 × 10⁸⁹ pinceaux"], description: "Nombre de pinceaux de tailles différentes prévus pour cartographier la planète." },
  { nom: "Les pinceaux du proton à l'univers", type: "Objet", mots: ["taille d'un proton", "dépassant l'univers mesurable"], description: "Pinceaux dont les tailles vont d'un proton à une échelle dépassant l'univers mesurable." },
  { nom: "Les 13 picosecondes du voile", type: "Détail", mots: ["en 13 picosecondes"], description: "Temps donné à Pascal Praud pour peindre Marine Le Pen sur le voile gigantesque." },
  { nom: "Le voile d'un milliard de kilomètres", type: "Objet", mots: ["voile de 1 milliard de kilomètre"], description: "Support de cartographie haut d'un milliard de kilomètres et large de quinze centimètres." },
  { nom: "Le trio stellaire de L'Heure des Pros", type: "Groupe", mots: ["trio stellaire multidimensionnel"], description: "Alain Soral, Dieudonné et Daniel Conversano, invités de la chronique de Pascal Praud." },
  { nom: "Le tour de la Terre de Daniel Conversano", type: "Événement", mots: ["moonwalk planétaire"], description: "Moonwalk planétaire où Daniel Conversano massacre par la pensée les personnes qu'il juge nuisibles." },
  { nom: "Les gradins d'UY Scuti", type: "Lieu", mots: ["gradins gigantesques"], description: "Gradins installés pour les spectateurs du concert cosmique." },
  { nom: "Les musiciens involontaires", type: "Groupe", mots: ["participants ciblés"], description: "Personnes tirées au sort et fixées sur les touches de la guitare d'UY Scuti." },
  { nom: "Le tirage à la courte paille", type: "Détail", mots: ["sélectionnés à la courte paille"], description: "Méthode de sélection des participants forcés à jouer au concert." },
  { nom: "L'aimant qui tire les participants", type: "Objet", mots: ["tirés littéralement par la peau des fesses par un aimant"], description: "Aimant utilisé pour attirer les participants vers la guitare, parfois en déchirant leur peau." },
  { nom: "Le public du concert cosmique", type: "Groupe", mots: ["pubic, arrivé quelques millénaires"], description: "Spectateurs qui arrivent après le solo de Charlie Kirk et dévorent le musicien." },
  { nom: "Le solo de Charlie Kirk à un million de kilomètres par nanoseconde", type: "Détail", mots: ["1 million de km/nanosecondes"], description: "Vitesse absurde des doigts de Charlie Kirk sur la guitare, qui broient les participants." },
  { nom: "Le voyage du cochon à un mètre par an", type: "Détail", mots: ["1 m par an"], description: "Vitesse du cochon-tirelire poussé vers UY Scuti par Charlie Kirk." },
  { nom: "Le voyage de plusieurs dizaines d'années dans les abysses", type: "Détail", mots: ["durée de plusieurs dizaines d'années"], description: "Durée du trajet des participants à bord de la baleine bleue." },
  { nom: "Les 30 kilomètres de profondeur marine", type: "Détail", mots: ["30km de profondeur marine"], description: "Profondeur du sous-marin où les participants sont mis en quarantaine." },
  { nom: "La Coupe du Monde de Football de Lascaux", type: "Événement", mots: ["Coupe du Monde de Football"], description: "Compétition où les boules humaines deviennent des ballons dans les grottes de Lascaux." },
  { nom: "La population africaine du traîneau", type: "Groupe", mots: ["population Africaine"], description: "Population entassée dans le traîneau géant envoyé jusqu'en Sibérie." },
  { nom: "Les enfants atteints de trisomie 21", type: "Groupe", mots: ["enfants atteint de la trisomie 21"], description: "Enfants ciblés par la première épreuve du tournoi interplanétaire." },
  { nom: "Les galipettes à 382 km/h", type: "Détail", mots: ["382 km/h"], description: "Vitesse promise aux enfants transformés en personnes sans bras ni jambes." },
  { nom: "Les dimensions des usines confiseuses", type: "Détail", mots: ["8245 km de large"], description: "Chaque usine doit mesurer au minimum 8 245 km de large, 1,30 m de long et 35 cm de haut." },
  { nom: "Le chemin de fer à 9 000 km par milliseconde", type: "Détail", mots: ["9000 km/ms"], description: "Vitesse du chemin de fer construit par les enfants avec les confiseries du tournoi." },
  { nom: "La ronde des enfants du tournoi", type: "Événement", mots: ["une grande ronde"], description: "Ronde organisée par les enfants après la construction du chemin de fer en confiseries." },
  { nom: "Les rendez-vous amoureux des perdants", type: "Châtiment", mots: ["2 rendez-vous romantiques", "démanteler leur usines"], description: "La pire sanction du tournoi : deux rendez-vous galants avec des femmes de leur âge. Et comme si ça ne suffisait pas, il faut démonter son usine et reverser les bénéfices à Maître Gims et Kev Adams." },
  { nom: "Les personnes atteintes de trisomie 21 du trafic", type: "Groupe", mots: ["personnes atteintes de trisomie 21 du monde entier"], description: "Personnes attirées par la contrebasse vers le Sahara pour organiser le trafic de sable." },
  { nom: "La Terre", type: "Lieu", mots: ["la Terre", "sur Terre", "planète bleue", "planète entière"], description: "Planète dont les habitants, les paysages et les infrastructures sont détournés dans plusieurs textes." },
  { nom: "L'Univers", type: "Lieu", mots: ["univers"], description: "Échelle récurrente des tournois, des catastrophes et des déplacements les plus absurdes du recueil." },
  { nom: "Le Soleil", type: "Lieu", mots: ["Soleil", "Soleils"], description: "Étoile que les adeptes doivent compter et que le criminel de la Farandole tente d'éteindre." },
  { nom: "Saturne", type: "Lieu", mots: ["Saturne"], description: "Planète autour de laquelle tournent les anneaux visités par les mules et les poissons kilométriques." },
  { nom: "Le Canada", type: "Lieu", mots: ["Canada"], description: "Pays gouverné par Justin Trudeau, où se trouve le laboratoire du Démantèlement Galactique." },
  { nom: "L'Angola", type: "Lieu", mots: ["d'Angola"], description: "Pays d'origine attribué aux mille dirigeants de l'organisation criminelle de la Voie lactée." },
  { nom: "Le Michigan", type: "Lieu", mots: ["Michigan"], description: "État américain où se trouve Detroit, ville des terrains vagues achetés par les spéculateurs." },
  { nom: "Les États-Unis", type: "Lieu", mots: ["États-Unis"], description: "Pays où Detroit et le campus de l'Utah se trouvent dans les récits." },
  { nom: "La Norvège", type: "Lieu", mots: ["Norvégien"], description: "Pays associé au jumeau intergalactique de Raphaël Glucksmann." },
  { nom: "Malte", type: "Lieu", mots: ["maltais"], description: "Pays où sont situés les comptes bancaires de François Bayrou." },
  { nom: "La Somalie", type: "Lieu", mots: ["somaliens"], description: "Pays dont la monnaie sert de prix plancher à la vente de biomasse génétique par la secte." },
  { nom: "Le Venezuela", type: "Lieu", mots: ["du Venezuela"], description: "Pays dont le Festival invente un parti conservateur d'extrême droite." },
  { nom: "Nantes", type: "Lieu", mots: ["présente à Nantes"], description: "Ville où la tour Montparnasse est déplacée dans la chasse cosmique." },
  { nom: "Poitiers", type: "Lieu", mots: ["de Poitiers"], description: "Ville dont le Netto vend la chaussure d'une entité cosmique pour 1,63 €." },
  { nom: "Calais", type: "Lieu", mots: ["entre Calais et Lens"], description: "Une extrémité de la D341 où se rassemblement les spéculateurs immobiliers." },
  { nom: "Lens", type: "Lieu", mots: ["entre Calais et Lens"], description: "Une extrémité de la D341 où se rassemblement les spéculateurs immobiliers." },
  { nom: "L'Allemagne et le Rwanda", type: "Lieu", mots: ["germano-rwandaise"], description: "Pays associés à l'expérience scientifique de l'Odyssée des Boules Humaines." },
  { nom: "Pégase", type: "Créature", mots: ["entité mythique Pégase"], description: "Créature mythique qui se révèle être deux personnes lourdement endettées." },
  { nom: "Les dinosaures de la Terre", type: "Groupe", mots: ["tout les dinosaures", "dinosaures terriens"], description: "Créatures que les candidats du tournoi du Lesotho tentent de sauver de l'extinction." },
  { nom: "La biomasse génétique", type: "Substance", mots: ["biomasse génétique"], description: "Substance revendue par la secte pour financer François Bayrou." },
  { nom: "Le lobe frontal", type: "Objet", mots: ["lobe frontal"], description: "Partie du cerveau retirée aux poursuivants de l'émission mondiale de chasse à l'homme." },
  { nom: "Le fémur droit", type: "Objet", mots: ["fémur droit"], description: "Os retiré aux hommes et aux femmes qui poursuivent le fugitif cosmique." },
];

const TEXTES = [
  { titre: "Le Kirkversary", auteur: "Jules", fichier: "recueil/kirkversary.txt", resume: "Un trampoline de 500 milliards de kilomètres emballé comme un cadeau, une planète de gargouilles affamées et des invités qui se révèlent être des sauterelles à tronçonneuse : la fête tourne vite à la Grande Guerre Spatiale Migratoire. La suite passe par des mammouths radioactifs, du papier à bulles et une punition de 21 519 818 lignes.", affiche: "affiches/kirkversary.webp" },
  { titre: "Chasse à l'Homme Cosmique", auteur: "Jules", fichier: "recueil/chasse-a-l-homme-cosmique.txt", resume: "Quinze nombrils, chacun mieux équipé que le précédent, et une émission financée par tout le Sud-Soudan : voilà le dispositif pour retrouver un fugitif d’une innocence éclatante. Entre nanorobots, argile mauritanienne et tour Montparnasse déplacée à Nantes, la fuite s’annonce bien équipée.", affiche: "affiches/chasse-a-l-homme.webp" },
  { titre: "La Route de la Pénitence Infernale", auteur: "Jules", fichier: "recueil/route-infernale.txt", resume: "Sur la D341, des promoteurs immobiliers découvrent qu’un chantier peut aussi servir de pénitence. Nids-de-poule, bitume et nouvelle recette de béton sont au programme ; pour la touche finale, il faudra mettre la main à la pâte au sens le plus littéral.", affiche: "affiches/route-infernale.webp" },
  { titre: "Le Démantèlement Galactique", auteur: "Jules", fichier: "recueil/demantelement-galactique.txt", resume: "Un caporal presque paralysé contre mille chefs criminels galactiques : le rapport de forces n’a pas été relu. Pour faire tomber l’organisation, il mise sur une pipistrelle à psoriasis, une loutre à dix-sept nageoires et un laboratoire canadien qui a perdu le formulaire de consentement.", affiche: "affiches/operation-angola.webp"},
  { titre: "Le Tournoi du Lesotho Démoniaque", auteur: "Jules", fichier: "recueil/tournoi-lesotho.txt", resume: "Pour la présidentielle du Lesotho, pas de débat télévisé : sept épreuves attendent les candidats. Mules indonésiennes sur les anneaux de Saturne, mini-frigos volants et tube de colle UHU à économiser… Le programme électoral a visiblement été rédigé en plein vol.", affiche: "affiches/tournoi-du-lesotho.webp" },
  { titre: "Le Train Bolchévique aux Cornichons", auteur: "Jules", fichier: "recueil/train-cornichon.txt", resume: "Les cornichons de mer occupaient tranquillement les wagons quand un changement de cargaison et d’itinéraire est tombé. Direction un laboratoire indo-pakistanais, où l’on cherche à transformer des passagers en peaux de banane pour fabriquer le gag du siècle.", affiche: "affiches/train-bolchevique.webp" },
  { titre: "La Secte de François Bayrou", auteur: "Jules", fichier: "recueil/secte-hindu.txt", resume: "Chez François Bayrou, les pendules antiques rendent leurs oracles, les disciples comptent les soleils en poirier et les corvées sont irrévocables. Le programme fidélité s’étale sur 57 ans ; garde un œil sur les peaux de banane et l’interrupteur d’urgence.", affiche: "affiches/secte_hindu.webp" },
  { titre: "Le Tournoi des Membres", auteur: "Jules", fichier: "recueil/tournoi-des-membres.txt", resume: "Mille candidats, un volcan en éruption et des récompenses anatomiques qui réclament une vitrine sur mesure : le tournoi a déjà dépassé le niveau échauffement. Son règlement semble avoir été rédigé au bord du cratère, sans prévoir de sortie de secours.", affiche: "affiches/tournoi-membres.webp" },
  { titre: "Le Podium d'Indre-et-Loire", auteur: "Jules", fichier: "recueil/indre-et-loire.txt", resume: "En Indre-et-Loire, les vainqueurs montent sur le podium pour y rester à vie ; les perdants découvrent la mer Baltique en apnée. Une compétition locale où la cérémonie de remise des médailles risque de durer un peu plus longtemps que prévu." },
  { titre: "La Farandole Saturnienne", auteur: "Simon", fichier: "recueil/farandole-saturnienne.txt", resume: "Souliers de lutins longs de deux années-lumière, humains transformés en poissons-filaments et farandole autour de Saturne : l’enquête a déjà dépassé les capacités du filet standard. Quatre détectives se lancent à la poursuite d’un suspect ; reste à savoir qui mène vraiment la danse.", affiche: "affiches/farandole.webp" },
  { titre: "La Parade d'Astérion", auteur: "Simon", fichier: "recueil/parade-d-asterion.txt", resume: "Sylvain Durif annonce le défilé cosmique du siècle, Michael Jackson est au programme et une nuée de lutins-mouches doit dessiner le sourire géant d’Astérion. Personne n’a vérifié les effectifs ; l’Univers, lui, a bien reçu l’invitation." },
  { titre: "La baignoire cosmique", auteur: "Simon", fichier: "recueil/baignoire-cosmique.txt", resume: "Promets un monde sans douleur, ajoute une baignoire dimensionnée pour l’humanité et attelle-y un quintilliard de créatures : voilà le transport le moins homologué du cosmos. La destination annoncée se trouve au-delà de l’Univers connu ; le service de navigation ne répond plus." , affiche: "affiches/baignoire_cosmique.webp" },
  { titre: "Le Grand Mensonge de Noël", auteur: "Simon", fichier: "recueil/grand_mensonge_noel", resume: "Des enceintes Marshall géantes prennent leur envol et les enfants croient partir au paradis des bonbons. L’itinéraire mène plutôt chez le Père Noël, où l’on cherche des lutins et des rennes polyvalents. La petite ligne du contrat a dû être imprimée en taille microscopique." },
  { titre: "L'Heure des Pros : l'Apocalypse du RN", auteur: "Simon", fichier: "recueil/heure_des_pros.txt", resume: "3,6 × 10⁸⁹ pinceaux, une toile à l’échelle de la planète et treize picosecondes : la cartographie du monde est un projet modeste, jusqu’à ce que Pascal Praud détourne le chantier pour une chronique télé. Le globe n’a pas été invité à donner son avis." , affiche: "affiches/heures_des_pros.webp" },
  { titre: "Le Concert de Trop", auteur: "Simon", fichier: "recueil/le_concert_de_trop.txt", resume: "Un cochon-tirelire vivant aspire tout le monde et prend la route d’UY Scuti à la vitesse d’un escargot administratif. Là-bas, une guitare géante attend son public, ses gradins et son dossier de réservation d’étoile, toujours coincé au service orbital." },
  { titre: "Le Marché Noir de Noël", auteur: "Simon", fichier: "recueil/marche_noir_noel", resume: "La visite du village du Père Noël prend un virage imprévu et dépose ses voyageurs en Laponie, devant une fabrique de lutins. Pour les cadeaux, c’est moins un marché de Noël qu’une orientation professionnelle sans préavis." },
  { titre: "L'Odyssée des Boules Humaines", auteur: "Simon", fichier: "recueil/odysee_boules_humaines.txt", resume: "Une expérience sous-marine devait tenir dans un protocole ; elle s’étire jusqu’à produire des boules humaines recrutées comme ballons pour la Coupe du monde de Lascaux. Les règles du match sont en cours de déterrage, avec le reste du terrain." },
  { titre: "Opération Cajou Polaire", auteur: "Simon", fichier: "recueil/operation_cajou_polaire", resume: "Un traîneau d’une taille déraisonnable met un continent en route vers la Sibérie. Au bout du voyage : un igloo monumental et un marché de noix de cajou, probablement le premier dont le rayon frais s’étend sur plusieurs fuseaux horaires.", affiche: "affiches/operation-cajou.webp" },
  { titre: "Le Tournoi Interplanétaire présidé et financé par les plus Grands bandits de ce Monde", auteur: "Simon", fichier: "recueil/tournoi_interplanétaire", resume: "Deux équipes de célébrités s’affrontent en direct, avec des usines de confiseries assez grandes pour mériter leur propre service postal. Les bonbons doivent aider trois pays à construire un chemin de fer jusqu’aux usines ; la camionnette promise aux vainqueurs est à peine plus petite que l’Équateur." },
  { titre: "Trafic de Chaud et de Froid", auteur: "Simon", fichier: "recueil/trafic_chaud_froid.txt", resume: "Une contrebasse de huit mètres attire les foules vers le Sahara ; le reste du dispositif prévoit du sable à vendre et, en option, un bateau lancé à 1 000 km/h pour la neige antarctique. Pour la logistique, le bon sens n’a pas été convoqué.", affiche: "affiches/trafic-chaud-froid.webp" },
];

/* =========================================================
   LECTURES : l'analyse du sens de chaque texte
   Faite une fois pour toutes (par Claude). Cinq critères notés sur 10 :
   - demesure  : à quel point les échelles explosent
   - collisions: des choses qui n'ont rien à faire ensemble
   - serieux   : l'aplomb avec lequel l'absurde est présenté comme logique
   - precision : les détails inutilement exacts
   - chute     : la fin, et ce qu'elle fait exploser
   « cles » : des passages recopiés tels quels du texte (les sommets de la sottise).
   Un texte absent d'ici garde la note calculée automatiquement.
   ========================================================= */
const LECTURES = {
  "recueil/chasse-a-l-homme-cosmique.txt": {
    demesure: 9, collisions: 10, serieux: 8, precision: 10, chute: 8,
    avis: "Un inventaire en quinze nombrils où la tour Montparnasse délocalisée à Nantes côtoie des cacahuètes à 1,63 €. La précision maniaque de chaque objet fait tout le sel.",
    cles: ["ayant précisément 78 ans et 17 jours", "Le cinquième objet est la tour Montparnasse, présente à Nantes.", "qu’on trouve aisément à seulement 1.63€ dans le Netto du centre-ville de Poitiers"]
  },
  "recueil/kirkversary.txt": {
    demesure: 10, collisions: 10, serieux: 8, precision: 10, chute: 7,
    avis: "Une escalade sans frein : un trampoline-cadeau, une guerre spatiale, des mammouths radioactifs qui changent la peau en papier à bulles, puis une punition à la fiente de pigeon. « 17 minutes et 512 secondes et trois quart » est un chef-d'œuvre de précision inutile.",
    cles: ["un gigantesque paquet cadeau en forme de trampoline géant", "le temps record de 17 minutes et 512 secondes et trois quart", "transformant la peau qui les absorbe se transforme en papier à bulles"]
  },
  "recueil/secte-hindu.txt": {
    demesure: 10, collisions: 9, serieux: 10, precision: 10, chute: 9,
    avis: "Le jargon le plus solennel du recueil, digne d'un rapport ministériel, au service d'un gourou exilé pour le vol d'un emmental affiné 110 ans. Et tout cet empire galactique s'effondre sur une peau de banane posée par un gourou rival.",
    cles: ["la subtilisation d’un fromage très rare (emmental affiné durant 110 années)", "à un prix plancher minimum de 116818,62 shillings somaliens", "il trébuche sur une peau de banane usagée, déposée clandestinement par un rival gourou philippin"]
  },
  "recueil/route-infernale.txt": {
    demesure: 4, collisions: 6, serieux: 9, precision: 9, chute: 7,
    avis: "Peu de cosmos, mais un sérieux de rapport de la DDE : la limitation à 50 pour cause de nids-de-poule est si réaliste qu'elle rend le reste encore plus absurde.",
    cles: ["100 personnes par m²", "la D341, départementale faisant la liaison entre Calais et Lens"]
  },
  "recueil/demantelement-galactique.txt": {
    demesure: 7, collisions: 9, serieux: 8, precision: 10, chute: 7,
    avis: "Le code hexadécimal c6c565 est peut-être le détail le plus inutile du recueil, et c'est exactement pour ça qu'il marche. La loutre à dix-sept nageoires n'est pas loin derrière.",
    cles: ["correspondant au code hexadécimal suivant : c6c565", "une loutre de mer à trois pattes et 17 nageoires"]
  },
  "recueil/tournoi-lesotho.txt": {
    demesure: 10, collisions: 10, serieux: 8, precision: 9, chute: 9,
    avis: "Sept épreuves (dont deux troisièmes), une mule sur Saturne et un trombone contre l'extinction des dinosaures : c'est l'escalade la plus longue et la plus tenue du recueil.",
    cles: ["en un temps record de 13.7s, minimum", "un jacuzzi gigantesque capable de contenir 54 tartillion de croissants beurré", "avec l'aide précieuse d'un trombone à papier"]
  },
  "recueil/train-cornichon.txt": {
    demesure: 4, collisions: 9, serieux: 7, precision: 6, chute: 8,
    avis: "Court mais d'une logique implacable : quitte à transformer des passagers en peaux de banane, autant que ça serve à faire des gags.",
    cles: ["une vaste gamme de cornichons de mer", "ensuite désignées à créer des sketchs et gags de personnes glissant dessus"]
  },
  "recueil/tournoi-des-membres.txt": {
    demesure: 7, collisions: 6, serieux: 7, precision: 4, chute: 8,
    avis: "Un tournoi qui déclenche l'apocalypse dès la première épreuve. La transformation finale en châteaux de sable dispersés au vent est presque poétique.",
    cles: ["se placer au sommet d'un volcan et de résister à son éruption", "changeant alors les hommes en chateaux de sables éternel, s'éparpillant dans l'air au gré du vent"]
  },
  "recueil/indre-et-loire.txt": {
    demesure: 5, collisions: 7, serieux: 7, precision: 7, chute: 8,
    avis: "Une seule phrase pour un concept de jeu télévisé complet. Rester sur le podium à vie, c'est la récompense qui ressemble le plus à une punition.",
    cles: ["sur lesquels ils devront rester dessus pendant toute leur vie", "faire de l'apnée éternelle dans la mer Baltique"]
  },
  "recueil/farandole-saturnienne.txt": {
    demesure: 9, collisions: 9, serieux: 8, precision: 7, chute: 10,
    avis: "Le retournement est la meilleure chute du recueil : l'enquête est réussie, sauf que les héros ont arrêté Dieu, le frère jumeau du coupable.",
    cles: ["en poissons longs de 1 km et large de 1 mm", "chaussures de lutins pointus, longues de 2 années-lumière", "avoir capturer Dieu et non le méchant personnage, Dieu étant son frère jumeau"]
  },
  "recueil/parade-d-asterion.txt": {
    demesure: 8, collisions: 9, serieux: 6, precision: 4, chute: 8,
    avis: "Des lutins-mouches qui forment le visage géant d'un youtubeur : l'image est folle. Tout va très vite, et la fin de l'Univers tient en une demi-phrase.",
    cles: ["des lutins-mouches souriantes", "afficherait son fameux sourire de Joker"]
  },
  "recueil/baignoire-cosmique.txt": {
    demesure: 10, collisions: 9, serieux: 8, precision: 6, chute: 10,
    avis: "François Hollande dix fois plus grand qu'un trou noir, qui réveille Sarkozy d'un sommeil de milliards d'années : la montée en puissance façon manga est parfaitement assumée.",
    cles: ["1 quintilliard d'êtres extraordinaires totalement dénués d'une morphologie humanoïde", "à la manière de la technique de la déesse au 1000 paumes de Netero"]
  },
  "recueil/grand_mensonge_noel": {
    demesure: 6, collisions: 8, serieux: 6, precision: 5, chute: 6,
    avis: "Les enceintes Marshall volantes sont le détail qui fait tout. Le reste suit un schéma qu'on retrouve ailleurs dans le recueil.",
    cles: ["en voyageant à l'intérieur d'enceintes Marshall géantes qui volent"]
  },
  "recueil/heure_des_pros.txt": {
    demesure: 10, collisions: 9, serieux: 7, precision: 9, chute: 7,
    avis: "Le calcul du nombre de pinceaux est un sommet de précision inutile. La seconde moitié enchaîne les massacres, qui prennent le pas sur l'absurde.",
    cles: ["soit 3,6 × 10⁸⁹ pinceaux", "en 13 picosecondes sur un voile de 1 milliard de kilomètre de haut et de 15cm de large"]
  },
  "recueil/le_concert_de_trop.txt": {
    demesure: 10, collisions: 9, serieux: 9, precision: 8, chute: 10,
    avis: "Un voyage à un mètre par an, et une guitare qui doit « rester une guitare, cela va de soi » : le sérieux pédant face à l'énormité atteint ici son sommet.",
    cles: ["à la vitesse démente de 1 m par an", "il faut que ça reste une guitare, cela va de soit", "une aiguille de 1 année lumière de long et 1 nanomètre de large"]
  },
  "recueil/marche_noir_noel": {
    demesure: 3, collisions: 6, serieux: 5, precision: 4, chute: 4,
    avis: "Très court : l'absurde repose surtout sur le détour par la Laponie, une idée déjà mieux exploitée dans Le Grand Mensonge de Noël.",
    cles: ["en Laponie au village du Père Noël"]
  },
  "recueil/odysee_boules_humaines.txt": {
    demesure: 6, collisions: 9, serieux: 7, precision: 7, chute: 8,
    avis: "Une baleine bleue comme moyen de transport et une Coupe du monde dans les grottes de Lascaux : la collision géographique et historique est parfaite.",
    cles: ["à bord d'une baleine bleue de 1km3 de volume", "ballon de foot de la Coupe du Monde de Football dans le grottes de Lascaux"]
  },
  "recueil/operation_cajou_polaire": {
    demesure: 6, collisions: 8, serieux: 5, precision: 6, chute: 6,
    avis: "Tout ce chantier pour un trafic de noix de cajou dans un igloo sibérien : l'objectif final est si dérisoire qu'il en devient drôle.",
    cles: ["un igloo gigantesque plus haute que la Burj Khalifa", "faire un trafic de noix de cajou"]
  },
  "recueil/tournoi_interplanétaire": {
    demesure: 7, collisions: 10, serieux: 8, precision: 9, chute: 9,
    avis: "Une usine de 8245 km de large sur 35 cm de haut, des candidats préparés comme des pizzas et une punition finale qui ne dit pas son nom : c'est le texte le plus sournois du recueil.",
    cles: ["italiens badigeonnés de sauce tomate, de basilic et de mozzarella", "chaque usine mesurera au minimum 8245 km de large et 1,30m de long et de 35 cm de hauteur", "2 rendez-vous romantiques avec des femmes de leur âge"]
  },
  "recueil/trafic_chaud_froid.txt": {
    demesure: 5, collisions: 7, serieux: 6, precision: 6, chute: 6,
    avis: "Organiser un trafic de sable au Sahara, puis de neige en Antarctique : vendre ce qui est déjà partout, c'est un modèle économique absurde à souhait.",
    cles: ["Jouer de la contrebasse géante (8 m)", "un bateau géant pouvant atteindre les 1000 km/h"]
  }
};
