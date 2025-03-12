/* Codigo javascript gestionar una lista de tareas 
1. El usuario debe poder ingresar tareas.
2. El usuario debe poder marcar tareas como completadas al hacer click en ellas.
3. El usuario debe poder marcar tareas como no completadas al hacer click en ellas cuando estan completadas 
(por defecto las tareas agregadas están no completadas).
4. El usuario debe poder ver la lista de tareas.
*/

let listaTareas = [];

//Función para agregar una tarea a la lista
function agregarTarea() {
    let nombreTarea=document.getElementById("inputTarea").value;
    let tarea={
        nombre:nombreTarea,
        completado:false
    }
    listaTareas.push(tarea)
    document.getElementById("inputTarea").value="";
    mostrarTareas()
}

//Función para mostrar la lista de tareas
function mostrarTareas() {
    let lista=document.getElementById("listaTareas")
    lista.innerHTML="";
    for(let i=0;i<listaTareas.length;i++){
        let tarea=listaTareas[i]
        let item=document.createElement("li")
        item.textContent=tarea.nombre;
        if(tarea.completado){
            item.classList.add("completado")
        }
        item.addEventListener("click",function(){
            if(tarea.completado){
                item.classList.remove("completado")
                item.classList.add("noCompletado")
            } else{
                item.classList.add("completado")
                item.classList.remove("noCompletado")
            }
            tarea.completado=!tarea.completado
            mostrarTareas()
        })
        lista.appendChild(item)
    }
}

//Agregar el evento click al botón
document.getElementById("btnAgregarTarea").addEventListener("click", agregarTarea);
