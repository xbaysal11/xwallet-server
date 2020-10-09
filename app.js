const express = require('express');
const config = require('config');

const app = express();

const PORT = config.get('port') || 8080;

app.listen(PORT, () => console.log(`PORT ${PORT}`));

