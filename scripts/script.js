/*
    This is the baseline javascript file for now.
*/

let items = document.getElementsByClassName("premade-playlist");
let buttons = document.querySelectorAll("button[class='expand'");

buttons.forEach( (button) => {
    button.addEventListener("click", (event) => {
        if (button.parentElement.style.height == "150px") {
            button.parentElement.style.height = "350px";
        } else {
            button.parentElement.style.height = "150px";
        }
    });
});
