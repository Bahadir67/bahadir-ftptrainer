'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

type ChartData = {
  type: 'line' | 'bar' | 'area';
  title: string;
  data: any[];
  dataKeys: { key: string; color: string; name?: string }[];
  xAxisKey: string;
};

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  chart?: ChartData;
};

type DashboardData = {
  title: string;
  duration: string;
  tss: number;
  type: string;
  status: string;
};

type ConversationData = {
  messages: Message[];
  dashboard: DashboardData;
};

// Grafik Bileşeni (Ayrı tanımlandı, gereksiz render önlemek için)
const ChartComponent = ({ chart }: { chart: ChartData }) => {
  const CommonAxis = () => (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey={chart.xAxisKey} stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} />
      <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} />
      <Tooltip 
        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
        itemStyle={{ color: '#F3F4F6' }}
      />
      <Legend />
    </>
  );

  return (
    <div className="mt-4 bg-gray-900/50 p-4 rounded-xl border border-gray-700 h-80">
      <h4 className="text-sm font-semibold text-gray-300 mb-4 text-center">{chart.title}</h4>
      <ResponsiveContainer width="100%" height="90%">
        {chart.type === 'line' ? (
          <LineChart data={chart.data}>
            <CommonAxis />
            {chart.dataKeys.map((k) => (
              <Line key={k.key} type="monotone" dataKey={k.key} stroke={k.color} name={k.name || k.key} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        ) : chart.type === 'bar' ? (
          <BarChart data={chart.data}>
            <CommonAxis />
            {chart.dataKeys.map((k) => (
              <Bar key={k.key} dataKey={k.key} fill={k.color} name={k.name || k.key} />
            ))}
          </BarChart>
        ) : (
          <AreaChart data={chart.data}>
            <CommonAxis />
            {chart.dataKeys.map((k) => (
              <Area key={k.key} type="monotone" dataKey={k.key} stroke={k.color} fill={k.color} fillOpacity={0.3} name={k.name || k.key} />
            ))}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default function CoachPage() {
  const [data, setData] = useState<ConversationData | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageCount = useRef(0); // Son mesaj sayısını takip et

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch('/conversation.json?t=' + new Date().getTime());
        const json = await res.json();
        
        if (!isMounted) return;

        // Sadece veri değiştiyse state güncelle (Deep check yerine stringify yeterli)
        setData((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(json)) {
            return prev;
          }
          return json;
        });

      } catch (err) {
        console.error("Veri okunamadı:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  // Akıllı Scroll: Sadece mesaj sayısı arttıysa en alta git
  useEffect(() => {
    if (data && data.messages.length > lastMessageCount.current) {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
      }
      lastMessageCount.current = data.messages.length;
    }
  }, [data]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = input;
    setInput('');
    setLoading(true);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      // Veri gelene kadar loading kalabilir veya polling yakalar
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div className="p-10 text-white flex justify-center items-center h-screen">Yükleniyor...</div>;

  return (
    <div className="h-screen bg-gray-950 text-white font-sans flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <header className="flex-none p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold">AI</div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            FTP Trainer Coach
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Durum</span>
          <div className="px-2 py-0.5 bg-green-900/30 border border-green-800 text-green-400 rounded text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            {data.dashboard.status}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT: CHAT */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
          {data.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-5 py-4 shadow-md text-base ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                
                {msg.chart && <ChartComponent chart={msg.chart} />}

                <span className="text-[10px] opacity-50 block text-right mt-2">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-gray-900 border-t border-gray-800 flex-none">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Antrenörüne bir şey sor..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
              disabled={loading}
            />
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50">
              Gönder
            </button>
          </form>
        </div>
      </main>

      {/* BOTTOM DASHBOARD */}
      <div className="flex-none bg-gray-900 border-t border-gray-800 p-4 md:p-6 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full md:w-auto">
            <div className="flex items-center gap-3 mb-1">
               <span className="bg-blue-900/50 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-800 uppercase tracking-wide">
                 Bugünün Antrenmanı
               </span>
               <span className="text-gray-500 text-xs">|</span>
               <span className="text-gray-400 text-xs font-medium">Base Phase • Hafta 1</span>
            </div>
            <h2 className="text-2xl font-bold text-white truncate">{data.dashboard.title}</h2>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="flex flex-col items-center px-4 border-r border-gray-800 last:border-0">
              <span className="text-xs text-gray-500 uppercase font-semibold">Süre</span>
              <span className="text-xl font-mono font-bold text-blue-400">{data.dashboard.duration}</span>
            </div>
            <div className="flex flex-col items-center px-4 border-r border-gray-800 last:border-0">
              <span className="text-xs text-gray-500 uppercase font-semibold">TSS</span>
              <span className="text-xl font-mono font-bold text-yellow-400">{data.dashboard.tss}</span>
            </div>
            <div className="flex flex-col items-center px-4 border-r border-gray-800 last:border-0">
              <span className="text-xs text-gray-500 uppercase font-semibold">Tip</span>
              <span className="text-lg font-bold text-purple-400 capitalize">{data.dashboard.type.replace('_', ' ')}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}