import React, { useState } from 'react';
import { runRecurrentMCMC } from '../../utils/monteCarlo';
import { InlineMath, BlockMath } from 'react-katex';

export default function RecurrentMC({ P, piTheoretical }) {
  const [N, setN] = useState(10000);
  const [X0, setX0] = useState(0); // 0=F, 1=N, 2=C
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const stepsPresets = [2000, 10000, 50000, 100000];
  const states = ['F', 'N', 'C'];
  const stateLabels = ['Fallo (F)', 'Normal (N)', 'Crítico (C)'];

  const handleRun = () => {
    setIsRunning(true);
    setResults(null);
    setProgress(0);

    setTimeout(() => setProgress(50), 50);
    setTimeout(() => {
      const start = performance.now();
      const res = runRecurrentMCMC(N, P, X0);
      
      const f = [res.f_F, res.f_N, res.f_C];
      const dTV = 0.5 * f.reduce((sum, fi, i) => sum + Math.abs(fi - piTheoretical[i]), 0);

      setResults({
        ...res,
        f,
        dTV,
        timeMs: performance.now() - start
      });
      setProgress(100);
      setIsRunning(false);
    }, 100);
  };

  return (
    <div className="pixel-box p-4 mt-8 border-dashed">
      <h3 className="font-pixel text-sm mb-4 text-[var(--color-pdx-border)]">
        ▶ Simulación MCMC de Trayectoria
      </h3>
      
      <div className="flex flex-col md:flex-row gap-6 mb-4">
        <div>
          <label className="font-pixel text-[10px] block mb-2">Pasos (N):</label>
          <div className="flex gap-2 mb-2">
            {stepsPresets.map(val => (
              <button 
                key={val}
                onClick={() => setN(val)}
                className={`pixel-button !py-1 !px-2 ${N === val ? 'pixel-button-active' : ''}`}
              >
                {val.toLocaleString()}
              </button>
            ))}
          </div>
          <input 
            type="number" 
            value={N}
            onChange={(e) => setN(Math.max(1, parseInt(e.target.value) || 1))}
            className="pixel-input w-32"
          />
        </div>

        <div>
          <label className="font-pixel text-[10px] block mb-2">Estado Inicial X_0:</label>
          <div className="flex gap-2">
            {states.map((st, idx) => (
              <button 
                key={st}
                onClick={() => setX0(idx)}
                className={`pixel-button !py-1 !px-3 ${X0 === idx ? 'pixel-button-active' : ''}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={handleRun}
        disabled={isRunning}
        className="pixel-button bg-[var(--color-pdx-border-alt)] text-white hover:bg-[#2a3699] whitespace-nowrap mb-4"
      >
        {isRunning ? 'Simulando...' : 'Simular Trayectoria MCMC'}
      </button>

      {isRunning && (
        <div className="w-full bg-gray-200 h-4 rounded overflow-hidden border-2 border-gray-400 mb-4">
          <div 
            className="bg-green-500 h-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {results && (
        <div className="mt-4">
          <h4 className="font-pixel text-[10px] mb-4">Comparación de Frecuencias vs Distribución Límite (π)</h4>
          
          <div className="flex flex-col gap-4 mb-6">
            {states.map((st, i) => (
              <div key={st} className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="font-pixel text-[10px] w-24">{stateLabels[i]}</div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 bg-green-500 rounded" style={{ width: `${Math.max(1, piTheoretical[i] * 100)}%` }}></div>
                    <span className="font-pixel text-[8px] whitespace-nowrap">π = {piTheoretical[i].toFixed(4)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 bg-yellow-400 rounded" style={{ width: `${Math.max(1, results.f[i] * 100)}%` }}></div>
                    <span className="font-pixel text-[8px] whitespace-nowrap text-gray-700">f = {results.f[i].toFixed(4)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 p-3 rounded border border-gray-300">
            <h4 className="font-pixel text-[10px] mb-2">Distancia de Variación Total (TVD)</h4>
            <div className="overflow-x-auto">
              <BlockMath math={`d_{TV}(f, \\pi) = \\frac{1}{2} \\sum_{i} |f_i - \\pi_i| = ${results.dTV.toFixed(5)}`} />
            </div>
          </div>
          
          <p className="font-pixel text-[8px] sm:text-[9px] mt-4 text-gray-500 italic">
            Ejecución completada en {results.timeMs.toFixed(1)} ms. Por el Teorema Ergódico, d_TV → 0 cuando N → ∞.
          </p>
        </div>
      )}
    </div>
  );
}
