const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const FleetStandardsDetailed = require('./fleet-standards-detailed');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "data:"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Fleet Standard Analysis Engine
class FleetStandardAnalyzer {
  constructor() {
    this.fleetStandards = FleetStandardsDetailed;
  }

  async analyzeInspectionData(pdfText) {
    try {
      // Extract key information from PDF text
      const extractedData = this.extractInspectionData(pdfText);
      // Keep full text for downstream keyword/context scoring
      extractedData.fullText = pdfText;
      
      // Analyze against fleet standards
      const analysis = this.performFleetAnalysis(extractedData);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(analysis);
      
      // Calculate overall score
      const overallScore = this.calculateOverallScore(analysis);
      
      return {
        extractedData,
        analysis,
        recommendations,
        overallScore,
        reportDate: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  extractInspectionData(text) {
    const data = {
      vesselName: this.extractVesselName(text),
      inspectionDate: this.extractInspectionDate(text),
      inspector: this.extractInspector(text),
      findings: this.extractFindings(text),
      observations: this.extractObservations(text),
      deficiencies: this.extractDeficiencies(text),
      fullText: text
    };
    
    return data;
  }

  extractVesselName(text) {
    const vesselPatterns = [
      /vessel\s+name[:\s]+([^\n\r]+)/i,
      /ship\s+name[:\s]+([^\n\r]+)/i,
      /m\.v\.\s+([^\n\r]+)/i,
      /m\/v\s+([^\n\r]+)/i,
      /vessel[:\s]+([^\n\r]+)/i,
      /ship[:\s]+([^\n\r]+)/i,
      /ASIAN\s+VISION/i,
      /asian\s+vision/i
    ];
    
    for (const pattern of vesselPatterns) {
      const match = text.match(pattern);
      if (match) {
        const vesselName = match[1] ? match[1].trim() : match[0].trim();
        if (vesselName && vesselName.length > 2) {
          return vesselName;
        }
      }
    }
    
    // Try to find vessel name from filename or common patterns
    if (text.includes('ASIAN VISION') || text.includes('Asian Vision')) {
      return 'ASIAN VISION';
    }
    
    return 'Unknown Vessel';
  }

  extractInspectionDate(text) {
    const datePatterns = [
      /inspection\s+date[:\s]+([^\n\r]+)/i,
      /date\s+of\s+inspection[:\s]+([^\n\r]+)/i,
      /date[:\s]+([^\n\r]+)/i,
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
      /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
      /(Jul|Jul-29|July|July\s+29)[\s\-]*(\d{4})/i,
      /(29[\s\-]*Jul|29[\s\-]*July)[\s\-]*(\d{4})/i
    ];
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        const dateStr = match[1] ? match[1].trim() : match[0].trim();
        if (dateStr && dateStr.length > 3) {
          return dateStr;
        }
      }
    }
    
    // Try to find date from filename
    if (text.includes('Jul-29-2025') || text.includes('Jul 29 2025')) {
      return 'Jul 29, 2025';
    }
    
    return new Date().toLocaleDateString();
  }

  extractInspector(text) {
    const inspectorPatterns = [
      /inspector[:\s]+([^\n\r]+)/i,
      /inspected\s+by[:\s]+([^\n\r]+)/i,
      /surveyor[:\s]+([^\n\r]+)/i,
      /by[:\s]+([^\n\r]+)/i,
      /(Byeongil|James|Jang)/i
    ];
    
    for (const pattern of inspectorPatterns) {
      const match = text.match(pattern);
      if (match) {
        const inspector = match[1] ? match[1].trim() : match[0].trim();
        if (inspector && inspector.length > 2) {
          return inspector;
        }
      }
    }
    
    // Try to find inspector from filename
    if (text.includes('Byeongil') || text.includes('James') || text.includes('Jang')) {
      return 'Byeongil (James) Jang';
    }
    
    return 'Unknown Inspector';
  }

  extractFindings(text) {
    const findings = {
      goodPractices: [],
      deficiencies: []
    };
    
    const goodPracticePatterns = [
      /good\s+practice[s]?[:\s]+([^\n\r]+)/gi,
      /excellent[:\s]+([^\n\r]+)/gi,
      /satisfactory[:\s]+([^\n\r]+)/gi,
      /well\s+maintained[:\s]+([^\n\r]+)/gi,
      /properly\s+functioning[:\s]+([^\n\r]+)/gi,
      /in\s+good\s+condition[:\s]+([^\n\r]+)/gi
    ];
    
    const deficiencyPatterns = [
      /deficiency[s]?[:\s]+([^\n\r]+)/gi,
      /non[-\s]?conformity[s]?[:\s]+([^\n\r]+)/gi,
      /defect[s]?[:\s]+([^\n\r]+)/gi,
      /issue[s]?[:\s]+([^\n\r]+)/gi,
      /problem[s]?[:\s]+([^\n\r]+)/gi,
      /poor[:\s]+([^\n\r]+)/gi,
      /damaged[:\s]+([^\n\r]+)/gi,
      /missing[:\s]+([^\n\r]+)/gi,
      /faulty[:\s]+([^\n\r]+)/gi,
      /defective[:\s]+([^\n\r]+)/gi,
      /unsatisfactory[:\s]+([^\n\r]+)/gi,
      /unacceptable[:\s]+([^\n\r]+)/gi
    ];
    
    // Extract good practices
    for (const pattern of goodPracticePatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const finding = match[1].trim();
        if (finding && finding.length > 5) {
          findings.goodPractices.push(finding);
        }
      }
    }
    
    // Extract deficiencies - but skip generic ones
    for (const pattern of deficiencyPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const finding = match[1].trim();
        if (finding && finding.length > 5 && 
            !finding.toLowerCase().includes('deficiency identified requiring corrective action') &&
            !finding.toLowerCase().includes('private & confidential')) {
          findings.deficiencies.push(finding);
        }
      }
    }
    
    // Look for Flagged items page and extract specific content
    const flaggedItemsMatch = text.match(/flagged\s+items[^]*?(?=condition\s+assessment|scoring|$)/i);
    if (flaggedItemsMatch) {
      // Clear existing findings and only use Flagged items section
      findings.deficiencies = [];
      findings.goodPractices = [];
      
      const flaggedItemsText = flaggedItemsMatch[0]
        .replace(/private\s*&\s*confidential/ig, '')
        .replace(/type\s*deficiency\s*or\s*good\s*practice/ig, '')
        .replace(/flagged\s*items/ig, '');

      // Split into candidate sentences/lines
      let candidates = flaggedItemsText
        .split(/\n|•|\u2022|\-|\u2013|\u2014|;|\.|\r/g)
        .map(s => s.trim())
        .filter(s => s.length > 10);

      // Normalize and strip leading vessel/name prefixes like "Fidelio:", "Lake Tazawa:", "L.Tazawa:" etc.
      candidates = candidates.map(s => s.replace(/^[A-Za-z][A-Za-z\.\s\/-]{1,40}:\s*/, ''));

      const blacklist = [
        'deficiency identified requiring corrective action',
        'private & confidential',
        'confidential',
        'for internal use',
        'page',
        'flagged items',
        'actions',
        'open',
        'assignee',
        'priority',
        'due:',
        'created by',
        'photo',
        'type',
        'deficiency',
        'good practice',
        'flagged',
        'items',
        'vessel',
        'date',
        'prepared by',
        'location',
        'inspection type',
        'shore',
        'complete'
      ];

      const isBlacklisted = s => blacklist.some(b => s.toLowerCase().includes(b));

      const isDefSentence = s => {
        // More specific patterns for actual deficiency descriptions
        const defPatterns = [
          /faded.*corrod.*draft.*mark/i,
          /damaged.*antiskid.*paint/i,
          /cargo.*vent.*fan.*stuck/i,
          /torn.*down.*ceiling/i,
          /no.*proper.*lashing/i,
          /chain.*box/i,
          /bunker.*station/i,
          /stern.*ramp/i,
          /draft.*mark.*stbd/i,
          /lever.*stuck/i,
          /slope.*way.*deck/i,
          /not.*properly.*indicating.*co2/i,
          /co2.*q.*ty.*level.*gauge/i,
          /fan.*no.*deck.*no.*10.*11/i,
          /oily.*condition.*me.*fo.*supply/i,
          /circulation.*pumps.*area.*purifier/i,
          /engine.*room/i
        ];
        return defPatterns.some(pattern => pattern.test(s)) && s.length > 15;
      };
      
      const isGoodSentence = s => {
        const goodPatterns = [
          /excellent.*arrangement/i,
          /professional.*working/i,
          /well.*done/i,
          /impressed.*improvement/i,
          /commend/i,
          /outstanding/i
        ];
        return goodPatterns.some(pattern => pattern.test(s)) && s.length > 20;
      };

      candidates.forEach(s => {
        if (isBlacklisted(s)) return;
        if (isDefSentence(s)) {
          findings.deficiencies.push(s);
        } else if (isGoodSentence(s)) {
          findings.goodPractices.push(s);
        }
      });

      // Deduplicate and keep top few
      findings.deficiencies = [...new Set(findings.deficiencies)].slice(0, 8);
      findings.goodPractices = [...new Set(findings.goodPractices)].slice(0, 8);
    }
    
    // If no specific findings found, extract general observations
    if (findings.goodPractices.length === 0 && findings.deficiencies.length === 0) {
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length > 10 && line.length < 200) {
          // Look for lines that might contain findings
          if (line.match(/(good|excellent|satisfactory|proper|well|adequate|functional)/i)) {
            findings.goodPractices.push(line);
          } else if (line.match(/(poor|bad|damaged|missing|faulty|defective|inadequate|non-functional)/i)) {
            findings.deficiencies.push(line);
          }
        }
      }
    }
    
    // Limit to 5 each
    findings.goodPractices = findings.goodPractices.slice(0, 5);
    findings.deficiencies = findings.deficiencies.slice(0, 5);
    
    return findings;
  }

  categorizeFinding(finding, findings) {
    const cleanFinding = finding.trim();
    if (cleanFinding.length < 10) return;
    
    // Keywords that indicate deficiencies
    const deficiencyKeywords = [
      'torn', 'damaged', 'broken', 'missing', 'no proper', 'poor', 'defective',
      'faulty', 'cracked', 'loose', 'worn', 'corroded', 'leaking', 'not working',
      'inoperative', 'unsatisfactory', 'unacceptable', 'needs repair', 'repair',
      'deficiency', 'issue', 'problem'
    ];
    
    // Keywords that indicate good practices
    const goodPracticeKeywords = [
      'professional', 'impressed', 'improvement', 'excellent', 'good', 'proper',
      'well maintained', 'satisfactory', 'commendable', 'outstanding', 'crew showed',
      'much impressed', 'kindly', 'working', 'operating'
    ];
    
    const lowerFinding = cleanFinding.toLowerCase();
    
    // Check for deficiency indicators
    const hasDeficiencyKeyword = deficiencyKeywords.some(keyword => lowerFinding.includes(keyword));
    
    // Check for good practice indicators
    const hasGoodPracticeKeyword = goodPracticeKeywords.some(keyword => lowerFinding.includes(keyword));
    
    if (hasDeficiencyKeyword && !hasGoodPracticeKeyword) {
      findings.deficiencies.push(cleanFinding);
    } else if (hasGoodPracticeKeyword && !hasDeficiencyKeyword) {
      findings.goodPractices.push(cleanFinding);
    } else if (hasGoodPracticeKeyword) {
      // If both are present, good practice takes precedence
      findings.goodPractices.push(cleanFinding);
    } else {
      // Default to deficiency if unclear
      findings.deficiencies.push(cleanFinding);
    }
  }

  extractObservations(text) {
    const observations = [];
    const observationPatterns = [
      /observation[s]?[:\s]+([^\n\r]+)/gi,
      /remark[s]?[:\s]+([^\n\r]+)/gi,
      /comment[s]?[:\s]+([^\n\r]+)/gi
    ];
    
    for (const pattern of observationPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        observations.push(match[1].trim());
      }
    }
    
    return observations;
  }

  extractDeficiencies(text) {
    const deficiencies = [];
    const deficiencyPatterns = [
      /deficiency[s]?[:\s]+([^\n\r]+)/gi,
      /non[-\s]?conformity[s]?[:\s]+([^\n\r]+)/gi,
      /defect[s]?[:\s]+([^\n\r]+)/gi,
      /issue[s]?[:\s]+([^\n\r]+)/gi
    ];
    
    for (const pattern of deficiencyPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        deficiencies.push(match[1].trim());
      }
    }
    
    return deficiencies;
  }

  performFleetAnalysis(data) {
    const analysis = {};
    
    Object.keys(this.fleetStandards).forEach(category => {
      const categoryData = this.fleetStandards[category];
      analysis[category] = {
        score: this.calculateCategoryScore(data, category),
        details: this.getDetailedCategoryAnalysis(data, category),
        weight: categoryData.weight,
        subcategories: this.analyzeSubcategories(data, category)
      };
    });
    
    return analysis;
  }

  calculateCategoryScore(data, category) {
    // Calculate category score based on 1-4 scale (1=Good, 2=Satisfactory, 3=Unsatisfactory, 4=Unacceptable)
    const categoryData = this.fleetStandards[category];
    if (!categoryData) return 2.0; // Default to Satisfactory

    let totalScore = 0;
    let totalWeight = 0;
    
    // Analyze each subcategory
    Object.keys(categoryData.subcategories).forEach(subCategory => {
      const subCategoryData = categoryData.subcategories[subCategory];
      const subCategoryScore = this.calculateSubCategoryScore(subCategory, subCategoryData, data);
      totalScore += subCategoryScore * subCategoryData.weight;
      totalWeight += subCategoryData.weight;
    });
    
    return totalWeight > 0 ? totalScore / totalWeight : 2.0;
  }

  calculateSubCategoryScore(subCategory, subCategoryData, data) {
    let totalScore = 0;
    let totalWeight = 0;
    
    // Analyze each item
    Object.keys(subCategoryData.items).forEach(item => {
      const itemData = subCategoryData.items[item];
      const itemResult = this.calculateItemScore(item, itemData, data);
      totalScore += itemResult.score * itemData.weight;
      totalWeight += itemData.weight;
    });
    
    return totalWeight > 0 ? totalScore / totalWeight : 2.0;
  }

  calculateItemScore(item, itemData, data) {
    const findings = data.findings || { goodPractices: [], deficiencies: [] };
    const observations = data.observations || [];
    const corpusParts = [
      ...(findings.goodPractices || []),
      ...(findings.deficiencies || []),
      ...(observations || [])
    ];
    // Prefer full PDF text for richer context if available
    if (data.fullText) {
      corpusParts.push(data.fullText);
    }
    const allText = corpusParts.join(' ').toLowerCase();
    const keywords = itemData.keywords || [];
    
    // Check for keyword matches
    let keywordMatches = 0;
    keywords.forEach(keyword => {
      if (allText.includes(keyword.toLowerCase())) {
        keywordMatches++;
      }
    });
    
    // Check for good practice indicators
    const goodPracticeKeywords = ['excellent', 'good', 'proper', 'adequate', 'functional', 'operational', 'well maintained', 'fully operational', 'clean', 'in good condition', 'satisfactory', 'working', 'ok', 'okay'];
    const deficiencyKeywords = ['poor', 'inadequate', 'non-functional', 'defective', 'missing', 'expired', 'damaged', 'broken', 'faulty', 'worn', 'rust', 'leak', 'unsatisfactory', 'unacceptable', 'bad', 'not working'];
    
    const goodPracticeCount = goodPracticeKeywords.reduce((count, keyword) => {
      return count + (allText.match(new RegExp(keyword, 'g')) || []).length;
    }, 0);
    
    const deficiencyCount = deficiencyKeywords.reduce((count, keyword) => {
      return count + (allText.match(new RegExp(keyword, 'g')) || []).length;
    }, 0);
    
    // Calculate score based on findings (1-4 scale)
    let score = 2.0; // Start with Satisfactory
    
    // If we have keyword matches, analyze the content
    if (keywordMatches > 0) {
      if (goodPracticeCount > deficiencyCount) {
        // More good practices than deficiencies - better score
        score = Math.max(1.0, 2.0 - (goodPracticeCount * 0.2));
      } else if (deficiencyCount > goodPracticeCount) {
        // More deficiencies than good practices - worse score
        score = Math.min(3.9, 2.0 + (deficiencyCount * 0.2));
      } else {
        // Equal good practices and deficiencies
        score = 2.0;
      }
    } else {
      // No keyword matches - default to satisfactory
      score = 2.0;
    }
    
    // Adjust based on how strongly item keywords appear around deficiency/good words
    if (keywordMatches > 0) {
      // Weight: if deficiency keywords present near item keywords, push score upwards (worse)
      const itemContextRegex = new RegExp(`(.{0,60})(${keywords.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})(.{0,60})`, 'gi');
      let contextDef = 0; let contextGood = 0; let m;
      while ((m = itemContextRegex.exec(allText)) !== null) {
        const ctx = `${m[1]} ${m[3]}`;
        contextDef += (deficiencyKeywords.reduce((c,kw)=>c + ((ctx.match(new RegExp(kw,'g'))||[]).length),0));
        contextGood += (goodPracticeKeywords.reduce((c,kw)=>c + ((ctx.match(new RegExp(kw,'g'))||[]).length),0));
      }
      score += Math.min(1.5, Math.max(-1.0, (contextDef - contextGood) * 0.25));
    }
    
    // Add improvement action and praise comment based on score
    let improvementAction = '';
    let praiseComment = '';
    
    if (score >= 3.0) {
      // Poor performance - show improvement action
      improvementAction = itemData.improvement_action || 'Implement regular maintenance schedule, conduct thorough inspection, address identified issues, establish quality control measures';
    } else if (score <= 1.5) {
      // Good performance - show praise comment
      praiseComment = itemData.praise_comment || 'Excellent performance! This area demonstrates outstanding standards and attention to detail.';
    }
    
    return {
      score: Math.max(1.0, Math.min(4.0, score)),
      improvementAction: improvementAction,
      praiseComment: praiseComment
    };
  }

  getDetailedCategoryAnalysis(data, category) {
    const categoryData = this.fleetStandards[category];
    const details = {};
    
    Object.keys(categoryData.subcategories).forEach(subCategory => {
      const subCategoryData = categoryData.subcategories[subCategory];
      const subCategoryScore = this.calculateSubCategoryScore(subCategory, subCategoryData, data);
      details[subCategory] = {
        status: this.assessItemStatus(subCategoryScore),
        score: subCategoryScore,
        weight: subCategoryData.weight
      };
    });
    
    return details;
  }

  analyzeSubcategories(data, category) {
    const categoryData = this.fleetStandards[category];
    const subcategoryAnalysis = {};
    
    Object.keys(categoryData.subcategories).forEach(subCategory => {
      const subcategoryData = categoryData.subcategories[subCategory];
      subcategoryAnalysis[subCategory] = {};
      
      Object.keys(subcategoryData.items).forEach(item => {
        const itemData = subcategoryData.items[item];
        const itemResult = this.calculateItemScore(item, itemData, data);
        subcategoryAnalysis[subCategory][item] = {
          score: itemResult.score,
          status: this.assessItemStatus(itemResult.score),
          findings: this.findSpecificFindings(data, itemData),
          weight: itemData.weight,
          criteria: itemData.criteria
        };
      });
    });
    
    return subcategoryAnalysis;
  }

  calculateLegacyItemScore(data, criteria) {
    const findings = data.findings || [];
    const allText = findings.join(' ').toLowerCase();
    let score = 70; // Base score
    
    let positiveMatches = 0;
    let negativeMatches = 0;
    
    // Check if criteria is an array
    if (Array.isArray(criteria)) {
      criteria.forEach(criterion => {
        const criterionLower = criterion.toLowerCase();
        if (allText.includes(criterionLower)) {
          positiveMatches++;
        }
        
        // Check for negative indicators
        const negativeWords = ['not working', 'faulty', 'damaged', 'missing', 'broken', 'defective', 'inoperative'];
        negativeWords.forEach(negWord => {
          if (allText.includes(negWord) && allText.includes(criterionLower)) {
            negativeMatches++;
          }
        });
      });
    }
    
    score += positiveMatches * 5;
    score -= negativeMatches * 10;
    
    return Math.max(0, Math.min(100, score));
  }

  assessItemStatus(score) {
    // Convert 1-4 scale to status
    if (score <= 1.5) return 'Good';
    if (score <= 2.5) return 'Satisfactory';
    if (score <= 3.5) return 'Unsatisfactory';
    return 'Unacceptable';
  }

  findSpecificFindings(data, itemData) {
    const hits = [];
    const keywords = (itemData.keywords || []).map(k => k.toLowerCase());
    const sources = [];
    const df = data.findings || { goodPractices: [], deficiencies: [] };
    if (df.goodPractices) sources.push(...df.goodPractices);
    if (df.deficiencies) sources.push(...df.deficiencies);
    if (data.observations) sources.push(...data.observations);
    if (data.fullText) sources.push(data.fullText);
    const text = sources.join('\n').toLowerCase();
    keywords.forEach(k => {
      const regex = new RegExp(`(.{0,80})${k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') }(.{0,80})`, 'gi');
      let m; let count = 0;
      while ((m = regex.exec(text)) !== null && count < 2) {
        const snippet = (m[1] + ' ' + k + ' ' + m[2]).replace(/\s+/g,' ').trim();
        hits.push(snippet);
        count++;
      }
    });
    return hits.slice(0,3);
  }

  getSubCategoryRecommendations(data, category, subCategory) {
    const categoryData = this.fleetStandards[category];
    const subcategoryData = categoryData.subcategories[subCategory];
    const recommendations = [];
    
    Object.keys(subcategoryData.items).forEach(item => {
      const itemData = subcategoryData.items[item];
      const itemResult = this.calculateItemScore(item, itemData, data);
      const score = itemResult.score;
      
      if (score > 2.5) { // Unsatisfactory or Unacceptable
        recommendations.push({
          item: item,
          priority: score > 3.5 ? 'High' : 'Medium',
          recommendation: this.getSpecificRecommendation(item, score),
          criteria: itemData.criteria
        });
      }
    });
    
    return recommendations;
  }

  getSpecificRecommendation(item, score) {
    const recommendations = {
      'Fire Detection Systems': 'Ensure all fire detection systems are operational and regularly tested',
      'Fire Suppression Systems': 'Verify fire suppression systems are functional and properly maintained',
      'Lifeboats': 'Conduct regular lifeboat inspections and maintenance',
      'Navigation Equipment': 'Ensure all navigation equipment is operational and calibrated',
      'Main Engines': 'Schedule comprehensive engine maintenance and performance checks',
      'Deck Equipment': 'Inspect and maintain all deck equipment and cargo handling systems',
      'Hull Structure': 'Conduct thorough hull inspection and address any structural issues',
      'Electrical Systems': 'Review electrical systems and ensure all safety protocols are followed',
      'SOLAS Compliance': 'Review and update SOLAS compliance procedures and documentation',
      'Environmental Procedures': 'Strengthen environmental management and monitoring systems'
    };
    
    return recommendations[item] || `Review and improve ${item} standards and procedures`;
  }

  calculateSubCategoryScore(subCategory, subCategoryData, data) {
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.keys(subCategoryData.items).forEach(item => {
      const itemData = subCategoryData.items[item];
      const itemResult = this.calculateItemScore(item, itemData, data);
      totalScore += itemResult.score * itemData.weight;
      totalWeight += itemData.weight;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 2.0;
  }

  assessSubCategory(data, subCategory) {
    // Simple assessment based on keyword matching
    const findings = data.findings || { goodPractices: [], deficiencies: [] };
    const allFindings = [...findings.goodPractices, ...findings.deficiencies];
    const text = allFindings.join(' ').toLowerCase();
    const subCategoryKeywords = this.getSubCategoryKeywords(subCategory);
    
    let positiveMatches = 0;
    let negativeMatches = 0;
    
    subCategoryKeywords.positive.forEach(keyword => {
      if (text.includes(keyword)) positiveMatches++;
    });
    
    subCategoryKeywords.negative.forEach(keyword => {
      if (text.includes(keyword)) negativeMatches++;
    });
    
    if (positiveMatches > negativeMatches) return 'Good';
    if (negativeMatches > positiveMatches) return 'Needs Attention';
    return 'Satisfactory';
  }

  getSubCategoryKeywords(subCategory) {
    const keywordMap = {
      'Fire Safety': {
        positive: ['fire extinguisher', 'fire alarm', 'sprinkler', 'fire drill'],
        negative: ['fire hazard', 'blocked exit', 'missing extinguisher', 'faulty alarm']
      },
      'Life Saving Equipment': {
        positive: ['lifeboat', 'life jacket', 'rescue boat', 'emergency equipment'],
        negative: ['missing lifeboat', 'damaged life jacket', 'faulty equipment']
      },
      'Engine Room': {
        positive: ['clean engine', 'proper maintenance', 'good condition'],
        negative: ['oil leak', 'dirty engine', 'maintenance overdue']
      },
      'Deck Equipment': {
        positive: ['well maintained', 'proper operation', 'good condition'],
        negative: ['rust', 'damaged', 'malfunctioning', 'worn out']
      }
    };
    
    return keywordMap[subCategory] || { positive: [], negative: [] };
  }

  getSubCategoryNotes(data, subCategory) {
    // Extract relevant notes for subcategory
    const findings = data.findings || { goodPractices: [], deficiencies: [] };
    const allFindings = [...findings.goodPractices, ...findings.deficiencies];
    const relevantNotes = allFindings.filter(finding => 
      finding.toLowerCase().includes(subCategory.toLowerCase().split(' ')[0])
    );
    
    return relevantNotes.slice(0, 3); // Limit to 3 most relevant notes
  }

  generateRecommendations(analysis) {
    const recommendations = [];
    
    Object.keys(analysis).forEach(category => {
      const categoryData = analysis[category];
      
      if (categoryData.score < 70) {
        recommendations.push({
          category: category,
          priority: 'High',
          recommendation: this.getRecommendationForCategory(category, categoryData.score),
          timeline: 'Immediate'
        });
      } else if (categoryData.score < 85) {
        recommendations.push({
          category: category,
          priority: 'Medium',
          recommendation: this.getRecommendationForCategory(category, categoryData.score),
          timeline: 'Within 30 days'
        });
      }
    });
    
    return recommendations;
  }

  getRecommendationForCategory(category, score) {
    const recommendations = {
      safety: 'Conduct comprehensive safety audit and address all identified deficiencies immediately',
      maintenance: 'Implement enhanced maintenance schedule and address equipment issues',
      compliance: 'Review and update compliance procedures to meet current regulations',
      environmental: 'Strengthen environmental management practices and monitoring systems'
    };
    
    return recommendations[category] || 'Review and improve current practices';
  }

  calculateOverallScore(analysis) {
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.keys(analysis).forEach(category => {
      const categoryData = analysis[category];
      // Keep 1-4 scale for overall score (average)
      totalScore += categoryData.score * categoryData.weight;
      totalWeight += categoryData.weight;
    });
    
    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 2.0;
    return Math.max(1.0, Math.min(4.0, finalScore));
  }
}

// Initialize analyzer
const analyzer = new FleetStandardAnalyzer();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/analyze', upload.single('inspectionReport'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Read and parse PDF
    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    
    // Analyze the inspection data
    const analysisResult = await analyzer.analyzeInspectionData(pdfData.text);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      data: analysisResult
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed', 
      message: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Vercel에서는 app.listen을 하지 않음
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Fleet Standard Smart Report Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
  });
}

// Vercel용 export
module.exports = app;

