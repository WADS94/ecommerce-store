import MailchimpSubscribe from "react-mailchimp-subscribe";
import CalltoActionForm from "./CalltoActionForm";

const CalltoActionSection = () => {
  const MAILCHIMP_URL =
    "https://gmail.us9.list-manage.com/subscribe/post?u=d41a92c4576016a5677a2a942&amp;id=2e0ead27a2&amp;f_id=008e14e1f0";

  return (
    <MailchimpSubscribe
      url={MAILCHIMP_URL}
      render={(props) => {
        const { subscribe, status, message } = props || {};
        return (
          <CalltoActionForm
            status={status}
            message={message}
            onValidated={(formData) => subscribe(formData)}
          />
        );
      }}
    />
  );
};

export default CalltoActionSection;
