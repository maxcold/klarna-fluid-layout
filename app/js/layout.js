var KLARNA = KLARNA || {};

$(function() {
    KLARNA.layout = (function($) {
        var $document = $(document);
        var sizeRepeat = 6;
        var $container1 = $('.container1');
        var $container2 = $('.container2');
        var state = [];
        var boxesById = {};
        var currentId;

        return {
            init: function(initialState) {
                initialState = initialState || [1];

                var self = this;

                currentId = initialState.sort()[initialState.length -1];

                $document.on('mouseenter', '.box', self.onHover('add'));

                $document.on('mouseleave', '.box', self.onHover('remove'));

                $document.on('click', '.box', self.onClick());

                initialState.forEach(function(id, index) {
                    var prev = index - 1;

                    self.addBox(prev, id)
                })
            },
            onHover: function(method) {

                return function() {
                    var $box = $(this);
                    var hoverElements = $container1.add($container2);

                    hoverElements.add($box).each(function(index, el) {
                        var $el = $(el);

                        $el[method + 'Class']('hover');
                    });
                }
            },
            onClick: function() {
                var self = this;

                return function() {
                    var $box = $(this);
                    var id = $box.data('id');
                    var index = state.indexOf(id);

                    self.addBox(index)
                }
            },
            addBox: function(prev, id) {
                id = id || currentId;

                var box = new KLARNA.Box(id);
                var $box = box.$box;
                var prevId;
                var prevBox;

                state.splice(prev + 1, 0, id);
                boxesById[id] = box;

                if (prev === -1) {
                    $container2.append($box);
                } else {
                    prevId = state[prev];
                    prevBox = boxesById[prevId];
                    prevBox.$box.after($box);
                }

                if (id >= currentId) {
                    currentId++
                }

                this.recalc();
            },
            //todo: добавить с какого элемента пересчитывать
            recalc: function() {
                state.forEach(function(id, index) {
                    var box = boxesById[id];
                    var mod = (index + 1) % sizeRepeat;

                    switch (mod) {
                        case 1:
                        case 2:
                        case 3:
                            box.setSize(box.sizes[0]);
                            break;
                        case 4:
                        case 5:
                            box.setSize(box.sizes[1]);
                            break;
                        case 0:
                            box.setSize(box.sizes[2]);
                            break;
                    }
                });
            }
        };
    })(jQuery);
});
