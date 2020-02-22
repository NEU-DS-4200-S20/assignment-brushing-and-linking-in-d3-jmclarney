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


    // Just setting up the table really..
    let tablebody = table.append("tbody");
    let rows = tablebody
        .selectAll("tr")
        .data(data)
        .enter()
        .append("tr");
    let cells = rows.selectAll("td")
        .data(d => d3.values(d))
        .enter()
        .append("td")
        .text(d => d);     

    // Then, add code to allow for brushing.  Note, this is handled differently
    // than the line chart and scatter plot because we are not using an SVG.
    // Look at the readme of the assignment for hints.
    // Note: you'll also have to implement linking in the updateSelection function
    // at the bottom of this function.
    // Remember that you have to dispatch that an object was highlighted.  Look
    // in linechart.js and scatterplot.js to see how to interact with the dispatcher.

    // HINT for brushing on the table: keep track of whether the mouse is down or up, 
    // and when the mouse is down, keep track of any rows that have been mouseover'd

    function highlight(row) {
      d3.select(row).classed("selected", true);
    }

    function removeHighlights() {
      d3.selectAll("tr").classed("selected", false);
    }

    // to track clicks
    var isMouseDown = false;    

    // MAIN select all the rows
    d3.selectAll("tr")

    // ############## MOVING THE CURSOR ##############

    // handles simply highlighting the row being hovered over
    .on("mouseover", (d, i, elements) => {
      d3.select(elements[i]).classed("mouseover", true)
      if (isMouseDown) {
        highlight(elements[i]);
        //track whats been hovered on to pass to other graphs so they can be interactive
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
        dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
      }
    })

    // now you know the mouse has moved out of the row area, so you de-highlight
    .on("mouseout", (d, i, elements) => {
      d3.select(elements[i]).classed("mouseover", false)
    })
    // ############## END MOVING HANDLERS ###############


    // ################### CLICKS #####################

    // handles multiple row highlights indicated by a mouse click
    .on("mousedown", (d, i, elements) => {
      // new click so remove all prexisting highlights
      removeHighlights();
      isMouseDown = true
      // also have to track this, special mouseover since multiple rows will be highlighted
      // pass to dispatcher to communicate with other graphs
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
      dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
    })
    
    // handles when user stops holding click - do nothing but track click has ended
    // still want the highlights until the next click, at which point all previous highlights are removed
    .on("mouseup", (d, i, elements) => {
      isMouseDown = false;
    });

    // ############# END CLICK HANDLERS ##################

    // finished product
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