"use strict";
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
var URL_API = "https://app-164525f9-9232-42e9-9b92-4252f9392770.cleverapps.io/";
var URL_BASE = "http://localhost/PEDIDOS_FRONT_TS/";
$(function () {
    $("#agregar").on("click", function (e) { Agregar(e); });
});
//AGREGAR
function Agregar(e) {
    e.preventDefault();
    var direccion = $("#descripcion").val();
    var fechaEntrega = $("#fechaEntrega").val();
    var fecha = (new Date()).setHours((new Date()).getHours() - 3);
    var edad = $("#correo").val();
    var nombre = $("#nombre").val();
    var apellido = $("#apellido").val();
    var dni = $("#dni").val();
    var celular = $("#precio").val();
    var form = new FormData();
    form.append("objetoJSON", JSON.stringify({ "nombre": nombre,
        "apellido": apellido,
        "edad": edad,
        "dni": dni,
        "direccion": direccion,
        "celular": celular }));
    /*
    let objetoJSON = {"nombre" : nombre,
    "apellido" : apellido,
    "edad" : edad,
    "dni" : dni,
    "direccion" : direccion,
    "celular" : celular};*/
    //JSON.stringify(pedido_json)
    $.ajax({
        type: 'POST',
        url: URL_API + "paciente",
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
        data: form,
        async: true
    })
        .done(function (resultado) {
        console.log(resultado.mensaje);
        alert(resultado.mensaje);
    })
        .fail(function (jqXHR, textStatus, errorThrown) {
        var retorno = JSON.parse(jqXHR.responseText);
        console.log(retorno);
    });
}
//# sourceMappingURL=manejadora.js.map