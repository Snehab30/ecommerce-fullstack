import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart } from '../services/api';
import { useApp } from '../context/AppContext';

function normalizeProduct(product) {
    if (!product) return null;
    return {
        id: product.id || product._id || product.productId,
        name: product.name || product.title || product.productName || 'Product',
        imageUrl: product.imageUrl || product.image || product.image_url || '',
        description: product.description || product.desc || '',
        price: Number(product.price ?? product.cost ?? 0),
        stockQuantity: product.stockQuantity ?? product.stock ?? 0,
        category: product.category
            ? typeof product.category === 'object'
                ? product.category
                : { name: product.category }
            : null,
        ...product,
    };
}

function ProductDetail() {
    const { id } = useParams();
    const { user } = useApp();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');

    useEffect(() => {
        getProductById(id)
            .then(res => setProduct(normalizeProduct(res.data)))
            .catch(err => console.error('Failed to load product detail', err.response?.data || err.message || err));
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        const productId = product.id || product._id;
        try {
            await addToCart({ userId: user.userId, productId, quantity });
            setMessage('✅ Added to cart successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('❌ Failed to add to cart');
        }
    };

    if (!product) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</p>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <img src={product.imageUrl} alt={product.name} style={styles.image} />
                <div style={styles.details}>
                    <p style={styles.category}>
                        {product.category ? product.category.name : ''}
                    </p>
                    <h2 style={styles.name}>{product.name}</h2>
                    <p style={styles.description}>{product.description}</p>
                    <p style={styles.price}>₹{product.price.toLocaleString()}</p>
                    <p style={styles.stock}>
                        {product.stockQuantity > 0
                            ? `In Stock (${product.stockQuantity} available)`
                            : 'Out of Stock'}
                    </p>

                    <div style={styles.quantityRow}>
                        <label style={styles.label}>Quantity:</label>
                        <input
                            style={styles.qtyInput}
                            type="number"
                            min="1"
                            max={product.stockQuantity}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    {message && <p style={styles.message}>{message}</p>}

                    <button
                        style={styles.btn}
                        onClick={handleAddToCart}
                        disabled={product.stockQuantity === 0}
                    >
                        Add to Cart
                    </button>
                    <button style={styles.backBtn} onClick={() => navigate('/')}>
                        ← Back to Products
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', marginTop: '20px' },
    card: { display: 'flex', gap: '32px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', padding: '24px', maxWidth: '800px', width: '100%' },
    image: { width: '280px', height: '280px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#f5f5f5', flexShrink: 0 },
    details: { flex: 1 },
    category: { fontSize: '13px', color: '#888', marginBottom: '6px' },
    name: { fontSize: '22px', fontWeight: '600', color: '#1a1a1a', marginBottom: '10px' },
    description: { fontSize: '14px', color: '#555', marginBottom: '16px', lineHeight: '1.6' },
    price: { fontSize: '26px', fontWeight: 'bold', color: '#1a56a0', marginBottom: '8px' },
    stock: { fontSize: '13px', color: '#2e7d32', marginBottom: '16px' },
    quantityRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
    label: { fontSize: '14px', color: '#555' },
    qtyInput: { width: '70px', padding: '6px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
    message: { color: 'green', marginBottom: '10px', fontSize: '14px' },
    btn: { width: '100%', padding: '12px', backgroundColor: '#1a56a0', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '10px' },
    backBtn: { width: '100%', padding: '10px', backgroundColor: 'white', color: '#1a56a0', border: '1px solid #1a56a0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }
};

export default ProductDetail;