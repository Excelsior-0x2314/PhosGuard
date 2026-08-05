\# PhosGuard



Application de gestion de maintenance industrielle, développée dans le cadre d'un stage chez OCP (Office Chérifien des Phosphates).



PhosGuard permet de gérer les équipements, les tickets d'intervention, la maintenance préventive, le stock de pièces de rechange, et génère des rapports et notifications pour les équipes techniques.



\## Stack technique



\*\*Backend\*\*

\- Laravel 12 (API REST)

\- Laravel Sanctum (authentification SPA par cookies)

\- MySQL

\- barryvdh/laravel-dompdf (génération de rapports PDF)



\*\*Frontend\*\*

\- React 19 + Vite + TypeScript

\- Tailwind CSS v4

\- Shadcn UI

\- Recharts (graphiques du dashboard)



\## Fonctionnalités



\- \*\*Authentification\*\* — connexion sécurisée, gestion de session, réinitialisation de mot de passe par email

\- \*\*Gestion des utilisateurs\*\* — CRUD, rôles (admin / responsable / technicien), activation/désactivation

\- \*\*Équipements\*\* — inventaire avec statut (fonctionnel / en panne), recherche et filtres

\- \*\*Tickets\*\* — création, affectation à un technicien, suivi de statut, calcul automatique des délais GTI/GTR selon la priorité

\- \*\*Maintenance préventive\*\* — planification de visites récurrentes (tous les 15 jours), checklist, compte rendu, renouvellement automatique

\- \*\*Stock\*\* — inventaire des pièces de rechange, mouvements entrée/sortie, alertes de stock bas, sortie automatique lors de la clôture d'un ticket

\- \*\*Dashboard\*\* — statistiques globales et graphiques de répartition

\- \*\*Rapports\*\* — export PDF des tickets et équipements

\- \*\*Notifications\*\* — alertes en temps réel pour les événements clés (nouveau ticket, affectation, stock bas)



\## Rôles et permissions



| Action | Admin | Responsable | Technicien |

|---|---|---|---|

| Gérer les utilisateurs | ✅ | Lecture seule | ❌ |

| Gérer les équipements | ✅ | Lecture seule | Lecture seule |

| Créer un ticket | ✅ | ✅ | ✅ |

| Affecter un ticket | ✅ | ✅ | ❌ |

| Modifier le statut d'un ticket | ✅ | ✅ | Si assigné uniquement |

| Gérer le stock | ✅ | Lecture seule | Lecture seule |

| Générer des rapports | ✅ | ✅ | ❌ |



\## Installation



\### Prérequis

\- PHP 8.2+

\- Composer

\- Node.js 18+

\- MySQL



\### Backend



```bash

cd backend

composer install

cp .env.example .env

php artisan key:generate

```



Configurer la base de données dans `.env` :

```

DB\_DATABASE=phosguard\_db

DB\_USERNAME=root

DB\_PASSWORD=

```



```bash

php artisan migrate

php artisan serve

```



L'API est accessible sur `http://localhost:8000`.



\### Frontend



```bash

cd frontend

npm install

npm run dev

```



L'application est accessible sur `http://localhost:5173`.



\## Architecture



Le projet est un monorepo contenant deux applications indépendantes :



phosguard/

├── backend/ # API Laravel

└── frontend/ # Application React



\*\*Backend\*\* — architecture en couches classique :

\- `Http/Controllers` — orchestration légère, délègue aux Services

\- `Http/Requests` — validation des données entrantes

\- `Http/Resources` — formatage des réponses JSON

\- `Services` — logique métier

\- `Models` — Eloquent ORM

\- `Enums` — valeurs métier fixes (rôles, statuts, priorités)



\*\*Frontend\*\* — sans routeur ni gestionnaire d'état externe :

\- Navigation gérée manuellement via `useState` dans `App.tsx`

\- Authentification centralisée dans `AuthContext`

\- Client API unique (`lib/api.ts`) gérant CSRF et cookies Sanctum



\## Auteur



Omar — étudiant en ingénierie Réseaux, Systèmes et Services Programmables (RSSP), ENSA Marrakech.

