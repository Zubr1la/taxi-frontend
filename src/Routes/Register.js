import React from "react";
import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";
import axios from "axios";
import {Redirect} from "react-router-dom";
import {validation} from "../Components/Userfunctions";

class Register extends React.Component {


    constructor(props) {
        super(props);

        this.state ={
            name: '',
            lastName: '',
            password:'',
            Cpassword:'',
            userNickName:'',
            userLevel:null,
            message:'',
            loggedIn:false,
        };

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangelastName = this.onChangelastName.bind(this);
        this.onChangeNick = this.onChangeNick.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeCPassword = this.onChangeCPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        validation().then(response => {
            if(response===undefined){
                this.setState({message:"Could not connect to the database!"})
            }else {
                if(response.success){
                    this.setState({
                        loggedIn:true,
                    })
                }
            }
        });
    }

    onChangeName(e){
        this.setState({
            name: e.target.value
        })
    }
    onChangelastName(e){
        this.setState({
            lastName: e.target.value
        })
    }
    onChangePassword(e){
        this.setState({
            password: e.target.value
        })
    }

    onChangeCPassword(e){
        this.setState({
            Cpassword: e.target.value
        })
    }
    onChangeNick(e){
        this.setState({
            userNickName: e.target.value
        });
    }

    onSubmit(e){
        e.preventDefault();

        if(this.state.userNickName===''||this.state.password===''||this.state.name===''||this.state.lastName===''||this.state.userLevel===null || this.state.Cpassword===''){
            this.setState({message:"All fields should be filled in!"});
            return 0;
        }
        if(this.state.password!==this.state.Cpassword){
            this.setState({message:"Passwords does not match!"});
            return 0;
        }

        axios.post('api/register',{
            username: this.state.userNickName,
            password: this.state.password,
            cPassword: this.state.password,
            firstname: this.state.name,
            lastname: this.state.lastName,
            userLevel:this.state.userLevel
        })
            .then(res=>{
                this.setState({message:res.data.message})
            })
            .catch(e=> {
                console.log(e);
                this.setState({
                    message:"Could not connect to the database!"
                })
            })
    }

    render() {

        if(this.state.loggedIn){
            return <Redirect to ="/"/>
        }

        return( <div className="container">
                <div className='text-center'>
                    <h2 className="bg-warning">{this.state.message}</h2>
                </div>
                <div className="row">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-6 text-center">
                        <Form noValidate onSubmit={this.onSubmit}>
                            <Form.Group>
                                <Form.Label>
                                    <h3 className='container text-center'>Register</h3>
                                </Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="Client"
                                    name="userType"
                                    id="userType1"
                                    value={2}
                                    onClick={()=>{this.setState({userLevel:2})}}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Driver"
                                    name="userType"
                                    id="userType2"
                                    value={1}
                                    onClick={()=>{this.setState({userLevel:1})}}
                                />
                            </Form.Group>
                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter Username" value={this.state.userNickName} onChange={this.onChangeNick} />
                            </Form.Group>

                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text"  placeholder="Enter name" value={this.state.name} onChange={this.onChangeName}/>
                            </Form.Group>
                            <Form.Group controlId="lastname">
                                <Form.Label>Surname</Form.Label>
                                <Form.Control type="text"  placeholder="Enter surname" value={this.state.lastName} onChange={this.onChangelastName}/>
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password"  placeholder="Enter password" value={this.state.password} onChange={this.onChangePassword}/>
                            </Form.Group>
                            <Form.Group controlId="Cpassword">
                                <Form.Label>Confirm password</Form.Label>
                                <Form.Control type="password"  placeholder="Enter password again" value={this.state.Cpassword} onChange={this.onChangeCPassword}/>
                            </Form.Group>
                            <Button variant="outline-success" type="submit" className="float-right" block>Register</Button>
                        </Form>
                    </div>
                    <div className="col-lg-3"></div>
                </div>

            </div>
        )
    }
}
export default Register;

