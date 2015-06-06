var KLARNA = KLARNA || {};

$(function() {

    /**
     * layout module
     * @type {{init, onBoxHover, onBoxClick, onBoxDelete, addBox, recalc, clearState, setContainerBgColor, getContainerBgColor}}
     */
    KLARNA.layout = (function($) {
        var $document = $(document);
        var sizeRepeat = 6; // sizes of boxes repeat every 6 box
        var $container1 = $('.container1');
        var $container2 = $('.container2');
        var initialBgColor; // save initial color to retrieve it when clear state
        var boxesById = {}; // save boxes by their id
        var currentId; // the id for the next box

        return {
            /**
             * layout initialization
             * @param {array} [initialState=[1]] The initial state for the layout
             */
            init: function(initialState) {
                initialState = initialState || [1];

                var self = this;

                self.state = []; // the current state of the layout
                self.deleted = 0; // the number of deleted boxes

                /*
                    current id is the hightes id in state array
                    slice for not mutating array
                    sort function to sort as numbers
                 */
                currentId = initialState.slice().sort(function(a, b){return a-b;})[initialState.length -1];
                initialBgColor = self.getContainerBgColor();

                $document.on('mouseenter', '.box', self.onBoxHover('add'));

                $document.on('mouseleave', '.box', self.onBoxHover('remove'));

                $document.on('click', '.box', self.onBoxClick());

                $document.on('box.delete', self.onBoxDelete());

                // add boxes for initial state
                initialState.forEach(function(id, index) {
                    var prev = index - 1;

                    self.addBox(prev, id);
                });
            },
            /**
             * closure which returns onBoxHover listener
             * @param {string} method add or remove
             * @returns {Function}
             */
            onBoxHover: function(method) {
                var self = this;

                /**
                 * When box hovered the border should appear on box, container1 and container2
                 */
                return function() {
                    var $box = $(this);
                    var hoverElements = $container1.add($container2);

                    hoverElements.add($box).each(function(index, el) {
                        var $el = $(el);

                        // add or delete .hover according to method
                        $el[method + 'Class']('hover');
                    });
                };
            },
            /**
             * closure which returns onBoxClick listener
             * @returns {Function}
             */
            onBoxClick: function() {
                var self = this;

                /**
                 * when clicked we add new box next to the clicked one
                 */
                return function() {
                    var $box = $(this);
                    var id = $box.data('id'); // retrieve the id of the box which we clicked from data
                    var index = self.state.indexOf(id); // retrieve its order in layout

                    self.addBox(index); // add box next to the clicked on

                    $document.trigger('box.add');
                };
            },
            /**
             * closure which returns onBoxDelete listener
             * @returns {Function}
             */
            onBoxDelete: function() {
                var self = this;

                /**
                 * delete box from layout
                 */
                return function(e, data) {
                    var id = data.id; // id sended with event data
                    var box = boxesById[id]; // get box by id from box storage
                    var index = self.state.indexOf(id); // retrieve its order in layout
                    var newBgColor = KLARNA.utils.lighterColor(self.getContainerBgColor(), 0.03); // new lighter color for the container

                    // one box should always be in layout
                    if (self.state.length === 1) {
                        return alert('Sorry, it is impossible to delete the last box');
                    }

                    // friendly confirmation
                    if (confirm('Hi! Do you realy want to delete box #' + id)) {
                        self.setContainerBgColor(newBgColor);

                        box.$box.remove(); // delete box from layout

                        if (index !== -1) {
                            self.state.splice(index, 1); // delete box id from state
                        }

                        delete boxesById[id]; // delete box instance from storage

                        self.recalc(); // recalculate sizes, and box neighbors

                        self.deleted++;
                    }
                };
            },
            /**
             * add box to the layout
             * @param {number} prev The id of box after which we should add the new one
             * @param {number} [id=currentId] The id of the new box
             */
            addBox: function(prev, id) {
                id = id || currentId;

                var state = this.state;
                var box = new KLARNA.Box(id);
                var $box = box.$box;
                var prevId; // id of the previos box
                var prevBox;
                var newBgColor = KLARNA.utils.darkerColor(this.getContainerBgColor(), 0.03); // new darker color

                this.setContainerBgColor(newBgColor);

                // insert the id of the new box in state array
                state.splice(prev + 1, 0, id);
                // insert tne new box into the storage of the boxes
                boxesById[id] = box;

                // if prev === -1 that means we have no box on the page and we should prepend the one
                if (prev === -1) {
                    $container2.prepend($box);
                } else {
                    // insert box after the previous one
                    prevId = state[prev];
                    prevBox = boxesById[prevId];
                    prevBox.$box.after($box);
                    prevBox.$box.after('\n'); // inser \n for ie8 to fix the layout
                }

                // increase currentId if it's bigger that the current one
                if (id >= currentId) {
                    currentId++;
                }

                // recalculate sizes, and box neighbors
                this.recalc();
            },
            /**
             * recalculate box sizes, and box neighbors
             */
            recalc: function() {
                var self = this;

                // recalculate the state of each box
                self.state.forEach(function(id, index) {
                    var box = boxesById[id];
                    var mod = (index + 1) % sizeRepeat;
                    var leftNeighbor = self.state[index-1];
                    var rightNeighbor = self.state[index+1];

                    // set the neighbours according to the state
                    box.setLeftNeighbor(leftNeighbor);
                    box.setRightNeighbor(rightNeighbor);

                    // set the size of box. Every 1st, 2nd and 3rd - size s, 4th and 5th - size m and 6th - size l
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

                    // delete neighbor number according to the mockup
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
            },
            /**
             * clear state of the layout
             */
            clearState: function() {
                this.state = [];
                this.deleted = 0;
                currentId = 1;
                boxesById = {};

                $container2.empty();

                this.setContainerBgColor(initialBgColor);

                this.addBox(-1, 1);
            },
            /**
             * Set the container2 color.
             * @param {string} color Color to set
             */
            setContainerBgColor: function(color) {
                $container2.css('background-color', color);
            },
            /**
             * Get the container2 color
             * @returns {string}
             */
            getContainerBgColor: function() {
                return $container2.css('background-color');
            }
        };
    })(jQuery);
});
