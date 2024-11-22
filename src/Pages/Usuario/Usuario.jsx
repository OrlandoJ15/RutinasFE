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
  { title: "ID Entrenador", field: "idUsuario", hidden:true },
  { title: "Nombre", field: "nombre" },
  { title: "Correo Electrónico", field: "email" },
  { title: "Teléfono", field: "telefono" },
  { title: "Creado", field: "creado", hidden:true  },
  { title: "Clave", field: "clave", hidden:true },
  { title: "Rol", field: "rol", hidden:true  },
];

//////////////////////////TERMINA GRID INICIAL//////////////////////////
//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////

//////////////////////////INICIA URLs///////////////////////////

const baseUrl = "https://localhost:44366/Usuario/recUsuario_PA";
const baseUrlPost = "https://localhost:44365/api/Usuario/insUsuario";
const baseUrlPut = "https://localhost:44365/api/Usuario/modUsuario";
const baseUrlDel = "https://localhost:44365/api/Usuario/delUsuario";
// const baseUrlPostKardex = "https://localhost:44365/api/Usuario/insUsuario";

//////////////////////////TERMINA URLs///////////////////////////

const Usuario = () => {
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////

  const [idUsuario, cambiaridUsuario] = useState({ campo: 0, valido: null });
  const [nombre, cambiarnombre] = useState({ campo: "", valido: null });
  const [email, cambiaremail] = useState({ campo: "", valido: null, });
  const [telefono, cambiartelefono] = useState({ campo: "", valido: null });
  const [creado, cambiarcreado] = useState({ campo: "", valido: null });
  const [clave, cambiarclave] = useState({ campo: "", valido: null });
  const [rol, cambiarrol] = useState({ campo: "", valido: null });
  const [formularioValido, cambiarFormularioValido] = useState(false);

  // const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({
  //   IdUsuario: "",
  //   Nombre: "",
  //   NombreUsuario: "",
  //   Rol: "",
  //   email: "",
  //   Clave: "",
  // });

  //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////

  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  const expresionesRegulares = { 
    idUsuario: /^([1-9]|[1-9][0-9]|100)$/,
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    telefono: /^[0-9\s-]+$/,
    creado: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{2}$/,
    clave: /^[\s\S]+$/,
    rol: /^[a-zA-Z\s]+$/,
  };
  

  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  //MANEJO DEL A OPCION DE SUBMIT DEL FORMULARIO PARA AGREGAR UN NUEVO USUARIO
  const onsubmitpost = (e) => {
    e.preventDefault();
    if (
      idUsuario.valido === "true" &&
      nombre.valido === "true" &&
      email.valido === "true" &&
      telefono.valido === "true" &&
      creado.valido === "true" &&
      clave.valido === "true" &&
      rol.valido === "true" 
    ) {
      cambiarFormularioValido(true);
      cambiaridUsuario({ campo: "", valido: "" });
      cambiarnombre({ campo: "", valido: null });
      cambiaremail({ campo: "", valido: null });
      cambiartelefono({ campo: "", valido: null });
      cambiarcreado({ campo: "", valido: null });
      cambiarclave({ campo: "", valido: null });
      cambiarrol({ campo: "", valido: null });
      showQuestionPost();
    } else {
      
      cambiarFormularioValido(false);
    }
  };

  /*const onsubmitpost = (e) => {
    e.preventDefault();
    if (
      idUsuario.valido === "true" &&
      nombre.valido === "true" &&
      email.valido === "true" &&
      telefono.valido === "true" &&
      creado.valido === "true" &&
      clave.valido === "true" &&
      rol.valido === "true" &&
    ) {
      cambiarFormularioValido(true);
      cambiaridUsuario({ campo: "", valido: "" });
      cambiarnombre({ campo: "", valido: null });
      cambiaremail({ campo: "", valido: null });
      cambiartelefono({ campo: "", valido: null });
      cambiarcreado({ campo: "", valido: null });
      cambiarclave({ campo: "", valido: null });
      cambiarrol({ campo: "", valido: null });
      showQuestionPost();
    } else {
      
      cambiarFormularioValido(false);
    }
  };*/

  ///////////////////////////////////AXIOS FUNCIONES//////////////////////////////

  const endPointUsuarioXId =
    "https://localhost:44366/Usuario/recUsuarioXId_PA/" + idUsuario.campo;

  ///////////////////////////////////FINALIZA AXIOS FUNCIONES//////////////////////////////

  ////////////////////////////////VALIDACIONES ID/////////////////////////////////

  function ValidarExistenciaUsuarioId() {
    function showError() {
      Swal.fire({
        icon: "error",
        //iconHtml: "<FontAwesomeIcon icon={faExclamationTriangle} />",
        title: "Importante",
        text: "El codigo de entrenador ya existe.",
        // customClass: {
        //   icon: 'no-icon',
        // },
      });
    }

    const MetodoValidar = async () => {
      await axios.get(endPointUsuarioXId).then((response) => {
        const data = response.data;
        if (data === null) {
          cambiaridUsuario({ campo: idUsuario.campo, valido: "true" });
        } else {
          cambiaridUsuario({ campo: "", valido: "false" });
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
  /*const [modalCambioClave, setModalCambioClave] = useState(false);*/

  //////////////////////////////// FINALIZA CONSTANTES MODAL/////////////////////////////////

  ////////////////////////////PETICION POST//////////////////////////////////////////////////

  function showQuestionPost() {
    Swal.fire({
      title: "¿Desea agregar este entrenador?",
      showDenyButton: true,
      confirmButtonText: "Si, agregar",
      denyButtonText: "No, cancelar",
      customClass: {
        confirmButton: 'btn-agregar', // Clase personalizada para el botón
        denyButton: 'btn-cancelar'    // Clase personalizada para el botón cancelar
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Entrenador agregado correctamente!", "", "success");
        peticionPost();
        //peticionPostKardex();
      } else if (result.isDenied) {
        Swal.fire("No se agregó el entrenador", "", "info");
      }
    });
  }

  //REVISAR LOS PARENTESIS

  const peticionPost = async () => {
    const options = {
      idUsuario: idUsuario.campo,
      nombre: nombre.campo,
      email: email.campo,
      telefono: telefono.campo,
      creado: creado.campo,
      clave: clave.campo,
      rol: rol.campo,
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
      title: "¿Desea editar la información del entrenador?",
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
      idUsuario: idUsuario.campo,
      nombre: nombre.campo,
      email: email.campo,
      telefono: telefono.campo,
      creado: creado.campo,
      clave: clave.campo,
      rol: rol.campo,
    };

    await axios

      .put(baseUrlPut, options)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((Usuario) => {
          if (Usuario.idUsuario === options.idUsuario) {
            Usuario.nombre = options.nombre;
            Usuario.email = options.email;
            Usuario.telefono = options.telefono;
            Usuario.creado = options.creado;
            Usuario.clave = options.clave;
            Usuario.rol = options.rol;
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
      idUsuario: idUsuario.campo,
      nombre: nombre.campo,
      email: email.campo,
      telefono: telefono.campo,
      creado: creado.campo,
      clave: clave.campo,
      rol: rol.campo,
    };

    const payload = {
      headers: { Authorization: "" },
      data: options,
    };

    await axios
      .delete(baseUrlDel, payload)
      .then((response) => {
        setData(
          data.filter((Usuario) => Usuario.idUsuario !== options.idUsuario)
        );
        abrirCerrarModalEliminar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  ////////////////////////////FINALIZA PETICION DELETE////////////////////////

  //////////////////////////PETICION SELECT////////////////////////

  const seleccionarUsuario = async (usuario, caso) => {
    if (usuario && typeof usuario === "object") {
      console.log({ usuario });
    }
    const XUsuario = Object.values(...usuario);
    cambiaridUsuario({ campo: XUsuario[0], valido: "true" });
    cambiarnombre({ campo: XUsuario[1], valido: "true" });
    cambiaremail({ campo: XUsuario[2], valido: "true" });
    cambiartelefono({ campo: XUsuario[3], valido: "true" });
    cambiarcreado({ campo: XUsuario[4], valido: "true" });
    cambiarclave({ campo: XUsuario[5], valido: "true" });
    cambiarrol({ campo: XUsuario[6], valido: "true" });
    console.log({ XUsuario });
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

  /*const abrirCerrarModalCambioClave = () => {
    setModalCambioClave(!modalCambioClave);
  };*/

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
      <h3 className="container-header"> 201 - Agregar Entrenador</h3>
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
                label="Nombre completo"
                placeholder="Ejemplo: Juan Pérez"
                name="nombre"
                leyendaError="El nombre debe tener entre 3 y 50 caracteres alfabéticos."
                expresionRegular={expresionesRegulares.nombre}
              />
              <InputGeneral
                estado={email}
                cambiarEstado={cambiaremail}
                tipo="email"
                label="Correo electrónico"
                placeholder="nombre@dominio.com"
                name="email"
                leyendaError="El correo electrónico debe ser válido, ejemplo: nombre@dominio.com."
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
            </Columna>
          </Formulario1>
          </div>
      </div>

      {formularioValido === false && (
        <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b>Error:</b> Por favor rellena la información del entrenador correctamente.
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
            <MensajeExito>Entrenador agregado exitosamente!</MensajeExito>
          )}
        </div>
    </div>
  );

  const bodyEditar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Modificar Entrenador</h3>
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
                label="Nombre completo"
                placeholder="Ejemplo: Juan Pérez"
                name="nombre"
                leyendaError="El nombre debe tener entre 3 y 50 caracteres alfabéticos."
                expresionRegular={expresionesRegulares.nombre}
              />
              <InputGeneral
                estado={email}
                cambiarEstado={cambiaremail}
                tipo="email"
                label="Correo electrónico"
                placeholder="nombre@dominio.com"
                name="email"
                leyendaError="El correo electrónico debe ser válido, ejemplo: nombre@dominio.com."
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
            </Columna>
          </Formulario1>
          </div>
      </div>
      {formularioValido === false && (
        <MensajeError>
          <p>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b>Error:</b> Por favor rellena la información del entrenador correctamente.
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
            <MensajeExito>Entrenador actualizado exitosamente!</MensajeExito>
          )}
        </div>
      </div>
  );

  function showQuestionDel() {
    Swal.fire({
      title: "¿Deseas eliminar este entrenador?",
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
        Swal.fire("Entrenador eliminado correctamente!", "", "success");
        peticionDelete();
        //peticionDeleteKardex();
      } else if (result.isDenied) {
        Swal.fire("Entrenador no ha sido eliminada", "", "info");
      }
    });
  }

  const bodyEliminar = (
    <div style={scrollVertical}>
      <h3 className="container-header"> 201 - Eliminar Entrenador</h3>
      <div className="relleno-eliminar">
        {" "}
        202 - General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={idUsuario}
                cambiarEstado={cambiaridUsuario}
                tipo="number"
                label="Código de entrenador"
                placeholder="Ejemplo: 1"
                name="idUsuario"
                leyendaError="El código debe ser un número entre 1 y 100 dígitos"
                expresionRegular={expresionesRegulares.idUsuario}
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
            <MensajeExito>Entrenador eliminado exitosamente!</MensajeExito>
          )}
        </div>
    </div>
  );

  /*function showQuestionCambioClave() {
    Swal.fire({
      title: "Seguro que desea Cambiar la Clave?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {*/
      /* Read more about isConfirmed, isDenied below */
      /*if (result.isConfirmed) {
        Swal.fire("Cambiada Correctamente!", "", "success");
        //aqui va el metodo para cambiar la contrasena
      } else if (result.isDenied) {
        Swal.fire("Cambios NO Guardados", "", "info");
      }
    });
  }*/

  /*const bodyCambioClave = (
    <div style={scrollVertical}>
      <div className="relleno-general">
        <div className="container-fluid">
          <Formulario>
            <ColumnaCenter>
              <InputGeneral
                estado={Clave}
                cambiarEstado={""}
                tipo="password"
                label="Contraseña Actual"
                placeholder="Introduzca la contraseña actual"
                name="ClaveActual"
                leyendaError="La contraseña actual es requerida"
                expresionRegular={expresionesRegulares.Clave}
                value={Clave.campo}
              />

              <InputGeneral
                estado={NuevaClave}
                cambiarEstado={cambiarNuevaClave}
                tipo="password"
                label="Nueva Contraseña"
                placeholder="Introduzca la nueva contraseña"
                name="NuevaClave"
                leyendaError="La contraseña debe tener al menos 8 caracteres"
                expresionRegular={expresionesRegulares.Clave}
                value={NuevaClave.campo}
              />

              <InputGeneral
                estado={ConfirmarNuevaClave}
                cambiarEstado={cambiarConfirmarNuevaClave}
                tipo="password"
                label="Confirmar Nueva Contraseña"
                placeholder="Confirme la nueva contraseña"
                name="ConfirmarNuevaClave"
                leyendaError="Las contraseñas no coinciden"
                expresionRegular={expresionesRegulares.Clave}
                value={ConfirmarNuevaClave.campo}
              />
            </ColumnaCenter>
          </Formulario>
        </div>
      </div>
      <div align="right">
        <Button onClick={() => abrirCerrarModalCambioClave()} color="success">
          {" "}
          Cancelar{" "}
        </Button>
        <Button color="success" onClick={() => showQuestionCambioClave()}>
          Cambiar
        </Button>
      </div>
    </div>
  );*/

  return (
    <div className="Cliente">
      <div className="banner">
        <h3>
          200-Mantenimiento Entrenador
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
        title="Entrenadores"
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar",
            onClick: (event, rowData) => seleccionarUsuario(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar",
            onClick: (event, rowData) =>
              seleccionarUsuario(rowData, "Eliminar"),
          },
          {
            icon: Password,
            tooltip: "Cambiar Contraseña",
            onClick: (event, rowData) => abrirCerrarModalCambioClave(),
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

export default Usuario;
