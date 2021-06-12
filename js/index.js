$(document).ready(function() {

    
 
    // isotope filter
    var $grid = $(".grid").isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
    });

    // filter items on button click
    $(".button-group").on("click", "button", function() {
        var filterValue = $(this).attr('data-filter');
        
        $grid.isotope({ filter: filterValue });
    })
});


