import os
import sys
import math
import time
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 1410, 798
FPS = 30.0
TOTAL_FRAMES = 1332 # 44.4s

font_dir = "C:/Windows/Fonts"
font_title = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 38)
font_h2 = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 24)
font_bold = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 18)
font_sm = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 14)
font_sm_bold = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 13)
font_timer = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 48)
font_btn = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 20)

# Pre-load daylight desk photo
desk_img = None
desk_path = "public/images/cs-study-light-notes.jpg"
if os.path.exists(desk_path):
    d_raw = Image.open(desk_path).convert("RGB")
    dw, dh = d_raw.size
    target_ratio = 520 / H
    if dw / dh > target_ratio:
        nw = int(dh * target_ratio)
        d_raw = d_raw.crop(((dw - nw)//2, 0, (dw + nw)//2, dh))
    else:
        nh = int(dw / target_ratio)
        d_raw = d_raw.crop((0, (dh - nh)//2, dw, (dh + nh)//2))
    desk_img = d_raw.resize((520, H), Image.Resampling.LANCZOS)

# Base Daylight Background (#F2F6FF to #F8FAFC with rich subtle blue & cyan ambient tints)
def create_daylight_base():
    bg = Image.new("RGB", (W, H), (242, 246, 255))
    d = ImageDraw.Draw(bg)
    for y in range(H):
        ratio = y / H
        col = (
            int(238 + 10 * ratio),
            int(244 + 6 * ratio),
            int(255 - 3 * ratio)
        )
        d.line([(0, y), (W, y)], fill=col)
    
    # Soft ambient radial glow at top-center
    for r in range(350, 0, -10):
        alpha = int(18 * (1.0 - r / 350.0))
        d.ellipse([(W//2 - r*2, -r), (W//2 + r*2, r)], outline=(49, 91, 255), width=2)
    return bg

bg_daylight = create_daylight_base()

# STAGE 1: Colorful Daylight Routine Schedule
def render_stage1(frame_idx):
    im = bg_daylight.copy()
    d = ImageDraw.Draw(im)
    t = frame_idx / FPS
    float_y = int(math.sin(t * 3.0) * 6)

    # Top pill with vibrant Royal Blue border
    d.rounded_rectangle([(W//2 - 215, 40), (W//2 + 215, 82)], radius=21, fill=(238, 243, 255), outline=(49, 91, 255), width=2)
    d.text((W//2, 61), "FASTTASK ACADEMIC OS • SEMESTER 2026", font=font_sm_bold, fill=(37, 99, 235), anchor="mm")

    # Center white dashboard card with colorful drop shadow
    cw, ch = 830, 535
    cx1, cy1 = W//2 - cw//2, 112 + float_y

    # Colorful drop shadow
    d.rounded_rectangle([(cx1 - 3, cy1 + 6), (cx1 + cw + 3, cy1 + ch + 12)], radius=28, fill=(214, 226, 250))
    d.rounded_rectangle([(cx1, cy1), (cx1 + cw, cy1 + ch)], radius=26, fill=(255, 255, 255), outline=(199, 217, 252), width=2)

    # Header top accent bar
    d.rounded_rectangle([(cx1 + 2, cy1 + 2), (cx1 + cw - 2, cy1 + 8)], radius=3, fill=(49, 91, 255))

    # Header inside card
    d.text((cx1 + 45, cy1 + 40), "Spring 2026 Routine Schedule", font=font_h2, fill=(23, 32, 51))
    d.text((cx1 + 45, cy1 + 70), "Synchronized with university semester timetable & faculty labs.", font=font_sm, fill=(100, 116, 139))

    # Active Routine badge
    d.rounded_rectangle([(cx1 + cw - 180, cy1 + 36), (cx1 + cw - 40, cy1 + 74)], radius=16, fill=(240, 253, 244), outline=(34, 197, 94), width=1)
    d.text((cx1 + cw - 110, cy1 + 55), "● Active Routine", font=font_sm_bold, fill=(22, 163, 74), anchor="mm")

    # Course Rows with Distinct Vibrant Color Bars
    courses = [
        ("09:30 AM", "CS 201: Data Structures & Algorithms", "Lab 402 • Binary Search Trees", (49, 91, 255), (238, 243, 255), (191, 219, 254)),
        ("11:45 AM", "CS 102: Discrete Mathematics", "Lecture Hall B • Graph Induction", (99, 102, 241), (238, 242, 255), (199, 210, 254)),
        ("02:15 PM", "CS 301: Operating Systems & Arch", "Lab 108 • CPU Scheduling Sim", (16, 185, 129), (240, 253, 244), (187, 247, 208)),
        ("04:00 PM", "CSE 211: Digital Logic Systems", "Systems Lab 3 • K-Map Design", (14, 165, 233), (240, 249, 255), (186, 230, 253))
    ]

    for idx, (tm, c_name, room, col, bg_col, border_col) in enumerate(courses):
        ry = cy1 + 115 + idx * 95
        # Row card
        d.rounded_rectangle([(cx1 + 40, ry), (cx1 + cw - 40, ry + 78)], radius=16, fill=(255, 255, 255), outline=border_col, width=1)
        # Left colored accent line
        d.rounded_rectangle([(cx1 + 40, ry), (cx1 + 47, ry + 78)], radius=4, fill=col)
        # Time badge
        d.rounded_rectangle([(cx1 + 65, ry + 16), (cx1 + 185, ry + 62)], radius=12, fill=bg_col, outline=col, width=1)
        d.text((cx1 + 125, ry + 39), tm, font=font_bold, fill=col, anchor="mm")
        # Course name & room
        d.text((cx1 + 205, ry + 22), c_name, font=font_bold, fill=(23, 32, 51))
        d.text((cx1 + 205, ry + 48), room, font=font_sm, fill=(100, 116, 139))

    # Floating side pills with rich colors
    tags = [
        (130, 250 + int(math.sin(t*2.5)*10), "CS 102", (99, 102, 241), (238, 242, 255)),
        (1270, 230 + int(math.cos(t*2.8)*10), "CS 201", (49, 91, 255), (238, 243, 255)),
        (140, 520 + int(math.cos(t*2.2)*10), "CS 301", (16, 185, 129), (240, 253, 244)),
        (1260, 500 + int(math.sin(t*3.0)*10), "CSE 211", (14, 165, 233), (240, 249, 255))
    ]
    for x, y, tag, col, fill_col in tags:
        d.rounded_rectangle([(x-65, y-24), (x+65, y+24)], radius=18, fill=fill_col, outline=col, width=2)
        d.text((x, y), tag, font=font_bold, fill=col, anchor="mm")
    return im

# STAGE 2: Colorful Daylight Deadline Velocity Radar
def render_stage2(frame_idx):
    im = bg_daylight.copy()
    d = ImageDraw.Draw(im)
    t = (frame_idx - 90) / FPS

    d.rounded_rectangle([(W//2 - 215, 40), (W//2 + 215, 82)], radius=21, fill=(238, 243, 255), outline=(49, 91, 255), width=2)
    d.text((W//2, 61), "STAGE 02 • DEADLINE VELOCITY RADAR", font=font_sm_bold, fill=(37, 99, 235), anchor="mm")

    d.text((W//2, 125), "Eliminate Coursework Panic & Lost Submissions", font=font_title, fill=(23, 32, 51), anchor="mm")
    d.text((W//2, 168), "Automated priority tracking for assignments, lab reports, and midterm countdowns.", font=font_sm, fill=(100, 116, 139), anchor="mm")

    rx, ry = 400, 465
    for r in [60, 120, 180, 240]:
        d.ellipse([(rx - r, ry - r), (rx + r, ry + r)], outline=(191, 219, 254), width=2)
    d.line([(rx - 250, ry), (rx + 250, ry)], fill=(208, 223, 255), width=1)
    d.line([(rx, ry - 250), (rx, ry + 250)], fill=(208, 223, 255), width=1)

    sweep_angle = int((t * 120.0) % 360)
    d.pieslice([(rx - 238, ry - 238), (rx + 238, ry + 238)], start=sweep_angle - 45, end=sweep_angle, fill=(219, 234, 254))
    d.ellipse([(rx - 12, ry - 12), (rx + 12, ry + 12)], fill=(49, 91, 255))

    pings = [
        (rx + 90, ry - 110, "CS 201", (239, 68, 68), (254, 226, 226)),
        (rx - 120, ry - 70, "CS 301", (49, 91, 255), (219, 234, 254)),
        (rx + 110, ry + 80, "CS 102", (16, 185, 129), (209, 250, 229))
    ]
    for px, py, label, col, glow_col in pings:
        ping_pulse = int(abs(math.sin(t * 4.0 + px)) * 5)
        d.ellipse([(px - 14 - ping_pulse, py - 14 - ping_pulse), (px + 14 + ping_pulse, py + 14 + ping_pulse)], outline=col, width=2)
        d.ellipse([(px - 8, py - 8), (px + 8, py + 8)], fill=col)
        d.rounded_rectangle([(px + 14, py - 15), (px + 90, py + 15)], radius=12, fill=col)
        d.text((px + 52, py), label, font=font_sm_bold, fill=(255, 255, 255), anchor="mm")

    cx = 740
    cards = [
        ("CRITICAL DUE DATE • 14 HOURS LEFT", "CS 201: Binary Search Tree Lab Report", "Due: Tonight 11:59 PM • 40% Grade Weight", (239, 68, 68), (254, 242, 242), (254, 202, 202)),
        ("UPCOMING MIDTERM EXAM • 3 DAYS", "CS 301: CPU Scheduling & Memory Mgmt", "Exam: Thursday 09:00 AM • Main Hall", (49, 91, 255), (238, 243, 255), (191, 219, 254)),
        ("AUTO-SCHEDULED TO POMODORO", "CS 102: Mathematical Induction Proof Set", "2 Focus Blocks Reserved Today • FastTask Flow", (16, 185, 129), (240, 253, 244), (187, 247, 208))
    ]
    for idx, (badge, title, subtitle, col, bg, b_col) in enumerate(cards):
        cy = 240 + idx * 145
        d.rounded_rectangle([(cx, cy), (cx + 590, cy + 125)], radius=20, fill=(255, 255, 255), outline=b_col, width=1)
        # Vibrant colored left stripe
        d.rounded_rectangle([(cx, cy), (cx + 8, cy + 125)], radius=4, fill=col)
        # Colorful badge
        d.rounded_rectangle([(cx + 25, cy + 16), (cx + 360, cy + 44)], radius=12, fill=bg, outline=col, width=1)
        d.text((cx + 38, cy + 30), badge, font=font_sm_bold, fill=col, anchor="lm")
        d.text((cx + 25, cy + 62), title, font=font_bold, fill=(23, 32, 51))
        d.text((cx + 25, cy + 92), subtitle, font=font_sm, fill=(100, 116, 139))
    return im

# STAGE 3: Colorful Daylight Pomodoro Focus & Kanban
def render_stage3(frame_idx):
    im = bg_daylight.copy()
    if desk_img:
        im.paste(desk_img, (0, 0))
        d = ImageDraw.Draw(im)
        d.line([(520, 0), (520, H)], fill=(208, 223, 255), width=2)
        d.rounded_rectangle([(25, 25), (290, 65)], radius=18, fill=(255, 255, 255), outline=(49, 91, 255), width=1)
        d.text((40, 36), "CS Workspace • Daylight Flow", font=font_sm_bold, fill=(37, 99, 235))
    else:
        d = ImageDraw.Draw(im)

    t = (frame_idx - 420) / FPS
    rx = 560

    d.rounded_rectangle([(rx, 35), (rx + 330, 77)], radius=20, fill=(238, 243, 255), outline=(49, 91, 255), width=2)
    d.text((rx + 20, 48), "STAGE 03 • POMODORO FOCUS & KANBAN", font=font_sm_bold, fill=(37, 99, 235))

    # Pomodoro Focus Card with Blue Border
    py1 = 95
    d.rounded_rectangle([(rx, py1), (W - 40, py1 + 270)], radius=24, fill=(255, 255, 255), outline=(199, 217, 252), width=2)
    d.rounded_rectangle([(rx + 2, py1 + 2), (W - 42, py1 + 7)], radius=3, fill=(49, 91, 255))

    cx, cy = rx + 140, py1 + 135
    pr = 85
    d.ellipse([(cx - pr, cy - pr), (cx + pr, cy + pr)], outline=(226, 232, 240), width=8)

    elapsed_secs = int(t * 1.5)
    cur_secs = max(0, 1500 - elapsed_secs)
    mins = cur_secs // 60
    secs = cur_secs % 60
    timer_str = f"{mins:02d}:{secs:02d}"

    timer_ratio = cur_secs / 1500.0
    end_deg = -90 + int((1.0 - timer_ratio) * 360)
    d.arc([(cx - pr, cy - pr), (cx + pr, cy + pr)], start=-90, end=max(-85, end_deg), fill=(49, 91, 255), width=8)
    d.text((cx, cy - 10), timer_str, font=font_timer, fill=(23, 32, 51), anchor="mm")
    d.text((cx, cy + 35), "FOCUS INTERVAL", font=font_sm_bold, fill=(100, 116, 139), anchor="mm")

    tx = cx + 130
    d.rounded_rectangle([(tx, py1 + 35), (tx + 190, py1 + 68)], radius=15, fill=(240, 253, 244), outline=(34, 197, 94), width=1)
    d.text((tx + 95, py1 + 51), "● 25m Focus Block Active", font=font_sm_bold, fill=(22, 163, 74), anchor="mm")

    d.text((tx, py1 + 95), "CS 201: Binary Trees & AVL", font=font_h2, fill=(23, 32, 51))
    d.text((tx, py1 + 138), "Task: Implement recursive balance factor and tree rotations.", font=font_sm, fill=(100, 116, 139))
    d.text((tx, py1 + 172), "Cycle: Block 2 of 4  |  Streak: 7 Days  |  Daily Score: 94%", font=font_sm_bold, fill=(49, 91, 255))

    # Kanban Columns with Colored Headers
    ky = 390
    kw = (W - 40 - rx - 20) // 2

    # Column 1: In Progress (Royal Blue Header)
    d.rounded_rectangle([(rx, ky), (rx + kw, H - 40)], radius=20, fill=(255, 255, 255), outline=(199, 217, 252), width=1)
    d.rounded_rectangle([(rx, ky), (rx + kw, ky + 45)], radius=20, fill=(238, 243, 255))
    d.text((rx + 20, ky + 14), "In Progress (2 Tasks)", font=font_bold, fill=(37, 99, 235))

    t1y = ky + 58
    d.rounded_rectangle([(rx + 15, t1y), (rx + kw - 15, t1y + 115)], radius=14, fill=(248, 250, 252), outline=(219, 234, 254), width=1)
    d.rounded_rectangle([(rx + 25, t1y + 14), (rx + 110, t1y + 38)], radius=8, fill=(238, 243, 255), outline=(49, 91, 255), width=1)
    d.text((rx + 67, t1y + 26), "CS 201", font=font_sm_bold, fill=(49, 91, 255), anchor="mm")
    d.text((rx + 25, t1y + 52), "Implement AVL Tree in C++", font=font_bold, fill=(23, 32, 51))

    prog_pct = min(0.95, 0.40 + t * 0.02)
    d.rounded_rectangle([(rx + 25, t1y + 86), (rx + kw - 25, t1y + 96)], radius=5, fill=(226, 232, 240))
    d.rounded_rectangle([(rx + 25, t1y + 86), (rx + int((kw - 50) * prog_pct), t1y + 96)], radius=5, fill=(49, 91, 255))

    # Column 2: Completed Today (Emerald Green Header)
    k2x = rx + kw + 20
    d.rounded_rectangle([(k2x, ky), (k2x + kw, H - 40)], radius=20, fill=(255, 255, 255), outline=(187, 247, 208), width=1)
    d.rounded_rectangle([(k2x, ky), (k2x + kw, ky + 45)], radius=20, fill=(240, 253, 244))
    d.text((k2x + 20, ky + 14), "Completed Today (5 Tasks)", font=font_bold, fill=(22, 163, 74))

    c1y = ky + 58
    d.rounded_rectangle([(k2x + 15, c1y), (k2x + kw - 15, c1y + 60)], radius=12, fill=(248, 250, 252), outline=(220, 252, 231), width=1)
    d.rounded_rectangle([(k2x + 25, c1y + 14), (k2x + 80, c1y + 36)], radius=6, fill=(34, 197, 94))
    d.text((k2x + 52, c1y + 25), "DONE", font=font_sm_bold, fill=(255, 255, 255), anchor="mm")
    d.text((k2x + 92, c1y + 15), "CS 102 Induction Proofs Set", font=font_bold, fill=(23, 32, 51))
    d.text((k2x + 92, c1y + 36), "Finished in 2 Focus Blocks (50m)", font=font_sm, fill=(100, 116, 139))

    c2y = ky + 130
    d.rounded_rectangle([(k2x + 15, c2y), (k2x + kw - 15, c2y + 60)], radius=12, fill=(248, 250, 252), outline=(220, 252, 231), width=1)
    d.rounded_rectangle([(k2x + 25, c2y + 14), (k2x + 80, c2y + 36)], radius=6, fill=(34, 197, 94))
    d.text((k2x + 52, c2y + 25), "DONE", font=font_sm_bold, fill=(255, 255, 255), anchor="mm")
    d.text((k2x + 92, c2y + 15), "CS 301 CPU Scheduling Sim", font=font_bold, fill=(23, 32, 51))
    d.text((k2x + 92, c2y + 36), "Finished in 3 Focus Blocks (75m)", font=font_sm, fill=(100, 116, 139))
    return im

# STAGE 4: Colorful Daylight CTA & Semester Mastery
def render_stage4(frame_idx):
    im = bg_daylight.copy()
    d = ImageDraw.Draw(im)
    t = (frame_idx - 1155) / FPS

    # Top pill
    d.rounded_rectangle([(W//2 - 215, 40), (W//2 + 215, 82)], radius=21, fill=(238, 243, 255), outline=(49, 91, 255), width=2)
    d.text((W//2, 61), "STAGE 04 • CONTINUOUS ACADEMIC MASTERY", font=font_sm_bold, fill=(37, 99, 235), anchor="mm")

    cx, cy = W//2, 220
    rot = t * 60.0
    for r, w, col in [(140, 3, (49, 91, 255)), (180, 2, (14, 165, 233)), (220, 2, (99, 102, 241))]:
        squish = 0.40 + 0.08 * math.sin(math.radians(rot))
        d.ellipse([(cx - r, cy - int(r*squish)), (cx + r, cy + int(r*squish))], outline=col, width=w)

    d.ellipse([(cx - 45, cy - 45), (cx + 45, cy + 45)], fill=(49, 91, 255), outline=(255, 255, 255), width=3)
    d.text((cx, cy), "FT", font=font_title, fill=(255, 255, 255), anchor="mm")

    d.text((W//2, 410), "Organize Your Semester & Master Every Deadline", font=font_title, fill=(23, 32, 51), anchor="mm")
    d.text((W//2, 465), "Dedicated academic study workspace for Computer Science & Engineering coursework.", font=font_bold, fill=(100, 116, 139), anchor="mm")

    bw, bh = 340, 64
    bx = W//2 - bw//2
    by = 515
    pulse = int(math.sin(t * 6.0) * 2)
    d.rounded_rectangle([(bx - pulse, by - pulse), (bx + bw + pulse, by + bh + pulse)], radius=32, fill=(49, 91, 255), outline=(147, 197, 253), width=2)
    d.text((W//2, by + bh//2), "Launch FastTask Free  ->", font=font_btn, fill=(255, 255, 255), anchor="mm")

    # Bottom colorful course pills
    courses = [
        ("CS 102", (99, 102, 241), (238, 242, 255)),
        ("CS 201", (49, 91, 255), (238, 243, 255)),
        ("CS 202", (168, 85, 247), (250, 245, 255)),
        ("CS 301", (16, 185, 129), (240, 253, 244))
    ]
    pw = 110
    start_x = W//2 - (len(courses) * (pw + 16)) // 2 + pw//2
    for idx, (c, col, bg_col) in enumerate(courses):
        px = start_x + idx * (pw + 16)
        d.rounded_rectangle([(px - pw//2, 620), (px + pw//2, 660)], radius=14, fill=bg_col, outline=col, width=1)
        d.text((px, 640), c, font=font_bold, fill=col, anchor="mm")

    d.text((W//2, 700), "Join 5,000+ CS Scholars in Deep Study Flow • FastTask.app", font=font_sm, fill=(100, 116, 139), anchor="mm")
    return im

def get_frame(f):
    if f < 85:
        return render_stage1(f)
    elif f < 95:
        alpha = (f - 85) / 10.0
        return Image.blend(render_stage1(f), render_stage2(f), alpha)
    elif f < 415:
        return render_stage2(f)
    elif f < 425:
        alpha = (f - 415) / 10.0
        return Image.blend(render_stage2(f), render_stage3(f), alpha)
    elif f < 1150:
        return render_stage3(f)
    elif f < 1160:
        alpha = (f - 1150) / 10.0
        return Image.blend(render_stage3(f), render_stage4(f), alpha)
    else:
        return render_stage4(f)

def main():
    out_video = "public/videos/stage_card_inner.mp4"
    ffmpeg_exe = r"C:\Users\infos\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v9.0.2.exe"

    cmd = [
        ffmpeg_exe,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "18",
        "-preset", "fast",
        "-movflags", "+faststart",
        out_video
    ]

    print(f"Launching FFmpeg encoder -> {out_video}")
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    t0 = time.time()
    for f in range(TOTAL_FRAMES):
        im = get_frame(f)
        raw_bytes = im.tobytes()
        proc.stdin.write(raw_bytes)
        if f % 150 == 0:
            print(f"Rendered frame {f}/{TOTAL_FRAMES} ({(f/TOTAL_FRAMES)*100:.1f}%)")

    proc.stdin.close()
    proc.wait()
    t1 = time.time()
    print(f"Finished rendering {TOTAL_FRAMES} frames into {out_video} in {t1 - t0:.2f}s!")

if __name__ == "__main__":
    main()
