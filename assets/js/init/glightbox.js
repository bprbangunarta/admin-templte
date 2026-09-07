// GLightbox — auto-init: <a class="glightbox" href="gambar-besar.jpg">
document.addEventListener('ui:ready', function () {
  if (window.GLightbox) GLightbox({ selector: '.glightbox' });
});
