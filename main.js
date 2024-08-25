const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const PLAYER_STORAGE_KEY = 'HTTIEN_PLAYER'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Vết Mưa',
            singer: 'Tran Tien',
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.jpg'

        },
        {
            name: 'Vùng Trời Bình Yên',
            singer: 'Tran Tien',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'

        },
        {
            name: 'Xi Măng Phố Vol 1',
            singer: 'Tran Tien',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'

        },
        {
            name: 'Xi Măng Phố Vol 2',
            singer: 'Tran Tien',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'

        },
        {
            name: 'Xi Măng Phố Vol 3',
            singer: 'Tran Tien',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'

        },
        {
            name: 'Xi Măng Phố Vol 4',
            singer: 'Tran Tien',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'

        },
        {
            name: 'Xi Măng Phố Vol 5',
            singer: 'Tran Tien',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'

        },
        {
            name: 'Xi Măng Phố Vol 6',
            singer: 'Tran Tien',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'

        },
        {
            name: 'Xi Măng Phố Vol 7',
            singer: 'Tran Tien',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'

        },
        {
            name: 'Xi Măng Phố Vol 8',
            singer: 'Tran Tien',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'

        },
        {
            name: 'Xi Măng Phố Vol 9',
            singer: 'Tran Tien',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'

        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))

    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb"
                            style="background-image: url('${song.image}');">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // xu ly CD quay/dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //100 sec
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //zoom CD 
        document.onscroll = function () {

            const scrollTop = window.scrollY
            const newCdWidth = cdWidth - scrollTop
            //console.log(newCdWidth)
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // xu ly khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }

        }
        // khi song dc play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khi song bi pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent

            }

        }
        //xu ly khi tua song
        progress.oninput = function (e) {
            const seekTime = (e.target.value / 100) * audio.duration
            audio.currentTime = seekTime

        }
        //khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandom()
            } else {
                _this.nextSong()
            }

            audio.play()
        }
        prevBtn.onclick = function name(params) {
            if (_this.isRandom) {
                _this.playRandom()
            } else {
                _this.prevSong()
            }
            audio.play()
        }

        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //xu ly next khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }

        }
        //lang nghe click vao playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            const optionNode = e.target.closest('.option')
            if (songNode || optionNode) {
                //xu ly khi click vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.updateActiveSong()
                    audio.play()
                }
                //xu ly khi click vao option
                if (optionNode) {
                    console.log('option')
                }
            }

        }

    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        this.updateActiveSong();
        this.scrollToActiveSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
        this.updateActiveSong();
        this.scrollToActiveSong()
    },
    playRandom: function name(params) {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex
        this.loadCurrentSong()
        this.updateActiveSong();
        this.scrollToActiveSong()
    },
    updateActiveSong: function () {
        // Xóa class 'active' khỏi bài hát hiện tại
        const currentActive = $('.song.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        // Thêm class 'active' vào bài hát mới
        const newActive = $$('.song')[this.currentIndex];
        if (newActive) {
            newActive.classList.add('active');
        }
    },
    scrollToActiveSong: function name(params) {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            })
        }, 500)
    },
    start: function () {
        //gan cau hinh vao ung dung
        this.loadConfig()
        //dinh nghia cac thuoc tinh cho obj
        this.defineProperties()

        //lang nghe/xu ly cac su kien
        this.handleEvents() // thu nho CD
        //tai thong tin bai hat dau tien vao UI
        this.loadCurrentSong()

        this.render() // hien thi list nhac
        //hien thi trang thai ban dau cua btn repeat vs random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
};

app.start();


// Render songs
// Scroll top
// Play / pause / seek:tua
// CD rotate
// Next / prev
// Random
// Next / Repeat when ended
// Active song
// Scroll active song into view
// Play song when click