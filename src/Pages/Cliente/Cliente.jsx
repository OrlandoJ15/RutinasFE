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
        title: "Cuidado",
        text: "Codigo Cliente Existente, Intente Nevamente",
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
        Swal.fire("No se guardaron los cambios", "", "info");
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
      title: "¿Desea editar los campos?",
      showDenyButton: true,
      confirmButtonText: "Editar",
      denyButtonText: "Cancelar",
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
    backgroundcolor: "rgba(0, 0, 0, 0.25)",
    backdropfilter: "blur(50px)",
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
      <h3 className="container-header"> Agregar Cliente</h3>
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
                label="Nombre del cliente"
                placeholder="Introduzca el nombre del cliente"
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
                label="Email"
                placeholder="Introduzca el correo del cliente"
                name="email"
                leyendaError="Ingrese un email válido, como usuario@dominio.com"
                expresionRegular={expresionesRegulares.email}
              />

              <InputGeneral
                estado={telefono}
                cambiarEstado={cambiartelefono}
                tipo="number"
                label="Número de teléfono"
                placeholder="Introduzca el número de teléfono"
                name="telefono"
                leyendaError="Ingrese un número de teléfono válido de 8 a 12 dígitos"
                expresionRegular={expresionesRegulares.telefono}
              />

              <InputGeneral
                estado={sexo}
                cambiarEstado={cambiarsexo}
                tipo="text"
                label="sexo"
                placeholder="Género"
                name="sexo"
                leyendaError="El sexo debe ser M o F"
                expresionRegular={expresionesRegulares.sexo}
              />

              <InputGeneral
                estado={fechaNacimiento}
                cambiarEstado={cambiarfechaNacimiento}
                tipo="date"
                label="fechaNacimiento"
                placeholder="Introduzca la fecha de nacimiento"
                name="fechaNacimiento"
                leyendaError="La fecha de nacimiento debe estar en el formato DD-MM-AAAA"
                expresionRegular={expresionesRegulares.fechaNacimiento}
              />

              <InputGeneral
                estado={disciplina}
                cambiarEstado={cambiardisciplina}
                tipo="text"
                label="disciplina"
                placeholder="Introduzca la disciplina"
                name="disciplina"
                leyendaError="La disciplina debe contener entre 3 y 30 caracteres alfabéticos"
                expresionRegular={expresionesRegulares.disciplina}
              />
              <InputGeneral
                estado={antecedente}
                cambiarEstado={cambiarantecedente}
                tipo="text"
                label="antecedente"
                placeholder="Introduzca el antecedente"
                name="antecedente"
                leyendaError="El antecedente no debe exceder los 200 caracteres"
                expresionRegular={expresionesRegulares.antecedente}
              />
              <InputGeneral
                estado={descripcion}
                cambiarEstado={cambiardescripcion}
                tipo="text"
                label="descripcion"
                placeholder="Introduzca alguna descripción"
                name="descripcion"
                leyendaError="La descripción no debe exceder los 500 caracteres"
                expresionRegular={expresionesRegulares.descripcion}
              />
              <InputGeneral
                estado={altura}
                cambiarEstado={cambiaraltura}
                tipo="text"
                label="altura"
                placeholder="Altura"
                name="altura"
                leyendaError="La altura debe ser un número en cm, opcionalmente con hasta 2 decimales"
                expresionRegular={expresionesRegulares.altura}
              />
              <InputGeneral
                estado={peso}
                cambiarEstado={cambiarpeso}
                tipo="text"
                label="peso"
                placeholder="Peso"
                name="peso"
                leyendaError="El peso debe ser un número en kg, opcionalmente con hasta 2 decimales"
                expresionRegular={expresionesRegulares.peso}
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

      <div className="container-footer">
        <div className="btn-cancelar">
          <Button onClick={() => abrirCerrarModalInsertar()}>
            {" "}
            Cancelar{" "}
          </Button>
          </div>
          <div className="btn-agrega">
          <Button onClick={""} type="submit">
            {" "}
            Insertar
          </Button>
          </div>
          {formularioValido === true && (
            <MensajeExito>Formulario enviado exitosamente!</MensajeExito>
          )}
        </div>
    </div>
  );

  const bodyEditar = (
    <div style={scrollVertical}>
      <h3>Editar Usuario v2</h3>
      <div className="relleno-general">
        General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={nombre}
                cambiarEstado={cambiarnombre}
                tipo="text"
                label="Nombre del cliente"
                placeholder="Introduzca el nombre del cliente"
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
                label="Email"
                placeholder="Introduzca el correo del cliente"
                name="email"
                leyendaError="Ingrese un email válido, como usuario@dominio.com"
                expresionRegular={expresionesRegulares.email}
              />

              <InputGeneral
                estado={telefono}
                cambiarEstado={cambiartelefono}
                tipo="number"
                label="Número de teléfono"
                placeholder="Introduzca el número de teléfono"
                name="telefono"
                leyendaError="Ingrese un número de teléfono válido de 8 a 12 dígitos"
                expresionRegular={expresionesRegulares.telefono}
              />

              <InputGeneral
                estado={sexo}
                cambiarEstado={cambiarsexo}
                tipo="text"
                label="sexo"
                placeholder="Género"
                name="sexo"
                leyendaError="El sexo debe ser M o F"
                expresionRegular={expresionesRegulares.sexo}
              />

              <InputGeneral
                estado={fechaNacimiento}
                cambiarEstado={cambiarfechaNacimiento}
                tipo="date"
                label="fechaNacimiento"
                placeholder="Introduzca la fecha de nacimiento"
                name="fechaNacimiento"
                leyendaError="La fecha de nacimiento debe estar en el formato DD-MM-AAAA"
                expresionRegular={expresionesRegulares.fechaNacimiento}
              />

              <InputGeneral
                estado={disciplina}
                cambiarEstado={cambiardisciplina}
                tipo="text"
                label="disciplina"
                placeholder="Introduzca la disciplina"
                name="disciplina"
                leyendaError="La disciplina debe contener entre 3 y 30 caracteres alfabéticos"
                expresionRegular={expresionesRegulares.disciplina}
              />
              <InputGeneral
                estado={antecedente}
                cambiarEstado={cambiarantecedente}
                tipo="text"
                label="antecedente"
                placeholder="Introduzca el antecedente"
                name="antecedente"
                leyendaError="El antecedente no debe exceder los 200 caracteres"
                expresionRegular={expresionesRegulares.antecedente}
              />
              <InputGeneral
                estado={descripcion}
                cambiarEstado={cambiardescripcion}
                tipo="text"
                label="descripcion"
                placeholder="Introduzca alguna descripción"
                name="descripcion"
                leyendaError="La descripción no debe exceder los 500 caracteres"
                expresionRegular={expresionesRegulares.descripcion}
              />
              <InputGeneral
                estado={altura}
                cambiarEstado={cambiaraltura}
                tipo="text"
                label="altura"
                placeholder="Altura"
                name="altura"
                leyendaError="La altura debe ser un número en cm, opcionalmente con hasta 2 decimales"
                expresionRegular={expresionesRegulares.altura}
              />
              <InputGeneral
                estado={peso}
                cambiarEstado={cambiarpeso}
                tipo="text"
                label="peso"
                placeholder="Peso"
                name="peso"
                leyendaError="El peso debe ser un número en kg, opcionalmente con hasta 2 decimales"
                expresionRegular={expresionesRegulares.peso}
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
        <Button color="primary">
          Editar
        </Button>
      </div>
    </div>
  );

  function showQuestionDel() {
    Swal.fire({
      title: "Seguro que desea Eliminar el Usuario?",
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
        Swal.fire("Cambios NO Guardados", "", "info");
      }
    });
  }

  const bodyEliminar = (
    <div style={scrollVertical}>
      <h3>Eliminar Usuario</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          <Formulario1>
            <Columna>
            <InputGeneral
                estado={idCliente}
                cambiarEstado={cambiaridCliente}
                tipo="number"
                label="idCliente"
                placeholder="Ingrese el código de cliente"
                name="idCliente"
                leyendaError="El código debe ser un número entre 1 y 100 dígitos"
                expresionRegular={expresionesRegulares.idCliente}
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
          200-Mantenimiento Clientes
        </h3>
      </div>
      <div className="btn-agrega">
        <Button
          startIcon={<AddBox />}
          onClick={() => abrirCerrarModalInsertar()}
        >
          Agregar Cliente
        </Button>
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
            tooltip: "Modificar Modificar",
            onClick: (event, rowData) => seleccionarCliente(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar Cliente",
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

export default Cliente;
