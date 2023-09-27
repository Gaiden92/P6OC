class Carousel {
    /**
     * 
     * @param {HTMLCollection} racine
     * @param {Object} option
     * @param {Object} option.slidesVisible : Nomnbre d'élements visiblent dans un slide
     * @param {Object} option.slideToScroll : Nombre d'élements à faire défiler
     */
    constructor(element, option = {}){
        this.element = element
        this.option = Object.assign({}, {
            slidesToScroll : 1,
            slidesVisible : 1
        }, option)
        this.children = element.children
        let root = this.createDivWithClass("carousel");
        let items_container = this.createDivWithClass("items-container")
        root.appendChild(items_container)
        debugger
        this.element.appendChild(root)


    }
   
    /**
     * 
     * @param {string} className 
     * @returns {HTMLElement} 
     */
    createDivWithClass(className){
        let div = document.createElement("div");
        div.setAttribute("class", className);
        return div
    }
}


// Au chargement de la page
document.addEventListener("DOMContentLoaded", function (param) { 
    // Création d'un nouveau caroussel
    new Carousel(document.querySelector(".container")),{
        slidesToScroll : 1,
        slidesVisible : 5
    }
 })