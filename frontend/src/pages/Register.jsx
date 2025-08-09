import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';


function Register({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/products');
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, boxShadow: 3, borderRadius: 2, background: '#fff' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#232f3e', mb: 1 }}>Register</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} required fullWidth />
        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth />
        <Button type="submit" variant="contained" disabled={loading} sx={{ background: '#ffd814', color: '#232f3e', fontWeight: 'bold', '&:hover': { background: '#f7ca00' } }}>{loading ? 'Registering...' : 'Register'}</Button>
      </Box>
    </Container>
  );
}

export default Register;
