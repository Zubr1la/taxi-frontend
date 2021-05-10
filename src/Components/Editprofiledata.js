import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";
import axios from "axios";

class Editprofiledata extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName:'',
            lastName:'',
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
    }

    onChangeName(e){
        this.setState({
            firstName:e.target.value
        });
    }

    onChangeLastName(e){
        this.setState({
            lastName:e.target.value
        });
    }


    onSubmit(e){
        e.preventDefault();

        if(this.state.lastName===''||this.state.firstName===''){
            this.setState({
                message:"All fields should be filled in!"
            });
            return 0;
        }

        axios.post('api/updateuser',{
            firstName:this.state.firstName,
            lastName:this.state.lastName,
        })
            .then(res=>{
                this.setState({message:res.data.message})
            })
            .catch(e=> {
                console.log(e);
            })
    }

    render() {
        return(
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Change your personal data
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={this.onSubmit}>
                        <Form.Group controlId="name">
                            <Form.Label>New name</Form.Label>
                            <Form.Control type="text"  placeholder="Enter new name" value={this.state.firstName} onChange={this.onChangeName}/>
                        </Form.Group>
                        <Form.Group controlId="lastName">
                            <Form.Label>New surname</Form.Label>
                            <Form.Control type="text"  placeholder="Enter new surname" value={this.state.lastName} onChange={this.onChangeLastName}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="float-middle" >
                            Save changes
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <h4>{this.state.message}</h4>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }


}
export default Editprofiledata;

