// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60,
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter-plot")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("./assets/data/data.csv")
  .then(function (stateData) {
    var incomeArray = [];
    stateData.forEach(function (state) {
      state.healthcare = +state.healthcare;
      state.income = +state.income;

      incomeArray.push(state.income);

      // console.log(state);
    });

    // get max and min of income array
    var incomeMax = d3.max(incomeArray);
    var incomeMin = d3.min(incomeArray);

    // configure x axis
    var x = d3
      .scaleLinear()
      .domain([incomeMin - 4000, incomeMax])
      .range([0, chartWidth]);

    // add x axis to svg
    chartGroup
      .append("g")
      .attr("transform", "translate(0," + chartHeight + ")")
      .call(d3.axisBottom(x));

    // configure y axis
    var y = d3
      .scaleLinear()
      .domain([0, d3.max(stateData, (data) => data.healthcare) + 7])
      .range([chartHeight, 0]);
    chartGroup.append("g").call(d3.axisLeft(y));

    var gdots = chartGroup
      .selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.income);
      })
      .attr("cy", function (d) {
        // return y(d.healthcare);
        return y(d.healthcare);
      })
      .attr("r", 12)
      .attr("stroke", "grey")
      .attr("stroke-width", "0.5")
      .style("fill", "lightblue");

    var abbreviations = [];
    stateData.forEach(function (state) {
      abbreviations.push(state.abbr);
    });
    console.log(abbreviations);

    // Add axis labels
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", chartWidth / 2 + margin.left)
      .attr("y", chartHeight + margin.top + 50)
      .text("Income ($)");

    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 40)
      .attr("x", margin.top - chartHeight / 2 - 30)
      .text("Lacks Healthcare (%)");

    chartGroup
      .selectAll("text")
      .data(stateData)
      .enter()
      .append("text")
      .attr("x", function (d) {
        // return d.income;
        return x(d.income) - 5.5;
      })
      .attr("y", function (d) {
        // return d.healthcare;
        return y(d.healthcare) + 3;
      })
      .text((d) => {
        console.log(d);
        return d.abbr;
      })
      .style("font-size", "7.5px")
      .style("fill", "white");
  })
  .catch(function (err) {
    console.log(err);
  });
