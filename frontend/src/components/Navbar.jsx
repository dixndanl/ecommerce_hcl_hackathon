import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';    
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link as RouterLink } from 'react-router-dom';  


function Navbar({ user, onLogout }) {
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cart-updated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', updateCartCount);
    };
  });

  return (
    <AppBar position="static" sx={{ background: '#232f3e' }}>
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/products" sx={{ flexGrow: 1, color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Amazon Ember, Arial, sans-serif' }}>
          HCLify
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user && (
            <IconButton color="inherit" component={RouterLink} to="/cart">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}
          {user && <Button color="inherit" component={RouterLink} to="/orders">Orders</Button>}
          {user && <Button color="inherit" component={RouterLink} to="/profile">My Profile</Button>}
          {!user && <Button color="inherit" component={RouterLink} to="/login">Login</Button>}
          {!user && <Button color="inherit" component={RouterLink} to="/register">Register</Button>}
          {user && <Button color="inherit" onClick={() => { localStorage.removeItem('authToken'); onLogout(); }}>Logout</Button>}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
