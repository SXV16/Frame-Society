raphael-frame-society/
│
├── e2e/
│
├── node_modules/
│
├── src/
│   ├── app/
│   │   │
│   │   ├── core/                         # Singleton services, guards, interceptors
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── age-verification.service.ts
│   │   │   │   ├── wishlist.service.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   ├── newsletter.service.ts
│   │   │   │   ├── suggestion.service.ts
│   │   │   │   └── payment.service.ts
│   │   │   │
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── adult-content.guard.ts
│   │   │   │   └── admin.guard.ts
│   │   │   │
│   │   │   ├── interceptors/
│   │   │   │   └── token.interceptor.ts
│   │   │   │
│   │   │   └── core.module.ts
│   │   │
│   │   ├── shared/                       # Reusable components, pipes, directives
│   │   │   ├── components/
│   │   │   │   ├── navbar/
│   │   │   │   ├── footer/
│   │   │   │   ├── suggestion-box/
│   │   │   │   ├── newsletter/
│   │   │   │   ├── genre-card/
│   │   │   │   └── blurred-background/
│   │   │   │
│   │   │   ├── pipes/
│   │   │   ├── directives/
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── features/
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   ├── home.component.scss
│   │   │   │   └── home.module.ts
│   │   │   │
│   │   │   ├── genres/
│   │   │   │   ├── anime/
│   │   │   │   ├── manga/
│   │   │   │   ├── movies/
│   │   │   │   ├── movie-series/
│   │   │   │   ├── gaming/
│   │   │   │   └── genres.module.ts
│   │   │   │
│   │   │   ├── adult/
│   │   │   │   ├── bl/
│   │   │   │   ├── gl/
│   │   │   │   ├── adult.component.ts
│   │   │   │   ├── id-verification.component.ts
│   │   │   │   └── adult.module.ts
│   │   │   │
│   │   │   ├── wishlist/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   │   ├── delivery/
│   │   │   │   ├── payment/
│   │   │   │   └── checkout.module.ts
│   │   │   │
│   │   │   ├── contact/
│   │   │   └── admin/
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.module.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   └── website-logo.png        # Blurred background logo
│   │   ├── fonts/
│   │   │   ├── bebas-neue/
│   │   │   ├── impact/
│   │   │   ├── lobster/
│   │   │   └── anime-horror-fonts/
│   │   └── icons/
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss                      # Global purple/gold theme
│   └── polyfills.ts
│
├── angular.json
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
