import type { Feature, FeatureCollection, Geometry, GeoJsonProperties, Point, Polygon, LineString, MultiPoint, MultiLineString, MultiPolygon, GeometryCollection, Position, BBox } from 'geojson';

declare module '@turf/helpers' {
  export type Id = string | number;
  export type Coord = Feature<Point> | Point | Position;
  export type Units = "meters" | "metres" | "m" | "millimeters" | "millimetres" | "mm" | "centimeters" | "centimetres" | "cm" | "kilometers" | "kilometres" | "km" | "miles" | "mi" | "nauticalmiles" | "nmi" | "inches" | "in" | "yards" | "yd" | "feet" | "ft" | "radians" | "rad" | "degrees" | "deg";
  export type AreaUnits = Exclude<Units, "radians" | "rad" | "degrees" | "deg"> | "acres" | "ac" | "hectares" | "ha";

  export function point<P extends GeoJsonProperties = GeoJsonProperties>(
    coordinates: Position,
    properties?: P,
    options?: { bbox?: BBox; id?: Id }
  ): Feature<Point, P>;

  export function featureCollection<G extends Geometry = Geometry, P extends GeoJsonProperties = GeoJsonProperties>(
    features: Array<Feature<G, P>>,
    options?: { bbox?: BBox; id?: Id }
  ): FeatureCollection<G, P>;

  export function polygon<P extends GeoJsonProperties = GeoJsonProperties>(
    coordinates: Position[][],
    properties?: P,
    options?: { bbox?: BBox; id?: Id }
  ): Feature<Polygon, P>;

  export function lineString<P extends GeoJsonProperties = GeoJsonProperties>(
    coordinates: Position[],
    properties?: P,
    options?: { bbox?: BBox; id?: Id }
  ): Feature<LineString, P>;

  export function multiPoint<P extends GeoJsonProperties = GeoJsonProperties>(
    coordinates: Position[],
    properties?: P,
    options?: { bbox?: BBox; id?: Id }
  ): Feature<MultiPoint, P>;

  export function multiLineString<P extends GeoJsonProperties = GeoJsonProperties>(
    coordinates: Position[][],
    properties?: P,
    options?: { bbox?: BBox; id?: Id }
  ): Feature<MultiLineString, P>;

  export function multiPolygon<P extends GeoJsonProperties = GeoJsonProperties>(
    coordinates: Position[][][],
    properties?: P,
    options?: { bbox?: BBox; id?: Id }
  ): Feature<MultiPolygon, P>;

  export function feature<G extends Geometry = Geometry, P extends GeoJsonProperties = GeoJsonProperties>(
    geom: G | null,
    properties?: P,
    options?: { bbox?: BBox; id?: Id }
  ): Feature<G, P>;
}
