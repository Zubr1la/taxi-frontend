import React from 'react';
import {getUserDataById} from "../Components/Userfunctions";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ShowRoute from "../Components/ShowRoute";
import {getRouteData} from "../Components/MapFunc";
import axios from 'axios';
import NewMessage from "./NewMessage";

class Customerpanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn:false,
            message:'',
            mounted:false,
            pos1_lat:0,
            pos1_lng:0,
            pos2_lat:0,
            pos2_lng:0,
            price:0,
            shapePoints:[],
            points:[],
            driveChoosen:false,
            choosenDriveId:null,
            startPoint:'',
            finishPoint:'',
            dataChoice:0,
            description:'',
            driverName:'',
            driverID:null,
            sendMessageModal:false,
            time:null,
        }
    }


    componentDidMount() {
        if(this.props.active!==undefined){
            this.showDrive(
                this.props.active.pos1_lat,
                this.props.active.pos1_lng,
                this.props.active.pos2_lat,
                this.props.active.pos2_lng,
                this.props.active.price,
                this.props.active._id,
                this.props.active.startPoint,
                this.props.active.finishPoint,
                this.props.active.description,
                this.props.active.driveTime,
            );
            if(this.props.active.driver!==null){
                getUserDataById(this.props.active.driver).then(response => {
                    if(response===undefined){
                        this.setState({message:"Can not connect to the database!"})
                    }else {
                        this.setState({
                            driverName:response.firstName + " " + response.lastName,
                            driverID:response._id,
                        })
                    }
                });
            }
        }

    }

    showDrive(pos1_1,pos1_2,pos2_1,pos2_2, price, id, start, finish, desc, time){

        this.setState({
            pos1_lat:pos1_1,
            pos1_lng:pos1_2,
            pos2_lat:pos2_1,
            pos2_lng:pos2_2,
            price:price,
            choosenDriveId: id,
            startPoint:start,
            finishPoint:finish,
            description:desc,
            time:time,

        });

        this.getRoute(pos1_1,pos1_2,pos2_1,pos2_2);

    }

    displayMap(val){

        if(val){
            return <ShowRoute
                routePoints={this.state.shapePoints}
                pos1_lat={this.state.pos1_lat}
                pos1_lng={this.state.pos1_lng}
                pos2_lat={this.state.pos2_lat}
                pos2_lng={this.state.pos2_lng}
            />;
        }
    }

    getRoute(pos1_1,pos1_2,pos2_1,pos2_2) {

        if (pos1_1 === '' || pos1_2 === '' || pos2_1 === '' || pos2_2 === '') {
            this.setState({message: "No location data found!"})
        } else {
            getRouteData(pos1_1, pos1_2, pos2_1, pos2_2).then(response => {
                this.setState({
                    points: response.shape,
                });

                let pointArr = [];
                let valueIn = {};
                let firstEl = this.state.points[0];

                if (typeof firstEl === "string" && firstEl.split(",").length === 2) {
                    this.state.points.forEach(function (coords) {
                        valueIn = {lat: coords.split(",")[0], lng: coords.split(",")[1]};
                        pointArr.push(valueIn);
                    });
                }

                this.setState({
                    shapePoints: pointArr,
                    driveChoosen:true,
                });
            });
        }

    }

    showDriveData(val){
       if(val){
            return <div>
                <h3 className="text-center"> Drive data:</h3>
                <p><b>Start point:</b> {this.state.startPoint} </p>
                <p><b>Destination:</b> {this.state.finishPoint}</p>
                <p><b>Price:</b> {this.state.price} Eur</p>
                <p><b>Time:</b> {this.timeText(this.state.time)} Eur</p>
                <p><b>Comment:</b> {this.state.description}</p>
            </div>
        }
    }


    deleteDrive(driveId){
        axios.post('/api/drive/delete',{
            _id: driveId
        })
            .then(res=>{
                this.setState({message:res.data.message})
            })
            .catch(e=> {
                console.log(e);
            })
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


    render() {

        let sendMessageModal=() => this.setState({sendMessageModal:false});
        return <div className="container">
            <div className='text-center'>
                <h2 className="bg-warning">{this.state.message}</h2>
            </div>
            <div className="row">
                <div className="col-lg-12">

                    <h2 className="text-center">Ordered drive</h2>
                    {this.props.active!==undefined ?
                        (<Table responsive>
                            <thead>
                            <tr>
                                <th>{this.props.active.driver===null ?
                                    ("No driver found"):
                                    ("Driver: " + this.state.driverName)
                                }</th>
                                <th>{this.props.active.driver===null ?
                                    ("No driver found"):
                                    ( <div>
                                            <Button variant="outline-success" size='sm' block
                                                    onClick={()=>
                                                        this.setState({
                                                            sendMessageModal:true
                                                        })}
                                            >Contact driver</Button>
                                            <NewMessage
                                                show={this.state.sendMessageModal}
                                                onHide={sendMessageModal}
                                                receiver={this.props.active.driver}
                                            />
                                        </div>

                                    )
                                }</th>
                                <th>
                                    <Button variant="outline-success" size='sm' block
                                            onClick={()=>
                                                this.deleteDrive(this.props.active._id)}
                                    >Delete drive</Button>
                                </th>
                            </tr>
                            </thead>
                        </Table>):
                        (<h3 className="text-center">No drive ordered!</h3>)
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-lg-8">
                    {this.displayMap(this.state.driveChoosen)}
                </div>
                <div className="col-lg-4">
                    {this.showDriveData(this.state.driveChoosen)}
                </div>
            </div>

        </div>
    }
}

export default Customerpanel;
