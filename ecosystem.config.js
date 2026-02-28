module.exports = {
  apps: [
    {
      name: 'ecom-sepay',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      listen_timeout: 3000,
      // Graceful shutdown
      wait_ready: true,
      kill_timeout: 5000,
    },
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: 'your-domain.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/ecom-sepay.git',
      path: '/var/www/ecom-sepay',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'echo "Deploying to production..."',
    },
  },
};
