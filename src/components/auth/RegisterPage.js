import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { trace } from "@opentelemetry/api"; // Import OpenTelemetry API

const tracer = trace.getTracer("frontend-service"); // Initialiser le traceur

function CustomEmailField() {
  return (
    <TextField
      label="Email"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      variant="outlined"
      sx={{ my: 2 }}
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        Password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        name="password"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

function CustomNameField() {
  return (
    <TextField
      label="Full Name"
      name="name"
      type="text"
      size="small"
      required
      fullWidth
      variant="outlined"
      sx={{ my: 2 }}
    />
  );
}

function CustomAgeField() {
  return (
    <TextField
      label="Age"
      name="age"
      type="number"
      size="small"
      required
      fullWidth
      variant="outlined"
      sx={{ my: 2 }}
    />
  );
}

function CustomButton() {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Register
    </Button>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleRegister = async (event) => {
    const span = tracer.startSpan("user_register"); // Démarrer une trace
    event.preventDefault();

    const formData = new FormData(event.target);
    const user = {
      name: formData.get("name"),
      age: formData.get("age"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    span.setAttribute("user.email", user.email); // Ajouter des attributs personnalisés
    span.setAttribute("user.age", user.age);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        user
      );

      span.setStatus({ code: 1, message: "Registration successful" }); // Statut de succès

      alert("User registered successfully!");
      navigate("/"); // Rediriger vers la page de connexion
    } catch (err) {
      span.setStatus({ code: 2, message: err.message }); // Statut d'erreur
      setError(err.response ? err.response.data : "Unknown error");
      console.error("Registration error", err);
    } finally {
      span.end(); // Terminer la trace
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Card sx={{ maxWidth: 400, boxShadow: 3, padding: 3 }}>
        <CardContent>
          <h2 style={{ textAlign: "center" }}>Register</h2>
          <form onSubmit={handleRegister}>
            <CustomNameField />
            <CustomAgeField />
            <CustomEmailField />
            <CustomPasswordField />
            <CustomButton />
          </form>
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          <Link
            href="/"
            variant="body2"
            sx={{ mt: 2, display: "block", textAlign: "center" }}
          >
            Already have an account? Sign In
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
