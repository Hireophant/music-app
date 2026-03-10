// AP player
const aplayer = document.querySelector("#aplayer");
if (aplayer) {
  let dataSong = aplayer.getAttribute("data-song");
  dataSong = JSON.parse(dataSong);

  let dataSinger = aplayer.getAttribute("data-singer");
  dataSinger = JSON.parse(dataSinger);

  const ap = new APlayer({
    container: document.getElementById("aplayer"),
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar,
        lrcType: 1,
        lrc: dataSong.lyrics,
      },
    ],
    autoplay: true,
  });
  const avatar = document.querySelector(".singer-detail .inner-avatar");

  ap.on("play", function () {
    console.log("player ended");
    avatar.style.animationPlayState = "running";
  });

  ap.on("pause", function () {
    console.log("player ended");
    avatar.style.animationPlayState = "paused";
  });

  ap.on("ended", function () {
    const link = `/songs/listen/${dataSong.id}`;

    const option = {
      method: "PATCH",
    };

    fetch(link, option)
      .then((res) => res.json())
      .then((data) => {
        const elementListenSpan = document.querySelector(
          ".singer-detail .inner-listen span",
        );
        elementListenSpan.innerHTML = `${data.listen} lượt nghe`;
      });
  });
}

// End Ap player

// Button like
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    const idSong = buttonLike.getAttribute("button-like");
    const isActive = buttonLike.classList.contains("active");
    const typeLike = isActive ? "dislike" : "like";

    const link = `/songs/like/${typeLike}/${idSong}`;

    const option = {
      method: "PATCH",
    };

    fetch(link, option)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.code == 200) {
          const span = buttonLike.querySelector("span");
          span.innerHTML = `${data.like} thích`;
          buttonLike.classList.toggle("active");
        }
      });
  });
}

//End Button like

// Button favorite
const buttonFavorite = document.querySelectorAll("[button-favorite]");
if (buttonFavorite.length > 0) {
  buttonFavorite.forEach((item) => {
    item.addEventListener("click", () => {
      const idSong = item.getAttribute("button-favorite");
      const isActive = item.classList.contains("active");
      const typeFavorite = isActive ? "unfavorite" : "favorite";

      const link = `/songs/favorite/${typeFavorite}/${idSong}`;

      const option = {
        method: "PATCH",
      };

      fetch(link, option)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.code == 200) {
            item.classList.toggle("active");
          }
        });
    });
  });
}

//End Button favorite

// Search suggest
const boxSearch = document.querySelector(".box-search");
if (boxSearch) {
  const input = boxSearch.querySelector("input[name='keyword']");
  const suggest = boxSearch.querySelector(".inner-suggest");

  input.addEventListener("keyup", function () {
    const keyword = input.value;

    if (keyword.length >= 1) {
      const link = `/search/suggest?keyword=${keyword}`;

      fetch(link)
        .then((res) => res.json())
        .then((data) => {
          const songs = data.list; // Backend trả về là `list`
          if (songs && songs.length > 0) {
            suggest.classList.add("show");

            const htmls = songs.map((song) => {
              return `
                <a class="inner-item" href="/songs/detail/${song.slug}">
                  <div class="inner-image"><img src="${song.avatar}" /></div>
                  <div class="inner-info">
                    <div class="inner-title">${song.title}</div>
                    <div class="inner-singer"><i class="fa-solid fa-microphone-lines"></i> ${song.infoSinger ? song.infoSinger.fullName : ""}</div>
                  </div>
                </a>
              `;
            });

            const boxList = suggest.querySelector(".inner-list");
            if (boxList) {
              boxList.innerHTML = htmls.join("");
            } else {
              suggest.innerHTML = `<div class="inner-list">${htmls.join("")}</div>`;
            }
          } else {
            suggest.classList.remove("show");
          }
        });
    } else {
      suggest.classList.remove("show");
    }
  });
}
// End Search suggest
