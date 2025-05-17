// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuthStore } from "../store/authStore";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [debugMessage, setDebugMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from state or default to home
  const from = (location.state as any)?.from?.pathname || "/";

  const { login, isLoading, error, clearError, isAuthenticated, token, user } =
    useAuthStore();

  // Add a logger for debugging auth state
  const logAuthState = () => {
    const authMessage =
      `Auth State: ${
        isAuthenticated ? "Authenticated" : "Not authenticated"
      }, ` +
      `Token: ${token ? "Present" : "Missing"}, ` +
      `User: ${user ? user.username : "None"}`;

    return authMessage;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);

    try {
      await login(username, password);

      // Check if auth state was updated properly
      const authState = logAuthState();
      setDebugMessage(authState);

      if (isAuthenticated && token && user) {
        navigate(from, { replace: true });
      } else {
        setShowDebugInfo(true);

        setTimeout(() => {
          const authState = logAuthState();
          setDebugMessage(authState);

          if (token && user) {
            navigate(from, { replace: true });
          } else {
          }
        }, 500);
      }
    } catch (err) {
      setShowError(true);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    const authState = logAuthState();

    if (isAuthenticated && token && user) {
      navigate(from, { replace: true });
    } else if (token && user && !isAuthenticated) {
      // This case handles when we have token/user but isAuthenticated flag is false
      // You can add code here to force the auth state if needed
    }
  }, [isAuthenticated, token, user, navigate, from]);

  // Clear any previous errors when unmounting
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login to Your Account
          </Typography>

          {/* Show error alert if login fails */}
          {showError && error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <Button
                  onClick={() => navigate("/register")}
                  sx={{ textTransform: "none" }}
                >
                  Register here
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Debug info toast */}
      <Snackbar
        open={showDebugInfo}
        autoHideDuration={6000}
        onClose={() => setShowDebugInfo(false)}
        message={debugMessage}
      />
    </Container>
  );
};

export default Login;
