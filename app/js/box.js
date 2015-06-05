var KLARNA = KLARNA || {};

$(function() {
    KLARNA.Box = (function($) {
        var boxTmpl = Handlebars.compile($('#boxTmpl').html());

        function Box(id) {
            var self = this;

            this.id = id;
            this.$box = $(boxTmpl({
                id: this.id
            }));
            this.$box.data('id', this.id);
            this.sizes = [1,2,3];
            this.sizeCls = 'box_size_';
            this.allSizeCls = this.sizes.reduce(function(result, num) {
                return result + self.sizeCls + num + ' ';
            }, '');
            this.leftNeighborContainer = this.$box.find('.box__left-neighbour');
            this.rightNeighborContainer = this.$box.find('.box__right-neighbour');
        }

        Box.prototype.setSize = function(size) {
            var $box = this.$box;

            $box.removeClass(this.allSizeCls);
            $box.addClass(this.sizeCls + size);
        };

        Box.prototype.setLeftNeighbor = function(id) {
            id = id || '';

            var $box = this.$box;

            this.leftNeighborContainer.text(id);
        };

        Box.prototype.setRightNeighbor = function(id) {
            id = id || '';

            var $box = this.$box;

            this.rightNeighborContainer.text(id);
        };

        return Box;
    })(jQuery);
});

