// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./esteticachely-83ac7-firebase-adminsdk-h7d5u-ab14b6b42a.json'); // Reemplaza con la ruta correcta

// Inicializa la aplicación de Firebase con las credenciales de la cuenta de servicio
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://esteticachely-83ac7.appspot.com' // Reemplaza con el nombre de tu bucket
});

// Exporta el bucket para que pueda ser utilizado en otras partes de tu aplicación
const bucket = admin.storage().bucket();

module.exports = bucket;
