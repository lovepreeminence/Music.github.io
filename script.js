const songs = [
  {
    title: "无名的人",
    artist: "毛不易",
    file: "music/song1.mp3",
    cover: "https://img01.dmhmusic.com/0208/M00/37/1B/ChR47GetpOGAFt3DAAjO_c8HpFA556.jpg@w_300,h_300",
    lrc: "music/song1.lrc"
  },
  {
    title: "山水之间",
    artist: "许嵩",
    file: "music/song2.mp3",
    cover: "https://d.musicapp.migu.cn/data/oss/resource/00/4u/t4/083715a7c81040fd8b2037aae246f8d9.webp",
    lrc: "https://www.kugeci.com/download/lrc/QEOXEkrv"
  },
  {
    title: "珠玉",
    artist: "单依纯",
    file: "https://freetyst.nf.migu.cn/public/product9th/product47/2025/05/1511/2025%E5%B9%B405%E6%9C%8815%E6%97%A510%E7%82%B943%E5%88%86%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A5%E6%AC%A2%E5%94%B1%E7%BD%91%E7%BB%9C1%E9%A6%96315212/%E6%A0%87%E6%B8%85%E9%AB%98%E6%B8%85/MP3_128_16_Stero/6953481HWN7114610.mp3?channelid=02&msisdn=5fd9f9e8-fa96-499b-bd83-c3dcf6f3a69f&Tim=1748172643052&Key=c6a0874a80690eba",
    cover: "https://d.musicapp.migu.cn/data/oss/resource/00/53/ed/62b13735aba14ca2a78e7bac08a800cc.webp",
    lrc: "https://www.kugeci.com/download/lrc/jS4Kjysa"
  }
];

//https://music.migu.cn/v5/ https://www.kugeci.com/
// DOM元素
const songList = document.getElementById('song-list');
const audioPlayer = document.getElementById('audio-player');
const currentSongDisplay = document.getElementById('current-song');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const rotatingDisc = document.getElementById('rotating-disc');
const albumCover = document.getElementById('album-cover');
const lyricsList = document.getElementById('lyrics-list');

// 状态变量
let currentSongIndex = 0;
let lrcData = [];
let lastHighlightedIndex = -1;

// 初始化歌曲列表
function initSongList() {
  songList.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${song.cover}" class="song-cover" alt="${song.title}">
      <div class="song-info">
        <span class="song-title">${song.title}</span>
        <span class="song-artist">${song.artist}</span>
      </div>
    `;
    li.addEventListener('click', () => playSong(index));
    songList.appendChild(li);
  });
}

// 播放歌曲
function playSong(index) {
  if (index >= 0 && index < songs.length) {
    currentSongIndex = index;
    const song = songs[index];
    
    // 更新UI显示
    currentSongDisplay.textContent = `${song.title} - ${song.artist}`;
    albumCover.src = song.cover;
    
    // 设置音频源
    audioPlayer.src = song.file;
    
    // 加载歌词
    loadLRC(song.lrc);
    
    // 播放音频
    audioPlayer.play().catch(e => {
      console.error("播放失败:", e);
      alert("播放失败，请检查网络或歌曲链接");
    });
  }
}

// 其他函数保持不变（playNext, playPrev, loadLRC, parseLRC等）...

// 初始化
initSongList();
