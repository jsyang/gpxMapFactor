# Add GPX to routing_points.xml

This script inserts a track defined by a GPX file into the `routing_points.xml` file used by
MapFactor Navigation so you can create a route and use it in the app. You will need to replace
the `routing_points.xml` in your install directory on your device to see the added track.

As [Route-Importer for MapFactor](https://play.google.com/store/apps/details?id=org.kadiba.routeimporter&hl=en_GB)
failed to work on my Android Marshmellow device, I had to resort to writing my own GPX convertor for
long cycle rides.

## To Run

`node insertGPX.js <your_gpx_file> [random_sample_threshold]`


Example usage:

```bash
# With waypoints from "brouter-leicester-cardiff.gpx", randomly pick to include any single way point
# with a 5% chance.
node insertGPX.js brouter-leicester-cardiff.gpx 0.05
```

## Routers

- [cycle.travel](http://cycle.travel/map)
- [GMaps Directions to GPX](https://blog.sverrirs.com/2015/08/converting-google-maps-directions-to.html)
- [Brouter](http://brouter.de/)
- [OpenStreetMap routers comparison](http://wiki.openstreetmap.org/wiki/Routing/online_routers)

## Notes

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

## License

This software is licensed under GPLv2. See LICENCE file for details.