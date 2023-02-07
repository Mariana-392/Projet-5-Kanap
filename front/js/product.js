// Requête API pour avoir le produit par son id
function getOneProduct(id){
    fetch (`http://localhost:3000/api/products/${id}`)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            showOneProduct(value);
        })
        .catch(function(err) {
        // Une erreur est survenue
        });
}

const url = new URL(window.location.href);
const id = url.searchParams.get("id");

getOneProduct(id);

//insertion détails du produit
function showOneProduct(product){
        /*ajout img avec src + alt*/
        const itemSection= document.getElementsByClassName('item__img');
        const img = document.createElement("img");
        img.src = product.imageUrl;
        img.setAttribute("alt", product.altTxt);
        itemSection[0].appendChild(img);

        /*ajout title*/
        const title = document.getElementById('title');
        title.textContent = product.name;

        /*ajout price*/
        const price = document.getElementById('price');
        price.textContent = product.price;

        /*ajout description*/
        const description = document.getElementById('description');
        description.textContent = product.description;

        /*ajout des couleurs*/
        const colors = product.colors;
        colors.forEach(color => {
            const select = document.getElementById("colors");
            const option = document.createElement("option");
            option.innerText = color;
            option.setAttribute("value", color);
            select.appendChild(option);
        });
        localStorage.setItem("currentProductId", product._id);
}


/*panier
-enregistrer vers panier au clic sur le bouton ajouter au panier
-créer array avec id, quantité et couleur du produit à enregistrer dans le local storage
-utiliser Localstorage
*/

function getBasket(){
    let basket = localStorage.getItem("basket");
    if (basket == null){
        return[];
    }
    else{
        return JSON.parse(basket);
    }
}

const cartButton = document.getElementById("addToCart");
cartButton.addEventListener("click", addToCart);

//Ajout au panier
function addToCart(){
    const color = document.getElementById("colors");
    const quantity = document.getElementById("quantity");
    let newProductInBasket = {
        color: color.value, 
        id: localStorage.getItem("currentProductId"), 
        quantity: quantity.value
    };
    let basket = JSON.parse(localStorage.getItem("basket"));
    if(typeof basket === "undefined" || basket === null ){
        basket = [];
    }
    //si color = null et quantité = 0< ou > 100 alors alert
    if (color.value == "" || quantity.value < 1 || quantity.value > 100 ) {
        alert(
        "Veuillez choisir une couleur et une quantité comprise entre 1 et 100"
        )
    ;} 
    //sinon fouille dans localstorage avec find() si object existe deja
    else{
        let existingProductInBasket = basket.find((product) => 
            product.id === newProductInBasket.id &&
            product.color === newProductInBasket.color
        ); 
        //si existe = > j'additionne quantité trouvé avec quantity.value
        if(typeof existingProductInBasket !== "undefined"){
            existingProductInBasket.quantity = parseInt(existingProductInBasket.quantity) + parseInt(quantity.value);
            newProductInBasket = existingProductInBasket;
            //si la variable est sup à 100 alors alert
            if (existingProductInBasket.quantity > 100) {
                alert("Vous ne pouvez en commander que 100 maximum");
            }
            //sinon push dans basket et envoie dans localstorage
            else{
                basket.push(newProductInBasket);
                alert("Votre produit a bien été ajouté au panier");
                localStorage.setItem('basket', JSON.stringify(basket));  
            }
        }else{
            basket.push(newProductInBasket);
            alert("Votre produit a bien été ajouté au panier");
            localStorage.setItem('basket', JSON.stringify(basket));  
        }
    }
};