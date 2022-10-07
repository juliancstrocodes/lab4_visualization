import * as d3 from "https://unpkg.com/d3?module";

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 650 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

d3.csv("wealth-health-2014.csv", d3.autoType).then((data) => {
	let xDomain = d3.extent(data, function (i) {
		return i.Income;
	});
	let xRange = d3.extent(data, function (i) {
		return i.LifeExpectancy;
	});

	let regionsArr = [];

	data.map((d) => {
		if (!regionsArr.includes(d.Region)) {
			regionsArr.push(d.Region);
		}
	});
	console.log(regionsArr);
	let regions = d3.extent(data, function (i) {
		return i.Region;
	});
	let populations = d3.extent(data, function (i) {
		return i.Population;
	});

	let ordScale = d3.scaleOrdinal().domain(regions).range(d3.schemeTableau10);
	let popScale = d3.scaleLinear().domain(populations).range([4, 15]);

	// d3.scaleLog(), d3.scaleSqrt(), d3.scalePow()
	const xScale = d3.scaleLinear().domain(xDomain).range([0, 660]);
	const yScale = d3.scaleLinear().domain(xRange).range([460, 0]);

	const svg = d3
		.select(".chart")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.selectAll("svg")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", (d) => xScale(d.Income))
		.attr("cy", (d) => yScale(d.LifeExpectancy))
		.attr("r", (d) => popScale(d.Population))
		.attr("fill", (d) => ordScale(d.Region))
		.attr("stroke", "black")
		.on("mouseenter", (event, d) => {
			const position = d3.pointer(event, window); // pos = [x,y]
			let toolText =
				"Country: " +
				d.Country +
				"<br>Life Expectancy: " +
				d.LifeExpectancy +
				"<br>Income: " +
				d.Income.toLocaleString("en-US") +
				"<br>Population: " +
				d.Population.toLocaleString("en-US") +
				"<br>Region: " +
				d.Region;

			d3.select(".tooltip")
				.style("position", "fixed")
				.html(toolText)
				.attr("style", "display: block")
				.style("left", position[0] + "px")
				.style("top", position[1] + "px")
				.style("fill", "black");
		})
		.on("mouseleave", (event, d) => {
			d3.select(".tooltip").attr("style", "display: none");
		});

	const xAxis = d3.axisBottom().scale(xScale).ticks(5, "s");
	// Draw the axis
	svg.append("g")
		.attr("class", "axis x-axis")
		.call(xAxis)
		.attr("transform", `translate(0, ${height})`);

	const yAxis = d3.axisLeft().scale(yScale);

	svg.append("g").attr("class", "axis y-axis").call(yAxis);

	svg.append("text")
		.attr("x", (d) => 550)
		.attr("y", (d) => 450)
		.attr("alignment-baseline", "auto")
		.attr("text-anchor", "middle")
		.text("Income");

	svg.append("text")
		.attr("x", (d) => 15)
		.attr("y", (d) => 0)
		.attr("class", "y-label")
		.attr("alignment-baseline", "auto")
		.attr("text-anchor", "start")
		.text("Life Expectancy");

	const legend = d3
		.select(".chart")
		.append("svg")
		.attr("width", 250)
		.attr("height", 200);

	console.log(regions);

	legend
		.selectAll("svg")
		.data(regionsArr)
		.enter()
		.append("rect")
		.attr("fill", (d) => ordScale(d))
		.attr("width", 20)
		.attr("height", 20)
		.attr("y", (d, i) => 22 * i);

	legend
		.selectAll("svg")
		.data(regionsArr)
		.enter()
		.append("text")
		.text((d) => d)
		.attr("fontSize", "11px")
		.attr("y", (d, i) => 22 * (i + 1) - 5)
		.attr("x", 25);
});
