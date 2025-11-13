// app.js - catálogo, carrito deslizante y checkout (ajustado)

// Productos (los que ya tenías)
const PRODUCTS = [
  {id:1,title:'Gorra New Era NY',price:70500,category:'gorra',
    img:'https://i.pinimg.com/736x/11/82/7e/11827e5153b9087b765a289d2a462e75.jpg',
    img2:'https://i.pinimg.com/564x/11/82/7e/11827e5153b9087b765a289d2a462e75.jpg',
    desc:'Gorra estilo vintage con bordado.'},
  {id:2,title:'Remera Logo',price:30200,category:'remera',
    img:'https://i.pinimg.com/736x/45/59/6b/45596b5965e726086ee8c629394138f9.jpg',
    img2:'https://i.pinimg.com/564x/45/59/6b/45596b5965e726086ee8c629394138f9.jpg',
    desc:'Remera algodón peinado, corte recto.'},
  {id:3,title:'Zapatillas Adidas Superstar II rojas',price:90200,category:'zapas',
    img:'https://www.moov.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw92f44326/products/ADJR7316/ADJR7316-1.JPG',
    img2:'https://www.moov.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw92f44326/products/ADJR7316/ADJR7316-2.JPG',
    desc:'Zapatillas cómodas para el día a día.'},
  {id:4,title:'Remera Oversize',price:30500,category:'remera',
    img:'https://i.pinimg.com/736x/eb/d6/d3/ebd6d3233d6e69fd21fea2b26568ef7a.jpg',
    img2:'https://i.pinimg.com/564x/eb/d6/d3/ebd6d3233d6e69fd21fea2b26568ef7a.jpg',
    desc:'Oversize con estampado minimal.'},
  {id:5,title:'Gorra New Era Rusa',price:2100,category:'gorra',
    img:'https://i.pinimg.com/736x/96/f2/60/96f2604de807a2a6b51b1abc20df78f3.jpg',
    img2:'https://i.pinimg.com/564x/96/f2/60/96f2604de807a2a6b51b1abc20df78f3.jpg',
    desc:'Gorra New Era con orejas de peluche.'},
  {id:6,title:'Hoodie m6',price:50000,category:'buzos',
    img:'https://i.pinimg.com/1200x/64/8d/69/648d6913154ac07c1ec065cc8f2b53bf.jpg',
    img2:'https://i.pinimg.com/736x/64/8d/69/648d6913154ac07c1ec065cc8f2b53bf.jpg',
    desc:'Buzo con capucha con el logo m6.'},
  {id:7,title:'Hoodie Adidas',price:40000,category:'buzos',
    img:'https://i.pinimg.com/736x/05/bb/37/05bb376a5bab691073ba9579f9c6bde4.jpg',
    img2:'https://i.pinimg.com/564x/05/bb/37/05bb376a5bab691073ba9579f9c6bde4.jpg',
    desc:'Buzo Adidas vintage con capucha.'},
  {id:8,title:'Hoodie Polo Ralph Lauren',price:70000,category:'buzos',
    img:'https://i.pinimg.com/736x/3a/5a/c0/3a5ac09fb324e7ee691d3d0eea7a318b.jpg',
    img2:'https://i.pinimg.com/564x/3a/5a/c0/3a5ac09fb324e7ee691d3d0eea7a318b.jpg',
    desc:'Buzo con capucha con el logo de Polo Ralph Lauren.'},
];

// Estado
let cart = JSON.parse(localStorage.getItem('og_cart') || '[]');

// Elementos
const productsEl = document.getElementById('products');
const cartIcon = document.getElementById('cartIcon');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const cartContent = document.getElementById('cartContent');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const productModal = document.getElementById('productModal');
const checkoutModal = document.getElementById('checkoutModal');
const cartBadgeSmall = document.getElementById('cartBadgeSmall');

// Toast
const toast = document.createElement('div');
toast.id = 'og_toast';
toast.style.cssText = 'position:fixed;top:20px;right:20px;padding:10px 14px;background:#0a66c2;color:#fff;border-radius:8px;box-shadow:0 8px 20px rgba(0,0,0,0.3);opacity:0;transform:translateY(-8px);transition:0.28s;z-index:1600;';
document.body.appendChild(toast);

// Helpers
function saveCart(){ localStorage.setItem('og_cart', JSON.stringify(cart)); }
function updateBadge(){
  const qty = cart.reduce((s,c)=>s+(c.qty||0),0);
  cartBadgeSmall.textContent = qty || '';
  cartBadgeSmall.style.display = qty ? 'inline-block' : 'none';
}
function showToast(txt){
  toast.textContent = txt;
  toast.style.opacity='1'; toast.style.transform='translateY(0)';
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(()=>{ toast.style.opacity='0'; toast.style.transform='translateY(-8px)'; },1600);
}

// RENDER PRODUCTS
function renderProducts(list){
  productsEl.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `
      <div class="img-wrap"><img class="product-img" src="${p.img}" alt="${p.title}" data-img="${p.img}" ${p.img2?`data-img2="${p.img2}"`:''}></div>
      <div class="info">
        <h3>${p.title}</h3>
        <div class="price">$${p.price.toLocaleString()}</div>
        <div class="btn-group">
          <button class="btn view-btn" data-id="${p.id}">👁 Ver</button>
          <button class="btn add-btn" data-add="${p.id}">+ 🛒</button>
        </div>
      </div>
      <div class="overlay">
        <button class="btn add-btn" data-add="${p.id}">Agregar</button>
      </div>
    `;
    productsEl.appendChild(card);

    const imgEl = card.querySelector('.product-img');
    if(imgEl && imgEl.dataset.img2){
      imgEl.addEventListener('mouseenter', ()=> imgEl.src = imgEl.dataset.img2);
      imgEl.addEventListener('mouseleave', ()=> imgEl.src = imgEl.dataset.img);
    }
  });
}

// CART FUNCTIONS
function addToCart(id, qty = 1, size = 'M'){
  const existing = cart.find(x => x.id === id && x.size === size);
  if(existing) existing.qty += qty;
  else cart.push({ id, qty, size });
  saveCart(); renderCart(); showToast('Producto agregado al carrito');
}
function removeFromCart(id, size){
  cart = cart.filter(x => !(x.id === id && x.size === size));
  saveCart(); renderCart();
}
function changeQuantity(id, size, delta){
  const item = cart.find(x => x.id === id && x.size === size);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(id, size);
  else saveCart();
  renderCart();
}
function calculateTotal(){
  return cart.reduce((s,it)=>{
    const p = PRODUCTS.find(x => x.id === it.id);
    return s + (p ? p.price * it.qty : 0);
  },0);
}
function renderCart(){
  cartContent.innerHTML = '';
  if(!cart.length){
    cartContent.innerHTML = '<p>Tu carrito está vacío.</p>';
    cartTotal.textContent = '$0';
    updateBadge();
    return;
  }
  let total = 0;
  cart.forEach(it=>{
    const p = PRODUCTS.find(x => x.id === it.id);
    if(!p) return;
    total += p.price * it.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="cart-item-info">
        <h4>${p.title}</h4>
        <p>Talle: ${it.size || '—'}</p>
        <p>$${p.price.toLocaleString()}</p>
        <div class="quantity">
          <button class="qty-btn dec" data-id="${p.id}" data-size="${it.size}">−</button>
          <span class="cart-qty">${it.qty}</span>
          <button class="qty-btn inc" data-id="${p.id}" data-size="${it.size}">+</button>
        </div>
      </div>
      <button class="remove-btn" data-rem="${p.id}" data-size="${it.size}">✕</button>
    `;
    cartContent.appendChild(div);
  });
  cartTotal.textContent = '$' + total.toLocaleString();
  updateBadge();
}

// MODAL PRODUCT
function openProduct(id){
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  document.getElementById('modalTitle').innerText = p.title;
  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalDesc').innerText = p.desc;
  document.getElementById('modalPrice').innerText = '$' + p.price.toLocaleString();
  document.getElementById('modalQty').value = 1;
  productModal.dataset.id = id;
  productModal.style.display = 'flex';
  productModal.setAttribute('aria-hidden','false');
}
function closeModal(){
  productModal.style.display = 'none';
  productModal.setAttribute('aria-hidden','true');
}

// EVENTS (delegation)
document.addEventListener('click', e => {
  // ver producto
  const view = e.target.closest('.view-btn');
  if(view){ openProduct(+view.dataset.id); return; }

  // add quick -> abre modal para elegir talle
  const add = e.target.closest('.add-btn');
  if(add){ openProduct(+add.dataset.add); return; }

  // inc/dec qty en carrito
  if(e.target.classList.contains('inc')) { changeQuantity(+e.target.dataset.id, e.target.dataset.size, 1); return; }
  if(e.target.classList.contains('dec')) { changeQuantity(+e.target.dataset.id, e.target.dataset.size, -1); return; }

  // remove item
  const rem = e.target.closest('[data-rem]');
  if(rem){ removeFromCart(+rem.dataset.rem, rem.dataset.size); return; }
});

// add from modal
document.getElementById('addToCartBtn').addEventListener('click', ()=>{
  const id = +productModal.dataset.id;
  const qty = +document.getElementById('modalQty').value || 1;
  const size = document.getElementById('modalSize').value;
  if(!size){ alert('Seleccioná un talle'); return; }
  addToCart(id, qty, size);
  closeModal();
});

// cart panel open/close
cartIcon.addEventListener('click', e => { e.stopPropagation(); cartPanel.classList.toggle('active'); cartPanel.setAttribute('aria-hidden', cartPanel.classList.contains('active') ? 'false' : 'true'); });
closeCart.addEventListener('click', ()=> cartPanel.classList.remove('active'));
document.addEventListener('click', e => { if(!cartPanel.contains(e.target) && !cartIcon.contains(e.target)) cartPanel.classList.remove('active'); });

// modal close
document.getElementById('closeModal').addEventListener('click', closeModal);
productModal.addEventListener('click', e => { if(e.target === productModal) closeModal(); });
window.addEventListener('keydown', e => { if(e.key === 'Escape'){ closeModal(); cartPanel.classList.remove('active'); checkoutModal.style.display = 'none'; }});

// filters
const search = document.getElementById('search');
const filter = document.getElementById('filter');
function applyFilters(){
  const term = (search.value || '').toLowerCase();
  const cat = filter.value || 'all';
  let out = PRODUCTS.filter(p => p.title.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term));
  if(cat !== 'all') out = out.filter(p => p.category === cat);
  renderProducts(out);
}
search.addEventListener('input', applyFilters);
filter.addEventListener('change', applyFilters);

// checkout flow (simple)
checkoutBtn.addEventListener('click', ()=>{
  if(!cart.length){ alert('Carrito vacío'); return; }
  const total = calculateTotal();
  document.getElementById('checkoutTotal').textContent = '$' + total.toLocaleString();
  checkoutModal.style.display = 'flex';
  document.getElementById('cardForm').style.display = 'flex';
  document.getElementById('qrPanel').style.display = 'none';
  document.querySelectorAll('input[name="payMethod"]').forEach(r => {
    r.onchange = ev => {
      const cardForm = document.getElementById('cardForm');
      const qrPanel = document.getElementById('qrPanel');
      if(ev.target.value === 'card'){ cardForm.style.display = 'flex'; qrPanel.style.display = 'none'; }
      else {
        cardForm.style.display = 'none'; qrPanel.style.display = 'flex';
        const qr = document.getElementById('qrImage');
qr.innerHTML = `
  <img src="qr-code.png" 
       style="width:180px;height:180px;border-radius:8px;" 
       alt="QR de pago">
          `;
      }
    };
  });
});

// pay simulation
document.getElementById('payBtn').addEventListener('click', ()=>{
  if(!cart.length) return;
  document.getElementById('processing').style.display = 'flex';
  setTimeout(()=>{
    document.getElementById('processing').style.display = 'none';
    document.getElementById('success').style.display = 'flex';
    const receipt = {
      date: new Date().toLocaleString(),
      items: cart.map(it => {
        const p = PRODUCTS.find(x => x.id === it.id);
        return {...p, qty: it.qty, size: it.size, subtotal: p.price * it.qty};
      }),
      total: calculateTotal()
    };
    localStorage.setItem('og_last_receipt', JSON.stringify(receipt));
    cart = []; saveCart(); renderCart();
    setTimeout(()=> window.location.href = 'recibo.html', 900);
  }, 1100);
});
document.getElementById('payCancel').addEventListener('click', ()=> checkoutModal.style.display = 'none');
document.getElementById('closeCheckout').addEventListener('click', ()=> checkoutModal.style.display = 'none');
document.getElementById('successClose').addEventListener('click', ()=> checkoutModal.style.display = 'none');

// CLEAR CART (agregado para prevenir error)
const clearCartBtn = document.getElementById('clearCartBtn');
if(clearCartBtn){
  clearCartBtn.addEventListener('click', ()=>{
    if(cart.length === 0) { showToast('El carrito ya está vacío'); return; }
    if(confirm('¿Seguro que querés vaciar el carrito?')){
      cart = []; saveCart(); renderCart();
      showToast('Carrito vaciado');
    }
  });
}

// INIT
applyFilters(); renderCart(); updateBadge();
