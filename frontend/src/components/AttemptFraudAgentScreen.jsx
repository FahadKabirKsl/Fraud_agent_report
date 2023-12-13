import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Image, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios"; // Make sure to import axios
import CustomPagination from "./PaginationComponent";
const ITEMS_PER_PAGE = 5;
const AttemptFraudAgentScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fraudAttemptsAgents, setFraudAttemptsAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const fetchFraudAttempts = async () => {
      try {
        const { data: agents } = await axios.get(
          "/api/agents/attemptfraudAgents"
        );
        setFraudAttemptsAgents(agents);
      } catch (error) {
        console.error("Error fetching fraud attempts:", error);
        toast.error("Error fetching fraud attempts");
      }
    };

    fetchFraudAttempts();
  }, []);

  const userRole = userInfo?.role || "";

  const filteredAttemptFraudAgents = fraudAttemptsAgents
    ? fraudAttemptsAgents.filter((agent) => {
        const name = agent.name ? agent.name.toLowerCase() : "";
        const id = agent._id ? agent._id.toLowerCase() : "";
        const email = agent.email ? agent.email.toLowerCase() : "";
        const number =
          typeof agent.number === "string" ? agent.number.toLowerCase() : "";
        const nid =
          typeof agent.nid === "string" ? agent.nid.toLowerCase() : "";

        return (
          name.includes(searchTerm.toLowerCase()) ||
          id.includes(searchTerm.toLowerCase()) ||
          email.includes(searchTerm.toLowerCase()) ||
          number.includes(searchTerm.toLowerCase()) ||
          nid.includes(searchTerm.toLowerCase())
        );
      })
    : [];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  function getColor(index) {
    const colors = ["#FFC0CB", "#98FB98", "#ADD8E6", "#FFD700"];
    return colors[index % colors.length];
  }
  const indexOfLastAgent = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstAgent = indexOfLastAgent - ITEMS_PER_PAGE;
  const currentAgents = filteredAttemptFraudAgents.slice(
    indexOfFirstAgent,
    indexOfLastAgent
  );

  return (
    <div>
      <h1 className="text-center my-5">Attempt to Fraud Agents</h1>
      <Form.Control
        type="text"
        placeholder="Search by name, ID, email, EIN, or number"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-3 search-bar"
      />

      {fraudAttemptsAgents.length ? (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Avatar</th>
                <th>Number</th>
                <th>EIN</th>
                <th>Attempt Fraud</th>
                <th>Attempt Fraud Incident</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttemptFraudAgents.map((agent) => (
                <tr key={agent._id}>
                  <td>{agent._id}</td>
                  <td>{agent.name}</td>
                  <td>{agent.email}</td>
                  <td className="agent-image-container">
                    <Image
                      src={agent.agentAvatar}
                      alt={agent.name}
                      className="agent-image"
                      rounded
                    />
                  </td>
                  <td>{agent.number}</td>
                  <td>{agent.nid}</td>
                  <td>{agent.attemptFraudCount || 0}</td>
                  <td>
                    {agent.attemptFraudDetails &&
                    agent.attemptFraudDetails.length > 0 ? (
                      <div className="scrollable-incident-list">
                        {agent.attemptFraudDetails.map((detail, index) => (
                          <div
                            key={index}
                            style={{
                              backgroundColor: getColor(index),
                            }}
                          >
                            {`${index + 1}. ${detail.incident}`}{" "}
                            <span className="attempt-fraud-text">
                              --reported by "{detail.name}"
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No Attempt to Fraud Incident found</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <CustomPagination
            totalItems={filteredAttemptFraudAgents.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </>
      ) : (
        <div>No attempt to fraud agents found</div>
      )}
      {/* <p>Total Fraud Agents: {filteredAttemptFraudAgents.length}</p> */}
    </div>
  );
};

export default AttemptFraudAgentScreen;
