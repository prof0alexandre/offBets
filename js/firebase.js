// js/firebase.js
// Configuração central do Firebase para o projeto "Brasil Contra as Bets".
// Este arquivo apenas inicializa o app e exporta as instâncias que serão
// utilizadas em js/script.js. Não altere o nome da coleção nem dos campos.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuração do projeto Firebase (já criado)
const firebaseConfig = {
  apiKey: "AIzaSyAvHUe-8kCWlV4YBwAMLujzxpcBOsyNMc8",
  authDomain: "offbet-4e7a8.firebaseapp.com",
  projectId: "offbet-4e7a8",
  storageBucket: "offbet-4e7a8.firebasestorage.app",
  messagingSenderId: "67833815843",
  appId: "1:67833815843:web:b257fd25da750b9e122296"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Instância do Firestore, usada em js/script.js
const db = getFirestore(app);

export { app, db };
