var KLARNA = KLARNA || {};

KLARNA.utils = (function() {
    return {
        changeColor: function(color, ratio, darker) {
            var rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            var difference = Math.round(ratio * 256) * (darker ? -1 : 1);
            var decimal = [rgb[1], rgb[2], rgb[3]];

            return 'rgb(' + Math[darker ? 'max' : 'min'](
                        parseInt(decimal[0], 10) + difference, darker ? 0 : 255
                    ) + ', ' +
                    Math[darker ? 'max' : 'min'](
                        parseInt(decimal[1], 10) + difference, darker ? 0 : 255
                    ) + ', ' +
                    Math[darker ? 'max' : 'min'](
                        parseInt(decimal[2], 10) + difference, darker ? 0 : 255
                    ) + ')';
        },
        lighterColor: function(color, ratio) {
            return this.changeColor(color, ratio, false);
        },
        darkerColor: function(color, ratio) {
            return this.changeColor(color, ratio, true);
        }
    };
})();
