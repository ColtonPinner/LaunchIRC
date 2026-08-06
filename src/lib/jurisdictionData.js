// Jurisdiction-specific links and text used by the checklist generator.
// Jurisdiction identifiers: vero_beach | sebastian | fellsmere | indian_river_county | unsure

export const UNSURE_FALLBACK =
  "Reach out to local expert Elliese Shaughnessy, elliese@launchindianriver.com or check out the [concierge services](/concierge).";

export const INSIDE_EXPERTS_INTRO =
  "Guided by your local experts: [Vitter Engineering Group, LLC](/directory#vitter-engineering-group-llc) and [Formation Interiors, LLC](/directory#formation-interiors-llc).";

// Local experts for new construction / vacant due diligence.
export const VACANT_EXPERTS = [
  { role: "Civil Engineer", company: "Vitter Engineering Group, LLC", slug: "vitter-engineering-group-llc" },
  { role: "Surveyor", company: "Your company here" },
  { role: "Architect", company: "Your company here" },
  { role: "Interior Designer", company: "Formation Interiors, LLC", slug: "formation-interiors-llc" },
  { role: "Environmental Scientist", company: "Your company here" },
  { role: "Geotechnical Engineer", company: "Your company here" },
  { role: "Traffic Engineer", company: "Your company here" },
  { role: "Landscape Architect", company: "Your company here" },
  { role: "Tree Specialist", company: "Your company here" },
  { role: "Land Use Attorney", company: "Your company here" },
];

// Returns a context object of {name, zoningMap, zoningCode, parking, utilityServiceParagraph,
// utilityContactParagraph, meetWithParagraph, preAppParagraph, preApp} for a jurisdiction,
// or null when jurisdiction is "unsure" (caller renders the fallback).
export function getJurisdictionContext(jurisdiction) {
  const ctx = {
    vero_beach: {
      name: "the City of Vero Beach",
      zoningMap: { url: "https://covb.maps.arcgis.com/apps/instant/basic/index.html?appid=37f3f6a00a0e4184b8a3e314941566bf", label: "City of Vero Beach Zoning Map" },
      zoningCode: { url: "https://library.municode.com/fl/vero_beach/codes/code_of_ordinances?nodeId=PTIIILADERE_TITVIZOOR_CH62NODI", label: "City of Vero Beach Zoning Code" },
      parking: { url: "https://library.municode.com/fl/vero_beach/codes/code_of_ordinances?nodeId=PTIIILADERE_TITVIZOOR_CH63OREPALORE_S63.04PARA", label: "City of Vero Beach Parking Requirements" },
      utilityServiceParagraph: "You will need to apply for utility service through the City of Vero Beach: [Commercial Service Application](https://www.covb.org/646/Apply-For-Service---Commercial).",
      utilityContactParagraph: "Email [wsadmin@covb.org](mailto:wsadmin@covb.org) to request as-builts of the water and sewer service available for your property. You will need an engineer to design connections if none are available. You may also need an FDEP permit, lift station, fire hydrant, or septic & drainfield (unlikely in the City). You may also need a grease trap if you are cooking food, which is handled with the Health Department.",
      preAppParagraph: "Schedule a pre-application meeting with the City of Vero Beach to see what the permitting process will look like and if they have known concerns: [planning@covb.org](mailto:planning@covb.org).",
    },
    fellsmere: {
      name: "the City of Fellsmere",
      zoningMap: { url: "https://www.cityoffellsmere.org/media/15446", label: "City of Fellsmere Zoning Map" },
      zoningCode: { url: "https://library.municode.com/fl/fellsmere/codes/land_development_code?nodeId=LADECO_ARTIIIESZODIMA_S3.5APDIRE", label: "City of Fellsmere Zoning Code" },
      parking: { url: "https://library.municode.com/fl/fellsmere/codes/land_development_code?nodeId=LADECO_ARTVIIDEST_S7.2OREPAINCIRE", label: "City of Fellsmere Parking Requirements" },
      utilityServiceParagraph: "You will need to apply for utility service through the City of Fellsmere: [Request Service](https://www.cityoffellsmere.org/publicworks-utilities/page/request-service).",
      utilityContactParagraph: "Contact [Todd Leyland](https://www.cityoffellsmere.org/comm-dev/directory-listing/robert-loring) for as-builts of the water and sewer service available for your property. You will need an engineer to design connections if none are available. You may also need an FDEP permit, lift station, fire hydrant, or septic & drainfield (unlikely in the City). You may also need a grease trap if you are cooking food, which is handled with the Health Department.",
      preAppParagraph: "Schedule a pre-application meeting with the City of Fellsmere to see what the permitting process will look like and if they have known concerns: [Robert Loring, Community Development Director](https://www.cityoffellsmere.org/comm-dev/directory-listing/robert-loring).",
    },
    sebastian: {
      name: "the City of Sebastian",
      zoningMap: { url: "https://www.arcgis.com/apps/mapviewer/index.html?webmap=ddca4e65cef745a0a73dabdca26aeb6d", label: "City of Sebastian Zoning Map" },
      zoningCode: { url: "https://library.municode.com/fl/sebastian/codes/land_development_code?nodeId=CHIIDIGERE_ARTVZODIRE", label: "City of Sebastian Zoning Code" },
      parking: { url: "https://library.municode.com/fl/sebastian/codes/land_development_code?nodeId=CHIIIPECR_ARTXVPARE_S54-3-15.2PASPREUS", label: "City of Sebastian Parking Requirements" },
      utilityServiceParagraph: "The City of Sebastian uses Indian River County for utilities. If your site isn't connected to both water and sewer, it is possible that it is now available. Depending on what the current use is and what you're proposing for the property, you might be required to connect to the utilities which can lead to large costs like line extensions, lift stations, and pipe upsizing. If you are continuing with the same business as is current with the property, you probably don't need to worry about it. Contact utilities for more information: [Indian River County Utilities](https://www.indianriver.gov/contact_us/index.php#Utilities).",
      utilityContactParagraph: "The City of Sebastian uses Indian River County for utilities. Contact [Indian River County Utilities](https://www.indianriver.gov/contact_us/index.php#Utilities) for as-builts of the water and sewer service available for your property. You will need an engineer to design connections if none are available. You may also need an FDEP permit, lift station, fire hydrant, or septic & drainfield. You may also need a grease trap if you are cooking food, which is handled with the Health Department.",
      preAppParagraph: "Schedule a pre-application meeting with the City of Sebastian to see what the permitting process will look like and if they have known concerns: [Pre-Application Meeting Request](https://www.cityofsebastian.org/DocumentCenter/View/1459).",
    },
    indian_river_county: {
      name: "Indian River County",
      zoningMap: { url: "https://www.arcgis.com/apps/mapviewer/index.html?webmap=7d25d5abdf7248b684c8fbdaad6e40f7", label: "Indian River County Zoning Map" },
      zoningCode: { url: "https://library.municode.com/fl/indian_river_county/codes/code_of_ordinances?nodeId=COORCOINRIFL_TITIXLADERE_CH911ZO_S911.03ESDI", label: "Indian River County Zoning Code" },
      parking: { url: "https://library.municode.com/fl/indian_river_county/codes/code_of_ordinances?nodeId=COORCOINRIFL_TITIXLADERE_CH954OREPA_S954.05PASTAUVE", label: "Indian River County Parking Requirements" },
      utilityServiceParagraph: "If your site isn't connected to both water and sewer, it is possible that it is now available. Depending on what the current use is and what you're proposing for the property, you might be required to connect to the utilities which can lead to large costs like line extensions, lift stations, and pipe upsizing. If you are continuing with the same business as is current with the property, you probably don't need to worry about it. Contact utilities for more information: [Indian River County Utilities](https://www.indianriver.gov/contact_us/index.php#Utilities).",
      utilityContactParagraph: "Contact [Indian River County Utilities](https://www.indianriver.gov/contact_us/index.php#Utilities) for as-builts of the water and sewer service available for your property. You will need an engineer to design connections if none are available. You may also need an FDEP permit, lift station, fire hydrant, or septic & drainfield. You may also need a grease trap if you are cooking food, which is handled with the Health Department.",
      preAppParagraph: "Schedule a pre-application meeting with Indian River County to see what the permitting process will look like and if they have known concerns. Follow the Planning Submittal Procedures and submit the [Pre-Application Form](https://indianriver.gov/Document%20Center/Services/Planning-and-Development/Planning%20Division/Pre%20Application%20Form.pdf) (or email PlanningNewSubmittal@indianriver.gov).",
    },
  };

  return ctx[jurisdiction] || null;
}