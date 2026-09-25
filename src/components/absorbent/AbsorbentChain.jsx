import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { matrixPower } from '../../utils/math';

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
      <div className="pixel-box p-4">
        <h2 className="font-pixel text-sm mb-4">Matriz de Transición P</h2>
        <BlockMath math={`P = \\begin{bmatrix} ${q.toFixed(4)} & ${p.toFixed(4)} \\\\ 0 & 1 \\end{bmatrix}`} />
      </div>

      <div className="pixel-box p-4">
        <label className="font-pixel text-xs mb-2 block">Selecciona Turno (n):</label>
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={n} 
            onChange={(e) => setN(parseInt(e.target.value))}
            className="flex-1 accent-[var(--color-gba-dark)]"
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
          <BlockMath math={`P^{${n}} = \\begin{bmatrix} ${Pn[0][0].toFixed(4)} & ${Pn[0][1].toFixed(4)} \\\\ ${Pn[1][0].toFixed(4)} & ${Pn[1][1].toFixed(4)} \\end{bmatrix}`} />
        </div>

        <div className="pixel-box p-4 text-sm flex flex-col justify-center">
          <p className="mb-2"><InlineMath math={`P(T \\le ${n}) = ${probLeqN.toFixed(4)}`} /> ({(probLeqN * 100).toFixed(2)}%)</p>
          <p className="mb-2"><InlineMath math={`f_{01}(${n}) = ${probEqN.toFixed(4)}`} /> ({(probEqN * 100).toFixed(2)}%)</p>
          <p><InlineMath math={`\\mathbb{E}[T_{01}] = ${expectedTime.toFixed(2)} \\text{ turnos}`} /></p>
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
            <path d="M 85 75 A 25 25 0 1 1 70 85" fill="none" stroke="var(--color-pdx-text)" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="50" y="45" textAnchor="middle" className="font-pixel text-[10px]" fill="var(--color-pdx-text)">{q.toFixed(3)}</text>

            {/* 1 -> 1 */}
            <path d="M 315 75 A 25 25 0 1 1 330 85" fill="none" stroke="var(--color-pdx-text)" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <text x="350" y="45" textAnchor="middle" className="font-pixel text-[10px]" fill="var(--color-pdx-text)">1.0</text>
          </svg>
        </div>
      </div>

      <div className="pixel-box p-4">
        <h2 className="font-pixel text-sm mb-4">Demostración</h2>
        <div className="text-sm">
          <BlockMath math={`P(T \\le n) = 1 - P(T > n) = 1 - (1-p^*)^n`} />
          <BlockMath math={`f_{01}(n) = P(\\text{Primer crítico en } n) = (1-p^*)^{n-1}p^*`} />
        </div>
      </div>
    </div>
  );
}
