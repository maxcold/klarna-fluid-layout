$(function() {
    var $document = $(document);
    var layout = (function() {
        var $container1 = $('.container1');
        var $container2 = $('.container2');

        return {
            init: function() {
                $document.on('mouseenter', '.box', this.onHover('add'));

                $document.on('mouseleave', '.box', this.onHover('remove'));
            },
            onHover: function(metod) {

                return function() {
                    var $box = $(this);
                    var hoverElements = $container1.add($container2);

                    hoverElements.add($box).each(function(index, el) {
                        var $el = $(el);

                        $el[metod + 'Class']('hover');
                    });
                }
            }
        };
    })();

    layout.init();

});

