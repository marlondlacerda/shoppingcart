const urlApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const textPrice = '.text-price';
let total = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const saveLocalStore = () => {
  const cart = document.querySelector('.cart').innerHTML;
  localStorage.setItem('cart', cart);
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const spanTotal = document.querySelector(textPrice);
  const price = event.target.lastChild.innerText;
  total -= price;
  if (total < 0) total = 0;
  spanTotal.innerHTML = `Preço Total: $<span class="total-price">${total}</span>`;
  event.target.remove();
  saveLocalStore();
}

const totalPrice = (price = 0) => {
  const spanTotal = document.querySelector(textPrice);
  total += price;
  spanTotal.innerHTML = `Preço Total: $<span class="total-price">${total}</span>`;
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span class="price">${salePrice}</span>`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const addProductItem = (item) => {
  const items = document.querySelector('.items');
  items.appendChild(createProductItemElement(item));
};

const fetchItemPromise = async () => fetch(urlApi)
  .then((response) => response.json()
  .then((data) => {
    data.results.forEach((item) => {
      addProductItem(item);
    });
  }));

const searchId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json()
  .then((data) => {
    const cart = document.querySelector('.cart__items');
    cart.appendChild(createCartItemElement(data));
    totalPrice(data.price);
    saveLocalStore();
  }));
};

// source https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
const clearCart = () => {
  const cart = document.querySelector('.cart__items');
  while (cart.firstChild) {
    cart.removeChild(cart.firstChild);
  }
  saveLocalStore();
};

const execute = (click) => {
  if (click.target.classList.contains('item__add')) {
    const id = ((click.target).parentNode.firstChild).innerText;
    searchId(id);
  }

  if (click.target.classList.contains('empty-cart')) {
    const spanTotal = document.querySelector(textPrice);
    total = 0;
    spanTotal.innerHTML = `Preço Total: $<span class="total-price">${total}</span>`;

    clearCart();
  }
};

const loadLocal = () => {
  const cart = document.querySelector('.cart');
  const saved = localStorage.getItem('cart', cart);
  if (saved) {
    cart.innerHTML = saved;
  }
};

window.onload = () => { 
  fetchItemPromise();
  totalPrice();
  loadLocal();

  document.addEventListener('click', execute);
};
