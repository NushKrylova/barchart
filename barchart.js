function drawChart(data) {
    const margin = { top: 40, right: 50, bottom: 60, left: 50 };
    const w = 800;
    const h = 400;

    const chartWidth = w - margin.left - margin.right;
    const chartHeight = h - margin.top - margin.bottom;

    const rectWidth = w / data.length;

    let domainY = d3.extent(data.map(d => d[1]));

    let dates = [];
    for (let obj of data) {
        dates.push(parseTime(obj[0]));
    }
    var domainX = d3.extent(dates);

    const yScale = d3.scaleLinear()
        .domain(domainY)
        .range([chartHeight, 0]);

    const xScale = d3.scaleTime()
        .domain(domainX)
        .range([0, chartWidth]);

    const yAxis = d3.axisLeft(yScale)
        .ticks(10);

    const xAxis = d3.axisBottom(xScale);

    let tooltip = d3.select(".chart")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const svg = d3.select('.chart')
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    svg.append('g')
        .attr('transform', `translate(0, 4)`)
        .call(yAxis)
        .attr("id", "x-axis");

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -250)
        .attr('y', 20)
        .attr("class", "label")
        .text('Gross Domestic Product');

    svg.append('g')
        .attr('transform', `translate(0, ${chartHeight + 4})`)
        .call(xAxis)
        .attr("id", "y-axis");

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append('rect')
        .attr("x", d => xScale(parseTime(d[0])))
        .attr("y", d => yScale(d[1]))
        .attr('width', rectWidth)
        .attr("class", "bar")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        // yScale(0) > yScale(100) as Yaxis was inverted, height should be inverted by 'yScale(0)-'
        .attr('height', d => yScale(0) - yScale(d[1]))
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(dateTooltip(d[0]) + "<br/>" + gdpTooltip(d[1]))
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    console.log(parseTime(data[0][0]).getFullYear());

}

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(data => drawChart(data.data));

function quoterOfTheYear(date) {
    let month = date.getMonth() + 1;
    return (Math.ceil(month / 3));
}

let parseTime = d3.timeParse("%Y-%m-%d");

function dateTooltip(data) {
    let date = parseTime(data)
    var quoter = quoterOfTheYear(date)
    return date.getFullYear() + " Q" + quoter;
}

function gdpTooltip(value) {
    return "$" + value + " Billion"
}
