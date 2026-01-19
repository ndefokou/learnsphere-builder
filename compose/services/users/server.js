const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const port = Number(process.env.PORT || 3001);
const serviceName = process.env.SERVICE_NAME || 'users';

const logDir = '/var/log/app';
try { fs.mkdirSync(logDir, { recursive: true }); } catch {}
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok', service: serviceName }));
app.get('/', (req, res) => res.json({ service: serviceName, users: [{ id: 1, name: 'Ada' }, { id: 2, name: 'Linus' }] }));

app.listen(port, () => console.log(`[${serviceName}] listening on ${port}`));
