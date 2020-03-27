$(document).ready(function() {
    let pressed = false;
    let start = undefined;
    let startX, startWidth;

    $("table thead").on('mousedown', 'th.resizable', function(e) {
        start = $(this);
        pressed = true;
        startX = e.pageX;
        startWidth = $(this).width()
        $(start).addClass("resizing");
        $(start).addClass("noSelect");
    });

    $(document).mousemove(function(e) {
        if (pressed) {
            $(start).width(startWidth + (e.pageX - startX));
        }
    });

    $(document).mouseup(function() {
        if (pressed) {
            $(start).removeClass("nSelect");
            pressed = false;
        }
    });
});