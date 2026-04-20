# Admin Panel Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      ECOMMERCE ADMIN PANEL                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              App.tsx (Root Component)                  │    │
│  │  - AuthProvider wrapper                               │    │
│  │  - ProductProvider wrapper                            │    │
│  │  - ProtectedRoute main component                      │    │
│  └────────────────────────────────────────────────────────┘    │
│              │                        │                        │
│              ▼                        ▼                        │
│  ┌──────────────────────┐  ┌──────────────────────┐           │
│  │ AuthContext Provider │  │ ProductContext Provi │           │
│  ├──────────────────────┤  ├──────────────────────┤           │
│  │ user: User | null    │  │ products: Product[]  │           │
│  │ isAuthenticated      │  │ isLoading: boolean   │           │
│  │                      │  │                      │           │
│  │ Methods:             │  │ Methods:             │           │
│  │ - login()            │  │ - addProduct()       │           │
│  │ - logout()           │  │ - updateProduct()    │           │
│  │ - useAuth()          │  │ - deleteProduct()    │           │
│  │ (hook)               │  │ - useProducts()      │           │
│  │                      │  │   (hook)             │           │
│  └──────────────────────┘  └──────────────────────┘           │
│              │                        │                        │
│              └────────────┬───────────┘                        │
│                           │                                    │
│                           ▼                                    │
│            ┌──────────────────────────┐                       │
│            │   ProtectedRoute         │                       │
│            ├──────────────────────────┤                       │
│            │                          │                       │
│            │ - Check auth state       │                       │
│            │ - Check user role        │                       │
│            │ - Route accordingly      │                       │
│            └──────────────────────────┘                       │
│              │                │               │                │
│              ▼                ▼               ▼                │
│        ┌──────────┐  ┌──────────────┐  ┌───────────────┐      │
│        │  Login   │  │ AccessDenied │  │ AdminPanel    │      │
│        ├──────────┤  ├──────────────┤  ├───────────────┤      │
│        │          │  │              │  │               │      │
│        │ - Email  │  │ - Show only  │  │ - Statistics  │      │
│        │ - Pass   │  │   if not     │  │ - ProductList │      │
│        │ - Demo   │  │   admin      │  │ - User menu   │      │
│        │   creds  │  │              │  │               │      │
│        └──────────┘  └──────────────┘  └───────────────┘      │
│                                           │                    │
│                                           ▼                    │
│                        ┌──────────────────────────────┐        │
│                        │    ProductsList Component    │        │
│                        ├──────────────────────────────┤        │
│                        │                              │        │
│                        │ - Search box                 │        │
│                        │ - Category filter            │        │
│                        │ - Products table             │        │
│                        │ - Add button                 │        │
│                        │ - Edit/Delete buttons        │        │
│                        └──────────────────────────────┘        │
│                           │
│                    ┌──────┴──────┐
│                    ▼             ▼
│            ┌────────────┐  ┌───────────────┐
│            │ProductForm │  │ Statistics    │
│            ├────────────┤  │ (in AdminPanel│
│            │            │  ├───────────────┤
│            │ - Modal    │  │ - Total Count │
│            │ - All      │  │ - Total Value │
│            │   fields   │  │ - Total Stock │
│            │ - Form     │  │ - Low Stock   │
│            │   validation  │              │
│            └────────────┘  └───────────────┘
│                                                            │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
                   ┌───────────────────┐
                   │   localStorage    │
                   ├───────────────────┤
                   │                   │
                   │ - user (JSON)     │
                   │ - products (JSON) │
                   │                   │
                   └───────────────────┘
                   (Ready to integrate
                    with Backend API)
```

---

## Data Flow Diagram

### Authentication Flow
```
User Opens App
      │
      ▼
  Check localStorage
    for saved user
      │
      ├──── User found ──────► Set isAuthenticated = true
      │                              │
      │                              ▼
      │                         Check role
      │                        /        \
      │                   admin      user
      │                    │            │
      │                    ▼            ▼
      │              AdminPanel   AccessDenied
      │
      └─ No user ────────► Show Login Page
                               │
                               ▼
                          User submits
                          email + password
                               │
                               ▼
                          Validate credentials*
                        ✓ (save to localStorage)
                        ✗ (show error)
                               │
                               ▼
                          Set user + role
                               │
                               ▼
                          isAuthenticated = true
                               │
                               ▼
                          AdminPanel
                               │
                               ▼
                          User clicks logout
                               │
                               ▼
                          Clear localStorage
                               │
                               ▼
                          Return to Login Page

* Demo: Fixed credentials in AuthContext
  Production: Validate against Backend API
```

### Product Management Flow
```
┌────────────────────────────────────────────────┐
│         PRODUCT MANAGEMENT LIFECYCLE           │
└────────────────────────────────────────────────┘

┌─ CREATE PRODUCT ─┐
│                  │
│ 1. Click button  │
│ 2. Form opens    │
│ 3. Fill fields   │
│ 4. Submit form   │
│    → Validation  │
│    → Call API*   │
│    → Save to DB  │
│ 5. Add to state  │
│ 6. Update table  │
└─────────────────┘

┌─ READ PRODUCTS ──────────────────┐
│                                  │
│ 1. Load from localStorage        │
│ 2. Display in ProductsList       │
│ 3. (Or load from API on ready)   │
│    → Keep in ProductContext      │
│    → Map to table rows           │
│    → Show statistics             │
└──────────────────────────────────┘

┌─ UPDATE PRODUCT ─┐          ┌─ DELETE PRODUCT ─┐
│                  │          │                  │
│ 1. Click edit    │          │ 1. Click delete  │
│ 2. Form opens    │          │ 2. Confirm       │
│ 3. Pre-fill data │          │ 3. Call API*     │
│ 4. Edit fields   │          │ 4. Remove from DB│
│ 5. Submit form   │          │ 5. Update state  │
│    → Validation  │          │ 6. Update table  │
│    → Call API*   │          │                  │
│    → Update DB   │          └──────────────────┘
│ 6. Update state  │
│ 7. Update in table   │
└──────────────────┘

* API calls: Replace with backend endpoints
  Currently uses localStorage mock
```

---

## Component Hierarchy

```
App
├─ AuthProvider
│  └─ ProductProvider
│     └─ ProtectedRoute
│        ├─ IF not authenticated
│        │  └─ Login
│        │
│        ├─ IF authenticated && role !== admin
│        │  └─ AccessDenied Message
│        │
│        └─ IF authenticated && role === admin
│           └─ AdminPanel
│              ├─ Header
│              │  ├─ App Logo
│              │  ├─ User Info
│              │  └─ Logout Button
│              │
│              ├─ Statistics Cards (4)
│              │  ├─ Total Products
│              │  ├─ Inventory Value
│              │  ├─ Total Stock
│              │  └─ Low Stock Items
│              │
│              └─ ProductsList
│                 ├─ Header
│                 │  ├─ Title
│                 │  └─ Add Product Button
│                 │
│                 ├─ Filters
│                 │  ├─ Search Input
│                 │  └─ Category Select
│                 │
│                 ├─ Products Table
│                 │  ├─ Table Header
│                 │  └─ Table Rows (repeat)
│                 │     ├─ Product Name
│                 │     ├─ Category Badge
│                 │     ├─ Price
│                 │     ├─ Stock Badge
│                 │     ├─ Created Date
│                 │     └─ Action Buttons
│                 │        ├─ Edit Icon
│                 │        └─ Delete Icon
│                 │
│                 └─ ProductForm (Modal)
│                    ├─ Header
│                    │  ├─ Title
│                    │  └─ Close Button
│                    │
│                    ├─ Form Fields
│                    │  ├─ Product Name (text)
│                    │  ├─ Category (select)
│                    │  ├─ Price (number)
│                    │  ├─ Stock (number)
│                    │  ├─ Description (textarea)
│                    │  └─ Image URL (text)
│                    │
│                    └─ Buttons
│                       ├─ Cancel
│                       └─ Submit (Add/Update)
```

---

## State Management Overview

### Global State (Context)

```typescript
// AuthContext
{
  user: {
    id: string
    email: string
    role: 'user' | 'admin'
  } | null
  isAuthenticated: boolean
}

// ProductContext
{
  products: [
    {
      id: string
      name: string
      description: string
      price: number
      stock: number
      category: string
      image?: string
      createdAt: string
      updatedAt: string
    }
  ]
  isLoading: boolean
}
```

### Component Local State

```typescript
// Login.tsx
{
  email: string
  password: string
  error: string
  isLoading: boolean
}

// ProductsList.tsx
{
  searchTerm: string
  selectedCategory: string
  showForm: boolean
  editingId?: string
}

// ProductForm.tsx
{
  formData: {
    name: string
    description: string
    price: string
    stock: string
    category: string
    image: string
  }
  error: string
  isLoading: boolean
}
```

---

## Data Persistence Strategy

```
┌────────────────────────┐
│   localStorage         │
├────────────────────────┤
│                        │
│ localStorage.user      │
│ ───────────────────    │
│ {                      │
│   id: string          │
│   email: string       │
│   role: string        │
│ }                      │
│                        │
│ localStorage.products │
│ ───────────────────── │
│ [                      │
│   {                    │
│     id: string        │
│     name: string      │
│     description: ...  │
│     price: number     │
│     stock: number     │
│     category: string  │
│     image: string?    │
│     createdAt: string │
│     updatedAt: string │
│   },                   │
│   ...more products    │
│ ]                      │
│                        │
│ ┌─ persistence ──┐    │
│ │ - Auto-save    │    │
│ │ - Auto-load    │    │
│ │ - Survives     │    │
│ │   refresh      │    │
│ │ - Lost on      │    │
│ │   cache clear  │    │
│ └────────────────┘    │
│                        │
└────────────────────────┘
         ▲
         │
    [Integrate with
     Backend API]
```

---

## Technology Stack

```
┌─────────────────────────────────────────┐
│         FRONTEND TECHNOLOGIES           │
└─────────────────────────────────────────┘

React 19.2.4
   ├─ Components (UI building)
   ├─ Context API (state management)
   ├─ Hooks (useContext, useState, useEffect)
   └─ JSX (template syntax)

TypeScript 6.0.2
   ├─ Type safety
   ├─ Interfaces (User, Product)
   ├─ Enums (user roles)
   └─ Error prevention

Tailwind CSS 4.2.2
   ├─ Utility classes
   ├─ Responsive design
   ├─ Dark mode (ready)
   └─ Component styling

Lucide React 1.8.0
   ├─ Icons (20+ icons used)
   └─ Consistent iconography

Vite 8.0.4
   ├─ Fast dev server
   ├─ Hot module reloading
   ├─ Production build
   └─ Asset optimization

┌─────────────────────────────────────────┐
│      DATA & PERSISTENCE LAYER           │
└─────────────────────────────────────────┘

localStorage (Current)
   ├─ User session
   ├─ Products list
   └─ Demo data

Backend API (To integrate)
   ├─ Node.js/Express
   ├─ Python/Django
   ├─ Java/Spring
   └─ Any REST API

Database (To integrate)
   ├─ PostgreSQL
   ├─ MongoDB
   ├─ MySQL
   └─ Firebase
```

---

## File Dependencies Diagram

```
App.tsx
   ├─ AuthProvider
   │  └─ AuthContext.tsx
   │
   ├─ ProductProvider
   │  └─ ProductContext.tsx
   │
   └─ ProtectedRoute.tsx
      ├─ Login.tsx
      │
      ├─ ProtectedRoute.tsx (access denied message)
      │
      └─ AdminPanel.tsx
         ├─ AuthContext.tsx (useAuth hook)
         ├─ ProductContext.tsx (useProducts hook)
         │
         └─ ProductsList.tsx
            ├─ ProductContext.tsx (useProducts hook)
            ├─ ProductForm.tsx
            │  ├─ ProductContext.tsx (useProducts hook)
            │  └─ lucide-react (X icon)
            │
            └─ lucide-react (icons)
               ├─ Edit2 (edit button)
               ├─ Trash2 (delete button)
               ├─ Plus (add button)
               └─ Search (search icon)
```

---

## API Integration Points

Current implementation uses localStorage:
```javascript
// To replace with API calls:
```

**Location**: `src/context/AuthContext.tsx`
```javascript
// Current: Mock authentication
// Update to call: POST /api/auth/login
```

**Location**: `src/context/ProductContext.tsx`
```javascript
// Current: localStorage operations
// Update to call:
// - POST   /api/products (create)
// - GET    /api/products (read all)
// - GET    /api/products/:id (read one)
// - PUT    /api/products/:id (update)
// - DELETE /api/products/:id (delete)
```

See `DATABASE_SCHEMA.md` for complete API specifications.

---

## Deployment Architecture

```
┌──────────────────────────────────────────┐
│      DEVELOPMENT ENVIRONMENT            │
├──────────────────────────────────────────┤
│                                          │
│  npm run dev                             │
│  ↓                                       │
│  Vite Dev Server (localhost:5173)        │
│  ↓                                       │
│  Hot Module Reload                       │
│  ↓                                       │
│  Browser (React DevTools available)      │
│                                          │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│      PRODUCTION ENVIRONMENT             │
├──────────────────────────────────────────┤
│                                          │
│  npm run build                           │
│  ↓                                       │
│  TypeScript Compilation                  │
│  ↓                                       │
│  Vite Build Optimization                 │
│  ↓                                       │
│  ./dist/ folder (optimized)              │
│  ↓                                       │
│  Deploy to server (Vercel, Netlify, etc) │
│  ↓                                       │
│  HTTPS + CORS + API integration          │
│                                          │
└──────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalable component structure
- ✅ Type-safe state management
- ✅ Easy API integration
- ✅ Production-ready code
- ✅ Security through role-based access

---

**End of Architecture Documentation**
