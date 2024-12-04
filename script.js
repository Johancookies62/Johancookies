document.getElementById('addFlavor').addEventListener('click', function () {
    const flavorsSection = document.getElementById('flavors-section');
    const flavorWrapper = document.createElement('div');
    flavorWrapper.classList.add('flavor-wrapper');
    flavorWrapper.innerHTML = `
        <select name="flavor" required>
            <option value="Nastar">Nastar</option>
            <option value="Kaastengel">Kaastengel</option>
            <option value="Sagu Keju">Sagu Keju</option>
            <option value="Strawberry">Strawberry</option>
            <option value="Rainbow Crispy">Rainbow Crispy</option>
            <option value="Choco Cheese">Choco Cheese</option>
            <option value="Cheese Button">Cheese Button</option>
            <option value="Fun Cookies">Fun Cookies</option>
            <option value="Cornflakes Cranberry">Cornflakes Cranberry</option>
            <option value="Black Snowball">Black Snowball</option>
            <option value="Kaastengel Premium">Kaastengel Premium</option>
            <option value="Semprit">Semprit</option>
        </select>
        <input type="number" name="quantity" min="1" max="200" required placeholder="Quantity" />
        <button type="button" onclick="this.parentElement.remove()">Remove</button>
    `;
    flavorsSection.appendChild(flavorWrapper);
});

// Set the order date dynamically when the page loads
window.onload = function() {
    const currentDate = new Date().toISOString().split('T')[0];  // Current date in YYYY-MM-DD format
    document.getElementById('date').value = currentDate;  // Set the date field value
};

document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Prepare form data to be sent to the server
    const formData = new FormData(this);
    document.getElementById('errorMessage').textContent = '';
    document.getElementById('successMessage').textContent = '';

    // Collect all the flavor and quantity pairs
    let flavorsData = [];
    const flavors = document.querySelectorAll('select[name="flavor"]');
    const quantities = document.querySelectorAll('input[name="quantity"]');

    for (let i = 0; i < flavors.length; i++) {
        let flavor = flavors[i].value;
        let quantity = quantities[i].value;
        flavorsData.push(`${flavor}: ${quantity}`);
    }

    // Add the flavors data to the FormData
    formData.append('flavors', flavorsData.join(', '));

    // Collect the sticker option
    const stickerOption = document.querySelector('input[name="stickerOption"]:checked');
    if (stickerOption) {
        formData.append('stickerOption', stickerOption.value);
    } else {
        formData.append('stickerOption', 'No'); // Default to "No" if not selected
    }
  
    // Send the data to Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbyqAj1XyHBzP5cI-E3-e7_6K7L-UGpPTG-553PMXQt8TwMZw3fZBKiqILuUv9offAGw/exec: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            document.getElementById('orderFormContainer').style.display = 'none';  // Hide the order form
            document.getElementById('orderSection').style.display = 'block';  // Show the order success section
        } else {
            document.getElementById('errorMessage').textContent = 'Error: ' + result.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('errorMessage').textContent = 'An error occurred while submitting the order.';
    });
});

// "Go Back" Button functionality
document.getElementById('goBack').addEventListener('click', function () {
    document.getElementById('orderFormContainer').style.display = 'block';  // Show the order form again
    document.getElementById('orderSection').style.display = 'none';  // Hide the order success section
});
