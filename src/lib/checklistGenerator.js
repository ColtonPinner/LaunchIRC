// Generates a personalized checklist based on survey answers

export function generateChecklist(survey) {
  const checklist = [];
  const isPremium = survey.plan_type === "premium";

  // === PHASE 1: PLANNING & LEGAL SETUP ===
  checklist.push({
    id: "plan_1",
    phase: "Planning & Legal Setup",
    title: "Write a Business Plan",
    description: isPremium ? "Outline your business model, target market, financial projections, and competitive analysis. IRC's Economic Development office offers free consultations." : "Create a comprehensive business plan.",
    category: "planning",
    tier: "free",
  });

  // Business Structure
  if (survey.business_structure === "undecided" || !survey.business_structure) {
    checklist.push({
      id: "legal_1",
      phase: "Planning & Legal Setup",
      title: "Choose a Business Structure",
      description: isPremium ? "Compare LLC vs S-Corp vs Sole Proprietorship. An LLC protects personal assets; an S-Corp may save on self-employment taxes. Consult an attorney for your situation." : "Decide between LLC, S-Corp, sole proprietorship, or other structures.",
      category: "legal",
      tier: "free",
    });
  }

  checklist.push({
    id: "legal_2",
    phase: "Planning & Legal Setup",
    title: "Register with Florida Division of Corporations",
    description: isPremium ? "File Articles of Organization (LLC) or Incorporation (Corp) at Sunbiz.org. Filing fee: $125 for LLC, $70 for Corp. Processing: 2-3 business days online." : "File your business formation documents with the state.",
    category: "legal",
    tier: "free",
    link: isPremium ? "https://sunbiz.org" : undefined,
  });

  checklist.push({
    id: "legal_3",
    phase: "Planning & Legal Setup",
    title: "Apply for Federal EIN (Tax ID Number)",
    description: isPremium ? "Apply free online at IRS.gov. Instant approval for most applications. Required for opening a business bank account, hiring employees, and filing taxes." : "Get your federal employer identification number.",
    category: "legal",
    tier: "free",
    link: isPremium ? "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" : undefined,
  });

  checklist.push({
    id: "legal_4",
    phase: "Planning & Legal Setup",
    title: "Register Fictitious Name (DBA) if Needed",
    description: isPremium ? "If operating under a name different from your legal entity name, file a fictitious name registration with the FL Division of Corporations. Fee: $50." : "Register your DBA if using a trade name.",
    category: "legal",
    tier: "free",
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

  // === PHASE 2: PROPERTY & LOCATION ===
  if (survey.has_property !== "already_own") {
    checklist.push({
      id: "prop_1",
      phase: "Property & Location",
      title: "Research Zoning Requirements",
      description: isPremium
        ? `Check IRC's zoning map for your business type (${formatBusinessType(survey.business_type)}). Key zones: C-1 (Retail Commercial), C-2 (General Commercial), M-1 (Light Industrial). Contact IRC Planning Dept: (772) 226-1237.`
        : "Verify the property zone allows your business type.",
      category: "property",
      tier: "free",
    });

    checklist.push({
      id: "prop_2",
      phase: "Property & Location",
      title: "Verify Parking Requirements",
      description: isPremium
        ? "IRC requires specific parking ratios by use: Retail = 1 space per 200 sq ft; Restaurant = 1 per 100 sq ft; Office = 1 per 300 sq ft. Check Land Development Regulations Ch. 911."
        : "Confirm the property meets parking minimums for your business type.",
      category: "property",
      tier: "free",
    });

    checklist.push({
      id: "prop_3",
      phase: "Property & Location",
      title: "Check Setback & Signage Requirements",
      description: isPremium
        ? "Review building setbacks (front, side, rear) for the zoning district. Sign permits required separately — max sizes and illumination rules vary by zone."
        : "Review property setback and signage rules.",
      category: "property",
      tier: "free",
    });
  }

  if (isPremium) {
    checklist.push({
      id: "prop_4",
      phase: "Property & Location",
      title: "Review Flood Zone & Environmental Requirements",
      description: "Check FEMA flood maps for the property. Properties in flood zones may require additional insurance and building standards. IRC Building Dept can provide elevation certificates.",
      category: "property",
      tier: "premium",
    });

    checklist.push({
      id: "prop_5",
      phase: "Property & Location",
      title: "Negotiate & Execute Lease or Purchase Agreement",
      description: "Review lease terms carefully: triple-net (NNN) vs modified gross, CAM charges, build-out allowances, escalation clauses, and exit terms.",
      category: "property",
      tier: "premium",
    });
  }

  // === PHASE 3: FINANCING ===
  if (survey.funding_needs !== "self_funded") {
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

    if (survey.needs_construction) {
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
          description: "SBA Boots to Business program, Patriot Express loans, VA small business grants. Service-Disabled Veteran-Owned certification for government contracts.",
          category: "financial",
          tier: "premium",
        });
      }
    }
  }

  // === PHASE 4: LICENSES & PERMITS ===
  checklist.push({
    id: "lic_1",
    phase: "Licenses & Permits",
    title: "Apply for IRC Local Business Tax Receipt",
    description: isPremium
      ? "Required for all businesses in Indian River County. Apply at IRC Tax Collector's Office. Fee varies by business type ($30–$200+). Renew annually by September 30."
      : "Obtain your local business tax receipt (business license).",
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

  // Business-type specific licenses
  if (survey.business_type === "restaurant_food") {
    checklist.push({
      id: "lic_food_1",
      phase: "Licenses & Permits",
      title: "Obtain DBPR Food Service License",
      description: isPremium
        ? "Apply through FL Dept of Business & Professional Regulation. Requires plan review, pre-opening inspection. Fee: $200-$400 depending on seating. Food Manager Certification required."
        : "Get your Florida food service license from DBPR.",
      category: "licensing",
      tier: "free",
    });

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

  if (survey.business_type === "medical_health") {
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

  if (survey.business_type === "construction_trades") {
    checklist.push({
      id: "lic_trade_1",
      phase: "Licenses & Permits",
      title: "Register Contractor's License with IRC",
      description: isPremium
        ? "Florida licensed contractors must register with IRC Building Department. Provide proof of state license, insurance, and workers' comp. Local registration fee: $50-$100."
        : "Register your contractor's license locally with Indian River County.",
      category: "licensing",
      tier: "free",
    });
  }

  // === PHASE 5: CONSTRUCTION & BUILD-OUT ===
  if (survey.needs_construction) {
    checklist.push({
      id: "build_1",
      phase: "Construction & Build-Out",
      title: "Submit Building Permit Application",
      description: isPremium
        ? "Submit plans to IRC Building Department. Include architectural drawings, mechanical/electrical/plumbing plans. Review timeline: 2-4 weeks. Permit fees based on project value."
        : "Apply for building permits for your construction or renovation.",
      category: "codes",
      tier: "free",
    });

    checklist.push({
      id: "build_2",
      phase: "Construction & Build-Out",
      title: "Schedule and Pass Required Inspections",
      description: isPremium
        ? "Inspections required at each phase: foundation, framing, electrical rough-in, plumbing rough-in, mechanical, insulation, final. Schedule 24 hours in advance."
        : "Pass all required building inspections during construction.",
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

  // === PHASE 6: COMPLIANCE & OPERATIONS ===
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
      description: "IRC requires sign permits for all exterior business signs. Submit sign drawings with dimensions, illumination specs, and location. Fees vary by sign size.",
      category: "codes",
      tier: "premium",
    });
  }

  // === PHASE 7: ONGOING TAXES & COMPLIANCE ===
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
      ? "Due the 1st-20th of the month following collection period (monthly, quarterly, or semi-annual based on volume). File at floridarevenue.com. Collection allowance: 2.5% discount if filed on time."
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
      description: "Due April 1 annually with IRC Property Appraiser. Report business equipment, furniture, fixtures. First $25,000 is exempt. File even if exempt to maintain exemption.",
      category: "taxes",
      tier: "premium",
    });

    checklist.push({
      id: "tax_6",
      phase: "Ongoing Taxes & Reporting",
      title: "Renew Business Tax Receipt Annually",
      description: "IRC local business tax receipt renews October 1. Renewal notices mailed in July. Late fee after September 30. Update any changes in business activity or location.",
      category: "taxes",
      tier: "premium",
    });
  }

  return checklist;
}

function formatBusinessType(type) {
  const map = {
    restaurant_food: "Restaurant / Food Service",
    retail: "Retail Store",
    office_professional: "Office / Professional Services",
    medical_health: "Medical / Healthcare",
    construction_trades: "Construction / Trades",
    home_based: "Home-Based Business",
    mobile_business: "Mobile Business",
    other: "Other",
  };
  return map[type] || type;
}