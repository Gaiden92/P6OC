const comedy = "Comedy";
const history = "History";
const drama = "Drama";
const adventure = "Adventure";

const url = "http://127.0.0.1:8000/api/v1/titles/";

function getDataByGenre(genre = "All") {
    let nb_page = "";
    let request;
    let results = []


    if (genre === "All") {
        request = fetch(url + "?sort_by=-imdb_score" + nb_page);
        } else {
        request = fetch(url + "?genre=" + genre + "&sort_by=-imdb_score"+ nb_page)
        }
        request.then(response => response.json()).then(data =>
    
        {
            results = data["results"];
            console.log(results);
            let genre_str = genre.toLowerCase();
    
            results.forEach(element => {
    
                //Titre
                h3 = document.createElement("h3");
                h3.innerHTML = element["title"];
    
                // Image
                img = document.createElement("img");
                img.src = element["image_url"];
                document.querySelector("#best-" + genre_str + "-movies").appendChild(img);
    
                document.querySelector(".container-" + genre_str + "").appendChild(img);
    
            });
        })
    
   


}

getDataByGenre();
getDataByGenre(comedy);
getDataByGenre(history);
getDataByGenre(drama);