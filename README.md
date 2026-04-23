# Carxell - Premium Car Showroom Experience Platform

Carxell is a full-stack, enterprise-grade Car Showroom Management and Analytics Web Application. Built under strict MVC guidelines, it acts as a central hub providing robust Customer Relationship Management (CRM) tools, highly-detailed vehicle inventory tracking, and dynamic visualization dashboards through `Recharts`. It replaces traditional dealership workflows with a sleek, fully digitized, and automated system.

## 🌟 Core Features

1. **Inventory Intelligence**:
   - Seamless CRUD (Create, Read, Update, Delete) operations over vehicle inventory.
   - Intelligent stock depletion. When a customer purchases a vehicle, inventory reacts dynamically.
   - Automated "Low Stock Alert System" indicating inventory falling below critical thresholds.
   - Client-side and database-level querying allowing pagination, specific search filtering (Brand, Category, Price ranges).

2. **Customer Behavior Tracking Analytics**:
   - **Event Driven Tracking**: The platform quietly records meaningful intent signals—such as what pages/vehicles a customer views and what test drives they book.
   - **High-Intent Lead Generation**: Carxell automatically classifies users that exhibit specific behavior (e.g., viewing a distinct vehicle multiple times combined with booking a test drive) as "High-Intent", passing those warm leads natively to the Sales dashboard.

3. **Booking and Payment Automation**:
   - Ensures no two test drives overlap logically (slot collision detection per vehicle).
   - Replicated Payment Gateway that manages mock payment clearance and logs `Orders` permanently tracking revenue.

4. **Dynamic Sales Dashboard**:
   - `Recharts` implementation maps total sales, revenue-over-time trajectories, and aggregates data via complex MongoDB aggregation pipelines directly in the browser—no external BI tools needed.

---

## 🔒 Role-Based Access Control (RBAC) Layer Structure

A rigorous internal middleware protects every data endpoint (`/middleware/authMiddleware.js`). Depending on what role a user assumes, they are strictly sandboxed into experiencing distinct applications wrapped into a single platform.

### 1. 👑 The Admin (Management)
*The overarching dealership owner and managerial structure.*
* **Data Access**: Has unrestricted access to practically everything.
* **Privileges**:
  * Create, update, modify, and delete the actual `Car` inventory.
  * Can register new `Salesperson` accounts explicitly through a protected `api/users` endpoint.
  * Has sole access to the **Executive Dashboard**, which parses all database `Orders` and `Events` into real-time visual graphs mapping Total Revenue, Units Sold, Top Performing Cars, and Categorical Recommendations.

### 2. 👔 The Salesperson (Operations)
*The boots-on-the-ground employees responsible for managing client relationships.*
* **Data Access**: High-level view of inventory and bookings, isolated from company-wide revenue aggregates.
* **Privileges**:
  * Has access to the **Sales Dashboard** allowing them to exclusively review upcoming, pending, and completed Test Drive Bookings.
  * Empowered to change Booking statuses (Accept, Cancel, Mark Complete).
  * Has read-access to the Low Stock Inventory Insight endpoints to know when to restock items.

### 3. 👤 The Customer (User)
*The general public looking to interact with the dealership natively.*
* **Data Access**: Completely restricted purely to their own operations.
* **Privileges**:
  * Unauthenticated viewers can only search the general inventory.
  * Once authenticated (via `Register`/`Login`), they gain access to the **Customer Dashboard**.
  * They can confidently request Test Drives (and are guaranteed safety from double booking slots).
  * Can complete "Direct Purchases" which process automated payments and register immediately as an `Order` for the Admins.
  * Can view historically recorded test drives and invoices/purchases.

---

## 🏗️ Technical Architecture & Paradigms

The project separates frontend interfaces and backend database/API routing into distinct microservices interacting over `Axios`.

### Backend (Node.js, Express, MongoDB)
* **JWT Authenticated Setup**: A secure HTTP abstraction that swaps raw string passwords with fully `Bcrypt`-hashed hashes securing user tables. Auth contexts are enforced via tokens holding User IDs.
* **Mongoose ODM Model Schema**:
   * **`User`**: Core identities, capturing role allocations and hashed credentials.
   * **`Car`**: Maps the dealership parameters (Brands, Stock counts, Categories, Price, Internal Specs).
   * **`Booking`**: Defines reserved timeslots linked to `Car_IDs` and `Customer_IDs`.
   * **`Order`**: A post-purchased immutable ledger item confirming payment and price data.
   * **`Event`**: An isolated event tracker maintaining a sequence dictionary (what user clicked what car, when).

### Frontend (React, Vite, Tailwind CSS)
* **Tailwind & Glassmorphism UI**: Eschewing default HTML, the entire interface is written via utility-class architecture. It uses "Glass-morphism" styling (backdrop blurs, translucent layers) mixed with a customized Dark Mode palette (`slate-900`) for a highly polished, aesthetic feeling.
* **React Router v7**: Complete Single Page Application (SPA) functionality handling protected routes (e.g., throwing unauthenticated customers back to `/login` if they try accessing `/dashboard`).

---

## 🚦 Getting Started & Installation

You need two console instances running concurrently to launch both sides of this web app.

### 1. Database Initialization (Backend)
Navigate into the `/backend` folder. Install dependencies, inject standard `Sample Data` (populating default Cars and an Admin account), and start the server.

```bash
cd backend
npm install
npm run seed  # Note: Wipes previously stored DB memory and pushes sample structures to MongoDB
npm run dev
```

*The Backend will typically run on `http://localhost:5000`.*

### 2. Client Startup (Frontend)
Open a totally separate terminal.

```bash
cd frontend
npm install
npm run dev
```

*Your interface will run on `http://localhost:5173`.*

### 3. Default Login Credentials
Provided by the `npm run seed` command, you can bootstrap your testing with these:

* **Admin Role**: `admin@carxell.com` | `123456`
* **Sales Role**: `sales@carxell.com` | `123456`
* **Customer Role**: `john@user.com` | `123456` (Or simply create your own using the Registration screen!)
