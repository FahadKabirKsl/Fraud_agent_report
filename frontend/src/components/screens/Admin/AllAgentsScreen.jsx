import React, { useState, useEffect } from "react";
import { Image, Form, Card, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import ReportAgentScreen from "../MoneyLending/ReportAgentScreen";
import CustomPagination from "../../PaginationComponent";
const ITEMS_PER_PAGE = 5;
const AllAgentsScreen = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalAgents, setTotalAgents] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/admin/agents");
        setAgents(data);
        setTotalAgents(data.length);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter((agent) => {
    const name = agent.name ? agent.name.toLowerCase() : "";
    const id = agent._id ? agent._id.toLowerCase() : "";
    const email = agent.email ? agent.email.toLowerCase() : "";
    const nid = typeof agent.nid === "string" ? agent.nid.toLowerCase() : "";
    const number =
      typeof agent.number === "string" ? agent.number.toLowerCase() : "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      nid.includes(searchTerm.toLowerCase()) ||
      number.includes(searchTerm.toLowerCase())
    );
  });
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleAgentSelection = (agent) => {
    setSelectedAgent(agent);
  };
  function getColor(index) {
    const colors = ["#FFC0CB", "#98FB98", "#ADD8E6", "#FFD700"];
    return colors[index % colors.length];
  }
  const indexOfLastAgent = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstAgent = indexOfLastAgent - ITEMS_PER_PAGE;
  const currentAgents = filteredAgents.slice(
    indexOfFirstAgent,
    indexOfLastAgent
  );
  return (
    <>
      <Row>
        {/* list section */}
        <Col md={9}>
          <div>
            <h1>All Agents List</h1>
            <div>
              <Form.Control
                type="text"
                placeholder="Search by name, ID, email, NID, or number"
                value={searchTerm}
                onChange={handleSearch}
                className="mb-3 search-bar"
              />
            </div>
            <p>Total Agents: {totalAgents}</p>

            {loading ? (
              <div>Loading...</div>
            ) : currentAgents.length ? (
              <>
                {currentAgents.map((agent) => (
                  <Card key={agent._id} className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col md={1} className="my-auto">
                          <Image
                            src={agent.agentAvatar || "NoImage provided"}
                            alt={agent.name}
                            className="agent-image"
                            roundedCircle
                          />
                        </Col>
                        <Col md={4} className="my-auto">
                          <Card.Title>
                            ID: {agent._id || "No ID provided"}
                          </Card.Title>
                          <Card.Text>
                            <p>Name: {agent.name || "No Name provided"}</p>
                            <p>Email: {agent.email || "No Email provided"}</p>
                            <p>
                              Number: {agent.number || "No Number provided"}
                            </p>
                            <p>EIN number: {agent.nid || "No NID provided"}</p>
                          </Card.Text>
                        </Col>
                        <Col md={2} className="my-auto">
                          <Card.Text>
                            <p
                              className={`card-status ${
                                agent.isGood ? "card-safe" : "card-fraud"
                              }`}
                            >
                              Status: {agent.isGood ? "Safe" : "Fraud"}
                            </p>
                          </Card.Text>
                        </Col>
                        <Col md={5} className="my-auto">
                          <Card.Text>
                            <p>
                              Attempts to Fraud:
                              {agent.attemptFraudCount || 0}
                            </p>
                            <p>Attempt to Fraud Incident:</p>
                            {agent.attemptFraudDetails &&
                            agent.attemptFraudDetails.length > 0 ? (
                              <div className="scrollable-incident-list">
                                {agent.attemptFraudDetails.map(
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
                              onClick={() => handleAgentSelection(agent)}
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
                  totalItems={filteredAgents.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                  onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
                />
              </>
            ) : (
              <div>No Agents found</div>
            )}
          </div>
        </Col>
        {/* report section */}
        <Col md={3}>
          <div>
            <h1>Report Agents</h1>{" "}
            {selectedAgent ? (
              <ReportAgentScreen
                selectedAgent={selectedAgent}
                agentID={selectedAgent._id || "No ID provided"}
                agentName={selectedAgent.name || "No Name provided"}
                agentEmail={selectedAgent.email || "No Email provided"}
                agentAvatar={selectedAgent.agentAvatar || "No Image provided"}
                agentisGood={selectedAgent.isGood ? "Safe" : "Fraud"}
                agentNumber={selectedAgent.number || "No Number provided"}
                agentNid={selectedAgent.nid || "No Nid provided"}
                agentAddress={selectedAgent.address || "No Address provided"}
              />
            ) : (
              <div>No Agents selected</div>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default AllAgentsScreen;
