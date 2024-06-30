let lastModified = new Date(document.lastModified);
let fullDate = lastModified.toLocaleString('en-US', {month: "2-digit", day: "2-digit", year: "numeric"});
let time = lastModified.toLocaleString('en-GB', {hour: "2-digit", minute: "2-digit", second: "2-digit"});
let dateTime = `Last Updated: ${fullDate} ${time}`;
document.getElementById("lastModified").innerHTML = dateTime;

window.addEventListener("load", (event) => {
    const now = new Date();
    const day = now.getDay(); 
    // 2 = monday, 4 = widnesday
    // if (day >= 2 && day <= 4){
    if (day == 0){
      document.querySelector("#post-editor-78687221").style.display = "block"
     }
    });