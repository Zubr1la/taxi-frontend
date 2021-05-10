import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";
import axios from "axios";

class Bankdata extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cardNumber:'',
            message:'',
            name:'',
            lastName:'',
            secret:'',
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeCard = this.onChangeCard.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeSecret = this.onChangeSecret.bind(this);
    }

    onChangeCard(e){
        this.setState({
            cardNumber:e.target.value
        });
    }
    onChangeName(e){
        this.setState({
            name:e.target.value
        });
    }
    onChangeLastName(e){
        this.setState({
            lastName:e.target.value
        });
    }
    onChangeSecret(e){
        this.setState({
            secret:e.target.value
        });

    }

    onSubmit(e){
        e.preventDefault();

        this.setState({message:''});

        e.preventDefault();
        if(this.state.cardNumber==='' || this.state.secret===''|| this.state.name===''|| this.state.lastName===''){
            this.setState({message:"All fields should be filled in!"});
            return 0
        }

        if(this.state.cardNumber.length!==16){
            this.setState({message:"Invalid bank card number! It should be 16 symbols in length!"});
            return 0
        }

        if(this.state.secret.length!==3){
            this.setState({message:"Invalid CVV information! It should be 3 symbols in length!"});
            return 0
        }

        axios.post('api/money/',{
            cardno:this.state.cardNumber,
            secret:this.state.secret,
            name:this.state.name,
            lastName:this.state.lastName,
            option:this.props.option,

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
                       Bank card information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={this.onSubmit}>
                        <Form.Group controlId="cardno">
                            <Form.Label>Card number</Form.Label>
                            <Form.Control type="Number"  placeholder="Enter card number!" value={this.state.cardNumber} onChange={this.onChangeCard}/>
                        </Form.Group>
                        <Form.Group controlId="secret">
                            <Form.Label>Security code</Form.Label>
                            <Form.Control type="Number"  placeholder="Enter security code!" value={this.state.secret} onChange={this.onChangeSecret}/>
                        </Form.Group>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text"  placeholder="Enter name!" value={this.state.name} onChange={this.onChangeName}/>
                        </Form.Group>
                        <Form.Group controlId="lastname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control type="text"  placeholder="Enter surname!" value={this.state.lastName} onChange={this.onChangeLastName}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="float-middle" >
                            Save
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
export default Bankdata;

