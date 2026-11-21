# MAC FOR CREATORS

Cagnotte PayPal uniquement — objectif : 400 €.

## Configuration avant les paiements
1. Dans `index.html`, remplacer `YOUR_PAYPAL_LIVE_CLIENT_ID` par le Client ID public LIVE de l'application PayPal.
2. Déployer `worker.js` comme Cloudflare Worker.
3. Dans Cloudflare > Worker > Settings > Variables and Secrets, ajouter :
   - `PAYPAL_CLIENT_ID` : Client ID LIVE.
   - `PAYPAL_CLIENT_SECRET` : Secret LIVE, de type Secret (jamais dans GitHub).
   - `PAYPAL_MODE` : `live` pour les vrais paiements ou `sandbox` pour les tests.
4. Créer un namespace Cloudflare KV et le lier au Worker sous le nom exact `DONATIONS`.
5. Dans `script.js`, remplacer l'URL factice par l'URL réelle du Worker.
6. Activer GitHub Pages sur la branche `main`, dossier `/ (root)`.

Le Worker n'accepte que l'origine `https://vicemeair.github.io`. Si le site utilise un autre domaine, adapter la vérification d'origine dans `worker.js`.

**Sécurité :** ne jamais publier le Secret PayPal dans le dépôt ou le transmettre dans une conversation. Si le créateur est mineur, le compte PayPal destinataire et la collecte doivent être gérés par un parent ou représentant légal. PayPal décide si le paiement par carte sans compte PayPal est proposé : ce n'est pas garanti pour tous les comptes ou pays.

Le total est calculé à partir des paiements capturés et enregistrés dans le KV. Aucune donnée de carte bancaire n'est enregistrée sur le site.