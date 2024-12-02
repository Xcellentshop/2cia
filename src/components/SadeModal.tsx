import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface BrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function BrowserModal({ isOpen, onClose, url }: BrowserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <h3 className="text-xl font-bold mb-4">Acesso ao Sistema SADE</h3>
        <p className="text-gray-700 mb-6">
          Para registrar a ocorrência, clique no link abaixo para abrir o Sistema SADE em uma nova aba.
        </p>
        <div className="flex items-center justify-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            <span>Abrir Sistema SADE</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
}