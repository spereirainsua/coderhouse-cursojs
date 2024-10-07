
//TEST DE FUNCIONES
const testDeFunciones = () => {
    solicitarValores()
    let continuar = true
    while (continuar) {
        let menu = parseInt(prompt("Menu para testear las funciones\nSeleccione la opción deseada: \n   1- mostrarDatos()\n   2- cargarIngresosOGastos()\n   3- sumarIngresos()\n   4- sumarGastos()\n   5- porcentajeGastadoDelSueldo()\n   6- balanceTotal()\n   0- Salir"))
        switch (menu) {
            case 1:
                mostrarDatos(datosIngresosyGastos)
                break
            case 2:
                cargarIngresosOGastos(datosIngresosyGastos)
                break
            case 3:
                console.log("Ingresos registrados: " + sumarIngresos(datosIngresosyGastos))
                break
            case 4:
                console.log("Gastos registrados: " + sumarGastos(datosIngresosyGastos))
                break
            case 5:
                console.log("Gastaste " + Math.round(porcentajeGastadoDelSueldo(30000, datosIngresosyGastos)) + "% de tu sueldo.")
            case 6:
                console.log("El balance de tu cuenta es: " + balanceTotal(datosIngresosyGastos))
            case 0:
                break
            default:
                alert("Opción incorrecta")
                break
        }
        if (menu == 0) {
            let confirmacion = prompt("¿Seguro desea salir? (si/no)").toLowerCase()
            if (confirmacion == "si") {
                continuar = false
            }
        }
    }
}

//Solicitud de datos al usuario y guardarlos en una variable

// const solicitarValores = () => {
//     let continuar = true
//     while (continuar) {
//         let valor = parseInt(prompt("INGRESO DE DATOS PARA LAS PRUEBAS\nIngrese un valor de tipo númerico: "))
//         datosIngresosyGastos.push(valor)
//         let confirmacion = prompt("¿Desea ingresar más datos? (s/n)").toLowerCase()
//         while (confirmacion != "s" && confirmacion != "n") {
//             confirmacion = prompt("Opción erronea, debe ingresar 's' o 'n'.\n¿Desea ingresar más datos? (s/n)").toLowerCase()
//         }
//         if (confirmacion == "n") {
//             continuar = false
//         }
//     }
// }

//Cargar nuevos montos
const datosIngresosyGastos = []

document.addEventListener("DOMContentLoaded", () => {
    let validarDatos = localStorage.getItem("Montos")
    if (validarDatos) {
        JSON.parse(validarDatos).forEach(dato => {
            datosIngresosyGastos.push(dato)
        })
        Registro.id = datosIngresosyGastos.slice(-1)[0].id
    }
    console.log(datosIngresosyGastos)
})

class Registro {
    static id = 0
    constructor (concepto, monto, iog) {
        this.id = ++Registro.id
        this.concepto = concepto
        if (iog == "gasto") {
            this.monto = monto * -1
        } else {
            this.monto = monto
        }
    }
    // enPesos = () => {
    //     return this.precio * precioDolar
    // }
}

const cargarIngresosOGastos = (concepto, monto, iog) => {
    let dato = new Registro(concepto, monto, iog)
    datosIngresosyGastos.push(dato)
    localStorage.setItem("Montos", JSON.stringify(datosIngresosyGastos))
}

//Quitar ultimo monto cargado
const quitarUltimoMontoCargado = (datosIngresosyGastos) => {
    datosIngresosyGastos.pop()
}

//Mostrar datos almacenados
const mostrarDatos = (datos) => {
    // console.log(datos.join("\n"))
}

//Sumar valores positivos de un array
const sumarIngresos = (ingresos) => {
    let total = 0
    for (let valor of ingresos) {
        if (valor > 0) {
            total += valor
        }
    }
    return total
}

//Sumar valores negativos de un array
const sumarGastos = (gastos) => {
    let total = 0
    for (let valor of gastos) {
        if (valor < 0) {
            total += valor
        }
    }
    return total
}

//Calcular porcentaje gastado a partir de un valor de sueldo
const porcentajeGastadoDelSueldo = (sueldo, datos) => {
    let gastos = sumarGastos(datos) * -1
    let porcentaje = (gastos * 100) / sueldo
    return porcentaje
}

//Calcular el total de todos los valores ingresados
const balanceTotal = (datos) => sumarIngresos(datos) + sumarGastos(datos)

//Llamada a la función de test
// testDeFunciones()




const collapse = Array.from(document.querySelectorAll('.collapse-carga-balance'))
const collapse_title = document.getElementById('collapse-title')
const collapse_body = Array.from(document.querySelectorAll('.collapse-body'))
const btnCargar = document.getElementById("btnCargar")
let estadoCollapse = collapse[0].classList.contains("show")
let btnCargaBalance = Array.from(document.querySelectorAll(".btn-carga-balance"))
let lastBtn = null

btnCargaBalance.forEach(btn => {
    btn.onclick = (e) => {
        estadoCollapse = collapse[0].classList.contains("show")
        if (estadoCollapse) {
            if (e.currentTarget.id == lastBtn) {
                //SI SE HACE CLICK EN EL MISMO BOTON SE OCULTA
                new bootstrap.Collapse(collapse[0])
                estadoCollapse = collapse[0].classList.contains("show")
            } else {
                //SI SE HACE CLICK MIENTRAS ESTA ABIERTO LA OPCION OPUESTA SE CAMBIA SIN OCULTAR
                collapse_title.innerHTML = e.currentTarget.id.toUpperCase()
                lastBtn = e.currentTarget.id
                btnCargar.name = e.currentTarget.id
            }
        } else {
            //AL DAR CLICK EN UNO DE LOS BOTONES SE MUESTRA CON ESA OPCION
            new bootstrap.Collapse(collapse[0])
            estadoCollapse = collapse[0].classList.contains("show")
            collapse_title.innerHTML = e.currentTarget.id.toUpperCase()
            lastBtn = e.currentTarget.id
            btnCargar.name = e.currentTarget.id
        }
    }
})

document.addEventListener("click", (event) => {
    estadoCollapse = collapse[0].classList.contains("show")
    if (!collapse[0].contains(event.target) && !btnCargaBalance[0].contains(event.target) && !btnCargaBalance[1].contains(event.target) && estadoCollapse) {  
        new bootstrap.Collapse(collapse[0])
        estadoCollapse = collapse[0].classList.contains("show")
    }
})


//INGRESAR NUEVOS DATOS
btnCargar.addEventListener("click", (e) =>{
    let concepto = document.getElementById("concepto").value
    let monto = document.getElementById("monto").value
    cargarIngresosOGastos(concepto, monto, e.currentTarget.name)
})
    