import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/api';

const CATEGORIES = [
    { name: 'Electronics', icon: '💻', id: 1 },
    { name: 'Clothing', icon: '👕', id: 2 },
    { name: 'Books', icon: '📚', id: 3 },
    { name: 'Home & Kitchen', icon: '🏠', id: 4 }
];

const FEATURES = [
    { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹999' },
    { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
    { icon: '🔒', title: 'Secure Payment', desc: '100% safe checkout' },
    { icon: '🎧', title: '24/7 Support', desc: 'Always here to help' }
];

function Home() {
    const navigate = useNavigate();
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        getAllProducts().then(res => setFeatured(res.data.slice(0, 4))).catch(console.error);
    }, []);

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh' }}>

            {/* Hero */}
            <div style={s.hero}>
                <div style={s.heroContent}>
                    <h1 style={s.heroTitle}>Shop Everything You Love</h1>
                    <p style={s.heroSub}>Discover thousands of products from top brands at unbeatable prices</p>
                    <div style={s.heroBtns}>
                        <button style={s.primaryBtn} onClick={() => navigate('/products')}>
                            Shop Now →
                        </button>
                        <button style={s.secondaryBtn} onClick={() => navigate('/register')}>
                            Join Free
                        </button>
                    </div>
                </div>
                <div style={s.heroCard}>
                    <div style={s.heroStat}><span style={s.statNum}>9+</span><span style={s.statLabel}>Products</span></div>
                    <div style={s.heroStat}><span style={s.statNum}>4</span><span style={s.statLabel}>Categories</span></div>
                    <div style={s.heroStat}><span style={s.statNum}>24/7</span><span style={s.statLabel}>Support</span></div>
                </div>
            </div>

            {/* Categories */}
            <div style={s.section}>
                <h2 style={s.sectionTitle}>Shop by Category</h2>
                <div style={s.catGrid}>
                    {CATEGORIES.map(cat => (
                        <div
                            key={cat.id}
                            style={s.catCard}
                            onClick={() => navigate('/products')}
                        >
                            <span style={s.catIcon}>{cat.icon}</span>
                            <p style={s.catName}>{cat.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Products */}
            <div style={{ ...s.section, background: 'white' }}>
                <div style={s.sectionHeader}>
                    <h2 style={s.sectionTitle}>Featured Products</h2>
                    <button style={s.viewAll} onClick={() => navigate('/products')}>View All →</button>
                </div>
                <div style={s.featGrid}>
                    {featured.map(product => (
                        <div
                            key={product.id}
                            style={s.featCard}
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            <div style={s.featImgBox}>
                                <img src={product.imageUrl} alt={product.name} style={s.featImg} onError={e => e.target.style.display = 'none'} />
                            </div>
                            <p style={s.featCat}>{product.category?.name}</p>
                            <p style={s.featName}>{product.name}</p>
                            <p style={s.featPrice}>₹{Number(product.price).toLocaleString('en-IN')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why us */}
            <div style={s.section}>
                <h2 style={s.sectionTitle}>Why Shop With Us?</h2>
                <div style={s.featGrid}>
                    {FEATURES.map(f => (
                        <div key={f.title} style={s.featureCard}>
                            <span style={s.featureIcon}>{f.icon}</span>
                            <p style={s.featureTitle}>{f.title}</p>
                            <p style={s.featureDesc}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Banner */}
            <div style={s.banner}>
                <h2 style={s.bannerTitle}>Ready to start shopping?</h2>
                <p style={s.bannerSub}>Join thousands of happy customers today</p>
                <button style={s.primaryBtn} onClick={() => navigate('/products')}>
                    Browse All Products →
                </button>
            </div>

            {/* Footer */}
            <div style={s.footer}>
                <p>© 2025 ShopEasy. Built with Spring Boot + React.</p>
            </div>
        </div>
    );
}

const s = {
    hero: { background: 'linear-gradient(135deg, #1a56a0 0%, #0c447c 100%)', padding: '60px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' },
    heroContent: { flex: 1, minWidth: '260px' },
    heroTitle: { color: 'white', fontSize: '32px', fontWeight: '700', marginBottom: '12px', lineHeight: '1.3' },
    heroSub: { color: '#b5d4f4', fontSize: '15px', marginBottom: '28px', lineHeight: '1.6' },
    heroBtns: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
    primaryBtn: { padding: '12px 28px', background: 'white', color: '#1a56a0', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
    secondaryBtn: { padding: '12px 28px', background: 'transparent', color: 'white', border: '2px solid white', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
    heroCard: { display: 'flex', gap: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px 32px' },
    heroStat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
    statNum: { color: 'white', fontSize: '28px', fontWeight: '700' },
    statLabel: { color: '#b5d4f4', fontSize: '13px' },
    section: { padding: '40px 28px' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    sectionTitle: { fontSize: '22px', fontWeight: '700', color: '#1a1a1a', marginBottom: '24px' },
    viewAll: { background: 'none', border: 'none', color: '#1a56a0', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    catGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' },
    catCard: { background: 'white', borderRadius: '12px', padding: '24px 16px', textAlign: 'center', cursor: 'pointer', border: '1px solid #eee', transition: 'transform 0.2s' },
    catIcon: { fontSize: '32px', display: 'block', marginBottom: '10px' },
    catName: { fontSize: '14px', fontWeight: '600', color: '#333' },
    featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
    featCard: { background: '#f8f9ff', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #eee' },
    featImgBox: { width: '100%', height: '140px', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    featImg: { width: '100%', height: '140px', objectFit: 'cover' },
    featCat: { fontSize: '10px', color: '#888', padding: '10px 12px 2px', textTransform: 'uppercase' },
    featName: { fontSize: '13px', fontWeight: '600', color: '#1a1a1a', padding: '0 12px 4px' },
    featPrice: { fontSize: '16px', fontWeight: '700', color: '#1a56a0', padding: '0 12px 12px' },
    featureCard: { background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center', border: '1px solid #eee' },
    featureIcon: { fontSize: '32px', display: 'block', marginBottom: '10px' },
    featureTitle: { fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '6px' },
    featureDesc: { fontSize: '13px', color: '#888' },
    banner: { background: '#1a56a0', padding: '48px 28px', textAlign: 'center' },
    bannerTitle: { color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '8px' },
    bannerSub: { color: '#b5d4f4', fontSize: '14px', marginBottom: '24px' },
    footer: { background: '#0c447c', padding: '20px', textAlign: 'center', color: '#b5d4f4', fontSize: '13px' }
};

export default Home;