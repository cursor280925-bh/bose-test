const t=document.getElementById("modal"),e=document.querySelectorAll("[data-open-modal]"),a=document.querySelectorAll("[data-close-modal], .modal-backdrop, .modal-close");function o(){if(!t)return;t.setAttribute("aria-hidden","false"),document.body.style.overflow="hidden";let e=t.querySelector("input");e&&setTimeout(()=>e.focus(),50)}function u(){t&&(t.setAttribute("aria-hidden","true"),document.body.style.overflow="")}const r=document.getElementById("burger-menu"),i=document.querySelectorAll("[data-open-burger]"),n=document.querySelectorAll("[data-close-burger]");function s(){r&&r.setAttribute("aria-hidden","false")}function d(){r&&r.setAttribute("aria-hidden","true")}document.querySelectorAll(".icon-like").forEach((t,e)=>{let a=`product-${e}-liked`;"1"===localStorage.getItem(a)&&t.classList.add("active"),t.addEventListener("click",()=>{t.classList.toggle("active"),t.classList.contains("active")?localStorage.setItem(a,"1"):localStorage.removeItem(a)})});const c=new class{constructor(){this.products=[{id:1,name:"Bose portable Smart speaker",category:"Smart home",price:399,image:"img/products/Bose_portable_Smart_speaker_desk.png",description:"Портативная умная колонка с голосовым управлением"},{id:2,name:"SoundLink Flex Bluetooth speaker",category:"Portable bluetooth",price:149,image:"img/products/Portable_bluetooth_desk.png",description:"Портативная Bluetooth колонка с водонепроницаемостью"},{id:3,name:"SoundLink Color Bluetooth speaker II",category:"Portable bluetooth",price:129,image:"img/products/Portable_bluetooth_II_desk.png",description:"Цветная портативная Bluetooth колонка"}],this.cart=[],this.orders=[],this.paymentMethods=[{id:"card",name:"Банковская карта",icon:"\uD83D\uDCB3"},{id:"cash",name:"Наличные при получении",icon:"\uD83D\uDCB5"},{id:"online",name:"Онлайн оплата",icon:"\uD83C\uDF10"}],this.deliveryMethods=[{id:"ukrpost",name:"Укрпошта",price:50,icon:"\uD83D\uDCEE"},{id:"novapost",name:"Нова пошта",price:80,icon:"\uD83D\uDE9A"}]}getProducts(){return this.products}getProductById(t){return this.products.find(e=>e.id===t)}addToCart(t,e=1){if(!this.getProductById(t))return!1;let a=this.cart.find(e=>e.productId===t);return a?a.quantity+=e:this.cart.push({productId:t,quantity:e,addedAt:new Date}),!0}removeFromCart(t){this.cart=this.cart.filter(e=>e.productId!==t)}updateCartItemQuantity(t,e){let a=this.cart.find(e=>e.productId===t);a&&(e<=0?this.removeFromCart(t):a.quantity=e)}getCart(){return this.cart.map(t=>{let e=this.getProductById(t.productId);return{...t,product:e,totalPrice:e.price*t.quantity}})}getCartTotal(){return this.cart.reduce((t,e)=>t+this.getProductById(e.productId).price*e.quantity,0)}clearCart(){this.cart=[]}createOrder(t){let e={id:Date.now(),items:[...this.cart],total:this.getCartTotal(),delivery:t.delivery,payment:t.payment,customerInfo:t.customerInfo,status:"pending",createdAt:new Date};return this.orders.push(e),this.clearCart(),e}getOrders(){return this.orders}getPaymentMethods(){return this.paymentMethods}getDeliveryMethods(){return this.deliveryMethods}};new class{constructor(){this.cart=[],this.init()}init(){this.bindEvents(),this.updateCartDisplay()}bindEvents(){document.addEventListener("click",t=>{if("В корзину"===t.target.textContent||"В корзину"===t.target.textContent.trim()){t.preventDefault();let e=t.target.closest(".card");e&&this.addToCartFromCard(e)}}),document.addEventListener("click",t=>{if("Купить"===t.target.textContent||"Купить"===t.target.textContent.trim()){t.preventDefault();let e=t.target.closest(".card");e&&(this.addToCartFromCard(e),this.openCart())}}),document.addEventListener("click",t=>{t.target.closest("[data-open-cart]")&&(t.preventDefault(),this.openCart())})}addToCartFromCard(t){let e=t.querySelector(".card-title"),a=t.querySelector(".card-price");if(e&&a){let t=e.textContent.trim();parseFloat(a.textContent.replace(/[^0-9.]/g,""));let o=c.getProducts().find(e=>e.name===t);o&&c.addToCart(o.id,1)&&(this.showNotification("Товар добавлен в корзину!"),this.updateCartDisplay())}}addToCart(t,e=1){return!!c.addToCart(t,e)&&(this.updateCartDisplay(),!0)}removeFromCart(t){c.removeFromCart(t),this.updateCartDisplay()}updateCartItemQuantity(t,e){c.updateCartItemQuantity(t,e),this.updateCartDisplay()}getCart(){return c.getCart()}getCartTotal(){return c.getCartTotal()}clearCart(){c.clearCart(),this.updateCartDisplay()}updateCartDisplay(){let t=this.getCart();this.getCartTotal();let e=document.querySelector(".cart-counter");if(e){let a=t.reduce((t,e)=>t+e.quantity,0);e.textContent=a,e.style.display=a>0?"block":"none"}let a=document.querySelector(".cart-modal");a&&"none"!==a.style.display&&this.renderCartItems()}renderCartItems(){let t=document.querySelector(".cart-items");if(!t)return;let e=this.getCart();if(0===e.length){t.innerHTML='<p class="empty-cart">Корзина пуста</p>';return}t.innerHTML=e.map(t=>`
      <div class="cart-item" data-product-id="${t.productId}">
        <div class="cart-item-image">
          <img src="${t.product.image}" alt="${t.product.name}" />
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${t.product.name}</h4>
          <p class="cart-item-category">${t.product.category}</p>
          <div class="cart-item-controls">
            <button class="quantity-btn minus" data-product-id="${t.productId}">-</button>
            <span class="quantity">${t.quantity}</span>
            <button class="quantity-btn plus" data-product-id="${t.productId}">+</button>
            <button class="remove-btn" data-product-id="${t.productId}">\xd7</button>
          </div>
        </div>
        <div class="cart-item-price">
          <span class="price">$${t.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    `).join(""),t.addEventListener("click",t=>{let a=parseInt(t.target.dataset.productId);if(t.target.classList.contains("minus")){let t=e.find(t=>t.productId===a);t&&t.quantity>1?this.updateCartItemQuantity(a,t.quantity-1):this.removeFromCart(a)}else if(t.target.classList.contains("plus")){let t=e.find(t=>t.productId===a);t&&this.updateCartItemQuantity(a,t.quantity+1)}else t.target.classList.contains("remove-btn")&&this.removeFromCart(a)});let a=document.querySelector(".cart-total");a&&(a.textContent=`$${this.getCartTotal().toFixed(2)}`)}openCart(){let t=document.querySelector(".cart-modal");t||(t=this.createCartModal(),document.body.appendChild(t)),this.renderCartItems(),t.style.display="flex",document.body.style.overflow="hidden"}closeCart(){let t=document.querySelector(".cart-modal");t&&(t.style.display="none",document.body.style.overflow="auto")}createCartModal(){let t=document.createElement("div");return t.className="cart-modal",t.innerHTML=`
      <div class="cart-modal-content">
        <div class="cart-header">
          <h2>\u{41A}\u{43E}\u{440}\u{437}\u{438}\u{43D}\u{430}</h2>
          <button class="close-cart">&times;</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-footer">
          <div class="cart-total-section">
            <span class="total-label">\u{418}\u{442}\u{43E}\u{433}\u{43E}:</span>
            <span class="cart-total">$0.00</span>
          </div>
          <button class="btn checkout-btn">\u{41E}\u{444}\u{43E}\u{440}\u{43C}\u{438}\u{442}\u{44C} \u{437}\u{430}\u{43A}\u{430}\u{437}</button>
        </div>
      </div>
    `,t.querySelector(".close-cart").addEventListener("click",()=>this.closeCart()),t.querySelector(".checkout-btn").addEventListener("click",()=>this.openCheckout()),t.addEventListener("click",e=>{e.target===t&&this.closeCart()}),t}openCheckout(){if(0===this.getCart().length)return void this.showNotification("Корзина пуста!");let t=document.querySelector(".checkout-modal");t||(t=this.createCheckoutModal(),document.body.appendChild(t)),this.renderCheckoutForm(),t.style.display="flex",this.closeCart()}createCheckoutModal(){let t=document.createElement("div");return t.className="checkout-modal",t.innerHTML=`
      <div class="checkout-modal-content">
        <div class="checkout-header">
          <h2>\u{41E}\u{444}\u{43E}\u{440}\u{43C}\u{43B}\u{435}\u{43D}\u{438}\u{435} \u{437}\u{430}\u{43A}\u{430}\u{437}\u{430}</h2>
          <button class="close-checkout">&times;</button>
        </div>
        <form class="checkout-form">
          <div class="checkout-items"></div>
          
          <div class="form-section">
            <h3>\u{41A}\u{43E}\u{43D}\u{442}\u{430}\u{43A}\u{442}\u{43D}\u{430}\u{44F} \u{438}\u{43D}\u{444}\u{43E}\u{440}\u{43C}\u{430}\u{446}\u{438}\u{44F}</h3>
            <div class="form-group">
              <label for="customer-name">\u{418}\u{43C}\u{44F} *</label>
              <input type="text" id="customer-name" name="name" required>
            </div>
            <div class="form-group">
              <label for="customer-phone">\u{422}\u{435}\u{43B}\u{435}\u{444}\u{43E}\u{43D} *</label>
              <input type="tel" id="customer-phone" name="phone" required>
            </div>
            <div class="form-group">
              <label for="customer-email">Email</label>
              <input type="email" id="customer-email" name="email">
            </div>
          </div>

          <div class="form-section">
            <h3>\u{421}\u{43F}\u{43E}\u{441}\u{43E}\u{431} \u{434}\u{43E}\u{441}\u{442}\u{430}\u{432}\u{43A}\u{438}</h3>
            <div class="delivery-methods"></div>
          </div>

          <div class="form-section">
            <h3>\u{421}\u{43F}\u{43E}\u{441}\u{43E}\u{431} \u{43E}\u{43F}\u{43B}\u{430}\u{442}\u{44B}</h3>
            <div class="payment-methods"></div>
          </div>

          <div class="checkout-total">
            <div class="total-line">
              <span>\u{422}\u{43E}\u{432}\u{430}\u{440}\u{44B}:</span>
              <span class="items-total">$0.00</span>
            </div>
            <div class="total-line">
              <span>\u{414}\u{43E}\u{441}\u{442}\u{430}\u{432}\u{43A}\u{430}:</span>
              <span class="delivery-total">$0.00</span>
            </div>
            <div class="total-line total-final">
              <span>\u{418}\u{442}\u{43E}\u{433}\u{43E}:</span>
              <span class="final-total">$0.00</span>
            </div>
          </div>

          <button type="submit" class="btn submit-order">\u{41F}\u{43E}\u{434}\u{442}\u{432}\u{435}\u{440}\u{434}\u{438}\u{442}\u{44C} \u{437}\u{430}\u{43A}\u{430}\u{437}</button>
        </form>
      </div>
    `,t.querySelector(".close-checkout").addEventListener("click",()=>this.closeCheckout()),t.addEventListener("click",e=>{e.target===t&&this.closeCheckout()}),t.querySelector(".checkout-form").addEventListener("submit",t=>this.handleOrderSubmit(t)),t}renderCheckoutForm(){let t=this.getCart(),e=this.getCartTotal();document.querySelector(".checkout-items").innerHTML=t.map(t=>`
      <div class="checkout-item">
        <img src="${t.product.image}" alt="${t.product.name}" />
        <div class="checkout-item-info">
          <h4>${t.product.name}</h4>
          <p>\u{41A}\u{43E}\u{43B}\u{438}\u{447}\u{435}\u{441}\u{442}\u{432}\u{43E}: ${t.quantity}</p>
          <p>\u{426}\u{435}\u{43D}\u{430}: $${t.totalPrice.toFixed(2)}</p>
        </div>
      </div>
    `).join("");let a=document.querySelector(".delivery-methods");a.innerHTML=c.getDeliveryMethods().map(t=>`
      <label class="delivery-option">
        <input type="radio" name="delivery" value="${t.id}" required>
        <span class="option-info">
          <span class="option-name">${t.icon} ${t.name}</span>
          <span class="option-price">$${t.price}</span>
        </span>
      </label>
    `).join(""),document.querySelector(".payment-methods").innerHTML=c.getPaymentMethods().map(t=>`
      <label class="payment-option">
        <input type="radio" name="payment" value="${t.id}" required>
        <span class="option-info">
          <span class="option-name">${t.icon} ${t.name}</span>
        </span>
      </label>
    `).join(""),document.querySelector(".items-total").textContent=`$${e.toFixed(2)}`,this.updateCheckoutTotal(),a.addEventListener("change",()=>this.updateCheckoutTotal())}updateCheckoutTotal(){let t=document.querySelector('input[name="delivery"]:checked'),e=t&&c.getDeliveryMethods().find(e=>e.id===t.value)?.price||0,a=this.getCartTotal();document.querySelector(".delivery-total").textContent=`$${e}`,document.querySelector(".final-total").textContent=`$${(a+e).toFixed(2)}`}closeCheckout(){let t=document.querySelector(".checkout-modal");t&&(t.style.display="none")}handleOrderSubmit(t){t.preventDefault();let e=new FormData(t.target),a={name:e.get("name"),phone:e.get("phone"),email:e.get("email")},o=e.get("delivery"),u=e.get("payment");if(!a.name||!a.phone)return void this.showNotification("Пожалуйста, заполните обязательные поля");if(!o)return void this.showNotification("Пожалуйста, выберите способ доставки");if(!u)return void this.showNotification("Пожалуйста, выберите способ оплаты");try{let t=c.createOrder({customerInfo:a,delivery:o,payment:u});this.showNotification(`\u{417}\u{430}\u{43A}\u{430}\u{437} #${t.id} \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{43E}\u{444}\u{43E}\u{440}\u{43C}\u{43B}\u{435}\u{43D}!`),this.closeCheckout(),this.updateCartDisplay(),this.showOrderConfirmation(t)}catch(t){this.showNotification("Ошибка при оформлении заказа. Попробуйте еще раз."),console.error("Order error:",t)}}showOrderConfirmation(t){let e=c.getDeliveryMethods().find(e=>e.id===t.delivery),a=c.getPaymentMethods().find(e=>e.id===t.payment),o=document.createElement("div");o.className="confirmation-modal",o.innerHTML=`
      <div class="confirmation-modal-content">
        <div class="confirmation-header">
          <h2>\u{417}\u{430}\u{43A}\u{430}\u{437} \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{43E}\u{444}\u{43E}\u{440}\u{43C}\u{43B}\u{435}\u{43D}!</h2>
          <button class="close-confirmation">&times;</button>
        </div>
        <div class="confirmation-body">
          <div class="order-info">
            <h3>\u{418}\u{43D}\u{444}\u{43E}\u{440}\u{43C}\u{430}\u{446}\u{438}\u{44F} \u{43E} \u{437}\u{430}\u{43A}\u{430}\u{437}\u{435}</h3>
            <p><strong>\u{41D}\u{43E}\u{43C}\u{435}\u{440} \u{437}\u{430}\u{43A}\u{430}\u{437}\u{430}:</strong> #${t.id}</p>
            <p><strong>\u{414}\u{430}\u{442}\u{430}:</strong> ${new Date(t.createdAt).toLocaleDateString("ru-RU")}</p>
            <p><strong>\u{421}\u{442}\u{430}\u{442}\u{443}\u{441}:</strong> ${this.getOrderStatusText(t.status)}</p>
          </div>
          
          <div class="delivery-info">
            <h3>\u{414}\u{43E}\u{441}\u{442}\u{430}\u{432}\u{43A}\u{430}</h3>
            <p><strong>\u{421}\u{43F}\u{43E}\u{441}\u{43E}\u{431}:</strong> ${e.icon} ${e.name}</p>
            <p><strong>\u{421}\u{442}\u{43E}\u{438}\u{43C}\u{43E}\u{441}\u{442}\u{44C}:</strong> $${e.price}</p>
          </div>
          
          <div class="payment-info">
            <h3>\u{41E}\u{43F}\u{43B}\u{430}\u{442}\u{430}</h3>
            <p><strong>\u{421}\u{43F}\u{43E}\u{441}\u{43E}\u{431}:</strong> ${a.icon} ${a.name}</p>
          </div>
          
          <div class="total-info">
            <h3>\u{418}\u{442}\u{43E}\u{433}\u{43E} \u{43A} \u{43E}\u{43F}\u{43B}\u{430}\u{442}\u{435}</h3>
            <p class="total-amount">$${t.total.toFixed(2)}</p>
          </div>
        </div>
        <div class="confirmation-footer">
          <button class="btn close-confirmation">\u{417}\u{430}\u{43A}\u{440}\u{44B}\u{442}\u{44C}</button>
        </div>
      </div>
    `,document.body.appendChild(o),o.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1002;
    `,o.querySelector(".close-confirmation").addEventListener("click",()=>{o.remove(),style.remove()}),o.addEventListener("click",t=>{t.target===o&&(o.remove(),style.remove())})}getOrderStatusText(t){return({pending:"Ожидает обработки",processing:"В обработке",shipped:"Отправлен",delivered:"Доставлен",cancelled:"Отменен"})[t]||t}showNotification(t){let e=document.createElement("div");e.className="notification",e.textContent=t,e.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `,document.body.appendChild(e),setTimeout(()=>{e.remove()},3e3)}};const l={pending:{label:"Ожидает обработки",class:"status-pending"},processing:{label:"В обработке",class:"status-processing"},shipped:{label:"Отправлен",class:"status-shipped"},delivered:{label:"Доставлен",class:"status-delivered"},cancelled:{label:"Отменен",class:"status-cancelled"}};new class{constructor(){this.init()}init(){this.createAdminButton()}createAdminButton(){if("localhost"===window.location.hostname||"127.0.0.1"===window.location.hostname){let t=document.createElement("button");t.textContent="Админ-панель",t.style.cssText=`
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
        font-size: 14px;
      `,t.addEventListener("click",()=>this.openAdminPanel()),document.body.appendChild(t)}}openAdminPanel(){let t=c.getOrders(),e=document.createElement("style");e.textContent=`
      .admin-modal { }
      .admin-modal-content {
        background: #ffffff;
        width: 90%;
        max-width: 920px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        max-height: 85vh;
        overflow: auto;
      }
      .admin-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #eaeaea;
      }
      .admin-header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
      .close-admin {
        appearance: none;
        background: transparent;
        border: none;
        font-size: 24px;
        line-height: 1;
        cursor: pointer;
        color: #888;
      }
      .close-admin:hover { color: #222; }
      .admin-body { padding: 16px 20px; }

      .order-item {
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
      }
      .order-header {
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        flex-wrap: wrap;
      }
      .order-id { font-weight: 600; }
      .order-date { color: #666; font-size: 13px; }
      .order-status {
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        background: #6c757d; /* \u{431}\u{430}\u{437}\u{43E}\u{432}\u{44B}\u{439} \u{446}\u{432}\u{435}\u{442}, \u{435}\u{441}\u{43B}\u{438} \u{43D}\u{435} \u{437}\u{430}\u{434}\u{430}\u{43D} \u{43A}\u{43B}\u{430}\u{441}\u{441} \u{441}\u{442}\u{430}\u{442}\u{443}\u{441}\u{430} */
      }
      .customer-info { margin-bottom: 8px; }
      .order-items { margin: 8px 0; }
      .order-item-product {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 0;
        border-bottom: 1px dashed #e8e8e8;
      }
      .order-item-product:last-child { border-bottom: 0; }
      .delivery-payment {
        display: flex;
        gap: 24px;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 8px;
      }
      .order-total {
        margin-top: 10px;
        text-align: right;
        font-weight: 700;
        font-size: 16px;
      }
    `,document.head.appendChild(e);let a=document.createElement("div");a.className="admin-modal",a.innerHTML=`
      <div class="admin-modal-content">
        <div class="admin-header">
          <h2>\u0410\u0434\u043C\u0438\u043D-\u043F\u0430\u043D\u0435\u043B\u044C - \u0417\u0430\u043A\u0430\u0437\u044B</h2>
          <button class="close-admin">&times;</button>
        </div>
        <div class="admin-body">
          ${0===t.length?`<p>\u0417\u0430\u043A\u0430\u0437\u043E\u0432 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442</p>`:this.renderOrdersList(t)}
        </div>
      </div>
    `,a.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1003;
    `,document.body.appendChild(a),a.querySelector(".close-admin").addEventListener("click",()=>{a.remove(),e.remove()}),a.addEventListener("click",t=>{t.target===a&&(a.remove(),e.remove())})}renderOrdersList(t){return t.map(t=>{let e=c.getDeliveryMethods().find(e=>e.id===t.delivery),a=c.getPaymentMethods().find(e=>e.id===t.payment);return`
        <div class="order-item">
          <div class="order-header">
            <span class="order-id">\u{417}\u{430}\u{43A}\u{430}\u{437} #${t.id}</span>
            <span class="order-date">${new Date(t.createdAt).toLocaleString("ru-RU")}</span>
            <span class="order-status ${l[t.status]?.class??""}">
              ${l[t.status]?.label??t.status}
            </span>
          </div>
          <div class="customer-info">
            <strong>\u041A\u043B\u0438\u0435\u043D\u0442:</strong> ${t.customerInfo.name}<br>
            <strong>\u0422\u0435\u043B\u0435\u0444\u043E\u043D:</strong> ${t.customerInfo.phone}<br>
            ${t.customerInfo.email?`<strong>Email:</strong> ${t.customerInfo.email}`:""}
          </div>
          <div class="order-items">
            <strong>\u{422}\u{43E}\u{432}\u{430}\u{440}\u{44B}:</strong>
            ${(t.items||[]).map(t=>{let e,a=(e=t.productId,c.getProductById(e));return`<div class="order-item-product">
                <span>${a.name} x${t.quantity}</span>
                <span>$${(a.price*t.quantity).toFixed(2)}</span>
              </div>`}).join("")}
          </div>
          <div class="delivery-payment">
            <div class="delivery-info">
              <strong>\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430:</strong><br>
              ${e.icon} ${e.name}<br>
              <span style="color: #2c5aa0;">$${e.price}</span>
            </div>
            <div class="payment-info">
              <strong>\u041E\u043F\u043B\u0430\u0442\u0430:</strong><br>
              ${a.icon} ${a.name}
            </div>
          </div>
          <div class="order-total">
            \u0418\u0442\u043E\u0433\u043E: $${t.total.toFixed(2)}
          </div>
        </div>
      `}).join("")}},document.addEventListener("DOMContentLoaded",()=>{e.forEach(t=>t.addEventListener("click",o)),a.forEach(t=>t.addEventListener("click",u));let t=document.querySelector(".modal-form");t&&t.addEventListener("submit",e=>{e.preventDefault(),u(),alert("Спасибо! Мы свяжемся с вами."),t.reset()}),i.forEach(t=>t.addEventListener("click",s)),n.forEach(t=>t.addEventListener("click",d)),document.addEventListener("keydown",t=>{"Escape"===t.key&&(u(),d())})});
//# sourceMappingURL=bose-test.b71d0dce.js.map
