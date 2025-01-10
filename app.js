const apiKey = 'AIzaSyB1JleU1C4L6Hbh0AXXp5Gy9hlXJ2VuJww'; // Your YouTube API Key
const searchButton = document.getElementById('search-button');
const searchBar = document.getElementById('search-bar');
const musicResults = document.getElementById('music-results');
const youtubePlayer = document.getElementById('youtube-player');

// Function to search YouTube
async function searchYouTube(query) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}`);
    const data = await response.json();
    displayResults(data.items);
}

// Function to display search results
function displayResults(results) {
    musicResults.innerHTML = '';
    
    results.forEach(item => {
        const videoId = item.id.videoId;
        const title = item.snippet.title;
        const thumbnail = item.snippet.thumbnails.high.url;
        
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <img src="${thumbnail}" alt="${title}" class="thumbnail">
            <div class="result-info">
                <h3>${title}</h3>
                <button class="play-button" onclick="playVideo('${videoId}')">Play</button>
            </div>
        `;
        musicResults.appendChild(resultItem);
    });
}

// Function to play selected video
function playVideo(videoId) {
    youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

// Event listener for search button
searchButton.addEventListener('click', () => {
    const query = searchBar.value;
    if (query) {
        searchYouTube(query);
    }
});

// Event listener for Enter key in search bar
searchBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const query = searchBar.value;
        if (query) {
            searchYouTube(query);
        }
    }
});
