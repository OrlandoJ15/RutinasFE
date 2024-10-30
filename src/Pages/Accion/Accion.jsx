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
        text: "Este ejercicio ya fue creado.",
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
      title: "¿Desea guardar los cambios?",
      showDenyButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Guardado Correctamente!", "", "success");
        peticionPost();
        //peticionPostKardex();
      } else if (result.isDenied) {
        Swal.fire("Cambios No Guardados", "", "info");
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
      title: "¿Desea guardar los cambios?",
      showDenyButton: true,
      confirmButtonText: "Editar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Guardado Correctamente!", "", "success");
        peticionPut();
        //peticionPutKardex();
      } else if (result.isDenied) {
        Swal.fire("Cambios No Guardados", "", "info");
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

  const abrirCerrarModalCambioClave = () => {
    setModalCambioClave(!modalCambioClave);
  };

  //////////////////////////MODALES////////////////////////

  ////////////////////////////CSS SCROLL, MODAL////////////////////////////

  const scrollVertical = {
    width: "70%",
    height: "100%",
    overflowX: "hidden",
    overflowY: "scroll",
    position: "relative",
    backgroundColor: "rgb(255, 255, 255)",
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

  const ListStyleButton = {
    margin: "20px 0px 0px 0px",
  };

  const StyleLabelAfterButton = {
    margin: "0px 0px 10px 0px",
  };

  const Text = {
    fontWeight: "bold",
  };

  ////////////////////////////CSS SCROLL, MODAL////////////////////////////

  /////////////////////////INCLUIR ARTICULOS////////////////////////////

  const bodyInsertar = (
    <div style={scrollVertical}>
      <header></header>
      <h3>Agregar Ejercicio</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
              <InputGeneral
                estado={nombreAccion}
                cambiarEstado={cambiarnombreAccion}
                tipo="text"
                label="Nombre Ejercicio"
                placeholder="Introduzca nombre del ejercicio"
                name="nombreAccion"
                leyendaError="Solamente puede contener letras."
                expresionRegular={expresionesRegulares.nombreAccion}
                onChange={""}
                onBlur={""}
                autofocus
              />
              <InputGeneral
                estado={grupoMusculo}
                cambiarEstado={cambiargrupoMusculo}
                tipo="text"
                label="Grupo Musculo"
                placeholder="Introduzca el grupo de musculo"
                name="grupoMusculo"
                leyendaError="Solamente puede contener letras."
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
                placeholder="Introduzca la descripción del ejercicio"
                name="descripcion"
                leyendaError="Solamente puede contener letras, numeros y signos de puntuación."
                expresionRegular={expresionesRegulares.descripcion}
                onChange={""}
                onBlur={""}
                autofocus
              />
              <InputGeneral
                estado={creado}
                cambiarEstado={cambiarcreado}
                tipo="date"
                label="Creado"
                placeholder="Fecha de creación del ejercicio"
                name="creado"
                leyendaError="Por favor usar formato de calendario DD/MM/YY."
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
            <b>Error:</b> Por favor rellena todos los datos correctamente.
          </p>
        </MensajeError>
      )}

      <div align="right">
      <div className="btn-cancelar">
        <Button onClick={() => abrirCerrarModalInsertar()}>
          {" "}
          Cancelar{" "}
        </Button>
        </div>
        <div className="btn-agrega">
        <Button onClick={""} type="submit">
          {" "}
          Agregar
        </Button>
        </div>
        {formularioValido === true && (
          <MensajeExito>Ejercicio agregado exitosamente!</MensajeExito>
        )}
      </div>
    </div>
  );

  const bodyEditar = (
    <div style={scrollVertical}>
      <h3>Editar Ejercicio</h3>
      <div className="relleno-general">
        General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={nombreAccion}
                cambiarEstado={cambiarnombreAccion}
                tipo="text"
                label="Nombre Ejercicio"
                placeholder="Introduzca nombre del ejercicio"
                name="nombreAccion"
                leyendaError="Solamente puede contener letras."
                expresionRegular={expresionesRegulares.nombreAccion}
                onChange={""}
                onBlur={""}
                autofocus
              />
              <InputGeneral
                estado={grupoMusculo}
                cambiarEstado={cambiargrupoMusculo}
                tipo="text"
                label="Grupo Musculo"
                placeholder="Introduzca el grupo de musculo"
                name="grupoMusculo"
                leyendaError="Solamente puede contener letras."
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
                placeholder="Introduzca la descripción del ejercicio"
                name="descripcion"
                leyendaError="Solamente puede contener letras, numeros y signos de puntuación."
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
            <b>Error:</b> Por favor rellena el formulario correctamente.
          </p>
        </MensajeError>
      )}

      <div align="right">
        <Button onClick={() => abrirCerrarModalEditar()}> Cancelar </Button>
        <Button color="primary" onClick={""}>
          Editar
        </Button>
      </div>
    </div>
  );

  function showQuestionDel() {
    Swal.fire({
      title: "¿Seguro que deseas eliminar el ejercicio?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Ejercicio eliminado!", "", "success");
        peticionDelete();
        //peticionDeleteKardex();
      } else if (result.isDenied) {
        Swal.fire("Se canceló la acción", "", "info");
      }
    });
  }

  const bodyEliminar = (
    <div style={scrollVertical}>
      <h3>Eliminar Ejercicio</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={idAccion}
                cambiarEstado={cambiaridAccion}
                tipo="number"
                label="Codigo de ejercicio"
                placeholder="Introduzca codigo del ejercicio"
                name="idAccion"
                leyendaError="Solamente puede contener números."
                expresionRegular={expresionesRegulares.idAccion}
                onChange={""}
                onBlur={""}
                autofocus
              />
              <InputGeneral
                estado={nombreAccion}
                cambiarEstado={cambiarnombreAccion}
                tipo="text"
                label="Nombre Ejercicio"
                placeholder="Introduzca nombre del ejercicio"
                name="nombreAccion"
                leyendaError="Solamente puede contener letras."
                expresionRegular={expresionesRegulares.nombreAccion}
                onChange={""}
                onBlur={""}
                autofocus
              />
            </Columna>
          </Formulario1>
        </div>
      </div>

      <div align="right">
        <Button onClick={() => abrirCerrarModalEliminar()} color="success">
          {" "}
          Cancelar{" "}
        </Button>
        <Button color="success" onClick={() => showQuestionDel()}>
          Eliminar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="Cliente">
      <div className="banner">
        <h3>
          <b>200-Mantenimiento de Ejercicios</b>
        </h3>
      </div>
      <div className="btn-agrega">
        <Button
          startIcon={<AddBox />}
          onClick={() => abrirCerrarModalInsertar()}
        >
          Agregar Ejercicio
        </Button>
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
            tooltip: "Modificar Ejercicio",
            onClick: (event, rowData) => seleccionarAccion(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar Ejercicio",
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
          toolbar: { searchPlaceholder: "Busqueda" },
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
