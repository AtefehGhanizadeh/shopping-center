

const showModalBtn=document.querySelector(".show-modal")

const modal=document.querySelector(".modal")

const backDrop=document.querySelector(".backdrop")

const clearCartBtn=document.querySelector(".clear-modal")

const confirmModal=document.querySelector(".confirm-modal")

const productsSection=document.querySelector(".products-section")

const cart=document.querySelector(".selected-items")

const totalPrice=document.querySelector(".totalPrice")

const numberOfCartItems=document.querySelector(".item-numbers")

const hamburger=document.querySelector(".hamburger-menu")

const topMenu=document.querySelector(".top-menu")

const topNav=document.querySelector(".top-nav")

const container=document.querySelector(".container")

let cartItems=[]

let buttonsDom=[]

import{productsData}from './products.js'


class Products{

    getProducts(){

        return productsData
    }
}


class UI{

    display(productsInfo){

        productsInfo.forEach(product=>{

            const article=document.createElement("article")

            article.innerHTML=`
            <div class="product-image">
                <img src="${product.image}">
            </div>
            <div class="product-information">
                <span class="product-name">${product.title}</span>
                <span class="product-price">${product.price+"$"}</span>
            </div>
            <div class="btn-add"><button class="add" data-id="${product.id}">Add to cart</button></div>`

            article.classList.add("product")

            productsSection.appendChild(article)


        })
    }

    // when we can get add btns???!
    getAddToCartBtns(){

        const addBtns=document.querySelectorAll(".add")

        const addBtnsArray=[...addBtns]

        buttonsDom=addBtnsArray

        addBtnsArray.forEach((btn)=>{

            const btnId=btn.dataset.id;

            const isInCart=cartItems.find((p)=>{p.id===btnId})

            if(isInCart){

                btn.innerText="In Cart";

                btn.disabled=true;
            }

            btn.addEventListener("click",(event)=>{


                btn.innerText="In Cart";

                btn.style.backgroundColor="#ecbdfa"

                btn.disabled=true;

                const addedProduct={...Storage.getProduct(btnId) , quantity:1}


                cartItems=[...cartItems,addedProduct]


                Storage.saveCart(cartItems)


                this.addToCart(addedProduct)

                this.setCartValue(cartItems)

            })
        })
    }



    setCartValue(cart){

        let tempCartItems=0

        const tPrice=cart.reduce((acc,curr)=>{

            tempCartItems+=curr.quantity

            return acc +(curr.quantity*curr.price)
        },0)

        totalPrice.innerText=`Total Price is:${tPrice}$`

        numberOfCartItems.innerText=tempCartItems
    }

    addToCart(item){

            const cartItem=document.createElement("article")

            cartItem.classList.add("cartItem")

            cartItem.innerHTML=`<div class="cartItem-image"><img src="${item.image}"></div>
            <div class="cartItem-info">
                <span class="cartItem-title">${item.title}</span>
                <span class="cartItem-price">${"$"+ item.price}</span>
            </div>
            <div class="cartItem-number">
                <span class="increase-number"><i class="fa fa-angle-up" aria-hidden="true" data-id="${item.id}"></i></span>
                <span class="number">${item.quantity}</span>
                <span class="decrease-number"><i class="fa fa-angle-down" aria-hidden="true" data-id="${item.id}"></i></span>
            </div>
            <span class="delete"><i class="fa fa-trash" aria-hidden="true" data-id="${item.id}"></i></span>`

            cart.appendChild(cartItem)
    }

    setupApp(){

        cartItems=Storage.getCart()||[]

        cartItems.forEach((cartItem)=>{

            this.addToCart(cartItem)

            this.setCartValue(cartItems)

        })
    }

    cartLogic(){

        clearCartBtn.addEventListener("click",()=> this.clearCartFunc())

        cart.addEventListener("click" , (e)=>{

            if(e.target.classList.contains("fa-angle-up")){

                const addItem=e.target
                
                const addedItem=cartItems.find(item=>parseInt(item.id)==parseInt(addItem.dataset.id))

                addedItem.quantity++;

                addItem.parentNode.nextElementSibling.innerText=addedItem.quantity

                this.setCartValue(cartItems)

                Storage.saveCart(cartItems)
            }

            else if(e.target.classList.contains("fa-angle-down")){

                const substractItem=e.target
                
                const substracedtItem=cartItems.find(item=>parseInt(item.id)==parseInt(substractItem.dataset.id))

                if(substracedtItem.quantity===1){

                    cart.removeChild(substractItem.parentNode.parentNode.parentNode)

                    this.removeItem(substracedtItem.id)

                    return
                    
                }

                item.quantity--;

                e.target.parentNode.previousElementSibling.innerText=item.quantity

                this.setCartValue(cartItems)

                Storage.saveCart(cartItems)
            }

            else if(e.target.classList.contains("fa-trash")){

                const removeItem=e.target

                const removedItem=cartItems.find(item=>parseInt(item.id)==parseInt(e.target.dataset.id))

                removedItem.quantity=1

                this.removeItem(removedItem.id)

                Storage.saveCart(cartItems)

                cart.removeChild(removeItem.parentNode.parentNode)
            }

        })

    }

    clearCartFunc(){

        cartItems.forEach(cartItem=>this.removeItem(cartItem.id))

        while(cart.children.length){

            cart.removeChild(cart.children[0])

        }

        closeModalFunc()
    }


    removeItem(id){

        cartItems=cartItems.filter(cartItem=> cartItem.id!==id)

        this.setCartValue(cartItems)

        Storage.saveCart(cartItems)

        this.getSingleBtn(id)

    }

    getSingleBtn(id){

        const removedItemBtn=buttonsDom.find(button =>parseInt(button.dataset.id)===parseInt(id))

        removedItemBtn.innerText="Add to cart"

        removedItemBtn.disabled=false

        removedItemBtn.style.backgroundColor="rgb(214, 146, 235)"
    }


}


class Storage{

    static saveStorage(productsInfo){


            localStorage.setItem("productList", JSON.stringify(productsInfo))

    }

    static getProduct(id){

        const _products=JSON.parse(localStorage.getItem("productList"))

        return  _products.find((p)=> p.id===parseInt(id))

    }

    static saveCart(cart){

        localStorage.setItem("cart" ,JSON.stringify(cart))
    }

    static getCart(){

        return JSON.parse(localStorage.getItem("cart"))
    }

}




document.addEventListener("DOMContentLoaded" , ()=>{
    
    const product=new Products();

    const productsDate=product.getProducts()
    
    const ui=new UI() 
    
    ui.display(productsData)

    ui.getAddToCartBtns()

    Storage.saveStorage(productsData)

    ui.setupApp()
    ui.cartLogic()

   
})




showModalBtn.addEventListener("click",()=>{

    modal.style.opacity="1"

    backDrop.style.display="block"    

    modal.style.transform="translateY(5rem)"

    

    
})

function closeModalFunc(){

    modal.style.opacity="0"

    modal.style.transform="translateY(-200%)"

    backDrop.style.display="none"
}

backDrop.addEventListener("click",closeModalFunc)



