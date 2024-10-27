/*
    This is the baseline javascript file for now.
*/

let items = document.getElementsByClassName("premade-playlist");
let button = document.querySelector("button");

button.addEventListener("click", (event) => {
    for (let i = 0; i < items.length; i++) {
        if (items[i].style.height == "150px") {
            items[i].style.height = "350px";
        } else {
            items[i].style.height = "150px";
        }
    }
});