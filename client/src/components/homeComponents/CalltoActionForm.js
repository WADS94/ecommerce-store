import React from "react";

const CalltoActionForm = ({ status, message, onValidated }) => {
  let email;
  const submit = () =>
    email &&
    email.value.indexOf("@") > -1 &&
    onValidated({
      EMAIL: email.value,
    });
  return (
    <div className="subscribe-section bg-with-black">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="subscribe-head">
              <h2>Vrei sa te informezi mai bine?</h2>
              <p>
                Inregistreaza-te si primeste ultimele noutati din industrie.
              </p>
              <div className="form-section">
                {status === "sending" && (
                  <div style={{ color: "black", "font-size": "18px" }}>
                    se trimite...
                  </div>
                )}
                {status === "error" && (
                  <div
                    style={{ color: "red" }}
                    dangerouslySetInnerHTML={{ __html: message }}
                  />
                )}
                {status === "success" && (
                  <div style={{ color: "#013220", "font-size": "18px" }}>
                    Ati fost inregistrat!
                  </div>
                )}
                <input
                  placeholder="Adresa de mail..."
                  ref={(node) => (email = node)}
                  name="email"
                  type="email"
                />
                <input
                  value="Da. Doresc!"
                  name="subscribe"
                  type="submit"
                  onClick={submit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalltoActionForm;
