import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function RegistroUsuario(props){

    const baseUrl="https://localhost:44360/api/usuarios";
    const [data, setData]=useState([]);

    const regresarLogin=async()=>{
        props.history.push('/login');
    }

    //Declarar los nombres de los input
    const [usuarioSeleccionado, setUsuarioSeleccionado]=useState({
        cedula:'',
        nombre:'',
        contrasenia:''
    });

    //Metodo para obtener los datos del articulo ingresado para guardar en BD
    const handleChange=e=>{
        const {name,value} = e.target;
        setUsuarioSeleccionado({
          ...usuarioSeleccionado,
          [name]:value
        });
    } 

    //Peticion post para insertar el usuario
    const peticionPost=async()=>{
        usuarioSeleccionado.cedula=parseInt(usuarioSeleccionado.cedula);
        await axios.post(baseUrl,usuarioSeleccionado)
        .then(response=>{
            setData(data.concat(response.data));
        }).catch(error=>{
            //console.log(error);
        })
        props.history.push('/login');
    }


    return (
        <div className="containerPrincipal">
        <div className="containerLogin">
          <h2>Registrar nuevo usuario</h2>
          <br /> <br />
          <div className="form-group">
            <label>Usuario (cédula): </label>
            <br />
            <input type="number" className="form-control" name="cedula" onChange={handleChange}/>
            <br />
            <label>Nombre Completo: </label>
            <br />
            <input type="text" className="form-control" name="nombre" onChange={handleChange}/>
            <br />
            <label>Clave: </label>
            <br />
            <input type="password" className="form-control" name="contrasenia" onChange={handleChange}/>
            <br />
            <button className="btn btn-danger" onClick={()=>regresarLogin()}>Atras</button>{"   "}
            <button className="btn btn-primary" onClick={()=>peticionPost()}>Registrarse</button>
          </div>
        </div>
      </div>
    );
}

export default RegistroUsuario;