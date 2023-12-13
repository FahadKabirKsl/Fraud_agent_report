import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";
import Loader from "../../Loader";
import axios from "axios";
import { useAddAgentMutation } from "../../../slices/agentCompanyApiSlice";

const AddAgentScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nid, setNid] = useState(0);
  const [number, setNumber] = useState(0);
  const [address, setAddress] = useState("");
  const [agentAvatar, setAgentAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("nid", nid);
    formData.append("number", number);
    formData.append("address", address);
    if (agentAvatar) {
      formData.append("agentAvatar", agentAvatar, agentAvatar.name);
    }

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "/api/agents/add-agent",
        formData,
        config
      );

      if (response.status === 201) {
        toast.success("Agent added successfully");

        setName("");
        setEmail("");
        setNid(0);
        setNumber(0);
        setAddress("");
        setAgentAvatar(null);
      
      } else {
        const errorMessage = response.data.message;
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <>
        <h1 className="text-center my-5">Add agent</h1>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="email"
                    className="form-control-custom"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="nid">
                <Form.Label>EIN Number</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="number"
                    className="form-control-custom"
                    placeholder="Enter NID"
                    value={nid}
                    onChange={(e) => setNid(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="number">
                <Form.Label>Number</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    className="form-control-custom"
                    placeholder="Enter number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="agentAvatar">
                <Form.Label>Avatar (Image)</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="file"
                    className="form-control-custom"
                    onChange={(e) => setAgentAvatar(e.target.files[0])}
                    required
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <div className="input-group">
                  <Form.Control
                    as="textarea"
                    rows={7}
                    // className="form-control-custom"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" variant="primary" className="my-3">
            {loading ? <Loader /> : "Submit"}
          </Button>
        </Form>
      </>
    </>
  );
};

export default AddAgentScreen;
