"""Math question generation logic."""
import random
import math
from typing import List, Optional, Callable
from schemas import Question, Constraints, BlockConfig, GeneratedBlock, QuestionType


def generate_number(digits: int, rng: Optional[Callable[[], float]] = None) -> int:
    """Generate a number with specified digits, ensuring it doesn't start with 0."""
    if digits <= 0:
        return 0
    
    min_val = 10 ** (digits - 1)
    max_val = (10 ** digits) - 1
    
    if rng:
        return int(rng() * (max_val - min_val + 1)) + min_val
    return random.randint(min_val, max_val)


def generate_seeded_rng(seed: int, question_id: int) -> Callable[[], float]:
    """Create a seeded random number generator for consistency."""
    # Use seed + question_id to create unique starting state for each question
    # Multiply by different primes to ensure better distribution and uniqueness
    initial_state = (seed * 7919 + question_id * 9973) % (2**31)
    call_count = [0]  # Track number of calls to ensure different values
    
    def rng():
        nonlocal initial_state
        call_count[0] += 1
        # Linear congruential generator with better constants
        # Add call_count to ensure each call produces different value
        initial_state = (initial_state * 1664525 + 1013904223 + call_count[0] * 17) % (2**32)
        return (initial_state % (2**31)) / (2**31)
    
    return rng


def generate_question(
    question_id: int,
    question_type: QuestionType,
    constraints: Constraints,
    seed: Optional[int] = None,
    retry_count: int = 0
) -> Question:
    """
    Generate a single math question.
    
    Args:
        question_id: Unique ID for the question
        question_type: Type of question to generate
        constraints: Constraints for generation
        seed: Optional seed for consistent generation
        retry_count: Current retry count (max 20)
    
    Returns:
        Generated Question object
    """
    # Prevent infinite recursion - fall back to simple question of the same type
    if retry_count > 20:
        digits = constraints.digits or 1
        a = generate_number(digits)
        b = generate_number(digits)

        if question_type == "multiplication":
            # Simple multiplication fallback - generate with default digits
            a = generate_number(2)  # 2-digit multiplicand
            b = generate_number(1)  # 1-digit multiplier
            return Question(
                id=question_id,
                text=f"{a} × {b} =",
                operands=[a, b],
                operator="×",
                operators=None,
                answer=float(a * b),
                isVertical=False
            )
        elif question_type == "division":
            # Simple division fallback - generate with default digits
            a = generate_number(2)  # 2-digit dividend
            b = generate_number(1)  # 1-digit divisor
            if b == 0:
                b = 1
            return Question(
                id=question_id,
                text=f"{a} ÷ {b} =",
                operands=[a, b],
                operator="÷",
                operators=None,
                answer=float(a // b),  # Integer division for simplicity
                isVertical=False
            )
        elif question_type in ("subtraction", "add_sub"):
            return Question(
                id=question_id,
                text=f"{max(a, b)}\n- {min(a, b)}",
                operands=[max(a, b), min(a, b)],
                operator="-",
                operators=None,
                answer=float(max(a, b) - min(a, b)),
                isVertical=True
            )
        # Default fallback for addition and other types
        return Question(
            id=question_id,
            text=f"{a}\n+ {b}",
            operands=[a, b],
            operator="+",
            operators=None,
            answer=float(a + b),
            isVertical=True
        )
    
    # Setup RNG
    if seed is not None:
        rng = generate_seeded_rng(seed, question_id)
        generate_num = lambda d: generate_number(d, rng)
        random_func = rng
    else:
        generate_num = lambda d: generate_number(d)
        random_func = random.random
    
    digits = constraints.digits or 1
    operands: List[int] = []
    answer = 0.0
    operator = "+"
    operators: Optional[List[str]] = None  # For mixed operations
    is_vertical = False
    text: Optional[str] = None  # Will be built later, or set for special operations
    
    # Read rows with proper validation
    rows = 2
    if constraints.rows is not None:
        rows = int(constraints.rows)
        if rows < 2:
            rows = 2
        if rows > 30:
            rows = 30
    
    if question_type == "addition":
        operator = "+"
        is_vertical = True
        # Generate all numbers with exact same digit count
        operands = []
        for _ in range(rows):
            num = generate_num(digits)
            # Ensure it has exactly the right number of digits
            while len(str(num)) != digits:
                num = generate_num(digits)
            operands.append(num)
        answer = float(sum(operands))
    
    elif question_type == "subtraction":
        operator = "-"
        is_vertical = True
        
        # For subtraction: first number must be >= sum of all numbers to subtract
        # All numbers must have exactly the same digit count
        
        max_first = (10 ** digits) - 1
        min_first = 10 ** (digits - 1)
        
        # Generate numbers to subtract first
        numbers_to_subtract = []
        for _ in range(rows - 1):
            num = generate_num(digits)
            # Ensure exact digit count
            while len(str(num)) != digits:
                num = generate_num(digits)
            numbers_to_subtract.append(num)
        
        sum_to_subtract = sum(numbers_to_subtract)
        
        # Calculate minimum first number needed (must be >= sum + 1 to ensure positive answer)
        required_min_first = max(min_first, sum_to_subtract + 1)
        
        # If impossible (required min > max possible), retry with smaller numbers
        if required_min_first > max_first:
            if retry_count < 20:
                return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
            # Last resort: use minimum possible numbers
            numbers_to_subtract = [min_first for _ in range(rows - 1)]
            sum_to_subtract = sum(numbers_to_subtract)
            required_min_first = max(min_first, sum_to_subtract + 1)
        
        # Generate first number in valid range [required_min_first, max_first]
        if required_min_first <= max_first:
            first = int(random_func() * (max_first - required_min_first + 1)) + required_min_first
        else:
            # Shouldn't happen, but fallback
            first = max_first
        
        # Verify first number has correct digits
        if len(str(first)) != digits:
            first = max(min_first, min(max_first, first))
            if len(str(first)) != digits and retry_count < 20:
                return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
        
        operands = [first] + numbers_to_subtract
        answer = float(first - sum_to_subtract)
        
        # Final verification
        if answer < 0:
            # This shouldn't happen, but fix it
            if retry_count < 20:
                return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
            # Last resort: ensure answer is at least 0
            operands[0] = sum_to_subtract
            answer = 0.0
        
        if len(operands) != rows:
            if retry_count < 20:
                return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
        
        # Verify all operands have correct digits
        for i, op in enumerate(operands):
            if len(str(op)) != digits:
                if retry_count < 20:
                    return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
                # Clamp to valid range
                operands[i] = max(min_first, min(max_first, op))
    
    elif question_type == "add_sub":
        is_vertical = True
        operator = "±"  # Indicates mixed operations
        
        # Generate mixed addition/subtraction: e.g., 9 - 2 + 5 + 7 - 3
        # Strategy: Generate operands and randomly assign operators, ensuring positive result
        
        max_val = (10 ** digits) - 1
        min_val = 10 ** (digits - 1)
        
        # Generate all operands first
        operands = []
        for _ in range(rows):
            num = generate_num(digits)
            # Ensure exact digit count
            while len(str(num)) != digits:
                num = generate_num(digits)
            operands.append(num)
        
        # Randomly assign operators (+ or -) to each position after the first
        operators_list = []
        for i in range(rows - 1):
            # Randomly choose + or - (50/50 chance, but ensure some variety)
            op = "+" if random_func() < 0.5 else "-"
            operators_list.append(op)
        
        # Calculate answer by applying operations left to right
        answer = float(operands[0])
        for i, op in enumerate(operators_list):
            if op == "+":
                answer += operands[i + 1]
            else:
                answer -= operands[i + 1]
        
        # If answer is negative, we need to adjust
        # Strategy: If answer < 0, try to balance by changing some operators or adjusting numbers
        if answer < 0:
            if retry_count < 20:
                # Retry with different operator distribution
                return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
            
            # Last resort: ensure positive answer by adjusting
            # Calculate how much we need to add to make it positive
            needed = abs(answer) + 1
            
            # Try to convert some subtractions to additions or increase some numbers
            # First, try changing operators
            for i in range(len(operators_list)):
                if operators_list[i] == "-" and needed > 0:
                    # Changing this to + will add 2 * operands[i+1] to the answer
                    change = 2 * operands[i + 1]
                    if change >= needed:
                        operators_list[i] = "+"
                        answer += change
                        needed -= change
                        if answer >= 0:
                            break
            
            # If still negative, try increasing the first number
            if answer < 0:
                needed = abs(answer) + 1
                if operands[0] + needed <= max_val:
                    operands[0] += needed
                    answer += needed
                else:
                    # Can't increase first, try decreasing subtractors
                    for i in range(len(operators_list)):
                        if operators_list[i] == "-" and needed > 0:
                            decrease = min(needed, operands[i + 1] - min_val)
                            operands[i + 1] -= decrease
                            answer += decrease
                            needed -= decrease
                            if answer >= 0:
                                break
                    
                    # If still negative, set answer to 0 by adjusting first number
                    if answer < 0:
                        operands[0] = max(min_val, operands[0] - abs(answer))
                        answer = 0.0
        
        # Verify all operands still have correct digits after adjustments
        for i, op in enumerate(operands):
            if len(str(op)) != digits:
                if retry_count < 20:
                    return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
                # Clamp to valid range
                operands[i] = max(min_val, min(max_val, op))
        
        # Recalculate answer to ensure it's correct after any adjustments
        answer = float(operands[0])
        for i, op in enumerate(operators_list):
            if op == "+":
                answer += operands[i + 1]
            else:
                answer -= operands[i + 1]
        
        # Store operators list for use in text generation
        operators = operators_list
    
    elif question_type == "multiplication":
        operator = "×"
        is_vertical = False
        # For multiplication, use specific digit constraints
        # Check if multiplicandDigits/multiplierDigits are explicitly set (not None)
        if constraints.multiplicandDigits is not None:
            multiplicand_digits = constraints.multiplicandDigits
        elif constraints.digits is not None:
            multiplicand_digits = constraints.digits
        else:
            multiplicand_digits = 2  # Default fallback
        
        if constraints.multiplierDigits is not None:
            multiplier_digits = constraints.multiplierDigits
        elif constraints.digits is not None:
            multiplier_digits = constraints.digits
        else:
            multiplier_digits = 1  # Default fallback

        multiplicand_digits = max(1, min(20, multiplicand_digits))  # Allow up to 20 digits as per schema
        multiplier_digits = max(1, min(20, multiplier_digits))  # Allow up to 20 digits as per schema

        # Generate numbers with exact digit constraints
        a = generate_num(multiplicand_digits)
        b = generate_num(multiplier_digits)
        
        # Validate that generated numbers match the digit constraints
        a_digits = len(str(a))
        b_digits = len(str(b))
        
        # Retry if digits don't match (shouldn't happen, but safety check)
        if a_digits != multiplicand_digits or b_digits != multiplier_digits:
            if retry_count < 20:
                return generate_question(question_id, question_type, constraints, seed, retry_count + 1)

        operands = [a, b]
        answer = float(a * b)

        if answer < 0 or not (answer > 0 and answer < float('inf')):
            if retry_count < 20:
                return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
        
        # Note: We removed the "skip if multiplier is 1" check to respect user's digit constraints
        # If user wants 1-digit multiplier, they should get 1-digit multipliers (including 1)
    
    elif question_type == "division":
        operator = "÷"
        is_vertical = False
        # For division, use specific digit constraints, with reasonable defaults
        dividend_digits = constraints.dividendDigits or 2  # Default to 2 digits
        divisor_digits = constraints.divisorDigits or 1    # Default to 1 digit

        dividend_digits = max(1, min(20, dividend_digits))  # Allow up to 20 digits as per schema
        divisor_digits = max(1, min(20, divisor_digits))  # Allow up to 20 digits as per schema
        
        # Generate divisor (must be non-zero and not 1 to avoid obvious questions)
        divisor = generate_num(divisor_digits)
        attempts = 0
        while (divisor == 0 or divisor == 1) and attempts < 10:
            divisor = generate_num(divisor_digits)
            attempts += 1
        if divisor == 0 or divisor == 1:
            divisor = 2  # Use 2 as fallback instead of 1
        
        # Calculate valid quotient range
        dividend_min = 10 ** (dividend_digits - 1)
        dividend_max = (10 ** dividend_digits) - 1
        quotient_min = max(1, dividend_min // divisor)
        quotient_max = min(
            (10 ** max(1, dividend_digits - divisor_digits + 1)) - 1,
            dividend_max // divisor
        )
        
        if quotient_min > quotient_max or quotient_max < 1:
            return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
        
        # Generate quotient
        quotient = int(random_func() * (quotient_max - quotient_min + 1)) + quotient_min
        dividend = quotient * divisor
        
        # Verify
        if dividend < dividend_min or dividend > dividend_max or dividend % divisor != 0:
            return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
        
        operands = [dividend, divisor]
        answer = float(quotient)
    
    elif question_type == "square_root":
        operator = "√"
        is_vertical = False
        root_digits = constraints.rootDigits or 3
        root_digits = max(1, min(30, root_digits))  # Allow up to 30 digits as per schema
        
        # Calculate valid root range
        target_min = 10 ** (root_digits - 1)
        target_max = (10 ** root_digits) - 1
        
        min_root = int(target_min ** 0.5) + 1
        max_root = int(target_max ** 0.5)
        
        # Ensure we have a valid range
        if max_root < min_root:
            root = min_root
        else:
            # Simple approach: use question_id to create unique offset, then add random
            root_range = max_root - min_root + 1
            base_offset = (question_id * 7) % root_range
            random_offset = int(random_func() * root_range)
            root = min_root + ((base_offset + random_offset) % root_range)
        
        number = root * root
        operands = [number]
        answer = float(root)
        
        # Format text - just show the square root symbol with number
        text = f"√{number} ="
    
    elif question_type == "cube_root":
        operator = "∛"
        is_vertical = False
        root_digits = constraints.rootDigits or 4
        root_digits = max(1, min(30, root_digits))  # Allow up to 30 digits as per schema
        
        # Calculate valid root range
        target_min = 10 ** (root_digits - 1)
        target_max = (10 ** root_digits) - 1
        
        min_root = int(target_min ** (1/3)) + 1
        max_root = int(target_max ** (1/3))
        
        # Ensure we have a valid range
        if max_root < min_root:
            root = min_root
        else:
            # Simple approach: use question_id to create unique offset, then add random
            root_range = max_root - min_root + 1
            base_offset = (question_id * 11) % root_range
            random_offset = int(random_func() * root_range)
            root = min_root + ((base_offset + random_offset) % root_range)
        
        number = root * root * root
        operands = [number]
        answer = float(root)
        
        # Format text - just show the cube root symbol with number
        text = f"∛{number} ="
    
    elif question_type == "decimal_multiplication":
        operator = "×"
        is_vertical = False
        
        # Get digit constraints for decimal multiplication
        # multiplicandDigits = digits BEFORE decimal point (always 1 decimal place after)
        # multiplierDigits: 0 = whole number, 1+ = digits BEFORE decimal point (always 1 decimal place after)
        multiplicand_digits = constraints.multiplicandDigits or int(random_func() * 3) + 1  # 1-3 digits default
        multiplier_digits = constraints.multiplierDigits if constraints.multiplierDigits is not None else int(random_func() * 2) + 1  # 1-2 digits default, or 0 for whole
        
        multiplicand_digits = max(1, min(20, multiplicand_digits))  # Allow up to 20 digits as per schema
        multiplier_digits = max(0, min(20, multiplier_digits))  # Allow 0 for whole number, up to 20 digits as per schema
        
        # Generate multiplicand: digits_before_decimal + 1 decimal place (always decimal)
        # e.g., multiplicand_digits=1 → range 1.0 to 9.9
        # e.g., multiplicand_digits=2 → range 10.0 to 99.9
        # e.g., multiplicand_digits=3 → range 100.0 to 999.9
        a_min_whole = 10 ** (multiplicand_digits - 1)
        a_max_whole = (10 ** multiplicand_digits) - 1
        a_whole = int(random_func() * (a_max_whole - a_min_whole + 1)) + a_min_whole
        a_decimal = int(random_func() * 10)  # 0-9 for decimal digit
        a_int = a_whole * 10 + a_decimal
        a = a_int / 10.0
        
        # Generate multiplier based on multiplier_digits
        if multiplier_digits == 0:
            # Whole number: generate 1-99 (reasonable range)
            b = int(random_func() * 99) + 1
            b_int = b
        else:
            # Decimal: digits_before_decimal + 1 decimal place
            b_min_whole = 10 ** (multiplier_digits - 1)
            b_max_whole = (10 ** multiplier_digits) - 1
            b_whole = int(random_func() * (b_max_whole - b_min_whole + 1)) + b_min_whole
            b_decimal = int(random_func() * 10)  # 0-9 for decimal digit
            b_int = b_whole * 10 + b_decimal
            b = b_int / 10.0
        
        answer = round(a * b, 2)
        operands = [a_int, b_int]
        # Format numbers: always show 1 decimal place for multiplicand, show decimals for multiplier only if it's a decimal
        if multiplier_digits == 0:
            text = f"{a:.1f} × {b} ="
        else:
            text = f"{a:.1f} × {b:.1f} ="
    
    elif question_type == "lcm":
        operator = "LCM"
        is_vertical = False
        
        # Get digit constraints for LCM
        first_digits = constraints.multiplicandDigits if constraints.multiplicandDigits is not None else (constraints.digits if constraints.digits is not None else 2)  # Default 2
        second_digits = constraints.multiplierDigits if constraints.multiplierDigits is not None else (constraints.digits if constraints.digits is not None else 2)  # Default 2
        
        first_digits = max(1, min(10, first_digits))  # Updated max to 10
        second_digits = max(1, min(10, second_digits))  # Updated max to 10
        
        # Generate two numbers - simple and fast
        a = generate_num(first_digits)
        b = generate_num(second_digits)
        
        # Ensure a != b for variety
        if a == b:
            b_min = 10 ** (second_digits - 1)
            b_max = (10 ** second_digits) - 1
            if b < b_max:
                b += 1
            else:
                b = b_min
        
        # Calculate LCM
        answer = float(abs(a * b) // math.gcd(a, b))
        operands = [a, b]
        text = f"LCM({a}, {b}) ="
    
    elif question_type == "gcd":
        operator = "GCD"
        is_vertical = False
        
        # Get digit constraints for GCD
        first_digits = constraints.multiplicandDigits if constraints.multiplicandDigits is not None else (constraints.digits if constraints.digits is not None else 3)  # Default 3
        second_digits = constraints.multiplierDigits if constraints.multiplierDigits is not None else (constraints.digits if constraints.digits is not None else 2)  # Default 2
        
        first_digits = max(1, min(10, first_digits))  # Updated max to 10
        second_digits = max(1, min(10, second_digits))  # Updated max to 10
        
        # Generate two numbers - simple and fast
        a = generate_num(first_digits)
        b = generate_num(second_digits)
        
        # Ensure a != b for variety
        if a == b:
            b_min = 10 ** (second_digits - 1)
            b_max = (10 ** second_digits) - 1
            if b < b_max:
                b += 1
            else:
                b = b_min
        
        # Calculate GCD
        answer = float(math.gcd(a, b))
        operands = [a, b]
        text = f"GCD({a}, {b}) ="
    
    elif question_type == "integer_add_sub":
        operator = "±"  # Indicates mixed operations with possible negatives
        is_vertical = True
        
        # Get constraints
        digits = constraints.digits or 2
        rows = constraints.rows or 3
        rows = max(2, min(30, rows))  # Allow up to 30 rows as per schema
        
        # Generate all operands first (all with exact same digit count)
        operands = []
        for _ in range(rows):
            num = generate_num(digits)
            # Ensure exact digit count
            while len(str(num)) != digits:
                num = generate_num(digits)
            operands.append(num)
        
        # Randomly assign operators (+ or -) to each position after the first
        operators_list = []
        for i in range(rows - 1):
            # Randomly choose + or - (50/50 chance)
            op = "+" if random_func() < 0.5 else "-"
            operators_list.append(op)
        
        # Calculate answer by applying operations left to right (can be negative)
        answer = float(operands[0])
        for i, op in enumerate(operators_list):
            if op == "+":
                answer += operands[i + 1]
            else:
                answer -= operands[i + 1]
        
        # Store operators list for use in text generation
        operators = operators_list
        
        # Note: We don't ensure positive answer - negatives are allowed!
    
    elif question_type == "decimal_add_sub":
        operator = "±"  # Indicates mixed operations with decimals
        is_vertical = True
        
        # Get constraints
        digits = constraints.digits or 2
        rows = constraints.rows or 3
        rows = max(2, min(30, rows))  # Allow up to 30 rows as per schema
        
        # Generate decimal numbers: digits before decimal point, always 1 decimal place
        # e.g., digits=1 → 1.0 to 9.9, digits=2 → 10.0 to 99.9
        min_whole = 10 ** (digits - 1)
        max_whole = (10 ** digits) - 1
        
        # Generate all operands as decimals (stored as integers * 10)
        operands = []
        for _ in range(rows):
            whole_part = int(random_func() * (max_whole - min_whole + 1)) + min_whole
            decimal_part = int(random_func() * 10)  # 0-9 for decimal digit
            # Store as integer (multiply by 10 to preserve decimal)
            num_int = whole_part * 10 + decimal_part
            operands.append(num_int)
        
        # Generate operators ensuring no negative intermediate results
        # Strategy: Start with all additions, then carefully add subtractions that won't cause negatives
        operators_list = []
        current_total = float(operands[0]) / 10.0
        
        for i in range(rows - 1):
            operand_val = float(operands[i + 1]) / 10.0
            
            # Try to add a subtraction if it won't make the result negative
            # Otherwise, use addition
            if random_func() < 0.4 and current_total - operand_val >= 0.1:
                # Safe to subtract
                operators_list.append("-")
                current_total -= operand_val
            else:
                # Use addition
                operators_list.append("+")
                current_total += operand_val
        
        # Calculate final answer
        answer = float(operands[0]) / 10.0
        for i, op in enumerate(operators_list):
            operand_val = float(operands[i + 1]) / 10.0
            if op == "+":
                answer += operand_val
            else:
                answer -= operand_val
        
        # Double-check: ensure answer is positive (should always be true with our strategy)
        if answer < 0:
            if retry_count < 20:
                # Retry with different approach
                return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
            
            # Last resort: convert all subtractions to additions
            operators_list = ["+"] * (rows - 1)
            answer = sum(float(op) / 10.0 for op in operands)
        
        # Round answer to 1 decimal place
        answer = round(answer, 1)
        
        # Store operators list for use in text generation
        operators = operators_list
        
        # Build text representation for decimal add/sub
        text_parts = []
        # First operand
        first_val = float(operands[0]) / 10.0
        text_parts.append(f"{first_val:.1f}")
        # Subsequent operands with their operators
        for i, op in enumerate(operands[1:], 1):
            val = float(op) / 10.0
            text_parts.append(f"{operators_list[i-1]} {val:.1f}")
        text = "\n".join(text_parts)
    
    elif question_type == "decimal_division":
        operator = "÷"
        is_vertical = False
        
        # Get digit constraints - same as decimal multiplication
        # multiplicandDigits = digits before decimal point for dividend (but dividend will be whole)
        # multiplierDigits = digits for divisor (divisor will be whole)
        multiplicand_digits = constraints.multiplicandDigits or int(random_func() * 3) + 1  # 1-3 digits default
        multiplier_digits = constraints.multiplierDigits or int(random_func() * 2) + 1  # 1-2 digits default
        
        multiplicand_digits = max(1, min(20, multiplicand_digits))  # Allow up to 20 digits as per schema
        multiplier_digits = max(1, min(20, multiplier_digits))  # Allow up to 20 digits as per schema
        
        # Generate whole number dividend with specified digits
        dividend_min = 10 ** (multiplicand_digits - 1)
        dividend_max = (10 ** multiplicand_digits) - 1
        dividend = generate_num(multiplicand_digits)
        
        # Generate whole number divisor with specified digits
        divisor_min = 10 ** (multiplier_digits - 1)
        divisor_max = (10 ** multiplier_digits) - 1
        divisor = generate_num(multiplier_digits)
        
        # Ensure divisor is non-zero
        attempts = 0
        while divisor == 0 and attempts < 10:
            divisor = generate_num(multiplier_digits)
            attempts += 1
        if divisor == 0:
            divisor = 1
        
        # Calculate answer (will be decimal)
        answer = round(dividend / divisor, 2)
        
        operands = [dividend, divisor]
        text = f"{dividend} ÷ {divisor} ="
    
    elif question_type == "direct_add_sub":
        operator = "±"  # Mixed operations
        is_vertical = True
        
        # Get constraints - typically 1 digit for Junior level
        digits = constraints.digits or 1
        rows = constraints.rows or 3
        rows = max(2, min(15, rows))
        digits = max(1, min(2, digits))  # Limit to 1-2 digits for Junior
        
        # Direct operations: No movement of 5 or 10 bead groups
        # For single digits: sum < 10, and not using 5 bead complements
        # Direct pairs (a, b) where a+b < 10 and doesn't involve 5 bead:
        # Examples: 1+7, 2+2, 3+4, 4+3, 6+1, 7+2, 8+1, 9-1, 8-7, 6-5, etc.
        # Excludes: pairs summing to 5 (small friends) or 10 (big friends)
        
        def is_direct_pair(a: int, b: int, is_add: bool) -> bool:
            """Check if a pair forms a direct operation (no 5/10 movement)."""
            if is_add:
                total = a + b
                # Must be < 10 (no crossing 10)
                if total >= 10:
                    return False
                # Must not be small friends (sum to 5)
                if (a + b) == 5:
                    return False
                # Must not be big friends (would sum to 10 if added, but we check total < 10 above)
                return True
            else:
                # Subtraction: result >= 0, and doesn't require 5 bead borrowing
                result = a - b
                if result < 0:
                    return False
                # Check if it involves small friends complement (e.g., 8-4, where 4+1=5)
                # Actually, for direct, we want simple cases like 9-1, 8-7, 6-5, 7-2, etc.
                # Avoid cases where we'd use 5 bead technique
                # Direct subtraction: simple cases where result + b doesn't involve 5 technique
                return True
        
        # Generate direct operations
        operands = []
        operators_list = []
        
        # Generate first operand (0-9 for 1 digit, 10-99 for 2 digits)
        min_val = 0 if digits == 1 else 10
        max_val = 9 if digits == 1 else 99
        
        first = int(random_func() * (max_val - min_val + 1)) + min_val
        operands.append(first)
        current = first
        
        for i in range(rows - 1):
            # Decide operation type (mostly addition, some subtraction)
            is_add = random_func() < 0.7  # 70% addition, 30% subtraction
            
            if digits == 1:
                # Single digit operations
                if is_add:
                    # Generate a number such that current + num < 10 and not small friends
                    max_num = min(9 - current, 9)
                    if max_num <= 0:
                        is_add = False
                    else:
                        # Avoid small friends (sum to 5)
                        valid_nums = [n for n in range(1, max_num + 1) if (current % 10 + n) != 5]
                        if not valid_nums:
                            is_add = False
                
                if is_add:
                    max_num = min(9 - current, 9)
                    valid_nums = [n for n in range(1, max_num + 1) if (current % 10 + n) != 5]
                    if valid_nums:
                        num = valid_nums[int(random_func() * len(valid_nums))]
                        operators_list.append("+")
                        current += num
                    else:
                        # Fallback to subtraction
                        valid_nums = [n for n in range(1, (current % 10) + 1) if n != (current % 10) and (current % 10 - n) != 5]
                        if valid_nums:
                            num = valid_nums[int(random_func() * len(valid_nums))]
                            operators_list.append("-")
                            current -= num
                        else:
                            num = 1
                            operators_list.append("-")
                            current -= num
                else:
                    # Subtraction
                    valid_nums = [n for n in range(1, (current % 10) + 1) if (current % 10 - n) != 5]
                    if not valid_nums:
                        valid_nums = [1]
                    num = valid_nums[int(random_func() * len(valid_nums))]
                    operators_list.append("-")
                    current -= num
                
                operands.append(num)
            else:
                # 2-digit operations - simpler approach
                num = int(random_func() * 9) + 1
                if is_add and current + num < 100:
                    operators_list.append("+")
                    current += num
                else:
                    if current > num:
                        operators_list.append("-")
                        current -= num
                    else:
                        operators_list.append("+")
                        current += num
                operands.append(num)
        
        # Calculate final answer
        answer = float(operands[0])
        for i, op in enumerate(operators_list):
            if op == "+":
                answer += operands[i + 1]
            else:
                answer -= operands[i + 1]
        
        # Ensure positive answer
        if answer < 0:
            if retry_count < 20:
                return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
            # Last resort: make it positive
            operators_list = ["+"] * (rows - 1)
            answer = float(sum(operands))
        
        operators = operators_list
    
    elif question_type == "small_friends_add_sub":
        operator = "±"
        is_vertical = True
        
        digits = constraints.digits or 1
        rows = constraints.rows or 3
        rows = max(2, min(15, rows))
        digits = max(1, min(2, digits))
        
        # Small friends: pairs that sum to 5 (1+4, 2+3, 3+2, 4+1, 0+5, 5+0)
        small_friends_pairs = [(1, 4), (2, 3), (3, 2), (4, 1), (0, 5), (5, 0)]
        
        operands = []
        operators_list = []
        
        min_val = 0 if digits == 1 else 10
        max_val = 9 if digits == 1 else 99
        
        first = int(random_func() * (max_val - min_val + 1)) + min_val
        operands.append(first)
        current = first
        
        for i in range(rows - 1):
            is_add = random_func() < 0.7
            
            if digits == 1:
                ones_digit = current % 10
                # Find small friend
                friend_pairs = [p for p in small_friends_pairs if p[0] == ones_digit or p[1] == ones_digit]
                if not friend_pairs:
                    # If current ones digit is not in any pair, use a random friend pair
                    friend_pairs = small_friends_pairs
                
                pair = friend_pairs[int(random_func() * len(friend_pairs))]
                if pair[0] == ones_digit:
                    friend_digit = pair[1]
                elif pair[1] == ones_digit:
                    friend_digit = pair[0]
                else:
                    friend_digit = pair[1]  # Default
                
                if is_add:
                    operators_list.append("+")
                    current += friend_digit
                    operands.append(friend_digit)
                else:
                    if current >= friend_digit:
                        operators_list.append("-")
                        current -= friend_digit
                        operands.append(friend_digit)
                    else:
                        # Can't subtract, use addition instead
                        operators_list.append("+")
                        current += friend_digit
                        operands.append(friend_digit)
            else:
                # 2-digit: use ones place for small friends
                ones_digit = current % 10
                friend_pairs = [p for p in small_friends_pairs if p[0] == ones_digit or p[1] == ones_digit]
                if not friend_pairs:
                    friend_pairs = small_friends_pairs
                
                pair = friend_pairs[int(random_func() * len(friend_pairs))]
                if pair[0] == ones_digit:
                    friend_digit = pair[1]
                else:
                    friend_digit = pair[0]
                
                num = friend_digit + int(random_func() * 9) * 10  # Add tens for 2-digit
                if is_add:
                    operators_list.append("+")
                    current += num
                else:
                    if current >= num:
                        operators_list.append("-")
                        current -= num
                    else:
                        operators_list.append("+")
                        current += num
                operands.append(num)
        
        # Calculate answer
        answer = float(operands[0])
        for i, op in enumerate(operators_list):
            if op == "+":
                answer += operands[i + 1]
            else:
                answer -= operands[i + 1]
        
        if answer < 0:
            if retry_count < 20:
                return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
            operators_list = ["+"] * (rows - 1)
            answer = float(sum(operands))
        
        operators = operators_list
    
    elif question_type == "big_friends_add_sub":
        operator = "±"
        is_vertical = True
        
        digits = constraints.digits or 1
        rows = constraints.rows or 3
        rows = max(2, min(15, rows))
        digits = max(1, min(2, digits))
        
        # Big friends: pairs that sum to 10 (1+9, 2+8, 3+7, 4+6, 5+5, 6+4, 7+3, 8+2, 9+1, 0+10, 10+0)
        big_friends_pairs = [(1, 9), (2, 8), (3, 7), (4, 6), (5, 5), (6, 4), (7, 3), (8, 2), (9, 1), (0, 10), (10, 0)]
        
        operands = []
        operators_list = []
        
        min_val = 0 if digits == 1 else 10
        max_val = 9 if digits == 1 else 99
        
        first = int(random_func() * (max_val - min_val + 1)) + min_val
        operands.append(first)
        current = first
        
        for i in range(rows - 1):
            is_add = random_func() < 0.7
            
            if digits == 1:
                ones_digit = current % 10
                # Find big friend
                friend_pairs = [p for p in big_friends_pairs if p[0] == ones_digit or p[1] == ones_digit]
                if not friend_pairs:
                    friend_pairs = big_friends_pairs
                
                pair = friend_pairs[int(random_func() * len(friend_pairs))]
                if pair[0] == ones_digit:
                    friend_digit = pair[1]
                elif pair[1] == ones_digit:
                    friend_digit = pair[0]
                else:
                    friend_digit = pair[1]
                
                # For big friends, friend might be 10, handle it
                if friend_digit == 10:
                    friend_digit = 10  # Use 10 directly
                
                if is_add:
                    operators_list.append("+")
                    current += friend_digit
                    operands.append(friend_digit)
                else:
                    if current >= friend_digit:
                        operators_list.append("-")
                        current -= friend_digit
                        operands.append(friend_digit)
                    else:
                        operators_list.append("+")
                        current += friend_digit
                        operands.append(friend_digit)
            else:
                # 2-digit: use ones place for big friends
                ones_digit = current % 10
                friend_pairs = [p for p in big_friends_pairs if p[0] == ones_digit or p[1] == ones_digit]
                if not friend_pairs:
                    friend_pairs = big_friends_pairs
                
                pair = friend_pairs[int(random_func() * len(friend_pairs))]
                if pair[0] == ones_digit:
                    friend_digit = pair[1]
                else:
                    friend_digit = pair[0]
                
                # For 2-digit, friend_digit is the ones place, add appropriate tens
                num = friend_digit + int(random_func() * 9) * 10
                if is_add:
                    operators_list.append("+")
                    current += num
                else:
                    if current >= num:
                        operators_list.append("-")
                        current -= num
                    else:
                        operators_list.append("+")
                        current += num
                operands.append(num)
        
        # Calculate answer
        answer = float(operands[0])
        for i, op in enumerate(operators_list):
            if op == "+":
                answer += operands[i + 1]
            else:
                answer -= operands[i + 1]
        
        if answer < 0:
            if retry_count < 20:
                return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
            operators_list = ["+"] * (rows - 1)
            answer = float(sum(operands))
        
        operators = operators_list
    
    # ========== VEDIC MATHS LEVEL 1 OPERATIONS ==========
    elif question_type == "vedic_multiply_by_11":
        operator = "×"
        is_vertical = False
        digits = constraints.digits if constraints.digits is not None else 2
        digits = max(2, min(30, digits))
        
        num = generate_num(digits)
        answer = float(num * 11)
        operands = [num, 11]
        text = f"{num} × 11 ="
    
    elif question_type == "vedic_multiply_by_101":
        operator = "×"
        is_vertical = False
        digits = constraints.digits if constraints.digits is not None else 2
        digits = max(2, min(30, digits))
        
        num = generate_num(digits)
        answer = float(num * 101)
        operands = [num, 101]
        text = f"{num} × 101 ="
    
    elif question_type == "vedic_subtraction_complement":
        operator = "C"
        is_vertical = False
        base = constraints.base if constraints.base is not None else 100
        # Common bases: 100, 1000, 10000, etc
        base = 10 ** int(math.log10(base)) if base > 0 else 100
        
        # Generate number less than base for complement
        num = int(random_func() * (base - 1)) + 1
        answer = float(base - num)  # Complement
        operands = [num]
        text = f"C of {num} (base {base})"
    
    elif question_type == "vedic_subtraction_normal":
        operator = "-"
        is_vertical = False
        base = constraints.base if constraints.base is not None else 100
        base = 10 ** int(math.log10(base)) if base > 0 else 100
        
        # Generate number less than base
        num = int(random_func() * (base - 1)) + 1
        answer = float(base - num)
        operands = [base, num]
        text = f"{base} - {num} ="
    
    elif question_type == "vedic_multiply_by_12_19":
        operator = "×"
        is_vertical = False
        digits = constraints.digits if constraints.digits is not None else 2
        digits = max(2, min(30, digits))
        
        num = generate_num(digits)
        # Use multiplier from constraints if specified, otherwise random 12-19
        if constraints.multiplier is not None:
            multiplier = max(12, min(19, constraints.multiplier))
        else:
            multiplier = int(random_func() * 8) + 12  # 12 to 19
        
        answer = float(num * multiplier)
        operands = [num, multiplier]
        text = f"{num} × {multiplier} ="
    
    elif question_type == "vedic_special_products_base_100":
        operator = "×"
        is_vertical = False
        # Numbers near 100 (e.g., 99, 94, 102, 109)
        # Both numbers must be on the same side of 100 (both above or both below)
        side = int(random_func() * 2)  # 0 = below 100, 1 = above 100
        if side == 0:
            # Both below 100 (90-99)
            num1 = int(random_func() * 10) + 90  # 90 to 99
            num2 = int(random_func() * 10) + 90  # 90 to 99
        else:
            # Both above 100 (101-109)
            num1 = int(random_func() * 9) + 101  # 101 to 109
            num2 = int(random_func() * 9) + 101  # 101 to 109
        answer = float(num1 * num2)
        operands = [num1, num2]
        text = f"{num1} × {num2} ="
    
    elif question_type == "vedic_special_products_base_50":
        operator = "×"
        is_vertical = False
        # Numbers near 50 (e.g., 53, 54, 47, 49)
        # Both numbers must be on the same side of 50 (both above or both below)
        side = int(random_func() * 2)  # 0 = below 50, 1 = above 50
        if side == 0:
            # Both below 50 (40-49)
            num1 = int(random_func() * 10) + 40  # 40 to 49
            num2 = int(random_func() * 10) + 40  # 40 to 49
        else:
            # Both above 50 (51-59)
            num1 = int(random_func() * 9) + 51  # 51 to 59
            num2 = int(random_func() * 9) + 51  # 51 to 59
        answer = float(num1 * num2)
        operands = [num1, num2]
        text = f"{num1} × {num2} ="
    
    elif question_type == "vedic_multiply_by_21_91":
        operator = "×"
        is_vertical = False
        digits = constraints.digits if constraints.digits is not None else 2
        digits = max(2, min(30, digits))
        
        num = generate_num(digits)
        # Use multiplier from constraints if specified, otherwise random 21-91
        if constraints.multiplierRange is not None:
            multiplier = max(21, min(91, constraints.multiplierRange))
        else:
            multiplier = int(random_func() * 71) + 21  # 21 to 91
        
        answer = float(num * multiplier)
        operands = [num, multiplier]
        text = f"{num} × {multiplier} ="
    
    elif question_type == "vedic_addition":
        operator = "+"
        is_vertical = False
        first_digits = constraints.firstDigits if constraints.firstDigits is not None else 2
        second_digits = constraints.secondDigits if constraints.secondDigits is not None else 2
        first_digits = max(1, min(30, first_digits))  # Updated: min 1, max 30 for vedic addition
        second_digits = max(1, min(30, second_digits))  # Updated: min 1, max 30 for vedic addition
        
        num1 = generate_num(first_digits)
        num2 = generate_num(second_digits)
        answer = float(num1 + num2)
        operands = [num1, num2]
        text = f"{num1} + {num2} ="
    
    elif question_type == "vedic_multiply_by_2":
        operator = "×"
        is_vertical = False
        digits = constraints.digits if constraints.digits is not None else 2
        digits = max(2, min(30, digits))
        
        num = generate_num(digits)
        answer = float(num * 2)
        operands = [num, 2]
        text = f"{num} × 2 ="
    
    elif question_type == "vedic_multiply_by_4":
        operator = "×"
        is_vertical = False
        digits = constraints.digits if constraints.digits is not None else 2
        digits = max(2, min(30, digits))
        
        num = generate_num(digits)
        answer = float(num * 4)
        operands = [num, 4]
        text = f"{num} × 4 ="
    
    elif question_type == "vedic_divide_by_2":
        operator = "÷"
        is_vertical = False
        digits = constraints.digits if constraints.digits is not None else 2
        digits = max(2, min(30, digits))
        
        num = generate_num(digits)
        answer = float(num / 2.0)
        operands = [num, 2]
        text = f"{num} ÷ 2 ="
    
    elif question_type == "vedic_divide_by_4":
        operator = "÷"
        is_vertical = False
        digits = constraints.digits if constraints.digits is not None else 2
        digits = max(2, min(30, digits))
        
        num = generate_num(digits)
        answer = float(num / 4.0)
        operands = [num, 4]
        text = f"{num} ÷ 4 ="
    
    elif question_type == "vedic_divide_single_digit":
        operator = "÷"
        is_vertical = False
        digits = constraints.digits if constraints.digits is not None else 2
        digits = max(2, min(30, digits))
        
        num = generate_num(digits)
        # Use divisor from constraints if specified, otherwise random 2-9
        if constraints.divisor is not None:
            divisor = max(2, min(9, constraints.divisor))
        else:
            divisor = int(random_func() * 8) + 2  # 2 to 9
        
        answer = float(num / divisor)
        operands = [num, divisor]
        text = f"{num} ÷ {divisor} ="
    
    elif question_type == "vedic_multiply_by_6":
        operator = "×"
        is_vertical = False
        digits = constraints.digits if constraints.digits is not None else 2
        digits = max(2, min(30, digits))
        
        # Generate even number (multiply by 2 then by 3)
        base_num = generate_num(digits)
        # Ensure it's even
        num = base_num if base_num % 2 == 0 else base_num + 1
        answer = float(num * 6)
        operands = [num, 6]
        text = f"{num} × 6 ="
    
    elif question_type == "vedic_divide_by_11":
        operator = "÷"
        is_vertical = False
        digits = constraints.digits if constraints.digits is not None else 3  # Default 3
        digits = max(2, min(30, digits))
        
        num = generate_num(digits)
        answer = float(num / 11.0)
        operands = [num, 11]
        text = f"{num} ÷ 11 ="
    
    elif question_type == "vedic_squares_base_10":
        operator = "²"
        is_vertical = False
        # Numbers ending near 10 (e.g., 63, 91)
        # Generate number ending in 1-9, tens digit 1-9
        tens = int(random_func() * 9) + 1  # 1-9
        ones = int(random_func() * 9) + 1  # 1-9
        num = tens * 10 + ones
        answer = float(num * num)
        operands = [num]
        text = f"{num}² ="
    
    elif question_type == "vedic_squares_base_100":
        operator = "²"
        is_vertical = False
        # Numbers near 100 with zeros in between (e.g., 306, 901)
        # Pattern: X0Y where X is 1-9, Y is 0-9
        hundreds = int(random_func() * 9) + 1  # 1-9
        ones = int(random_func() * 10)  # 0-9
        num = hundreds * 100 + ones  # e.g., 306, 901
        answer = float(num * num)
        operands = [num]
        text = f"{num}² ="
    
    elif question_type == "vedic_squares_base_1000":
        operator = "²"
        is_vertical = False
        # Numbers near 1000 with zeros in between (e.g., 2004, 5005)
        # Pattern: X00Y where X is 1-9, Y is 0-9
        thousands = int(random_func() * 9) + 1  # 1-9
        ones = int(random_func() * 10)  # 0-9
        num = thousands * 1000 + ones  # e.g., 2004, 5005
        answer = float(num * num)
        operands = [num]
        text = f"{num}² ="
    
    elif question_type == "vedic_tables":
        operator = "×"
        is_vertical = False
        # Table number (1-99)
        if constraints.tableNumber is not None:
            table_num = max(1, min(99, constraints.tableNumber))
        else:
            table_num = int(random_func() * 99) + 1  # 1 to 99
        
        # For tables, the question_id determines which row (multiplier) we're on
        # multiplier ranges from 1 to rows (where rows comes from constraints.rows or count)
        # This will be handled in generate_block for vedic_tables
        multiplier = 1  # Default, will be overridden in generate_block
        answer = float(table_num * multiplier)
        operands = [table_num, multiplier]
        text = f"{table_num} × {multiplier} ="
    
    elif question_type == "percentage":
        operator = "%"
        is_vertical = False
        
        # Get constraints for percentage
        percentage_min = constraints.percentageMin if constraints.percentageMin is not None else 1
        percentage_max = constraints.percentageMax if constraints.percentageMax is not None else 100
        number_digits = constraints.numberDigits if constraints.numberDigits is not None else 4
        
        # Ensure valid ranges
        percentage_min = max(1, min(100, percentage_min))
        percentage_max = max(1, min(100, percentage_max))
        if percentage_min > percentage_max:
            percentage_min, percentage_max = percentage_max, percentage_min
        
        number_digits = max(1, min(10, number_digits))  # Allow up to 10 digits as per schema
        
        # Generate percentage value
        percentage = int(random_func() * (percentage_max - percentage_min + 1)) + percentage_min
        
        # Generate number based on digits (1 to 9999)
        number_min = 10 ** (number_digits - 1)
        number_max = (10 ** number_digits) - 1
        number = int(random_func() * (number_max - number_min + 1)) + number_min
        
        # Calculate answer: percentage% of number = (percentage / 100) * number
        answer = round((percentage / 100.0) * number, 2)
        
        operands = [percentage, number]
        text = f"{percentage}% of {number} ="
    
    # Check answer bounds (skip for operations that have decimal answers or special handling)
    skip_answer_bounds = (
        "decimal_multiplication", "square_root", "cube_root", "lcm", "gcd", "integer_add_sub", 
        "decimal_division", "decimal_add_sub", "direct_add_sub", "small_friends_add_sub", 
        "big_friends_add_sub", "percentage",
        "vedic_divide_by_2", "vedic_divide_by_4", "vedic_divide_single_digit", "vedic_divide_by_11"
    )
    if question_type not in skip_answer_bounds:
        if constraints.minAnswer is not None and answer < constraints.minAnswer:
            return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
        if constraints.maxAnswer is not None and answer > constraints.maxAnswer:
            return generate_question(question_id, question_type, constraints, seed, retry_count + 1)
    
    # Build text representation (skip if already built for special operations)
    # Operations that already have text set: square_root, cube_root, lcm, gcd, decimal_multiplication, decimal_division, decimal_add_sub, percentage, and all vedic operations
    # Junior operations (direct_add_sub, small_friends_add_sub, big_friends_add_sub) use standard vertical format, so text will be built below
    if text is None:
        text_parts = []
        if is_vertical:
            if operators:  # Mixed operations (add_sub)
                # First operand has no operator
                text_parts.append(str(operands[0]))
                # Subsequent operands have their operators
                for i, op in enumerate(operands[1:], 1):
                    text_parts.append(f"{operators[i-1]} {op}")
            else:
                # Single operator type
                for i, op in enumerate(operands):
                    if operator == "-" and i > 0:
                        # For subtraction, show operator on all lines except the first
                        text_parts.append(f"{operator} {op}")
                    elif i == len(operands) - 1:
                        # For addition, show operator only on the last line
                        text_parts.append(f"{operator} {op}")
                    else:
                        text_parts.append(str(op))
            text = "\n".join(text_parts)
        else:
            # Horizontal format
            if len(operands) == 2:
                text = f"{operands[0]} {operator} {operands[1]} ="
            else:
                text = f"{operator.join(map(str, operands))} ="
    
    return Question(
        id=question_id,
        text=text,
        operands=operands,
        operator=operator,
        operators=operators,
        answer=answer,
        isVertical=is_vertical  # Pydantic will handle the field name
    )


def generate_block(block_config: BlockConfig, start_id: int, seed: Optional[int] = None) -> GeneratedBlock:
    """Generate a block of questions."""
    questions = []
    
    # For vedic_tables, use rows (or count) to determine how many table rows to generate
    if block_config.type == "vedic_tables":
        try:
            rows = block_config.constraints.rows if block_config.constraints.rows is not None else (block_config.count if block_config.count else 10)
            rows = max(2, min(100, rows))  # For vedic_tables, rows means multiplier count (2-100), not questions
            
            # Get table number
            table_num = block_config.constraints.tableNumber
            if table_num is None:
                # Generate a random table number if not specified (will be consistent with seed)
                if seed is not None:
                    rng = generate_seeded_rng(seed, start_id)
                    random_func = rng
                else:
                    import random
                    random_func = random.random
                table_num = int(random_func() * 99) + 1  # 1 to 99
            table_num = max(1, min(99, table_num))
            
            # Generate table rows: table_num × 1, table_num × 2, ..., table_num × rows
            for i in range(rows):
                multiplier = i + 1
                answer = float(table_num * multiplier)
                question = Question(
                    id=start_id + i,
                    text=f"{table_num} × {multiplier} =",
                    operands=[table_num, multiplier],
                    operator="×",
                    operators=None,
                    answer=answer,
                    isVertical=False
                )
                questions.append(question)
        except Exception as e:
            # Fallback for vedic_tables
            table_num = block_config.constraints.tableNumber or 10
            table_num = max(1, min(99, table_num))
            rows = block_config.constraints.rows if block_config.constraints.rows is not None else (block_config.count if block_config.count else 10)
            rows = max(2, min(100, rows))  # For vedic_tables, rows means multiplier count (2-100), not questions
            for i in range(min(rows, 10)):  # Limit to 10 questions on error
                multiplier = i + 1
                questions.append(Question(
                    id=start_id + i,
                    text=f"{table_num} × {multiplier} =",
                    operands=[table_num, multiplier],
                    operator="×",
                    operators=None,
                    answer=float(table_num * multiplier),
                    isVertical=False
                ))
    else:
        # Standard generation for other question types
        for i in range(block_config.count):
            try:
                question = generate_question(
                    start_id + i,
                    block_config.type,
                    block_config.constraints,
                    seed
                )
                questions.append(question)
            except Exception as e:
                # Fallback question - ensure digits is defined
                try:
                    digits = block_config.constraints.digits if block_config.constraints.digits is not None else 1
                    num1 = 10 ** (digits - 1)
                    num2 = 10 ** (digits - 1)
                    questions.append(Question(
                        id=start_id + i,
                        text=f"{num1}\n+ {num2}",
                        operands=[num1, num2],
                        operator="+",
                        operators=None,
                        answer=float(num1 + num2),
                        isVertical=True
                    ))
                except Exception:
                    # Ultimate fallback if even digits access fails
                    questions.append(Question(
                        id=start_id + i,
                        text="10\n+ 10",
                        operands=[10, 10],
                        operator="+",
                        operators=None,
                        answer=20.0,
                        isVertical=True
                    ))
    
    return GeneratedBlock(config=block_config, questions=questions)

