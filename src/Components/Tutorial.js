import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class Tutorial extends React.Component {

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
                     <h1>Information for clients</h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>How to order a drive?</h3>
                    <p>
                        1. Enter your location (where you are now). <br/>
                        2. Click 'Find Starting Point.' <br/>
                        3. Select the appropriate location in the right corner under the 'Found Places' heading. <br/>
                        4. The selected location is displayed on the map. <br/>
                        4.1. If this is not the correct place, press 'Clear Map' and select another location. <br/>
                        4.2. If none of the suggested locations match, you need to specify the location more precisely  <br/>
                        5. Enter the destination address and proceed same as for selecting the starting point <br/>
                        6. Once you've selected your start and end addresses, click 'Show Estimates' <br/>
                        7. The trip details are displayed in the right corner under the heading 'Selected route'. <br/>
                        7.1. If necessary, you can enter additional information for the driver. <br/>
                        8. Click 'Book Trip' to book a trip. <br/>
                    </p>
                    <h3>Extra information</h3>
                    <p>
                        * In case of an error, a warning will be displayed at the top of the page. <br/>
                        * To apply for a trip, it is mandatory to add account details at the beginning. <br/>
                        * You must have enough funds in your account to book a trip! <br/>
                        * You can manage your data and perform actions with the trip in the 'Panel' section <br/>
                    </p>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
export default Tutorial;

