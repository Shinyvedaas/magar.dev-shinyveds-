const albums = [
    {
        title: "ASTROWORLD",
        artist: "Travis Scott",
        cover: "https://cdn-images.dzcdn.net/images/cover/0b08015216f975dc7fb5be3d5dcc4d88/500x500-000000-80-0-0.jpg"
    },
    {
        title: "Graduation",
        artist: "Kanye West",
        cover: "https://cdn-images.dzcdn.net/images/cover/8c6578a2099561992fb7544e6826f767/500x500-000000-80-0-0.jpg"
    },
    {
        title: "Look At Me!",
        artist: "XXXTENTACION",
        cover: "https://cdn-images.dzcdn.net/images/cover/42e34d06952014fbfbff750337666bd6/500x500.jpg"
    },
    {
        title: "JYO JYO",
        artist: "VTEN",
        cover: "https://cdn-images.dzcdn.net/images/cover/702c9d3ea8c9dd718b7aa2970acea503/500x500-000000-80-0-0.jpg"
    },
    {
        title: "7 Years",
        artist: "Lukas Graham",
        cover: "https://cdn-images.dzcdn.net/images/cover/30db449ef0f3214b2eb5b95104d03de7/500x500-000000-80-0-0.jpg"
    },
    {
        title: "Freudian",
        artist: "Daniel Caesar",
        cover: "https://cdn-images.dzcdn.net/images/cover/282e45bef1995c2c6f2901e34c4ab560/500x500-000000-80-0-0.jpg"
    },
    {
        title: "One",
        artist: "Metallica",
        cover: "https://cdn-images.dzcdn.net/images/cover/ce293de53f905a3ce444062ec5242d53/500x500.jpg"
    },
    {
        title: "Sasto Mutu",
        artist: "Sajjan Raj Vaidya",
        cover: "https://cdn-images.dzcdn.net/images/cover/7127f54e16c5ea900eeb82a768046f3e/500x500.jpg"
    },
    {
        title: "IGOR",
        artist: "Tyler, The Creator",
        cover: "https://cdn-images.dzcdn.net/images/cover/041ab5ceb6fb6ebf9512966835be9e1b/500x500-000000-80-0-0.jpg"
    },
    {
        title: "After Hours",
        artist: "The Weeknd",
        cover: "https://cdn-images.dzcdn.net/images/cover/f520bf0be2e3cfc476824e75d20a164a/500x500-000000-80-0-0.jpg"
    },
    {
        title: "The Shooting Star",
        artist: "Gojira",
        cover: "https://cdn-images.dzcdn.net/images/cover/cc9b867b6847741d0b64b79f85982f1d/500x500-000000-80-0-0.jpg"
    },
    {
        title: "The Sunshine",
        artist: "Manchester Orchestra",
        cover: "https://cdn-images.dzcdn.net/images/cover/f5d4723ba2c204b5beefe1259d777dcd/500x500.jpg"
    }
];

const stage = document.getElementById("music-stage");
const grid = document.getElementById("music-grid");
const preview = document.getElementById("music-preview");
const previewCard = document.getElementById("music-preview-card");
const previewImage = document.getElementById("music-preview-image");
const previewTitle = document.getElementById("music-preview-title");
const previewArtist = document.getElementById("music-preview-artist");

if (stage && grid && preview && previewCard && previewImage && previewTitle && previewArtist) {
    albums.forEach((album) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "music-cover-button";
        button.setAttribute("aria-label", `Preview ${album.title} by ${album.artist}`);

        const image = document.createElement("img");
        image.className = "music-cover";
        image.src = album.cover;
        image.alt = `${album.title} — ${album.artist}`;

        button.appendChild(image);
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            openPreview(album);
        });
        grid.appendChild(button);
    });

    previewCard.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    stage.addEventListener("click", () => {
        if (!preview.hidden) {
            closePreview();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closePreview();
        }
    });
}

function openPreview(album) {
    previewImage.src = album.cover;
    previewImage.alt = `${album.title} — ${album.artist}`;
    previewTitle.textContent = album.title;
    previewArtist.textContent = album.artist;
    grid.hidden = true;
    preview.hidden = false;
}

function closePreview() {
    preview.hidden = true;
    grid.hidden = false;
}
