# GuardianFlow

GuardianFlow est un système avancé de surveillance des transactions financières conçu pour détecter et prévenir le blanchiment d'argent grâce à l'intelligence artificielle et l'analyse de données en temps réel.

## 🌟 Fonctionnalités

- Surveillance des transactions en **temps réel**
- Détection des modèles suspects via **Machine Learning**
- **Tableau de bord interactif** pour visualiser les transactions
- Rapports détaillés pour la **conformité réglementaire**
- Architecture évolutive adaptée aux **transactions à haut volume**

---

## 🛠️ Stack Technologique

### 🌐 Frontend
- **React.js (Next.js 14)** – Framework moderne pour le web
- **TypeScript** – Sécurisation du code avec typage
- **Tailwind CSS** – Framework CSS performant
- **Recharts** – Bibliothèque de graphiques avancée
- **Shadcn UI** – Composants UI modernes et flexibles

### 🖙 Backend
- **Python (Flask + Flask-RESTful)** – API légère et performante
- **Scikit-learn** – Modèles de Machine Learning pour la détection
- **Pandas & NumPy** – Manipulation et analyse des données
- **Joblib** – Sauvegarde et chargement des modèles ML

### 🟢 Base de Données
- **PostgreSQL** – Base de données relationnelle robuste
- **SQLAlchemy** – ORM pour la gestion des requêtes SQL

### ⚙️ Outils de Développement
- **Git & GitHub** – Versioning & collaboration
- **Docker** – Conteneurisation de l'application
- **Jupyter Notebooks** – Développement et test des modèles ML

---

## 🚀 Installation et Déploiement

### Prérequis :
- **Node.js** (v18+)
- **Python** (3.9+)
- **PostgreSQL**
- **Docker**

### 🔧 Installation :

1️⃣ **Cloner le projet**
```bash
git clone https://github.com/your-organization/guardianflow.git
cd guardianflow
```

2️⃣ **Installation des dépendances Frontend**
```bash
cd frontend
npm install
```

3️⃣ **Installation des dépendances Backend**
```bash
cd backend
pip install -r requirements.txt
```

4️⃣ **Configuration de la base de données**
```bash
docker-compose up -d db
python backend/init_db.py
```

5️⃣ **Démarrer l'application**
```bash
# Backend (Flask)
cd backend
flask run --host=0.0.0.0 --port=8000

# Frontend (Next.js)
cd frontend
npm run dev
```

---

## 🔧 Configuration

Créer un fichier `.env` dans **backend/** et **frontend/** en utilisant ce modèle :

```env
# Backend .env
DATABASE_URL=postgresql://user:password@localhost:5432/guardianflow
ML_MODEL_PATH=./models/
SECRET_KEY=your_secret_key

# Frontend .env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🏟️ Structure du Projet

```
guardianflow/
├── frontend/  # Interface utilisateur (React, Next.js)
│   ├── components/
│   ├── pages/
│   ├── public/
│   └── styles/
├── backend/   # API (Flask, Flask-RESTful)
│   ├── api/
│   ├── models/
│   ├── services/
│   ├── utils/
│   ├── routes/
│   ├── init_db.py
│   └── app.py
├── ml/  # Machine Learning
│   ├── notebooks/
│   ├── models/
│   ├── training/
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile
└── README.md
```

---

## 🔒 Sécurité et Détection des Anomalies

- 📊 **Analyse en temps réel des transactions**
- 🚨 **Détection des comportements suspects par IA**
- 🔎 **Audit et logging des activités**
- 🔐 **Système d’authentification et gestion des rôles**

---

## 📊 Machine Learning dans GuardianFlow

- **Analyse des motifs transactionnels**
- **Détection d’anomalies par clustering**
- **Système de scoring des risques**
- **Analyse comportementale et prédictions**

---

## 🤝 Contribuer

1. **Forker** le repo
2. **Créer** une branche (`git checkout -b feature/ma_feature`)
3. **Committer** vos changements (`git commit -m "Ajout d'une fonctionnalité"`)
4. **Pusher** la branche (`git push origin feature/ma_feature`)
5. **Créer** une Pull Request

---


## 👥 Équipe

Ce projet a été développé par :
- 🖥️ [IMAD EL KHELYFY] – Développement Frontend
- 🔙 – Développement Backend
- 🤖 – Machine Learning
- 🟢 – Architecture Base de Données

---

## 💎 Contact

📩 Pour toute question :
- ✉️ Email: **imadelkhelyfy@gmail.com**
- 🌍 GitHub: https://github.com/IMADKHKHALIFI/money-laundering-detection

---

💡 **GuardianFlow – Protégeons les finances avec l'IA !** 🚀

