'use strict';
var dataset = [
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1
];

var colors = [
		'#9e0142',
		'#d53e4f',
		'#f46d43',
		'#fdae61',
		'#fee08b',
		'#e6f598',
		'#abdda4',
		'#66c2a5',
		'#3288bd',
		'#5e4fa2'
];

var names = [
		'Torque',
		'Equilibria',
		'Infero',
		'Kludge',
		'Quiz',
		'Cepheid',
		'Robotics',
		'Electronica',
		'E-Cell',
		'Infi'
];

var domainImages = [
	"/img/domains/torque.gif",
	"/img/domains/equilibiria.png",
	"/img/domains/infero.png",
	"/img/domains/kludge.gif",
	"/img/domains/quiz.png",
	"/img/domains/cepheid.gif",
	"/img/domains/robotics.png",
	"/img/domains/electronika.png",
	"/img/domains/ecell.gif",
	"/img/domains/infi.png"
]

var width = document.querySelector('.chart-wrapper').offsetWidth;
var height = document.querySelector('.chart-wrapper').offsetHeight;
var minOfWH = Math.min(width, height) / 2;
var initialAnimDelay = 300;
var arcAnimDelay = 150;
var arcAnimDur = 3000;
var secDur = 1000;
var secIndividualdelay = 150;
var radius = undefined;

if (minOfWH > 400) {
		radius = 400;
}

else {
		radius = minOfWH;
}



var svg = d3.select('.chart-wrapper').append('svg').attr({
		'width': width,
		'height': height,
		'class': 'pieChart'
}).append('g');

var defs = svg.append('svg:defs');

console.log(radius*0.9);

var insideDonut = svg.append('g');

insideDonut.append('circle').attr('r', radius*0.45);
var donutImage = insideDonut
.append('image')
.attr("xlink:href", "/img/domains/logocircular.png")
.attr('x', -radius*0.45)
.attr('y', -radius*0.45)
.attr("width", radius*0.9)
.attr("height", radius*0.9);


svg.attr({ 'transform': 'translate(' + ((width / 2)+ 30) + ', ' + height / 2 + ')' });
var arc = d3.svg.arc().outerRadius(radius * 0.6).innerRadius(radius * 0.45);
var outerArc = d3.svg.arc().innerRadius(radius * 0.85).outerRadius(radius * 0.85);
var pie = d3.layout.pie().value(function (d) {
		return d;
});

var draw = function draw() {
		svg.append('g').attr('class', 'lines');
		svg.append('g').attr('class', 'slices');
		svg.append('g').attr('class', 'labels');
		var slice = svg.select('.slices').datum(dataset).selectAll('path').data(pie);
		slice.enter().append('path').attr({
				'fill': function fill(d, i) {
						return colors[i];
				},
				'd': arc,
				'stroke-width': '25px'
		}).attr("class", "slice").attr("id", function(d, i) {
			return names[i].toLower;
		}).attr('transform', function (d, i) {
				return 'rotate(-180, 0, 0)';
		}).style('opacity', 0).transition().delay(function (d, i) {
				return i * arcAnimDelay + initialAnimDelay;
		}).duration(arcAnimDur).ease('elastic').style('opacity', 1).attr('transform', 'rotate(0,0,0)');
		slice.transition().delay(function (d, i) {
				return arcAnimDur + i * secIndividualdelay;
		}).duration(secDur).attr('stroke-width', '5px');
		var midAngle = function midAngle(d) {
				return d.startAngle + (d.endAngle - d.startAngle) / 2;
		};
		var text = svg.select('.labels').selectAll('text').data(pie(dataset));
		text.enter().append('text').attr("class", "label").attr('dy', '0.35em').style('opacity', 1).style('fill', 'white').text(function (d, i) {
				return names[i];
		}).attr('transform', function (d) {
				var pos = outerArc.centroid(d);
				pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
				return 'translate(' + pos + ')';
		}).style('text-anchor', function (d) {
				return midAngle(d) < Math.PI ? 'start' : 'end';
		}).transition().delay(function (d, i) {
				return arcAnimDur + i * secIndividualdelay;
		}).duration(secDur).style('opacity', 1);
		var polyline = svg.select('.lines').selectAll('polyline').data(pie(dataset));
		polyline.enter().append('polyline').style('opacity', 0.5).attr('points', function (d) {
				var pos = outerArc.centroid(d);
				pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
				return [
						arc.centroid(d),
						arc.centroid(d),
						arc.centroid(d)
				];
		}).transition().duration(secDur).delay(function (d, i) {
				return arcAnimDur + i * secIndividualdelay;
		}).attr('points', function (d) {
				var pos = outerArc.centroid(d);
				pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
				return [
						arc.centroid(d),
						outerArc.centroid(d),
						pos
				];
		});
};


draw();

d3.selectAll('.slice').on('mouseover', function(d, i) {
	donutImage.attr("xlink:href", function() {
		return domainImages[i];
	})
}).on('click', function() {
	alert("Details will be uploaded soon");
})

d3.selectAll('.label').on('mouseover', function(d, i) {
	donutImage.attr("xlink:href", function() {
		return domainImages[i];
	})
}).on('click', function() {
	alert("Details will be uploaded soon");
})

var replay = function replay() {
		d3.selectAll('.slices').transition().ease('back').duration(500).delay(0).style('opacity', 0).attr('transform', 'translate(0, 250)').remove();
		d3.selectAll('.lines').transition().ease('back').duration(500).delay(100).style('opacity', 0).attr('transform', 'translate(0, 250)').remove();
		d3.selectAll('.labels').transition().ease('back').duration(500).delay(200).style('opacity', 0).attr('transform', 'translate(0, 250)').remove();
		setTimeout(draw, 800);
};
