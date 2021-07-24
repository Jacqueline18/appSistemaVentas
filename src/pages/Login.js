import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import '../css/Login.css';

function Login(props){

  const baseUrl= "https://localhost:44360/api/usuarios";
  const cookies = new Cookies();//Para las variables de sesion

  //Metodo para obtener los datos de la vista login
  const [form,setForm]=useState({
    usuario:'',
    clave:''
  });
  
  const handleChange=e=>{
    const {name,value} = e.target;
    setForm({
      ...form,
      [name]:value
    });
    console.log(form);

  }

  //Metodo para guardar las variables de sesion
  const iniciarSesion=async()=>{
    await axios.get(baseUrl+`/${form.usuario}/${(form.clave)}`)
    .then(response=>{
      return response.data;

    }).then(response=>{
      if(response.length>0){
        var respuesta = response[0];
        cookies.set('cedula',respuesta.cedula,{path:'/'});
        cookies.set('nombre',respuesta.nombre,{path:'/facturacion'});
        console.log(respuesta); 
        alert("Bienvenido: "+respuesta.nombre);
        props.history.push('/menu');
      }else{
        alert("El usuario o la clave son incorrectos");
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }

  const registroUsuario=async()=>{
    props.history.push('/registroUsuario');
  }

    return (
        <div className="containerPrincipal">
        <div className="containerLogin">
          <h2>Login</h2>
          <br /> <br />
          <div className="form-group">
            <label>Usuario: </label>
            <br />
            <input type="number" className="form-control" name="usuario"
            onChange={handleChange}/>
            <br />
            <label>Clave: </label>
            <br />
            <input
              type="password" className="form-control" name="clave"
              onChange={handleChange}             
            />
            <br />
            <button className="btn btn-primary" onClick={()=>iniciarSesion()}>Iniciar Sesión</button>{"  "}
            <button className="btn btn-secondary" onClick={()=>registroUsuario()}>Registrarse</button>
          </div>
        </div>
      </div>
    );

}

export default Login;