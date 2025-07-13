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

// Load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch('data/truth_or_drink.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allQuestions = data.questions;
        console.log(`Loaded ${allQuestions.length} questions from JSON`);
        updateAvailableCount();
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Error loading questions. Please make sure the JSON file is available.');
    }
}


// Setup event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startGame);
    newGameBtn.addEventListener('click', resetToSetup);
    prevBtn.addEventListener('click', showPreviousQuestion);
    nextBtn.addEventListener('click', showNextQuestion);
    questionCountInput.addEventListener('input', updateAvailableCount);
    
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
    Object.keys(categoryMapping).forEach(category => {
        const slider = document.getElementById(category);
        const valueSpan = slider.nextElementSibling;
        
        slider.addEventListener('input', function() {
            valueSpan.textContent = this.value;
            updateAvailableCount();
            checkStartButtonState();
        });
    });
}

// Update available question count based on filters
function updateAvailableCount() {
    filteredQuestions = allQuestions.filter(question => {
        return Object.keys(categoryMapping).every(category => {
            const sliderValue = parseInt(document.getElementById(category).value);
            const questionValue = getQuestionCategoryValue(question, category);
            return questionValue <= sliderValue;
        });
    });
    
    availableCountSpan.textContent = `${filteredQuestions.length} / ${allQuestions.length}`;
    checkStartButtonState();
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
    
    startBtn.disabled = requestedCount > availableCount || requestedCount < 1 || availableCount === 0;
    
    if (requestedCount > availableCount) {
        questionCountInput.style.borderColor = '#e74c3c';
    } else {
        questionCountInput.style.borderColor = '#ddd';
    }
}

// Start the game
function startGame() {
    const requestedCount = parseInt(questionCountInput.value);
    
    if (requestedCount > filteredQuestions.length) {
        alert('Not enough questions available with current filters!');
        return;
    }
    
    // Randomly select questions
    selectedQuestions = getRandomQuestions(filteredQuestions, requestedCount);
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
    }
}

// Auto-save preferences when they change
Object.keys(categoryMapping).forEach(category => {
    document.getElementById(category).addEventListener('change', saveFilterPreferences);
});
questionCountInput.addEventListener('change', saveFilterPreferences);

// Load preferences on startup
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadFilterPreferences, 100);
});