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

//

$(document).ready(function () {
    var doRequestArtists = function (count, page) {
        $.get(
            "https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=rock&api_key=1ad6bea80327069ed4ecccf76fe34175&" +
            "limit=" + count + "&page=" + page + "&format=json"
        ).done(function (data) {
            $.each(data.topartists.artist, function (index, value) {
                var tile = $($.parseHTML("<div class='artist-grid-tile col-xs-6 col-sm-4 col-md-3 col-lg-2'></div>"))
                    .data("artist-name", value.name);
                // .css('background', 'url(' + value.image[2]["#text"] + ')');
                var img = $($.parseHTML("<img>")).addClass("img-responsive").css("width", "100%")
                    .attr("src", value.image[2]["#text"]);
                // .css("opacity", "0");
                img.appendTo(tile);

                var nameContainer = $($.parseHTML("<div></div>"))
                    .addClass("artist-grid-tile-name-container");

                var nameBackground = $($.parseHTML("<div></div>"))
                    .addClass("artist-grid-tile-name-background");

                var nameText = $($.parseHTML("<div class></div>"))
                    .text(value.name)
                    .addClass("artist-grid-tile-name-text");

                nameBackground.appendTo(nameContainer);
                nameText.appendTo(nameContainer);
                nameContainer.appendTo(tile);

                tile.appendTo("#artist-grid-container .row");
            });
        }).fail(function () {
            // alert('fail');
        });
    };

    var page = 1;
    doRequestArtists(36, page);

    $(window).scroll(function () {
        if (Math.ceil($(window).scrollTop() + $(window).height()) == $(document).height()) {
            console.log("scrolled to the bottom");
            doRequestArtists(36, ++page);
        }
    });

    var gridContainer = $("#artist-grid-container");
    var infoPanelContainer = $("#artist-grid-info-panel-container");
    var infoPanel = $("#artist-grid-info-panel");
    var infoPanelText = infoPanelContainer.find(".info-panel-text");

    gridContainer.on("mouseenter", ".artist-grid-tile", function () {
        $(this).find(".artist-grid-tile-name-container").fadeIn(200);
    });

    gridContainer.on("mouseleave", ".artist-grid-tile", function () {
        $(this).find(".artist-grid-tile-name-container").fadeOut(200);
    });

    gridContainer.on("click", ".artist-grid-tile", function() {
        var index = $(this).index(".artist-grid-tile");
        console.log("index = " + index);

        infoPanelContainer.data("under-num", index);

        gridAdjustWholeRow(infoPanelContainer);
        $(".artist-grid-tile").removeClass("callout callout-bottom");
        $(this).addClass("callout callout-bottom");

        var curHeight = infoPanel.height();

        infoPanelText.text("");
        infoPanelContainer.show();

        var autoHeight = infoPanel.css('height', 'auto').height();
        infoPanel.height(curHeight).animate(
            {height: autoHeight}, 200, function () {
                infoPanel.height('auto');
                doRequestInfo();
            }
        );

        var tile = $(this);
        var doRequestInfo = function () {
            $.get("https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + tile.data("artist-name")
                    + "&api_key=1ad6bea80327069ed4ecccf76fe34175&format=json")
                .done(function (data) {
                    var bio = data.artist.bio.content;

                    if (bio.length > 500) {
                        bio = bio.substr(0, 500) + "…";
                    }

                    var curHeight = infoPanel.height();

                    infoPanelText.text(bio);

                    var autoHeight = infoPanel.css('height', 'auto').height() + 10;
                    infoPanel.height(curHeight).animate({height: autoHeight}, 200, function () {
                        infoPanel.height('auto');
                    });
                });
        };
    });

    var lastViewport;
    var headImage = $(".head-image");
    var adjustHeadImage = function () {
        if (window.innerWidth == 767) {
            headImage.css("width", "300px").css("margin", "auto auto 10px");
        } else {
            headImage.css("width", "").css("margin", "");
        }

        headImage.css("height", headImage.css("width"));
        console.log('adjusted');
    };

    adjustHeadImage();

    $(window).resize(
        ResponsiveBootstrapToolkit.changed(function () {
            var current = ResponsiveBootstrapToolkit.current();

            // fire this only if viewport was changed (xs/sm/md/lg)
            if (current !== lastViewport) {
                gridAdjustWholeRow($(".whole-row"));
            }

            // adjust every time for xs or if viewport size has changed
            if ((current == "xs") || (current !== lastViewport)) {
                adjustHeadImage();
            }

//                        console.log('Current breakpoint: ', current);
            lastViewport = current;
        }, 10)
    );
});

//