import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, searchProducts, getProductsByCategory, addToCart } from '../services/api';
import { useApp } from '../context/AppContext';

const CATEGORIES = [
    { id: null, name: 'All' },
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Books' },
    { id: 4, name: 'Home & Kitchen' }
];

function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortBy, setSortBy] = useState('default');
    const [loading, setLoading] = useState(true);
    const [cartMsg, setCartMsg] = useState({});
    const { user } = useApp();
    const navigate = useNavigate();

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await getAllProducts();
            setProducts(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSearch = async (e) => {
        const val = e.target.value;
        setSearch(val);
        setActiveCategory(null);
        if (val.trim() === '') { fetchProducts(); return; }
        const res = await searchProducts(val);
        setProducts(res.data);
    };

    const handleCategory = async (catId) => {
        setActiveCategory(catId);
        setSearch('');
        setLoading(true);
        if (catId === null) { fetchProducts(); return; }
        const res = await getProductsByCategory(catId);
        setProducts(res.data);
        setLoading(false);
    };

    const handleAddToCart = async (e, product) => {
        e.stopPropagation();
        if (!user) { navigate('/login'); return; }
        try {
            await addToCart({ userId: user.userId, productId: product.id, quantity: 1 });
            setCartMsg({ [product.id]: '✅ Added!' });
            setTimeout(() => setCartMsg({}), 2000);
        } catch { setCartMsg({ [product.id]: '❌ Failed' }); }
    };

    const sorted = [...products].sort((a, b) => {
        if (sortBy === 'low') return a.price - b.price;
        if (sortBy === 'high') return b.price - a.price;
        return 0;
    });

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh' }}>

            {/* Header */}
            <div style={s.header}>
                <h1 style={s.headerTitle}>All Products</h1>
                <input
                    style={s.searchInput}
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            {/* Category tabs */}
            <div style={s.catRow}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        style={{ ...s.catBtn, ...(activeCategory === cat.id ? s.catActive : {}) }}
                        onClick={() => handleCategory(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
                <select style={s.sort} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="default">Sort: Default</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                </select>
            </div>

            {/* Products grid */}
            <div style={s.content}>
                <p style={s.count}>{sorted.length} products found</p>

                {loading ? (
                    <p style={s.center}>Loading products...</p>
                ) : sorted.length === 0 ? (
                    <p style={s.center}>No products found.</p>
                ) : (
                    <div style={s.grid}>
                        {sorted.map(product => (
                            <div
                                key={product.id}
                                style={s.card}
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <div style={s.imgBox}>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={s.img}
                                        onError={e => e.target.style.display = 'none'}
                                    />
                                </div>
                                <div style={s.cardBody}>
                                    <p style={s.cardCat}>{product.category?.name}</p>
                                    <h3 style={s.cardName}>{product.name}</h3>
                                    <p style={s.cardDesc}>{product.description?.slice(0, 50)}...</p>
                                    <div style={s.cardBottom}>
                                        <p style={s.cardPrice}>₹{Number(product.price).toLocaleString('en-IN')}</p>
                                        <p style={{ ...s.stock, color: product.stockQuantity > 0 ? '#2e7d32' : '#c62828' }}>
                                            {product.stockQuantity > 0 ? `In stock` : 'Out of stock'}
                                        </p>
                                    </div>
                                    <button
                                        style={{ ...s.addBtn, ...(product.stockQuantity === 0 ? s.disabled : {}) }}
                                        onClick={e => handleAddToCart(e, product)}
                                        disabled={product.stockQuantity === 0}
                                    >
                                        {cartMsg[product.id] || '🛒 Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const s = {
    header: { background: '#1a56a0', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
    headerTitle: { color: 'white', fontSize: '22px', fontWeight: '700' },
    searchInput: { padding: '10px 16px', borderRadius: '8px', border: 'none', fontSize: '14px', width: '300px', outline: 'none' },
    catRow: { display: 'flex', gap: '8px', padding: '14px 28px', background: 'white', borderBottom: '1px solid #eee', flexWrap: 'wrap', alignItems: 'center' },
    catBtn: { padding: '6px 16px', borderRadius: '99px', border: '1px solid #ddd', background: 'white', color: '#555', fontSize: '13px', cursor: 'pointer' },
    catActive: { background: '#1a56a0', color: 'white', border: '1px solid #1a56a0' },
    sort: { marginLeft: 'auto', padding: '6px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px', color: '#555' },
    content: { padding: '24px 28px' },
    count: { fontSize: '14px', color: '#888', marginBottom: '16px' },
    center: { textAlign: 'center', padding: '60px', color: '#888' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
    card: { background: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden', cursor: 'pointer' },
    imgBox: { width: '100%', height: '180px', background: '#f0f4ff', overflow: 'hidden' },
    img: { width: '100%', height: '180px', objectFit: 'cover' },
    cardBody: { padding: '14px' },
    cardCat: { fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' },
    cardName: { fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' },
    cardDesc: { fontSize: '12px', color: '#888', marginBottom: '10px', lineHeight: '1.4' },
    cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    cardPrice: { fontSize: '18px', fontWeight: '700', color: '#1a56a0' },
    stock: { fontSize: '11px', fontWeight: '500' },
    addBtn: { width: '100%', padding: '9px', background: '#1a56a0', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
    disabled: { background: '#ccc', cursor: 'not-allowed' }
};

export default Products;