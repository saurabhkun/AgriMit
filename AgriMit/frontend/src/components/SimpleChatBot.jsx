import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';

const SimpleChatBot = ({ fieldName = 'Field Alpha' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState('');

  const predefinedQuestions = [
    'Crop health?',
    'Disease check?',
    'Irrigation?',
    'Fertilizer?',
    'Sensor status?',
    'Weather?',
    'Practices?',
    'Actions?'
  ];

  const getAnswer = (question) => {
    const answers = {
      'Crop health?': 'Healthy (NDVI 0.82). Good condition.',
      'Disease check?': 'No diseases detected. Monitor humidity.',
      'Irrigation?': 'Soil 42%. Irrigate 1" weekly.',
      'Fertilizer?': 'NPK OK. Test soil next month.',
      'Sensor status?': 'All normal. Temp 28°C, hum 65%.',
      'Weather?': 'Sunny 30°C. No rain.',
      'Practices?': 'Weekly scout, 60% cover.',
      'Actions?': 'Scout borders today.'
    };
    return answers[question] || 'Invalid question! Try again.';
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages([...messages, { type: 'user', text: userMsg }]);
    setInput('');
    
    setTimeout(() => {
      const answer = getAnswer(userMsg);
      setMessages(prev => [...prev, { type: 'bot', text: answer }]);
    }, 500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const askQuickQuestion = (q) => {
    const fullQ = fieldName ? `${q} (${fieldName})` : q;
    setMessages([...messages, { type: 'user', text: fullQ }]);
    
    setTimeout(() => {
      const answer = getAnswer(q);
      setMessages(prev => [...prev, { type: 'bot', text: answer }]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        style={{ width: '60px', height: '60px' }}
      >
        <Bot size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between bg-green-50">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-green-500" />
              <div>
                <h3 className="font-semibold">Farm Assistant</h3>
                <p className="text-sm text-gray-500">{fieldName}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-200 rounded">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Bot size={48} className="mx-auto mb-2 opacity-50" />
                <p>Ask about your field</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg max-w-xs ${
                    msg.type === 'user' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t space-y-2">
            <div className="grid grid-cols-4 gap-2 mb-2">
              {predefinedQuestions.slice(0,4).map((q, i) => (
                <button key={i} onClick={() => askQuickQuestion(q)} className="text-xs p-2 bg-gray-100 hover:bg-gray-200 rounded text-left">
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your question..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button onClick={sendMessage} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SimpleChatBot;

