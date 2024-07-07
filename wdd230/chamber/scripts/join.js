"use strict";

const nav = document.querySelector('.header-nav');
const menuBtn = document.querySelector('.menu-btn');

//  getting current date
const date = new Date();
// getting the current month
let currentMonth = date.getMonth();
// getting the current year
let currentYear = date.getFullYear()


class Switch {
  constructor(switchMode) {
    this.switchBtn = switchMode;
    this.switchBtn.addEventListener('click', () => this.toggleStatus());
    this.switchBtn.addEventListener('keydown', (event) =>
      this.handleKeydown(event)
    );
  }

  handleKeydown(event) {
    // Only do something when space or return is pressed
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleStatus();
    }
  }

  // Switch state of a switch
  toggleStatus() {
    const currentState =
      this.switchBtn.getAttribute('aria-checked') === 'true';
    const switchDot = this.switchBtn.querySelector('.switch span');
    const newState = String(!currentState);

    this.switchBtn.setAttribute('aria-checked', newState);
    switchDot.classList.toggle('moveRight');
  }
}

// // Initialize switches
window.addEventListener('load', function () {
  // Initialize the Switch component on all matching DOM nodes
  Array.from(document.querySelectorAll('[role^=switch]')).forEach(
    (element) => {
      new Switch(element)
    }
  );
  displayChamberMembers();
});

// Displaying Chamber members and there membership status
function displayChamberMembers() {
  const memberCardBox = document.querySelector('.member-card-section');
  const gridBtn = document.getElementById('grid-view');
  const listBtn = document.getElementById('list-view');

  const renderMembers = function (members) {
    members.forEach((member) => {
      const html = `
        <div class="member-card">
            <figure>
              <div>
                <img src="${member.image}" alt="${member.name} logo" width="1000" height="623" loading="lazy">
              </div>
              <figcaption>${member.name}</figcaption>
            </figure>
            <div class="member-info-box">
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <a href="${member.website}">${member.website.slice(8)}</a>
                <img src="${member.membershipLevel}" alt="" width="45" height="64">
            </div>
        </div>
      `;
      memberCardBox.insertAdjacentHTML('afterbegin', html)
    })
  }

 


  // ///////////////////////////////////////////////////////
 
}

// //////////////////////////////////////////////


// ///////////////////////////////////////////////
// The active page functionality - highlight the current  active 
// page
function activePage() {

  function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-links');
    const currentURL = window.location.href;

    navLinks.forEach(link => {
      if (currentURL === link.href) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  setActiveLink();
}
activePage();




