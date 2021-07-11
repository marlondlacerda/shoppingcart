const olItems = '.cart__items';

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
  section.appendChild(createCustomElement(
    'button',
    'item__add btn btn-info',
    'Adicionar ao carrinho!',
));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const totalPrice = () => {
  const getTotal = document.querySelector('.total-price');
  const getPrice = document.querySelectorAll('.cart__item');
  let price = 0;
  getPrice.forEach((getPriceText) => {
    const removePrice = getPriceText.innerText.split('$');
    price += Number(removePrice[1]);
  });

  getTotal.innerHTML = `${(Math.round((price * 100)) / 100)}`;
};

const saveLocalStorage = () => {
  const cart = document.querySelector(olItems).innerHTML;

  localStorage.setItem('cart', '');
  localStorage.setItem('cart', JSON.stringify(cart));
};

const loadLocalStorage = () => {
  const cart = document.querySelector(olItems);
  cart.innerHTML = JSON.parse(localStorage.getItem('cart'));
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  totalPrice();
  saveLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const addProductItem = (item) => {
  const items = document.querySelector('.items');
  items.appendChild(createProductItemElement(item));
};

const fetchItemPromise = async (query) => {
  const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const resultJson = await api.json();
  const dataJson = await resultJson.results;
  dataJson.forEach((item) => addProductItem(item));
};

const searchId = async (id) => {
  const cart = document.querySelector(olItems);
  const idApi = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const resultJson = await idApi.json();
  cart.appendChild(createCartItemElement(resultJson));
  totalPrice();
  saveLocalStorage();
  };

// source https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
const clearCart = () => {
  const cart = document.querySelector(olItems);
  while (cart.firstChild) {
    cart.removeChild(cart.firstChild);
    totalPrice();
    saveLocalStorage();
  }
};

const execute = (click) => {
  if (click.target.classList.contains('item__add')) {
    const id = ((click.target).parentNode.firstChild).innerText;
    searchId(id);
  }

  if (click.target.classList.contains('empty-cart')) {
    clearCart();
  }

  if (click.target.classList.contains('cart__item')) {
    click.target.remove();
    totalPrice();
    saveLocalStorage();
  }
};

window.onload = () => { 
  fetchItemPromise('computador');
  loadLocalStorage();
  totalPrice();

  document.addEventListener('click', execute);
};
