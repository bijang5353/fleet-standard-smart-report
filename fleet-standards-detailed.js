// Fleet Standards based on Wallenius Wilhelmsen Fleet Standards Guide
// Scoring: 1=Good, 2=Satisfactory, 3=Unsatisfactory, 4=Unacceptable
// Structure: Deck, Cargo, Technical, Accommodation
const FleetStandardsDetailed = {
  deck: {
    weight: 0.25,
    description: "Deck areas and equipment",
    subcategories: {
      'Hull and Structure': {
        weight: 0.3,
        description: "Hull condition and structural integrity",
        items: {
          'Hull Coating': {
            weight: 0.4,
            criteria: "Hull coating condition, appearance, and protection",
            keywords: ["hull coating", "paint condition", "coating integrity", "hull protection", "coating condition", "appearance", "cleanliness", "external hull", "boot top", "ballast tanks"],
            good_practice: "Hull coating in excellent condition with proper protection",
            deficiency: "Poor hull coating condition or inadequate protection",
            improvement_action: "Schedule hull coating inspection and maintenance, repair damaged areas, apply protective coatings, establish regular cleaning schedule",
            praise_comment: "Excellent hull coating maintenance! The well-maintained coating system shows outstanding attention to vessel protection and professional standards."
          },
          'Structural Condition': {
            weight: 0.3,
            criteria: "Structural integrity and visual condition assessment",
            keywords: ["structural condition", "hull structure", "structural integrity", "hull condition", "structural condition", "visual only", "deck covering condition"],
            good_practice: "Excellent structural condition with no visible defects",
            deficiency: "Poor structural condition or visible defects",
            improvement_action: "Conduct thorough structural inspection, repair any visible defects, implement regular structural monitoring, consult with marine surveyors if needed",
            praise_comment: "Outstanding structural integrity! The excellent structural condition demonstrates exceptional vessel maintenance and safety standards."
          },
          'Deck Covering': {
            weight: 0.3,
            criteria: "Deck covering condition and maintenance",
            keywords: ["deck covering", "deck surface", "deck condition", "deck material", "deck covering condition"],
            good_practice: "Deck covering in excellent condition",
            deficiency: "Poor deck covering condition or damage",
            improvement_action: "Inspect deck covering for damage, repair or replace damaged sections, establish regular maintenance schedule, ensure proper drainage",
            praise_comment: "Excellent deck covering maintenance! The well-maintained deck surface shows outstanding attention to safety and operational standards."
          }
        }
      },
      'Bunker and Embarkation': {
        weight: 0.25,
        description: "Bunker spaces and embarkation areas",
        items: {
          'Bunker Spaces': {
            weight: 0.5,
            criteria: "Bunker spaces cleanliness and condition",
            keywords: ["bunker spaces", "bunker area", "bunker cleanliness", "bunker condition"],
            good_practice: "Bunker spaces clean and well maintained",
            deficiency: "Dirty or poorly maintained bunker spaces",
            improvement_action: "Implement regular bunker space cleaning, inspect for contamination, repair any damage, establish cleaning protocols",
            praise_comment: "Outstanding bunker space maintenance! The clean and well-organized bunker areas demonstrate excellent operational standards."
          },
          'Embarkation Areas': {
            weight: 0.5,
            criteria: "Embarkation areas condition and safety",
            keywords: ["embarkation spaces", "embarkation area", "embarkation condition", "boarding area"],
            good_practice: "Embarkation areas in excellent condition and safe",
            deficiency: "Poor condition embarkation areas or safety issues",
            improvement_action: "Inspect embarkation areas for safety hazards, repair damaged areas, ensure proper lighting and signage, establish regular maintenance schedule",
            praise_comment: "Excellent embarkation area maintenance! The safe and well-maintained boarding areas show outstanding attention to passenger safety."
          }
        }
      },
      'Mooring Equipment': {
        weight: 0.25,
        description: "Mooring equipment and deck machinery",
        items: {
          'Forward Mooring': {
            weight: 0.5,
            criteria: "Forward mooring equipment condition and operation",
            keywords: ["fwd mooring", "forward mooring", "fwd mooring equipment", "forward mooring equipment", "running gear", "shaves", "wires", "winches"],
            good_practice: "Forward mooring equipment in excellent condition and operational",
            deficiency: "Poor condition forward mooring equipment or operational issues",
            improvement_action: "Inspect forward mooring equipment, repair or replace damaged components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Outstanding forward mooring equipment maintenance! The well-maintained equipment demonstrates excellent operational standards."
          },
          'Aft Mooring': {
            weight: 0.5,
            criteria: "Aft mooring equipment condition and operation",
            keywords: ["aft mooring", "aft mooring equipment", "running gear", "shaves", "wires", "winches"],
            good_practice: "Aft mooring equipment in excellent condition and operational",
            deficiency: "Poor condition aft mooring equipment or operational issues",
            improvement_action: "Inspect aft mooring equipment, repair or replace damaged components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Outstanding aft mooring equipment maintenance! The well-maintained equipment demonstrates excellent operational standards."
          }
        }
      },
      'Cargo Handling': {
        weight: 0.2,
        description: "Cargo handling equipment and systems",
        items: {
          'Cranes and Davits': {
            weight: 0.4,
            criteria: "Cranes and davits operational condition",
            keywords: ["cranes and davits", "crane", "davit", "cargo handling", "lifting equipment"],
            good_practice: "All cranes and davits properly maintained and operational",
            deficiency: "Non-functional cranes or davits",
            improvement_action: "Inspect cranes and davits for damage, repair or replace faulty components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Excellent crane and davit maintenance! The well-maintained equipment demonstrates outstanding operational standards."
          },
          'Deck Lifters': {
            weight: 0.3,
            criteria: "Deck lifters operational condition",
            keywords: ["deck lifter", "deck lifters", "lifting equipment", "cargo handling"],
            good_practice: "All deck lifters properly maintained and operational",
            deficiency: "Non-functional deck lifters",
            improvement_action: "Inspect deck lifters for damage, repair or replace faulty components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Outstanding deck lifter maintenance! The well-maintained equipment demonstrates excellent operational standards."
          },
          'Lifting and Lashing Points': {
            weight: 0.3,
            criteria: "Lifting and lashing points condition",
            keywords: ["lifting and lashing points", "lashing points", "lifting points", "cargo securing"],
            good_practice: "All lifting and lashing points in excellent condition",
            deficiency: "Damaged or inadequate lifting and lashing points",
            improvement_action: "Inspect all lifting and lashing points, repair or replace damaged points, ensure proper strength and condition, establish regular inspection schedule",
            praise_comment: "Excellent lifting and lashing point maintenance! The well-maintained points demonstrate outstanding safety standards."
          }
        }
      }
    }
  },
  cargo: {
    weight: 0.25,
    description: "Cargo areas and systems",
    subcategories: {
      'Cargo Decks': {
        weight: 0.4,
        description: "Cargo deck areas and cleanliness",
        items: {
          'H&H Decks': {
            weight: 0.5,
            criteria: "H&H decks cleanliness and condition",
            keywords: ["h&h decks", "cargo deck", "hold cleanliness", "cargo space"],
            good_practice: "H&H decks clean and well maintained",
            deficiency: "Dirty or poorly maintained H&H decks",
            improvement_action: "Implement regular H&H deck cleaning, inspect for contamination, repair any damage, establish cleaning protocols",
            praise_comment: "Outstanding H&H deck maintenance! The clean and well-maintained cargo decks show excellent operational standards."
          },
          'Car Decks': {
            weight: 0.5,
            criteria: "Car decks cleanliness and condition",
            keywords: ["car decks", "cargo deck", "hold cleanliness", "cargo space"],
            good_practice: "Car decks clean and well maintained",
            deficiency: "Dirty or poorly maintained car decks",
            improvement_action: "Implement regular car deck cleaning, inspect for contamination, repair any damage, establish cleaning protocols",
            praise_comment: "Excellent car deck maintenance! The clean and well-maintained cargo decks demonstrate outstanding operational standards."
          }
        }
      },
      'Ramp Systems': {
        weight: 0.3,
        description: "Ramp systems and operation",
        items: {
          'Side Ramp': {
            weight: 0.33,
            criteria: "Side ramp condition and operation",
            keywords: ["side ramp", "ramp system", "ramp operation"],
            good_practice: "Side ramp in excellent condition and operational",
            deficiency: "Poor condition side ramp or operational issues",
            improvement_action: "Inspect side ramp for damage, repair or replace faulty components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Outstanding side ramp maintenance! The well-maintained ramp demonstrates excellent operational standards."
          },
          'Stern Ramp': {
            weight: 0.33,
            criteria: "Stern ramp condition and operation",
            keywords: ["stern ramp", "ramp system", "ramp operation"],
            good_practice: "Stern ramp in excellent condition and operational",
            deficiency: "Poor condition stern ramp or operational issues",
            improvement_action: "Inspect stern ramp for damage, repair or replace faulty components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Excellent stern ramp maintenance! The well-maintained ramp demonstrates outstanding operational standards."
          },
          'Internal Ramps': {
            weight: 0.34,
            criteria: "Internal ramps condition and operation",
            keywords: ["internal ramps", "ramp system", "ramp operation"],
            good_practice: "Internal ramps in excellent condition and operational",
            deficiency: "Poor condition internal ramps or operational issues",
            improvement_action: "Inspect internal ramps for damage, repair or replace faulty components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Outstanding internal ramp maintenance! The well-maintained ramps demonstrate excellent operational standards."
          }
        }
      },
      'Cargo Systems': {
        weight: 0.3,
        description: "Cargo handling systems",
        items: {
          'Cargo Hydraulics': {
            weight: 0.5,
            criteria: "Cargo hydraulic systems condition and operation",
            keywords: ["cargo hydraulics", "hydraulic system", "hydraulic equipment", "cargo system", "cargo firefighting"],
            good_practice: "All cargo hydraulic systems properly maintained and operational",
            deficiency: "Poor condition cargo hydraulic systems or operational issues",
            improvement_action: "Inspect cargo hydraulic systems, repair or replace faulty components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Excellent cargo hydraulic maintenance! The well-maintained systems demonstrate outstanding operational standards."
          },
          'Cargo Firefighting': {
            weight: 0.5,
            criteria: "Cargo firefighting systems condition and operation",
            keywords: ["cargo firefighting", "fire fighting", "cargo fire", "fire suppression"],
            good_practice: "All cargo firefighting systems properly maintained and operational",
            deficiency: "Poor condition cargo firefighting systems or operational issues",
            improvement_action: "Inspect cargo firefighting systems, repair or replace faulty components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Outstanding cargo firefighting maintenance! The well-maintained systems demonstrate excellent safety standards."
          }
        }
      }
    }
  },
  technical: {
    weight: 0.25,
    description: "Technical systems and equipment",
    subcategories: {
      'Engine Room': {
        weight: 0.3,
        description: "Engine room equipment and systems",
        items: {
          'Main Engine': {
            weight: 0.25,
            criteria: "Main engine condition and operation",
            keywords: ["main engine", "engine condition", "engine operation", "engine room"],
            good_practice: "Main engine in excellent condition and operational",
            deficiency: "Poor condition main engine or operational issues",
            improvement_action: "Conduct thorough main engine inspection, repair or replace faulty components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Outstanding main engine maintenance! The well-maintained engine demonstrates excellent engineering standards."
          },
          'Auxiliary Engines': {
            weight: 0.25,
            criteria: "Auxiliary engines condition and operation",
            keywords: ["auxiliary engines", "aux engine", "auxiliary engine", "engine room"],
            good_practice: "Auxiliary engines in excellent condition and operational",
            deficiency: "Poor condition auxiliary engines or operational issues",
            improvement_action: "Inspect auxiliary engines, repair or replace faulty components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Excellent auxiliary engine maintenance! The well-maintained engines demonstrate outstanding engineering standards."
          },
          'Boiler': {
            weight: 0.25,
            criteria: "Boiler condition and operation",
            keywords: ["boiler", "boiler condition", "boiler operation", "steam system"],
            good_practice: "Boiler in excellent condition and operational",
            deficiency: "Poor condition boiler or operational issues",
            improvement_action: "Inspect boiler system, repair or replace faulty components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Outstanding boiler maintenance! The well-maintained boiler demonstrates excellent engineering standards."
          },
          'Emergency Generator': {
            weight: 0.25,
            criteria: "Emergency generator condition and operation",
            keywords: ["emergency generator", "emergency gen", "generator", "emergency power"],
            good_practice: "Emergency generator in excellent condition and operational",
            deficiency: "Poor condition emergency generator or operational issues",
            improvement_action: "Inspect emergency generator, repair or replace faulty components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Excellent emergency generator maintenance! The well-maintained generator demonstrates outstanding safety standards."
          }
        }
      },
      'Electrical Systems': {
        weight: 0.25,
        description: "Electrical systems and equipment",
        items: {
          'Cables and Electrical': {
            weight: 0.4,
            criteria: "Cables and electrical systems condition",
            keywords: ["cables and electrical", "electrical cables", "cable condition", "electrical systems"],
            good_practice: "All cables and electrical systems in excellent condition",
            deficiency: "Poor condition cables or electrical systems",
            improvement_action: "Inspect all cables and electrical systems, repair or replace damaged components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Outstanding electrical system maintenance! The well-maintained systems demonstrate excellent engineering standards."
          },
          'Lighting': {
            weight: 0.3,
            criteria: "Lighting systems condition and operation",
            keywords: ["lighting", "light condition", "lighting system", "illumination"],
            good_practice: "All lighting systems functional and well maintained",
            deficiency: "Non-functional lighting or poor coverage",
            improvement_action: "Inspect all lighting systems, repair or replace faulty lights, ensure proper coverage, establish regular maintenance schedule",
            praise_comment: "Excellent lighting maintenance! The well-maintained lighting systems demonstrate outstanding operational standards."
          },
          'Equipment Cable Glands': {
            weight: 0.3,
            criteria: "Equipment cable glands condition and sealing",
            keywords: ["equipment cable glands", "cable glands", "electrical connections", "cable seals"],
            good_practice: "All equipment cable glands properly sealed and maintained",
            deficiency: "Improperly sealed cable glands or connections",
            improvement_action: "Inspect all equipment cable glands, repair or replace faulty seals, ensure proper sealing, establish regular maintenance schedule",
            praise_comment: "Outstanding cable gland maintenance! The well-maintained seals demonstrate excellent engineering standards."
          }
        }
      },
      'Pipework and Valves': {
        weight: 0.25,
        description: "Pipework, valves, and flexible hoses",
        items: {
          'Pipework and Valves': {
            weight: 0.5,
            criteria: "Pipework and valves condition and operation",
            keywords: ["pipework and valves", "pipework condition", "valve condition", "pipework", "valves"],
            good_practice: "All pipework and valves in excellent condition and operational",
            deficiency: "Poor condition pipework or valves",
            improvement_action: "Inspect all pipework and valves, repair or replace faulty components, ensure proper operation, establish regular maintenance schedule",
            praise_comment: "Excellent pipework and valve maintenance! The well-maintained systems demonstrate outstanding engineering standards."
          },
          'Flexible Hoses': {
            weight: 0.5,
            criteria: "Flexible hoses condition and security",
            keywords: ["flexible hoses", "hose condition", "hose security", "hose maintenance"],
            good_practice: "All flexible hoses in good condition and properly secured",
            deficiency: "Damaged or improperly secured flexible hoses",
            improvement_action: "Inspect all flexible hoses, repair or replace damaged hoses, ensure proper securing, establish regular maintenance schedule",
            praise_comment: "Outstanding flexible hose maintenance! The well-maintained hoses demonstrate excellent engineering standards."
          }
        }
      },
      'Boundaries and Seals': {
        weight: 0.2,
        description: "Penetrations, seals, doors, and boundaries",
        items: {
          'Boundaries and Seals': {
            weight: 0.5,
            criteria: "Boundaries and seals condition and integrity",
            keywords: ["boundaries and seals", "penetrations", "seals", "doors", "watertight integrity"],
            good_practice: "All boundaries and seals in excellent condition and properly sealed",
            deficiency: "Compromised boundaries or seals",
            improvement_action: "Inspect all boundaries and seals, repair or replace damaged seals, ensure proper sealing, establish regular maintenance schedule",
            praise_comment: "Excellent boundary and seal maintenance! The well-maintained seals demonstrate outstanding safety standards."
          },
          'Penetrations': {
            weight: 0.5,
            criteria: "Penetrations condition and sealing",
            keywords: ["penetrations", "penetration seals", "cable glands", "pipe seals"],
            good_practice: "All penetrations properly sealed and maintained",
            deficiency: "Improperly sealed penetrations or leaks",
            improvement_action: "Inspect all penetrations, repair or replace faulty seals, ensure proper sealing, establish regular maintenance schedule",
            praise_comment: "Outstanding penetration maintenance! The well-maintained seals demonstrate excellent engineering standards."
          }
        }
      }
    }
  },
  accommodation: {
    weight: 0.25,
    description: "Accommodation areas and facilities",
    subcategories: {
      'Interior Spaces': {
        weight: 0.4,
        description: "Interior accommodation spaces",
        items: {
          'Wheelhouse': {
            weight: 0.25,
            criteria: "Wheelhouse condition and cleanliness",
            keywords: ["wheelhouse", "bridge", "control room", "navigational area"],
            good_practice: "Wheelhouse in excellent condition and clean",
            deficiency: "Poor condition wheelhouse or cleanliness issues",
            improvement_action: "Implement regular wheelhouse cleaning, inspect for damage, repair any issues, establish daily maintenance routine",
            praise_comment: "Outstanding wheelhouse maintenance! The clean and well-maintained navigational area demonstrates excellent operational standards."
          },
          'Control Room': {
            weight: 0.25,
            criteria: "Control room condition and cleanliness",
            keywords: ["control room", "control position", "control system", "control panel"],
            good_practice: "Control room in excellent condition and clean",
            deficiency: "Poor condition control room or cleanliness issues",
            improvement_action: "Implement regular control room cleaning, inspect for damage, repair any issues, establish daily maintenance routine",
            praise_comment: "Excellent control room maintenance! The clean and well-maintained control area demonstrates outstanding operational standards."
          },
          'Galley': {
            weight: 0.25,
            criteria: "Galley condition and cleanliness",
            keywords: ["galley", "kitchen", "cooking area", "food preparation"],
            good_practice: "Galley in excellent condition and clean",
            deficiency: "Poor condition galley or cleanliness issues",
            improvement_action: "Implement regular galley cleaning, inspect for damage, repair any issues, establish daily maintenance routine",
            praise_comment: "Outstanding galley maintenance! The clean and well-maintained kitchen area demonstrates excellent hygiene standards."
          },
          'Dining': {
            weight: 0.25,
            criteria: "Dining area condition and cleanliness",
            keywords: ["dining", "dining area", "mess room", "eating area"],
            good_practice: "Dining area in excellent condition and clean",
            deficiency: "Poor condition dining area or cleanliness issues",
            improvement_action: "Implement regular dining area cleaning, inspect for damage, repair any issues, establish daily maintenance routine",
            praise_comment: "Excellent dining area maintenance! The clean and well-maintained eating area demonstrates outstanding hygiene standards."
          }
        }
      },
      'Recreational Areas': {
        weight: 0.3,
        description: "Recreational and common areas",
        items: {
          'Recreational': {
            weight: 0.5,
            criteria: "Recreational areas condition and cleanliness",
            keywords: ["recreational", "recreation area", "common area", "leisure area"],
            good_practice: "Recreational areas in excellent condition and clean",
            deficiency: "Poor condition recreational areas or cleanliness issues",
            improvement_action: "Implement regular recreational area cleaning, inspect for damage, repair any issues, establish daily maintenance routine",
            praise_comment: "Outstanding recreational area maintenance! The clean and well-maintained leisure areas demonstrate excellent crew welfare standards."
          },
          'Heads': {
            weight: 0.5,
            criteria: "Heads condition and cleanliness",
            keywords: ["heads", "toilets", "bathrooms", "sanitary facilities"],
            good_practice: "Heads in excellent condition and clean",
            deficiency: "Poor condition heads or cleanliness issues",
            improvement_action: "Implement regular heads cleaning, inspect for damage, repair any issues, establish daily maintenance routine",
            praise_comment: "Excellent heads maintenance! The clean and well-maintained sanitary facilities demonstrate outstanding hygiene standards."
          }
        }
      },
      'Insulation Systems': {
        weight: 0.3,
        description: "Thermal and acoustic insulation",
        items: {
          'Statutory Insulation': {
            weight: 0.5,
            criteria: "Required insulation systems condition",
            keywords: ["statutory insulation", "required insulation", "insulation condition", "thermal insulation"],
            good_practice: "All statutory insulation in excellent condition",
            deficiency: "Damaged or inadequate statutory insulation",
            improvement_action: "Inspect all statutory insulation, repair or replace damaged insulation, ensure proper coverage, establish regular maintenance schedule",
            praise_comment: "Outstanding statutory insulation maintenance! The well-maintained insulation demonstrates excellent engineering standards."
          },
          'Auxiliary Systems Insulation': {
            weight: 0.5,
            criteria: "Auxiliary systems insulation condition",
            keywords: ["auxiliary systems insulation", "auxiliary insulation", "system insulation", "insulation maintenance"],
            good_practice: "All auxiliary insulation systems well maintained",
            deficiency: "Poor auxiliary insulation condition or maintenance",
            improvement_action: "Inspect all auxiliary insulation systems, repair or replace damaged insulation, ensure proper coverage, establish regular maintenance schedule",
            praise_comment: "Excellent auxiliary insulation maintenance! The well-maintained systems demonstrate outstanding engineering standards."
          }
        }
      }
    }
  }
};

module.exports = FleetStandardsDetailed;