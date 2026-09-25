import * as math from 'mathjs';

// Calculate P^n
export function matrixPower(matrix, n) {
  if (n === 0) {
    return matrix.map((row, i) => row.map((_, j) => (i === j ? 1 : 0)));
  }
  return math.pow(matrix, n);
}

// Solve stationary distribution for a 3x3 matrix P
// pi * P = pi  -> pi * (P - I) = 0, and sum(pi) = 1
export function solveStationaryDistribution(P) {
  try {
    const P_minus_I = [
      [P[0][0] - 1, P[0][1], P[0][2]],
      [P[1][0], P[1][1] - 1, P[1][2]],
      [P[2][0], P[2][1], P[2][2] - 1]
    ];
    
    // Transpose to solve (P - I)^T * pi^T = 0
    let M = math.transpose(P_minus_I);
    
    // Replace the last equation with sum(pi) = 1 to make it solvable
    M[2] = [1, 1, 1];
    
    const B = [0, 0, 1];
    
    // Solve M * pi^T = B
    const pi = math.lusolve(M, B);
    return pi.map(val => Number(val[0]));
  } catch (e) {
    // Fallback if singular or another issue (e.g., disconnected graph)
    return [0, 0, 0];
  }
}
