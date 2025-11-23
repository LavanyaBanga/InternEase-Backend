const app = require('./server');

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(' Test server running on http://localhost:${PORT}');
    console.log(' Test these endpoints:');
    console.log(`   - http://localhost:${PORT}/`);
    console.log(`   - http://localhost:${PORT}/api/health`);
    console.log(`   - http://localhost:${PORT}/api/github-courses`);
  });
}

module.exports = app;