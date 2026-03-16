# Beginner's Guide to Raphael Frame Society

This guide explains how this project works so you can understand and change it. It assumes you know a little JavaScript and HTML. No prior Angular or Node experience required.

---

## What Is This Project?

- **Frontend (Angular)**: The website you see in the browser. It shows the store, cart, checkout, login, and admin area.
- **Backend (Node.js + Express)**: A server that stores data (MySQL) and exposes **API endpoints**. The frontend calls these endpoints to get products, add to cart, log in, etc.

They run separately: the Angular app often on `http://localhost:4200`, the API on `http://localhost:3000`. The frontend knows the API address from **environment files** (`apiBaseUrl`).

---

## Project Structure (High Level)

```
Raphael-Frame-Society/
├── backend/           ← Node.js API (Express + MySQL)
│   ├── index.js       ← Entry point: starts server, mounts routes
│   ├── db.js          ← Database connection
│   ├── middleware/    ← Auth: check JWT, allow only admin
│   ├── routes/        ← One file per area: auth, products, cart, etc.
│   └── schema.sql     ← Tables to create in MySQL
├── src/               ← Angular app
│   ├── app/
│   │   ├── core/      ← Services, models, interceptors, constants
│   │   ├── features/  ← Pages: home, product, cart, checkout, auth, admin
│   │   ├── shared/    ← Nav (used on every page)
│   │   ├── guards/    ← Who can open which route (e.g. admin only)
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   └── environments/  ← apiBaseUrl for dev and prod
└── BEGINNER_GUIDE.md  ← This file
```

---

## How the Frontend Talks to the Backend

1. **Base URL**  
   In `src/environments/environment.ts` you have:
   ```ts
   apiBaseUrl: 'http://localhost:3000/api'
   ```
   Every API call starts with this. For production you change it in `environment.prod.ts`.

2. **Services make HTTP requests**  
   Example: `ProductsService` does:
   ```ts
   this.http.get<Product[]>(`${environment.apiBaseUrl}/products`)
   ```
   That sends `GET http://localhost:3000/api/products` and gets back a list of products.

3. **Auth: token on every request**  
   When you log in, the backend returns a **JWT token**. The frontend saves it in `localStorage`. The **ApiInterceptor** adds it to every request:
   ```
   Authorization: Bearer <token>
   ```
   So the backend knows who is logged in (and if they are admin).

---

## Backend (Node.js) – Step by Step

### Entry point: `backend/index.js`

- Loads `.env` (database and optional `JWT_SECRET`).
- Creates an Express app.
- Uses **cors** so the Angular app (different port) can call the API.
- Uses **express.json()** so it can read JSON in the body (e.g. `{ "email", "password" }`).
- Mounts all route files under `/api` (e.g. `GET /api/products`).

### Database: `backend/db.js`

- Uses `mysql2/promise` so you can `await db.query(...)`.
- Creates a **pool**: one set of connections shared by all routes (efficient).
- Reads host, user, password, database from `process.env` (from `.env`).

### Routes: `backend/routes/*.js`

Each file defines a **router** and exports it. Example pattern:

```js
const express = require('express');
const db = require('../db');
const router = express.Router();

// GET /api/products  (because index.js mounts this router at /api)
router.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

- **req**: request (query, body, headers).
- **res**: response. Use `res.json(...)` to send JSON, `res.status(400)` for errors.

### Auth: `backend/routes/auth.js`

- **Register**: hash password with **bcrypt**, insert user, then create a **JWT** with `jwt.sign()` and return `{ token, user }`.
- **Login**: find user by email, compare password with `bcrypt.compare`, then same: return `{ token, user }`.

Passwords are never stored in plain text; only the hash is in the database.

### Protecting routes: `backend/middleware/auth.js`

- **authMiddleware**: reads `Authorization: Bearer <token>`, verifies the JWT, and puts `req.user` (id, email, role). If no/invalid token, returns 401.
- **adminOnly**: use after authMiddleware; if `req.user.role !== 'admin'` returns 403.

In `routes/products.js`, create/update/delete product use:

```js
router.post('/products', authMiddleware, adminOnly, async (req, res) => { ... });
```

So only logged-in admins can create products.

---

## Frontend (Angular) – Step by Step

### Environment: `src/environments/environment.ts`

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
};
```

Services import this and use `environment.apiBaseUrl` for every API call. Change this (or the prod file) when you deploy.

### Services: `src/app/core/services/*.ts`

Services are classes that talk to the API. They are **injectable**: other parts of the app (e.g. components) get them via the constructor.

Example: **ProductsService**

```ts
@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiBaseUrl}/products`);
  }
}
```

- `providedIn: 'root'` means one shared instance for the whole app.
- `HttpClient` is Angular’s way to do HTTP (get, post, put, delete).
- It returns an **Observable**: the component will **subscribe** to get the data when it arrives.

Example use in a component:

```ts
this.productsService.getProducts().subscribe(products => this.products = products);
```

### Models: `src/app/core/models/*.ts`

Simple TypeScript **interfaces** that describe the shape of data from the API. Example:

```ts
// product.model.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string | null;
  // ...
}
```

This doesn’t add runtime code; it helps TypeScript and your editor know what fields exist.

### Interceptor: `src/app/core/interceptors/api.interceptor.ts`

Runs **before every HTTP request**. It reads the token from `localStorage` and adds the header:

```
Authorization: Bearer <token>
```

So you don’t have to add it in each service; the backend always gets the token when the user is logged in.

### Routing: `src/app/app-routing.module.ts`

Defines which URL path shows which component:

```ts
{ path: 'store', component: HomeComponent },
{ path: 'store/product/:id', component: ProductComponent },
{ path: 'login', component: LoginComponent },
{ path: 'admin/products', component: AdminProductsComponent, canActivate: [AdminGuard] },
```

- **path**: URL (e.g. `/store`, `/store/product/1`).
- **component**: the page to show.
- **canActivate**: **Guards** run first; e.g. AdminGuard only allows admins, otherwise redirects.

### Guards: `src/app/guards/*.ts`

- **AuthGuard**: if the user is not logged in, redirect to `/login`.
- **AdminGuard**: if not logged in, redirect to login; if logged in but not admin, redirect to `/store`.

They use **AuthService** (e.g. `isLoggedIn()`, `isAdmin()`).

### Components (features)

Each feature (home, product, cart, checkout, login, register, admin) has:

- A **component class** (`.ts`): data and methods, calls services.
- A **template** (`.html`): what the user sees, with bindings like `*ngFor`, `(click)`, `[routerLink]`.

Example idea: **CartComponent** gets the cart from **CartService** (which calls `GET /api/cart` with the session id). The template shows the list and buttons to update quantity or remove; those call `cartService.updateItem()` or `removeItem()`, which hit the API and then refresh the cart.

---

## Key Concepts in One Place

| Term | Meaning |
|------|--------|
| **API** | Endpoints the backend exposes (e.g. GET /api/products). The frontend calls them with HTTP. |
| **REST** | Style of API: GET = read, POST = create, PUT = update, DELETE = delete. We use it loosely here. |
| **JWT** | JSON Web Token. A string the server creates after login; the client sends it on each request so the server knows who the user is. |
| **Observable** | Angular/React-style “stream” of one or more values. You **subscribe** to get the value (e.g. list of products). |
| **Service** | Class that holds logic and API calls. Injected into components. |
| **Guard** | Function that runs before a route loads; can block or redirect (e.g. admin only). |
| **Interceptor** | Code that runs for every HTTP request/response (we use it to add the auth token). |

---

## Similar Examples (How to Add Things)

### Add a new API endpoint (backend)

1. Open the right route file (e.g. `backend/routes/products.js`).
2. Add a new route, e.g.:
   ```js
   router.get('/products/featured', async (req, res) => {
     try {
       const [rows] = await db.query('SELECT * FROM products WHERE tags LIKE ?', ['%"BESTSELLER"%']);
       res.json(rows);
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   });
   ```
3. The frontend can then call `GET /api/products/featured`.

### Call the new endpoint from the frontend

1. In the right service (e.g. `ProductsService`), add a method:
   ```ts
   getFeatured(): Observable<Product[]> {
     return this.http.get<Product[]>(`${environment.apiBaseUrl}/products/featured`);
   }
   ```
2. In a component, inject the service and subscribe:
   ```ts
   this.productsService.getFeatured().subscribe(list => this.featured = list);
   ```

### Add a new page (frontend)

1. Create a component (e.g. `ng generate component features/my-page` or add files by hand under `features/my-page`).
2. In `app-routing.module.ts`, add a route:
   ```ts
   { path: 'my-page', component: MyPageComponent }
   ```
3. Link to it somewhere: `<a routerLink="/my-page">My Page</a>`.

### Add a protected route (only logged-in users)

Use **AuthGuard**:

```ts
{ path: 'my-page', component: MyPageComponent, canActivate: [AuthGuard] }
```

Only logged-in users can open `/my-page`; others are sent to login.

---

## How to Run and Test

1. **Database**  
   Create a MySQL database and run `backend/schema.sql` (creates tables). If the `users` table already exists, add the password column:
   ```sql
   ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
   ```

2. **Backend**  
   In `backend/` create a `.env` with:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=raphael_frame_society
   ```
   Optional: `JWT_SECRET=some-long-secret-string` (use a strong one in production).  
   Then:
   ```bash
   cd backend && npm install && npm start
   ```
   API runs at `http://localhost:3000`.

3. **Frontend**  
   In the project root:
   ```bash
   npm install && npm start
   ```
   (or `ng serve`). App runs at `http://localhost:4200`. It will call `http://localhost:3000/api` (from `environment.apiBaseUrl`).

4. **Postman**  
   Import `backend/postman/Raphael-Frame-Society-API.postman_collection.json`. You can test health, auth (register/login), products, cart, orders, payments. Set `baseUrl` to `http://localhost:3000` and, after login, set `authToken` if you use it in other requests.

---

## File Checklist (What Does What)

**Backend**

| File | Purpose |
|------|--------|
| `index.js` | Starts server, enables CORS and JSON, mounts all routes under `/api` |
| `db.js` | MySQL connection pool from `.env` |
| `middleware/auth.js` | Check JWT (authMiddleware), allow only admin (adminOnly) |
| `routes/health.js` | GET /api/health |
| `routes/auth.js` | POST /api/auth/register, POST /api/auth/login |
| `routes/users.js` | POST /api/users, GET /api/users/me, GET /api/users/check-role |
| `routes/products.js` | CRUD products; create/update/delete require admin |
| `routes/categories.js` | GET /api/categories |
| `routes/cart.js` | GET/POST/PUT/DELETE /api/cart (uses session id) |
| `routes/orders.js` | POST /api/orders, GET /api/orders/:id |
| `routes/payments.js` | POST /api/payments (demo), GET /api/payments/order/:id |
| `routes/suggestions.js` | POST /api/suggestions |
| `routes/newsletter.js` | POST /api/newsletter |
| `schema.sql` | MySQL table definitions |

**Frontend**

| File / folder | Purpose |
|---------------|--------|
| `environments/environment.ts` | apiBaseUrl for development |
| `environments/environment.prod.ts` | apiBaseUrl for production build |
| `core/constants/storage-keys.ts` | localStorage key names |
| `core/models/*.ts` | TypeScript types for API data |
| `core/services/auth.service.ts` | Login, register, logout, current user, isAdmin |
| `core/services/products.service.ts` | getProducts, getProduct(id) |
| `core/services/categories.service.ts` | getCategories |
| `core/services/cart.service.ts` | getCart, addItem, updateItem, removeItem |
| `core/services/orders.service.ts` | createOrder, getOrder(id) |
| `core/services/payment.service.ts` | pay(payload) |
| `core/interceptors/api.interceptor.ts` | Add Authorization header to every request |
| `guards/auth.guard.ts` | Allow route only if logged in |
| `guards/admin.guard.ts` | Allow route only if admin |
| `app-routing.module.ts` | Path → component and guards |
| `app.module.ts` | Declares components, imports modules, registers interceptor |
| `features/home/*` | Store: product list, filters, sort |
| `features/product/*` | Product detail, add to cart |
| `features/cart/*` | Cart list, update, remove, go to checkout |
| `features/checkout/*` | Form + order summary, create order, pay, success message |
| `features/auth/login/*` | Login form |
| `features/auth/register/*` | Register form |
| `features/admin/admin-products/*` | Admin product management (placeholder) |
| `shared/nav/*` | Top bar: logo, links, login/register or user, cart count |

---

## Summary

- **Backend**: Express routes under `/api`, MySQL via `db.js`, JWT for auth, middleware to protect admin routes.
- **Frontend**: Angular app; services call `environment.apiBaseUrl` + endpoint; interceptor adds the token; guards protect routes; components use services and templates to show UI.

Changing the API URL is done in **environment files**. Adding an endpoint means adding a route in the right `backend/routes/*.js` file and, if needed, a method in a frontend service and a call in a component. This guide and the comments in the code should be enough to keep everything beginner-friendly as you extend the project.
