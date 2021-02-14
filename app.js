const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

mongoose.set('useFindAndModify', false);
app.use(express.json({ extended: true }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/wallet', require('./routes/wallet.routes'));
app.use('/api/transfer', require('./routes/transfer.routes'));
app.use('/api/money-operation', require('./routes/moneyOperation.routes'));
app.use('/api/category', require('./routes/category.routes'));

const PORT = process.env.PORT || config.get('port');

const DisableTryItOutPlugin = function () {
  return {
    statePlugins: {
      spec: {
        wrapSelectors: {
          allowTryItOutFor: () => () => false,
        },
      },
    },
  };
};

const swaggerOptions = {
  swaggerDefinition: {
    plugins: [DisableTryItOutPlugin],
    info: {
      version: '1.0.0',
      title: 'xWallet REST API',
      description: 'xWallet API Information',
      contact: {
        name: 'Baisalbek Daniiarov',
        email: 'baisalbek.daniiarov@pm.me',
      },
      host: 'xwallet.herokuapp.com',
      basePath: '/',
      servers: [
        {
          url: 'http://localhost:8080/',
          description: 'Local server',
        },
        {
          url: 'https://xwallet.herokuapp.com',
          description: 'Production server',
        },
      ],
    },
  },
  apis: ['./docs/*.yaml'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log(swaggerDocs);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

async function start() {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => console.log(`PORT ${PORT}`));
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();
