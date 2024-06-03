const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z ]*$/;
const NUMBER_REGEX = /^[0](412|212|424|426|414|416)[0-9]{7}$/;

const nameInput = document.querySelector('#input-name');
const numberInput = document.querySelector('#input-number');
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const list = document.querySelector('#list');
const user = JSON.parse(localStorage.getItem('user'));
// Validations
let nameValidation = false;
let numberValidation = false;

// Functions
const validateInput = (input, validation) => {
  const infoText = input.parentElement.children[2];
  if (input.value === '') {
    input.classList.remove('incorrect');
    input.classList.remove('correct');
    infoText.classList.remove('show');
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
    infoText.classList.remove('show');
  } else {
    input.classList.add('incorrect');
    input.classList.remove('correct');
    infoText.classList.add('show');
  }

  if (nameValidation && numberValidation) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }
}

let contacts = [];

if(!user){
  window.location.href = '../';
}

nameInput.addEventListener('input', e => {
  nameValidation = NAME_REGEX.test(nameInput.value);
  validateInput(nameInput, nameValidation);
});

numberInput.addEventListener('input', e => {
  numberValidation = NUMBER_REGEX.test(numberInput.value);
  validateInput(numberInput, numberValidation);
});

// Cerrar Sesion
const logOut = document.querySelector('#log-out');
logOut.addEventListener('click', async e => {
  localStorage.removeItem('user');
  window.location.href = '../';
});





// const user = JSON.parse(localStorage.getItem('user'));
// console.log(user);




form.addEventListener('submit', async e => {
  e.preventDefault();
  const responseJSON = await fetch('http://localhost:3030/contact', {method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: nameInput.value, number: numberInput.value, user: user.username}),
   });
   const response = await responseJSON.json();


  // Verificar si las validaciones son verdaderas
  if (nameInput === '' || numberInput === '' || !nameValidation || !numberValidation) {
    formBtn.disabled = true;
} else if (nameValidation && numberValidation) {
  formBtn.disabled = false;
  const listItem = document.createElement('li');
  listItem.innerHTML = `
    <li id="${response.id}" class="contact">
    <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="delete-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>
    <p>${response.name}</p>
    <p>${response.number}</p>
    <button class="edit-btn edit"><svg xmlns="http://www.w3.org/2000/svg" class"edit" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon edit"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/></svg></button>
    </li>
    `;
  list.append(listItem);
  form.reset();
  nameInput.classList.remove('correct');
  numberInput.classList.remove('correct');
  numberValidation = false;
  nameValidation = false;
  formBtn.disabled = true;
}
});


const getContacts = async () => {
  const response = await fetch('http://localhost:3030/contact', {method: 'GET'});
  const contacts = await response.json();
  const userContact = contacts.filter(contact => contact.user === user.username);
  userContact.forEach(contact => {

    const listItem = document.createElement('li');
  // listItem.innerHTML = '';
  listItem.innerHTML = `
    <li id="${contact.id}" class="contact">
    <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="delete-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>
    <p>${contact.name}</p>
    <p>${contact.number}</p>
    <button class="edit-btn edit"><svg xmlns="http://www.w3.org/2000/svg" class"edit" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon edit"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/></svg></button>
    </li>
    `;
    list.append(listItem);
  });
}

//Eliminar
list.addEventListener('click', async e => {
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');
  // Delete
  if (deleteBtn) {
    const id = e.target.closest('.delete-btn').parentElement.id;
    // const id = e.target.parentElement.id;
    await fetch(`http://localhost:3030/contact/${id}`, {method: 'DELETE',});
    // e.target.parentElement.remove();
    e.target.closest('.contact').parentElement.remove();
  }
  if (editBtn) {
    const li = editBtn.parentElement;
    const nameEdit = li.children[1];
    const numberEdit = li.children[2];
    // Test de REGEX a la edicion del contacto
    const nameEdited = NAME_REGEX.test(nameEdit.innerHTML);
    const numberEdited = NUMBER_REGEX.test(numberEdit.innerHTML);
    nameEdit.classList.add('editing');
    numberEdit.classList.add('editing');
    // Colores Correct e Incorrect
  
    if (nameEdited === true && numberEdited === false) {
      numberEdit.classList.add('bad');
      numberEdit.classList.remove('good');
      nameEdit.classList.add('good');
      nameEdit.classList.remove('bad');
      nameEdit.classList.remove('editing');
      numberEdit.classList.remove('editing');
      alert('Recuerda que debes ingresar un numero venezolano válido. Ejemplo: 04121234567');
    }
    if (numberEdited === true && nameEdited === false) {
      numberEdit.classList.remove('bad');
      numberEdit.classList.add('good');
      nameEdit.classList.remove('good');
      nameEdit.classList.add('bad');
      nameEdit.classList.remove('editing');
      numberEdit.classList.remove('editing');
      alert('Recuerda que Nombre y Apellido deben comenzar con mayuscula. Ejemplo: Shaddai Ramos');
    }
  
    if (!numberEdited && !nameEdited) {
      numberEdit.classList.add('bad');
      numberEdit.classList.remove('good');
      nameEdit.classList.remove('good');
      nameEdit.classList.add('bad');
      nameEdit.classList.remove('editing');
      numberEdit.classList.remove('editing');
      alert('Recuerda que Nombre y Apellido deben comenzar con mayuscula. Ejemplo: Shaddai Ramos. Y debes ingresar un numero venezolano válido. Ejemplo: 04121234567');
    }   
if (li.classList.contains('editando')) {
    if (!nameEdited || !numberEdited) {
        return;
    } else {
      li.classList.remove('editando');
      const edtContact = {
        name: nameEdit.innerHTML,
        number: numberEdit.innerHTML
      };
      const id = e.target.closest('.edit-btn').parentElement.id ;
      const responseJSON = await fetch(`http://localhost:3030/contact/${id}`, {method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(edtContact),
     });
     await responseJSON.json();
      nameEdit.removeAttribute('contenteditable');
      numberEdit.removeAttribute('contenteditable');  
      nameEdit.classList.remove('editing');
      numberEdit.classList.remove('editing');
      numberEdit.classList.remove('bad');
      numberEdit.classList.remove('good');
      nameEdit.classList.remove('bad');
      nameEdit.classList.remove('good');
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class"edit" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon edit"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/></svg>
      `;
      localStorage.setItem('contacts', JSON.stringify(contacts));
      // getContacts();
    }
} else {
  li.classList.add('editando');
  nameEdit.setAttribute('contenteditable', true);
  numberEdit.setAttribute('contenteditable', true);
  editBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
<path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
</svg>
  `;
}
  }
});



getContacts();




// (() => {
//   const contactsLocal = localStorage.getItem('contacts');
//   if (contactsLocal) {
//     const contactsArray = JSON.parse(contactsLocal);
//     contacts = contactsArray;
//     getContacts();
//   }
// })();