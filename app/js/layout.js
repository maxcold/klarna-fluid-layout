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

                $document.on('mouseenter', '.box', self.onBoxHover('add'));

                $document.on('mouseleave', '.box', self.onBoxHover('remove'));

                $document.on('click', '.box', self.onBoxClick());

                $document.on('box.delete', self.onBoxDelete());

                initialState.forEach(function(id, index) {
                    var prev = index - 1;

                    self.addBox(prev, id);
                });
            },
            onBoxHover: function(method) {
                var self = this;

                return function() {
                    var $box = $(this);
                    var hoverElements = $container1.add($container2);

                    hoverElements.add($box).each(function(index, el) {
                        var $el = $(el);

                        $el[method + 'Class']('hover');
                    });
                };
            },
            onBoxClick: function() {
                var self = this;

                return function() {
                    var $box = $(this);
                    var id = $box.data('id');
                    var index = state.indexOf(id);
                    var newBgColor = KLARNA.utils.darkerColor($container2.css('background-color'), 0.01);

                    $container2.css('background-color', newBgColor);

                    self.addBox(index);
                };
            },
            onBoxDelete: function() {
                var self = this;

                return function(e, data) {
                    var id = data.id;
                    var box = boxesById[id];
                    var index = state.indexOf(id);
                    var newBgColor = KLARNA.utils.lighterColor($container2.css('background-color'), 0.01);

                    if (confirm('Hi! Do you realy want to delete box #' + id)) {
                        $container2.css('background-color', newBgColor);

                        box.$box.remove();

                        if (index !== -1) {
                            state.splice(index, 1);
                        }

                        delete boxesById[id];

                        self.recalc();
                    }
                };
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
                    currentId++;
                }

                this.recalc();
            },
            //todo: добавить с какого элемента пересчитывать
            recalc: function() {
                state.forEach(function(id, index) {
                    var box = boxesById[id];
                    var mod = (index + 1) % sizeRepeat;
                    var leftNeighbor = state[index-1];
                    var rightNeighbor = state[index+1];

                    box.setLeftNeighbor(leftNeighbor);
                    box.setRightNeighbor(rightNeighbor);

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

                    switch (mod) {
                        case 1:
                            box.setLeftNeighbor();
                            break;
                        case 3:
                            box.setRightNeighbor();
                            break;
                        case 4:
                            box.setLeftNeighbor();
                            break;
                        case 5:
                            box.setRightNeighbor();
                            break;
                        case 0:
                            box.setLeftNeighbor();
                            box.setRightNeighbor();
                            break;
                    }
                });
            }
        };
    })(jQuery);
});
