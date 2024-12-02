import React from 'react';
import { X, ExternalLink, RefreshCw } from 'lucide-react';

interface BrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function BrowserModal({ isOpen, onClose, url }: BrowserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-75">
        <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col bg-gray-100 mt-4 rounded-t-lg">
          {/* Browser Chrome */}
          <div className="bg-gray-200 p-2 rounded-t-lg border-b border-gray-300 flex items-center space-x-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            <div className="flex-1 bg-white rounded px-4 py-1 text-sm text-gray-600 flex items-center">
              <span className="truncate">{url}</span>
              <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
            </div>

            <button
              onClick={() => window.open(url, '_blank')}
              className="p-1.5 hover:bg-gray-300 rounded"
              title="Abrir em nova aba"
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Fechar</span>
            </button>
          </div>

          {/* Browser Content */}
          <div className="flex-1 bg-white">
            <iframe
              src={url}
              className="w-full h-full"
              title="Sistema SADE"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        </div>
      </div>
    </div>
  );
}