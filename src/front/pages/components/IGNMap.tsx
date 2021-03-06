import React, { Component, Fragment, ReactElement } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style'
import Layer from "ol/layer/Layer";
import Feature from 'ol/Feature'
import Stroke from "ol/style/Stroke";
import LineString from "ol/geom/LineString";
import './../../AppStyle.css';
import "ol/ol.css";
import { Route } from "../../../back/domain/Route";
import { Coordinate } from "../../../back/domain/Coordinate";
import { Button } from "react-bootstrap";
import { AllRoutes } from "../AllRoutes";


interface MapProps {
    center: Coordinate;
    zoom: number;
    changeMap: any;
    routes: Route[];
    style: string;
}

interface MapState {
  //Class to create object from api
  map: Map;
}

/**
 * Component to display IGN Map
 */
export class IGNMap extends Component<MapProps, MapState> {
    public constructor(props: MapProps) {
        super(props);
        this.state = {
            map: null,
        };
    }

    /**
     * Parse routes so that OpenLayers can read it
     * 
     * @return VectorLayer<any>[]
     */
    private getRoutes(): VectorLayer<any>[] {
        const routes = this.props.routes;    
        const coords: VectorLayer<any>[] = [];
        routes.forEach(function (route: Route){
            //Se puede pasar un tercer parámetro para la altitud
            const lineString = new LineString(route.getIGNCoordinates());
            lineString.transform('EPSG:4326', 'EPSG:3857');
            const feature = new Feature({
                geometry: lineString
            });

            coords.push(new VectorLayer({
                source: new VectorSource({
                    features: [
                        feature
                    ]
                }),
                style: new Style({
                    stroke: new Stroke({
                        color: 'black',
                        width: 3
                    })
                })
            }));
        });  
        return coords; 
    }

    /**
     * Add basic layers to map
     * 
     * @return Layer<any, any>[]
     */
    private getBasicLayers(): Layer<any, any>[]{
        const layers: Layer<any, any>[] = [ 
            //Grey background    
            new TileLayer({
                source: new TileWMS({  
                url: "https://www.ign.es/wms-inspire/ign-base",
                params: { "LAYERS": "IGNBaseTodo-gris" }
                })
            }),

            //Raster map
            new TileLayer({
                source: new TileWMS({  
                url: "https://www.ign.es/wms-inspire/mapa-raster",
                params: { "LAYERS": "mtn_rasterizado" }
                })
            }),

            /*
            new VectorLayer({
                source: new VectorSource({
                url: 'https://openlayers.org/en/latest/examples/data/kml/2012-02-10.kml',
                format: new KML(),
                }),
            }),
            */
        ];
        return layers;
    }

    public componentDidMount(): void {  
        this.setState({
            map: new Map({
                target: 'ignMap',
                layers: this.getBasicLayers(),
                view: new View({
                    //ol.proj.fromLonLat([54.081, 32.908])
                    center: this.props.center.getIGNCenter(),
                    zoom: this.props.zoom
                })
            })
        }, () => {
            this.getRoutes().forEach((route) => {
                this.state.map.addLayer(route);
            }, this);
        });
    }

    public changeMap(): void{
        this.props.changeMap(AllRoutes.GOOGLE_MAPS);
    }

    public render(): ReactElement {
        return (
            <Fragment>
                <div id="ignMap" className={this.props.style}></div>
                <Button variant="light" onClick={this.changeMap.bind(this)} className="googleMapsMapButtonLocation">GoogleMaps</Button>
            </Fragment>
        );
    }
}
