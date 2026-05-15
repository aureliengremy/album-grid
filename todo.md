# TODO - AlbumGrid

## Fait

- [x] Recherche d'albums MusicBrainz (API publique, sans clé)
- [x] Recherche d'albums Spotify (routes + client + clés `.env`)
- [x] Grille drag & drop, formats d'impression, undo/redo, export HD
- [x] Sauvegarde automatique dans le navigateur (localStorage)
- [x] Fichier `.env.example`

## En cours — Comptes utilisateurs & persistance (Neon)

- [ ] Fondation DB : Drizzle ORM + Neon (schéma, client, migrations)
- [ ] Auth : Better Auth (email + mot de passe), modale connexion/inscription
- [ ] CRUD projets : sauvegarder/charger/renommer/supprimer en base
- [ ] Autosave débouncé du projet courant
- [ ] Partage : lien public en lecture seule + page `/share/[slug]`
- [ ] Import de la grille localStorage à la première connexion

## Plus tard

- [ ] OAuth (Google / Spotify) en complément de l'email/mot de passe
- [ ] Rate-limiting persistant (Upstash Redis) pour les routes API
