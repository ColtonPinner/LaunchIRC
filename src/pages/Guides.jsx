import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building2, Scale, DollarSign, FileCheck, ShieldCheck, Calculator, ChevronDown, ChevronUp, ExternalLink, Sparkles } from "lucide-react";

const guides = [
  {
    id: "property",
    icon: Building2,
    title: "Property & Zoning",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    sections: [
      {
        title: "Understanding Zoning",
        content: `Every piece of property has a zoning classification. Zoning is what planners planned out when the county was first being planned out. There are different zoning codes across Indian River County throughout the different cities and county but they are all similar. There are different tiers of residential, commercial, and industrial zoning. They determine what is allowed on the property, the density (how many units per acre), setbacks, impervious coverage, etc.

You can find what the zoning is through each of the governing maps:

• **City of Vero Beach**: https://covb.maps.arcgis.com/apps/instant/basic/index.html?appid=37f3f6a00a0e4184b8a3e314941566bf
• **City of Sebastian**: https://www.arcgis.com/apps/mapviewer/index.html?webmap=ddca4e65cef745a0a73dabdca26aeb6d
• **City of Fellsmere**: https://www.cityoffellsmere.org/media/15446
• **Indian River County**: https://www.arcgis.com/apps/mapviewer/index.html?webmap=7d25d5abdf7248b684c8fbdaad6e40f7

Once you've figured out what the zoning is, you can read the jurisdiction's municipal code to see what is allowed and what their development standards are.`
      },
      {
        title: "Parking Requirements",
        content: `IRC requires off-street parking based on your business type and building size:

• **Retail stores**: 1 space per 200 sq ft of floor area
• **Restaurants**: 1 space per 100 sq ft or 1 per 4 seats (whichever is greater)
• **Office**: 1 space per 300 sq ft
• **Medical/Dental**: 1 space per 175 sq ft
• **Warehousing**: 1 space per 1,000 sq ft
• **ADA accessible spaces**: Required per total parking count

Insufficient parking can prevent occupancy approval. Consider shared parking agreements with adjacent businesses.`
      },
      {
        title: "Setback Requirements",
        content: `Building setbacks define how far structures must be from property lines. These vary by zoning district:

• **Front setback**: Typically 20-25 ft in commercial zones
• **Side setback**: 0-10 ft depending on zone and adjacency to residential
• **Rear setback**: 10-20 ft
• **Landscaping buffers**: Required when commercial abuts residential zones

Nonconforming properties may need variances from the Board of Adjustment.`
      },
      {
        title: "What to Look For in a Property",
        content: `Before committing to a lease or purchase:

✓ Confirm the zoning allows your specific business use
✓ Check for any deed restrictions or HOA limitations  
✓ Verify the property is not in a flood zone (or plan accordingly)
✓ Assess parking adequacy for your expected traffic
✓ Review existing building conditions (HVAC, electrical, plumbing)
✓ Check for environmental concerns (previous industrial use)
✓ Verify utility availability (water, sewer, gas, internet)
✓ Research planned road improvements or construction nearby`
      },
    ],
  },
  {
    id: "financial",
    icon: DollarSign,
    title: "Financing & Incentives",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    sections: [
      {
        title: "SBA Loan Programs",
        content: `The Small Business Administration offers several loan programs:

• **SBA 7(a) Loan** — Most common. Up to $5 million for working capital, equipment, or real estate. Terms up to 25 years.
• **SBA 504 Loan** — For real estate and heavy equipment. 40% SBA-guaranteed, 50% bank, 10% down payment.
• **SBA Microloan** — Up to $50,000 for startups. Through nonprofit intermediaries.
• **SBA Express** — Faster processing for loans up to $500,000.

Contact your local SCORE chapter for free business mentoring and SBA application guidance.`
      },
      {
        title: "Construction & Build-Out Loans",
        content: `If your space needs renovation or new construction:

• **Construction-to-Permanent Loans** — Single close for build and mortgage
• **Construction-Only Loans** — Short-term financing, refinance after completion
• **SBA 504 for Real Estate** — Can cover up to 40% of real estate/renovation costs
• **Equipment Financing** — Separate financing for commercial kitchen, medical equipment, etc.

Local lenders familiar with IRC include Marine Bank, Seacoast Banking, and Valley National Bank.`
      },
      {
        title: "Woman, Veteran & Minority Programs",
        content: `Special programs and certifications:

**Woman-Owned (WOSB)**
• SBA Women's Business Centers — free training and counseling
• WOSB federal contracting program — set-aside government contracts
• Florida WBENC certification

**Veteran-Owned (VOSB)**
• SBA Boots to Business program
• Service-Disabled Veteran-Owned (SDVOSB) certification
• VA small business grants and resources

**Minority-Owned (MBE)**
• Florida Office of Supplier Diversity certification
• SBA 8(a) Business Development Program
• Local chambers and business associations`
      },
      {
        title: "IRC Economic Development Incentives",
        content: `Indian River County offers several incentive programs:

• **Property Tax Abatement** — Up to 10 years for qualifying new businesses
• **Impact Fee Deferrals** — Defer impact fees for new commercial construction
• **Infrastructure Assistance** — Potential grants for road, water, sewer improvements
• **Enterprise Zone Benefits** — Tax credits for businesses in designated areas
• **Job Creation Incentives** — Based on number and quality of jobs created

Contact IRC Economic Development: (772) 226-1625`
      },
    ],
  },
  {
    id: "legal",
    icon: Scale,
    title: "Legal & Business Structure",
    color: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    sections: [
      {
        title: "LLC vs S-Corp vs C-Corp",
        content: `Choosing the right structure impacts liability, taxes, and operations:

**LLC (Most Popular for Small Business)**
• Personal asset protection
• Pass-through taxation (profits taxed once on personal return)
• Flexible management structure
• Less paperwork than corporations
• FL filing fee: $125

**S-Corporation**
• Potential savings on self-employment tax
• Salary + distribution structure
• Limited to 100 shareholders, US citizens
• More compliance requirements (minutes, resolutions)
• FL filing fee: $70 + S-election with IRS

**C-Corporation**
• Best for seeking outside investors
• Double taxation (corporate + personal)
• Unlimited shareholders
• Most regulatory requirements
• FL filing fee: $70`
      },
      {
        title: "How to Incorporate in Florida",
        content: `Step-by-step incorporation process:

1. **Choose a unique business name** — Search Sunbiz.org for availability
2. **Designate a registered agent** — Must have a FL physical address
3. **File formation documents** — Articles of Organization (LLC) or Incorporation (Corp) at Sunbiz.org
4. **Obtain EIN** — Free at IRS.gov, instant online
5. **Draft Operating Agreement** — Not required by FL, but essential for multi-member LLCs
6. **Open business bank account** — Bring EIN, formation docs, operating agreement
7. **Register for state taxes** — If collecting sales tax or hiring employees`
      },
    ],
  },
  {
    id: "licensing",
    icon: FileCheck,
    title: "Licenses & Permits",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    sections: [
      {
        title: "Required for All Businesses",
        content: `Every business in Indian River County needs:

• **Local Business Tax Receipt** — Apply at IRC Tax Collector's Office. Fee: $30-$200+ depending on business type. Renew annually by September 30.
• **Federal EIN** — Required for bank accounts, hiring, tax filing
• **State Registration** — Sunbiz.org for LLCs, Corporations

If selling taxable goods/services:
• **Florida Sales Tax Registration** — Register at floridarevenue.com. FL sales tax: 6% + 0.5% IRC discretionary surtax = 6.5% total`
      },
      {
        title: "Industry-Specific Licenses",
        content: `Additional licenses by business type:

**Restaurant / Food Service**
• DBPR Food Service License ($200-$400)
• Food Manager Certification (ServSafe)
• Health Department pre-opening inspection
• Liquor License (if serving alcohol)

**Medical / Healthcare**
• State professional license verification
• AHCA facility license (if applicable)
• DEA registration (if prescribing)

**Construction / Trades**
• State contractor's license
• Local registration with IRC Building Dept
• Workers' compensation insurance

**Home-Based Business**
• Home occupation permit
• May have restrictions on signage, clients visiting, employees

**Retail**
• Sales tax registration
• Depending on products: ATF (alcohol/tobacco), DACS (agriculture)`
      },
    ],
  },
  {
    id: "codes",
    icon: ShieldCheck,
    title: "Codes & Compliance",
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    sections: [
      {
        title: "Building Codes & Inspections",
        content: `IRC follows the Florida Building Code. For any build-out or renovation:

• **Plan Review** — Submit architectural/engineering plans to IRC Building Dept
• **Inspections** — Required at each phase: foundation, framing, electrical, plumbing, mechanical, insulation, final
• **Certificate of Occupancy** — Issued after all inspections pass. CANNOT open without CO.
• **Timeline** — Plan review: 2-4 weeks. Construction inspections: schedule 24 hours ahead.

For existing buildings, a change of use may require modifications to meet current code.`
      },
      {
        title: "Fire Safety Requirements",
        content: `Fire Marshal inspection required for commercial occupancy:

• Fire alarm system (type depends on building size/use)
• Sprinkler system (for certain occupancy types)
• Illuminated exit signs at all exits
• Fire extinguishers (type and placement by code)
• Maximum occupancy posting
• Emergency action plan
• Annual fire inspections for ongoing compliance

IRC Fire Prevention: (772) 770-5020`
      },
      {
        title: "ADA Compliance",
        content: `All businesses open to the public must comply with ADA:

• Accessible entrance (ramp or level entry)
• Accessible restrooms
• Accessible parking (1 per 25 spaces, van-accessible)
• Accessible service counters and displays
• Proper signage (braille, raised text)
• Communication accommodations

New construction: full compliance required
Existing buildings: "readily achievable" barrier removal
ADA violations can result in lawsuits — consult an ADA specialist.`
      },
      {
        title: "Signage Regulations",
        content: `IRC regulates all exterior business signage:

• **Sign Permit Required** — Submit application with drawings, dimensions, illumination specs
• **Maximum Size** — Varies by zone and frontage
• **Illumination** — Internal, external, or LED restrictions vary
• **Prohibited Signs** — Animated, flashing, off-premises (generally)
• **Temporary Signs** — Limited time periods, specific rules
• **Monument Signs** — Common for strip centers, specific height/setback rules`
      },
    ],
  },
  {
    id: "taxes",
    icon: Calculator,
    title: "Taxes & Reporting",
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    sections: [
      {
        title: "Quarterly Tax Obligations",
        content: `Businesses must make estimated tax payments quarterly:

**Federal Estimated Taxes**
• Due: April 15, June 15, September 15, January 15
• Form 1040-ES (sole prop/LLC) or corporate filing
• Underpayment penalty if you owe more than $1,000

**Florida Sales Tax**
• Filing frequency based on volume (monthly, quarterly, semi-annual)
• Due 1st-20th of month following collection period
• File at floridarevenue.com
• Collection allowance: 2.5% discount if filed on time

**Payroll Taxes (if you have employees)**
• Federal withholding, Social Security, Medicare — deposit semi-weekly or monthly
• Form 941 (quarterly federal payroll report)
• FL Reemployment Tax — filed quarterly`
      },
      {
        title: "Annual Tax Filings",
        content: `Key annual deadlines:

• **Federal Tax Return** — S-Corp (1120-S) March 15; LLC Schedule C/1040 April 15
• **Florida Annual Report** — Due May 1 via Sunbiz.org. LLC: $138.75, Corp: $150. Late fee: $400!
• **Tangible Personal Property Tax** — Due April 1 with IRC Property Appraiser. First $25K exempt.
• **Business Tax Receipt Renewal** — October 1 annually
• **W-2s** — Furnish to employees by January 31
• **1099s** — Furnish to contractors by January 31

**Florida has no state income tax** — but this doesn't eliminate federal obligations.`
      },
    ],
  },
];

export default function Guides() {
  const [openSections, setOpenSections] = useState({});

  const toggle = (guideId, sectionIdx) => {
    const key = `${guideId}-${sectionIdx}`;
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Business Startup Guides
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Everything you need to know about starting a business in Indian River County — from property selection to ongoing tax compliance.
          </p>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="sticky top-16 md:top-20 z-40 bg-background/90 backdrop-blur-lg border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {guides.map((guide) => (
              <a
                key={guide.id}
                href={`#${guide.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted whitespace-nowrap transition-colors"
              >
                <guide.icon className="w-3.5 h-3.5" />
                {guide.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Guide Sections */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {guides.map((guide) => (
            <section key={guide.id} id={guide.id} className="scroll-mt-36">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl ${guide.color} border flex items-center justify-center`}>
                  <guide.icon className="w-6 h-6" />
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                  {guide.title}
                </h2>
              </div>

              <div className="space-y-3">
                {guide.sections.map((section, idx) => {
                  const key = `${guide.id}-${idx}`;
                  const isOpen = openSections[key];

                  return (
                    <div key={idx} className="bg-card rounded-xl border overflow-hidden">
                      <button
                        onClick={() => toggle(guide.id, idx)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                      >
                        <h3 className="font-semibold text-foreground">{section.title}</h3>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="px-5 pb-5"
                        >
                          <div className="prose prose-sm max-w-none text-muted-foreground">
                            {section.content.split("\n").map((line, i) => (
                              <p key={i} className="mb-1 whitespace-pre-wrap text-sm leading-relaxed">
                                {line.split("**").map((part, j) =>
                                  j % 2 === 1 ? (
                                    <strong key={j} className="text-foreground">
                                      {part.split(/(https?:\/\/[^\s]+)/).map((chunk, k) =>
                                        /^https?:\/\//.test(chunk) ? (
                                          <a key={k} href={chunk} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all font-normal">{chunk}</a>
                                        ) : chunk
                                      )}
                                    </strong>
                                  ) : (
                                    part.split(/(https?:\/\/[^\s]+)/).map((chunk, k) =>
                                      /^https?:\/\//.test(chunk) ? (
                                        <a key={k} href={chunk} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">{chunk}</a>
                                      ) : chunk
                                    )
                                  )
                                )}
                              </p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-muted/30 rounded-2xl p-10 border">
          <h3 className="font-heading text-2xl font-bold mb-3">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-6">Take our quick survey and get a personalized checklist for your specific business.</p>
          <Link to="/survey">
            <Button className="bg-accent hover:bg-accent/90 text-white font-semibold gap-2 px-8" size="lg">
              <Sparkles className="w-5 h-5" /> Get Your Checklist
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}