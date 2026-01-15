console.log("Spotify Clone JS Loaded");

let audio = new Audio();
let songs = [];
let currentSongIndex = 0;

// DOM elements
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("previous");
const playlist = document.getElementById("playlist");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");
const volumeSlider = document.getElementById("volumeRange");

// ================= FETCH SONGS =================
async function getSongs() {
    let response = await fetch("http://127.0.0.1:5500/songs/");
    let html = await response.text();

    let div = document.createElement("div");
    div.innerHTML = html;

    let links = div.getElementsByTagName("a");

    songs = [];
    playlist.innerHTML = "";

    for (let link of links) {
        if (link.href.endsWith(".mp3")) {
            songs.push(link.href);

            let li = document.createElement("li");
            li.textContent = decodeURIComponent(link.href.split("/").pop());

            li.addEventListener("click", () => {
                playSong(songs.indexOf(link.href));
            });

            playlist.appendChild(li);
        }
    }
}

// ================= PLAY SONG =================
function playSong(index) {
    currentSongIndex = index;
    audio.src = songs[currentSongIndex];
    audio.play();

    playBtn.style.display = "none";
    pauseBtn.style.display = "inline";

    highlightCurrentSong();
}

// ================= HIGHLIGHT CURRENT SONG =================
function highlightCurrentSong() {
    let allLis = document.querySelectorAll("#playlist li");
    allLis.forEach(li => li.classList.remove("current-song"));
    if (allLis[currentSongIndex]) {
        allLis[currentSongIndex].classList.add("current-song");
    }
}

// ================= PLAY / PAUSE =================
playBtn.addEventListener("click", () => {
    audio.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline";
});

pauseBtn.addEventListener("click", () => {
    audio.pause();
    pauseBtn.style.display = "none";
    playBtn.style.display = "inline";
});

// ================= NEXT / PREVIOUS =================
nextBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
});

prevBtn.addEventListener("click", () => {
    currentSongIndex =
        (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
});

// ================= PROGRESS BAR SYNC =================
audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    let progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = progress + "%";
});

progressContainer.addEventListener("click", (e) => {
    let width = progressContainer.clientWidth;
    let clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});

// ================= AUTO PLAY NEXT =================
audio.addEventListener("ended", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
});

// ================= VOLUME CONTROL =================
volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
});

// ================= INIT =================
getSongs();
