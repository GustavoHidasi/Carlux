document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleContraste = document.getElementById('toggle-contraste');
    const toggleFotossensibilidade = document.getElementById('toggle-fotossensibilidade');
    const aumentarTexto = document.getElementById('aumentar-texto');
    const diminuirTexto = document.getElementById('diminuir-texto');

    let tamanhoFonte = 1; // 1 = normal, 2 = aumentado, -1 = diminuido

    toggleContraste.addEventListener('click', () => {
        body.classList.toggle('alto-contraste');
    });

    toggleFotossensibilidade.addEventListener('click', () => {
        body.classList.toggle('fotossensibilidade');
    });

    aumentarTexto.addEventListener('click', () => {
        body.classList.remove('texto-diminuido', 'texto-muito-diminuido');
        if (body.classList.contains('texto-aumentado')) {
            body.classList.add('texto-muito-aumentado');
        } else {
            body.classList.add('texto-aumentado');
        }
    });

    diminuirTexto.addEventListener('click', () => {
        body.classList.remove('texto-aumentado', 'texto-muito-aumentado');
        if (body.classList.contains('texto-diminuido')) {
            body.classList.add('texto-muito-diminuido');
        } else {
            body.classList.add('texto-diminuido');
        }
    });
});