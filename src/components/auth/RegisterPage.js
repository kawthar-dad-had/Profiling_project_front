import * as React from "react";
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

// Composant pour le champ d'email
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

// Composant pour le champ de mot de passe
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

// Composant pour le champ de prénom
function CustomFirstNameField() {
  return (
    <TextField
      label="First Name"
      name="firstName"
      type="text"
      size="small"
      required
      fullWidth
      variant="outlined"
      sx={{ my: 2 }}
    />
  );
}

// Composant pour le champ de nom
function CustomLastNameField() {
  return (
    <TextField
      label="Last Name"
      name="lastName"
      type="text"
      size="small"
      required
      fullWidth
      variant="outlined"
      sx={{ my: 2 }}
    />
  );
}

// Composant pour le champ d'âge
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

// Composant pour le bouton d'inscription
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
  const handleRegister = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    alert(
      `Registering with credentials:\nFirst Name: ${formData.get(
        "firstName"
      )}, Last Name: ${formData.get("lastName")}, Age: ${formData.get(
        "age"
      )}, Email: ${formData.get("email")}, Password: ${formData.get("password")}`
    );
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
            <CustomFirstNameField />
            <CustomLastNameField />
            <CustomAgeField />
            <CustomEmailField />
            <CustomPasswordField />
            <CustomButton />
          </form>
          {/* Lien vers la page de connexion */}
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
