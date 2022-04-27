import { Coordinate } from "./Coordinate";

export class Route {
    //Attributes
    private _id: string;
    private name: string;
    private coordinates: Coordinate[];


    //Constructor
    constructor(name: string, coordinates: Coordinate[],
         _id: string = null) {
        this.name = name;
        this.coordinates = coordinates;
        this._id = _id;
    }


    //Functions
    public getGoogleMapsCoordinates(): {lat: number, lng: number}[]{
        const coords: {lat: number, lng: number}[] = [];
        this.getCoordinates().forEach(function(elem: Coordinate){
            coords.push({lat: elem.getLat(), lng: elem.getLng()});
        });
        return coords;
    }

    public getGoogleMapsCenter(): {lat: number, lng: number}{
        const firstCoordinate = this.coordinates.at(0);
        return {lat: firstCoordinate.getLat(), lng: firstCoordinate.getLng()}
    }

    public getIGNCoordinates(): number[][]{
        const coords: number[][] = [];
        this.getCoordinates().forEach(function(elem: Coordinate){
            coords.push([elem.getLng(), elem.getLat()]);
        });
        return coords;
    }


    //Getters
    public getName(): string { return this.name; }
    public getCoordinates(): Coordinate[] { return this.coordinates; }
    public getId(): string { return this._id }
}