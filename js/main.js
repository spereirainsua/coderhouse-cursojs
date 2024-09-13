
//TEST DE FUNCIONES
const testDeFunciones = () => {
    solicitarValores()
    let continuar = true
    while (continuar) {
        let menu = parseInt(prompt("Menu para testear las funciones\nSeleccione la opción deseada: \n   1- mostrarDatos()\n   2- cargarIngresosOGastos()\n   3- sumarIngresos()\n   4- sumarGastos()\n   0- Salir"))
        switch (menu) {
            case 1:
                mostrarDatos(datosIngresosyGastos)
                break
            case 2:
                cargarIngresosOGastos(datosIngresosyGastos)
                break
            case 3:
                console.log(sumarIngresos(datosIngresosyGastos))
                break
            case 4:
                console.log(sumarGastos(datosIngresosyGastos))
                break
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
const datosIngresosyGastos = []
const solicitarValores = () => {
    let continuar = true
    while (continuar) {
        let valor = parseInt(prompt("INGRESO DE DATOS PARA LAS PRUEBAS\nIngrese un valor de tipo númerico: "))
        datosIngresosyGastos.push(valor)
        let confirmacion = prompt("¿Desea ingresar más datos? (s/n)").toLowerCase()
        // while (confirmacion != "s" || confirmacion != "n") {
        //     confirmacion = prompt("Opción erronea, debe ingresar 's' o 'n'.\n¿Desea ingresar más datos? (s/n)").toLowerCase()
        // }
        if (confirmacion == "n") {
            continuar = false
        }
    }
}

//Cargar nuevos montos
const cargarIngresosOGastos = (datosIngresosyGastos) => {
    let valor = parseInt(prompt("Ingrese un valor de tipo númerico: "))
    datosIngresosyGastos.push(valor)
}

//Quitar ultimo monto cargado
const quitarUltimoMontoCargado = (datosIngresosyGastos) => {
    datosIngresosyGastos.pop()
}

//Mostrar datos almacenados
const mostrarDatos = (datos) => {
    console.log(datos.join("\n"))
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

//Llamada a la función de test
testDeFunciones()