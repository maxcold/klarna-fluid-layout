var KLARNA = KLARNA || {};

/**
 * utility module
 * @type {{changeColor, hexToRgb, lighterColor, darkerColor}}
 */
KLARNA.utils = (function() {
    return {
        /**
         * make given color darker or lighter
         * @param {string} color Color in hex or rgb format (#ccc, #cccccc or rgb(200, 200, 200))
         * @param {number} ratio The number between 0 and 1. By what ratio the color should be changed
         * @param {boolean} darker Darken or lighten
         * @returns {string} in rgb format
         */
        changeColor: function(color, ratio, darker) {
            var difference = Math.round(ratio * 256) * (darker ? -1 : 1); // the diffeence between old and new color, from -256 to 256
            var rgb;
            var decimal; // the array of 3 numbers [r, g, b]

            // IE8 returns color as hex
            if (color.indexOf('#') !== -1) {
                rgb = this.hexToRgb(color);
                decimal = [rgb.r, rgb.g, rgb.b];
            } else {
                rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                decimal = [rgb[1], rgb[2], rgb[3]];
            }

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
        /**
         * convert hex string to rgb object
         * @param hex color in hex format (#ccc or #cccccc)
         * @returns {*} {r: number, g: number, b: number}
         */
        hexToRgb: function(hex) {
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        /**
         * Make the color lighter. Shortand method for changeColor.
         * @param {string} color Color in hex or rgb format (#ccc, #cccccc or rgb(200, 200, 200))
         * @param {number} ratio The number between 0 and 1. By what ratio the color should be changed
         * @returns {string}
         */
        lighterColor: function(color, ratio) {
            return this.changeColor(color, ratio, false);
        },
        /**
         * Make the color darker. Shortand method for changeColor.
         * @param {string} color Color in hex or rgb format (#ccc, #cccccc or rgb(200, 200, 200))
         * @param {number} ratio The number between 0 and 1. By what ratio the color should be changed
         * @returns {string}
         */
        darkerColor: function(color, ratio) {
            return this.changeColor(color, ratio, true);
        }
    };
})();
