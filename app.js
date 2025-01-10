const apiKey = "AIzaSyB1JleU1C4L6Hbh0AXXp5Gy9hlXJ2VuJww";  // Your YouTube API Key
const searchBar = document.getElementById("searchBar");
const resultsDiv = document.getElementById("results");
const loadingIndicator = document.getElementById("loading");
const playlistDiv = document.getElementById("playlist");
const playlistItemsDiv = document.getElementById("playlistItems");

let playlist = [];  // Array to store playlist items

// Search Songs from YouTube API
function searchSongs() {
  const query = searchBar.value;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}`;

  loadingIndicator.style.display = "block"; // Show loading indicator

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
          <img src="${thumbnail}" alt="Song Thumbnail" class="song-image" onclick="playMusic('${videoId}')">
          <div class="song-details">
            <div class="song-title">${title}</div>
            <div class="song-artist">${channel}</div>
            <div class="song-duration" id="duration-${videoId}">Loading...</div>
            <button onclick="addToPlaylist('${title}', '${videoId}')">Add to Playlist</button>
          </div>
        `;

        // Fetch video duration
        fetchVideoDuration(videoId, songItem);

        resultsDiv.appendChild(songItem);
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      loadingIndicator.style.display = "none"; // Hide loading indicator
    });
}

// Fetch video duration
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

// Format duration (ISO 8601 to MM:SS)
function formatDuration(duration) {
  const match = duration.match(/PT(\d+)M(\d+)S/);
  if (match) {
    return `${match[1]}:${match[2].padStart(2, '0')}`;
  }
  return "Unknown Duration";
}

// Play music (embed YouTube video)
function playMusic(videoId) {
  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  const iframe = document.createElement("iframe");
  iframe.src = videoUrl;
  iframe.width = "100%";
  iframe.height = "400";
  iframe.frameBorder = "0";
  iframe.allow = "autoplay; encrypted-media";
  const playerDiv = document.getElementById("results");
  playerDiv.innerHTML = "";
  playerDiv.appendChild(iframe);
}

// Add song to playlist
function addToPlaylist(title, videoId) {
  const playlistItem = { title, videoId };
  playlist.push(playlistItem);
  updatePlaylist();
}

// Update playlist UI
function updatePlaylist() {
  playlistItemsDiv.innerHTML = "";
  playlist.forEach(item => {
    const playlistItemDiv = document.createElement("div");
    playlistItemDiv.classList.add("playlistItem");
    playlistItemDiv.innerHTML = `
      <div>${item.title}</div>
      <button onclick="removeFromPlaylist('${item.videoId}')">Remove</button>
    `;
    playlistItemsDiv.appendChild(playlistItemDiv);
  });
}

// Remove song from playlist
function removeFromPlaylist(videoId) {
  playlist = playlist.filter(item => item.videoId !== videoId);
  updatePlaylist();
}

// Show Playlist
function showPlaylist() {
  playlistDiv.style.display = playlistDiv.style.display === "none" ? "block" : "none";
}
