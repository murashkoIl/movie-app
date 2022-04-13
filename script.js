
const API_KEY = '601473a6-01b1-43d9-9b4a-33b723e34fd2';
const API_URL_POPULAR = `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=`
const API_URL_SEARCH = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=`
const API_URL_DESCRIPTION = `https://kinopoiskapiunofficial.tech/api/v2.2/films/`
const allMovies = []
let page = 1

async function getMovies(url, page) {

    const apiUrlPopular = url + `${page}`

    const response = await fetch(apiUrlPopular, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        }
    })

    const data = await response.json()
    showMovies(data, url)
} 

async function getDescription(url, id) {

    const apiUrlDescription = url + `${id}`

    const response = await fetch(apiUrlDescription, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        }
    })

    const data = await response.json()
    console.log(data);
    showPopup(data);
}

getMovies(API_URL_POPULAR, page)


function getRatingColor(rating) {
    return rating >= 8.5 ? 'green' : rating < 8.5 && rating >= 5 ? 'orange' : 'red' 
}

function isHidden(rating) {
    return rating !== 'null' ? '' : 'hidden' 
}


function showMovies(data, url) {
    const movies = document.querySelector('.movies')
    document.querySelector('.movies').innerHTML = ''

    data.films.forEach(movie => {
        const card = document.createElement('div')
        card.classList.add('card')
        card.innerHTML = `
            <div class="card__cover">
                <img src="${movie.posterUrl}" alt="${movie.nameEn}" filmid="${movie.filmId}" class="card__img__cover">
            </div>
            <div class="card__info">
                <div class="card__title">${movie.nameEn || movie.nameRu}</div>
                <div class="card__category">${movie.year}</div>
                <div class="card__rate ${getRatingColor(movie.rating)} ${isHidden(movie.rating)}">${movie.rating}</div>
            </div>
        `

        card.addEventListener('click', (e) => {
            e.preventDefault()

            let currentMovieId = e.target.getAttribute('filmid');
            getDescription(API_URL_DESCRIPTION, currentMovieId);

            console.log(currentMovieId);
        })

        if (url.includes('TOP_250_BEST_FILMS')) {
            allMovies.push(card)
        } else {
            movies.appendChild(card)
            allMovies.splice(0, allMovies.length)
        }

        
    });

    allMovies.forEach(movie => {
        movies.appendChild(movie)
    })
    
}

function showPopup(data) {
    const modalOverlay = document.querySelector('.modal-overlay')

    const modal = document.createElement('div')
    modal.classList.add('modal')

    modal.innerHTML = `
            <div class="popup-slogan">${data.slogan}</div>
            <div class="popup-description">${data.description}</div>
            <div class="popup-age">${data.filmLength} mins</div>
    `
    modalOverlay.appendChild(modal)
    modalOverlay.classList.add('modal-overlay--visible')

    modal.classList.add('modal--visible')


    modalOverlay.addEventListener('click', (e) => {
        modalOverlay.classList.remove('modal-overlay--visible')
        modal.remove()
        // modalOverlay.removeChild(modal)
        e.preventDefault()
    })

}

const form = document.querySelector('.form')
const search = document.querySelector('.header__search')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const apiSearchUrl = API_URL_SEARCH + `${search.value}` + `&gape=1`;
    if (search.value) {
        getMovies(apiSearchUrl, page)
        search.value = ''
    } else {
        getMovies(API_URL_POPULAR, page)
    }
})


const loadMore = document.querySelector('.load-more')

loadMore.addEventListener('click', (e) => {
    e.preventDefault();
    page++;
    getMovies(API_URL_POPULAR, page)
})