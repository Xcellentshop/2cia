import React, { useEffect, useRef } from 'react';
import { X, RefreshCcw, ExternalLink } from 'lucide-react';
import { SADE_BASE_URL } from '../utils/browserUtils';

interface EmbeddedBrowserProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmbeddedBrowser({ url, isOpen, onClose }: EmbeddedBrowserProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen && iframeRef.current) {
      iframeRef.current.src = url;
    }
  }, [url, isOpen]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleExternalOpen = () => {
    if (window.electron) {
      window.electron.send('open-browser', url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mt-6">
      <div className="flex items-center justify-between bg-gray-100 p-2 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExternalOpen}
            className="p-1 hover:bg-gray-200 rounded"
            title="Abrir em janela dedicada"
          >
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-1 hover:bg-gray-200 rounded"
            title="Recarregar"
          >
            <RefreshCcw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="flex-1 mx-4">
          <input
            type="text"
            value={url}
            readOnly
            className="w-full px-3 py-1 text-sm bg-white border rounded"
          />
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded"
          title="Fechar"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="h-[600px] border-t">
        {url.startsWith(SADE_BASE_URL) ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            URL não permitida
          </div>
        )}
      </div>
    </div>
  );
}