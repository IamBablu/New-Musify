console.log("Js Initializing....");
const SUPABASE_URL = "https://nqtofvcwtmwovktqmvxd.supabase.co";
const ANON_KEY = "sb_publishable_x3uExt9miHkGRSfUaWZUDQ_yrWj1WmX";
const BUCKET = "New Musify";
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


async function listFolder(prefix = "") {
  try {
    const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/list/${encodeURIComponent(BUCKET)}`,
    {
      method: "POST", // GET nahi chalega Yuvraj, POST hi lagana padega
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prefix: prefix,
        limit: 100,
        offset: 0,
      }),
    },);
  const data = await res.json();
  if (data.error) throw new Error(data.message);
  return data;
  ;
  } catch (error) {
    console.log(error);
  }
  
}

// Gatting all songs from songs folder in an array
async function gateSongs(e) {
  try {
    songs = [];
  let b = await listFolder(`songs/${e}/`);
  Array.from(b).forEach((file) => {
    if (file.name.endsWith(".mp3")) {
      file.name.endsWith(".mp3");
      songs.push(file.name);
    }
  });
  libraryList.innerHTML = "";
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
  });
  //   Attach a event listener to all songs
  Array.from(document.querySelectorAll(".song")).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML);
    });
  });

  return songs;
  } catch (error) {
    console.log(error);
  }
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

function playMusic(track ="", AudioPlay = true) {
  try {
    currentSong.src = `https://nqtofvcwtmwovktqmvxd.supabase.co/storage/v1/object/public/New%20Musify/songs/${currentFolder}/${track}`;
  currentSongName = track;
  if (AudioPlay) {
    currentSong.play();
    play.src = "contant/sickpause.svg";
  }
  ganaName.innerHTML = currentSongName;
  time.innerHTML = "00:00/00:00";
  } catch (error) {
    console.log(error);
  }
}

// getting Banner of each alboms
async function getBanner(e) {
  try {
    let i = await listFolder(`songs/${e}/`);

  for (let bimg of i) {
    if (
      bimg.name.endsWith(".jpeg") ||
      bimg.name.endsWith(".jpg") ||
      bimg.name.endsWith(".png")
    ) {
      currentBanner = `songs/${e}/${bimg.name}`;
    }
  }
  } catch (error) {
    console.log(error);
  }
}

// getting current title and description of folder
async function getTitleDescription(folder) {
  try {
    const response = await listFolder(`songs/${folder}`);
  for (let info of response) {
    if (info.name.endsWith(".json")) {
      let data = await (
        await fetch(
          `https://nqtofvcwtmwovktqmvxd.supabase.co/storage/v1/object/public/New%20Musify/songs/${folder}/${info.name}`,
        )
      ).json();
      currentDescription = data.description;
      currentTitle = data.title;
    }
  }
  } catch (error) {
    console.log(error);
  }
}
// for showing folder in alboms
async function showFolders() {
  try {
    const songsFolder = await listFolder("songs/");
  Array.from(songsFolder).forEach((e) => {
    if (e) {
      alboms.push(e.name);
    }
  });
  for (let index = 0; index < alboms.length; index++) {
    if (alboms) {
      await getBanner(alboms[index]);
      await getTitleDescription(alboms[index]);
    } else {
      console.log("missing Alboms");
    }
    let imgbanner = await fetch(
      `https://nqtofvcwtmwovktqmvxd.supabase.co/storage/v1/object/public/New%20Musify/${currentBanner}`,
    );
    // Listing folder in alboms
    cards.innerHTML += `<div data-folder = "${alboms[index]}" class="card">
      <div class="cardimg">
        <img src="https://nqtofvcwtmwovktqmvxd.supabase.co/storage/v1/object/public/New%20Musify/${currentBanner}">
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
  } catch (error) {
    console.log(error)
  }
}

async function main() {
  await showFolders();
  await gateSongs(alboms[0]);
  menu.addEventListener("click", () => {
    left.style.left = 0;
  });
  cross.addEventListener("click", () => {
    left.style.left = "-500px";
  });
    
  //   Attach a event listener to play, next, previous button
  play.addEventListener("click", () => {
    try {
      if (currentSong.paused) {
      currentSong.play();
      play.src = "contant/sickpause.svg";
    } else {
      currentSong.pause();
      play.src = "contant/sickplay.svg";
    }
    } catch (error) {
      console.log(error);
    }
  });
  previous.addEventListener("click", () => {
    try {
      let index = songs.indexOf(currentSongName);
    currentSong.pause();
    if (index > 0) {
      playMusic(songs[index - 1]);
    } else {
      playMusic(songs[index]);
    } 
    } catch (error) {
      console.log(error)
    }
  });
  next.addEventListener("click", () => {
    try {
      let index = songs.indexOf(currentSongName);
    currentSong.pause();
    if (index < songs.length - 1) {
      playMusic(songs[index + 1]);
    } else {
      playMusic(songs[index]);
    }
    } catch (error) {
      console.log(error)
    }
  });

  // Showing Song name and displaying time and duration of the song
  currentSong.addEventListener("timeupdate", () => {
    ganaName.innerHTML = currentSongName;
    time.innerHTML = `${formatSeconds(
      currentSong.currentTime,
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
    try {
      currentSong.volume = parseInt(e.target.value) / 100;
    if (currentSong.volume == 0) {
      document.querySelector(".soundImg").src = "contant/soundstop.svg";
    } else {
      document.querySelector(".soundImg").src = "contant/soundplay.svg";
    }
    } catch (error) {
      console.log(error)
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
    try {
      e.addEventListener("click", async (element) => {
      left.style.left = 0; //only in small screen device
      currentFolder = element.currentTarget.dataset.folder;
      await gateSongs(currentFolder);
      playMusic(songs[0]);
    });
    } catch (error) {
      console.log(error)
    }
  });
}

main();
