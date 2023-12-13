import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../Loader";

const ReportAgentScreen = ({
  selectedAgent,
  agentID,
  agentName,
  agentEmail,
  agentNumber,
  agentAvatar,
  agentNid,
  agentAddress,
}) => {
  const [incident, setIncident] = useState("");
  const [isGood, setIsGood] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptFraud, setAttemptFraud] = useState(false);
  const [attemptFraudIncident, setAttemptFraudIncident] = useState("");
  

  const handleReportSubmission = async () => {
    try {
      if (!selectedAgent || !selectedAgent._id) {
        throw new Error("Invalid agent selected");
      }

      setIsLoading(true);

      const response = await axios.put(
        `/api/agents/reportAgent/${selectedAgent._id}`,
        {
          incident: incident || "No incident provided",
          isGood,
          attemptFraud,
          attemptFraudIncident: attemptFraudIncident || "no incident provided",
        }
      );

      if (response.status === 200) {
        toast.success("Agent reported successfully");
        // Reload the page here
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to report agent");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAgent && !selectedAgent.isGood) {
      setIsGood(false);
    }
  }, [selectedAgent]);

  const handleCheckboxChange = () => {
    if (!selectedAgent.isGood) {
      toast.error(`${selectedAgent.name} is a fraud agent`, { type: "error" });
    } else {
      setIsGood(!isGood);
    }
  };

  if (!selectedAgent) {
    return <div>No Agent selected</div>;
  }
  const handleAttemptFraudCheckboxChange = () => {
    setAttemptFraud(!attemptFraud);
  };

  return (
    <div>
      {isLoading && <Loader />}
          <Card className="no-border">
            <Card.Img variant="top" src={agentAvatar} className="avatar" />
            <Card.Body>
              <Card.Title>ID: {agentID}</Card.Title>
              <Card.Text>Name: {agentName}</Card.Text>
              <Card.Text>Email: {agentEmail}</Card.Text>
              <Card.Text>Mobile Number: {agentNumber}</Card.Text>
              <Card.Text>EIN: {agentNid}</Card.Text>
              <Card.Text>Address: {agentAddress}</Card.Text>
            </Card.Body>
          </Card>
      
          <Form>
            {selectedAgent.isGood ? (
              <div>
                <Row>
                  <Col md={6}>
                    {/* {attemptFraud && ( */}
                    <Form.Group controlId="attemptFraudIncident">
                      <Form.Label>Attempt to Fraud Incident</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={attemptFraudIncident}
                        onChange={(e) =>
                          setAttemptFraudIncident(e.target.value)
                        }
                      />
                    </Form.Group>
                    {/* )} */}{" "}
                    <Form.Group controlId="attemptFraud">
                      <Form.Check
                        type="checkbox"
                        label="Attempt to Fraud"
                        checked={attemptFraud}
                        onChange={handleAttemptFraudCheckboxChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="incident">
                      <Form.Label>Incident Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={incident}
                        onChange={(e) => setIncident(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="isGood">
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        label={isGood ? "Good" : "Fraud"}
                        checked={isGood}
                        onChange={handleCheckboxChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  variant="danger"
                  className="w-100 mt-5"
                  onClick={handleReportSubmission}
                >
                  Submit Report
                </Button>
              </div>
            ) : (
              <div>
                <Form.Group controlId="incident">
                  <Form.Label>Incident Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={selectedAgent.incident}
                    readOnly
                  />
                </Form.Group>
                <p>{`${selectedAgent.name} is a fraud agent`}</p>
              </div>
            )}
          </Form>
        
    </div>
  );
};

export default ReportAgentScreen;
