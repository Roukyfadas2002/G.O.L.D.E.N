-- Création de la table role
CREATE TABLE role (
    id_role SERIAL PRIMARY KEY,
    nom_role VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Création de la table client avec la colonne password et id_role
CREATE TABLE client (
    id_client SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Nouveau champ pour le mot de passe
    telephone VARCHAR(15) NOT NULL,
    adresse VARCHAR(255),
    id_role INTEGER NOT NULL, -- Liaison avec la table role
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_role) REFERENCES role (id_role) ON DELETE CASCADE
);

-- Création de la table chien
CREATE TABLE chien (
    id_chien SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    race VARCHAR(50) NOT NULL,
    age INTEGER NOT NULL,
    id_pere INTEGER,
    id_mere INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pere) REFERENCES chien (id_chien) ON DELETE SET NULL,
    FOREIGN KEY (id_mere) REFERENCES chien (id_chien) ON DELETE SET NULL
);

-- Table d'association entre chien et propriétaire
CREATE TABLE chien_proprietaire (
    id_chien INTEGER NOT NULL,
    id_client INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_chien, id_client),
    FOREIGN KEY (id_chien) REFERENCES chien (id_chien) ON DELETE CASCADE,
    FOREIGN KEY (id_client) REFERENCES client (id_client) ON DELETE CASCADE
);

-- Création de la table chambre
CREATE TABLE chambre (
    id_chambre SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    prix_par_nuit DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table reservation
CREATE TABLE reservation (
    id_reservation SERIAL PRIMARY KEY,
    id_client INTEGER NOT NULL,
    id_chambre INTEGER NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'En attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_client) REFERENCES client (id_client) ON DELETE CASCADE,
    FOREIGN KEY (id_chambre) REFERENCES chambre (id_chambre) ON DELETE CASCADE
);

-- Création de la table produit
CREATE TABLE produit (
    id_produit SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    prix DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table commande
CREATE TABLE commande (
    id_commande SERIAL PRIMARY KEY,
    id_client INTEGER NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'En attente',
    FOREIGN KEY (id_client) REFERENCES client (id_client) ON DELETE CASCADE
);

-- Table pour lier les produits et commandes (relation n-n)
CREATE TABLE commande_produit (
    id_commande INTEGER NOT NULL,
    id_produit INTEGER NOT NULL,
    quantite INTEGER NOT NULL,
    PRIMARY KEY (id_commande, id_produit),
    FOREIGN KEY (id_commande) REFERENCES commande (id_commande) ON DELETE CASCADE,
    FOREIGN KEY (id_produit) REFERENCES produit (id_produit) ON DELETE CASCADE
);

-- Insertion des rôles
INSERT INTO role (nom_role, description) 
VALUES 
('Admin', 'Administrateur avec tous les droits'),
('User', 'Utilisateur standard avec des droits limités');

-- Insertion d'un compte admin
INSERT INTO client (nom, prenom, email, password, telephone, adresse, id_role)
VALUES 
('Admin', 'System', 'admin@example.com', 'admin', '0600000000', 'Siège Administratif', 1); -- Mot de passe à remplacer par un hash

-- Insertion de clients normaux
INSERT INTO client (nom, prenom, email, password, telephone, adresse, id_role)
VALUES 
('Dupont', 'Jean', 'jean.dupont@example.com', 'jean', '0601020304', '123 Rue de Paris', 2),
('Martin', 'Claire', 'claire.martin@example.com', 'claire', '0605060708', '45 Avenue de Lyon', 2);

-- Insertion des chiens
INSERT INTO chien (nom, race, age, id_pere, id_mere)
VALUES 
('Rex', 'Golden Retriever', 3, NULL, NULL),
('Bella', 'Golden Retriever', 2, 1, NULL);

-- Association chien-propriétaire
INSERT INTO chien_proprietaire (id_chien, id_client)
VALUES 
(1, 1),
(1, 2);

-- Insertion des chambres
INSERT INTO chambre (nom, type, prix_par_nuit)
VALUES 
('Chambre 101', 'Double', 100.00),
('Chambre 202', 'Suite', 150.00);

-- Insertion des réservations
INSERT INTO reservation (id_client, id_chambre, date_debut, date_fin, status)
VALUES 
(1, 1, '2025-02-01', '2025-02-05', 'Confirmée'),
(2, 2, '2025-03-10', '2025-03-15', 'Confirmée');