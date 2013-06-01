var margin = {top: 10, right: 20, bottom: 20, left: 80},
    width = 770 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

var status = "stacked";

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2);

var x1 = d3.scale.linear();

var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .2, 0);

var yAxis = d3.svg.axis()
    .scale(y)
   .orient("left");

var nest = d3.nest()
    .key(function(d) { return d.category; });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; })
    .y(function(d) { return d.value; })
    .x(function(d) { return d.department; })
    .out(function(d, x0) { d.valueOffset = x0; });

var color = d3.scale.ordinal().range(["#3182bd", "#e6550d", "#31a354", "#756bb1"]);

var svg = d3.select("#bar_chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data.csv", function(error, data) {

  data.forEach(function(d) {
    d.department = d.department;
    d.value = +d.value;
  });

  var dataByGroup = nest.entries(data);
  stack(dataByGroup);
  y.domain(dataByGroup[0].values.map(function(d) { return d.department; }));
  x0.domain(dataByGroup.map(function(d) { return d.key; }));
  x1.domain([d3.max(data, function(d) { return d.value; }), 0]).range([x0.rangeBand(), 0]);

  dataByGroup[4].values.forEach(function(d){
    d3.select("#chart_container").append("div")
    .attr("class", "index_label")
    .text(d.value + d.valueOffset)
    .style("top", (11 + y(d.department)).toString() + "px")
    .style("left", (120 + (x1(d.valueOffset + d.value))).toString() + "px");
    d3.select("#chart_container").append("div")
    .attr("class", "axis_label")
    .html("<div class='text'>" + d.department + "</div>")
    .style("top", (11 + y(d.department)).toString() + "px")
    .style("left", "0px");
  });

  var group = svg.selectAll(".group")
      .data(dataByGroup)
    .enter().append("g")
      .attr("class", "group")
      .attr("transform", function(d) { return "translate(" + x0(x0.domain()[0]) + ", 0)"; });

  // //Adds y-axis labels
  // group.append("text")
  //     .attr("class", "group-label")
  //     .attr("x", -6)
  //     .attr("y", function(d) { return y1(d.values[0].value / 2); })
  //     .attr("dy", ".35em")
  //     .text(function(d) { return d.key; });

  //Adds all data bars
  group.selectAll("rect")
      .data(function(d) { return d.values; })
    .enter().append("rect")
      .style("fill", function(d) { return color(d.category); })
      .attr("y", function(d) { return y(d.department); })
      .style("opacity", 0.7)
      .style("stroke", "#fff")
      .attr("class", "data_block")
      .attr("x", function(d) { return x1(d.valueOffset); })
      .attr("height", y.rangeBand())
      .attr("width", function(d) { return x1(d.value); })
      .on("mouseover", function(d) {
        d3.selectAll("rect").style("opacity", function(item) {
          if (d.category == item.category) {
            return 0.8;
          } else {
            return 0.6;
          }
        });
      })
      .on("click", function(d) {
        toggle(d.category);
      });

  //Adds y-axis labels
  // group.filter(function(d, i) { return !i; }).append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis);

  function toggle() {
    if (status == "stacked"){
      transitionMultiples();
      status = "multiples";
    } else {
      transitionStacked();
      status = "stacked";
    }
  }

  function transitionMultiples() {
    var t = d3.transition().duration(750),
        g = t.selectAll(".group").attr("transform", function(d) { return "translate(" + x0(d.key) + ", 0)"; }),
        v = d3.selectAll(".index_label").transition().duration(750).style("left", "680px");
        g.selectAll("rect").attr("x", function(d) { return 0; });
    // $(".index_label").animate({"left": "800px"}, 750);
    // g.select(".group-label").attr("x", function(d) { return x1(d.values[0].value / 2); })
  }

  function transitionStacked() {
    var t = d3.transition().duration(750),
        g = t.selectAll(".group").attr("transform", "translate(" + x0(x0.domain()[0]) + ", 0)");

        g.selectAll("rect").attr("x", function(d) { return x1(d.valueOffset); });
    // g.select(".group-label").attr("x", function(d) { return x1(d.values[0].value / 2 + d.values[0].valueOffset); })
  }

});