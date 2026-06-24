# 🛒 ShopEasy — Full Stack eCommerce App

A full stack eCommerce application built with **Spring Boot** and **React.js**.

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Backend | Java 17, Spring Boot 3.5, Spring Data JPA, MySQL, Lombok |
| Frontend | React.js, React Router v6, Axios, Context API |

---

## ✨ Features

- 🏠 **Homepage** — Hero banner, category cards, featured products
- 🛍️ **Products** — Search, category filter, sort by price, add to cart
- 🛒 **Cart** — Quantity controls, live total, free delivery indicator
- 📦 **Orders** — Status tracking timeline, expandable order items
- 🔐 **Auth** — Register, login, protected routes

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/products` | Get all products |
| GET | `/api/products/search?name=` | Search products |
| POST | `/api/cart/add` | Add to cart |
| POST | `/api/orders/place` | Place order |
| GET | `/api/orders/user/{userId}` | Get user orders |

---

## ⚙️ Run Locally

```bash
# Clone
git clone https://github.com/Snehab30/ecommerce-fullstack.git

# Backend — update application.properties with your MySQL password, then:
cd ecommerce-backend
./mvnw spring-boot:run

# Frontend
cd ecommerce-frontend
npm install && npm start
```

> Backend runs on `http://localhost:8080` · Frontend on `http://localhost:3000`

---

## 📁 Structure

```
ecommerce-fullstack/
├── ecommerce-backend/
│   └── src/.../
│       ├── controller/   → REST APIs
│       ├── service/      → Business logic
│       ├── repository/   → JPA queries
│       └── model/        → Entities
└── ecommerce-frontend/
    └── src/
        ├── pages/        → Home, Products, Cart, Orders, Auth
        ├── components/   → Navbar
        ├── context/      → Global state
        └── services/     → Axios API calls
```

---
