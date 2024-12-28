//API Key, Player-1, Player-2 and Start Game Button.

const API_KEY = 'ApiKeyAuth';
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const gameButton = document.getElementById('startGame');


// Function to handle the "Start Game" button click on index.html
const startGame = async () => {
    
    
    const player1 = player1Input.value.trim();
    const player2 = player2Input.value.trim();
    
    if (player1 === '' || player2 === '') {
        alert('Enter player names correctly');
        return;
    }

    try {
        const response = await fetch('https://the-trivia-api.com/v2/metadata', {
            headers: {
                'Accept': 'application/json',
                'X-API-Key': API_KEY  
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); 
        const categories = Object.keys(data.byCategory);

        // Save player names and categories in sessionStorage
        sessionStorage.setItem('player1', player1);
        sessionStorage.setItem('player2', player2);
        sessionStorage.setItem('categories', JSON.stringify(categories));  // Save categories as string

        // Redirect to selection page
        window.location.href = "selection.html";

    } catch (err) {
        console.error('Error fetching trivia data:', err);
    }
};

// Function to initialize the game based on the page loaded
gameButton.addEventListener('click', startGame);
   

