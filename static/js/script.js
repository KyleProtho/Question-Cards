// Global variables
let allQuestions = [];
let filteredQuestions = [];
let selectedQuestions = [];
let currentQuestionIndex = 0;

// Category mapping to CSV columns
const categoryMapping = {
    'vulnerability': 2,
    'sexuality': 3,
    'personal-history': 4,
    'humor': 5,
    'self-reflection': 6,
    'embarrassment': 7,
    'depth': 8,
    'conflict': 9
};

// Deck mapping from sourceFile to display names (will be populated dynamically)
let deckMapping = {};

const categoryNames = {
    'vulnerability': 'Vulnerable',
    'sexuality': 'Intimate',
    'personal-history': 'Personal',
    'humor': 'Funny',
    'self-reflection': 'Reflective',
    'embarrassment': 'Embarrassing',
    'depth': 'Deep',
    'conflict': 'Intense'
};

// DOM elements
const setupPhase = document.getElementById('setup-phase');
const gamePhase = document.getElementById('game-phase');
const startBtn = document.getElementById('start-game');
const newGameBtn = document.getElementById('new-game-btn');
const questionCountInput = document.getElementById('question-count');
const availableCountSpan = document.getElementById('available-count');
const questionText = document.getElementById('question-text');
const categoryTags = document.getElementById('category-tags');
const currentCardSpan = document.getElementById('current-card');
const totalCardsSpan = document.getElementById('total-cards');
const progressFill = document.getElementById('progress-fill');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadQuestions();
    setupEventListeners();
    setupFilterSliders();
});

// Load questions from Flask API
async function loadQuestions() {
    try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allQuestions = data.questions;
        console.log(`Loaded ${allQuestions.length} questions from API`);
        
        // Load decks and categories dynamically
        await loadDecks();
        await loadCategories();
        updateAvailableCount();
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Error loading questions. Please make sure the server is running.');
    }
}

// Load decks from Flask API
async function loadDecks() {
    try {
        const response = await fetch('/api/decks');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const decks = await response.json();
        
        // Populate deck mapping
        deckMapping = {};
        decks.forEach(deck => {
            deckMapping[deck.filename] = deck.displayName;
        });
        
        // Populate deck checkboxes
        const deckCheckboxes = document.getElementById('deck-checkboxes');
        deckCheckboxes.innerHTML = '';
        
        decks.forEach(deck => {
            const checkboxId = `deck-${deck.filename.replace('.json', '').replace('_', '-')}`;
            const label = document.createElement('label');
            label.className = 'deck-checkbox';
            label.innerHTML = `
                <input type="checkbox" id="${checkboxId}" checked>
                <span class="checkmark"></span>
                ${deck.displayName}
            `;
            deckCheckboxes.appendChild(label);
        });
        
        // Add event listeners to the newly created deck checkboxes
        const deckCheckboxes = document.querySelectorAll('.deck-checkbox input[type="checkbox"]');
        deckCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateAvailableCount);
        });
        
        console.log('Loaded decks:', deckMapping);
    } catch (error) {
        console.error('Error loading decks:', error);
    }
}

// Load categories from Flask API
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();
        
        // Populate category filters
        const filterGrid = document.getElementById('filter-grid');
        filterGrid.innerHTML = '';
        
        const categoryEmojis = {
            'vulnerability': '💔',
            'sexuality': '💕',
            'personalHistory': '📖',
            'humor': '😄',
            'selfReflection': '🤔',
            'embarrassment': '😳',
            'depth': '🔗',
            'conflict': '⚡'
        };
        
        const categoryLabels = {
            'vulnerability': 'Vulnerability',
            'sexuality': 'Romance & Sexuality',
            'personalHistory': 'Personal History',
            'humor': 'Humor',
            'selfReflection': 'Self-Reflection',
            'embarrassment': 'Embarrassment Potential',
            'depth': 'Depth of Connection',
            'conflict': 'Conflict Potential'
        };
        
        const defaultValues = {
            'vulnerability': 4,
            'sexuality': 1,
            'personalHistory': 5,
            'humor': 5,
            'selfReflection': 5,
            'embarrassment': 4,
            'depth': 5,
            'conflict': 1
        };
        
        categories.forEach(category => {
            const filterItem = document.createElement('div');
            filterItem.className = 'filter-item';
            filterItem.innerHTML = `
                <label for="${category}">${categoryEmojis[category]} ${categoryLabels[category]}</label>
                <input type="range" id="${category}" min="1" max="5" value="${defaultValues[category]}" class="filter-slider">
                <span class="filter-value">${defaultValues[category]}</span>
            `;
            filterGrid.appendChild(filterItem);
        });
        
        // Add event listeners to the newly created sliders
        addSliderEventListeners();
        
        console.log('Loaded categories:', categories);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startGame);
    newGameBtn.addEventListener('click', resetToSetup);
    prevBtn.addEventListener('click', showPreviousQuestion);
    nextBtn.addEventListener('click', showNextQuestion);
    questionCountInput.addEventListener('input', updateAvailableCount);
    
    // Deck filter event listeners will be added dynamically in loadDecks function
    
    // Add touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!gamePhase.classList.contains('active')) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only handle horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0 && currentQuestionIndex < selectedQuestions.length - 1) {
                // Swipe left - next question
                showNextQuestion();
            } else if (diffX < 0 && currentQuestionIndex > 0) {
                // Swipe right - previous question
                showPreviousQuestion();
            }
        }
    });
}

// Setup filter sliders
function setupFilterSliders() {
    // This will be called after categories are loaded dynamically
    // The event listeners will be added in the loadCategories function
}

// Add event listeners to dynamically created sliders
function addSliderEventListeners() {
    const sliders = document.querySelectorAll('.filter-item input[type="range"]');
    sliders.forEach(slider => {
        const valueSpan = slider.nextElementSibling;
        
        slider.addEventListener('input', function() {
            valueSpan.textContent = this.value;
            updateAvailableCount();
            checkStartButtonState();
        });
    });
}

// Update available question count based on filters
async function updateAvailableCount() {
    try {
        // Get selected decks
        const selectedDecks = getSelectedDecks();
        
        // Get category filters
        const categoryFilters = {};
        const categoryElements = document.querySelectorAll('.filter-item input[type="range"]');
        categoryElements.forEach(slider => {
            categoryFilters[slider.id] = parseInt(slider.value);
        });
        
        // Call Flask API to get filtered questions
        const response = await fetch('/api/questions/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                decks: selectedDecks,
                categories: categoryFilters,
                maxQuestions: 16
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        filteredQuestions = data.questions;
        
        availableCountSpan.textContent = `${filteredQuestions.length} / ${allQuestions.length}`;
        checkStartButtonState();
    } catch (error) {
        console.error('Error updating available count:', error);
        availableCountSpan.textContent = 'Error loading count';
    }
}

// Get selected decks from checkboxes
function getSelectedDecks() {
    const selectedDecks = [];
    const deckCheckboxes = document.querySelectorAll('.deck-checkbox input[type="checkbox"]');
    
    deckCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Map checkbox ID back to sourceFile
            const checkboxId = checkbox.id;
            // Convert deck-36-questions back to the_36_questions.json
            const sourceFile = checkboxId.replace('deck-', '').replace('-', '_') + '.json';
            selectedDecks.push(sourceFile);
        }
    });
    
    return selectedDecks;
}

// Get category value from question object
function getQuestionCategoryValue(question, category) {
    const mapping = {
        'vulnerability': 'vulnerability',
        'sexuality': 'sexuality',
        'personal-history': 'personalHistory',
        'humor': 'humor',
        'self-reflection': 'selfReflection',
        'embarrassment': 'embarrassment',
        'depth': 'depth',
        'conflict': 'conflict'
    };
    
    return question.categories[mapping[category]] || 1;
}

// Check if start button should be enabled
function checkStartButtonState() {
    const requestedCount = parseInt(questionCountInput.value);
    const availableCount = filteredQuestions.length;
    
    startBtn.disabled = requestedCount > availableCount || requestedCount < 1 || requestedCount > 16 || availableCount === 0;
    
    if (requestedCount > availableCount || requestedCount > 16) {
        questionCountInput.style.borderColor = '#e74c3c';
    } else {
        questionCountInput.style.borderColor = '#ddd';
    }
}

// Start the game
async function startGame() {
    const requestedCount = parseInt(questionCountInput.value);
    
    if (requestedCount < 1 || requestedCount > 16) {
        alert('Please select between 1 and 16 questions!');
        return;
    }
    
    try {
        // Get selected decks
        const selectedDecks = getSelectedDecks();
        
        // Get category filters
        const categoryFilters = {};
        const categoryElements = document.querySelectorAll('.filter-item input[type="range"]');
        categoryElements.forEach(slider => {
            categoryFilters[slider.id] = parseInt(slider.value);
        });
        
        // Call Flask API to get filtered questions
        const response = await fetch('/api/questions/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                decks: selectedDecks,
                categories: categoryFilters,
                maxQuestions: requestedCount
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        selectedQuestions = data.questions;
        
        if (selectedQuestions.length < requestedCount) {
            alert(`Only ${selectedQuestions.length} questions available with current filters!`);
            return;
        }
        
        currentQuestionIndex = 0;
        
        // Switch to game phase
        setupPhase.classList.remove('active');
        gamePhase.classList.add('active');
        document.body.classList.add('game-active');
        
        // Update UI
        totalCardsSpan.textContent = selectedQuestions.length;
        showCurrentQuestion();
        updateNavigation();
        updateProgress();
    } catch (error) {
        console.error('Error starting game:', error);
        alert('Error starting game. Please try again.');
    }
}

// Get random questions from filtered list
function getRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Show current question
function showCurrentQuestion() {
    if (selectedQuestions.length === 0) return;
    
    const question = selectedQuestions[currentQuestionIndex];
    questionText.textContent = question.text;
    
    // Update category tags
    categoryTags.innerHTML = '';
    Object.keys(categoryMapping).forEach(category => {
        const value = getQuestionCategoryValue(question, category);
        if (value >= 3) { // Only show categories with medium to high values
            const tag = document.createElement('span');
            tag.className = `category-tag ${value >= 4 ? 'high' : ''}`;
            tag.textContent = categoryNames[category];
            categoryTags.appendChild(tag);
        }
    });
    
    currentCardSpan.textContent = currentQuestionIndex + 1;
}

// Show previous question
function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showCurrentQuestion();
        updateNavigation();
        updateProgress();
    }
}

// Show next question
function showNextQuestion() {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
        currentQuestionIndex++;
        showCurrentQuestion();
        updateNavigation();
        updateProgress();
    }
}

// Update navigation button states
function updateNavigation() {
    const isLastQuestion = currentQuestionIndex === selectedQuestions.length - 1;
    
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = isLastQuestion;
    
    // Add primary styling to Next button (except on last question)
    if (isLastQuestion) {
        nextBtn.classList.remove('primary');
        newGameBtn.classList.add('primary');
    } else {
        nextBtn.classList.add('primary');
        newGameBtn.classList.remove('primary');
    }
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
}

// Reset to setup phase
function resetToSetup() {
    gamePhase.classList.remove('active');
    setupPhase.classList.add('active');
    document.body.classList.remove('game-active');
    
    // Reset state
    selectedQuestions = [];
    currentQuestionIndex = 0;
    
    // Clear primary button styling
    nextBtn.classList.remove('primary');
    newGameBtn.classList.remove('primary');
    
    // Update filters and available count
    updateAvailableCount();
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (!gamePhase.classList.contains('active')) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            if (currentQuestionIndex > 0) showPreviousQuestion();
            break;
        case 'ArrowRight':
            if (currentQuestionIndex < selectedQuestions.length - 1) showNextQuestion();
            break;
        case 'Escape':
            resetToSetup();
            break;
    }
});

// Save filter preferences to localStorage
function saveFilterPreferences() {
    const preferences = {};
    Object.keys(categoryMapping).forEach(category => {
        preferences[category] = document.getElementById(category).value;
    });
    preferences.questionCount = questionCountInput.value;
    
    // Save deck preferences
    preferences.decks = {};
    const deckCheckboxes = document.querySelectorAll('.deck-checkbox input[type="checkbox"]');
    deckCheckboxes.forEach(checkbox => {
        preferences.decks[checkbox.id] = checkbox.checked;
    });
    
    localStorage.setItem('questionCardPreferences', JSON.stringify(preferences));
}

// Load filter preferences from localStorage
function loadFilterPreferences() {
    const saved = localStorage.getItem('questionCardPreferences');
    if (saved) {
        const preferences = JSON.parse(saved);
        Object.keys(categoryMapping).forEach(category => {
            if (preferences[category]) {
                const slider = document.getElementById(category);
                slider.value = preferences[category];
                slider.nextElementSibling.textContent = preferences[category];
            }
        });
        if (preferences.questionCount) {
            questionCountInput.value = preferences.questionCount;
        }
        
        // Load deck preferences
        if (preferences.decks) {
            const deckCheckboxes = document.querySelectorAll('.deck-checkbox input[type="checkbox"]');
            deckCheckboxes.forEach(checkbox => {
                if (preferences.decks.hasOwnProperty(checkbox.id)) {
                    checkbox.checked = preferences.decks[checkbox.id];
                }
            });
        }
    }
}

// Note: localStorage functionality removed for Flask version
// Preferences can be added back if needed