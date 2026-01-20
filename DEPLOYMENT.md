# 🚀 Checklist de Déploiement

## Pré-déploiement

### Code
- [ ] Tous les fichiers TypeScript compilent (`npm run type-check`)
- [ ] Pas d'erreurs de linting
- [ ] Code testé localement en mode dev
- [ ] Pas de `console.log` de debug
- [ ] Pas de secrets dans le code

### Configuration
- [ ] Fichier `.env` avec les bonnes valeurs (voir `.env.example`)
- [ ] `config.json` complètement rempli (pas de `YOUR_` restants)
- [ ] IDs de rôles et canaux corrects
- [ ] Au moins un domaine configuré

### Discord
- [ ] Bot invité sur le serveur
- [ ] Permissions correctes attribuées au bot
- [ ] Rôles "Helper" et "Admin" créés
- [ ] Canaux créés:
  - [ ] Canal principal (pour `/setup-ticket`)
  - [ ] Canal de logs (`#logs-tickets`)
  - [ ] Catégorie pour les tickets
- [ ] Intents activés:
  - [ ] SERVER MEMBERS INTENT
  - [ ] MESSAGE CONTENT INTENT

### Base de Données
- [ ] Dossier `data/` existe
- [ ] Permissions d'écriture sur le dossier
- [ ] Fichier `tickets.json` créé (automatiquement)

## Build & Test

### Compilation
```bash
npm run type-check  # ✅ Pas d'erreurs
npm run build       # ✅ Build réussit
npm run clean       # ✅ Nettoie les fichiers
```

### Test Locale
```bash
npm run dev  # ✅ Bot démarre sans erreurs
# Tester:
# - Bot se connecte
# - Commande /setup-ticket fonctionne
# - Bouton "Ouvrir un ticket" marche
# - Modal apparaît
# - Ticket se crée
# - Claim fonctionne
# - Fermeture génère les logs
```

## Déploiement

### Préparation
```bash
# 1. Vérifier la configuration
cat .env
cat config.json

# 2. Faire un backup
cp data/tickets.json backups/tickets_before_deploy.json

# 3. Build final
npm run rebuild  # clean + build

# 4. Vérifier les dépendances
npm install --production  # (optionnel, pour la prod)
```

### Lancement en Production
```bash
NODE_ENV=production npm start
```

### Vérification Post-Déploiement

**Dans Discord:**
- [ ] Bot est online
- [ ] Status du bot est visible
- [ ] Commande `/setup-ticket` disponible
- [ ] Bouton fonctionne
- [ ] Modal fonctionne
- [ ] Ticket se crée correctement
- [ ] Helper peut prendre en charge
- [ ] Fermeture génère les logs

**Logs du Bot:**
```
✅ Bot connecté en tant que SilverBot#1234
📊 Nombre de serveurs: 1
```

### Monitoring Continu

**Vérifier régulièrement:**
- Logs du bot pour les erreurs
- Tickets en cours (via `data/tickets.json`)
- Performance du bot
- Utilisation mémoire

**Redémarrage si nécessaire:**
```bash
# Arrêter le bot
kill <pid>

# Redémarrer
NODE_ENV=production npm start
```

## Troubleshooting Déploiement

### Le bot ne démarre pas
1. Vérifier les logs d'erreur
2. Vérifier le token Discord
3. Vérifier les permissions
4. Redémarrer le processus

### Les commandes n'apparaissent pas
1. Vérifier GUILD_ID
2. Attendre 1-2 minutes
3. Redémarrer Discord client
4. Vérifier les permissions du bot

### Les tickets ne se créent pas
1. Vérifier la catégorie existe
2. Vérifier les permissions du bot
3. Vérifier les logs pour les erreurs
4. Relancer le bot

### Erreur "Channel not found"
1. Vérifier que les IDs dans `config.json` sont corrects
2. Vérifier que les canaux existent
3. Vérifier les permissions du bot

## Rollback

Si quelque chose ne fonctionne pas:

1. Restaurer la base de données:
```bash
cp backups/tickets_before_deploy.json data/tickets.json
```

2. Redémarrer le bot:
```bash
npm run dev  # Mode dev pour tester
```

3. Vérifier les logs pour les erreurs

## Optimisations Post-Déploiement

### Performance
- [ ] Vérifier la latence du bot
- [ ] Monitorer l'usage mémoire
- [ ] Vérifier les temps de réponse

### Sécurité
- [ ] Vérifier les permissions minimales
- [ ] Vérifier pas de secrets exposés
- [ ] Faire une rotation du token si nécessaire

### Maintenance
- [ ] Mettre à jour discord.js si nécessaire
- [ ] Mettre à jour Node.js si nécessaire
- [ ] Archiver les vieux logs

## Documentation Post-Déploiement

- [ ] Documenter la configuration finale
- [ ] Créer un guide pour les administrateurs
- [ ] Créer un guide pour les utilisateurs
- [ ] Documenter les procedures de maintenance

---

**Date de déploiement:** _______________  
**Version:** 1.0.0  
**Déployé par:** _______________  
**Problèmes rencontrés:** _______________  

**Signature:** _______________ Date: _______________
