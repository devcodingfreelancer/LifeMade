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
- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login

### Categories
- `GET /categories/` - List categories (authenticated)
- `POST /categories/` - Create category (authenticated)
- `GET /categories/<id>/` - Get category details (authenticated)
- `PUT /categories/<id>/` - Update category (authenticated)
- `DELETE /categories/<id>/` - Delete category (authenticated)

### Products
- `GET /products/` - List all products (public)
- `POST /products/create/` - Create product (authenticated)
- `GET /products/<id>/` - Get product details (authenticated)
- `PUT /products/<id>/` - Update product (authenticated)
- `DELETE /products/<id>/` - Delete product (authenticated)

### Orders
- `GET /orders/` - List user's orders (authenticated)
- `POST /orders/create/` - Create order (authenticated)
- `GET /orders/<id>/` - Get order details (authenticated)
- `PUT /orders/<id>/` - Update order (authenticated)
- `GET /admin/orders/` - List all orders (admin only)

### Contact Us
- `POST /contactus/` - Submit contact form (public)

### Feedback
- `GET /feedback/` - List feedback (authenticated)
- `POST /feedback/create/` - Create feedback (authenticated)

## Authentication

Use Token authentication. Include the token in the Authorization header:
```
Authorization: Token <your-token>
```

## Admin Panel

Access the Django admin at `/admin/` with superuser credentials.

## CORS

Configured to allow requests from localhost:5173-5175 (Vite dev server ports).