/* LESSON 3 - Programming Tasks */

/* Profile Object  */
let myProfile = {
    name: "Makai Maetani",
    photo: "cse121b/Makai.jpg",
    favoriteFood: ["Fried Chicken","Cheesburger", "Rice"],
    hobbies: ["Hiking", "Coding", "Gaming", "Dance"],
    placeLived: []
};

/* Populate Profile Object with placesLive objects */
myProfile.placeLived.push(
    {
        place: "Orem Utah",
        length: "14 Years"
    },
    {
        place: "Spokane Washington",
        length: "2 Years",
    },
    {
        place: "Sisaket Thailand",
        length: "7 Months",
    },
    {
        place: "Osaka Japan",
        length: "2 Weeks",
    }


);
/* DOM Manipulation - Output */

/* Name */
document.querySelector("#name").textContent = myProfile.name;
/* Photo with attributes */
document.querySelector("#photo").setAttribute("src", myProfile.photo);
/* Favorite Foods List*/
myProfile.favoriteFood.forEach(food => {
    let bullets =  document.createElement("li");
    bullets.textContent = food;
    document.querySelector("#favorite-foods").appendChild(bullets);   
});
/* Hobbies List */
myProfile.hobbies.forEach(hobby=> {
    let bullets = document.createElement("li");
    bullets.textContent = hobby;
    document.querySelector("#hobbies").appendChild(bullets);
})
/* Places Lived DataList */
myProfile.placeLived.forEach(places=>{
    let place = document.createElement("dt");
    place.textContent = places.place;
    document.querySelector("#places-lived").appendChild(place);
    
    let length = document.createElement("dd");
    length.textContent = places.length;
    document.querySelector("#places-lived").appendChild(length);
})