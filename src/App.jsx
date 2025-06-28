import React from 'react';
import logo from '../logo.png';

export default function App() {
  return (
    <>
      <header className="header">
        <img src={logo} alt="Logo Marco de Ciberseguridad" className="logo" />
        <h1>Marco de Ciberseguridad</h1>
        <p>Promoviendo la seguridad de la información para todos</p>
      </header>

      <section className="intro">
        <p>
          Usamos como referencia el <strong>Marco de Ciberseguridad</strong> de AGESIC, con el objetivo de acercar conocimiento, buenas prácticas y herramientas digitales a toda la ciudadanía.
        </p>
        <p>
          Creemos que una sociedad informada es una sociedad más segura.
        </p>
      </section>

      <section className="proyectos">
        <h2>Proyectos</h2>
        <div className="card">
          <h3>CI Uruguay – Cuida tu Identidad</h3>
          <p>
            Aplicación web gratuita para proteger tu Cédula de Identidad antes de compartirla. Ofrece herramientas de anonimización, marcas de agua resistentes a IA y exportación segura.
          </p>
          <div className="center">
            <a href="./ci-uruguay/" className="btn">Explorar herramienta</a>
          </div>
        </div>
      </section>

      <footer>HANDSHAKE | URUGUAY</footer>
    </>
  );
}
