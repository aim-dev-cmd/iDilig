document.addEventListener("DOMContentLoaded", function () {
  var interval = 2000; // 

  var items = document.querySelectorAll('.carousel-item');
  if (items.length === 0) return;

  var currentIndex = 0;

  function changeCarousel() {
    items[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % items.length;
    items[currentIndex].classList.add('active');
  }

  setInterval(changeCarousel, interval);
});