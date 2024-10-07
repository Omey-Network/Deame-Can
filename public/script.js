document.getElementById('fetchMenu').addEventListener('click', async () => {
    const postalCode = document.getElementById('postalCode').value;

    const response = await fetch('http://localhost:3000/menu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postalCode })
    });

    if (response.ok) {
        const { menu, storeId } = await response.json();
        displayMenu(menu, storeId);
    } else {
        const error = await response.json();
        alert(error.message);
    }
});

function displayMenu(items, storeId) {
    const menuDiv = document.getElementById('menu');
    menuDiv.innerHTML = '';

    items.products.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <span>${item.name} - $${item.price.toFixed(2)}</span>
            <button onclick="addToOrder('${item.id}', '${item.name}', ${item.price})">Add to Order</button>
        `;
        menuDiv.appendChild(div);
    });

    // Store ID for placing an order later
    window.storeId = storeId;
}

let selectedItems = [];

function addToOrder(id, name, price) {
    selectedItems.push({ id, name, price });
    alert(`${name} added to order`);
    document.getElementById('orderButton').style.display = 'block';
}

document.getElementById('orderButton').addEventListener('click', async () => {
    const paymentMethod = 'Cash/Debit'; // Default payment method
    const response = await fetch('http://localhost:3000/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ selectedItems, paymentMethod, storeId: window.storeId })
    });
    
    const result = await response.json();
    alert(result.message);
    selectedItems = [];
    document.getElementById('orderButton').style.display = 'none';
});
