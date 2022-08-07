const express = require('express');
const delay = require('express-delay');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const logService = require('./utils/logService');
// const requireAuth = require('./middlewares/requireAuth');

const app = express();

const RESPONSE_DELAY_DURATION_MILIS = 1000;

app.use(bodyParser.json());

app.use(delay(RESPONSE_DELAY_DURATION_MILIS));

app.use('/api/account', authRoutes);

//more auth here if needed
app.listen(3000, () => {
  logService.log('Listening on port 3000');
});
