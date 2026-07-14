// Amazon Sponsored Products Validation Rules

export const AMAZON_RULES = {
  campaignBudget: {
    min: 1,
    max: 100000,
    message: "Campaign budget must be between $1 and $100,000",
  },
  adGroupBid: {
    min: 0.02,
    max: 49,
    message: "Ad group default bid must be at least $0.02",
  },
  keywordBid: {
    min: 0.02,
    max: 49,
    message: "Keyword bid must be between $0.02 and $49",
  },
  targetBid: {
    min: 0.02,
    max: 49,
    message: "Target bid must be between $0.02 and $49",
  },
  placementMultiplier: {
    min: 0,
    max: 900,
    message: "Placement bid multiplier cannot exceed 900%",
  },
};

export const AMAZON_PLACEMENT_OPTIONS = [
  "Top of Search",
  "Rest of Search",
  "Product Pages",
];

export function validateAmazonBudget(
  budget: number
): { valid: boolean; error?: string } {
  if (budget < AMAZON_RULES.campaignBudget.min) {
    return { valid: false, error: AMAZON_RULES.campaignBudget.message };
  }

  if (budget > AMAZON_RULES.campaignBudget.max) {
    return { valid: false, error: AMAZON_RULES.campaignBudget.message };
  }

  return { valid: true };
}

export function validateAmazonBid(
  bid: number,
  bidType: "adGroup" | "keyword" | "target" = "keyword"
): { valid: boolean; error?: string } {
  const rules = 
    bidType === "adGroup" ? AMAZON_RULES.adGroupBid :
    bidType === "target" ? AMAZON_RULES.targetBid :
    AMAZON_RULES.keywordBid;

  if (bid < rules.min || bid > rules.max) {
    return { valid: false, error: rules.message };
  }

  return { valid: true };
}

export function validateAmazonPlacementMultiplier(
  multiplier: number
): { valid: boolean; error?: string } {
  if (multiplier < AMAZON_RULES.placementMultiplier.min || 
      multiplier > AMAZON_RULES.placementMultiplier.max) {
    return { valid: false, error: AMAZON_RULES.placementMultiplier.message };
  }

  return { valid: true };
}
