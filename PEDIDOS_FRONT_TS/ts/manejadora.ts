/// <reference path="../node_modules/@types/jquery/index.d.ts" />

const URL_API : string = "https://app-164525f9-9232-42e9-9b92-4252f9392770.cleverapps.io/";
const URL_BASE : string = "http://localhost/PEDIDOS_FRONT_TS/";

$(()=>{
    $("#agregar").on("click", (e)=>{Agregar(e)})
});

//AGREGAR
function Agregar(e:any):void 
{  
    e.preventDefault();

    let direccion = $("#descripcion").val();
    let fechaEntrega = $("#fechaEntrega").val();
    let fecha = (new Date()).setHours((new Date()).getHours()-3);
    let edad = $("#correo").val();
    let nombre = $("#nombre").val();
    let apellido = $("#apellido").val();
    let dni = $("#dni").val();
    let celular = $("#precio").val();

    let form = new FormData();
    form.append("objetoJSON", JSON.stringify({"nombre" : nombre,
    "apellido" : apellido, 
    "edad" : edad, 
    "dni" : dni, 
    "direccion" : direccion, 
    "celular" : celular}));
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
    .done(function (resultado:any) {

        console.log(resultado.mensaje);
        alert(resultado.mensaje);
    })
    .fail(function (jqXHR:any, textStatus:any, errorThrown:any) {

        let retorno = JSON.parse(jqXHR.responseText);

        console.log(retorno);
    });    
}
