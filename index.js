const inputEmailLogin = document.querySelector('.input-email-login');
const inputPasswordLogin = document.querySelector('.input-password-login');
const formLogin = document.querySelector('#form-login');
const errorEmail = document.querySelector('.error-email');
const errorPassword = document.querySelector('.error-password');
const btnLogIn = document.querySelector('#btn-login');
const inputEmailSignIn = document.querySelector('.email-sign-in');
const inputPasswordSignIn = document.querySelector('.password-sign-in');
const inputConfirmPasswordSignIn = document.querySelector('.confirm-password-sign-in');
const errorEmailSignIn = document.querySelector('.error-email-signin');
const errorPasswordSignIn = document.querySelector('.error-password-signin');
const errorConfirmPassword = document.querySelector('.error-confirm-password');
const btnSignIn = document.querySelector('#btn-signin');
const seePassword = document.querySelector('#see');
const formSignIn = document.querySelector('#form-sign-in')
const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@\”]+(\.[^<>()\[\]\\.,;:\s@\”]+)*)|(\”.+\”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
const REGEX_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
let inputEmailValidation = false;
let inputPasswordValidation = false;

                      // LOG IN
formLogin.addEventListener('submit', async e => {
  e.preventDefault();
  const response =  await fetch('http://localhost:3030/user', {method: 'GET'});
  const users = await response.json();
  const user = users.find(user => user.username === inputEmailLogin.value.toLowerCase());
  const pass = users.find(pass => pass.password === inputPasswordLogin.value);
  if (!user && !pass) {
    errorEmail.innerHTML = `El correo "${inputEmailLogin.value}" no está registrado`;
    errorPassword.innerHTML = '';
    inputEmailLogin.classList.add('wrong-input');
    inputPasswordLogin.classList.remove('wrong-input');
    inputPasswordLogin.classList.add('input-password-login');
  } else if (!user) {
    errorEmail.innerHTML = `El correo "${inputEmailLogin.value}" no está registrado`;
    errorPassword.innerHTML = '';
    inputEmailLogin.classList.add('wrong-input');
    inputPasswordLogin.classList.remove('wrong-input');
    inputPasswordLogin.classList.remove('input-email-login');
    inputPasswordLogin.classList.add('input-password-login');
  } else if (!pass && user) {
    errorEmail.innerHTML = '';
    errorPassword.innerHTML = 'Contraseña incorrecta';
    inputEmailLogin.classList.remove('wrong-input');
    inputPasswordLogin.classList.add('wrong-input');
    inputEmailLogin.classList.add('correct');
  } else if (user && pass) {
      localStorage.setItem('user', JSON.stringify(user))
      formLogin.reset();
      window.location.href = '/contact/index.html';
  }
});
// Click to Sign Up
const textSignUp = document.querySelector('#text-sign-up');
const register = document.querySelector('#div-signin');
const loginDiv = document.querySelector('#login-div');

textSignUp.addEventListener('click', e => {
  if (textSignUp) {
    register.classList.add('register-div');
    loginDiv.classList.add('none-div');
    register.classList.remove('none-div');
    loginDiv.classList.remove('login-div');
  }
});

// Click to Log In
const textLogIn = document.querySelector('#text-log-in');
textLogIn.addEventListener('click', e => {
  if (textLogIn) {
    register.classList.remove('register-div');
    register.classList.add('none-div');
    loginDiv.classList.remove('none-div');
    loginDiv.classList.add('login-div');
  }
});

// PASSWORD Validacion de datos ingresados en los inputs 
inputPasswordLogin.addEventListener('input', e => {
  // BUTTON LOG IN
if (inputPasswordLogin.value) {
  btnLogIn.disabled = false;
} else {
  btnLogIn.disabled = true;
}
});


let inputPasswordValidationSignIn = false;
let inputEmailValidationSignIn = false;

                    // SIGN UP
// EMAIL Validacion de datos ingresados en los inputs 

formSignIn.addEventListener('submit', async e => {
  e.preventDefault();
  const response =  await fetch('http://localhost:3030/user', {method: 'GET'});
  const users = await response.json();
  const user = users.find(user => user.username === inputEmailSignIn.value.toLowerCase());
  const pass = users.find(pass => pass.password === inputPasswordSignIn.value);
  if (user) {
    alert('El usuario ya existe');
  } else {
    await fetch('http://localhost:3030/user', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: inputEmailSignIn.value.toLowerCase(), password: inputPasswordSignIn.value})
    });
    alert(`El usuario ${inputEmailSignIn.value.toLowerCase()} ha sido creado con exito`);
    location.reload();
  }
});

inputEmailSignIn.addEventListener('input', e => {
  inputSignValue = inputEmailSignIn.value;
  const inputLowerSign = inputSignValue.toLowerCase()
  inputEmailValidationSignIn = REGEX_EMAIL.test(inputLowerSign);
  const errorEmailHTML = errorEmailSignIn.innerHTML = 'Debes incluir un email válido. Ejemplo: correo@ejemplo.com';
  validateEmail(inputEmailSignIn, inputEmailValidationSignIn, errorEmailHTML);

  if (inputEmailValidationSignIn) {
    errorEmailSignIn.innerHTML = '';
    inputPasswordSignIn.disabled = false;
  } else if (inputEmailValidationSignIn) {
    inputPasswordSignIn.disabled = true; 
  }
  
});

// PASSWORD Validacion de datos ingresados en los inputs 
inputPasswordSignIn.addEventListener('input', e => {
  inputPasswordValidationSignIn = REGEX_PASSWORD.test(inputPasswordSignIn.value);
  
  const errorPasswordHTML = errorPasswordSignIn.innerHTML = 'La contraseña debe contener: Al menos "Una mayúscula", mínimo "8 caracteres", minimo "Un número"';
  
  validateEmail(inputPasswordSignIn, inputPasswordValidationSignIn, errorPasswordHTML);
  
  if (inputPasswordValidationSignIn) {
    errorPasswordSignIn.innerHTML = '';
    inputConfirmPasswordSignIn.disabled = false;
  } else {
    inputConfirmPasswordSignIn.disabled = true;
  }
});
// EMAIL confirmacion de datos ingresados en los inputs 

inputConfirmPasswordSignIn.addEventListener('input', e => {
  const validateConfirm = () =>{
    if (inputConfirmPasswordSignIn.value !== inputPasswordSignIn.value) {
    btnSignIn.disabled = true;
    errorConfirmPassword.innerHTML = 'Las contraseñas deben coincidir';
    inputConfirmPasswordSignIn.classList.add('wrong');
    // inputConfirmPasswordSignIn.classList.delete('correct');
    } else if (inputConfirmPasswordSignIn.value === inputPasswordSignIn.value) {
      inputConfirmPasswordSignIn.classList.add('correct');
      inputConfirmPasswordSignIn.classList.remove('wrong');
      errorConfirmPassword.innerHTML = 'Perfecto! 👍';
      errorConfirmPassword.classList.remove('error-confirm-password');
      btnSignIn.disabled = false;
    }
  }
  validateConfirm();
});


// Funcion para validar datos de inicio de sesion y registro
const validateEmail = (input, validateInput, error) => {
  if (!input) {
    input.classList.add('wrong');
    input.classList.remove('correct');
    error.innerHTML
    return;
  } 
  if (!validateInput) {
    input.classList.add('wrong');
    input.classList.remove('correct');
    error.innerHTML
    return;
  }
    if (validateInput) {
    input.classList.add('correct');
    input.classList.remove('wrong');
    return;
  }
  }