import React, { useEffect, useState, useRef } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

function Products({ user }) {
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimeout = useRef(null);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => {
        setAllProducts(data);
        setProducts(data.slice(0, visibleCount));
      });
  }, []);

  useEffect(() => {
    setProducts(allProducts.slice(0, visibleCount));
  }, [allProducts, visibleCount]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100
      ) {
        setVisibleCount(prev => {
          if (prev < allProducts.length) {
            return prev + 20;
          }
          return prev;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allProducts.length]);

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please login to add to cart');
      return;
    }
    const newCart = [...cart, { ...product, quantity: 1 }];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
    alert('Added to cart!');
  };

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [search]);

  const filtered = products.filter(p =>
    (category === '' || p.category === category) &&
    (p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const grouped = filtered.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', fontFamily: 'Amazon Ember, Arial, sans-serif', color: '#232f3e' }}>
        Products
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          label="Search products..."
          variant="outlined"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ minWidth: 180 }}
        >
          <option value="">All</option>
          {[...new Set(products.map(p => p.category))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </TextField>
      </Box>
      {Object.keys(grouped).length === 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1">No products found.</Typography>
        </Box>
      )}
      {Object.entries(grouped).map(([category, items]) => (
        <Box key={category} sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2, color: '#ff9900', fontWeight: 'bold', fontFamily: 'Amazon Ember, Arial, sans-serif' }}>
            {category}
          </Typography>
          <Grid container spacing={3}>
            {items.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.image || 'https://via.placeholder.com/200x180?text=No+Image'}
                    alt={product.name}
                    sx={{ objectFit: 'contain', background: '#fff', p: 2 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      Rs {product.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ background: '#ffd814', color: '#232f3e', fontWeight: 'bold', '&:hover': { background: '#f7ca00' } }}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    {visibleCount < allProducts.length && (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, mb: 4 }}>
        <CircularProgress color="primary" />
      </Box>
    )}
    </Container>
  );
}

export default Products;
