/**
 * Función de actualización empírica (Häggström, Cap. 3 y 7)
 * φ(i, x) = j si x ∈ [∑_{l=1}^{j-1} P_{i,l}, ∑_{l=1}^{j} P_{i,l})
 */
function phi(row, x) {
  let cumulative = 0;
  for (let j = 0; j < row.length; j++) {
    cumulative += row[j];
    if (x < cumulative) return j;
  }
  return row.length - 1; 
}

/**
 * Ejecuta K simulaciones independientes para la Cadena Absorbente de 3 estados.
 * Estados: 0 = Normal (Transitorio), 1 = Crítico (Absorbente), 2 = Fallo (Absorbente)
 */
export function runAbsorbentMC(K, P, targetN) {
  let countC = 0;
  let countF = 0;
  let sumT = 0;

  for (let k = 0; k < K; k++) {
    let state = 0; // Starts at Normal
    let t = 0;
    
    const limit = Math.max(10000, 10 * targetN);
    
    while (state === 0 && t < limit) {
      t++;
      const u = Math.random();
      state = phi(P[0], u);
    }
    
    if (state === 1) countC++;
    if (state === 2) countF++;
    sumT += t;
  }

  return {
    probC_emp: countC / K,
    probF_emp: countF / K,
    expectedT_emp: sumT / K
  };
}

export function runRecurrentMCMC(N_steps, P, X0) {
  let counts = [0, 0, 0];
  let state = X0;

  for (let t = 0; t < N_steps; t++) {
    const u = Math.random();
    state = phi(P[state], u);
    counts[state]++;
  }

  return {
    f_F: counts[0] / N_steps,
    f_N: counts[1] / N_steps,
    f_C: counts[2] / N_steps,
    counts
  };
}
