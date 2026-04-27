# Carxell - Premium multi-page Showroom management System

Carxell is a comprehensive, enterprise-grade Car Showroom Management and Analytics platform. Designed with a decoupled **MERN stack** (MongoDB, Express, React, Node.js), it offers a professional, multi-page web experience modeled after modern automotive dealership standards.

## 🌟 Major Highlights & Architecture

1.  **Multi-Page Routing Architecture**:
    *   Transitioned from a single-page modal structure to a robust dedicated routing system using `React Router`.
    *   Dedicated SEO-friendly routes for `/cars`, `/accessories`, `/service`, `/cart`, and `/test-drive`.

2.  **Premium Light UI (Maruti Suzuki Inspired)**:
    *   Clean, professional high-contrast interface leveraging **Vanilla CSS & Tailwind**.
    *   Dynamic Navbar with real-time cart badges and role-based dropdowns.
    *   Consistent branding across Home, Dashboard, and Detail pages.

3.  **Global Commerce & State Management**:
    *   **CartContext**: A centralized global state for managing vehicle and accessory purchases.
    *   **Local Persistence**: Automated localStorage integration ensures users never lose their cart contents on refresh.
    *   **Simulated Checkout**: A secure-themed payments gateway validating orders and updating inventory levels.

4.  **Advanced DB Ecosystem**:
    *   **Accessories Collection**: Categorized parts management (Interior, Exterior, Spare Parts).
    *   **Service Logging**: Dedicated booking system for vehicle maintenance with pick-and-drop logistics.
    *   **Event Behavior Tracking**: Analytics engine capturing Customer Intent (clicks, views, test-drives) to generate "High-Intent Lead" dashboards for management.

---

## 🔒 Role-Based Access Control (RBAC)

The platform dynamically adjusts functionality based on the authenticated user's role:

### 👑 The Admin (Executive Control)
*   **Inventory CRUD**: Full control to add images (manual URL or fallback), edit specs, or delete vehicles.
*   **Insights Dashboard**: Interactive `Recharts` visualizations for Total Revenue and Sales Trends.
*   **Lead Generation**: View "High-Intent Customers" identified by the activity tracking algorithm.
*   **Global Transaction History**: A complete audit log of all orders processed across the dealership.

### 👔 The Salesperson (Operations)
*   **Booking Management**: Review and update the status (Confirm/Complete/Cancel) of Test Drive requests.
*   **Inventory Awareness**: Full view of current Car stock and incoming Service requests.

### 👤 The Customer (User Experience)
*   **Unified Shopping**: Add Cars and Accessories to a centralized Cart.
*   **Personalization**: Manage a profile and track personal purchase history/test drive schedules.
*   **Direct Service Booking**: Request specialized maintenance (Oil change, Engine repair, etc.) through the digital portal.

---

## 🏗️ Technical Stack

*   **Frontend**: React 18, Vite (v5), Tailwind CSS, Lucide-React, Recharts.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose ODM).
*   **Auth**: JWT (JSON Web Tokens) with Bcrypt hashing.

---

## 🚦 Getting Started & Installation

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed  # Populates initial Admin, Cars, and Accessories
npm run dev   # Starts server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Starts interface on http://localhost:5173
```

### 3. Default Testing Accounts
*   **Admin**: `admin@carxell.com` | `123456`
*   **Sales**: `sales@carxell.com` | `123456`
*   **Customer**: `john@user.com` | `123456`

---

## 🔧 Database Schemas

- **User**: Name, Email, Password (hashed), Role.
- **Car**: Brand, Name, Category, Price, Stock, Image_URL, Tech Specs.
- **Accessory**: Name, Price, Category (Interior/Exterior/Spare), Compatibility.
- **Service**: Customer_ID, Car Info, Service Type, Pick/Drop choice, Preferred Date.
- **Order**: Customer_ID, Car_ID, Final Price, Date of Sale.
- **Event**: User_ID, Action_Type (viewed, booked, purchased), Timestamp.
