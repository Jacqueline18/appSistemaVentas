import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Menu from '../pages/Menu';
import Login from '../pages/Login';
import Articulos from '../pages/Articulos';
import Facturacion from '../pages/Facturacion';
import RegistroUsuario from '../pages/RegistroUsuario';

function Routes() {
  return (
    <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Login}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/menu" component={Menu}/>
      <Route exact path="/articulos" component={Articulos}/>
      <Route exact path="/facturacion" component={Facturacion}/>
      <Route exact path="/registroUsuario" component={RegistroUsuario}/>
    </Switch>

    </BrowserRouter>
  );
}

export default Routes;
