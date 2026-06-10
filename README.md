# MarketplaceFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Pages produits

> Note d'organisation : à la suite d'un problème technique ayant empêché l'un des participants de réaliser sa partie, ses tâches ont été réparties entre les autres membres de l'équipe. Les pages produits du frontend (accueil, catalogue, fiche produit, formulaire produit) ont été reprises dans ce cadre.

Le front consomme exclusivement le **product-service** via l'API Gateway (`http://localhost:8080`),
jamais directement un microservice.

### Ajouts

- **`src/app/models/product.model.ts`** : types `Product`, `ProductFilters`, `ProductListResult`,
  ainsi que `canManageProducts(role)` qui détermine si un rôle (`store_manager`/`admin`) peut
  créer/modifier/supprimer un produit.
- **`src/app/services/product.ts` (`ProductService`)** : appelle le gateway sur `/api/products`
  (GET liste avec `page`, `limit`, `category`, `search`, `sort`, GET détail, GET suggestions,
  POST/PUT/DELETE). Comme `auth.ts`, l'URL de base est codée en dur (pas d'`environment.ts` dans
  le projet) et reste sur `http://localhost:8080`, donc toujours via le gateway.
  - `getBestSellers()` : **TODO mock** — aucun endpoint "meilleures ventes" n'existe dans le
    contrat d'API ; approximé par `sort=created_at_desc` en attendant un futur endpoint dédié.
  - `getSponsoredProducts()` : **TODO mock** — la liste `/api/products` n'expose pas de filtre
    "sponsorisé" ; on récupère un lot de produits récents et on filtre côté front sur
    `is_sponsored`.
- **`src/app/shared/product-card/`** : carte produit réutilisable (image, catégorie, nom, prix en
  €) utilisée sur l'accueil, le catalogue et les suggestions de la fiche produit.
- **Page Accueil (`src/app/pages/home`, route `/home`)** : section "Produits sponsorisés" et
  section "Meilleures ventes", chacune avec ses états chargement / erreur / vide.
- **Page Catalogue (`src/app/pages/catalog`, route `/products`)** : recherche full-text
  (debounce), filtre catégorie, filtre prix min/max (appliqué côté front, l'API ne proposant pas
  de paramètre de plage de prix), tri (`price_asc` / `price_desc` / `created_at_desc`) et
  pagination.
- **Page Fiche produit (`src/app/pages/product-detail`, route `/products/:id`)** : détail complet
  du produit + section "Produits similaires" (suggestions de la même catégorie). Pour les
  utilisateurs `store_manager`/`admin`, affiche des boutons "Modifier" et "Supprimer".
- **Formulaire produit (`src/app/pages/product-form`, routes `/products/new` et
  `/products/:id/edit`)** : création et modification, réservé aux rôles `store_manager`/`admin`.
- **Navigation (`app.html`/`app.ts`)** : ajout des liens Accueil / Catalogue / "Ajouter un
  produit" (selon rôle), et redirection par défaut (`''` et `**`) vers `/home` au lieu de
  `/login`, le catalogue étant consultable sans connexion.
- **Thème** : variables CSS vertes ajoutées dans `src/styles.scss` (couleur dominante verte,
  cartes, boutons, états de chargement/erreur/vide partagés par les pages produits).
- **Devise** : locale `fr-FR` enregistrée dans `app.config.ts` pour que `currency:'EUR'` affiche
  les prix au format français (`19,99 €`).

### Socle réutilisé tel quel (non modifié)

- Intercepteur JWT (`interceptors/auth-interceptor.ts`)
- Guard d'authentification (`guards/auth-guard.ts`), appliqué aux routes
  `/products/new` et `/products/:id/edit`
- `AuthService.getMe()` (`services/auth.ts`), utilisé en lecture seule pour récupérer le rôle de
  l'utilisateur connecté

### Points signalés (hors périmètre, non implémentés)

- **`environment.ts`** : n'existe pas dans le projet. La base URL du gateway reste donc en dur
  (`http://localhost:8080`), comme c'était déjà le cas dans `auth.ts`. À centraliser dans un futur
  `environment.ts` commun.
- **Guard de rôle** : aucun `roleGuard` n'existe dans `guards/`. La restriction
  `store_manager`/`admin` sur le formulaire produit est donc faite au niveau du composant
  (`ProductForm`, via `AuthService.getMe().role` et `canManageProducts()`), avec affichage d'un
  message si l'accès est refusé. Un `roleGuard` partagé permettrait de factoriser cette logique au
  niveau du routeur.
