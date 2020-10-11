const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const app = express();

mongoose.set('useFindAndModify', false);
app.use(express.json({ extended: true }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/wallet', require('./routes/wallet.routes'));
app.use('/api/income-category', require('./routes/incomeCategory.routes'));
app.use('/api/expense-category', require('./routes/expenseCategory.routes'));
app.use('/api/income', require('./routes/income.routes'));
app.use('/api/expense', require('./routes/expense.routes'));
app.use('/api/transfer', require('./routes/transfer.routes'));

const PORT = process.env.PORT || config.get('port');

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
