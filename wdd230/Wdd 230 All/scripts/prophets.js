

  const url = 'https://brotherblazzard.github.io/canvas-content/latter-day-prophets.json';
const cards = document.querySelector('#cards');

async function getProphetData() {
    const response = await fetch(url);
    const data = await response.json();
    //console.table(data.prophets);
    displayProphets(data.prophets);
  }
  
  const displayProphets = (prophets) => {
    prophets.forEach((prophet) =>{
        let card = document.createElement('section');
        let fullName = document.createElement('h2');
        let portrait = document.createElement('img');
        let birthDate = document.createElement('h4');
        let birthPlace = document.createElement('h4');

        fullName.textContent = `${prophet.name} ${prophet.lastname}`;

        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.fullName}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        birthDate.textContent = `Date of birth: ${prophet.birthdate}`;

        birthPlace.textContent = `Place of birth : ${prophet.birthplace}`;

        card.appendChild(fullName);
        card.appendChild(birthDate);
        card.appendChild(birthPlace);
        card.appendChild(portrait); 
    
        
        cards.appendChild(card);
    } );
  }
  getProphetData();