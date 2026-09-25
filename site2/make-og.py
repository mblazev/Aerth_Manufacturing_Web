#!/usr/bin/env python3
"""Generate og.png (and the Macedonian variant) — the image shown when the
site is shared on LinkedIn, WhatsApp, Viber or Facebook. 1200x630."""

from PIL import Image, ImageDraw, ImageFont

PAPER = (233, 231, 225)
INK   = (22, 23, 26)
INK2  = (84, 86, 90)
RULE  = (203, 199, 190)
BLUE  = (34, 68, 124)
RED   = (184, 54, 42)
FILL  = (224, 220, 211)

F = "/usr/share/fonts/truetype/dejavu/"
bold = lambda s: ImageFont.truetype(F + "DejaVuSans-Bold.ttf", s)
reg  = lambda s: ImageFont.truetype(F + "DejaVuSans.ttf", s)
mono = lambda s: ImageFont.truetype(F + "DejaVuSansMono.ttf", s)


def bracket(d, ox, oy, k):
    """L-bracket in plan view with dimension lines, same part as the hero."""
    def P(x, y): return (ox + x * k, oy + y * k)

    d.polygon([P(0, 0), P(208, 0), P(208, 60), P(70, 60), P(70, 160), P(0, 160)],
              fill=FILL, outline=INK, width=3)
    for cx, cy in ((34, 30), (174, 30), (34, 125)):
        r = 13 * k
        x, y = P(cx, cy)
        d.ellipse([x - r, y - r, x + r, y + r], fill=PAPER, outline=INK, width=3)
        d.line([x - r, y, x + r, y], fill=BLUE, width=1)
        d.line([x, y - r, x, y + r], fill=BLUE, width=1)

    # top dimension
    d.line([P(0, -26), P(208, -26)], fill=BLUE, width=2)
    d.line([P(0, -32), P(0, -20)], fill=BLUE, width=2)
    d.line([P(208, -32), P(208, -20)], fill=BLUE, width=2)
    d.text(P(92, -56), "210", font=mono(20), fill=BLUE)

    # left dimension
    d.line([P(-30, 0), P(-30, 160)], fill=BLUE, width=2)
    d.line([P(-36, 0), P(-24, 0)], fill=BLUE, width=2)
    d.line([P(-36, 160), P(-24, 160)], fill=BLUE, width=2)
    d.text(P(-78, 70), "160", font=mono(20), fill=BLUE)

    # leader + tolerance callout, kept inside the frame
    d.line([P(180, 22), P(214, -44)], fill=BLUE, width=2)
    d.text(P(218, -58), "Ø5 ±0.1", font=mono(20), fill=RED)


def build(path, kicker, headline, footer, mat_note):
    img = Image.new("RGB", (1200, 630), PAPER)
    d = ImageDraw.Draw(img)

    d.rectangle([0, 0, 1199, 8], fill=INK)                       # top band
    d.text((72, 64), kicker, font=mono(20), fill=INK2)

    # auto-fit the headline so no line can reach the drawing
    MAXW = 650
    size = 50
    while size > 30:
        f = bold(size)
        if max(d.textlength(l, font=f) for l in headline) <= MAXW:
            break
        size -= 2
    f = bold(size)
    y = 132
    for line in headline:
        d.text((72, y), line, font=f, fill=INK)
        y += int(size * 1.28)

    d.line([(72, 470), (660, 470)], fill=RULE, width=2)
    d.text((72, 496), footer[0], font=reg(22), fill=INK2)
    d.text((72, 532), footer[1], font=reg(22), fill=INK2)

    bracket(d, 800, 230, 1.2)
    d.line([(760, 470), (1128, 470)], fill=RULE, width=2)
    d.text((760, 496), mat_note, font=mono(17), fill=INK2)

    img.save(path, "PNG", optimize=True)
    print("wrote", path, img.size)


build(
    "og.png",
    "MARIO BLAZEVSKI  ·  ENGINEERING & MANUFACTURING",
    ["Parts designed, made", "and checked before", "they ship."],
    ["Drone components · restoration parts · jigs and prototypes",
     "Production in North Macedonia · delivery across the Balkans and EU"],
    "PA-CF · 4 walls · mm unless noted",
)

build(
    "mk/og.png",
    "МАРИО БЛАЖЕВСКИ  ·  ИНЖЕНЕРИНГ И ИЗРАБОТКА",
    ["Делови проектирани,", "изработени и проверени", "пред испорака."],
    ["Делови за дронови · реставрација · алати и прототипови",
     "Производство во Северна Македонија · испорака во регионот и ЕУ"],
    "PA-CF · 4 ѕида · mm",
)
