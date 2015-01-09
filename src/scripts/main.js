/**
 *
 *
 *
 */


//Entry point
$( document ).ready(function() {
    var boxManager;

    /**
     * Box manager object
     *
     */
    boxManager = (function() {

        var dataModel = [];

        return {

            /**
             * Initialization Function
             */
            init: function() {
                var that = this;

                //Add click event to last child box
                $(".kl-box:last-child").click(function(e){
                    that.addBox(e);
                });

                //initialize the page with one box.
                this.addBox();
            },

            /**
             * Add new box to the sequence, the function takes the element that initiated the action.
             *
             * The new box will be inserted directly after the given element unless the given element is the 6th in the
             * series, then a new group will be inserted with a new box
             *
             * @param e - The event that initiated the add, the new element will be inserted after its target.
             */
            addBox: function(e) {
                alert("O - H");
            },

            removeBox: function(e){

            },

            persist: function(){

            }
        }
    })();

    //Let's get this party started!
    boxManager.init();

});