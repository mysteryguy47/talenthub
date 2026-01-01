"""Preset question blocks for different levels."""
from schemas import BlockConfig, Constraints, QuestionType


PRESETS = {
    "Junior": [
        BlockConfig(
            id="jr-1",
            type="direct_add_sub",
            count=10,
            constraints=Constraints(digits=1, rows=3),
            title="Direct Add/Sub"
        ),
        BlockConfig(
            id="jr-2",
            type="small_friends_add_sub",
            count=10,
            constraints=Constraints(digits=1, rows=3),
            title="Small Friends Add/Sub"
        ),
        BlockConfig(
            id="jr-3",
            type="big_friends_add_sub",
            count=10,
            constraints=Constraints(digits=1, rows=3),
            title="Big Friends Add/Sub"
        ),
    ],
    "AB-1": [
        BlockConfig(id="ab1-1", type="add_sub", count=10, constraints=Constraints(digits=1, rows=3), title="Add/Sub Mix 1D 3R"),
        BlockConfig(id="ab1-2", type="add_sub", count=10, constraints=Constraints(digits=1, rows=3), title="Add/Sub Mix 1D 3R"),
        BlockConfig(id="ab1-3", type="add_sub", count=10, constraints=Constraints(digits=1, rows=3), title="Add/Sub Mix 1D 3R"),
        BlockConfig(id="ab1-4", type="add_sub", count=10, constraints=Constraints(digits=1, rows=4), title="Add/Sub Mix 1D 4R"),
        BlockConfig(id="ab1-5", type="add_sub", count=10, constraints=Constraints(digits=1, rows=4), title="Add/Sub Mix 1D 4R"),
        BlockConfig(id="ab1-6", type="add_sub", count=10, constraints=Constraints(digits=1, rows=4), title="Add/Sub Mix 1D 4R"),
        BlockConfig(id="ab1-7", type="add_sub", count=10, constraints=Constraints(digits=1, rows=5), title="Add/Sub Mix 1D 5R"),
        BlockConfig(id="ab1-8", type="add_sub", count=10, constraints=Constraints(digits=1, rows=5), title="Add/Sub Mix 1D 5R"),
        BlockConfig(id="ab1-9", type="add_sub", count=10, constraints=Constraints(digits=1, rows=5), title="Add/Sub Mix 1D 5R"),
        BlockConfig(id="ab1-10", type="add_sub", count=10, constraints=Constraints(digits=1, rows=6), title="Add/Sub Mix 1D 6R"),
    ],
    "AB-2": [
        BlockConfig(id="ab2-1", type="add_sub", count=10, constraints=Constraints(digits=1, rows=4), title="Add/Sub Mix 1D 4R"),
        BlockConfig(id="ab2-2", type="add_sub", count=10, constraints=Constraints(digits=1, rows=5), title="Add/Sub Mix 1D 5R"),
        BlockConfig(id="ab2-3", type="add_sub", count=10, constraints=Constraints(digits=1, rows=6), title="Add/Sub Mix 1D 6R"),
        BlockConfig(id="ab2-4", type="add_sub", count=10, constraints=Constraints(digits=1, rows=7), title="Add/Sub Mix 1D 7R"),
        BlockConfig(id="ab2-5", type="add_sub", count=10, constraints=Constraints(digits=2, rows=3), title="Add/Sub Mix 2D 3R"),
        BlockConfig(id="ab2-6", type="add_sub", count=10, constraints=Constraints(digits=2, rows=3), title="Add/Sub Mix 2D 3R"),
        BlockConfig(id="ab2-7", type="add_sub", count=10, constraints=Constraints(digits=2, rows=3), title="Add/Sub Mix 2D 3R"),
        BlockConfig(id="ab2-8", type="add_sub", count=10, constraints=Constraints(digits=2, rows=4), title="Add/Sub Mix 2D 4R"),
        BlockConfig(id="ab2-9", type="add_sub", count=10, constraints=Constraints(digits=2, rows=4), title="Add/Sub Mix 2D 4R"),
        BlockConfig(id="ab2-10", type="add_sub", count=10, constraints=Constraints(digits=2, rows=5), title="Add/Sub Mix 2D 5R"),
    ],
    "AB-3": [
        BlockConfig(id="ab3-1", type="add_sub", count=10, constraints=Constraints(digits=1, rows=6), title="Add/Sub Mix 1D 6R"),
        BlockConfig(id="ab3-2", type="add_sub", count=10, constraints=Constraints(digits=1, rows=7), title="Add/Sub Mix 1D 7R"),
        BlockConfig(id="ab3-3", type="add_sub", count=10, constraints=Constraints(digits=2, rows=5), title="Add/Sub Mix 2D 5R"),
        BlockConfig(id="ab3-4", type="add_sub", count=10, constraints=Constraints(digits=2, rows=6), title="Add/Sub Mix 2D 6R"),
        BlockConfig(id="ab3-5", type="add_sub", count=10, constraints=Constraints(digits=3, rows=2), title="Add/Sub Mix 3D 2R"),
        BlockConfig(id="ab3-6", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=2, multiplierDigits=1), title="Multiplication 2×1"),
        BlockConfig(id="ab3-7", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=2, multiplierDigits=1), title="Multiplication 2×1"),
        BlockConfig(id="ab3-8", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=2, multiplierDigits=1), title="Multiplication 2×1"),
        BlockConfig(id="ab3-9", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=3, multiplierDigits=1), title="Multiplication 3×1"),
        BlockConfig(id="ab3-10", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=3, multiplierDigits=1), title="Multiplication 3×1"),
    ],
    "AB-4": [
        BlockConfig(id="ab4-1", type="add_sub", count=10, constraints=Constraints(digits=1, rows=8), title="Add/Sub Mix 1D 8R"),
        BlockConfig(id="ab4-2", type="add_sub", count=10, constraints=Constraints(digits=2, rows=6), title="Add/Sub Mix 2D 6R"),
        BlockConfig(id="ab4-3", type="add_sub", count=10, constraints=Constraints(digits=2, rows=7), title="Add/Sub Mix 2D 7R"),
        BlockConfig(id="ab4-4", type="add_sub", count=10, constraints=Constraints(digits=3, rows=3), title="Add/Sub Mix 3D 3R"),
        BlockConfig(id="ab4-5", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=2, multiplierDigits=1), title="Multiplication 2×1"),
        BlockConfig(id="ab4-6", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=3, multiplierDigits=1), title="Multiplication 3×1"),
        BlockConfig(id="ab4-7", type="division", count=10, constraints=Constraints(dividendDigits=2, divisorDigits=1), title="Divide 2÷1"),
        BlockConfig(id="ab4-8", type="division", count=10, constraints=Constraints(dividendDigits=3, divisorDigits=1), title="Divide 3÷1"),
        BlockConfig(id="ab4-9", type="division", count=10, constraints=Constraints(dividendDigits=3, divisorDigits=1), title="Divide 3÷1"),
        BlockConfig(id="ab4-10", type="division", count=10, constraints=Constraints(dividendDigits=4, divisorDigits=1), title="Divide 4÷1"),
    ],
    "AB-5": [
        BlockConfig(id="ab5-1", type="add_sub", count=10, constraints=Constraints(digits=1, rows=9), title="Add/Sub Mix 1D 9R"),
        BlockConfig(id="ab5-2", type="add_sub", count=10, constraints=Constraints(digits=2, rows=8), title="Add/Sub Mix 2D 8R"),
        BlockConfig(id="ab5-3", type="add_sub", count=10, constraints=Constraints(digits=3, rows=4), title="Add/Sub Mix 3D 4R"),
        BlockConfig(id="ab5-4", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=3, multiplierDigits=1), title="Multiplication 3×1"),
        BlockConfig(id="ab5-5", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=4, multiplierDigits=1), title="Multiplication 4×1"),
        BlockConfig(id="ab5-6", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=2, multiplierDigits=2), title="Multiplication 2×2"),
        BlockConfig(id="ab5-7", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=2, multiplierDigits=2), title="Multiplication 2×2"),
        BlockConfig(id="ab5-8", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=3, multiplierDigits=2), title="Multiplication 3×2"),
        BlockConfig(id="ab5-9", type="division", count=10, constraints=Constraints(dividendDigits=3, divisorDigits=1), title="Divide 3÷1"),
        BlockConfig(id="ab5-10", type="division", count=10, constraints=Constraints(dividendDigits=4, divisorDigits=1), title="Divide 4÷1"),
    ],
    "AB-6": [
        BlockConfig(id="ab6-1", type="add_sub", count=10, constraints=Constraints(digits=1, rows=10), title="Add/Sub Mix 1D 10R"),
        BlockConfig(id="ab6-2", type="add_sub", count=10, constraints=Constraints(digits=2, rows=9), title="Add/Sub Mix 2D 9R"),
        BlockConfig(id="ab6-3", type="add_sub", count=10, constraints=Constraints(digits=3, rows=5), title="Add/Sub Mix 3D 5R"),
        BlockConfig(id="ab6-4", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=3, multiplierDigits=1), title="Multiplication 3×1"),
        BlockConfig(id="ab6-5", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=2, multiplierDigits=2), title="Multiplication 2×2"),
        BlockConfig(id="ab6-6", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=3, multiplierDigits=2), title="Multiplication 3×2"),
        BlockConfig(id="ab6-7", type="division", count=10, constraints=Constraints(dividendDigits=4, divisorDigits=1), title="Divide 4÷1"),
        BlockConfig(id="ab6-8", type="division", count=10, constraints=Constraints(dividendDigits=3, divisorDigits=2), title="Divide 3÷2"),
        BlockConfig(id="ab6-9", type="division", count=10, constraints=Constraints(dividendDigits=4, divisorDigits=2), title="Divide 4÷2"),
        BlockConfig(id="ab6-10", type="division", count=10, constraints=Constraints(dividendDigits=4, divisorDigits=2), title="Divide 4÷2"),
    ],
    "AB-7": [
        BlockConfig(id="ab7-1", type="add_sub", count=10, constraints=Constraints(digits=1, rows=11), title="Add/Sub Mix 1D 11R"),
        BlockConfig(id="ab7-2", type="add_sub", count=10, constraints=Constraints(digits=2, rows=10), title="Add/Sub Mix 2D 10R"),
        BlockConfig(id="ab7-3", type="add_sub", count=10, constraints=Constraints(digits=3, rows=6), title="Add/Sub Mix 3D 6R"),
        BlockConfig(id="ab7-4", type="add_sub", count=10, constraints=Constraints(digits=4, rows=3), title="Add/Sub Mix 4D 3R"),
        BlockConfig(id="ab7-5", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=3, multiplierDigits=1), title="Multiplication 3×1"),
        BlockConfig(id="ab7-6", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=4, multiplierDigits=1), title="Multiplication 4×1"),
        BlockConfig(id="ab7-7", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=2, multiplierDigits=2), title="Multiplication 2×2"),
        BlockConfig(id="ab7-8", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=3, multiplierDigits=2), title="Multiplication 3×2"),
        BlockConfig(id="ab7-9", type="division", count=10, constraints=Constraints(dividendDigits=4, divisorDigits=1), title="Divide 4÷1"),
        BlockConfig(id="ab7-10", type="division", count=10, constraints=Constraints(dividendDigits=5, divisorDigits=1), title="Divide 5÷1"),
    ],
    "AB-8": [
        BlockConfig(id="ab8-1", type="add_sub", count=10, constraints=Constraints(digits=1, rows=12), title="Add/Sub Mix 1D 12R"),
        BlockConfig(id="ab8-2", type="add_sub", count=10, constraints=Constraints(digits=2, rows=11), title="Add/Sub Mix 2D 11R"),
        BlockConfig(id="ab8-3", type="add_sub", count=10, constraints=Constraints(digits=3, rows=7), title="Add/Sub Mix 3D 7R"),
        BlockConfig(id="ab8-4", type="add_sub", count=10, constraints=Constraints(digits=4, rows=4), title="Add/Sub Mix 4D 4R"),
        BlockConfig(id="ab8-5", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=4, multiplierDigits=1), title="Multiplication 4×1"),
        BlockConfig(id="ab8-6", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=3, multiplierDigits=2), title="Multiplication 3×2"),
        BlockConfig(id="ab8-7", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=4, multiplierDigits=2), title="Multiplication 4×2"),
        BlockConfig(id="ab8-8", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=2, multiplierDigits=3), title="Multiplication 2×3"),
        BlockConfig(id="ab8-9", type="division", count=10, constraints=Constraints(dividendDigits=5, divisorDigits=1), title="Divide 5÷1"),
        BlockConfig(id="ab8-10", type="division", count=10, constraints=Constraints(dividendDigits=4, divisorDigits=2), title="Divide 4÷2"),
    ],
    "AB-9": [
        BlockConfig(id="ab9-1", type="add_sub", count=10, constraints=Constraints(digits=1, rows=13), title="Add/Sub Mix 1D 13R"),
        BlockConfig(id="ab9-2", type="add_sub", count=10, constraints=Constraints(digits=2, rows=12), title="Add/Sub Mix 2D 12R"),
        BlockConfig(id="ab9-3", type="add_sub", count=10, constraints=Constraints(digits=3, rows=8), title="Add/Sub Mix 3D 8R"),
        BlockConfig(id="ab9-4", type="add_sub", count=10, constraints=Constraints(digits=4, rows=5), title="Add/Sub Mix 4D 5R"),
        BlockConfig(id="ab9-5", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=4, multiplierDigits=1), title="Multiplication 4×1"),
        BlockConfig(id="ab9-6", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=4, multiplierDigits=2), title="Multiplication 4×2"),
        BlockConfig(id="ab9-7", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=3, multiplierDigits=3), title="Multiplication 3×3"),
        BlockConfig(id="ab9-8", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=5, multiplierDigits=1), title="Multiplication 5×1"),
        BlockConfig(id="ab9-9", type="division", count=10, constraints=Constraints(dividendDigits=5, divisorDigits=2), title="Divide 5÷2"),
        BlockConfig(id="ab9-10", type="division", count=10, constraints=Constraints(dividendDigits=6, divisorDigits=1), title="Divide 6÷1"),
    ],
    "AB-10": [
        BlockConfig(id="ab10-1", type="add_sub", count=10, constraints=Constraints(digits=1, rows=14), title="Add/Sub Mix 1D 14R"),
        BlockConfig(id="ab10-2", type="add_sub", count=10, constraints=Constraints(digits=2, rows=13), title="Add/Sub Mix 2D 13R"),
        BlockConfig(id="ab10-3", type="add_sub", count=10, constraints=Constraints(digits=3, rows=9), title="Add/Sub Mix 3D 9R"),
        BlockConfig(id="ab10-4", type="add_sub", count=10, constraints=Constraints(digits=4, rows=6), title="Add/Sub Mix 4D 6R"),
        BlockConfig(id="ab10-5", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=5, multiplierDigits=1), title="Multiplication 5×1"),
        BlockConfig(id="ab10-6", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=4, multiplierDigits=2), title="Multiplication 4×2"),
        BlockConfig(id="ab10-7", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=3, multiplierDigits=3), title="Multiplication 3×3"),
        BlockConfig(id="ab10-8", type="multiplication", count=10, constraints=Constraints(multiplicandDigits=5, multiplierDigits=2), title="Multiplication 5×2"),
        BlockConfig(id="ab10-9", type="division", count=10, constraints=Constraints(dividendDigits=6, divisorDigits=2), title="Divide 6÷2"),
        BlockConfig(id="ab10-10", type="division", count=10, constraints=Constraints(dividendDigits=5, divisorDigits=3), title="Divide 5÷3"),
    ],
    "Advanced": [
        BlockConfig(
            id="adv-1",
            type="square_root",
            count=10,
            constraints=Constraints(rootDigits=3),
            title="Square Root (3 digits)"
        ),
        BlockConfig(
            id="adv-2",
            type="cube_root",
            count=10,
            constraints=Constraints(rootDigits=5),
            title="Cube Root (5 digits)"
        ),
        BlockConfig(
            id="adv-3",
            type="decimal_multiplication",
            count=10,
            constraints=Constraints(multiplicandDigits=2, multiplierDigits=1),
            title="Decimal Multiplication"
        ),
        BlockConfig(
            id="adv-4",
            type="decimal_division",
            count=10,
            constraints=Constraints(multiplicandDigits=2, multiplierDigits=1),
            title="Decimal Division"
        ),
        BlockConfig(
            id="adv-5",
            type="integer_add_sub",
            count=10,
            constraints=Constraints(digits=2, rows=3),
            title="Integer Add/Sub (with negatives)"
        ),
        BlockConfig(
            id="adv-6",
            type="lcm",
            count=10,
            constraints=Constraints(multiplicandDigits=2, multiplierDigits=2),
            title="LCM"
        ),
        BlockConfig(
            id="adv-7",
            type="gcd",
            count=10,
            constraints=Constraints(multiplicandDigits=2, multiplierDigits=2),
            title="GCD"
        ),
        BlockConfig(
            id="adv-8",
            type="percentage",
            count=10,
            constraints=Constraints(percentageMin=1, percentageMax=100, numberDigits=4),
            title="Percentage"
        )
    ]
}


def get_preset_blocks(level: str) -> list[BlockConfig]:
    """Get preset blocks for a given level."""
    return PRESETS.get(level, [])

