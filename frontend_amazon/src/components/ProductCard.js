import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="product-image"
        />
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">{formatPrice(product.price)}</div>
        {product.stock > 0 ? (
          <p className="product-stock in-stock">In Stock</p>
        ) : (
          <p className="product-stock out-of-stock">Out of Stock</p>
        )}
      </Link>
      <button 
        className="add-to-cart-btn"
        onClick={() => onAddToCart(product.id)}
        disabled={product.stock === 0}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
