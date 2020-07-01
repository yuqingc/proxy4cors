'use strict';

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')
const { formatTime, styledTextGenerator, statusText } = require('./utils');

const timeText = styledTextGenerator('yellow');
const methodText = styledTextGenerator('cyan', 'bold');

const { port, target } = require('./config.json')

if (!port) {
  console.error('ERROR: port is not provided in config.json')
  process.exit(1)
}

if (!target) {
  console.error('ERROR: target URL is not provided in config.json')
  process.exit(1)
}

const app = express();

app.use(cors())

app.use('/*', createProxyMiddleware({
  target,
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[${timeText(formatTime(new Date()))}] ${statusText(proxyRes.statusCode)} ${methodText(req.method)} ${req.url}`)
  }
}));

app.listen(port, () => {
  console.log(`Application is listening to ${port}...`)
});
