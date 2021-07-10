const urlApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
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
  }));
};

// source https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
const clearCart = () => {
  const cart = document.querySelector('.cart__items');
  while (cart.firstChild) {
    cart.removeChild(cart.firstChild);
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
};

window.onload = () => { 
  fetchItemPromise();

  document.addEventListener('click', execute);
};
