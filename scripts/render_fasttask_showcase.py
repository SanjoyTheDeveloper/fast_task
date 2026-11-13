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

# STAGE 1: Real Bold Color Routine Schedule
def render_stage1(frame_idx):
    im = Image.new("RGB", (W, H), (4, 15, 38))
    d = ImageDraw.Draw(im)
    for y in range(H):
        ratio = y / H
        r = int(4 + 18 * ratio)
        g = int(15 + 40 * ratio)
        b = int(38 + 110 * ratio)
        d.line([(0, y), (W, y)], fill=(r, g, b))
    
    for r in range(250, 0, -10):
        d.ellipse([(W//2 - r*2, -r), (W//2 + r*2, r)], outline=(49, 91, 255), width=2)
        d.ellipse([(W//2 - r*2, H - r), (W//2 + r*2, H + r)], outline=(0, 210, 255), width=2)

    t = frame_idx / FPS
    float_y = int(math.sin(t * 3.0) * 6)

    # Top pill
    d.rounded_rectangle([(W//2 - 215, 35), (W//2 + 215, 75)], radius=20, fill=(10, 30, 75), outline=(0, 210, 255), width=2)
    d.text((W//2, 55), "FASTTASK ACADEMIC OS • SEMESTER 2026", font=font_sm_bold, fill=(147, 197, 253), anchor="mm")

    # Center Card
    cw, ch = 840, 540
    cx1, cy1 = W//2 - cw//2, 105 + float_y

    d.rounded_rectangle([(cx1 - 4, cy1 + 8), (cx1 + cw + 4, cy1 + ch + 16)], radius=28, fill=(2, 8, 20))
    d.rounded_rectangle([(cx1, cy1), (cx1 + cw, cy1 + ch)], radius=26, fill=(255, 255, 255), outline=(49, 91, 255), width=2)

    # Header banner
    d.rounded_rectangle([(cx1, cy1), (cx1 + cw, cy1 + 72)], radius=26, fill=(240, 246, 255))
    d.rectangle([(cx1, cy1 + 45), (cx1 + cw, cy1 + 72)], fill=(240, 246, 255))
    d.line([(cx1, cy1 + 72), (cx1 + cw, cy1 + 72)], fill=(208, 223, 255), width=1)

    d.text((cx1 + 35, cy1 + 25), "Spring 2026 Routine Schedule", font=font_h2, fill=(15, 23, 42))
    d.text((cx1 + 35, cy1 + 50), "Weekly timetable synchronized with faculty labs and lecture halls.", font=font_sm, fill=(100, 116, 139))

    # Active Routine badge
    d.rounded_rectangle([(cx1 + cw - 180, cy1 + 22), (cx1 + cw - 35, cy1 + 54)], radius=16, fill=(16, 185, 129), outline=(52, 211, 153), width=1)
    d.text((cx1 + cw - 108, cy1 + 38), "● Active Routine", font=font_sm_bold, fill=(255, 255, 255), anchor="mm")

    courses = [
        ("09:30 AM", "CS 201: Data Structures & Algorithms", "Lab 402 • Binary Search Trees", (49, 91, 255), (238, 243, 255), "CORE CS"),
        ("11:45 AM", "CS 102: Discrete Mathematics", "Lecture Hall B • Mathematical Induction", (124, 58, 237), (245, 243, 255), "THEORY"),
        ("02:15 PM", "CS 301: Operating Systems & Arch", "Systems Lab 108 • CPU Scheduling Sim", (16, 185, 129), (240, 253, 244), "SYSTEMS"),
        ("04:00 PM", "CSE 211: Digital Logic Systems", "Hardware Lab 3 • K-Map Design", (234, 88, 12), (255, 247, 237), "HARDWARE")
    ]

    for idx, (tm, c_name, room, col, bg_col, cat) in enumerate(courses):
        ry = cy1 + 92 + idx * 105
        d.rounded_rectangle([(cx1 + 30, ry), (cx1 + cw - 30, ry + 88)], radius=18, fill=(255, 255, 255), outline=col, width=2)
        d.rounded_rectangle([(cx1 + 30, ry), (cx1 + 40, ry + 88)], radius=4, fill=col)
        d.rounded_rectangle([(cx1 + 55, ry + 18), (cx1 + 185, ry + 70)], radius=14, fill=col)
        d.text((cx1 + 120, ry + 44), tm, font=font_bold, fill=(255, 255, 255), anchor="mm")
        d.text((cx1 + 205, ry + 22), c_name, font=font_bold, fill=(15, 23, 42))
        d.text((cx1 + 205, ry + 52), room, font=font_sm, fill=(71, 85, 105))
        d.rounded_rectangle([(cx1 + cw - 150, ry + 28), (cx1 + cw - 50, ry + 60)], radius=10, fill=bg_col, outline=col, width=1)
        d.text((cx1 + cw - 100, ry + 44), cat, font=font_sm_bold, fill=col, anchor="mm")

    tags = [
        (130, 260 + int(math.sin(t*2.5)*12), "CS 102", (124, 58, 237), (245, 243, 255)),
        (1270, 240 + int(math.cos(t*2.8)*12), "CS 201", (49, 91, 255), (238, 243, 255)),
        (140, 520 + int(math.cos(t*2.2)*12), "CS 301", (16, 185, 129), (240, 253, 244)),
        (1260, 500 + int(math.sin(t*3.0)*12), "CSE 211", (234, 88, 12), (255, 247, 237))
    ]
    for x, y, tag, col, fill_col in tags:
        d.rounded_rectangle([(x-70, y-26), (x+70, y+26)], radius=20, fill=col)
        d.text((x, y), tag, font=font_bold, fill=(255, 255, 255), anchor="mm")
    return im

# STAGE 2: Real Bold Tactical Radar Screen
def render_stage2(frame_idx):
    im = Image.new("RGB", (W, H), (3, 12, 32))
    d = ImageDraw.Draw(im)
    for y in range(H):
        ratio = y / H
        d.line([(0, y), (W, y)], fill=(int(3 + 8*ratio), int(12 + 25*ratio), int(32 + 65*ratio)))

    t = (frame_idx - 90) / FPS

    d.rounded_rectangle([(W//2 - 215, 35), (W//2 + 215, 75)], radius=20, fill=(12, 35, 80), outline=(239, 68, 68), width=2)
    d.text((W//2, 55), "STAGE 02 • DEADLINE VELOCITY RADAR", font=font_sm_bold, fill=(254, 202, 202), anchor="mm")

    d.text((W//2, 115), "Eliminate Coursework Panic & Lost Submissions", font=font_title, fill=(255, 255, 255), anchor="mm")
    d.text((W//2, 155), "Automated priority tracking for assignments, lab reports, and midterm countdowns.", font=font_sm, fill=(147, 197, 253), anchor="mm")

    rx, ry = 400, 460
    for r in [60, 120, 180, 240]:
        d.ellipse([(rx - r, ry - r), (rx + r, ry + r)], outline=(30, 64, 130), width=2)
    d.line([(rx - 250, ry), (rx + 250, ry)], fill=(30, 64, 130), width=1)
    d.line([(rx, ry - 250), (rx, ry + 250)], fill=(30, 64, 130), width=1)

    sweep_angle = int((t * 120.0) % 360)
    d.pieslice([(rx - 238, ry - 238), (rx + 238, ry + 238)], start=sweep_angle - 45, end=sweep_angle, fill=(20, 70, 160))
    d.ellipse([(rx - 12, ry - 12), (rx + 12, ry + 12)], fill=(0, 210, 255))

    pings = [
        (rx + 90, ry - 110, "CS 201", (239, 68, 68)),
        (rx - 120, ry - 70, "CS 301", (49, 91, 255)),
        (rx + 110, ry + 80, "CS 102", (16, 185, 129))
    ]
    for px, py, label, col in pings:
        ping_pulse = int(abs(math.sin(t * 4.0 + px)) * 6)
        d.ellipse([(px - 16 - ping_pulse, py - 16 - ping_pulse), (px + 16 + ping_pulse, py + 16 + ping_pulse)], outline=col, width=2)
        d.ellipse([(px - 9, py - 9), (px + 9, py + 9)], fill=col)
        d.rounded_rectangle([(px + 15, py - 16), (px + 95, py + 16)], radius=12, fill=col)
        d.text((px + 55, py), label, font=font_sm_bold, fill=(255, 255, 255), anchor="mm")

    cx = 730
    cards = [
        ("CRITICAL DUE DATE • 14 HOURS LEFT", "CS 201: Binary Search Tree Lab Report", "Due: Tonight 11:59 PM • 40% Grade Weight", (239, 68, 68), (254, 242, 242)),
        ("UPCOMING MIDTERM EXAM • 3 DAYS", "CS 301: CPU Scheduling & Memory Mgmt", "Exam: Thursday 09:00 AM • Main Hall", (49, 91, 255), (238, 243, 255)),
        ("AUTO-SCHEDULED TO POMODORO", "CS 102: Mathematical Induction Proof Set", "2 Focus Blocks Reserved Today • FastTask Flow", (16, 185, 129), (240, 253, 244))
    ]
    for idx, (badge, title, subtitle, col, bg) in enumerate(cards):
        cy = 225 + idx * 155
        d.rounded_rectangle([(cx, cy), (cx + 610, cy + 135)], radius=22, fill=(255, 255, 255), outline=col, width=2)
        d.rounded_rectangle([(cx, cy), (cx + 12, cy + 135)], radius=6, fill=col)
        d.rounded_rectangle([(cx + 30, cy + 18), (cx + 380, cy + 48)], radius=12, fill=col)
        d.text((cx + 205, cy + 33), badge, font=font_sm_bold, fill=(255, 255, 255), anchor="mm")
        d.text((cx + 30, cy + 68), title, font=font_bold, fill=(15, 23, 42))
        d.text((cx + 30, cy + 100), subtitle, font=font_sm, fill=(71, 85, 105))
    return im

# STAGE 3: Real Bold Color Pomodoro & Kanban Flow
def render_stage3(frame_idx):
    im = Image.new("RGB", (W, H), (6, 16, 40))
    if desk_img:
        im.paste(desk_img, (0, 0))
        d = ImageDraw.Draw(im)
        d.line([(520, 0), (520, H)], fill=(49, 91, 255), width=3)
        d.rounded_rectangle([(25, 25), (290, 68)], radius=18, fill=(15, 23, 42), outline=(0, 210, 255), width=2)
        d.text((45, 38), "CS Workspace • Focus Sprint", font=font_sm_bold, fill=(255, 255, 255))
    else:
        d = ImageDraw.Draw(im)

    t = (frame_idx - 420) / FPS
    rx = 560

    d.rounded_rectangle([(rx, 30), (rx + 340, 72)], radius=20, fill=(10, 30, 75), outline=(0, 210, 255), width=2)
    d.text((rx + 25, 43), "STAGE 03 • POMODORO FOCUS & KANBAN", font=font_sm_bold, fill=(147, 197, 253))

    # Pomodoro Focus Card (White with Royal Blue border)
    py1 = 90
    d.rounded_rectangle([(rx, py1), (W - 35, py1 + 275)], radius=24, fill=(255, 255, 255), outline=(49, 91, 255), width=2)
    d.rounded_rectangle([(rx, py1), (W - 35, py1 + 8)], radius=4, fill=(49, 91, 255))

    cx, cy = rx + 140, py1 + 138
    pr = 88
    d.ellipse([(cx - pr, cy - pr), (cx + pr, cy + pr)], outline=(226, 232, 240), width=10)

    elapsed_secs = int(t * 1.5)
    cur_secs = max(0, 1500 - elapsed_secs)
    mins = cur_secs // 60
    secs = cur_secs % 60
    timer_str = f"{mins:02d}:{secs:02d}"

    timer_ratio = cur_secs / 1500.0
    end_deg = -90 + int((1.0 - timer_ratio) * 360)
    d.arc([(cx - pr, cy - pr), (cx + pr, cy + pr)], start=-90, end=max(-85, end_deg), fill=(49, 91, 255), width=10)
    d.text((cx, cy - 10), timer_str, font=font_timer, fill=(15, 23, 42), anchor="mm")
    d.text((cx, cy + 35), "FOCUS INTERVAL", font=font_sm_bold, fill=(49, 91, 255), anchor="mm")

    tx = cx + 130
    d.rounded_rectangle([(tx, py1 + 35), (tx + 210, py1 + 70)], radius=15, fill=(16, 185, 129), outline=(52, 211, 153), width=1)
    d.text((tx + 105, py1 + 52), "● 25m Focus Block Active", font=font_sm_bold, fill=(255, 255, 255), anchor="mm")

    d.text((tx, py1 + 95), "CS 201: Binary Trees & AVL", font=font_h2, fill=(15, 23, 42))
    d.text((tx, py1 + 138), "Task: Implement recursive balance factor and rotations.", font=font_sm, fill=(71, 85, 105))
    d.text((tx, py1 + 172), "Cycle: Block 2 of 4  |  Streak: 7 Days  |  Score: 94%", font=font_sm_bold, fill=(49, 91, 255))

    # Kanban Columns with Solid Color Headers
    ky = 385
    kw = (W - 35 - rx - 20) // 2

    # Column 1: In Progress (Solid Royal Blue Header)
    d.rounded_rectangle([(rx, ky), (rx + kw, H - 35)], radius=20, fill=(255, 255, 255), outline=(49, 91, 255), width=2)
    d.rounded_rectangle([(rx, ky), (rx + kw, ky + 48)], radius=20, fill=(49, 91, 255))
    d.rectangle([(rx, ky + 25), (rx + kw, ky + 48)], fill=(49, 91, 255))
    d.text((rx + 25, ky + 14), "In Progress (2 Tasks)", font=font_bold, fill=(255, 255, 255))

    t1y = ky + 62
    d.rounded_rectangle([(rx + 15, t1y), (rx + kw - 15, t1y + 115)], radius=14, fill=(240, 246, 255), outline=(49, 91, 255), width=1)
    d.rounded_rectangle([(rx + 25, t1y + 14), (rx + 110, t1y + 38)], radius=8, fill=(49, 91, 255))
    d.text((rx + 67, t1y + 26), "CS 201", font=font_sm_bold, fill=(255, 255, 255), anchor="mm")
    d.text((rx + 25, t1y + 54), "Implement AVL Tree in C++", font=font_bold, fill=(15, 23, 42))

    prog_pct = min(0.95, 0.40 + t * 0.02)
    d.rounded_rectangle([(rx + 25, t1y + 88), (rx + kw - 25, t1y + 100)], radius=6, fill=(219, 234, 254))
    d.rounded_rectangle([(rx + 25, t1y + 88), (rx + int((kw - 50) * prog_pct), t1y + 100)], radius=6, fill=(49, 91, 255))

    # Column 2: Completed Today (Solid Emerald Header)
    k2x = rx + kw + 20
    d.rounded_rectangle([(k2x, ky), (k2x + kw, H - 35)], radius=20, fill=(255, 255, 255), outline=(16, 185, 129), width=2)
    d.rounded_rectangle([(k2x, ky), (k2x + kw, ky + 48)], radius=20, fill=(16, 185, 129))
    d.rectangle([(k2x, ky + 25), (k2x + kw, ky + 48)], fill=(16, 185, 129))
    d.text((k2x + 25, ky + 14), "Completed Today (5 Tasks)", font=font_bold, fill=(255, 255, 255))

    c1y = ky + 62
    d.rounded_rectangle([(k2x + 15, c1y), (k2x + kw - 15, c1y + 62)], radius=12, fill=(240, 253, 244), outline=(16, 185, 129), width=1)
    d.rounded_rectangle([(k2x + 25, c1y + 14), (k2x + 85, c1y + 38)], radius=8, fill=(16, 185, 129))
    d.text((k2x + 55, c1y + 26), "DONE", font=font_sm_bold, fill=(255, 255, 255), anchor="mm")
    d.text((k2x + 100, c1y + 14), "CS 102 Induction Proofs Set", font=font_bold, fill=(15, 23, 42))
    d.text((k2x + 100, c1y + 36), "Finished in 2 Focus Blocks (50m)", font=font_sm, fill=(71, 85, 105))

    c2y = ky + 138
    d.rounded_rectangle([(k2x + 15, c2y), (k2x + kw - 15, c2y + 62)], radius=12, fill=(240, 253, 244), outline=(16, 185, 129), width=1)
    d.rounded_rectangle([(k2x + 25, c2y + 14), (k2x + 85, c2y + 38)], radius=8, fill=(16, 185, 129))
    d.text((k2x + 55, c2y + 26), "DONE", font=font_sm_bold, fill=(255, 255, 255), anchor="mm")
    d.text((k2x + 100, c2y + 14), "CS 301 CPU Scheduling Sim", font=font_bold, fill=(15, 23, 42))
    d.text((k2x + 100, c2y + 36), "Finished in 3 Focus Blocks (75m)", font=font_sm, fill=(71, 85, 105))
    return im

# STAGE 4: Real Bold Semester Mastery Call to Action
def render_stage4(frame_idx):
    im = Image.new("RGB", (W, H), (4, 14, 36))
    d = ImageDraw.Draw(im)
    for y in range(H):
        ratio = y / H
        d.line([(0, y), (W, y)], fill=(int(4 + 20*ratio), int(14 + 45*ratio), int(36 + 120*ratio)))

    t = (frame_idx - 1155) / FPS

    # Top pill
    d.rounded_rectangle([(W//2 - 215, 35), (W//2 + 215, 75)], radius=20, fill=(10, 30, 75), outline=(0, 210, 255), width=2)
    d.text((W//2, 55), "STAGE 04 • CONTINUOUS ACADEMIC MASTERY", font=font_sm_bold, fill=(147, 197, 253), anchor="mm")

    cx, cy = W//2, 220
    rot = t * 60.0
    for r, w, col in [(140, 3, (49, 91, 255)), (180, 3, (0, 210, 255)), (220, 3, (124, 58, 237))]:
        squish = 0.40 + 0.08 * math.sin(math.radians(rot))
        d.ellipse([(cx - r, cy - int(r*squish)), (cx + r, cy + int(r*squish))], outline=col, width=w)

    d.ellipse([(cx - 50, cy - 50), (cx + 50, cy + 50)], fill=(49, 91, 255), outline=(255, 255, 255), width=3)
    d.text((cx, cy), "FT", font=font_title, fill=(255, 255, 255), anchor="mm")

    d.text((W//2, 405), "Organize Your Semester & Master Every Deadline", font=font_title, fill=(255, 255, 255), anchor="mm")
    d.text((W//2, 455), "Dedicated academic study workspace for Computer Science & Engineering coursework.", font=font_bold, fill=(191, 219, 254), anchor="mm")

    bw, bh = 360, 68
    bx = W//2 - bw//2
    by = 505
    pulse = int(math.sin(t * 6.0) * 3)
    d.rounded_rectangle([(bx - pulse, by - pulse), (bx + bw + pulse, by + bh + pulse)], radius=34, fill=(49, 91, 255), outline=(255, 255, 255), width=2)
    d.text((W//2, by + bh//2), "Launch FastTask Free  ->", font=font_btn, fill=(255, 255, 255), anchor="mm")

    courses = [
        ("CS 102", (124, 58, 237)),
        ("CS 201", (49, 91, 255)),
        ("CS 202", (234, 88, 12)),
        ("CS 301", (16, 185, 129))
    ]
    pw = 120
    start_x = W//2 - (len(courses) * (pw + 18)) // 2 + pw//2
    for idx, (c, col) in enumerate(courses):
        px = start_x + idx * (pw + 18)
        d.rounded_rectangle([(px - pw//2, 610), (px + pw//2, 656)], radius=16, fill=col)
        d.text((px, 633), c, font=font_bold, fill=(255, 255, 255), anchor="mm")

    d.text((W//2, 700), "Join 5,000+ CS Scholars in Deep Study Flow • FastTask.app", font=font_sm, fill=(147, 197, 253), anchor="mm")
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
