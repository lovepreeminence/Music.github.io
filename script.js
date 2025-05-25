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
// 下一首
function playNext() {
  const nextIndex = (currentSongIndex + 1) % songs.length;
  playSong(nextIndex);
}

// 上一首
function playPrev() {
  const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(prevIndex);
}

// 加载LRC歌词文件
function loadLRC(lrcPath) {
  fetch(lrcPath)
    .then(response => {
      if (!response.ok) throw new Error("歌词加载失败");
      return response.text();
    })
    .then(text => {
      parseLRC(text);
    })
    .catch(error => {
      console.error("加载歌词错误:", error);
      lyricsList.innerHTML = '<li>歌词加载失败</li>';
      lrcData = [];
    });
}

// 解析LRC歌词
function parseLRC(lrcText) {
  lrcData = [];
  const lines = lrcText.split('\n');
  
  lines.forEach(line => {
    // 匹配时间标签和歌词内容
    const timeTags = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/g);
    const text = line.replace(/\[.*?\]/g, '').trim();
    
    if (timeTags && text) {
      timeTags.forEach(tag => {
        const match = tag.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/);
        if (match) {
          const minutes = parseInt(match[1]);
          const seconds = parseInt(match[2]);
          const milliseconds = parseInt(match[3].padEnd(3, '0'));
          const time = minutes * 60 + seconds + milliseconds / 1000;
          
          lrcData.push({ time, text });
        }
      });
    }
  });
  
  // 按时间排序
  lrcData.sort((a, b) => a.time - b.time);
  
  // 渲染歌词
  renderLyrics();
}

// 渲染歌词到页面
function renderLyrics() {
  lyricsList.innerHTML = '';
  
  if (lrcData.length === 0) {
    lyricsList.innerHTML = '<li>暂无歌词</li>';
    return;
  }
  
  lrcData.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item.text;
    li.dataset.time = item.time;
    li.dataset.index = index;
    lyricsList.appendChild(li);
  });
}

// 同步歌词高亮
function syncLyrics() {
  const currentTime = audioPlayer.currentTime;
  
  // 找到当前应该高亮的歌词行
  let highlightIndex = -1;
  for (let i = 0; i < lrcData.length; i++) {
    if (currentTime >= lrcData[i].time) {
      highlightIndex = i;
    } else {
      break;
    }
  }
  
  // 如果找到需要高亮的行且与上次不同
  if (highlightIndex !== -1 && highlightIndex !== lastHighlightedIndex) {
    // 移除之前的高亮
    const previousHighlighted = document.querySelector('.lyrics li.active');
    if (previousHighlighted) {
      previousHighlighted.classList.remove('active');
    }
    
    // 添加新的高亮
    const currentLi = document.querySelector(`.lyrics li[data-index="${highlightIndex}"]`);
    if (currentLi) {
      currentLi.classList.add('active');
      
      // 滚动到视图中心
      currentLi.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
    
    lastHighlightedIndex = highlightIndex;
  }
}

// 事件监听
playBtn.addEventListener('click', () => {
  if (audioPlayer.src) {
    audioPlayer.play();
  } else {
    playSong(0);
  }
});

pauseBtn.addEventListener('click', () => audioPlayer.pause());
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);

audioPlayer.addEventListener('ended', playNext);
audioPlayer.addEventListener('timeupdate', syncLyrics);
audioPlayer.addEventListener('play', () => {
  rotatingDisc.classList.add('rotating');
});
audioPlayer.addEventListener('pause', () => {
  rotatingDisc.classList.remove('rotating');
});

// 初始化
initSongList();
