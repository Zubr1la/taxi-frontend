import React from 'react';
import {
    getActiveDrive,
    getBalance,
    getDrives,
    getMoneyInfo,
    getOrderedDrive,
    validation
} from "../Components/Userfunctions";
import {Redirect} from "react-router-dom";
import Driverpanel from '../Components/Driverpanel'
import Customerpanel from "../Components/Customerpanel";
import {Button} from "react-bootstrap";

class Panel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            drivesArr:[],
            loggedIn:false,
            message:'',
            mounted:false,
            userLevel:null,
            activeDrive:{},
            balance:'',
        }
    }

    componentDidMount() {

        validation().then(response => {

            if(response===undefined){
                this.setState({
                    message:"Could not connect to the database!",
                    loggedIn:false,
                    mounted:true,
                })
            }else {
                if(response.success){
                    this.setState({
                        loggedIn:true,
                        mounted:true,
                    });

                    getMoneyInfo().then(response =>{
                        if(response.success){
                            getBalance().then(response => {
                                this.setState({
                                    balance:response.docs.balance + " Euro",
                                });
                            });
                        }else{
                            this.setState({
                                balance:"Credit card data not found!",
                            })
                        }
                    });

                   if(response.userLevel===1){
                       let level = response.userLevel;
                       getActiveDrive().then(response => {
                           this.setState({activeDrive:response.docs});
                       });

                       getDrives().then(response => {
                           this.setState({drivesArr:response, userLevel:level});
                       });

                   }
                   if(response.userLevel===2){
                       let level = response.userLevel;
                       getOrderedDrive().then(response => {
                           this.setState({
                               activeDrive:response.docs,
                               userLevel:level
                           });
                       });
                   }
                }else {
                    this.setState({
                        loggedIn:false,
                        mounted:true,
                    });
                }
            }
        });

    }


    displayPanel(level){
        switch (level) {
            case 1: return <Driverpanel
                drivesList={this.state.drivesArr}
                active={this.state.activeDrive}
            />;
            case 2: return <Customerpanel
                active={this.state.activeDrive}
            />;
            default: return null
        }
    }


        render() {

        if(!this.state.loggedIn&&this.state.mounted) {
            return <Redirect to="/"/>
        }

        return <div className="container">
            <div className='text-center'>
                <h2 className="bg-warning">{this.state.message}</h2>
            </div>

            <div className="row text-center">
            <div className="col-lg-4">
                <h3>Balance</h3>
                <h5>{this.state.balance}</h5>
            </div>
            <div className="col-lg-4">
                <h3>Messages</h3>
                <Button href='/messages'>Open message board</Button>
            </div>
            <div className="col-lg-4">
                <h3>Settings</h3>
                <Button href='/usersettings'>Open settings</Button>
            </div>

        </div>

            {this.displayPanel(this.state.userLevel)}


        </div>
    }
}

export default Panel;
