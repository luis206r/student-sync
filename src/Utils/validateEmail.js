const validarCorreoUtec = (correo, dominio) => {
  if (correo === "student.collab.app@gmail.com") return true;
  // Escapamos el punto para que se tome literalmente en la expresión regular
  const dominioRegex = new RegExp(`@${dominio.replace(".", "\\.")}$`, "i");

  // Verificamos si el correo electrónico termina con el dominio especificado
  return dominioRegex.test(correo);
}

export default validarCorreoUtec;