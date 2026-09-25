import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AbsorbentChain from './components/absorbent/AbsorbentChain';
import RecurrentChain from './components/recurrent/RecurrentChain';
import { fetchMoveData } from './services/pokeapi';
import { InlineMath } from 'react-katex';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('absorbent');
  const [search, setSearch] = useState('hoja-aguda');
  const [moveData, setMoveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const quickLinks = ["Onda Ígnea", "Roca Afilada", "Hoja Aguda", "Lanzallamas", "Tajo Umbrío"];

  const handleSearch = async (moveName) => {
    if (!moveName) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMoveData(moveName);
      setMoveData(data);
      setSearch(moveName);
    } catch (err) {
      setError("Movimiento no encontrado en la PokéAPI.");
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearch(search);
  }, []);

  return (
    <>
      <div className="pixel-box p-4 md:p-6 w-full mb-8 flex flex-col gap-4">
        <h2 className="font-pixel text-sm">Buscador de Movimiento</h2>
        
        <div className="flex flex-wrap gap-2">
          {quickLinks.map(link => (
            <button 
              key={link}
              onClick={() => handleSearch(link)}
              className="pixel-button text-[10px]"
            >
              {link}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)}
            className="pixel-input flex-1"
            placeholder="Ej. Thunderbolt..."
            aria-label="Buscar movimiento Pokémon"
          />
          <button onClick={() => handleSearch(search)} className="pixel-button bg-[var(--color-pdx-border)] text-white hover:bg-[#c92a08]">
            Buscar
          </button>
        </div>

        {error && <p className="text-[var(--color-pdx-border)] font-pixel text-xs mt-2" role="alert">{error}</p>}
        {loading && <p className="font-pixel text-xs mt-2" aria-live="polite">Cargando...</p>}
        
        {moveData && !loading && (
          <div className="mt-4 p-4 border-2 border-dashed border-[var(--color-pdx-border-alt)] bg-[var(--color-pdx-border-alt)]/10 rounded">
            <h3 className="font-pixel text-sm mb-3">Movimiento: {moveData.name.toUpperCase()}</h3>
            <ul className="font-pixel text-xs leading-loose space-y-2">
              <li>Precisión (Acc): {(moveData.accuracy * 100).toFixed(0)}%</li>
              <li>Tasa de Crítico: Etapa {moveData.critStage} <InlineMath math={`(p_{crit} = ${(moveData.p_crit).toFixed(3)})`} /></li>
              <li>Probabilidad Efectiva Crítico <InlineMath math={`p^*`} />: {(moveData.p_star * 100).toFixed(2)}%</li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row w-full mb-6 gap-2">
        <button 
          onClick={() => setActiveTab('absorbent')}
          className={`pixel-button flex-1 ${activeTab === 'absorbent' ? 'pixel-button-active' : ''}`}
        >
          Cadena Absorbente
        </button>
        <button 
          onClick={() => setActiveTab('recurrent')}
          className={`pixel-button flex-1 ${activeTab === 'recurrent' ? 'pixel-button-active' : ''}`}
        >
          Cadena Recurrente
        </button>
      </div>

      <main className="w-full mb-8">
        {moveData && activeTab === 'absorbent' && (
          <AbsorbentChain p_star={moveData.p_star} />
        )}
        {moveData && activeTab === 'recurrent' && (
          <RecurrentChain 
            p_miss={moveData.p_miss} 
            p_norm={moveData.p_norm} 
            p_crit={moveData.p_star} 
          />
        )}
      </main>
    </>
  );
}

function NotFound() {
  return (
    <div className="pixel-box p-8 text-center flex flex-col items-center gap-6 my-12">
      <h2 className="font-pixel text-xl text-[var(--color-pdx-border)]">¡Un error 404 salvaje ha aparecido!</h2>
      <p className="font-pixel text-xs leading-loose">
        La ruta que buscas escapó o no existe en la hierba alta.
      </p>
      <Link to="/" className="pixel-button inline-block mt-4">
        Huir (Volver al inicio)
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center py-6 px-3 sm:px-6 max-w-4xl mx-auto">
        <header className="pixel-box p-6 w-full mb-8 text-center">
          <h1 className="font-pixel text-lg md:text-xl mb-6 leading-relaxed text-[var(--color-pdx-border)]">
            Pokémon Markov Lab:<br/><span className="text-[var(--color-pdx-text)] text-sm md:text-lg">Análisis Estocástico Exacto</span>
          </h1>
          <p className="font-pixel text-[9px] md:text-[10px] leading-loose text-gray-700">
            Autor: Deyvi Ardila Forero<br/>
            Universidad Nacional de Colombia<br/>
            Asignatura: Cadenas de Markov y Aplicaciones
          </p>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="pixel-box p-4 w-full text-center mt-auto">
          <p className="font-pixel text-[8px] sm:text-[9px] leading-loose text-gray-700">
            Desarrollado para el análisis estocástico exacto sin simulación Monte Carlo.<br/>
            Deyvi Ardila Forero - 2026.
          </p>
        </footer>
      </div>
    </Router>
  );
}
