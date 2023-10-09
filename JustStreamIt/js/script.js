const comedy = "Comedy";
const history = "History";
const drama = "Drama";
const url = "http://127.0.0.1:8000/api/v1/titles/";
const url_best_movie = "http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score";

//Fonctions raccourcies

/**
 * 
 * @param {string} idName 
 * @returns {HTMLElement} 
 */

function createPWithId(idName) {
	let p = document.createElement("p");
	p.setAttribute("id", idName);
	return p
}

/**
 * 
 * @param {string} className 
 * @returns {HTMLElement} 
 */

function createDivWithClass(className) {
	let div = document.createElement("div");
	div.setAttribute("class", className);
	return div
}

/**
 * 
 * @param {string} idName 
 * @returns {HTMLElement} 
 */

function createDivWithId(idName) {
	let div = document.createElement("div");
	div.setAttribute("id", idName);
	return div
}

/**
 * 
 * @param {string} url_image 
 * @returns {Promise} request
 */
function testImageUrl(url_image) {
	request = fetch(url_image)
		.then(response => response.status)
	return request
}

/**
 * 
 * @param {string} url 
 * @param {function} callback 
 */
// Tester si une image existe
function checkIfImageExists(url, callback) {
	const img = new Image();
	img.src = url;

	if (img.complete) {
		callback(true);
	} else {
		img.onload = () => {
			callback(true);
		};

		img.onerror = () => {
			callback(false);
		};
	}
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
	constructor(element, genre, option = {}) {
		this.genre = genre
		this.element = element
		this.option = Object.assign({}, {
			slidesToScroll: 1,
			slidesVisible: 1
		}, option)
		this.children = [].slice.call(element.children)
		let root = createDivWithClass("carousel-" + this.genre + " carousel");
		let items_container = createDivWithClass("items-container-" + this.genre+ " items-container")
		root.appendChild(items_container)
		this.element.appendChild(root)
		this.children.forEach(function(child) {
			items_container.appendChild(child)
		})
		let nav = createDivWithClass("nav-" + this.genre.toLocaleLowerCase()+ " nav")

		let previous_button = document.createElement("button")
		previous_button.setAttribute("class", "prev-" + this.genre.toLocaleLowerCase()+ " prev")
		previous_button.setAttribute("type", "button")

		let next_button = document.createElement("button")
		next_button.setAttribute("class", "next-" + this.genre.toLocaleLowerCase()+ " next")
		next_button.setAttribute("type", "button")

		document.querySelector(".container-" + this.genre.toLocaleLowerCase()).appendChild(nav);
		document.querySelector(".nav-" + this.genre.toLocaleLowerCase()).appendChild(next_button);
		document.querySelector(".nav-" + this.genre.toLocaleLowerCase()).appendChild(previous_button);

		let container_off_all_pictures = document.querySelector(".items-container-" + this.genre.toLocaleLowerCase())
		let width = 0;

		function nextPicture() {
			if (width >= -650) {
				width -= 262
				container_off_all_pictures.style.transform = "translateX(" + width + "px)";
			}
		}

		function previousPicture() {
			if (width < 0) {
				width += 262
				container_off_all_pictures.style.transform = "translateX(" + width + "px)";
			}

		}
		previous_button.addEventListener("click", previousPicture)
		next_button.addEventListener("click", nextPicture)

	}

}



// fonction affichage bloc "meilleur film"
async function getBestMovieData(requete_best_movie) {
	await fetch(requete_best_movie).then(response => response.json().then(data => {
		id = data["results"][0]["id"];
		fetch(url + id).then(response => response.json().then(best_movie_data => {
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

	//Création d'un carousel
	new Carousel(document.querySelector(".container-" + genre_str), genre_str, {
		slidesToScroll: 1,
		slidesVisible: 5
	})

	//On boucle de la page 1 à 2
	for (let i = 1; i <= 2; i++) {
		if (genre === "All") {
			if (i == 2) {
				nb_page = "&page=2";
			}
			request = fetch(url + "?sort_by=-imdb_score" + nb_page);
		} else {
			if (i == 2) {
				nb_page = "&page=2";
			}
			request = fetch(url + "?genre=" + genre + "&sort_by=-imdb_score" + nb_page);
		}

		await request.then(response => response.json()).then(data => {

			// On récupère les données "résultats" pour les pages 1 et 2. 
			let data_by_page = data["results"];
			if (i == 2) {
				//Si nous sommes sur la page 2, on récupère seulement les 2 premiers résultats.
				data_by_page = data["results"].slice(0, 2);
			}

			// On affecte à notre variable "results" le tableau de donnée récupéré. 
			results = data_by_page;

			// Création d'un paragraphe et d'une balise img pour chaque film.
			results.forEach(element => {
				div = createDivWithClass("carousel-items-" + genre_str + " carousel-items");

				p = createPWithId(element["id"]);
				p.setAttribute("class", "more-informations");
				p.innerHTML = "More infos";
				div.appendChild(p);

				img_movie = document.createElement("img");
				img_movie.alt = element["title"];
				img_movie.setAttribute("class", "cover-image");
				img_movie.src = element["image_url"];

				div.appendChild(img_movie)
				div.addEventListener("click", openModal)
				document.querySelector(".items-container-" + genre_str).appendChild(div);

			});

			// Test de l'url de l'image
			let img_carousel = document.querySelectorAll(".cover-image");
			img_carousel.forEach(element => {
				checkIfImageExists(element.src, (exists) => {
					if (!exists) {
						element.src = "JustStreamIt/img/no-image-juststreamit.jpg";
					}
				});
			})
		});
	}
}


let navbar = document.getElementById("header");
let sticky = navbar.offsetTop;

function stickyMenu() {
	if (window.scrollY > sticky) {
		navbar.classList.add("sticky")
	} else {
		navbar.classList.remove("sticky")
	}
}

function openModal(e) {
	id = e.target.id;
	modal_div = document.querySelector(".modalDialog");
	modal_div.classList.add("visible");

	request = fetch(url + id)
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

				// Test de l'url de l'image
				let img_carousel = document.querySelectorAll("#movie-image");
				img_carousel.forEach(element => {
					checkIfImageExists(element.src, (exists) => {
						if (!exists) {
							element.src = "JustStreamIt/img/no-image-juststreamit.jpg";
						}
					});
				})

				//titre
				h2 = document.createElement("h2")
				h2.setAttribute("id", "movie-title")
				h2.innerHTML = movie_data["title"]
				modal_content.appendChild(h2)

				//genre
				genre_movie = createPWithId("movie-genre");
				genre_movie.innerHTML = "<span>Genres:</span> " + movie_data["genres"].join(", ", ",");
				modal_content.appendChild(genre_movie);

				//date
				date_movie = createPWithId("movie-date");
				date_movie.innerHTML = "<span>Published date:</span> " + movie_data["date_published"];
				modal_content.appendChild(date_movie);

				// rate
				rate_movie = createPWithId("movie-rate");
				rate_movie.innerHTML = "<span>Rated:</span> " + movie_data["rated"];
				modal_content.appendChild(rate_movie);

				// score
				score_movie = createPWithId("movie-score");
				score_movie.innerHTML = "<span>Imdb score:</span> " + movie_data["imdb_score"];
				modal_content.appendChild(score_movie);

				// director
				director_movie = createPWithId("movie-directors");
				director_movie.innerHTML = "<span>Directors:</span> " + movie_data["directors"];
				modal_content.appendChild(director_movie);

				// actors
				actors_movie = createPWithId("movie-actors");
				actors_movie.innerHTML = "<span>Actors:</span> " + movie_data["actors"].join(", ", ",");
				modal_content.appendChild(actors_movie);

				// duration
				duration_movie = createPWithId("movie-duration");
				duration_movie.innerHTML = "<span>Duration:</span> " + movie_data["duration"] + " min";
				modal_content.appendChild(duration_movie);

				// countries
				countries_movie = createPWithId("movie-countries");
				countries_movie.innerHTML = "<span>Countries:</span> " + movie_data["countries"].join(", ", ",");
				modal_content.appendChild(countries_movie);

				// Gross income
				gross_movie = createPWithId("movie-gross");
				movie_data["worldwide_gross_income"] !== null ?
					gross_movie.innerHTML = "<span>Worldwide gross income:</span> " +
					new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					}).format(movie_data["worldwide_gross_income"]) :
					gross_movie.innerHTML = "<span>Worldwide gross income:</span> Not disclosed";
				modal_content.appendChild(gross_movie);

				//description
				description_movie = createPWithId("movie-description");
				movie_data["long_description"].length == 1 ?
					description_movie.innerHTML = "<span>Description:</span> No description" :
					description_movie.innerHTML = "<span>Description:</span>" + movie_data["long_description"];
				modal_content.appendChild(description_movie);

			}

		)

}

function closeModal() {
	button_modal = document.querySelector("#close")
	modal_div.classList.remove("visible");
	modal_content = document.querySelector("#modal-content")
	modal_content.innerHTML = "";
}

window.onscroll = function() {
	stickyMenu()
};

getBestMovieData(url_best_movie);
getDataByGenre();
getDataByGenre(comedy);
getDataByGenre(history);
getDataByGenre(drama);