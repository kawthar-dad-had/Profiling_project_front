# 🛒 Frontend du Projet de Profilage des Utilisateurs

Ce projet est le frontend d'une application de gestion des produits et des utilisateurs, développée avec **React** et instrumentée avec **OpenTelemetry** pour la traçabilité des actions. Il communique avec un backend en Java via des requêtes HTTP, en utilisant **Axios** pour effectuer les opérations CRUD.

---

## 📋 **Fonctionnalités Principales**

- **Authentification des utilisateurs** :  
  - Inscription et connexion des utilisateurs.
  - Gestion des tokens JWT pour sécuriser les requêtes.

- **Gestion des Produits** :  
  - Visualisation des produits disponibles.
  - Ajout, modification et suppression des produits (réservé aux administrateurs).
  
- **Gestion du Panier** :  
  - Ajout et suppression de produits du panier.
  - Visualisation du panier utilisateur.

- **Traçabilité avec OpenTelemetry** :  
  - Capture des requêtes HTTP et des interactions utilisateur.
  - Exportation des traces vers **Zipkin** pour une analyse détaillée des transactions frontend-backend.

---

## 🚀 **Technologies Utilisées**

- **React** : Framework JavaScript pour le développement du frontend.
- **Axios** : Pour les requêtes HTTP vers le backend.
- **Material-UI** : Composants d'interface utilisateur pour un design moderne.
- **OpenTelemetry** : Pour l'instrumentation et la traçabilité des actions.
- **Zipkin** : Outil de visualisation des traces collectées.
- **React Router** : Pour la gestion de la navigation entre les pages.

---

## 🛠️ **Prérequis**

Avant de lancer le projet, assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Le backend Java en cours d'exécution sur `http://localhost:8080`
- Zipkin en cours d'exécution sur `http://localhost:9414`

---

## 📥 **Installation**

Clonez le dépôt GitHub :

```bash
git clone https://github.com/kawthar-dad-had/Profiling_project_front
cd Profiling_project_front
```
Installez les dépendances :

```bash
npm install
```

## ▶️ Lancer le Projet

Démarrez le serveur de développement avec :

```bash
npm run start
```

## 📊 Visualisation des Traces

- Lancez Zipkin à l'adresse http://localhost:9414.
- Effectuez des actions sur le frontend (connexion, gestion des produits, etc.).
- Visualisez les traces dans l'interface Zipkin pour voir le parcours complet des requêtes.



