// Select2 — auto-init: <select class="select2"> / <select class="select2-multi" multiple>
document.addEventListener('ui:ready', function () {
  if (!window.jQuery || !jQuery.fn.select2) return;
  jQuery('.select2').each(function () { jQuery(this).select2({ width: '100%' }); });
  jQuery('.select2-multi').each(function () {
    jQuery(this).select2({ width: '100%', placeholder: this.getAttribute('data-placeholder') || 'Pilih beberapa' });
  });
});
