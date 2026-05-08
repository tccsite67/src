// IMPORTA FIREBASE
import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";


// CONFIG FIREBASE
const firebaseConfig = {

  apiKey: "AIzaSyB5aZiyqKJWE1oVoC58lXRrXHvdStf8q8Y",

  authDomain: "sitetcc67.firebaseapp.com",

  databaseURL:
    "https://sitetcc67-default-rtdb.firebaseio.com",

  projectId: "sitetcc67",

  storageBucket: "sitetcc67.appspot.com",

  messagingSenderId: "494915537665",

  appId:
    "1:494915537665:web:c1a35674b86ecb2e936900"
};


// INICIALIZA FIREBASE
const app = initializeApp(firebaseConfig);


// INICIALIZA AUTH
const auth = getAuth(app);


// ELEMENTOS HTML
const loginForm = document.getElementById("loginForm");
const registerBtn = document.getElementById("registerBtn");


// LOGIN
loginForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    // LOGIN FIREBASE
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    console.log("Usuário logado:", user);

    // Salva token de autenticação no localStorage
    localStorage.setItem("authToken", user.uid);

    alert("Login realizado com sucesso!");

    // REDIRECIONA
    window.location.href = "analytics.html";

  } catch (error) {

    console.log(error);

    alert("Erro no login: " + error.message);

  }

});


// BOTÃO PARA IR PARA CADASTRO
registerBtn.addEventListener("click", () => {
  window.location.href = "signup.html";
});


// LOGOUT
async function logout() {

  try {

    await signOut(auth);

    alert("Logout realizado!");

    window.location.href = "index.html";

  } catch (error) {

    console.log(error);

  }
}
