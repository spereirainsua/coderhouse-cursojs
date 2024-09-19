
//Declaración de constantes
// const academia = "CoderHouse";

//Declaración de variables
// let curso = prompt("Bienvenido! Que materia estas cursando? ");
// let nro_comision = prompt("Ingresa tu número de comisión: ");
//let academia = prompt("En que academia estas cursando? ");
//let flex = true;


//Mostrar en Consola
// console.log('Muestra contenido en la consola del navegador');
//console.log("Hola! Esta es la comision " + nro_comision + " de la academia " + academia);

//Mensaje de alerta
// alert("Hola! Esta es la comision " + nro_comision + " del curso de " + curso + " de la academia " + academia);

// let numeroA = 60;
// let numeroB = 45;
//parseInt convierte de string a entero, parseFloat convierte string a tipo flotante
// let resultado = parseFloat(numeroA + numeroB);
// resultado = numeroA - numeroB;
// resultado = numeroA * numeroB;
// resultado = numeroA / numeroB;

// let continuar = true
// while(continuar) {
//     let menu = parseInt(prompt("Ingrese 1 para ver su cuenta, ingrese 2 para extraccion, ingrese 3 para deposito, otro numero para salir"))
//     switch(menu) {
//         case 1:
//             console.log("Total de la cuenta $3000")
//             break
//         case 2:
//             console.log("Limite de extraccion: $1000")
//             break
//         case 3:
//             console.log("Limite de deposito: $500")
//             break
//         default:
//             console.log("Retire su tarjeta")
//             // continuar = false NO RECOMENDABLE
//             break
//     }
//      let confirmacion = prompt("Desea hacer otra consulta? (si/no)").toLowerCase()
//      if(confirmacion == "no") {
//          continuar = false
//         console.log("Retire su tarjeta")
//      }
// }

// //Función declarada
// function sumar() {
//     let numeroA = 15
//     let numeroB = 30
//     let resultado = numeroA + numeroB
//     return resultado
// }

// //Función expresada (solo se pueden utilizar despues de creadas)
// const restar = function () {
//     let numeroA = 15
//     let numeroB = 30
//     let resultado = numeroA - numeroB
//     return resultado
// }

// ARRAYS
// const array = ["Primero","Segundo","Tercero","Cuarto","Quinto"]

// // .push() --> Añade un elemento al final del array
// array.push("Sexto")

// // .unshift() --> Añade un nuevo elemento al inicio
// array.unshift("Nulo")

// // .pop() --> Quitar el ultimo elemento del array
// array.pop()

// // .shift --> Quitar el primer elemento del array
// array.shift()

// // .includes() --> Busca elemento dentro de un array devuelve true/false
// console.log(array.includes("Tercero"))

// // .indexOf() --> Devuelve el indice donde se encuentra el valor buscado sino devuelve -1
// console.log(array.indexOf("Sexto"))

// // .sort() --> Ordena un array de forma alfabetica
// array.sort()

// // .reverse() --> Invierte el orden del array
// array.reverse()

// // .join() --> Coloca un string entre medio de cada elemento del array
// console.log(array.join(" - "))

// // .splice()
// array.splice(3, 0, "Octavo")



// console.log(array)
// console.log(array.length)

// OBJETOS
// const perfume = {
//     marca: "Polo",
//     linea: "Blue",
//     color: "Azul",
//     botella: "Rectangular",
//     capacidad_ml: 125,
//     estuche: true
// }

// const jugador1 = {
//     jugador: "Messi",
//     dorsal: 10,
//     edad: 36
// }

// const jugador2 = {
//     jugador: "Dibu",
//     dorsal: 23,
//     edad: 32
// }

// const jugador3 = {
//     jugador: "Di María",
//     dorsal: 11,
//     edad: 36
// }

// const jugador4 = {
//     jugador: "Lautaro Martinez",
//     dorsal: 22,
//     edad: 27
// }

// const jugador5 = {
//     jugador: "Julian Alvarez",
//     dorsal: 9,
//     edad: 34
// }

// const convocados = [jugador1,jugador2,jugador3,jugador4,jugador5]
// console.log(convocados)

// // for-of --> Recorrer arrays
// for (const convocado of convocados) {
//     console.log(convocado.jugador)
// }

//OBJETOS CLASE 2
// const celular1 = {
//     modelo: "s24",
//     marca: "Samsung",
//     precio: 1000
// }
// const celular2 = {
//     modelo: "Iphone 16",
//     marca: "Apple",
//     precio: 1900
// }

//funcion constructora
// function Celular(modelo, marca, precio) {
//     this.modelo = modelo
//     this.marca = marca
//     this.precio = precio
// }
const precioDolar = 40
class Celular {
    static id = 0
    constructor (modelo, marca, precio) {
        this.id = ++Celular.id
        this.modelo = modelo
        this.marca = marca
        this.precio = precio
    }
    enPesos = () => {
        return this.precio * precioDolar
    }
}

const celular1 = new Celular("S24", "Samsung", 1000)
const celular2 = new Celular("Iphone 16", "Apple", 1900)

console.log(celular1, celular2)

const productos = []

const cargarProductos = () => {
    let cargarModelo = prompt("Ingrese el modelo del teléfono ")
    let cargaMarca = prompt("Ingrese la marca del teléfono ")
    let cargaPrecio = prompt("Ingrese el precio en dolares ")

    const celular = new Celular(cargarModelo, cargaMarca, cargaPrecio)
    productos.push(celular)
}

const verProductos = () => {
    console.log(productos)
}

let menu = parseInt(prompt("Ingrese la opción:\n 1- Ver catalogo de productos\n 2- Cargar nuevo producto\n 3- Salir"))
while (menu =! 3) {
    switch (menu) {
        case 1:
            verProductos()
            break
        case 2:
            cargarProductos()
            break
        default:
            alert("Opción invalida")
            break
    }
    menu = parseInt(prompt("Ingrese la opción:\n 1- Ver catalogo de productos\n 2- Cargar nuevo producto\n 3- Salir"))
}