document.addEventListener('DOMContentLoaded', loadAllComponents);

async function loadAllComponents() {
    try {
        // Load components from external files
        const [headHtml, navbarHtml, footerHtml] = await Promise.all([
            fetchComponent('head'),
            fetchComponent('navbar'),
            fetchComponent('footer')
        ]);

        document.head.insertAdjacentHTML('beforeend', headHtml);
        const pageTitles = {
            '/': 'Gallery Home',
            '/pages/artwork1.html': 'Impression, Sunrise',
            '/pages/artwork2.html': 'The Houses of Parliament, Sunset',
            '/pages/artwork3.html': 'Woman at Her Toilette',
            '/pages/artwork4.html': 'Snow at Louveciennes',
            '/pages/artwork5.html': 'Boulevard Montmartre at Night',
        };
        const path = window.location.pathname;
        document.title = `Franc1sD | ${pageTitles[path] || 'Default Title'}`;

        const navbarContainer = document.querySelector('.navbar-container');
        const footerContainer = document.querySelector('.footer-container');

        if (navbarContainer) {
            navbarContainer.innerHTML = navbarHtml;
            setupDropdownNavigation();
        }
        if (footerContainer) footerContainer.innerHTML = footerHtml;


    } catch (error) {
        console.error('Error loading components:', error);
    }
};

async function fetchComponent(name) {
    const response = await fetch(`/components/${name}.html`);
    if (!response.ok) throw new Error(`Failed to load ${name} component`);
    return await response.text();
}

function setupDropdownNavigation() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function () {
            this.querySelector('.dropdown-content').style.display = 'block';
        });

        dropdown.addEventListener('mouseleave', function () {
            this.querySelector('.dropdown-content').style.display = 'none';
        });
    });
}