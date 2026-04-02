import { useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Bot, Leaf, Droplets, Thermometer, Sun, Droplet, Bug } from 'lucide-react';

const FIXED_ANSWERS = {
  'Crop health status?': 'Crops healthy (NDVI 0.82). Excellent vegetation index. Continue monitoring weekly.',
  'Disease or pests?': 'Low disease risk. No major pests detected. Monitor leaf wetness and humidity.',
  'Irrigation advice?': 'Soil moisture 42%. Irrigate 1 inch weekly. Early morning applications best.',
  'Fertilizer needs?': 'NPK balanced. Apply urea 46-0-0 at 25kg/acre if growth slow. Soil test advised.',
  'Sensor readings?': 'Temperature 28°C (optimal), Humidity 65%, pH 6.8. All sensors normal.',
  'Weather impact?': 'Sunny 30°C for 3 days. Low rain chance. Watch for heat stress above 35°C.',
  'Best practices?': 'Weekly field scouting, maintain 60% ground cover, crop rotation annually, IPM principles.',
  'Immediate actions?': '1. Scout field borders 2. Check irrigation lines 3. Record sensor baseline.'
};

export default function ChatBot({ fieldContext }) {
  const messagesRef = useRef([]);
  const timeoutRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    const chatPanel = document.querySelector('.chat-messages');
    if (chatPanel) chatPanel.scrollTop = chatPanel.scrollHeight;
  }, []);

  const addMessage = useCallback((role, content) => {
    messagesRef.current.push({
      role,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    scrollToBottom();
  }, [scrollToBottom]);

  const handleQuestion = (question) => {
    addMessage('user', question);
    
    setTimeout(() => {
      const answer = FIXED_ANSWERS[question] || "Good question! Here's general advice: monitor sensors daily and scout field weekly.";
      if (fieldContext) {
        answer += `\\n(Field: ${fieldContext})`;
      }
      addMessage('assistant', answer);
    }, 500);
  };

  const clearChat = () => {
    messagesRef.current = [];
    scrollToBottom();
  };

  const toggleChat = () => {
    if (messagesRef.current.length === 0) {
      clearChat();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isOpen = messagesRef.current.length > 0;

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-full shadow-2xl hover:shadow-3xl z-50 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border-4 border-white/30"
      >
        <Bot className="w-7 h-7" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] h-[480px] bg-white rounded-3xl shadow-2xl border border-green-200 z-[999] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[85vh]">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Farm AI Assistant</h3>
                <p className="text-xs text-gray-600">{fieldContext || 'Ready to advise'}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={clearChat} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="Clear">
                <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors ml-1" onClick={() => {}}>
                <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50/80 to-white chat-messages">
            {messagesRef.current.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white ml-auto'
                    : 'bg-white border border-gray-200'
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 opacity-75 ${msg.role === 'user' ? 'text-white/90' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="p-4 border-t bg-gradient-to-r from-emerald-50 to-green-50 grid grid-cols-2 gap-2">
            {Object.entries(FIXED_ANSWERS).map(([question, answer], i) => (
              <button
                key={i}
                onClick={() => handleQuestion(question)}
                className="flex items-center gap-2 p-3 bg-white border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl transition-all text-sm font-medium hover:shadow-sm"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                <span className="truncate">{question}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

