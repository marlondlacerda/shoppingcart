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
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return items.appendChild(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
//   console.log('oi');
// }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);

  const test = document.querySelector('.cart__items');
  test.appendChild(li);
  return li;
}

const fetchItemPromise = async () => fetch(urlApi)
  .then((response) => response.json()
  .then((data) => {
    data.results.forEach((item) => {
      createProductItemElement(item);
    });
  }));

const searchId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json()
  .then((data) => {
    createCartItemElement(data);
  }));
};

const addCar = (click) => {
  if (click.target.classList.contains('item__add')) {
    const id = ((click.target).parentNode.firstChild).innerText;
    searchId(id);
  }
};

window.onload = () => { 
  fetchItemPromise();

  document.addEventListener('click', addCar);
};
