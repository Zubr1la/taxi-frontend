import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";
import axios from "axios";


class NewMessage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data:'',
        };
        
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeData = this.onChangeData.bind(this);
    }
    
    onChangeData(e){
        this.setState({
            data:e.target.value
        });
    }

    onSubmit(e){

        this.setState({message:''});

        e.preventDefault();
        if(this.state.data===''){
            this.setState({message:"Message field can not be empty!"});
            return 0
        }

        if(this.state.data.length>255){
            this.setState({message:"Message too long! Max 255 symbols!"});
            return 0
        }


        axios.post('api/message/',{
            data:this.state.data,
            receiver:this.props.receiver,

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
                        Send message
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={this.onSubmit}>
                        <Form.Group controlId="message">
                            <Form.Label>Message</Form.Label>
                            <Form.Control type="text" rows="3" placeholder="Enter message!" value={this.state.data} onChange={this.onChangeData}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="float-middle" >
                            Send
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
export default NewMessage;

