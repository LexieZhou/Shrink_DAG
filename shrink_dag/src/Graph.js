import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import linkData from './data/updated_links.json';
import nodeData from './data/nodes.json';
import { getHideNodesOnCollapse } from './GetHideNodesOnCollapse';
import './Graph.css';

function Graph() {
  const [nodesData, setNodesData] = useState(null);
  const [linksData, setLinksData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setNodesData(nodeData);
        setLinksData(linkData);

      } catch (error) {
        console.error('Error fetching nodes data:', error);
      }
    };

    fetchData();

  }, []);

  useEffect(() => {
    if (nodesData && linksData) {
      const width = window.innerWidth;
      const height = window.innerHeight;

        // detect whether exists svg and tooltip
      const existingSvg = d3.select("#graph-svg");
      if (existingSvg) {
        existingSvg.remove();
      }

      const svg = d3.select("#chart")
        .append("svg")
        .attr("id", "graph-svg")
        .attr('width', width)
        .attr('height', height);
      
      const g = svg.append('g')
        .attr("id", "graph-g")
        .attr('transform', 'translate(0, 0) scale(1)');
      
      const simulation = d3.forceSimulation(nodesData)
        .force("link", d3.forceLink(linksData)                // This force provides links between nodes
          .id(function(d) { return d.id; })    // provide the id of a node
          .links(linksData)
          .distance(10)    // the list of links
        )
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force('collide', d3.forceCollide(20));

      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 21)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("xoverflow", "visible")
        .attr("orient", "auto")
        .append("path")
        .attr("fill", "#aaa")
        .attr("d", 'M 0,-5 L 10 ,0 L 0,5');
      
      const links = g.append('g')
        .attr('class', 'links')
        .selectAll('.link')
        .data(linksData)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 1)
        .attr('marker-end', 'url(#arrowhead)')
        .attr('stroke-dasharray', (d) => (d.properties.verdict === 'no' ? '5,5' : null));
      
      const labels = g.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodesData)
        .enter().append("text")
        .text(function(d) { 
          if (d.version) {
            return d.id + ' ' + d.name + ' ' + d.version;
          } else {
            return d.id + ' ' + d.name;
          }
        })
        .attr('font-size', 6)
        .attr('dx', 12)
        .attr('dy', 4)
        .attr('id', function(d) {
          return d.id; // Add a unique ID based on the node ID
        });
      
      const nodes = g.append('g')
        .attr('class', 'nodes')
        .selectAll('.node')
        .data(nodesData)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', 6)
        .attr('fill', 'steelblue')
        .on("click", function(event, d) {
          const nodeId = d.id;
          // obtain the nodes and links to hide
          const { toHideNodeIds, toHideEdges } = getHideNodesOnCollapse(linksData, nodeId);
          console.log('hideNodes:', toHideNodeIds);
          console.log('hideLinks:', toHideEdges);

          let hideNodeIds = [];
          toHideNodeIds.forEach(node => {
            hideNodeIds.push(node.id);
          });
          let hideLinkIds = [];
          toHideEdges.forEach(link => {
            hideLinkIds.push(link.id);
          });

          // Toggle hide and visible for nodes
          nodes.filter(node => hideNodeIds.includes(node.id))
          .attr('visibility', function() {
            const visibility = d3.select(this).attr('visibility');
            return visibility === 'hidden' ? 'visible' : 'hidden';
          });

          // Toggle hide and visible for links
          links.filter(link => hideLinkIds.includes(link.id))
          .attr('visibility', function() {
            const visibility = d3.select(this).attr('visibility');
            return visibility === 'hidden' ? 'visible' : 'hidden';
          });

          labels.filter(label => hideNodeIds.includes(label.id))
          .attr('visibility', function() {
            const visibility = d3.select(this).attr('visibility');
            return visibility === 'hidden' ? 'visible' : 'hidden';
          });
        });

        // const numberOfNodes = nodes.size();
        // console.log("Number of nodes:", numberOfNodes); 1095
      
      //d3 zoom
    var initialScale = 0.4;
    const zoom = d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.1, 10])
      .on("zoom", zoomed);

    svg.call(zoom);

    function zoomed({transform}) {
      g.attr("transform", transform)
      // g.attr("transform", `translate(${transform.x + centerX}, ${transform.y + centerY}) scale(${transform.k})`);
    }
    var initialTransform = d3.zoomIdentity
      .translate(width / 15, height / 15)
      .scale(initialScale);
    svg.call(zoom.transform, initialTransform);

        
    simulation.on("tick", () => {
        nodes
          .attr("cx", function(d){
            return d.x
          })
          .attr("cy", function(d){
            return d.y
          });
        
        links
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
        
        labels
          .attr("x", function(d) { return d.x; })
          .attr("y", function (d) { return d.y; });
        
        });
    }
  }, [nodesData, linksData]);

  return <div id="chart"></div>;
}

export default Graph;