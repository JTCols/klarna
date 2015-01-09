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
        var value = 0;

        return {

            /**
             *
             */
            init: function() {
                var that = this;

                //Add click event to last child box
                $(".kl-box:last-child").click(function(e){
                    that.addBox(e);
                });
            },

            /**
             * Add new box to the sequence, the function takes the element that initiated the action.
             *
             * The new box will be inserted directly after the given element unless the given element is the 6th in the
             * series, then a new group will be inserted with a new box
             *
             * @param el - The element that initiated the add, the new elmenet will be inserted after
             */
            addBox: function(e) {
                alert("O - H");
            },

            persist: function(){

            }
        }
    })();

    //Let's get this party started!
    boxManager.init();

});