import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePublicConfig } from "../context/PublicConfigContext";

const modeMeta = {
  login: {
    kicker: "Welcome back",
    title: "Sign in to your creative workspace",
    text: "Pick up where you left off, manage your portfolio, and keep iterating without losing momentum."
  },
  signup: {
    kicker: "Create account",
    title: "Open your portfolio studio",
    text: "Start with your core profile, choose your direction, and shape the final experience inside the builder."
  },
  verify: {
    kicker: "Email verification",
    title: "Confirm your account",
    text: "Enter the OTP sent to your inbox so we can unlock the dashboard and protected builder routes."
  },
  forgot: {
    kicker: "Password recovery",
    title: "Request a reset OTP",
    text: "We will send a temporary code to your email so you can set a new password locally."
  },
  reset: {
    kicker: "Reset password",
    title: "Create a fresh password",
    text: "Use the OTP from your email and set a new password for this account."
  }
};

function AuthPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { googleClientId, loading: publicConfigLoading } = usePublicConfig();
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
  const [resetForm, setResetForm] = useState({ email: "", otp: "", newPassword: "" });

  const googleEnabled = Boolean(googleClientId);
  const currentMode = modeMeta[mode];

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
      setMessage(data.message || "Registration complete. Verify your email to continue.");
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
      setResetForm((current) => ({ ...current, email: forgotEmail }));
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
    <div className="auth-page">
      <div className="content-wrap auth-shell">
        <section className="auth-visual glass-card">
          <p className="kicker">{currentMode.kicker}</p>
          <h1>{currentMode.title}</h1>
          <p>{currentMode.text}</p>

          <div className="auth-metrics">
            <div className="auth-metric-card">
              <strong>Realtime</strong>
              <span>Preview, code editor, and builder data stay aligned.</span>
            </div>
            <div className="auth-metric-card">
              <strong>Structured</strong>
              <span>Use email OTP, password reset, or Google sign in when configured locally.</span>
            </div>
            <div className="auth-metric-card">
              <strong>Flexible</strong>
              <span>Student and professional account types flow into admin analytics automatically.</span>
            </div>
          </div>
        </section>

        <section className="auth-card glass-card">
          <div className="auth-card-top">
            <div>
              <p className="kicker">Access</p>
              <h2>{mode === "signup" ? "Create account" : currentMode.title}</h2>
            </div>
            {(mode === "login" || mode === "signup") && (
              <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
                <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
                  Login
                </button>
                <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {mode === "login" && (
            <form className="form-grid" onSubmit={handleLoginSubmit}>
              <label>
                Email
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                />
              </label>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
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
                  placeholder="Your full name"
                  value={signupForm.name}
                  onChange={(event) => setSignupForm({ ...signupForm, name: event.target.value })}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={signupForm.email}
                  onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  required
                  placeholder="Choose a strong password"
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
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
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
                <input type="text" required placeholder="Enter OTP" value={verifyOtp} onChange={(event) => setVerifyOtp(event.target.value)} />
              </label>
              <div className="action-stack-row">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Email"}
                </button>
                <button type="button" className="btn btn-ghost" disabled={loading} onClick={handleResendOtp}>
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {mode === "forgot" && (
            <form className="form-grid" onSubmit={handleForgotSubmit}>
              <label>
                Email
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(event) => setForgotEmail(event.target.value)}
                />
              </label>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
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
                  placeholder="Reset OTP"
                  value={resetForm.otp}
                  onChange={(event) => setResetForm({ ...resetForm, otp: event.target.value })}
                />
              </label>
              <label>
                New Password
                <input
                  type="password"
                  required
                  placeholder="New password"
                  value={resetForm.newPassword}
                  onChange={(event) => setResetForm({ ...resetForm, newPassword: event.target.value })}
                />
              </label>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          )}

          {(mode === "login" || mode === "signup") && (
            <div className="auth-provider-block">
              <div className="provider-divider">
                <span>Continue with</span>
              </div>
              {googleEnabled ? (
                <div className="google-wrap">
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setMessage("Google login failed")} />
                </div>
              ) : publicConfigLoading ? (
                <div className="dev-note-card">Loading sign-in providers...</div>
              ) : (
                <div className="dev-note-card">
                  Google sign in is unavailable until the backend is configured with <code>GOOGLE_CLIENT_ID</code>.
                </div>
              )}
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

          {message && <p className="status-banner">{message}</p>}
        </section>
      </div>
    </div>
  );
}

export default AuthPage;
