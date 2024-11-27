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
import '../Accion/Accion.css';
import "../../Styles/variables.css";

//////////////////////////INICIA SECCION COLUMNAS///////////////////////////
//////////////////////////INICIA GRID INICIAL//////////////////////////

const columnas = [
  { title: "ID Ejercicio", field: "idAccion", hidden: true },
  { title: "Nombre Ejercicio", field: "nombreAccion" },
  { title: "Grupo Musculo", field: "grupoMusculo" },
  { title: "Descripcion", field: "descripcion" },
  { title: "Creado", field: "creado" },
];

//////////////////////////TERMINA GRID INICIAL//////////////////////////
//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////

//////////////////////////INICIA URLs///////////////////////////

const baseUrl = "https://localhost:44366/Accion/recAccion_PA"; 
const baseUrlPost = "https://localhost:44365/api/Usuario/insUsuario";
const baseUrlPut = "https://localhost:44365/api/Usuario/modUsuario";
const baseUrlDel = "https://localhost:44365/api/Usuario/delUsuario";
// const baseUrlPostKardex = "https://localhost:44365/api/Usuario/insUsuario";

//////////////////////////TERMINA URLs///////////////////////////

const Accion = () => {
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////

  const [idAccion, cambiaridAccion] = useState({ campo: 0, valido: null });
  const [nombreAccion, cambiarnombreAccion] = useState({ campo: "", valido: null });
  const [grupoMusculo, cambiargrupoMusculo] = useState({campo: "",valido: null,});
  const [descripcion, cambiardescripcion] = useState({ campo: "", valido: null });
  const [creado, cambiarcreado] = useState({ campo: "", valido: null });
  const [formularioValido, cambiarFormularioValido] = useState(false);

  const [accionSeleccionado, setAccionSeleccionado] = useState({
  idAccion: "",
  nombreAccion: "",
  grupoMusculo: "",
  descripcion: "",
  creado: "",
  });

  //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////

  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  const expresionesRegulares = {
    idAccion: /^[0-100]*$/,
    nombreAccion: /^[A-Za-z\s]+$/, 
    grupoMusculo: /^[A-Za-z\s]+$/, 
    descripcion: /^[A-Za-z0-9.,;:!?()\s]+$/, 
    creado: /^([0-2][0-9]|(3)[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/,    ///^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{2}$/,   
      };
  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  //MANEJO DEL A OPCION DE SUBMIT DEL FORMULARIO PARA AGREGAR UN NUEVO USUARIO
  /*const onsubmitpost = (e) => {
    e.preventDefault();
    if (
      idAccion.valido === "true" &&
      nombreAccion.valido === "true" &&
      grupoMusculo.valido === "true" &&
      descripcion.valido === "true" &&
      creado.valido === "true"
    ) {
      cambiarFormularioValido(true);
      cambiaridAccion({ campo: "", valido: "" });
      cambiarnombreAccion({ campo: "", valido: null });
      cambiargrupoMusculo({ campo: "", valido: null });
      cambiardescripcion({ campo: "", valido: null });
      cambiarcreado({ campo: "", valido: null });
      showQuestionPost();
    } else {
      
      cambiarFormularioValido(false);
    }
  };*/

  /*const onsubmitpost = (e) => {
    e.preventDefault();
    if (
      idAccion.valido === "true" &&
      nombreAccion.valido === "true" &&
      grupoMusculo.valido === "true" &&
      descripcion.valido === "true" &&
      creado.valido === "true"
    ) {
      cambiarFormularioValido(true);
      cambiaridAccion({ campo: "", valido: "" });
      cambiarnombreAccion({ campo: "", valido: null });
      cambiargrupoMusculo({ campo: "", valido: null });
      cambiardescripcion({ campo: "", valido: null });
      cambiarcreado({ campo: "", valido: null });
      showQuestionPost();
    } else {
      
      cambiarFormularioValido(false);
    }
  };*/

  ///////////////////////////////////AXIOS FUNCIONES//////////////////////////////

  const endPointAccionXId =
    "https://localhost:44366/Accion/recAccionXId_PA/" + idAccion.campo;

  ///////////////////////////////////FINALIZA AXIOS FUNCIONES//////////////////////////////

  ////////////////////////////////VALIDACIONES ID/////////////////////////////////

  function ValidarExistenciaAccionId() {
    function showError() {
      Swal.fire({
        icon: "error",
        //iconHtml: "<FontAwesomeIcon icon={faExclamationTriangle} />",
        title: "Error",
        text: "Ejercicio ya existente",
        // customClass: {
        //   icon: 'no-icon',
        // },
      });
    }

    const MetodoValidar = async () => {
      await axios.get(endPointAccionXId).then((response) => {
        const data = response.data;
        if (data === null) {
          cambiaridAccion({ campo: idAccion.campo, valido: "true" });
        } else {
          cambiaridAccion({ campo: "", valido: "false" });
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
      title: "¿Desea agregar a este ejercicio?",
      showDenyButton: true,
      confirmButtonText: "Si, agregar",
      denyButtonText: "No, cancelar",
      customClass: {
        confirmButton: 'btn-agregar', // Clase personalizada para el botón
        denyButton: 'btn-cancelar'    // Clase personalizada para el botón cancelar
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Ejercicio agregado correctamente!", "", "success");
        peticionPost();
        //peticionPostKardex();
      } else if (result.isDenied) {
        Swal.fire("No se agregó el cliente", "", "info");
      }
    });
  }

  // const peticionPostKardex = async () => {
  //   const options = {
  //     Serie: Serie.campo,
  //     Numero: Numero.campo,
  //     Nombre: Nombre.campo,
  //     Monto: Monto.campo,
  //     IdUsuario: IdUsuario.campo,
  //   };

  //   await axios.post(baseUrlPostKardex, options).then((response) => {
  //     setData(data.concat(response.data));
  //     abrirCerrarModalInsertar();
  //   });
  // };

  //REVISAR LOS PARENTESIS

  const peticionPost = async () => {
    const options = {
      idAccion: idAccion.campo,
      nombreAccion: nombreAccion.campo,
      grupoMusculo: grupoMusculo.campo,
      descripcion: descripcion.campo,
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
      title: "¿Desea editar el ejercicio?",
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
      idAccion: idAccion.campo,
      nombreAccion: nombreAccion.campo,
      grupoMusculo: grupoMusculo.campo,
      descripcion: descripcion.campo,
      creado: creado.campo,
    };

    await axios

      .put(baseUrlPut, options)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((Accion) => {
          if (Accion.idAccion === options.idAccion) {
            Accion.idAccion = options.idAccion;
            Accion.nombreAccion = options.nombreAccion;
            Accion.grupoMusculo = options.grupoMusculo;
            Accion.descripcion = options.descripcion;
            Accion.creado = options.creado;
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
      idAccion: idAccion.campo,
      nombreAccion: nombreAccion.campo,
      grupoMusculo: grupoMusculo.campo,
      descripcion: descripcion.campo,
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
          data.filter((Accion) => Accion.idAccion !== options.idAccion)
        );
        abrirCerrarModalEliminar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  ////////////////////////////FINALIZA PETICION DELETE////////////////////////

  //////////////////////////PETICION SELECT////////////////////////

  const seleccionarAccion = async (Accion, caso) => {
    if (Accion && typeof Accion === "object") {
      console.log({ Accion });
    }
    const XAccion = Object.values(...Accion);
    cambiaridAccion({ campo: XAccion[0], valido: "true" });
    cambiarnombreAccion({ campo: XAccion[1], valido: "true" });
    cambiargrupoMusculo({ campo: XAccion[2], valido: "true" });
    cambiardescripcion({ campo: XAccion[3], valido: "true" });
    cambiarcreado({ campo: XAccion[4], valido: "true" });
    console.log({ XAccion });
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

  /////////////////////////INCLUIR ARTICULOS////////////////////////////

  const bodyInsertar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Agregar Ejercicio</h3>
      <div className="relleno-general">
        {" "}
        202 - General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
              <InputGeneral
                estado={nombreAccion}
                cambiarEstado={cambiarnombreAccion}
                tipo="text"
                label="Nombre del ejercicio"
                placeholder="Ejemplo: Press de banca"
                name="nombreAccion"
                leyendaError="El nombre del ejercicio debe tener entre 3 y 50 caracteres alfanuméricos."
                expresionRegular={expresionesRegulares.nombreAccion}
                onChange={""}
                onBlur={""}
                autofocus
              />
              <InputGeneral
                estado={grupoMusculo}
                cambiarEstado={cambiargrupoMusculo}
                tipo="text"
                label="Grupo muscular"
                placeholder="Ejemplo: Pecho, Espalda, Piernas"
                name="grupoMusculo"
                leyendaError="El grupo muscular debe tener entre 3 y 50 caracteres alfabéticos."
                expresionRegular={expresionesRegulares.grupoMusculo}
                onChange={""}
                onBlur={""}
                autofocus
              />
              <InputGeneral
                estado={descripcion}
                cambiarEstado={cambiardescripcion}
                tipo="text"
                label="Descripción"
                placeholder="Describe brevemente la acción."
                name="descripcion"
                leyendaError="La descripción debe tener como máximo 200 caracteres."
                expresionRegular={expresionesRegulares.descripcion}
                onChange={""}
                onBlur={""}
                autofocus
              />
              <InputGeneral
                estado={creado}
                cambiarEstado={cambiarcreado}
                tipo="date"
                label="Fecha de creación"
                placeholder="DD/MM/AAAA"
                name="creado"
                leyendaError="La fecha de creación debe estar en formato DD/MM/AAAA."
                expresionRegular={expresionesRegulares.creado}
                onChange={""}
                onBlur={""}
                autofocus
              />
            </Columna>
          </Formulario1>
        </div>
      </div>

      {formularioValido === false && (
        <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b>Error:</b> Por favor rellena los datos del ejercicio correctamente.
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
            <MensajeExito>Ejercicio agregado exitosamente!</MensajeExito>
          )}
        </div>
    </div>
  );

  const bodyEditar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Modificar Ejercicio</h3>
      <div className="relleno-general">
        {" "}
        202 - General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={nombreAccion}
                cambiarEstado={cambiarnombreAccion}
                tipo="text"
                label="Nombre del ejercicio"
                placeholder="Ejemplo: Press de banca"
                name="nombreAccion"
                leyendaError="El nombre del ejercicio debe tener entre 3 y 50 caracteres alfanuméricos."
                expresionRegular={expresionesRegulares.nombreAccion}
                onChange={""}
                onBlur={""}
                autofocus
              />
              <InputGeneral
                estado={grupoMusculo}
                cambiarEstado={cambiargrupoMusculo}
                tipo="text"
                label="Grupo muscular"
                placeholder="Ejemplo: Pecho, Espalda, Piernas"
                name="grupoMusculo"
                leyendaError="El grupo muscular debe tener entre 3 y 50 caracteres alfabéticos."
                expresionRegular={expresionesRegulares.grupoMusculo}
                onChange={""}
                onBlur={""}
                autofocus
              />
              <InputGeneral
                estado={descripcion}
                cambiarEstado={cambiardescripcion}
                tipo="text"
                label="Descripción"
                placeholder="Describe brevemente la acción."
                name="descripcion"
                leyendaError="La descripción debe tener como máximo 200 caracteres."
                expresionRegular={expresionesRegulares.descripcion}
                onChange={""}
                onBlur={""}
                autofocus
              />
            </Columna>
          </Formulario1>
        </div>
      </div>
      {formularioValido === false && (
        <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b>Error:</b> Por favor rellena los datos del ejercicio correctamente.
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
            <MensajeExito>Ejercicio actualizado exitosamente!</MensajeExito>
          )}
        </div>
      </div>
  );

  function showQuestionDel() {
    Swal.fire({
      title: "¿Deseas eliminar este ejercicio?",
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
        Swal.fire("Ejercicio eliminado correctamente!", "", "success");
        peticionDelete();
        //peticionDeleteKardex();
      } else if (result.isDenied) {
        Swal.fire("Ejercicio no ha sido eliminado", "", "info");
      }
    });
  }

  const bodyEliminar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Eliminar Ejercicio</h3>
      <div className="relleno-eliminar">
        {" "}
        202 - General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={idAccion}
                cambiarEstado={cambiaridAccion}
                tipo="number"
                label="Codigo del ejercicio"
                placeholder="Ejemplo: 1"
                name="idAccion"
                leyendaError="Solamente puede contener números."
                expresionRegular={expresionesRegulares.idAccion}
                onChange={""}
                onBlur={""}
                autofocus
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
            <MensajeExito>Ejercicio eliminado exitosamente!</MensajeExito>
          )}
        </div>
    </div>
  );


  return (
    <div className="Cliente">
      <div className="banner">
        <h3>
          200-Mantenimiento Ejercicios
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
        title="Ejercicios"
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar",
            onClick: (event, rowData) => seleccionarAccion(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar",
            onClick: (event, rowData) =>
              seleccionarAccion(rowData, "Eliminar"),
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

export default Accion;
