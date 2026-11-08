/* =========================================================
   CONFIGURACIÓN — Panel Dental Cabanillas
   1) Crea tu proyecto en https://console.firebase.google.com
   2) Agrega una app web (</>) y copia aquí los datos de "firebaseConfig"
   3) Mientras apiKey diga "PEGA_AQUI", el panel funciona en MODO DEMO
      (los datos se guardan solo en este navegador).
   ========================================================= */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAHiWiixDap3ww40HhzzEwoLFewa4G55w0",
  authDomain: "dentista-dc60c.firebaseapp.com",
  projectId: "dentista-dc60c",
  storageBucket: "dentista-dc60c.firebasestorage.app",
  messagingSenderId: "548769548061",
  appId: "1:548769548061:web:ff17cf0fdeb9c5b6ba43f4"
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
