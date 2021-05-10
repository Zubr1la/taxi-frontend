import React from 'react';
import Table from "react-bootstrap/Table";
import CleanMap from "../Components/CleanMap";
import Button from "react-bootstrap/Button";
import ShowRoute from "../Components/ShowRoute";
import {getRouteData} from "../Components/MapFunc";
import axios from 'axios';
import {getUserDataById} from "./Userfunctions";
import NewMessage from "./NewMessage";

class Driverpanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            drivesArr:[],
            loggedIn:false,
            message:'',
            mounted:false,
            pos1_lat:0,
            pos1_lng:0,
            pos2_lat:0,
            pos2_lng:0,
            price:0,
            mapValue:0,
            shapePoints:[],
            points:[],
            driveChoosen:false,
            choosenDriveId:null,
            startPoint:'',
            finishPoint:'',
            dataChoice:0,
            description:'',
            customerName:'',
            messageModal:false,
            time:'',
        }
    }


    componentDidMount() {
        this.setState({drivesArr:this.props.drivesList});

    }

    showDrive(pos1_1,pos1_2,pos2_1,pos2_2, price, id, start, finish, desc, choice, timeIn){


        if(this.props.active!==undefined){
            if(this.props.active.customer!==undefined){
                getUserDataById(this.props.active.customer).then(response => {
                    if(response===undefined){
                        this.setState({message:"Could not connect to the database!"})
                    }else {
                        if(response.firstName===undefined){
                            this.setState({
                                customerName:"Error getting client data!",
                            })
                        }else {
                            this.setState({
                                customerName:response.firstName + " " + response.lastName,
                            })
                        }
                    }
                });
            }

        }



        this.setState({
            pos1_lat:pos1_1,
            pos1_lng:pos1_2,
            pos2_lat:pos2_1,
            pos2_lng:pos2_2,
            price:price,
            choosenDriveId: id,
            startPoint:start,
            finishPoint:finish,
            dataChoice:choice,
            description:desc,
            time:timeIn
        });

        this.getRoute(pos1_1,pos1_2,pos2_1,pos2_2);

    }

    displayMap(val){
        switch (val) {
            case 0: return <CleanMap/>;
            case 1: return <ShowRoute
                routePoints={this.state.shapePoints}
                pos1_lat={this.state.pos1_lat}
                pos1_lng={this.state.pos1_lng}
                pos2_lat={this.state.pos2_lat}
                pos2_lng={this.state.pos2_lng}
            />;

            default: return <CleanMap/>

        }
    }

    getRoute(pos1_1,pos1_2,pos2_1,pos2_2) {

        if (pos1_1 === '' || pos1_2 === '' || pos2_1 === '' || pos2_2 === '') {
            this.setState({message: "No start and/or endpoint chosen!"})
        } else {
            getRouteData(pos1_1, pos1_2, pos2_1, pos2_2).then(response => {

                this.setState({
                    points: response.shape,
                    mapValue: 1,
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

    timeText(seconds){
        let h, m, s, output='';
        h = Math.floor(seconds/3600);
        seconds -= h*3600;
        if(h){
            output = h+' hours ';
        }
        m = Math.floor(seconds/60);
        seconds -= m*60;
        output += m+' minutes ';
        s=seconds%60;
        output += s + ' seconds';

        return output;
    }


    showDriveData(val, choice){
        if(val&&choice===0){
            return <div>
                <p><b>Start point:</b> {this.state.startPoint} </p>
                <p><b>Destination:</b> {this.state.finishPoint}</p>
                <p><b>Price:</b> {this.state.price} Eur</p>
                <p><b>Time (one way):</b> {this.timeText(this.state.time)}</p>
                <p><b>Comment:</b> {this.state.description}</p>
                <Button variant="outline-success" size='sm' block onClick={()=>this.acceptDrive(this.state.choosenDriveId)}>Accept drive</Button>
            </div>
        }else if(val&&choice===1){
            return <div>
                <p><b>Client:</b> {this.state.customerName} </p>
                <p><b>Start point:</b> {this.state.startPoint} </p>
                <p><b>Destination:</b> {this.state.finishPoint}</p>
                <p><b>Price:</b> {this.state.price} Eur</p>
                <p><b>Time (one way):</b> {this.timeText(this.state.time)}</p>
                <p><b>Comment:</b> {this.state.description}</p>
            </div>

        }
    }

    acceptDrive(driveId){
        axios.post('/api/drive/adddriver',{
            _id: driveId
        })
            .then(res=>{
                this.setState({message:res.data.message})
            })
            .catch(e=> {
                console.log(e);
            })
    }


    cancelDrive(driveId){
        axios.post('/api/drive/removedriver',{
            _id: driveId
        })
            .then(res=>{
                this.setState({message:res.data.message})
            })
            .catch(e=> {
                console.log(e);
            })
    }


    finishDrive(driveId){
        axios.post('/api/drive/finishdrive',{
            _id: driveId
        })
            .then(res=>{
                this.setState({message:res.data.message})
            })
            .catch(e=> {
                console.log(e);
            })
    }

    render() {

        let messageModal=() => this.setState({messageModal:false});
        return <div className="container">
            <div className='text-center'>
                <h2 className="bg-warning">{this.state.message}</h2>
            </div>


            <div className="row">
                <div className="col-lg-12">
                    <h2 className="text-center">Available drives</h2>
                    {this.props.active!==undefined ?
                        (<h3 className="text-center">You already have an active drive!</h3>):
                        (<Table responsive>
                            <thead>
                            <tr>
                                <th>Client</th>
                                <th>Price</th>
                                <th>Information</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.drivesArr.map(drive=>{
                                return <tr key={drive._id}>
                                    <td>{drive.firstName + " " + drive.lastName}</td>
                                    <td>{drive.price}</td>
                                    <td><Button variant="outline-success" size='sm' block
                                                onClick={()=>
                                                    this.showDrive(
                                                        drive.pos1_lat,
                                                        drive.pos1_lng,
                                                        drive.pos2_lat,
                                                        drive.pos2_lng,
                                                        drive.price,
                                                        drive._id,
                                                        drive.startPoint,
                                                        drive.finishPoint,
                                                        drive.description,
                                                        0,
                                                        drive.driveTime,
                                                    )}>
                                        Information
                                    </Button></td>
                                </tr>
                            })}
                            </tbody>
                        </Table>)
                    }

                    <h2 className="text-center">Active drive</h2>
                    {this.props.active!==undefined ?
                        (<Table responsive>
                            <thead>
                            <tr className="text-center">
                                <th>Get drive data</th>
                                <th>Contact client</th>
                                <th>Cancel drive</th>
                                <th>Finish drive</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <Button variant="outline-success" size='sm' block
                                            onClick={()=>this.showDrive(
                                                this.props.active.pos1_lat,
                                                this.props.active.pos1_lng,
                                                this.props.active.pos2_lat,
                                                this.props.active.pos2_lng,
                                                this.props.active.price,
                                                this.props.active._id,
                                                this.props.active.startPoint,
                                                this.props.active.finishPoint,
                                                this.props.active.description,
                                                1,
                                                this.props.active.driveTime,
                                            )}>
                                        Drive data
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="outline-success" size='sm' block onClick={()=>this.setState({messageModal:true})}>Text the client</Button>
                                    <NewMessage
                                        show={this.state.messageModal}
                                        onHide={messageModal}
                                        receiver={this.props.active.customer}
                                    />
                                </td>
                                <td>
                                    <Button variant="outline-success" size='sm' block onClick={()=>this.cancelDrive(this.props.active._id)}>Cancel</Button>
                                </td>
                                <td>
                                    <Button variant="outline-success" size='sm' block onClick={()=>this.finishDrive(this.props.active._id)}>Finish</Button>
                                </td>
                            </tr>
                            </tbody>
                        </Table>):
                        (<h3 className="text-center">No active drive found!</h3>)
                    }


                </div>
            </div>
            <div className="row">
                <div className="col-lg-8">
                    <Button variant="outline-danger" size='md' block onClick={()=>this.setState({mapValue:0})}>Clear map</Button>
                    {this.displayMap(this.state.mapValue)}
                </div>
                <div className="col-lg-4">
                    <h3 className="text-center"> Drive data:</h3>
                    {this.showDriveData(this.state.driveChoosen, this.state.dataChoice)}
                </div>
            </div>

        </div>
    }
}

export default Driverpanel;
