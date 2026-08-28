import React from 'react';
import { reportError } from '../utils/monitoring';

export class AppErrorBoundary extends React.Component{
  state={error:null};
  static getDerivedStateFromError(error){return{error}}
  componentDidCatch(error,info){console.error('JEP render error',error,info);reportError(error,{componentStack:info.componentStack})}
  render(){if(!this.state.error)return this.props.children;return <main className="app-error"><div><span>JEP / Recuperación</span><h1>Algo no cargó correctamente.</h1><p>Tu contenido sigue guardado. Recarga la página para reconstruir la vista con los datos compatibles.</p><button className="button primary" onClick={()=>window.location.reload()}>Recargar página</button><a className="button ghost" href="/">Volver al inicio</a></div></main>}
}
