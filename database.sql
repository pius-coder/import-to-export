-- Database Schema for Import-to-Export Platform
-- PostgreSQL version

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE user_statut AS ENUM ('actif', 'inactif', 'suspendu');
CREATE TYPE pays_enum AS ENUM ('Chine', 'Dubaï');
CREATE TYPE transport_mode AS ENUM ('maritime', 'aerien');
CREATE TYPE reservation_statut AS ENUM ('en_attente', 'confirmee', 'traitee', 'annulee');
CREATE TYPE transport_statut AS ENUM ('en_attente', 'confirme', 'marchandise_recue', 'en_transit', 'arrive', 'livre', 'annule');
CREATE TYPE devis_statut AS ENUM ('en_attente', 'en_cours', 'envoye', 'accepte', 'refuse');
CREATE TYPE devis_type AS ENUM ('achat', 'transport', 'accompagnement');
CREATE TYPE demande_accompagnement_statut AS ENUM ('en_attente', 'en_cours', 'acceptee', 'refusee', 'terminee');
CREATE TYPE conversation_statut AS ENUM ('ouvert', 'en_cours', 'resolu', 'ferme');
CREATE TYPE priorite AS ENUM ('basse', 'normale', 'haute', 'urgente');

-- TABLE users
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    pays VARCHAR(100),
    adresse TEXT,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'client',
    statut user_statut DEFAULT 'actif',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_derniere_connexion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_statut ON users(statut);

-- TABLE password_resets
CREATE TABLE password_resets (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    utilise BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_password_resets_expires_at ON password_resets(expires_at);

-- TABLE sessions
CREATE TABLE sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500) UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- TABLE categories
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    ordre INT DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_actif ON categories(actif);

-- TABLE produits
CREATE TABLE produits (
    id VARCHAR(36) PRIMARY KEY,
    categorie_id VARCHAR(36) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    description_courte TEXT,
    prix DECIMAL(10,2) NOT NULL,
    devise VARCHAR(3) DEFAULT 'USD',
    pays_origine pays_enum NOT NULL,
    quantite_minimum INT DEFAULT 1,
    delai_livraison VARCHAR(100),
    poids DECIMAL(10,2),
    dimensions VARCHAR(100),
    caracteristiques JSONB,
    disponible BOOLEAN DEFAULT TRUE,
    stock INT DEFAULT 0,
    nombre_vues INT DEFAULT 0,
    nombre_reservations INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE INDEX idx_produits_categorie ON produits(categorie_id);
CREATE INDEX idx_produits_slug ON produits(slug);
CREATE INDEX idx_produits_pays_origine ON produits(pays_origine);
CREATE INDEX idx_produits_disponible ON produits(disponible);
CREATE INDEX idx_produits_prix ON produits(prix);

-- TABLE produits_images
CREATE TABLE produits_images (
    id VARCHAR(36) PRIMARY KEY,
    produit_id VARCHAR(36) NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    ordre INT DEFAULT 0,
    est_principale BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);

CREATE INDEX idx_produits_images_produit ON produits_images(produit_id);

-- TABLE reservations
CREATE TABLE reservations (
    id VARCHAR(36) PRIMARY KEY,
    numero_reservation VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    produit_id VARCHAR(36) NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    prix_total DECIMAL(10,2) NOT NULL,
    devise VARCHAR(3) DEFAULT 'USD',
    statut reservation_statut DEFAULT 'en_attente',
    notes TEXT,
    notes_admin TEXT,
    date_confirmation TIMESTAMP,
    date_annulation TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE RESTRICT
);

CREATE INDEX idx_reservations_numero ON reservations(numero_reservation);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_produit ON reservations(produit_id);
CREATE INDEX idx_reservations_statut ON reservations(statut);
CREATE INDEX idx_reservations_created ON reservations(created_at);
CREATE INDEX idx_reservations_composite ON reservations(user_id, statut, created_at);

-- TABLE transports
CREATE TABLE transports (
    id VARCHAR(36) PRIMARY KEY,
    numero_transport VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    pays_depart pays_enum NOT NULL,
    pays_destination VARCHAR(100) NOT NULL,
    ville_destination VARCHAR(100),
    type_marchandise VARCHAR(255) NOT NULL,
    description TEXT,
    poids DECIMAL(10,2) NOT NULL,
    volume DECIMAL(10,2) NOT NULL,
    mode_transport transport_mode NOT NULL,
    prix_estime DECIMAL(10,2),
    prix_final DECIMAL(10,2),
    devise VARCHAR(3) DEFAULT 'USD',
    delai_estime VARCHAR(100),
    statut transport_statut DEFAULT 'en_attente',
    date_depart TIMESTAMP,
    date_arrivee_estimee TIMESTAMP,
    date_arrivee_reelle TIMESTAMP,
    numero_suivi VARCHAR(100),
    compagnie_transport VARCHAR(255),
    notes_client TEXT,
    notes_admin TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_transports_numero ON transports(numero_transport);
CREATE INDEX idx_transports_user ON transports(user_id);
CREATE INDEX idx_transports_statut ON transports(statut);
CREATE INDEX idx_transports_pays_depart ON transports(pays_depart);
CREATE INDEX idx_transports_pays_destination ON transports(pays_destination);
CREATE INDEX idx_transports_created ON transports(created_at);
CREATE INDEX idx_transports_composite ON transports(user_id, statut, created_at);

-- TABLE transport_timeline
CREATE TABLE transport_timeline (
    id VARCHAR(36) PRIMARY KEY,
    transport_id VARCHAR(36) NOT NULL,
    etape VARCHAR(100) NOT NULL,
    description TEXT,
    statut VARCHAR(50),
    localisation VARCHAR(255),
    date_evenement TIMESTAMP NOT NULL,
    cree_par VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transport_id) REFERENCES transports(id) ON DELETE CASCADE,
    FOREIGN KEY (cree_par) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_transport_timeline_transport ON transport_timeline(transport_id);
CREATE INDEX idx_transport_timeline_date ON transport_timeline(date_evenement);

-- TABLE transport_documents
CREATE TABLE transport_documents (
    id VARCHAR(36) PRIMARY KEY,
    transport_id VARCHAR(36) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    url VARCHAR(500) NOT NULL,
    taille INT,
    uploaded_par VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transport_id) REFERENCES transports(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_par) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_transport_documents_transport ON transport_documents(transport_id);

-- TABLE devis
CREATE TABLE devis (
    id VARCHAR(36) PRIMARY KEY,
    numero_devis VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(36),
    type_service devis_type NOT NULL,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    pays VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    statut devis_statut DEFAULT 'en_attente',
    reponse TEXT,
    montant DECIMAL(10,2),
    devise VARCHAR(3) DEFAULT 'USD',
    delai VARCHAR(100),
    valide_jusque TIMESTAMP,
    date_reponse TIMESTAMP,
    traite_par VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (traite_par) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_devis_numero ON devis(numero_devis);
CREATE INDEX idx_devis_user ON devis(user_id);
CREATE INDEX idx_devis_statut ON devis(statut);
CREATE INDEX idx_devis_type ON devis(type_service);
CREATE INDEX idx_devis_created ON devis(created_at);

-- TABLE formules_accompagnement
CREATE TABLE formules_accompagnement (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    services_inclus JSONB,
    prix DECIMAL(10,2),
    devise VARCHAR(3) DEFAULT 'USD',
    duree VARCHAR(100),
    ordre INT DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_formules_accompagnement_slug ON formules_accompagnement(slug);
CREATE INDEX idx_formules_accompagnement_actif ON formules_accompagnement(actif);

-- TABLE demandes_accompagnement
CREATE TABLE demandes_accompagnement (
    id VARCHAR(36) PRIMARY KEY,
    numero_demande VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    formule_id VARCHAR(36),
    description_projet TEXT NOT NULL,
    budget_estime DECIMAL(10,2),
    devise VARCHAR(3) DEFAULT 'USD',
    statut demande_accompagnement_statut DEFAULT 'en_attente',
    notes_admin TEXT,
    date_debut TIMESTAMP,
    date_fin TIMESTAMP,
    assigne_a VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (formule_id) REFERENCES formules_accompagnement(id) ON DELETE SET NULL,
    FOREIGN KEY (assigne_a) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_demandes_accompagnement_numero ON demandes_accompagnement(numero_demande);
CREATE INDEX idx_demandes_accompagnement_user ON demandes_accompagnement(user_id);
CREATE INDEX idx_demandes_accompagnement_statut ON demandes_accompagnement(statut);
CREATE INDEX idx_demandes_accompagnement_created ON demandes_accompagnement(created_at);

-- TABLE conversations
CREATE TABLE conversations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    sujet VARCHAR(255) NOT NULL,
    statut conversation_statut DEFAULT 'ouvert',
    priorite priorite DEFAULT 'normale',
    derniere_activite TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigne_a VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigne_a) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_statut ON conversations(statut);
CREATE INDEX idx_conversations_derniere_activite ON conversations(derniere_activite);

-- TABLE messages
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    expediteur_id VARCHAR(36) NOT NULL,
    contenu TEXT NOT NULL,
    est_admin BOOLEAN DEFAULT FALSE,
    lu BOOLEAN DEFAULT FALSE,
    date_lecture TIMESTAMP,
    fichiers_attaches JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (expediteur_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_expediteur ON messages(expediteur_id);
CREATE INDEX idx_messages_lu ON messages(lu);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_messages_conversation_date ON messages(conversation_id, created_at);

-- TABLE contacts
CREATE TABLE contacts (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    sujet VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    traite BOOLEAN DEFAULT FALSE,
    traite_par VARCHAR(36),
    date_traitement TIMESTAMP,
    reponse TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (traite_par) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_contacts_traite ON contacts(traite);
CREATE INDEX idx_contacts_created ON contacts(created_at);

-- TABLE notifications
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    lien VARCHAR(500),
    lu BOOLEAN DEFAULT FALSE,
    date_lecture TIMESTAMP,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_lu ON notifications(lu);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_notifications_user_lu ON notifications(user_id, lu, created_at);

-- TABLE logs_activite
CREATE TABLE logs_activite (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    type_activite VARCHAR(100) NOT NULL,
    description TEXT,
    entite_type VARCHAR(50),
    entite_id VARCHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_logs_activite_user ON logs_activite(user_id);
CREATE INDEX idx_logs_activite_type ON logs_activite(type_activite);
CREATE INDEX idx_logs_activite_entite ON logs_activite(entite_type, entite_id);
CREATE INDEX idx_logs_activite_created ON logs_activite(created_at);

-- TABLE tarifs_transport
CREATE TABLE tarifs_transport (
    id VARCHAR(36) PRIMARY KEY,
    pays_depart pays_enum NOT NULL,
    pays_destination VARCHAR(100) NOT NULL,
    mode_transport transport_mode NOT NULL,
    poids_min DECIMAL(10,2) NOT NULL,
    poids_max DECIMAL(10,2) NOT NULL,
    prix_par_kg DECIMAL(10,2) NOT NULL,
    prix_par_m3 DECIMAL(10,2) NOT NULL,
    delai_moyen VARCHAR(100),
    devise VARCHAR(3) DEFAULT 'USD',
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tarifs_transport_depart_destination ON tarifs_transport(pays_depart, pays_destination);
CREATE INDEX idx_tarifs_transport_mode ON tarifs_transport(mode_transport);
CREATE INDEX idx_tarifs_transport_actif ON tarifs_transport(actif);

-- TABLE parametres
CREATE TABLE parametres (
    id VARCHAR(36) PRIMARY KEY,
    cle VARCHAR(100) UNIQUE NOT NULL,
    valeur TEXT,
    type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_parametres_cle ON parametres(cle);

-- TABLE pays
CREATE TABLE pays (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    code VARCHAR(3) UNIQUE NOT NULL,
    region VARCHAR(100),
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pays_code ON pays(code);
CREATE INDEX idx_pays_actif ON pays(actif);

-- TRIGGERS for updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_update BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_categories_update BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_produits_update BEFORE UPDATE ON produits
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_reservations_update BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_transports_update BEFORE UPDATE ON transports
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_devis_update BEFORE UPDATE ON devis
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_formules_accompagnement_update BEFORE UPDATE ON formules_accompagnement
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_demandes_accompagnement_update BEFORE UPDATE ON demandes_accompagnement
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_conversations_update BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_tarifs_transport_update BEFORE UPDATE ON tarifs_transport
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_parametres_update BEFORE UPDATE ON parametres
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- TRIGGER for after_reservation_insert
CREATE OR REPLACE FUNCTION after_reservation_insert()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE produits SET nombre_reservations = nombre_reservations + 1 WHERE id = NEW.produit_id;
    INSERT INTO notifications (id, user_id, type, titre, message, created_at)
    VALUES (gen_random_uuid()::text, NEW.user_id, 'reservation', 'Réservation créée', 
            CONCAT('Votre réservation ', NEW.numero_reservation, ' a été créée'), CURRENT_TIMESTAMP);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_after_reservation_insert AFTER INSERT ON reservations
    FOR EACH ROW EXECUTE FUNCTION after_reservation_insert();

-- TRIGGER for after_transport_status_update
CREATE OR REPLACE FUNCTION after_transport_status_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.statut != NEW.statut THEN
        INSERT INTO transport_timeline (id, transport_id, etape, description, date_evenement, created_at)
        VALUES (gen_random_uuid()::text, NEW.id, NEW.statut::text, 'Changement de statut', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        INSERT INTO notifications (id, user_id, type, titre, message, created_at)
        VALUES (gen_random_uuid()::text, NEW.user_id, 'transport', 'Statut transport mis à jour',
                CONCAT('Votre transport ', NEW.numero_transport, ' est maintenant: ', NEW.statut::text), CURRENT_TIMESTAMP);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_after_transport_status_update AFTER UPDATE ON transports
    FOR EACH ROW EXECUTE FUNCTION after_transport_status_update();

-- TRIGGER for after_message_insert
CREATE OR REPLACE FUNCTION after_message_insert()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations SET derniere_activite = CURRENT_TIMESTAMP WHERE id = NEW.conversation_id;
    IF NEW.est_admin = FALSE THEN
        INSERT INTO notifications (id, user_id, type, titre, message, created_at)
        SELECT gen_random_uuid()::text, u.id, 'message', 'Nouveau message', 'Vous avez reçu un nouveau message', CURRENT_TIMESTAMP
        FROM users u WHERE u.role = 'admin' LIMIT 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_after_message_insert AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION after_message_insert();

-- VIEWS
CREATE VIEW vue_dashboard_stats AS
SELECT
    COUNT(DISTINCT r.id) as total_reservations,
    COUNT(DISTINCT t.id) as total_transports,
    COUNT(DISTINCT d.id) as total_devis,
    COUNT(DISTINCT u.id) as total_clients,
    SUM(CASE WHEN r.statut = 'en_attente'::reservation_statut THEN 1 ELSE 0 END) as reservations_en_attente,
    SUM(CASE WHEN t.statut IN ('en_transit'::transport_statut, 'marchandise_recue'::transport_statut) THEN 1 ELSE 0 END) as transports_actifs,
    SUM(CASE WHEN d.statut = 'en_attente'::devis_statut THEN 1 ELSE 0 END) as devis_en_attente
FROM users u
LEFT JOIN reservations r ON u.id = r.user_id
LEFT JOIN transports t ON u.id = t.user_id
LEFT JOIN devis d ON u.id = d.user_id
WHERE u.role = 'client'::user_role;

CREATE VIEW vue_produits_populaires AS
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
GROUP BY p.id, p.nom, p.prix, p.pays_origine, c.nom, p.nombre_vues, p.nombre_reservations
ORDER BY reservations_total DESC, p.nombre_vues DESC;
