<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgriMit ChatBot Demo</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: linear-gradient(135deg, #f0f9f4 0%, #d1fae5 100%); min-height: 100vh; }
    .chatbot-container { position: fixed; bottom: 20px; right: 20px; width: 360px; max-height: 70vh; background: white; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; z-index: 10000; display: flex; flex-direction: column; }
    .chat-toggle { width: 64px; height: 64px; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(16,185,129,0.4); transition: all 0.3s; position: absolute; bottom: 10px; right: 10px; z-index: 10001; color: white; font-size: 24px; }
    .chat-toggle:hover { transform: scale(1.1); box-shadow: 0 15px 35px rgba(16,185,129,0.5); }
    .chat-header { padding: 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; display: flex; align-items: center; justify-content: space-between; }
    .chat-messages { flex: 1; padding: 20px; overflow-y: auto; background: #f8fafc; }
    .message { margin-bottom: 16px; display: flex; }
    .user { justify-content: flex-end; }
    .bot { justify-content: flex-start; }
    .message-bubble { max-width: 80%; padding: 12px 16px; border-radius: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); line-height: 1.5; font-size: 15px; }
    .user .message-bubble { background: linear-gradient(135deg, #10b981, #059669); color: white; border-bottom-right-radius: 4px; }
    .bot .message-bubble { background: white; color: #1f2937; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px; }
    .message-time { font-size: 11px; opacity: 0.7; margin-top: 4px; text-align: right; }
    .chat-buttons { padding: 20px; background: #f8fafc; border-top: 1px solid #e5e7eb; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .question-btn { padding: 12px 16px; background: white; border: 2px solid #d1d5db; border-radius: 16px; cursor: pointer; transition: all 0.2s; font-weight: 500; font-size: 14px; text-align: left; }
    .question-btn:hover { border-color: #10b981; background: #f0fdf4; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(16,185,129,0.15); }
    .close-btn { position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 20px; cursor: pointer; color: white; opacity: 0.8; }
    .close-btn:hover { opacity: 1; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef, useCallback } = React;

    const AgriMitChatBot = ({ fieldContext = 'Field Alpha' }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [messages, setMessages] = useState([]);
      const messagesEndRef = useRef(null);

      const questions = [
        "Crop health status?",
        "Disease or pests?",
        "Irrigation advice?", 
        "Fertilizer needs?",
        "Sensor readings?",
        "Weather impact?",
        "Best practices?",
        "Immediate actions?"
      ];

      const answers = {
        "Crop health status?": "Your crops are excellent! NDVI = 0.82 (healthy range 0.7-0.9). No stress detected. Continue current practices.",
        "Disease or pests?": "Low disease risk (humidity 65%). No pests detected. Monitor leaf wetness <12hrs/day.",
        "Irrigation advice?": "Soil moisture 42% (optimal 40-60%). Irrigate 1 inch/week. Early morning best to reduce evaporation.",
        "Fertilizer needs?": "NPK balanced. Apply urea 46-0-0 @25kg/acre if growth stagnant. pH 6.8 perfect.",
        "Sensor readings?": "Temp 28°C, Humidity 65%, Soil Moisture 42%, Leaf Wetness 8hrs, pH 6.8. All optimal ✅",
        "Weather impact?": "Sunny 30°C next 3 days (ideal). 20% rain chance Thursday. No action needed.",
        "Best practices?": "1. Weekly scouting 2. 60% ground cover 3. Crop rotation yearly 4. IPM principles",
        "Immediate actions?": "1. Scout borders 2. Check irrigation uniformity 3. Record baseline sensors 4. Plan next spray"
      };

      const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, []);

      const handleQuestion = (question) => {
        const userMsg = fieldContext ? `${question} (${fieldContext})` : question;
        setMessages(prev => [...prev, { role: 'user', content: userMsg, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }]);
        
        setTimeout(() => {
          const answer = answers[question] || "Great question! General advice: monitor sensors daily, scout weekly, maintain irrigation schedule.";
          setMessages(prev => [...prev, { role: 'bot', content: answer, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }]);
        }, 600);
      };

      const closeChat = () => setIsOpen(false);

      useEffect(() => {
        scrollToBottom();
      }, [messages, scrollToBottom]);

      return (
        <>
          <button 
            className="chat-toggle"
            onClick={() => setIsOpen(!isOpen)}
            title="AI Farm Assistant"
          >
            🤖
          </button>
          
          {isOpen && (
            <div className="chatbot-container">
              <div className="chat-header">
                <div>
                  <h2>🤖 AI Farm Assistant</h2>
                  <p>{fieldContext}</p>
                </div>
                <button className="close-btn" onClick={closeChat}>×</button>
              </div>
              
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`message ${msg.role}`}>
                    <div className="message-bubble">
                      {msg.content}
                      <div className="message-time">{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="chat-buttons">
                {questions.map((q, i) => (
                  <button 
                    key={i}
                    className="question-btn"
                    onClick={() => handleQuestion(q)}
                  >
                    {i+1}. {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      );
    };

    // Standalone demo
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<AgriMitChatBot fieldContext="Field Alpha - Corn" />);
  </script>
</html>

