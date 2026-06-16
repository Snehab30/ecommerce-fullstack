import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../services/api';
import { useApp } from '../context/AppContext';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

const STATUS_COLOR = {
    PENDING: { bg: '#fff8e1', color: '#f57c00', border: '#ffcc02' },
    CONFIRMED: { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },
    SHIPPED: { bg: '#f3e5f5', color: '#6a1b9a', border: '#ce93d8' },
    DELIVERED: { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
    CANCELLED: { bg: '#ffebee', color: '#c62828', border: '#ef9a9a' }
};

function Orders() {
    const { user } = useApp();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        getOrders(user.userId)
            .then(res => setOrders(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    const getStepIndex = (status) => STATUS_STEPS.indexOf(status);

    if (loading) return <p style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading orders...</p>;

    if (orders.length === 0) return (
        <div style={s.empty}>
            <span style={s.emptyIcon}>📦</span>
            <h2 style={s.emptyTitle}>No orders yet!</h2>
            <p style={s.emptyDesc}>Your order history will appear here</p>
            <button style={s.shopBtn} onClick={() => navigate('/products')}>Start Shopping</button>
        </div>
    );

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h2 style={s.pageTitle}>My Orders ({orders.length})</h2>

                {orders.map(order => {
                    const sc = STATUS_COLOR[order.status] || STATUS_COLOR.PENDING;
                    const isExpanded = expanded[order.id];
                    const stepIdx = getStepIndex(order.status);

                    return (
                        <div key={order.id} style={s.card}>

                            {/* Order header */}
                            <div style={s.cardHeader}>
                                <div>
                                    <p style={s.orderId}>Order #{order.id}</p>
                                    <p style={s.orderDate}>
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div style={s.headerRight}>
                                    <span style={{ ...s.statusBadge, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                                        {order.status}
                                    </span>
                                    <p style={s.totalAmt}>₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            {/* Tracking timeline */}
                            {order.status !== 'CANCELLED' && (
                                <div style={s.timeline}>
                                    {STATUS_STEPS.map((step, idx) => (
                                        <React.Fragment key={step}>
                                            <div style={s.step}>
                                                <div style={{
                                                    ...s.stepDot,
                                                    background: idx <= stepIdx ? '#1a56a0' : '#e0e0e0',
                                                    border: idx <= stepIdx ? '2px solid #1a56a0' : '2px solid #e0e0e0'
                                                }}>
                                                    {idx < stepIdx && <span style={{ color: 'white', fontSize: '10px' }}>✓</span>}
                                                    {idx === stepIdx && <span style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', display: 'block' }} />}
                                                </div>
                                                <p style={{ ...s.stepLabel, color: idx <= stepIdx ? '#1a56a0' : '#bbb' }}>{step}</p>
                                            </div>
                                            {idx < STATUS_STEPS.length - 1 && (
                                                <div style={{ ...s.stepLine, background: idx < stepIdx ? '#1a56a0' : '#e0e0e0' }} />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}

                            {/* Delivery address */}
                            <p style={s.address}>📍 {order.address}</p>

                            {/* Toggle items */}
                            <button style={s.toggleBtn} onClick={() => toggleExpand(order.id)}>
                                {isExpanded ? '▲ Hide items' : `▼ Show ${order.orderItems?.length || 0} items`}
                            </button>

                            {/* Order items */}
                            {isExpanded && (
                                <div style={s.items}>
                                    {order.orderItems?.map(item => (
                                        <div key={item.id} style={s.item}>
                                            <span style={s.itemName}>{item.product?.name}</span>
                                            <span style={s.itemQty}>× {item.quantity}</span>
                                            <span style={s.itemPrice}>₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                    <div style={s.itemDivider} />
                                    <div style={{ ...s.item, fontWeight: '700' }}>
                                        <span>Total</span>
                                        <span></span>
                                        <span style={{ color: '#1a56a0' }}>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const s = {
    page: { background: '#f4f6f9', minHeight: '100vh', padding: '24px' },
    container: { maxWidth: '780px', margin: '0 auto' },
    pageTitle: { fontSize: '22px', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px' },
    card: { background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '20px', marginBottom: '16px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
    orderId: { fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '3px' },
    orderDate: { fontSize: '13px', color: '#888' },
    headerRight: { textAlign: 'right' },
    statusBadge: { fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '99px', display: 'inline-block', marginBottom: '6px' },
    totalAmt: { fontSize: '18px', fontWeight: '700', color: '#1a56a0' },
    timeline: { display: 'flex', alignItems: 'center', marginBottom: '16px', padding: '12px 0' },
    step: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
    stepDot: { width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    stepLine: { flex: 1, height: '2px', margin: '0 4px', marginBottom: '20px' },
    stepLabel: { fontSize: '10px', fontWeight: '500', textAlign: 'center', whiteSpace: 'nowrap' },
    address: { fontSize: '13px', color: '#555', marginBottom: '12px', padding: '8px', background: '#f9f9f9', borderRadius: '6px' },
    toggleBtn: { background: 'none', border: 'none', color: '#1a56a0', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: '0', marginBottom: '12px' },
    items: { borderTop: '1px solid #eee', paddingTop: '12px' },
    item: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', color: '#555' },
    itemName: { flex: 1 },
    itemQty: { color: '#888', marginRight: '16px' },
    itemPrice: { fontWeight: '600', color: '#333' },
    itemDivider: { borderTop: '1px dashed #eee', margin: '8px 0' },
    empty: { textAlign: 'center', padding: '80px 24px' },
    emptyIcon: { fontSize: '64px', display: 'block', marginBottom: '16px' },
    emptyTitle: { fontSize: '22px', fontWeight: '700', color: '#333', marginBottom: '8px' },
    emptyDesc: { fontSize: '14px', color: '#888', marginBottom: '24px' },
    shopBtn: { padding: '12px 28px', background: '#1a56a0', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }
};

export default Orders;