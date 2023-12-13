import React, { useState, useEffect } from "react";
import { Table, Image, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const BannedAgentScreen = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/admin/agents");
        setAgents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const handleBanAgent = async (id) => {
    try {
      await axios.put(`/api/admin/agents/${id}/ban`);
      toast.success("Agent banned successfully");
      window.location.reload(); // Reloading the page after a successful ban
    } catch (error) {
      console.error("Error banning agent:", error);
      toast.error("Error banning agent");
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const name = agent.name ? agent.name.toLowerCase() : "";
    const id = agent._id ? agent._id.toLowerCase() : "";
    const email = agent.email ? agent.email.toLowerCase() : "";
    const number =
      typeof agent.number === "string" ? agent.number.toLowerCase() : "";
    const nid = typeof agent.nid === "string" ? agent.nid.toLowerCase() : "";

    return (
      name.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      number.includes(searchTerm.toLowerCase()) ||
      nid.includes(searchTerm.toLowerCase())
    );
  });
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div>
      <h2>Banned Agent Screen</h2>
      
      <Form.Control
        type="text"
        placeholder="Search by name, ID, email, NID, or number"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-3 search-bar"
      />
      {loading ? (
        <div>Loading...</div>
      ) : filteredAgents.length ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Avatar</th>
              <th>Number</th>
              <th>EIN number</th>
              <th>Ban</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map((agent) => (
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
                <td>
                  <button onClick={() => handleBanAgent(agent._id)}>
                    Ban Agent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No agents found</div>
      )}
      <p>Total Agents: {filteredAgents.length}</p>
    </div>
  );
};

export default BannedAgentScreen;
