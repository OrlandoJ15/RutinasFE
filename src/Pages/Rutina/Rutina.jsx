import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import { Modal, Paper, TextField, Button, Box, useTheme } from "@mui/material";
import { AddBox, DeleteOutline, Edit, Password } from "@mui/icons-material";
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

//////////////////////////INICIA SECCION COLUMNAS///////////////////////////
//////////////////////////INICIA GRID INICIAL//////////////////////////

const columnas = [
  { title: "ID Rutina", field: "idRutina", hidden: true},
  { title: "ID Cliente", field: "idCliente", hidden: true },
  { title: "Nombre Cliente", field: "nombreCliente" },
  { title: "Nombre Rutina", field: "nombreRutina" },
  { title: "Inicia", field: "fechaInicio" },
  { title: "Finaliza", field: "fechaFin" },
  { title: "Creado", field: "creado" },
];

//////////////////////////TERMINA GRID INICIAL//////////////////////////
//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////

//////////////////////////INICIA URLs///////////////////////////

const baseUrl = "https://localhost:44366/Rutina/recRutina_PA";
const baseUrlPost = "https://localhost:44365/api/Usuario/insUsuario";
const baseUrlPut = "https://localhost:44365/api/Usuario/modUsuario";
const baseUrlDel = "https://localhost:44365/api/Usuario/delUsuario";
// const baseUrlPostKardex = "https://localhost:44365/api/Usuario/insUsuario";

//////////////////////////TERMINA URLs///////////////////////////

const Rutina = () => {
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////

  const [idRutina, cambiaridRutina] = useState({ campo: 0, valido: null });
  const [idCliente, cambiaridCliente] = useState({ campo: 0, valido: null });
  const [nombreCliente, cambiarnombreCliente] = useState({ campo: "", valido: null });
  const [nombreRutina, cambiarnombreRutina] = useState({ campo: "", valido: null });
  const [fechaInicio, cambiarfechaInicio] = useState({ campo: "", valido: null });
  const [fechaFin, cambiarfechaFin] = useState({ campo: "", valido: null });
  const [creado, cambiarcreado] = useState({ campo: "", valido: null });
  const [formularioValido, cambiarFormularioValido] = useState(false);

  //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////

  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  const expresionesRegulares = {
    idRutina: /^[0-9]*$/,
    idCliente: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    nombreCliente: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    nombreRutina: /^[1-9]$/, // solo numero del 1-9
    fechaFin: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, //formato de correo electronico
    creado: /^(?=(?:.*[A-Za-z]){4,})(?=.*[A-Z])(?=(?:.*\d){4,})[A-Za-z\d]{8,}$/, //contrasena con almenos 4 letras y minimo 1 mayuscukla, 4 numeros y minimo 8 carcteres
    fechaInicio: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  };

  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  //MANEJO DEL A OPCION DE SUBMIT DEL FORMULARIO PARA AGREGAR UN NUEVO USUARIO
  const onsubmitpost = (e) => {
    e.preventDefault();
    if (
      idRutina.valido === "true" &&
      idCliente.valido === "true" &&
      nombreCliente.valido === "true" &&
      nombreRutina.valido === "true" &&
      fechaInicio.valido === "true" &&
      fechaFin.valido === "true" &&
      creado.valido === "true"
    ) {
      cambiaridRutina(true);
      cambiaridCliente({ campo: "", valido: "" });
      cambiarnombreCliente({ campo: "", valido: null });
      cambiarnombreRutina({ campo: "", valido: null });
      cambiarfechaInicio({ campo: "", valido: null });
      cambiarfechaFin({ campo: "", valido: null });
      cambiarcreado({ campo: "", valido: null });
      showQuestionPost();
    } else {
      
      cambiarFormularioValido(false);
    }
  };

  /*const onsubmitpost = (e) => {
    e.preventDefault();
    if (
      idRutina.valido === "true" &&
      idCliente.valido === "true" &&
      nombreCliente.valido === "true" &&
      nombreRutina.valido === "true" &&
      fechaInicio.valido === "true" &&
      fechaFin.valido === "true" &&
      creado.valido === "true"
    ) {
      cambiaridRutina(true);
      cambiaridCliente({ campo: "", valido: "" });
      cambiarnombreCliente({ campo: "", valido: null });
      cambiarnombreRutina({ campo: "", valido: null });
      cambiarfechaInicio({ campo: "", valido: null });
      cambiarfechaFin({ campo: "", valido: null });
      cambiarcreado({ campo: "", valido: null });
      showQuestionPost();
    } else {
      
      cambiarFormularioValido(false);
    }
  };*/

  ///////////////////////////////////AXIOS FUNCIONES//////////////////////////////

  const endPointRutinaXId =
    "https://localhost:44365/api/Usuario/recUsuarioXId?pId=" + idRutina.campo;

  ///////////////////////////////////FINALIZA AXIOS FUNCIONES//////////////////////////////

  ////////////////////////////////VALIDACIONES ID/////////////////////////////////

  function ValidarExistenciaRutinaId() {
    function showError() {
      Swal.fire({
        icon: "error",
        //iconHtml: "<FontAwesomeIcon icon={faExclamationTriangle} />",
        title: "Error",
        text: "La rutina ya existe.",
        // customClass: {
        //   icon: 'no-icon',
        // },
      });
    }

    const MetodoValidar = async () => {
      await axios.get(endPointRutinaXId).then((response) => {
        const data = response.data;
        if (data === null) {
          cambiaridRutina({ campo: IdRutina.campo, valido: "true" });
        } else {
          cambiaridRutina({ campo: "", valido: "false" });
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
      title: "¿Desea agregar esta rutina?",
      showDenyButton: true,
      confirmButtonText: "Si, agregar",
      denyButtonText: "No, cancelar",
      customClass: {
        confirmButton: 'btn-agregar', // Clase personalizada para el botón
        denyButton: 'btn-cancelar'    // Clase personalizada para el botón cancelar
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Rutina agregada correctamente!", "", "success");
        peticionPost();
        //peticionPostKardex();
      } else if (result.isDenied) {
        Swal.fire("No se agregó la rutina", "", "info");
      }
    });
  }

  //REVISAR LOS PARENTESIS

  const peticionPost = async () => {
    const options = {
      idRutina: idRutina.campo,
      idCliente: idCliente.campo,
      nombreCliente: nombreCliente.campo,
      nombreRutina: nombreRutina.campo,
      fechaInicio: fechaInicio.campo,
      fechaFin: fechaFin.campo,
      creado: creado.campo,
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
      title: "¿Desea editar la rutina?",
      showDenyButton: true,
      confirmButtonText: "Si, editar",
      denyButtonText: "No, cancelar",
      customClass: {
        confirmButton: 'btn-agregar', // Clase personalizada para el botón
        denyButton: 'btn-cancelar'    // Clase personalizada para el botón cancelar
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Guardada Correctamente!", "", "success");
        peticionPut();
        //peticionPutKardex();
      } else if (result.isDenied) {
        Swal.fire("No se editaron los campos", "", "info");
      }
    });
  }

  const peticionPut = async () => {
    const options = {
      idRutina: idRutina.campo,
      idCliente: idCliente.campo,
      nombreCliente: nombreCliente.campo,
      nombreRutina: nombreRutina.campo,
      fechaInicio: fechaInicio.campo,
      fechaFin: fechaFin.campo,
      creado: creado.campo,
    };

    await axios

      .put(baseUrlPut, options)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((Rutina) => {
          if (Rutina.idRutina === options.idRutina) {
            Rutina.idCliente = options.idCliente;
            Rutina.nombreCliente = options.nombreCliente;
            Rutina.nombreRutina = options.nombreRutina;
            Rutina.fechaInicio = options.fechaInicio;
            Rutina.fechaFin = options.fechaFin;
            Rutina.creado = options.creado;
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
      idRutina: idRutina.campo,
      idCliente: idCliente.campo,
      nombreCliente: nombreCliente.campo,
      nombreRutina: nombreRutina.campo,
      fechaInicio: fechaInicio.campo,
      fechaFin: fechaFin.campo,
      creado: creado.campo,
    };

    const payload = {
      headers: { Authorization: "" },
      data: options,
    };

    await axios
      .delete(baseUrlDel, payload)
      .then((response) => {
        setData(
          data.filter((Rutina) => Rutina.idRutina !== options.idRutina)
        );
        abrirCerrarModalEliminar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  ////////////////////////////FINALIZA PETICION DELETE////////////////////////

  //////////////////////////PETICION SELECT////////////////////////

  const seleccionarRutina = async (Rutina, caso) => {
    if (Rutina && typeof Rutina === "object") {
      console.log({ Rutina });
    }
    const XRutina = Object.values(...Rutina);
    cambiaridRutina({ campo: XRutina[0], valido: "true" });
    cambiaridCliente({ campo: XRutina[1], valido: "true" });
    cambiarnombreCliente({ campo: XRutina[2], valido: "true" });
    cambiarnombreRutina({ campo: XRutina[3], valido: "true" });
    cambiarfechaInicio({ campo: XRutina[4], valido: "true" });
    cambiarfechaFin({ campo: XRutina[5], valido: "true" });
    cambiarcreado({ campo: XRutina[6], valido: "true" });
    console.log({ XRutina });
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

  ////////////////////////// PETICION CAMBIO CLAVE////////////////////////

  //////////////////////////FINALIZA PETICION CAMBIO CLAVE////////////////////////

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

  /////////////////////////INCLUIR ARTICULOS////////////////////////////

  const bodyInsertar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Agregar Rutina</h3>
      <div className="relleno-general">
        {" "}
        202 - General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={nombreCliente}
                cambiarEstado={nombreCliente}
                tipo="text"
                label="Nombre del cliente"
                placeholder="Ejemplo: Juan Pérez"
                name="nombreCliente"
                leyendaError="El nombre debe tener entre 2 y 50 letras y solo puede incluir letras y espacios"
                expresionRegular={expresionesRegulares.nombreCliente}
                onChange={''}
                onBlur={''}
                autofocus
              />

              <InputGeneral
                estado={nombreRutina}
                cambiarEstado={cambiarnombreRutina}
                tipo="text"
                label="Nombre de la rutina"
                placeholder="Ejemplo: Rutina de fuerza avanzada"
                name="nombreRutina"
                leyendaError="El nombre de la rutina debe tener entre 3 y 50 caracteres alfanuméricos."
                expresionRegular={expresionesRegulares.nombreRutina}
                onChange={''}
                onBlur={''}
                autofocus
              />
              <InputGeneral
                estado={fechaInicio}
                cambiarEstado={cambiarfechaInicio}
                tipo="date"
                label="Fecha de inicio"
                placeholder="DD/MM/AAAA"
                name="fechaInicio"
                leyendaError="La fecha de inicio debe estar en formato DD/MM/AAAA."
                expresionRegular={expresionesRegulares.fechaInicio}
              />

              <InputGeneral
                estado={fechaFin}
                cambiarEstado={cambiarfechaFin}
                tipo="date"
                label="Fecha de finalización"
                placeholder="DD/MM/AAAA"
                name="fechaFin"
                leyendaError="La fecha de inicio debe estar en formato DD/MM/AAAA."
                expresionRegular={expresionesRegulares.fechaFin}
              />
            </Columna>
          </Formulario1>
          </div>
      </div>

      {formularioValido === false && (
        <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b>Error:</b> Por favor rellena los datos de la rutina correctamente.
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
            <MensajeExito>Rutina agregada exitosamente!</MensajeExito>
          )}
        </div>
    </div>
  );

  const bodyEditar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Modificar Rutina</h3>
      <div className="relleno-general">
        {" "}
        202 - General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={nombreCliente}
                cambiarEstado={nombreCliente}
                tipo="text"
                label="Nombre del cliente"
                placeholder="Ejemplo: Juan Pérez"
                name="nombreCliente"
                leyendaError="El nombre debe tener entre 2 y 50 letras y solo puede incluir letras y espacios"
                expresionRegular={expresionesRegulares.nombreCliente}
                onChange={''}
                onBlur={''}
                autofocus
              />

              <InputGeneral
                estado={nombreRutina}
                cambiarEstado={cambiarnombreRutina}
                tipo="text"
                label="Nombre de la rutina"
                placeholder="Ejemplo: Rutina de fuerza avanzada"
                name="nombreRutina"
                leyendaError="El nombre de la rutina debe tener entre 3 y 50 caracteres alfanuméricos."
                expresionRegular={expresionesRegulares.nombreRutina}
                onChange={''}
                onBlur={''}
                autofocus
              />
              <InputGeneral
                estado={fechaInicio}
                cambiarEstado={cambiarfechaInicio}
                tipo="date"
                label="Fecha de inicio"
                placeholder="DD/MM/AAAA"
                name="fechaInicio"
                leyendaError="La fecha de inicio debe estar en formato DD/MM/AAAA."
                expresionRegular={expresionesRegulares.fechaInicio}
              />

              <InputGeneral
                estado={fechaFin}
                cambiarEstado={cambiarfechaFin}
                tipo="date"
                label="Fecha de finalización"
                placeholder="DD/MM/AAAA"
                name="fechaFin"
                leyendaError="La fecha de inicio debe estar en formato DD/MM/AAAA."
                expresionRegular={expresionesRegulares.fechaFin}
              />
            </Columna>
          </Formulario1>
          </div>
      </div>
      {formularioValido === false && (
        <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b>Error:</b> Por favor rellena los datos de la rutina correctamente.
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
            <MensajeExito>Rutina actualizada exitosamente!</MensajeExito>
          )}
        </div>
      </div>
  );

  function showQuestionDel() {
    Swal.fire({
      title: "¿Deseas eliminar esta rutina?",
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
        Swal.fire("Rutina eliminada correctamente!", "", "success");
        peticionDelete();
        //peticionDeleteKardex();
      } else if (result.isDenied) {
        Swal.fire("Rutina no ha sido eliminada", "", "info");
      }
    });
  }

  const bodyEliminar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Eliminar Rutina</h3>
      <div className="relleno-eliminar">
        {" "}
        202 - General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={idRutina}
                cambiarEstado={cambiaridRutina}
                tipo="number"
                label="Código de la rutina"
                placeholder="Ejemplo: 1"
                name="idRutina"
                leyendaError="El código debe ser un número entre 1 y 100 dígitos"
                expresionRegular={expresionesRegulares.idRutina}
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
            <MensajeExito>Rutina eliminada exitosamente!</MensajeExito>
          )}
        </div>
    </div>
  );


  return (
    <div className="Cliente">
      <div className="banner">
        <h3>
          200-Mantenimiento Rutinas
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
        title="Rutinas"
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar",
            onClick: (event, rowData) => seleccionarRutina(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar",
            onClick: (event, rowData) =>
              seleccionarRutina(rowData, "Eliminar"),
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

export default Rutina;
