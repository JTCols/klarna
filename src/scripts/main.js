/**
 *
 *
 *
 */

//Entry point
$(document).ready(function () {
    var boxManager;

    /**
     * Box manager object
     *
     */
    boxManager = (function () {

        var dataModel = [],
            boxIndex = 1,
            colorIndex = 1,
            source = $("#box-template").html(),
            boxTemplate = Handlebars.compile(source),
            containerSource = $("#group-container-template").html(),
            groupContainerTemplate = Handlebars.compile(containerSource);

        return {

            /**
             * Initialization Function
             */
            init: function () {
                //initialize the page with one box.
                this.addBox();
            },


            /**
             * Add new box to the sequence.
             *
             *
             * @param e - The event that initiated the add, the new element will be inserted after its target.
             * @param redrawPage - boolean telling us if we can just insert this new box at the end or if we really
             *        need to redraw the page
             */
            addBox: function (e, redrawPage) {
                var dataObj,
                    currIndex,
                    boxId = this.getNextId();

                //create the data object for use by Handlebars template
                dataObj = {
                    boxId: boxId,
                    leftNumber: 0,
                    rightNumber: 0,
                    backgroundStyle: null,
                    arrayPosition: dataModel.length
                };

                //add styles
                dataObj = this.applyStyles(dataObj);

                if(!e){
                    dataModel.push(dataObj);
                } else {
                    currIndex = $(e.currentTarget).find(".arrayPosition")[0].value;
                    dataModel.splice(currIndex + 1, 0, dataObj);
                }

                //darken background.
                this.darkenBackground();

                this.renderAll();

            },

            darkenBackground: function(){
               var cont2 = $(".container-2"),
                   currColor = cont2.css("background-color"),
                   darkenedColor;

                darkenedColor = this.shadeBlend(-0.15, currColor );

                cont2.css("background-color", darkenedColor);
            },

            lightenBackground: function(){
                var cont2 = $(".container-2"),
                    currColor = cont2.css("background-color"),
                    darkenedColor;

                darkenedColor = this.shadeBlend(0.10, currColor );

                cont2.css("background-color", darkenedColor);
            },


            /**
             *For performance reasons we do not want to re-render the entire data model, if we can help usthat would just be wasteful.
             * We can be a bit smart and just insert a box where it needs to go if the last element was clicked.
             *
             * There is a good bit of logic needed  because of the need to add another group container every 6 boxes
             *
             * todo: this can be cleaned up a bit
             *
             * @param dataObj
             */
            insertBoxIntoDom: function (dataObj) {
                var insertElem,
                    containerElement,
                    groupElement,
                    currLastElement = $(".group-container:last-child .kl-box:last-child"); //last child of the last group

                //create the element to insert by applying data to the
                //pre-compiled handlebars template, then turn it into a JQuery object for your programming pleasure
                insertElem = $(boxTemplate(dataObj));

                //initial state and we need to insert a group-container
                if ($(".container-2 .group-container").length < 1) {

                    //group container
                    containerElement = $(groupContainerTemplate());
                    $(".container-2").html(containerElement);

                    //insert first box
                    groupElement = $(".group-container:last-child");
                    groupElement.html(insertElem);
                } else {
                    //We have a group container
                    groupElement = $(".group-container:last-child");

                    //is it time for a new group container?
                    if (groupElement.children().length === 6) {
                        //New group container for sequencing
                        containerElement = $(groupContainerTemplate());
                        containerElement.insertAfter(groupElement);
                        containerElement.html(insertElem);

                    } else {
                        var that = this;

                        //let's clean up the old event handler
                        currLastElement.unbind("click");

                        //we then need to add a new event handler
                        //Add click event to 2nd to last child box
                        currLastElement.click(function (e) {
                            that.addBox(e, true);
                        });

                        //insert the element into the DOM at the proper location
                        insertElem.insertAfter(currLastElement);
                    }
                }

                //add events to new box
                this.addBoxEvents(insertElem);

            },

            /**
             * We could be lazy and  just call this after every insert and be done with it. This would be less than
             * optimal in any mobile environment. We only want to call this when we are forced to redraw the entire
             * page.
             */
            renderAll: function () {
                var i = 0,
                    currentBox,
                    previousBox,
                    nextBox,
                    modelLength = dataModel.length,
                    that = this;

                //out with the old
                this.clearDisplay();

                //reset the color Index for redisplay
                colorIndex = 1

                //loop through dataModel and rebuild display. We will need reset some of the data
                for (; i < modelLength; i++) {
                    currentBox = dataModel[i];

                    if (i !== 0) {
                        previousBox = dataModel[i - 1];
                    }
                    if (i < modelLength) {
                        nextBox = dataModel[i + 1];
                    }
                    that.applyStyles(currentBox);

                    if(previousBox && previousBox.boxId){
                        currentBox.leftNumber = previousBox.boxId;
                    }

                    if(nextBox && nextBox.boxId ){
                        currentBox.rightNumber = nextBox.boxId;
                    }

                    this.insertBoxIntoDom(currentBox);
                }

            },

            /**
             * Clear all existing boxes from viewport
             *
             */

            clearDisplay: function () {
                $(".container-2").empty();
            },

            /**
             * The element needs styles added for width and color
             * @param dataObj
             */
            applyStyles: function (dataObj) {
                var style;
                switch (colorIndex) {
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
            addBoxEvents: function (element) {
                var that = this;

                //Add click event to last child box
                element.click(function (e) {
                    that.addBox(e);
                });

                element.find(".delete-container").click(function (e) {
                    that.removeBox(e);
                });


                element.on( "mouseenter", function(){
                    $( ".container-1" ).css( "border", "solid 10px black");
                    $( ".container-2" ).css( "border", "solid 15px black");
                });

                element.on( "mouseleave", function(){
                    $( ".container-1" ).css( "border", "solid 10px transparent");
                    $( ".container-2" ).css( "border", "solid 15px transparent");
                });

            },


            shadeBlend : function(p,c0,c1){
                var n=p<0?p*-1:p,
                    u=Math.round,
                    w=parseInt,
                    f;

                if(c0.length>7){
                    f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
                    return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
                }else{
                    f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
                    return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
                }
            },
            /**
             *
             * @param e
             */
            removeBox: function (e) {

                var boxElem = $(e.currentTarget).closest(".kl-box"),
                    currIndex = boxElem.find(".arrayPosition")[0].value;

                //update the model removing the selected element
                dataModel.splice(currIndex, 1);

                this.renderAll();

                this.lightenBackground();

                //todo add events to new last box
                e.stopPropagation();
            },

            /**
             * grab the next id
             */
            getNextId: function () {
                //todo add logic to handle setting boxIndex when the page is reopened.
                return (boxIndex++);
            },


            /**
             *
             */
            persist: function () {

            }
        }
    })();

    //Let's get this party started!
    boxManager.init();

});