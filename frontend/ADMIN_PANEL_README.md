# Admin Panel Documentation

## Overview
This admin panel provides a complete product management system with authentication, role-based access control, and a database for storing product details.

## Features

### 1. **Authentication System**
- Login page with email and password
- User authentication with role-based access (User/Admin)
- Session management with localStorage persistence
- Automatic logout functionality

**Demo Credentials:**
- Email: `admin@ecommerce.com`
- Password: `admin123`

### 2. **Role-Based Access Control**
- **Admin**: Full access to the admin panel and product management
- **User**: Limited access, blocked from admin panel
- Protected routes that redirect to login page

### 3. **Product Management**
- **Create**: Add new products with details (name, description, price, stock, category, image URL)
- **Read**: View all products in a table format with search and filter functionality
- **Update**: Edit existing products
- **Delete**: Remove products from inventory

### 4. **Dashboard Statistics**
- Total Products count
- Inventory Value (calculated from price × stock)
- Total Stock quantity
- Low Stock Items alert (< 10 units)

### 5. **Search & Filter**
- Search products by name or description
- Filter by category
- Real-time filtering

## Project Structure

```
src/
├── context/
│   ├── AuthContext.tsx          # User authentication & authorization
│   └── ProductContext.tsx       # Product management (CRUD operations)
├── Component/
│   ├── Login.tsx                # Login form component
│   ├── AdminPanel.tsx           # Main admin dashboard
│   ├── ProtectedRoute.tsx       # Route protection & access control
│   ├── ProductsList.tsx         # Products table with search/filter
│   └── ProductForm.tsx          # Modal form for creating/editing products
├── App.tsx                      # Main app with providers
└── main.tsx
```

## How to Use

### 1. **Starting the Application**
```bash
npm run dev
```
Access the admin panel at `http://localhost:5173`

### 2. **Login**
- Enter email and password
- Use demo credentials or create a new account
- After successful login, you'll be redirected to the admin panel

### 3. **Managing Products**
- Click "Add Product" button to create a new product
- Fill in the form with product details
- Required fields: Name, Category, Price, Stock
- Optional fields: Description, Image URL
- Click "Add Product" to save

### 4. **Editing Products**
- Click the edit icon (pencil) next to any product
- Modify the details in the form
- Click "Update Product" to save changes

### 5. **Deleting Products**
- Click the delete icon (trash) next to any product
- Confirm the deletion
- Product will be removed from inventory

### 6. **Searching & Filtering**
- Use the search bar to find products by name or description
- Use the category dropdown to filter by specific category
- Results update in real-time

### 7. **Logout**
- Click the "Logout" button in the top right
- You'll be returned to the login page

## Database Structure

### Products Collection
```javascript
{
  id: string (auto-generated timestamp)
  name: string (required)
  description: string
  price: number (required, must be > 0)
  stock: number (required, must be > 0)
  category: string (required)
  image: string (optional - image URL)
  createdAt: string (ISO timestamp, auto-generated)
  updatedAt: string (ISO timestamp, auto-updated)
}
```

### Supported Categories
- Electronics
- Clothing
- Food
- Books
- Home
- Other

## Data Storage

Currently, the application uses **localStorage** for data persistence:
- User data is stored in `localStorage.user`
- Products are stored in `localStorage.products`

### Integrating with Backend API

To connect to your backend database, update the following files:

#### 1. **AuthContext.tsx** - Update the `login()` function
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  setUser(data.user);
  // ... save to localStorage
};
```

#### 2. **ProductContext.tsx** - Update CRUD operations
```typescript
const addProduct = async (product) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  const newProduct = await response.json();
  setProducts([...products, newProduct]);
};
```

## API Endpoints (for backend integration)

```
POST   /api/auth/login           - User login
GET    /api/products             - Get all products
POST   /api/products             - Create product
GET    /api/products/:id         - Get single product
PUT    /api/products/:id         - Update product
DELETE /api/products/:id         - Delete product
```

## Security Notes

⚠️ **Important**: This is a frontend implementation. For production:
1. **Never store sensitive data in localStorage**
2. **Always validate input on the backend**
3. **Use HTTPS for all API calls**
4. **Implement proper JWT/token-based authentication**
5. **Use environment variables for API URLs**
6. **Implement proper role-based authorization on the backend**
7. **Add rate limiting and CORS policies**

## Dependencies Used

- **React 19.2.4** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## Troubleshooting

### "useAuth must be used within AuthProvider"
- Ensure AuthProvider wraps your component tree in App.tsx

### Data not persisting after refresh
- Check if localStorage is enabled in browser
- Check browser's Storage quota

### Products not showing in table
- Ensure ProductProvider wraps your components
- Check browser console for errors

### Login not working
- For demo: use `admin@ecommerce.com` / `admin123`
- For custom: implement backend authentication

## Future Enhancements

- [ ] User roles (Admin, Manager, Editor)
- [ ] Product images upload
- [ ] Inventory logs and history
- [ ] Bulk import/export (CSV)
- [ ] Product variants and sizes
- [ ] Email notifications
- [ ] User audit logs
- [ ] Advanced analytics and reports
- [ ] Dark mode support
- [ ] Mobile app version

## Support

For issues or questions, refer to the code comments or update the API endpoints to your backend implementation.
