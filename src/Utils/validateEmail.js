function validarEmail(email) {
  // Expresión regular para validar el formato de un correo electrónico
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export default validarEmail;