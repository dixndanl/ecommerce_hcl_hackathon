import React from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';

function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  const handleExportPDF = () => {
    if (!order) return;
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(18);
    doc.text('Order Confirmation', 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 10, y);
    y += 8;
    doc.text(`Date: ${new Date(order.date).toLocaleString()}`, 10, y);
    y += 8;
    doc.text(`Shipping Address: ${order.shippingAddress}`, 10, y);
    y += 8;
    doc.text(`Delivery Address: ${order.deliveryAddress}`, 10, y);
    y += 8;
    doc.text(`Payment: ${order.paymentInfo}`, 10, y);
    y += 10;
    doc.text('Order Items:', 10, y);
    y += 8;
    order.items?.forEach((item, i) => {
      doc.text(`${i + 1}. ${item.name} - ₹${item.price}`, 12, y);
      y += 8;
    });
    doc.save(`order_${order.id}.pdf`);
  };

  const handleTrackOrder = () => {
    const lat = 12.9716;
    const lng = 77.5946;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <Box sx={{ padding: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom color="success.main">
        Order Confirmed!
      </Typography>
      <Divider sx={{ marginY: 2 }} />
      <Typography variant="body1" sx={{ mb: 2 }}>
        Thank you for your purchase. Your order has been placed successfully.
      </Typography>
      {order && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>Order ID: {order.id}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Date: {new Date(order.date).toLocaleString()}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Shipping Address: {order.shippingAddress || 'Not Provided'}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Delivery Address: {order.deliveryAddress || 'Not Provided'}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Payment: {order.paymentInfo || 'Not Provided'}</Typography>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="h6">Order Items</Typography>
          {order.items?.map((item, i) => (
            <Typography key={i} variant="body2">{item.name} - ${item.price}</Typography>
          ))}
          <Divider sx={{ marginY: 2 }} />
          <Button variant="outlined" sx={{ mr: 2 }} onClick={handleExportPDF}>Export PDF</Button>
          <Button variant="contained" color="primary" onClick={handleTrackOrder}>Track Order</Button>
        </>
      )}
      {!order && (
        <Typography variant="body2" color="error">Order details not found.</Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        You will receive an email with your order details and tracking information soon.
      </Typography>
    </Box>
  );
}

export default OrderConfirmation;
