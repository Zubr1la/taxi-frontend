import React from "react";
import Button from "react-bootstrap/Button";
import {Redirect} from "react-router-dom";
import {getMoneyInfo, validation} from "../Components/Userfunctions";
import Bankdata from "../Components/Bankdata";
import Addmoney from "../Components/Addmoney";
import Editprofiledata from "../Components/Editprofiledata";
import Changepassword from "../Components/Changepassword";
import axios from "axios";

class UserSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn:false,
            message:'',
            mounted:false,
            userLevel:null,
            addBankDataModal:false,
            bank:false,
            editProfileModal:false,
            changePasswordModal:false,
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
                        userLevel:response.userLevel,
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

                    if(response.userLevel===1){

                    }else if(response.userLevel===2){

                    }else {
                        this.setState({
                            message:"You do not have permission!",
                            loggedIn:false,
                        })
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

    deleteUser(){
        axios.post('api/deleteuser')
            .then(res=>{
                this.setState({message:res.data.message})
            })
            .catch(e=> {
                console.log(e);
            })
    }


    takeMoney(){
        axios.post('api/money/take')
            .then(res=>{
                this.setState({message:res.data.message})
            })
            .catch(e=> {
                console.log(e);
            })
    }


    render() {

        if(!this.state.loggedIn&&this.state.mounted){
            return <Redirect to ="/panel"/>
        }

        let addBankDataModal=() => this.setState({addBankDataModal:false});
        let addMoneyModal=() => this.setState({addMoneyModal:false});
        let editProfileModal=() => this.setState({editProfileModal:false});
        let changePasswordModal=() => this.setState({changePasswordModal:false});

        return( <div className="container">
                <div className='text-center'>
                    <h2 className="bg-warning">{this.state.message}</h2>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <h3 className="text-center">Transactions</h3>

                        <Addmoney
                            show={this.state.addMoneyModal}
                            onHide={addMoneyModal}
                        />

                        {
                            this.state.bank ?
                                (<div>
                                    {this.state.userLevel === 2 ?
                                        (<Button variant="outline-success" size='lg' block onClick={()=>this.setState({addMoneyModal:true})}>Deposit money</Button>
                                        ):
                                        ( <Button variant="outline-success" size='lg' block onClick={()=>this.takeMoney()}>Withdraw money</Button>
                                        )
                                    }

                                    <Button variant="outline-success" size='lg' block onClick={()=>this.setState({option:1, addBankDataModal:true})}>Change card data</Button>
                                    <Bankdata
                                        show={this.state.addBankDataModal}
                                        onHide={addBankDataModal}
                                        option={this.state.option}
                                    />
                                </div>):
                                (<div>
                                    <Button variant="outline-success" size='lg' block onClick={()=>this.setState({option:0,addBankDataModal:true})}>Add card data</Button>

                                    <Bankdata
                                        show={this.state.addBankDataModal}
                                        onHide={addBankDataModal}
                                        option={this.state.option}
                                    />
                                </div>)
                        }

                    </div>
                    <div className="col-lg-4">
                        <h3 className="text-center">Edit information</h3>
                        <Button variant="outline-success" size='lg' block onClick={()=>this.setState({editProfileModal:true})}>Edit personal data</Button>

                        <Editprofiledata
                            show={this.state.editProfileModal}
                            onHide={editProfileModal}
                        />

                        <Button variant="outline-success" size='lg' block onClick={()=>this.setState({changePasswordModal:true})}>Change password</Button>

                        <Changepassword
                            show={this.state.changePasswordModal}
                            onHide={changePasswordModal}
                        />
                    </div>
                    <div className="col-lg-4">
                        <h3 className="text-center">Delete user</h3>
                        <Button variant="outline-success" size='lg' block onClick={()=>document.getElementById('deleteUser').hidden = false}>Delete user</Button>
                        <Button id='deleteUser' hidden={true} variant="outline-danger" size='lg' block onClick={()=>this.deleteUser()}>Click here to delete your account!</Button>
                    </div>
                </div>
                <div className="row">

                </div>

            </div>

        )
    }

}
export default UserSettings;

