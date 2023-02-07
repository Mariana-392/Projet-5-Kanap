//function pour avoir les produits via l'API
function getProductsbyAPI(loadProducts){
    //si basket = vide, mettre h1 en "panier vide" et cacher la section "cart"
    let basket = JSON.parse(localStorage.getItem("basket"));
    if (localStorage.getItem("basket") === null || localStorage.getItem("basket").length === 0){
        document.getElementById("cartAndFormContainer").firstElementChild.innerText = "Votre panier est vide !";
        document.querySelector("section.cart").remove();
        return;
    }
    fetch ("http://localhost:3000/api/products/")
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })

        .then(function(products) {
            handlePrice(products, loadProducts);
            deleteProducts();
            changeQuantityProducts();
            handleSubmitForm();
        })
        
        .catch(function(err) {
        // Une erreur est survenue
        });
}

//function pour calculer le prix total et la quantité total des articles dans le panier
function handlePrice(products, loadProducts){
    const productsInLocalstorage = JSON.parse(localStorage.getItem("basket"));
    const hydratedProducts = hydrateProducts(products,productsInLocalstorage);
    if (loadProducts){
        showCartDetails(hydratedProducts);
    }
    const totalPrice = hydratedProducts.reduce(
        (total, product) => total + parseInt(product.totalPrice), 0
    ); 
    //affiche le prix
    let productTotalPrice = document.getElementById("totalPrice");
    productTotalPrice.innerHTML = totalPrice;
    //affiche la quantité
    const totalQuantity = hydratedProducts.reduce(
        (total, product) => total + parseInt(product.quantity), 0
    ); 
    let productTotalQuantity = document.getElementById("totalQuantity");
    productTotalQuantity.innerHTML = totalQuantity;
}

//function pour récupèrer les données nécessaires du localstorage et de l'API
function hydrateProducts(allProducts, productsInBasket){
    let hydratedProducts = [];
    productsInBasket.forEach(product => {
        const fullProduct = allProducts.filter(allProduct => allProduct._id == product.id)[0];
        const hydratedProduct = {
            id : product.id,
            imageUrl : fullProduct.imageUrl,
            name : fullProduct.name,
            color : product.color,
            price : fullProduct.price,
            quantity : product.quantity,
            totalPrice : fullProduct.price * product.quantity
        };
        hydratedProducts.push(hydratedProduct);
    });
    return hydratedProducts;
}

//Montrer les détails des produits dans le panier
function showCartDetails(products){
    products.forEach(product => {
        showOneProduct(product);
    });
}

function showOneProduct(product){

    const itemSection = document.getElementById ("cart__items");

    //création des balises
    const article = document.createElement("article");
    const divCartImg = document.createElement("div");
    const img = document.createElement("img");
    const divCartContent = document.createElement("div");
    const divCartDescription  = document.createElement("div");
    const h2 = document.createElement("h2");
    const pColor = document.createElement("p");
    const pPrice = document.createElement("p");
    const divCartSetting = document.createElement("div");
    const divCartQuantity = document.createElement("div");
    const pQuantity = document.createElement("p");
    const input = document.createElement ("input");
    const divCartDelete = document.createElement("div");
    const pDelete = document.createElement("p");


    //lier les balises au contenu du localstorage + API
    
    img.src = product.imageUrl;
    h2.innerText = product.name;
    pColor.innerText = product.color;
    pPrice.innerText = product.price;
    input.value = product.quantity;

    //ajout attribut et class
    article.classList.add("cart__item");
    article.setAttribute("data-id", product.id);
    article.setAttribute("data-color", product.color);
    divCartImg.classList.add("cart__item__img")
    img.setAttribute("alt", product.altTxt); 
    divCartContent.classList.add("cart__item__content");
    divCartDescription.classList.add("cart__item__content__description");
    divCartSetting.classList.add("cart__item__content__settings");
    divCartQuantity.classList.add("cart__item__content__settings__quantity");
    pQuantity.innerText = "Qté :";
    input.classList.add("itemQuantity");
    input.type = "number";
    input.min = "1";
    input.max = "100";
    divCartDelete.classList.add("cart__item__content__settings__delete");
    pDelete.classList.add("deleteItem");
    pDelete.innerText = "Supprimer" ;


    //ajout à la page web
    itemSection.appendChild(article);
    article.appendChild(divCartImg);
    divCartImg.appendChild(img);
    article.appendChild(divCartContent);
    divCartContent.appendChild(divCartDescription);
    divCartDescription.appendChild(h2);
    divCartDescription.appendChild(pColor);
    divCartDescription.appendChild(pPrice);
    divCartContent.appendChild(divCartSetting);
    divCartSetting.appendChild(divCartQuantity);
    divCartQuantity.appendChild(pQuantity);
    divCartQuantity.appendChild(input);
    divCartSetting.appendChild(divCartDelete);
    divCartDelete.appendChild(pDelete);

}


// Suppression d'un produit
function deleteProducts(){
    const deleteButtonList = document.getElementsByClassName("deleteItem");
    for (let button of deleteButtonList) {
        button.addEventListener('click', deleteOneProduct)
    }
}

function deleteOneProduct(event){
    const deleteButton = event.target;
    
    /*Retrouver l'élément parent du deleteBetton, lequel contient le data-id et data-color*/
    const product = deleteButton.closest("article");
    /*Récupérer ces valeurs data-id et data-color dans des constantes*/
    const productId = product.dataset.id;
    const productColor = product.dataset.color;
    /*Trouver, graĉe à ces 2 constantes, dans mon tableau localStorage, le produit correspondant*/
    const productsInLocalstorage = JSON.parse(localStorage.getItem("basket"));
    const updatedBasket = productsInLocalstorage.filter(
        (product) => 
            product.id != productId ||
            product.color != productColor
        );
    /*mise à jour du localStorage et suppression dans le DOM*/
    localStorage.setItem("basket", JSON.stringify(updatedBasket)); 

    product.remove();
    getProductsbyAPI(false);

}

//Changer quantité dans le panier
function changeQuantityProducts(){
    const selectButtonList = document.getElementsByClassName("itemQuantity");

    for (let input of selectButtonList) {
        input.addEventListener('change', changeQuantityOneProduct)
    }
}

function changeQuantityOneProduct(event){
    const modifyButton = event.target;
    const product = modifyButton.closest("article");
    const productId = product.dataset.id;
    const productColor = product.dataset.color;
    const productQuantity = modifyButton.value;
    const productsInLocalstorage = JSON.parse(localStorage.getItem("basket"));

    const updatedBasket = productsInLocalstorage.filter(
        (product) => 
            product.id != productId ||
            product.color != productColor
    );

    const updatedProduct = productsInLocalstorage.filter(
        (product) => 
            product.id === productId &&
            product.color === productColor
    ); 
    updatedProduct[0].quantity = productQuantity;
    updatedBasket.push(updatedProduct[0]);
    localStorage.setItem("basket", JSON.stringify(updatedBasket)); 

    getProductsbyAPI(false);

}

//formulaire de commande

function handleSubmitForm() {
    /*Gérer l'event listener du formulaire pour l'envoi*/
    const form = document.getElementById("order").closest("form");
    form.addEventListener("submit", sendForm);
}

//Envoyer le formulaire et redirigé vers la page confirmation avec le num de commande
function sendForm(event) {
    event.preventDefault();

    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address : document.getElementById("address").value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value,
    };

    if (!validateForm(contact)) {
        return;
    }


    // A partir de là, faire progressivement ces lignes après s'etre assuré que validateForm fonctionne
    const form = event.target;

    let cartItemArray = [];
        for (let item of JSON.parse(localStorage.getItem("basket"))){
        cartItemArray.push(item.id)
        };

    const payload = {
        products : cartItemArray,
        contact: contact
    }
    /**
     * Fetch API: requête POST avec la variable "payload" en données
     */

    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify(payload)
    })
    .then((response) => response.json())
    .then((data) => {
        document.location.href = `confirmation.html?id=${data.orderId}#limitedWidthBlock`;
    })
    .catch((err) => {
        alert(`Erreur : ${err}`);
    });
}

function validateForm(contact) {
    //Création des expresssions régulières
    const nameRegExp = /^[A-Za-z,'-]+$/;
    const addressRegExp = /^[a-zA-Z0-9\s,. '-]{3,}$/ ;
    const cityRegExp = /^(?:[A-Za-z]{2,}(?:(\.\s|'s\s|\s?-\s?|\s)?(?=[A-Za-z]+))){1,2}(?:[A-Za-z]+)?$/;
    const emailRegExp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

// First Name
    const firstName = document.getElementById("firstName")
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    let firstNameState = false;

    firstName.addEventListener("input", resultFind =>{
        resultFind = nameRegExp(contact.firstName);
        firstNameErrorMsg.innerHTML = resultFind ? "" : "Veuillez entrer un prénom valide";
        firstNameState = resultFind ? true : false;
    })

// LastName
    const lastName = document.getElementById("lastName");
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    let lastNameState = false;

lastName.addEventListener("input", resultFind =>{
    resultFind = nameRegExp(contact.lastName);
    lastNameErrorMsg.innerHTML = resultFind ? "" : "Veuillez entrer un nom valide";
    lastNameState = resultFind ? true : false;
})

//Address
    const address = document.getElementById("address");
    const addressErrorMsg = document.getElementById("addressErrorMsg");
    let addressState = false;

address.addEventListener("input", resultFind =>{
    resultFind = addressRegExp(contact.address);
    addressErrorMsg.innerHTML = resultFind ? "" : "Veuillez entrer une addresse valide";
    addressState = resultFind ? true : false;
})

//city
    const city = document.getElementById("city");
    const cityErrorMsg = document.getElementById("cityErrorMsg");
    let cityState = false;

city.addEventListener("input", resultFind =>{
    resultFind = cityRegExp(contact.city);
    cityErrorMsg.innerHTML = resultFind ? "" : "Veuillez entrer une ville valide";
    cityState = resultFind ? true : false;
})

//email
    const email = document.getElementById("email");
    const emailErrorMsg = document.getElementById("emailErrorMsg");
    let emailState = false;

email.addEventListener("input", resultFind =>{
    resultFind = emailRegExp(contact.email);
    emailErrorMsg.innerHTML = resultFind ? "" : "Veuillez entrer une email valide";
    emailState = resultFind ? true : false;
})

let formIsValid = {
    firstNameState,
    lastNameState,
    addressState,
    cityState,
    emailState
}

if(!formIsValid){ 
    return;
}

return formIsValid

};

getProductsbyAPI(true);