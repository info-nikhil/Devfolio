import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [mode, setMode] = useState("login");
  const [pendingEmail, setPendingEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    userType: "student"
  });
  const [verifyOtp, setVerifyOtp] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetForm, setResetForm] = useState({
    email: "",
    otp: "",
    newPassword: ""
  });

  const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  function handlePostLogin(user) {
    if (user.role === "admin") {
      navigate("/admin");
      return;
    }
    navigate("/dashboard");
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await auth.login(loginForm.email, loginForm.password);
      handlePostLogin(data.user);
    } catch (error) {
      const responseData = error.response?.data || {};
      if (responseData.requiresVerification) {
        setPendingEmail(responseData.email || loginForm.email);
        setMode("verify");
      }
      setMessage(responseData.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await auth.register(signupForm);
      setPendingEmail(data.email || signupForm.email);
      setMode("verify");
      setMessage(data.message || "Registration complete, verify your email");
    } catch (error) {
      const responseData = error.response?.data || {};
      if (responseData.requiresVerification) {
        setPendingEmail(responseData.email || signupForm.email);
        setMode("verify");
      }
      setMessage(responseData.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifySubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await auth.verifyEmail(pendingEmail, verifyOtp);
      handlePostLogin(data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setLoading(true);
    setMessage("");
    try {
      const data = await auth.resendVerification(pendingEmail);
      setMessage(data.message || "OTP sent");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await auth.forgotPassword(forgotEmail);
      setResetForm({ ...resetForm, email: forgotEmail });
      setMode("reset");
      setMessage(data.message || "OTP sent for password reset");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await auth.resetPassword(resetForm.email, resetForm.otp, resetForm.newPassword);
      setMode("login");
      setMessage(data.message || "Password reset successful");
    } catch (error) {
      setMessage(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(googleResponse) {
    setLoading(true);
    setMessage("");
    try {
      const data = await auth.googleLogin(googleResponse.credential);
      handlePostLogin(data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="content-wrap auth-wrap">
      <div className="panel auth-panel">
        <h1>
          {mode === "login" && "Login"}
          {mode === "signup" && "Create Account"}
          {mode === "verify" && "Verify Email"}
          {mode === "forgot" && "Forgot Password"}
          {mode === "reset" && "Reset Password"}
        </h1>

        {mode === "login" && (
          <form className="form-grid" onSubmit={handleLoginSubmit}>
            <label>
              Email
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              />
            </label>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>
        )}

        {mode === "signup" && (
          <form className="form-grid" onSubmit={handleSignupSubmit}>
            <label>
              Name
              <input
                type="text"
                required
                value={signupForm.name}
                onChange={(event) => setSignupForm({ ...signupForm, name: event.target.value })}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                value={signupForm.email}
                onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                required
                value={signupForm.password}
                onChange={(event) => setSignupForm({ ...signupForm, password: event.target.value })}
              />
            </label>
            <label>
              Account Type
              <select
                value={signupForm.userType}
                onChange={(event) => setSignupForm({ ...signupForm, userType: event.target.value })}
              >
                <option value="student">Student</option>
                <option value="professional">Professional</option>
              </select>
            </label>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Please wait..." : "Sign Up"}
            </button>
          </form>
        )}

        {mode === "verify" && (
          <form className="form-grid" onSubmit={handleVerifySubmit}>
            <label>
              Email
              <input type="email" value={pendingEmail} readOnly />
            </label>
            <label>
              OTP
              <input type="text" required value={verifyOtp} onChange={(event) => setVerifyOtp(event.target.value)} />
            </label>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </button>
            <button type="button" className="btn btn-outline" disabled={loading} onClick={handleResendOtp}>
              Resend OTP
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form className="form-grid" onSubmit={handleForgotSubmit}>
            <label>
              Email
              <input type="email" required value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} />
            </label>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset OTP"}
            </button>
          </form>
        )}

        {mode === "reset" && (
          <form className="form-grid" onSubmit={handleResetSubmit}>
            <label>
              Email
              <input
                type="email"
                required
                value={resetForm.email}
                onChange={(event) => setResetForm({ ...resetForm, email: event.target.value })}
              />
            </label>
            <label>
              OTP
              <input
                type="text"
                required
                value={resetForm.otp}
                onChange={(event) => setResetForm({ ...resetForm, otp: event.target.value })}
              />
            </label>
            <label>
              New Password
              <input
                type="password"
                required
                value={resetForm.newPassword}
                onChange={(event) => setResetForm({ ...resetForm, newPassword: event.target.value })}
              />
            </label>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {googleEnabled && (mode === "login" || mode === "signup") && (
          <div className="google-wrap">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setMessage("Google login failed")} />
          </div>
        )}

        <div className="auth-switch">
          {(mode === "login" || mode === "signup") && (
            <>
              <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
                {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
              </button>
              <button type="button" onClick={() => setMode("forgot")}>
                Forgot password?
              </button>
            </>
          )}
          {(mode === "verify" || mode === "forgot" || mode === "reset") && (
            <button type="button" onClick={() => setMode("login")}>
              Back to Login
            </button>
          )}
        </div>

        {message && <p className="status-text">{message}</p>}
      </div>
    </div>
  );
}

export default AuthPage;
