function CarluxChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Olá! Bem-vindo à Carlux. Como posso ajudá-lo hoje?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('olá') || msg.includes('oi') || msg.includes('bom dia') || msg.includes('boa tarde') || msg.includes('boa noite')) {
      return 'Olá! Seja bem-vindo à Carlux - Detalhamento e Estética Automotiva. Como posso ajudá-lo hoje?';
    }
    
    if (msg.includes('horário') || msg.includes('funcionamento') || msg.includes('abre') || msg.includes('fecha')) {
      return 'Nosso horário de atendimento é de segunda a sexta das 8h às 18h, e sábados das 8h às 14h. Domingos e feriados fechado.';
    }
    
    if (msg.includes('serviço') || msg.includes('oferecem') || msg.includes('fazem')) {
      return 'A Carlux é especializada em estética automotiva! Oferecemos:\n✨ Lavagem completa e detalhada\n💎 Polimento técnico e cristalização\n🛡️ Vitrificação de pintura\n🪟 Higienização interna profunda\n🎨 Revitalização de plásticos\n💺 Limpeza de estofados\n🔧 Aplicação de cera e selantes\n✨ E muito mais!';
    }
    
    if (msg.includes('detalhamento') || msg.includes('detailing')) {
      return 'Nosso detalhamento automotivo é completo! Inclui lavagem minuciosa, descontaminação da pintura, polimento técnico, proteção com cera premium, limpeza profunda interna, tratamento de plásticos e borrachas. Deixamos seu carro como novo! 🚗✨';
    }
    
    if (msg.includes('polimento') || msg.includes('polir')) {
      return 'Fazemos polimento técnico profissional para remover riscos, marcas de oxidação e restaurar o brilho original da pintura. Utilizamos produtos e técnicas de ponta para resultados incríveis!';
    }
    
    if (msg.includes('vitrificação') || msg.includes('vitrificar') || msg.includes('proteção')) {
      return 'A vitrificação é nossa proteção mais avançada! Cria uma camada protetora na pintura que dura até 2 anos, com alta resistência a riscos, proteção UV e facilita a limpeza. Seu carro sempre brilhando! 💎';
    }
    
    if (msg.includes('higienização') || msg.includes('limpeza interna') || msg.includes('interno')) {
      return 'Nossa higienização interna é profunda! Limpamos bancos, carpetes, teto, painel, porta-malas, removemos manchas e odores. Usamos produtos específicos e equipamentos profissionais. Seu carro fica impecável por dentro! 🧼';
    }
    
    if (msg.includes('preço') || msg.includes('valor') || msg.includes('quanto custa')) {
      return 'Os valores variam conforme o serviço e tamanho do veículo. Entre em contato para um orçamento personalizado:\n📱 WhatsApp: (11) 98765-4321\n📞 Telefone: (11) 1234-5678\nTeremos prazer em atendê-lo!';
    }
    
    if (msg.includes('agendamento') || msg.includes('agendar') || msg.includes('marcar')) {
      return 'Para agendar seu serviço, entre em contato conosco:\n📱 WhatsApp: (11) 98765-4321 (mais rápido!)\n📞 Telefone: (11) 1234-5678\nVamos adorar cuidar do seu veículo! 🚗✨';
    }
    
    if (msg.includes('tempo') || msg.includes('demora') || msg.includes('quanto tempo') || msg.includes('duração')) {
      return 'O tempo varia conforme o serviço:\n• Lavagem completa: 1-2h\n• Polimento: 4-8h\n• Vitrificação: 6-10h\n• Detalhamento completo: 8-12h\nDepende do estado do veículo. Fazemos tudo com muito cuidado e perfeição!';
    }
    
    if (msg.includes('endereço') || msg.includes('localização') || msg.includes('onde fica')) {
      return 'Estamos localizados na Av. Principal, 1234 - Centro, São Paulo - SP. Temos estacionamento no local. Venha nos visitar! 📍';
    }
    
    if (msg.includes('contato') || msg.includes('telefone') || msg.includes('whatsapp')) {
      return 'Entre em contato conosco:\n📱 WhatsApp: (11) 98765-4321\n📞 Telefone: (11) 1234-5678\n📧 Email: contato@carlux.com.br\n📍 Av. Principal, 1234 - São Paulo/SP';
    }
    
    if (msg.includes('obrigado') || msg.includes('obrigada') || msg.includes('valeu')) {
      return 'Por nada! Foi um prazer ajudar. Estamos aqui sempre que precisar! 😊✨';
    }
    
    return 'Desculpe, não entendi sua pergunta. Posso ajudá-lo com informações sobre:\n• Serviços de detalhamento\n• Polimento e vitrificação\n• Higienização interna\n• Preços e agendamentos\n• Localização e contato\n\nComo posso ajudar? 🚗';
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = { text: getBotResponse(input), sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-4 shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle size={28} />
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2">
                <MessageCircle size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Carlux</h3>
                <p className="text-xs text-blue-100">Seu centro automotivo</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-800 rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white text-gray-800 shadow-md p-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}