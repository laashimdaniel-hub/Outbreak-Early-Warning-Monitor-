export const analyzeTrend = (history, threshold = 2.5) => {
  if (!history || history.length < 2) return { isAnomaly: false, zScore: 0 };

  const values = history.map(h => h.value);
  const latestValue = values[values.length - 1];
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  const zScore = stdDev === 0 ? 0 : (latestValue - mean) / stdDev;

  return {
    isAnomaly: zScore > threshold,
    zScore: parseFloat(zScore.toFixed(2)),
    mean: parseFloat(mean.toFixed(2)),
    latestValue
  };
};