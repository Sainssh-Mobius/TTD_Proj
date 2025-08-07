import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, User, Bot, Globe } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  language?: string;
}

interface ChatBotProps {
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'నమస్కారం! I am TTD AI Assistant. How can I help you today? (తెలుగు, English, தமிழ், हिंदी)',
      timestamp: new Date(),
      language: 'multi'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'telugu', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'tamil', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' }
  ];

  const predefinedResponses = {
    english: {
      'darshan': 'Your darshan slot is confirmed for 2:30 PM today. Please arrive 15 minutes early at Gate 3.',
      'queue': 'You are currently #156 in the queue. Estimated wait time is 45 minutes.',
      'shuttle': 'Next shuttle to Tirumala departs in 8 minutes from Alipiri Base.',
      'laddu': 'Laddu booking is available. 1kg box: ₹500, 2kg box: ₹1000. Stock available.',
      'emergency': 'For medical emergency, press the emergency button on your dashboard or call 108.',
      'parking': 'Parking Lot A is 84% full. Consider using Parking Lot B which has more space.',
      'weather': 'Current weather: Clear skies, 28°C. Good conditions for darshan.',
      'default': 'I can help you with darshan timings, queue status, shuttle services, laddu booking, parking, and emergency assistance.'
    },
    telugu: {
      'darshan': 'మీ దర్శన స్లాట్ ఈరోజు మధ్యాహ్నం 2:30 కు నిర్ధారించబడింది. దయచేసి గేట్ 3 వద్ద 15 నిమిషాలు ముందుగా రండి.',
      'queue': 'మీరు ప్రస్తుతం క్యూలో #156వ స్థానంలో ఉన్నారు. అంచనా వేచి ఉండే సమయం 45 నిమిషాలు.',
      'shuttle': 'తిరుమలకు తదుపరి షటిల్ అలిపిరి బేస్ నుండి 8 నిమిషాల్లో బయలుదేరుతుంది.',
      'default': 'నేను దర్శన సమయాలు, క్యూ స్థితి, షటిల్ సేవలు, లడ్డూ బుకింగ్‌తో సహాయం చేయగలను.'
    },
    tamil: {
      'darshan': 'உங்கள் தரிசன ஸ்லாட் இன்று மதியம் 2:30 மணிக்கு உறுதி செய்யப்பட்டுள்ளது. கேட் 3 இல் 15 நிமிடங்கள் முன்னதாக வாருங்கள்.',
      'queue': 'நீங்கள் தற்போது வரிசையில் #156வது இடத்தில் உள்ளீர்கள். மதிப்பிடப்பட்ட காத்திருப்பு நேரம் 45 நிமிடங்கள்.',
      'shuttle': 'திருமலைக்கு அடுத்த ஷட்டில் அலிபிரி பேஸிலிருந்து 8 நிமிடங்களில் புறப்படும்.',
      'default': 'தரிசன நேரங்கள், வரிசை நிலை, ஷட்டில் சேவைகள், லட்டு முன்பதிவு ஆகியவற்றில் உதவ முடியும்.'
    },
    hindi: {
      'darshan': 'आपका दर्शन स्लॉट आज दोपहर 2:30 बजे के लिए पुष्ट है। कृपया गेट 3 पर 15 मिनट पहले पहुंचें।',
      'queue': 'आप वर्तमान में कतार में #156वें स्थान पर हैं। अनुमानित प्रतीक्षा समय 45 मिनट है।',
      'shuttle': 'तिरुमला के लिए अगली शटल अलिपिरि बेस से 8 मिनट में रवाना होगी।',
      'default': 'मैं दर्शन समय, कतार स्थिति, शटल सेवाओं, लड्डू बुकिंग में मदद कर सकता हूं।'
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const responses = predefinedResponses[currentLanguage as keyof typeof predefinedResponses];
    
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return responses.default;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputMessage),
        timestamp: new Date(),
        language: currentLanguage
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 h-96 card-elevated flex flex-col z-50 shadow-2xl bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-label-lg font-semibold">TTD AI Assistant</h3>
            <p className="text-label-sm opacity-80">Multi-language support</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="bg-white/20 text-white text-label-sm px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code} className="text-gray-800">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <button 
            onClick={onClose} 
            className="hover:bg-white/20 p-1 rounded transition-colors"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-3 rounded-2xl ${
              message.type === 'user' 
                ? 'bg-blue-500 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                {message.type === 'user' ? (
                  <User className="w-3 h-3" />
                ) : (
                  <Bot className="w-3 h-3" />
                )}
                <span className="text-label-sm opacity-80 font-medium">
                  {message.type === 'user' ? 'You' : 'TTD AI'}
                </span>
              </div>
              <p className="text-body-sm leading-relaxed">{message.content}</p>
              <p className="text-label-sm opacity-60 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-2xl border border-gray-200">
              <div className="flex items-center space-x-2">
                <Bot className="w-3 h-3" />
                <span className="text-label-sm font-medium">TTD AI is typing...</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">Quick Actions:</span>
          <div className="flex space-x-2">
            {['darshan', 'queue', 'shuttle', 'parking'].map(action => (
              <button
                key={action}
                onClick={() => setInputMessage(action)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors capitalize"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about darshan, queue, shuttle..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-body-sm transition-colors"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-gradient-to-r from-amber-500 to-red-600 text-white p-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setMessages([{
                id: '1',
                type: 'bot',
                content: 'నమస్కారం! I am TTD AI Assistant. How can I help you today? (తెలుగు, English, தமிழ், हिंदी)',
                timestamp: new Date(),
                language: 'multi'
              }]);
              alert('Chat history cleared.');
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-xl transition-colors"
            title="Clear chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;