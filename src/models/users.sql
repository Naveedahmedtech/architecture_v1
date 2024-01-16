CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    username VARCHAR(150) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    otp VARCHAR(25),
    email_verified_status BOOLEAN,
    file jsonb,
    role VARCHAR(255) NOT NULL DEFAULT 'user',
    provider VARCHAR(50),
    -- e.g., 'google', 'facebook'
    provider_id VARCHAR(255),
    -- Unique ID from the social login provider
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_role CHECK (
        role IN (
            'customer',
            'admin',
            'manager',
            'employee',
            'user'
        )
    )
);
