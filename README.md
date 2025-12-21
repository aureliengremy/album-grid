# AlbumGrid

Créez des mosaïques de pochettes d'albums en haute résolution, prêtes pour l'impression.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## Fonctionnalités

- **Recherche d'albums** via Spotify et MusicBrainz
- **Drag & Drop** pour réorganiser les pochettes
- **Formats d'impression** prédéfinis (IKEA, A4, Poster, Carré vinyle...)
- **Personnalisation** complète (colonnes, espacement, couleur de fond, bordures)
- **Export haute résolution** (PNG, JPEG, WebP) jusqu'à 300 DPI
- **Undo/Redo** avec historique complet
- **Sauvegarde automatique** dans le navigateur

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn

### Étapes

```bash
# Cloner le repository
git clone https://github.com/aureliengremy/album-grid.git
cd album-grid

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:3005](http://localhost:3005)

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Spotify API (requis pour la recherche Spotify)
SPOTIFY_CLIENT_ID=votre_client_id
SPOTIFY_CLIENT_SECRET=votre_client_secret

# MusicBrainz - API publique, pas de clé requise
```

### Obtenir les credentials Spotify

1. Connectez-vous sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Créez une nouvelle application
3. Copiez le **Client ID** et **Client Secret**
4. Ajoutez-les dans votre fichier `.env.local`

> **Note** : Sans credentials Spotify, l'application utilisera uniquement MusicBrainz pour la recherche.

## Utilisation

### 1. Rechercher des albums

- Ouvrez la bibliothèque (bouton "Bibliothèque" ou icône)
- Choisissez la source : **Spotify** ou **MusicBrainz**
- Tapez le nom d'un artiste ou d'un album
- Cliquez sur un résultat pour l'ajouter à la grille

### 2. Organiser la grille

- **Glissez-déposez** les albums pour les réorganiser
- Cliquez sur le **X** pour supprimer un album
- Utilisez **Ctrl+Z** / **Ctrl+Shift+Z** pour annuler/refaire

### 3. Personnaliser

Ouvrez les paramètres pour ajuster :

| Option | Description |
|--------|-------------|
| Format | Dimensions du poster (IKEA 50x70, A4, Carré vinyle...) |
| Colonnes | Nombre de colonnes (1-10) |
| Espacement | Écart entre les albums (0-100px) |
| Padding | Marge autour de la grille (0-200px) |
| Fond | Couleur de fond du poster |
| Bordures | Arrondi des coins des pochettes |

### 4. Exporter

- Cliquez sur **Exporter**
- Choisissez le format (PNG, JPEG, WebP)
- Sélectionnez l'échelle (1x, 2x, 3x)
- Téléchargez votre mosaïque haute résolution

## Formats d'impression disponibles

### Petits formats
| Format | Dimensions | Résolution (300 DPI) |
|--------|------------|---------------------|
| Photo Standard | 10 × 15 cm | 1181 × 1772 px |
| Portrait Standard | 13 × 18 cm | 1535 × 2126 px |

### Formats moyens
| Format | Dimensions | Résolution (300 DPI) |
|--------|------------|---------------------|
| A4 / Lettre | 21 × 30 cm | 2480 × 3543 px |
| Format Art | 30 × 40 cm | 3543 × 4724 px |
| A3+ | 40 × 50 cm | 4724 × 5906 px |

### Grands formats
| Format | Dimensions | Résolution (300 DPI) |
|--------|------------|---------------------|
| IKEA Standard | 50 × 70 cm | 5906 × 8268 px |
| Poster Cinéma | 61 × 91 cm | 7205 × 10748 px |

### Formats carrés
| Format | Dimensions | Résolution (300 DPI) |
|--------|------------|---------------------|
| Petit Carré (RIBBA) | 23 × 23 cm | 2717 × 2717 px |
| Carré Vinyle | 32 × 32 cm | 3780 × 3780 px |
| Grand Carré | 50 × 50 cm | 5906 × 5906 px |

## Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl + Z` | Annuler |
| `Ctrl + Shift + Z` | Refaire |
| `?` | Afficher l'aide |

## Stack technique

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **UI** : [React 19](https://react.dev/) + [Tailwind CSS 4](https://tailwindcss.com/)
- **Composants** : [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **State** : [Zustand](https://zustand-demo.pmnd.rs/) + [Zundo](https://github.com/charkour/zundo) (undo/redo)
- **Drag & Drop** : [dnd-kit](https://dndkit.com/)
- **Export** : [html2canvas](https://html2canvas.hertzen.com/)
- **Validation** : [Zod](https://zod.dev/)

## APIs utilisées

- **[Spotify Web API](https://developer.spotify.com/documentation/web-api)** : Recherche d'albums avec pochettes haute résolution
- **[MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API)** : Base de données musicale ouverte
- **[Cover Art Archive](https://coverartarchive.org/)** : Pochettes d'albums pour MusicBrainz

## Scripts

```bash
npm run dev      # Serveur de développement (port 3005)
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Linting ESLint
```

## Structure du projet

```
album-grid/
├── app/                    # Next.js App Router
│   ├── api/               # Routes API
│   │   ├── albums/search/ # Endpoint de recherche unifié
│   │   ├── spotify/       # API Spotify
│   │   └── musicbrainz/   # API MusicBrainz
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   ├── GridEditor.tsx    # Éditeur de grille (drag & drop)
│   ├── AlbumSearch.tsx   # Recherche d'albums
│   └── ExportDialog.tsx  # Dialog d'export
├── hooks/                 # Custom hooks
├── lib/                   # Utilitaires et stores
│   ├── api/              # Clients API
│   └── stores/           # Zustand stores
├── types/                 # Types TypeScript
└── public/               # Assets statiques
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT

---

Fait avec ❤️ par [Aurélien Gremy](https://github.com/aureliengremy)
