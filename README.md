# Ecommerce Backend API

Django REST Framework backend for the ecommerce frontend application.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
```

2. Activate virtual environment:
```bash
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install django djangorestframework django-cors-headers
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run server:
```bash
python manage.py runserver
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login

### Categories
- `GET /api/categories/` - List categories (authenticated)
- `POST /api/categories/` - Create category (authenticated)
- `GET /api/categories/<id>/` - Get category details (authenticated)
- `PUT /api/categories/<id>/` - Update category (authenticated)
- `DELETE /api/categories/<id>/` - Delete category (authenticated)

### Products
- `GET /api/products/` - List all products (public)
- `POST /api/products/create/` - Create product (authenticated)
- `GET /api/products/<id>/` - Get product details (authenticated)
- `PUT /api/products/<id>/` - Update product (authenticated)
- `DELETE /api/products/<id>/` - Delete product (authenticated)

### Orders
- `GET /api/orders/` - List user's orders (authenticated)
- `POST /api/orders/create/` - Create order (authenticated)
- `GET /api/orders/<id>/` - Get order details (authenticated)
- `PUT /api/orders/<id>/` - Update order (authenticated)
- `GET /api/admin/orders/` - List all orders (admin only)

### Contact Us
- `POST /api/contact/` - Submit contact form (public)

### Feedback
- `GET /api/feedback/` - List feedback (authenticated)
- `POST /api/feedback/create/` - Create feedback (authenticated)

## Authentication

Use Token authentication. Include the token in the Authorization header:
```
Authorization: Token <your-token>
```

## Admin Panel

Access the Django admin at `/admin/` with superuser credentials.

## CORS

Configured to allow requests from localhost:5173-5175 (Vite dev server ports).