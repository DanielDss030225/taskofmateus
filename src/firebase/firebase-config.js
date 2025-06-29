import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, get, child, update} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyANhYoZo47qW07a5MEu6b5Selo1pw3Mf8Y",
  authDomain: "task-matheus.firebaseapp.com",
  databaseURL: "https://task-matheus-default-rtdb.firebaseio.com",
  projectId: "task-matheus",
  storageBucket: "task-matheus.appspot.com",
  messagingSenderId: "948521081001",
  appId: "1:948521081001:web:d22d6705775c92798931b8",
  measurementId: "G-YT5CSP5S0T"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { database, ref, set, get, child, update };
