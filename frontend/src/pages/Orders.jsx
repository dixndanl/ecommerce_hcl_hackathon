import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`http://localhost:3001/api/orders?email=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch orders');
        setLoading(false);
      });
  }, [user]);

  const handleCancel = async (orderId) => {
    if (!user) return;
    setCancelling(orderId);
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      if (!res.ok) {
        setError('Failed to cancel order');
      } else {
        const ordersRes = await fetch(`http://localhost:3001/api/orders?email=${encodeURIComponent(user.email)}`);
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      }
    } catch {
      setError('Failed to cancel order');
    } finally {
      setCancelling('');
    }
  };

  if (!user) return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Alert severity="info">Please login to view your orders.</Alert>
    </Container>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#232f3e', mb: 2 }}>Order History</Typography>
      {loading && <Alert severity="info">Loading...</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !orders.length && <Alert severity="info">No orders found.</Alert>}
      <List>
        {orders.map((order) => (
          <ListItem key={order.id} alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2, boxShadow: 1, borderRadius: 2, background: '#fff' }}>
            <Typography variant="subtitle2" sx={{ color: '#555', mb: 1 }}>Date: {new Date(order.date).toLocaleString()}</Typography>
            <List sx={{ width: '100%' }}>
              {order.items.map((item, i) => (
                <ListItem key={i} sx={{ pl: 0 }}>
                  <ListItemText primary={item.name} secondary={`₹${item.price}`} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 1, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                disabled={cancelling === order.id}
                onClick={() => handleCancel(order.id)}
              >
                {cancelling === order.id ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Orders;
