/**
 * Screen Reader - Leitor de Tela Completo
 * Arquivo: screen-reader.js
 * Versão: 1.0.0
 */

class ScreenReader {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.isReading = false;
        this.isPaused = false;
        this.readOnHover = false;
        this.currentSpeed = 1;
        this.currentVoiceIndex = 0;
        this.voices = [];
        this.currentUtterance = null;
        this.portugueseVoices = [];
        
        this.init();
    }
    
    init() {
        console.log('🔊 Inicializando Screen Reader...');
        
        // Aguardar vozes carregarem
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
        
        // Carregar vozes imediatamente (alguns navegadores)
        setTimeout(() => {
            this.loadVoices();
        }, 100);
        
        this.setupEventListeners();
        this.injectHTML();
        this.injectCSS();
        
        console.log('✅ Screen Reader inicializado com sucesso!');
    }
    
    /**
     * Injeta o HTML necessário na página
     */
    injectHTML() {
        // Verificar se já existe
        if (document.querySelector('.reader-toggle')) {
            console.log('🔄 Screen Reader já existe na página');
            return;
        }
        
        // Criar botão toggle
        const toggleButton = document.createElement('button');
        toggleButton.className = 'reader-toggle';
        toggleButton.onclick = () => this.toggleToolbar();
        toggleButton.title = 'Leitor de Tela';
        toggleButton.innerHTML = '🔊';
        
        // Criar toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'screen-reader-toolbar';
        toolbar.id = 'readerToolbar';
        toolbar.innerHTML = `
            <h4>🔊 Leitor de Tela</h4>
            
            <button class="reader-button" onclick="screenReader.readCurrentPage()" id="readPageBtn">
                ▶️ Ler Página Inteira
            </button>
            
            <button class="reader-button" onclick="screenReader.toggleReadOnHover()" id="hoverBtn">
                👆 Ler ao Passar Mouse
            </button>
            
            <div class="reader-controls">
                <button class="reader-button" onclick="screenReader.pauseReading()">⏸️</button>
                <button class="reader-button" onclick="screenReader.stopReading()">⏹️</button>
            </div>
            
            <div class="speed-control">
                <span>🐌</span>
                <input type="range" class="speed-slider" min="0.5" max="2" step="0.1" value="1" onchange="screenReader.changeSpeed(this.value)">
                <span>🐰</span>
            </div>
            
            <button class="reader-button" onclick="screenReader.changeVoice()" id="voiceBtn">
                🎭 Trocar Voz
            </button>
            
            <div class="reader-info">
                <small>Ctrl+R: Ler | Ctrl+P: Pausar | F1: Ajuda</small>
            </div>
        `;
        
        // Adicionar à página
        document.body.appendChild(toggleButton);
        document.body.appendChild(toolbar);
        
        console.log('🏗️ HTML do Screen Reader injetado');
    }
    
    /**
     * Injeta o CSS necessário na página
     */
    injectCSS() {
        // Verificar se já existe
        if (document.querySelector('#screen-reader-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'screen-reader-styles';
        style.textContent = `
            /* Screen Reader Styles */
            .screen-reader-toolbar {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 123, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 15px;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.2);
                min-width: 200px;
                max-width: 250px;
                transform: translateX(calc(100% + 20px));
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: 'Roboto', Arial, sans-serif;
            }

            .screen-reader-toolbar.open {
                transform: translateX(0);
            }

            .screen-reader-toolbar h4 {
                color: white;
                margin: 0 0 10px 0;
                font-size: 14px;
                text-align: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                padding-bottom: 10px;
                font-weight: 600;
            }

            .reader-button {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 10px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 500;
                text-align: left;
            }

            .reader-button:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }

            .reader-button:active {
                transform: translateY(0);
            }

            .reader-button.active {
                background: rgba(255, 255, 255, 0.3);
                border-color: rgba(255, 255, 255, 0.4);
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            }

            .reader-controls {
                display: flex;
                gap: 5px;
            }

            .reader-controls .reader-button {
                flex: 1;
                font-size: 14px;
                padding: 8px;
                justify-content: center;
            }

            .speed-control {
                display: flex;
                align-items: center;
                gap: 8px;
                color: white;
                font-size: 12px;
                padding: 5px 0;
            }

            .speed-slider {
                flex: 1;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                outline: none;
                cursor: pointer;
                appearance: none;
            }

            .speed-slider::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .speed-slider::-moz-range-thumb {
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .reader-toggle {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #007bff, #0056b3);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 22px;
                cursor: pointer;
                z-index: 999998;
                box-shadow: 0 4px 16px rgba(0, 123, 255, 0.4);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Roboto', Arial, sans-serif;
            }

            .reader-toggle:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(0, 123, 255, 0.6);
            }

            .reader-toggle:active {
                transform: scale(0.95);
            }

            .reader-info {
                background: rgba(255, 255, 255, 0.1);
                padding: 8px;
                border-radius: 6px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .reader-info small {
                color: rgba(255, 255, 255, 0.8);
                font-size: 10px;
                line-height: 1.3;
                display: block;
                text-align: center;
            }

            .reading-highlight {
                background-color: rgba(255, 235, 59, 0.3) !important;
                border-radius: 3px;
                padding: 2px 4px;
                transition: all 0.3s ease;
                animation: readingPulse 1.5s infinite;
                box-shadow: 0 0 8px rgba(255, 235, 59, 0.4);
            }

            @keyframes readingPulse {
                0%, 100% { 
                    background-color: rgba(255, 235, 59, 0.3);
                    box-shadow: 0 0 8px rgba(255, 235, 59, 0.4);
                }
                50% { 
                    background-color: rgba(255, 235, 59, 0.5);
                    box-shadow: 0 0 12px rgba(255, 235, 59, 0.6);
                }
            }

            /* Responsivo */
            @media (max-width: 768px) {
                .screen-reader-toolbar {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    transform: translateY(-100%);
                    min-width: auto;
                    max-width: none;
                }
                
                .screen-reader-toolbar.open {
                    transform: translateY(0);
                }
                
                .reader-toggle {
                    top: 10px;
                    right: 10px;
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                }
                
                .reader-button {
                    font-size: 11px;
                    padding: 8px 10px;
                }
            }

            @media (max-width: 480px) {
                .screen-reader-toolbar {
                    padding: 12px;
                    gap: 8px;
                }
                
                .reader-button {
                    font-size: 10px;
                    padding: 6px 8px;
                }
                
                .reader-toggle {
                    width: 45px;
                    height: 45px;
                    font-size: 18px;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 CSS do Screen Reader injetado');
    }
    
    loadVoices() {
        this.voices = this.synthesis.getVoices();
        
        // Filtrar vozes em português
        this.portugueseVoices = this.voices.filter(voice => 
            voice.lang.includes('pt') || 
            voice.lang.includes('br') ||
            voice.name.toLowerCase().includes('portuguese') ||
            voice.name.toLowerCase().includes('brasil') ||
            voice.name.toLowerCase().includes('brazilian')
        );
        
        if (this.portugueseVoices.length === 0) {
            // Fallback: usar as primeiras vozes disponíveis
            this.portugueseVoices = this.voices.slice(0, Math.min(5, this.voices.length));
        }
        
        console.log(`📢 ${this.portugueseVoices.length} vozes carregadas para português`);
        
        // Atualizar botão de voz
        this.updateVoiceButton();
    }
    
    setupEventListeners() {
        // Ler ao passar mouse (quando ativado)
        document.addEventListener('mouseover', (e) => {
            if (!this.readOnHover) return;
            
            const element = e.target;
            const text = this.extractText(element);
            
            if (text && text.trim().length > 3) {
                this.speak(text, true);
            }
        });
        
        // Atalhos do teclado
        document.addEventListener('keydown', (e) => {
            // Atalhos com Ctrl/Cmd
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'r':
                        e.preventDefault();
                        this.readCurrentPage();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.pauseReading();
                        break;
                    case 's':
                        e.preventDefault();
                        this.stopReading();
                        break;
                }
            }
            
            // F1 para ajuda
            if (e.key === 'F1') {
                e.preventDefault();
                this.showHelp();
            }
        });
        
        console.log('⌨️ Event listeners configurados');
    }
    
    extractText(element) {
        if (!element) return '';
        
        // Priorizar elementos com texto significativo
        const tagPriority = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'button', 'span', 'div', 'li'];
        const tagName = element.tagName.toLowerCase();
        
        if (!tagPriority.includes(tagName)) return '';
        
        // Extrair texto limpo
        let text = element.textContent || element.innerText || '';
        text = text.trim().replace(/\s+/g, ' ');
        
        // Filtros de qualidade
        if (text.length < 3 || text.length > 300) return '';
        if (text.match(/^[\d\s\W]+$/)) return ''; // Apenas números e símbolos
        
        return text;
    }
    
    speak(text, interrupt = false) {
        if (!text || text.trim() === '') return;
        
        if (interrupt) {
            this.synthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configurar voz
        if (this.portugueseVoices.length > 0) {
            utterance.voice = this.portugueseVoices[this.currentVoiceIndex] || this.portugueseVoices[0];
        }
        
        utterance.rate = this.currentSpeed;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Event listeners
        utterance.onstart = () => {
            this.isReading = true;
            this.currentUtterance = utterance;
            this.updateButtonStates();
            this.highlightText(text);
        };
        
        utterance.onend = () => {
            this.isReading = false;
            this.currentUtterance = null;
            this.updateButtonStates();
            this.removeHighlight();
        };
        
        utterance.onerror = (e) => {
            console.error('❌ Erro na síntese de voz:', e);
            this.isReading = false;
            this.updateButtonStates();
        };
        
        this.synthesis.speak(utterance);
        console.log(`🔊 Falando: "${text.substring(0, 50)}..."`);
    }
    
    readCurrentPage() {
        // Extrair todo o texto da página
        const content = this.getPageContent();
        
        if (content.length === 0) {
            this.speak('Nenhum conteúdo encontrado para leitura.');
            return;
        }
        
        const fullText = content.join('. ');
        console.log(`📖 Lendo página completa: ${content.length} elementos`);
        this.speak(fullText, true);
    }
    
    getPageContent() {
        const selectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'li', '.feature-title', '.feature-description',
            '.about-text', '.hero-title', '.hero-subtitle',
            'button', 'a[aria-label]', '[alt]'
        ];
        
        const content = [];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Pular elementos do próprio leitor de tela
                if (el.closest('.screen-reader-toolbar') || el.classList.contains('reader-toggle')) {
                    return;
                }
                
                const text = this.extractText(el);
                if (text) content.push(text);
            });
        });
        
        return [...new Set(content)]; // Remove duplicatas
    }
    
    toggleReadOnHover() {
        this.readOnHover = !this.readOnHover;
        
        const btn = document.getElementById('hoverBtn');
        if (btn) {
            btn.classList.toggle('active', this.readOnHover);
            btn.innerHTML = this.readOnHover ? 
                '👆 Modo Hover Ativo' : '👆 Ler ao Passar Mouse';
        }
        
        const message = this.readOnHover ? 
            'Modo ler ao passar mouse ativado' : 
            'Modo ler ao passar mouse desativado';
            
        this.speak(message);
        console.log(`🖱️ ${message}`);
    }
    
    pauseReading() {
        if (this.isReading && !this.isPaused) {
            this.synthesis.pause();
            this.isPaused = true;
            console.log('⏸️ Leitura pausada');
        } else if (this.isPaused) {
            this.synthesis.resume();
            this.isPaused = false;
            console.log('▶️ Leitura retomada');
        }
        
        this.updateButtonStates();
    }
    
    stopReading() {
        this.synthesis.cancel();
        this.isReading = false;
        this.isPaused = false;
        this.currentUtterance = null;
        this.removeHighlight();
        this.updateButtonStates();
        console.log('⏹️ Leitura parada');
    }
    
    changeSpeed(speed) {
        this.currentSpeed = parseFloat(speed);
        console.log(`🏃 Velocidade alterada para: ${this.currentSpeed}x`);
        
        // Se estiver lendo, aplicar nova velocidade
        if (this.isReading && this.currentUtterance) {
            const text = this.currentUtterance.text;
            this.stopReading();
            setTimeout(() => {
                this.speak(text, true);
            }, 100);
        }
    }
    
    changeVoice() {
        if (this.portugueseVoices.length <= 1) {
            this.speak('Apenas uma voz disponível no seu navegador.');
            return;
        }
        
        this.currentVoiceIndex = (this.currentVoiceIndex + 1) % this.portugueseVoices.length;
        const voice = this.portugueseVoices[this.currentVoiceIndex];
        
        this.updateVoiceButton();
        this.speak(`Voz alterada para ${voice.name}`);
        console.log(`🎭 Voz alterada para: ${voice.name}`);
    }
    
    updateVoiceButton() {
        const btn = document.getElementById('voiceBtn');
        if (btn && this.portugueseVoices.length > 0) {
            const voice = this.portugueseVoices[this.currentVoiceIndex];
            const voiceName = voice ? voice.name.split(' ')[0] : 'Padrão';
            btn.innerHTML = `🎭 ${voiceName}`;
        }
    }
    
    toggleToolbar() {
        const toolbar = document.getElementById('readerToolbar');
        if (toolbar) {
            toolbar.classList.toggle('open');
            
            const isOpen = toolbar.classList.contains('open');
            console.log(`🔧 Toolbar ${isOpen ? 'aberta' : 'fechada'}`);
        }
    }
    
    highlightText(text) {
        // Encontrar e destacar texto na página
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        const searchText = text.substring(0, 30).toLowerCase();
        
        while (node = walker.nextNode()) {
            if (node.textContent.toLowerCase().includes(searchText)) {
                const parent = node.parentElement;
                if (parent && 
                    !parent.classList.contains('reading-highlight') &&
                    !parent.closest('.screen-reader-toolbar')) {
                    parent.classList.add('reading-highlight');
                }
                break;
            }
        }
    }
    
    removeHighlight() {
        document.querySelectorAll('.reading-highlight').forEach(el => {
            el.classList.remove('reading-highlight');
        });
    }
    
    updateButtonStates() {
        const readBtn = document.getElementById('readPageBtn');
        if (readBtn) {
            if (this.isReading) {
                readBtn.innerHTML = this.isPaused ? 
                    '▶️ Continuar Leitura' : '⏸️ Pausar Leitura';
            } else {
                readBtn.innerHTML = '▶️ Ler Página Inteira';
            }
        }
    }
    
    showHelp() {
        const help = `
            Ajuda do Leitor de Tela:
            
            Controles disponíveis:
            - Ler página inteira
            - Modo ler ao passar mouse
            - Pausar e parar leitura
            - Controle de velocidade
            - Trocar voz
            
            Atalhos do teclado:
            - Control R: Ler página
            - Control P: Pausar
            - Control S: Parar
            - F1: Esta ajuda
            
            Use o botão no canto superior direito para acessar os controles.
        `;
        
        this.speak(help, true);
    }
    
    // Método público para configurações
    configure(options = {}) {
        if (options.speed) this.currentSpeed = options.speed;
        if (options.autoStart) this.readCurrentPage();
        if (options.hoverMode) this.toggleReadOnHover();
        
        console.log('⚙️ Configurações aplicadas:', options);
    }
    
    // Método para obter status
    getStatus() {
        return {
            isReading: this.isReading,
            isPaused: this.isPaused,
            readOnHover: this.readOnHover,
            currentSpeed: this.currentSpeed,
            voicesAvailable: this.portugueseVoices.length,
            currentVoice: this.portugueseVoices[this.currentVoiceIndex]?.name || 'Nenhuma'
        };
    }
}

let screenReader;

function initScreenReader() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        screenReader = new ScreenReader();
        window.screenReader = screenReader; // Disponibilizar globalmente
        
        console.log('🎉 Screen Reader pronto para uso!');
        
        // Feedback inicial (opcional)
        setTimeout(() => {
            if (screenReader.portugueseVoices.length > 0) {
                screenReader.speak('Leitor de tela ativado. Clique no botão para acessar os controles.');
            }
        }, 2000);
    } else {
        console.error('❌ Web Speech API não suportada neste navegador');
    }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScreenReader);
} else {
    initScreenReader();
}

// Exportar para uso modular (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScreenReader;
}