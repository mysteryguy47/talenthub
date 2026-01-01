import { useState, useEffect, useRef, DragEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, FileDown, XCircle, GripVertical, Copy, ChevronUp, ChevronDown } from "lucide-react";
import { previewPaper, generatePdf, PaperConfig, BlockConfig, GeneratedBlock } from "@/lib/api";
import MathQuestion from "@/components/MathQuestion";

// Helper function to generate section name based on block settings
function generateSectionName(block: BlockConfig): string {
  if (block.type === "addition") {
    return `Addition ${block.constraints.digits || 2}D ${block.constraints.rows || 2}R`;
  } else if (block.type === "subtraction") {
    return `Subtraction ${block.constraints.digits || 2}D ${block.constraints.rows || 2}R`;
  } else if (block.type === "add_sub") {
    return `Add/Sub ${block.constraints.digits || 2}D ${block.constraints.rows || 2}R`;
  } else if (block.type === "multiplication") {
    const multiplicand = block.constraints.multiplicandDigits || block.constraints.digits || 2;
    const multiplier = block.constraints.multiplierDigits || block.constraints.digits || 1;
    return `Multiplication ${multiplicand}X${multiplier}`;
  } else if (block.type === "division") {
    const dividend = block.constraints.dividendDigits || block.constraints.digits || 2;
    const divisor = block.constraints.divisorDigits || block.constraints.digits || 1;
    return `Division ${dividend}X${divisor}`;
  } else if (block.type === "square_root") {
    const digits = block.constraints.rootDigits ?? 4;  // Default: 4
    return `Square Root (${digits} digits)`;
  } else if (block.type === "cube_root") {
    const digits = block.constraints.rootDigits ?? 5;  // Default: 5
    return `Cube Root (${digits} digits)`;
  } else if (block.type === "decimal_multiplication") {
    const multiplicand = block.constraints.multiplicandDigits || 2;
    const multiplier = block.constraints.multiplierDigits ?? 1;
    const multiplierLabel = multiplier === 0 ? "Whole" : multiplier;
    return `Decimal Multiplication (${multiplicand}×${multiplierLabel})`;
  } else if (block.type === "lcm") {
    const first = block.constraints.multiplicandDigits ?? 2;  // LCM first default: 2
    const second = block.constraints.multiplierDigits ?? 2;  // LCM second default: 2
    return `LCM (${first}×${second} digits)`;
  } else if (block.type === "gcd") {
    const first = block.constraints.multiplicandDigits ?? 3;  // GCD first default: 3
    const second = block.constraints.multiplierDigits ?? 2;  // GCD second default: 2
    return `GCD (${first}×${second} digits)`;
  } else if (block.type === "integer_add_sub") {
    return `Integer Add/Sub ${block.constraints.digits || 2}D ${block.constraints.rows || 3}R`;
  } else if (block.type === "decimal_add_sub") {
    return `Decimal Add/Sub ${block.constraints.digits || 2}D ${block.constraints.rows || 3}R`;
  } else if (block.type === "decimal_division") {
    const multiplicand = block.constraints.multiplicandDigits || 2;
    const multiplier = block.constraints.multiplierDigits || 1;
    return `Decimal Division (${multiplicand}÷${multiplier})`;
  } else if (block.type === "direct_add_sub") {
    return `Direct Add/Sub ${block.constraints.digits || 1}D ${block.constraints.rows || 3}R`;
  } else if (block.type === "small_friends_add_sub") {
    return `Small Friends Add/Sub ${block.constraints.digits || 1}D ${block.constraints.rows || 3}R`;
  } else if (block.type === "big_friends_add_sub") {
    return `Big Friends Add/Sub ${block.constraints.digits || 1}D ${block.constraints.rows || 3}R`;
  } else if (block.type === "percentage") {
    const pctMin = block.constraints.percentageMin ?? 1;
    const pctMax = block.constraints.percentageMax ?? 100;
    const numDigits = block.constraints.numberDigits ?? 4;
    return `Percentage (${pctMin}-${pctMax}%, ${numDigits} digits)`;
  } else if (block.type === "vedic_multiply_by_11") {
    const digits = block.constraints.digits ?? 2;
    return `Multiply by 11 (${digits}D)`;
  } else if (block.type === "vedic_multiply_by_101") {
    const digits = block.constraints.digits ?? 2;
    return `Multiply by 101 (${digits}D)`;
  } else if (block.type === "vedic_subtraction_complement") {
    const base = block.constraints.base ?? 100;
    return `Subtraction Complement (base ${base})`;
  } else if (block.type === "vedic_subtraction_normal") {
    const base = block.constraints.base ?? 100;
    return `Subtraction (base ${base})`;
  } else if (block.type === "vedic_multiply_by_12_19") {
    const digits = block.constraints.digits ?? 2;
    return `Multiply by 12-19 (${digits}D)`;
  } else if (block.type === "vedic_special_products_base_100") {
    return `Special Products (Base 100)`;
  } else if (block.type === "vedic_special_products_base_50") {
    return `Special Products (Base 50)`;
  } else if (block.type === "vedic_multiply_by_21_91") {
    const digits = block.constraints.digits ?? 2;
    return `Multiply by 21-91 (${digits}D)`;
  } else if (block.type === "vedic_addition") {
    const first = block.constraints.firstDigits ?? 2;
    const second = block.constraints.secondDigits ?? 2;
    return `Addition (${first}D + ${second}D)`;
  } else if (block.type === "vedic_multiply_by_2") {
    const digits = block.constraints.digits ?? 2;
    return `Multiply by 2 (${digits}D)`;
  } else if (block.type === "vedic_multiply_by_4") {
    const digits = block.constraints.digits ?? 2;
    return `Multiply by 4 (${digits}D)`;
  } else if (block.type === "vedic_divide_by_2") {
    const digits = block.constraints.digits ?? 2;
    return `Divide by 2 (${digits}D)`;
  } else if (block.type === "vedic_divide_by_4") {
    const digits = block.constraints.digits ?? 2;
    return `Divide by 4 (${digits}D)`;
  } else if (block.type === "vedic_divide_single_digit") {
    const digits = block.constraints.digits ?? 2;
    return `Divide Single Digit (${digits}D)`;
  } else if (block.type === "vedic_multiply_by_6") {
    const digits = block.constraints.digits ?? 2;
    return `Multiply by 6 (${digits}D)`;
  } else if (block.type === "vedic_divide_by_11") {
    const digits = block.constraints.digits ?? 2;
    return `Divide by 11 (${digits}D)`;
  } else if (block.type === "vedic_squares_base_10") {
    return `Squares (Base 10)`;
  } else if (block.type === "vedic_squares_base_100") {
    return `Squares (Base 100)`;
  } else if (block.type === "vedic_squares_base_1000") {
    return `Squares (Base 1000)`;
  } else if (block.type === "vedic_tables") {
    const table = block.constraints.tableNumber ?? "10-99";
    return `Tables (${table})`;
  }
  return `Section`;
}

export default function PaperCreate() {
  const [location, setLocation] = useLocation();
  const isJuniorPage = location === "/create/junior";
  const isAdvancedPage = location === "/create/advanced";
  const isBasicPage = location === "/create/basic";
  const isVedicLevel1 = location === "/vedic-maths/level-1";
  const isVedicLevel2 = location === "/vedic-maths/level-2";
  const isVedicLevel3 = location === "/vedic-maths/level-3";
  const isVedicLevel4 = location === "/vedic-maths/level-4";
  const isVedicPage = isVedicLevel1 || isVedicLevel2 || isVedicLevel3 || isVedicLevel4;
  
  // Redirect old /create route to /create/basic
  useEffect(() => {
    if (location === "/create") {
      setLocation("/create/basic");
    }
  }, [location, setLocation]);
  
  const [title, setTitle] = useState("Math Practice Paper");
  const [level, setLevel] = useState<PaperConfig["level"]>("Custom");
  const [blocks, setBlocks] = useState<BlockConfig[]>([]);
  const [loadingPresets, setLoadingPresets] = useState(false);
  
  // Track previous location to detect section changes
  const previousLocationRef = useRef<string>(location);
  
  // Clear blocks when switching between different sections
  useEffect(() => {
    // Get the section type from location
    const getSectionType = (loc: string): string => {
      if (loc === "/create/basic") return "basic";
      if (loc === "/create/junior") return "junior";
      if (loc === "/create/advanced") return "advanced";
      if (loc === "/vedic-maths/level-1") return "vedic-1";
      if (loc === "/vedic-maths/level-2") return "vedic-2";
      if (loc === "/vedic-maths/level-3") return "vedic-3";
      if (loc === "/vedic-maths/level-4") return "vedic-4";
      return "unknown";
    };
    
    const currentSection = getSectionType(location);
    const prevSection = getSectionType(previousLocationRef.current);
    
    // Clear blocks when switching to a different section (but not on initial mount)
    if (previousLocationRef.current !== location && currentSection !== prevSection && prevSection !== "unknown") {
      setBlocks([]);
      setStep(1);
      setPreviewData(null);
      setValidationErrors({});
    }
    
    previousLocationRef.current = location;
  }, [location]);
  
  // Reset level to Custom when switching to Vedic pages (level selection is now manual via dropdown)
  // No automatic level setting - users select level via dropdown
  
  // Load preset blocks when level changes (but not on initial mount if Custom)
  useEffect(() => {
    // Check if level has presets: AB-1 through AB-10, Junior, Advanced
    const hasPresets = level.startsWith("AB-") || level === "Junior" || level === "Advanced";
    
    // AbortController to cancel in-flight requests when level changes
    const abortController = new AbortController();
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (hasPresets && level !== "Custom") {
      console.log(`🟦 [PRESETS] Loading preset blocks for level: ${level}`);
      setLoadingPresets(true);
      setBlocks([]); // Clear blocks while loading
      // Load preset blocks from backend
      const apiBase = import.meta.env.VITE_API_BASE || "/api";
      const url = `${apiBase}/presets/${level}`;
      console.log(`🟦 [PRESETS] Fetching from: ${url}`);
      
      // Add timeout
      timeoutId = setTimeout(() => {
        console.log(`⏱️ [PRESETS] Request timeout after 10s, aborting...`);
        abortController.abort();
      }, 10000); // 10 second timeout
      
      fetch(url, { signal: abortController.signal })
        .then(async res => {
          if (timeoutId) clearTimeout(timeoutId);
          console.log(`🟦 [PRESETS] Response status: ${res.status} ${res.statusText}`);
          const text = await res.text();
          console.log(`🟦 [PRESETS] Response text (first 200 chars):`, text.substring(0, 200));
          if (!res.ok) {
            throw new Error(`Failed to load presets: ${res.status} ${res.statusText} - ${text}`);
          }
          if (!text) {
            throw new Error("Empty response from server");
          }
          return JSON.parse(text);
        })
        .then(data => {
          // Check if request was aborted
          if (abortController.signal.aborted) {
            console.log(`🟦 [PRESETS] Request was aborted, ignoring response`);
            return;
          }
          
          console.log(`🟦 [PRESETS] Received data:`, data);
          console.log(`🟦 [PRESETS] Received ${data?.length || 0} blocks`);
          if (data && Array.isArray(data) && data.length > 0) {
            // Convert backend format to frontend format
            const convertedBlocks: BlockConfig[] = data.map((block: any) => ({
              id: block.id || `block-${Date.now()}-${Math.random()}`,
              type: block.type,
              count: block.count || 10,
              constraints: {
                digits: block.constraints?.digits,
                rows: block.constraints?.rows,
                allowBorrow: block.constraints?.allowBorrow,
                allowCarry: block.constraints?.allowCarry,
                minAnswer: block.constraints?.minAnswer,
                maxAnswer: block.constraints?.maxAnswer,
                dividendDigits: block.constraints?.dividendDigits,
                divisorDigits: block.constraints?.divisorDigits,
                multiplicandDigits: block.constraints?.multiplicandDigits,
                multiplierDigits: block.constraints?.multiplierDigits,
                rootDigits: block.constraints?.rootDigits,
                percentageMin: block.constraints?.percentageMin,
                percentageMax: block.constraints?.percentageMax,
                numberDigits: block.constraints?.numberDigits,
                // Vedic Maths constraints
                base: block.constraints?.base,
                firstDigits: block.constraints?.firstDigits,
                secondDigits: block.constraints?.secondDigits,
                multiplier: block.constraints?.multiplier,
                multiplierRange: block.constraints?.multiplierRange,
                divisor: block.constraints?.divisor,
                tableNumber: block.constraints?.tableNumber,
              },
              title: block.title || "",
            }));
            console.log(`🟦 [PRESETS] Converted ${convertedBlocks.length} blocks, setting state...`);
            console.log(`🟦 [PRESETS] First block:`, convertedBlocks[0]);
            setBlocks(convertedBlocks);
            console.log(`✅ [PRESETS] Successfully loaded ${convertedBlocks.length} preset blocks`);
          } else {
            console.warn(`⚠️ [PRESETS] No blocks received or empty array for level: ${level}`);
            setBlocks([]);
          }
        })
        .catch(err => {
          if (timeoutId) clearTimeout(timeoutId);
          // Ignore abort errors (they're expected when level changes)
          if (err.name === 'AbortError') {
            console.log(`🟦 [PRESETS] Request aborted (level changed)`);
            return;
          }
          console.error("❌ [PRESETS] Failed to load preset blocks:", err);
          console.error("❌ [PRESETS] Error details:", err.message, err.stack);
          // On error, just keep current blocks (likely empty for first load)
          setBlocks([]);
        })
        .finally(() => {
          if (timeoutId) clearTimeout(timeoutId);
          // Only update loading state if request wasn't aborted
          if (!abortController.signal.aborted) {
            console.log(`🟦 [PRESETS] Loading complete, setting loadingPresets to false`);
            setLoadingPresets(false);
          }
        });
    } else if (level === "Custom") {
      // Clear blocks when switching to Custom
      console.log(`🟦 [PRESETS] Custom level selected, clearing blocks`);
      setBlocks([]);
      setLoadingPresets(false);
    } else {
      setLoadingPresets(false);
    }
    
    // Reset to Custom if on Junior/Advanced page and level is AB-X (but allow Junior/Advanced levels)
    if ((isJuniorPage || isAdvancedPage) && level.startsWith("AB-")) {
      setLevel("Custom");
      setBlocks([]);
      setLoadingPresets(false);
    }
    // Note: Junior and Advanced pages allow their respective preset levels
    
    // Cleanup: abort request if level changes
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [level, isBasicPage, isJuniorPage, isAdvancedPage]);
  const [previewData, setPreviewData] = useState<{ blocks: GeneratedBlock[]; seed: number } | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  // Validation errors: { blockIndex: { fieldName: errorMessage } }
  const [validationErrors, setValidationErrors] = useState<Record<number, Record<string, string>>>({});

  const previewMutation = useMutation({
    mutationFn: previewPaper,
    onSuccess: (data) => {
      console.log("✅ [PREVIEW] Preview generation successful:", data);
      setPreviewData(data);
      setStep(2);
      setShowAnswers(false); // Reset answers visibility when generating new preview
    },
    onError: (error) => {
      console.error("❌ [PREVIEW] Preview generation failed:", error);
      // Error will be displayed in the UI via previewMutation.error
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async ({ withAnswers, answersOnly }: { withAnswers: boolean; answersOnly?: boolean }) => {
      if (!previewData) throw new Error("No preview data");
      const config: PaperConfig = {
        level: level || "Custom",
        title: title || "Math Paper",
        totalQuestions: "20",
        blocks,
        orientation: "portrait",
      };
      const blob = await generatePdf(config, withAnswers, previewData.seed, previewData.blocks, answersOnly);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      let filename = title || "paper";
      if (answersOnly) {
        filename += "_answers_only";
      } else if (withAnswers) {
        filename += "_with_answers";
      }
      a.download = `${filename}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });

  const addBlock = () => {
    // Set default type based on page
    const defaultType: BlockConfig["type"] = isVedicLevel1 
      ? "vedic_multiply_by_11" 
      : isJuniorPage 
        ? "direct_add_sub" 
        : "add_sub";
    
    // Set default constraints based on block type
    const defaultConstraints: any = {
      digits: isJuniorPage ? 1 : 2,
      rows: 5,
      multiplicandDigits: 2,
      multiplierDigits: 1,
      dividendDigits: 2,
      divisorDigits: 1
    };
    
    // Type-specific defaults (only for types that could be defaultType)
    if (defaultType === "vedic_multiply_by_11") {
      defaultConstraints.digits = 2;
    }
    
    const newBlock: BlockConfig = {
      id: `block-${Date.now()}`,
      type: defaultType,
      count: 10,
      constraints: defaultConstraints,
      title: "",
    };
    // Auto-generate title based on settings
    newBlock.title = generateSectionName(newBlock);
    setBlocks([...blocks, newBlock]);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[draggedIndex];
    newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(index, 0, draggedBlock);
    setBlocks(newBlocks);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const updateBlock = (index: number, updates: Partial<BlockConfig>) => {
    const newBlocks = [...blocks];
    const oldBlock = newBlocks[index];
    const updatedBlock = { ...oldBlock, ...updates };
    
    // Auto-set default constraints when type changes
    if (updates.type !== undefined && updates.type !== oldBlock.type) {
      // Initialize constraints if not present
      if (!updatedBlock.constraints) {
        updatedBlock.constraints = {};
      }
      
      // Set default constraints based on block type
      // Always reset rootDigits when switching to/from square_root or cube_root
      if (updates.type === "square_root") {
        updatedBlock.constraints.rootDigits = 4;  // Square root default: 4
      } else if (updates.type === "cube_root") {
        updatedBlock.constraints.rootDigits = 5;  // Cube root default: 5
      } else if (updates.type === "lcm") {
        // Always reset to LCM defaults when switching to LCM
        updatedBlock.constraints.multiplicandDigits = 2;  // LCM first: 2
        updatedBlock.constraints.multiplierDigits = 2;  // LCM second: 2
      } else if (updates.type === "gcd") {
        // Always reset to GCD defaults when switching to GCD
        updatedBlock.constraints.multiplicandDigits = 3;  // GCD first: 3
        updatedBlock.constraints.multiplierDigits = 2;  // GCD second: 2
      } else if (updates.type === "percentage") {
        // Always reset to percentage default when switching to percentage
        updatedBlock.constraints.numberDigits = 4;  // Percentage numberDigits: 4
      } else if (updates.type === "vedic_tables") {
        // Always reset to vedic_tables default when switching to vedic_tables
        updatedBlock.constraints.rows = 10;  // Vedic tables rows: 10
      } else if (updates.type === "vedic_divide_by_11") {
        // Always reset to vedic_divide_by_11 default when switching to it
        updatedBlock.constraints.digits = 3;  // Divide by 11 default: 3
      }
    }
    
    // Auto-generate title when type or constraints change (but preserve user's custom title)
    const oldAutoTitle = generateSectionName(oldBlock);
    const newAutoTitle = generateSectionName(updatedBlock);
    
    // Check if type or constraints changed (excluding title change)
    const typeChanged = updates.type !== undefined && updates.type !== oldBlock.type;
    const constraintsChanged = updates.constraints !== undefined;
    
    // Handle title updates
    if (updates.title !== undefined) {
      // User is explicitly setting the title
      updatedBlock.title = updates.title;
    } else if (typeChanged || constraintsChanged) {
      // Type or constraints changed - auto-regenerate if title was auto-generated
      if (oldBlock.title === oldAutoTitle || !oldBlock.title) {
        updatedBlock.title = newAutoTitle;
      }
      // Otherwise, keep the existing custom title
    }
    
    newBlocks[index] = updatedBlock;
    setBlocks(newBlocks);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const duplicateBlock = (index: number) => {
    const blockToDuplicate = blocks[index];
    const newBlock: BlockConfig = {
      ...blockToDuplicate,
      id: `block-${Date.now()}-${Math.random()}`,
      title: "", // Will be auto-generated by generateSectionName
    };
    // Auto-generate title based on block configuration
    newBlock.title = generateSectionName(newBlock);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
  };

  const moveBlockUp = (index: number) => {
    if (index === 0) return; // Already at top
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(index, 1);
    newBlocks.splice(index - 1, 0, movedBlock);
    setBlocks(newBlocks);
  };

  const moveBlockDown = (index: number) => {
    if (index === blocks.length - 1) return; // Already at bottom
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(index, 1);
    newBlocks.splice(index + 1, 0, movedBlock);
    setBlocks(newBlocks);
  };


  // Set validation error for a specific field
  const setFieldError = (blockIndex: number, fieldName: string, error: string | null) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (!newErrors[blockIndex]) {
        newErrors[blockIndex] = {};
      }
      if (error) {
        newErrors[blockIndex][fieldName] = error;
      } else {
        delete newErrors[blockIndex][fieldName];
        if (Object.keys(newErrors[blockIndex]).length === 0) {
          delete newErrors[blockIndex];
        }
      }
      return newErrors;
    });
  };

  // Get validation error for a specific field
  const getFieldError = (blockIndex: number, fieldName: string): string | null => {
    return validationErrors[blockIndex]?.[fieldName] || null;
  };

  const handlePreview = () => {
    // Title now has a default, so we can skip this check or use the default
    const finalTitle = title.trim() || "Math Practice Paper";
    
    // For Custom level, require blocks. For preset levels, backend will load them if empty
    if (level === "Custom" && blocks.length === 0) {
      alert("Please add at least one question block");
      return;
    }
    
    // Show loading message if presets are still loading
    if (loadingPresets) {
      alert("Please wait while preset blocks are loading...");
      return;
    }
    
    // For preset levels with empty blocks, skip validation - backend will load presets
    const isPresetLevel = level !== "Custom" && (level.startsWith("AB-") || level === "Junior" || level === "Advanced");
    const shouldValidate = !isPresetLevel || blocks.length > 0;
    
    // Validate all blocks (only if we have blocks to validate)
    const errors: Record<number, Record<string, string>> = {};
    let hasErrors = false;
    
    if (shouldValidate && blocks.length > 0) {
      blocks.forEach((block, index) => {
      const blockErrors: Record<string, string> = {};
      
      // Validate count (questions) - except for vedic_tables which uses rows
      if (block.type !== "vedic_tables") {
        if (block.count === undefined || block.count === null || isNaN(block.count)) {
          blockErrors.count = "Questions is required";
          hasErrors = true;
        } else if (block.count < 1 || block.count > 200) {
          blockErrors.count = block.count < 1 ? "Minimum value for Questions is 1" : "Maximum value for Questions is 200";
          hasErrors = true;
        }
      } else {
        // For vedic_tables, validate rows
        const rows = block.constraints.rows;
        if (rows === undefined || rows === null || rows === -1) {
          blockErrors.rows = "Rows is required";
          hasErrors = true;
        } else if (rows < 2 || rows > 100) {
          blockErrors.rows = rows < 2 ? "Minimum value for Rows is 2" : "Maximum value for Rows is 100";
          hasErrors = true;
        }
      }
      
      // Validate based on block type
      if (block.type === "addition" || block.type === "subtraction" || block.type === "add_sub" || 
          block.type === "integer_add_sub" || block.type === "decimal_add_sub" || 
          block.type === "direct_add_sub" || block.type === "small_friends_add_sub" || 
          block.type === "big_friends_add_sub") {
        const digits = block.constraints.digits;
        if (digits !== undefined && digits !== -1) {
          if (digits < 1 || digits > 10) {
            blockErrors.digits = digits < 1 ? "Minimum value for Digits is 1" : "Maximum value for Digits is 10";
            hasErrors = true;
          }
        }
        const rows = block.constraints.rows;
        if (rows !== undefined && rows !== -1) {
          if (rows < 2 || rows > 30) {
            blockErrors.rows = rows < 2 ? "Minimum value for Rows is 2" : "Maximum value for Rows is 30";
            hasErrors = true;
          }
        }
      } else if (block.type === "multiplication" || block.type === "division") {
        const multiplicandDigits = block.type === "multiplication" ? block.constraints.multiplicandDigits : block.constraints.dividendDigits;
        const fieldName = block.type === "multiplication" ? "Multiplicand Digits" : "Dividend Digits";
        if (multiplicandDigits !== undefined && multiplicandDigits !== -1) {
          if (multiplicandDigits < 1 || multiplicandDigits > 20) {
            blockErrors[block.type === "multiplication" ? "multiplicandDigits" : "dividendDigits"] = 
              multiplicandDigits < 1 ? `Minimum value for ${fieldName} is 1` : `Maximum value for ${fieldName} is 20`;
            hasErrors = true;
          }
        }
        const multiplierDigits = block.type === "multiplication" ? block.constraints.multiplierDigits : block.constraints.divisorDigits;
        const fieldName2 = block.type === "multiplication" ? "Multiplier Digits" : "Divisor Digits";
        if (multiplierDigits !== undefined && multiplierDigits !== -1) {
          const min = block.type === "multiplication" ? 1 : 1;
          if (multiplierDigits < min || multiplierDigits > 20) {
            blockErrors[block.type === "multiplication" ? "multiplierDigits" : "divisorDigits"] = 
              multiplierDigits < min ? `Minimum value for ${fieldName2} is ${min}` : `Maximum value for ${fieldName2} is 20`;
            hasErrors = true;
          }
        }
      } else if (block.type === "decimal_multiplication" || block.type === "decimal_division") {
        const multiplicandDigits = block.constraints.multiplicandDigits;
        const fieldName = block.type === "decimal_multiplication" ? "Multiplicand Digits (Before Decimal)" : "Dividend Digits";
        if (multiplicandDigits !== undefined && multiplicandDigits !== -1) {
          if (multiplicandDigits < 1 || multiplicandDigits > 20) {
            blockErrors.multiplicandDigits = multiplicandDigits < 1 ? `Minimum value for ${fieldName} is 1` : `Maximum value for ${fieldName} is 20`;
            hasErrors = true;
          }
        }
        const multiplierDigits = block.constraints.multiplierDigits;
        const fieldName2 = block.type === "decimal_multiplication" ? "Multiplier Digits" : "Divisor Digits";
        if (multiplierDigits !== undefined && multiplierDigits !== -1) {
          const min = block.type === "decimal_multiplication" ? 0 : 1;
          if (multiplierDigits < min || multiplierDigits > 20) {
            blockErrors.multiplierDigits = multiplierDigits < min ? `Minimum value for ${fieldName2} is ${min}` : `Maximum value for ${fieldName2} is 20`;
            hasErrors = true;
          }
        }
      } else if (block.type === "square_root" || block.type === "cube_root") {
        const rootDigits = block.constraints.rootDigits;
        if (rootDigits !== undefined && rootDigits !== -1) {
          const max = block.type === "square_root" ? 30 : 30;
          if (rootDigits < 1 || rootDigits > max) {
            blockErrors.rootDigits = rootDigits < 1 ? "Minimum value for Root Digits is 1" : `Maximum value for Root Digits is ${max}`;
            hasErrors = true;
          }
        }
      } else if (block.type === "lcm" || block.type === "gcd") {
        const multiplicandDigits = block.constraints.multiplicandDigits;
        if (multiplicandDigits !== undefined && multiplicandDigits !== -1) {
          if (multiplicandDigits < 1 || multiplicandDigits > 10) {
            blockErrors.multiplicandDigits = multiplicandDigits < 1 ? "Minimum value for First Number Digits is 1" : "Maximum value for First Number Digits is 10";
            hasErrors = true;
          }
        }
        const multiplierDigits = block.constraints.multiplierDigits;
        if (multiplierDigits !== undefined && multiplierDigits !== -1) {
          if (multiplierDigits < 1 || multiplierDigits > 10) {
            blockErrors.multiplierDigits = multiplierDigits < 1 ? "Minimum value for Second Number Digits is 1" : "Maximum value for Second Number Digits is 10";
            hasErrors = true;
          }
        }
      } else if (block.type === "percentage") {
        const percentageMin = block.constraints.percentageMin;
        if (percentageMin !== undefined && percentageMin !== -1) {
          if (percentageMin < 1 || percentageMin > 100) {
            blockErrors.percentageMin = percentageMin < 1 ? "Minimum value for Percentage Min is 1" : "Maximum value for Percentage Min is 100";
            hasErrors = true;
          }
        }
        const percentageMax = block.constraints.percentageMax;
        if (percentageMax !== undefined && percentageMax !== -1) {
          if (percentageMax < 1 || percentageMax > 100) {
            blockErrors.percentageMax = percentageMax < 1 ? "Minimum value for Percentage Max is 1" : "Maximum value for Percentage Max is 100";
            hasErrors = true;
          }
        }
        // Validate min <= max
        if (percentageMin !== undefined && percentageMin !== -1 && percentageMax !== undefined && percentageMax !== -1 && percentageMin > percentageMax) {
          blockErrors.percentageMin = "Percentage Min cannot be greater than Percentage Max";
          hasErrors = true;
        }
        const numberDigits = block.constraints.numberDigits;
        if (numberDigits !== undefined && numberDigits !== -1) {
          if (numberDigits < 1 || numberDigits > 10) {
            blockErrors.numberDigits = numberDigits < 1 ? "Minimum value for Number Digits is 1" : "Maximum value for Number Digits is 10";
            hasErrors = true;
          }
        }
      }
      
      if (Object.keys(blockErrors).length > 0) {
        errors[index] = blockErrors;
      }
      });
    }
    
    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    
    const config: PaperConfig = {
      level: level || "Custom",
      title: finalTitle,
      totalQuestions: "20",
      blocks: blocks.length > 0 ? blocks.map(b => {
        // Build constraints object with all fields
        // Convert -1 (empty value) to undefined so backend can use defaults
        const constraints: any = {
          rows: b.constraints.rows === -1 ? undefined : b.constraints.rows,
          allowBorrow: b.constraints.allowBorrow,
          allowCarry: b.constraints.allowCarry,
          minAnswer: b.constraints.minAnswer === -1 ? undefined : b.constraints.minAnswer,
          maxAnswer: b.constraints.maxAnswer === -1 ? undefined : b.constraints.maxAnswer,
          multiplicandDigits: b.constraints.multiplicandDigits === -1 ? undefined : b.constraints.multiplicandDigits,
          multiplierDigits: b.constraints.multiplierDigits === -1 ? undefined : b.constraints.multiplierDigits,
          dividendDigits: b.constraints.dividendDigits === -1 ? undefined : b.constraints.dividendDigits,
          divisorDigits: b.constraints.divisorDigits === -1 ? undefined : b.constraints.divisorDigits,
          rootDigits: b.constraints.rootDigits === -1 ? undefined : b.constraints.rootDigits,
          percentageMin: b.constraints.percentageMin === -1 ? undefined : b.constraints.percentageMin,
          percentageMax: b.constraints.percentageMax === -1 ? undefined : b.constraints.percentageMax,
          numberDigits: b.constraints.numberDigits === -1 ? undefined : b.constraints.numberDigits,
          // Vedic Maths constraints
          digits: b.constraints.digits === -1 ? undefined : b.constraints.digits,
          base: b.constraints.base,
          firstDigits: b.constraints.firstDigits,
          secondDigits: b.constraints.secondDigits,
          multiplier: b.constraints.multiplier,
          multiplierRange: b.constraints.multiplierRange,
          divisor: b.constraints.divisor,
          tableNumber: b.constraints.tableNumber,
        };
        
        // Add digits based on question type (for non-vedic operations)
        if (b.type === "addition" || b.type === "subtraction" || b.type === "add_sub" || b.type === "integer_add_sub" || b.type === "direct_add_sub" || b.type === "small_friends_add_sub" || b.type === "big_friends_add_sub") {
          constraints.digits = b.constraints.digits || 2;
        } else {
          // For multiplication/division, digits is optional but provide default for backend
          constraints.digits = b.constraints.digits ?? 2;
        }
        
        return {
          ...b,
          constraints
        };
      }) : [],
      orientation: "portrait",
    };
    
    console.log("🚀 [PREVIEW] Sending preview request:", {
      level: config.level,
      title: config.title,
      blocksCount: config.blocks.length,
      blocks: config.blocks
    });
    
    previewMutation.mutate(config);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-8">
      <div className="container mx-auto px-4 py-8 max-w-[95%] xl:max-w-[1400px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/">
            <button className="group flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Paper
          </h1>
          <div className="w-24"></div>
        </div>

        {step === 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-8">
            {/* Page Title */}
            {isBasicPage && (
              <div className="mb-6 pb-4 border-b-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-800">Basic Operations</h2>
                <p className="text-gray-600 mt-1">Create math papers with basic operations: Addition, Subtraction, Multiplication, and Division</p>
              </div>
            )}
            {isJuniorPage && (
              <div className="mb-6 pb-4 border-b-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-800">Junior Operations</h2>
                <p className="text-gray-600 mt-1">Create math papers for junior level abacus training: Direct Add/Sub, Small Friends, and Big Friends</p>
              </div>
            )}
            {isAdvancedPage && (
              <div className="mb-6 pb-4 border-b-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-800">Advanced Operations</h2>
                <p className="text-gray-600 mt-1">Create math papers with advanced operations: Decimal operations, LCM, GCD, Square Root, Cube Root, and more</p>
              </div>
            )}
            {isVedicPage && (
              <div className="mb-6 pb-4 border-b-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {level === "Custom" 
                    ? "Vedic Maths Operations" 
                    : level === "Vedic-Level-1" 
                      ? "Vedic Maths Level 1"
                      : level === "Vedic-Level-2"
                        ? "Vedic Maths Level 2"
                        : level === "Vedic-Level-3"
                          ? "Vedic Maths Level 3"
                          : level === "Vedic-Level-4"
                            ? "Vedic Maths Level 4"
                            : "Vedic Maths Operations"
                  }
                </h2>
                <p className="text-gray-600 mt-1">
                  {level === "Custom"
                    ? "Create math papers with Vedic Maths operations: Multiplication tricks, division tricks, squares, and special products"
                    : level === "Vedic-Level-1"
                      ? "Create math papers with Vedic Maths Level 1 operations: Multiplication tricks, division tricks, squares, and special products"
                      : `Create math papers with ${level === "Vedic-Level-2" ? "Vedic Maths Level 2" : level === "Vedic-Level-3" ? "Vedic Maths Level 3" : "Vedic Maths Level 4"} operations`
                  }
                </p>
              </div>
            )}
            
            {/* Paper Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Paper Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="Math Practice Paper (editable)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as PaperConfig["level"])}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                >
                  <option value="Custom">Custom</option>
                  {/* Show Abacus levels on Basic page */}
                  {isBasicPage && (
                    <>
                      <option value="AB-1">Abacus-1</option>
                      <option value="AB-2">Abacus-2</option>
                      <option value="AB-3">Abacus-3</option>
                      <option value="AB-4">Abacus-4</option>
                      <option value="AB-5">Abacus-5</option>
                      <option value="AB-6">Abacus-6</option>
                    </>
                  )}
                  {/* Show Abacus-7 through Abacus-10 on Advanced page */}
                  {isAdvancedPage && (
                    <>
                      <option value="AB-7">Abacus-7</option>
                      <option value="AB-8">Abacus-8</option>
                      <option value="AB-9">Abacus-9</option>
                      <option value="AB-10">Abacus-10</option>
                    </>
                  )}
                  {/* Show Vedic Maths levels on Vedic pages */}
                  {isVedicPage && (
                    <>
                      <option value="Vedic-Level-1">Vedic Maths-1</option>
                      <option value="Vedic-Level-2">Vedic Maths-2</option>
                      <option value="Vedic-Level-3">Vedic Maths-3</option>
                      <option value="Vedic-Level-4">Vedic Maths-4</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Blocks Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Question Blocks</h2>
                  {blocks.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Total Questions: <span className="font-bold text-blue-600">{blocks.reduce((sum, block) => sum + block.count, 0)}</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={addBlock}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Add Block
                </button>
              </div>

              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-gradient-to-br from-gray-50 to-blue-50/30 border-2 rounded-xl p-6 space-y-4 transition-all cursor-move ${
                      draggedIndex === index
                        ? "border-blue-500 shadow-lg opacity-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-gray-500 w-8 text-center">{index + 1}.</span>
                          <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                        </div>
                        <input
                          type="text"
                          value={block.title || ""}
                          onChange={(e) => updateBlock(index, { title: e.target.value })}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white font-semibold"
                          placeholder="Section title"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Move Up Button */}
                        <button
                          onClick={() => moveBlockUp(index)}
                          disabled={index === 0}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        {/* Move Down Button */}
                        <button
                          onClick={() => moveBlockDown(index)}
                          disabled={index === blocks.length - 1}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {/* Duplicate Button */}
                        <button
                          onClick={() => duplicateBlock(index)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex-shrink-0"
                          title="Duplicate block"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {/* Add Block Below Button */}
                        <button
                          onClick={() => {
                            const defaultType: BlockConfig["type"] = isVedicLevel1 
                              ? "vedic_multiply_by_11" 
                              : isJuniorPage 
                                ? "direct_add_sub" 
                                : "add_sub";
                            
                            // Set default constraints based on block type
                            const defaultConstraints: any = {
                              digits: isJuniorPage ? 1 : 2,
                              rows: 5,
                              multiplicandDigits: 2,
                              multiplierDigits: 1,
                              dividendDigits: 2,
                              divisorDigits: 1
                            };
                            
                            // Type-specific defaults (only for types that could be defaultType)
                            if (defaultType === "vedic_multiply_by_11") {
                              defaultConstraints.digits = 2;
                            }
                            
                            const newBlock: BlockConfig = {
                              id: `block-${Date.now()}`,
                              type: defaultType,
                              count: 10,
                              constraints: defaultConstraints,
                              title: "",
                            };
                            newBlock.title = generateSectionName(newBlock);
                            const newBlocks = [...blocks];
                            newBlocks.splice(index + 1, 0, newBlock);
                            setBlocks(newBlocks);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex-shrink-0"
                          title="Add block below"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        {/* Delete Button */}
                      <button
                        onClick={() => removeBlock(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          title="Delete block"
                      >
                          <Trash2 className="w-4 h-4" />
                      </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={block.type}
                          onChange={(e) => {
                            const newType = e.target.value as BlockConfig["type"];
                            updateBlock(index, { type: newType });
                          }}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                        >
                          {/* Show operations based on page route */}
                          {isVedicLevel1 ? (
                            <>
                              <optgroup label="Multiplication">
                                <option value="vedic_multiply_by_11">Multiply by 11</option>
                                <option value="vedic_multiply_by_101">Multiply by 101</option>
                                <option value="vedic_multiply_by_12_19">Multiply by 12-19</option>
                                <option value="vedic_multiply_by_21_91">Multiply by 21-91</option>
                                <option value="vedic_multiply_by_2">Multiply by 2</option>
                                <option value="vedic_multiply_by_4">Multiply by 4</option>
                                <option value="vedic_multiply_by_6">Multiply by 6</option>
                              </optgroup>
                              <optgroup label="Division">
                                <option value="vedic_divide_by_2">Divide by 2</option>
                                <option value="vedic_divide_by_4">Divide by 4</option>
                                <option value="vedic_divide_single_digit">Divide Single Digit</option>
                                <option value="vedic_divide_by_11">Divide by 11</option>
                              </optgroup>
                              <optgroup label="Subtraction">
                                <option value="vedic_subtraction_complement">Subtraction (Complements)</option>
                                <option value="vedic_subtraction_normal">Subtraction (Normal)</option>
                              </optgroup>
                              <optgroup label="Special Products">
                                <option value="vedic_special_products_base_100">Special Products (Base 100)</option>
                                <option value="vedic_special_products_base_50">Special Products (Base 50)</option>
                              </optgroup>
                              <optgroup label="Other">
                                <option value="vedic_addition">Addition</option>
                                <option value="vedic_squares_base_10">Squares (Base 10)</option>
                                <option value="vedic_squares_base_100">Squares (Base 100)</option>
                                <option value="vedic_squares_base_1000">Squares (Base 1000)</option>
                                <option value="vedic_tables">Tables</option>
                              </optgroup>
                            </>
                          ) : isVedicLevel2 || isVedicLevel3 || isVedicLevel4 ? (
                            <optgroup label="Coming Soon">
                              <option value="addition">Coming Soon</option>
                            </optgroup>
                          ) : isJuniorPage ? (
                            <optgroup label="Junior Operations">
                              <option value="direct_add_sub">Direct Add/Sub</option>
                              <option value="small_friends_add_sub">Small Friends Add/Sub</option>
                              <option value="big_friends_add_sub">Big Friends Add/Sub</option>
                            </optgroup>
                          ) : isAdvancedPage ? (
                            <>
                              <optgroup label="Basic Operations">
                                <option value="add_sub">Add/Sub</option>
                                <option value="addition">Addition</option>
                                <option value="subtraction">Subtraction</option>
                                <option value="multiplication">Multiplication</option>
                                <option value="division">Division</option>
                              </optgroup>
                              <optgroup label="Advanced Operations">
                                <option value="decimal_add_sub">Decimal Add/Sub</option>
                                <option value="decimal_multiplication">Decimal Multiplication</option>
                                <option value="decimal_division">Decimal Division</option>
                                <option value="integer_add_sub">Integer Add/Sub</option>
                                <option value="lcm">LCM</option>
                                <option value="gcd">GCD</option>
                                <option value="square_root">Square Root</option>
                                <option value="cube_root">Cube Root</option>
                                <option value="percentage">Percentage (%)</option>
                              </optgroup>
                            </>
                          ) : (
                            <optgroup label="Basic Operations">
                              <option value="add_sub">Add/Sub</option>
                              <option value="addition">Addition</option>
                              <option value="subtraction">Subtraction</option>
                              <option value="multiplication">Multiplication</option>
                              <option value="division">Division</option>
                            </optgroup>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {block.type === "vedic_tables" ? "Rows" : "Questions (1-200)"}
                        </label>
                        <input
                          type="text"
                          value={block.type === "vedic_tables" 
                            ? (block.constraints.rows === -1 ? "" : String(block.constraints.rows ?? 10))
                            : (block.count === -1 ? "" : String(block.count ?? 1))}
                          onChange={(e) => {
                            const val = e.target.value;
                            const fieldName = block.type === "vedic_tables" ? "rows" : "count";
                            
                            if (block.type === "vedic_tables") {
                              // For tables, use rows instead of count
                              if (val === "" || /^\d+$/.test(val)) {
                                if (val === "") {
                                  setFieldError(index, fieldName, null);
                                  updateBlock(index, { constraints: { ...block.constraints, rows: -1 as any } });
                                } else {
                                  const numVal = parseInt(val);
                                  updateBlock(index, { constraints: { ...block.constraints, rows: numVal } });
                                  // Real-time validation
                                  if (numVal < 2) {
                                    setFieldError(index, fieldName, "Minimum value for Rows is 2");
                                  } else if (numVal > 100) {
                                    setFieldError(index, fieldName, "Maximum value for Rows is 100");
                                  } else {
                                    setFieldError(index, fieldName, null);
                                  }
                                }
                              }
                            } else {
                              // Allow empty string, or numbers that are either incomplete (like "1" when typing "10") or valid
                              if (val === "" || /^\d+$/.test(val)) {
                                if (val === "") {
                                  setFieldError(index, fieldName, null);
                                  updateBlock(index, { count: -1 as any });
                                } else {
                                  const numVal = parseInt(val);
                                  updateBlock(index, { count: numVal });
                                  // Real-time validation
                                  if (numVal < 1) {
                                    setFieldError(index, fieldName, "Minimum value for Questions is 1");
                                  } else if (numVal > 200) {
                                    setFieldError(index, fieldName, "Maximum value for Questions is 200");
                                  } else {
                                    setFieldError(index, fieldName, null);
                                  }
                                }
                              }
                            }
                          }}
                          onBlur={(e) => {
                            const val = e.target.value;
                            const fieldName = block.type === "vedic_tables" ? "rows" : "count";
                            
                            if (block.type === "vedic_tables") {
                              if (val === "" || isNaN(Number(val)) || block.constraints.rows === -1) {
                                setFieldError(index, fieldName, "Rows is required");
                                updateBlock(index, { constraints: { ...block.constraints, rows: 10 } });
                              } else {
                                const numVal = parseInt(val);
                                if (numVal < 2 || numVal > 100) {
                                  // Error already shown from onChange, just ensure value is clamped on blur
                                  updateBlock(index, { constraints: { ...block.constraints, rows: Math.max(2, Math.min(100, numVal)) } });
                                }
                              }
                            } else {
                              if (val === "" || isNaN(Number(val)) || block.count === -1) {
                                setFieldError(index, fieldName, "Questions is required");
                                updateBlock(index, { count: 1 });
                              } else {
                                const numVal = parseInt(val);
                                if (numVal < 1 || numVal > 200) {
                                  // Error already shown from onChange, just ensure value is clamped on blur
                                  updateBlock(index, { count: Math.max(1, Math.min(200, numVal)) });
                                }
                              }
                            }
                          }}
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                            getFieldError(index, block.type === "vedic_tables" ? "rows" : "count")
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                          }`}
                        />
                        {getFieldError(index, block.type === "vedic_tables" ? "rows" : "count") && (
                          <p className="mt-1 text-sm text-red-600">{getFieldError(index, block.type === "vedic_tables" ? "rows" : "count")}</p>
                        )}
                      </div>

                      {(block.type === "addition" || block.type === "subtraction" || block.type === "add_sub" || block.type === "integer_add_sub" || block.type === "decimal_add_sub" || block.type === "direct_add_sub" || block.type === "small_friends_add_sub" || block.type === "big_friends_add_sub") && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {block.type === "decimal_add_sub" ? "Digits (Before Decimal) (1-10)" : "Digits (1-10)"}
                            </label>
                            <input
                              type="text"
                              value={block.constraints.digits === -1 ? "" : String(block.constraints.digits ?? 1)}
                              onChange={(e) => {
                                const val = e.target.value;
                                // Allow empty string or digits only
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "digits", null);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, digits: -1 as any },
                                    });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, digits: numVal },
                                    });
                                    // Real-time validation
                                    if (numVal < 1) {
                                      setFieldError(index, "digits", "Minimum value for Digits is 1");
                                    } else if (numVal > 10) {
                                      setFieldError(index, "digits", "Maximum value for Digits is 10");
                                    } else {
                                      setFieldError(index, "digits", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val)) || block.constraints.digits === -1) {
                                  setFieldError(index, "digits", "Digits is required");
                                  updateBlock(index, {
                                    constraints: { ...block.constraints, digits: 1 },
                                  });
                                } else {
                                  const numVal = parseInt(val);
                                  if (numVal < 1 || numVal > 10) {
                                    // Error already shown from onChange, just ensure value is clamped on blur
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, digits: Math.max(1, Math.min(10, numVal)) },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "digits")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "digits") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "digits")}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rows (2-30)</label>
                            <input
                              type="text"
                              value={block.constraints.rows === -1 ? "" : String(block.constraints.rows ?? 2)}
                              onChange={(e) => {
                                const val = e.target.value;
                                // Allow empty string or digits only
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "rows", null);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, rows: -1 as any },
                                    });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, rows: numVal },
                                    });
                                    // Real-time validation
                                    if (numVal < 2) {
                                      setFieldError(index, "rows", "Minimum value for Rows is 2");
                                    } else if (numVal > 30) {
                                      setFieldError(index, "rows", "Maximum value for Rows is 30");
                                    } else {
                                      setFieldError(index, "rows", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val)) || block.constraints.rows === -1) {
                                  setFieldError(index, "rows", "Rows is required");
                                  updateBlock(index, {
                                    constraints: { ...block.constraints, rows: 2 },
                                  });
                                } else {
                                  const numVal = parseInt(val);
                                  if (numVal < 2 || numVal > 30) {
                                    // Error already shown from onChange, just ensure value is clamped on blur
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, rows: Math.max(2, Math.min(30, numVal)) },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "rows")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "rows") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "rows")}</p>
                            )}
                          </div>
                        </>
                      )}

                      {(block.type === "multiplication" || block.type === "division") && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {block.type === "multiplication" ? "Multiplicand Digits (1-20)" : "Dividend Digits (1-20)"}
                            </label>
                            <input
                              type="text"
                              value={
                                block.type === "multiplication"
                                  ? block.constraints.multiplicandDigits === -1 ? "" : String(block.constraints.multiplicandDigits ?? 2)
                                  : block.constraints.dividendDigits === -1 ? "" : String(block.constraints.dividendDigits ?? 2)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                const fieldName = block.type === "multiplication" ? "multiplicandDigits" : "dividendDigits";
                                const fieldLabel = block.type === "multiplication" ? "Multiplicand Digits" : "Dividend Digits";
                                
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, fieldName, null);
                                    if (block.type === "multiplication") {
                                      updateBlock(index, {
                                        constraints: { ...block.constraints, multiplicandDigits: -1 as any },
                                      });
                                    } else {
                                      updateBlock(index, {
                                        constraints: { ...block.constraints, dividendDigits: -1 as any },
                                      });
                                    }
                                  } else {
                                    const numVal = parseInt(val);
                                    if (block.type === "multiplication") {
                                      updateBlock(index, {
                                        constraints: { ...block.constraints, multiplicandDigits: numVal },
                                      });
                                    } else {
                                      updateBlock(index, {
                                        constraints: { ...block.constraints, dividendDigits: numVal },
                                      });
                                    }
                                    // Real-time validation
                                    if (numVal < 1) {
                                      setFieldError(index, fieldName, `Minimum value for ${fieldLabel} is 1`);
                                    } else if (numVal > 20) {
                                      setFieldError(index, fieldName, `Maximum value for ${fieldLabel} is 20`);
                                    } else {
                                      setFieldError(index, fieldName, null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                const fieldName = block.type === "multiplication" ? "multiplicandDigits" : "dividendDigits";
                                if (val === "" || isNaN(Number(val)) ||
                                    (block.type === "multiplication" && block.constraints.multiplicandDigits === -1) ||
                                    (block.type === "division" && block.constraints.dividendDigits === -1)) {
                                  setFieldError(index, fieldName, `${block.type === "multiplication" ? "Multiplicand Digits" : "Dividend Digits"} is required`);
                                  const defaultVal = 2;
                                  if (block.type === "multiplication") {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplicandDigits: defaultVal },
                                    });
                                  } else {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, dividendDigits: defaultVal },
                                    });
                                  }
                                } else {
                                  const numVal = parseInt(val) || 2;
                                  if (numVal < 1 || numVal > 20) {
                                    updateBlock(index, {
                                      constraints: { 
                                        ...block.constraints, 
                                        [fieldName]: Math.max(1, Math.min(20, numVal))
                                      },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, block.type === "multiplication" ? "multiplicandDigits" : "dividendDigits")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, block.type === "multiplication" ? "multiplicandDigits" : "dividendDigits") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, block.type === "multiplication" ? "multiplicandDigits" : "dividendDigits")}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {block.type === "multiplication" ? "Multiplier Digits (1-20)" : "Divisor Digits (1-20)"}
                            </label>
                            <input
                              type="text"
                              value={
                                block.type === "multiplication"
                                  ? block.constraints.multiplierDigits === -1 ? "" : String(block.constraints.multiplierDigits ?? 1)
                                  : block.constraints.divisorDigits === -1 ? "" : String(block.constraints.divisorDigits ?? 1)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                const fieldName = block.type === "multiplication" ? "multiplierDigits" : "divisorDigits";
                                const fieldLabel = block.type === "multiplication" ? "Multiplier Digits" : "Divisor Digits";
                                
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, fieldName, null);
                                    if (block.type === "multiplication") {
                                      updateBlock(index, {
                                        constraints: { ...block.constraints, multiplierDigits: -1 as any },
                                      });
                                    } else {
                                      updateBlock(index, {
                                        constraints: { ...block.constraints, divisorDigits: -1 as any },
                                      });
                                    }
                                  } else {
                                    const numVal = parseInt(val);
                                    if (block.type === "multiplication") {
                                      updateBlock(index, {
                                        constraints: { ...block.constraints, multiplierDigits: numVal },
                                      });
                                    } else {
                                      updateBlock(index, {
                                        constraints: { ...block.constraints, divisorDigits: numVal },
                                      });
                                    }
                                    // Real-time validation
                                    if (numVal < 1) {
                                      setFieldError(index, fieldName, `Minimum value for ${fieldLabel} is 1`);
                                    } else if (numVal > 20) {
                                      setFieldError(index, fieldName, `Maximum value for ${fieldLabel} is 20`);
                                    } else {
                                      setFieldError(index, fieldName, null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                const fieldName = block.type === "multiplication" ? "multiplierDigits" : "divisorDigits";
                                if (val === "" || isNaN(Number(val)) ||
                                    (block.type === "multiplication" && block.constraints.multiplierDigits === -1) ||
                                    (block.type === "division" && block.constraints.divisorDigits === -1)) {
                                  setFieldError(index, fieldName, `${block.type === "multiplication" ? "Multiplier Digits" : "Divisor Digits"} is required`);
                                  const defaultVal = 1;
                                  if (block.type === "multiplication") {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplierDigits: defaultVal },
                                    });
                                  } else {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, divisorDigits: defaultVal },
                                    });
                                  }
                                } else {
                                  const numVal = parseInt(val) || 1;
                                  if (numVal < 1 || numVal > 20) {
                                    updateBlock(index, {
                                      constraints: { 
                                        ...block.constraints, 
                                        [fieldName]: Math.max(1, Math.min(20, numVal))
                                      },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, block.type === "multiplication" ? "multiplierDigits" : "divisorDigits")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, block.type === "multiplication" ? "multiplierDigits" : "divisorDigits") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, block.type === "multiplication" ? "multiplierDigits" : "divisorDigits")}</p>
                            )}
                          </div>
                        </>
                      )}

                      {(block.type === "square_root" || block.type === "cube_root") && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Root Digits (1-30)
                            </label>
                            <input
                              type="text"
                              value={
                                block.constraints.rootDigits === -1 ? "" : String(block.constraints.rootDigits ?? (block.type === "square_root" ? 4 : 5))
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "rootDigits", null);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, rootDigits: -1 as any },
                                    });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, rootDigits: numVal },
                                    });
                                    // Real-time validation
                                    if (numVal < 1) {
                                      setFieldError(index, "rootDigits", "Minimum value for Root Digits is 1");
                                    } else if (numVal > 30) {
                                      setFieldError(index, "rootDigits", "Maximum value for Root Digits is 30");
                                    } else {
                                      setFieldError(index, "rootDigits", null);
                                    }
                                  }
                                }
                              }}
                            onBlur={(e) => {
                              const val = e.target.value;
                              const defaultVal = block.type === "square_root" ? 4 : 5;
                              if (val === "" || isNaN(Number(val)) || block.constraints.rootDigits === -1) {
                                setFieldError(index, "rootDigits", "Root Digits is required");
                                updateBlock(index, {
                                  constraints: { ...block.constraints, rootDigits: defaultVal },
                                });
                              } else {
                                const numVal = parseInt(val) || defaultVal;
                                if (numVal < 1 || numVal > 30) {
                                  updateBlock(index, {
                                    constraints: { ...block.constraints, rootDigits: Math.max(1, Math.min(30, numVal)) },
                                  });
                                }
                              }
                            }}
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                              getFieldError(index, "rootDigits")
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                            }`}
                          />
                          {getFieldError(index, "rootDigits") && (
                            <p className="mt-1 text-sm text-red-600">{getFieldError(index, "rootDigits")}</p>
                          )}
                        </div>
                      )}

                      {block.type === "decimal_multiplication" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Multiplicand Digits (Before Decimal) (1-20)
                            </label>
                            <input
                              type="text"
                              value={
                                block.constraints.multiplicandDigits === -1 ? "" : String(block.constraints.multiplicandDigits ?? 2)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "multiplicandDigits", null);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplicandDigits: -1 as any },
                                    });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplicandDigits: numVal },
                                    });
                                    // Real-time validation
                                    if (numVal < 1) {
                                      setFieldError(index, "multiplicandDigits", "Minimum value for Multiplicand Digits (Before Decimal) is 1");
                                    } else if (numVal > 20) {
                                      setFieldError(index, "multiplicandDigits", "Maximum value for Multiplicand Digits (Before Decimal) is 20");
                                    } else {
                                      setFieldError(index, "multiplicandDigits", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val)) || block.constraints.multiplicandDigits === -1) {
                                  setFieldError(index, "multiplicandDigits", "Multiplicand Digits (Before Decimal) is required");
                                  updateBlock(index, {
                                    constraints: { ...block.constraints, multiplicandDigits: 2 },
                                  });
                                } else {
                                  const numVal = parseInt(val) || 2;
                                  if (numVal < 1 || numVal > 20) {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplicandDigits: Math.max(1, Math.min(20, numVal)) },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "multiplicandDigits")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "multiplicandDigits") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "multiplicandDigits")}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Multiplier Digits (0 = Whole, 1-20 = Before Decimal)
                            </label>
                            <input
                              type="text"
                              value={
                                block.constraints.multiplierDigits === -1 ? "" : String(block.constraints.multiplierDigits ?? 1)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "multiplierDigits", null);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplierDigits: -1 as any },
                                    });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplierDigits: numVal },
                                    });
                                    // Real-time validation
                                    if (numVal < 0) {
                                      setFieldError(index, "multiplierDigits", "Minimum value for Multiplier Digits is 0");
                                    } else if (numVal > 20) {
                                      setFieldError(index, "multiplierDigits", "Maximum value for Multiplier Digits is 20");
                                    } else {
                                      setFieldError(index, "multiplierDigits", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val)) || block.constraints.multiplierDigits === -1) {
                                  setFieldError(index, "multiplierDigits", "Multiplier Digits is required");
                                  updateBlock(index, {
                                    constraints: { ...block.constraints, multiplierDigits: 1 },
                                  });
                                } else {
                                  const numVal = parseInt(val);
                                  if (!isNaN(numVal)) {
                                    if (numVal < 0 || numVal > 20) {
                                      updateBlock(index, {
                                        constraints: { ...block.constraints, multiplierDigits: Math.max(0, Math.min(20, numVal)) },
                                      });
                                    }
                                  } else {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplierDigits: 1 },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "multiplierDigits")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "multiplierDigits") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "multiplierDigits")}</p>
                            )}
                          </div>
                        </>
                      )}

                      {block.type === "decimal_division" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Dividend Digits (1-20)
                            </label>
                            <input
                              type="text"
                              value={
                                block.constraints.multiplicandDigits === -1 ? "" : String(block.constraints.multiplicandDigits ?? 2)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "multiplicandDigits", null);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplicandDigits: -1 as any },
                                    });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplicandDigits: numVal },
                                    });
                                    // Real-time validation
                                    if (numVal < 1) {
                                      setFieldError(index, "multiplicandDigits", "Minimum value for Dividend Digits is 1");
                                    } else if (numVal > 20) {
                                      setFieldError(index, "multiplicandDigits", "Maximum value for Dividend Digits is 20");
                                    } else {
                                      setFieldError(index, "multiplicandDigits", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val)) || block.constraints.multiplicandDigits === -1) {
                                  setFieldError(index, "multiplicandDigits", "Dividend Digits is required");
                                  updateBlock(index, {
                                    constraints: { ...block.constraints, multiplicandDigits: 2 },
                                  });
                                } else {
                                  const numVal = parseInt(val) || 2;
                                  if (numVal < 1 || numVal > 20) {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplicandDigits: Math.max(1, Math.min(20, numVal)) },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "multiplicandDigits")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "multiplicandDigits") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "multiplicandDigits")}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Divisor Digits (1-20)
                            </label>
                            <input
                              type="text"
                              value={
                                block.constraints.multiplierDigits === -1 ? "" : String(block.constraints.multiplierDigits ?? 1)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "multiplierDigits", null);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplierDigits: -1 as any },
                                    });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplierDigits: numVal },
                                    });
                                    // Real-time validation
                                    if (numVal < 1) {
                                      setFieldError(index, "multiplierDigits", "Minimum value for Divisor Digits is 1");
                                    } else if (numVal > 20) {
                                      setFieldError(index, "multiplierDigits", "Maximum value for Divisor Digits is 20");
                                    } else {
                                      setFieldError(index, "multiplierDigits", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val)) || block.constraints.multiplierDigits === -1) {
                                  setFieldError(index, "multiplierDigits", "Divisor Digits is required");
                                  updateBlock(index, {
                                    constraints: { ...block.constraints, multiplierDigits: 1 },
                                  });
                                } else {
                                  const numVal = parseInt(val) || 1;
                                  if (numVal < 1 || numVal > 20) {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplierDigits: Math.max(1, Math.min(20, numVal)) },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "multiplierDigits")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "multiplierDigits") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "multiplierDigits")}</p>
                            )}
                          </div>
                        </>
                      )}

                      {(block.type === "percentage") && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Percentage Min (1-100)
                              {block.constraints.percentageMin !== undefined && block.constraints.percentageMax !== undefined && block.constraints.percentageMin > block.constraints.percentageMax && (
                                <span className="text-red-500 text-xs ml-2">⚠ Min &gt; Max</span>
                              )}
                            </label>
                            <input
                              type="text"
                              value={
                                block.constraints.percentageMin === undefined ? "" : String(block.constraints.percentageMin)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "percentageMin", null);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, percentageMin: undefined },
                                    });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, percentageMin: numVal },
                                    });
                                    // Real-time validation
                                    if (numVal < 1) {
                                      setFieldError(index, "percentageMin", "Minimum value for Percentage Min is 1");
                                    } else if (numVal > 100) {
                                      setFieldError(index, "percentageMin", "Maximum value for Percentage Min is 100");
                                    } else if (block.constraints.percentageMax !== undefined && numVal > block.constraints.percentageMax) {
                                      setFieldError(index, "percentageMin", "Percentage Min cannot be greater than Percentage Max");
                                    } else {
                                      setFieldError(index, "percentageMin", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val))) {
                                  setFieldError(index, "percentageMin", "Percentage Min is required");
                                  updateBlock(index, {
                                    constraints: { ...block.constraints, percentageMin: 1 },
                                  });
                                } else {
                                  const numVal = parseInt(val) || 1;
                                  if (numVal < 1 || numVal > 100 || (block.constraints.percentageMax !== undefined && numVal > block.constraints.percentageMax)) {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, percentageMin: Math.max(1, Math.min(100, numVal)) },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "percentageMin") || (block.constraints.percentageMin !== undefined && block.constraints.percentageMax !== undefined && block.constraints.percentageMin > block.constraints.percentageMax)
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "percentageMin") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "percentageMin")}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Percentage Max (1-100)
                              {block.constraints.percentageMin !== undefined && block.constraints.percentageMax !== undefined && block.constraints.percentageMin > block.constraints.percentageMax && (
                                <span className="text-red-500 text-xs ml-2">⚠ Min &gt; Max</span>
                              )}
                            </label>
                            <input
                              type="text"
                              value={
                                block.constraints.percentageMax === undefined ? "" : String(block.constraints.percentageMax)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "percentageMax", null);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, percentageMax: undefined },
                                    });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, percentageMax: numVal },
                                    });
                                    // Real-time validation
                                    if (numVal < 1) {
                                      setFieldError(index, "percentageMax", "Minimum value for Percentage Max is 1");
                                    } else if (numVal > 100) {
                                      setFieldError(index, "percentageMax", "Maximum value for Percentage Max is 100");
                                    } else if (block.constraints.percentageMin !== undefined && numVal < block.constraints.percentageMin) {
                                      setFieldError(index, "percentageMax", "Percentage Max cannot be less than Percentage Min");
                                    } else {
                                      setFieldError(index, "percentageMax", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val))) {
                                  setFieldError(index, "percentageMax", "Percentage Max is required");
                                  updateBlock(index, {
                                    constraints: { ...block.constraints, percentageMax: 100 },
                                  });
                                } else {
                                  const numVal = parseInt(val) || 100;
                                  if (numVal < 1 || numVal > 100 || (block.constraints.percentageMin !== undefined && numVal < block.constraints.percentageMin)) {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, percentageMax: Math.max(1, Math.min(100, numVal)) },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "percentageMax") || (block.constraints.percentageMin !== undefined && block.constraints.percentageMax !== undefined && block.constraints.percentageMin > block.constraints.percentageMax)
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "percentageMax") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "percentageMax")}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Number Digits (1-10)
                            </label>
                            <input
                              type="text"
                              value={
                                block.constraints.numberDigits === undefined ? "" : String(block.constraints.numberDigits)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "numberDigits", null);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, numberDigits: undefined },
                                    });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, numberDigits: numVal },
                                    });
                                    // Real-time validation
                                    if (numVal < 1) {
                                      setFieldError(index, "numberDigits", "Minimum value for Number Digits is 1");
                                    } else if (numVal > 10) {
                                      setFieldError(index, "numberDigits", "Maximum value for Number Digits is 10");
                                    } else {
                                      setFieldError(index, "numberDigits", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val))) {
                                  setFieldError(index, "numberDigits", "Number Digits is required");
                                  updateBlock(index, {
                                    constraints: { ...block.constraints, numberDigits: 4 },
                                  });
                                } else {
                                  const numVal = parseInt(val) || 4;
                                  if (numVal < 1 || numVal > 10) {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, numberDigits: Math.max(1, Math.min(10, numVal)) },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "numberDigits")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "numberDigits") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "numberDigits")}</p>
                            )}
                          </div>
                        </>
                      )}

                      {/* Vedic Maths Level 1 Constraints */}
                      {(block.type.startsWith("vedic_") && (block.type === "vedic_multiply_by_11" || block.type === "vedic_multiply_by_101" || block.type === "vedic_multiply_by_2" || block.type === "vedic_multiply_by_4" || block.type === "vedic_multiply_by_6" || block.type === "vedic_divide_by_2" || block.type === "vedic_divide_by_4" || block.type === "vedic_divide_by_11")) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Digits (2-30)</label>
                          <input
                            type="text"
                            value={block.constraints.digits === -1 ? "" : String(block.constraints.digits ?? (block.type === "vedic_divide_by_11" ? 3 : 2))}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || /^\d+$/.test(val)) {
                                if (val === "") {
                                  setFieldError(index, "digits", null);
                                  updateBlock(index, { constraints: { ...block.constraints, digits: -1 as any } });
                                } else {
                                  const numVal = parseInt(val);
                                  updateBlock(index, { constraints: { ...block.constraints, digits: numVal } });
                                  // Real-time validation
                                  if (numVal < 2) {
                                    setFieldError(index, "digits", "Minimum value for Digits is 2");
                                  } else if (numVal > 30) {
                                    setFieldError(index, "digits", "Maximum value for Digits is 30");
                                  } else {
                                    setFieldError(index, "digits", null);
                                  }
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const val = e.target.value;
                              const defaultVal = block.type === "vedic_divide_by_11" ? 3 : 2;
                              if (val === "" || isNaN(Number(val)) || block.constraints.digits === -1) {
                                setFieldError(index, "digits", "Digits is required");
                                updateBlock(index, { constraints: { ...block.constraints, digits: defaultVal } });
                              } else {
                                const numVal = parseInt(val) || defaultVal;
                                if (numVal < 2 || numVal > 30) {
                                  updateBlock(index, { constraints: { ...block.constraints, digits: Math.max(2, Math.min(30, numVal)) } });
                                }
                              }
                            }}
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                              getFieldError(index, "digits")
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                            }`}
                          />
                          {getFieldError(index, "digits") && (
                            <p className="mt-1 text-sm text-red-600">{getFieldError(index, "digits")}</p>
                          )}
                        </div>
                      )}

                      {(block.type === "vedic_subtraction_complement" || block.type === "vedic_subtraction_normal") && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Base (100, 1000, etc)</label>
                          <input
                            type="text"
                            value={block.constraints.base === undefined ? "" : String(block.constraints.base)}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || /^\d+$/.test(val)) {
                                if (val === "") {
                                  updateBlock(index, { constraints: { ...block.constraints, base: undefined } });
                                } else {
                                  const numVal = parseInt(val);
                                  if (numVal > 0) {
                                    updateBlock(index, { constraints: { ...block.constraints, base: numVal } });
                                  }
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const val = e.target.value;
                              if (val === "" || isNaN(Number(val))) {
                                updateBlock(index, { constraints: { ...block.constraints, base: 100 } });
                              } else {
                                const numVal = parseInt(val) || 100;
                                updateBlock(index, { constraints: { ...block.constraints, base: numVal } });
                              }
                            }}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                          />
                        </div>
                      )}

                      {(block.type === "vedic_multiply_by_12_19" || block.type === "vedic_multiply_by_21_91") && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Digits (2-30)</label>
                            <input
                              type="text"
                              value={block.constraints.digits === -1 ? "" : String(block.constraints.digits ?? 2)}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "digits", null);
                                    updateBlock(index, { constraints: { ...block.constraints, digits: -1 as any } });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, { constraints: { ...block.constraints, digits: numVal } });
                                    // Real-time validation
                                    if (numVal < 2) {
                                      setFieldError(index, "digits", "Minimum value for Digits is 2");
                                    } else if (numVal > 30) {
                                      setFieldError(index, "digits", "Maximum value for Digits is 30");
                                    } else {
                                      setFieldError(index, "digits", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val)) || block.constraints.digits === -1) {
                                  setFieldError(index, "digits", "Digits is required");
                                  updateBlock(index, { constraints: { ...block.constraints, digits: 2 } });
                                } else {
                                  const numVal = parseInt(val) || 2;
                                  if (numVal < 2 || numVal > 30) {
                                    updateBlock(index, { constraints: { ...block.constraints, digits: Math.max(2, Math.min(30, numVal)) } });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "digits")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "digits") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "digits")}</p>
                            )}
                          </div>
                          {block.type === "vedic_multiply_by_12_19" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Multiplier (12-19, optional)</label>
                              <input
                                type="text"
                                value={block.constraints.multiplier === undefined ? "" : String(block.constraints.multiplier)}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "" || /^\d+$/.test(val)) {
                                    if (val === "") {
                                      setFieldError(index, "multiplier", null);
                                      updateBlock(index, { constraints: { ...block.constraints, multiplier: undefined } });
                                    } else {
                                      const numVal = parseInt(val);
                                      updateBlock(index, { constraints: { ...block.constraints, multiplier: numVal } });
                                      // Real-time validation
                                      if (numVal < 12) {
                                        setFieldError(index, "multiplier", "Minimum value for Multiplier is 12");
                                      } else if (numVal > 19) {
                                        setFieldError(index, "multiplier", "Maximum value for Multiplier is 19");
                                      } else {
                                        setFieldError(index, "multiplier", null);
                                      }
                                    }
                                  }
                                }}
                                onBlur={(e) => {
                                  const val = e.target.value;
                                  if (val !== "" && !isNaN(Number(val))) {
                                    const numVal = parseInt(val);
                                    if (numVal < 12 || numVal > 19) {
                                      updateBlock(index, { constraints: { ...block.constraints, multiplier: undefined } });
                                      setFieldError(index, "multiplier", null);
                                    }
                                  }
                                }}
                                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                  getFieldError(index, "multiplier")
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                }`}
                              />
                              {getFieldError(index, "multiplier") && (
                                <p className="mt-1 text-sm text-red-600">{getFieldError(index, "multiplier")}</p>
                              )}
                            </div>
                          )}
                          {block.type === "vedic_multiply_by_21_91" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Multiplier (21-91, optional)</label>
                              <input
                                type="text"
                                value={block.constraints.multiplierRange === undefined ? "" : String(block.constraints.multiplierRange)}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "" || /^\d+$/.test(val)) {
                                    if (val === "") {
                                      setFieldError(index, "multiplierRange", null);
                                      updateBlock(index, { constraints: { ...block.constraints, multiplierRange: undefined } });
                                    } else {
                                      const numVal = parseInt(val);
                                      updateBlock(index, { constraints: { ...block.constraints, multiplierRange: numVal } });
                                      // Real-time validation
                                      if (numVal < 21) {
                                        setFieldError(index, "multiplierRange", "Minimum value for Multiplier is 21");
                                      } else if (numVal > 91) {
                                        setFieldError(index, "multiplierRange", "Maximum value for Multiplier is 91");
                                      } else {
                                        setFieldError(index, "multiplierRange", null);
                                      }
                                    }
                                  }
                                }}
                                onBlur={(e) => {
                                  const val = e.target.value;
                                  if (val !== "" && !isNaN(Number(val))) {
                                    const numVal = parseInt(val);
                                    if (numVal < 21 || numVal > 91) {
                                      updateBlock(index, { constraints: { ...block.constraints, multiplierRange: undefined } });
                                      setFieldError(index, "multiplierRange", null);
                                    }
                                  }
                                }}
                                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                  getFieldError(index, "multiplierRange")
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                }`}
                              />
                              {getFieldError(index, "multiplierRange") && (
                                <p className="mt-1 text-sm text-red-600">{getFieldError(index, "multiplierRange")}</p>
                              )}
                            </div>
                          )}
                        </>
                      )}

                      {block.type === "vedic_addition" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Number Digits (1-30)</label>
                            <input
                              type="text"
                              value={block.constraints.firstDigits === undefined ? "" : String(block.constraints.firstDigits ?? 2)}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    updateBlock(index, { constraints: { ...block.constraints, firstDigits: undefined } });
                                  } else {
                                    const numVal = parseInt(val);
                                    // Allow any numeric input for partial typing (validation happens on blur)
                                    updateBlock(index, { constraints: { ...block.constraints, firstDigits: numVal } });
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val))) {
                                  updateBlock(index, { constraints: { ...block.constraints, firstDigits: 2 } });
                                } else {
                                  const numVal = parseInt(val) || 2;
                                  updateBlock(index, { constraints: { ...block.constraints, firstDigits: Math.max(1, Math.min(30, numVal)) } });
                                }
                              }}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Second Number Digits (1-30)</label>
                            <input
                              type="text"
                              value={block.constraints.secondDigits === undefined ? "" : String(block.constraints.secondDigits ?? 2)}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    updateBlock(index, { constraints: { ...block.constraints, secondDigits: undefined } });
                                  } else {
                                    const numVal = parseInt(val);
                                    // Allow any numeric input for partial typing (validation happens on blur)
                                    updateBlock(index, { constraints: { ...block.constraints, secondDigits: numVal } });
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val))) {
                                  updateBlock(index, { constraints: { ...block.constraints, secondDigits: 2 } });
                                } else {
                                  const numVal = parseInt(val) || 2;
                                  updateBlock(index, { constraints: { ...block.constraints, secondDigits: Math.max(1, Math.min(30, numVal)) } });
                                }
                              }}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                            />
                          </div>
                        </>
                      )}

                      {block.type === "vedic_divide_single_digit" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Digits (2-30)</label>
                            <input
                              type="text"
                              value={block.constraints.digits === -1 ? "" : String(block.constraints.digits ?? 2)}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "digits", null);
                                    updateBlock(index, { constraints: { ...block.constraints, digits: -1 as any } });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, { constraints: { ...block.constraints, digits: numVal } });
                                    // Real-time validation
                                    if (numVal < 2) {
                                      setFieldError(index, "digits", "Minimum value for Digits is 2");
                                    } else if (numVal > 30) {
                                      setFieldError(index, "digits", "Maximum value for Digits is 30");
                                    } else {
                                      setFieldError(index, "digits", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val === "" || isNaN(Number(val)) || block.constraints.digits === -1) {
                                  setFieldError(index, "digits", "Digits is required");
                                  updateBlock(index, { constraints: { ...block.constraints, digits: 2 } });
                                } else {
                                  const numVal = parseInt(val) || 2;
                                  if (numVal < 2 || numVal > 30) {
                                    updateBlock(index, { constraints: { ...block.constraints, digits: Math.max(2, Math.min(30, numVal)) } });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "digits")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "digits") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "digits")}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Divisor (2-9, optional)</label>
                            <input
                              type="text"
                              value={block.constraints.divisor === undefined ? "" : String(block.constraints.divisor)}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "divisor", null);
                                    updateBlock(index, { constraints: { ...block.constraints, divisor: undefined } });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, { constraints: { ...block.constraints, divisor: numVal } });
                                    // Real-time validation
                                    if (numVal < 2) {
                                      setFieldError(index, "divisor", "Minimum value for Divisor is 2");
                                    } else if (numVal > 9) {
                                      setFieldError(index, "divisor", "Maximum value for Divisor is 9");
                                    } else {
                                      setFieldError(index, "divisor", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                if (val !== "" && !isNaN(Number(val))) {
                                  const numVal = parseInt(val);
                                  if (numVal < 2 || numVal > 9) {
                                    updateBlock(index, { constraints: { ...block.constraints, divisor: undefined } });
                                    setFieldError(index, "divisor", null);
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "divisor")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "divisor") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "divisor")}</p>
                            )}
                          </div>
                        </>
                      )}

                      {block.type === "vedic_tables" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Table Number (1-99, optional)</label>
                          <input
                            type="text"
                            value={block.constraints.tableNumber === undefined ? "" : String(block.constraints.tableNumber)}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || /^\d+$/.test(val)) {
                                if (val === "") {
                                  setFieldError(index, "tableNumber", null);
                                  updateBlock(index, { constraints: { ...block.constraints, tableNumber: undefined } });
                                } else {
                                  const numVal = parseInt(val);
                                  updateBlock(index, { constraints: { ...block.constraints, tableNumber: numVal } });
                                  // Real-time validation
                                  if (numVal < 1) {
                                    setFieldError(index, "tableNumber", "Minimum value for Table Number is 1");
                                  } else if (numVal > 99) {
                                    setFieldError(index, "tableNumber", "Maximum value for Table Number is 99");
                                  } else {
                                    setFieldError(index, "tableNumber", null);
                                  }
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const val = e.target.value;
                              if (val !== "" && !isNaN(Number(val))) {
                                const numVal = parseInt(val);
                                if (numVal < 1 || numVal > 99) {
                                  updateBlock(index, { constraints: { ...block.constraints, tableNumber: undefined } });
                                  setFieldError(index, "tableNumber", null);
                                }
                              }
                            }}
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                              getFieldError(index, "tableNumber")
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                            }`}
                          />
                          {getFieldError(index, "tableNumber") && (
                            <p className="mt-1 text-sm text-red-600">{getFieldError(index, "tableNumber")}</p>
                          )}
                        </div>
                      )}

                      {(block.type === "lcm" || block.type === "gcd") && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Number Digits (1-10)
                            </label>
                            <input
                              type="text"
                              value={
                                block.constraints.multiplicandDigits === -1 ? "" : String(block.constraints.multiplicandDigits ?? (block.type === "gcd" ? 3 : 2))
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "multiplicandDigits", null);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplicandDigits: -1 as any },
                                    });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplicandDigits: numVal },
                                    });
                                    // Real-time validation
                                    if (numVal < 1) {
                                      setFieldError(index, "multiplicandDigits", "Minimum value for First Number Digits is 1");
                                    } else if (numVal > 10) {
                                      setFieldError(index, "multiplicandDigits", "Maximum value for First Number Digits is 10");
                                    } else {
                                      setFieldError(index, "multiplicandDigits", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                const defaultVal = block.type === "gcd" ? 3 : 2;  // GCD default is 3, LCM default is 2
                                if (val === "" || isNaN(Number(val)) || block.constraints.multiplicandDigits === -1) {
                                  setFieldError(index, "multiplicandDigits", "First Number Digits is required");
                                  updateBlock(index, {
                                    constraints: { ...block.constraints, multiplicandDigits: defaultVal },
                                  });
                                } else {
                                  const numVal = parseInt(val) || defaultVal;
                                  if (numVal < 1 || numVal > 10) {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplicandDigits: Math.max(1, Math.min(10, numVal)) },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "multiplicandDigits")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "multiplicandDigits") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "multiplicandDigits")}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Second Number Digits (1-10)
                            </label>
                            <input
                              type="text"
                              value={
                                block.constraints.multiplierDigits === -1 ? "" : String(block.constraints.multiplierDigits ?? 2)
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d+$/.test(val)) {
                                  if (val === "") {
                                    setFieldError(index, "multiplierDigits", null);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplierDigits: -1 as any },
                                    });
                                  } else {
                                    const numVal = parseInt(val);
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplierDigits: numVal },
                                    });
                                    // Real-time validation
                                    if (numVal < 1) {
                                      setFieldError(index, "multiplierDigits", "Minimum value for Second Number Digits is 1");
                                    } else if (numVal > 10) {
                                      setFieldError(index, "multiplierDigits", "Maximum value for Second Number Digits is 10");
                                    } else {
                                      setFieldError(index, "multiplierDigits", null);
                                    }
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const val = e.target.value;
                                  const defaultVal = 2;  // Second number default is always 2 for both LCM and GCD
                                  if (val === "" || isNaN(Number(val)) || block.constraints.multiplierDigits === -1) {
                                    setFieldError(index, "multiplierDigits", "Second Number Digits is required");
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplierDigits: defaultVal },
                                    });
                                } else {
                                  const numVal = parseInt(val) || 2;
                                  if (numVal < 1 || numVal > 10) {
                                    updateBlock(index, {
                                      constraints: { ...block.constraints, multiplierDigits: Math.max(1, Math.min(10, numVal)) },
                                    });
                                  }
                                }
                              }}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all outline-none bg-white ${
                                getFieldError(index, "multiplierDigits")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                              }`}
                            />
                            {getFieldError(index, "multiplierDigits") && (
                              <p className="mt-1 text-sm text-red-600">{getFieldError(index, "multiplierDigits")}</p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    
                  </div>
                ))}
              </div>

              {blocks.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  {loadingPresets ? (
                    <>
                      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 mb-2 font-medium">Loading preset blocks for {level}...</p>
                      <p className="text-sm text-gray-500">Please wait</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 mb-4">No question blocks yet</p>
                      <button
                        onClick={addBlock}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        Add Your First Block
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <button
                onClick={handlePreview}
                disabled={previewMutation.isPending || loadingPresets}
                className="w-full group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {previewMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating Preview...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Generate Preview
                  </>
                )}
              </button>

              {previewMutation.isError && (
                <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-red-800 block">Error:</strong>
                    <span className="text-red-700">
                      {previewMutation.error instanceof Error ? previewMutation.error.message : "Unknown error"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && previewData && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Preview</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {showAnswers ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide Answers
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Show Answers
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Edit
                </button>
              </div>
            </div>

            {(() => {
              // Helper function to check if a block type uses horizontal/vertical space layout
              const isHorizontalBlockType = (type: string): boolean => {
                return type === "multiplication" || 
                       type === "decimal_multiplication" ||
                       type === "division" ||
                       type === "decimal_division" ||
                       type === "lcm" ||
                       type === "gcd" ||
                       type === "square_root" ||
                       type === "cube_root" ||
                       type === "percentage";
              };
              
              // Group consecutive horizontal blocks together (multiplication, division, lcm, gcd, square root, cube root, percentage)
              const groupedBlocks: Array<{ blocks: GeneratedBlock[], indices: number[] }> = [];
              let currentGroup: GeneratedBlock[] = [];
              let currentIndices: number[] = [];
              
              previewData.blocks.forEach((block, blockIndex) => {
                const isHorizontalBlock = isHorizontalBlockType(block.config.type);
                
                const nextBlock = previewData.blocks[blockIndex + 1];
                const nextIsHorizontal = nextBlock && isHorizontalBlockType(nextBlock.config.type);
                
                if (isHorizontalBlock) {
                  currentGroup.push(block);
                  currentIndices.push(blockIndex);
                  
                  // If next block is not horizontal, finalize this group
                  if (!nextIsHorizontal) {
                    groupedBlocks.push({ blocks: currentGroup, indices: currentIndices });
                    currentGroup = [];
                    currentIndices = [];
                  }
                } else {
                  // If we have a pending group, finalize it
                  if (currentGroup.length > 0) {
                    groupedBlocks.push({ blocks: currentGroup, indices: currentIndices });
                    currentGroup = [];
                    currentIndices = [];
                  }
                  // Add non-horizontal block as a single group
                  groupedBlocks.push({ blocks: [block], indices: [blockIndex] });
                }
              });
              
              // Handle any remaining group
              if (currentGroup.length > 0) {
                groupedBlocks.push({ blocks: currentGroup, indices: currentIndices });
              }
              
              return groupedBlocks.map((group, groupIndex) => {
                // Check if this is a horizontal block group (2+ blocks that can coexist)
                const isHorizontalGroup = group.blocks.length >= 2 && 
                  group.blocks.every(block => isHorizontalBlockType(block.config.type));
                
                if (isHorizontalGroup) {
                  // Display horizontal blocks side by side (3 at a time)
                  // Group them in sets of 3
                  const groups: Array<{ blocks: GeneratedBlock[], indices: number[] }> = [];
                  for (let i = 0; i < group.blocks.length; i += 3) {
                    groups.push({
                      blocks: group.blocks.slice(i, i + 3),
                      indices: group.indices.slice(i, i + 3)
                    });
                  }
                  
                  return (
                    <div key={groupIndex} className="space-y-4">
                      {groups.map((groupSet, groupSetIndex) => (
                        <div key={groupSetIndex} className="flex flex-row gap-3 w-full">
                          {groupSet.blocks.map((block, blockInGroupIndex) => {
                            const originalIndex = groupSet.indices[blockInGroupIndex];
                            return (
                              <div key={originalIndex} className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50/30 border-2 border-gray-200 rounded-xl p-4 min-w-0">
                                <h3 className="font-bold text-base mb-3 text-gray-900">
                                  {block.config.title || `Section ${originalIndex + 1}`}
                </h3>
                                <div className="grid grid-cols-1 gap-2">
                  {block.questions.map((q) => (
                    <MathQuestion key={q.id} question={q} showAnswer={showAnswers} />
                  ))}
                </div>
              </div>
                            );
                          })}
                          {/* Fill remaining slots if less than 3 blocks */}
                          {Array.from({ length: 3 - groupSet.blocks.length }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="flex-1"></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  // Single block (multiplication or other type)
                  return group.blocks.map((block, blockInGroupIndex) => {
                    const originalIndex = group.indices[blockInGroupIndex];
                    const hasVerticalQuestions = block.questions.some(q => q.isVertical);
                    const isVerticalBlock = hasVerticalQuestions && 
                      (block.config.type === "addition" || 
                       block.config.type === "subtraction" || 
                       block.config.type === "add_sub" ||
                       block.config.type === "integer_add_sub" ||
                       block.config.type === "decimal_add_sub" ||
                       block.config.type === "direct_add_sub" ||
                       block.config.type === "small_friends_add_sub" ||
                       block.config.type === "big_friends_add_sub");
                    
                    return (
                      <div key={originalIndex} className="bg-gradient-to-br from-gray-50 to-blue-50/30 border-2 border-gray-200 rounded-xl p-4">
                        <h3 className="font-bold text-base mb-3 text-gray-900">
                          {block.config.title || `Section ${originalIndex + 1}`}
                        </h3>
                        {isVerticalBlock ? (
                          // 10 columns for vertical questions (add/sub) - single flat table for Excel compatibility
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
                              <tbody>
                                {/* Serial number row */}
                                <tr>
                                  {block.questions.map((q) => (
                                    <td key={`sno-${q.id}`} className="p-1 align-top border border-gray-200 bg-white" style={{ width: '10%' }}>
                                      <span className="font-bold text-sm text-blue-700">{q.id}.</span>
                                    </td>
                                  ))}
                                  {Array.from({ length: Math.max(0, 10 - block.questions.length) }).map((_, idx) => (
                                    <td key={`empty-sno-${idx}`} className="p-1 border border-gray-200" style={{ width: '10%' }}></td>
                                  ))}
                                </tr>
                                {/* Question content rows - render each question's operands */}
                                {block.questions.length > 0 && (() => {
                                  const maxOperands = Math.max(...block.questions.map(q => q.operands.length));
                                  const rows = [];
                                  for (let rowIdx = 0; rowIdx < maxOperands; rowIdx++) {
                                    rows.push(
                                      <tr key={`operand-${rowIdx}`}>
                                        {block.questions.map((q) => {
                                          const op = q.operands[rowIdx];
                                          if (op === undefined) {
                                            return <td key={`empty-${q.id}-${rowIdx}`} className="p-1 border border-gray-200 bg-white" style={{ width: '10%' }}></td>;
                                          }
                                          
                                          // Determine operator
                                          let operator = null;
                                          if (q.operators && q.operators.length > 0 && rowIdx > 0) {
                                            operator = q.operators[rowIdx - 1];
                                          } else if (!q.operators) {
                                            if (q.operator === "-" && rowIdx > 0) {
                                              operator = q.operator;
                                            } else if (q.operator !== "-" && rowIdx === q.operands.length - 1) {
                                              operator = q.operator;
                                            }
                                          }
                                          
                                          return (
                                            <td key={`${q.id}-${rowIdx}`} className="p-1 border border-gray-200 bg-white text-right" style={{ width: '10%' }}>
                                              <div className="font-mono text-sm font-semibold text-gray-800 leading-tight">
                                                {operator && <span className="mr-1 text-blue-600">{operator}</span>}
                                                {op}
                                              </div>
                                            </td>
                                          );
                                        })}
                                        {Array.from({ length: Math.max(0, 10 - block.questions.length) }).map((_, idx) => (
                                          <td key={`empty-op-${idx}-${rowIdx}`} className="p-1 border border-gray-200" style={{ width: '10%' }}></td>
                                        ))}
                                      </tr>
                                    );
                                  }
                                  
                                  // Line row
                                  rows.push(
                                    <tr key="line">
                                      {block.questions.map((q) => (
                                        <td key={`line-${q.id}`} className="p-1 border border-gray-200 bg-white" style={{ width: '10%' }}>
                                          <div className="border-t border-gray-400 w-full"></div>
                                        </td>
                                      ))}
                                      {Array.from({ length: Math.max(0, 10 - block.questions.length) }).map((_, idx) => (
                                        <td key={`empty-line-${idx}`} className="p-1 border border-gray-200" style={{ width: '10%' }}></td>
                                      ))}
                                    </tr>
                                  );
                                  
                                  // Answer row - always show space (empty when answers hidden)
                                  rows.push(
                                    <tr key="answer">
                                      {block.questions.map((q) => (
                                        <td key={`answer-${q.id}`} className="p-1 border border-gray-200 bg-white text-right" style={{ width: '10%', minHeight: '1.2rem' }}>
                                          <div style={{ minHeight: '1.2rem' }}>
                                            {showAnswers && (
                                              <div className="text-gray-600 font-mono text-sm font-bold">{q.answer}</div>
                                            )}
                                          </div>
                                        </td>
                                      ))}
                                      {Array.from({ length: Math.max(0, 10 - block.questions.length) }).map((_, idx) => (
                                        <td key={`empty-answer-${idx}`} className="p-1 border border-gray-200" style={{ width: '10%' }}></td>
                                      ))}
                                    </tr>
                                  );
                                  
                                  return rows;
                                })()}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          // 1 column with multiple rows for horizontal questions (multiplication, etc.)
                          <div className="grid grid-cols-1 gap-2 max-w-md">
                            {block.questions.map((q) => (
                              <MathQuestion key={q.id} question={q} showAnswer={showAnswers} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  });
                }
              });
            })()}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => downloadMutation.mutate({ withAnswers: false, answersOnly: false })}
                disabled={downloadMutation.isPending}
                className="flex-1 group flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 text-sm"
              >
                <FileDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {downloadMutation.isPending ? "Generating..." : "Question Paper"}
              </button>
              <button
                onClick={() => downloadMutation.mutate({ withAnswers: false, answersOnly: true })}
                disabled={downloadMutation.isPending}
                className="flex-1 group flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 text-sm"
              >
                <FileDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {downloadMutation.isPending ? "Generating..." : "Answer Key"}
              </button>
              <button
                onClick={() => downloadMutation.mutate({ withAnswers: true, answersOnly: false })}
                disabled={downloadMutation.isPending}
                className="flex-1 group flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 text-sm"
              >
                <FileDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {downloadMutation.isPending ? "Generating..." : "Questions + Answers"}
              </button>
            </div>

            {downloadMutation.isError && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-800 block">Error:</strong>
                  <span className="text-red-700">
                    {downloadMutation.error instanceof Error ? downloadMutation.error.message : "Unknown error"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


