import React from 'react';
import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";
import {getLocation, getLocationData, getRouteData} from "../Components/MapFunc";
import DrawMapMarker1 from "../Components/DrawMapMarker1";
import DrawMapMarker2 from "../Components/DrawMapMarker2";
import CleanMap from "../Components/CleanMap";
import ShowRoute from "../Components/ShowRoute";
import {getMoneyInfo, validation} from "../Components/Userfunctions";
import axios from 'axios';
import {Redirect} from "react-router-dom";


class MainPage extends React.Component {

constructor(props) {
    super(props);
    this.state = {
        searchPlace: '',
        finishPlace:'',
        latitude:'',
        longitude:'',
        latitude1:'',
        longitude1:'',
        mapValue:0,
        routeData:'',
        points:[],
        points1:[],
        calculations:false,
        suggestionsArray:[],
        locationChoice:0,
        firstLocationData:'Choose your start point',
        secondLocationData:'Choose the destination',
        summaryData:{},
        loggedIn:false,
        mounted:false,
        price:0,
        description:'',
        driveSet:false,
        message:'',
        bank:false,
        userLevel:null,

    };

    this.onChangePlace = this.onChangePlace.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeFinish = this.onChangeFinish.bind(this);
    this.saveFirstPosition = this.saveFirstPosition.bind(this);
    this.resetMap = this.resetMap.bind(this);
    this.showRoute = this.showRoute.bind(this);
    this.saveSecondPosition = this.saveSecondPosition.bind(this);

}

    componentDidMount() {

        validation().then(response => {

            if(response===undefined){
                this.setState({message:"Could not connect to the database!"})
            }else {
                if(response.success){
                    this.setState({
                        loggedIn:true,
                        mounted:true,
                        userLevel:response.userLevel
                    });

                    getMoneyInfo().then(response =>{
                        if(response.success){
                            this.setState({
                                bank:true,
                            })
                        }else{
                            this.setState({
                                bank:false,
                            })
                        }
                    });
                }else{
                    this.setState({
                        loggedIn:false,
                        mounted:true,
                    });
                }
            }
        });
    }


    onChangePlace(e){
        this.setState({
            searchPlace:e.target.value
        });
    }

    onChangeFinish(e){
        this.setState({
            finishPlace:e.target.value
        });
    }

    onChangeDescription(e){
        this.setState({
            description:e.target.value
        });
    }

    saveFirstPosition(e){
        e.preventDefault();
        if(this.state.searchPlace===''){
            return 0
        }

        this.setState({locationChoice:0});

        getLocation(this.state.searchPlace).then(response => {
            if(response.suggestions.length===0){
                this.setState({message:"No location found!"})
            }else{
                this.setState({suggestionsArray:response.suggestions});
                this.setState({message:""});
            }
        });

    }

    resetMap(e){
        e.preventDefault();
        this.setState({mapValue:1})
    }
    
    showRoute(e){
        e.preventDefault();
        if(this.state.latitude===''|| this.state.longitude===''|| this.state.latitude1==='' || this.state.longitude1===''){
            this.setState({message:"No start point and/or destination chosen!"})
        }else{
            getRouteData(this.state.latitude,this.state.longitude,this.state.latitude1, this.state.longitude1).then(response => {
                this.setState({
                    points:response.shape,
                    mapValue:4,
                    summaryData:{
                        time:response.summary.baseTime,
                        distance:response.summary.distance,
                    },
                    calculations:true,
                });

                this.setState({
                   price:(this.state.summaryData.distance/1000 /100 * 7 * 1.30 + 2)*2,

                  });

                let pointArr =[];
                let valueIn = {};
                let firstEl = this.state.points[0];

                if (typeof firstEl === "string" && firstEl.split(",").length === 2) {
                    this.state.points.forEach(function (coords) {
                        valueIn = {lat:coords.split(",")[0], lng:coords.split(",")[1]};
                        pointArr.push(valueIn);
                    });
                }
                this.setState({
                    points1:pointArr,
                });

            });
        }
    }

    saveSecondPosition(e){
        e.preventDefault();
        if(this.state.finishPlace===''){
            return 0
        }
        this.setState({locationChoice:1});
        getLocation(this.state.finishPlace).then(response => {
            if(response.suggestions.length===0){
                this.setState({message:"No location found!"})
            }else{
                this.setState({suggestionsArray:response.suggestions});
                this.setState({message:""});
            }
        });
    }


    displaySummary(){

        if(this.state.calculations===true){
            return <div>
                <p><b>Distance:</b> {this.state.summaryData.distance.toFixed(2)/1000 + "Km" } </p>
                <p><b>Time:</b> {this.timeText(this.state.summaryData.time)}</p>
                <p><b>Price: </b> {this.state.price.toFixed(2) +  " Euro" } </p>
                <Form.Control placeholder="If necessary, enter any extra information" as="textarea" rows="2" value={this.state.description} onChange={this.onChangeDescription}/>
                {this.state.driveSet ?
                    (null):
                    ( <Button className="text-center" variant="outline-success" size='sm' block onClick={()=>this.addDrive()}>Book trip</Button>)
                }

            </div>
        }else {
            return "No calculations done!";
        }
    }

    timeText(seconds){
        let h, m, s, output='';
        h = Math.floor(seconds/3600);
        seconds -= h*3600;
        if(h){
            output = h+' Hours ';
        }
        m = Math.floor(seconds/60);
        seconds -= m*60;
        output += m+' Minutes ';
        s=seconds%60;
        output += s + ' Seconds';
        return output;
    }

    addDrive(){

        if(!this.state.loggedIn){
            this.setState({message:"You have not signed in!"});
            return 0;
        }

        if(!this.state.bank){
            this.setState({message:"No bank card information found!"});
            return 0;
        }

        axios.post('/api/drive/',{
            description:this.state.description,
            price:this.state.price.toFixed(2),
            pos1_lat:this.state.latitude,
            pos1_lng: this.state.longitude,
            pos2_lat: this.state.latitude1,
            pos2_lng: this.state.longitude1,
            startPoint: this.state.firstLocationData,
            finishPoint: this.state.secondLocationData,
            time:this.state.summaryData.time,


        })
            .then(res=>{
                this.setState({
                    message:res.data.message,
                });
                if(res.data.success){
                    this.setState({
                        driveSet:true
                    });
                }
            })
            .catch(e=> {
                console.log(e);
            })
    }


    drawMapElement(choice){
        switch (choice) {
            case 1: return <CleanMap/>;
            case 2: return <DrawMapMarker1 lat={this.state.latitude} long={this.state.longitude} />;
            case 3: return <DrawMapMarker2 lat={this.state.latitude1} long={this.state.longitude1} />;
            case 4: return <ShowRoute
                routePoints={this.state.points1}
                pos1_lat={this.state.latitude}
                pos1_lng={this.state.longitude}
                pos2_lat={this.state.latitude1}
                pos2_lng={this.state.longitude1}
            />;
            default: return <CleanMap/>
        }
    }


    handleChoosenLocation(locationID, locationLabel){

        if(this.state.locationChoice===0){
            this.setState({firstLocationData:locationLabel});
            getLocationData(locationID).then(response => {
                this.setState({
                    latitude:response.Response.View[0].Result[0].Location.DisplayPosition.Latitude,
                    longitude:response.Response.View[0].Result[0].Location.DisplayPosition.Longitude,
                    mapValue:2
                })
            });

        }else{
            this.setState({secondLocationData:locationLabel});
            getLocationData(locationID).then(response => {
                this.setState({
                    latitude1:response.Response.View[0].Result[0].Location.DisplayPosition.Latitude,
                    longitude1:response.Response.View[0].Result[0].Location.DisplayPosition.Longitude,
                    mapValue:3
                })
            });
        }

    }

    render() {

        if(!this.state.loggedIn&&this.state.mounted) {
            return <Redirect to="/"/>
        }
        if(this.state.userLevel===1) {
            return <Redirect to ="/panel"/>;
        }
        function  fixLocation(str) {
            return str.replace(/<\/?.+?>/ig, '');
        }


        return ( <div className='container '>
            <div className='text-center'>
                <h2 className="bg-warning">{this.state.message}</h2>
            </div>
            <div className="row text-center">
                <div className="col-lg-8">
                    <Form noValidate onSubmit={this.saveFirstPosition}>
                        <Form.Group controlId="locationFrom">
                            <Form.Label>
                                <h5>Enter the start location</h5>
                            </Form.Label>
                            <Form.Control type="text" rows="1" value={this.state.searchPlace} onChange={this.onChangePlace}/>
                        </Form.Group>
                        <Button variant="info" type="submit" className="float-middle" >
                           Find starting point
                        </Button>
                    </Form>

                    <Form noValidate onSubmit={this.saveSecondPosition}>
                        <Form.Group controlId="locationTo">
                            <Form.Label>
                                <h5>Enter destination</h5>
                            </Form.Label>
                            <Form.Control type="text" rows="1" value={this.state.finishPlace} onChange={this.onChangeFinish}/>

                        </Form.Group>
                        <Button variant="info" type="submit" className="float-middle" >
                            Find destination
                        </Button>
                    </Form>
                    <div className="row">
                        <div className="col-lg-4">
                            <Form noValidate onSubmit={this.resetMap}>
                                <Button variant="danger" type="submit" className="float-middle" >
                                    Clear map
                                </Button>
                            </Form>
                        </div>
                        <div className="col-lg-4"></div>
                        <div className="col-lg-4">
                            <Form noValidate onSubmit={this.showRoute}>
                                <Button variant="success" type="submit" className="float-middle" >
                                    Show estimates
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <h3 className="text-center">Found places</h3>

                    {this.state.suggestionsArray.map(location => {
                            return <p key={location.label}>
                                {<Button variant="outline-dark" size='sm' block onClick={()=>this.handleChoosenLocation(location.locationId, fixLocation(location.label))}>{fixLocation(location.label)}</Button>}
                            </p>
                        }
                    )}
                </div>
            </div>
               <div className="row">
                   <div className='col-lg-8'>{this.drawMapElement(this.state.mapValue)}</div>
                   <div className="col-lg-4">
                       <h3 className="text-center">Chosen trip:</h3>
                       <p><b>From: </b> {this.state.firstLocationData}</p>
                       <p><b>To:</b> {this.state.secondLocationData}</p>
                       <div>{this.displaySummary()}</div>
                   </div>
               </div>
            </div>
        )
    }
}
export default MainPage;