import { Question } from "@/lib/api";

interface Props {
  question: Question;
  showAnswer?: boolean;
  hideSerialNumber?: boolean; // Hide serial number when used in attempt page
  largeFont?: boolean; // Use larger font size for attempt page
  smallHorizontalFont?: boolean; // Use smaller font for horizontal questions in preview
}

// Helper function to format numbers without scientific notation
function formatNumber(num: number): string {
  // Convert to string first to check for scientific notation
  const str = num.toString();
  
  // If already in scientific notation, convert it
  if (str.includes('e') || str.includes('E')) {
    const match = str.match(/^([\d.]+)e([+-]?\d+)$/i);
    if (match) {
      const [, base, exp] = match;
      const exponent = parseInt(exp);
      const [intPart, decPart = ''] = base.split('.');
      
      if (exponent > 0) {
        // Positive exponent - move decimal point right
        const totalDecimals = decPart.length;
        if (exponent >= totalDecimals) {
          // All decimals become part of integer, add zeros
          return intPart + decPart + '0'.repeat(exponent - totalDecimals);
        } else {
          // Some decimals remain
          return intPart + decPart.slice(0, exponent) + '.' + decPart.slice(exponent);
        }
      } else {
        // Negative exponent - move decimal point left
        const absExp = Math.abs(exponent);
        return '0.' + '0'.repeat(absExp - 1) + intPart.replace(/^0+/, '') + decPart;
      }
    }
    // Fallback for malformed scientific notation
    return str;
  }
  
  // For very large integers, ensure no scientific notation
  // Use Number.isSafeInteger to check if we can safely format
  if (Number.isInteger(num) && Math.abs(num) < Number.MAX_SAFE_INTEGER) {
    return num.toFixed(0);
  }
  
  // For very large numbers that might be displayed in scientific notation
  // Use toLocaleString without grouping
  if (Math.abs(num) >= 1e6) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0, useGrouping: false });
  }
  
  return str;
}

export default function MathQuestion({ question, showAnswer = false, hideSerialNumber = false, largeFont = false, smallHorizontalFont = false }: Props) {
  // Premium serial number styling
  const serialNumber = (
    <span className="font-bold text-sm text-blue-700 mr-2">{question.id}.</span>
  );
  
  // For decimal_add_sub, use the text field directly (it's already formatted with decimals)
  // Check for decimal_add_sub by operator "±" (Unicode: U+00B1, char code 177)
  // Also check if operator might be encoded differently or if operands are clearly decimal format
  const operatorStr = String(question.operator || "");
  const operatorCharCode = operatorStr.length > 0 ? operatorStr.charCodeAt(0) : -1;
  
  // Check if operands suggest decimal format (multiples of 10 with mixed operators = decimal_add_sub)
  // For decimal_add_sub, backend stores numbers as integers * 10 (e.g., 123 for 12.3)
  // So operands will be multiples of 10 (10, 20, 30, ..., 9990)
  // IMPORTANT: Regular add_sub also uses "±" operator, so we must check operands, not just operator
  const hasDecimalFormatOperands = question.isVertical && 
    question.operands && 
    question.operands.length > 0 && 
    question.operands.every(op => op % 10 === 0 && op >= 10 && op <= 9990) && 
    question.operators && 
    question.operators.length > 0;
  
  // Only treat as decimal if BOTH operator is ± AND operands are multiples of 10
  // Regular add_sub uses ± but operands are NOT multiples of 10 (e.g., 1, 2, 4)
  const isDecimalAddSub = question.isVertical && (
    (operatorStr === "±" || 
     operatorStr === "\u00B1" ||
     operatorCharCode === 0x00B1 || // Unicode code point for ± (177)
     operatorCharCode === 177 || // Decimal representation
     (operatorStr && operatorStr.includes("±"))) &&
    hasDecimalFormatOperands // MUST have decimal format operands (all multiples of 10)
  );
  
  if (isDecimalAddSub) {
    // Use table structure for Excel compatibility
    // ALWAYS convert operands from integer format (stored as * 10) to decimal format
    // This ensures decimals are always shown, regardless of text field
    const lines = question.operands.map((op, idx) => {
      // ALWAYS convert from integer format (stored as * 10) to decimal with 1 decimal place
      const val = (op / 10).toFixed(1);
      if (idx === 0) {
        return val;
      } else {
        const operator = question.operators?.[idx - 1] || "+";
        return `${operator} ${val}`;
      }
    });
    
    return (
      <table className="w-full border-collapse bg-white rounded border border-gray-200 hover:border-blue-300 transition-colors shadow-sm">
        <tbody>
          <tr>
            {!hideSerialNumber && (
              <td className="p-1.5 align-center w-8 border-r border-gray-200 text-center">
                <span className="font-bold text-sm text-blue-700">{question.id}.</span>
              </td>
            )}
            <td className="p-1.5">
              <div className="flex flex-col items-end space-y-0.5">
                {lines.map((line, idx) => (
                  <div key={idx} className={`text-right font-mono ${largeFont ? 'text-xl' : 'text-base'} font-semibold text-gray-800 leading-tight`}>
                    {line}
                  </div>
                ))}
                <div className="border-t border-gray-400 w-full my-0.5"></div>
                {/* Always show answer space (blank if answer not shown) */}
                <div className="min-h-[1.2rem] text-right w-full">
                  {showAnswer && (
                    <div className={`text-gray-600 font-mono ${largeFont ? 'text-xl' : 'text-base'} font-bold`}>
                      {typeof question.answer === 'number' && question.answer % 1 !== 0 
                        ? question.answer.toFixed(1) 
                        : formatNumber(question.answer)}
                    </div>
                  )}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
  
  if (question.isVertical) {
    // Check if this is decimal_add_sub (operands stored as integers * 10)
    // Check operator string more robustly
    const operatorStr = String(question.operator || "");
    const operatorCharCode = operatorStr.length > 0 ? operatorStr.charCodeAt(0) : -1;
    
    // Check if ALL operands are multiples of 10 (decimal format indicator)
    const allOperandsAreMultiplesOf10 = question.operands && 
      question.operands.length > 0 &&
      question.operands.every(op => op % 10 === 0 && op >= 10 && op <= 9990);
    
    // Only treat as decimal if operator is ± AND operands are multiples of 10
    // Regular add_sub uses ± but operands are NOT multiples of 10
    const isDecimalFormat = (
      (operatorStr === "±" || 
       operatorStr === "\u00B1" ||
       operatorCharCode === 0x00B1 || // Unicode code point for ± (177)
       operatorCharCode === 177 || // Decimal representation
       (operatorStr && operatorStr.includes("±"))) &&
      allOperandsAreMultiplesOf10 // MUST have decimal format operands
    );
    
    // Use table structure for Excel compatibility - serial number in separate column
    return (
      <table className="w-full border-collapse bg-white rounded border border-gray-200 hover:border-blue-300 transition-colors shadow-sm">
        <tbody>
          {/* Serial number row */}
          <tr>
            {!hideSerialNumber && (
              <td className="p-1.5 align-center w-8 border-r border-gray-200 text-center">
                <span className="font-bold text-sm text-blue-700">{question.id}.</span>
              </td>
            )}
            <td className="p-1.5">
              <div className="flex flex-col items-end space-y-0.5">
                {question.operands.map((op, idx) => {
                  // Only convert to decimal if:
                  // 1. Operator is ± (explicit decimal_add_sub indicator), OR
                  // 2. ALL operands are multiples of 10 AND >= 10 AND <= 9990 (not basic add/sub like 1, 8, 4)
                  // Basic add/sub: operands are 1-9, 10-99, 100-999, etc. (NOT multiples of 10 unless they're actually decimals)
                  // Decimal add/sub: operands are stored as 10, 20, 30... (multiples of 10 representing 1.0, 2.0, 3.0...)
                  const allOperandsMultipleOf10 = question.operands.every(o => 
                    o % 10 === 0 && o >= 10 && o <= 9990 && o !== 0
                  );
                  // Additional check: if any operand is < 10 and not a multiple of 10, it's NOT decimal
                  const hasSmallNonMultipleOperand = question.operands.some(o => 
                    o < 10 && o % 10 !== 0
                  );
                  const hasMixedOperators = question.operators && question.operators.length > 0;
                  
                  // Only treat as decimal if operator is ± OR (all are multiples of 10 AND no small non-multiple operands)
                  const shouldConvertToDecimal = isDecimalFormat || 
                    (allOperandsMultipleOf10 && hasMixedOperators && !hasSmallNonMultipleOperand);
                  
                  const displayValue = shouldConvertToDecimal 
                    ? (op / 10).toFixed(1) 
                    : formatNumber(op);
                  
                  // Handle mixed operations (add_sub)
                  if (question.operators && question.operators.length > 0) {
                    if (idx === 0) {
                      // First operand has no operator
                      return (
                        <div key={idx} className={`text-right font-mono ${largeFont ? 'text-xl' : 'text-base'} font-semibold text-gray-800 leading-tight`}>
                          {displayValue}
                        </div>
                      );
                    } else {
                      // Subsequent operands have their operators
                      const operator = question.operators[idx - 1];
                      return (
                        <div key={idx} className={`text-right font-mono ${largeFont ? 'text-xl' : 'text-base'} font-semibold text-gray-800 leading-tight`}>
                          <span className="mr-1 text-blue-600">{operator}</span>
                          {displayValue}
                        </div>
                      );
                    }
                  }
                  
                  // Handle single operator type (addition or subtraction)
                  const showOperator = 
                    (question.operator === "-" && idx > 0) || 
                    (question.operator !== "-" && idx === question.operands.length - 1);
                  
                  return (
                    <div key={idx} className={`text-right font-mono ${largeFont ? 'text-xl' : 'text-base'} font-semibold text-gray-800 leading-tight`}>
                      {showOperator && (
                        <span className="mr-1 text-blue-600">{question.operator}</span>
                      )}
                      {displayValue}
                    </div>
                  );
                })}
                <div className="border-t border-gray-400 w-full my-0.5"></div>
                {/* Always show answer space (blank if answer not shown) */}
                <div className="min-h-[1.2rem] text-right w-full">
                  {showAnswer && (
                    <div className={`text-gray-600 font-mono ${largeFont ? 'text-xl' : 'text-base'} font-bold`}>
                      {typeof question.answer === 'number' && question.answer % 1 !== 0 
                        ? question.answer.toFixed(1) 
                        : formatNumber(question.answer)}
                    </div>
                  )}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  // For square root, cube root, LCM, GCD, decimal operations, percentage, use the text field directly
  // Check if it's a decimal division (whole numbers with decimal answer)
  const isDecimalDivision = question.operator === "÷" && question.text && question.text.includes("÷") && !question.text.includes(".");
  
  // Check for operators that use single operand or have custom text (squares, complements, etc.)
  const usesSingleOperand = question.operator === "²" || question.operator === "C";
  const hasCustomText = question.text && (question.text.includes("LCM") || question.text.includes("GCD") || question.text.includes("√") || question.text.includes("∛") || question.text.includes("% of") || question.text.includes("C of") || question.text.includes("²"));
  
  if (question.operator === "√" || question.operator === "∛" || question.operator === "LCM" || question.operator === "GCD" || question.operator === "%" || question.operator === "²" || question.operator === "C" || isDecimalDivision || hasCustomText || usesSingleOperand || (question.operands && question.operands.length === 1)) {
    // Use table structure for Excel compatibility - answers in separate column
    return (
      <table className="w-full border-collapse bg-white rounded border border-gray-200 hover:border-blue-300 transition-colors shadow-sm">
        <tbody>
          <tr>
            {!hideSerialNumber && (
              <td className="p-1.5 align-center w-8 border-r border-gray-200 text-center">
                <span className="font-bold text-sm text-blue-700">{question.id}.</span>
              </td>
            )}
              <td className={`p-1.5 ${showAnswer ? 'border-r border-gray-200' : ''}`}>
              <div className={`font-mono ${smallHorizontalFont ? 'text-sm' : (largeFont ? 'text-xl' : 'text-base')} font-semibold text-gray-800 break-all`} style={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}>
                {question.text}
              </div>
            </td>
            {showAnswer && (
              <td className="p-1.5 w-32 text-right align-top">
                <div className={`text-gray-600 font-mono ${largeFont ? 'text-xl' : 'text-base'} font-bold text-right whitespace-nowrap`}>
                  {typeof question.answer === 'number' && question.answer % 1 !== 0 
                    ? question.answer.toFixed(2).replace(/\.?0+$/, '') 
                    : formatNumber(question.answer)}
                </div>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    );
  }

  // For decimal multiplication, handle decimal display
  if (question.operator === "×" && question.text && question.text.includes(".")) {
    // Use table structure for Excel compatibility - answers in separate column
    return (
      <table className="w-full border-collapse bg-white rounded border border-gray-200 hover:border-blue-300 transition-colors shadow-sm">
        <tbody>
          <tr>
            {!hideSerialNumber && (
              <td className="p-1.5 align-center w-8 border-r border-gray-200 text-center">
                <span className="font-bold text-sm text-blue-700">{question.id}.</span>
              </td>
            )}
              <td className={`p-1.5 ${showAnswer ? 'border-r border-gray-200' : ''}`}>
              <div className={`font-mono ${smallHorizontalFont ? 'text-sm' : (largeFont ? 'text-xl' : 'text-base')} font-semibold text-gray-800 break-all`} style={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}>
                {question.text}
              </div>
            </td>
            {showAnswer && (
              <td className="p-1.5 w-32 text-right align-top">
                <div className={`text-gray-600 font-mono ${largeFont ? 'text-xl' : 'text-base'} font-bold text-right whitespace-nowrap`}>
                  {typeof question.answer === 'number' && question.answer % 1 !== 0 
                    ? question.answer.toFixed(2) 
                    : formatNumber(question.answer)}
                </div>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    );
  }

  // Use table structure for Excel compatibility - answers in separate column
  // Handle questions with single operand or use text field if available
  let questionText: string;
  if (question.text && (question.operands.length === 1 || question.operator === "²" || question.operator === "C")) {
    // Use the text field for single-operand questions or custom text
    questionText = question.text;
  } else if (question.operands.length === 1) {
    // Single operand without custom text - construct it
    questionText = `${formatNumber(question.operands[0])} ${question.operator} =`;
  } else if (question.operands.length >= 2) {
    // Two or more operands - standard format
    questionText = `${formatNumber(question.operands[0])} ${question.operator} ${formatNumber(question.operands[1])} =`;
  } else {
    // Fallback to text field if available
    questionText = question.text || "?";
  }
  
  return (
    <table className="w-full border-collapse bg-white rounded border border-gray-200 hover:border-blue-300 transition-colors shadow-sm">
      <tbody>
        <tr>
          {!hideSerialNumber && (
            <td className="p-1.5 align-center w-8 border-r border-gray-200 text-center">
              <span className="font-bold text-sm text-blue-700">{question.id}.</span>
            </td>
          )}
          <td className={`p-1.5 ${showAnswer ? 'border-r border-gray-200' : ''}`}>
            <div className={`font-mono ${smallHorizontalFont ? 'text-sm' : (largeFont ? 'text-xl' : 'text-base')} font-semibold text-gray-800 break-all`}>
              {questionText}
            </div>
          </td>
          {showAnswer && (
            <td className="p-1.5 w-32 text-right align-top">
              <div className={`text-gray-600 font-mono ${largeFont ? 'text-xl' : 'text-base'} font-bold text-right whitespace-nowrap`}>
                {typeof question.answer === 'number' && question.answer % 1 !== 0 
                  ? question.answer.toFixed(2) 
                  : formatNumber(question.answer)}
              </div>
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
}
