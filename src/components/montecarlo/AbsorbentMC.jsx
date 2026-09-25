import React, { useState } from 'react';
import { runAbsorbentMC } from '../../utils/monteCarlo';
import { InlineMath } from 'react-katex';

export default function AbsorbentMC({ P, targetN, thC, thF, thE }) {
  const [K, setK] = useState(1000);
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const presets = [1000, 5000, 10000, 50000];

  const handleRun = () => {
    setIsRunning(true);
    setResults(null);
    setProgress(0);
    
    setTimeout(() => setProgress(50), 50);
    setTimeout(() => {
      const start = performance.now();
      const res = runAbsorbentMC(K, P, targetN);
      setResults({
        ...res,
        timeMs: performance.now() - start
      });
      setProgress(100);
      setIsRunning(false);
    }, 100);
  };

  return (
    <div className="pixel-box p-4 mt-8 border-dashed">
      <h3 className="font-pixel text-sm mb-2 text-[var(--color-pdx-border)]">
        ▶ Verificación Empírica (Monte Carlo)
      </h3>
      <p className="font-sans text-xs text-gray-700 mb-6 leading-relaxed bg-[#fff0f0] p-3 rounded border border-[#ffcccc]">
        <strong>¿Qué estamos haciendo aquí?</strong> Todo lo que vimos arriba es matemática pura y exacta. Pero, ¿qué pasa en la práctica? El método <strong>Monte Carlo</strong> pone a tu computadora a jugar miles de batallas Pokémon simuladas (réplicas). <br/>Al contar en cuántas terminaste asestando el crítico y en cuántas fallando miserablemente, los números empíricos deberían coincidir con nuestras fórmulas exactas.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-end">
        <div>
          <label className="font-pixel text-[10px] block mb-2">Réplicas (K):</label>
          <div className="flex gap-2">
            {presets.map(val => (
              <button 
                key={val}
                onClick={() => setK(val)}
                className={`pixel-button !py-1 !px-2 ${K === val ? 'pixel-button-active' : ''}`}
              >
                {val.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <input 
            type="number" 
            value={K}
            onChange={(e) => setK(Math.max(1, parseInt(e.target.value) || 1))}
            className="pixel-input w-24"
          />
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className="pixel-button bg-[var(--color-pdx-border-alt)] text-white hover:bg-[#2a3699] whitespace-nowrap"
          >
            {isRunning ? 'Ejecutando...' : 'Simular'}
          </button>
        </div>
      </div>

      {isRunning && (
        <div className="w-full bg-gray-200 h-4 rounded overflow-hidden border-2 border-gray-400 mb-4">
          <div 
            className="bg-green-500 h-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {results && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left font-pixel text-[10px] sm:text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-2 px-2">Métrica</th>
                <th className="py-2 px-2">Teórico Exacto</th>
                <th className="py-2 px-2">Empírico (K={K})</th>
                <th className="py-2 px-2">Error Absoluto</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-2">Termina en Crítico <InlineMath math={`h_{01}`} /></td>
                <td className="py-2 px-2">{thC.toFixed(4)}</td>
                <td className="py-2 px-2 text-[var(--color-pdx-border-alt)]">{results.probC_emp.toFixed(4)}</td>
                <td className="py-2 px-2 text-green-600">
                  {Math.abs(thC - results.probC_emp).toFixed(4)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-2">Termina en Fallo <InlineMath math={`h_{02}`} /></td>
                <td className="py-2 px-2">{thF.toFixed(4)}</td>
                <td className="py-2 px-2 text-[var(--color-pdx-border-alt)]">{results.probF_emp.toFixed(4)}</td>
                <td className="py-2 px-2 text-green-600">
                  {Math.abs(thF - results.probF_emp).toFixed(4)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">Tiempo medio <InlineMath math={`\\mathbb{E}[T]`} /></td>
                <td className="py-2 px-2">{thE === Infinity ? '\\infty' : thE.toFixed(4)}</td>
                <td className="py-2 px-2 text-[var(--color-pdx-border-alt)]">{results.expectedT_emp.toFixed(4)}</td>
                <td className="py-2 px-2 text-green-600">
                  {thE === Infinity ? '-' : Math.abs(thE - results.expectedT_emp).toFixed(4)}
                </td>
              </tr>
            </tbody>
          </table>
          <p className="font-pixel text-[8px] sm:text-[9px] mt-4 text-gray-500 italic">
            Ejecución completada en {results.timeMs.toFixed(1)} ms. Convergencia garantizada por la Ley Débil de los Grandes Números.
          </p>
        </div>
      )}
    </div>
  );
}
