import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class DriverTutorial extends React.Component {

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
                       <h1>Information for drivers</h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>How to accept the drive?</h3>
                    <p>
                        1. You need to have entered your bank card data beforehand, to accept the drive! <br/>
                        2. All available trips are displayed at the top of the page, under the heading 'Available Trips'. <br/>
                        3. Click on 'Data' for trip details <br/>
                        4. To delete a previous trip on the map, press' Clear map <br/>
                        5. To confirm the trip, press 'Accept drive' <br/>
                        6. When reloading the page, only the accepted drive and additional options will be displayed <br/>
                    </p>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }

}
export default DriverTutorial;

