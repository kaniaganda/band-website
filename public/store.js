if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
}
else {
    ready();
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName("btn-remove");
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i];
        button.addEventListener("click", removeCartItem);
    }

    var quantityInputs = document.getElementsByClassName("cart-quantity-input");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    var addToCartButtons = document.getElementsByClassName("shop-item-button");
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        console.log(button)
        button.addEventListener("click", addToCartClicked);
    }

    document.getElementsByClassName("btn-purchase")[0].addEventListener("click", purchaseClicked);
}

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: "auto",
    token: function(token) {
        var items = [];
        var cartItemContainer = document.getElementsByClassName("cart-items")[0];
        var cartRows = cartItemContainer.getElementsByClassName("cart-row");
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i];
            var quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0];
            var quantity = quantityElement.value;
            var id = cartRow.dataset.itemId;
            items.push({
                id: id,
                quantity: quantity
            })
        }
    }
})

// BUG: for no items in cart
function purchaseClicked() {
    // var cartItems = document.getElementsByClassName("cart-items")[0];
    // console.log(cartItems.hasChildNodes.length)
    // if (cartItems.hasChildNodes == 0) { /* BUG: Why does it always say "Thank you" first even though length is 0 on console? */
    //     alert("No items in cart")
    // }
    // else {
    //     alert("Thank you for your purchase")
    //     while (cartItems.hasChildNodes()) {
    //         cartItems.removeChild(cartItems.firstChild);
    //     }
    //     updateCartTotal();
    // }
    var priceElement = document.getElementsByClassName("cart-total-price")[0];
    var price = parseFloat(priceElement.innerText.replace("$", "")) * 100;
    stripeHandler.open({
        amount: price
    })
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(event) {
    var input = event.target;
    input.value = Math.floor(input.value);
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    else if (input.value > 10000) {
        input.value = 10000; 
        alert("Max quantity per item: 10000")
    }
    updateCartTotal();
}

function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
    var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
    var imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src;
    var id = shopItem.dataset.itemId;
    addItemToCart(title, price, imageSrc, id);
    updateCartTotal();
}

function addItemToCart(title, price, imageSrc, id) {
    var cartRow = document.createElement("div");
    cartRow.classList.add("cart-row");
    cartRow.dataset.id = id;
    var cartItems = document.getElementsByClassName("cart-items")[0];
    var cartItemNames = cartItems.getElementsByClassName("cart-item-title");
    for (var i = 0; i < cartItemNames.length; i++) {
        if (title == cartItemNames[i].innerText) {
            alert("Item already added to cart");
            return;
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src=${imageSrc}>
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-remove" type="button">REMOVE</button>
        </div>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName("btn-remove")[0].addEventListener("click", removeCartItem);
    cartRow.getElementsByClassName("cart-quantity-input")[0].addEventListener("change", quantityChanged);
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    var cartRows = cartItemContainer.getElementsByClassName("cart-row");
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName("cart-price")[0];
        var quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0];
        var price = parseFloat(priceElement.innerText.replace("$", ""));
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    document.getElementsByClassName("cart-total-price")[0].innerText = "$" + total.toFixed(2);
}
