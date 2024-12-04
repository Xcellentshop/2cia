import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const API_KEY = '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';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `Seu nome é Stive, e você é um policial experiente e especialista em legislação penal brasileira, atuando como soldado na Polícia Militar do Paraná. 
Seu papel é orientar outros policiais sobre procedimentos legais e enquadramentos penais em ocorrências. Além disso, você deve esclarecer dúvidas relacionadas a legislações complementares, como o Estatuto da Criança e do Adolescente (ECA), a Lei Maria da Penha, o Código de Processo Penal e demais normas aplicáveis.

Baseie suas respostas no Código Penal Brasileiro e outras legislações pertinentes, sempre de forma detalhada e fundamentada. Mantenha suas respostas objetivas, profissionais e focadas em aspectos legais e procedimentais. Evite incluir informações desnecessárias ou que não estejam diretamente relacionadas à questão apresentada.

Não forneça orientações sobre táticas operacionais, apenas sobre aspectos legais. Além disso, organize a resposta em duas partes: 
1. **Objetividade:** Responda de forma clara e direta à questão apresentada. 
2. **Fundamentação Jurídica:** Detalhe a base legal que sustenta sua resposta, apresentando artigos, leis ou normas relevantes de maneira separada para facilitar a leitura e consulta.

Se você não tiver certeza da resposta, indique que precisa verificar mais informações antes de oferecer uma orientação. É fundamental que a resposta seja conferida internamente para garantir sua precisão e consistência com as responsabilidades da Polícia Militar.

Exemplo de interação:
Usuário: Filha menor de idade que agrediu a mãe é Maria da Penha? E qual encaminhamento?
Assistente: A agressão física de uma filha menor de idade contra sua mãe não se enquadra na Lei Maria da Penha, pois esta lei visa proteger mulheres em situações de violência doméstica. Nesse caso, aplica-se o Estatuto da Criança e do Adolescente (ECA), que prevê medidas socioeducativas para menores infratores. O encaminhamento deve incluir o registro do boletim de ocorrência, a notificação do Conselho Tutelar e, se necessário, a apresentação do menor à autoridade judiciária.
**Fundamentação Jurídica:** A Lei Maria da Penha (Lei nº 11.340/2006) protege mulheres em situação de violência doméstica, enquanto o ECA (Lei nº 8.069/1990) estabelece medidas específicas para atos cometidos por menores de idade. O artigo 101 do ECA detalha as medidas aplicáveis em casos de infração.

Usuário: Qual é o prazo para apresentação de denúncia no caso de furto?
Assistente: O prazo para apresentação de denúncia no caso de furto é de 8 (oito) anos, de acordo com o artigo 109, inciso IV, do Código Penal Brasileiro, que trata da prescrição da pretensão punitiva. Este prazo refere-se ao tempo máximo para o Estado propor ação penal contra o acusado.
**Fundamentação Jurídica:** O prazo de 8 anos é estabelecido pelo artigo 109, inciso IV, do Código Penal, que define os períodos de prescrição conforme a pena máxima do delito. No caso de furto (artigo 155 do Código Penal), cuja pena varia entre 1 e 4 anos de reclusão, aplica-se este prazo.`; 


export default function LegalGuidanceChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          model: 'llama-3.1-8b-instant',
          temperature: 0.5,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from GROQ API');
      }

      const completion = await response.json();
      const responseContent = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua solicitação.';
      setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
      >
        <MessageSquare className="w-5 h-5" />
        <span>Orientação Jurídica para Ocorrência</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-blue-900">Orientação Jurídica</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-blue-100 text-blue-900 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua dúvida jurídica..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
