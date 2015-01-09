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

        var dataModel = [],
            boxIndex = 0,
            source   = $("#box-template").html(),
            boxTemplate = Handlebars.compile(source);

        return {

            /**
             * Initialization Function
             */
            init: function() {
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
                var insertElem,
                    currLastElement = $(".kl-box:last-child"),
                    dataObj = {
                        id : this.getNextId()
                    };

                //let's clean up the old event handler
                if(currLastElement){
                    currLastElement.unbind( "click" );
                }

                //insert the element into the DOM at the proper location
                insertElem = $(boxTemplate(dataObj));
                insertElem.insertAfter(currLastElement);

                //add events to new box
                this.addBoxEvent(insertElem);

            },

            addBoxEvent: function(element){
                var that = this;

                //Add click event to last child box
                element.click(function(e){
                    that.addBox(e);
                });
            },

            getNextId: function(){
                //todo add logic to handle setting boxIndex when the page is reopened.

                return(boxIndex++);
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