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
  { title: "ID Entrenador", field: "idUsuario" },
  { title: "Nombre", field: "nombre" },
  { title: "Email", field: "email" },
  { title: "Telefono", field: "telefono" },
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
      title: "¿Desea guardar estos cambios?",
      showDenyButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Guardado Correctamente!", "", "success");
        peticionPost();
        //peticionPostKardex();
      } else if (result.isDenied) {
        Swal.fire("La acción se canceló", "", "info");
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
      title: "¿Desea guardar estos cambios?",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
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
      <h3>Agregar Entrenador</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
              <InputGeneral
                estado={nombre}
                cambiarEstado={cambiarnombre}
                tipo="text"
                label="nombre"
                placeholder="Introduzca el nombre del entrenador"
                name="nombre"
                leyendaError="El nombre solo puede contener letras y espacios."
                expresionRegular={expresionesRegulares.nombre}
              />
              <InputGeneral
                estado={email}
                cambiarEstado={cambiaremail}
                tipo="email"
                label="email"
                placeholder="Introduzca el correo electronico"
                name="email"
                leyendaError="El email debe incluir @"
                expresionRegular={expresionesRegulares.email}
              />
              <InputGeneral
                estado={telefono}
                cambiarEstado={cambiartelefono}
                tipo="number"
                label="telefono"
                placeholder="Introduzca el teléfono del entrenador"
                name="telefono"
                leyendaError="Número de telefono en formato 1234-1234."
                expresionRegular={expresionesRegulares.telefono}
              />
              <InputGeneral
                estado={clave}
                cambiarEstado={""}
                tipo="password"
                label="clave"
                placeholder="Introduzca su contraseña"
                name="clave"
                leyendaError="La contraseña debe contener minimo 8 caracteres"
                expresionRegular={expresionesRegulares.clave}
              />
              <InputGeneral
                estado={rol}
                cambiarEstado={cambiarrol}
                tipo="text"
                label="rol"
                placeholder="Introduzca su rol"
                name="rol"
                leyendaError="El rol solo puede contener letras"
                expresionRegular={expresionesRegulares.rol}
              />
              <InputGeneral
                estado={creado}
                cambiarEstado={cambiarcreado}
                tipo="date"
                label="creado"
                placeholder="Fecha de creación del usuario"
                name="creado"
                leyendaError="Inserte una fecha valida"
                expresionRegular={expresionesRegulares.creado}
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
        <Button color="success" onClick={() => abrirCerrarModalInsertar()}>
          {" "}
          Cancelar{" "}
        </Button>
        <Button color="success" onClick={onsubmitpost} type="submit">
          {" "}
          Insertar
        </Button>
        {formularioValido === true && (
          <MensajeExito>Entrenador agregado exitosamente!</MensajeExito>
        )}
      </div>
    </div>
  );

  const bodyEditar = (
    <div style={scrollVertical}>
      <h3>Edite el entrenador</h3>
      <div className="relleno-general">
        General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={nombre}
                cambiarEstado={cambiarnombre}
                tipo="text"
                label="nombre"
                placeholder="Introduzca el nombre del entrenador"
                name="nombre"
                leyendaError="El nombre solo puede contener letras y espacios."
                expresionRegular={expresionesRegulares.nombre}
              />
              <InputGeneral
                estado={email}
                cambiarEstado={cambiaremail}
                tipo="email"
                label="email"
                placeholder="Introduzca El email Electronico"
                name="email"
                leyendaError="El Formato Del email No Es Valido"
                expresionRegular={expresionesRegulares.email}
              />
              <InputGeneral
                estado={telefono}
                cambiarEstado={cambiartelefono}
                tipo="number"
                label="telefono"
                placeholder="Introduzca el teléfono del entrenador"
                name="telefono"
                leyendaError="El teléfono solo puede contener letras y espacios."
                expresionRegular={expresionesRegulares.telefono}
              />
              <InputGeneral
                estado={clave}
                cambiarEstado={""}
                tipo="password"
                label="clave"
                placeholder="Introduzca su contraseña"
                name="clave"
                leyendaError="La contraseña debe contener minimo 8 caracteres"
                expresionRegular={expresionesRegulares.clave}
              />
              <InputGeneral
                estado={rol}
                cambiarEstado={cambiarrol}
                tipo="text"
                label="rol"
                placeholder="Introduzca su rol"
                name="rol"
                leyendaError="El rol solo puede contener letras"
                expresionRegular={expresionesRegulares.rol}
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
      title: "¿Deseas eliminar este entrenador?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Eliminado Correctamente!", "", "success");
        peticionDelete();
        //peticionDeleteKardex();
      } else if (result.isDenied) {
        Swal.fire("La acción se canceló", "", "info");
      }
    });
  }

  const bodyEliminar = (
    <div style={scrollVertical}>
      <h3>Eliminar entrenador</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={idUsuario}
                cambiarEstado={cambiaridUsuario}
                tipo="number"
                label="idUsuario"
                placeholder="Introduzca el código del entrenador"
                name="idUsuario"
                leyendaError="El código no existe"
                expresionRegular={expresionesRegulares.idUsuario}
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
          <b>200-Mantenimiento Usuarios</b>
        </h3>
      </div>
      <div className="btn-agrega">
        <Button
          startIcon={<AddBox />}
          onClick={() => abrirCerrarModalInsertar()}
        >
          Agregar Usuario
        </Button>
      </div>
      <br />
      <br />
      <MaterialTable
        columns={columnas}
        data={data}
        title="Usuarios"
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar Modificar",
            onClick: (event, rowData) => seleccionarUsuario(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar Usuario",
            onClick: (event, rowData) =>
              seleccionarUsuario(rowData, "Eliminar"),
          },
          {
            icon: Password,
            tooltip: "Cambiar Contrasena",
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
          toolbar: { searchPlaceholder: "Busqueda" },
        }}
      />

      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>
      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
    </div>
  );
};

export default Usuario;
