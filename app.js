const apiKey = "AIzaSyB1JleU1C4L6Hbh0AXXp5Gy9hlXJ2VuJww";  // Your YouTube API Key
const searchBar = document.getElementById("searchBar");
const resultsDiv = document.getElementById("results");

function searchSongs() {
  const query = searchBar.value;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      resultsDiv.innerHTML = "";
      data.items.forEach(item => {
        const videoId = item.id.videoId;
        const thumbnail = item.snippet.thumbnails.medium.url;
        const title = item.snippet.title;
        const channel = item.snippet.channelTitle;
        
        // Construct song item
        const songItem = document.createElement("div");
        songItem.classList.add("song-item");
        songItem.innerHTML = `
          <img src="${thumbnail}" alt="Song Thumbnail" class="song-image">
          <div class="song-details">
            <div class="song-title">${title}</div>
            <div class="song-artist">${channel}</div>
            <div class="song-duration">Loading...</div>
          </div>
        `;
        
        // Fetch video duration
        fetchVideoDuration(videoId, songItem);

        resultsDiv.appendChild(songItem);
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

function fetchVideoDuration(videoId, songItem) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const duration = data.items[0].contentDetails.duration;
      const formattedDuration = formatDuration(duration);
      songItem.querySelector('.song-duration').innerText = formattedDuration;
    });
}

function formatDuration(duration) {
  // Format ISO 8601 duration (PT#M#S) to a more readable format (MM:SS)
  const match = duration.match(/PT(\d+)M(\d+)S/);
  if (match) {
    return `${match[1]}:${match[2].padStart(2, '0')}`;
  }
  return "Unknown Duration";
}
