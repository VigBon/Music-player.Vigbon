// const $ = document.querySelector.bind(document)
// const $$ = document.querySelectorAll.bind(document)

// const app ={
// }
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "MY_PLAYER";
const heading = $("header h2");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const rdBtn = $(".btn-random");
const faceBtn = $(".btn-face");
const player = $(".player");
const progres = $("#progress");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");
const volBtn = $(".btn-volume");
const volBar = $(".volume-bar");
const iconMute = $(".icon-mute");
const iconUnmute = $(".icon-unmute");
const bgColor = $(".dashboard");
const app = {
  currIndex: 0,
  currVol: 1,
  lockVol: 1,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isFace: false,
  configs: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  //Data-Songs
  songs: [
    {
      name: "500 Miles",
      singer: "Justin Timberlake",
      path: "https://audio.jukehost.co.uk/60r5S2rNFQpCSnKirIGNlzveSs6klXAv",
      image: "https://i1.sndcdn.com/artworks-000112928659-83o8mj-t500x500.jpg",
    },
    {
      name: "Tiễn Em Lần Cuối",
      singer: "Trung Hành",
      path: "https://audio.jukehost.co.uk/aLNQRm4NYccoi6rXztg3ED2IiBBq7W5d",
      image:
        "https://avatar-ex-swe.nixcdn.com/singer/avatar/2014/03/31/3/9/8/6/1396249140056_600.jpg",
    },
    {
      name: "LK Người Tình Ngàn Dặm",
      singer: "Ngọc Lan Trang",
      path: "https://audio.jukehost.co.uk/LIAT2DoIiPbvxadiX6CdtPeuh8mWk7Ol",
      image:
        "https://images2.thanhnien.vn/zoom/700_438/528068263637045248/2023/7/9/ngoc-lan-trang-1688897249072488991546-216-0-1069-1364-crop-1688897495755158013134.jpeg",
    },
    {
      name: "Self Control",
      singer: "Laura Branigan",
      path: "https://audio.jukehost.co.uk/QdT6rBnVGgliy48Hw6u8UrjgyNkHzUgo",
      image: "https://www.djprince.no/covers/laura.jpg",
    },
    {
      name: "Cheri Cheri Lady",
      singer: "Modern Talking",
      path: "https://audio.jukehost.co.uk/G3UvJpmWYX90v2YJaZvAnk7AvFxv7576",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/a/b/5/cab58a4408a7c356d5db85b1fa31487f.jpg",
    },
    {
      name: "Brother Louie",
      singer: "Modern Talking",
      path: "https://audio.jukehost.co.uk/nl1jkex593GkE0fhRh1BkJqaexRBmmER",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/a/b/5/cab58a4408a7c356d5db85b1fa31487f.jpg",
    },
    {
      name: "You are My Heart, You are My Soul",
      singer: "Modern Talking",
      path: "https://audio.jukehost.co.uk/Ov9BVMZmWRW8Vs54pZZqf48baFBvhdmt",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/a/b/5/cab58a4408a7c356d5db85b1fa31487f.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${index === this.currIndex ? "active" : ""}" data-index="${index}">
        <div class="thumb" style="background-image: url('${song.image}')"></div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      `;
    });
    playList.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    //Define-CurrSong
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currIndex];
      },
    });
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //Xu ly CD quay / dung
    const cdThumdAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumdAnimate.pause();

    //Xu ly phong to thu nho CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xu ly khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song duoc play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumdAnimate.play();
    };

    // Khi song pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumdAnimate.pause();
    };

    //Khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progres.value = progressPercent;
      }
    };

    // Xu ly khi tua nhac
    progres.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    //Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
    };

    //Xu Ly bat/ tat random song
    rdBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      rdBtn.classList.toggle("active", _this.isRandom);
    };

    //Xu ly lap lai 1 song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    //Xu ly next song khi audio ender
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    //lang nghe hanh vi click vao playlist
    playList.onclick = function (e) {
      const activeSong = e.target.closest(".song:not(.active)");
      const optionSong = e.target.closest(".option");
      if (activeSong || optionSong) {
        //Xu ly khi click vao song
        if(activeSong){
          _this.currIndex = Number(activeSong.dataset.index)
          _this.loadCurrentSong()
          audio.play()
          _this.render()
        }

        //Xu ly khi click vao option
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currIndex++;
    if (this.currIndex >= this.songs.length) {
      this.currIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currIndex--;
    if (this.currIndex < 0) {
      this.currIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * app.songs.length);
    } while (newIndex === this.currIndex);

    this.currIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    //Dinh nghia cac thuoc tinh cho object
    this.defineProperties();

    //lang nge/ xy ly cac su kien
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chay ung dung
    this.loadCurrentSong();

    //render playlist
    this.render();
  },
};
app.start();
