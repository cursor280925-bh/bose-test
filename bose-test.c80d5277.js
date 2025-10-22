const t=document.getElementById("modal"),e=document.querySelectorAll("[data-open-modal]"),o=document.querySelectorAll("[data-close-modal], .modal-backdrop, .modal-close");function r(){if(!t)return;t.setAttribute("aria-hidden","false"),document.body.style.overflow="hidden";let e=t.querySelector("input");e&&setTimeout(()=>e.focus(),50)}function a(){t&&(t.setAttribute("aria-hidden","true"),document.body.style.overflow="")}const i=document.getElementById("burger-menu"),n=document.querySelectorAll("[data-open-burger]"),u=document.querySelectorAll("[data-close-burger]");function d(){i&&i.setAttribute("aria-hidden","false")}function s(){i&&i.setAttribute("aria-hidden","true")}document.querySelectorAll(".icon-like").forEach((t,e)=>{let o=`product-${e}-liked`;"1"===localStorage.getItem(o)&&t.classList.add("active"),t.addEventListener("click",()=>{t.classList.toggle("active"),t.classList.contains("active")?localStorage.setItem(o,"1"):localStorage.removeItem(o)})});const c=new class{constructor(){this.products=[{id:1,name:"Bose portable Smart speaker",category:"Smart home",price:399,image:"img/products/Bose_portable_Smart_speaker_desk.png",description:"Портативная умная колонка с голосовым управлением"},{id:2,name:"SoundLink Flex Bluetooth speaker",category:"Portable bluetooth",price:149,image:"img/products/Portable_bluetooth_desk.png",description:"Портативная Bluetooth колонка с водонепроницаемостью"},{id:3,name:"SoundLink Color Bluetooth speaker II",category:"Portable bluetooth",price:129,image:"img/products/Portable_bluetooth_II_desk.png",description:"Цветная портативная Bluetooth колонка"}],this.cart=[],this.orders=[],this.paymentMethods=[{id:"card",name:"Банковская карта",icon:"\uD83D\uDCB3"},{id:"cash",name:"Наличные при получении",icon:"\uD83D\uDCB5"},{id:"online",name:"Онлайн оплата",icon:"\uD83C\uDF10"}],this.deliveryMethods=[{id:"ukrpost",name:"Укрпошта",price:50,icon:"\uD83D\uDCEE"},{id:"novapost",name:"Нова пошта",price:80,icon:"\uD83D\uDE9A"}]}getProducts(){return this.products}getProductById(t){return this.products.find(e=>e.id===t)}addToCart(t,e=1){if(!this.getProductById(t))return!1;let o=this.cart.find(e=>e.productId===t);return o?o.quantity+=e:this.cart.push({productId:t,quantity:e,addedAt:new Date}),!0}removeFromCart(t){this.cart=this.cart.filter(e=>e.productId!==t)}updateCartItemQuantity(t,e){let o=this.cart.find(e=>e.productId===t);o&&(e<=0?this.removeFromCart(t):o.quantity=e)}getCart(){return this.cart.map(t=>{let e=this.getProductById(t.productId);return{...t,product:e,totalPrice:e.price*t.quantity}})}getCartTotal(){return this.cart.reduce((t,e)=>t+this.getProductById(e.productId).price*e.quantity,0)}clearCart(){this.cart=[]}createOrder(t){let e={id:Date.now(),items:[...this.cart],total:this.getCartTotal(),delivery:t.delivery,payment:t.payment,customerInfo:t.customerInfo,status:"pending",createdAt:new Date};return this.orders.push(e),this.clearCart(),e}getOrders(){return this.orders}getPaymentMethods(){return this.paymentMethods}getDeliveryMethods(){return this.deliveryMethods}};new class{constructor(){this.cart=[],this.init()}init(){this.bindEvents(),this.updateCartDisplay()}bindEvents(){document.addEventListener("click",t=>{if("В корзину"===t.target.textContent||"В корзину"===t.target.textContent.trim()){t.preventDefault();let e=t.target.closest(".card");e&&this.addToCartFromCard(e)}}),document.addEventListener("click",t=>{if("Купить"===t.target.textContent||"Купить"===t.target.textContent.trim()){t.preventDefault();let e=t.target.closest(".card");e&&(this.addToCartFromCard(e),this.openCart())}}),document.addEventListener("click",t=>{t.target.closest("[data-open-cart]")&&(t.preventDefault(),this.openCart())})}addToCartFromCard(t){let e=t.querySelector(".card-title"),o=t.querySelector(".card-price");if(e&&o){let t=e.textContent.trim();parseFloat(o.textContent.replace(/[^0-9.]/g,""));let r=c.getProducts().find(e=>e.name===t);r&&c.addToCart(r.id,1)&&(this.showNotification("Товар добавлен в корзину!"),this.updateCartDisplay())}}addToCart(t,e=1){return!!c.addToCart(t,e)&&(this.updateCartDisplay(),!0)}removeFromCart(t){c.removeFromCart(t),this.updateCartDisplay()}updateCartItemQuantity(t,e){c.updateCartItemQuantity(t,e),this.updateCartDisplay()}getCart(){return c.getCart()}getCartTotal(){return c.getCartTotal()}clearCart(){c.clearCart(),this.updateCartDisplay()}updateCartDisplay(){let t=this.getCart();this.getCartTotal();let e=document.querySelector(".cart-counter");if(e){let o=t.reduce((t,e)=>t+e.quantity,0);e.textContent=o,e.style.display=o>0?"block":"none"}let o=document.querySelector(".cart-modal");o&&"none"!==o.style.display&&this.renderCartItems()}renderCartItems(){let t=document.querySelector(".cart-items");if(!t)return;let e=this.getCart();if(0===e.length){t.innerHTML='<p class="empty-cart">Корзина пуста</p>';return}t.innerHTML=e.map(t=>`
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
    `).join(""),t.addEventListener("click",t=>{let o=parseInt(t.target.dataset.productId);if(t.target.classList.contains("minus")){let t=e.find(t=>t.productId===o);t&&t.quantity>1?this.updateCartItemQuantity(o,t.quantity-1):this.removeFromCart(o)}else if(t.target.classList.contains("plus")){let t=e.find(t=>t.productId===o);t&&this.updateCartItemQuantity(o,t.quantity+1)}else t.target.classList.contains("remove-btn")&&this.removeFromCart(o)});let o=document.querySelector(".cart-total");o&&(o.textContent=`$${this.getCartTotal().toFixed(2)}`)}openCart(){let t=document.querySelector(".cart-modal");t||(t=this.createCartModal(),document.body.appendChild(t)),this.renderCartItems(),t.style.display="flex",document.body.style.overflow="hidden"}closeCart(){let t=document.querySelector(".cart-modal");t&&(t.style.display="none",document.body.style.overflow="auto")}createCartModal(){let t=document.createElement("div");return t.className="cart-modal",t.innerHTML=`
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
    `).join("");let o=document.querySelector(".delivery-methods");o.innerHTML=c.getDeliveryMethods().map(t=>`
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
    `).join(""),document.querySelector(".items-total").textContent=`$${e.toFixed(2)}`,this.updateCheckoutTotal(),o.addEventListener("change",()=>this.updateCheckoutTotal())}updateCheckoutTotal(){let t=document.querySelector('input[name="delivery"]:checked'),e=t&&c.getDeliveryMethods().find(e=>e.id===t.value)?.price||0,o=this.getCartTotal();document.querySelector(".delivery-total").textContent=`$${e}`,document.querySelector(".final-total").textContent=`$${(o+e).toFixed(2)}`}closeCheckout(){let t=document.querySelector(".checkout-modal");t&&(t.style.display="none")}handleOrderSubmit(t){t.preventDefault();let e=new FormData(t.target),o={name:e.get("name"),phone:e.get("phone"),email:e.get("email")},r=e.get("delivery"),a=e.get("payment");if(!o.name||!o.phone)return void this.showNotification("Пожалуйста, заполните обязательные поля");if(!r)return void this.showNotification("Пожалуйста, выберите способ доставки");if(!a)return void this.showNotification("Пожалуйста, выберите способ оплаты");try{let t=c.createOrder({customerInfo:o,delivery:r,payment:a});this.showNotification(`\u{417}\u{430}\u{43A}\u{430}\u{437} #${t.id} \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{43E}\u{444}\u{43E}\u{440}\u{43C}\u{43B}\u{435}\u{43D}!`),this.closeCheckout(),this.updateCartDisplay(),this.showOrderConfirmation(t)}catch(t){this.showNotification("Ошибка при оформлении заказа. Попробуйте еще раз."),console.error("Order error:",t)}}showOrderConfirmation(t){let e=c.getDeliveryMethods().find(e=>e.id===t.delivery),o=c.getPaymentMethods().find(e=>e.id===t.payment),r=document.createElement("div");r.className="confirmation-modal",r.innerHTML=`
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
            <p><strong>\u{421}\u{43F}\u{43E}\u{441}\u{43E}\u{431}:</strong> ${o.icon} ${o.name}</p>
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
    `,document.body.appendChild(r),r.style.cssText=`
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
    `;let a=document.createElement("style");a.textContent=`
      .confirmation-modal-content {
        background: white;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .confirmation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
      }
      
      .confirmation-header h2 {
        margin: 0;
        color: #4CAF50;
        font-size: 24px;
      }
      
      .close-confirmation {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
      }
      
      .confirmation-body {
        padding: 20px;
      }
      
      .confirmation-body h3 {
        color: #333;
        margin-bottom: 10px;
        font-size: 18px;
      }
      
      .confirmation-body p {
        margin: 5px 0;
        color: #666;
      }
      
      .total-amount {
        font-size: 24px;
        font-weight: 700;
        color: #2c5aa0;
      }
      
      .confirmation-footer {
        padding: 20px;
        border-top: 1px solid #eee;
        text-align: center;
      }
      
      .confirmation-footer .btn {
        padding: 12px 30px;
        background: #2c5aa0;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
      }
    `,document.head.appendChild(a),r.querySelector(".close-confirmation").addEventListener("click",()=>{r.remove(),a.remove()}),r.addEventListener("click",t=>{t.target===r&&(r.remove(),a.remove())})}getOrderStatusText(t){return({pending:"Ожидает обработки",processing:"В обработке",shipped:"Отправлен",delivered:"Доставлен",cancelled:"Отменен"})[t]||t}showNotification(t){let e=document.createElement("div");e.className="notification",e.textContent=t,e.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `,document.body.appendChild(e),setTimeout(()=>{e.remove()},3e3)}},new class{constructor(){this.init()}init(){this.createAdminButton()}createAdminButton(){if("localhost"===window.location.hostname||"127.0.0.1"===window.location.hostname){let t=document.createElement("button");t.textContent="Админ-панель",t.style.cssText=`
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
      `,t.addEventListener("click",()=>this.openAdminPanel()),document.body.appendChild(t)}}openAdminPanel(){let t=c.getOrders(),e=document.createElement("div");e.className="admin-modal",e.innerHTML=`
      <div class="admin-modal-content">
        <div class="admin-header">
          <h2>\u{410}\u{434}\u{43C}\u{438}\u{43D}-\u{43F}\u{430}\u{43D}\u{435}\u{43B}\u{44C} - \u{417}\u{430}\u{43A}\u{430}\u{437}\u{44B}</h2>
          <button class="close-admin">&times;</button>
        </div>
        <div class="admin-body">
          ${0===t.length?"<p>Заказов пока нет</p>":this.renderOrdersList(t)}
        </div>
      </div>
    `,e.style.cssText=`
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
    `;let o=document.createElement("style");o.textContent=`
      .admin-modal-content {
        background: white;
        border-radius: 10px;
        width: 90%;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
        background: #f8f9fa;
      }
      
      .admin-header h2 {
        margin: 0;
        color: #333;
      }
      
      .close-admin {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
      }
      
      .admin-body {
        padding: 20px;
      }
      
      .order-item {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        background: #f9f9f9;
      }
      
      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      
      .order-id {
        font-weight: 600;
        color: #2c5aa0;
      }
      
      .order-date {
        color: #666;
        font-size: 14px;
      }
      
      .order-status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
      }
      
      .status-pending {
        background: #fff3cd;
        color: #856404;
      }
      
      .order-details {
        margin-bottom: 10px;
      }
      
      .order-items {
        margin-bottom: 10px;
      }
      
      .order-item-product {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
      }
      
      .order-total {
        font-weight: 600;
        color: #2c5aa0;
        font-size: 16px;
      }
      
      .customer-info {
        background: #f0f8ff;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      
      .delivery-payment {
        display: flex;
        gap: 20px;
        margin-bottom: 10px;
      }
      
      .delivery-info, .payment-info {
        flex: 1;
        background: #f8f9fa;
        padding: 10px;
        border-radius: 5px;
      }
    `,document.head.appendChild(o),document.body.appendChild(e),e.querySelector(".close-admin").addEventListener("click",()=>{e.remove(),o.remove()}),e.addEventListener("click",t=>{t.target===e&&(e.remove(),o.remove())})}renderOrdersList(t){return t.map(t=>{let e=c.getDeliveryMethods().find(e=>e.id===t.delivery),o=c.getPaymentMethods().find(e=>e.id===t.payment);return`
        <div class="order-item">
          <div class="order-header">
            <span class="order-id">\u{417}\u{430}\u{43A}\u{430}\u{437} #${t.id}</span>
            <span class="order-date">${new Date(t.createdAt).toLocaleString("ru-RU")}</span>
            <span class="order-status status-${t.status}">${this.getOrderStatusText(t.status)}</span>
          </div>
          
          <div class="customer-info">
            <strong>\u{41A}\u{43B}\u{438}\u{435}\u{43D}\u{442}:</strong> ${t.customerInfo.name}<br>
            <strong>\u{422}\u{435}\u{43B}\u{435}\u{444}\u{43E}\u{43D}:</strong> ${t.customerInfo.phone}<br>
            ${t.customerInfo.email?`<strong>Email:</strong> ${t.customerInfo.email}`:""}
          </div>
          
          <div class="order-items">
            <strong>\u{422}\u{43E}\u{432}\u{430}\u{440}\u{44B}:</strong>
            ${t.items.map(t=>{let e=c.getProductById(t.productId);return`
                <div class="order-item-product">
                  <span>${e.name} x${t.quantity}</span>
                  <span>$${(e.price*t.quantity).toFixed(2)}</span>
                </div>
              `}).join("")}
          </div>
          
          <div class="delivery-payment">
            <div class="delivery-info">
              <strong>\u{414}\u{43E}\u{441}\u{442}\u{430}\u{432}\u{43A}\u{430}:</strong><br>
              ${e.icon} ${e.name}<br>
              <span style="color: #2c5aa0;">$${e.price}</span>
            </div>
            <div class="payment-info">
              <strong>\u{41E}\u{43F}\u{43B}\u{430}\u{442}\u{430}:</strong><br>
              ${o.icon} ${o.name}
            </div>
          </div>
          
          <div class="order-total">
            \u{418}\u{442}\u{43E}\u{433}\u{43E}: $${t.total.toFixed(2)}
          </div>
        </div>
      `}).join("")}getOrderStatusText(t){return({pending:"Ожидает обработки",processing:"В обработке",shipped:"Отправлен",delivered:"Доставлен",cancelled:"Отменен"})[t]||t}},document.addEventListener("DOMContentLoaded",()=>{e.forEach(t=>t.addEventListener("click",r)),o.forEach(t=>t.addEventListener("click",a));let t=document.querySelector(".modal-form");t&&t.addEventListener("submit",e=>{e.preventDefault(),a(),alert("Спасибо! Мы свяжемся с вами."),t.reset()}),n.forEach(t=>t.addEventListener("click",d)),u.forEach(t=>t.addEventListener("click",s)),document.addEventListener("keydown",t=>{"Escape"===t.key&&(a(),s())})});
//# sourceMappingURL=bose-test.c80d5277.js.map
