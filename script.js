// 音乐库
const songs = [
    {
        title: "示例歌曲1",
        artist: "艺术家1",
        file: "music/song1.mp3"
    },
    {
        title: "示例歌曲2",
        artist: "艺术家2",
        file: "music/song2.mp3"
    },
    {
        title: "示例歌曲3",
        artist: "艺术家3",
        file: "music/song3.mp3"
    },
    {
        title: "野路",
        artist: "许嵩",
        file: "music/许嵩-野路.mp3"
    },

    // 添加更多歌曲...
];

// DOM元素
const songList = document.getElementById('song-list');
const audioPlayer = document.getElementById('audio-player');
const currentSongDisplay = document.getElementById('current-song');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// 当前播放索引
let currentSongIndex = 0;

// 初始化歌曲列表
function initSongList() {
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = `${song.title} - ${song.artist}`;
        li.addEventListener('click', () => playSong(index));
        songList.appendChild(li);
    });
}

// 播放歌曲
function playSong(index) {
    if (index >= 0 && index < songs.length) {
        currentSongIndex = index;
        const song = songs[currentSongIndex];
        audioPlayer.src = song.file;
        currentSongDisplay.textContent = `${song.title} - ${song.artist}`;
        audioPlayer.play();
    }
}

// 播放下一首
function playNext() {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    playSong(nextIndex);
}

// 播放上一首
function playPrev() {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(prevIndex);
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

// 歌曲结束时自动播放下一首
audioPlayer.addEventListener('ended', playNext);

// 初始化
initSongList();
