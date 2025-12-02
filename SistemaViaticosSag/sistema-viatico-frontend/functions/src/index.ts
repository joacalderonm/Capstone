/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";

import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.

setGlobalOptions({maxInstances: 10});

export const helloWorld = onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Inicializa el SDK de Admin para que la función tenga acceso a Firebase
initializeApp();

/**
 * Función HTTPS "callable" que lista todos los usuarios de Firebase Auth.
 * Solo accesible para usuarios con custom claim 'admin'.
 */

export const listUsers = onCall(async (request) => {
  // Verificación de seguridad: solo admins pueden listar usuarios
  if (!request.auth?.token.admin) {
    logger.error(
      "Intento no autorizado para listar usuarios",
      {uid: request.auth?.uid}
    );
    throw new HttpsError(
      "permission-denied",
      "Solo los administradores pueden ejecutar esta acción."
    );
  }

  logger.info(
    "Petición recibida para listar usuarios",
    {uid: request.auth?.uid}
  );

  try {
    const listUsersResult = await getAuth().listUsers(1000);
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      disabled: userRecord.disabled,
      creationTime: userRecord.metadata.creationTime,
    }));
    return {users};
  } catch (error) {
    logger.error("Error al listar los usuarios:", error);
    throw new HttpsError(
      "internal",
      "Ocurrió un error al consultar los usuarios."
    );
  }
});

export const createUser = onCall(async (request) => {
  // Verificación de seguridad: solo admins pueden crear usuarios
  if (!request.auth?.token.admin) {
    logger.error(
      "Intento no autorizado para crear usuario",
      {uid: request.auth?.uid}
    );
    throw new HttpsError(
      "permission-denied",
      "Solo los administradores pueden ejecutar esta acción.",
    );
  }

  logger.info(
    "Petición recibida para crear usuario",
    {uid: request.auth?.uid}
  );

  const {correo, password, rol} = request.data;

  // Validación básica de datos
  if (!correo || !password) {
    throw new HttpsError(
      "invalid-argument",
      "Faltan datos obligatorios.",
    );
  }

  try {
    const userRecord = await getAuth().createUser({
      email: correo,
      password,
      disabled: false,
    });

    if (rol === 1) {
      await getAuth().setCustomUserClaims(userRecord.uid, {admin: true});
    }

    logger.info(
      "Usuario creado correctamente",
      {uid: userRecord.uid, email: correo}
    );

    return {
      uid: userRecord.uid,
      email: correo,
    };
  } catch (error) {
    logger.error("Error al crear usuario:", error);
    throw new HttpsError(
      "internal",
      "Ocurrió un error al crear el usuario.",
    );
  }
});

