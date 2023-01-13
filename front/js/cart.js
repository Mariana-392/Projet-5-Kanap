//function pour avoir les produits via l'API
function getProductsbyAPI(loadProducts){
    fetch ("http://localhost:3000/api/products/")
        .then(function(res) {
            console.log(res);
            if (res.ok) {
                return res.json();
            }
        })

        .then(function(products) {
            handlePrice(products, loadProducts);
            deleteProducts();

        })
        .catch(function(err) {
        // Une erreur est survenue
        });
}

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

function deleteProducts(){
    const deleteButtonList = document.getElementsByClassName("deleteItem");
    for (let button of deleteButtonList) {
        button.addEventListener('click', deleteOneProduct)
    }
}

function deleteOneProduct(event){
    const deleteButton = event.target;
    
// 1. Retrouver l'élément parent du deleteBetton, lequel contient le data-id et data-color
const product = deleteButton.closest("article");
// 2. Récupérer ces valeurs data-id et data-color dans des constantes
const productId = product.dataset.id;
const productColor = product.dataset.color;
// 3. Trouver, graĉe à ces 2 constantes, dans mon tableau localStorage, le produit correspondant
const productsInLocalstorage = JSON.parse(localStorage.getItem("basket"));
const updatedBasket = productsInLocalstorage.filter(
    (product) => 
        product.id != productId ||
        product.color != productColor
);
localStorage.setItem("basket", JSON.stringify(updatedBasket)); 

product.remove();
getProductsbyAPI(false);
// 4. Récupérer l'index dans le tableau localStorage, du produit correspondant (disons: const deletedProductIndex)

// 5. Supprimer, dans le tableau localStorage l'index = deletedProductIndex
// 5bis. Mettre le tableau localStorage modifié dans le localStorage et en supprimant l'ancien tableau
// 6. Supprimer dans le DOM, l'élément parent retrouvé à l'étape 1

    console.log(deleteButton);
}

function modifyProducts(){
    const modifyButtonList = document.getElementsByClassName("itemQuantity");
    for (let button of modifyButtonList) {
        button.addEventListener('change', modifyOneProduct)
    }
}

function modifyOneProduct(event){
    const modifyButton = event.target;
    
    const product = modifyButton.closest("article");
    const productId = product.dataset.id;
    const productColor = product.dataset.color;
    const productsInLocalstorage = JSON.parse(localStorage.getItem("basket"));
    const updatedBasket = productsInLocalstorage.filter(
        (product) => 
            product.id != productId ||
            product.color != productColor
    );
localStorage.setItem("basket", JSON.stringify(updatedBasket)); 

product.remove();
getProductsbyAPI(false);


    console.log(deleteButton);
}
//formulaire de commande

/*function formValidation(cart){
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const email = document.getElementById("email");

//Création des expresssions régulières
    const firstNameRegex = /^[a-zA-Z ]+$/;
    const lastNameRegex = /^[a-zA-Z ]+$/;
    const addressRegex = ;
    const cityRegex = ;
    const emailRegex = ;



    /*validation du formulaire
    element.addEventListerner("input" or "change",function ()){

    }
}
*/

getProductsbyAPI(true);
