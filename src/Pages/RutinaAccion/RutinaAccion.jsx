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
  { title: "Nombre Rutina", field: "nombreRutina" },
  { title: "ID Ejercicio", field: "idAccion", hidden: true },
  { title: "Nombre Ejercicio", field: "nombreAccion" },
  { title: "Sets", field: "setsAccion" },
  { title: "Repeticiones", field: "repsAccion" },
  { title: "Peso", field: "pesoAccion" },
  { title: "ID Rutina-Ejercicio", field: "idRutinaAccion", hidden: true},
];

//////////////////////////TERMINA GRID INICIAL//////////////////////////
//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////

//////////////////////////INICIA URLs///////////////////////////

const baseUrl = "https://localhost:44366/RutinaAccion/recRutinaAccion_PA";
const baseUrlPost = "https://localhost:44365/api/Usuario/insUsuario";
const baseUrlPut = "https://localhost:44365/api/Usuario/modUsuario";
const baseUrlDel = "https://localhost:44365/api/Usuario/delUsuario";
// const baseUrlPostKardex = "https://localhost:44365/api/Usuario/insUsuario";

//////////////////////////TERMINA URLs///////////////////////////

const RutinaAccion = () => {
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////

  const [idRutina, cambiaridRutina] = useState({ campo: 0, valido: null });
  const [idAccion, cambiaridAccion] = useState({ campo: 0, valido: null });
  const [nombreRutina, cambiarnombreRutina] = useState({ campo: "", valido: null });
  const [nombreAccion, cambiarnombreAccion] = useState({ campo: "", valido: null });
  const [setsAccion, cambiarsetsAccion] = useState({ campo: "", valido: null });
  const [repsAccion, cambiarrepsAccion] = useState({ campo: "", valido: null });
  const [pesoAccion, cambiarpesoAccion] = useState({ campo: "", valido: null });
  const [idRutinaAccion, cambiaridRutinaAccion] = useState({ campo: 0, valido: null });
  const [formularioValido, cambiarFormularioValido] = useState(false);

  //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////

  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  const expresionesRegulares = {
    idRutina: /^[0-9]*$/,
    idAccion: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    nombreRutina: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    nombreAccion: /^[1-9]$/, // solo numero del 1-9
    setsAccion: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, //formato de correo electronico
    repsAccion: /^(?=(?:.*[A-Za-z]){4,})(?=.*[A-Z])(?=(?:.*\d){4,})[A-Za-z\d]{8,}$/, //contrasena con almenos 4 letras y minimo 1 mayuscukla, 4 numeros y minimo 8 carcteres
    pesoAccion: /^[0-9]*$/,
    idRutinaAccion: /^[0-9]*$/,
  };

  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  //MANEJO DEL A OPCION DE SUBMIT DEL FORMULARIO PARA AGREGAR UN NUEVO USUARIO
  const onsubmitpost = (e) => {
    e.preventDefault();
    if (
      idRutina.valido === "true" &&
      idAccion.valido === "true" &&
      nombreRutina.valido === "true" &&
      nombreAccion.valido === "true" &&
      setsAccion.valido === "true" &&
      repsAccion.valido === "true" &&
      pesoAccion.valido === "true" &&
      idRutinaAccion.valido === "true"
    ) {
      cambiarFormularioValido(true);
      cambiaridRutina({ campo: "", valido: "" });
      cambiaridAccion({ campo: "", valido: null });
      cambiarnombreRutina({ campo: "", valido: null });
      cambiarnombreAccion({ campo: "", valido: null });
      cambiarsetsAccion({ campo: "", valido: null });
      cambiarrepsAccion({ campo: "", valido: null });
      cambiarpesoAccion({ campo: "", valido: null });
      cambiaridRutinaAccion({ campo: "", valido: null });
      showQuestionPost();
    } else {
      
      cambiarFormularioValido(false);
    }
  };

  /*const onsubmitpost = (e) => {
    e.preventDefault();
    if (
      idRutina.valido === "true" &&
      idAccion.valido === "true" &&
      nombreRutina.valido === "true" &&
      nombreAccion.valido === "true" &&
      setsAccion.valido === "true" &&
      repsAccion.valido === "true" &&
      pesoAccion.valido === "true" &&
      idRutinaAccion.valido === "true"
    ) {
      cambiarFormularioValido(true);
      cambiaridRutina({ campo: "", valido: "" });
      cambiaridAccion({ campo: "", valido: null });
      cambiarnombreRutina({ campo: "", valido: null });
      cambiarnombreAccion({ campo: "", valido: null });
      cambiarsetsAccion({ campo: "", valido: null });
      cambiarrepsAccion({ campo: "", valido: null });
      cambiarpesoAccion({ campo: "", valido: null });
      cambiaridRutinaAccion({ campo: "", valido: null });
      showQuestionPost();
    } else {
      
      cambiarFormularioValido(false);
    }
  };*/

  ///////////////////////////////////AXIOS FUNCIONES//////////////////////////////

  const endPointRutinaAccionXId =
    "https://localhost:44365/api/Usuario/recUsuarioXId?pId=" + idRutinaAccion.campo;

  ///////////////////////////////////FINALIZA AXIOS FUNCIONES//////////////////////////////

  ////////////////////////////////VALIDACIONES ID/////////////////////////////////

  function ValidarExistenciaRutinaAccionId() {
    function showError() {
      Swal.fire({
        icon: "error",
        //iconHtml: "<FontAwesomeIcon icon={faExclamationTriangle} />",
        title: "Cuidado",
        text: "Codigo Usuario Existente, Intente Nevamente",
        // customClass: {
        //   icon: 'no-icon',
        // },
      });
    }

    const MetodoValidar = async () => {
      await axios.get(endPointRutinaAccionXId).then((response) => {
        const data = response.data;
        if (data === null) {
          cambiaridRutinaAccion({ campo: idRutinaAccion.campo, valido: "true" });
        } else {
          cambiaridRutinaAccion({ campo: "", valido: "false" });
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
      title: "¿Desea agregar estos detalles a la rutina?",
      showDenyButton: true,
      confirmButtonText: "Si, agregar",
      denyButtonText: "No, cancelar",
      customClass: {
        confirmButton: 'btn-agregar', // Clase personalizada para el botón
        denyButton: 'btn-cancelar'    // Clase personalizada para el botón cancelar
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Detalles agregados correctamente!", "", "success");
        peticionPost();
        //peticionPostKardex();
      } else if (result.isDenied) {
        Swal.fire("No se agregaron los detalles", "", "info");
      }
    });
  }

  //REVISAR LOS PARENTESIS

  const peticionPost = async () => {
    const options = {
      idRutina: idRutina.campo,
      idAccion: idAccion.campo,
      nombreRutina: nombreRutina.campo,
      nombreAccion: nombreAccion.campo,
      setsAccion: setsAccion.campo,
      repsAccion: repsAccion.campo,
      pesoAccion: pesoAccion.campo,
      idRutinaAccion: idRutinaAccion.campo,
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
      title: "¿Desea editar los detalles de la rutina?",
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
      idAccion: idAccion.campo,
      nombreRutina: nombreRutina.campo,
      nombreAccion: nombreAccion.campo,
      setsAccion: setsAccion.campo,
      repsAccion: repsAccion.campo,
      pesoAccion: pesoAccion.campo,
      idRutinaAccion: idRutinaAccion.campo,
    };

    await axios

      .put(baseUrlPut, options)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((RutinaAccion) => {
          if (RutinaAccion.idRutinaAccion === options.idRutinaAccion) {
            RutinaAccion.idRutina = options.idRutina;
            RutinaAccion.idAccion = options.idAccion;
            RutinaAccion.nombreRutina = options.nombreRutina;
            RutinaAccion.nombreAccion = options.nombreAccion;
            RutinaAccion.setsAccion = options.setsAccion;
            RutinaAccion.repsAccion = options.repsAccion;
            RutinaAccion.pesoAccion = options.pesoAccion;
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
      idAccion: idAccion.campo,
      nombreRutina: nombreRutina.campo,
      nombreAccion: nombreAccion.campo,
      setsAccion: setsAccion.campo,
      repsAccion: repsAccion.campo,
      pesoAccion: pesoAccion.campo,
      idRutinaAccion: idRutinaAccion.campo,
    };

    const payload = {
      headers: { Authorization: "" },
      data: options,
    };

    await axios
      .delete(baseUrlDel, payload)
      .then((response) => {
        setData(
          data.filter((RutinaAccion) => RutinaAccion.idRutinaAccion !== options.idRutinaAccion)
        );
        abrirCerrarModalEliminar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  ////////////////////////////FINALIZA PETICION DELETE////////////////////////

  //////////////////////////PETICION SELECT////////////////////////

  const seleccionarRutinaAccion = async (RutinaAccion, caso) => {
    if (usuario && typeof RutinaAccion === "object") {
      console.log({ RutinaAccion });
    }
    const XRutinaAccion = Object.values(...usuRutinaAccionario);
    cambiaridRutina({ campo: XRutinaAccion[0], valido: "true" });
    cambiaridAccion({ campo: XRutinaAccion[1], valido: "true" });
    cambiarnombreRutina({ campo: XRutinaAccion[2], valido: "true" });
    cambiarnombreAccion({ campo: XRutinaAccion[3], valido: "true" });
    cambiarsetsAccion({ campo: XRutinaAccion[4], valido: "true" });
    cambiarrepsAccion({ campo: XRutinaAccion[5], valido: "true" });
    cambiarpesoAccion({ campo: XRutinaAccion[6], valido: "true" });
    cambiaridRutinaAccion({ campo: XRutinaAccion[7], valido: "true" });
    console.log({ XRutinaAccion });
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
                estado={setsAccion}
                cambiarEstado={cambiarsetsAccion}
                tipo="number"
                label="	Número de sets"
                placeholder="Ejemplo: 1"
                name="setsAccion"
                leyendaError="El número de sets debe ser un entero positivo menor a 1000."
                expresionRegular={expresionesRegulares.setsAccion}
              />
              <InputGeneral
                estado={repsAccion}
                cambiarEstado={cambiarrepsAccion}
                tipo="number"
                label="Repeticiones por set"
                placeholder="Ejemplo: 12"
                name="repsAccion"
                leyendaError="El número de repeticiones debe ser un entero positivo menor a 1000."
                expresionRegular={expresionesRegulares.repsAccion}
              />
              <InputGeneral
                estado={pesoAccion}
                cambiarEstado={cambiarpesoAccion}
                tipo="number"
                label="	Número de sets"
                placeholder="Ejemplo: 70"
                name="pesoAccion"
                leyendaError="El peso debe ser un número menor a 1000."
                expresionRegular={expresionesRegulares.pesoAccion}
              />
            </Columna>
          </Formulario1>
          </div>
      </div>

      {formularioValido === false && (
        <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b>Error:</b> Por favor rellena los detalles de la rutina correctamente.
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
        </button>
          </div>
          {formularioValido === true && (
            <MensajeExito>Detalle de rutina agregada exitosamente!</MensajeExito>
          )}
        </div>
    </div>
  );

  const bodyEditar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Modificar Detalle Rutina</h3>
      <div className="relleno-general">
        {" "}
        202 - General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={setsAccion}
                cambiarEstado={cambiarsetsAccion}
                tipo="number"
                label="	Número de sets"
                placeholder="Ejemplo: 1"
                name="setsAccion"
                leyendaError="El número de sets debe ser un entero positivo menor a 1000."
                expresionRegular={expresionesRegulares.setsAccion}
              />
              <InputGeneral
                estado={repsAccion}
                cambiarEstado={cambiarrepsAccion}
                tipo="number"
                label="Repeticiones por set"
                placeholder="Ejemplo: 12"
                name="repsAccion"
                leyendaError="El número de repeticiones debe ser un entero positivo menor a 1000."
                expresionRegular={expresionesRegulares.repsAccion}
              />
              <InputGeneral
                estado={pesoAccion}
                cambiarEstado={cambiarpesoAccion}
                tipo="number"
                label="	Número de sets"
                placeholder="Ejemplo: 70"
                name="pesoAccion"
                leyendaError="El peso debe ser un número menor a 1000."
                expresionRegular={expresionesRegulares.pesoAccion}
              />
            </Columna>
          </Formulario1>
          </div>
      </div>
      {formularioValido === false && (
        <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b>Error:</b> Por favor rellena los detalles de la rutina correctamente.
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
        </button>
          </div>
          {formularioValido === true && (
            <MensajeExito>Detalle de rutina actualizada exitosamente!</MensajeExito>
          )}
        </div>
      </div>
  );

  const bodyEliminar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Eliminar Detalle de Rutina</h3>
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
                label="Código del detalle de rutina"
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
            <MensajeExito>Detalle de rutina eliminada exitosamente!</MensajeExito>
          )}
        </div>
    </div>
  );

  function showQuestionDel() {
    Swal.fire({
      title: "¿Deseas eliminar los detalles de esta rutina?",
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
        Swal.fire("Detalle de rutina eliminada correctamente!", "", "success");
        peticionDelete();
        //peticionDeleteKardex();
      } else if (result.isDenied) {
        Swal.fire("Detalle de rutina no ha sido eliminada", "", "info");
      }
    });
  }

  return (
    <div className="Cliente">
      <div className="banner">
        <h3>
          200-Mantenimiento Detalle de Rutina
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
        title="Detalle de rutinas"
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

export default RutinaAccion;
