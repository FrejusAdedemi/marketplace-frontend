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

---

## Contributions — Laura (Marketplace B3 Keyce)

> Framework de test réel : **Vitest 4.x** (et non Karma comme indiqué dans le scaffold Angular CLI par défaut).

| Feature | Branche | Fichiers clés |
|---|---|---|
| **Navbar globale** (menu par rôle) | `feat/navbar-role` | `src/app/components/navbar/` · `navbar.spec.ts` |
| **Footer global** | `feat/footer` | `src/app/components/footer/` |
| **Pages admin** (gestion utilisateurs + rôles) | `feat/admin-users` | `src/app/pages/admin/users/` · `src/app/services/admin.service.ts` · `src/app/guards/role-guard.ts` |
| **Notifications WebSocket** temps réel | `feat/ws-notifications` | `src/app/services/websocket.service.ts` · `src/app/components/notifications/` |

### Infrastructure partagée (branche `global-components`)

- `src/app/models/user.model.ts` — `UserRole`, `UserInfo`, `UserRecord`
- `src/app/models/ws-event.model.ts` — union discriminée `WsEvent` (6 types, contrat §10.2)
- `src/styles.scss` — variables CSS thème vert (`--color-primary`, etc.)
- `src/app/services/auth.ts` — enrichi : décodage JWT, signal `currentUser`, méthode `getRole()`

### Choix techniques notables

- **WebSocket dual-connexion** : le relay gateway requiert `?service=orders|stocks` ; deux connexions ouvertes (`orders` pour tous les authentifiés, `stocks` uniquement pour `store_manager` et `admin`).
- **Reconnexion exponentielle** : 1 s → 2 s → 4 s … max 30 s ; pas de reconnect sur codes `4001` (token révoqué), `4004` (service inconnu), `1000` (fermeture normale).
- **Signal `currentUser`** dans `AuthService` : la navbar et les notifications réagissent au login/logout sans polling.
