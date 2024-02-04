const myName = "team";
const hello = "Hello";
const world = "World";
const hw = "Hello World";
const someObject = { str: "Some text", id: 5 };


/*
const teamM = [];
teamM.push("Makai", "Jesse", "Logan");
// Jesse contribution I added my name
console.log(hello, teamM); 

//console.log(hello , myName);

*/

let text = "";
const teamM = ["Makai", "Jesse", "Logan"];
teamM.forEach(myFunction);

//document.getElementById("demo").innerHTML = text;
console.log(text)
 
function myFunction(item, index) {
  text += index + ": " + item + " "; 
}


