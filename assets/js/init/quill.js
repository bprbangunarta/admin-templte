// Quill (WYSIWYG) — auto-init: <div class="js-quill" data-placeholder="…">
document.addEventListener('ui:ready', function () {
  if (!window.Quill) return;
  document.querySelectorAll('.js-quill').forEach(function (el) {
    new Quill(el, {
      theme: 'snow',
      placeholder: el.getAttribute('data-placeholder') || 'Tulis sesuatu…',
      modules: { toolbar: [['bold', 'italic', 'underline'], [{ header: [1, 2, false] }], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'clean']] }
    });
  });
});
