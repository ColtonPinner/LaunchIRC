// Builders for the detailed guidance "cards" shown in the generated checklist.
// Each builder returns a single guidance item (or array) consumed by GuidanceCard.
import { getJurisdictionContext, UNSURE_FALLBACK, INSIDE_EXPERTS_INTRO, PLACEHOLDER_EXPERTS_INTRO, VACANT_EXPERTS } from "@/lib/jurisdictionData";

const ADA_PARKING_LINK = "https://www.ada.gov/topics/parking/";
const FEMA_LINK = "https://msc.fema.gov/portal/home";
const MGO_REGISTER = "https://www.mygovernmentonline.org";

const ADA_INDOOR_TEXT =
  "For ADA compliance, there needs to be a certain number of parking spots, pathways with the correct slopes and entrance/exits. For parking information: https://www.ada.gov/topics/parking/. Sidewalks for ADA route must be 5% max running slope and 2% max cross slope. For indoor compliance such as correct width of pathways, mirror height, and bathroom requirements, contact local expert Veronica Landau with Formation Interiors, LLC at veronica@formation-interiors.com.";

// --- Business structure guide ---
export function buildStructureGuide() {
  return {
    id: "guid_structure",
    phase: "Planning & Legal Setup",
    type: "guidance",
    title: "Choosing a Business Structure in Florida",
    guidance_paragraphs: [
      PLACEHOLDER_EXPERTS_INTRO,
      "There are several corporate types in Florida: sole proprietorship, LLC, corporation (C/S), partnership, general partnership, and limited partnership.",
      "It is best to discuss with an accountant to see what is best for tax benefits. An attorney will help you file the necessary paperwork if needed.",
    ],
    links: [
      { url: "https://dos.fl.gov/sunbiz/start-business/corporate-structure/", label: "FL Division of Corporations — Corporate Structure Guide" },
      { url: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure", label: "SBA — Choose a Business Structure" },
    ],
    localExperts: [
      { role: "Accountant", company: "Your Company" },
      { role: "Lawyer", company: "Your Company" },
    ],
    category: "legal",
  };
}

// --- Financing guide ---
export function buildFinancingGuide(survey) {
  const paragraphs = [
    PLACEHOLDER_EXPERTS_INTRO,
    "There are several different options including SBA loans, traditional bank loans, business loans, equipment financing, business line of credit, and self-funding or fundraising.",
    "Each has its own pros and cons with how much down payment is required, the effort required (paperwork, business plan, profit projections), and how long the application process takes.",
    "How much you can invest and how well you can prove the business will succeed will determine which type of loan is most beneficial.",
    "The Small Business Development Center (SBDC) has great resources to help create a business plan.",
  ];
  if (survey.funding_needs === "actively_applying") {
    paragraphs.push("If you would like help with a specific type of loan, contact us and we'll connect you with the right local lender.");
  }
  return {
    id: "guid_financing",
    phase: "Financing & Funding",
    type: "guidance",
    title: "Financing Options — What's Available",
    guidance_paragraphs: paragraphs,
    links: [
      { url: "https://floridasbdc.org/find/irsc/", label: "IRSC Florida SBDC — Free Business Mentoring" },
      { url: "https://www.sba.gov/funding-programs/loans", label: "SBA Loan Programs" },
    ],
    category: "financial",
  };
}

// --- Due diligence: existing developed property ---
export function buildDueDiligenceExisting(survey) {
  const ctx = getJurisdictionContext(survey.jurisdiction);
  const paragraphs = [INSIDE_EXPERTS_INTRO];

  const numberedLinks = [];

  // 1. Check the zoning
  if (ctx) {
    paragraphs.push(`1. Check the zoning: [${ctx.zoningMap.label}](${ctx.zoningMap.url})`);
    numberedLinks.push(ctx.zoningMap);
  } else {
    paragraphs.push(`1. Check the zoning. ${UNSURE_FALLBACK}`);
  }

  // 2. Read the zoning code for change of use
  if (ctx) {
    paragraphs.push(`2. Read the zoning code to determine what uses are allowed if you are changing the use of the existing property: [${ctx.zoningCode.label}](${ctx.zoningCode.url})`);
    numberedLinks.push(ctx.zoningCode);
  } else {
    paragraphs.push(`2. Read the zoning code to determine what uses are allowed. ${UNSURE_FALLBACK}`);
  }

  // 3. Parking
  if (ctx) {
    paragraphs.push(`3. Check that you have enough parking: [${ctx.parking.label}](${ctx.parking.url})`);
    numberedLinks.push(ctx.parking);
  } else {
    paragraphs.push(`3. Check that you have enough parking. ${UNSURE_FALLBACK}`);
  }

  // 4. ADA
  paragraphs.push(`4. It is possible that your building isn't up to code with ADA compliance. ${ADA_INDOOR_TEXT}`);
  numberedLinks.push({ url: ADA_PARKING_LINK, label: "ADA — Parking" });

  // 5. Utility service
  if (ctx) {
    paragraphs.push(`5. ${ctx.utilityServiceParagraph}`);
  } else {
    paragraphs.push(`5. ${UNSURE_FALLBACK}`);
  }

  // 6. Meet with jurisdiction (omit when unsure)
  if (ctx) {
    paragraphs.push(`6. It is recommended to meet with ${ctx.name} to discuss the change of use of the property. You may need to add parking, add more water supply, change access to the building, etc.`);
  }

  return {
    id: "dd_existing",
    phase: "Due Diligence",
    type: "guidance",
    title: "Due Diligence Checklist for Existing Properties",
    guidance_paragraphs: paragraphs,
    links: numberedLinks,
    contactInfo: {
      phone: "772-766-6533",
      email: "elliese@launchindianriver.com",
      website: "https://vitterengineeringgroup.com",
    },
    category: "property",
  };
}

// --- Due diligence: vacant property / new construction ---
export function buildDueDiligenceVacant(survey, { withCaveat } = {}) {
  const ctx = getJurisdictionContext(survey.jurisdiction);
  const paragraphs = [INSIDE_EXPERTS_INTRO];
  const numberedLinks = [];

  if (withCaveat) {
    paragraphs.push("Major renovation should be treated as new development, so the full due diligence checklist is provided below.");
  }

  // 1. Experts to hire
  paragraphs.push(
    "1. If you are building on vacant property, you will need the following experts to design and permit your project:"
  );

  // 2. Zoning
  if (ctx) {
    paragraphs.push(`2. Check the zoning: [${ctx.zoningMap.label}](${ctx.zoningMap.url})`);
    numberedLinks.push(ctx.zoningMap);
  } else {
    paragraphs.push(`2. Check the zoning. ${UNSURE_FALLBACK}`);
  }

  // 3. Zoning code
  if (ctx) {
    paragraphs.push(`3. Read the zoning code to determine what uses are allowed: [${ctx.zoningCode.label}](${ctx.zoningCode.url})`);
    numberedLinks.push(ctx.zoningCode);
  } else {
    paragraphs.push(`3. Read the zoning code to determine what uses are allowed. ${UNSURE_FALLBACK}`);
  }

  // 4. Parking
  if (ctx) {
    paragraphs.push(`4. Check to see how much parking you need: [${ctx.parking.label}](${ctx.parking.url})`);
    numberedLinks.push(ctx.parking);
  } else {
    paragraphs.push(`4. Check to see how much parking you need. ${UNSURE_FALLBACK}`);
  }

  // 5. ADA
  paragraphs.push(`5. ${ADA_INDOOR_TEXT}`);
  numberedLinks.push({ url: ADA_PARKING_LINK, label: "ADA — Parking" });

  // 6. Utilities as-builts
  if (ctx) {
    paragraphs.push(`6. ${ctx.utilityContactParagraph}`);
    numberedLinks.push({ url: "https://www.indianriver.gov/contact_us/index.php#Utilities", label: "IRC Utilities Contact" });
  } else {
    paragraphs.push(`6. ${UNSURE_FALLBACK}`);
  }

  // 7. Stormwater / floodzone
  paragraphs.push(
    `7. You are required to follow the St. Johns River Water Management District nutrient-reducing calculations. For due diligence, it is highly recommended to hire an engineer to perform a preliminary calculation to see how much land you need to set aside for a stormwater pond — it can be anywhere from 20% to 40% of the project site. You will also need to see if the proposed site is within a FEMA floodzone: https://msc.fema.gov/portal/home. In most parts of the County you will also deal with a local water management district such as Indian River Farms or the Sebastian River Improvement District. A geotechnical engineer will need to perform borings and other soil tests to help determine water table elevations and percolation rates. The sooner you can hire a geotechnical engineer, the better.`
  );
  numberedLinks.push({ url: FEMA_LINK, label: "FEMA Flood Map" });

  // 8. Trees
  paragraphs.push(
    "8. You will be required to mitigate trees. For a preliminary stage, walk your site to see if there are any large trees that might be affected. You will eventually need a tree survey to have mitigation fees calculated. If several trees may need removal, it's recommended to hire an arborist to assess tree health — unhealthy trees may be removed without mitigation."
  );

  // 9. Surveyor
  paragraphs.push(
    "9. You will need to hire a surveyor to provide a boundary survey and topographical survey within a year of your anticipated site plan application. Have them also survey for trees and pipe inverts for both sewer manholes and storm pipes. The survey will show any easements on your property that you cannot build on."
  );

  // 10. Due diligence period
  paragraphs.push(
    "10. Negotiate a long due diligence period with the seller so you have adequate time to pull this data together — we recommend at least 60 days. An experienced commercial broker can help."
  );

  // 11. Pre-application meeting
  if (ctx) {
    paragraphs.push(`11. ${ctx.preAppParagraph}`);
  } else {
    paragraphs.push(`11. ${UNSURE_FALLBACK}`);
  }

  // 12. Timeline
  paragraphs.push(
    "12. Be aware that permitting can take anywhere from 6 months to 2 years, and construction 9 months to a year or more depending on project complexity. Consult with your civil engineer, who should be able to give you an estimated timeline."
  );

  return {
    id: "dd_vacant",
    phase: "Due Diligence",
    type: "guidance",
    title: "Due Diligence Checklist for Vacant Properties",
    guidance_paragraphs: paragraphs,
    links: numberedLinks,
    localExperts: VACANT_EXPERTS,
    contactInfo: {
      phone: "772-766-6533",
      email: "elliese@launchindianriver.com",
      website: "https://vitterengineeringgroup.com",
    },
    category: "property",
  };
}

// --- Interior guide ---
export function buildInteriorGuide() {
  return {
    id: "guid_interior",
    phase: "Construction & Build-Out",
    type: "guidance",
    title: "Interior Build-Out — What You Should Know",
    guidance_paragraphs: [
      PLACEHOLDER_EXPERTS_INTRO,
      ADA_INDOOR_TEXT,
      "Depending on whether you are adding walls, plumbing, or a kitchen, you may need a building permit. It is recommended to talk with an interior designer to understand the ADA compliance requirements for your space and to produce permit-ready construction documents.",
    ],
    contactInfo: {
      email: "veronica@formation-interiors.com",
    },
    category: "codes",
  };
}

// --- Not-sure construction card ---
export function buildNotSureConstructionCard() {
  return {
    id: "guid_construction_not_sure",
    phase: "Construction & Build-Out",
    type: "guidance",
    title: "Not Sure About Construction?",
    guidance_paragraphs: [
      "If you're not sure whether you'll need construction or renovations, reach out to a local expert to walk through the property with you.",
      `Contact local expert Elliese Shaughnessy, elliese@launchindianriver.com, or check out the [concierge services](/concierge).`,
    ],
    contactInfo: {
      phone: "772-766-6533",
      email: "elliese@launchindianriver.com",
      website: "https://vitterengineeringgroup.com",
    },
    category: "codes",
  };
}

// --- Permitting guide (jurisdiction + construction level specific) ---
export function buildPermittingGuide(survey) {
  const ctx = getJurisdictionContext(survey.jurisdiction);
  const level = survey.needs_construction;
  const j = survey.jurisdiction;
  const paragraphs = [];
  const links = [];

  const minor = level === "minor";
  const majorOrNew = level === "major_renovation" || level === "new_construction";

  paragraphs.push(PLACEHOLDER_EXPERTS_INTRO);

  if (minor) {
    if (j === "vero_beach") {
      paragraphs.push(
        `1. If you are changing any plumbing, electric, or structural inside of the building, you will most likely need a building permit through Indian River County. Everything is done online through MyGovernmentOnline — [register here](${MGO_REGISTER}) and [sign in to apply](${MGO_REGISTER}). You will most likely be applying for the "Various Trades Commercial" permit. Most likely your contractor will apply for you, but if you plan to do the work yourself, you will need to apply.`
      );
      paragraphs.push(
        "2. If you are installing anything outside of the building (shed, posts for a sunshade, fence, etc.), you will need a Code Compliance permit through the City of Vero Beach."
      );
      paragraphs.push(
        "3. Be aware: if you are changing the use of the property (i.e. it's an office now but you want a restaurant), you will need a code compliance permit. It could trigger other site requirements such as more parking, needing a grease trap, or more fire protection."
      );
    } else if (j === "sebastian") {
      paragraphs.push(
        `1. If you are changing any plumbing, electric, or structural inside of the building, you will most likely need a building permit through the City of Sebastian Building Department. Everything is done online through MyGovernmentOnline — [register here](${MGO_REGISTER}) and [sign in to apply](${MGO_REGISTER}). There are several specific permits available. Most likely your contractor will apply, but if you plan to do the work yourself, you will need to apply.`
      );
      paragraphs.push(
        "2. Through the City of Sebastian Community Development Department, you will most likely need a Site Plan (administrative approval) application. If you plan to change anything outside the building — such as rearranging parking, adding an ADA ramp, or moving fencing — check the Site Plan (minor modification) option in that same application."
      );
      paragraphs.push(
        "3. Be aware: if you are changing the use of the property, you will need a site plan permit. It could trigger other site requirements such as more parking, needing a grease trap, or more fire protection."
      );
    } else if (j === "fellsmere") {
      paragraphs.push(
        "1. You will most likely need a building permit through the City of Fellsmere Building Department. They have helpful documents on when a permit is required, what work you can do yourself versus when you need a contractor, and what inspections are needed. Assume you'll need a permit. Most likely your contractor will apply, but if you're doing the work yourself, fill out the forms and send them to permits@cityoffellsmere.org."
      );
      paragraphs.push(
        "2. Most likely, you will need an Application for Site Plan Amendment through the City of Fellsmere's Planning and Zoning Division."
      );
    } else if (j === "indian_river_county") {
      paragraphs.push(
        `1. If you are changing any plumbing, electric, or structural inside of the building, you will most likely need a building permit through Indian River County. Everything is done online through MyGovernmentOnline — [register here](${MGO_REGISTER}) and [sign in to apply](${MGO_REGISTER}). You will most likely be applying for the "Various Trades Commercial" permit. Most likely your contractor will apply for you, but if you plan to do the work yourself, you will need to apply.`
      );
      paragraphs.push(
        "2. If you are installing anything outside of the building (shed, posts for a sunshade, fence, etc.), you will need a Site Plan (Administrative Approval) permit through Indian River County Planning Division."
      );
      paragraphs.push(
        "3. Be aware: if you are changing the use of the property, you will need to apply for an Administrative Approval application. It could trigger other site requirements such as more parking, needing a grease trap, or more fire protection."
      );
    } else {
      paragraphs.push(`If you know which jurisdiction your property is in, the steps above are tailored to that city/county. ${UNSURE_FALLBACK}`);
    }
  }

  if (majorOrNew) {
    // 1. Pre-application meeting
    if (ctx) {
      paragraphs.push(`1. If you haven't already had a pre-application, schedule one now: ${ctx.preAppParagraph.replace(/^Schedule a pre-application meeting with [^ ]+ to see what the permitting process will look like and if they have known concerns. /, "")}`);
    } else {
      paragraphs.push(`1. ${UNSURE_FALLBACK}`);
    }

    // 2. Experts to hire
    paragraphs.push(
      "2. You need to hire the professional experts if you haven't already — civil engineer, surveyor, landscape architect, and architect. You will also need the environmental assessment and geotechnical report; your civil engineer should interpret both reports to ensure compliance. If your site has many trees, get a tree survey done to assess tree health and offset mitigation costs. For a large project you will most likely need a traffic engineer to assess traffic impacts and any roadway improvements such as a right-turn lane or traffic signal."
    );

    // 3. Site plan
    paragraphs.push(
      "3. Your civil engineer will design a site plan consisting of a building footprint, parking, buffers, setbacks, driveways, and open space. Have a solid idea of the building size and dimensions you want so the civil engineer can start construction drawings soon after the site plan is approved."
    );

    // 4. Building design
    paragraphs.push("4. At the same time, you should also be designing your building with an architect.");

    // 5. Construction drawings
    paragraphs.push(
      "5. Once you are satisfied with the site plan design, the civil engineer will start the construction drawings to get them permitted. The set typically includes a demolition plan, stormwater pollution prevention plan, site plan, grading & drainage plan, and utility plan — and may include offsite improvements, fire truck routing, or lift station design drawings."
    );

    // 6. Landscape
    paragraphs.push(
      "6. During this design, a landscape architect should also design the landscape plans (specific plantings per jurisdictional code). These plans are usually attached to the civil engineering plans for permitting."
    );
  }

  // Universal permit-application links
  if (minor || majorOrNew) {
    links.push({ url: MGO_REGISTER, label: "MyGovernmentOnline — Building Permits (IRC / Sebastian / Vero Beach)" });
  }

  return {
    id: "guid_permitting",
    phase: "Construction & Build-Out",
    type: "guidance",
    title: "Permitting Guide",
    guidance_paragraphs: paragraphs,
    links,
    localExperts: majorOrNew ? VACANT_EXPERTS : undefined,
    contactInfo: {
      phone: "772-766-6533",
      email: "elliese@launchindianriver.com",
      website: "https://vitterengineeringgroup.com",
    },
    category: "codes",
  };
}