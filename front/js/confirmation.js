//affichage du numéro de commande
let params = new URLSearchParams(document.location.search);
const orderId = params.get("id");
document.getElementById("orderId").innerHTML = `<br> <br> ${orderId}`;

//suppression du localStorage
function clearlocalStorage(){
    localStorage.removeItem("orderId");
    localStorage.removeItem("basket");
    localStorage.removeItem("currentProductId");
}
clearlocalStorage();