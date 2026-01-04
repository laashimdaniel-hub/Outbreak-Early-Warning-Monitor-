import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl'; 
import { Map, Marker, Popup, NavigationControl } from 'react-map-gl';
import { 
  Activity, LayoutDashboard, LogOut, RefreshCw, 
  Play, Search, Database, TrendingUp, X, UploadCloud, Download
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Line 
} from 'recharts';
import { useOEWMData } from '../hooks/useOEWMData';

import 'mapbox-gl/dist/mapbox-gl.css';

// Using your provided Mapbox Token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibmljaG9sYXNtd2FuemEiLCJhIjoiY21qaHM1ZzN3MGF5ZjNkc2NtdnA1MWVnMyJ9.0TpKhOB1Nofj04IB_p6I0g'; 

const Dashboard = ({ onLogout }) => {
  const { activeAlerts, mapLocations, alertHistory, loading, refresh } = useOEWMData();
  
  const [processing, setProcessing] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("Daniel"); 
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedName = localStorage.getItem('user_name');
    if (storedName) setUserName(storedName);
  }, []);

  /**
   * Helper: Download Sample CSV for testing
   */
  const downloadSample = () => {
    const csvContent = "Date,Region ID,Lat,Long,Cases,Symptom Type\n" +
      "2025-12-28,CM-YA-01,3.8480,11.5021,45,Fever\n" +
      "2025-12-29,CM-YA-01,3.8480,11.5021,52,Fever\n" +
      "2025-12-30,CM-YA-01,3.8480,11.5021,89,Fever";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'surveillance_sample.csv';
    a.click();
  };

  /**
   * API Action: General (Calculation / Detection)
   */
  const handleAction = async (endpoint) => {
    setProcessing(true);
    const token = localStorage.getItem('oewm_token');
    try {
      const res = await fetch(`https://outbreak-early-warning-monitor.onrender.com/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      alert(data.message);
      refresh();
    } catch (err) {
      alert("Operation failed.");
    } finally {
      setProcessing(false);
    }
  };

  /**
   * UPDATED: CSV File Ingestion 
   * Matches your tested Postman endpoint: /api/reports/upload
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProcessing(true);
    const token = localStorage.getItem('oewm_token');
    const formData = new FormData();
    
    // Key MUST be 'file' to match backend upload.single('file')
    formData.append('file', file);

    try {
      const res = await fetch('https://outbreak-early-warning-monitor.onrender.com/api/reports/upload', {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}` 
            // NOTE: No Content-Type header here; browser sets it for FormData
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        // Updated to use the specific keys from your backend response
        alert(`${data.message}\nRecords processed: ${data.records}`);
        setIsModalOpen(false);
        refresh(); // Refresh Map and Charts
      } else {
        alert(data.error || data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Server connection failed. Check console.");
    } finally {
      setProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden text-left">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-[#008ba3] p-1.5 rounded-lg text-white">
            <Activity size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800 uppercase">OEWM</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3">Surveillance</div>
          <button className="flex items-center gap-3 bg-[#008ba3] text-white w-full px-4 py-2.5 rounded-lg shadow-md">
            <LayoutDashboard size={18} /> <span className="text-sm font-medium">Dashboard</span>
          </button>

          <div className="pt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3">Engine Controls</div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-all">
            <Database size={18}/> Ingest Data
          </button>
          <button onClick={() => handleAction('baselines/calculate')} disabled={processing} className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-all disabled:opacity-50">
            <RefreshCw size={18} className={processing ? 'animate-spin' : ''}/> Calc Baselines
          </button>
          <button onClick={() => handleAction('anomalies/detect')} disabled={processing} className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-bold transition-all disabled:opacity-50">
            <Play size={18}/> Run Detection
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
            <LogOut size={18} /> <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search zones..." className="w-full bg-gray-50 border-none rounded-lg py-1.5 pl-10 text-xs focus:ring-1 focus:ring-[#008ba3]" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold leading-none">{userName}</p>
              <p className="text-[10px] text-[#008ba3] font-bold uppercase mt-1 tracking-widest">Public Health Admin</p>
            </div>
            <div className="h-9 w-9 bg-[#008ba3] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner">
                {userName.charAt(0)}
            </div>
          </div>
        </header>

        {/* DASHBOARD GRID */}
        <div className="flex-1 p-6 grid grid-cols-4 gap-6 overflow-hidden">
          
          <div className="col-span-3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            
            {/* 1. TREND GRAPH */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-80">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2"><TrendingUp size={18} className="text-[#008ba3]"/> Zone Outbreak Trends</h3>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeAlerts.length > 0 ? activeAlerts : alertHistory}>
                        <defs>
                            <linearGradient id="colorObs" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#008ba3" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#008ba3" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="zone_id" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="observed" stroke="#008ba3" fillOpacity={1} fill="url(#colorObs)" strokeWidth={3} />
                        <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeDasharray="5 5" dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* 2. MAPBOX COMPONENT */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-96 relative overflow-hidden">
                <Map
                    mapLib={mapboxgl}
                    initialViewState={{ longitude: 11.5021, latitude: 3.8480, zoom: 5 }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/mapbox/light-v11"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    fog={null}
                >
                    <NavigationControl position="top-right" />
                    {mapLocations.map((loc) => (
                        <Marker 
                            key={loc.id} 
                            longitude={Number(loc.longitude)} 
                            latitude={Number(loc.latitude)} 
                            anchor="bottom"
                            onClick={e => { e.originalEvent.stopPropagation(); setSelectedPin(loc); }}
                        >
                            <div className="cursor-pointer transition-transform hover:scale-125">
                                <svg viewBox="0 0 24 24" width="28" height="28" stroke="white" strokeWidth="2" 
                                     fill={loc.observed > loc.threshold ? "#ef4444" : "#008ba3"}>
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3" fill="white"></circle>
                                </svg>
                            </div>
                        </Marker>
                    ))}

                    {selectedPin && (
                        <Popup
                            longitude={Number(selectedPin.longitude)} latitude={Number(selectedPin.latitude)}
                            anchor="top" onClose={() => setSelectedPin(null)} closeOnClick={false}
                        >
                            <div className="p-1 text-[11px]">
                                <p className="font-bold text-[#008ba3]">{selectedPin.zone_id}</p>
                                <p className="text-gray-700">Observed: {selectedPin.observed}</p>
                            </div>
                        </Popup>
                    )}
                </Map>
            </div>
          </div>

          {/* 3. ALERTS FEED */}
          <div className="col-span-1 flex flex-col gap-4 overflow-hidden">
            <h3 className="font-bold text-gray-700 flex items-center justify-between px-1">
              Active Alerts <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{activeAlerts.length}</span>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {activeAlerts.length === 0 ? (
                 <div className="bg-white p-6 rounded-xl border border-dashed text-center text-gray-400 text-xs italic">No active outbreaks detected.</div>
              ) : (
                activeAlerts.map(alert => (
                  <div key={alert.id} className="bg-white p-4 rounded-xl border-l-4 border-red-600 shadow-sm border border-gray-100">
                    <span className="text-[10px] font-black text-gray-400">{alert.zone_id}</span>
                    <div className="text-2xl font-bold text-gray-900">{alert.observed}</div>
                    <div className="flex justify-between border-t mt-2 pt-2 text-[10px] font-bold">
                        <span className="text-gray-400">Mean: {alert.baseline_mean?.toFixed(1)}</span>
                        <span className="text-red-600 font-black text-right">Limit: {alert.threshold?.toFixed(1)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* CSV UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <UploadCloud className="text-[#008ba3]" size={28} /> Ingest Reports
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-50 p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Upload the daily regional surveillance CSV. The system will parse records and update the monitoring dashboard.
            </p>

            {/* Clickable Upload Area */}
            <div 
              onClick={() => !processing && fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all group
                ${processing ? 'bg-gray-50 border-gray-100' : 'border-gray-200 hover:border-[#008ba3] hover:bg-teal-50/40'}`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
              <div className={`p-5 rounded-full mb-4 shadow-sm transition-all
                ${processing ? 'bg-gray-100 text-gray-400 animate-pulse' : 'bg-gray-100 text-gray-400 group-hover:text-[#008ba3] group-hover:bg-white'}`}>
                <Database size={32} className={processing ? 'animate-spin' : ''} />
              </div>
              <p className="font-bold text-gray-700">{processing ? 'Processing CSV...' : 'Choose CSV File'}</p>
              <p className="text-[10px] text-gray-400 mt-2 font-medium tracking-wide">CLICK TO BROWSE COMPUTER</p>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button 
                onClick={downloadSample}
                className="flex items-center gap-2 text-xs font-bold text-[#008ba3] hover:underline"
              >
                <Download size={14}/> Download Template
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;