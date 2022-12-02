function getOneProduct(id){
    fetch ("http://localhost:3000/api/products/"+id)
        .then(function(res) {
            console.log(res);
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            showOneProduct(value);
            getProductColors(value);
            console.log(value);
        })
        .catch(function(err) {
        // Une erreur est survenue
        });
}



const url = new URL(window.location.href);
const id = url.searchParams.get("id");
console.log(id);

getOneProduct(id);

function showOneProduct(product){
    console.log(product);
        //ajout img avec src + alt
        const itemSection= document.getElementsByClassName('item__img');
        const img = document.createElement("img");
        img.src = product.imageUrl;
        img.setAttribute("alt", product.altTxt);
        itemSection[0].appendChild(img);

        //ajout title
        const title = document.getElementById('title');
        title.textContent = product.name;

        //ajout price
        const price = document.getElementById('price');
        price.textContent = product.price;

        //ajout description
        const description = document.getElementById('description');
        description.textContent = product.description;

        console.log('couleurs');

        const colors = product.colors;
        colors.forEach(color => {
        console.log('colors.forEach');
        const select = document.getElementById("colors");
        console.log('select');
        const option = document.createElement("option");
        console.log('option');
        option.innerText = color;
        console.log('innerText');
        option.setAttribute("value", color);
        console.log('valueattribute');
        select.appendChild(option);
        console.log('appendchild');
        });
}


/*function getProductColors(colors){
    console.log('function getProductColors');
    colors.forEach(function(color){
        console.log('function color');
        const select = document.getElementById("colors");
        const option = document.createElement("option");
        option.innerText = product.colors;
        option.setAttribute("value=", product.colors);
        select.appendChild(option);
        
    });
}*/
        /*ajout des couleurs :
        se situer sur l'option des couleurs
        ajouter option?
        lier contenu à l'API
        ajouter une "value" en fonction couleur choisie
        ajouter sur la page du Produit selectionné*/

/*
ajout option des couleurs => for ( let--- in/of ---.colors)*/