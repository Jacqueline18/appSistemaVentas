import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import axios from 'axios';

function Facturacion(props) {

  const baseUrl = "https://localhost:44360/api/articulo";
  const baseUrlEncabezado = "https://localhost:44360/api/encabezado";
  const baseUrlDetalle = "https://localhost:44360/api/detalle";
  const cookies = new Cookies();//Para las variables de sesion
  const [listaDetalle, setListaDetalle] = useState([]);//Lista detalle de factura
  const [data, setData] = useState([]);

  //para habilitar y desabilitar el boton agregar
  const [botonActivo, setBotonActivo] = useState(false);

  //Metodo que contiene el objeto articulo
  const [articulo, setArticulo] = useState({
    idArticulo: 0,
    codigo: '',
    nombre: '',
    precio: 0,
    cantidad: 0,
    iva: 0,
    totalUnitario: 0
  });

  //Metodo que contiene el objeto articulo
  const [detalle, setDetalle] = useState({
    idEncabezado: 1,
    codigo: '',
    nombre: '',
    precio: 0,
    cantidad: 0,
    totalUnitario: 0
  });

  //Metodo que contiene el dato sumaTotal de la factura
  const [encabezado, setEncabezado] = useState({
    usuario: '',
    totalFactura: 0
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setArticulo({
      ...articulo,
      [name]: value
    });
    console.log(articulo);
  }

  //Metodo que devuelve si existe un articulo
  const codigoUnico = async () => {
    await axios.get(baseUrl + `/${articulo.codigo}`)
      .then(response => {
        return response.data;
      }).then(response => {
        if (response.length > 0) {
          var respuesta = response[0];
          cookies.set('idArticulo', respuesta.idArticulo);
          cookies.set('codigo', respuesta.codigo);
          cookies.set('nombreArticulo', respuesta.nombre);
          cookies.set('precio', respuesta.precio);
          cookies.set('iva', respuesta.iva);
          alert("Si existe el articulo: " + respuesta.nombre);
          setBotonActivo(true);
        } else {
          alert("El código ingresado no existe");
          cookies.set('nombreArticulo', "Solo lectura");
          setBotonActivo(false);
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  //Metodo para agregar los datos a la lista articulos
  const agregarArticulo = async () => {

    if(articulo.cantidad != 0){
      setBotonActivo(false);
    articulo.idArticulo = cookies.get('idArticulo');
    articulo.codigo = cookies.get('codigo');
    articulo.nombre = cookies.get('nombreArticulo');
    articulo.precio = cookies.get('precio');
    articulo.codigo = cookies.get('codigo');
    articulo.cantidad = articulo.cantidad;
    articulo.iva = cookies.get('iva');
    articulo.totalUnitario = (cookies.get('precio') * articulo.cantidad);
    articulo.totalUnitario += parseInt(cookies.get('iva'));
    encabezado.totalFactura += articulo.totalUnitario;
    cookies.set('totalFactura', encabezado.totalFactura);
    const updatedItems = [...listaDetalle, articulo];
    setListaDetalle(updatedItems);
    }else{
      alert("Debe completar todos los campos");
    }
    
  }

  //Metodo para guardar datos encabezado y detalle de la factura
  const agregarFacturaPost = async () => {

    window.print();

    //Almacenar el encabezado a la base de datos
    encabezado.usuario = cookies.get('nombre');
    encabezado.totalFactura = parseInt(cookies.get('totalFactura'));
    //Guardar encabezado
    await axios.post(baseUrlEncabezado, encabezado)
      .then(response => {
        setData(data.concat(response.data));
      }).catch(error => {
        console.log(error);
      })

    //Almacenar detalles a la base de datos
    var i;
    for (i = 0; i < listaDetalle.length; i++) {
      //Pasar datos de la listaDetalle
      detalle.codigo = listaDetalle[i].codigo
      detalle.nombre = listaDetalle[i].nombre
      detalle.precio = parseInt(listaDetalle[i].precio)
      detalle.cantidad = parseInt(listaDetalle[i].cantidad)
      detalle.totalUnitario = parseInt(listaDetalle[i].totalUnitario)
      //Guarda
      await axios.post(baseUrlDetalle, detalle)
        .then(response => {
          setData(data.concat(response.data));
        }).catch(error => {
          console.log(error);
        })
    }
    window.location.replace('');//Recargar la pagina
    cookies.set('totalFactura', 0);
    cookies.set('nombreArticulo', " ");
  }

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" >
        <button className="navbar-toggler" data-target="#menus" data-toggle="collapse" type="button">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="menus">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a href="#" className="nav-link">Inicio</a>
            </li>
            <li className="nav-item active">
              <a href="articulos" className="nav-link">Artículo</a>
            </li>
            <li className="nav-item active">
              <a href="facturacion" className="nav-link">Facturación</a>
            </li>
          </ul>
        </div>
      </nav>

      <br />
      <h3>{"Facturación"}</h3>
      <br />
      <div className="form-group">
        <label>Código:</label><br />
        <input type="text" className="form-control" name="codigo" style={{ width: "220px" }} onChange={handleChange} /><br />
        <label>Nombre Artículo:</label><br />
        <input type="text" className="form-control" name="nombre" style={{ width: "220px" }} readOnly value={cookies.get('nombreArticulo')} /><br />
        <label>Cantidad:</label><br />
        <input type="number" name="cantidad" className="form-control" style={{ width: "220px" }} onChange={handleChange} /><br />

        <button className="btn btn-secondary" onClick={() => codigoUnico()}>Buscar</button>{"  "}
        <button className="btn btn-primary" disabled={!botonActivo} onClick={() => agregarArticulo()}>Agregar</button>
      </div>
      <br />

      <div id="print">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>IVA</th>
              <th>Cantidad</th>
              <th>Total</th>

            </tr>
          </thead>
          <tbody>
            {listaDetalle.map(articulo => (
              <tr key={articulo.idArticulo}>
                <td>{articulo.codigo}</td>
                <td>{articulo.nombre}</td>
                <td>{articulo.precio}</td>
                <td>{articulo.iva}</td>
                <td>{articulo.cantidad}</td>
                <td>{articulo.totalUnitario}</td>
              </tr>
            ))}
          </tbody>
          <tbody>
            <tr>
              <th></th><th></th><th></th><th></th><th></th>
              <th>Suma Total: {cookies.get('totalFactura')}</th>
            </tr>
          </tbody>

        </table>
      </div>
      <button className="btn btn-primary" onClick={() => agregarFacturaPost()}>Imprimir</button>
    </div>
  );

}

export default Facturacion;