import React, { useState } from 'react';
import { City } from '../types';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, Phone, ExternalLink } from 'lucide-react';
import LegalGuidanceChat from './LegalGuidanceChat';
import { getBrazilianTimeISOString } from '../utils/dateUtils';
import { openInCustomBrowser, SADE_BASE_URL } from '../utils/browserUtils';

const CITIES: { name: City; color: string }[] = [
  { name: "FOZ DO IGUAÇU", color: "bg-blue-500" },
  { name: "SANTA TEREZINHA", color: "bg-green-500" },
  { name: "SÃO MIGUEL", color: "bg-yellow-500" },
  { name: "MEDIANEIRA", color: "bg-purple-500" },
  { name: "SERRANOPOLIS", color: "bg-red-500" },
  { name: "MISSAL", color: "bg-pink-500" },
  { name: "ITAIPULANDIA", color: "bg-indigo-500" },
  { name: "OUTRAS CIDADES", color: "bg-gray-500" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
    setShowRegistrationModal(true);
  };

  const handleCallRegistration = async (registeredInSADE: boolean) => {
    if (!selectedCity || !auth.currentUser) return;

    try {
      const now = new Date();
      const brazilianTime = getBrazilianTimeISOString();
      
      await addDoc(collection(db, 'calls'), {
        city: selectedCity,
        timestamp: now.getTime(),
        registeredInSADE,
        userId: auth.currentUser.uid,
        date: brazilianTime
      });

      toast.success('Chamada registrada com sucesso!');
      
      if (registeredInSADE) {
        openInCustomBrowser(`${SADE_BASE_URL}/syspm-web/public/atendimento/saveLegado`);
      }

      setShowRegistrationModal(false);
      setSelectedCity(null);
    } catch (error) {
      toast.error('Erro ao registrar chamada');
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const handleSadeLogin = () => {
    openInCustomBrowser(`${SADE_BASE_URL}/syspm-web/public/login`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Phone className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Sistema 190</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/reports')}
              className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-600"
            >
              Relatórios
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 rounded hover:bg-red-500"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {CITIES.map(({ name, color }) => (
            <button
              key={name}
              onClick={() => handleCityClick(name)}
              className={`${color} hover:opacity-90 text-white p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105`}
            >
              <span className="text-xl font-bold">{name}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Avisos Importantes</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-900">Faça o login no sistema SADE clicando no botão ao lado</p>
              <button
                onClick={handleSadeLogin}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition-colors"
              >
                <span>Logar no SADE</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-900">
                Após logar no SADE pode operar normalmente com este sistema, pois quando for necessário registrar uma ocorrência o sistema abrirá normalmente a tela de registro
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-900">
                Este sistema não analisa a produtividade individual de cada atendente; ele gera um relatório com base no atendimento coletivo e não possui caráter fiscalizatório.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <LegalGuidanceChat />
        </div>
      </main>

      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Registrar chamada de {selectedCity}</h3>
            <div className="space-y-4">
              <button
                onClick={() => handleCallRegistration(true)}
                className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Registrar no SADE
              </button>
              <button
                onClick={() => handleCallRegistration(false)}
                className="w-full py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Apenas Contabilizar
              </button>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="w-full py-3 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}