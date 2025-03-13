/*
Parcial 1 - PROGRAMACIÓN WEB
Respetado estudiante teniendo en cuenta el proyecto proporcionado deberá desarrollar las siguientes funcionalidades en el sitio web:

1) Solicitar datos del clima a la API de https://open-meteo.com/en/docs usando las coordenadas seleccionadas por el usuario en el mapa.
2) Solicitar los datos de Geolocalización en la API de https://geocodify.com/
3) Solicitar la imágen de la bandera del pais donde está ubicado el punto seleccionado al servicio:https://documenter.getpostman.com/view/1134062/T1LJjU52#89ad7ab2-e3e1-4d8a-b99d-44e1c149e788
2) Cuando llega la respuesta del servidor, si es correcta mostrar los datos en la tabla correspondiente.
3) Desarrollar un historial de busquedas anteriores que vaya cargando en la medida que el usuario
selecciona diferentes ubicaciones en el mapa, dicho historial debe ser una TABLA.
*/

let mapa;

window.addEventListener("load",function(){

map = new ol.Map({
target: 'map',
layers: [
new ol.layer.Tile({
source: new ol.source.OSM(),
}),
],
view: new ol.View({
center: ol.proj.transform([-72.265911,3.7644111], 'EPSG:4326', 'EPSG:3857'),
zoom: 5,
}),
});

map.on('click', function(evt){
let coordinates = ol.proj.toLonLat(evt.coordinate);
let latitud = coordinates[1];
let longitud = coordinates[0];
obtenerDatosCompletos(longitud, latitud)
console.log("Latitud:",latitud);
console.log("Longitud:",longitud);
});

})
function cargardatos(longitud,latitud,datos,datosgeo){
  document.getElementById("v_lat").innerText = latitud.toFixed(5);
  document.getElementById("v_long").innerText = longitud.toFixed(5);
  document.getElementById("v_temp").innerText = datos.current.temperature_2m;
  document.getElementById("v_hum").innerText = datos.current.relative_humidity_2m;
  document.getElementById("pais").innerText = datosgeo.response.features[0]?.properties?.country || "Desconocido";
  document.getElementById("region").innerText = datosgeo.response.features[0]?.properties?.region || "Desconocido";
  document.getElementById("Ciudad").innerText = datosgeo.response.features[0]?.properties?.locality || "Desconocido";
}

function cargarbandera(datos){
  document.getElementById("bandera").src=datos.data.flag;
}

function tabalahist(longitud,latitud,datos,datosgeo){
    let pais = datosgeo.response.features[0]?.properties?.country || "Desconocido";
    let region = datosgeo.response.features[0]?.properties?.region || "Desconocido";
    let ciudad = datosgeo.response.features[0]?.properties?.locality || "Desconocido";
    let temperatura = datos.current.temperature_2m;
    let humedad = datos.current.relative_humidity_2m;
    let tbody = document.getElementById("bodyt");

    let nuevafila = document.createElement("tr");
    nuevafila.innerHTML = `
        <td>${pais}</td>
        <td>${region}</td>
        <td>${ciudad}</td>
        <td>${latitud.toFixed(5)}</td>
        <td>${longitud.toFixed(5)}</td>
        <td>${temperatura} °C</td>
        <td>${humedad} %</td>`;

    tbody.appendChild(nuevafila);
  }
let url_base="https://api.open-meteo.com/v1/forecast?"
let end_url="&current=temperature_2m,relative_humidity_2m"
let url_cody = "https://api.geocodify.com/v2/reverse?api_key=ISUpMJYQgPXfyOraRuOsTLSta0z0VWBu";
function obtenerDatosCompletos(longitud, latitud) {
  let urlClima = url_base + "latitude=" + latitud + "&longitude=" + longitud + end_url;
  let urlGeo = url_cody + "&lat=" + latitud + "&lng=" + longitud;

  Promise.all([
      fetch(urlClima).then(res => {
          if (!res.ok) throw new Error("Error en la solicitud del clima");
          return res.json();
      }),
      fetch(urlGeo).then(res => {
          if (!res.ok) throw new Error("Error en la solicitud de geocodificación");
          return res.json();
      })
  ])
  .then(([dataClima, dataGeo]) => {
      cargardatos(longitud, latitud, dataClima,dataGeo);
      tabalahist(longitud, latitud, dataClima, dataGeo);
      obtenerbandera(dataGeo)
  })
  .catch(error => {
      console.log("Error en la obtención de datos:", error);
  });
}

function obtenerbandera(datosgeo){
  let pais = datosgeo.response.features[0]?.properties?.country || "Desconocido";
  if (pais === "Desconocido") {
    console.log("No se puede obtener la bandera, país desconocido.");
    return;
  }
  fetch("https://countriesnow.space/api/v0.1/countries/flag/images", {
    method: "POST",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ country: pais })
  })
  .then((res)=>{
    if (!res.ok) {
      throw new Error("Error en la solicitud de bandera")
    };
    return res.json();
  })
  .then((data)=>{
    cargarbandera(data)
  })
  .catch((error)=>{
    console.log("Error:",error)
  })
}

