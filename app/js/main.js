var KLARNA = KLARNA || {};

$(function() {

    KLARNA.app = (function($){
        var stateName = 'klarna.state';
        var $document = $(document);
        var $deletedContainer = $('.service__delete-info');
        var $boxesCountContainer = $('.service__boxes-info');

        return {
            init: function() {
                KLARNA.layout.init(this.getState());

                $document.on('box.delete box.add', $.proxy(this.onChangeState, this));
                $document.on('click', '.service__clear', $.proxy(this.onClearState, this));

                this.setBoxesCountNumber();
            },
            onChangeState: function() {
                this.setState(KLARNA.layout.state);

                this.setDeletedNumber();
                this.setBoxesCountNumber();
            },
            onClearState: function() {
                this.removeState();

                KLARNA.layout.clearState();
                this.setBoxesCountNumber();
                this.setDeletedNumber();
            },
            setState: function(state) {
                localStorage && localStorage.setItem(stateName, state);
            },
            getState: function() {
                var state = localStorage && localStorage.getItem(stateName);
                var stateArr;

                if (state) {
                    stateArr = state.split(',');

                    stateArr = stateArr.map(function(id) {return parseInt(id, 10);});
                }

                return stateArr;
            },
            removeState: function() {
                localStorage && localStorage.removeItem(stateName);
            },
            setDeletedNumber: function() {
                $deletedContainer.text(KLARNA.layout.deleted);
            },
            setBoxesCountNumber: function() {
                $boxesCountContainer.text(KLARNA.layout.state.length)
            }
        };
    })(jQuery);

    KLARNA.app.init();

});

