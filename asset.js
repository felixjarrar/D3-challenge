// @TODO: YOUR CODE HERE!
var widthSVG = 960;
var heightSVG = 500;

var margins = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = widthSVG - margins.left - margins.right;
var height = heightSVG - margins.top - margins.bottom;

// Create an SVG wrapper, append group that will hold our chart. 
// Then the latter shifts by top left margins.
var svg = d3.select("Scatter plot")
  .append("SVG")
  .attr("Width", widthSVG)
  .attr("Height", heightSVG);

var groupChart = svg.append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`);

// The data gets imported.
d3.csv("data.csv").then(function(newsdata) {

    // Here, data is parsed.
    // Then, it is cast as numbers
    newsdata.forEach(function(mydata) {
      mydata.poverty = +mydata.poverty;
      mydata.healthcare = +mydata.healthcare; 
      console.log(mydata.poverty,mydata.healthcare)
    });

    // Scale functions get created.
    var linearXscale = d3.scaleLinear()
      .domain([8.5, d3.max(newsdata, d => d.poverty)])
      .range([0, width]);

    var linearYscale = d3.scaleLinear()
      .domain([0, d3.max(newsdata, d => d.healthcare)])
      .range([height, 0]);

    // Access functions get created
    var axisBottom = d3.axisBottom(linearXscale);
    var axisLeft = d3.axisLeft(linearYscale);

    // The axes is appended to the chart.
    groupChart.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(axisBottom);

    cgroupChart.append("g")
      .call(axisLeft);

    // Circles are created.
    var groupCircles = groupChart.selectAll("circle").data(newsdata).enter()
    groupCircles.append("circle")
    .attr("cx", d => linearXscale(d.poverty))
    .attr("cy", d => linearYscale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");
    groupCircles.append("text")
    .text(function(d){
      return d.abbr;
    })
      .attr("dx", d => xLinearScale(d.poverty))
      .attr("dy", d => yLinearScale(d.healthcare)+10/2.5)
      .attr("font-size","9")
      .attr("class","stateText")
      .on("mouseover", function(data, index) {
        toolTip.show(data,this);
      d3.select(this).style("stroke","#323232")
      })
      .on("mouseout", function(data, index) {
          toolTip.hide(data,this)
       d3.select(this).style("stroke","#e3e3e3")
      });

    // The tool tip is initialized.
    var theTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
      });

    // The chart's tool tip is created
    groupChart.call(theTip);

    // Labels for x and y axis
    groupChart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("Socioeconomic status", "axisText")
      .text("The Demonstrated Lack of Healthcare");

    groupChart.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("Socioeconomic status", "axisText")
      .text("Demonstrated Poverty");
    });
