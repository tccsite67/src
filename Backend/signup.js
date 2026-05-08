// IMPORTA FIREBASE
import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
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
const signupForm = document.getElementById("signupForm");
const backToLoginBtn = document.getElementById("backToLoginBtn");


// CADASTRO
signupForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // VALIDAÇÃO DE SENHAS IGUAIS
  if (password !== confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }

  // VALIDAÇÃO DE SENHA MÍNIMA
  if (password.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres!");
    return;
  }

  try {

    // CRIA USUÁRIO NO FIREBASE
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    console.log("Usuário criado:", user);

    // Salva token de autenticação no localStorage
    localStorage.setItem("authToken", user.uid);

    alert("Cadastro realizado com sucesso! Bem-vindo ao Fisio Smart!");

    // REDIRECIONA PARA O PAINEL
    window.location.href = "analytics.html";

  } catch (error) {

    console.log(error);

    // TRATA ERROS ESPECÍFICOS
    if (error.code === "auth/email-already-in-use") {
      alert("Este email já está cadastrado. Faça login ou use outro email.");
    } else if (error.code === "auth/invalid-email") {
      alert("Email inválido.");
    } else if (error.code === "auth/weak-password") {
      alert("A senha é muito fraca. Use uma senha mais forte.");
    } else {
      alert("Erro no cadastro: " + error.message);
    }

  }

});


// BOTÃO PARA VOLTAR AO LOGIN
backToLoginBtn.addEventListener("click", () => {
  window.location.href = "index.html";
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
