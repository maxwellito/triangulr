'use strict';

/**
 * Polygonr class
 * instructions will follow, in an other commit, it's late now
 */
function Polygonr (svgTag, lineHeight, pointArea) {
								
	// Tests
	if (!svgTag || typeof svgTag !== 'object' || svgTag.tagName !== 'svg') {
		throw 'Polygonr: svgTag must be a svg tag object';
	}
	if (svgTag.width.baseVal.value <= 0) {
		throw 'Polygonr: svg width must be positive';
	}
	if (svgTag.height.baseVal.value <= 0) {
		throw 'Polygonr: svg height must be positive';
	}
	if (!lineHeight || typeof lineHeight !== 'number' || lineHeight <= 0) {
		throw 'Polygonr: lineHeight must be positive number';
	}
	if (!pointArea || typeof pointArea !== 'number' || pointArea <= 0) {
		throw 'Polygonr: pointArea must be positive number';
	}

	// Save input
	this.svgTag = svgTag;
	this.mapWidth = svgTag.width.baseVal.value;
	this.mapHeight = svgTag.height.baseVal.value;
	this.lineHeight = lineHeight;
	this.pointArea = pointArea;

	this.triangleLine = Math.sqrt(Math.pow(lineHeight/2, 2) + Math.pow(lineHeight, 2));
	this.originX = - this.triangleLine;
	this.originY = - this.lineHeight;
	this.lines = [];
	
	this.lineMapping();
	this.createTriangles();
	this.insertDom();
}

Polygonr.prototype.lineMapping = function () {
	
	var x, y, line;
	var lineX = Math.ceil(this.mapWidth/this.triangleLine) + 4;
	var lineY = Math.ceil(this.mapHeight/this.lineHeight) + 2;
	var parite = this.triangleLine/4;

	for(y = 0; y<lineY; y++) {
		line = [];
		for(x = 0; x<lineX; x++) {
			line.push({
				x: x * this.triangleLine + Math.round(Math.random() * this.pointArea * 2) - this.pointArea + this.originX + parite,
				y: y * this.lineHeight + Math.round(Math.random() * this.pointArea * 2) - this.pointArea + this.originX
			});
		}
		this.lines.push(line);
		parite *= -1;
	}
};

Polygonr.prototype.createTriangles = function () {
	
	var x, parite, lineA, lineB, aIndex, bIndex, points, poly;
	var lineParite = true;
	this.exportData = [];

	for(x = 0; x<this.lines.length -1; x++) {
		lineA = this.lines[x];
		lineB = this.lines[x+1];
		aIndex = 0;
		bIndex = 0;
		parite = lineParite;

		do {
			// Get the good points
			points = [lineA[aIndex], lineB[bIndex]];
			if (parite) {
				bIndex++;
				points.push(lineB[bIndex]);
			}
			else {
				aIndex++;
				points.push(lineA[aIndex]);
			}
			parite = !parite;

			// Save the triangle
			this.exportData.push({
				style: {
					fill: this.generateColor()
				},
				points: [
					points[0],
					points[1],
					points[2]
				]
			});
		} while (aIndex != lineA.length-1 && bIndex != lineA.length-1);

		lineParite = !lineParite;
	}
};

Polygonr.prototype.generateGold = function () {
	var goldColors = [255, 186, 0];
	var ratio = Math.random() * 2;
	var generated = 0;
	for(var i in goldColors) {
		if (ratio > 1) {
			generated += (goldColors[i] + Math.ceil((255 - goldColors[i]) * (ratio-1))) * Math.pow(256, 2-i);
		}
		else {
			generated += Math.ceil(goldColors[i] * ratio) * Math.pow(256, 2-i);
		}
	}
	generated = generated.toString(16);
	return generated.length == 5 ? '#0' + generated : '#' + generated;
};

Polygonr.prototype.generateColor = function (x) {
	var keys = ['0', '1', '2', '3', '4'];
	var code = keys[Math.floor(Math.random()*keys.length)] + keys[Math.floor(Math.random()*keys.length)];
	return '#'+code+code+code;
};

Polygonr.prototype.insertDom = function () {
	var i, j, points, style, polygon;
	var output = '';

	for(i in this.exportData) {
		polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');

		points = [];
		for(j in this.exportData[i].points) {
			points.push(this.exportData[i].points[j].x+','+this.exportData[i].points[j].y);
		}
		polygon.setAttribute('points', points.join(' '));
		polygon.setAttribute('fill', this.exportData[i].style.fill);

		this.svgTag.appendChild(polygon);
	}
};
