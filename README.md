# AlbumGrid

Createur de mosaiques d'albums musicaux pour impression. Recherchez vos albums preferes, arrangez-les dans une grille et exportez en haute resolution pour l'impression.

## Fonctionnalites

- **Recherche d'albums** via Spotify et MusicBrainz
- **Drag & Drop** pour reorganiser les albums
- **Formats de portrait** predefinies (IKEA, A4, carres, etc.)
- **Calcul automatique** du nombre d'albums necessaires selon le format et les colonnes
- **Personnalisation** : colonnes, gap, padding, couleur de fond, border radius
- **Labels optionnels** avec position et couleur configurables
- **Export haute resolution** (PNG, JPEG, WebP) avec echelle configurable
- **Undo/Redo** pour annuler les modifications
- **Persistance locale** des albums et parametres

## Formats disponibles

| Categorie | Formats |
|-----------|---------|
| Carres | 23x23, 32x32, 50x50 cm |
| Petits | 10x15, 13x18 cm |
| Moyens | 21x30 (A4), 30x40, 40x50 cm |
| Grands | 50x70 (IKEA), 61x91 cm |

## Stack technique

- **Framework** : Next.js 16 (App Router, Turbopack)
- **UI** : React 19, Tailwind CSS 4, shadcn/ui
- **State** : Zustand + zundo (undo/redo)
- **Drag & Drop** : dnd-kit
- **Export** : html2canvas

## Installation

```bash
npm install
```

## Developpement

```bash
npm run dev
```

Ouvrir [http://localhost:3005](http://localhost:3005)

## Build

```bash
npm run build
npm start
```

## Structure du projet

```
app/
  page.tsx              # Page principale
  api/
    albums/search/      # API unifiee de recherche
    spotify/search/     # API Spotify
    musicbrainz/search/ # API MusicBrainz

components/
  GridEditor.tsx        # Editeur de grille principal
  SortableAlbum.tsx     # Album draggable
  AlbumSearch.tsx       # Recherche d'albums
  LibrarySidebar.tsx    # Sidebar de recherche
  AlbumsListSidebar.tsx # Liste des albums selectionnes
  InspectorSidebar.tsx  # Parametres de la grille
  ExportDialog.tsx      # Dialog d'export

lib/stores/
  album-store.ts        # State des albums et parametres
  ui-store.ts           # State de l'interface

types/
  index.ts              # Types et formats de portrait
```

## Utilisation

1. **Choisir un format** dans les parametres (icone engrenage)
2. **Ajuster les colonnes** - le nombre de rangees et d'albums necessaires s'affiche automatiquement
3. **Rechercher des albums** (icone recherche) via Spotify ou MusicBrainz
4. **Ajouter des albums** en cliquant sur le bouton +
5. **Reorganiser** par drag & drop
6. **Personnaliser** le gap, padding, couleur de fond
7. **Exporter** en haute resolution pour impression

## Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl+Z` | Annuler |
| `Ctrl+Shift+Z` | Retablir |
| `?` | Aide raccourcis |

## License

MIT
