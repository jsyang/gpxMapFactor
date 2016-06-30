# Add GPX to routing_points.xml

Lat-long coordinates from GPX are in Decimal format vs Degrees Minutes Seconds (Milliseconds)
format in the `routing_points.xml` file.
http://stackoverflow.com/questions/17311316/convert-between-degree-and-miliseconds

```js

// Degrees-Minutes-Seconds-MilliSeconds to Decimal
function DMSMS_to_DEC(ms){
    return (ms / 3600000) % 360;
}

// Reverse
function DEC_to_MS(deg){
    return Math.round(deg * 60 * 60 * 1000);
}

```