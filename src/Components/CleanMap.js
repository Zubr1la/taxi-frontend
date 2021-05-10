import React from 'react';
import HPlatform, {HMap} from "react-here-map";

class CleanMap extends React.Component {
    render() {
        return ( <div className='container'>
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
                                height: "350px",
                                width: "100%",
                            }}
                            mapOptions={{ center: {lat:56.8560, lng:24.3779}, zoom: 7, }}
                        >
                        </HMap>
                    </HPlatform>
            </div>
        )
    }
}

export default CleanMap;