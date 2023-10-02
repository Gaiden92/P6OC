const comedy = "Comedy";
const history = "History";
const drama = "Drama";
const adventure = "Adventure";
const url = "http://127.0.0.1:8000/api/v1/titles/";

//Fonctions raccourcies
   
/**
 * 
 * @param {string} idName 
 * @returns {HTMLElement} 
 */

function createPWithId(idName){
    let p = document.createElement("p");
    p.setAttribute("id", idName);
    return p
}

/**
 * 
 * @param {string} className 
 * @returns {HTMLElement} 
 */

function createDivWithClass(className){
    let div = document.createElement("div");
    div.setAttribute("class", className);
    return div
}

/**
 * 
 * @param {string} idName 
 * @returns {HTMLElement} 
 */

function createDivWithId(idName){
    let div = document.createElement("div");
    div.setAttribute("id", idName);
    return div
}

/*Carouselle d'images*/
class Carousel {
    /**
     * 
     * @param {HTMLCollection} element
     * @param {String} genre : le genre de la catégorie
     * @param {Object} option
     * @param {Object} option.slidesVisible : Nomnbre d'élements visiblent dans un slide
     * @param {Object} option.slideToScroll : Nombre d'élements à faire défiler
     */
    constructor(element, genre, option = {}){
        this.genre = genre
        this.element = element
        this.option = Object.assign({}, {
            slidesToScroll : 1,
            slidesVisible : 1
        }, option)
        this.children = [].slice.call(element.children)
        let root = createDivWithClass("carousel-"+this.genre+ " carousel");
        let items_container = createDivWithClass("items-container-"+this.genre)
        root.appendChild(items_container)
        this.element.appendChild(root)
        this.children.forEach(function(child){
            items_container.appendChild(child)
        })
        let nav = createDivWithClass("nav-"+this.genre.toLocaleLowerCase())

        let previous_button = document.createElement("button")
        previous_button.setAttribute("class", "prev-"+this.genre.toLocaleLowerCase())
        previous_button.setAttribute("type", "button")

        let next_button = document.createElement("button")
        next_button.setAttribute("class", "next-"+this.genre.toLocaleLowerCase())
        next_button.setAttribute("type", "button")

        document.querySelector(".container-" + this.genre.toLocaleLowerCase()).appendChild(nav);
        document.querySelector(".nav-"+this.genre.toLocaleLowerCase()).appendChild(next_button);
        document.querySelector(".nav-"+this.genre.toLocaleLowerCase()).appendChild(previous_button);

        let container_off_all_pictures = document.querySelector(".items-container-" + this.genre.toLocaleLowerCase())
        let width = 0;
        

        function nextPicture(){
            if (width >= -650){
                console.log(width)
                width -= 262
                container_off_all_pictures.style.transform = "translateX(" + width + "px)";
            }
        }
    
        function previousPicture(){
            if(width < 0){
                width += 262
                container_off_all_pictures.style.transform = "translateX(" + width + "px)";
            }
    
        }
        previous_button.addEventListener("click", previousPicture)
        next_button.addEventListener("click", nextPicture)

    }
    
}



// fonction affichage bloc "meilleur film"
async function getBestMovieData(requete_best_movie){
    await fetch(requete_best_movie).then(response => response.json().then(data => {
        id = data["results"][0]["id"];
        fetch(url+id).then(response => response.json().then(best_movie_data => {
            title_movie = best_movie_data["title"];
            description_movie = "The Imdb best movie all categories.<br>"
            description_movie = best_movie_data["long_description"];
            image_movie_src = best_movie_data["image_url"];

            img = document.createElement("img");
            img.src = image_movie_src
            img.alt = best_movie_data["id"]

            h2 = document.createElement("h2");
            h2.innerHTML = title_movie;

            p = document.createElement("p");
            p.innerHTML = description_movie

            // Bouton "more infos"
            button_infos = document.createElement("button")
            button_infos.setAttribute("id", id)
            button_infos.setAttribute("class", "button-modal-infos")
            button_infos.setAttribute("type", "button")
            button_infos.innerHTML = "More infos";
            button_infos.addEventListener("click", openModal)

            // Bouton "play movie"
            button = document.createElement("button")
            button.setAttribute("class", "button-modal")
            button.setAttribute("type", "button")
            button.innerHTML = "Play movie";

            // Div meilleur film
            document.querySelector("#best-movie").appendChild(h2);
            document.querySelector("#best-movie").appendChild(p);
            document.querySelector("#best-movie").appendChild(button);
            document.querySelector("#best-movie").appendChild(button_infos);
            document.querySelector("#best-movie").appendChild(img);

        }))
        
    }))
}

async function getDataByGenre(genre = "All") {
    let genre_str = genre.toLowerCase()
    let nb_page = "";
    let request;
    let results = []

    new Carousel(document.querySelector(".container-"+genre_str), genre_str,{
        slidesToScroll : 1,
        slidesVisible : 5
        
    })

    //On boucle de la page 1 à 2
    for(let i=1;i <= 2;i++){
        
        if (genre === "All") {

            if (i == 2){
                nb_page = "&page=2";
            }
            request =  fetch(url + "?sort_by=-imdb_score" + nb_page);
            }
        else {
            if (i == 2){
                nb_page = "&page=2";
            }
            request = fetch(url + "?genre=" + genre + "&sort_by=-imdb_score"+ nb_page)
            }
        
        await request.then(response => response.json()).then(data =>
        
        {
            // On récupère les données "résultats" pour les pages 1 et 2. 
            let data_by_page = data["results"];
            if (i == 2){
                //Si nous sommes sur la page 2, on récupère seulement les 2 premiers résultats.
                data_by_page = data["results"].slice(0,2);
            } 
           
            // On affecte à notre variable "results" le tableau de donnée récupéré. 
             results = data_by_page;

            // Création d'un h3 et d'une balise img pour chaque élement (film) de notre tableau.
            results.forEach(element => {
                p = createPWithId(element["id"]);
                p.setAttribute("class", "more-informations");
                p.innerHTML = "More infos";

                //Image du film
                img = document.createElement("img");
                img.src = element["image_url"];
                
                div = createDivWithClass("carousel-items-"+genre_str+ " carousel-items");
                div.appendChild(p);
                div.appendChild(img);
                document.querySelector(".items-container-"+genre_str).appendChild(div);
            });
        })
    }
}


let navbar = document.getElementById("header");
let sticky = navbar.offsetTop;

function stickyMenu() {
    if (window.scrollY > sticky) {
        navbar.classList.add("sticky")
    }
    else{
        navbar.classList.remove("sticky")
    }
  }


function openModal(e){
    id = e.target.id
    modal_div = document.querySelector(".modalDialog")
    modal_div.classList.add("visible");
    
    request = fetch(url+id)
    .then(response => response.json())
    .then(
            movie_data => {

                // sélection div modal content
                modal_content = document.querySelector("#modal-content");

                //image
                img = document.createElement("img")
                img.setAttribute("id", "movie-image")
                img.src = movie_data["image_url"]
                modal_content.appendChild(img)
                
                //titre
                h2 = document.createElement("h2")
                h2.setAttribute("id", "movie-title")
                h2.innerHTML = movie_data["title"]
                modal_content.appendChild(h2)

                //description
                description_movie = createPWithId("movie-description")
                description_movie.innerHTML = movie_data["long_description"]
                modal_content.appendChild(description_movie)
                
                //date
                date_movie = createPWithId("movie-date")
                date_movie.innerHTML = movie_data["date_published"]
                modal_content.appendChild(date_movie)

                //genre
                genre_movie = createPWithId("movie-genre")
                genre_movie.innerHTML =  movie_data["genres"]
                modal_content.appendChild(genre_movie)

                // rate
                rate_movie = createPWithId("movie-rate")
                rate_movie.innerHTML = movie_data["rated"]
                modal_content.appendChild(rate_movie)

                // score
                score_movie = createPWithId("movie-score")
                score_movie.innerHTML = movie_data["imdb_score"]
                modal_content.appendChild(score_movie)

                // directors
                directors_movie = createPWithId("movie-directors")
                directors_movie.innerHTML = movie_data["directors"]
                modal_content.appendChild(directors_movie)

                // actors
                actors_movie = createPWithId("movie-actors")
                actors_movie.innerHTML = movie_data["actors"]
                modal_content.appendChild(actors_movie)

                // duration
                duration_movie = createPWithId("movie-duration")
                duration_movie.innerHTML = "Duration<br>" +movie_data["duration"]
                modal_content.appendChild(duration_movie)

                // countries
                countries_movie = createPWithId("movie-countries")
                countries_movie.innerHTML = movie_data["countries"]
                modal_content.appendChild(countries_movie)

                //results
                votes_movie = createPWithId("movie-votes")
                votes_movie.innerHTML = movie_data["votes"]
                modal_content.appendChild(votes_movie)
    
            }
           
    )

}   

function closeModal() { 
    button_modal = document.querySelector("#close")
    modal_div.classList.remove("visible");
    modal_content = document.querySelector("#modal-content")
    modal_content.innerHTML = "";
 }

window.onload = function (){
    let div = document.querySelectorAll("#best-movie > button")
    div = document.body.querySelectorAll(".carousel")
    div.forEach(element => {
        element.addEventListener("click", openModal)
    });
    
}

window.onscroll = function() {
    stickyMenu()
};

getBestMovieData("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score");
getDataByGenre();
getDataByGenre(comedy);
getDataByGenre(history);
getDataByGenre(drama);