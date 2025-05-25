const songs = [
  {
    title: "示例歌曲1",
    artist: "艺术家1",
    file: "music/song1.mp3",
    lrc: "music/song1.lrc"
  }
   {
    title: "示例歌曲2",
    artist: "艺术家2",
    file: "music/son2.mp3",
    lrc: "music/song1.lrc"
  }
 {
    title: "示例歌曲3",
    artist: "艺术家3",
    file: "music/song3.mp3",
    lrc: "music/song1.lrc"
  }
];

const songList = document.getElementById('song-list');
const audioPlayer = document.getElementById('audio-player');
const currentSongDisplay = document.getElementById('current-song');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const rotatingDisc = document.getElementById('rotating-disc');
const lyricsList = document.getElementById('lyrics-list');

let currentSongIndex = 0;
let lrcData = [];

function initSongList() {
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener('click', () => playSong(index));
    songList.appendChild(li);
  });
}

function playSong(index) {
  if (index >= 0 && index < songs.length) {
    currentSongIndex = index;
    const song = songs[index];
    audioPlayer.src = song.file;
    currentSongDisplay.textContent = `${song.title} - ${song.artist}`;
    loadLRC(song.lrc);
    audioPlayer.play();
  }
}

function playNext() {
  const nextIndex = (currentSongIndex + 1) % songs.length;
  playSong(nextIndex);
}

function playPrev() {
  const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(prevIndex);
}

function loadLRC(lrcPath) {
  fetch(lrcPath)
    .then(res => res.text())
    .then(parseLRC)
    .catch(err => {
      console.error("无法加载歌词:", err);
      lrcData = [];
      lyricsList.innerHTML = '';
    });
}

function parseLRC(lrcText) {
  lrcData = [];
  const lines = lrcText.split('\n');
  for (let line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2})(?:.(\d{2,3}))?\](.+)/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const millis = match[3] ? parseInt(match[3].padEnd(3, '0')) : 0;
      const time = minutes * 60 + seconds + millis / 1000;
      lrcData.push({ time, text: match[4] });
    }
  }
  lrcData.sort((a, b) => a.time - b.time);
  renderLyrics();
}

function renderLyrics() {
  lyricsList.innerHTML = '';
  lrcData.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.text;
    lyricsList.appendChild(li);
  });
}

function syncLyrics() {
  const currentTime = audioPlayer.currentTime;
  for (let i = 0; i < lrcData.length; i++) {
    if (currentTime < lrcData[i].time) {
      highlightLyric(i - 1);
      break;
    }
  }
}

function highlightLyric(index) {
  const lis = lyricsList.querySelectorAll('li');
  lis.forEach(li => li.classList.remove('active'));
  if (index >= 0 && index < lis.length) {
    lis[index].classList.add('active');
    lis[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// 事件绑定
playBtn.addEventListener('click', () => {
  if (audioPlayer.src) audioPlayer.play();
  else playSong(0);
});

pauseBtn.addEventListener('click', () => audioPlayer.pause());
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);
audioPlayer.addEventListener('ended', playNext);
audioPlayer.addEventListener('timeupdate', syncLyrics);
audioPlayer.addEventListener('play', () => rotatingDisc.classList.add('rotating'));
audioPlayer.addEventListener('pause', () => rotatingDisc.classList.remove('rotating'));

// 初始化
initSongList();
