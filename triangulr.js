'use strict';

/**
 * Triangulr class
 * instructions will follow, in an other commit, it's late now
 * 
 * @param	int							width						Triangle height
 * @param	int							height					Triangle height
 * @param	int							lineHeight			Triangle height
 * @param	int							pointArea				Area to place random point
 * @param	function				colorFunction		Function to generate triangle color
 */
function Triangulr (width, height, lineHeight, pointArea, renderingFunction) {
								
	// Tests
	if (typeof width !== 'number' || width <= 0) {
		throw 'Triangulr: width must be positive';
	}
	if (typeof height !== 'number' || height <= 0) {
		throw 'Triangulr: height must be positive';
	}
	if (typeof lineHeight !== 'number' || lineHeight <= 0) {
		throw 'Triangulr: lineHeight must be set and be positive number';
	}
	if (!!pointArea && typeof pointArea !== 'number' || pointArea < 0) {
		throw 'Triangulr: pointArea must be set and be a positive number';
	}
	if (!!renderingFunction && typeof renderingFunction !== 'function') {
		throw 'Triangulr: renderingFunction must be a function';
	}

	// Save input
	this.mapWidth = width;
	this.mapHeight = height;
	this.lineHeight = lineHeight;
	this.pointArea = !!pointArea ? pointArea : 0;
	this.colorRendering = !!renderingFunction ? renderingFunction : this.generateColor;

	this.triangleLine = Math.sqrt(Math.pow(lineHeight/2, 2) + Math.pow(lineHeight, 2));
	this.originX = - this.triangleLine;
	this.originY = - this.lineHeight;
	this.lines = [];
	
	this.lineMapping();
	this.createTriangles();
	return this.generateDom();
}

/**
 * lineMapping
 * generate this.lines from the contructor info
 * 
 */
Triangulr.prototype.lineMapping = function () {
	
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

/**
 * createTriangles
 * use points form this.lines to generate triangles
 * and put them into this.exportData
 * 
 */
Triangulr.prototype.createTriangles = function () {
	
	var x, parite, lineA, lineB, aIndex, bIndex, points, poly, pointsList;
	var counter = 0;
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
			pointsList = [
				points[0],
				points[1],
				points[2]
			];
			this.exportData.push({
				style: {
					fill: this.colorRendering({
						counter: counter,
						x: aIndex + bIndex - 1,
						y: x,
						lines: this.lines.length,
						cols: (lineA.length - 2) * 2,
						points: pointsList
					})
				},
				points: pointsList
			});
			counter++;
		} while (aIndex != lineA.length-1 && bIndex != lineA.length-1);

		lineParite = !lineParite;
	}
};

/**
 * generateDom
 * generate the SVG object from exportData content
 * 
 * @return {[object]} Svg DOM object
 */
Triangulr.prototype.generateDom = function () {
	var i, j, points, style, polygon;
	var svgTag = document.createElementNS('http://www.w3.org/2000/svg','svg');
	var output = '';

	svgTag.setAttribute('version', '1.1');

	for(i in this.exportData) {
		polygon = document.createElementNS('http://www.w3.org/2000/svg','path');

		points  = 'M'+this.exportData[i].points[0].x+' '+this.exportData[i].points[0].y+' ';
		points += 'L'+this.exportData[i].points[1].x+' '+this.exportData[i].points[1].y+' ';
		points += 'L'+this.exportData[i].points[2].x+' '+this.exportData[i].points[2].y+' Z';
		polygon.setAttribute('d', points);
		polygon.setAttribute('fill', this.exportData[i].style.fill);
		polygon.setAttribute('shape-rendering', 'geometricPrecision');

		svgTag.appendChild(polygon);
	}
	return svgTag;
};


// Color generators
///////////////////////////////////////////////////////////

/**
 * generateColor
 * default color generator when no function is
 * given to the constructor
 * it generate dark grey colors
 * 
 * @param  {[object]} path Info object relative to current triangle 
 * @return {[string]}      Color generated
 */
Triangulr.prototype.generateColor = function (path) {
	var code = Math.floor(Math.random()*5).toString(16);
	code += Math.floor(Math.random()*16).toString(16);
	return '#'+code+code+code;
};

/**
 * generateGold
 * color generator for gold color (from black to white)
 * this function is not use by default
 * 
 * @param  {[object]} path Info object relative to current triangle 
 * @return {[string]}      Color generated
 */
Triangulr.prototype.generateGold = function () {
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