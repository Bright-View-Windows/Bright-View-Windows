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

const reviewData = [
    {
        name: 'Matt M.',
        rating: 5,
        service: 'Residential Cleaning',//either residential or commercial or maintenance 
        date: 'May 2026',
        text: 'The team did a great job and communication was excellentil A group of young adults starting a business and would encourage you to look at this team for your future exterior window cleaning needs!',
        keywords: []//dont have anything
    }
];

const reviewsGrid = document.getElementById('reviews-grid');
const reviewSearch = document.getElementById('review-search');
const reviewRating = document.getElementById('review-rating');
const reviewResults = document.getElementById('reviews-results');
const reviewEmpty = document.getElementById('reviews-empty');
const reviewTemplate = document.getElementById('review-card-template');

function normalizeText(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function buildStars(rating) {
    return Array.from({ length: 5 }, (_, index) => (
        `<i class="fa${index < rating ? 's' : 'r'} fa-star" aria-hidden="true"></i>`
    )).join('');
}

function renderReviews() {
    if (!reviewsGrid || !reviewTemplate) return;

    reviewsGrid.innerHTML = '';

    reviewData.forEach((review, index) => {
        const fragment = reviewTemplate.content.cloneNode(true);
        const card = fragment.querySelector('[data-review-card]');
        const stars = fragment.querySelector('[data-review-stars]');
        const name = fragment.querySelector('[data-review-name]');
        const service = fragment.querySelector('[data-review-service]');
        const date = fragment.querySelector('[data-review-date]');
        const text = fragment.querySelector('[data-review-text]');
        const tags = fragment.querySelector('[data-review-tags]');

        card.dataset.name = review.name;
        card.dataset.rating = String(review.rating);
        card.dataset.service = review.service;
        card.dataset.keywords = review.keywords.join(' ');
        card.dataset.search = normalizeText([
            review.name,
            review.service,
            review.text,
            review.rating,
            `${review.rating} star`,
            'star stars five star five-star',
            review.keywords.join(' ')
        ].join(' '));

        card.style.setProperty('--reveal-delay', `${Math.min(index * 70, 350)}ms`);
        stars.innerHTML = buildStars(review.rating);
        name.textContent = review.name;
        service.textContent = review.service;
        date.textContent = review.date;
        text.textContent = review.text;
        if (tags) {
            tags.innerHTML = review.keywords
                .slice(0, 4)
                .map(tag => `<span class="review-tag">${tag}</span>`)
                .join('');
        }

        reviewsGrid.appendChild(fragment);
        if (observer && card.classList.contains('reveal-on-scroll')) {
            observer.observe(card);
        }
    });

    filterReviews();
}

function filterReviews() {
    if (!reviewsGrid) return;

    const query = normalizeText(reviewSearch?.value || '');
    const selectedRating = reviewRating?.value || 'all';
    const cards = Array.from(reviewsGrid.querySelectorAll('[data-review-card]'));

    let visibleCount = 0;

    cards.forEach(card => {
        const searchText = card.dataset.search || '';
        const rating = Number(card.dataset.rating || '0');
        const matchesQuery = !query || searchText.includes(query);
        const matchesRating = selectedRating === 'all' || rating === Number(selectedRating);
        const isVisible = matchesQuery && matchesRating;

        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
    });

    if (reviewResults) {
        reviewResults.textContent = `${visibleCount} review${visibleCount === 1 ? '' : 's'} shown`;
    }

    if (reviewEmpty) {
        reviewEmpty.hidden = visibleCount !== 0;
    }
}

if (reviewsGrid && reviewTemplate) {
    renderReviews();

    reviewSearch?.addEventListener('input', filterReviews);
    reviewRating?.addEventListener('change', filterReviews);
}
