document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const locationFilter = document.getElementById('location-filter');
    const durationFilter = document.getElementById('duration-filter');
    const compensationFilter = document.getElementById('compensation-filter');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort');
    const listingsContainer = document.querySelector('.listings');
    const listingCards = document.querySelectorAll('.listing-card');
    const paginationButtons = document.querySelectorAll('.page-btn');
    const resultsCount = document.querySelector('.results-info strong');

    let listings = Array.from(listingCards).map(card => {
        const title = card.querySelector('h3').textContent;
        const company = card.querySelector('.company-name').textContent;
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent);
        const location = card.querySelectorAll('.info-row')[0].querySelectorAll('.info-item')[0].querySelector('span:nth-child(2)').textContent;
        const compensation = card.querySelectorAll('.info-row')[0].querySelectorAll('.info-item')[1].querySelector('span:nth-child(2)').textContent;
        const duration = card.querySelectorAll('.info-row')[1].querySelectorAll('.info-item')[0].querySelector('span:nth-child(2)').textContent;
        const postedDate = card.querySelector('.date').textContent.replace('Posted ', '');
        const season = card.querySelectorAll('.info-row')[1].querySelectorAll('.info-item')[1].textContent.trim();

        return {
            element: card,
            title,
            company,
            tags,
            location,
            compensation,
            duration,
            postedDate,
            season,
            visible: true
        };
    });

    const originalListings = [...listings];

    function parseDuration(durationStr) {
        durationStr = durationStr.toLowerCase().trim();
        let months = 0;
        const monthMatch = durationStr.match(/(\d+)[\s-]*(month|months)/i);
        if (monthMatch && monthMatch[1]) return parseInt(monthMatch[1]);
        const weekMatch = durationStr.match(/(\d+)[\s-]*(week|weeks)/i);
        if (weekMatch && weekMatch[1]) return Math.round(parseInt(weekMatch[1]) / 4.33);
        const dayMatch = durationStr.match(/(\d+)[\s-]*(day|days)/i);
        if (dayMatch && dayMatch[1]) return Math.round(parseInt(dayMatch[1]) / 30);
        if (durationStr.includes('year') || durationStr.includes('annual')) return 12;
        if (durationStr.includes('3')) return 3;
        if (durationStr.includes('6')) return 6;
        return 0;
    }

    function applyFiltersToListing(listing) {
        const locationValue = locationFilter.value.toLowerCase();
        const durationValue = durationFilter.value.toLowerCase();
        const compensationValue = compensationFilter.value.toLowerCase();
        const categoryValue = categoryFilter.value.toLowerCase();

        let visible = true;

        if (locationValue && !listing.location.toLowerCase().includes(locationValue.replace('-', ' '))) visible = false;
        if (categoryValue && !listing.tags.some(tag => tag.toLowerCase().includes(categoryValue))) visible = false;

        if (durationValue) {
            const listingDurationMonths = parseDuration(listing.duration);
            if (durationValue === '3-months' && listingDurationMonths !== 3) visible = false;
            else if (durationValue === '6-months' && listingDurationMonths !== 6) visible = false;
            else if (durationValue === 'year-round' && listingDurationMonths < 12) visible = false;
        }

        if (compensationValue) {
            const comp = listing.compensation.toLowerCase();
            if (compensationValue === 'paid' && !comp.includes('$')) visible = false;
            else if (compensationValue === 'unpaid' && !comp.includes('unpaid')) visible = false;
        }

        listing.visible = visible;
        listing.element.style.display = visible ? 'block' : 'none';
    }

    function applyFilters() {
        listings.forEach(listing => {
            applyFiltersToListing(listing);
        });
        updateResultsCount();
    }

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        listings.forEach(listing => {
            const searchableText = `
                ${listing.title.toLowerCase()} 
                ${listing.company.toLowerCase()} 
                ${listing.tags.join(' ').toLowerCase()} 
                ${listing.location.toLowerCase()}`;

            const matchesSearch = searchableText.includes(searchTerm);
            if (matchesSearch) {
                applyFiltersToListing(listing);
            } else {
                listing.visible = false;
                listing.element.style.display = 'none';
            }
        });

        updateResultsCount();
    }

    function updateResultsCount() {
        const visibleCount = listings.filter(listing => listing.visible).length;
        resultsCount.textContent = visibleCount;
    }

    function setupApplyButtons() {
        const applyButtons = document.querySelectorAll('.apply-btn');
        applyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                alert("✅ Application Submitted!");
                btn.textContent = "Applied";
                btn.disabled = true;
                btn.style.backgroundColor = '#4caf50';
                btn.style.color = 'white';
            });
        });
    }

    function sortListings() {
        const sortValue = sortSelect.value;
        listings.sort((a, b) => {
            if (sortValue === 'recent') {
                const dateA = a.postedDate.includes('day') ? parseInt(a.postedDate) : (a.postedDate.includes('week') ? parseInt(a.postedDate) * 7 : 0);
                const dateB = b.postedDate.includes('day') ? parseInt(b.postedDate) : (b.postedDate.includes('week') ? parseInt(b.postedDate) * 7 : 0);
                return dateA - dateB;
            } else {
                return a.company.localeCompare(b.company);
            }
        });

        const listingsFragment = document.createDocumentFragment();
        listings.forEach(listing => {
            if (listing.visible) {
                listingsFragment.appendChild(listing.element);
            }
        });

        listingsContainer.innerHTML = '';
        listingsContainer.appendChild(listingsFragment);
    }

    function resetFilters() {
        searchInput.value = '';
        locationFilter.selectedIndex = 0;
        durationFilter.selectedIndex = 0;
        compensationFilter.selectedIndex = 0;
        categoryFilter.selectedIndex = 0;
        sortSelect.selectedIndex = 0;

        listings = [...originalListings];
        listings.forEach(listing => {
            listing.visible = true;
            listing.element.style.display = 'block';
        });

        updateResultsCount();
    }

    function handlePagination(pageNum) {
        paginationButtons.forEach(btn => btn.classList.remove('active'));
        if (typeof pageNum === 'number') {
            paginationButtons[pageNum - 1].classList.add('active');
        } else {
            const currentActive = document.querySelector('.page-btn.active');
            const currentPage = Array.from(paginationButtons).indexOf(currentActive);
            if (currentPage < paginationButtons.length - 2) {
                paginationButtons[currentPage + 1].classList.add('active');
            } else {
                paginationButtons[0].classList.add('active');
            }
        }
    }

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') handleSearch(); });
    locationFilter.addEventListener('change', applyFilters);
    durationFilter.addEventListener('change', applyFilters);
    compensationFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', () => {
        sortListings();
        applyFilters();
    });
    paginationButtons.forEach((btn, idx) => {
        btn.addEventListener('click', () => handlePagination(isNaN(btn.textContent) ? null : idx + 1));
    });

    applyFilters();
    setupApplyButtons();
});