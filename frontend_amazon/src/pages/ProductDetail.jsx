import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart, addToWishlist } from '../services/api';
import '../styles/ProductDetail.css';

function ProductDetail({ updateCartCount, userId }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id);
      setProduct(response.data);
      setSelectedImage(response.data.image_url);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(userId, product.id, quantity);
      alert('Product added to cart!');
      updateCartCount();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(userId, product.id, quantity);
      updateCartCount();
      navigate('/cart');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(userId, product.id);
      alert('Product added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="amz-page">
      <div className="amz-container">
        <div className="amz-grid">
          {/* LEFT: Thumbnails + Main Image */}
          <section className="amz-left">
            <div className="amz-image-block">
              <div className="amz-thumbs">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      className={`amz-thumbBtn ${selectedImage === img.image_url ? 'active' : ''}`}
                      onClick={() => setSelectedImage(img.image_url)}
                    >
                      <img
                        src={img.image_url}
                        alt={product.name}
                        className="amz-thumbImg"
                      />
                    </button>
                  ))
                ) : (
                  <button type="button" className="amz-thumbBtn active">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="amz-thumbImg"
                    />
                  </button>
                )}
              </div>

              <div className="amz-mainImage">
                <img src={selectedImage} alt={product.name} />
              </div>
            </div>
          </section>

          {/* MIDDLE: Product Info */}
          <main className="amz-middle">
            <h1 className="amz-title">{product.name}</h1>

            <div className="amz-metaRow">
              <span className="amz-stars" aria-hidden="true">★★★★☆</span>
              <span className="amz-ratingText">4.2</span>
              <span className="amz-sep">|</span>
              <span className="amz-smallText">400+ bought in past month</span>
            </div>

            <div className="amz-brandRow">
              <span className="amz-muted">Category:</span> <span>{product.category_name}</span>
            </div>

            <hr className="amz-divider" />

            <div className="amz-priceBlock">
              <div className="amz-priceLine">
                <span className="amz-price">{formatPrice(product.price)}</span>
                <span className="amz-taxNote">Inclusive of all taxes</span>
              </div>

              <div className="amz-stockLine">
                {product.stock > 0 ? (
                  <span className="amz-inStock">In stock</span>
                ) : (
                  <span className="amz-outStock">Currently unavailable</span>
                )}
                {product.stock > 0 && <span className="amz-muted"> ({product.stock} available)</span>}
              </div>
            </div>

            <div className="amz-offers">
              <h3 className="amz-sectionTitle">Offers</h3>
              <div className="amz-offerGrid">
                <div className="amz-offerCard">
                  <div className="amz-offerTitle">Bank Offer</div>
                  <div className="amz-offerText">Extra discount on select cards</div>
                </div>
                <div className="amz-offerCard">
                  <div className="amz-offerTitle">No Cost EMI</div>
                  <div className="amz-offerText">EMI options available</div>
                </div>
                <div className="amz-offerCard">
                  <div className="amz-offerTitle">Cashback</div>
                  <div className="amz-offerText">Extra savings on eligible payments</div>
                </div>
              </div>
            </div>

            <hr className="amz-divider" />

            <section className="amz-about">
              <h3 className="amz-sectionTitle">About this item</h3>
              <p className="amz-desc">{product.description}</p>
            </section>
          </main>

          {/* RIGHT: Buy Box */}
          <aside className="amz-right">
            <div className="amz-buyBox">
              <div className="amz-buyPrice">{formatPrice(product.price)}</div>

              {product.stock > 0 ? (
                <div className="amz-delivery">
                  <div className="amz-deliveryLine"><b>FREE delivery</b> available</div>
                  <div className="amz-buyStock amz-inStock">In Stock</div>
                </div>
              ) : (
                <div className="amz-buyStock amz-outStock">Out of Stock</div>
              )}

              <div className="amz-qtyRow">
                <label className="amz-qtyLabel">Quantity:</label>
                <select
                  className="amz-qtySelect"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={product.stock === 0}
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <button
                className="amz-btn amz-btnCart"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>

              <button
                className="amz-btn amz-btnBuy"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>

              <button
                className="amz-btn amz-btnWish"
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </button>

              <div className="amz-trust">
                <div className="amz-trustRow">Secure transaction</div>
                <div className="amz-trustRow">10-day replacement</div>
                <div className="amz-trustRow">1-year warranty</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
