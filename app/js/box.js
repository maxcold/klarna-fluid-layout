var KLARNA = KLARNA || {};

$(function() {
    /**
     * Box object
     */
    KLARNA.Box = (function($) {
        var $document = $(document);
        var boxTmpl = Handlebars.compile($('#boxTmpl').html()); // box template

        /**
         * Box constructor
         * @param {number} id The box id
         * @constructor
         */
        function Box(id) {
            var self = this;

            this.id = id;
            this.$box = $(boxTmpl({
                id: this.id
            })); // Jquery object for box DOM
            this.$box.data('id', this.id); // save id in data
            this.sizes = ['s','m','l']; // box sizes
            this.sizeCls = 'box_size_'; // size class template
            this.allSizeCls = this.sizes.reduce(function(result, num) {
                return result + self.sizeCls + num + ' ';
            }, ''); // string with all size classes to convenience delete
            this.leftNeighborContainer = this.$box.find('.box__left-neighbour'); // left neighbor id container
            this.rightNeighborContainer = this.$box.find('.box__right-neighbour'); // right neighbor id container

            this.$box.on('click', '.box__delete', $.proxy(this.onDelete, this));
        }

        /**
         * onDelete listener. trigger 'box.delete' event with id of the box
         * @param e
         */
        Box.prototype.onDelete = function(e) {
            e.stopPropagation(); // stop propagating of the click

            var id = this.$box.data('id');

            $document.trigger('box.delete', {id: id});
        };

        /**
         * set the size class of the box
         * @param {string} size
         */
        Box.prototype.setSize = function(size) {
            var $box = this.$box;

            // delete previous size class and add new one
            $box.removeClass(this.allSizeCls);
            $box.addClass(this.sizeCls + size);
        };

        /**
         * set the left neighbor id
         * @param {number} id
         */
        Box.prototype.setLeftNeighbor = function(id) {
            id = id || '';

            this.leftNeighborContainer.text(id);
        };

        /**
         * set the right neighbor id
         * @param {number} id
         */
        Box.prototype.setRightNeighbor = function(id) {
            id = id || '';

            this.rightNeighborContainer.text(id);
        };

        return Box;
    })(jQuery);
});

