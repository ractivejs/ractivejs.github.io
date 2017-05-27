
/* Highlight */
$( document ).ready(function() {
    hljs.initHighlightingOnLoad();
    $('table').addClass('table table-striped table-hover');
  
    $('#mkdocs_search_modal').on('shown.bs.modal', function() {
      $('#mkdocs-search-query').focus();
    });
});

$('#main').scrollspy({
    target: '.bs-sidebar',
});

/* Prevent disabled links from causing a page reload */
$("li.disabled a").click(function() {
    event.preventDefault();
});
