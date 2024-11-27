import * as React from "react";
import axios from "axios";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  IconButton,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { trace } from '@opentelemetry/api'; // Import OpenTelemetry API

const tracer = trace.getTracer('frontend-service'); // Initialiser le traceur

const providers = [{ id: "credentials", name: "Email and Password" }];

function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Email"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
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
      Sign In
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link href="/register" variant="body2">
      Sign up
    </Link>
  );
}

export default function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSignIn = async (provider, formData) => {
    const span = tracer.startSpan('user_sign_in'); // Démarrer une trace
    const email = formData.get("email");
    const password = formData.get("password");

    span.setAttribute('user.email', email); // Ajouter l'email comme attribut
    span.setAttribute('user.action', 'sign_in');

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", { email, password });
      const token = response.data.token;

      if (token) {
        span.setStatus({ code: 1, message: 'Login successful' }); // Statut de succès
        console.log(token);

        localStorage.setItem("jwtToken", token);

        if (email === "ayoub@gmail.com") {
          alert(`Bienvenue, administrateur !`);
          span.setAttribute('user.role', 'admin');
          navigate("/dashboard");
        } else {
          alert(`Bienvenue, utilisateur !`);
          span.setAttribute('user.role', 'user');
          navigate("/user");
        }
      }
    } catch (error) {
      span.setStatus({ code: 2, message: error.message }); // Statut d'erreur
      console.error("Erreur de connexion : ", error);
      alert("Identifiants incorrects.");
    } finally {
      span.end(); // Terminer la trace
    }
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={handleSignIn}
        slots={{
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: CustomButton,
          signUpLink: SignUpLink,
        }}
        providers={providers}
      />
    </AppProvider>
  );
}
