// API types matching Python backend
export interface Constraints {
  digits?: number;
  rows?: number;
  allowBorrow?: boolean;
  allowCarry?: boolean;
  minAnswer?: number;
  maxAnswer?: number;
  dividendDigits?: number;
  divisorDigits?: number;
  multiplicandDigits?: number;
  multiplierDigits?: number;
  rootDigits?: number;  // For square root and cube root (3-6 digits)
  percentageMin?: number;  // For percentage: minimum percentage (1-100)
  percentageMax?: number;  // For percentage: maximum percentage (1-100)
  numberDigits?: number;  // For percentage: digits for the number (1-10, default 4)
  // Vedic Maths constraints
  base?: number;  // For subtraction (100, 1000, etc) and special products
  firstDigits?: number;  // For addition: digits of first number
  secondDigits?: number;  // For addition: digits of second number
  multiplier?: number;  // For multiply by 12-19
  multiplierRange?: number;  // For multiply by 21-91
  divisor?: number;  // For divide by single digit
  tableNumber?: number;  // For tables
}

export type QuestionType = 
  | "addition" | "subtraction" | "add_sub" | "multiplication" | "division" | "square_root" | "cube_root" 
  | "decimal_multiplication" | "lcm" | "gcd" | "integer_add_sub" | "decimal_division" | "decimal_add_sub" 
  | "direct_add_sub" | "small_friends_add_sub" | "big_friends_add_sub" | "percentage"
  | "vedic_multiply_by_11" | "vedic_multiply_by_101" | "vedic_subtraction_complement" | "vedic_subtraction_normal"
  | "vedic_multiply_by_12_19" | "vedic_special_products_base_100" | "vedic_special_products_base_50"
  | "vedic_multiply_by_21_91" | "vedic_addition" | "vedic_multiply_by_2" | "vedic_multiply_by_4"
  | "vedic_divide_by_2" | "vedic_divide_by_4" | "vedic_divide_single_digit" | "vedic_multiply_by_6"
  | "vedic_divide_by_11" | "vedic_squares_base_10" | "vedic_squares_base_100" | "vedic_squares_base_1000" | "vedic_tables";

export interface BlockConfig {
  id: string;
  type: QuestionType;
  count: number;
  constraints: Constraints;
  title?: string;
}

export interface PaperConfig {
  level: "Custom" | "Junior" | "AB-1" | "AB-2" | "AB-3" | "AB-4" | "AB-5" | "AB-6" | "AB-7" | "AB-8" | "AB-9" | "AB-10" | "Advanced" | "Vedic-Level-1" | "Vedic-Level-2" | "Vedic-Level-3" | "Vedic-Level-4";
  title: string;
  totalQuestions: "10" | "20" | "30" | "50" | "100";
  blocks: BlockConfig[];
  orientation: "portrait" | "landscape";
}

export interface Question {
  id: number;
  text: string;
  operands: number[];
  operator: string;
  operators?: string[];  // For mixed operations: list of operators for each operand (except first)
  answer: number;  // Can be float for decimal operations
  isVertical: boolean;
}

export interface GeneratedBlock {
  config: BlockConfig;
  questions: Question[];
}

export interface PreviewResponse {
  blocks: GeneratedBlock[];
  seed: number;
}

// Use same API base as userApi for consistency
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export async function previewPaper(config: PaperConfig): Promise<PreviewResponse> {
  console.log("=".repeat(60));
  console.log("PREVIEW REQUEST");
  console.log("=".repeat(60));
  console.log("Config:", JSON.stringify(config, null, 2));
  
  const url = `${API_BASE}/papers/preview`;
  console.log("URL:", url);
  console.log("Full URL would be:", window.location.origin + url);
  
  try {
    const requestBody = JSON.stringify(config);
    console.log("Request body length:", requestBody.length);
    
    const res = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: requestBody,
    });
    
    console.log("Response received!");
    console.log("Status:", res.status, res.statusText);
    console.log("Status Text:", res.statusText);
    console.log("OK:", res.ok);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    
    const responseText = await res.text();
    console.log("Response text length:", responseText.length);
    console.log("Response text (first 500 chars):", responseText.substring(0, 500));
    
    if (!res.ok) {
      console.error("Response not OK!");
      let errorMessage = "Failed to preview paper";
      try {
        if (responseText) {
          const errorJson = JSON.parse(responseText);
          console.log("Error JSON:", errorJson);
          if (Array.isArray(errorJson.detail)) {
            errorMessage = errorJson.detail.map((e: any) => 
              `${e.loc?.join('.')}: ${e.msg}`
            ).join(', ');
          } else {
            errorMessage = errorJson.detail || errorJson.message || errorMessage;
          }
        }
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    if (!responseText) {
      throw new Error("Empty response from server");
    }
    
    const data = JSON.parse(responseText);
    console.log("✅ Preview success!");
    console.log("Blocks:", data.blocks?.length || 0);
    console.log("Seed:", data.seed);
    return data;
  } catch (error) {
    console.error("=".repeat(60));
    console.error("PREVIEW ERROR");
    console.error("=".repeat(60));
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error("Stack:", error.stack);
    }
    throw error;
  }
}

export async function generatePdf(
  config: PaperConfig,
  withAnswers: boolean,
  seed?: number,
  generatedBlocks?: GeneratedBlock[],
  answersOnly?: boolean
): Promise<Blob> {
  const res = await fetch(`${API_BASE}/papers/generate-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config, withAnswers, seed, generatedBlocks, answersOnly }),
  });
  if (!res.ok) throw new Error("Failed to generate PDF");
  return res.blob();
}

