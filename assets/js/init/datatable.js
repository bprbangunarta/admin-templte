// DataTables — auto-init: <table class="js-datatable">
// Opsi via atribut: data-page-length="10", data-scroll-x (ada = aktif)
document.addEventListener('ui:ready', function () {
  if (!window.jQuery || !jQuery.fn.DataTable) return;
  jQuery('.js-datatable').each(function () {
    if (jQuery.fn.DataTable.isDataTable(this)) return;
    jQuery(this).DataTable({
      paging: true, lengthChange: true, searching: true, ordering: true, info: true,
      autoWidth: false,
      scrollX: this.hasAttribute('data-scroll-x') ? true : true,
      pageLength: parseInt(this.getAttribute('data-page-length') || '10', 10),
      language: {
        search: 'Cari:',
        lengthMenu: 'Tampilkan _MENU_ data',
        info: 'Menampilkan _START_–_END_ dari _TOTAL_ data',
        infoEmpty: 'Tidak ada data',
        zeroRecords: 'Data tidak ditemukan',
        paginate: { previous: 'Sebelumnya', next: 'Berikutnya' }
      }
    });
  });
});
