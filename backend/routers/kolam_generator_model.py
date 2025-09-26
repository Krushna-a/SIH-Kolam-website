import io
import base64
import random
from math import gcd
from typing import Tuple

import numpy as np
import matplotlib

# Use a non-GUI backend suitable for servers/CLIs
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.path import Path  # noqa: E402
import matplotlib.patches as patches  # noqa: E402


def _draw_bezier(ax, p0: Tuple[float, float], p1: Tuple[float, float], p2: Tuple[float, float],
                 color: str = "black", linewidth: float = 1.5) -> None:
    verts = [p0, p1, p2]
    codes = [Path.MOVETO, Path.CURVE3, Path.CURVE3]
    path = Path(verts, codes)
    patch = patches.PathPatch(path, facecolor="none", edgecolor=color, lw=linewidth)
    ax.add_patch(patch)


def generate_kolam_png_base64(
    m: int,
    n: int,
    region: str = "Tamil Nadu",
    style: str = "Pulli",
    color: int = 50,       # 0..100 -> grayscale intensity
    size: int = 32,        # 0..100 -> line width scaling
    complexity: int = 75,  # 0..100 -> randomness/curve offset scaling
) -> str:
    if m <= 0 or n <= 0:
        raise ValueError("m and n must be positive integers")

    if gcd(m, n) != 1:
        # Non-fatal: proceed but note randomness helps aesthetics
        pass

    # Region-specific params
    region_params = {
        "Tamil Nadu": {"curve_offset": 0.25, "dot_size": 5, "line_width": 1.5},
        "Karnataka": {"curve_offset": 0.15, "dot_size": 4, "line_width": 1.3},
        "Andhra Pradesh": {"curve_offset": 0.20, "dot_size": 5, "line_width": 1.4},
    }
    params = region_params.get(region, region_params["Tamil Nadu"])

    # Apply controls
    color = max(0, min(100, int(color)))
    size = max(0, min(100, int(size)))
    complexity = max(0, min(100, int(complexity)))

    # Map color to grayscale hex (0->black, 100->light gray)
    shade = int(255 * (color / 100.0))
    line_color = f"#{shade:02x}{shade:02x}{shade:02x}"

    # Scale line width with size
    base_lw = params["line_width"]
    line_width = base_lw * (0.5 + size / 50.0)

    # Scale randomness with complexity
    base_offset = params["curve_offset"]
    curve_offset = base_offset * (0.3 + complexity / 70.0)

    # Style tweaks
    if style.lower() == "freehand":
        curve_offset *= 1.4
    elif style.lower() == "rangoli":
        line_width *= 1.2
    elif style.lower() == "symmetry":
        curve_offset *= 0.8

    # Dot positions
    sequence = [m if k == 0 else (k * n) % m or m for k in range(m)]
    dots_matrix = np.tile(sequence, (n, 1)).T
    angles = np.linspace(0, 2 * np.pi, n, endpoint=False)

    fig, ax = plt.subplots(figsize=(6, 6))
    ax.set_aspect("equal")
    ax.axis("off")
    ax.set_facecolor("white")

    points = []
    for i in range(m):
        row = []
        for j in range(n):
            r = float(dots_matrix[i][j])
            theta = float(angles[j])
            x, y = r * np.cos(theta), r * np.sin(theta)
            ax.plot(x, y, "o", color="#000000", markersize=params["dot_size"])
            row.append((x, y))
        points.append(row)

    for i in range(m):
        for j in range(n):
            x0, y0 = points[i][j]
            next_i = (i + 1) % m
            next_j = (j + 1) % n
            x2, y2 = points[next_i][next_j]

            xm = (x0 + x2) / 2 + random.uniform(-curve_offset, curve_offset)
            ym = (y0 + y2) / 2 + random.uniform(-curve_offset, curve_offset)
            _draw_bezier(ax, (x0, y0), (xm, ym), (x2, y2), color=line_color, linewidth=line_width)

    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", dpi=160)
    buf.seek(0)
    png_b64 = base64.b64encode(buf.read()).decode("ascii")

    # Also produce SVG for vector export
    buf_svg = io.BytesIO()
    fig.savefig(buf_svg, format="svg", bbox_inches="tight", dpi=160)
    buf_svg.seek(0)
    svg_text = buf_svg.read().decode("utf-8")

    plt.close(fig)
    return png_b64, svg_text


def compute_insights(m: int, n: int) -> dict:
    from math import gcd as _gcd
    coprime = _gcd(m, n) == 1
    rotational_order = n
    reflection_axes = 2 if n % 2 == 1 else 4
    return {
        "coprime": coprime,
        "rotational_order": rotational_order,
        "reflection_axes": reflection_axes,
        "description": f"Kolam with rotational symmetry of order {rotational_order} and approx {reflection_axes} reflection axes. m and n are{' ' if coprime else ' not '}coprime.",
    }