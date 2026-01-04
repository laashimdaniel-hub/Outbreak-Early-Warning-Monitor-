import { useState, useEffect, useCallback } from 'react';

export const useOEWMData = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [mapLocations, setMapLocations] = useState([]);
  // FIX: Renamed from 'history' to 'alertHistory' to avoid browser naming conflicts
  const [alertHistory, setAlertHistory] = useState([]); 
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('oewm_token');
    
    // Safety check: if no token, don't attempt fetch
    if (!token) {
      setLoading(false);
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      setLoading(true);
      
      // Fetching all endpoints in parallel for better performance
      const [alertsRes, mapRes, historyRes] = await Promise.all([
        fetch('https://outbreak-early-warning-monitor.onrender.com/api/alerts/active', { headers }),
        fetch('https://outbreak-early-warning-monitor.onrender.com/api/map/locations', { headers }),
        fetch('https://outbreak-early-warning-monitor.onrender.com/api/alerts/history', { headers })
      ]);

      // Check if responses are okay before parsing
      if (!alertsRes.ok || !mapRes.ok || !historyRes.ok) {
        throw new Error('Failed to fetch data from one or more endpoints');
      }

      const alertsData = await alertsRes.json();
      const mapData = await mapRes.json();
      const historyData = await historyRes.json();

      setActiveAlerts(Array.isArray(alertsData) ? alertsData : []);
      setMapLocations(Array.isArray(mapData) ? mapData : []);
      setAlertHistory(Array.isArray(historyData) ? historyData : []);
      
    } catch (err) {
      console.error("OEWM Data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return renamed 'alertHistory'
  return { activeAlerts, mapLocations, alertHistory, loading, refresh: fetchData };
};