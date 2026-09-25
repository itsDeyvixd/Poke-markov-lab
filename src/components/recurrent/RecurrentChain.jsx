import React, { useState, useEffect } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { matrixPower, solveStationaryDistribution } from '../../utils/math';
import RecurrentMC from '../montecarlo/RecurrentMC';

export default function RecurrentChain({ p_miss, p_norm, p_crit }) {
  const [mode, setMode] = useState('A'); // A: Standard, B: Dynamic
  const [n, setN] = useState(1);
  const [dynamicP, setDynamicP] = useState([
    [0.33, 0.33, 0.34],
    [0.33, 0.33, 0.34],
    [0.33, 0.33, 0.34]
  ]);

  // Sync mode A with props
  const defaultP = [
    [p_miss, p_norm, p_crit],
    [p_miss, p_norm, p_crit],
    [p_miss, p_norm, p_crit]
  ];

  const P = mode === 'A' ? defaultP : dynamicP;
  
  const handleDynamicChange = (row, col, value) => {
    let val = parseFloat(value);
    if (isNaN(val)) val = 0;
    
    const newP = [...dynamicP.map(r => [...r])];
    newP[row][col] = val;
    setDynamicP(newP);
  };

  const normalizeRow = (r) => {
    const sum = dynamicP[r].reduce((a, b) => a + b, 0);
    if (sum === 0) return;
    const newP = [...dynamicP.map(row => [...row])];
    newP[r] = newP[r].map(v => v / sum);
    setDynamicP(newP);
  };

  const isRowValid = (r) => {
    const sum = P[r].reduce((a, b) => a + b, 0);
    return Math.abs(sum - 1.0) < 0.001;
  };

  const Pn = matrixPower(P, n);
  const pi = solveStationaryDistribution(P);
  
  const mu = pi.map(p => p > 0 ? 1 / p : Infinity);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#e6f7ff] border-l-4 border-[var(--color-pdx-border-alt)] p-4 rounded mb-2">
        <h3 className="font-pixel text-[10px] text-[var(--color-pdx-border-alt)] mb-2">Modelo de Cadena Recurrente</h3>
        <p className="font-sans text-sm text-gray-700 leading-relaxed">
          A diferencia del modelo absorbente, aquí la batalla nunca termina. El sistema salta infinitamente entre <strong>Fallo (F)</strong>, <strong>Normal (N)</strong> y <strong>Crítico (C)</strong>. Como puedes llegar a cualquier estado desde cualquier otro en el futuro, se llama cadena <em>recurrente irreducible</em>.
        </p>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setMode('A')} 
          className={`pixel-button flex-1 ${mode === 'A' ? 'pixel-button-active' : ''}`}
        >
          Modo A: Estándar
        </button>
        <button 
          onClick={() => setMode('B')} 
          className={`pixel-button flex-1 ${mode === 'B' ? 'pixel-button-active' : ''}`}
        >
          Modo B: Dinámico
        </button>
      </div>

      <div className="pixel-box p-4">
        <h2 className="font-pixel text-sm mb-4">Matriz de Transición P</h2>
        <p className="font-sans text-xs text-gray-600 mb-4">
          La matriz 3x3 muestra todas las rutas. En <strong>Modo A</strong>, el ataque no tiene memoria: siempre tienes la misma probabilidad sin importar qué pasó antes. En <strong>Modo B</strong>, puedes editar las filas para simular que un ataque falla más si el anterior fue crítico.
        </p>
        {mode === 'A' ? (
          <div className="overflow-x-auto">
            <BlockMath math={`P = \\begin{bmatrix} ${P[0][0].toFixed(3)} & ${P[0][1].toFixed(3)} & ${P[0][2].toFixed(3)} \\\\ ${P[1][0].toFixed(3)} & ${P[1][1].toFixed(3)} & ${P[1][2].toFixed(3)} \\\\ ${P[2][0].toFixed(3)} & ${P[2][1].toFixed(3)} & ${P[2][2].toFixed(3)} \\end{bmatrix}`} />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map(r => (
              <div key={r} className="flex flex-wrap items-center gap-2">
                <span className="font-pixel text-[10px] w-20">Fila {r===0?'F':r===1?'N':'C'}:</span>
                {[0, 1, 2].map(c => (
                  <input
                    key={c}
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={P[r][c]}
                    onChange={(e) => handleDynamicChange(r, c, e.target.value)}
                    className="pixel-input w-20"
                  />
                ))}
                {!isRowValid(r) && (
                  <button onClick={() => normalizeRow(r)} className="pixel-button !py-1 !px-2 bg-red-200">
                    Normalizar
                  </button>
                )}
                {isRowValid(r) && <span className="text-green-600 font-pixel text-[10px]">OK</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pixel-box p-4">
        <label className="font-pixel text-xs mb-2 block">Selecciona Turno futuro (n):</label>
        <div className="flex items-center gap-4">
          <input 
            type="range" min="1" max="50" value={n} 
            onChange={(e) => setN(parseInt(e.target.value))}
            className="flex-1 accent-[var(--color-pdx-border-alt)]"
          />
          <input 
            type="number" min="1" value={n} 
            onChange={(e) => setN(parseInt(e.target.value) || 1)}
            className="pixel-input w-20 text-center"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="pixel-box p-4">
          <h2 className="font-pixel text-sm mb-4">Chapman-Kolmogorov <InlineMath math={`P^{${n}}`} /></h2>
          <p className="font-sans text-xs text-gray-600 mb-4">
            Predice exactamente dónde estaremos en el turno $n$. Notarás que si $n$ es muy grande, ¡todas las filas de la matriz se vuelven idénticas! Esto significa que el sistema "olvidó" cómo empezó.
          </p>
          <div className="overflow-x-auto">
            <BlockMath math={`P^{${n}} = \\begin{bmatrix} ${Pn[0][0].toFixed(3)} & ${Pn[0][1].toFixed(3)} & ${Pn[0][2].toFixed(3)} \\\\ ${Pn[1][0].toFixed(3)} & ${Pn[1][1].toFixed(3)} & ${Pn[1][2].toFixed(3)} \\\\ ${Pn[2][0].toFixed(3)} & ${Pn[2][1].toFixed(3)} & ${Pn[2][2].toFixed(3)} \\end{bmatrix}`} />
          </div>
        </div>

        <div className="pixel-box p-4">
          <h2 className="font-pixel text-sm mb-4">Distribución Estacionaria <InlineMath math={`\\pi`} /></h2>
          <p className="font-sans text-xs text-gray-600 mb-4">
            Cuando $n \to \infty$, el sistema alcanza el "equilibrio". El vector $\pi$ nos dice exactamente el porcentaje de tiempo que el Pokémon pasará en cada estado si la batalla dura por toda la eternidad.
          </p>
          <div className="overflow-x-auto">
            <BlockMath math={`\\pi = \\begin{bmatrix} ${pi[0].toFixed(3)} & ${pi[1].toFixed(3)} & ${pi[2].toFixed(3)} \\end{bmatrix}`} />
          </div>
          <div className="mt-4 text-xs font-sans text-gray-700 leading-relaxed border-t border-gray-200 pt-4">
            <p className="mb-2 font-bold">Tiempos Medios de Retorno ($\mu$):</p>
            <p className="mb-1">Si fallas hoy, pasarán en promedio <strong><InlineMath math={`${mu[0].toFixed(2)}`} /> turnos</strong> antes de que vuelvas a fallar.</p>
            <p className="mb-1">Si das un golpe normal, esperarás <strong><InlineMath math={`${mu[1].toFixed(2)}`} /> turnos</strong> en promedio para el siguiente.</p>
            <p>Si das un crítico, tomará en promedio <strong><InlineMath math={`${mu[2].toFixed(2)}`} /> turnos</strong> para ver otro.</p>
          </div>
        </div>
      </div>
      
      <div className="pixel-box p-4 overflow-x-auto">
        <h2 className="font-pixel text-sm mb-4">Grafo de Estados (F, N, C)</h2>
        <div className="flex justify-center bg-white rounded border-2 border-[var(--color-pdx-border-alt)] p-4 min-w-[300px]">
          <svg width="100%" height="300" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-pdx-text)" />
              </marker>
            </defs>
            
            {/* Coordinates */}
            {/* F: (100, 200), N: (300, 200), C: (200, 50) */}
            
            <circle cx="100" cy="200" r="25" fill="var(--color-pdx-box)" stroke="var(--color-pdx-border-alt)" strokeWidth="3" />
            <text x="100" y="205" textAnchor="middle" className="font-pixel text-xs" fill="var(--color-pdx-text)">F</text>
            
            <circle cx="300" cy="200" r="25" fill="var(--color-pdx-box)" stroke="var(--color-pdx-border-alt)" strokeWidth="3" />
            <text x="300" y="205" textAnchor="middle" className="font-pixel text-xs" fill="var(--color-pdx-text)">N</text>
            
            <circle cx="200" cy="70" r="25" fill="var(--color-pdx-border)" stroke="var(--color-pdx-border-alt)" strokeWidth="3" />
            <text x="200" y="75" textAnchor="middle" className="font-pixel text-xs" fill="white">C</text>

            {/* Simplify edges for visual clarity. Just draw standard connections to show it's fully connected. 
                Using simple paths. For a real app, bezier curves with exact prob labels. */}
            
            {/* F -> C */}
            <path d="M 115 180 Q 150 120 185 85" fill="none" stroke="var(--color-pdx-text)" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.6"/>
            {/* C -> F */}
            <path d="M 180 75 Q 120 130 95 170" fill="none" stroke="var(--color-pdx-text)" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.6"/>

            {/* N -> C */}
            <path d="M 285 180 Q 250 120 215 85" fill="none" stroke="var(--color-pdx-text)" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.6"/>
            {/* C -> N */}
            <path d="M 220 75 Q 280 130 305 170" fill="none" stroke="var(--color-pdx-text)" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.6"/>

            {/* F -> N */}
            <path d="M 130 210 Q 200 230 270 210" fill="none" stroke="var(--color-pdx-text)" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.6"/>
            {/* N -> F */}
            <path d="M 270 190 Q 200 170 130 190" fill="none" stroke="var(--color-pdx-text)" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.6"/>
            
            <text x="200" y="280" textAnchor="middle" className="font-pixel text-[10px]" fill="var(--color-pdx-text)">Grafo Totalmente Conectado (Transiciones en Matriz P)</text>
          </svg>
        </div>
      </div>
      
      <RecurrentMC P={P} piTheoretical={pi} />
    </div>
  );
}
