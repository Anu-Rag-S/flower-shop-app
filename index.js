const products = [
    { id: "FRR-111", name: "Radiant Roses", category: "Roses", price: 25, img: "./images/bouquet.jpg", description: "A stunning bouquet of radiant roses to brighten anyone's day.", reviews: [{ text: "Absolutely beautiful and fresh!", rating: 5 }], quantityOnHand: 20, maxPerCustomer: 4 },
    { id: "LLB-982", name: "Lovely Lilies", category: "Lilies", price: 30, img: "./images/lilies.jpg", description: "Elegant lilies that bring sophistication and beauty to any occasion.", reviews: [{ text: "Perfect for a special event, will buy again!", rating: 4 }], quantityOnHand: 20, maxPerCustomer: 4 },
    { id: "TFB-043", name: "Tulip Charm", category: "Tulips", price: 20, img: "./images/tulips.jpg", description: "Charming tulips that symbolize perfect love and cheerful thoughts.", reviews: [{ text: "The smell so good, bought them two weeks ago and they look beautiful!.", rating: 4 }], quantityOnHand: 20, maxPerCustomer: 4 },
    { id: "OOB-167", name: "Orchid Elegance", category: "Orchids", price: 35, img: "./images/orchids.jpg", description: "Exquisite orchids that convey luxury, beauty, and strength.", reviews: [{ text: "My house looks different with fresh orchids, highly recommend. Will buy again!.", rating: 5 }], quantityOnHand: 20, maxPerCustomer: 4 },
    { id: "DAS-256", name: "Dazzling Daisies", category: "Daisies", price: 22, img: "./images/Daisies.jpg", description: "Bright and cheerful daisies to bring joy to any space.", reviews: [{ text: "So fresh and beautiful! Perfect for my home.", rating: 5 }], quantityOnHand: 20, maxPerCustomer: 4  },
    { id: "SFL-789", name: "Sunflower Bliss", category: "Sunflowers", price: 28, img: "./images/sunflower bliss.jpg", description: "Radiant sunflowers that symbolize happiness and positivity.", reviews: [{ text: "Absolutely stunning! These brighten up any room.", rating: 5 }], quantityOnHand: 20, maxPerCustomer: 4 }
    
];

let cart = [];
const currencyRates = { USD: 0.75, CAD: 1 };
let selectedCurrency = "CAD";

// Display items
function displayCatalog(products) {
    const catalog = document.getElementById("catalog");
    catalog.innerHTML = "";
    products.forEach(product => {
        catalog.innerHTML += `
            <div class="product">
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name} (ID: ${product.id})</h3>
                <p>Price: ${convertCurrency(product.price)} ${selectedCurrency}</p>
                <button onclick="showProductDetails('${product.id}')">View Details</button>
                <select class="size-select" id="size-${product.id}">
                    <option value="Standard">Standard - ${convertCurrency(product.price)}</option>
                    <option value="Deluxe">Deluxe - ${convertCurrency(product.price + 10)}</option>
                    <option value="Premium">Premium - ${convertCurrency(product.price + 20)}</option>
                </select>
                <button onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
        `;
    });
}

// Show product details
function showProductDetails(productId) {
    const product = products.find(item => item.id === productId);
    const modal = document.getElementById("product-modal");
    const modalContent = document.getElementById("modal-content");

    // review section
    const reviewSection = generateReviewSection(product);

    modalContent.innerHTML = `
        <div style="max-height: 70vh; overflow-y: auto; padding-right: 10px;">
            <h2>${product.name} (ID: ${product.id})</h2>
            <img src="${product.img}" alt="${product.name}" style="width: 100%; border-radius: 10px;">
            <p>${product.description}</p>
            <p><strong>Price:</strong> ${convertCurrency(product.price)} ${selectedCurrency}</p>
            <p><strong>Quantity on Hand:</strong> ${product.quantityOnHand}</p>
            <p><strong>Max per Customer:</strong> ${product.maxPerCustomer}</p>
            <div id="review-section">
                ${reviewSection}
            </div>
        </div>
        <button onclick="closeModal()" style="margin-top: 15px; background: #ff6f61; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Close</button>
    `;
    modal.style.display = "flex";
}

// close the display of details
function closeModal() {
    const modal = document.getElementById("product-modal");
    modal.style.display = "none";
}


function generateReviewSection(product) {
    let reviewsHTML = "<h3>Reviews</h3>";

    if (product.reviews.length === 0) {
        reviewsHTML += "<p>No reviews yet. Be the first to review!</p>";
    } else {
        reviewsHTML += "<ul>";
        product.reviews.forEach(review => {
            reviewsHTML += `<li>${"⭐".repeat(review.rating)} - ${review.text}</li>`;
        });
        reviewsHTML += "</ul>";
    }

    reviewsHTML += `
        <textarea id="new-review" placeholder="Add your review here" style="width: 100%; margin-top: 10px;"></textarea>
        <label for="new-rating" style="display: block; margin-top: 10px;">Rating:</label>
        <select id="new-rating" style="width: 100%; margin-top: 5px;">
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5" selected>5 Stars</option>
        </select>
        <button onclick="addReview('${product.id}')" style="margin-top: 10px; background: #ff6f61; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer;">Submit Review</button>
    `;

    return reviewsHTML;
}

// Add a review
function addReview(productId) {
    const product = products.find(item => item.id === productId);
    const reviewText = document.getElementById("new-review").value;
    const reviewRating = parseInt(document.getElementById("new-rating").value, 10);

    if (reviewText.trim() !== "") {
        product.reviews.push({ text: reviewText.trim(), rating: reviewRating });
        showProductDetails(productId);
    } else {
        alert("Please write a review before submitting.");
    }
}

// cart
function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    const sizeElement = document.getElementById(`size-${productId}`);
    const selectedSize = sizeElement.value;
    let price = product.price;

    if (selectedSize === "Deluxe") price += 10;
    if (selectedSize === "Premium") price += 20;

    const cartItem = cart.find(item => item.id === productId && item.size === selectedSize);

    if (cartItem) {
        if (cartItem.quantity >= product.maxPerCustomer) {
            alert(`You cannot add more than ${product.maxPerCustomer} of this item to the cart.`);
            return;
        }
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, size: selectedSize, price, quantity: 1 });
    }

    displayCart();
}


function displayCart() {
    const cartContainer = document.getElementById("cart");
    cartContainer.innerHTML = "";
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty!</p>";
        return;
    }

    cart.forEach(item => {
        cartContainer.innerHTML += `
            <div class="cart-item">
                <h4>${item.name} (ID: ${item.id})</h4>
                <p>Size: ${item.size}</p>
                <p>Quantity: <input type="number" value="${item.quantity}" min="1" max="${item.maxPerCustomer}" onchange="updateQuantity('${item.id}', '${item.size}', this.value)"></p>
                <p>Price: ${convertCurrency(item.price * item.quantity)} ${selectedCurrency}</p>
                <button onclick="removeFromCart('${item.id}', '${item.size}')">Remove</button>
            </div>
        `;
    });

    displayTotals();
}

// Update quantity
function updateQuantity(productId, size, quantity) {
    const product = products.find(item => item.id === productId);
    const item = cart.find(item => item.id === productId && item.size === size);

    if (quantity > product.maxPerCustomer) {
        alert(`You cannot purchase more than ${product.maxPerCustomer} of this item.`);
        return;
    }

    item.quantity = parseInt(quantity, 10);
    displayCart();
}

// Remove from cart
function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    displayCart();
}

// Calculate totals
function calculateTotals() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.13; // 13% Tax
    const total = subtotal + tax + shipping;

    return { subtotal, tax, shipping, total };
}

// Display totals
function displayTotals() {
    const totals = calculateTotals();
    const totalsContainer = document.getElementById("totals");

    totalsContainer.innerHTML = `
        <p>Subtotal: ${convertCurrency(totals.subtotal)} ${selectedCurrency}</p>
        <p>Tax: ${convertCurrency(totals.tax)} ${selectedCurrency}</p>
        <p>Shipping: ${convertCurrency(totals.shipping)} ${selectedCurrency}</p>
        <h4>Total: ${convertCurrency(totals.total)} ${selectedCurrency}</h4>
        <button id="checkout-btn">Place Order</button>
    `;

    document.getElementById("checkout-btn").addEventListener("click", checkout);
}


async function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const totals = calculateTotals(); 
    const amount = totals.total;
    const currency = selectedCurrency.toLowerCase(); 

    try {
        
        const response = await fetch("http://localhost:3000/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, currency })
        });

        const data = await response.json();
        if (!data.clientSecret) {
            alert("Payment failed. Please try again.");
            return;
        }

       
        const stripe = Stripe("pk_test_51QzqLfGE2Pd2ebFkL3uZvhBydkwex3ifiVn6IAVO4IqASYyXJK71ptslm5FUUWxYvfLASjUTy3OGpJM4uOdJzGcZ00CKaZdTJT");  // Replace with your Stripe Publishable Key

        
        const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId  
        });

        if (error) {
            console.error("Stripe Error:", error);
            alert("Payment failed. Please try again.");
            return;
        }

        
        const orderDetails = {
            items: cart,
            total: convertCurrency(totals.total),
            currency: selectedCurrency
        };
        localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

        
        const userEmail = prompt("Enter your email for order confirmation:");
        if (userEmail) {
            sendConfirmationEmail(userEmail, orderDetails);
        }

        
        window.location.href = "confirmation.html";

    } catch (error) {
        console.error("Checkout Error:", error);
        alert("An error occurred during checkout. Please try again.");
    }
}


function sendConfirmationEmail(email, orderDetails) {
    fetch('http://localhost:3000/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, orderDetails })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error("Error sending email:", error));
}



// Convert currency
function convertCurrency(amount) {
    return (amount * currencyRates[selectedCurrency]).toFixed(2);
}

// Change currency
function changeCurrency(currency) {
    selectedCurrency = currency;
    displayCatalog(products);
    displayCart();
}


document.addEventListener("DOMContentLoaded", () => {
    displayCatalog(products);
    document.getElementById("currency").addEventListener("change", (e) => {
        changeCurrency(e.target.value);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form from refreshing the page

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (name === "" || email === "" || message === "") {
                alert("Please fill out all fields.");
                return;
            }

            // Store the message temporarily in localStorage
            const contactMessage = {
                name,
                email,
                message,
                date: new Date().toLocaleString()
            };

            localStorage.setItem("lastContactMessage", JSON.stringify(contactMessage));

            // Show success message
            document.getElementById("response").innerHTML = "Thank you! We will get back to you soon.";

            // Clear form
            contactForm.reset();
        });
    }
});




