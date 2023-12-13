import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineKey,
} from "react-icons/ai";
// import FormContainer from "../FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../Loader";
import Reg from "../../assets/images/registration.jpg";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("agentCompany");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/profile");
    }
  }, [navigate, userInfo]);
  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ name, email, password, role }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/profile");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Container className="mt-5">
        <h1>Register</h1>
        <Row className="align-items-center justify-content-center">
          <Col md={6}>
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <div className="input-group">
                  <Form.Control
                    className="form-control-custom"
                    type="text"
                    placeholder="Enter your name"
                    aria-label="Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="input-group-text-custom">
                    <AiOutlineUser />
                  </div>
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="email"
                    className="form-control-custom"
                    placeholder="Enter email"
                    aria-label="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="input-group-text-custom">
                    <AiOutlineMail />
                  </div>
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  className="form-select-custom"
                  aria-label="Role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="msbCompany">MSB Company</option>
                  <option value="msbIndividual">
                    MSB Individual
                  </option>
                  <option value="agentCompany">Agent Company</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="Agent Company">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="password"
                    className="form-control-custom"
                    placeholder="Password"
                    aria-label="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="input-group-text-custom">
                    <AiOutlineLock />
                  </div>
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="password"
                    className="form-control-custom"
                    placeholder="Confirm Password"
                    aria-label="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="input-group-text-custom">
                    <AiOutlineKey />
                  </div>
                </div>
              </Form.Group>
              {isLoading && <Loader />}
              <div className="d-grid gap-2">
                <Button variant="primary" type="submit">
                  Register
                </Button>
              </div>
            </Form>
            <Col className="mt-3">
              Already have an account?{" "}
              <Link to={`/login`} className="link">
                <span className="text">Login</span>
              </Link>
            </Col>
          </Col>
          <Col md={6}>
            <img src={Reg} alt="registration-vector" className="vector" />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegisterScreen;
