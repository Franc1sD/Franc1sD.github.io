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
        const navbarContainer = document.querySelector('.navbar-container');
        const footerContainer = document.querySelector('.footer-container');

        if (navbarContainer) {
            navbarContainer.innerHTML = navbarHtml;
            setupDropdownNavigation();
            setupAjaxNavigation();
        }
        if (footerContainer) footerContainer.innerHTML = footerHtml;

        updatePageTitle(window.location.pathname);

    } catch (error) {
        console.error('Error loading components:', error);
    }
};

async function fetchComponent(name) {
    const response = await fetch(`/components/${name}.html`);
    if (!response.ok) throw new Error(`Failed to load ${name} component`);
    return await response.text();
}

function updatePageTitle(pathname) {
    const pageTitles = {
        '/': 'Gallery Home',
        '/pages/artwork1.html': 'Impression, Sunrise',
        '/pages/artwork2.html': 'The Houses of Parliament, Sunset',
        '/pages/artwork3.html': 'Woman at Her Toilette',
        '/pages/artwork4.html': 'Snow at Louveciennes',
        '/pages/artwork5.html': 'Boulevard Montmartre at Night',
    };
    document.title = `Franc1sD | ${pageTitles[pathname] || 'Default Title'}`;
}

function setupDropdownNavigation() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropdownButton = dropdown.querySelector('.drop-btn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        const dropdownLinks = dropdownContent ? dropdownContent.querySelectorAll('a') : [];

        if (dropdownButton && dropdownContent) {
            // Mobile-first: Toggle on tap
            dropdownButton.addEventListener('click', (event) => {
                event.preventDefault();
                dropdown.classList.toggle('active');
                dropdownContent.style.display = dropdown.classList.contains('active') ? 'block' : 'none';
            });

            // Close dropdown on link click
            dropdownLinks.forEach(link => {
                link.addEventListener('click', () => {
                    dropdown.classList.remove('active');
                    dropdownContent.style.display = 'none';
                });
            });
        }

        dropdown.addEventListener('mouseenter', function () {
            if (!this.classList.contains('active')) {
                this.querySelector('.dropdown-content').style.display = 'block';
            }
        });

        dropdown.addEventListener('mouseleave', function () {
            if (!this.classList.contains('active')) {
                this.querySelector('.dropdown-content').style.display = 'none';
            }
        });
    });
    document.addEventListener('click', (event) => {
        dropdowns.forEach(dropdown => {
            if (dropdown.classList.contains('active') && !dropdown.contains(event.target)) {
                dropdown.classList.remove('active');
                const dropdownContent = dropdown.querySelector('.dropdown-content');
                if (dropdownContent) {
                    dropdownContent.style.display = 'none';
                }
            }
        });
    });
}

function setupAjaxNavigation() {
    const navLinks = document.querySelectorAll('a[href^="/pages/"], a[href="/"]');
    navLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const href = link.getAttribute('href');
            await loadContent(href);
            window.history.pushState(null, document.title, href);
        });
    });

    window.addEventListener('popstate', () => {
        loadContent(window.location.pathname);
    });
}



// Asynchronous function to load content via AJAX
async function loadContent(url) {
    const contentContainer = document.querySelector('.main-content');
    if (!contentContainer) return;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load page: ${url}`);
        }
        const newHtml = await response.text();
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = newHtml;
        const newContent = tempContainer.querySelector('.main-content');

        if (newContent) {
            contentContainer.innerHTML = newContent.innerHTML;
            updatePageTitle(url);
        } else {
            console.error('Main content not found in the fetched HTML.');
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}