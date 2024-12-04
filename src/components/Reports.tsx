import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import { FileDown, ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Call, City, CompanyFilter, COMPANY_CITIES } from '../types';
import { formatToBrazilianDateTime, getCurrentBrazilianTime } from '../utils/dateUtils';
import { calculateCityData, calculateCompanyData } from '../utils/reportUtils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="font-bold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value} ({entry.payload[`${entry.dataKey}Percentage`].toFixed(1)}%)
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | 'all'>('all');
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>('all');
  const brazilianNow = getCurrentBrazilianTime();
  const [startDate, setStartDate] = useState(
    new Date(brazilianNow.setHours(0, 0, 0, 0)).toISOString().slice(0, 16)
  );
  const [endDate, setEndDate] = useState(
    new Date(brazilianNow.setHours(23, 59, 59, 999)).toISOString().slice(0, 16)
  );
  const navigate = useNavigate();

  useEffect(() => {
    loadCalls();
  }, [startDate, endDate]);

  const loadCalls = async () => {
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
    
    const callsRef = collection(db, 'calls');
    const q = query(
      callsRef,
      where('timestamp', '>=', startTimestamp),
      where('timestamp', '<=', endTimestamp)
    );
    
    const querySnapshot = await getDocs(q);
    const callsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Call[];
    
    setCalls(callsData);
  };

  const cityData = calculateCityData(calls, selectedCity, companyFilter);
  const companyData = calculateCompanyData(calls);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Relatório de Chamadas 190', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Período: ${formatToBrazilianDateTime(startDate)} até`, 20, 30);
    doc.text(`${formatToBrazilianDateTime(endDate)}`, 20, 40);
    
    // Company summary
    doc.text('Resumo por Companhia:', 20, 60);
    let yPos = 70;
    companyData.forEach((data) => {
      doc.text(`${data.name}:`, 20, yPos);
      doc.text(`Total: ${data.total} (${data.totalPercentage.toFixed(1)}%)`, 30, yPos + 5);
      doc.text(`SADE: ${data.sade} (${data.sadePercentage.toFixed(1)}%)`, 30, yPos + 10);
      yPos += 20;
    });
    
    // City details
    doc.text('Detalhamento por Cidade:', 20, yPos + 10);
    yPos += 20;
    cityData.forEach((data) => {
      doc.text(`${data.city}:`, 20, yPos);
      doc.text(`Total: ${data.total} (${data.totalPercentage.toFixed(1)}%)`, 30, yPos + 5);
      doc.text(`SADE: ${data.sade} (${data.sadePercentage.toFixed(1)}%)`, 30, yPos + 10);
      yPos += 20;
    });
    
    const currentDate = formatToBrazilianDateTime(new Date());
    doc.save(`relatorio-190-${currentDate.replace(/[/:]/g, '-')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <button
            onClick={generatePDF}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FileDown className="w-5 h-5" />
            <span>Exportar PDF</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 inline-block mr-2" />
                Data/Hora Inicial
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded border p-2 w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 inline-block mr-2" />
                Data/Hora Final
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded border p-2 w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Companhia</label>
              <select
                value={companyFilter}
                onChange={(e) => {
                  setCompanyFilter(e.target.value as CompanyFilter);
                  setSelectedCity('all'); // Reset city filter when company changes
                }}
                className="rounded border p-2 w-full"
              >
                <option value="all">Todas as Companhias</option>
                <option value="1CIA">1ª Companhia</option>
                <option value="2CIA">2ª Companhia</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as City | 'all')}
                className="rounded border p-2 w-full"
              >
                <option value="all">Todas as cidades</option>
                {companyFilter === 'all' ? (
                  Object.values(COMPANY_CITIES).flat().map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))
                ) : (
                  COMPANY_CITIES[companyFilter].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Resumo por Companhia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companyData.map((data) => (
                <div key={data.name} className="p-4 border rounded bg-blue-50">
                  <h4 className="font-bold text-lg mb-2">{data.name}</h4>
                  <p>Total de chamadas: {data.total} ({data.totalPercentage.toFixed(1)}% do total geral)</p>
                  <p>Registradas no SADE: {data.sade} ({data.sadePercentage.toFixed(1)}% das chamadas da companhia)</p>
                  <p>Apenas contabilizadas: {data.total - data.sade}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-96">
            <ResponsiveContainer>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="total" fill="#3B82F6" name="Total de Chamadas" />
                <Bar dataKey="sade" fill="#10B981" name="Registradas no SADE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Resumo por Cidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cityData.map((data) => (
              <div key={data.city} className="p-4 border rounded">
                <h4 className="font-bold">{data.city}</h4>
                <p>Total de chamadas: {data.total} ({data.totalPercentage.toFixed(1)}% do total)</p>
                <p>Registradas no SADE: {data.sade} ({data.sadePercentage.toFixed(1)}% das chamadas da cidade)</p>
                <p>Apenas contabilizadas: {data.total - data.sade}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}