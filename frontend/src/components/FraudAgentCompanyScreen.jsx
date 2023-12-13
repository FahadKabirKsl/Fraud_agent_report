import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Image, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useGetAllFraudAgentCompaniesQuery,
  useMarkSafeAgentCompanyMutation,
} from "../slices/adminApiSlice";
import CustomPagination from "./PaginationComponent";
const ITEMS_PER_PAGE = 5;
const FraudAgentCompanyScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const {
    data: fraudAgentCompanies,
    error,
    isLoading,
  } = useGetAllFraudAgentCompaniesQuery();
  const [markAgentCompanySafe] = useMarkSafeAgentCompanyMutation();
  useEffect(() => {
    if (error) {
      console.error("Error fetching fraud agent companies:", error);
      toast.error("Error fetching fraud agent companies");
    }
  }, [error]);
  const userRole = userInfo?.role || "";
  const filteredFraudAgentCompanies = fraudAgentCompanies
    ? fraudAgentCompanies.filter((company) => {
        const name = company.name ? company.name.toLowerCase() : "";
        const id = company._id ? company._id.toLowerCase() : "";
        const email = company.email ? company.email.toLowerCase() : "";
        const number =
          typeof company.number === "string"
            ? company.number.toLowerCase()
            : "";
        const cid =
          typeof company.cid === "string" ? company.cid.toLowerCase() : "";

        return (
          name.includes(searchTerm.toLowerCase()) ||
          id.includes(searchTerm.toLowerCase()) ||
          email.includes(searchTerm.toLowerCase()) ||
          number.includes(searchTerm.toLowerCase()) ||
          cid.includes(searchTerm.toLowerCase())
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

      await markAgentCompanySafe(id);
      toast.success("Agent Company marked safe successfully");
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error marking agent company safe:", error);
      toast.error("Error marking agent company safe");
    }
  };
  const indexOfLastAgent = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstAgent = indexOfLastAgent - ITEMS_PER_PAGE;
  const currentAgents = filteredFraudAgentCompanies.slice(
    indexOfFirstAgent,
    indexOfLastAgent
  );
  return (
    <div>
      <h1 className="text-center my-5">Fraud Agent Companies</h1>

      <Form.Control
        type="text"
        placeholder="Search by name, ID, email, CID, or number"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-3 search-bar"
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : filteredFraudAgentCompanies.length ? (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Avatar</th>
                <th>Number</th>
                <th>TaxID</th>
                <th>Status</th>
                <th>Fraud incident</th>
                {userRole === "admin" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredFraudAgentCompanies.map((company) => (
                <tr key={company._id}>
                  <td>{company._id}</td>
                  <td>{company.name}</td>
                  <td>{company.email}</td>
                  <td className="agent-image-container">
                    <Image
                      src={company.avatar}
                      alt={company.name}
                      className="agent-image"
                      rounded
                    />
                  </td>
                  <td>{company.number}</td>
                  <td>{company.cid}</td>
                  <td>{company.isGood ? "Safe" : "Fraud"}</td>
                  <td>{company.incident}</td>
                  {userRole === "admin" && (
                    <td>
                      <Button onClick={() => handleMarkSafe(company._id)}>
                        Mark Safe
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
          <CustomPagination
            totalItems={filteredFraudAgentCompanies.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </>
      ) : (
        <div>No fraud agent companies found</div>
      )}
      <p>Total Fraud Agent Companies: {filteredFraudAgentCompanies.length}</p>
    </div>
  );
};

export default FraudAgentCompanyScreen;
