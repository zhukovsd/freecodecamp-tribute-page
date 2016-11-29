/**
 * Created by ZhukovSD on 09.11.2016.
 */

var gridColCountByViewportSize = function() {
    switch (ResponsiveBootstrapToolkit.current()) {
        case 'xs':
            return 2;
            break;

        case 'sm':
            return 3;
            break;

        case 'md':
            return 4;
            break;

        case 'lg':
            return 6;
            break;
    }
};

var gridRowByIndex = function(index) {
    return Math.floor(index / gridColCountByViewportSize());
};

var gridAdjustWholeRow = function(wholeRow) {
    var index = (gridRowByIndex(wholeRow.data("under-num")) + 1) * gridColCountByViewportSize() - 1;
    // console.log("insert after " + index);

    // var elem = $("[num='" + index + "']");
    // var elem = $(".artist-grid-tile:nth-of-type(" + index + ")");
    var elem = $(".artist-grid-tile").eq(index);
    wholeRow.insertAfter(elem);
};

$(document).ready(function() {
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            // alert("bottom!");
        }
    });

    $.get("http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=rock&api_key=1ad6bea80327069ed4ecccf76fe34175&limit=36&format=json")
        .done(function(data) {
            $.each(data.topartists.artist, function(index, value) {
                $($.parseHTML('<div class="artist-grid-tile col-xs-6 col-sm-4 col-md-3 col-lg-2"><img></div>'))
                    .children(":first").addClass("img-responsive").css("width", "100%").attr("src", value.image[2]["#text"])
                    .parent().appendTo("#artist-grid-container .row");
            });
        })
        .fail(function() {
            alert('fail');
        });
});

//