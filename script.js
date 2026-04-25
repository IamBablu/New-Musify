console.log("Js Initializing....");
const left = document.querySelector(".left");
const menu = document.querySelector(".menu");
const cross = document.querySelector(".cross");
const libraryList = document.querySelector(".librarylist");
let cards = document.querySelector(".cards");
const ganaName = document.querySelector(".info").firstElementChild;
let currentSong = new Audio();
let currentSongName;
let currentFolder;
let currentBanner;
let currentTitle;
let currentDescription;
let songs = [];
let alboms = [];

// Gatting all songs from songs folder in an array
async function gateSongs(folder) {
  // let a = await fetch(`/songs/${folder}`);
  let b = await fetch(`https://github.com/IamBablu/New-Musify/tree/main/songs/${folder}`).then(res => res.json());
  console.log("All songs: ",b)
  songs = [];
  Array.from(b).forEach(file => {
    file.path.endsWith(".mp3")
    console.log("NAYA FILE: ",file.path.replaceAll("%20", " ").split(`${folder}`)[1])
    songs.push(file.path.replaceAll("%20", " ").split(`${folder}`)[1]);
  })
  // // Listing songs in library list
  songs.forEach((song) => {
    libraryList.innerHTML =
      libraryList.innerHTML +
      `
        <div class="song">
            <div class="songinfo">
              <p>${song}
              </p>
              <p>Bablu
              </p>
            </div>
            <img src="contant/play.svg" alt="" />
          </div>`;
    // console.log(song.href.split("/songs/")[1].replaceAll("%20"," ").split("-")[0],song.href.split("/songs/")[1].replaceAll("%20"," ").split("-")[1])
  });
  //   Attach a event listener to all songs
  Array.from(document.querySelectorAll(".song")).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML);
    });
  });

  return songs;
}
function formatSeconds(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  remainingSeconds = Math.floor(remainingSeconds);
  minutes = Math.floor(minutes);
  return (
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (remainingSeconds < 10 ? "0" : "") +
    remainingSeconds
  );
}

function playMusic(track, AudioPlay = true) {
  currentSong.src = `${currentFolder}${track}`;
  currentSongName = currentSong.src
    .replaceAll("%20", " ")
    .split(`${currentFolder}`)[1];
  if (AudioPlay) {
    currentSong.play();
    // console.log(play);
    play.src = "contant/sickpause.svg";
  }
  ganaName.innerHTML = currentSongName;
  time.innerHTML = "00:00/00:00";
}

// getting Banner of each alboms
async function getBanner(e) {
  let i = await fetch(`https://api.github.com/repos/IamBablu/New-Musify/contents/songs/${e}/`).then(res => res.json())
  
  Array.from (i).forEach((bimg)=>{
    if (
      bimg.path.endsWith(".jpeg") ||
      bimg.path.endsWith(".jpg") ||
      bimg.path.endsWith(".png")
    ){
      currentBanner = bimg.path.replaceAll("%20"," ");
    }
  })
}

// getting current title and description of folder
async function getTitleDescription(folder) {
  let t = await fetch(`https://api.github.com/repos/IamBablu/New-Musify/contents/songs/${folder}/info.json/`).then(res => res.json());
  let response = await fetch(t.download_url).then(res => res.json())
  
  currentTitle = response.title;
  currentDescription = response.description;
}
// for showing folder in alboms
async function showFolders() {
   let f = await fetch('https://api.github.com/repos/IamBablu/New-Musify/contents/songs/').then(res => res.json());
  
  Array.from(f).forEach(e=>{
    if(e.git_url.includes("trees")){
      alboms.push(e.name);
      
    }
  })
  
  for (let index = 0; index < alboms.length; index++) {   
      await getBanner(alboms[index]);
      await getTitleDescription(alboms[index]);
      // Listing folder in alboms
      cards.innerHTML += `<div data-folder = "${alboms[index]}" class="card">
      <div class="cardimg">
        <img src="${currentBanner}" alt="" />
        <div class="playbtn">
          <img src="contant/playbtn.svg" alt="" />
          </div>
          </div>
          <div class="Artist">
          <h3>${currentTitle}</h3>
          <p>${currentDescription}</p>
          </div>
          </div>`;
  }
}

async function main() {
  await showFolders();
  currentFolder = `${alboms[0]}/`;
  await gateSongs(currentFolder);
  // playMusic(songs[0], false);

  // showing or hiding left container in small screen device
  menu.addEventListener("click", () => {
    left.style.left = 0;
  });
  cross.addEventListener("click", () => {
    left.style.left = "-500px";
  });

  //   Attach a event listener to play, next, previous button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "contant/sickpause.svg";
    } else {
      currentSong.pause();
      play.src = "contant/sickplay.svg";
    }
  });
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSongName);
    currentSong.pause();
    if (index > 0) {
      playMusic(songs[index - 1]);
    } else {
      playMusic(songs[index]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSongName);
    currentSong.pause();
    if (index < songs.length - 1) {
      playMusic(songs[index + 1]);
    } else {
      playMusic(songs[index]);
    }
  });

  // Showing Song name and displaying time and duration of the song
  currentSong.addEventListener("timeupdate", () => {
    ganaName.innerHTML = currentSongName;
    time.innerHTML = `${formatSeconds(
      currentSong.currentTime
    )} / ${formatSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".sickbar").addEventListener("click", (doats) => {
    let persent =
      (doats.offsetX / doats.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = persent + "%";
    currentSong.currentTime = (currentSong.duration * persent) / 100;
  });

  // Add event listener to Volume control
  volume.addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
    if (currentSong.volume == 0) {
      document.querySelector(".soundImg").src = "contant/soundstop.svg";
    } else {
      document.querySelector(".soundImg").src = "contant/soundplay.svg";
    }
  });

  let songVolume = 0;
  document.querySelector(".soundImg").addEventListener("click", () => {
    if (volume.value != 0) {
      songVolume = volume.value;
      volume.value = 0;
      currentSong.volume = parseInt(volume.value) / 100;
      document.querySelector(".soundImg").src = "contant/soundstop.svg";
    } else {
      volume.value = songVolume;
      currentSong.volume = parseInt(volume.value) / 100;
      document.querySelector(".soundImg").src = "contant/soundplay.svg";
    }
  });

  document.querySelectorAll(".card").forEach((e) => {
    e.addEventListener("click", async (element) => {
      // console.log(element.currentTarget.dataset.folder);
      left.style.left = 0; //only in small screen device
      currentFolder = "/songs/" + element.currentTarget.dataset.folder + "/";
      // console.log(currentFolder);
      await gateSongs(currentFolder);
      playMusic(songs[0]);
    });
  });
}

main();
