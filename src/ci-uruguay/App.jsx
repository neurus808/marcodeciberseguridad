import React, { useEffect } from 'react';
import '../ci-uruguay/style.css';

export default function App() {
  useEffect(() => {
    import('./script.js');
  }, []);

  return (
    <>
      <header>
        <h1>Cuida tu Identidad</h1>
        <p>Protegé tu Cédula de Identidad antes de compartirla</p>
      </header>
      <main>
        <div className="container">
          <div className="upload-area" id="drop-zone">
            <input type="file" id="upload" accept="image/*" />
            <p>Arrastrá tu imagen o tocá aquí para seleccionarla</p>
          </div>
          <div className="controls">
            <label htmlFor="watermark">Marca de agua:</label>
            <input type="text" id="watermark" placeholder="Ej: Uso exclusivo de..." />

            <label htmlFor="tool">Herramienta:</label>
            <select id="tool">
              <option value="draw">Pincel</option>
              <option value="pixel">Pixelado</option>
            </select>

            <label htmlFor="iaEffect">Efecto IA (opcional):</label>
            <select id="iaEffect">
              <option value="none">Sin efecto</option>
              <option value="waves">Ondas</option>
              <option value="lines">Isolíneas</option>
              <option value="distort">Deformación</option>
            </select>

            <div className="buttons">
              <button onClick={() => window.download()}>Descargar</button>
              <button onClick={() => window.resetCanvas()}>Reset</button>
            </div>
          </div>
          <canvas id="canvas"></canvas>
        </div>
      </main>
      <footer>HANDSHAKE | URUGUAY</footer>
    </>
  );
}
