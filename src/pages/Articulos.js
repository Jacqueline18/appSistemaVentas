import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

function Articulos(props) {

    const baseUrl = "https://localhost:44360/api/articulo";
    const [data, setData] = useState([]);
    const [modalEditar, setModalEditar] = useState(false);//Cerrar y abrir modal editar
    const [modalInsertar, setModalInsertar] = useState(false);//Cerrar y abrir modal insertar
    const [modalEliminar, setModalEliminar] = useState(false);//Cerrar y abrir modal eliminar
    //Declarar los nombres de los input
    const [articuloSeleccionado, setArticuloSeleccionado] = useState({
        idArticulo: '',
        nombre: '',
        precio: '',
        iva: false
    }); //Estado

    //Metodo para obtener los datos del articulo ingresado para guardar en BD
    const handleChange = e => {
        const target = e.target
        const name = target.name
        const value = target.type == "checkbox" ? target.checked : target.value
        setArticuloSeleccionado({
            ...articuloSeleccionado,
            [name]: value
        });
    }

    //Metodo para abrir y cerrar modal insertar
    const abrirCerrarModalInsertar = () => {
        setModalInsertar(!modalInsertar);
    }
    //Metodo para abrir y cerrar modal editar
    const abrirCerrarModalEditar = () => {
        setModalEditar(!modalEditar);
    }
    //Metodo para abrir y cerrar modal eliminar
    const abrirCerrarModalEliminar = () => {
        setModalEliminar(!modalEliminar);
    }

    //Obtene los ariculos
    const articulosGet = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    //Peticion post para insertar el articulo
    const peticionPost = async () => {
        if(articuloSeleccionado.nombre != "" && articuloSeleccionado.precio != ""){
            delete articuloSeleccionado.idArticulo;
        articuloSeleccionado.precio = parseInt(articuloSeleccionado.precio);
        //Verificar campo checkbox IVA
        var aplicarIva = articuloSeleccionado.iva ? "Yes" : "No"
        if (aplicarIva == "Yes") {
            articuloSeleccionado.iva = 130;
        } else {
            articuloSeleccionado.iva = 0;
        }
        await axios.post(baseUrl, articuloSeleccionado)
            .then(response => {
                setData(data.concat(response.data));
                abrirCerrarModalInsertar();
            }).catch(error => {
                //console.log(error);
            })
        window.location.replace('');

        }else{
            alert("Debe completar todos los campos");
        }
        
    }

    //Peticion put para editar el articulo
    const peticionPut = async () => {
        articuloSeleccionado.precio = parseInt(articuloSeleccionado.precio);
        var aplicarIva = articuloSeleccionado.iva ? "Yes" : "No"
        if (aplicarIva == "Yes") {
            articuloSeleccionado.iva = 130;
        } else {
            articuloSeleccionado.iva = 0;
        }
        await axios.put(baseUrl + "/" + articuloSeleccionado.idArticulo, articuloSeleccionado)
            .then(response => {
                var respuesta = response.data;
                var dataAuxiliar = data;
                dataAuxiliar.map(articulo => {
                    if (articulo.idArticulo === articuloSeleccionado.idArticulo) {
                        articulo.nombre = respuesta.nombre;
                        articulo.precio = respuesta.precio;
                        articulo.iva = respuesta.iva;
                    }
                })
                abrirCerrarModalEditar();
            }).catch(error => {
                //console.log(error);
            })
        window.location.replace('');//Redireccionar
    }

    //Peticion delete para eliminar un articulo
    const peticionDelete = async () => {
        await axios.delete(baseUrl + "/" + articuloSeleccionado.idArticulo)

            .then(response => {
                setData(data.filter(articulo => articulo.idArticulo !== response.data));
                abrirCerrarModalEliminar();
            }).catch(error => {
                //console.log(error);
            })
    }

    //Verifica que opcion se selecciono en la tabla si editar o eliminar 
    const seleccionOpcion = (articulo, caso) => {
        setArticuloSeleccionado(articulo);
        (caso === "Editar") ?
            abrirCerrarModalEditar() : abrirCerrarModalEliminar();
    }

    useEffect(() => {
        articulosGet();
    }, [])

    return (
        //Barra Menu
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
            <h3>{"Articulos para la Venta"}</h3>
            <br /><br />
            <button className="btn btn-primary" onClick={() => abrirCerrarModalInsertar()}>Agregar nuevo Artículo</button>
            <br /><br />
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Codigo</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>IVA</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(articulo => (
                        <tr key={articulo.idArticulo}>
                            <td>{articulo.codigo}</td>
                            <td>{articulo.nombre}</td>
                            <td>{articulo.precio}</td>
                            <td>{articulo.iva}</td>
                            <td>{articulo.total}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => seleccionOpcion(articulo, "Editar")}>Editar</button>{" "}
                                <button className="btn btn-danger" onClick={() => seleccionOpcion(articulo, "Eliminar")}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={modalInsertar}>
                <ModalHeader>Registrar Artículo</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Nombre:</label>
                        <br />
                        <input type="text" className="form-control" required name="nombre" onChange={handleChange} />
                        <br />
                        <label>Precio:</label>
                        <br />
                        <input type="number" className="form-control" required name="precio" onChange={handleChange} />
                        <br />
                        Aplicar IVA (13%)  <input type="checkbox" name="iva" checked={articuloSeleccionado.iva == true} onChange={handleChange} />
                        <br />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={() => peticionPost()}>Agregar</button>{"  "}
                    <button className="btn btn-danger" onClick={() => abrirCerrarModalInsertar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEditar}>
                <ModalHeader>Editar Artículo</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>ID:</label>
                        <br />
                        <input type="text" className="form-control" readOnly value={articuloSeleccionado && articuloSeleccionado.idArticulo} />
                        <br />
                        <label>Nombre:</label>
                        <br />
                        <input type="text" className="form-control" name="nombre" onChange={handleChange} value={articuloSeleccionado && articuloSeleccionado.nombre} />
                        <br />
                        <label>Precio:</label>
                        <br />
                        <input type="number" className="form-control" name="precio" onChange={handleChange} value={articuloSeleccionado && articuloSeleccionado.precio} />
                        <br />
                        Aplicar IVA (13%)  <input type="checkbox" name="iva" checked={articuloSeleccionado.iva == true} onChange={handleChange} value={articuloSeleccionado && articuloSeleccionado.iva} />
                        <br />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={() => peticionPut()}>Editar</button>{"  "}
                    <button className="btn btn-danger" onClick={() => abrirCerrarModalEditar()}>Cancelar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEliminar}>
                <ModalBody>
                    ¿Desea eliminar el artículo {articuloSeleccionado && articuloSeleccionado.nombre}?
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-danger" onClick={() => peticionDelete()}>Sí</button>{"  "}
                    <button className="btn btn-secondary" onClick={() => abrirCerrarModalEliminar()}>No</button>
                </ModalFooter>
            </Modal>
        </div>
    );

}

export default Articulos;