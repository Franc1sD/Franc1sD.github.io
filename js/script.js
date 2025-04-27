const clickableCards = document.querySelectorAll('.card-clickable');

clickableCards.forEach(card => {
    card.addEventListener('click', async function(event) {
        event.preventDefault(); 
        const href = this.getAttribute('href');
        await loadContent(href);
        window.history.pushState(null, document.title, href);
    });
});