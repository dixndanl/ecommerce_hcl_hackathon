import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import { apiFetch, DEFAULT_IMAGE_URL } from '../api';

function Cart({ user }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to checkout');
      return;
    }
    // Push local cart items to backend cart as items before navigating
    try {
      for (const item of cart) {
        await apiFetch('/cart/items', {
          method: 'POST',
          body: JSON.stringify({
            productId: String(item.id),
            productTitle: item.name || item.title || 'Unknown',
            price: Number(item.price || 0),
            currency: 'INR',
            quantity: Number(item.quantity || 1),
            thumbnailUrl: item.image || DEFAULT_IMAGE_URL,
          })
        });
      }
    } catch (_err) {
      // Non-blocking; continue to review page regardless
    }
    navigate('/review', { state: { cart, user } });
  };

  const handleRemove = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  if (!cart.length) return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Alert severity="info">Your cart is empty.</Alert>
    </Container>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#232f3e', mb: 2 }}>Cart</Typography>
      <List>
        {cart.map(item => (
          <ListItem key={item.id} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(item.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={item.name} secondary={`₹${item.price}`} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="contained" sx={{ background: '#ffd814', color: '#232f3e', fontWeight: 'bold', '&:hover': { background: '#f7ca00' } }} onClick={handleCheckout}>
          Checkout
        </Button>
      </Box>
    </Container>
  );
}

export default Cart;
