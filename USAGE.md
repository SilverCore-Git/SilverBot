# 📖 Guide d'Utilisation Complet

## 🎯 Commandes Disponibles

### Commandes Admin

#### `/setup-ticket`
Configure le système de tickets en envoyant un embed permanent avec un bouton.

**Utilisation:**
```
/setup-ticket
```

**Résultat:**
- Un embed "Système de Tickets" est envoyé dans le canal
- Un bouton "Ouvrir un Ticket" est ajouté
- Les utilisateurs peuvent cliquer dessus pour créer un ticket

**Permissions requises:**
- Rôle: Admin
- Permissions Discord: Gérer le serveur

---

## 👥 Flux Utilisateur

### 1. Créer un Ticket

**Étapes:**
1. Regarder le canal `#tickets` ou `#support`
2. Voir l'embed avec le bouton "🎫 Ouvrir un Ticket"
3. Cliquer sur le bouton

**Sélection du Domaine:**
- Un menu déroulant apparaît
- Choisir parmi les options:
  - 🔧 Technique - Problèmes techniques
  - 🛟 Support - Questions générales
  - 👮 Modération - Problèmes de modération
  - ❓ Autre - Autres sujets

**Formulaire du Ticket:**
- Un formulaire modal s'ouvre
- Remplir le champ "Raison du ticket"
- Minimum 10 caractères, maximum 1000
- Appuyer sur "Soumettre"

**Résultat:**
- Un nouveau salon privé `ticket-[domaine]-[id]` est créé
- Visible uniquement par:
  - L'auteur du ticket
  - Le rôle "Helper"
- Un message d'information apparaît avec:
  - ID du ticket
  - Auteur
  - Domaine
  - Raison
  - Statut

### 2. Attendre un Helper

**Information:**
- Le ticket passe en statut "open"
- Les helpers sont notifiés
- Vous attendez qu'un helper prenne le ticket en charge

**Conseils:**
- Rester dans le canal du ticket
- Répondre aux questions du helper rapidement
- Être respectueux

### 3. Résolution du Problème

**Interactions:**
- Le helper peut poser des questions
- Vous répondez dans le canal du ticket
- Le helper guide la résolution

**Si résolu:**
- Demander au helper de fermer le ticket

**Si non résolu:**
- Informer le helper
- Continuer la discussion
- Un autre helper peut prendre le relais

---

## 👨‍🔧 Flux Helper

### 1. Prendre un Ticket en Charge

**Étapes:**
1. Aller dans le canal du ticket (visible pour les helpers)
2. Lire les informations et la raison
3. Cliquer sur le bouton "👤 Prendre en Charge"

**Résultat:**
- Le ticket passe en statut "claimed"
- Vous êtes assigné comme helper
- Le salon est renommé: `[votre_nom]-[domaine]-[id]`
- Un message confirme votre assignation

### 2. Aider le Client

**Actions:**
- Discuter avec le client dans le canal
- Poser des questions de diagnostic
- Fournir des solutions
- Guider l'utilisateur

**Bonnes Pratiques:**
- Être courtois et patient
- Utiliser des messages clairs
- Copier-coller les solutions quand nécessaire
- Prendre son temps

### 3. Fermer le Ticket

**Étapes:**
1. Vérifier que le problème est résolu
2. Cliquer sur le bouton "🔒 Fermer le Ticket"
3. Le canal se ferme automatiquement

**Résultat:**
- Le salon est supprimé
- Une transcription est générée
- Les logs sont envoyés au canal `#logs-tickets`
- Le fichier de transcription est attaché

---

## 📊 Consulter les Logs

### Canal des Logs

**Location:** `#logs-tickets`

**Contenu pour chaque ticket fermé:**
- Titre: "🔒 Ticket Fermé"
- ID du ticket
- Auteur (mention)
- Domaine du problème
- Raison initiale
- Helper assigné (mention)
- Date de création
- Date de fermeture
- **Fichier de transcription** (attachment)

**Accès:**
- Administrateurs uniquement
- Archive permanente

### Fichier de Transcription

**Format:** Texte brut (`.txt`)

**Contenu:**
```
[19/01/2026 14:30:45] Jean_Dupont: Bonjour, mon bot ne démarre pas
[19/01/2026 14:31:02] Helper_Bot: Bonjour! Avez-vous une erreur?
[19/01/2026 14:31:15] Jean_Dupont: Oui, erreur "Cannot find module"
[19/01/2026 14:31:45] Helper_Bot: Avez-vous lancé npm install?
...
```

**Utilisation:**
- Archivage
- Référence future
- Support aux autres utilisateurs

---

## 🎓 Tutoriels par Cas d'Usage

### Cas 1: Problème Technique Simple

**Scénario:** L'utilisateur n'arrive pas à installer discord.js

**Flux:**
1. ✅ Utilisateur crée un ticket (Domaine: Technique)
2. ✅ Helper prend en charge
3. ✅ Helper guide la solution:
   ```
   1. Ouvrir un terminal dans votre projet
   2. Taper: npm install discord.js
   3. Attendre la fin de l'installation
   4. Tenter de relancer votre bot
   ```
4. ✅ Utilisateur confirme que ça marche
5. ✅ Helper ferme le ticket
6. ✅ Logs envoyés à `#logs-tickets`

### Cas 2: Question de Support

**Scénario:** L'utilisateur demande comment utiliser une fonctionnalité

**Flux:**
1. ✅ Utilisateur crée un ticket (Domaine: Support)
2. ✅ Helper prend en charge
3. ✅ Helper explique la fonctionnalité:
   ```
   Voici comment utiliser les slash commands:
   - Les slash commands sont des commandes qui commencent par /
   - Elles apparaissent quand vous tapez /
   - Cliquez sur la commande pour la sélectionner
   - Remplissez les paramètres
   - Appuyez sur Entrée
   ```
4. ✅ Utilisateur teste et ça fonctionne
5. ✅ Helper ferme le ticket

### Cas 3: Escalade (Plusieurs Helpers)

**Scénario:** Un problème nécessite plusieurs étapes et deux helpers

**Flux:**
1. ✅ Utilisateur crée un ticket
2. ✅ Helper 1 prend en charge
3. ✅ Helper 1 diagnostique le problème
4. ✅ Helper 1 commande: "🔒 Fermer le Ticket"
5. ✅ Helper 1 revient plus tard
6. ✅ Autre Helper 2 peut créer un nouveau ticket pour le suivi

**Note:** Ou Helper 1 peut rester pour continuer après une pause

---

## ⚙️ Paramètres et Personnalisation

### Changer les Domaines

**Pour les Administrateurs:**

Éditer `config.json`:
```json
"domains": [
  { "label": "Bug Report", "value": "bug" },
  { "label": "Feature Request", "value": "feature" },
  { "label": "Other", "value": "other" }
]
```

Redémarrer le bot.

### Modifier les Couleurs des Embeds

Éditer `config.json`:
```json
"colors": {
  "primary": "#5865F2",     // Bleu Discord (défaut)
  "success": "#57F287",     // Vert (défaut)
  "error": "#ED4245",       // Rouge (défaut)
  "warning": "#FEE75C"      // Jaune (défaut)
}
```

### Ajouter des Canaux Spécialisés

Pour différents types de support:

1. Créer plusieurs canaux: `#support-technique`, `#support-moderation`
2. Dans chacun, exécuter `/setup-ticket`
3. Les utilisateurs choisissent le canal approprié

---

## 🆘 Aide et Problèmes

### FAQ

**Q: Peut-on avoir plusieurs tickets ouvert?**
A: Oui, il n'y a pas de limite (configurable via `maxTicketsPerUser`)

**Q: Combien de temps un ticket reste ouvert?**
A: Aussi longtemps que nécessaire, jusqu'à sa fermeture

**Q: Peut-on archiver les tickets?**
A: Les logs sont stockés dans `#logs-tickets` automatiquement

**Q: Comment voir l'historique complet?**
A: Télécharger le fichier de transcription dans les logs

**Q: Peut-on modifier le texte d'un ticket?**
A: Non, les informations sont immuables (par design)

### Problèmes Courants

**Le bouton "Ouvrir un ticket" n'apparaît pas**
- Vérifier que `/setup-ticket` a été exécutée
- Attendre quelques secondes
- Actualiser Discord (F5)

**Je n'arrive pas à prendre un ticket**
- Vérifier que vous avez le rôle "Helper"
- Vérifier que le ticket n'est pas déjà pris
- Contacter un administrateur

**Le canal du ticket n'est pas supprimé**
- Les administrateurs du serveur peuvent le supprimer manuellement
- Vérifier que le bot a les permissions nécessaires

---

## 📝 Notes Importantes

- ✅ Les tickets sont sauvegardés dans `data/tickets.json`
- ✅ Les transcriptions sont attachées aux logs
- ✅ Les utilisateurs peuvent créer plusieurs tickets
- ✅ Les helpers reçoivent une notification du nouveau ticket
- ✅ Le système est complètement modulaire et personnalisable

---

Pour toute question, consultez le [README.md](README.md) ou le [SETUP.md](SETUP.md).

Besoin d'aide technique? Consultez le [DEVELOPMENT.md](DEVELOPMENT.md).
