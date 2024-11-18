import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import { Modal, Paper, TextField, Button, Box, useTheme } from "@mui/material";
import { AddBox, DeleteOutline, Edit, Opacity, Password } from "@mui/icons-material";
import { styled } from "@mui/system";
import Swal from "sweetalert2";
import InputGeneral from "../../Components/Form/InputGeneral.jsx";
import {
  ColumnaCenter,
  Columna,
  Formulario1,
  MensajeExito,
  MensajeError,
} from "../../Components/Form/Formularios.jsx";
import "../../Styles/modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import '../Cliente/Cliente.css';
import "../../Styles/variables.css";
import * as plusicon from "react-icons/cg";

//////////////////////////INICIA SECCION COLUMNAS///////////////////////////
//////////////////////////INICIA GRID INICIAL//////////////////////////

const columnas = [
  { title: "ID Cliente", field: "idCliente", hidden:true },
  { title: "ID Entrenador", field: "idUsuario", hidden:true },
  { title: "Nombre Entrenador", field: "nombreUsuario" },
  { title: "Nombre Cliente", field: "nombreCliente" },
  { title: "Email", field: "email" },
  { title: "Telefono", field: "telefono" },
  { title: "Sexo", field: "sexo" },
  { title: "Altura", field: "altura" },
  { title: "Peso", field: "peso" },
  { title: "Antecedente", field: "antecedente" },
  { title: "Disciplina", field: "disciplina" },
  { title: "Descripcion", field: "descripcion" },
  { title: "Fecha de Nacimiento", field: "fechaNacimiento", hidden:true  },
  { title: "Creado", field: "creado", hidden:true  },
];

//////////////////////////TERMINA GRID INICIAL//////////////////////////
//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////

//////////////////////////INICIA URLs///////////////////////////

const baseUrl = "https://localhost:44366/Cliente/recCliente_PA";
const baseUrlPost = "https://localhost:44365/api/Usuario/insUsuario";
const baseUrlPut = "https://localhost:44365/api/Usuario/modUsuario";
const baseUrlDel = "https://localhost:44365/api/Usuario/delUsuario";
// const baseUrlPostKardex = "https://localhost:44365/api/Usuario/insUsuario";

//////////////////////////TERMINA URLs///////////////////////////

const Cliente = () => {
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////

  const [idCliente, cambiaridCliente] = useState({ campo: 0, valido: null });
  const [idUsuario, cambiaridUsuario] = useState({ campo: 0, valido: null });
  const [nombre, cambiarnombre] = useState({ campo: "", valido: null });
  const [email, cambiaremail] = useState({ campo: "", valido: null });
  const [telefono, cambiartelefono] = useState({ campo: "", valido: null });
  const [creado, cambiarcreado] = useState({ campo: "", valido: null });
  const [fechaNacimiento, cambiarfechaNacimiento] = useState({ campo: "", valido: null });
  const [sexo, cambiarsexo] = useState({ campo: "", valido: null });
  const [disciplina, cambiardisciplina] = useState({ campo: "", valido: null });
  const [antecedente, cambiarantecedente] = useState({ campo: "", valido: null });
  const [descripcion, cambiardescripcion] = useState({ campo: "", valido: null });
  const [altura, cambiaraltura] = useState({ campo: "", valido: null });
  const [peso, cambiarpeso] = useState({ campo: "", valido: null });
  
  const [formularioValido, cambiarFormularioValido] = useState(false);

  // const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({
  //   IdUsuario: "",
  //   Nombre: "",
  //   NombreUsuario: "",
  //   Rol: "",
  //   Correo: "",
  //   Clave: "",
  // });

  //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////

  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  const expresionesRegulares = {
  idCliente: /^\d{1,100}$/, //"El ID debe ser un número entre 1 y 100 dígitos" 
  idUsuario: /^\d{1,100}$/, //"El ID debe ser un número entre 1 y 100 dígitos" 
  nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/, // "El nombre debe tener entre 2 y 50 letras y solo puede incluir letras y espacios" 
  email: /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, // "Ingrese un email válido, como usuario@dominio.com" 
  telefono: /^\+?\d{1,3}?\s?\d{8,12}$/, // "Ingrese un número de teléfono válido de 8 a 12 dígitos (opcional: con prefijo internacional)" 
  creado: /^\d{2}-\d{2}-\d{4}$/, // "La fecha de creación debe estar en el formato DD-MM-AAAA" 
  fechaNacimiento: /^\d{2}-\d{2}-\d{4}$/, // "La fecha de nacimiento debe estar en el formato DD-MM-AAAA" 
  sexo: /^(M|F|Otro)$/, // "El sexo debe ser M, F o Otro" 
  disciplina: /^[A-Za-z\s]{3,30}$/, //"La disciplina debe contener entre 3 y 30 caracteres alfabéticos" 
  antecedente: /^[\w\s.,]{0,200}$/, // "El antecedente no debe exceder los 200 caracteres" 
  descripcion: /^[\w\s.,]{0,500}$/, //"La descripción no debe exceder los 500 caracteres" 
  altura: /^\d{2,3}(\.\d{1,2})?$/, //"La altura debe ser un número en cm, opcionalmente con hasta 2 decimales" 
  peso: /^\d{2,3}(\.\d{1,2})?$/, // "El peso debe ser un número en kg, opcionalmente con hasta 2 decimales"
};


  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  //MANEJO DEL A OPCION DE SUBMIT DEL FORMULARIO PARA AGREGAR UN NUEVO USUARIO
  const onsubmitpost = (e) => {
    e.preventDefault();
    if (
      idCliente.valido === "true" &&
      idUsuario.valido === "true" &&
      nombre.valido === "true" &&
      email.valido === "true" &&
      telefono.valido === "true" &&
      creado.valido === "true" &&
      fechaNacimiento.valido === "true" &&
      sexo.valido === "true" &&
      disciplina.valido === "true" &&
      antecedente.valido === "true" &&
      descripcion.valido === "true" &&
      altura.valido === "true" &&
      peso.valido === "true" 
    ) {
      cambiarFormularioValido(true);
      cambiaridCliente({ campo: "", valido: "" });
      cambiaridUsuario({ campo: "", valido: null });
      cambiarnombre({ campo: "", valido: null });
      cambiaremail({ campo: "", valido: null });
      cambiartelefono({ campo: "", valido: null });
      cambiarcreado({ campo: "", valido: null });
      cambiarfechaNacimiento({ campo: "", valido: null });
      cambiarsexo({ campo: "", valido: null });
      cambiardisciplina({ campo: "", valido: null });
      cambiarantecedente({ campo: "", valido: null });
      cambiardescripcion({ campo: "", valido: null });
      cambiaraltura({ campo: "", valido: null });
      cambiarpeso({ campo: "", valido: null });
      showQuestionPost();
    } else {
      
      cambiarFormularioValido(false);
    }
  };

  /*const onsubmitpost = (e) => {
    e.preventDefault();
    if (
      idCliente.valido === "true" &&
      idUsuario.valido === "true" &&
      nombre.valido === "true" &&
      email.valido === "true" &&
      telefono.valido === "true" &&
      creado.valido === "true" &&
      fechaNacimiento.valido === "true" &&
      sexo.valido === "true" &&
      disciplina.valido === "true" &&
      antecedente.valido === "true" &&
      descripcion.valido === "true" &&
      altura.valido === "true" &&
      peso.valido === "true" 
    ) {
      cambiarFormularioValido(true);
      cambiaridCliente({ campo: "", valido: "" });
      cambiaridUsuario({ campo: "", valido: null });
      cambiarnombre({ campo: "", valido: null });
      cambiaremail({ campo: "", valido: null });
      cambiartelefono({ campo: "", valido: null });
      cambiarcreado({ campo: "", valido: null });
      cambiarfechaNacimiento({ campo: "", valido: null });
      cambiarsexo({ campo: "", valido: null });
      cambiardisciplina({ campo: "", valido: null });
      cambiarantecedente({ campo: "", valido: null });
      cambiardescripcion({ campo: "", valido: null });
      cambiaraltura({ campo: "", valido: null });
      cambiarpeso({ campo: "", valido: null });
      showQuestionPost();
    } else {
      
      cambiarFormularioValido(false);
    }
  };*/

  ///////////////////////////////////AXIOS FUNCIONES//////////////////////////////

  const endPointClienteXId =
    "https://localhost:44366/Cliente/recClienteXId_PA/" + idCliente.campo;

  ///////////////////////////////////FINALIZA AXIOS FUNCIONES//////////////////////////////

  ////////////////////////////////VALIDACIONES ID/////////////////////////////////

  function ValidarExistenciaClienteId() {
    function showError() {
      Swal.fire({
        icon: "error",
        //iconHtml: "<FontAwesomeIcon icon={faExclamationTriangle} />",
        title: "Error",
        text: "Codigo de cliente ya existe",
        // customClass: {
        //   icon: 'no-icon',
        // },
      });
    }

    const MetodoValidar = async () => {
      await axios.get(endPointClienteXId).then((response) => {
        const data = response.data;
        if (data === null) {
          cambiaridCliente({ campo: idCliente.campo, valido: "true" });
        } else {
          cambiaridCliente({ campo: "", valido: "false" });
          showError();
        }
      });
    };
    MetodoValidar();
  }

  ////////////////////////////////FINALIZA VALIDACIONES ID/////////////////////////////////

  //////////////////////////INICIA STYLE///////////////////////////

  const StyledModal = styled(Box)(({ theme }) => ({
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  }));

  const StyledInput = styled(TextField)({
    width: "100%",
  });

  //////////////////////////TERMINA STYLE///////////////////////////

  ////////////////////////////////CONSTANTES MODAL/////////////////////////////////

  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  //////////////////////////////// FINALIZA CONSTANTES MODAL/////////////////////////////////

  ////////////////////////////PETICION POST//////////////////////////////////////////////////

  function showQuestionPost() {
    Swal.fire({
      title: "¿Desea agregar a este cliente?",
      showDenyButton: true,
      confirmButtonText: "Si, agregar",
      denyButtonText: "No, cancelar",
      customClass: {
        confirmButton: 'btn-agregar', // Clase personalizada para el botón
        denyButton: 'btn-cancelar'    // Clase personalizada para el botón cancelar
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Cliente agregado correctamente!", "", "success");
        peticionPost();
        //peticionPostKardex();
      } else if (result.isDenied) {
        Swal.fire("No se agregó el cliente", "", "info");
      }
    });
  }

  //REVISAR LOS PARENTESIS

  const peticionPost = async () => {
    const options = {
      idCliente: idCliente.campo,
      idUsuario: idUsuario.campo,
      nombre: nombre.campo,
      email: email.campo,
      telefono: telefono.campo,
      creado: creado.campo,
      fechaNacimiento: fechaNacimiento.campo,
      sexo: sexo.campo,
      disciplina: disciplina.campo,
      antecedente: antecedente.campo,
      descripcion: descripcion.campo,
      altura: altura.campo,
      peso: peso.campo,
    };

    await axios
      .post(baseUrlPost, options)
      .then((response) => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
        peticionGet(); //REFRESCA EL GRID
      })
      .catch((error) => {
        console.error("Error en la petición POST:", error); // Log para ver detalles del error
      });
  };

  ////////////////////////////FINALIZA PETICION POST/////////////////////////////////////////

  ////////////////////////////PETICION PUT///////////////////////////////////////////////////

  //REVISAR LAS COMILLAS
  function showQuestionPut() {
    Swal.fire({
      title: "¿Desea editar el cliente?",
      showDenyButton: true,
      confirmButtonText: "Si, editar",
      denyButtonText: "No, cancelar",
      customClass: {
        confirmButton: 'btn-agregar', // Clase personalizada para el botón
        denyButton: 'btn-cancelar'    // Clase personalizada para el botón cancelar
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Guardado Correctamente!", "", "success");
        peticionPut();
        //peticionPutKardex();
      } else if (result.isDenied) {
        Swal.fire("No se editaron los campos", "", "info");
      }
    });
  }

  const peticionPut = async () => {
    const options = {
      idCliente: idCliente.campo,
      idUsuario: idUsuario.campo,
      nombre: nombre.campo,
      email: email.campo,
      telefono: telefono.campo,
      creado: creado.campo,
      fechaNacimiento: fechaNacimiento.campo,
      sexo: sexo.campo,
      disciplina: disciplina.campo,
      antecedente: antecedente.campo,
      descripcion: descripcion.campo,
      altura: altura.campo,
      peso: peso.campo,
    };

    await axios

      .put(baseUrlPut, options)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((Cliente) => {
          if (Cliente.idCliente === options.idCliente) {
            Cliente.idUsuario = options.idUsuario;
            Cliente.nombre = options.nombre;
            Cliente.email = options.email;
            Cliente.telefono = options.telefono;
            Cliente.creado = options.creado;
            Cliente.fechaNacimiento = options.fechaNacimiento;
            Cliente.sexo = options.sexo;
            Cliente.disciplina = options.disciplina;
            Cliente.antecedente = options.antecedente;
            Cliente.descripcion = options.descripcion;
            Cliente.altura = options.altura;
            Cliente.peso = options.peso;
          }
          return dataNueva;
        });
        setData(dataNueva);
        abrirCerrarModalEditar();
        peticionGet(); //REFRESCA EL GRID
      })
      .catch((error) => {
        console.log(error);
      });
  };

  ////////////////////////////FINALIZA PETICION PUT//////////////////////////

  ////////////////////////PETICION DELETE////////////////////////

  const peticionDelete = async () => {
    const options = {
      idCliente: idCliente.campo,
      idUsuario: idUsuario.campo,
      nombre: nombre.campo,
      email: email.campo,
      telefono: telefono.campo,
      creado: creado.campo,
      fechaNacimiento: fechaNacimiento.campo,
      sexo: sexo.campo,
      disciplina: disciplina.campo,
      antecedente: antecedente.campo,
      descripcion: descripcion.campo,
      altura: altura.campo,
      peso: peso.campo,
    };

    const payload = {
      headers: { Authorization: "" },
      data: options,
    };

    await axios
      .delete(baseUrlDel, payload)
      .then((response) => {
        setData(
          data.filter((Cliente) => Cliente.idCliente !== options.idCliente)
        );
        abrirCerrarModalEliminar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  ////////////////////////////FINALIZA PETICION DELETE////////////////////////

  //////////////////////////PETICION SELECT////////////////////////

  const seleccionarCliente = async (cliente, caso) => {
    if (cliente && typeof cliente === "object") {
      console.log({ cliente });
    }
    const XCliente = Object.values(...cliente);
    cambiaridCliente({ campo: XCliente[0], valido: "true" });
    cambiaridUsuario({ campo: XCliente[1], valido: "true" });
    cambiarnombre({ campo: XCliente[2], valido: "true" });
    cambiaremail({ campo: XCliente[3], valido: "true" });
    cambiartelefono({ campo: XCliente[4], valido: "true" });
    cambiarcreado({ campo: XCliente[5], valido: "true" });
    cambiarfechaNacimiento({ campo: XCliente[6], valido: "true" });
    cambiarsexo({ campo: XCliente[7], valido: "true" });
    cambiardisciplina({ campo: XCliente[8], valido: "true" });
    cambiarantecedente({ campo: XCliente[9], valido: "true" });
    cambiardescripcion({ campo: XCliente[10], valido: "true" });
    cambiaraltura({ campo: XCliente[11], valido: "true" });
    cambiarpeso({ campo: XCliente[12], valido: "true" });
    console.log({ XCliente });
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  const peticionGet = async () => {
    await axios.get(baseUrl).then((response) => {
      setData(response.data);
    });
  };

  useEffect(() => {
    peticionGet();
  }, [data]);

  //////////////////////////FINALIZA PETICION SELECT////////////////////////

  //////////////////////////MODALES////////////////////////

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };


  //////////////////////////MODALES////////////////////////

  ////////////////////////////CSS SCROLL, MODAL////////////////////////////

  const scrollVertical = {
    width: "70%",
    height: "100%",
    overflowX: "hidden",
    overflowY: "scroll",
    position: "relative",
    inset: "0",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  };

  const modalStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    transform: "translate(-50%, -50%)",
    zIndex: 1040,
    padding: "0 0 0 25%",
  };

  const modalStylesDelete = {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    transform: "translate(-50%, -50%)",
    zIndex: 1040,
    padding: "0 0 0 25%",
  };

  ////////////////////////////CSS SCROLL, MODAL////////////////////////////

  /////////////////////////INCLUIR CLIENTE////////////////////////////

  const bodyInsertar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Agregar Cliente</h3>
      <div className="relleno-general">
        {" "}
        202 - General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
              <InputGeneral
                estado={nombre}
                cambiarEstado={cambiarnombre}
                tipo="text"
                label="	Nombre completo"
                placeholder="Ejemplo: Juan Pérez"
                name="nombre"
                leyendaError="El nombre debe tener entre 2 y 50 letras y solo puede incluir letras y espacios"
                expresionRegular={expresionesRegulares.nombre}
                onChange={ValidarExistenciaClienteId}
                onBlur={ValidarExistenciaClienteId}
                autofocus
              />
              <InputGeneral
                estado={email}
                cambiarEstado={cambiaremail}
                tipo="text"
                label="Correo electrónico"
                placeholder="nombre@dominio.com"
                name="email"
                leyendaError="Ingrese un correo válido, como usuario@dominio.com"
                expresionRegular={expresionesRegulares.email}
              />

              <InputGeneral
                estado={telefono}
                cambiarEstado={cambiartelefono}
                tipo="text"
                label="Número de teléfono"
                placeholder="1456-7890"
                name="telefono"
                leyendaError="Ingrese un número de teléfono válido de 8 a 12 dígitos"
                expresionRegular={expresionesRegulares.telefono}
              />

              <InputGeneral
                estado={fechaNacimiento}
                cambiarEstado={cambiarfechaNacimiento}
                tipo="date"
                label="Fecha de nacimiento"
                placeholder="DD/MM/AAAA"
                name="fechaNacimiento"
                leyendaError="La fecha de nacimiento debe estar en el formato DD-MM-AAAA"
                expresionRegular={expresionesRegulares.fechaNacimiento}
              />

              <InputGeneral
                estado={sexo}
                cambiarEstado={cambiarsexo}
                tipo="text"
                label="Sexo"
                placeholder="Ejemplo: M o F"
                name="sexo"
                leyendaError="El sexo debe ser M o F"
                expresionRegular={expresionesRegulares.sexo}
              />

              <InputGeneral
                estado={altura}
                cambiarEstado={cambiaraltura}
                tipo="text"
                label="Altura (cm)"
                placeholder="Ejemplo: 175"
                name="altura"
                leyendaError="La altura debe ser un número en cm, opcionalmente con hasta 2 decimales"
                expresionRegular={expresionesRegulares.altura}
              />

              <InputGeneral
                estado={peso}
                cambiarEstado={cambiarpeso}
                tipo="text"
                label="Peso (kg)"
                placeholder="Ejemplo: 70"
                name="peso"
                leyendaError="El peso debe ser un número en kg, opcionalmente con hasta 2 decimales"
                expresionRegular={expresionesRegulares.peso}
              />

              <InputGeneral
                estado={disciplina}
                cambiarEstado={cambiardisciplina}
                tipo="text"
                label="Disciplina"
                placeholder="Ejemplo: Yoga, Boxeo, Pilates"
                name="disciplina"
                leyendaError="La disciplina debe contener entre 3 y 30 caracteres alfabéticos"
                expresionRegular={expresionesRegulares.disciplina}
              />

              <InputGeneral
                estado={antecedente}
                cambiarEstado={cambiarantecedente}
                tipo="text"
                label="Antecedentes médicos"
                placeholder="Ejemplo: Asma, Hipertensión"
                name="antecedente"
                leyendaError="El antecedente no debe exceder los 200 caracteres"
                expresionRegular={expresionesRegulares.antecedente}
              />

              <InputGeneral
                estado={descripcion}
                cambiarEstado={cambiardescripcion}
                tipo="text"
                label="Descripción personal"
                placeholder="Describe a tu cliente"
                name="descripcion"
                leyendaError="La descripción no debe exceder los 500 caracteres"
                expresionRegular={expresionesRegulares.descripcion}
              />
            </Columna>
          </Formulario1>
        </div>
      </div>

      {formularioValido === false && (
        <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b>Error:</b> Por favor rellena los datos del cliente correctamente.
          </p>
        </MensajeError>
      )}

      <div className="container-footer">
          <div>
        <button className="btn-cancelar" onClick={() => abrirCerrarModalInsertar()} >
        Cancelar
        </button>
          </div>
          <div>
        <button class="btn-agregar" onClick={""} type="submit">
          Agregar
          <div class="icon">
            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor" ></path>
            </svg>
          </div>
        </button>
          </div>
          {formularioValido === true && (
            <MensajeExito>Cliente agregado exitosamente!</MensajeExito>
          )}
        </div>
    </div>
  );

  const bodyEditar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Modificar Cliente</h3>
      <div className="relleno-general">
        {" "}
        202 - General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
              <InputGeneral
                estado={nombre}
                cambiarEstado={cambiarnombre}
                tipo="text"
                label="	Nombre completo"
                placeholder="Ejemplo: Juan Pérez"
                name="nombre"
                leyendaError="El nombre debe tener entre 2 y 50 letras y solo puede incluir letras y espacios"
                expresionRegular={expresionesRegulares.nombre}
                onChange={ValidarExistenciaClienteId}
                onBlur={ValidarExistenciaClienteId}
                autofocus
              />
              <InputGeneral
                estado={email}
                cambiarEstado={cambiaremail}
                tipo="text"
                label="Correo electrónico"
                placeholder="nombre@dominio.com"
                name="email"
                leyendaError="Ingrese un correo válido, como usuario@dominio.com"
                expresionRegular={expresionesRegulares.email}
              />

              <InputGeneral
                estado={telefono}
                cambiarEstado={cambiartelefono}
                tipo="text"
                label="Número de teléfono"
                placeholder="1456-7890"
                name="telefono"
                leyendaError="Ingrese un número de teléfono válido de 8 a 12 dígitos"
                expresionRegular={expresionesRegulares.telefono}
              />

              <InputGeneral
                estado={fechaNacimiento}
                cambiarEstado={cambiarfechaNacimiento}
                tipo="date"
                label="Fecha de nacimiento"
                placeholder="DD/MM/AAAA"
                name="fechaNacimiento"
                leyendaError="La fecha de nacimiento debe estar en el formato DD-MM-AAAA"
                expresionRegular={expresionesRegulares.fechaNacimiento}
              />

              <InputGeneral
                estado={sexo}
                cambiarEstado={cambiarsexo}
                tipo="text"
                label="Sexo"
                placeholder="Ejemplo: M o F"
                name="sexo"
                leyendaError="El sexo debe ser M o F"
                expresionRegular={expresionesRegulares.sexo}
              />

              <InputGeneral
                estado={altura}
                cambiarEstado={cambiaraltura}
                tipo="text"
                label="Altura (cm)"
                placeholder="Ejemplo: 175"
                name="altura"
                leyendaError="La altura debe ser un número en cm, opcionalmente con hasta 2 decimales"
                expresionRegular={expresionesRegulares.altura}
              />

              <InputGeneral
                estado={peso}
                cambiarEstado={cambiarpeso}
                tipo="text"
                label="Peso (kg)"
                placeholder="Ejemplo: 70"
                name="peso"
                leyendaError="El peso debe ser un número en kg, opcionalmente con hasta 2 decimales"
                expresionRegular={expresionesRegulares.peso}
              />

              <InputGeneral
                estado={disciplina}
                cambiarEstado={cambiardisciplina}
                tipo="text"
                label="Disciplina"
                placeholder="Ejemplo: Yoga, Boxeo, Pilates"
                name="disciplina"
                leyendaError="La disciplina debe contener entre 3 y 30 caracteres alfabéticos"
                expresionRegular={expresionesRegulares.disciplina}
              />

              <InputGeneral
                estado={antecedente}
                cambiarEstado={cambiarantecedente}
                tipo="text"
                label="Antecedentes médicos"
                placeholder="Ejemplo: Asma, Hipertensión"
                name="antecedente"
                leyendaError="El antecedente no debe exceder los 200 caracteres"
                expresionRegular={expresionesRegulares.antecedente}
              />

              <InputGeneral
                estado={descripcion}
                cambiarEstado={cambiardescripcion}
                tipo="text"
                label="Descripción personal"
                placeholder="Describe a tu cliente"
                name="descripcion"
                leyendaError="La descripción no debe exceder los 500 caracteres"
                expresionRegular={expresionesRegulares.descripcion}
              />
            </Columna>
          </Formulario1>
        </div>
      </div>
      {formularioValido === false && (
        <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b>Error:</b> Por favor rellena los datos del cliente correctamente.
          </p>
        </MensajeError>
      )}
        <div className="container-footer">
        <div>
        <button className="btn-cancelar" onClick={() => abrirCerrarModalEditar()} >
        Cancelar
        </button>
          </div>
          <div>
        <button class="btn-agregar" onClick={""} type="submit">
          Agregar
          <div class="icon">
            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor" ></path>
            </svg>
          </div>
        </button>
          </div>
          {formularioValido === true && (
            <MensajeExito>Cliente actualizado exitosamente!</MensajeExito>
          )}
        </div>
      </div>
  );

  function showQuestionDel() {
    Swal.fire({
      title: "¿Deseas eliminar este cliente?",
      showDenyButton: true,
      denyButtonText: `No, cancelar`,
      confirmButtonText: "Si, eliminar",
      width: 'fixed',
      height: '50%',
      customClass: {
        confirmButton: 'btn-eliminar', // Clase personalizada para el botón
        denyButton: 'btn-cancelar'    // Clase personalizada para el botón cancelar
      },
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Cliente eliminado correctamente!", "", "success");
        peticionDelete();
        //peticionDeleteKardex();
      } else if (result.isDenied) {
        Swal.fire("Cliente no ha sido eliminado", "", "info");
      }
    });
  }

  const bodyEliminar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Eliminar Cliente</h3>
      <div className="relleno-eliminar">
        {" "}
        202 - General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={idCliente}
                cambiarEstado={cambiaridCliente}
                tipo="number"
                label="Código de cliente"
                placeholder="Ejemplo: 1"
                name="idCliente"
                leyendaError="El código debe ser un número entre 1 y 100 dígitos"
                expresionRegular={expresionesRegulares.idCliente}
              />
            </Columna>
          </Formulario1>
        </div>
      </div>
        <div className="container-footer">
        <div>
        <button className="btn-cancelar" onClick={() => abrirCerrarModalEliminar()} >
        Cancelar
        </button>
          </div>
          <div>
        <button className="btn-eliminar" onClick={() => showQuestionDel()}>
          Eliminar
        </button>
          </div>
          {formularioValido === true && (
            <MensajeExito>Cliente eliminado exitosamente!</MensajeExito>
          )}
        </div>
    </div>
  );

  return (
    <div className="Cliente">
      <div className="banner">
        <h3>
          200-Mantenimiento Clientes
        </h3>
      </div>
      <div> 
      <button className="btn-añadir" onClick={() => abrirCerrarModalInsertar()}>
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56"><path fill="currentColor" d="M46.867 9.262c-2.39-2.39-5.765-2.766-9.75-2.766H18.836c-3.937 0-7.312.375-9.703 2.766S6.39 15.004 6.39 18.918v18.094c0 4.008.351 7.336 2.742 9.726s5.766 2.766 9.773 2.766h18.211c3.985 0 7.36-.375 9.75-2.766c2.391-2.39 2.742-5.718 2.742-9.726V18.988c0-4.008-.351-7.36-2.742-9.726m-1.031 9.07v19.313c0 2.437-.305 4.921-1.71 6.351c-1.43 1.406-3.962 1.734-6.376 1.734h-19.5c-2.414 0-4.945-.328-6.351-1.734c-1.43-1.43-1.735-3.914-1.735-6.352V18.403c0-2.46.305-4.992 1.711-6.398c1.43-1.43 3.984-1.734 6.445-1.734h19.43c2.414 0 4.945.328 6.375 1.734c1.406 1.43 1.711 3.914 1.711 6.328M28 40.504c.938 0 1.688-.727 1.688-1.664v-9.164h9.164c.937 0 1.687-.797 1.687-1.664c0-.914-.75-1.688-1.687-1.688h-9.164v-9.187c0-.938-.75-1.664-1.688-1.664a1.64 1.64 0 0 0-1.664 1.664v9.187h-9.164c-.938 0-1.688.774-1.688 1.688c0 .867.75 1.664 1.688 1.664h9.164v9.164c0 .937.727 1.664 1.664 1.664"></path></svg>
       Añadir 
        </button>
      </div>
      <br />
      <br />
      <MaterialTable
        columns={columnas}
        data={data}
        title="Clientes"
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar",
            onClick: (event, rowData) => seleccionarCliente(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar",
            onClick: (event, rowData) =>
              seleccionarCliente(rowData, "Eliminar"),
          },
        ]}
        options={{
          actionsColumnIndex: -1,
          exportButton: true,
          columnsButton: true,
          headerStyle: { backgroundColor: "lightgrey" },
          selection: true,
          showTextRowSelected: false,
          showSelectedAllheckbox: false,
          searchFieldAligment: "left",
          showtitle: false,
        }}
        localization={{
          header: { actions: "Acciones" },
          toolbar: { searchPlaceholder: "Busqueda", columnsButton: "Mostrar columnas", },
          selectedRows: {
            text: "{0} fila seleccionada",  // Cambia aquí para español
            textMultiple: "{0} filas seleccionadas", // Para múltiples filas seleccionadas
          },
      pagination: {
        labelDisplayedRows: '{from}-{to} de {count}',
        labelRowsSelect: 'filas',
        labelRowsPerPage: 'Filas por página',
      },
  
        }}
      />
      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar} style={modalStyles}>
        {bodyInsertar}
      </Modal>
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar} style={modalStyles}>
        {bodyEditar}
      </Modal>
      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar} style={modalStylesDelete}>
        {bodyEliminar}
      </Modal>
    </div>
  );
};

export default Cliente;
