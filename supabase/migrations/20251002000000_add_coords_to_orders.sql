-- Add start_coords and destination_coords to orders table

ALTER TABLE orders
ADD COLUMN start_coords REAL[],
ADD COLUMN destination_coords REAL[];
