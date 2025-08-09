import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Divider, List, ListItem, ListItemText, Checkbox, FormControlLabel } from '@mui/material';
import { apiFetch } from '../api';

function ReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, user } = location.state || {};
  const [shippingAddress, setShippingAddress] = React.useState('');
  const [deliveryAddress, setDeliveryAddress] = React.useState('');
  const [sameAsShipping, setSameAsShipping] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvv, setCardCvv] = React.useState('');
  const [upiId, setUpiId] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let paymentInfo = '';
      if (paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') {
        paymentInfo = `${paymentMethod}: ${cardNumber}, Expiry: ${cardExpiry}, CVV: ${cardCvv}`;
      } else if (paymentMethod === 'UPI') {
        paymentInfo = `UPI: ${upiId}`;
      }
      // Align with backend checkout: POST /orders/checkout (auth required)
      const payload = {
        // Optional: shippingAddressId, paymentMethod: 'cod'
        paymentMethod: 'cod',
        metadata: {
          uiPaymentInfo: paymentInfo,
          uiShippingAddress: shippingAddress,
          uiDeliveryAddress: deliveryAddress,
          uiCartSnapshot: Array.isArray(cart) ? cart : [],
        },
      };
      const order = await apiFetch('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setLoading(false);
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      setError(err.message || 'Order failed');
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (sameAsShipping) {
      setDeliveryAddress(shippingAddress);
    }
  }, [sameAsShipping, shippingAddress]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Review & Complete Your Order
      </Typography>
      <form onSubmit={handleSubmit}>
        <Divider sx={{ marginY: 2 }} />
        <Typography variant="h6" sx={{ mt: 2 }}>Shipping Address</Typography>
        <input
          type="text"
          placeholder="Enter shipping address"
          value={shippingAddress}
          onChange={e => setShippingAddress(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ mr: 2 }}>Delivery Address</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={sameAsShipping}
                onChange={e => setSameAsShipping(e.target.checked)}
                color="primary"
              />
            }
            label="Same as shipping address"
          />
        </Box>
        <input
          type="text"
          placeholder="Enter delivery address"
          value={deliveryAddress}
          onChange={e => setDeliveryAddress(e.target.value)}
          required
          disabled={sameAsShipping}
          style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 4, border: '1px solid #ccc', background: sameAsShipping ? '#f5f5f5' : '#fff' }}
        />
        <Typography variant="h6">Payment Method</Typography>
        <select
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="" disabled>Select payment method</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="UPI">UPI</option>
        </select>
        {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
          <>
            <Typography variant="subtitle1">Card Number</Typography>
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <Typography variant="subtitle1">Expiry Date</Typography>
            <input
              type="text"
              placeholder="MM/YY"
              value={cardExpiry}
              onChange={e => setCardExpiry(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <Typography variant="subtitle1">CVV</Typography>
            <input
              type="password"
              placeholder="CVV"
              value={cardCvv}
              onChange={e => setCardCvv(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </>
        )}
        {paymentMethod === 'UPI' && (
          <>
            <Typography variant="subtitle1">UPI ID</Typography>
            <input
              type="text"
              placeholder="yourupi@bank"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </>
        )}
        <Divider sx={{ marginY: 2 }} />
        <Typography variant="h6">Order Items</Typography>
        <List>
          {cart?.map((item, i) => (
            <ListItem key={i}>
              <ListItemText primary={item.name} secondary={`₹${item.price}`} />
            </ListItem>
          ))}
        </List>
        {error && <Typography color="error">{error}</Typography>}
        <button type="submit" disabled={loading} style={{ marginTop: 24, padding: '8px 24px', fontWeight: 'bold', background: '#ffd814', color: '#232f3e', border: 'none', borderRadius: 4 }}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </Box>
  );
}

export default ReviewPage;
