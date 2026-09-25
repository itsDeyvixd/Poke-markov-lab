import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { matrixPower } from '../../utils/math';
import AbsorbentMC from '../montecarlo/AbsorbentMC';

export default function AbsorbentChain({ p_miss, p_norm, p_crit }) {
  const [n, setN] = useState(1);
  
  // 3-State Model: 0 = Normal, 1 = Crítico, 2 = Fallo
  const P = [
    [p_norm, p_crit, p_miss],
    [0, 1, 0],
    [0, 0, 1]
  ];

  const Pn = matrixPower(P, n);

  // Absorption probabilities
  const sumAbsorbents = p_crit + p_miss;
  const probAbsorbC = sumAbsorbents > 0 ? p_crit / sumAbsorbents : 0;
  const probAbsorbF = sumAbsorbents > 0 ? p_miss / sumAbsorbents : 0;
  const expectedTime = sumAbsorbents > 0 ? 1 / sumAbsorbents : Infinity;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#e6f7ff] border-l-4 border-[var(--color-pdx-border-alt)] p-4 rounded mb-2">
        <h3 className="font-pixel text-[10px] text-[var(--color-pdx-border-alt)] mb-2">Modelo Absorbente: Condición de Parada</h3>
        <p className="font-sans text-sm text-gray-700 leading-relaxed">
          En este modelo de 3 estados, el combate avanza mientras pegues golpes normales. La batalla termina abruptamente (condición de parada) si ocurre una de dos cosas: logras un <strong>Golpe Crítico (Estado 1)</strong> o cometes un <strong>Fallo (Estado 2)</strong>. Ambos son estados <em>absorbentes</em>.
        </p>
      </div>

      <div className="pixel-box p-4">
        <h2 className="font-pixel text-sm mb-4">Matriz de Transición P</h2>
        <p className="font-sans text-xs text-gray-600 mb-4">
          En la fila superior ves las probabilidades de continuar normal, acertar crítico o fallar. Las filas inferiores tienen un "1" en la diagonal, lo que significa que de ahí no se sale.
        </p>
        <div className="overflow-x-auto">
          <BlockMath math={`P = \\begin{bmatrix} ${P[0][0].toFixed(4)} & ${P[0][1].toFixed(4)} & ${P[0][2].toFixed(4)} \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}`} />
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
            Al elevar la matriz a la potencia <InlineMath math={`n`} />, proyectamos exactamente la probabilidad acumulada de haber terminado el combate en Crítico, en Fallo, o seguir atrapado en ataques Normales.
          </p>
          <div className="overflow-x-auto">
            <BlockMath math={`P^{${n}} = \\begin{bmatrix} ${Pn[0][0].toFixed(4)} & ${Pn[0][1].toFixed(4)} & ${Pn[0][2].toFixed(4)} \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}`} />
          </div>
        </div>

        <div className="pixel-box p-4 text-sm flex flex-col justify-center">
          <h2 className="font-pixel text-sm mb-4">Métricas Límite Exactas</h2>
          <div className="space-y-4">
            <div>
              <p className="mb-1 font-pixel text-[10px]"><InlineMath math={`h_{01} = ${probAbsorbC.toFixed(4)}`} /> ({(probAbsorbC * 100).toFixed(2)}%)</p>
              <p className="font-sans text-xs text-gray-600">Probabilidad eventual de terminar la batalla conectando un <strong>Crítico</strong>.</p>
            </div>
            <div>
              <p className="mb-1 font-pixel text-[10px]"><InlineMath math={`h_{02} = ${probAbsorbF.toFixed(4)}`} /> ({(probAbsorbF * 100).toFixed(2)}%)</p>
              <p className="font-sans text-xs text-gray-600">Probabilidad eventual de terminar la batalla por un <strong>Fallo</strong>.</p>
            </div>
            <div>
              <p className="mb-1 font-pixel text-[10px]"><InlineMath math={`\\mathbb{E}[T] = ${expectedTime === Infinity ? '\\infty' : expectedTime.toFixed(2)} \\text{ turnos}`} /></p>
              <p className="font-sans text-xs text-gray-600"><strong>Tiempo de parada:</strong> Turnos promedio hasta que la cadena se absorba.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pixel-box p-4 overflow-x-auto">
        <h2 className="font-pixel text-sm mb-4">Grafo de Estados</h2>
        <div className="flex justify-center bg-white rounded border-2 border-[var(--color-pdx-border-alt)] p-4 min-w-[400px]">
          <svg width="100%" height="250" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-pdx-text)" />
              </marker>
            </defs>
            
            {/* Nodo 0: Normal */}
            <circle cx="200" cy="50" r="30" fill="var(--color-pdx-box)" stroke="var(--color-pdx-border-alt)" strokeWidth="3" />
            <text x="200" y="55" textAnchor="middle" className="font-pixel text-xs" fill="var(--color-pdx-text)">0(N)</text>
            
            {/* Nodo 1: Critico */}
            <circle cx="320" cy="180" r="30" fill="var(--color-pdx-border)" stroke="var(--color-pdx-border-alt)" strokeWidth="3" />
            <text x="320" y="185" textAnchor="middle" className="font-pixel text-xs" fill="white">1(C)</text>

            {/* Nodo 2: Fallo */}
            <circle cx="80" cy="180" r="30" fill="#dc2626" stroke="var(--color-pdx-border-alt)" strokeWidth="3" />
            <text x="80" y="185" textAnchor="middle" className="font-pixel text-xs" fill="white">2(F)</text>
            
            {/* 0 -> 1 (Crítico) */}
            <path d="M 220 70 L 300 155" fill="none" stroke="var(--color-pdx-text)" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="270" y="100" textAnchor="middle" className="font-pixel text-[10px]" fill="var(--color-pdx-text)">{P[0][1].toFixed(3)}</text>

            {/* 0 -> 2 (Fallo) */}
            <path d="M 180 70 L 100 155" fill="none" stroke="var(--color-pdx-text)" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="130" y="100" textAnchor="middle" className="font-pixel text-[10px]" fill="var(--color-pdx-text)">{P[0][2].toFixed(3)}</text>

            {/* 0 -> 0 (Normal Loop) */}
            <path d="M 185 26 C 160 -40, 240 -40, 215 26" fill="none" stroke="var(--color-pdx-text)" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="200" y="-15" textAnchor="middle" className="font-pixel text-[10px]" fill="var(--color-pdx-text)">{P[0][0].toFixed(3)}</text>

            {/* 1 -> 1 (Crit Loop) */}
            <path d="M 345 195 C 410 220, 390 280, 335 205" fill="none" stroke="var(--color-pdx-text)" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="390" y="240" textAnchor="middle" className="font-pixel text-[10px]" fill="var(--color-pdx-text)">1.0</text>

            {/* 2 -> 2 (Fallo Loop) */}
            <path d="M 55 195 C -10 220, 10 280, 65 205" fill="none" stroke="var(--color-pdx-text)" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="10" y="240" textAnchor="middle" className="font-pixel text-[10px]" fill="var(--color-pdx-text)">1.0</text>
          </svg>
        </div>
      </div>

      <AbsorbentMC 
        P={P} 
        targetN={n} 
        thC={probAbsorbC}
        thF={probAbsorbF}
        thE={expectedTime} 
      />
    </div>
  );
}
