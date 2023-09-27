const comedy = "Comedy";
const history = "History";
const drama = "Drama";
const adventure = "Adventure";

const url = "http://127.0.0.1:8000/api/v1/titles/";

//Fonctions raccourcies
   
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
        let root = createDivWithClass("carousel-"+this.genre);
        let items_container = createDivWithClass("items-container-"+this.genre)
        root.appendChild(items_container)
        this.element.appendChild(root)
        this.children.forEach(function(child){
            items_container.appendChild(child)
        })

    }

}



// fonction affichage bloc "meilleur film"
function get_best_movie_data(requete_best_movie){
    fetch(requete_best_movie).then(response => response.json().then(data => {
                    
        title_movie = data["title"];
        description_movie = "Imdb best movies all categories. "
        description_movie += data["long_description"];
        image_movie_src = data["image_url"];

        h2 = document.createElement("h2");
        h2.innerHTML = title_movie;

        p = document.createElement("p");
        p.innerHTML = description_movie

        img = document.createElement("img");
        img.src = image_movie_src

        button = document.createElement("button")
        button.setAttribute("class", "button-modal")
        button.setAttribute("type", "button")
        button.innerHTML = "Voir plus";

        // Div meilleur film
        document.querySelector("#best-movie").appendChild(img);
        document.querySelector("#best-movie").appendChild(h2);
        document.querySelector("#best-movie").appendChild(p);
        document.querySelector("#best-movie").appendChild(button);

        //pour modal
        button.addEventListener("click", function () {this.style.backgroundColor = "red";}) 
        
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
            request = fetch(url + "?sort_by=-imdb_score" + nb_page);
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

            
            
            // Requete pour récuperer les informations du meilleur film
            if (genre_str == "all" && i == 1){
                let best_movie_data = results[0];
                request = best_movie_data["url"];
                get_best_movie_data(request);
            }


            // Création d'un h3 et d'une balise img pour chaque élement (film) de notre tableau.
            results.forEach(element => {
    
                //Titre
                h3 = document.createElement("h3");
                h3.innerHTML = element["title"];
                
                
                img = document.createElement("img");
                img.src = element["image_url"];
                
                div = document.createElement("div")
                div.setAttribute("class", "carousel-items-"+genre_str);
                div.appendChild(img)
                document.querySelector(".items-container-"+genre_str).appendChild(div)
                
                
            });
        })
    }
    
}


getDataByGenre();
getDataByGenre(comedy);
getDataByGenre(history);
getDataByGenre(drama);
