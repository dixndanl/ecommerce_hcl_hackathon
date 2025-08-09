import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { apiFetch } from '../api';

function Profile({ user }) {
  const [name, setName] = React.useState(user?.name || '');
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  if (!user) return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Alert severity="info">Please login to view your profile.</Alert>
    </Container>
  );

  const handleSave = async () => {
    setError('');
    setMessage('');
    try {
      const { user: updated } = await apiFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, phone })
      });
      localStorage.setItem('user', JSON.stringify(updated));
      setMessage('Profile updated');
    } catch (err) {
      setError(err.message || 'Failed to update');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, background: '#fff', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#232f3e', mb: 1 }}>My Profile</Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Typography variant="body2">Email: {user.email}</Typography>
        <Button variant="contained" onClick={handleSave} sx={{ background: '#ffd814', color: '#232f3e', fontWeight: 'bold', '&:hover': { background: '#f7ca00' } }}>Save</Button>
      </Box>
    </Container>
  );
}

export default Profile;
