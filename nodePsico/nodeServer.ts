const express = require('express');

const app = express();

app.set('puerto', 7497);

app.listen(app.get("puerto"), ()=>{
    console.log("el servidor esta corriendo sobre el puerto ", app.get("puerto"));
});

//AGREGO FILE SYSTEM
const fs = require('fs');

//AGREGO JSON
app.use(express.json());

//AGREGO JWT
const jwt = require("jsonwebtoken");

//SE ESTABLECE LA CLAVE SECRETA PARA EL TOKEN
app.set("key", "cl@ve_secreta");

app.use(express.urlencoded({extended:false}));

//AGREGO MULTER
const multer = require('multer');

//AGREGO MIME-TYPES
const mime = require('mime-types');

//AGREGO STORAGE
const storage = multer.diskStorage({

    destination: "public/fotos/",
});

const upload = multer({

    storage: storage
});

//AGREGO CORS (por default aplica a http://localhost)
const cors = require("cors");

//AGREGO MW 
app.use(cors());

//DIRECTORIO DE ARCHIVOS ESTÁTICOS
app.use(express.static("public"));


//AGREGO MYSQL y EXPRESS-MYCONNECTION
const mysql = require('mysql');
const myconn = require('express-myconnection');
const db_options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'paciente_bd'
};

app.use(myconn(mysql, db_options, 'single'));

app.post('/paciente', upload.none(),  (request:any, response:any)=>{
   
    let paciente = JSON.parse(request.body.objetoJSON);
    
    request.getConnection((err:any, conn:any)=>{

        if(err) throw("Error al conectarse a la base de datos.");

        conn.query("insert into pacientes set ?", [paciente], (err:any, rows:any)=>{

            if(err) {console.log(err); throw("Error en consulta de base de datos.");}

            response.send("Paciente agregado a la bd.");
        });
    });
});

app.get('/paciente/listar', (request:any, response:any)=>{

    let objetoRetorno = {
                            exito: false,
                            mensaje: "No se encontraron pacientes",
                            dato: {},
                            status: 424,
                        };

    request.getConnection((err:any, conn:any)=>{

        if(err) throw("Error al conectarse a la base de datos.");

        conn.query("select * from pacientes", (err:any, rows:any)=>{

            if(err) throw("Error en consulta de base de datos.");

            if (rows.length == 0) 
            {
                response.status(objetoRetorno.status).json(objetoRetorno);
            } 
            else 
            {
                objetoRetorno.exito = true;
                objetoRetorno.mensaje = "Listado de pacientes";
                objetoRetorno.dato = rows;
                objetoRetorno.status = 200;

                response.status(objetoRetorno.status).json(objetoRetorno);
            }
        });
    });

});

app.delete('/paciente/eliminar', upload.none(), (request:any, response:any)=>{
   
    let objetoRetorno = {
        exito: false,
        mensaje: "No se encontraron pacientes",
        status: 418,
    };

    let id = request.body.id;
    let objeto : any = {};
    objeto.id = id;

    request.getConnection((err:any, conn:any)=>{

        if(err) throw("Error al conectarse a la base de datos. delete");

        conn.query("delete from pacientes where id = ?", [objeto.id], (err:any, rows:any)=>{

            if(err) {console.log(err); throw("Error en consulta de base de datos. delete");}

            if (rows.affectedRows != 0) 
            {
                objetoRetorno.exito = true;
                objetoRetorno.mensaje = "Paciente Eliminado!";
                objetoRetorno.status = 200;
                response.status(objetoRetorno.status).json(objetoRetorno);
            } 
            else 
            { 
                response.status(objetoRetorno.status).json(objetoRetorno);
            }
        });
    });
});

app.post('/paciente/modificar', upload.none(), (request:any, response:any)=>{
   
    let objetoRetorno = {
        exito: false,
        mensaje: "No se encontraron pacientes",
        status: 418,
    };

    let paciente = JSON.parse(request.body.objetoJSON);

    let pacienteModificado : any = {};
    pacienteModificado.nombre = paciente.nombre;
    pacienteModificado.apellido = paciente.apellido;
    pacienteModificado.edad = paciente.edad;
    pacienteModificado.dni = paciente.dni;
    pacienteModificado.direccion = paciente.direccion;
    pacienteModificado.celular = paciente.celular;

    request.getConnection((err:any, conn:any)=>{

        if(err) throw("Error al conectarse a la base de datos.");

        conn.query("update pacientes set ? where id = ?", [pacienteModificado, paciente.id], (err:any, rows:any)=>{

            if(err) {console.log(err); throw("Error en consulta de base de datos.");}

            if (rows.affectedRows != 0) 
            {
                objetoRetorno.exito = true;
                objetoRetorno.mensaje = "Paciente Modificado!";
                objetoRetorno.status = 200;
                response.status(objetoRetorno.status).json(objetoRetorno);
            } 
            else 
            { 
                response.status(objetoRetorno.status).json(objetoRetorno);
            }
        });
    });
});

app.post('/paciente/buscar', upload.none(), (request:any, response:any)=>{
   
    let objetoRetorno = {
        exito: false,
        mensaje: "No se encontraron pacientes",
        paciente : {},
        status: 418,
    };

    let id = request.body.id;
    let objeto : any = {};
    objeto.id = id;

    request.getConnection((err:any, conn:any)=>{

        if(err) throw("Error al conectarse a la base de datos. delete");

        conn.query("select from pacientes where id = ?", [objeto.id], (err:any, rows:any)=>{

            if(err) {console.log(err); throw("Error en consulta de base de datos.");}

            if (rows.affectedRows != 0) 
            {
                objetoRetorno.exito = true;
                objetoRetorno.mensaje = "Paciente encontrado!";
                objetoRetorno.paciente = JSON.stringify(rows);
                objetoRetorno.status = 200;
                response.status(objetoRetorno.status).json(objetoRetorno);
            } 
            else 
            { 
                response.status(objetoRetorno.status).json(objetoRetorno);
            }
        });
    });
});
