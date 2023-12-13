import React, { useState, useEffect } from "react";
import {
  Table,
  Image,
  Form,
  ListGroup,
  Card,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import axios from "axios";
import ReportAgentCompanyScreen from "./ReportAgentCompanyScreen";
import CustomPagination from "../../PaginationComponent";
const ITEMS_PER_PAGE = 5;
const AgentCompanyListScreen = () => {
  const [agentCompanies, setAgentCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const fetchAgentCompanies = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/agents/agentCompanies");
        setAgentCompanies(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agent companies:", error);
        setLoading(false);
      }
    };
    fetchAgentCompanies();
  }, []);

  const filteredAgentCompanies = agentCompanies.filter((company) => {
    const name = company.name ? company.name.toLowerCase() : "";
    const id = company._id ? company._id.toLowerCase() : "";
    const email = company.email ? company.email.toLowerCase() : "";
    const number = company.number ? String(company.number).toLowerCase() : "";
    const cid = company.cid ? String(company.cid).toLowerCase() : "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      number.includes(searchTerm.toLowerCase()) ||
      cid.includes(searchTerm.toLowerCase())
    );
  });
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleCompanySelection = (company) => {
    setSelectedCompany(company);
  };
  function getColor(index) {
    const colors = ["#FFC0CB", "#98FB98", "#ADD8E6", "#FFD700"];
    return colors[index % colors.length];
  }
  const indexOfLastCompany = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstCompany = indexOfLastCompany - ITEMS_PER_PAGE;
  const currentCompanies = filteredAgentCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );
  return (
    <>
      <Row>
        <Col md={9}>
          <div>
            <h1>Agent Company List</h1>
            <Form.Control
              type="text"
              placeholder="Search by name, ID, email, CID, or number"
              value={searchTerm}
              onChange={handleSearch}
              className="mb-3 search-bar"
            />
            {loading ? (
              <div>Loading...</div>
            ) : currentCompanies.length ? (
              <>
                {currentCompanies.map((company) => (
                  <Card key={company._id} className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col md={1} className="my-auto">
                          <Image
                            src={company.avatar || "NoImage provided"}
                            alt={company.name}
                            className="agent-image"
                            roundedCircle
                          />
                        </Col>
                        <Col md={4} className="my-auto">
                          <Card.Title>
                            ID: {company._id || "No ID provided"}
                          </Card.Title>
                          <Card.Text>
                            <p>Name: {company.name || "No Name provided"}</p>
                            <p>Email: {company.email || "No Email provided"}</p>
                            <p>
                              Number: {company.number || "No Number provided"}
                            </p>
                            <p>TaxId: {company.cid || "No TaxID provided"}</p>
                          </Card.Text>
                        </Col>
                        <Col md={2} className="my-auto">
                          <Card.Text>
                            <p
                              className={`card-status ${
                                company.isGood ? "card-safe" : "card-fraud"
                              }`}
                            >
                              Status: {company.isGood ? "Safe" : "Fraud"}
                            </p>
                          </Card.Text>
                        </Col>
                        <Col md={5} className="my-auto">
                          <Card.Text>
                            <p>
                              Attempts to Fraud:
                              {company.attemptFraudCount || 0}
                            </p>
                            <p>Attempt to Fraud Incident:</p>
                            {company.attemptFraudDetails &&
                            company.attemptFraudDetails.length > 0 ? (
                              <div className="scrollable-incident-list">
                                {company.attemptFraudDetails.map(
                                  (detail, index) => (
                                    <p
                                      key={index}
                                      style={{
                                        backgroundColor: getColor(index),
                                      }}
                                    >
                                      {`${index + 1}. ${detail.incident}`}{" "}
                                      <span className="attempt-fraud-text">
                                        --reported by "{detail.name}"
                                      </span>
                                    </p>
                                  )
                                )}
                              </div>
                            ) : (
                              <p>No Attempt to Fraud Incident found</p>
                            )}
                            <Button
                              variant="danger"
                              className="w-100 mt-3"
                              onClick={() => handleCompanySelection(company)}
                            >
                              Report
                            </Button>
                          </Card.Text>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <CustomPagination
                  totalItems={filteredAgentCompanies.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                  onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
                />
              </>
            ) : (
              <div>No Agent companies found</div>
            )}
          </div>
        </Col>
        <Col md={3}>
          <h1>Report Agent Companies</h1>
          {selectedCompany ? (
            <ReportAgentCompanyScreen
              selectedCompany={selectedCompany}
              companyID={selectedCompany._id || "No ID provided"}
              companyName={selectedCompany.name || "No Company Name provided"}
              companyEmail={selectedCompany.email || "No Email provided"}
              companyAvatar={
                selectedCompany.avatar || "No avatar image provided"
              }
              companyisGood={selectedCompany.isGood ? "Safe" : "Fraud"}
              companyNumber={selectedCompany.number || "No Number provided"}
              companyId={selectedCompany.cid || "No Company Id provided"}
            />
          ) : (
            <div>No company selected</div>
          )}
        </Col>
      </Row>
    </>
  );
};

export default AgentCompanyListScreen;
