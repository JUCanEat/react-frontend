import { useState } from "react";
import type { KcContext } from "keycloakify/login/KcContext";
import "./styles.css";

export type { KcContext };

type Props = {
    kcContext: KcContext;
};

export function KcPage({ kcContext }: Props) {
    switch (kcContext.pageId) {
        case "login.ftl":
            return <LoginPage kcContext={kcContext} />;
        case "register.ftl":
            return <RegisterPage kcContext={kcContext} />;
        case "login-reset-password.ftl":
            return <ResetPasswordPage kcContext={kcContext} />;
        case "login-update-password.ftl":
            return <UpdatePasswordPage kcContext={kcContext} />;
        case "login-verify-email.ftl":
            return <VerifyEmailPage kcContext={kcContext} />;
        case "error.ftl":
            return <ErrorPage kcContext={kcContext} />;
        default:
            return <DefaultPage kcContext={kcContext} />;
    }
}

function LoginPage({ kcContext }: { kcContext: KcContext & { pageId: "login.ftl" } }) {
    const { url, realm, social, message } = kcContext;

    return (
        <div className="page">
            <div className="card">
                <h1 className="title">Login</h1>

                {message && message.type === "error" && (
                    <div className="error">{message.summary}</div>
                )}

                <form action={url.loginAction} method="post">
                    <div className="field">
                        <label>Email</label>
                        <input
                            type="text"
                            name="username"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="field">
                        <div className="password-row">
                            <label>Password</label>
                            {realm.resetPasswordAllowed && (
                                <a className="forgot" href={url.loginResetCredentialsUrl}>
                                    Forgot your password?
                                </a>
                            )}
                        </div>
                        <input
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="login-actions">
                        <button type="submit" className="btn primary">
                            Login
                        </button>
                    </div>
                </form>

                <div className="login-secondary">
                    {social?.providers?.map(provider => (
                        <a key={provider.providerId} className="btn outline" href={provider.loginUrl}>
                            Continue with {provider.displayName}
                        </a>
                    ))}

                    {realm.registrationAllowed && (
                        <a className="btn outline signup" href={url.registrationUrl}>
                            Sign up
                        </a>
                    )}
                </div>

            </div>
        </div>
    );
}

function PasswordRequirement({ met, label }: { met: boolean; label: string }) {
    return (
        <div className={`password-req ${met ? "met" : ""}`}>
            <span className="password-req-icon">{met ? "✓" : "✗"}</span>
            {label}
        </div>
    );
}

function RegisterPage({ kcContext }: { kcContext: KcContext & { pageId: "register.ftl" } }) {
    const { url, message, profile, messagesPerField } = kcContext as any;
    const attrs = profile?.attributesByName ?? {};

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        digit: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
        match: password.length > 0 && password === confirmPassword,
    };

    const fieldError = (field: string): string | undefined =>
        messagesPerField?.existsError(field) ? messagesPerField.get(field) : undefined;

    return (
        <div className="page">
            <div className="card">
                <h1 className="title">Create Account</h1>

                {message && message.type === "error" && !messagesPerField?.existsError("general") && (
                    <div className="error">{message.summary}</div>
                )}

                <form action={url.registrationAction} method="post">
                    <div className="field">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            defaultValue={attrs.firstName?.value ?? ""}
                            required
                        />
                        {fieldError("firstName") && <div className="field-error">{fieldError("firstName")}</div>}
                    </div>

                    <div className="field">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            defaultValue={attrs.lastName?.value ?? ""}
                            required
                        />
                        {fieldError("lastName") && <div className="field-error">{fieldError("lastName")}</div>}
                    </div>

                    <div className="field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={attrs.email?.value ?? ""}
                            required
                        />
                        {fieldError("email") && <div className="field-error">{fieldError("email")}</div>}
                    </div>

                    <div className="field">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            defaultValue={attrs.username?.value ?? ""}
                            required
                        />
                        {fieldError("username") && <div className="field-error">{fieldError("username")}</div>}
                    </div>

                    <div className="field">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        {fieldError("password") && <div className="field-error">{fieldError("password")}</div>}
                        {password.length > 0 && (
                            <div className="password-requirements">
                                <PasswordRequirement met={checks.length} label="At least 8 characters" />
                                <PasswordRequirement met={checks.upper} label="At least one uppercase letter" />
                                <PasswordRequirement met={checks.digit} label="At least one digit" />
                                <PasswordRequirement met={checks.special} label="At least one special character" />
                            </div>
                        )}
                    </div>

                    <div className="field">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="password-confirm"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        {confirmPassword.length > 0 && (
                            <div className="password-requirements">
                                <PasswordRequirement met={checks.match} label="Passwords match" />
                            </div>
                        )}
                        {fieldError("password-confirm") && <div className="field-error">{fieldError("password-confirm")}</div>}
                    </div>

                    <div className="login-actions">
                        <button type="submit" className="btn primary">
                            Sign up
                        </button>
                    </div>
                </form>

                <a className="back-link" href={url.loginUrl}>
                    Back to Login
                </a>
            </div>
        </div>
    );
}

function ResetPasswordPage({ kcContext }: { kcContext: KcContext & { pageId: "login-reset-password.ftl" } }) {
    const { url, message } = kcContext;

    return (
        <div className="page">
            <div className="card">
                <h1 className="title">Reset Password</h1>

                {message && message.type === "error" && (
                    <div className="error">{message.summary}</div>
                )}

                <form action={url.loginAction} method="post">
                    <div className="field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="username"
                            placeholder="m@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="login-actions">
                        <button type="submit" className="btn primary">
                            Send Reset Link
                        </button>
                    </div>
                </form>

                <a className="back-link" href={url.loginUrl}>
                    Back to Login
                </a>
            </div>
        </div>
    );
}

function UpdatePasswordPage({ kcContext }: { kcContext: KcContext & { pageId: "login-update-password.ftl" } }) {
    const { url, message } = kcContext;

    return (
        <div className="page">
            <div className="card">
                <h1 className="title">New Password</h1>

                {message && message.type === "error" && (
                    <div className="error">{message.summary}</div>
                )}

                <form action={url.loginAction} method="post">
                    <div className="field">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="password-new"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="field">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="password-confirm"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="login-actions">
                        <button type="submit" className="btn primary">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function VerifyEmailPage({ kcContext }: { kcContext: KcContext & { pageId: "login-verify-email.ftl" } }) {
    const { url, message } = kcContext;

    return (
        <div className="page">
            <div className="card">
                <h1 className="title">Verify Email</h1>

                {message && (
                    <div className={message.type === "error" ? "error" : "error"}>
                        {message.summary}
                    </div>
                )}

                <p style={{ color: "#fff", textAlign: "center", marginBottom: "24px" }}>
                    Check your inbox and click the verification link.
                </p>

                <a className="btn primary" style={{ display: "block", textAlign: "center" }} href={url.loginAction}>
                    Resend Email
                </a>

                <a className="back-link" href={url.loginUrl}>
                    Back to Login
                </a>
            </div>
        </div>
    );
}

function ErrorPage({ kcContext }: { kcContext: KcContext & { pageId: "error.ftl" } }) {
    const { message } = kcContext;

    return (
        <div className="page">
            <div className="card">
                <h1 className="title">Error</h1>
                {message && (
                    <div className="error">{message.summary}</div>
                )}
            </div>
        </div>
    );
}

function DefaultPage({ kcContext }: { kcContext: KcContext }) {
    return (
        <div className="page">
            <div className="card">
                <h1 className="title">JuCanEat</h1>
                <p style={{ color: "#fff", textAlign: "center" }}>
                    Page: {kcContext.pageId}
                </p>
            </div>
        </div>
    );
}
