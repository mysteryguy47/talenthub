"""FastAPI main application."""
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.orm import Session
from typing import List
import json
import hashlib
import random
import time

from models import Paper, get_db, init_db
from schemas import (
    PaperCreate, PaperResponse, PaperConfig, PreviewResponse,
    GeneratedBlock, BlockConfig
)
from math_generator import generate_block
from pdf_generator import generate_pdf
from pdf_generator_v2 import generate_pdf_v2
from pdf_generator_playwright import generate_pdf_playwright
from presets import get_preset_blocks

# Lazy import of user_routes to prevent startup failures
user_router = None
try:
    from user_routes import router as user_router
    print("✅ [IMPORT] User router imported successfully")
except Exception as e:
    import traceback
    print(f"❌ [IMPORT] Failed to import user router: {str(e)}")
    print(traceback.format_exc())
    # Continue without user routes - other endpoints will still work

app = FastAPI(title="Abacus Paper Generator", version="3.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define health endpoint FIRST (before router inclusion)
# This ensures health check works even if other routes fail
@app.get("/api/health")
async def health_check():
    """Health check endpoint - should never fail."""
    return {"status": "ok", "message": "Server is running"}

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Abacus Paper Generator API", "version": "2.0.0"}

# Include routers - only if import succeeded
if user_router:
    try:
        app.include_router(user_router)
        print("✅ [STARTUP] User router included")
    except Exception as e:
        import traceback
        print(f"❌ [STARTUP] Failed to include user router: {str(e)}")
        print(traceback.format_exc())
else:
    print("⚠️ [STARTUP] User router not available (import failed)")

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    try:
        print("🟢 [STARTUP] Initializing database...")
        init_db()
        print("✅ [STARTUP] Database initialized successfully")
    except Exception as e:
        import traceback
        print(f"❌ [STARTUP] Database initialization failed: {str(e)}")
        print(traceback.format_exc())
        # Don't crash the app, but log the error


# Handle validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "message": "Validation error: Please check your request format"
        }
    )


@app.get("/api/papers", response_model=List[PaperResponse])
async def list_papers(db: Session = Depends(get_db)):
    """Get all papers."""
    papers = db.query(Paper).order_by(Paper.created_at.desc()).all()
    return papers


@app.get("/api/papers/{paper_id}", response_model=PaperResponse)
async def get_paper(paper_id: int, db: Session = Depends(get_db)):
    """Get a single paper by ID."""
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper


@app.post("/api/papers", response_model=PaperResponse, status_code=status.HTTP_201_CREATED)
async def create_paper(paper_data: PaperCreate, db: Session = Depends(get_db)):
    """Create a new paper."""
    # If using preset level, ensure blocks are populated
    config = paper_data.config
    if paper_data.level != "Custom" and (not config.blocks or len(config.blocks) == 0):
        config.blocks = get_preset_blocks(paper_data.level)
    
    paper = Paper(
        title=paper_data.title,
        level=paper_data.level,
        config=config.model_dump()
    )
    db.add(paper)
    db.commit()
    db.refresh(paper)
    return paper


@app.get("/api/presets/{level}")
async def get_preset_blocks(level: str):
    """Get preset blocks for a given level."""
    try:
        from presets import get_preset_blocks
        blocks = get_preset_blocks(level)
        # Convert BlockConfig to dict for JSON serialization
        return [block.model_dump() for block in blocks]
    except Exception as e:
        import traceback
        error_msg = f"Failed to get preset blocks for {level}: {str(e)}"
        print(f"❌ [PRESETS] {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)


@app.post("/api/papers/preview", response_model=PreviewResponse)
async def preview_paper(config: PaperConfig):
    """Generate preview of questions."""
    try:
        print(f"Received preview request: level={config.level}, title={config.title}, blocks={len(config.blocks)}")

        # Resolve blocks (Preset vs Custom)
        blocks = config.blocks
        if config.level != "Custom" and (not blocks or len(blocks) == 0):
            blocks = get_preset_blocks(config.level)

        if not blocks or len(blocks) == 0:
            raise HTTPException(status_code=400, detail="At least one question block is required")

        print(f"Using {len(blocks)} blocks")
        for i, block in enumerate(blocks):
            print(f"Block {i}: id={block.id}, type={block.type}, count={block.count}, constraints={block.constraints}")

        # Generate a random seed for preview to ensure different questions each time
        # The seed will be returned and can be used for PDF generation to get the same questions
        # Use timestamp + random to ensure uniqueness
        seed = int((time.time() * 1000) % (2**31)) + random.randint(1, 1000000)
        seed = seed % (2**31)  # Keep it within int32 range

        print(f"Using seed: {seed}")

        question_id_counter = 1
        generated_blocks = []

        for block in blocks:
            try:
                print(f"Generating block: {block.id}, type: {block.type}, count: {block.count}")
                gen_block = generate_block(block, question_id_counter, seed)
                print(f"Generated {len(gen_block.questions)} questions for block {block.id}")
                generated_blocks.append(gen_block)
                question_id_counter += block.count
            except Exception as e:
                import traceback
                error_detail = f"Failed to generate block '{block.id}': {str(e)}"
                print(f"ERROR: {error_detail}")
                print(traceback.format_exc())
                raise HTTPException(
                    status_code=500,
                    detail=error_detail
                )

        print(f"Successfully generated {len(generated_blocks)} blocks")
        return PreviewResponse(blocks=generated_blocks, seed=seed)
    except HTTPException:
        raise
    except ValueError as e:
        # Pydantic validation errors
        error_msg = f"Validation error: {str(e)}"
        print(f"Validation error: {error_msg}")
        raise HTTPException(
            status_code=422,
            detail=error_msg
        )
    except Exception as e:
        import traceback
        error_msg = str(e)
        traceback_str = traceback.format_exc()
        print(f"Preview error: {error_msg}\n{traceback_str}")  # Log to console
        # Write to file for debugging
        with open("/tmp/preview_error.log", "w") as f:
            f.write(f"Error: {error_msg}\n{traceback_str}")
        raise HTTPException(
            status_code=500,
            detail=f"Preview generation error: {error_msg}"
        )


@app.post("/api/papers/generate-pdf")
async def generate_pdf_endpoint(
    request_data: dict
):
    """Generate PDF from config."""
    config = PaperConfig(**request_data.get("config", {}))
    # Handle both camelCase and snake_case
    with_answers = request_data.get("with_answers") or request_data.get("withAnswers", False)
    answers_only = request_data.get("answers_only") or request_data.get("answersOnly", False)
    seed = request_data.get("seed")
    generated_blocks_data = request_data.get("generated_blocks")
    
    # Resolve blocks
    blocks = config.blocks
    if config.level != "Custom" and (not blocks or len(blocks) == 0):
        blocks = get_preset_blocks(config.level)
    
    # Use provided blocks or generate new ones
    if generated_blocks_data:
        final_blocks = [GeneratedBlock(**block) for block in generated_blocks_data]
    else:
        # Generate with seed
        if seed is None:
            config_json = json.dumps(config.model_dump(), sort_keys=True)
            config_hash = int(hashlib.md5(config_json.encode()).hexdigest(), 16)
            seed = abs(config_hash) % (2**31)
        
        question_id_counter = 1
        final_blocks = []
        for block in blocks:
            gen_block = generate_block(block, question_id_counter, seed)
            final_blocks.append(gen_block)
            question_id_counter += block.count
    
    # Generate PDF using Playwright (industry standard - pixel perfect)
    try:
        pdf_buffer = await generate_pdf_playwright(config, final_blocks, with_answers, answers_only)
        if answers_only:
            filename = f"{config.title.replace(' ', '_')}_answers_only.pdf"
        elif with_answers:
            filename = f"{config.title.replace(' ', '_')}_with_answers.pdf"
        else:
            filename = f"{config.title.replace(' ', '_')}.pdf"
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        import traceback
        error_msg = str(e)
        traceback_str = traceback.format_exc()
        print(f"PDF generation error: {error_msg}\n{traceback_str}")
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {error_msg}")


@app.post("/api/papers/{paper_id}/download")
async def download_paper_pdf(
    paper_id: int,
    with_answers: bool = False,
    db: Session = Depends(get_db)
):
    """Download PDF for a saved paper."""
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    # Reconstruct config from stored data
    config = PaperConfig(**paper.config)
    
    # Generate questions (regenerate each time)
    config_json = json.dumps(paper.config, sort_keys=True)
    config_hash = int(hashlib.md5(config_json.encode()).hexdigest(), 16)
    seed = abs(config_hash) % (2**31)
    
    question_id_counter = 1
    generated_blocks = []
    for block_config_dict in config.blocks:
        block_config = BlockConfig(**block_config_dict)
        gen_block = generate_block(block_config, question_id_counter, seed)
        generated_blocks.append(gen_block)
        question_id_counter += block_config.count
    
    # Generate PDF using Playwright (industry standard - pixel perfect)
    try:
        pdf_buffer = await generate_pdf_playwright(config, generated_blocks, with_answers, False)
        filename = f"{paper.title.replace(' ', '_')}{'_answers' if with_answers else ''}.pdf"
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

