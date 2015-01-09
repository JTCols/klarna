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
                var currLastElement = $(".kl-box:last-child"),
                    dataObj,
                    insertElem,
                    boxId = this.getNextId();

                //create the data object for use by Handelbars template
                dataObj = {
                    boxId: boxId,
                    leftNumber: boxId - 1,
                    rightNumber: boxId + 1
                };

                insertElem = $(boxTemplate(dataObj));

                //if this does not exist we are in an empty state and need to
                //inject our first box in a different place
                if(currLastElement.length > 0){
                    //let's clean up the old event handler
                    currLastElement.unbind( "click" );

                    //insert the element into the DOM at the proper location
                    insertElem.insertAfter(currLastElement);
                }else{
                    //insert the element into the DOM at the proper location
                    $(".container-2").html(insertElem);
                }

                //add events to new box
                this.addBoxEvents(insertElem);

                //last but not least add this to the global dataModel for persistence
                dataModel.push(dataObj);
            },

            /**
             *
             * @param element
             */
            addBoxEvents: function(element){
                var that = this;

                //Add click event to last child box
                element.click(function(e){
                    that.addBox(e);
                });

                element.find(".delete-container").click(function(e){
                    that.removeBox(e);
                });
            },

            /**
             *
             * @param e
             */
            removeBox: function(e){

                var boxElem = $(e.currentTarget).closest(".kl-box");
                boxElem.remove();

                e.stopPropagation();
            },

            /**
             * grab the next id
             */
            getNextId: function(){
                //todo add logic to handle setting boxIndex when the page is reopened.
                return(boxIndex++);
            },


            /**
             *
             */
            persist: function(){

            }
        }
    })();

    //Let's get this party started!
    boxManager.init();

});