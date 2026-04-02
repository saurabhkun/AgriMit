import { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { Mic, Send, Bot, User } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const AdvancedChatBot = ({ fieldName, fieldData }) => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hi! I'm your AI Agri Assistant. Ask me about crop diseases, market prices, or sensors!", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFieldContext, setSelectedFieldContext] = useState('');
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setSelectedFieldContext(fieldData ? `Field: ${fieldName}. Crop: ${fieldData.cropType}. Location: ${fieldData.location}` : '');
  }, [fieldData, fieldName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage, timestamp: Date.now() }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await api.chat({
        message: userMessage,
        fieldContext: selectedFieldContext,
        language
      });
      
      setTimeout(() => {
        setMessages([...newMessages, { role: 'bot', content: response.response, timestamp: Date.now() }]);
        setIsTyping(false);
      }, 1200);
    } catch (error) {
      setMessages([...newMessages, { role: 'bot', content: 'Sorry, connection issue. Try again!', timestamp: Date.now(), error: true }]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const smartSuggestions = [
    'Crop disease?',
    'Mancozeb price?',
    'Irrigation advice'
  ];

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-4 max-w-md h-72 flex flex-col shadow-xl">
      <div className="flex items-center gap-2 mb-2 pb-1 border-b border-emerald-200">
        <Bot className="w-6 h-6 text-green-600" />
        <h3 className="font-bold text-sm">AI Agri Bot</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : ''}`}>
            <div className={`max-w-[80%] p-2 rounded-lg ${message.role === 'user' 
              ? 'bg-blue-500 text-white text-xs' 
              : 'bg-white border shadow-sm text-xs'
            }`}>
              <p>{message.content}</p>
              <p className="text-xs opacity-75 mt-1 text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex">
            <div className="bg-white p-2 rounded-lg border shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />

      <div className="flex gap-1 p-1 bg-white rounded border">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything..."
          className="flex-1 p-2 text-xs border-none focus:ring-0 bg-transparent"
          disabled={isTyping}
        />
        <button onClick={sendMessage} disabled={!input.trim() || isTyping} className="p-2 hover:bg-emerald-100 rounded text-emerald-600">
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default AdvancedChatBot;

