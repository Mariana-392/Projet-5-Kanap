//requête l'API 
console.log('Hello');
function getAllProducts(){
    console.log('Bonjour');
    fetch ("http://localhost:3000/api/products")
        .then(function(res) {
            console.log(res);
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            showProducts(value);
            console.log(value);
        })
        .catch(function(err) {
        // Une erreur est survenue
        });
}
function showProducts(products){
    products.forEach(function(product){
        const itemSection= document.getElementById('items');

        //création des balises
        const a = document.createElement("a");
        const article = document.createElement("article");
        const img = document.createElement("img");
        const h3 = document.createElement("h3");
        const p = document.createElement("p");

        //lie les balises au contenu de l'API
        img.src = product.imageUrl;
        h3.innerText = product.name;
        p.innerText = product.description;

        //ajout attribut et class
        a.setAttribute("href", "./product.html?id=" + showProducts._id);
        img.setAttribute("alt", product.altTxt);
        h3.classList.add("productName");
        p.classList.add("productDescription");


        //ajout à la page web
        itemSection.appendChild(a);
        a.appendChild(article);
        article.appendChild(img);
        article.appendChild(h3);
        article.appendChild(p);
    });
}

getAllProducts();