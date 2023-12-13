import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Modal, Image, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../FormContainer";
import { toast } from "react-toastify";
import Loader from "../Loader";
import { useUpdateUserMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import axios from "axios";
const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState(0);
  const [cid, setCid] = useState(0);
  const [password, setPassword] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateProfile, { isLoading }] = useUpdateUserMutation();
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setNumber(userInfo.number);
    setCid(userInfo.cid);
  }, [userInfo.email, userInfo.name]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        setModalShow(true);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  const confirmUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("number", number);
      formData.append("cid", cid);
      formData.append("password", password);
      formData.append("avatar", avatar);

      const res = await axios.put("/api/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setCredentials({ ...res.data }));
      setModalShow(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      setModalShow(false);
      toast.error(err?.response?.data?.message || err.message);
    }
  };
  return (
    <div>
      <h1>Update Profile</h1>
      <Row className="align-items-center justify-content-center">
        <Col md={6}>
          <Card className="no-border">
            <Card.Img variant="top" src={userInfo.avatar} className="avatar" />
            <Card.Body>
              <Card.Title>Name: {name}</Card.Title>
              <Card.Text>Email: {email}</Card.Text>
              <Card.Text>Mobile Number: {number}</Card.Text>
              <Card.Text>TaxID: {cid}</Card.Text>
              <Card.Text>Role: {userInfo.role}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="border-left">
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="name"
                  className="form-control-custom"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </Form.Group>
            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="email"
                  className="form-control-custom"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </Form.Group>
            <Form.Group className="my-2" controlId="number">
              <Form.Label>Number</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="number"
                  className="form-control-custom"
                  placeholder="Enter number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
            </Form.Group>
            <Form.Group className="my-2" controlId="cid">
              <Form.Label>TaxID</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="cid"
                  className="form-control-custom"
                  placeholder="Enter cid"
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                />
              </div>
            </Form.Group>
            <Form.Group className="my-2" controlId="avatar">
              <Form.Label>Avatar (Image)</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="file"
                  className="form-control-custom"
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
              </div>
            </Form.Group>
            <Form.Group className="my-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="password"
                  className="form-control-custom"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </Form.Group>
            <Form.Group className="my-2" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="password"
                  className="form-control-custom"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </Form.Group>
            {isLoading && <Loader />}
            <Button type="submit" variant="primary" className="mt-3">
              Update
            </Button>
          </Form>
        </Col>
      </Row>
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Password Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Please enter your password for confirmation</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={modalPassword}
              onChange={(e) => setModalPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              confirmUpdate();
              setModalShow(false);
            }}
          >
            Confirm Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileScreen;
