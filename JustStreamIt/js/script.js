const comedy = "Comedy";
const history = "History";
const drama = "Drama";
const adventure = "Adventure";

const url = "http://127.0.0.1:8000/api/v1/titles/";

// fonction affichage bloc "meilleur film"
function get_best_movie_data(requete_best_movie){
    fetch(requete_best_movie).then(response => response.json().then(data => {
                    
        title_movie = data["title"];
        description_movie = data["description"];
        image_movie_src = data["image_url"];

        h2 = document.createElement("h2");
        h2.innerHTML = title_movie;

        p = document.createElement("p");
        p.innerHTML = description_movie

        img = document.createElement("img");
        img.src = image_movie_src

        // Div meilleur film
        document.querySelector("#best-movie").appendChild(h2);
        document.querySelector("#best-movie").appendChild(p);
        document.querySelector("#best-movie").appendChild(img);
    }))
}

async function getDataByGenre(genre = "All") {
    let nb_page = "";
    let request;
    let results = []

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

            let genre_str = genre.toLowerCase();
            
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
                

                //Image
                img = document.createElement("img");
                img.src = element["image_url"];
                document.querySelector("#best-" + genre_str + "-movies").appendChild(img);
                document.querySelector(".container-" + genre_str + "").appendChild(img);
                
                
            });
        })
    }
    
    
   


}

getDataByGenre();
getDataByGenre(comedy);
getDataByGenre(history);
getDataByGenre(drama);
