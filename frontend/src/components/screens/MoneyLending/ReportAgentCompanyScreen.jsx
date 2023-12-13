import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../Loader";

const ReportAgentCompanyScreen = ({
  selectedCompany,
  companyID,
  companyName,
  companyEmail,
  companyAvatar,
  companyNumber,
  companyId,
}) => {
  const [incident, setIncident] = useState("");
  const [isGood, setIsGood] = useState(selectedCompany.isGood);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptFraud, setAttemptFraud] = useState(false);
  const [attemptFraudIncident, setAttemptFraudIncident] = useState("");
  const handleReportSubmission = async () => {
    try {
      setIsLoading(true);
      if (!selectedCompany || !selectedCompany._id) {
        throw new Error("Invalid company selected");
      }

      const response = await axios.put(
        `/api/agents/reportAgentCompany/${selectedCompany._id}`,
        {
          incident: incident || "No incident provided",
          isGood,
          attemptFraud,
          attemptFraudIncident: attemptFraudIncident || "no incident provided",
        }
      );

      if (response.status === 200) {
        toast.success("Agent company reported successfully");
        // Reload the page here
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to report agent company");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (selectedCompany && !selectedCompany.isGood) {
      setIsGood(false);
    }
  }, [selectedCompany]);

  const handleCheckboxChange = () => {
    if (!selectedCompany.isGood) {
      toast.error(`${selectedCompany.name} is a fraud company`, {
        type: "error",
      });
    } else {
      setIsGood(!isGood);
    }
  };
  if (!selectedCompany) {
    return <div>No company selected</div>;
  }
  const handleAttemptFraudCheckboxChange = () => {
    setAttemptFraud(!attemptFraud);
  };
  return (
    <div>
      {isLoading && <Loader />}
      <div>
        <Card className="no-border">
          <Card.Img variant="top" src={companyAvatar} className="avatar" />
          <Card.Body>
            <Card.Title>ID: {companyID}</Card.Title>
            <Card.Text>Name: {companyName}</Card.Text>
            <Card.Text>Email: {companyEmail}</Card.Text>
            <Card.Text>Mobile Number: {companyNumber}</Card.Text>
            <Card.Text>TaxId: {companyId}</Card.Text>
          </Card.Body>
        </Card>
        <Form>
          {selectedCompany.isGood ? (
            <div>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="attemptFraudIncident">
                    <Form.Label>Attempt to Fraud Incident</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={attemptFraudIncident}
                      onChange={(e) => setAttemptFraudIncident(e.target.value)}
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
                      // readOnly={!isGood}
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
                  value={selectedCompany.incident}
                  readOnly
                />
              </Form.Group>
              <p>{`${selectedCompany.name} is a fraud company`}</p>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default ReportAgentCompanyScreen;
