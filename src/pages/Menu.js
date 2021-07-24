import React from 'react';

function Menu(props){
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
                  <a href="articulos" className="nav-link">Artículo para venta</a>
                </li>
                <li className="nav-item active">
                  <a href="facturacion" className="nav-link">Facturación</a>
                </li>
              </ul>

            </div>
          </nav>
        
      </div>


        
    );

}

export default Menu;