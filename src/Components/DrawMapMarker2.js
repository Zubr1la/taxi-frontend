import React from 'react';
import HPlatform, {HMap, HMapMarker} from "react-here-map";

class DrawMapMarker2 extends React.Component {

    render() {

        const coords = { lat: this.props.lat, lng: this.props.long };

        return ( <div>

                <HPlatform
                    app_id='7v7XNnUfefQgbhlxKGyq'
                    app_code='5yYas5s6RzHfYQHdS9B4Gw'
                    //useCIT
                    useHTTPS
                    includeUI
                    includePlaces
                    interactive
                >
                    <HMap
                        style={{
                            height: "400px",
                            width: "100%",
                        }}
                        mapOptions={{ center: {lat:56.8560, lng:24.3779}, zoom: 11, }}
                    >
                        <HMapMarker coords={coords}  />

                    </HMap>

                </HPlatform>

            </div>
        )
    }
}

export default DrawMapMarker2;