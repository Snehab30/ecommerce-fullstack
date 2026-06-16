import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function Navbar() {
    const { user, logout } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <nav style={s.nav}>
            <Link to="/" style={s.brand}>🛒 ShopEasy</Link>
            <div style={s.links}>
                <Link to="/" style={s.link}>Home</Link>
                <Link to="/products" style={s.link}>Products</Link>
                {user ? (
                    <>
                        <Link to="/cart" style={s.link}>🛒 Cart</Link>
                        <Link to="/orders" style={s.link}>My Orders</Link>
                        <span style={s.username}>Hi, {user.name}!</span>
                        <button onClick={handleLogout} style={s.btn}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={s.link}>Login</Link>
                        <Link to="/register" style={s.link}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const s = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 28px', backgroundColor: '#1a56a0', color: 'white' },
    brand: { color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: 'bold' },
    links: { display: 'flex', alignItems: 'center', gap: '20px' },
    link: { color: 'white', textDecoration: 'none', fontSize: '14px' },
    username: { color: '#b5d4f4', fontSize: '14px' },
    btn: { backgroundColor: 'white', color: '#1a56a0', border: 'none', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }
};

export default Navbar;