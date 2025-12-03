window.addEventListener('DOMContentLoaded', (event) => {
    const startingBox = document.querySelector('.drop-box');
    const cards = document.querySelectorAll('.debate-card');
    const connectorTemplate = document.getElementById('connector-template');
    const dropBoxTemplate = document.getElementById('drop-box-template');

    function addCard(oElement, cardData) {
        let cardDiv = document.createElement('div');
        cardDiv.innerHTML = cardData;
        cardDiv.classList = "node";

        if ((oElement.parentElement.classList.contains('case-box')) == false) {
            const card = cardDiv.querySelector('.debate-card');
            //card.setAttribute('style', 'display: inline-block;')
        }

        cardDiv.appendChild(connectorTemplate.content.cloneNode(true));
        cardDiv.appendChild(dropBoxTemplate.content.cloneNode(true));
        const dropBox = cardDiv.querySelector('.drop-box')
        dropBox.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        dropBox.addEventListener('drop', (event) => {
            event.preventDefault();
            const data = event.dataTransfer.getData('text/plain');
            addCard(dropBox, data);
        });
        
        oElement.replaceWith(cardDiv)
    }
    
    // Styles and provides Functionality to  every evidence card:
    cards.forEach(card => {
        card.addEventListener('dragstart', (event) => {
            // This code kinda bad prob change later
            let currentMargin = card.style.marginLeft;
            card.style.marginLeft = '0px';
            event.dataTransfer.setData('text/plain', card.outerHTML);
            card.style.marginLeft = currentMargin;
        });
    });

    // Functionality for the First Dropbox:
    startingBox.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    startingBox.addEventListener('drop', (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        addCard(startingBox, data);
    });
});