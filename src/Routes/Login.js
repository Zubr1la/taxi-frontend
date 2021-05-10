import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {login, validation} from "../Components/Userfunctions";
import {Redirect} from "react-router-dom";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName : '',
            password : '',
            loggedIn:false,
            render:false,
            message:'',
            firstLogin:false,
        }
        ;
        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    onChangeUserName(e){
        this.setState({
            userName: e.target.value
        })
    }
    onChangePassword(e){
        this.setState({
            password: e.target.value
        })
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
                    })
                }

            }
        });
    }

    onSubmit(e){
        e.preventDefault();
        const user = {
            userName : this.state.userName,
            password : this.state.password
        };
        login(user).then(response => {
            if(response===undefined){
                this.setState({
                    message:"Could not connect to the database!"
                });
                return 0;
            }
            if(response.success){
                this.setState({
                    loggedIn: true,
                    firstLogin:true,
                });
            }else {
                this.setState({
                    loggedIn: false,
                    message:response.message,
                });
            }
        })
    }


    render() {

        if(this.state.loggedIn&&this.state.firstLogin){
            window.location.reload(false);
        }
        if(this.state.loggedIn&&!this.state.firstLogin){
            return <Redirect to ="/"/>
        }
        return <div className="container">
            <div className="mx-auto col-8">
                <h2 className="bg-warning text-center">{this.state.message}</h2>
            </div>
            <div className="mx-auto col-8 ">
                <Form noValidate onSubmit={this.onSubmit}>
                    <Form.Group controlId="loginForm">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="User name" name='userName' value={this.state.userName} onChange={this.onChangeUserName}/>
                    </Form.Group>
                    <Form.Group controlId="passwordForm">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" name='password' value={this.state.password} onChange={this.onChangePassword} />
                    </Form.Group>
                    <Button variant="outline-success" type="submit" className="float-right" block>Sign in</Button>
                </Form>
            </div>

        </div>
    }
}
export default Login;