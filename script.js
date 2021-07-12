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
  section.appendChild(createCustomElement('button', 'item__add btn', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// source https://dev.to/vaishnavme/displaying-loading-animation-on-fetch-api-calls-1e5m
// showing loading
const displayLoading = () => {
  const loader = document.querySelector('#loading');
  loader.classList.add('loading');
  // to stop loading after some time
  setTimeout(() => {
      loader.classList.remove('loading');
  }, 10000);
};

// hiding loading 
const hideLoading = () => {
  const loader = document.querySelector('#loading');
  loader.remove();
};

const totalPrice = () => {
  const getTotal = document.querySelector('.total-price');
  const getPrice = document.querySelectorAll('.cart__item');
  let price = 0;
  getPrice.forEach((getPriceText) => {
    const removePrice = getPriceText.innerText.split('$'); // Ele quebra em 2 arrays o texto usando o $ como pausa
    price += Number(removePrice[1]); // Eu pego o segundo índice do array que seriam os numeros e por ser string, peço para virar numero
  });

  getTotal.innerHTML = `${(Math.round((price * 100)) / 100)}`; // Calculo para arredondar os números
};

// Save point dos li's.
const saveLocalStorage = () => {
  const cart = document.querySelector(olItems).innerHTML;

  localStorage.setItem('cart', '');
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Load point dos li's ao carregar a pagina.
const loadLocalStorage = () => {
  const cart = document.querySelector(olItems);
  cart.innerHTML = JSON.parse(localStorage.getItem('cart'));
};

// Remove o item do carrinho ao clicar nele
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

// Função inical que captura o item específico (No caso computador)
// Ele faz a promesa pegando o json do mercadolivre e chama função de addProductItem
const fetchItemPromise = async (query) => {
  displayLoading();
  const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const resultJson = await api.json();
  const dataJson = await resultJson.results;
  hideLoading();
  dataJson.forEach((item) => addProductItem(item));
};

// Função com o imput do ID do produto, ele irá dar fetch no json e logo em seguida chamar a função
// para adicionar no carrinho => Fazer o total dos preços > salvar no LocalStorage!
const searchId = async (id) => {
  const cart = document.querySelector(olItems);
  const idApi = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const resultJson = await idApi.json();
  cart.appendChild(createCartItemElement(resultJson));
  totalPrice();
  saveLocalStorage();
  };

// source https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
// Remove todos os itens do carrinho, chama a função para calcular o total e zerar dinamicamente
// E salva o status no localStorage por último!
const clearCart = () => {
  const cart = document.querySelector(olItems);
  while (cart.firstChild) {
    cart.removeChild(cart.firstChild);
    totalPrice();
    saveLocalStorage();
  }
};

const execute = (click) => {
// Verifica se o click foi para adicionar o item ao carrinho!
  if (click.target.classList.contains('item__add')) {
    const id = ((click.target).parentNode.firstChild).innerText;
    searchId(id);
  }

// Verifica se o click foi para esvaziar o carrinho!
  if (click.target.classList.contains('empty-cart')) {
    clearCart();
  }

// Verifica se o click é para remover o item do carrinho!
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

  // Essa função irá ouvir os clicks em toda a página e fazer as verificações
  document.addEventListener('click', execute);
};
