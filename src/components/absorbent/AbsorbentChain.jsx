import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { matrixPower } from '../../utils/math';
import AbsorbentMC from '../montecarlo/AbsorbentMC';

export default function AbsorbentChain({ p_star }) {
  const [n, setN] = useState(1);
  
  const p = p_star;
  const q = 1 - p;

  const P = [
    [q, p],
    [0, 1]
  ];

  const Pn = matrixPower(P, n);

  const probLeqN = Pn[0][1];
  const probEqN = Math.pow(q, n - 1) * p;
  const expectedTime = 1 / p;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#e6f7ff] border-l-4 border-[var(--color-pdx-border-alt)] p-4 rounded mb-2">
        <h3 className="font-pixel text-[10px] text-[var(--color-pdx-border-alt)] mb-2">Modelo de Cadena Absorbente</h3>
        <p className="font-sans text-sm text-gray-700 leading-relaxed">
          Imagina un agujero negro. En este modelo, una vez que el Pokémon logra asestar un <strong>"Golpe Crítico" (Estado 1)</strong>, el análisis se detiene y nos quedamos allí. Por eso se llama estado <em>"absorbente"</em> (no puedes escapar de él).
        </p>
      </div>

      <div className="pixel-box p-4">
        <h2 className="font-pixel text-sm mb-4">Matriz de Transición P</h2>
        <p className="font-sans text-xs text-gray-600 mb-4">
          La matriz <strong>P</strong> es el mapa del sistema. Nos dice la probabilidad de saltar de una fila a una columna en el siguiente turno. En la fila "0", ves la probabilidad de fallar ($q$) o acertar el crítico ($p$). En la fila "1", ves que si ya diste un crítico, te quedas ahí (probabilidad 1.0).
        </p>
        <div className="overflow-x-auto">
          <BlockMath math={`P = \\begin{bmatrix} ${q.toFixed(4)} & ${p.toFixed(4)} \\\\ 0 & 1 \\end{bmatrix}`} />
        </div>
      </div>

      <div className="pixel-box p-4">
        <label className="font-pixel text-xs mb-2 block">Selecciona Turno en el futuro (n):</label>
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={n} 
            onChange={(e) => setN(parseInt(e.target.value))}
            className="flex-1 accent-[var(--color-pdx-border-alt)]"
          />
          <input 
            type="number" 
            min="1" 
            value={n} 
            onChange={(e) => setN(parseInt(e.target.value) || 1)}
            className="pixel-input w-20 text-center"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="pixel-box p-4">
          <h2 className="font-pixel text-sm mb-4">Chapman-Kolmogorov <InlineMath math={`P^{${n}}`} /></h2>
          <p className="font-sans text-xs text-gray-600 mb-4">
            En lugar de calcular turno por turno, las ecuaciones de <strong>Chapman-Kolmogorov</strong> nos permiten "viajar en el tiempo". Al multiplicar la matriz por sí misma $n$ veces ($P^n$), obtenemos un mapa exacto de dónde estaremos en el turno $n$, sumando todos los caminos posibles.
          </p>
          <div className="overflow-x-auto">
            <BlockMath math={`P^{${n}} = \\begin{bmatrix} ${Pn[0][0].toFixed(4)} & ${Pn[0][1].toFixed(4)} \\\\ ${Pn[1][0].toFixed(4)} & ${Pn[1][1].toFixed(4)} \\end{bmatrix}`} />
          </div>
        </div>

        <div className="pixel-box p-4 text-sm flex flex-col justify-center">
          <h2 className="font-pixel text-sm mb-4">Métricas Límite Exactas</h2>
          <div className="space-y-4">
            <div>
              <p className="mb-1 font-pixel text-[10px]"><InlineMath math={`P(T \\le ${n}) = ${probLeqN.toFixed(4)}`} /> ({(probLeqN * 100).toFixed(2)}%)</p>
              <p className="font-sans text-xs text-gray-600">Probabilidad de haber dado <em>al menos un crítico</em> en o antes del turno {n}.</p>
            </div>
            <div>
              <p className="mb-1 font-pixel text-[10px]"><InlineMath math={`f_{01}(${n}) = ${probEqN.toFixed(4)}`} /> ({(probEqN * 100).toFixed(2)}%)</p>
              <p className="font-sans text-xs text-gray-600">Probabilidad exacta de lograr tu <em>primer crítico</em> justo en el turno {n} (no antes).</p>
            </div>
            <div>
              <p className="mb-1 font-pixel text-[10px]"><InlineMath math={`\\mathbb{E}[T_{01}] = ${expectedTime.toFixed(2)} \\text{ turnos}`} /></p>
              <p className="font-sans text-xs text-gray-600"><strong>Tiempo de parada esperado:</strong> En promedio, necesitas jugar {expectedTime.toFixed(1)} turnos para garantizar un crítico.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pixel-box p-4 overflow-x-auto">
        <h2 className="font-pixel text-sm mb-4">Grafo de Estados</h2>
        <div className="flex justify-center bg-white rounded border-2 border-[var(--color-pdx-border-alt)] p-4 min-w-[300px]">
          <svg width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-pdx-text)" />
              </marker>
            </defs>
            
            {/* Nodo 0 */}
            <circle cx="100" cy="100" r="30" fill="var(--color-pdx-box)" stroke="var(--color-pdx-border-alt)" strokeWidth="3" />
            <text x="100" y="105" textAnchor="middle" className="font-pixel text-xs" fill="var(--color-pdx-text)">0</text>
            
            {/* Nodo 1 */}
            <circle cx="300" cy="100" r="30" fill="var(--color-pdx-border)" stroke="var(--color-pdx-border-alt)" strokeWidth="3" />
            <text x="300" y="105" textAnchor="middle" className="font-pixel text-xs" fill="white">1</text>
            
            {/* 0 -> 1 */}
            <path d="M 130 100 L 260 100" fill="none" stroke="var(--color-pdx-text)" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="200" y="90" textAnchor="middle" className="font-pixel text-[10px]" fill="var(--color-pdx-text)">{p.toFixed(3)}</text>

            {/* 0 -> 0 */}
            <path d="M 85 76 C 60 10, 140 10, 110 70" fill="none" stroke="var(--color-pdx-text)" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="100" y="25" textAnchor="middle" className="font-pixel text-[10px]" fill="var(--color-pdx-text)">{q.toFixed(3)}</text>

            {/* 1 -> 1 */}
            <path d="M 285 76 C 260 10, 340 10, 310 70" fill="none" stroke="var(--color-pdx-text)" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="300" y="25" textAnchor="middle" className="font-pixel text-[10px]" fill="var(--color-pdx-text)">1.0</text>
          </svg>
        </div>
      </div>

      <div className="pixel-box p-4">
        <h2 className="font-pixel text-sm mb-4">Demostración Matemática</h2>
        <p className="font-sans text-xs text-gray-600 mb-4">
          ¿De dónde salen estos números? Matemáticamente, podemos simplificar el sistema usando la probabilidad de NUNCA dar el crítico $(1-p^*)^n$ y restándosela al total (1).
        </p>
        <div className="text-sm overflow-x-auto">
          <BlockMath math={`P(T \\le n) = 1 - P(T > n) = 1 - (1-p^*)^n`} />
          <BlockMath math={`f_{01}(n) = P(\\text{Primer crítico en } n) = (1-p^*)^{n-1}p^*`} />
        </div>
      </div>

      <AbsorbentMC 
        P={P} 
        targetN={n} 
        theoreticalProb={probLeqN} 
        theoreticalE={expectedTime} 
      />
    </div>
  );
}
