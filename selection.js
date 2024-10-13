const Game = document.getElementById('Game');
const addCategory = document.getElementById('addCategories');

const selectCategory = (category) => {
    const addCategory = document.getElementById('addCategories');
    const selection = document.createElement('option');
    selection.value = category;
    selection.innerText = category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
    addCategory.appendChild(selection);
};

const loadCategories = () => {
  

    // Retrieve player names and categories from sessionStorage
    const player1 = sessionStorage.getItem('player1');
    const player2 = sessionStorage.getItem('player2');
    const categories = JSON.parse(sessionStorage.getItem('categories')); 
    const categoryCompleted = sessionStorage.getItem('category'); // Parse categories as array

    if (categories && categories.length > 0) {
        addCategory.innerHTML = '<option value="">Select a Category</option>';  // Reset dropdown
        
        categories.forEach((category) => {
            if(category !== categoryCompleted)
                selectCategory(category);
        });

        addCategory.style.display = 'block';

        // Add submit button for category selection
        if(!document.getElementById('category-selection-btn')){
            const submitSelection = document.createElement('button');
            submitSelection.type = 'submit';
            submitSelection.innerText = 'Submit Selection';
            submitSelection.id = 'category-selection-btn';
            Game.appendChild(submitSelection);
            submitSelection.addEventListener('click', getSelectedCategory);
        }
        
    } else {
        console.error('No categories found.');
    }
};

const getSelectedCategory = () => {
    const addCategory = document.getElementById('addCategories');
    const selectedCategory = addCategory.value;

    if (selectedCategory === "") {
        alert('Select the category');
        return;
    }

    console.log(`Selected category: ${selectedCategory}`);
    

    sessionStorage.setItem('category', selectedCategory);
    window.location.href = 'game.html';
};

const restartGame = sessionStorage.getItem('restartGame');
const score1 = sessionStorage.getItem('score1');
const score2 = sessionStorage.getItem('score2');

if(restartGame){
    loadCategories();
}


window.onload = loadCategories;