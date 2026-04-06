# FoodExpress — MERN Stack Online Food Ordering System
### Department of AI & ML — Student Project

---

## 🍽️ Key Feature: Per-Item Food Customization

Every menu item has its **own specific customization options** relevant to that dish:

| Item            | Customization Options                                              |
|-----------------|--------------------------------------------------------------------|
| Butter Chicken  | Spice level, Gravy (light/normal/extra), Portion, Add-ons (cream, smoked), Remove ingredients |
| Paneer Tikka    | Spice level, Marination style, Cook style (tandoor/pan/air), Portion, Add-ons |
| Dum Biryani     | Spice level, Protein choice, Portion size, Add-ons (raita, salan) |
| Garlic Naan     | Bread type (plain/garlic/cheese/stuffed), Quantity, Add-ons       |
| Classic Burger  | Bun type, Patty (single/double/triple), Doneness, Toppings, Remove ingredients |
| Veggie Burger   | Bun type, Patty type, Toppings, Remove ingredients                 |
| Crispy Fries    | Fry size, Seasoning, Dipping sauce add-ons                        |
| Margherita Pizza| Crust type, Pizza size, Sauce base, Extra toppings                |
| Pepperoni Pizza | Crust type, Pizza size, Sauce base, Extra toppings, Remove items  |
| Penne Arrabiata | Pasta type, Spice level, Add-ons (chicken, parmesan)              |
| Salmon Nigiri   | Count, Add-ons (torched, tobiko), Remove (wasabi etc.)            |
| California Roll | Add-ons (spicy mayo, tempura crunch), Remove sesame etc.          |
| Mango Lassi     | Sweetness, Drink size, Temperature, Add-ons                       |
| Matcha Ice Cream| Portion (scoops), Add-ons (red bean, mochi)                       |

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v16+
- MongoDB running locally (`mongod`)

### Backend
```bash
cd food-ordering-app/backend
npm install
npm run dev
# Server: http://localhost:5000
# MongoDB: localhost:27017/foodordering
```

### Frontend
```bash
cd food-ordering-app/frontend
npm install
npm start
# App: http://localhost:3000
```

### Load Sample Data
1. Open http://localhost:3000
2. Click **"🌱 Load Sample Restaurants"** on the home page
3. This seeds 4 restaurants (Indian, American, Italian, Japanese) with full per-item customization configs

---

## 📁 Project Structure

```
food-ordering-app/
├── backend/
│   ├── models/
│   │   ├── User.js          — User authentication model
│   │   ├── Restaurant.js    — Restaurant + menu with per-item customization configs
│   │   ├── Order.js         — Regular (non-customized) orders
│   │   └── CustomOrder.js   — Customized orders (stores all per-item selections)
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js  — includes /seed/data endpoint
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── customOrderRoutes.js
│   ├── server.js
│   └── .env
│
└── frontend/
    └── src/
        ├── context/
        │   ├── AuthContext.js
        │   └── CartContext.js   — stores items with customization config
        ├── components/
        │   ├── Navbar.js
        │   └── ItemCustomizeModal.js  ← KEY COMPONENT: per-item customization UI
        └── pages/
            ├── Home.js
            ├── RestaurantDetail.js    ← shows "Customise" button per item
            ├── Cart.js                ← shows customization chips per cart item
            ├── Orders.js              ← shows full customization detail per order
            └── AuthPages.js
```

---

## 🔌 API Endpoints

| Method | Endpoint                          | Description                              |
|--------|-----------------------------------|------------------------------------------|
| POST   | /api/auth/register                | Register user                            |
| POST   | /api/auth/login                   | Login, returns JWT                       |
| GET    | /api/auth/profile                 | Get profile (protected)                  |
| GET    | /api/restaurants                  | List all restaurants                     |
| GET    | /api/restaurants/:id              | Single restaurant with full menu + customization options |
| POST   | /api/restaurants/seed/data        | Seed 4 sample restaurants                |
| POST   | /api/orders                       | Place regular order (protected)          |
| GET    | /api/orders/myorders              | Get user's regular orders (protected)    |
| POST   | /api/custom-orders                | Place customized order (protected)       |
| GET    | /api/custom-orders/myorders       | Get user's customized orders (protected) |

---

## 👥 Team
N. Bhavani Prasanna, B. Anjali Valli, B. Supriya, K. Hema Lalitha Devi, T. Priyanka
Department of Artificial Intelligence & Machine Learning
