// Add caching headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=86400');
  next();
}); 