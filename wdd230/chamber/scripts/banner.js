const banner = document.querySelector('#top-page-banner');

let dayOfWeek = new Date().getDay();

if (dayOfWeek == 1 || dayOfWeek == 2 || dayOfWeek == 3) {
    banner.style.display = 'block';
}
else {
    banner.style.display = 'none';
}

// Script for closing the banner
const closeBtn = document.querySelector('.bannerBtn');
closeBtn.addEventListener('click', function() {
    if (banner.style.display !== "none") {
        banner.style.display = "none";
    }
})
