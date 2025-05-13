// src/pages/RegisterPage.tsx

import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Helmet } from "react-helmet-async";
import AdBanner from "../components/common/AdBanner";

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  Paper,
  Link,
  CircularProgress,
} from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, isAuthenticated, isLoading, error, clearError } =
    useAuthStore();
  const navigate = useNavigate();

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validatePasswords = (): boolean => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }

    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    try {
      await register(username, password);

      // If registration is successful, redirect to login
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (error) {
      // Error state is handled by the store
      console.error("Registration failed");
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | Askhire</title>
        <meta
          name="description"
          content="Create a new account on Askhire to post jobs or apply for opportunities."
        />
      </Helmet>

      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Create an Account
          </Typography>
        </Box>

        {/* AdSense Banner */}
        <Box sx={{ mb: 4 }}>
          <AdBanner slotId="1234567890" format="rectangle" />
        </Box>

        <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
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
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                variant="outlined"
                error={!!passwordError}
                helperText={passwordError}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox id="terms" name="terms" required color="primary" />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{" "}
                    <Link
                      component={RouterLink}
                      to="/terms-of-service"
                      color="primary"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      component={RouterLink}
                      to="/privacy-policy"
                      color="primary"
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                size="large"
              >
                {isLoading ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Creating Account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </Box>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" color="primary">
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default RegisterPage;
