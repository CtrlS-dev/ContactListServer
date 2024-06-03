const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z ]*$/;
const NUMBER_REGEX = /^[0](412|212|424|426|414|416)[0-9]{7}$/;
const nameInput = document.querySelector('#input-name');
const numberInput = document.querySelector('#input-number');
const formBtn = document.querySelector('#form-btn');
const formTodo = document.querySelector('#form-todo');
const list = document.querySelector('#list');
const info = document.querySelector('.info');

// no dejar entrar al usuario si no inicio sesion
const user = JSON.parse(localStorage.getItem('user'));
if(!user){
  window.location.href = '../';
}

// agregar contactos
formTodo.addEventListener('submit', async e => {
  e.preventDefault();
  nameInputValue = nameInput.value;
  const nameValidation = NAME_REGEX.test(nameInputValue);
  console.log(nameValidation);


  if (nameValidation) {
  info.innerHTML = '';
  formBtn.disabled = false;
  const responseJSON = await fetch('http://localhost:3030/contact', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: nameInput.value, number: numberInput.value, user: user.username})
    });

    const response = await responseJSON.json();
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
    formTodo.reset();
    
  } else if (nameInput.value === '' || numberInput.value === '') {
      alert('No puedes dejar estos campos vacios');
      return
  } else if (!nameValidation) {
    formBtn.disabled = true;
    info.classList.add('show');
    info.innerHTML = 'Nombre y apellido deben comenzar con mayusculas. Ejemplo: Nombre Apellido';
  }
});



const getContacts = async () => {
  const response =  await fetch('http://localhost:3030/contact', {method: 'GET'});
  const contacts = await response.json();
  const userContact = contacts.filter(contact => contact.user === user.username);
  userContact.forEach(contact => {
    const listItem = document.createElement('li');
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
};
getContacts();

                // ELIMINAR
list.addEventListener('click', async e => {
  if (e.target.classList.contains('delete-icon')) {
    const id = e.target.parentElement.parentElement.id;
    await fetch(`http://localhost:3030/contact/${id}`, {method: 'DELETE'});
    e.target.parentElement.parentElement.parentElement.remove();
  }
});

const nameValidation = false;
const numberValidation = false;

// nameInput.addEventListener('input', e => {
  
// });

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