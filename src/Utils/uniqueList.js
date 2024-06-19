const uniqueList = (a, b) => {

  const combinadoSinDuplicados = [...a, ...b].reduce(
    (acumulador, objeto) => {
      // Usamos el ID como clave para verificar duplicados
      const id = objeto.id;
      if (!acumulador[id]) {
        acumulador[id] = objeto;
      }
      return acumulador;
    },
    {}
  );
  return Object.values(combinadoSinDuplicados);
}


export { uniqueList }