SCHÉMA DE BASE DE DONNÉES COMPLET

TABLE users
Stocke tous les utilisateurs (clients et admins)

```sql

id VARCHAR(36) PRIMARY KEY
nom VARCHAR(100) NOT NULL
prenom VARCHAR(100) NOT NULL
email VARCHAR(255) UNIQUE NOT NULL
telephone VARCHAR(20)
pays VARCHAR(100)
adresse TEXT
mot_de_passe_hash VARCHAR(255) NOT NULL
role ENUM('client', 'admin') DEFAULT 'client'
statut ENUM('actif', 'inactif', 'suspendu') DEFAULT 'actif'
date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
date_derniere_connexion TIMESTAMP
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

INDEX idx_email (email)
INDEX idx_role (role)
INDEX idx_statut (statut)
```
TABLE password_resets
Gère les demandes de réinitialisation de mot de passe
```sql
id VARCHAR(36) PRIMARY KEY
user_id VARCHAR(36) NOT NULL
token VARCHAR(255) UNIQUE NOT NULL
expires_at TIMESTAMP NOT NULL
utilise BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
INDEX idx_token (token)
INDEX idx_expires_at (expires_at)
```
TABLE sessions
Gère les sessions et tokens d'authentification
```sql
id VARCHAR(36) PRIMARY KEY
user_id VARCHAR(36) NOT NULL
token VARCHAR(500) UNIQUE NOT NULL
refresh_token VARCHAR(500) UNIQUE
ip_address VARCHAR(45)
user_agent TEXT
expires_at TIMESTAMP NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
INDEX idx_token (token)
INDEX idx_user_id (user_id)
INDEX idx_expires_at (expires_at)
```
TABLE categories
Catégories de produits
```sql
id VARCHAR(36) PRIMARY KEY
nom VARCHAR(100) NOT NULL
slug VARCHAR(100) UNIQUE NOT NULL
description TEXT
image_url VARCHAR(500)
ordre INT DEFAULT 0
actif BOOLEAN DEFAULT TRUE
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

INDEX idx_slug (slug)
INDEX idx_actif (actif)
```
TABLE produits
Tous les produits disponibles
```sql
id VARCHAR(36) PRIMARY KEY
categorie_id VARCHAR(36) NOT NULL
nom VARCHAR(255) NOT NULL
slug VARCHAR(255) UNIQUE NOT NULL
description TEXT
description_courte TEXT
prix DECIMAL(10,2) NOT NULL
devise VARCHAR(3) DEFAULT 'USD'
pays_origine ENUM('Chine', 'Dubaï') NOT NULL
quantite_minimum INT DEFAULT 1
delai_livraison VARCHAR(100)
poids DECIMAL(10,2)
dimensions VARCHAR(100)
caracteristiques JSON
disponible BOOLEAN DEFAULT TRUE
stock INT DEFAULT 0
nombre_vues INT DEFAULT 0
nombre_reservations INT DEFAULT 0
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE RESTRICT
INDEX idx_categorie (categorie_id)
INDEX idx_slug (slug)
INDEX idx_pays_origine (pays_origine)
INDEX idx_disponible (disponible)
INDEX idx_prix (prix)
```
TABLE produits_images
Images des produits
```sql
id VARCHAR(36) PRIMARY KEY
produit_id VARCHAR(36) NOT NULL
url VARCHAR(500) NOT NULL
alt_text VARCHAR(255)
ordre INT DEFAULT 0
est_principale BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
INDEX idx_produit (produit_id)
```
TABLE reservations
Réservations de produits par les clients
```sql
id VARCHAR(36) PRIMARY KEY
numero_reservation VARCHAR(50) UNIQUE NOT NULL
user_id VARCHAR(36) NOT NULL
produit_id VARCHAR(36) NOT NULL
quantite INT NOT NULL
prix_unitaire DECIMAL(10,2) NOT NULL
prix_total DECIMAL(10,2) NOT NULL
devise VARCHAR(3) DEFAULT 'USD'
statut ENUM('en_attente', 'confirmee', 'traitee', 'annulee') DEFAULT 'en_attente'
notes TEXT
notes_admin TEXT
date_confirmation TIMESTAMP
date_annulation TIMESTAMP
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE RESTRICT
INDEX idx_numero (numero_reservation)
INDEX idx_user (user_id)
INDEX idx_produit (produit_id)
INDEX idx_statut (statut)
INDEX idx_created (created_at)
```
TABLE transports
Demandes de transport de marchandises
```sql
id VARCHAR(36) PRIMARY KEY
numero_transport VARCHAR(50) UNIQUE NOT NULL
user_id VARCHAR(36) NOT NULL
pays_depart ENUM('Chine', 'Dubaï') NOT NULL
pays_destination VARCHAR(100) NOT NULL
ville_destination VARCHAR(100)
type_marchandise VARCHAR(255) NOT NULL
description TEXT
poids DECIMAL(10,2) NOT NULL
volume DECIMAL(10,2) NOT NULL
mode_transport ENUM('maritime', 'aerien') NOT NULL
prix_estime DECIMAL(10,2)
prix_final DECIMAL(10,2)
devise VARCHAR(3) DEFAULT 'USD'
delai_estime VARCHAR(100)
statut ENUM('en_attente', 'confirme', 'marchandise_recue', 'en_transit', 'arrive', 'livre', 'annule') DEFAULT 'en_attente'
date_depart TIMESTAMP
date_arrivee_estimee TIMESTAMP
date_arrivee_reelle TIMESTAMP
numero_suivi VARCHAR(100)
compagnie_transport VARCHAR(255)
notes_client TEXT
notes_admin TEXT
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
INDEX idx_numero (numero_transport)
INDEX idx_user (user_id)
INDEX idx_statut (statut)
INDEX idx_pays_depart (pays_depart)
INDEX idx_pays_destination (pays_destination)
INDEX idx_created (created_at)
```
TABLE transport_timeline
Historique et suivi des transports
```sql
id VARCHAR(36) PRIMARY KEY
transport_id VARCHAR(36) NOT NULL
etape VARCHAR(100) NOT NULL
description TEXT
statut VARCHAR(50)
localisation VARCHAR(255)
date_evenement TIMESTAMP NOT NULL
cree_par VARCHAR(36)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (transport_id) REFERENCES transports(id) ON DELETE CASCADE
FOREIGN KEY (cree_par) REFERENCES users(id) ON DELETE SET NULL
INDEX idx_transport (transport_id)
INDEX idx_date (date_evenement)
```
TABLE transport_documents
Documents liés aux transports
```sql
id VARCHAR(36) PRIMARY KEY
transport_id VARCHAR(36) NOT NULL
nom VARCHAR(255) NOT NULL
type VARCHAR(100)
url VARCHAR(500) NOT NULL
taille INT
uploaded_par VARCHAR(36)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (transport_id) REFERENCES transports(id) ON DELETE CASCADE
FOREIGN KEY (uploaded_par) REFERENCES users(id) ON DELETE SET NULL
INDEX idx_transport (transport_id)
```
TABLE devis
Demandes de devis
```sql
id VARCHAR(36) PRIMARY KEY
numero_devis VARCHAR(50) UNIQUE NOT NULL
user_id VARCHAR(36)
type_service ENUM('achat', 'transport', 'accompagnement') NOT NULL
nom VARCHAR(100) NOT NULL
email VARCHAR(255) NOT NULL
telephone VARCHAR(20) NOT NULL
pays VARCHAR(100) NOT NULL
details TEXT NOT NULL
statut ENUM('en_attente', 'en_cours', 'envoye', 'accepte', 'refuse') DEFAULT 'en_attente'
reponse TEXT
montant DECIMAL(10,2)
devise VARCHAR(3) DEFAULT 'USD'
delai VARCHAR(100)
valide_jusque TIMESTAMP
date_reponse TIMESTAMP
traite_par VARCHAR(36)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
FOREIGN KEY (traite_par) REFERENCES users(id) ON DELETE SET NULL
INDEX idx_numero (numero_devis)
INDEX idx_user (user_id)
INDEX idx_statut (statut)
INDEX idx_type (type_service)
INDEX idx_created (created_at)
```
TABLE formules_accompagnement
Formules d'accompagnement disponibles
```sql
id VARCHAR(36) PRIMARY KEY
nom VARCHAR(100) NOT NULL
slug VARCHAR(100) UNIQUE NOT NULL
description TEXT
services_inclus JSON
prix DECIMAL(10,2)
devise VARCHAR(3) DEFAULT 'USD'
duree VARCHAR(100)
ordre INT DEFAULT 0
actif BOOLEAN DEFAULT TRUE
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

INDEX idx_slug (slug)
INDEX idx_actif (actif)
```
TABLE demandes_accompagnement
Demandes d'accompagnement des clients
```sql
id VARCHAR(36) PRIMARY KEY
numero_demande VARCHAR(50) UNIQUE NOT NULL
user_id VARCHAR(36) NOT NULL
formule_id VARCHAR(36)
description_projet TEXT NOT NULL
budget_estime DECIMAL(10,2)
devise VARCHAR(3) DEFAULT 'USD'
statut ENUM('en_attente', 'en_cours', 'acceptee', 'refusee', 'terminee') DEFAULT 'en_attente'
notes_admin TEXT
date_debut TIMESTAMP
date_fin TIMESTAMP
assigne_a VARCHAR(36)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
FOREIGN KEY (formule_id) REFERENCES formules_accompagnement(id) ON DELETE SET NULL
FOREIGN KEY (assigne_a) REFERENCES users(id) ON DELETE SET NULL
INDEX idx_numero (numero_demande)
INDEX idx_user (user_id)
INDEX idx_statut (statut)
INDEX idx_created (created_at)
```
TABLE conversations
Conversations entre clients et support
```sql
id VARCHAR(36) PRIMARY KEY
user_id VARCHAR(36) NOT NULL
sujet VARCHAR(255) NOT NULL
statut ENUM('ouvert', 'en_cours', 'resolu', 'ferme') DEFAULT 'ouvert'
priorite ENUM('basse', 'normale', 'haute', 'urgente') DEFAULT 'normale'
derniere_activite TIMESTAMP DEFAULT CURRENT_TIMESTAMP
assigne_a VARCHAR(36)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
FOREIGN KEY (assigne_a) REFERENCES users(id) ON DELETE SET NULL
INDEX idx_user (user_id)
INDEX idx_statut (statut)
INDEX idx_derniere_activite (derniere_activite)
```
TABLE messages
Messages dans les conversations
```sql
id VARCHAR(36) PRIMARY KEY
conversation_id VARCHAR(36) NOT NULL
expediteur_id VARCHAR(36) NOT NULL
contenu TEXT NOT NULL
est_admin BOOLEAN DEFAULT FALSE
lu BOOLEAN DEFAULT FALSE
date_lecture TIMESTAMP
fichiers_attaches JSON
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
FOREIGN KEY (expediteur_id) REFERENCES users(id) ON DELETE CASCADE
INDEX idx_conversation (conversation_id)
INDEX idx_expediteur (expediteur_id)
INDEX idx_lu (lu)
INDEX idx_created (created_at)
```
TABLE contacts
Messages du formulaire de contact public
```sql
id VARCHAR(36) PRIMARY KEY
nom VARCHAR(100) NOT NULL
email VARCHAR(255) NOT NULL
telephone VARCHAR(20)
sujet VARCHAR(255) NOT NULL
message TEXT NOT NULL
ip_address VARCHAR(45)
traite BOOLEAN DEFAULT FALSE
traite_par VARCHAR(36)
date_traitement TIMESTAMP
reponse TEXT
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (traite_par) REFERENCES users(id) ON DELETE SET NULL
INDEX idx_traite (traite)
INDEX idx_created (created_at)
```
TABLE notifications
Notifications pour les utilisateurs
```sql
id VARCHAR(36) PRIMARY KEY
user_id VARCHAR(36) NOT NULL
type VARCHAR(50) NOT NULL
titre VARCHAR(255) NOT NULL
message TEXT NOT NULL
lien VARCHAR(500)
lu BOOLEAN DEFAULT FALSE
date_lecture TIMESTAMP
data JSON
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
INDEX idx_user (user_id)
INDEX idx_lu (lu)
INDEX idx_type (type)
INDEX idx_created (created_at)
```
TABLE logs_activite
Journal des activités importantes
```sql
id VARCHAR(36) PRIMARY KEY
user_id VARCHAR(36)
type_activite VARCHAR(100) NOT NULL
description TEXT
entite_type VARCHAR(50)
entite_id VARCHAR(36)
ip_address VARCHAR(45)
user_agent TEXT
data JSON
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
INDEX idx_user (user_id)
INDEX idx_type (type_activite)
INDEX idx_entite (entite_type, entite_id)
INDEX idx_created (created_at)
```
TABLE tarifs_transport
Grille tarifaire pour les transports
```sql
id VARCHAR(36) PRIMARY KEY
pays_depart ENUM('Chine', 'Dubaï') NOT NULL
pays_destination VARCHAR(100) NOT NULL
mode_transport ENUM('maritime', 'aerien') NOT NULL
poids_min DECIMAL(10,2) NOT NULL
poids_max DECIMAL(10,2) NOT NULL
prix_par_kg DECIMAL(10,2) NOT NULL
prix_par_m3 DECIMAL(10,2) NOT NULL
delai_moyen VARCHAR(100)
devise VARCHAR(3) DEFAULT 'USD'
actif BOOLEAN DEFAULT TRUE
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

INDEX idx_depart_destination (pays_depart, pays_destination)
INDEX idx_mode (mode_transport)
INDEX idx_actif (actif)
```
TABLE parametres
Paramètres généraux du système
```sql
id VARCHAR(36) PRIMARY KEY
cle VARCHAR(100) UNIQUE NOT NULL
valeur TEXT
type VARCHAR(50)
description TEXT
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

INDEX idx_cle (cle)
```
TABLE pays
Liste des pays supportés
```sql
id VARCHAR(36) PRIMARY KEY
nom VARCHAR(100) NOT NULL
code VARCHAR(3) UNIQUE NOT NULL
region VARCHAR(100)
actif BOOLEAN DEFAULT TRUE
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

INDEX idx_code (code)
INDEX idx_actif (actif)
```
RELATIONS PRINCIPALES
```
users 1:N reservations
users 1:N transports
users 1:N devis
users 1:N demandes_accompagnement
users 1:N conversations
users 1:N messages
users 1:N notifications

categories 1:N produits
produits 1:N produits_images
produits 1:N reservations

transports 1:N transport_timeline
transports 1:N transport_documents

formules_accompagnement 1:N demandes_accompagnement

conversations 1:N messages
```
VUES UTILES
```sql
VIEW vue_dashboard_stats
SELECT
  COUNT(DISTINCT r.id) as total_reservations,
  COUNT(DISTINCT t.id) as total_transports,
  COUNT(DISTINCT d.id) as total_devis,
  COUNT(DISTINCT u.id) as total_clients,
  SUM(CASE WHEN r.statut = 'en_attente' THEN 1 ELSE 0 END) as reservations_en_attente,
  SUM(CASE WHEN t.statut IN ('en_transit', 'marchandise_recue') THEN 1 ELSE 0 END) as transports_actifs,
  SUM(CASE WHEN d.statut = 'en_attente' THEN 1 ELSE 0 END) as devis_en_attente
FROM users u
LEFT JOIN reservations r ON u.id = r.user_id
LEFT JOIN transports t ON u.id = t.user_id
LEFT JOIN devis d ON u.id = d.user_id
WHERE u.role = 'client'
```
```sql
VIEW vue_produits_populaires
SELECT
  p.id,
  p.nom,
  p.prix,
  p.pays_origine,
  c.nom as categorie,
  p.nombre_vues,
  p.nombre_reservations,
  COUNT(r.id) as reservations_total
FROM produits p
LEFT JOIN categories c ON p.categorie_id = c.id
LEFT JOIN reservations r ON p.id = r.produit_id
WHERE p.disponible = TRUE
GROUP BY p.id
ORDER BY reservations_total DESC, p.nombre_vues DESC
```
TRIGGERS
```sql
TRIGGER after_reservation_insert
AFTER INSERT ON reservations
FOR EACH ROW
BEGIN
  UPDATE produits SET nombre_reservations = nombre_reservations + 1 WHERE id = NEW.produit_id;
  INSERT INTO notifications (user_id, type, titre, message) VALUES (NEW.user_id, 'reservation', 'Réservation créée', CONCAT('Votre réservation ', NEW.numero_reservation, ' a été créée'));
END
```
TRIGGER after_transport_status_update
AFTER UPDATE ON transports
FOR EACH ROW
BEGIN
  IF OLD.statut != NEW.statut THEN
    INSERT INTO transport_timeline (transport_id, etape, description, date_evenement) VALUES (NEW.id, NEW.statut, 'Changement de statut', NOW());
    INSERT INTO notifications (user_id, type, titre, message) VALUES (NEW.user_id, 'transport', 'Statut transport mis à jour', CONCAT('Votre transport ', NEW.numero_transport, ' est maintenant: ', NEW.statut));
  END IF;
END
```sql
TRIGGER after_message_insert
AFTER INSERT ON messages
FOR EACH ROW
BEGIN
  UPDATE conversations SET derniere_activite = NOW() WHERE id = NEW.conversation_id;
  IF NEW.est_admin = FALSE THEN
    INSERT INTO notifications (user_id, type, titre, message) 
    SELECT u.id, 'message', 'Nouveau message', 'Vous avez reçu un nouveau message'
    FROM users u WHERE u.role = 'admin' LIMIT 1;
  END IF;
END
```
```sql
INDEXES SUPPLEMENTAIRES POUR PERFORMANCES

INDEX idx_reservations_composite ON reservations(user_id, statut, created_at)
INDEX idx_transports_composite ON transports(user_id, statut, created_at)
INDEX idx_messages_conversation_date ON messages(conversation_id, created_at)
INDEX idx_notifications_user_lu ON notifications(user_id, lu, created_at)
```

NOTES IMPORTANTES

Tous les IDs utilisent UUID (VARCHAR 36)
Les timestamps sont en UTC
Les montants utilisent DECIMAL(10,2) pour précision
Les ENUM simplifient la validation
Les index optimisent les requêtes fréquentes
Les foreign keys assurent l'intégrité
Les triggers automatisent les notifications
Les vues simplifient les statistiques