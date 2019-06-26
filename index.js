'use strict';

/**
 * @fileOverview index.js
 *
 * @author Motone Adachi (@waritocomatta)
 * @version 1.0.0
 */

require('dotenv').config();
const http = require('http');
const { RTMClient, WebClient } = require('@slack/client');
const rtmClient = new RTMClient(process.env.TOKEN);
const webClient = new WebClient(process.env.TOKEN);

// Slack Current Channel Monitoring.
rtmClient.on('message', event => {
  // is there text?
  if (!('text' in event)) {
    return;
  }

  // Validation
  if (!(event.text.match(/^:dachshund:( |)([0-9]|[０-９])+$/))) {
    return;
  }

  const bodyCount = parseFloat(event.text.split('dachshund:')[1].trim().replace(/[Ａ-Ｚａ-ｚ０-９]/g, str => {
    return String.fromCharCode(str.charCodeAt(0) - 65248);
  }));

  // Generate
  let dachshund = ':dachshund-backend:';
  for (let i = 0; i < bodyCount; i++) {
    dachshund += ':dachshund-body:';
  }
  dachshund += ':dachshund-frontend:';

  // Reply
  webClient.chat.postMessage({
    channel: event.channel,
    text: dachshund,
    username: process.env.USERNAME,
    icon_emoji: `:dachshund:`
  });
});
rtmClient.start();

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('Dachshund Generator on Slack. 🐕🐕🐕');
  res.end();
}).listen(process.env.PORT, '0.0.0.0', () => console.log(`Server running at ${process.env.PORT}`));
