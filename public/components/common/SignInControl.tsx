import "./SignInControl.scss";

import React, { useState } from "react";
import { SocialSignInButton, Form, Button, Input, Message } from "@fider/components";
import { device, actions, Failure, isCookieEnabled } from "@fider/services";
import { useFider } from "@fider/hooks";

interface SignInControlProps {
  useEmail: boolean;
  redirectTo?: string;
  onEmailSent?: (email: string) => void;
}

export const SignInControl: React.FunctionComponent<SignInControlProps> = props => {
  const fider = useFider();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<Failure | undefined>(undefined);

  const signIn = async () => {
    const result = await actions.signIn(email);
    if (result.ok) {
      setEmail("");
      setError(undefined);
      if (props.onEmailSent) {
        props.onEmailSent(email);
      }
    } else if (result.error) {
      setError(result.error);
    }
  };

  const providersLen = fider.settings.oauth.length;

  if (!isCookieEnabled()) {
    return (
      <Message type="error">
        <h3>Cookies werden benötigt</h3>
        <p>Cookies sind in Ihrem Browser nicht aktiviert. Bitte aktivieren Sie Cookies in Ihren Browsereinstellungen, um fortzufahren.</p>
      </Message>
    );
  }

  return (
    <div className="c-signin-control">
      {providersLen > 0 && (
        <div className="l-signin-social">
          <div className="row">
            {fider.settings.oauth.map((o, i) => (
              <React.Fragment key={o.provider}>
                {i % 4 === 0 && <div className="col-lf" />}
                <div
                  className={`col-sm l-provider-${o.provider} l-social-col ${
                    providersLen === 1 ? "l-social-col-100" : ""
                  }`}
                >
                  <SocialSignInButton option={o} redirectTo={props.redirectTo} />
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="info">Wir werden niemals auf dieses Konto unter deinem Namen etwas posten</p>
        </div>
      )}

      {providersLen > 0 && <div className="c-divider">OR</div>}

      {props.useEmail && (
        <div className="l-signin-email">
          <p>Gebe deine E-Mail-Adresse ein, um dich anzumelden</p>
          <Form error={error}>
            <Input
              field="email"
              value={email}
              autoFocus={!device.isTouch()}
              onChange={setEmail}
              placeholder="deinName@beispiel.com"
              suffix={
                <Button type="submit" color="positive" disabled={email === ""} onClick={signIn}>
                  Anmelden
                </Button>
              }
            />
          </Form>
        </div>
      )}
    </div>
  );
};
