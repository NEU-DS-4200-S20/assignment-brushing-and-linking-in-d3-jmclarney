/* global D3 */

function table() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;

  // Create the chart by adding an svg to the div with the id 
  // specified by the selector using the given data
  function chart(selector, data) {
    let table = d3.select(selector)
      .append("table")
        .classed("my-table", true);

    // Here, we grab the labels of the first item in the dataset
    //  and store them as the headers of the table.
    let tableHeaders = Object.keys(data[0]);

    // You should append these headers to the <table> element as <th> objects inside
    // a <th>
    // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table

    let header = table.append("thead").append("tr")
    header
      .selectAll("th")
      .data(tableHeaders)
      .enter()
      .append("th")
      .text(function(d) { return d; });

    // Then, you add a row for each row of the data.  Within each row, you
    // add a cell for each piece of data in the row.
    // HINTS: For each piece of data, you should add a table row.
    // Then, for each table row, you add a table cell.  You can do this with
    // two different calls to enter() and data(), or with two different loops.


    var dragTarget = null,
    hoverTarget = null,
    htmlTable = null,
    erase = false;

  let tablebody = table.append("tbody");

  // Then, add code to allow for brushing.  Note, this is handled differently
  // than the line chart and scatter plot because we are not using an SVG.
  // Look at the readme of the assignment for hints.
  // Note: you'll also have to implement linking in the updateSelection function
  // at the bottom of this function.
  // Remember that you have to dispatch that an object was highlighted.  Look
  // in linechart.js and scatterplot.js to see how to interact with the dispatcher.

  // HINT for brushing on the table: keep track of whether the mouse is down or up, 
  // and when the mouse is down, keep track of any rows that have been mouseover'd


  var isMouseDown = false;
  var rowsSelected = [];

  function highlight(rowElement) {
    d3.select(rowElement).classed("selected", true);

    // Get the name of our dispatcher's event
  
  }

  function unhighlight(rowElement) {
    d3.select(rowElement).classed("selected", false);

    function unhighlightAll(rowElement) {
      d3.selectAll("tr").classed("selected", false);

    rows = tablebody
            .selectAll("tr")
            .data(tableArray)
            .enter()
            .append("tr")

            // row is the actual array of the row the mouse is over
            // index is the index of the row in the table
            .on("mouseover", function(d, i, elements){
              highlight(elements[i]);
              let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
              console.log('dispatch string:', dispatchString);
              dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
            })

            .on("mouseout", function(d, i, elements){
              unhighlight(elements[i])
      
            })

            .on('mousedown', function(d, i, elements){
              console.log('in mousedown');
              unhighlightAll();
              isMouseDown = true;
              highlight(elements[i]);
              let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
              console.log('dispatch string:', dispatchString);

              // Let other charts know
              dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
              
            })

            .on("mouseup", function(d, i){
              console.log('in mouse up');
              isMouseDown = false;

            });

            // function brushDrag(element, event, d, i){
    //   hoverTarget = event.target;
    //   if (dragTarget){
    //       console.log("drag: row:", getRow(hoverTarget), 'i:', i);
    //       d3.select(hoverTarget).attr("classed", "selected");
    //   }
    // };

    // function brushStop(element, event, d, i){
    //     if (dragTarget){
    //         var targetElement = event.target;
    //         if(targetElement.nodeName == "TD"){
    //             console.log("stop", getRow(targetElement), i);
    //         }
    //     }
    //     dragTarget = null;
    // };


    return chart;
  }

  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  // Given selected data from another visualization 
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select the row if the row was selected
    d3.selectAll('tr').classed("selected", d => {
      return selectedData.includes(d)
    });

    // Select the cell if it was selected
    d3.selectAll('td').classed("selected", d => {
      return selectedData.includes(d)
    });

  };

  return chart;
}