import React, { useState, useEffect } from "react";
import { Table, Image, Form } from "react-bootstrap";
import axios from "axios";
import { compare } from "bcryptjs";

const AllMoneyLendingEntitiesScreen = () => {
  const [entities, setEntities] = useState({ companies: [], individuals: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/admin/moneyLendingEntities");
        // console.log("Fetched data:", data); // Check the structure of the data here
        if (Array.isArray(data.companies) && Array.isArray(data.individuals)) {
          setEntities(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching money lending entities:", error);
        setLoading(false);
      }
    };
    fetchEntities();
  }, []);

  if (
    !Array.isArray(entities.companies) ||
    !Array.isArray(entities.individuals)
  ) {
    return <div>No entities found</div>;
  }

  const filteredEntities = [
    ...entities.companies,
    ...entities.individuals,
  ].filter((entity) => {
    const name = entity.name ? entity.name.toLowerCase() : "";
    const id = entity._id ? entity._id.toLowerCase() : "";
    const email = entity.email ? entity.email.toLowerCase() : "";

    const cid = typeof entity.cid === "string" ? entity.cid.toLowerCase() : "";
    const number =
      typeof entity.number === "string" ? entity.number.toLowerCase() : "";
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
  return (
    <div>
      <h2>All Money Lending Entities</h2>
      
      <Form.Control
        type="text"
        placeholder="Search by name, ID, email, CID, or number"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-3 search-bar"
      />
      {loading ? (
        <div>Loading...</div>
      ) : filteredEntities.length ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Avatar</th>
              <th>Mobile Number</th>
              <th>TaxID</th>
              {/* <th>Added Time</th>
              <th>Updated Time</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredEntities.map((entity) => (
              <tr key={entity._id}>
                <td>{entity._id}</td>
                <td>{entity.name}</td>
                <td>{entity.email}</td>
                <td>{entity.role}</td>
                <td className="agent-image-container">
                  <Image
                    src={entity.avatar}
                    alt={entity.name}
                    className="agent-image"
                    rounded
                  />
                </td>
                <td>{entity.number}</td>
                <td>{entity.cid}</td>
                {/* <td>{entity.createdAt}</td>
                <td>{entity.updatedAt}</td> */}
                
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No Money Lending Entities found</div>
      )}
      <p>Total Money Lending Entities: {filteredEntities.length}</p>
    </div>
  );
};

export default AllMoneyLendingEntitiesScreen;
