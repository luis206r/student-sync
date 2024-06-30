
const getTime = (value) => {
  // Obtener la fecha actual
  const currentDate = value ? new Date(value) : new Date();

  // Obtener el día, mes y año
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Los meses empiezan en 0
  const year = currentDate.getFullYear();

  // Formatear la fecha como día/mes/año
  const formattedDate = `${day}/${month}/${year}`;

  // Obtener la hora actual
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();

  // Convertir la hora a formato PM
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convertir horas a formato de 12 horas

  // Formatear la hora como horas:minutos PM/AM
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${amOrPm}`;

  return ({ time: formattedTime, date: formattedDate })
}

export default getTime;