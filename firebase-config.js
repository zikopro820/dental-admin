/* =========================================================
   CONFIGURACIÓN — Panel Dental Cabanillas
   1) Crea tu proyecto en https://console.firebase.google.com
   2) Agrega una app web (</>) y copia aquí los datos de "firebaseConfig"
   3) Mientras apiKey diga "PEGA_AQUI", el panel funciona en MODO DEMO
      (los datos se guardan solo en este navegador).
   ========================================================= */
window.FIREBASE_CONFIG = {
  apiKey: "PEGA_AQUI",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

/* Datos del consultorio que usa el panel */
window.APP = {
  nombre: "Dental Cabanillas",
  prefijoCodigo: "DC",   // los códigos saldrán como DC-7K3P9
  portal: "https://zikopro820.github.io/dental/mi-sonrisa",   // página pública Mi Sonrisa
  veterinarios: ["Dr. Luis Cabanillas", "Dra. Andrea Cabanillas", "Dr. Martín Rojas", "Dra. Fiorella Quispe"],
  sedes: ["Consultorio 1", "Consultorio 2"],
  servicios: ["Evaluación", "Limpieza dental", "Curación con resina", "Blanqueamiento", "Ortodoncia", "Endodoncia", "Extracción", "Implante", "Odontopediatría"],
  vacunas: []
};
