fetch('https://makai-maetani.github.io//wdd230/chamber/data/members.json')
.then(function (response){
    return response.json();
})
.then(function(data){
    for(var i=0; i<data.length; i++){
        document.getElementById("data").innerHTML +=
        data[i].id + " - " + data[i].level + " Member. Name: " + data[i].name + "<br />" 
    }
})
.catch(function (err){
    console.log(err);
});