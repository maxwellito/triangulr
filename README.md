# triangulr

JavaScript class to generate maps of triangles.
Test it on http://maxwellito.github.io/triangulr

## What is that?

triangulr is a little JavaScript class to build triangles walls. Completely random. In SVG: ready for HTML or Illustrator use. It give you a bit of flexibility to generate what you need: dimension, triangle size, ratio of mess and color

## How to use it?

This is pure JavaScript, no jQuery required or other libraries. Only the simple triangulr.js in your page and you're ready to go.
Here is an example:

```javascript
var mySVG = new Triangulr (600, 500, 60, 0);
document.getElementById('myDiv').appendChild(mySVG);
```

Triangulr constructor needs these attributes:

 - `width` integer : width of the SVG to generate
 - `height` integer : height of the SVG to generate
 - `triangleHeight` integer : original triangle height
 - `pointArea` integer : area to place random points
 - `color` function (optional) : function to generate a color for each triangle an object will be passed as parameter with information about the current triangle counter triangle numbermark
    - `x` column index
    - `y` line index
    - `lines` number of lines in the SVG
    - `cols` number of columns in the SVG
    - `points` array of triangle points

## How it works?

The engine is quite simple to understand, even if at the start, it looks confusing to build this random triangles.
To begin, we use the value given to the constructor to create a regular pattern with proper equilateral triangles. To do that, the script start by generate lines of dots. Then a second pass use these points to generate triangles, and also the color function to generate the color code.
Then the last pass use the data to render it in a SVG DOM object.
