import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

function Profile({ user }) {
  if (!user) return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Alert severity="info">Please login to view your profile.</Alert>
    </Container>
  );
  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, background: '#fff' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#232f3e', mb: 2 }}>My Profile</Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
      </Box>
    </Container>
  );
}

export default Profile;
