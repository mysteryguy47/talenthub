"""
HTML Template Generator for PDF Export
Matches the frontend preview structure exactly
"""
from typing import List
from schemas import PaperConfig, GeneratedBlock


def format_number(num: float) -> str:
    """Format number without scientific notation (matching frontend formatNumber)."""
    if isinstance(num, float) and num % 1 == 0:
        return str(int(num))
    
    # Format decimals nicely
    if isinstance(num, float) and num % 1 != 0:
        # For 1 decimal place
        if abs(num * 10 - round(num * 10)) < 0.001:
            return f"{num:.1f}"
        # For 2 decimal places
        return f"{num:.2f}".rstrip('0').rstrip('.')
    
    return str(num)


def render_vertical_question(question, show_answer: bool = False) -> str:
    """Render a vertical question (addition/subtraction)."""
    # Check if this is a decimal question
    is_decimal = False
    if hasattr(question, 'operands') and question.operands:
        # Check if all operands are multiples of 10 (stored as integers * 10)
        is_decimal = all(op % 10 == 0 and op >= 10 and op <= 9990 for op in question.operands)
    
    html = '<div class="question-vertical">'
    
    # Question number
    html += f'<div class="question-number">{question.id}.</div>'
    html += '<div class="question-content">'
    
    # Render operands vertically
    if hasattr(question, 'operands') and question.operands:
        for idx, operand in enumerate(question.operands):
            if idx == 0:
                # First operand - right aligned
                if is_decimal:
                    display_value = f"{(operand / 10):.1f}"
                else:
                    display_value = format_number(operand)
                html += f'<div class="operand-row"><div class="operand-value">{display_value}</div></div>'
            else:
                # Subsequent operands with operator
                operator = "+"
                if hasattr(question, 'operators') and question.operators and len(question.operators) > idx - 1:
                    operator = question.operators[idx - 1]
                elif hasattr(question, 'operator') and question.operator:
                    operator = question.operator
                
                if is_decimal:
                    display_value = f"{(operand / 10):.1f}"
                else:
                    display_value = format_number(operand)
                html += f'<div class="operand-row"><div class="operator">{operator}</div><div class="operand-value">{display_value}</div></div>'
    
    # Horizontal line
    html += '<div class="question-line"></div>'
    
    # Answer space (always shown, with answer if requested)
    if show_answer and hasattr(question, 'answer') and question.answer is not None:
        html += f'<div class="answer-space">{format_number(question.answer)}</div>'
    else:
        html += '<div class="answer-space"></div>'
    
    html += '</div>'  # question-content
    html += '</div>'  # question-vertical
    
    return html


def render_horizontal_question(question, show_answer: bool = False) -> str:
    """Render a horizontal question (multiplication, division, etc.)."""
    html = '<table class="question-horizontal">'
    html += '<tbody><tr>'
    
    # Serial number column
    html += f'<td class="serial-col"><span class="question-number">{question.id}.</span></td>'
    
    # Question text column
    html += '<td class="question-col">'
    
    # Build question text
    if hasattr(question, 'operands') and question.operands:
        if len(question.operands) == 2:
            op1 = format_number(question.operands[0])
            op2 = format_number(question.operands[1])
            operator = question.operator or "×"
            html += f'<div class="question-text">{op1} {operator} {op2} =</div>'
        else:
            # Multiple operands
            parts = [format_number(question.operands[0])]
            for i in range(1, len(question.operands)):
                op = question.operands[i]
                operator = question.operators[i - 1] if hasattr(question, 'operators') and question.operators and len(question.operators) > i - 1 else "+"
                parts.append(f"{operator} {format_number(op)}")
            html += f'<div class="question-text">{" ".join(parts)} =</div>'
    else:
        html += f'<div class="question-text">{question.text or ""}</div>'
    
    html += '</td>'
    
    # Answer column (if showing answers)
    if show_answer and hasattr(question, 'answer') and question.answer is not None:
        html += f'<td class="answer-col"><div class="answer-text">{format_number(question.answer)}</div></td>'
    
    html += '</tr></tbody></table>'
    
    return html


def generate_html(config: PaperConfig, generated_blocks: List[GeneratedBlock], 
                 with_answers: bool = False, answers_only: bool = False) -> str:
    """Generate complete HTML document matching preview structure."""
    
    # Calculate total questions
    total_questions = sum(len(block.questions) for block in generated_blocks)
    
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>""" + config.title + """</title>
    <style>
        @page {
            size: A4;
            margin: 12mm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            font-size: 10pt;
            line-height: 1.3;
            color: #1F2937;
            background: white;  /* White PDF background */
            padding: 0;
        }
        
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            font-size: 80pt;
            font-weight: bold;
            color: #000000;
            opacity: 0.08;  /* Further reduced opacity */
            z-index: 1;
            pointer-events: none;
            white-space: nowrap;  /* Keep watermark in single line */
        }
        
        .container {
            max-width: 100%;
            margin: 0 auto;
            padding: 0;
            position: relative;
            z-index: 2;  /* Above watermark */
        }
        
        .title {
            font-size: 16pt;
            font-weight: bold;
            color: #000000;
            margin-bottom: 4mm;
            text-align: center;
        }
        
        .info-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2mm;
            margin-bottom: 3mm;
            font-size: 9pt;
        }
        
        .info-left {
            text-align: left;
            padding-left: 3mm;  /* Slight padding to avoid overlapping with page border */
        }
        
        .info-right {
            text-align: right;
            padding-right: 30mm;  /* 1.5x spacing from right edge (1.5 * 20mm = 30mm) */
        }
        
        .info-item {
            margin-bottom: 2mm;
            font-weight: bold;  /* Make input columns bold */
        }
        
        .block-container {
            border: none;  /* Remove section borders */
            padding: 2mm;
            margin-bottom: 4mm;
            page-break-inside: avoid;
            break-inside: avoid;
            background: transparent;  /* Make transparent so watermark shows through */
        }
        
        /* Page box border - using fixed positioning to cover entire page */
        .page-border {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 1pt solid #000000;
            pointer-events: none;
            z-index: 999;
            box-sizing: border-box;
        }
        
        .section-title {
            font-size: 12pt;
            font-weight: bold;
            color: #000000;
            margin-bottom: 3mm;
        }
        
        /* Vertical Questions (table structure matching preview) */
        .vertical-questions-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            margin-bottom: 2mm;
        }
        
        .vertical-questions-table td {
            border: 0.5pt solid #E5E7EB;
            padding: 1mm;
            background: transparent;  /* Transparent so watermark shows through */
        }
        
        .sno-cell {
            width: 10%;
            vertical-align: top;
        }
        
        .operand-cell {
            width: 10%;
            text-align: right;
            vertical-align: top;
        }
        
        .operand-content {
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            font-weight: bold;
            color: #1F2937;
            line-height: 1.2;
        }
        
        .line-cell {
            width: 10%;
            vertical-align: top;
        }
        
        .answer-cell {
            width: 10%;
            text-align: right;
            vertical-align: top;
            min-height: 1.2rem;
        }
        
        .answer-value {
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            font-weight: bold;
            color: #4B5563;
        }
        
        .question-number {
            font-weight: bold;
            font-size: 11pt;
            color: #1E40AF;
        }
        
        .operator {
            font-weight: bold;
            font-size: 10pt;
            color: #2563EB;
            margin-right: 1mm;
        }
        
        .question-line {
            border-top: 1pt solid #9CA3AF;
            width: 100%;
            margin: 0;
        }
        
        /* Horizontal Questions */
        .horizontal-questions-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4mm;
            margin-bottom: 2mm;
        }
        
        .question-horizontal {
            width: 100%;
            border-collapse: collapse;
            border: 0.5pt solid #E5E7EB;
            background: transparent;  /* Transparent so watermark shows through */
        }
        
        .question-horizontal td {
            padding: 1.5mm;
            vertical-align: top;
        }
        
        .serial-col {
            width: 12mm;
            border-right: 0.5pt solid #E5E7EB;
        }
        
        .question-col {
            border-right: 0.5pt solid #E5E7EB;
        }
        
        .answer-col {
            width: 60mm;
            text-align: right;
        }
        
        .question-text {
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            font-weight: bold;
            color: #1F2937;
            word-break: break-all;
        }
        
        .answer-text {
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            font-weight: bold;
            color: #4B5563;
            text-align: right;
        }
        
        .ending-section {
            margin-top: 5mm;
            text-align: center;
        }
        
        .ending-line {
            border-top: 1pt solid #000000;
            margin: 2mm 0;
        }
        
        .ending-text {
            font-size: 12pt;
            font-weight: bold;
            color: #000000;
            margin-top: 2mm;
        }
        
        .ending-exclamation {
            font-size: 12pt;
            font-weight: bold;
            color: #000000;
            margin-right: 2mm;
        }
        
        .page-number {
            position: fixed;
            bottom: 10mm;
            left: 50%;
            transform: translateX(-50%);
            font-size: 9pt;
            color: #666666;
        }
        
        @media print {
            .watermark {
                display: block;
            }
            .page-number {
                display: block;
            }
        }
    </style>
</head>
<body>
    <div class="watermark">TALENT HUB</div>
    <div class="page-border"></div>
    <div class="container">"""
    
    if not answers_only:
        # Title
        html += f'<h1 class="title">{config.title}</h1>'
        
        # Info section
        html += '<div class="info-section">'
        html += '<div class="info-left">'
        html += '<div class="info-item">Name: </div>'
        html += '<div class="info-item">Start Time: </div>'
        html += f'<div class="info-item">MM: {total_questions}</div>'
        html += '</div>'
        html += '<div class="info-right">'
        html += '<div class="info-item">Date: </div>'
        html += '<div class="info-item">Stop Time: </div>'
        html += '</div>'
        html += '</div>'
        
        # Process blocks
        question_counter = 1
        
        for block_index, block in enumerate(generated_blocks):
            html += '<div class="block-container">'
            
            # Section title
            if block.config.title:
                html += f'<h2 class="section-title">{block.config.title}</h2>'
            
            # Check if block has vertical questions
            has_vertical = any(
                getattr(q, 'isVertical', getattr(q, 'is_vertical', False))
                for q in block.questions
            ) if block.questions else False
            
            if has_vertical:
                # Render vertical questions in table structure (matching preview exactly)
                vertical_questions = [q for q in block.questions 
                                     if getattr(q, 'isVertical', getattr(q, 'is_vertical', False))]
                
                # Process in chunks of 10
                for chunk_start in range(0, len(vertical_questions), 10):
                    chunk = vertical_questions[chunk_start:chunk_start + 10]
                    
                    # Create table matching preview structure
                    html += '<table class="vertical-questions-table">'
                    html += '<tbody>'
                    
                    # Serial number row
                    html += '<tr>'
                    for q in chunk:
                        html += f'<td class="sno-cell"><span class="question-number">{q.id}.</span></td>'
                    # Fill remaining cells
                    for _ in range(10 - len(chunk)):
                        html += '<td class="sno-cell"></td>'
                    html += '</tr>'
                    
                    # Operand rows
                    if chunk:
                        max_operands = max(len(q.operands) for q in chunk if hasattr(q, 'operands'))
                        for row_idx in range(max_operands):
                            html += '<tr>'
                            for q in chunk:
                                if hasattr(q, 'operands') and row_idx < len(q.operands):
                                    op = q.operands[row_idx]
                                    # Check if decimal
                                    is_decimal = all(op % 10 == 0 and op >= 10 and op <= 9990 for op in q.operands) if hasattr(q, 'operands') else False
                                    
                                    # Determine operator
                                    operator = ""
                                    if row_idx > 0:
                                        if hasattr(q, 'operators') and q.operators and len(q.operators) > row_idx - 1:
                                            operator = q.operators[row_idx - 1]
                                        elif hasattr(q, 'operator') and q.operator:
                                            operator = q.operator
                                    
                                    display_value = f"{(op / 10):.1f}" if is_decimal else format_number(op)
                                    html += f'<td class="operand-cell"><div class="operand-content">'
                                    if operator:
                                        html += f'<span class="operator">{operator}</span> '
                                    html += f'{display_value}</div></td>'
                                else:
                                    html += '<td class="operand-cell"></td>'
                            # Fill remaining cells
                            for _ in range(10 - len(chunk)):
                                html += '<td class="operand-cell"></td>'
                            html += '</tr>'
                    
                    # Line row
                    html += '<tr>'
                    for q in chunk:
                        html += '<td class="line-cell"><div class="question-line"></div></td>'
                    for _ in range(10 - len(chunk)):
                        html += '<td class="line-cell"></td>'
                    html += '</tr>'
                    
                    # Answer row
                    html += '<tr>'
                    for q in chunk:
                        html += '<td class="answer-cell">'
                        if with_answers and hasattr(q, 'answer') and q.answer is not None:
                            html += f'<div class="answer-value">{format_number(q.answer)}</div>'
                        html += '</td>'
                    for _ in range(10 - len(chunk)):
                        html += '<td class="answer-cell"></td>'
                    html += '</tr>'
                    
                    html += '</tbody>'
                    html += '</table>'
            else:
                # Render horizontal questions in pairs (2 columns)
                horizontal_questions = [q for q in block.questions 
                                      if not getattr(q, 'isVertical', getattr(q, 'is_vertical', False))]
                
                # Process in pairs of 2
                for pair_start in range(0, len(horizontal_questions), 2):
                    html += '<div class="horizontal-questions-container">'
                    if pair_start < len(horizontal_questions):
                        html += render_horizontal_question(horizontal_questions[pair_start], with_answers)
                    if pair_start + 1 < len(horizontal_questions):
                        html += render_horizontal_question(horizontal_questions[pair_start + 1], with_answers)
                    else:
                        html += '<div></div>'  # Empty cell for alignment
                    html += '</div>'
            
            html += '</div>'  # block-container
        
        # Ending section
        html += '<div class="ending-section">'
        html += '<div class="ending-line"></div>'
        html += '<div class="ending-text"><span class="ending-exclamation">!!</span>ALL THE BEST</div>'
        html += '</div>'
    
    # Answer key page (if requested)
    if with_answers or answers_only:
        if not answers_only:
            html += '<div style="page-break-before: always;"></div>'
        
        html += f'<h1 class="title">{config.title} - Answer Key</h1>'
        html += '<div style="margin-top: 4mm;"></div>'
        
        # Answer key styles
        html += '<style>'
        html += '''
        .answer-key-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0 8mm;
            margin-bottom: 3mm;
            width: 100%;
        }
        .answer-key-column {
            display: flex;
            flex-direction: column;
            gap: 2mm;
        }
        .answer-key-item {
            display: flex;
            align-items: baseline;
            gap: 2mm;
            font-size: 10pt;
            white-space: nowrap !important;
            overflow: visible;
            width: 100%;
        }
        .answer-key-question {
            white-space: nowrap !important;
            overflow: visible;
            flex: 0 1 auto;
            min-width: 0;
            max-width: none;
        }
        .answer-key-answer {
            font-weight: bold;
            flex-shrink: 0;
            white-space: nowrap !important;
        }
        '''
        html += '</style>'
        
        # Collect all answers first
        all_answers = []
        answer_counter = 1
        for block in generated_blocks:
            for q in block.questions:
                if hasattr(q, 'answer') and q.answer is not None:
                    # Build question text
                    question_text = ""
                    if hasattr(q, 'text') and q.text:
                        question_text = q.text.replace('\n', ' ')  # Replace newlines with spaces
                    elif hasattr(q, 'operands') and q.operands:
                        if len(q.operands) == 2:
                            op1 = format_number(q.operands[0])
                            op2 = format_number(q.operands[1])
                            operator = getattr(q, 'operator', '×')
                            question_text = f"{op1} {operator} {op2} ="
                        else:
                            # Multiple operands
                            parts = [format_number(q.operands[0])]
                            for i in range(1, len(q.operands)):
                                op = q.operands[i]
                                operator = q.operators[i - 1] if hasattr(q, 'operators') and q.operators and len(q.operators) > i - 1 else "+"
                                parts.append(f"{operator} {format_number(op)}")
                            question_text = " ".join(parts) + " ="
                    
                    all_answers.append({
                        'number': answer_counter,
                        'question': question_text,
                        'answer': format_number(q.answer)
                    })
                    answer_counter += 1
        
        # Split into 3 columns
        html += '<div class="answer-key-container">'
        for col_idx in range(3):
            html += '<div class="answer-key-column">'
            # Distribute items across columns
            for i in range(col_idx, len(all_answers), 3):
                item = all_answers[i]
                html += f'<div class="answer-key-item">'
                html += f'<span class="answer-key-question">{item["number"]}. {item["question"]}</span>'
                html += f'<span class="answer-key-answer">{item["answer"]}</span>'
                html += '</div>'
            html += '</div>'  # Close column
        html += '</div>'  # Close answer-key-container
    
    html += """
    </div>
    <script>
        // Add page numbers
        window.addEventListener('load', function() {
            const pages = document.querySelectorAll('.page');
            pages.forEach((page, index) => {
                const pageNum = document.createElement('div');
                pageNum.className = 'page-number';
                pageNum.textContent = 'Page ' + (index + 1);
                page.appendChild(pageNum);
            });
        });
    </script>
</body>
</html>"""
    
    return html

