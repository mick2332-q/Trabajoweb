/*
  QUIZ 1 - PROGRAMACIÓN WEB
  Respetado estudiante teniendo en cuenta el proyecto proporcionado deberá desarrollar las siguientes funcionalidades en el sitio web:

  1) Solicitar datos del clima a la API de https://api.open-meteo.com/ usando las coordenadas seleccionadas por el usuario en el mapa. 
  2) Cuando llega la respuesta del servidor, si es correcta mostrar los datos en la tabla correspondiente. 
  3) Desarrollar un historial de busquedas anteriores que vaya cargando en la medida que el usuario selecciona diferentes ubicaciones en el mapa.
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
        let coordinates = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
        let latitud = coordinates[1];
        let longitud = coordinates[0];
        obtenerDatos(latitud,longitud)
        console.log("Latitud:",latitud);
        console.log("Longitud:",longitud);
    });

})

function cargarDatos(longitud,latitud,datos){
  document.getElementById("v_lat").innerText = longitud.toFixed(5);
  document.getElementById("v_long").innerText = latitud.toFixed(5);
  document.getElementById("v_temp").innerText = datos.current.temperature_2m; 
  document.getElementById("v_hum").innerText = datos.current.relative_humidity_2m;
}
function tablaHist(latitud, longitud, datos) {
    temperatura=datos.current.temperature_2m; 
    humedad=datos.current.relative_humidity_2m;
  let tbody = document.querySelector("#tabla_historial tbody");

  // Crear una nueva fila con celdas vacías
  let nuevaFila = document.createElement("tr");

  nuevaFila.innerHTML = `
      <td>${latitud.toFixed(5)}</td>
      <td>${longitud.toFixed(5)}</td>
      <td>${temperatura} °C</td>
      <td>${humedad} %</td>
  `;

  // Agregar la fila al tbody
  tbody.appendChild(nuevaFila);
}
let url_base="https://api.open-meteo.com/v1/forecast?"
let end_url = "&current=temperature_2m,relative_humidity_2m";

function obtenerDatos(latitud,longitud){
  let url=url_base+"latitude="+latitud+"&longitude="+longitud+end_url;
  fetch(url)
  .then((response)=>{
      if(!response.ok){
          throw new Error("Error en la solicitud")
      }
      return response.json() ;
  })
  .then((data)=>{
      cargarDatos(latitud,longitud,data);
      tablaHist(latitud,longitud,data);
  })
  .catch((error)=>{
      console.log("Error",error)
  })
}
