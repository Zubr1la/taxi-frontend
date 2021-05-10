import React from 'react';
import HPlatform, {HMap, HMapMarker, HMapPolyLine} from "react-here-map";

class ShowRoute extends React.Component {

    render() {

        const points = this.props.routePoints;
        const pos1 = { lat: this.props.pos1_lat, lng: this.props.pos1_lng };
        const pos2 = { lat: this.props.pos2_lat, lng: this.props.pos2_lng };

        return ( <div>

                <HPlatform
                    app_id='7v7XNnUfefQgbhlxKGyq'
                    app_code='5yYas5s6RzHfYQHdS9B4Gw'
                    includeUI
                    //useCIT
                    useHTTPS
                    includePlaces
                    interactive
                >
                    <HMap
                        style={{
                            height: "400px",
                            width: "100%",
                        }}
                        mapOptions={{ center: {lat:this.props.pos2_lat, lng:this.props.pos2_lng}, zoom: 7, }}
                    >
                        <HMapPolyLine points={points} />
                        <HMapMarker coords={pos1}  />
                        <HMapMarker coords={pos2}  />
                    </HMap>
                </HPlatform>
            </div>
        )
    }
}

export default ShowRoute;








