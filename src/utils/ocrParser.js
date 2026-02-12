// Parse Pakistani electricity bill text - EXACT CAPTIALIZATION MATCHING
// Works with LESCO, MEPCO, GEPCO bills - NO HARDCODED DEFAULTS
export const parsePakistaniBillText = (text) => {
  console.log("========== OCR PARSER STARTED ==========");
  console.log("Original OCR Text Sample:", text?.substring(0, 300) + "...");
  
  // NEVER convert to lowercase - we need exact capitalization!
  // Just clean up extra spaces
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Initialize ALL fields as EMPTY STRINGS - NO DEFAULTS EVER!
  const result = {
    // Core fields
    units: '',
    tariffRate: '',
    baseCost: '',
    totalCharges: '',
    payableWithinDueDate: '',
    
    // Additional charges
    fuelAdjustment: '',
    fcSurcharge: '',
    quarterlyAdjustment: '',
    meterRent: '',
    serviceRent: '',
    electricityDuty: '',
    gst: '',
    
    // Metadata
    billMonth: '',
    company: '',
    
    // Detection status - for UI to know what was found
    detectionStatus: {
      units: false,
      baseCost: false,
      fuelAdjustment: false,
      fcSurcharge: false,
      quarterlyAdjustment: false,
      meterRent: false,
      serviceRent: false,
      payableWithinDueDate: false,
      tariffRate: false,
      totalCharges: false
    }
  };

  // ============ 1. DETECT COMPANY ============
  if (cleanText.includes('LAHORE ELECTRIC SUPPLY COMPANY') || cleanText.includes('LESCO')) {
    result.company = 'LESCO';
  } else if (cleanText.includes('MULTAN ELECTRIC POWER COMPANY') || cleanText.includes('MEPCO')) {
    result.company = 'MEPCO';
  } else if (cleanText.includes('GUJRANWALA ELECTRIC POWER COMPANY') || cleanText.includes('GEPCO')) {
    result.company = 'GEPCO';
  }
  console.log("🏢 Company:", result.company || 'NOT DETECTED');

  // ============ 2. EXTRACT UNITS CONSUMED ============
  // EXACT MATCH: "UNIT CONSUMED" in CAPS - DO NOT lowercase!
  const unitPatterns = [
    /UNIT\s+CONSUMED\s*[:\s]*(\d{1,5})/i,
    /UNIT\s+CONSUMED\s*\n\s*(\d{1,5})/i,
    /UNIT\s+CONSUMED.*?(\d{1,5})/i,
    /UNITS\s+CONSUMED\s*[:\s]*(\d{1,5})/i,
    /CONSUMED\s*[:\s]*(\d{1,5})/i
  ];

  for (const pattern of unitPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.units = match[1].replace(/,/g, '');
      result.detectionStatus.units = true;
      console.log(`✅ UNITS CONSUMED: ${result.units}`);
      break;
    }
  }

  // If not found, try monthly table (NOV-23 140)
  if (!result.units) {
    const monthPattern = /(NOV|DEC|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT)[-\s]*(\d{2})[-\s]*(\d+)/gi;
    const matches = [...cleanText.matchAll(monthPattern)];
    if (matches.length > 0) {
      // Get the last entry (most recent month)
      const lastMatch = matches[matches.length - 1];
      result.units = lastMatch[3].replace(/,/g, '');
      result.detectionStatus.units = true;
      console.log(`✅ UNITS from table: ${result.units}`);
    }
  }

  // ============ 3. EXTRACT COST OF ELECTRICITY ============
  const costPatterns = [
    /COST\s+OF\s+ELECTRICITY\s*[:\s]*([\d,]+\.?\d*)/i,
    /COST\s+OF\s+ELECTRICITY\s*\n\s*([\d,]+\.?\d*)/i,
    /COST\s+OF\s+ELECTRICITY.*?([\d,]+\.?\d*)/i,
    /ELECTRICITY\s+CHARGES?\s*[:\s]*([\d,]+\.?\d*)/i
  ];

  for (const pattern of costPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.baseCost = match[1].replace(/,/g, '');
      result.detectionStatus.baseCost = true;
      console.log(`✅ COST OF ELECTRICITY: ${result.baseCost}`);
      break;
    }
  }

  // ============ 4. EXTRACT FUEL PRICE ADJUSTMENT ============
  const fpaPatterns = [
    /FUEL\s+PRICE\s+ADJUSTMENT\s*[:\s]*([\d,]+\.?\d*)/i,
    /FUEL\s+PRICE\s+ADJUSTMENT\s*\n\s*([\d,]+\.?\d*)/i,
    /FUEL\s+PRICE\s+ADJUSTMENT.*?([\d,]+\.?\d*)/i,
    /FPA[:\s]*([\d,]+\.?\d*)/i,
    /TOTAL\s+FPA\s*[:\s]*([\d,]+\.?\d*)/i
  ];

  for (const pattern of fpaPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.fuelAdjustment = match[1].replace(/,/g, '');
      result.detectionStatus.fuelAdjustment = true;
      console.log(`✅ FUEL PRICE ADJUSTMENT: ${result.fuelAdjustment}`);
      break;
    }
  }

  // ============ 5. EXTRACT F.C SURCHARGE ============
  const fcPatterns = [
    /F\.?\s*C\.?\s+SURCHARGE\s*[:\s]*([\d,]+\.?\d*)/i,
    /F\.C\s+SURCHARGE\s*\n\s*([\d,]+\.?\d*)/i,
    /F\.C\s+SURCHARGE.*?([\d,]+\.?\d*)/i,
    /FC\s+SURCHARGE\s*[:\s]*([\d,]+\.?\d*)/i
  ];

  for (const pattern of fcPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.fcSurcharge = match[1].replace(/,/g, '');
      result.detectionStatus.fcSurcharge = true;
      console.log(`✅ F.C SURCHARGE: ${result.fcSurcharge}`);
      break;
    }
  }

  // ============ 6. EXTRACT QUARTERLY TARIFF ADJUSTMENT ============
  const qtaPatterns = [
    /QUARTERLY\s+TARIFF\s+ADJUSTMENT\s*[:\s]*([\d,]+\.?\d*)/i,
    /QUARTERLY\s+TARIFF\s+ADJUSTMENT\s*\n\s*([\d,]+\.?\d*)/i,
    /QUARTERLY\s+TARIFF\s+ADJUSTMENT.*?([\d,]+\.?\d*)/i,
    /QUARTERLY\s+TRF\s+ADJUSTMENT\s*[:\s]*([\d,]+\.?\d*)/i,
    /QTR\s+TARRIF\s+ADJ\/DMC\s*[:\s]*([\d,]+\.?\d*)/i
  ];

  for (const pattern of qtaPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.quarterlyAdjustment = match[1].replace(/,/g, '');
      result.detectionStatus.quarterlyAdjustment = true;
      console.log(`✅ QUARTERLY TARIFF ADJUSTMENT: ${result.quarterlyAdjustment}`);
      break;
    }
  }

  // ============ 7. EXTRACT METER RENT ============
  const meterPatterns = [
    /METER\s+RENT\s*[:\s]*([\d,]+\.?\d*)/i,
    /METER\s+RENT\s*\n\s*([\d,]+\.?\d*)/i,
    /METER\s+RENT.*?([\d,]+\.?\d*)/i
  ];

  for (const pattern of meterPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1] && match[1] !== '0') {
      result.meterRent = match[1].replace(/,/g, '');
      result.detectionStatus.meterRent = true;
      console.log(`✅ METER RENT: ${result.meterRent}`);
      break;
    }
  }

  // ============ 8. EXTRACT SERVICE RENT ============
  const servicePatterns = [
    /SERVICE\s+RENT\s*[:\s]*([\d,]+\.?\d*)/i,
    /SERVICE\s+RENT\s*\n\s*([\d,]+\.?\d*)/i,
    /SERVICE\s+RENT.*?([\d,]+\.?\d*)/i
  ];

  for (const pattern of servicePatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1] && match[1] !== '0') {
      result.serviceRent = match[1].replace(/,/g, '');
      result.detectionStatus.serviceRent = true;
      console.log(`✅ SERVICE RENT: ${result.serviceRent}`);
      break;
    }
  }

  // ============ 9. EXTRACT ELECTRICITY DUTY ============
  const dutyPatterns = [
    /ELECTRICITY\s+DUTY\s*[:\s]*([\d,]+\.?\d*)/i,
    /DUTY\s*[:\s]*([\d,]+\.?\d*)/i
  ];

  for (const pattern of dutyPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.electricityDuty = match[1].replace(/,/g, '');
      result.detectionStatus.electricityDuty = true;
      console.log(`✅ ELECTRICITY DUTY: ${result.electricityDuty}`);
      break;
    }
  }

  // ============ 10. EXTRACT GST ============
  const gstPatterns = [
    /GST\s*[:\s]*([\d,]+\.?\d*)/i,
    /GENERAL\s+SALES\s+TAX\s*[:\s]*([\d,]+\.?\d*)/i
  ];

  for (const pattern of gstPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.gst = match[1].replace(/,/g, '');
      result.detectionStatus.gst = true;
      console.log(`✅ GST: ${result.gst}`);
      break;
    }
  }

  // ============ 11. EXTRACT PAYABLE WITHIN DUE DATE ============
  // THIS IS THE TOTAL BILL AMOUNT!
  const payablePatterns = [
    /PAYABLE\s+WITHIN\s+DUE\s+DATE\s*[:\s]*([\d,]+\.?\d*)/i,
    /PAYABLE\s+WITHIN\s+DUE\s+DATE\s*\n\s*([\d,]+\.?\d*)/i,
    /PAYABLE\s+WITHIN\s+DUE\s+DATE.*?([\d,]+\.?\d*)/i,
    /WITHIN\s+DUE\s+DATE\s*[:\s]*([\d,]+\.?\d*)/i,
    /TOTAL\s+CHARGES\s*[:\s]*([\d,]+\.?\d*)/i
  ];

  for (const pattern of payablePatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.payableWithinDueDate = match[1].replace(/,/g, '');
      result.totalCharges = result.payableWithinDueDate;
      result.detectionStatus.payableWithinDueDate = true;
      result.detectionStatus.totalCharges = true;
      console.log(`✅ PAYABLE WITHIN DUE DATE: ${result.payableWithinDueDate}`);
      break;
    }
  }

  // ============ 12. EXTRACT TARIFF RATE ============
  // First try from GOP TARIFF X UNITS
  const tariffPatterns = [
    /GOP\s+TARIFF\s+X\s+UNITS\s*([\d.]+)/i,
    /GOP\s+TARIFF\s+X\s+UNITS.*?([\d.]+)\s+X\s+\d+/i,
    /([\d.]+)\s+X\s+\d+/i,
    /RATE[:\s]*([\d.]+)/i
  ];

  for (const pattern of tariffPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.tariffRate = match[1];
      result.detectionStatus.tariffRate = true;
      console.log(`✅ TARIFF RATE: ${result.tariffRate}`);
      break;
    }
  }

  // If not found, calculate from units and base cost
  if (!result.tariffRate && result.units && result.baseCost && parseFloat(result.units) > 0) {
    const rate = (parseFloat(result.baseCost) / parseFloat(result.units)).toFixed(2);
    result.tariffRate = rate;
    result.detectionStatus.tariffRate = true;
    console.log(`✅ TARIFF RATE (calculated): ${result.tariffRate}`);
  }

  // ============ 13. EXTRACT BILL MONTH ============
  const monthPatterns = [
    /BILL\s+MONTH\s*[:\s]*([A-Za-z]+\s*\d{2,4})/i,
    /MONTH[:\s]*([A-Za-z]+\s*\d{2,4})/i
  ];

  for (const pattern of monthPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      result.billMonth = match[1].trim();
      console.log(`✅ BILL MONTH: ${result.billMonth}`);
      break;
    }
  }

  // ============ DETECTION SUMMARY ============
  console.log("\n========== DETECTION SUMMARY ==========");
  const detected = [];
  const missing = [];
  
  Object.entries(result.detectionStatus).forEach(([field, isDetected]) => {
    if (isDetected) {
      detected.push(field);
    } else {
      missing.push(field);
    }
  });
  
  console.log("✅ DETECTED FIELDS:", detected.length ? detected.join(', ') : 'None');
  console.log("❌ MISSING FIELDS:", missing.length ? missing.join(', ') : 'None');
  console.log("========================================\n");

  return result;
};