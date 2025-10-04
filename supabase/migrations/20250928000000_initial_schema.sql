-- This is an empty migration file. --
-- Add your SQL to create tables, alter tables, etc. here. --

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price INTEGER NOT NULL, -- In cents
    image_url TEXT
);

CREATE TYPE order_status AS ENUM ('Awaiting Payment', 'Placed', 'En Route', 'Delivered');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    status order_status NOT NULL DEFAULT 'Awaiting Payment',
    line_items JSONB NOT NULL,
    total INTEGER NOT NULL, -- In cents
    device_id TEXT, -- Can be null until payment is confirmed
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
