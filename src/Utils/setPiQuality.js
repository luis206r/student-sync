function setPiQuality(imageUrl, calidad) {
  var posicion = imageUrl.lastIndexOf('=');

  if (posicion !== -1) {
    var parteIzquierda = imageUrl.substring(0, posicion + 1);
    var nuevaCadena = parteIzquierda + 's' + calidad;
    //console.log("nuevo url: ", nuevaCadena);
    return nuevaCadena;
  } else {
    return imageUrlString;
  }
}

export default setPiQuality;