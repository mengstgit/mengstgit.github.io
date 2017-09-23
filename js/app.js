const searchBtn = document.getElementById('searchBtn');
const artistName = document.getElementById('artistSearch');
const clearResultBtn = document.getElementById('clearResultBtn');
const albumContainer = document.getElementById('albumContainer');
const albumDetailContainer = document.getElementById('albumDetailContainer');
const details = document.getElementById('details');
details.style.display = 'none';

const currentAlbum = [];

// Album Class
class Albums {
    constructor(artist, albumTitle, albumId, albumArtLarge, releaseDate, albumGenre, albumPrice, albumLink) {
        this.artist = artist;
        this.albumTitle = albumTitle;
        this.albumId = albumId;
        this.albumArtLarge = albumArtLarge;
        this.releaseDate = releaseDate;
        this.albumGenre = albumGenre;
        this.albumPrice = albumPrice;
        this.albumLink = albumLink;
        this.dataUrl = `https://itunes.apple.com/lookup?id=${this.albumId}&entity=song&callback=?`;
        this.songList = getSongs(this.dataUrl);
    }
}
// Get albums by artist name
const getAlbums = e => {
    const url = `https://itunes.apple.com/search?term=${artistName.value}&entity=album&limit=25`;
    
    albumContainer.innerHTML = '';

    if (artistName) {
        $.getJSON(url, data => {
            $.each(data.results, (key, val) => {
                currentAlbum.push(new Albums(
                    val.artistName, val.collectionName, val.collectionId,
                    val.artworkUrl100, val.releaseDate, val.primaryGenreName,
                    val.collectionPrice, val.collectionViewUrl)
                );

                const newList = document.createElement('li');
                newList.classList.add('list-group-item');
                newList.id = val.collectionId;
                newList.innerText = val.collectionName;
                newList.style.cursor = 'pointer';
                newList.addEventListener('click', renderAlbumDetails);
                
                albumContainer.appendChild(newList);
            })
        })
    }
    details.style.display = 'none';
}

// Render Album Details
const renderAlbumDetails = ev => {
    const albumArt = document.getElementById('albumArt');
    const album = document.getElementById('album');
    const artist = document.getElementById('artist');
    const releaseDate = document.getElementById('releaseDate');
    const genre = document.getElementById('genre');
    const price = document.getElementById('price');
    const songList = document.getElementById('songList');
    const buyLink = document.getElementById('buyLink');

    details.style.display = 'block';

    songList.innerHTML = '';

    let albumDetails = '';

    for (var i = 0; i < currentAlbum.length; i++) {
        if (ev.currentTarget.id == currentAlbum[i].albumId) {
             albumDetails = currentAlbum[i];
             break;
        }
    }

    albumArt.src = albumDetails.albumArtLarge;
    album.innerText = albumDetails.albumTitle;
    artist.innerText = albumDetails.artist;
    releaseDate.innerText = albumDetails.releaseDate.slice(0, albumDetails.releaseDate.indexOf('T'));
    genre.innerText = albumDetails.albumGenre;
    price.innerText = `$${albumDetails.albumPrice}`;
    buyLink.href = albumDetails.albumLink;

    albumDetails.songList.forEach((song, index) => {
        if (song) {
            const songItem = document.createElement('li');
            songItem.classList.add('list-group-item');
            
            const span = document.createElement('span');
            span.innerText = `${index} ${song}`;
            
            songItem.appendChild(span);
            songList.appendChild(songItem);
        }
    })
}

// Get songs via album id
const getSongs = (uri) => {
    let songs = [];
    $.getJSON(uri, (data) => {
        $.each(data.results, (key, val) => {
            songs.push(val.trackName);
        })
    })
    return songs;
}

// clears search
const clearSearch = () => {
    artistSearch.value = '';
    artistSearch.focus();
    albumContainer.innerText = '';
    details.style.display = 'none';
    songList.innerHTML = '';
}
const keypressGetAlbum = (e) => {
    const key = e.which || e.keyCode;
    if (key === 13) { 
       getAlbums();
    }
}
// Event Listeners get Album & clear search
searchBtn.addEventListener('click', getAlbums);
clearResultBtn.addEventListener('click', clearSearch);
artistName.addEventListener('keypress', keypressGetAlbum);