const width = 1200
const height = 600
const marginTop = 10
const marginBottom = 110
const marginLeft = 110
const marginRight = 10
const colorRange = ["#0500ff", "#0084ff", "#00fff4", "#3eff00", "#FFf000", "#FFa000", "#FF5a00", "#FF0a00", "#FF0060", "#FF00E0", "#ca006f", "#830653"]
const keys = ["-6", "-5", "-4", "-3", "-2", "-1", "0", "1", "2", "3", "4", "5+"]
const legendBarWidth = 50
const legendBarHeight = 30

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then((data) => {
    const dataset = data.monthlyVariance.map(d => d)

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(colorRange)

    const fillCell = (d) => {
        if (d.variance <= -6) {
            return colorRange[0]
        } else if (d.variance <= -5) {
            return colorRange[1]
        } else if (d.variance <= -4) {
            return colorRange[2]
        } else if (d.variance <= -3) {
            return colorRange[3]
        } else if (d.variance <= -2) {
            return colorRange[4]
        } else if (d.variance <= -1) {
            return colorRange[5]
        } else if (d.variance <= 0) {
            return colorRange[6]
        } else if (d.variance <= 1) {
            return colorRange[7]
        } else if (d.variance <= 2) {
            return colorRange[8]
        } else if (d.variance <= 3) {
            return colorRange[9]
        } else if (d.variance <= 4) {
            return colorRange[10]
        } else if (d.variance > 4) {
            return colorRange[11]
         } else {
             console.log("error")
         }
    }

    const yScale = d3.scaleBand()
        .domain(months)
        .range([height, 0])

    const xScale = d3.scaleLinear()
        .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year)])
        .range([0, width])

    const barWidth = width / (d3.max(dataset, d => d.year) - d3.min(dataset, d => d.year))

    const yAxis = d3.axisLeft(yScale).tickFormat(d => d)
    const xAxis = d3.axisBottom(xScale).ticks(20).tickFormat(d => d)

    const tooltip = d3.select("tooltip")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("padding", "2px")
        .style("position", "absolute")
        .style("z-index", 10)
        .style("font-size", "18px")
        .style("border-radius", "10px")
        .style("border-color", "black")
        .style("border-style", "solid")
        .style("border-width", "2px")

    const svg = d3.select("svg")
        .style("height", height + marginTop + marginBottom)
        .style("width", width + marginLeft + marginRight)
        .append("g")
            .attr("transform", `translate(${marginLeft}, ${marginTop})`)

    const mouseover = (event, d) => {
        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9)

            tooltip.html(`Date: ${d.month}/${d.year} \n Variance:  ${d.variance}`)
                .attr("data-year", d.year)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 60) + "px")
    }

    const mouseout = function(event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", 0)
    }

    const legend = svg.append("g")
        .attr("id", "legend")

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => d.variance)
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(months[d.month - 1]))
        .style("fill", d => fillCell(d))
        .style("stroke", "black")
        .attr("width", barWidth)
        .attr("height", yScale.bandwidth())
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)

    svg.append("g")
        .attr("id", "y-axis")
        .style("font", "18px sans-serif")
        .call(yAxis)

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("id", "x-axis")
        .call(xAxis)

    legend.selectAll("rect")
        .data(keys)
        .enter()
        .append("rect")
            .style("fill", d => color(d))
            .style("stroke", "black")
            .attr("width", legendBarWidth)
            .attr("height", legendBarHeight)
            .attr("x", (d, i) => 300 + i * legendBarWidth)
            .attr("y", height + 40)

    legend.selectAll("labels")
        .data([-7, ...keys])
        .enter()
        .append("text")
        .attr("width", legendBarWidth)
            .attr("height", legendBarHeight)
            .attr("x", (d, i) => 295 + i * legendBarWidth)
            .attr("y", height + legendBarHeight * 3)
            .text(d => d)
            .style("font-size", "16px")
})