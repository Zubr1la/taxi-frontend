import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {validation} from "./Userfunctions";
import {logoutFunc} from "./Userfunctions";

class NavBar extends React.Component {

    constructor(props) {
        super(props);

       this.state = {
           loggedIn:false,
       }

    }

    logOut(e){
        e.preventDefault();
        logoutFunc().then(response => {});
        this.setState({loggedIn:false});
        window.location.reload(false);
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
                }else {
                    this.setState({
                        loggedIn:false
                    })
                }
            }
        });
    }

    handleNavBar(){

        if(this.state.loggedIn){
            return [
                <Nav key="1" className="mr-auto">
                    <Nav.Link href="/panel">Panel</Nav.Link>
                </Nav>,
                <Nav key="2" className="align-content-end">
                    <Nav.Link href="" onClick={this.logOut.bind(this)} >Log out</Nav.Link>
                </Nav>
            ]

        }else{
       return  <Nav className="align-content-end">
           <Nav.Link href="/login">Login</Nav.Link>
           <Nav.Link href="/register">Register</Nav.Link>
       </Nav>
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.loggedIn!==prevProps.loggedIn){
            this.handleNavBar();
        }
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark" className="mr-auto" >
                <Navbar.Brand href="/">Taxi-App</Navbar.Brand>
                {this.handleNavBar()}
            </Navbar>
        )
    }
}

export default NavBar
