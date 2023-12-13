import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Image, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import CustomPagination from "./PaginationComponent";
const ITEMS_PER_PAGE = 5;
const AttemptFraudAgentCompanyScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fraudAttemptAgentCompanies, setFraudAttemptsAgentCompanies] = useState(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const userInfo = useSelector((state) => state.auth.userInfo);
  useEffect(() => {
    const fetchFraudAttempts = async () => {
      try {
        const { data: company } = await axios.get(
          "/api/agents/attemptfraudAgentCompanies"
        );
        setFraudAttemptsAgentCompanies(company);
      } catch (error) {
        console.error("Error fetching fraud attempts:", error);
        toast.error("Error fetching fraud attempts");
      }
    };

    fetchFraudAttempts();
  }, []);

  const userRole = userInfo?.role || "";
  const filteredAttemptFraudAgentCompanies = fraudAttemptAgentCompanies
    ? fraudAttemptAgentCompanies.filter((company) => {
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
  function getColor(index) {
    const colors = ["#FFC0CB", "#98FB98", "#ADD8E6", "#FFD700"];
    return colors[index % colors.length];
  }
  const indexOfLastAgent = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstAgent = indexOfLastAgent - ITEMS_PER_PAGE;
  const currentAgents = filteredAttemptFraudAgentCompanies.slice(
    indexOfFirstAgent,
    indexOfLastAgent
  );
  return (
    <div>
      <h1 className="text-center my-5">Attempt to Fraud Agent Companies</h1>

      <Form.Control
        type="text"
        placeholder="Search by name, ID, email, TaxID, or number"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-3 search-bar"
      />
      {fraudAttemptAgentCompanies.length ? (
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
                <th>Attempt Fraud</th>
                <th>Attempt Fraud Incident</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttemptFraudAgentCompanies.map((company) => (
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
                  <td>{company.attemptFraudCount || 0}</td>
                  <td>
                    {company.attemptFraudDetails &&
                    company.attemptFraudDetails.length > 0 ? (
                      <div className="scrollable-incident-list">
                        {company.attemptFraudDetails.map((detail, index) => (
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
            totalItems={filteredAttemptFraudAgentCompanies.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </>
      ) : (
        <div>No attempt to fraud agents found</div>
      )}
    </div>
  );
};

export default AttemptFraudAgentCompanyScreen;
