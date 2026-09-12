// Generates a personalized checklist based on survey answers.
// Detailed due-diligence / permitting / interior / financing / structure content
// lives in checklistSections.js; this file decides which sections and action
// items apply based on the user's stage, property, and construction answers.
import {
  buildStructureGuide,
  buildFinancingGuide,
  buildDueDiligenceExisting,
  buildDueDiligenceVacant,
  buildInteriorGuide,
  buildPermittingGuide,
  buildNotSureConstructionCard,
} from "@/lib/checklistSections";

const EARLY = ["exploring_idea", "actively_planning", "looking_for_property"];
const PLANNING = [...EARLY, "under_contract"]; // still setting up the business

export function generateChecklist(survey) {
  const checklist = [];
  const isPremium = survey.plan_type === "premium";
  const stage = survey.business_stage;
  const construction = survey.needs_construction;

  const isEarly = EARLY.includes(stage);
  const isPlanning = PLANNING.includes(stage);
  const isAlreadyOpen = stage === "already_open";

  const hasPropertyKnown =
    ["in_mind", "secured"].includes(survey.has_property) ||
    ["under_contract", "ready_to_open"].includes(stage);

  const constructionHeavy =
    construction === "major_renovation" || construction === "new_construction";
  const constructionLight = construction === "minor";
  const constructionAny = constructionLight || constructionHeavy;

  // === PLANNING & LEGAL SETUP ===
  if (!isAlreadyOpen) {
    checklist.push({
      id: "plan_1",
      phase: "Planning & Legal Setup",
      title: "Write a Business Plan",
      description:
        "A business plan isn't necessary unless you are looking for funding or additional outside guidance, but it is recommended as a way to flush out the idea and see if it is financially viable.\n\nCheck out the SBA for resources to start your business plan: https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan\n\nIf you would like free in-person guidance, contact the local SBDC chapter: https://floridasbdc.org/find/irsc/",
      category: "planning",
      tier: "free",
    });

    if (isPlanning) checklist.push(buildStructureGuide(survey));

    if (survey.business_structure === "no_reach_out" || survey.business_structure === "no_research_myself" || !survey.business_structure) {
      checklist.push({
        id: "legal_1",
        phase: "Planning & Legal Setup",
        title: "Choose a Business Structure",
        description: isPremium
          ? "Compare LLC vs S-Corp vs Sole Proprietorship. An LLC protects personal assets; an S-Corp may save on self-employment taxes. Consult an attorney for your situation."
          : "Decide between LLC, S-Corp, sole proprietorship, or other structures.",
        category: "legal",
        tier: "free",
      });
    }

    checklist.push({
      id: "legal_2",
      phase: "Planning & Legal Setup",
      title: "Register with Florida Division of Corporations",
      description: isPremium
        ? "File Articles of Organization (LLC) or Incorporation (Corp) at Sunbiz.org. Filing fee: $125 for LLC, $70 for Corp. Processing: 2-3 business days online."
        : "File your business formation documents with the state.",
      category: "legal",
      tier: "free",
      link: "https://dos.fl.gov/sunbiz/start-business/",
    });

    checklist.push({
      id: "legal_3",
      phase: "Planning & Legal Setup",
      title: "Apply for Federal EIN (Tax ID Number)",
      description: isPremium
        ? "Apply free online at IRS.gov. Instant approval for most applications. Required for opening a business bank account, hiring employees, and filing taxes."
        : "Get your federal employer identification number.",
      category: "legal",
      tier: "free",
      link: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
    });

    if (isPremium) {
      checklist.push({
        id: "legal_5",
        phase: "Planning & Legal Setup",
        title: "Draft Operating Agreement / Corporate Bylaws",
        description: "Essential internal document. An operating agreement (LLC) or bylaws (Corp) outlines ownership, management structure, and procedures.",
        category: "legal",
        tier: "premium",
      });

      checklist.push({
        id: "legal_6",
        phase: "Planning & Legal Setup",
        title: "Register as Woman/Veteran/Minority-Owned (if applicable)",
        description: survey.is_woman_owned
          ? "Register with SBA's WOSB program for set-aside contracts. Also register with Florida's Office of Supplier Diversity."
          : survey.is_veteran_owned
          ? "Register with VA's Veteran-Owned Small Business program. Contact IRC Veteran Services for local opportunities."
          : "Register with applicable certification programs for potential contract advantages.",
        category: "legal",
        tier: "premium",
      });
    }
  }

  // === FINANCING & FUNDING ===
  if (survey.funding_needs !== "no" && !isAlreadyOpen) {
    checklist.push(buildFinancingGuide(survey));

    checklist.push({
      id: "fin_1",
      phase: "Financing & Funding",
      title: "Explore SBA Loan Programs",
      description: isPremium
        ? "SBA 7(a) loans: up to $5M for working capital/equipment. SBA 504 loans: for real estate & heavy equipment. SBA Microloans: up to $50K. Contact IRC SCORE chapter for free mentoring."
        : "Research SBA loan options for small businesses.",
      category: "financial",
      tier: "free",
    });

    if (constructionHeavy || (survey.needs_construction === "not_sure" && hasPropertyKnown)) {
      checklist.push({
        id: "fin_2",
        phase: "Financing & Funding",
        title: "Research Construction Loan Options",
        description: isPremium
          ? "Construction-to-permanent loans combine build costs and mortgage. Compare local lenders: Marine Bank, Seacoast Banking Corp. SBA 504 can cover up to 40% of project costs."
          : "Explore construction financing for your build-out.",
        category: "financial",
        tier: "free",
      });
    }

    if (isPremium) {
      checklist.push({
        id: "fin_3",
        phase: "Financing & Funding",
        title: "Research IRC Economic Development Incentives",
        description: "IRC offers tax abatements, impact fee deferrals, and infrastructure grants for qualifying businesses. Contact IRC Economic Development: (772) 226-1625.",
        category: "financial",
        tier: "premium",
      });

      if (survey.is_woman_owned) {
        checklist.push({
          id: "fin_4",
          phase: "Financing & Funding",
          title: "Apply for Women-Owned Business Programs",
          description: "SBA Women's Business Centers offer free training. WOSB federal contracting program. Florida WBENC certification opens corporate contracts.",
          category: "financial",
          tier: "premium",
        });
      }
      if (survey.is_veteran_owned) {
        checklist.push({
          id: "fin_5",
          phase: "Financing & Funding",
          title: "Apply for Veteran Business Programs",
          description: "SBA Boots to Business program, VA small business grants. Service-Disabled Veteran-Owned certification for government contracts.",
          category: "financial",
          tier: "premium",
        });
      }
    }
  }

  // === DUE DILIGENCE ===
  if (hasPropertyKnown && !constructionHeavy && !isAlreadyOpen) {
    checklist.push(buildDueDiligenceExisting(survey));
  }
  if (constructionHeavy && !isAlreadyOpen) {
    checklist.push(buildDueDiligenceVacant(survey, { withCaveat: construction === "major_renovation" }));
  }

  // === PROPERTY & LOCATION (those still searching) ===
  if (survey.has_property === "looking_need_help" && !isAlreadyOpen) {
    checklist.push({
      id: "guid_prop_help",
      phase: "Property & Location",
      type: "guidance",
      title: "Finding the Right Property",
      guidance_paragraphs: [
        "Check out the [Indian River Economic Development property search](https://indianrivered.giswebtechguru.com/) or [LoopNet](https://www.loopnet.com/) to search available commercial listings in Indian River County.",
        "You can also contact our local featured realtor expert: *COMPANY* — a placeholder for an upcoming directory listing.",
      ],
      cta: "If you would like someone to reach out to you, click the button below.",
      ctaButton: {
        label: "Request a Call",
        email: "elliese@launchindianriver.com",
        subject: "B4IRC — Property help request",
      },
      category: "property",
    });
  }

  // === CONSTRUCTION & BUILD-OUT ===
  if (construction === "not_sure" && !isAlreadyOpen) {
    checklist.push(buildNotSureConstructionCard());
  }
  if (constructionLight && !isAlreadyOpen) {
    checklist.push(buildInteriorGuide());
    checklist.push(buildPermittingGuide(survey));
  }
  if (constructionHeavy && !isAlreadyOpen) {
    checklist.push(buildInteriorGuide());
    checklist.push(buildPermittingGuide(survey));

    checklist.push({
      id: "build_1",
      phase: "Construction & Build-Out",
      title: "Submit Building Permit Application",
      description: "Your civil engineer and architect will submit plans to the local Building Department for plan review. Review timeline is typically 2-4 weeks; permit fees are based on project value.",
      category: "codes",
      tier: "free",
    });
    checklist.push({
      id: "build_2",
      phase: "Construction & Build-Out",
      title: "Schedule and Pass Required Inspections",
      description: "Inspections required at each phase: foundation, framing, electrical rough-in, plumbing rough-in, mechanical, insulation, final. Schedule 24 hours in advance.",
      category: "codes",
      tier: "free",
    });
    if (isPremium) {
      checklist.push({
        id: "build_3",
        phase: "Construction & Build-Out",
        title: "Obtain Certificate of Occupancy (CO)",
        description: "Required before opening. Issued after final building inspection, fire inspection, and health inspection (if food service). Cannot operate without CO.",
        category: "codes",
        tier: "premium",
      });
    }
  }

  // === LICENSES & PERMITS ===
  if (!isAlreadyOpen) {
    checklist.push({
      id: "lic_1",
      phase: "Licenses & Permits",
      title: "Apply for Local Business Tax Receipt",
      description: "You will also need to register with the specific jurisdiction where your business is located. The City of Vero Beach, City of Sebastian, City of Fellsmere, and Indian River County all have their own business licenses. Apply at the Tax Collector's Office for the jurisdiction. Fee varies by business type ($30–$200+). Renew annually by September 30.",
      category: "licensing",
      tier: "free",
    });

    checklist.push({
      id: "lic_2",
      phase: "Licenses & Permits",
      title: "Register for Florida Sales Tax (if applicable)",
      description: isPremium
        ? "Register with FL Department of Revenue if selling taxable goods/services. Free registration at floridarevenue.com. Florida sales tax: 6% + 0.5% IRC discretionary surtax."
        : "Register for sales tax collection if selling taxable goods or services.",
      category: "licensing",
      tier: "free",
    });

    if (survey.business_type === "eating_drinking" || survey.business_type === "food_store") {
      checklist.push({
        id: "lic_food_1",
        phase: "Licenses & Permits",
        title: "Obtain DBPR Food Service License",
        description: isPremium
          ? "Apply through FL Dept of Business & Professional Regulation. Requires plan review, pre-opening inspection. Fee: $200-$400. Food Manager Certification required."
          : "Get your Florida food service license from DBPR.",
        category: "licensing",
        tier: "free",
      });
    }
    if (survey.business_type === "eating_drinking") {
      checklist.push({
        id: "lic_food_2",
        phase: "Licenses & Permits",
        title: "Schedule Health Department Inspection",
        description: isPremium
          ? "IRC Health Department conducts pre-opening inspections. Must pass before opening. Contact: (772) 794-7400. Common issues: handwashing stations, food temp control, pest management."
          : "Pass the health department inspection before opening.",
        category: "licensing",
        tier: "free",
      });
      if (isPremium) {
        checklist.push({
          id: "lic_food_3",
          phase: "Licenses & Permits",
          title: "Apply for Liquor License (if serving alcohol)",
          description: "FL liquor licenses: 2COP (beer/wine) or 4COP (full bar). 4COP quota licenses can cost $100K+ in IRC. Consider SRX license for restaurants with 51%+ food sales.",
          category: "licensing",
          tier: "premium",
        });
      }
    }
    if (survey.business_type === "medical") {
      checklist.push({
        id: "lic_med_1",
        phase: "Licenses & Permits",
        title: "Obtain Professional Healthcare License",
        description: isPremium
          ? "Verify your FL professional license is current. Additional facility licenses may be required from Agency for Health Care Administration (AHCA). Timeline: 30-90 days."
          : "Ensure all professional and facility healthcare licenses are in order.",
        category: "licensing",
        tier: "free",
      });
    }
    if (survey.business_type === "hotel_boardinghouse") {
      checklist.push({
        id: "lic_hotel_1",
        phase: "Licenses & Permits",
        title: "Obtain DBPR Hotel & Restaurant License",
        description: isPremium
          ? "Apply through FL DBPR for transient lodging license. Health and safety inspections required. Tourist development tax registration with IRC Tax Collector."
          : "Get your lodging license from Florida DBPR.",
        category: "licensing",
        tier: "free",
      });
    }
    if (survey.business_type && survey.business_type.startsWith("mobile_")) {
      checklist.push({
        id: "lic_mobile_1",
        phase: "Licenses & Permits",
        title: "Obtain Mobile Business Vendor Permit",
        description: isPremium
          ? "IRC requires mobile vendors to obtain a county permit in addition to state licenses. Check local ordinances for operating hours and location restrictions."
          : "Get the required mobile vendor permits for Indian River County.",
        category: "licensing",
        tier: "free",
      });
    }
  }

  // === COMPLIANCE & OPERATIONS (code compliance — everyone) ===
  checklist.push({
    id: "comp_1",
    phase: "Compliance & Operations",
    title: "Schedule Fire Marshal Inspection",
    description: isPremium
      ? "Required for commercial occupancy. Verify fire alarm, sprinkler system, exit signage, fire extinguishers, and max occupancy. IRC Fire Prevention: (772) 770-5020."
      : "Pass the fire marshal inspection for your commercial space.",
    category: "codes",
    tier: "free",
  });

  checklist.push({
    id: "comp_2",
    phase: "Compliance & Operations",
    title: "Verify ADA Compliance",
    description: isPremium
      ? "Ensure accessible entrance, restrooms, parking (1 accessible space per 25), signage, and service counter heights. New construction must fully comply; existing buildings need 'readily achievable' modifications."
      : "Ensure your business meets ADA accessibility requirements.",
    category: "codes",
    tier: "free",
  });

  if (!isAlreadyOpen) {
    checklist.push({
      id: "comp_3",
      phase: "Compliance & Operations",
      title: "Open a Business Bank Account",
      description: isPremium
        ? "Bring EIN confirmation, formation documents, operating agreement, and two forms of ID. Local banks: Marine Bank, Seacoast, Valley National. Keep business/personal finances separate."
        : "Open a dedicated business bank account.",
      category: "financial",
      tier: "free",
    });

    checklist.push({
      id: "comp_4",
      phase: "Compliance & Operations",
      title: "Obtain Business Insurance",
      description: isPremium
        ? "General liability ($1M minimum recommended), property insurance, workers' comp (required with 4+ employees in FL), professional liability. Get quotes from 3+ agents."
        : "Get appropriate business insurance coverage.",
      category: "financial",
      tier: "free",
    });

    if (isPremium) {
      checklist.push({
        id: "comp_5",
        phase: "Compliance & Operations",
        title: "Set Up Payroll System (if hiring)",
        description: "Register with FL Dept of Revenue for reemployment tax. Withhold federal income tax, Social Security, Medicare. File Form 941 quarterly. FL has no state income tax.",
        category: "financial",
        tier: "premium",
      });
      checklist.push({
        id: "comp_6",
        phase: "Compliance & Operations",
        title: "Apply for Signage Permit",
        description: "Most jurisdictions require sign permits for exterior business signs. Submit sign drawings with dimensions, illumination specs, and location. Fees vary by sign size.",
        category: "codes",
        tier: "premium",
      });
    }
  }

  // === ONGOING TAXES & REPORTING ===
  if (!isEarly) {
    checklist.push({
      id: "tax_1",
      phase: "Ongoing Taxes & Reporting",
      title: "Set Up Quarterly Tax Payments",
      description: isPremium
        ? "Estimated federal taxes due: April 15, June 15, Sept 15, Jan 15. Use Form 1040-ES (sole prop/LLC) or 1120-S (S-Corp). Underpayment penalty if you owe >$1,000."
        : "Establish quarterly estimated tax payment schedule.",
      category: "taxes",
      tier: "free",
    });

    checklist.push({
      id: "tax_2",
      phase: "Ongoing Taxes & Reporting",
      title: "File & Remit Florida Sales Tax",
      description: isPremium
        ? "Due the 1st-20th of the month following collection period. File at floridarevenue.com. Collection allowance: 2.5% discount if filed on time."
        : "File and pay Florida sales tax on required schedule.",
      category: "taxes",
      tier: "free",
    });

    if (isPremium) {
      checklist.push({
        id: "tax_3",
        phase: "Ongoing Taxes & Reporting",
        title: "File Annual Federal Tax Return",
        description: "S-Corp: Form 1120-S (due March 15). LLC: Schedule C with 1040 (due April 15). C-Corp: Form 1120 (due April 15). Issue W-2s by Jan 31, 1099s by Jan 31.",
        category: "taxes",
        tier: "premium",
      });
      checklist.push({
        id: "tax_4",
        phase: "Ongoing Taxes & Reporting",
        title: "File Florida Annual Report",
        description: "Due by May 1 annually via Sunbiz.org. LLC: $138.75. Corp: $150. Late fee: $400. Failure to file = administrative dissolution.",
        category: "taxes",
        tier: "premium",
      });
      checklist.push({
        id: "tax_5",
        phase: "Ongoing Taxes & Reporting",
        title: "File Tangible Personal Property Tax Return",
        description: "Due April 1 annually with IRC Property Appraiser. Report business equipment, furniture, fixtures. First $25,000 is exempt.",
        category: "taxes",
        tier: "premium",
      });
      checklist.push({
        id: "tax_6",
        phase: "Ongoing Taxes & Reporting",
        title: "Renew Business Tax Receipt Annually",
        description: "Local business tax receipt renews October 1. Late fee after September 30. Update any changes in business activity or location.",
        category: "taxes",
        tier: "premium",
      });
    }
  }

  return checklist;
}