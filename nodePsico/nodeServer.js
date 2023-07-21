"use strict";
const express = require('express');
const app = express();
app.set('puerto', 7497);
app.listen(app.get("puerto"), () => {
    console.log("el servidor esta corriendo sobre el puerto ", app.get("puerto"));
});
const fs = require('fs');
app.use(express.json());
const jwt = require("jsonwebtoken");
app.set("key", "cl@ve_secreta");
app.use(express.urlencoded({ extended: false }));
const multer = require('multer');
const mime = require('mime-types');
const storage = multer.diskStorage({
    destination: "public/fotos/",
});
const upload = multer({
    storage: storage
});
const cors = require("cors");
app.use(cors());
app.use(express.static("public"));
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
app.post('/paciente', upload.none(), (request, response) => {
    let paciente = JSON.parse(request.body.objetoJSON);
    request.getConnection((err, conn) => {
        if (err)
            throw ("Error al conectarse a la base de datos.");
        conn.query("insert into pacientes set ?", [paciente], (err, rows) => {
            if (err) {
                console.log(err);
                throw ("Error en consulta de base de datos.");
            }
            response.send("Paciente agregado a la bd.");
        });
    });
});
app.get('/paciente/listar', (request, response) => {
    let objetoRetorno = {
        exito: false,
        mensaje: "No se encontraron pacientes",
        dato: {},
        status: 424,
    };
    request.getConnection((err, conn) => {
        if (err)
            throw ("Error al conectarse a la base de datos.");
        conn.query("select * from pacientes", (err, rows) => {
            if (err)
                throw ("Error en consulta de base de datos.");
            if (rows.length == 0) {
                response.status(objetoRetorno.status).json(objetoRetorno);
            }
            else {
                objetoRetorno.exito = true;
                objetoRetorno.mensaje = "Listado de pacientes";
                objetoRetorno.dato = rows;
                objetoRetorno.status = 200;
                response.status(objetoRetorno.status).json(objetoRetorno);
            }
        });
    });
});
app.delete('/paciente/eliminar', (request, response) => {
    let objetoRetorno = {
        exito: false,
        mensaje: "No se encontraron pacientes",
        status: 418,
    };
    let id = request.body.id;
    let objeto = {};
    objeto.id = id;
    request.getConnection((err, conn) => {
        if (err)
            throw ("Error al conectarse a la base de datos. delete");
        conn.query("delete from pacientes where id = ?", [objeto.id], (err, rows) => {
            if (err) {
                console.log(err);
                throw ("Error en consulta de base de datos. delete");
            }
            if (rows.affectedRows != 0) {
                objetoRetorno.exito = true;
                objetoRetorno.mensaje = "Paciente Eliminado!";
                objetoRetorno.status = 200;
                response.status(objetoRetorno.status).json(objetoRetorno);
            }
            else {
                response.status(objetoRetorno.status).json(objetoRetorno);
            }
        });
    });
});
app.post('/paciente/modificar', (request, response) => {
    let objetoRetorno = {
        exito: false,
        mensaje: "No se encontraron pacientes",
        status: 418,
    };
    let paciente = JSON.parse(request.body.objetoJSON);
    let pacienteModificado = {};
    pacienteModificado.nombre = paciente.nombre;
    pacienteModificado.apellido = paciente.apellido;
    pacienteModificado.edad = paciente.edad;
    pacienteModificado.dni = paciente.dni;
    pacienteModificado.direccion = paciente.direccion;
    pacienteModificado.celular = paciente.celular;
    request.getConnection((err, conn) => {
        if (err)
            throw ("Error al conectarse a la base de datos.");
        conn.query("update pacientes set ? where id = ?", [pacienteModificado, paciente.id], (err, rows) => {
            if (err) {
                console.log(err);
                throw ("Error en consulta de base de datos.");
            }
            if (rows.affectedRows != 0) {
                objetoRetorno.exito = true;
                objetoRetorno.mensaje = "Paciente Modificado!";
                objetoRetorno.status = 200;
                response.status(objetoRetorno.status).json(objetoRetorno);
            }
            else {
                response.status(objetoRetorno.status).json(objetoRetorno);
            }
        });
    });
});
app.post('/paciente/buscar', (request, response) => {
    let objetoRetorno = {
        exito: false,
        mensaje: "No se encontraron pacientes",
        paciente: {},
        status: 418,
    };
    let id = request.body.id;
    let objeto = {};
    objeto.id = id;
    request.getConnection((err, conn) => {
        if (err)
            throw ("Error al conectarse a la base de datos. delete");
        conn.query("select from pacientes where id = ?", [objeto.id], (err, rows) => {
            if (err) {
                console.log(err);
                throw ("Error en consulta de base de datos.");
            }
            if (rows.affectedRows != 0) {
                objetoRetorno.exito = true;
                objetoRetorno.mensaje = "Paciente encontrado!";
                objetoRetorno.paciente = JSON.stringify(rows);
                objetoRetorno.status = 200;
                response.status(objetoRetorno.status).json(objetoRetorno);
            }
            else {
                response.status(objetoRetorno.status).json(objetoRetorno);
            }
        });
    });
});
//# sourceMappingURL=nodeServer.js.map