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
    .out(function(d, x0) {
      d.valueOffset = new Array();
      d.valueOffset[0] = x0;
    });

var stack_1 = d3.layout.stack()
    .values(function(d) { return d.values; })
    .y(function(d) {
      if (categories[d.category] > 0){
        return d.value;
      } else {
        return 0;
      }
    })
    .x(function(d) { return d.department; })
    .out(function(d, x0) {
      d.valueOffset[1] = x0;
    });

 var stack_2 = d3.layout.stack()
    .values(function(d) { return d.values; })
    .y(function(d) {
      if (categories[d.category] > 1){
        return d.value;
      } else {
        return 0;
      }
    })
    .x(function(d) { return d.department; })
    .out(function(d, x0) {
      d.valueOffset[2] = x0;
    });

var stack_3 = d3.layout.stack()
    .values(function(d) { return d.values; })
    .y(function(d) {
      if (categories[d.category] > 2){
        return d.value;
      } else {
        return 0;
      }
    })
    .x(function(d) { return d.department; })
    .out(function(d, x0) {
      d.valueOffset[3] = x0;
    });

var stack_4 = d3.layout.stack()
    .values(function(d) { return d.values; })
    .y(function(d) {
      if (categories[d.category] > 3){
        return d.value;
      } else {
        return 0;
      }
    })
    .x(function(d) { return d.department; })
    .out(function(d, x0) {
      d.valueOffset[4] = x0;
    });

var color = d3.scale.ordinal().range(["#3182bd", "#e6550d", "#31a354", "#756bb1", "#636363"]);

var svg = d3.select("#bar_chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var categories = new Object();
var inverted_categories = new Object();
category_counter = 0;

d3.csv("data.csv", function(error, data) {

  data.forEach(function(d) {
    d.department = d.department;
    d.value = +d.value;
  });

  var dataByGroup = nest.entries(data);

  dataByGroup.forEach(function(d){
    categories[d.key] = category_counter;
    category_counter ++;
  })

  stack(dataByGroup);
  stack_1(dataByGroup);
  stack_2(dataByGroup);
  stack_3(dataByGroup);
  stack_4(dataByGroup);
  console.log(dataByGroup);
  y.domain(dataByGroup[0].values.map(function(d) { return d.department; }));
  x0.domain(dataByGroup.map(function(d) {
    return d.key;
    }));
  inverted_categories = invert(categories);
  x1.domain([d3.max(data, function(d) { return d.value; }), 0]).range([x0.rangeBand(), 0]);


  dataByGroup[0].values.forEach(function(d){
    d3.select("#chart_container").append("div")
    .attr("class", "axis_label")
    .html("<div class='text'>" + d.department + "</div>")
    .style("top", (41 + y(d.department)).toString() + "px")
    .style("left", "0px");
  })

  var group = svg.selectAll(".group")
      .data(dataByGroup)
    .enter().append("g")
      .attr("class", "group")
      .attr("transform", function(d) { return "translate(" + x0(x0.domain()[0]) + ", 0)"; });

  //Add all item totals.
  d3.selectAll(".group").data()[4].values.forEach(function(d){
    d3.select("#chart_container").append("div")
    .attr("class", "index_label")
    .attr("id", "index_label_" + d.department.substring(0,3))
    .text(d.value + d.valueOffset[0])
    .style("top", (41 + y(d.department)).toString() + "px")
    .style("color", "#e6550d")
    .style("left", (120 + (x1(d.valueOffset[0] + d.value))).toString() + "px");
  });

  //Adds all category labels
  dataByGroup.forEach(function(d){
    d3.select("#chart_container").append("div")
    .attr("class", "group_label")
    .attr("id", "group_label_" + categories[d.key])
    .style("left", ( 110 + x1(d.values[d.values.length - 1].valueOffset[0])).toString() + "px" )
    .style("color", color(d.key))
    .text( d.key);

  })

  //Adds all data bars
  group.selectAll("rect")
      .data(function(d) { return d.values; })
    .enter().append("rect")
      .style("fill", function(d) { return color(d.category); })
      .attr("y", function(d) { return y(d.department); })
      .style("opacity", 0.7)
      .style("stroke", "#fff")
      .attr("class", "data_block")
      .attr("x", function(d) { return x1(d.valueOffset[0]); })
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

  function toggle(category) {
    if (status == category){
      status = "stacked";
      transitionStacked();
    } else {
      status = category;
      transitionMultiples();
    }
  }

  function transitionMultiples() {
    var t = d3.transition().duration(750),
        g = t.selectAll(".group").attr("transform", function(d) {
            if ((categories[d.key] < categories[status])){
              return "translate(" + x0(x0.domain()[0]) + ", 0)";
            } else if ((categories[d.key] == categories[status])){
              return "translate(" + x0(status) + ", 0)";
            } else {
              return "translate(" + x0(inverted_categories[categories[status] + 1]) + ", 0)";
            }
          }).each("end", function(){
            add_totals();
          });
        v = d3.selectAll(".index_label").transition().duration(150).style("opacity", 0);

        d3.selectAll(".group").data().forEach(function(d) {
            if ((categories[d.key] < categories[status])){
              d3.select("#group_label_" + categories[d.key]).transition().duration(750)
              .style("left", ( 110 + x1(d.values[d.values.length - 1].valueOffset[0])).toString() + "px" );
            } else if ((categories[d.key] == categories[status])){
              d3.select("#group_label_" + categories[d.key]).transition().duration(750)
              .style("left", ( 80 + x0(status)).toString() + "px" );
            } else {
              d3.select("#group_label_" + categories[d.key]).transition().duration(750)
              .style("left", (80 + x0(inverted_categories[categories[status] + 1]) + x1(d.values[d.values.length - 1].valueOffset[categories[status] + 1])).toString() + "px" );
            }
          })

        g.selectAll("rect").attr("x", function(d) {
          if ((categories[d.category] < categories[status])){
            return x1(d.valueOffset[0]);
          } else if (categories[d.category] == categories[status]) {
            return 0;
          } else {
            return x1(d.valueOffset[categories[status] + 1]);
          }
        });

        d3.selectAll(".item_detail").transition().duration(150).style("opacity", 0).each("end", function(){
          d3.selectAll(".item_detail").style("display", "none");
          var timeout = setTimeout(function() {
            d3.select("#description_group_" + categories[status]).style("display", "block").transition().duration(150).style("opacity", 1);
          }, 400);
        });

  }

  function transitionStacked() {
    var t = d3.transition().duration(750),
        g = t.selectAll(".group").attr("transform", "translate(" + x0(x0.domain()[0]) + ", 0)")
        .each("end", function(){
          add_totals();
        });
        v = d3.selectAll(".index_label").transition().duration(150).style("opacity", 0);
        g.selectAll("rect").attr("x", function(d) { return x1(d.valueOffset[0]); });

        d3.selectAll(".group").data().forEach(function(d) {
          d3.select("#group_label_" + categories[d.key]).transition().duration(750)
          .style("left", ( 110 + x1(d.values[d.values.length - 1].valueOffset[0])).toString() + "px" );
        })
  }

  function invert(obj) {
    var new_obj = {};

    for (var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        new_obj[obj[prop]] = prop;
      }
    }
    return new_obj;
  };

  function add_totals(){
    if (status == "stacked"){
      d3.selectAll(".group").data()[4].values.forEach(function(d){
        d3.select("#index_label_" + d.department.substring(0,3))
        .text(d.value + d.valueOffset[0])
        .style("left", (120 + (x1(d.valueOffset[0] + d.value))).toString() + "px")
        .style("color", "#e6550d")
        .transition(150).style("opacity", 1);
      });
    } else {
      d3.selectAll(".group").data()[categories[status]].values.forEach(function(d){
        d3.select("#index_label_" + d.department.substring(0,3))
        .text(d.value)
        .style("left", (84 + x0(status) + (x1(d.value))).toString() + "px")
        .style("color", color(d.category))
        .transition(150).style("opacity", 1);
      });
    }
  }

});