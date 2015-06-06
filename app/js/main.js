var KLARNA = KLARNA || {};

$(function() {

    /**
     * main app module
     * @type {{init, onChangeState, onClearState, setState, getState, removeState, setDeletedNumber, setBoxesCountNumber}}
     */
    KLARNA.app = (function($){
        var stateName = 'klarna.state'; // key for localStorage
        var $document = $(document);
        var $deletedContainer = $('.service__delete-info'); // container for the number of removals
        var $boxesCountContainer = $('.service__boxes-info'); // container for the number of boxes on page

        return {
            /**
             * app initialization
             */
            init: function() {
                // init layout with empty state or state stored in storage
                KLARNA.layout.init(this.getState());

                // state changes when we add or delete boxes
                $document.on('box.delete box.add', $.proxy(this.onChangeState, this));
                $document.on('click', '.service__clear', $.proxy(this.onClearState, this));

                this.setBoxesCountNumber();
            },
            /**
             * every time we add or delete boxes we should save state and change the number of visible and deleted boxes
             */
            onChangeState: function() {
                this.setState(KLARNA.layout.state);

                this.setDeletedNumber();
                this.setBoxesCountNumber();
            },
            /**
             * clear state of the app. Remove state from storage, clear state of the layout and reset statistics
             */
            onClearState: function() {
                this.removeState();

                KLARNA.layout.clearState();
                this.setBoxesCountNumber();
                this.setDeletedNumber();
            },
            /**
             * save state in localStorage
             * @param {array} state The state to save
             */
            setState: function(state) {
                if (localStorage) {
                    localStorage.setItem(stateName, state);
                }
            },
            /**
             * get state from localStorage
             * @returns {array|undefined}
             */
            getState: function() {
                var state = localStorage ? localStorage.getItem(stateName) : undefined;
                var stateArr;

                // state array stored as a string, we should retrieve it from it
                if (state) {
                    stateArr = state.split(',');

                    //make sure the elements are integers
                    stateArr = stateArr.map(function(id) {return parseInt(id, 10);});
                }

                return stateArr;
            },
            /**
             * remove state from localStorage
             */
            removeState: function() {
                if (localStorage) {
                    localStorage.removeItem(stateName);
                }
            },
            /**
             * set the number of deleted boxes to its container
             */
            setDeletedNumber: function() {
                $deletedContainer.text(KLARNA.layout.deleted);
            },
            /**
             * set the number of visible boxes to its container
             */
            setBoxesCountNumber: function() {
                $boxesCountContainer.text(KLARNA.layout.state.length);
            }
        };
    })(jQuery);
});

