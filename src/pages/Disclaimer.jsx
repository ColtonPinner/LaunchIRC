import React from "react";
import LegalLayout from "@/components/legal/LegalLayout";

export default function Disclaimer() {
  return (
    <LegalLayout title="Disclaimer" lastUpdated="July 2026">
      <p>
        The information provided by Launch Indian River on this website (the "Site") is for general informational
        purposes only. All information is provided in good faith; however, we make no representation or warranty of any
        kind regarding the accuracy, adequacy, validity, reliability, or completeness of any information on the Site.
      </p>

      <h2>Not Professional Advice</h2>
      <p>
        The checklists, guides, and other content on the Site do not constitute legal, financial, tax, engineering,
        real estate, or professional advice. You should consult with a qualified professional before making decisions
        based on information from this Site. Every business and property situation is unique, and local regulations
        may change.
      </p>

      <h2>External Links Disclaimer</h2>
      <p>
        The Site contains links to external websites (including municipal codes, GIS maps, and government resources)
        that are not provided or maintained by us. We do not guarantee the accuracy or reliability of any information
        on these third-party sites.
      </p>

      <h2>Service Directory Disclaimer</h2>
      <p>
        Listings in the directory are provided for convenience and informational purposes only. Inclusion of a
        provider does not constitute an endorsement or recommendation. Launch Indian River is not responsible for the
        quality, licensing, or performance of any listed provider.
      </p>

      <h2>"Verified by Local Experts"</h2>
      <p>
        While our content is reviewed with input from local professionals, verification does not guarantee that the
        information will apply to your specific situation or remain current. Always confirm requirements directly with
        the relevant local jurisdiction.
      </p>

      <h2>Contact Us</h2>
      <p>
        Questions about this Disclaimer? Email elliese@launchindianriver.com or call (772) 766-6533.
      </p>
    </LegalLayout>
  );
}