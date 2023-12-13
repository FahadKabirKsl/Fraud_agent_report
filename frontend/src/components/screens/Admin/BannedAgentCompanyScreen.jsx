import React, { useState, useEffect } from "react";
import { Table, Image, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
const BannedAgentCompanyScreen = () => {
  const [agentCompany, setAgentCompany] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAgentCompany = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/admin/agentCompanies");
        // Make sure data is an array
        if (Array.isArray(data)) {
          setAgentCompany(data);
        } else {
          setAgentCompany([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agent company data:", error);
        setLoading(false);
      }
    };
    fetchAgentCompany();
  }, []);

  const handleBanAgentCompany = async (id) => {
    try {
      await axios.put(`/api/admin/agentCompanies/${id}/ban`);
      toast.success("Agent banned successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error banning agent company:", error);
      toast.error("Error banning agent");
    }
  };

  const filteredAgentCompanies = Array.isArray(agentCompany)
    ? agentCompany.filter((company) => {
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
  return (
    <div>
      <h2>Banned Agent Companies</h2>

      <Form.Control
        type="text"
        placeholder="Search by name, ID, email, CID, or number"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-3 search-bar"
      />
      {loading ? (
        <div>Loading...</div>
      ) : filteredAgentCompanies.length ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Avatar</th>
              <th>Number</th>
              <th>TaxID</th>
              <th>Ban</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgentCompanies.map((company) => (
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
                <td>
                  <button onClick={() => handleBanAgentCompany(company._id)}>
                    Ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No Agent Companies found</div>
      )}
      <p>Total Agent Companies: {filteredAgentCompanies.length}</p>
    </div>
  );
};

export default BannedAgentCompanyScreen;
