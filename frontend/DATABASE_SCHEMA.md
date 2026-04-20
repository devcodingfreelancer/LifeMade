# Database Schema Documentation

## Overview
This document provides SQL schema examples for integrating the admin panel with a backend database. Examples are provided for both MongoDB and SQL databases.

---

## PostgreSQL / MySQL Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INT NOT NULL CHECK (stock >= 0),
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_category ON products(category);
CREATE INDEX idx_name ON products(name);
```

### Example Data
```sql
INSERT INTO users (email, password_hash, role) VALUES
('admin@ecommerce.com', '$2b$10$...hashed_password...', 'admin'),
('user@ecommerce.com', '$2b$10$...hashed_password...', 'user');

INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('Laptop', 'High performance laptop', 999.99, 15, 'Electronics', 'https://example.com/laptop.jpg'),
('T-Shirt', 'Cotton T-Shirt', 29.99, 50, 'Clothing', 'https://example.com/tshirt.jpg'),
('Coffee', 'Premium Arabic Coffee', 12.99, 100, 'Food', 'https://example.com/coffee.jpg');
```

---

## MongoDB Schema

### Users Collection
```javascript
db.users.createIndex({ email: 1 }, { unique: true });

db.users.insertMany([
  {
    _id: ObjectId(),
    email: "admin@ecommerce.com",
    passwordHash: "$2b$10$...hashed_password...",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    email: "user@ecommerce.com",
    passwordHash: "$2b$10$...hashed_password...",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
```

### Products Collection
```javascript
db.products.createIndex({ name: 1 });
db.products.createIndex({ category: 1 });

db.products.insertMany([
  {
    _id: ObjectId(),
    name: "Laptop",
    description: "High performance laptop",
    price: 999.99,
    stock: 15,
    category: "Electronics",
    imageUrl: "https://example.com/laptop.jpg",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "T-Shirt",
    description: "Cotton T-Shirt",
    price: 29.99,
    stock: 50,
    category: "Clothing",
    imageUrl: "https://example.com/tshirt.jpg",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Coffee",
    description: "Premium Arabic Coffee",
    price: 12.99,
    stock: 100,
    category: "Food",
    imageUrl: "https://example.com/coffee.jpg",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
```

---

## Backend API Requirements

### Login Endpoint
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "admin@ecommerce.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "1",
    "email": "admin@ecommerce.com",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### Get All Products
**GET** `/api/products`

**Query Parameters:**
- `search` (optional): Search by name or description
- `category` (optional): Filter by category
- `page` (optional): Pagination page number
- `limit` (optional): Results per page

**Response (200):**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High performance laptop",
      "price": 999.99,
      "stock": 15,
      "category": "Electronics",
      "image": "https://example.com/laptop.jpg",
      "createdAt": "2026-04-14T10:00:00Z",
      "updatedAt": "2026-04-14T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### Get Single Product
**GET** `/api/products/:id`

**Response (200):**
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 999.99,
  "stock": 15,
  "category": "Electronics",
  "image": "https://example.com/laptop.jpg",
  "createdAt": "2026-04-14T10:00:00Z",
  "updatedAt": "2026-04-14T10:00:00Z"
}
```

---

### Create Product
**POST** `/api/products`

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 49.99,
  "stock": 20,
  "category": "Electronics",
  "image": "https://example.com/image.jpg"
}
```

**Response (201):**
```json
{
  "id": "2",
  "name": "New Product",
  "description": "Product description",
  "price": 49.99,
  "stock": 20,
  "category": "Electronics",
  "image": "https://example.com/image.jpg",
  "createdAt": "2026-04-14T10:00:00Z",
  "updatedAt": "2026-04-14T10:00:00Z"
}
```

---

### Update Product
**PUT** `/api/products/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Product",
  "price": 59.99,
  "stock": 25
}
```

**Response (200):**
```json
{
  "id": "2",
  "name": "Updated Product",
  "description": "Product description",
  "price": 59.99,
  "stock": 25,
  "category": "Electronics",
  "image": "https://example.com/image.jpg",
  "createdAt": "2026-04-14T10:00:00Z",
  "updatedAt": "2026-04-14T10:00:00Z"
}
```

---

### Delete Product
**DELETE** `/api/products/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

## Environment Variables

Create a `.env` file in your backend with:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=admin
DB_PASSWORD=password

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# API
API_PORT=5000
NODE_ENV=development
```

---

## Security Best Practices

1. **Password Hashing**: Use bcrypt or similar for password hashing
   ```javascript
   const bcrypt = require('bcryptjs');
   const hash = await bcrypt.hash(password, 10);
   ```

2. **JWT Tokens**: Issue JWT tokens for authenticated requests
   ```javascript
   const jwt = require('jsonwebtoken');
   const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
     expiresIn: '7d'
   });
   ```

3. **Role-Based Authorization**: Check user role before allowing operations
   ```javascript
   const authMiddleware = (req, res, next) => {
     if (req.user.role !== 'admin') {
       return res.status(403).json({ error: 'Forbidden' });
     }
     next();
   };
   ```

4. **Input Validation**: Validate all input data
   ```javascript
   const validateProduct = (product) => {
     if (!product.name || product.name.trim() === '') {
       throw new Error('Product name is required');
     }
     if (product.price < 0) {
       throw new Error('Price cannot be negative');
     }
   };
   ```

5. **CORS Configuration**: Limit API access to trusted domains
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true
   }));
   ```

---

## Example Node.js/Express Implementation

```javascript
// routes/products.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.get('/products', async (req, res) => {
  const products = await db.products.find().toArray();
  res.json(products);
});

router.post('/products', authMiddleware, adminMiddleware, async (req, res) => {
  const product = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const result = await db.products.insertOne(product);
  res.status(201).json({ ...product, id: result.insertedId });
});

router.put('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const result = await db.products.updateOne(
    { _id: req.params.id },
    { $set: { ...req.body, updatedAt: new Date() } }
  );
  res.json({ message: 'Product updated' });
});

router.delete('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await db.products.deleteOne({ _id: req.params.id });
  res.json({ message: 'Product deleted' });
});

module.exports = router;
```

---

## Next Steps

1. Set up your backend database (PostgreSQL, MongoDB, etc.)
2. Create API endpoints as documented above
3. Update `AuthContext.tsx` and `ProductContext.tsx` with your API URLs
4. Test the admin panel with your backend
5. Implement proper authentication with JWT tokens
6. Add role-based authorization checks on the backend

For more information, refer to the [ADMIN_PANEL_README.md](./ADMIN_PANEL_README.md)
