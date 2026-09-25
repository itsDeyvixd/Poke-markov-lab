/**
 * Función de actualización empírica (Häggström, Cap. 3 y 7)
 * φ(i, x) = j si x ∈ [∑_{l=1}^{j-1} P_{i,l}, ∑_{l=1}^{j} P_{i,l})
 * @param {number[]} row - La fila de la matriz de transición correspondiente al estado i
 * @param {number} x - Variable Uniforme(0,1)
 * @returns {number} - El nuevo estado j
 */
function phi(row, x) {
  let cumulative = 0;
  for (let j = 0; j < row.length; j++) {
    cumulative += row[j];
    if (x < cumulative) return j;
  }
  return row.length - 1; // Fallback por precisión
}

/**
 * Ejecuta K simulaciones independientes para la Cadena Absorbente (0->1).
 * @param {number} K - Número de réplicas
 * @param {number[][]} P - Matriz de transición 2x2
 * @param {number} targetN - Turno N para evaluar P(T <= n)
 * @returns {Object} - Métricas empíricas
 */
export function runAbsorbentMC(K, P, targetN) {
  let countLeqN = 0;
  let sumT = 0;

  for (let k = 0; k < K; k++) {
    let state = 0;
    let t = 0;
    
    // Safety limit to prevent infinite loops
    const limit = Math.max(10000, 10 * targetN);
    
    while (state === 0 && t < limit) {
      t++;
      const u = Math.random();
      state = phi(P[0], u);
    }
    
    if (t <= targetN && state === 1) {
      countLeqN++;
    }
    sumT += t;
  }

  return {
    probLeqN_emp: countLeqN / K,
    expectedT_emp: sumT / K
  };
}

/**
 * Genera una trayectoria única MCMC para la Cadena Recurrente (3x3).
 * @param {number} N_steps - Longitud de la trayectoria
 * @param {number[][]} P - Matriz de transición 3x3
 * @param {number} X0 - Estado inicial (0=F, 1=N, 2=C)
 * @returns {Object} - Frecuencias empíricas observadas
 */
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
