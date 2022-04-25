import { Component, Fragment, ReactElement } from "react";
import { Route } from "../../../back/domain/Route";
import { Database } from "../../../back/database/Database";
import { Button } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";

interface SeeRouteProps {
    id: string
}

interface SeeRouteState {
    route: Route;
}

export class SeeRoute extends Component<SeeRouteProps, SeeRouteState>{            
    public constructor(props: SeeRouteProps) {
        super(props);
        this.state = {
            route: null,
        };
    }
    
    public render(): ReactElement {  
        return (
            <Fragment>
                <h1>Ruta {this.props.id}</h1>
            </Fragment>
        );
    }
}

export function SeeRouteRouter(): ReactElement{
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    const params = useParams();
    const id = params.id;
    
    return (
        <Fragment>
            <SeeRoute id={id}/>
        </Fragment>
    );
}