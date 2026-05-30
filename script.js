const menuButton = document.getElementById('menu-toggle');
const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');

function setMenuState(isOpen) {
    if (!menuButton || !bar || !nav) return;
    nav.classList.toggle('active', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
    document.documentElement.classList.toggle('nav-open', isOpen);
    menuButton.classList.toggle('is-open', isOpen);
    bar.classList.toggle('fa-bars', !isOpen);
    bar.classList.toggle('fa-xmark', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

if (menuButton && bar && nav) {
    menuButton.addEventListener('click', () => {
        setMenuState(!nav.classList.contains('active'));
    });

    nav.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('active')) {
            setMenuState(false);
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img.logo').forEach(img => {
        img.addEventListener('error', () => {
            if (img.src && !img.src.endsWith('img/logo.png')) {
                img.src = 'img/logo.png';
            }
        });
    });
});

// Scroll animation for reveal-on-scroll elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
});

const estimateForm = document.getElementById('estimate-form');
const estimateStatus = document.getElementById('estimate-status');

if (estimateForm) {
    const usesFormspree = estimateForm.action.includes('formspree.io');

    if (usesFormspree) {
        estimateForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (estimateStatus) {
                estimateStatus.textContent = 'Sending request...';
            }

            try {
                const response = await fetch(estimateForm.action, {
                    method: 'POST',
                    body: new FormData(estimateForm),
                    headers: {
                        Accept: 'application/json'
                    }
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(result?.error || 'Request failed');
                }

                estimateForm.reset();
                if (estimateStatus) {
                    estimateStatus.textContent = 'Request sent successfully. We will contact you soon.';
                }
            } catch (error) {
                console.error('Formspree submit failed:', error);
                if (estimateStatus) {
                    estimateStatus.textContent = error?.message ? `Could not send right now: ${error.message}` : 'Could not send right now. Please try again in a moment.';
                }
            }
        });
    } else {
        estimateForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(estimateForm);
            const name = String(formData.get('name') || '').trim();
            const email = String(formData.get('email') || '').trim();
            const phone = String(formData.get('phone') || '').trim();
            const address = String(formData.get('address') || '').trim();
            const details = String(formData.get('details') || '').trim();

            if (estimateStatus) {
                estimateStatus.textContent = 'Sending request...';
            }

            try {
                const response = await fetch('/api/estimate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        address,
                        details
                    })
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok || !result.ok) {
                    throw new Error(result.message || 'Request failed');
                }

                estimateForm.reset();
                if (estimateStatus) {
                    estimateStatus.textContent = 'Request sent successfully. We will contact you soon.';
                }
            } catch (error) {
                console.error('Estimate submit failed:', error);
                if (estimateStatus) {
                    estimateStatus.textContent = error?.message ? `Could not send right now: ${error.message}` : 'Could not send right now. Please try again in a moment.';
                }
            }
        });
    }
}
