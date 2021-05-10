import axios from 'axios'
export async function getLocation(place) {
    place = place.replace(" ", "+");
    let link ="https://autocomplete.geocoder.api.here.com/6.2/suggest.json?query="+place+"&country=LVA&beginHighlight=%3Cmark%3E&endHighlight=%3C%2Fmark%3E&maxresults=5&app_id=7v7XNnUfefQgbhlxKGyq&app_code=5yYas5s6RzHfYQHdS9B4Gw";
    return axios.get(link
    ).then(res => {
            return res.data
        })
        .catch(e => {
            console.log(e);
        })
}

export async function getLocationData(place) {
    let link ="https://geocoder.api.here.com/6.2/geocode.json?app_id=7v7XNnUfefQgbhlxKGyq&app_code=5yYas5s6RzHfYQHdS9B4Gw&locationid="
        +place;
    return axios.get(link
    ).then(res => {
        return res.data
    })
        .catch(e => {
            console.log(e);
        })
}

export async function getRouteData(point1_lat,point1_lng,point2_lat,point2_lng) {
    let link ="https://route.api.here.com/routing/7.2/calculateroute.json?"+
        "waypoint0="+point1_lat+"%2C"+point1_lng+
        "&waypoint1="+point2_lat+"%2C"+point2_lng
        +"&mode=fastest%3Bcar"
        +"&routeattributes=waypoints%2Csummary%2Cshape%2Clegs"
        +"&representation=display"
        +"&app_id=7v7XNnUfefQgbhlxKGyq"
        +"&app_code=5yYas5s6RzHfYQHdS9B4Gw";
    return axios.get(link
    ).then(res => {
            return res.data.response.route[0]
        })
        .catch(e => {
            console.log(e);
        })
}


