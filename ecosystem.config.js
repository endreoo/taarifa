module.exports = {
  apps: [{
    name: 'taarifa-api',
    script: './dist/server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
} 