import React, { useState, useEffect } from "react";
import { Table, Image, Form } from "react-bootstrap";
import Loader from "../../Loader";
import axios from "axios";

const MyAgentScreen = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/agents/myagents");
        setAgents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);
  const filterAgents = (term) => {
    return agents.filter(
      (agent) =>
        agent._id.toLowerCase().includes(term.toLowerCase()) ||
        agent.name.toLowerCase().includes(term.toLowerCase()) ||
        agent.email.toLowerCase().includes(term.toLowerCase()) ||
        agent.number.toString().toLowerCase().includes(term.toLowerCase()) ||
        agent.nid.toString().toLowerCase().includes(term.toLowerCase())
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAgents = filterAgents(searchTerm);
  return (
    <>
      <div>
        <h1 className="text-center my-5">My Agents</h1>
        <Form.Control
          type="text"
          placeholder="Search by ID, Name, Email, Number, or NID"
          value={searchTerm}
          onChange={handleSearch}
          className="mb-3 "
        />

        {loading ? (
          <Loader />
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Agent Image</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>EIN Number</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.length ? (
                filteredAgents.map((agent) => (
                  <tr key={agent._id}>
                    <td>{agent._id}</td>
                    <td>{agent.name}</td>
                    <td className="agent-image-container">
                      <Image
                        src={agent.agentAvatar}
                        alt={agent.name}
                        className="agent-image"
                      />
                    </td>
                    <td>{agent.email}</td>
                    <td>{agent.number}</td>
                    <td>{agent.nid}</td>
                    <td>{agent.address}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No agents found</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
};

export default MyAgentScreen;
