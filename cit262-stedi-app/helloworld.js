const myName = "team";
const hello = "Hello";
const world = "World";
const hw = "Hello World";
const someObject = { str: "Some text", id: 5 };



let text = "";
const teamM = ["Makai"];
teamM.forEach(myFunction);

//document.getElementById("demo").innerHTML = text;
console.log(text)
 
function myFunction(item, index) {
  text += index + ": " + item + " "; 
}