// Review data - add your customer reviews here
const reviewData = [
    // Example structure - delete this and add your real reviews:
    // {
    //     name: "John Smith",
    //     stars: 5,
    //     service: "Residential Cleaning",
    //     date: "June 2026",
    //     text: "Amazing work! The windows look crystal clear. Highly recommended!",
    //     tags: ["streak-free", "professional", "fast"]
    // }
];

// DOM elements
const reviewsGrid = document.getElementById('reviews-grid');
const reviewsEmpty = document.getElementById('reviews-empty');
const reviewsResults = document.getElementById('reviews-results');
const reviewSearchInput = document.getElementById('review-search');
const reviewRatingSelect = document.getElementById('review-rating');
const template = document.getElementById('review-card-template');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderReviews(reviewData);
    setupEventListeners();
});

// Setup search and filter event listeners
function setupEventListeners() {
    reviewSearchInput.addEventListener('input', filterReviews);
    reviewRatingSelect.addEventListener('change', filterReviews);
}

// Filter reviews based on search and rating
function filterReviews() {
    const searchTerm = reviewSearchInput.value.toLowerCase();
    const selectedRating = reviewRatingSelect.value;

    const filtered = reviewData.filter(review => {
        const matchesSearch = 
            review.name.toLowerCase().includes(searchTerm) ||
            review.service.toLowerCase().includes(searchTerm) ||
            review.text.toLowerCase().includes(searchTerm) ||
            review.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        const matchesRating = selectedRating === 'all' || review.stars === parseInt(selectedRating);

        return matchesSearch && matchesRating;
    });

    renderReviews(filtered);
}

// Render reviews to the page
function renderReviews(reviews) {
    reviewsGrid.innerHTML = '';

    if (reviews.length === 0) {
        reviewsEmpty.hidden = false;
        reviewsResults.textContent = '0 reviews';
        return;
    }

    reviewsEmpty.hidden = true;
    reviewsResults.textContent = `${reviews.length} review${reviews.length !== 1 ? 's' : ''}`;

    reviews.forEach(review => {
        const clone = template.content.cloneNode(true);

        // Set star rating
        const starsDiv = clone.querySelector('[data-review-stars]');
        starsDiv.innerHTML = '⭐'.repeat(review.stars);
        starsDiv.setAttribute('aria-label', `${review.stars} star${review.stars !== 1 ? 's' : ''}`);

        // Set review text
        clone.querySelector('[data-review-name]').textContent = review.name;
        clone.querySelector('[data-review-service]').textContent = review.service;
        clone.querySelector('[data-review-date]').textContent = review.date;
        clone.querySelector('[data-review-text]').textContent = review.text;

        // Set tags
        const tagsDiv = clone.querySelector('[data-review-tags]');
        tagsDiv.innerHTML = review.tags
            .map(tag => `<span class="tag">${tag}</span>`)
            .join('');

        reviewsGrid.appendChild(clone);
    });
}

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navbar.style.display = isExpanded ? 'none' : 'flex';
    });
}

// Smooth scroll for reveal on scroll effect
const revealOnScroll = () => {
    const cards = document.querySelectorAll('.reveal-on-scroll');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();