import { ls } from '/js/helpers/localStorageHelper.js';

const table = document.querySelector('#products-table');
const saveBtn = document.querySelector("#save-btn");
const openModalBtn = document.querySelector("#open-modal-btn");
const closeModalBtn = document.querySelector("#close-modal-btn");
const modal = document.querySelector("#productModal");
const nameField = document.querySelector("#name-field");
const quantityField = document.querySelector("#quantity-field");

let selectedId;
let action = 'store';
let products = [];

init();

table.addEventListener('click', function(e) {
  let target = e.target;

  if(target.classList.contains('edit-btn')) {
    let id = target.closest('tr').dataset.id;    
    editProduct(+id);
  }

  if(target.classList.contains('delete-btn')) {
    let id = target.closest('tr').dataset.id;
    let confirmed = confirm('Eliminar producto');
    if (confirmed) {
      deleteProduct(+id); 
      renderProducts();     
    }    
  }
});

openModalBtn.addEventListener('click', function(e) {
  action = 'store';
  toggleModal();
});

closeModalBtn.addEventListener('click', function(e) {
  resetFields();
  toggleModal();
});

saveBtn.addEventListener('click', saveProduct);

function getProduct(id) {
  return products.find( product => product.id === id );
}

function storeProduct(data) {
  products.push(data); 
  ls.store('products', products); 
}

function editProduct(id) {
  action = 'update';
  selectedId = id;
  const product = getProduct(id);
  fillFields(product);
  toggleModal();
}

function deleteProduct(id) {
  products = products.filter( product => {
    return product.id !== id;
  });

  ls.store('products', products);
}

function updateProduct(id, data) {
  products = products.map( product => {
    if(product.id === id) {
      return {...product, ...data};
    }

    return product;
  });

  ls.store('products', products);
}

function toggleModal() {
  modal.classList.toggle('hidden');
}

function saveProduct(e) {
  if (!validateFields()) {
    alert('Por favor completa todos los campos!');
  }

  let data = {
    name : nameField.value,
    quantity : quantityField.value
  };

  if( action === 'store') {
    let id = Date.now();
    storeProduct({...data, id: id});
  } else if (action === 'update') {
    updateProduct(selectedId, data);
  }

  renderProducts();
  alert('Datos actualizados con éxito');
  toggleModal();
}

function renderProducts() {
  const tableBody = table.querySelector('#products-table tbody');

  let html = '';

  if (products.length === 0) {
    console.log('sdfsd');
    html = '<tr> <td class="px-6 py-4" colspan="3">No hay productos agregados</td< </tr>'
    return tableBody.innerHTML = html;
  }

  products.forEach( ({id, name, quantity}) => {
    html+= `
    <tr data-id="${id}" class="bg-white border-b">
      <td scope="row" class="px-6 py-4   whitespace-nowrap">
        ${name}
      </td>
      <td class="px-6 py-4">
        ${quantity}
      </td>         
      <td class="px-6 py-4 text-right">
        <a href="#" class="edit-btn font-medium text-blue-600  hover:underline">Editar</a>
        <a href="#" class="delete-btn font-medium text-red-600 hover:underline">Eliminar</a>
      </td>
    </tr>
    `;
  });

  return tableBody.innerHTML = html;
}

function validateFields() {
  if (!nameField.value || !quantityField.value) {
    return false;
  }

  return true;
}

function fillFields({name, quantity}) {
  nameField.value = name;
  quantityField.value = quantity;
}

function resetFields() {
  nameField.value = '';
  quantityField.value = '';
}

function init() {
  const lsProducts = ls.get('products');
  if (lsProducts) {
    products = [...lsProducts];
  }

  renderProducts();
}