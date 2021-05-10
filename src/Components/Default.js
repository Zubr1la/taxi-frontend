import React from 'react';
import Button from "react-bootstrap/Button";
import {validation} from "../Components/Userfunctions";
import {Redirect} from "react-router-dom";
import Tutorial from "./Tutorial";
import DriverTutorial from "./DriverTutorial";

class Default extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn:false,
            mounted:false,
            userLevel:null,
            userTutorialModal:false,
            driverTutorialModal:false,

        }
    }

    componentDidMount() {
        validation().then(response => {
            if(response===undefined){
                this.setState({
                    message:"Could not connect to the database!"
                })
            }else {
                if(response.success){
                    this.setState({
                        loggedIn:true,
                        mounted:true,
                        userLevel:response.userLevel,
                    })
                }

            }
        });
    }

    render() {

        if(this.state.loggedIn&&this.state.mounted){
           if(this.state.userLevel===1) return <Redirect to ="/panel"/>;
           if(this.state.userLevel===2) return <Redirect to ="/orderdrive"/>
        }

        let userTutorialModal=() => this.setState({userTutorialModal:false});
        let driverTutorialModal=() => this.setState({driverTutorialModal:false});
        return <div className=" row container text-center">

            <div className="col-lg-2"></div>
            <div className="col-lg-8">
                <h2>To use the system, please sign in!</h2>
                <Button variant="outline-success" size='lg' href="/login" block>Click here to login!</Button>{' '}
                <br></br>
                <h2>If you have not registered</h2>
                <Button variant="outline-success" size='lg' href="/register" block>Click here to register!</Button>{' '}
                <h2>User guide for system users</h2>
                <Button variant="outline-info" size='lg' onClick={()=>this.setState({driverTutorialModal:true})} block>User guide for drivers</Button>{' '}
                <Tutorial
                    show={this.state.userTutorialModal}
                    onHide={userTutorialModal}
                />

                <Button variant="outline-warning" size='lg' onClick={()=>this.setState({userTutorialModal:true})} block>User guide for clients</Button>{' '}

                <DriverTutorial
                    show={this.state.driverTutorialModal}
                    onHide={driverTutorialModal}
                />
            </div>

        </div>
    }
}
export default Default;