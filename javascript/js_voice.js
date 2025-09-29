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
        
        this.init();
    }
    
    init() {
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
        setTimeout(() => {
            this.loadVoices();
        }, 100);
        
        this.setupEventListeners();
    }
    
    loadVoices() {
        this.voices = this.synthesis.getVoices();
        this.portugueseVoices = this.voices.filter(voice => 
            voice.lang.includes('pt') || 
            voice.lang.includes('br') ||
            voice.name.toLowerCase().includes('portuguese') ||
            voice.name.toLowerCase().includes('brasil')
        );
        
        if (this.portugueseVoices.length === 0) {
            this.portugueseVoices = this.voices.slice(0, 5);
        }
        
        console.log(`📢 ${this.portugueseVoices.length} vozes carregadas`);
    }
    
    setupEventListeners() {
        document.addEventListener('mouseover', (e) => {
            if (!this.readOnHover) return;
            
            const element = e.target;
            const text = this.extractText(element);
            
            if (text && text.trim().length > 3) {
                this.speak(text, true);
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
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
        });
    }
    
    extractText(element) {
        if (!element) return '';
        
        const tagPriority = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'button', 'span', 'div'];
        const tagName = element.tagName.toLowerCase();
        
        if (!tagPriority.includes(tagName)) return '';
        
        let text = element.textContent || element.innerText || '';
        text = text.trim().replace(/\s+/g, ' ');
        
        if (text.length < 3 || text.length > 500) return '';
        if (text.match(/^[\d\s\W]+$/)) return '';
        
        return text;
    }
    
    speak(text, interrupt = false) {
        if (!text || text.trim() === '') return;
        
        if (interrupt) {
            this.synthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (this.portugueseVoices.length > 0) {
            utterance.voice = this.portugueseVoices[this.currentVoiceIndex] || this.portugueseVoices[0];
        }
        
        utterance.rate = this.currentSpeed;
        utterance.pitch = 1;
        utterance.volume = 1;
        
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
            console.error('Erro na síntese de voz:', e);
            this.isReading = false;
            this.updateButtonStates();
        };
        
        this.synthesis.speak(utterance);
    }
    
    readCurrentPage() {
        const content = this.getPageContent();
        
        if (content.length === 0) {
            this.speak('Nenhum conteúdo encontrado para leitura.');
            return;
        }
        
        const fullText = content.join('. ');
        this.speak(fullText, true);
    }
    
    getPageContent() {
        const selectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'li', '.feature-title', '.feature-description',
            '.about-text', '.hero-title', '.hero-subtitle'
        ];
        
        const content = [];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const text = this.extractText(el);
                if (text) content.push(text);
            });
        });
        
        return [...new Set(content)];
    }
    
    toggleReadOnHover() {
        this.readOnHover = !this.readOnHover;
        
        const btn = document.getElementById('hoverBtn');
        if (btn) {
            btn.classList.toggle('active', this.readOnHover);
            btn.innerHTML = this.readOnHover ? 
                '👆 Modo Hover Ativo' : '👆 Ler ao Passar Mouse';
        }
        
        this.speak(this.readOnHover ? 
            'Modo ler ao passar mouse ativado' : 
            'Modo ler ao passar mouse desativado');
    }
    
    pauseReading() {
        if (this.isReading && !this.isPaused) {
            this.synthesis.pause();
            this.isPaused = true;
            this.speak('Leitura pausada', true);
        } else if (this.isPaused) {
            this.synthesis.resume();
            this.isPaused = false;
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
    }
    
    changeSpeed(speed) {
        this.currentSpeed = parseFloat(speed);
        
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
            this.speak('Apenas uma voz disponível');
            return;
        }
        
        this.currentVoiceIndex = (this.currentVoiceIndex + 1) % this.portugueseVoices.length;
        const voice = this.portugueseVoices[this.currentVoiceIndex];
        
        this.speak(`Voz alterada para ${voice.name}`);
    }
    
    highlightText(text) {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes(text.substring(0, 50))) {
                const parent = node.parentElement;
                if (parent && !parent.classList.contains('reading-highlight')) {
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
            readBtn.innerHTML = this.isReading ? 
                '⏸️ Pausar Leitura' : '▶️ Ler Página Inteira';
        }
    }
}

const screenReader = new ScreenReader();

function toggleScreenReader() {
    const toolbar = document.getElementById('readerToolbar');
    toolbar.classList.toggle('open');
}

function readCurrentPage() {
    screenReader.readCurrentPage();
}

function toggleReadOnHover() {
    screenReader.toggleReadOnHover();
}

function pauseReading() {
    screenReader.pauseReading();
}

function stopReading() {
    screenReader.stopReading();
}

function changeSpeed(speed) {
    screenReader.changeSpeed(speed);
}

function changeVoice() {
    screenReader.changeVoice();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔊 Leitor de Tela inicializado!');
    
    setTimeout(() => {
        if (screenReader.synthesis && screenReader.synthesis.getVoices().length > 0) {
            screenReader.speak('Leitor de tela ativado. Use os controles no canto superior direito.');
        }
    }, 1000);
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'F1') {
        e.preventDefault();
        const help = `
            Atalhos do leitor de tela:
            Control R: Ler página inteira
            Control P: Pausar leitura  
            Control S: Parar leitura
            F1: Esta ajuda
        `;
        screenReader.speak(help);
    }
});