// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Define MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/budget_management';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Define schema and models for Main Account, Subaccounts, and Transactions
const mainAccountSchema = new mongoose.Schema({
    totalAmount: { type: Number, required: true },
});

const subaccountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    percentage: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
});

const transactionSchema = new mongoose.Schema({
    subaccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subaccount', required: true },
    amount: { type: Number, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now }
});

const MainAccount = mongoose.model('MainAccount', mainAccountSchema);
const Subaccount = mongoose.model('Subaccount', subaccountSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes for Main Account
// Get main account balance
app.get('/api/main-account', async (req, res) => {
    try {
        const mainAccount = await MainAccount.findOne();
        res.json(mainAccount);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add money to main account
app.post('/api/main-account/add-money', async (req, res) => {
    const amount = req.body.amount;

    try {
        let mainAccount = await MainAccount.findOne();
        mainAccount.totalAmount += amount;

        // Distribute money to subaccounts based on their percentages
        const subaccounts = await Subaccount.find();
        const totalPercentage = subaccounts.reduce((acc, subaccount) => acc + subaccount.percentage, 0);
        for (let subaccount of subaccounts) {
            const share = (subaccount.percentage / totalPercentage) * amount;
            subaccount.totalAmount += share;
            await subaccount.save();
        }

        mainAccount = await mainAccount.save();
        res.status(201).json(mainAccount);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Routes for Subaccounts
// Get all subaccounts
app.get('/api/subaccounts', async (req, res) => {
    try {
        const subaccounts = await Subaccount.find();
        res.json(subaccounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new subaccount
app.post('/api/subaccounts', async (req, res) => {
    const subaccount = new Subaccount({
        name: req.body.name,
        percentage: req.body.percentage,
        totalAmount: 0, // Initially set to 0
    });

    try {
        const newSubaccount = await subaccount.save();
        res.status(201).json(newSubaccount);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Routes for Transactions
// Create a new transaction
app.post('/api/transactions', async (req, res) => {
    const transaction = new Transaction({
        subaccountId: req.body.subaccountId,
        amount: req.body.amount,
        title: req.body.title,
        category: req.body.category,
        date: req.body.date
    });

    try {
        // Deduct amount from subaccount and main account
        const subaccount = await Subaccount.findById(req.body.subaccountId);
        subaccount.totalAmount -= req.body.amount;
        await subaccount.save();

        const mainAccount = await MainAccount.findOne();
        mainAccount.totalAmount -= req.body.amount;
        await mainAccount.save();

        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));