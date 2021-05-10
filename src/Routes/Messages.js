import React from 'react';
import {validation, getMessagesSent, getMessagesReceived} from "../Components/Userfunctions";
import {Redirect} from "react-router-dom";
import {Button} from "react-bootstrap";
import addGap from "../Universal.css"
import NewMessage from "../Components/NewMessage";
import axios from "axios";

class Messages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn:false,
            message:'',
            mounted:false,
            userLevel:null,
            sentMessages:[],
            receivedMessages:[],
            messagesLoaded:false,
            sendMessageModal:false,
            receiver:'',
            userID:'',
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
                        userID:response.userID
                    });
                }else {
                    this.setState({
                        loggedIn:false,
                        mounted:true,
                    });
                }
            }

            getMessagesSent().then(response => {
                this.setState({
                    sentMessages:response,
                });
            });

            getMessagesReceived().then(response => {
                this.setState({
                    receivedMessages:response,
                    messagesLoaded:true,
                });
            })
        });
    }

    deleteMessage(id){
        axios.post('api/message/delete',{
            _id:id,
        })
            .then(res=>{
                this.setState({message:res.data.message})
            })
            .catch(e=> {
                console.log(e);
            })
    }


    render() {


        if(!this.state.loggedIn&&this.state.mounted) {
            return <Redirect to="/"/>
        }

        let sendMessageModal=() => this.setState({sendMessageModal:false});
        return <div className="container">
            <div className='text-center'>
                <h2 className="bg-warning">{this.state.message}</h2>
            </div>
            <h1 className="text-center">Message board</h1>

            <NewMessage
                show={this.state.sendMessageModal}
                onHide={sendMessageModal}
                receiver={this.state.receiver}
            />

            {
                this.state.messagesLoaded===false ?
                    (null):
                    (<div>
                            <h3 className="text-center">Received messages</h3>
                            {this.state.receivedMessages.length===0 ?
                                (<h5 className="text-center">No received messages found</h5>):
                                (null)
                            }

                            {this.state.receivedMessages.map(message =>{
                                return <div className="row justify-content-center text-center bg-light addGap" key={message._id}>
                                    <div className="col-lg-4">
                                        <p className="fixWords"><b>Sender:</b> {message.firstName + " " + message.lastName}</p>
                                        <p className="fixWords"><b>Receiver:</b> {message.firstNameRec + " " + message.lastNameRec}</p>
                                        <p className="fixWords">
                                            {new Intl.DateTimeFormat('lv', {
                                                month: 'long',
                                                day: '2-digit',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                second: 'numeric',
                                                hour12: false,
                                            }).format(new Date(message.date_created))}
                                        </p>
                                    </div>
                                    <div className="col-lg-4">
                                        <h5>Message:</h5>
                                        <p className="fixWords">{message.data}</p>
                                        <div>
                                            {this.state.userID===message.senderID ?
                                                (null):
                                                (<Button variant="outline-success" size='sm'
                                                         onClick={()=>
                                                             this.setState({
                                                                 receiver:message.senderID,
                                                                 sendMessageModal:true
                                                             })}
                                                >Answer</Button>)
                                            }
                                            <Button variant="outline-danger" size='sm' onClick={()=>this.deleteMessage(message._id)}>Delete</Button>
                                        </div>
                                    </div>
                                </div>
                            })}
                            <h3 className="text-center">Sent messages</h3>
                            {this.state.sentMessages.length===0 ?
                                (<h5 className="text-center">No sent messages found!</h5>):
                                (null)
                            }

                            {this.state.sentMessages.map(message =>{
                                return <div className="row justify-content-center text-center bg-light addGap" key={message._id}>
                                    <div className="col-lg-4">
                                        <p className="fixWords"><b>Sender:</b> {message.firstName + " " + message.lastName}</p>
                                        <p className="fixWords"><b>Receiver:</b> {message.firstNameRec + " " + message.lastNameRec}</p>
                                        <p className="fixWords">
                                            {new Intl.DateTimeFormat('lv', {
                                                month: 'long',
                                                day: '2-digit',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                second: 'numeric',
                                                hour12: false,
                                            }).format(new Date(message.date_created))}
                                        </p>
                                    </div>
                                    <div className="col-lg-4">
                                        <h5>Message:</h5>
                                        <p className="fixWords">{message.data}</p>
                                        <div>
                                            {this.state.userID===message.senderID ?
                                                (null):
                                                (<Button variant="outline-success" size='sm'
                                                         onClick={()=>
                                                             this.setState({
                                                                 receiver:message.senderID,
                                                                 sendMessageModal:true
                                                             })}
                                                >Answer</Button>)
                                            }
                                            <Button variant="outline-danger" size='sm' onClick={()=>this.deleteMessage(message._id)}>Delete message</Button>
                                        </div>
                                    </div>
                                </div>
                            })}
                    </div>
                    )}
        </div>
    }
}

export default Messages;
