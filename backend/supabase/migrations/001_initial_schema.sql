-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table (compatible with Laravel)
CREATE TABLE public.users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    phone_verified_at TIMESTAMP NULL,
    avatar VARCHAR(255) NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),

    -- Champs MFA
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret TEXT NULL,
    backup_codes JSON NULL,

    -- Sécurité
    last_login_at TIMESTAMP NULL,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP NULL,

    -- Intégration Supabase
    supabase_user_id UUID NULL UNIQUE,

    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Create stores table
CREATE TABLE public.stores (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo VARCHAR(255),
    website VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address JSON,
    settings JSON DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    sku VARCHAR(100),
    track_inventory BOOLEAN DEFAULT FALSE,
    inventory_quantity INTEGER DEFAULT 0,
    weight DECIMAL(8,2),
    images JSON DEFAULT '[]',
    variants JSON DEFAULT '[]',
    attributes JSON DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create customers table
CREATE TABLE public.customers (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(20),
    birth_date DATE,
    addresses JSON DEFAULT '[]',
    notes TEXT,
    tags JSON DEFAULT '[]',
    total_spent DECIMAL(10,2) DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    last_order_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(store_id, email)
);

-- Create payment_gateways table
CREATE TABLE public.payment_gateways (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(100) NOT NULL CHECK (provider IN ('paystack', 'flutterwave', 'cinetpay', 'fedapay', 'paydunya', 'pawapay')),
    config JSON NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT FALSE,
    is_test_mode BOOLEAN DEFAULT TRUE,
    supported_currencies JSON DEFAULT '["XOF"]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(store_id, provider)
);

-- Create payment_methods table
CREATE TABLE public.payment_methods (
    id BIGSERIAL PRIMARY KEY,
    gateway_id BIGINT REFERENCES public.payment_gateways(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    config JSON DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    customer_id BIGINT REFERENCES public.customers(id) ON DELETE SET NULL,
    order_number VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    financial_status VARCHAR(50) DEFAULT 'pending' CHECK (financial_status IN ('pending', 'paid', 'partially_paid', 'refunded', 'partially_refunded')),
    currency VARCHAR(3) DEFAULT 'XOF',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    customer_info JSON,
    shipping_address JSON,
    billing_address JSON,
    notes TEXT,
    processed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(store_id, order_number)
);

-- Create order_items table
CREATE TABLE public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    product_data JSON,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create payment_transactions table
CREATE TABLE public.payment_transactions (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
    gateway_id BIGINT REFERENCES public.payment_gateways(id) ON DELETE SET NULL,
    transaction_id VARCHAR(255) NOT NULL,
    gateway_transaction_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    gateway_response JSON,
    metadata JSON DEFAULT '{}',
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create mfa_tokens table
CREATE TABLE public.mfa_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    type VARCHAR(20) DEFAULT 'login' CHECK (type IN ('login', 'setup', 'recovery')),
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    ip_address INET NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create login_attempts table
CREATE TABLE public.login_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id) ON DELETE CASCADE NULL,
    email VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT NULL,
    successful BOOLEAN DEFAULT FALSE,
    failure_reason VARCHAR(255) NULL,
    mfa_required BOOLEAN DEFAULT FALSE,
    mfa_successful BOOLEAN NULL,
    location JSON NULL,
    device_info JSON NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_mfa_enabled ON public.users(mfa_enabled);
CREATE INDEX idx_users_locked_until ON public.users(locked_until);
CREATE INDEX idx_users_deleted_at ON public.users(deleted_at);

CREATE INDEX idx_stores_owner_id ON public.stores(owner_id);
CREATE INDEX idx_stores_active ON public.stores(is_active);

CREATE INDEX idx_products_store_id ON public.products(store_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_featured ON public.products(featured);

CREATE INDEX idx_customers_store_id ON public.customers(store_id);
CREATE INDEX idx_customers_email ON public.customers(email);

CREATE INDEX idx_orders_store_id ON public.orders(store_id);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

CREATE INDEX idx_payment_gateways_store_id ON public.payment_gateways(store_id);
CREATE INDEX idx_payment_transactions_store_id ON public.payment_transactions(store_id);
CREATE INDEX idx_payment_transactions_order_id ON public.payment_transactions(order_id);

CREATE INDEX idx_mfa_tokens_user_id ON public.mfa_tokens(user_id);
CREATE INDEX idx_mfa_tokens_token_type ON public.mfa_tokens(token, type);
CREATE INDEX idx_mfa_tokens_expires_at ON public.mfa_tokens(expires_at);

CREATE INDEX idx_login_attempts_user_id ON public.login_attempts(user_id, created_at);
CREATE INDEX idx_login_attempts_ip ON public.login_attempts(ip_address, created_at);
CREATE INDEX idx_login_attempts_email ON public.login_attempts(email, created_at);
