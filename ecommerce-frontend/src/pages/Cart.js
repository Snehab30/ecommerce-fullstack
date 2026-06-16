import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, addToCart, placeOrder } from '../services/api';
import { useApp } from '../context/AppContext';

function Cart() {
    const { user } = useApp();
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await getCart(user.userId);
            setCart(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleRemove = async (cartItemId) => {
        await removeFromCart(cartItemId);
        fetchCart();
    };

    const handleIncrease = async (item) => {
        await addToCart({ userId: user.userId, productId: item.product.id, quantity: 1 });
        fetchCart();
    };

    const handleDecrease = async (item) => {
        if (item.quantity <= 1) {
            await removeFromCart(item.id);
        } else {
            await addToCart({ userId: user.userId, productId: item.product.id, quantity: -1 });
        }
        fetchCart();
    };

    const getTotal = () => {
        if (!cart?.cartItems) return 0;
        return cart.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    };

    const getItemCount = () => {
        if (!cart?.cartItems) return 0;
        return cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    };

    const handlePlaceOrder = async () => {
        if (!address.trim()) { setMessage('❌ Please enter a delivery address'); return; }
        try {
            await placeOrder({ userId: String(user.userId), address });
            setMessage('✅ Order placed successfully! Redirecting...');
            setTimeout(() => navigate('/orders'), 2000);
        } catch { setMessage('❌ Failed to place order. Cart may be empty.'); }
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading cart...</p>;

    if (!cart?.cartItems?.length) return (
        <div style={s.empty}>
            <span style={s.emptyIcon}>🛒</span>
            <h2 style={s.emptyTitle}>Your cart is empty!</h2>
            <p style={s.emptyDesc}>Looks like you haven't added anything yet</p>
            <button style={s.shopBtn} onClick={() => navigate('/products')}>Browse Products</button>
        </div>
    );

    return (
        <div style={s.page}>
            <div style={s.container}>

                {/* Left — cart items */}
                <div style={s.left}>
                    <h2 style={s.title}>My Cart ({getItemCount()} items)</h2>

                    {cart.cartItems.map(item => (
                        <div key={item.id} style={s.card}>
                            <div style={s.imgBox}>
                                <img src={item.product.imageUrl} alt={item.product.name} style={s.img} onError={e => e.target.style.display = 'none'} />
                            </div>
                            <div style={s.info}>
                                <p style={s.itemCat}>{item.product.category?.name}</p>
                                <h3 style={s.itemName}>{item.product.name}</h3>
                                <p style={s.itemPrice}>₹{Number(item.product.price).toLocaleString('en-IN')}</p>
                                <p style={s.itemSubtotal}>
                                    Subtotal: <strong>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</strong>
                                </p>
                            </div>
                            <div style={s.right}>
                                <div style={s.qtyRow}>
                                    <button style={s.qtyBtn} onClick={() => handleDecrease(item)}>−</button>
                                    <span style={s.qtyNum}>{item.quantity}</span>
                                    <button style={s.qtyBtn} onClick={() => handleIncrease(item)}>+</button>
                                </div>
                                <button style={s.removeBtn} onClick={() => handleRemove(item.id)}>
                                    🗑 Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right — order summary */}
                <div style={s.summary}>
                    <h3 style={s.summaryTitle}>Order Summary</h3>

                    <div style={s.summaryRow}>
                        <span>Items ({getItemCount()})</span>
                        <span>₹{getTotal().toLocaleString('en-IN')}</span>
                    </div>
                    <div style={s.summaryRow}>
                        <span>Delivery</span>
                        <span style={{ color: '#2e7d32' }}>{getTotal() > 999 ? 'FREE' : '₹99'}</span>
                    </div>
                    <div style={s.divider} />
                    <div style={{ ...s.summaryRow, fontWeight: '700', fontSize: '18px' }}>
                        <span>Total</span>
                        <span>₹{(getTotal() + (getTotal() > 999 ? 0 : 99)).toLocaleString('en-IN')}</span>
                    </div>

                    {getTotal() <= 999 && (
                        <p style={s.freeMsg}>Add ₹{(999 - getTotal()).toLocaleString('en-IN')} more for FREE delivery!</p>
                    )}

                    <div style={s.divider} />

                    <p style={s.addressLabel}>Delivery Address</p>
                    <textarea
                        style={s.addressInput}
                        placeholder="Enter your full delivery address..."
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        rows={3}
                    />

                    {message && (
                        <p style={{ ...s.msg, color: message.startsWith('✅') ? '#2e7d32' : '#c62828' }}>
                            {message}
                        </p>
                    )}

                    <button style={s.orderBtn} onClick={handlePlaceOrder}>
                        Place Order →
                    </button>
                    <button style={s.continueBtn} onClick={() => navigate('/products')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { background: '#f4f6f9', minHeight: '100vh', padding: '24px' },
    container: { display: 'flex', gap: '24px', maxWidth: '1100px', margin: '0 auto', flexWrap: 'wrap' },
    left: { flex: 1, minWidth: '300px' },
    title: { fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' },
    card: { background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '16px', marginBottom: '12px', display: 'flex', gap: '14px', alignItems: 'center' },
    imgBox: { width: '90px', height: '90px', background: '#f0f4ff', borderRadius: '8px', flexShrink: 0, overflow: 'hidden' },
    img: { width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px' },
    info: { flex: 1 },
    itemCat: { fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '3px' },
    itemName: { fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' },
    itemPrice: { fontSize: '15px', color: '#1a56a0', fontWeight: '600', marginBottom: '4px' },
    itemSubtotal: { fontSize: '12px', color: '#888' },
    right: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
    qtyRow: { display: 'flex', alignItems: 'center', gap: '0', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' },
    qtyBtn: { width: '32px', height: '32px', background: '#f5f5f5', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#333' },
    qtyNum: { width: '36px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' },
    removeBtn: { fontSize: '12px', color: '#c62828', background: '#ffebee', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' },
    summary: { width: '300px', background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '20px', height: 'fit-content', flexShrink: 0 },
    summaryTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555', marginBottom: '10px' },
    divider: { borderTop: '1px solid #eee', margin: '14px 0' },
    freeMsg: { fontSize: '12px', color: '#f57c00', background: '#fff8e1', padding: '8px', borderRadius: '6px', marginTop: '8px' },
    addressLabel: { fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '8px' },
    addressInput: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '12px' },
    msg: { fontSize: '13px', marginBottom: '10px', textAlign: 'center' },
    orderBtn: { width: '100%', padding: '12px', background: '#1a56a0', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '10px' },
    continueBtn: { width: '100%', padding: '10px', background: 'white', color: '#1a56a0', border: '1px solid #1a56a0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
    empty: { textAlign: 'center', padding: '80px 24px' },
    emptyIcon: { fontSize: '64px', display: 'block', marginBottom: '16px' },
    emptyTitle: { fontSize: '22px', fontWeight: '700', color: '#333', marginBottom: '8px' },
    emptyDesc: { fontSize: '14px', color: '#888', marginBottom: '24px' },
    shopBtn: { padding: '12px 28px', background: '#1a56a0', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }
};

export default Cart;