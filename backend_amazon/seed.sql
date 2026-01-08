-- Insert default user
INSERT INTO users (name, email) VALUES 
('Suraj', 'suraj@gmail.com');

-- Insert categories
INSERT INTO categories (name) VALUES 
('Electronics'),
('Books'),
('Clothing'),
('Home & Kitchen'),
('Sports'),
('Toys');

-- Insert products
INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES 
('Apple iPhone 15 Pro', '6.1-inch Super Retina XDR display, A17 Pro chip, Pro camera system', 129900.00, 50, 1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'),
('Samsung Galaxy S24 Ultra', '6.8-inch Dynamic AMOLED display, Snapdragon 8 Gen 3, 200MP camera', 124999.00, 45, 1, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'),
('MacBook Pro 14"', 'M3 Pro chip, 18GB RAM, 512GB SSD, Liquid Retina XDR display', 199900.00, 30, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'),
('Sony WH-1000XM5', 'Industry-leading noise canceling headphones, 30-hour battery life', 29990.00, 100, 1, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500'),

('Atomic Habits', 'An Easy & Proven Way to Build Good Habits by James Clear', 599.00, 200, 2, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500'),
('The Psychology of Money', 'Timeless lessons on wealth, greed, and happiness by Morgan Housel', 449.00, 150, 2, 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500'),

('Nike Air Max 270', 'Mens running shoes with Air cushioning technology', 12995.00, 80, 3, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'),
('Levis 501 Original Jeans', 'Classic straight fit denim jeans for men', 3999.00, 120, 3, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'),

('Instant Pot Duo 7-in-1', 'Electric pressure cooker, slow cooker, rice cooker, and more', 8999.00, 60, 4, 'https://images.unsplash.com/photo-1585515320310-259814833379?w=500'),
('Dyson V15 Detect', 'Cordless vacuum cleaner with laser dust detection', 54900.00, 25, 4, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500'),

('Yoga Mat Premium', 'Non-slip exercise mat with carrying strap, 6mm thick', 1499.00, 150, 5, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'),
('Dumbbells Set 20kg', 'Adjustable weight dumbbells for home gym', 4999.00, 70, 5, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'),

('LEGO Star Wars Set', 'Millennium Falcon building kit, 1351 pieces', 11999.00, 40, 6, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500'),
('Hot Wheels Track Set', 'Ultimate garage playset with multiple levels', 5999.00, 90, 6, 'https://images.unsplash.com/photo-1599207477399-e1c67f7553b6?w=500');

-- Insert product images for carousel (iPhone example)
INSERT INTO product_images (product_id, image_url, display_order) VALUES 
(1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 1),
(1, 'https://images.unsplash.com/photo-1695048133194-e43f0eef8e78?w=500', 2),
(1, 'https://images.unsplash.com/photo-1695048133256-77e732d19e33?w=500', 3);
