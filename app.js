const cartBtn = document.querySelector('.cart-btn')
const closeCartBtn = document.querySelector('.close-cart')
const  cartDom = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay');
const cartContent = document.querySelector('.cart-content')
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const clearCartBtn = document.querySelector('.clear-cart');
const productsDOM = document.querySelector(".product-center");
let cart = [];
let buttonsDom = [];
// products


class Products {
    async getProducts() {
        try {
            let result = await fetch("./products.json");
            let data = await result.json();
            let products = data;
            products = products.map(data => {
                const { no, name,image,tags } = data;
               
                const bottle  =  data.cost.bottle;
                const caseprice  =  data.cost.caseprice;
               
                return { no,name,tags,image,bottle,caseprice};
            });
           // console.log(products);

            return products;
        } catch (error) {
            console.log(error);
        }
    }
}
class UI {
  displayProducts(products) {
      let result = '';
      products.forEach(product => {
          result += `
          <div class="grid-item ${product.tags} col-sm-3 ml-4 shadow">
          <div class="d-flex">
            <div class="product-image">
              <img src="${product.image}" alt="" class="img-fluid" />
            </div>
            <div class="product-info ml-2">
              <div class="title">
                <h2>${product.no}</h2>
                <h5>${product.name}</h5>
              </div>
              <div class="d-flex product-price">
                <div class="d-block pr-2 bottle">
                  <h6>Bottle</h6>
                  <span>Ksh <br>${product.bottle} <br></span>
                  
                </div>
                <div class="d-block pl-2 case">
                  <h6>Case</h6>
                  <span>Ksh<br>0.0</span>
                  
                </div>
              </div>
              <div class="d-flex mybutton">
                <button data-id=${product.no}  class="btn mt-2 btn-dark text-white mr-2">
                  Details
                </button>
                <button data-id=${product.no} class="btn cart-btn-banner ml-auto mt-2 ">Add  Cart</button>
              </div>
            </div>
          </div>
        </div>
          
          `;
      });
  productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".cart-btn-banner")];
    //console.log(buttons);
    buttonsDom = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      // console.log(id);
      let inCart = cart.find((data) => data.no === id);
      if (inCart) {
        button.innerText = "In cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        //console.log(event);
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        //get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        // console.log(cartItem);
        //add product to cart
        cart = [...cart, cartItem];
        console.log(cart);
        //save product in local storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValues(cart);
        //display cart items
        this.addCartItem(cartItem);
        //show  the cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(data => {
        tempTotal += data.bottle * data.amount;
        itemsTotal += data.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    //console.log(cartTotal,cartItems);
}
addCartItem(data) {
  const div = document.createElement("div");
  div.classList.add("cart-item");
  div.innerHTML = `
  <img src="${data.image}" alt="" />
 <div class="d-block">
  <h4>${data.name}</h4>
  <h5>${data.bottle}</h5>
  <span data-id="${data.no}" class="remove-item">remove</span>
 </div>

  <div class="ml-auto">
    <i class="fas fa-chevron-up"  data-id="${data.no}" ></i>
    <p class="item-amount" >${data.amount}</p>
    <i class="fas fa-chevron-down"  data-id="${data.no}"></i>
  </div>
`;
cartContent.appendChild(div)
//console.log(cartContent);
}
showCart(){
  cartOverlay.classList.add('transparentBcg');
  cartDom.classList.add('showCart');
}
setApp(){
  cart = Storage.getCart();
  this.setCartValues(cart);
  this.populateCart(cart);
  cartBtn.addEventListener("click",this.showCart);
  closeCartBtn.addEventListener("click",this.hideCart)
}
populateCart(cart){
  cart.forEach(data=>this.addCartItem(data));
  
}
hideCart(){
  cartOverlay.classList.remove('transparentBcg');
  cartDom.classList.remove('showCart');
}
cartLogic(){
  //clear everything in the cart
  clearCartBtn.addEventListener('click',() => {
    this.clearCart()
  });
  //cart functionality all events
  cartContent.addEventListener('click', event=>{
    //console.log(event.target);
    if(event.target.classList.contains('remove-item')){
      let removeItem = event.target;
      //console.log(removeItem);
      let id = removeItem.dataset.id;
      cartContent.removeChild(removeItem.parentElement.parentElement);

      this.removeItem(id);
       
    }else if(event.target.classList.contains('fa-chevron-up')){
       let addAmount = event.target;
       let id = addAmount.dataset.id;
      // console.log(addAmount);
      let tempItem = cart.find(data => data.no === id);
      tempItem.amount = tempItem.amount + 1;
      Storage.saveCart(cart);
      this.setCartValues(cart);
      addAmount.nextElementSibling.innerText = tempItem.amount;  
    }else if(event.target.classList.contains('fa-chevron-down')){
      let lowerAmount = event.target;
       let id = lowerAmount.dataset.id;
      // console.log(addAmount);
      let tempItem = cart.find(data => data.no === id);
      tempItem.amount = tempItem.amount - 1;
      if(tempItem.amount > 0){
        Storage.saveCart(cart);
        this.setCartValues(cart);
        lowerAmount.previousElementSibling.innerText = tempItem.amount;

      }else{
        cartContent.removeChild(lowerAmount.parentElement.parentElement);
        this.removeItem(id);
      }

      

    }
  }) 

}
clearCart(){
  //console.log(this);
  //clear the cart
  let cartItems = cart.map(data => data.no);
  //console.log(cartItems);
  //loop through items in cart and get ids
  cartItems.forEach(no => this.removeItem(no));
   
  console.log(cartContent.children);
  while(cartContent.children.length >0){
    cartContent.removeChild(cartContent.children[0] )
    this.hideCart();
  }
 
}
removeItem(no){
  cart = cart.filter(data => data.no !== no);
  //update the cart
  this.setCartValues(cart);

  Storage.saveCart(cart);
  let button = this.getSingleButton(no)
  button.disabled = false;
  button.innerHTML = `Add  Cart`;

}
getSingleButton(no){
  return buttonsDom.find(button => button.dataset.id === no);
}
}
class Storage {
  static saveProducts(products){
    localStorage.setItem("products",JSON.stringify(products));
  }
  static getProduct(id){
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.no === id);
  }
  static saveCart(cart){
    localStorage.setItem('cart',JSON.stringify(cart));
  }
  static getCart(){
    return localStorage.getItem('cart')?JSON.parse(
      //if there is nothig return an empty array
      localStorage.getItem('cart')):[];


  }
   
}
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  //set applications ensure data lost after refreshing
  ui.setApp()
  

  // get all products
  products
      .getProducts().then(products =>{
         ui.displayProducts (products);
         Storage.saveProducts(products);
          

        }).then(() => {
          ui.getBagButtons();
          ui.cartLogic(); 

        });
      
});
//Filtering by class
//Filtering by class
// $(document).ready(function() {

// var $grid = $(".grid").isotope({
//   itemSelector: ".grid-item",
// });

// // filter items on button click
// $(".button-group").on("click", "button", function () {
//   var filterValue = $(this).attr("data-filter");
//  // console.log(filterValue);

//   $grid.isotope({ filter: filterValue });
// });
// });

//Second method
const BtnsFilter = document.querySelectorAll('.btns-filter');
const StoreProducts = document.querySelectorAll('.grid-item');

for (i = 0; i< BtnsFilter.length; i++){
  BtnsFilter[i].addEventListener('click',(e) =>{
    e.preventDefault();
    const filter = e.target.dataset.filter;
    //console.log(filter);
    StoreProducts.forEach((product) => {
      if(filter == '*'){
        product.style.display = "block";
      }else{
        if(product.classList.contains(filter)){
          product.style.display = "block";

        }else{
          product.style.display = "none";
        }
      }
    })
  })
}