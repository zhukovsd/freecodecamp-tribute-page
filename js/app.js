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
    var index = (gridRowByIndex(wholeRow.data("after-num")) + 1) * gridColCountByViewportSize() - 1;
    console.log("index = " + index);

    var elem = $("[num='" + index + "']");
    wholeRow.insertAfter(elem);
};