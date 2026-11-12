import { phoneBlockHtml } from "../content/phone";

// Server-rendered "Uoink runs on your computer" block. Hidden by CSS until the
// visitor is on a phone or tablet (see app/phone.css).
export function PhoneBlock() {
  return <div className="phone-wrap" dangerouslySetInnerHTML={{ __html: phoneBlockHtml() }} />;
}
