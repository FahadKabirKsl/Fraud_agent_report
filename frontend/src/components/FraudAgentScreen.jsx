import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Image, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useGetAllFraudAgentsQuery,
  useMarkSafeAgentMutation,
} from "../slices/adminApiSlice"; // Update the path
import CustomPagination from "./PaginationComponent";
const ITEMS_PER_PAGE = 5;
const FraudAgentScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: fraudAgents, error, isLoading } = useGetAllFraudAgentsQuery();
  const [markAgentSafe] = useMarkSafeAgentMutation();

  useEffect(() => {
    if (error) {
      console.error("Error fetching fraud agents:", error);
      toast.error("Error fetching fraud agents");
    }
  }, [error]);
  const userRole = userInfo?.role || "";
  const filteredFraudAgents = fraudAgents
    ? fraudAgents.filter((agent) => {
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
  const handleMarkSafe = async (id) => {
    try {
      // Check if the user is an admin
      if (userRole !== "admin") {
        toast.error("Not authorized to perform this action");
        return;
      }

      await markAgentSafe(id);
      toast.success("Agent marked safe successfully");
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error marking agent safe:", error);
      toast.error("Error marking agent safe");
    }
  };
  const indexOfLastAgent = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstAgent = indexOfLastAgent - ITEMS_PER_PAGE;
  const currentAgents = filteredFraudAgents.slice(
    indexOfFirstAgent,
    indexOfLastAgent
  );
  return (
    <div>
      <h1 className="text-center my-5">All Fraud Agents</h1>
      <Form.Control
        type="text"
        placeholder="Search by name, ID, email, NID, or number"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-3 search-bar"
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : filteredFraudAgents.length ? (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Avatar</th>
                <th>Number</th>
                <th>EIN Number</th>
                <th>Status</th>
                <th>Fraud incident</th>
                {userRole === "admin" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredFraudAgents.map((agent) => (
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
                  <td>{agent.isGood ? "Safe" : "Fraud"}</td>
                  <td>{agent.incident}</td>
                  {userRole === "admin" && (
                    <td>
                      <Button onClick={() => handleMarkSafe(agent._id)}>
                        Mark Safe
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
          <CustomPagination
            totalItems={filteredFraudAgents.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </>
      ) : (
        <div>No fraud agents found</div>
      )}
      <p>Total Fraud Agents: {filteredFraudAgents.length}</p>
    </div>
  );
};

export default FraudAgentScreen;
