// import { useState, useEffect, useMemo } from 'react';
// import { analyzeTrend } from '../utils/stats';

// export const useOutbreakData = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Replace with your actual GET endpoint for reports
//     fetch('http://localhost:5000/api/reports/all') 
//       .then(res => res.json())
//       .then(json => {
//         setData(json);
//         setLoading(false);
//       })
//       .catch(() => {
//         // Fallback to internal data if API is down for testing
//         setData([
//           { regionId: "R1", name: "Zone Alpha", history: [{value:10}, {value:12}, {value:45}] }
//         ]);
//         setLoading(false);
//       });
//   }, []);

//   const analyzed = useMemo(() => {
//     return data.map(region => ({
//       ...region,
//       analysis: analyzeTrend(region.history)
//     }));
//   }, [data]);

//   const alerts = analyzed.filter(r => r.analysis.isAnomaly);

//   return { allRegions: analyzed, alerts, loading };
// };

import { useState, useEffect, useMemo } from 'react';
import { analyzeTrend } from '../utils/stats';

export const useOutbreakData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('oewm_token');

    fetch('http://localhost:5000/api/reports/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const alerts = useMemo(() => {
    return data
      .map(region => ({ ...region, analysis: analyzeTrend(region.history) }))
      .filter(r => r.analysis.isAnomaly);
  }, [data]);

  return { alerts, loading, totalRegions: data.length };
};