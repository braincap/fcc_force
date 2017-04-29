var dataLink = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

var chart = d3.select('.chart');
var width = window.innerWidth - 32;
var height = window.innerHeight - 32;
chart.attr('width', width);
chart.attr('height', height);

d3.json(dataLink, graph => {

  nodeData = graph.nodes;
  nodeLinks = graph.links;

  //create link, center and repulsion (charge) forces to apply to simulation
  var linkForce = d3.forceLink(nodeLinks);
  linkForce.distance(200);
  var chargeForce = d3.forceManyBody();
  var centerForce = d3.forceCenter(width / 2, height / 2);
  var xAxisForce = d3.forceX().strength(0.1).x(width / 2);
  var yAxisForce = d3.forceY().strength(0.1).y(height / 2);


  //create simulation
  var simulation = d3.forceSimulation(nodeData);
  simulation.force('link', linkForce);
  simulation.force('charge', chargeForce);
  simulation.force('center', centerForce);
  simulation.force("xAxis", xAxisForce).force("yAxis", yAxisForce);

  //draw links as lines on chart
  var link = chart.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(nodeLinks)
    .enter().append('line');


  var tool = d3.selectAll('.graph')
    .append('div')
    .attr('class', 'tool');

  //node elements as circles on chart
  var node = d3.selectAll('.graph')
    .selectAll('img')
    .data(nodeData)
    .enter()
    .append('img')
    .attr('class', d => 'flag flag-' + d.code)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .on('mouseover', () => tool.style('display', null))
    .on('mousemove', (d) => {
      tool
        .style('display', 'inline-block')
        .html('<p>' + d.country + '</p>')
    })
    .on('mouseout', () => tool.style('display', 'none'))

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }


  function dragged(d) {
    tool.style('display', 'inline-block')
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  function ticked() {
    link.attr('x1', d => (((d.source.x - 32) < 0 ? '0' : (d.source.x + 32) > width ? width : d.source.x) + 16));
    link.attr('y1', d => (((d.source.y - 32) < 0 ? '0' : (d.source.y + 32) > height ? height : d.source.y) + 16));
    link.attr('x2', d => (((d.target.x - 32) < 0 ? '0' : (d.target.x + 32) > width ? width : d.target.x) + 16));
    link.attr('y2', d => (((d.target.y - 32) < 0 ? '0' : (d.target.y + 32) > height ? height : d.target.y) + 16));
    node.style('left', d => (d.x - 32) < 0 ? '0px' : (d.x + 32) > width ? width : d.x + 'px');
    node.style('top', d => (d.y - 32) < 0 ? '0px' : (d.y + 32) > height ? height : d.y + 'px');
  }

  simulation.on('tick', ticked);

});