const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

const app = express();
const port = Number(process.env.PORT || 8080);
const serviceName = process.env.SERVICE_NAME || 'gateway';

const logDir = '/var/log/app';
try { fs.mkdirSync(logDir, { recursive: true }); } catch {}
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: serviceName, time: new Date().toISOString() });
});

const route = (prefix, target) => {
  if (!target) return;
  app.use(prefix, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (p) => p.replace(new RegExp(`^${prefix}`), ''),
  }));
};

route('/users', process.env.ROUTE_USERS || 'http://users:3001');
route('/courses', process.env.ROUTE_COURSES || 'http://courses:3002');
route('/videos', process.env.ROUTE_VIDEOS || 'http://videos:3003');

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: serviceName,
    routes: ['/health', '/users', '/courses', '/videos'],
    time: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`[${serviceName}] listening on ${port}`);
});
