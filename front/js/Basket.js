class Basket {
    basket = [];

    constructor(){
        let basket = localstorage.getItem("basket");
        if (basket == null){
            this.basket = [];
        }
        else {
            this.basket = JSON.parse(basket);
        }
    }

    save(){
        localStorage.setItem("basket", JSON.stringify(this.basket));

    }

    add(product){
        let foundProduct = this.basket.find(p => p.id == product.id);
        if (foundProduct != undefined){
            foundProduct.quantity++;
        }
        else{
            product.quantity = 1;
            this.basket.push(product);
        }
        this.save();
    }

    removeFrom(product){
        this.basket = this.basket.filter(p => p.id != product.id);
        this.save();
    }

    changeQuantity(product){
        let foundProduct = this.basket.find(p => p.id == product.id);
        if (foundProduct != undefined){
            foundProduct.quantity += quantity;
            if (foundProduct.quantity <= 0){
                this.removeFrom(foundProduct);
            }
            else{
                this.save();
            }
        }
    }

    getNumberProduct(){
        let number = 0;
        for(let product of this.basket){
            number += product.quantity;
        }
        return number;
    }

    getTotalPrice() {
        let total = 0;
        for (let product of this.basket){
            total += product.quantity * product.price;
        }
        return total;
    }
}