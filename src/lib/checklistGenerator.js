// Generates a personalized checklist based on survey answers

export function generateChecklist(survey) {
  const checklist = [];
  const isPremium = survey.plan_type === "premium";

  // === PHASE 1: PLANNING & LEGAL SETUP ===
  checklist.push({
    id: "plan_1",
    phase: "Planning & Legal Setup",
    title: "Write a Business Plan",
    description: "A business plan isn't necessary unless you are looking for funding or additional outside guidance, but it is recommended as a way to flush out the idea and see if it is financially viable.\n\nCheck out the SBA for resources to start your business plan: https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan\n\nIf you would like free in-person guidance, contact the local SBDC chapter: https://floridasbdc.org/find/irsc/",
    category: "planning",
    tier: "free",
  });

  // Business structure guidance — always shown
  checklist.push({
    id: "guid_structure",
    phase: "Planning & Legal Setup",
    type: "guidance",
    title: "Choosing a Business Structure in Florida",
    guidance_paragraphs: [
      "There are six corporate types in Florida: sole proprietorship, LLC, corporation, partnership, general partnership, and limited partnership.",
      "It is best to discuss with an accountant to see what is best for tax benefits. An attorney will help you file the necessary paperwork if needed.",
    ],
    links: [
      { url: "https://dos.fl.gov/sunbiz/start-business/corporate-structure/", label: "FL Division of Corporations — Corporate Structure Guide" },
    ],
    category: "legal",
  });

  // Business Structure
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
    link: "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number",
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

  // Property guidance based on answer
  if (survey.has_property === "looking_need_help") {
    checklist.push({
      id: "guid_prop_help",
      phase: "Property & Location",
      type: "guidance",
      title: "Finding the Right Property",
      guidance_paragraphs: [
        "Check out [Brian's Page — placeholder] or https://www.loopnet.com/ to search available commercial listings in Indian River County.",
        "You can also contact our local featured expert: [FEATURED COMPANY — placeholder] who specializes in commercial real estate in IRC.",
      ],
      cta: "If you would like someone to reach out to you, click here. [placeholder link]",
      category: "property",
    });
  }

  if (survey.has_property === "looking_no_help") {
    checklist.push({
      id: "guid_prop_diy",
      phase: "Property & Location",
      type: "guidance",
      title: "What to Watch for When Property Hunting",
      guidance_paragraphs: [
        "Make sure to check the jurisdiction's code when looking at a piece of property. Even though the listing might say what is allowed, they are not always correct.",
        "There are several other factors people often overlook such as parking criteria, ADA compliance, and available utilities.",
        "If you are buying a developed property but using it for a different use than was previously used, it is recommended to talk with the jurisdiction before purchasing. Sometimes it will trigger potential updates that may be required.",
      ],
      category: "property",
    });
  }

  if (survey.has_property === "in_mind") {
    checklist.push({
      id: "guid_prop_in_mind",
      phase: "Property & Location",
      type: "guidance",
      title: "Before You Commit to That Property",
      guidance_paragraphs: [
        "Make sure to check the jurisdiction's code when looking at a piece of property. Even though the listing might say what is allowed, they are not always correct.",
        "There are several other factors people often overlook such as parking criteria, ADA compliance, and available utilities.",
        "If you are buying a developed property but using it for a different use than was previously used, it is recommended to talk with the jurisdiction before purchasing. Sometimes it will trigger potential updates that may be required.",
        "If you would like a more detailed list of what to check for, we recommend the paid checklist option or contacting us for help.",
      ],
      category: "property",
    });
  }

  const needsPropertyHelp = survey.has_property !== "dont_need_property" && survey.has_property !== "secured";

  if (needsPropertyHelp) {
    checklist.push({
      id: "prop_1",
      phase: "Property & Location",
      title: "Research Zoning Requirements",
      description: isPremium
        ? `Check IRC's zoning map for your business type. Key zones: C-1 (Retail Commercial), C-2 (General Commercial), M-1 (Light Industrial). Contact IRC Planning Dept: (772) 226-1237.`
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

  // Construction guidance
  if (survey.needs_construction === "minor") {
    checklist.push({
      id: "guid_build_minor",
      phase: "Construction & Build-Out",
      type: "guidance",
      title: "Minor Interior Changes — What You Should Know",
      guidance_paragraphs: [
        "You may need a building permit depending on whether you are adding walls, plumbing, or a kitchen.",
        "It is recommended to talk with an interior designer to understand the ADA compliance requirements for your space.",
      ],
      category: "codes",
    });
  }

  if (survey.needs_construction === "major_renovation") {
    checklist.push({
      id: "guid_build_major",
      phase: "Construction & Build-Out",
      type: "guidance",
      title: "Major Renovation — Permits You May Need",
      guidance_paragraphs: [
        "There are several permits that you may need: building permit, code compliance, and a minor site plan modification depending on what jurisdiction the property is in.",
      ],
      category: "codes",
    });
  }

  if (survey.needs_construction === "new_construction") {
    checklist.push({
      id: "guid_build_new",
      phase: "Construction & Build-Out",
      type: "guidance",
      title: "New Construction — Critical First Steps",
      guidance_paragraphs: [
        "You will need to hire a civil engineer to do the permitting. You will also need a boundary and topo survey (within 1 year old), environmental study (wetlands, endangered species), geotechnical engineering report, and possibly a traffic report down the line.",
        "It is very important you hire a civil engineer prior to buying land.",
      ],
      category: "codes",
    });
  }

  // General permits/licenses guidance — shown for all users
  checklist.push({
    id: "guid_other_permits",
    phase: "Licenses & Permits",
    type: "guidance",
    title: "Other Permits & Licenses That May Apply",
    guidance_paragraphs: [
      "Depending on your industry, you may also need: professional licensing, firm registration, sales tax certificates, lodging license, motor vehicle repair registration, environmental permits, disposal permits, health permits, facility license, food establishment license, food service license, childcare licensing, home occupation permit, mobile food dispensing license, or event permits.",
    ],
    category: "licensing",
  });

  // === PHASE 3: FINANCING ===
  if (survey.funding_needs === "exploring_options") {
    checklist.push({
      id: "guid_fin_exploring",
      phase: "Financing & Funding",
      type: "guidance",
      title: "Financing Options — What's Available",
      guidance_paragraphs: [
        "There are several different options including SBA loans, traditional bank loans, business loans, equipment financing, business line of credit, and self-funding or fundraising.",
        "They each have their own pros and cons with how much down payment is required, how much effort is required (paperwork, business plan, profit projections), and how long the application process will take.",
        "Depending on how much you have to invest and how much you can prove the business will be a success will determine what type of loan is most beneficial.",
        "The Small Business Development Center (SBDC) has great resources to help with creating a business plan.",
      ],
      category: "financial",
    });
  }

  if (survey.funding_needs === "actively_applying") {
    checklist.push({
      id: "guid_fin_applying",
      phase: "Financing & Funding",
      type: "guidance",
      title: "Loan Contacts & Resources",
      guidance_paragraphs: [
        "If you would like help with a certain type of loan, these are the best contacts: [PLACEHOLDER — add loan contacts here]",
      ],
      category: "financial",
    });
  }

  if (survey.funding_needs !== "no") {
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

    const needsConstructionFinancing = survey.needs_construction && survey.needs_construction !== "no" && survey.needs_construction !== "not_sure";
    if (needsConstructionFinancing) {
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
    title: "Apply for Local Business Tax Receipt",
    description: "Depending on where you start your business, you will also need to register with that specific jurisdiction. The City of Vero Beach, City of Sebastian, Indian River County, etc. all have their own business licenses. Apply at the Tax Collector's Office for the jurisdiction where your business is located. Fee varies by business type ($30–$200+). Renew annually by September 30.",
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
  if (survey.business_type === "eating_drinking") {
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

  if (survey.business_type === "food_store") {
    checklist.push({
      id: "lic_food_1",
      phase: "Licenses & Permits",
      title: "Obtain DBPR Food Service License",
      description: isPremium
        ? "Apply through FL Dept of Business & Professional Regulation. Requires plan review, pre-opening inspection. Fee: $200-$400."
        : "Get your Florida food license from DBPR.",
      category: "licensing",
      tier: "free",
    });
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

  // Mobile businesses
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

  // === PHASE 5: CONSTRUCTION & BUILD-OUT ===
  const needsConstruction = survey.needs_construction && survey.needs_construction !== "no";
  if (needsConstruction) {
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
    agriculture: "Agriculture",
    professional_services: "Professional Services",
    retail: "Retail",
    hotel_boardinghouse: "Hotel / Boardinghouse",
    personal_services: "Personal Services",
    business_services: "Business Services",
    auto: "Auto",
    misc_repair: "Misc Repair",
    motion_pictures: "Motion Pictures",
    amusement_recreation: "Amusement and Recreation",
    medical: "Medical",
    food_store: "Food Store",
    auto_dealer: "Auto Dealer",
    eating_drinking: "Eating and Drinking",
    educational: "Educational",
    institutional: "Institutional",
    industrial: "Industrial",
    transportation: "Transportation",
    home_based: "Home-Based",
    mobile_food_truck: "Mobile — Food Truck",
    mobile_pop_up: "Mobile — Pop Up",
    mobile_catering: "Mobile — Catering",
    mobile_personal_services: "Mobile — Personal Services",
    mobile_medical_services: "Mobile — Medical Services",
    non_profit: "Non-Profit",
  };
  return map[type] || type;
}