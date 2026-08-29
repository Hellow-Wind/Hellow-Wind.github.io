// ===== 歌单 =====
let currentSongIndex = 0;
let isPlaying = false;
let isRepeat = false;

// ===== 播放器元素 =====
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progress = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const songTitleDisplay = document.getElementById('songTitle');
const playlistToggle = document.getElementById('playlistToggle');
const playlistPanel = document.getElementById('playlistPanel');
const playlistList = document.getElementById('playlistList');
const volumeControl = document.getElementById('volumeControl');
const volumeIcon = document.getElementById('volumeIcon');
const coverImg = document.getElementById('coverImg');

let songList = [];

// ===== 加载歌单 =====
fetch('music/songs.json')
    .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    })
    .then(data => {
        songList = data;
        if (songList.length > 0) {
            audio.src = 'music/' + songList[0];
            songTitleDisplay.textContent = songList[0].replace('.mp3', '');
            renderPlaylist();
        }
    })
    .catch(err => {
        console.error('歌单加载失败：', err);
        songTitleDisplay.textContent = '⚠️ 加载失败';
    });

// ===== 渲染歌单列表 =====
function renderPlaylist() {
    playlistList.innerHTML = '';
    songList.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.replace('.mp3', '');
        if (index === currentSongIndex) {
            li.style.fontWeight = '600';
            li.style.color = '#ec4141';
        }
        li.onclick = () => playSong(index);
        playlistList.appendChild(li);
    });
}

// ===== 播放指定歌曲 =====
function playSong(index) {
    if (index < 0 || index >= songList.length) return;
    currentSongIndex = index;
    audio.src = 'music/' + songList[index];
    songTitleDisplay.textContent = songList[index].replace('.mp3', '');
    audio.play();
    isPlaying = true;
    playBtn.querySelector('.play-icon').classList.add('paused');
    renderPlaylist();
}

// ===== 播放/暂停 =====
playBtn.onclick = () => {
    const icon = playBtn.querySelector('.play-icon');
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        icon.classList.remove('paused');
    } else {
        audio.play();
        isPlaying = true;
        icon.classList.add('paused');
    }
};

// ===== 上一首 =====
prevBtn.onclick = () => {
    if (songList.length === 0) return;
    let index = currentSongIndex - 1;
    if (index < 0) index = songList.length - 1;
    playSong(index);
};

// ===== 下一首 =====
nextBtn.onclick = () => {
    if (songList.length === 0) return;
    let index = currentSongIndex + 1;
    if (index >= songList.length) index = 0;
    playSong(index);
};

// ===== 循环模式 =====
repeatBtn.onclick = () => {
    isRepeat = !isRepeat;
    repeatBtn.textContent = isRepeat ? '🔁' : '🔂';
    repeatBtn.style.color = isRepeat ? '#ec4141' : '#888';
};

// ===== 歌曲播放完自动下一首 =====
audio.onended = () => {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextBtn.onclick();
    }
};

// ===== 更新进度条 =====
audio.ontimeupdate = () => {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.value = percent;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        totalTimeDisplay.textContent = formatTime(audio.duration);
    }
};

// ===== 拖动进度条 =====
progress.oninput = () => {
    if (audio.duration) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
};

// ===== 格式化时间 =====
function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// ===== 歌单面板展开/收起 =====
let playlistVisible = false;
playlistToggle.onclick = () => {
    playlistVisible = !playlistVisible;
    playlistPanel.style.display = playlistVisible ? 'block' : 'none';
};

// ===== 音量控制 =====
volumeControl.oninput = () => {
    const vol = parseFloat(volumeControl.value);
    audio.volume = vol;
    updateVolumeIcon(vol);
};

volumeIcon.onclick = () => {
    if (audio.volume > 0) {
        audio.volume = 0;
        volumeControl.value = 0;
        volumeIcon.textContent = '🔇';
    } else {
        audio.volume = 0.2;
        volumeControl.value = 0.2;
        volumeIcon.textContent = '🔊';
    }
};

function updateVolumeIcon(vol) {
    if (vol == 0) {
        volumeIcon.textContent = '🔇';
    } else if (vol < 0.5) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
}

// ===== 初始化 =====
audio.volume = 0.2;