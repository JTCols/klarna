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
            boxIndex = 1,
            colorIndex = 1,
            widthIndex = 1,
            source   = $("#box-template").html(),
            boxTemplate = Handlebars.compile(source),
            containerSource =  $("#group-container-template").html(),
            groupContainerTemplate = Handlebars.compile(containerSource);

        return {

            /**
             * Initialization Function
             */
            init: function() {
                //initialize the page with one box.
                this.addBox();
            },


            /**
             * Add new box to the sequence.
             *
             *
             * @param e - The event that initiated the add, the new element will be inserted after its target.
             */
            addBox: function(e) {
                var dataObj,
                    boxId = this.getNextId();

                //create the data object for use by Handelbars template
                dataObj = {
                    boxId: boxId,
                    leftNumber: boxId - 1,
                    rightNumber: boxId + 1,
                    backgroundStyle: null
                };

                //add styles
                dataObj = this.applyStyles(dataObj);

                //add this to the global dataModel for persistence
                dataModel.push(dataObj);

                //place the element into the dom
                this.insertBoxIntoDom(dataObj);
            },


            /**
             *For performance reasons we do not want to re-render the entire data model, that would just be wasteful.
             * We can be a bit smart and just insert a box where it needs to go.
             *
             * There is a good bit of logic needed  because of the need to add another group container every 6 boxes
             *
             * todo: this can be cleaned up a bit
             *
             * @param dataObj
             */
            insertBoxIntoDom: function(dataObj) {
                var insertElem,
                    containerElement,
                    groupElement,
                    currLastElement = $(".group-container:last-child .kl-box:last-child"); //last child of the last group

                //create the element to insert by applying data to the
                //pre-compiled handlebars template, then turn it into a JQuery object for your programming pleasure
                insertElem = $(boxTemplate(dataObj));

                //initial state and we need to insert a group-container
                if($(".container-2 .group-container").length < 1){

                    //group container
                    containerElement = $(groupContainerTemplate());
                    $(".container-2").html(containerElement);

                    //insert first box
                    groupElement = $(".group-container:last-child");
                    groupElement.html(insertElem);
                }else{
                    //We have a group container
                    groupElement = $(".group-container:last-child");

                    //is it time for a new group container?
                    if(groupElement.children().length === 6){
                        //New group container for sequencing
                        containerElement = $(groupContainerTemplate());
                        containerElement.insertAfter(groupElement);
                        containerElement.html(insertElem);

                    } else {
                        //let's clean up the old event handler
                        currLastElement.unbind( "click" );

                        //insert the element into the DOM at the proper location
                        insertElem.insertAfter(currLastElement);
                    }
                }

                //add events to new box
                this.addBoxEvents(insertElem);


            },


            render: function(){

            },


            /**
             * The element needs styles added for width and color
             * @param dataObj
             */
            applyStyles : function(dataObj){
                var style;
                switch(colorIndex){
                    case 2:
                        style = "red";
                        colorIndex++;
                        break;
                    case 3:
                        style = "green";
                        colorIndex++;
                        break;
                    case 4:
                        style = "blue";
                        colorIndex = 1;//reset the index
                        break;
                    default:
                        style = "white";
                        colorIndex++;
                        break;
                }

                dataObj.backgroundStyle = style;
                return dataObj;

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

                //add events to new last box
                this.addBoxEvents($(".group-container:last-child .kl-box:last-child"));

                //todo add events to new last box
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