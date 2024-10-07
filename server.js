// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dominos = require('node-dominos-pizza-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to fetch menu items based on postal code
app.post('/menu', async (req, res) => {
    const { postalCode } = req.body;

    try {
        const stores = await dominos.stores.findStores({ postalCode });
        if (!stores || stores.length === 0) {
            return res.status(404).json({ message: 'No stores found in your area.' });
        }

        // Fetch menu for the first available store
        const storeId = stores[0].storeId;
        const menu = await dominos.menus.getMenu(storeId);
        res.json(menu);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching menu items.' });
    }
});

// Endpoint to handle orders
app.post('/order', async (req, res) => {
    const { selectedItems, paymentMethod, storeId } = req.body;

    try {
        // Create order object
        const order = {
            items: selectedItems.map(item => ({
                id: item.id,
                quantity: 1, // Set default quantity to 1 for each item
            })),
            payment: {
                method: paymentMethod,
            },
            storeId: storeId, // Store ID for the order
        };

        // Here you would typically send the order to the Domino's API
        // For this mock, we'll simulate order placement
        console.log('Order:', order);
        
        res.json({ message: 'Order placed successfully!', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error placing order.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
