export async function fetchMoveData(moveName) {
  try {
    const formattedName = moveName.toLowerCase().replace(/\s+/g, '-');
    // Map Spanish quick links to English for API
    const esToEn = {
      "onda-ígnea": "heat-wave",
      "onda-ignea": "heat-wave",
      "roca-afilada": "stone-edge",
      "hoja-aguda": "leaf-blade",
      "lanzallamas": "flamethrower",
      "tajo-umbrío": "night-slash",
      "tajo-umbrio": "night-slash"
    };

    const searchName = esToEn[formattedName] || formattedName;

    const response = await fetch(`https://pokeapi.co/api/v2/move/${searchName}`);
    if (!response.ok) {
      throw new Error("Movimiento no encontrado");
    }
    const data = await response.json();
    
    const accuracy = data.accuracy === null ? 1.0 : data.accuracy / 100;
    const critStage = data.meta ? data.meta.crit_rate : 0;
    let p_crit = 1/24;
    if (critStage === 1) p_crit = 1/8;
    else if (critStage === 2) p_crit = 1/2;
    else if (critStage >= 3) p_crit = 1.0;

    return {
      name: data.names.find(n => n.language.name === 'es')?.name || data.name,
      accuracy,
      critStage,
      p_crit,
      p_star: accuracy * p_crit,
      p_miss: 1 - accuracy,
      p_norm: accuracy * (1 - p_crit),
    };
  } catch (error) {
    throw error;
  }
}
