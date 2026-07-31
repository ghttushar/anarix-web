// Walmart Sponsored Products Validation Rules

export const WALMART_3P_RULES = {
  dailyBudget: {
    min: 10,
    max: 100000,
    message: "Daily budget must be at least $10",
  },
  totalBudget: {
    min: 50,
    max: 1000000,
    message: "Total budget must be at least $50",
  },
  autoBid: {
    min: 0.20,
    max: 49,
    message: "Auto campaign bid must be between $0.20 and $49",
  },
  manualBid: {
    min: 0.30,
    max: 49,
    message: "Manual campaign bid must be between $0.30 and $49",
  },
  sbBid: {
    min: 0.50,
    max: 49,
    message: "Sponsored Brand bid must be between $0.50 and $49",
  },
  svBid: {
    min: 0.80,
    max: 49,
    message: "Sponsored Video bid must be between $0.80 and $49",
  },
  bidMultiplier: {
    min: 0,
    max: 1000,
    message: "Bid multiplier cannot exceed 1000%",
  },
};

export const WALMART_1P_RULES = {
  dailyBudget: {
    min: 50,
    max: 100000,
    message: "Daily budget must be at least $50 for 1P",
  },
  totalBudget: {
    min: 100,
    max: 1000000,
    message: "Total budget must be at least $100 for 1P",
  },
};

export const WALMART_PLACEMENT_OPTIONS = [
  "Search Ingrid",
  "Buy-Box",
  "Home Page",
  "Stock up",
];

export const WALMART_PLATFORM_OPTIONS = ["Desktop", "Mobile", "App"];

export function validateWalmartBudget(
  dailyBudget: number,
  totalBudget: number,
  is1P: boolean = false
): { valid: boolean; error?: string } {
  const rules = is1P ? WALMART_1P_RULES : WALMART_3P_RULES;

  if (dailyBudget < rules.dailyBudget.min) {
    return { valid: false, error: rules.dailyBudget.message };
  }

  if (totalBudget < rules.totalBudget.min) {
    return { valid: false, error: rules.totalBudget.message };
  }

  if (dailyBudget >= totalBudget) {
    return { valid: false, error: "Daily budget must be less than total budget" };
  }

  return { valid: true };
}

export function validateWalmartBid(
  bid: number,
  campaignType: "auto" | "manual" | "sb" | "sv"
): { valid: boolean; error?: string } {
  const rules = WALMART_3P_RULES;
  const bidRules = 
    campaignType === "auto" ? rules.autoBid :
    campaignType === "manual" ? rules.manualBid :
    campaignType === "sb" ? rules.sbBid :
    rules.svBid;

  if (bid < bidRules.min || bid > bidRules.max) {
    return { valid: false, error: bidRules.message };
  }

  return { valid: true };
}
