// DataTables — auto-init: <table class="js-datatable">
// Opsi via atribut (default aktif; set "false" untuk mematikan):
//   data-searching, data-length-change, data-info, data-ordering, data-paging
//   data-page-length="10"
document.addEventListener('ui:ready', function () {
  if (!window.jQuery || !jQuery.fn.DataTable) return;
  var on = function (el, name) { return el.getAttribute(name) !== 'false'; };
  jQuery('.js-datatable').each(function () {
    if (jQuery.fn.DataTable.isDataTable(this)) return;
    jQuery(this).DataTable({
      paging: on(this, 'data-paging'),
      lengthChange: on(this, 'data-length-change'),
      searching: on(this, 'data-searching'),
      ordering: on(this, 'data-ordering'),
      info: on(this, 'data-info'),
      autoWidth: false,
      scrollX: true,
      pageLength: parseInt(this.getAttribute('data-page-length') || '10', 10),
      language: {
        search: 'Cari:',
        lengthMenu: 'Tampilkan _MENU_ data',
        info: 'Menampilkan _START_–_END_ dari _TOTAL_ data',
        infoEmpty: 'Tidak ada data',
        zeroRecords: 'Data tidak ditemukan',
        paginate: {
          previous: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
          next: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'
        }
      }
    });
  });
});
