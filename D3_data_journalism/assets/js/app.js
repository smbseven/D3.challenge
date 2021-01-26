// SVG Dimension settings
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 30,
  right: 40,
  bottom: 60,
  left: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper to hold chart
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data from csv file
d3.csv("./assets/data/data.csv").then(corrData => {
  
    // Extract data to correlate
    corrData.forEach(data => {
      data.obesity = +data.obesity;
      data.poverty = +data.poverty;
    });

    // Create scale functions / Chose obesity and poverty and through exploration found the values
    // thsi was key to provide the right dimensions (i.e. 2 + and 1 + to have wiggle room and present
    // a better graph) and create axis functions
    // Poverty 9.2 - 21.5
    // Obesity 21.3 - 35.9
    var xLinearScale = d3.scaleLinear()
      .domain([21, 2 + d3.max(corrData, d => d.obesity)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([8, 1 + d3.max(corrData, d => d.poverty)])
      .range([height, 0]);

      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

    // Append left and bottom axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create circles and datapoints
    var circlesGroup = chartGroup.selectAll("circle")
    .data(corrData)
    .join("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "12")
    .attr("opacity", 0.5)
    .attr("class","stateCircle");

    // Create textGroup and append it to the graph
    // add state code text in the center of the circles
    let textGroup = svg.append('g')
     .attr('transform', `translate(${margin.left}, ${margin.top})`);

    textGroup.selectAll("text")
    .data(corrData)
    .join("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.obesity))
    .attr("y", d => yLinearScale(d.poverty)+ 5)
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("font-weight", "700")
    .attr("fill", "blue")
    .attr("class","stateText");
  
    // Add axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 5)
    .attr("x", 0 - (height / 2) -50)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Poverty (%)")
    .attr("font-weight", "bold");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 25})`)
    .attr("class", "axisText")
    .text("Obesity (Median)")
    .attr("font-weight", "bold");

    // Initialize tool tip and add to index.html
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(d => `obesity (Median): ${d.obesity}<br>poverty (%): ${d.poverty}<br>State: ${d.state}`);
    
    // Create the tooltip in the chart
    chartGroup.call(toolTip);

    // Event listeners to display and hide the tooltip
    // circlesGroup.on("mouseover", (data, index, element) => toolTip.show(data, element[index]));

    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // Cursor leaves circle
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
});