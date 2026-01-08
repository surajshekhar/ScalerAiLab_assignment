import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getAllProducts, addToCart } from '../services/api';

function Home({ updateCartCount, userId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams(); // read + write params

  const searchTerm = searchParams.get('search') || '';
  const categoryId = searchParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAllProducts(searchTerm, categoryId);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [searchTerm, categoryId]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(userId, productId, 1);
      alert('Product added to cart!');
      updateCartCount();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading products...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Title + count */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {searchTerm ? `Search results for "${searchTerm}"` : 'All Products'}
          </h2>
          <p className="text-gray-600">{products.length} results</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-xl text-gray-600">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
