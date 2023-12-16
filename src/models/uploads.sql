CREATE TABLE IF NOT EXISTS uploads (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    associated_type VARCHAR(50) NOT NULL,
    associated_id INTEGER,
    CONSTRAINT fk_associated FOREIGN KEY(associated_id)
        REFERENCES users(id) MATCH SIMPLE
        ON UPDATE CASCADE ON DELETE SET NULL
);
