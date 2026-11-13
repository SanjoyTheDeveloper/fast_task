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
font_title = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 42)
font_h2 = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 26)
font_bold = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 19)
font_sm = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 14)
font_sm_bold = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 14)
font_timer = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 50)
font_btn = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 22)

# Pre-load desk image
desk_img = None
desk_path = "public/images/cs-study-light-notes.jpg"
if os.path.exists(desk_path):
    d_raw = Image.open(desk_path).convert("RGB")
    dw, dh = d_raw.size
    target_ratio = 560 / H
    if dw / dh > target_ratio:
        nw = int(dh * target_ratio)
        d_raw = d_raw.crop(((dw - nw)//2, 0, (dw + nw)//2, dh))
    else:
        nh = int(dw / target_ratio)
        d_raw = d_raw.crop((0, (dh - nh)//2, dw, (dh + nh)//2))
    desk_img = d_raw.resize((560, H), Image.Resampling.LANCZOS)

# Pre-render static backgrounds for speed
# Stage 1 background (Deep obsidian violet)
bg_stage1 = Image.new("RGB", (W, H), (6, 3, 18))
d = ImageDraw.Draw(bg_stage1)
for y in range(H):
    ratio = y / H
    d.line([(0, y), (W, y)], fill=(int(6 + 28 * ratio), int(3 + 14 * ratio), int(18 + 70 * ratio)))
# Ambient light particles
np.random.seed(42)
for _ in range(80):
    px, py = int(np.random.randint(20, W-20)), int(np.random.randint(20, H-20))
    pr = int(np.random.randint(1, 3))
    p_alpha = int(np.random.randint(60, 160))
    d.ellipse([(px-pr, py-pr), (px+pr, py+pr)], fill=(p_alpha, p_alpha//2, 255))

# Stage 2 background (Clean lavender aurora)
bg_stage2 = Image.new("RGB", (W, H), (250, 250, 255))
d = ImageDraw.Draw(bg_stage2)
for y in range(H//2, H):
    pct = (y - H//2) / (H//2)
    d.line([(0, y), (W, y)], fill=(int(250 - 32 * pct), int(250 - 64 * pct), int(255 - 12 * pct)))

# Stage 3 background (Split desk + dark dashboard)
bg_stage3 = Image.new("RGB", (W, H), (15, 23, 42))
if desk_img:
    bg_stage3.paste(desk_img, (0, 0))
d = ImageDraw.Draw(bg_stage3)
for x in range(480, 560):
    a = (x - 480) / 80.0
    d.line([(x, 0), (x, H)], fill=(int(15 * a), int(23 * a), int(42 * a)))
d.rounded_rectangle([(30, 30), (320, 70)], radius=20, fill=(0, 0, 0, 160), outline=(255, 255, 255, 60), width=1)
d.text((45, 42), "CS Workspace • Daylight Flow", font=font_sm_bold, fill=(255, 255, 255))

# Stage 4 background (Deep twilight orbital horizon)
bg_stage4 = Image.new("RGB", (W, H), (8, 4, 22))
d = ImageDraw.Draw(bg_stage4)
for y in range(H):
    ratio = y / H
    s = math.sin(ratio * math.pi)
    d.line([(0, y), (W, y)], fill=(int(8 + 65 * s), int(4 + 32 * s), int(22 + 95 * s)))
np.random.seed(101)
for _ in range(70):
    px, py = int(np.random.randint(20, W-20)), int(np.random.randint(20, H-20))
    pr = int(np.random.randint(1, 3))
    p_alpha = int(np.random.randint(50, 180))
    d.ellipse([(px-pr, py-pr), (px+pr, py+pr)], fill=(p_alpha, p_alpha, 255))

def render_stage1(frame_idx):
    im = bg_stage1.copy()
    d = ImageDraw.Draw(im)
    t = frame_idx / FPS
    float_y = int(math.sin(t * 3.0) * 8)
    
    d.rounded_rectangle([(W//2 - 220, 45), (W//2 + 220, 85)], radius=20, fill=(35, 20, 65), outline=(130, 80, 220), width=1)
    d.text((W//2, 65), "FASTTASK ACADEMIC OS • SEMESTER 2026", font=font_sm_bold, fill=(230, 210, 255), anchor="mm")
    
    cw, ch = 800, 520
    cx1, cy1 = W//2 - cw//2, 130 + float_y
    d.rounded_rectangle([(cx1, cy1), (cx1 + cw, cy1 + ch)], radius=32, fill=(15, 10, 32), outline=(100, 60, 180), width=2)
    
    d.text((cx1 + 45, cy1 + 45), "Spring 2026 Routine Schedule", font=font_h2, fill=(255, 255, 255))
    pulse = 180 + int(70 * math.sin(t * 6.0))
    d.rounded_rectangle([(cx1 + cw - 200, cy1 + 35), (cx1 + cw - 40, cy1 + 75)], radius=18, fill=(16, pulse, 129, 40), outline=(16, pulse, 129), width=1)
    d.text((cx1 + cw - 120, cy1 + 55), "● Active Routine", font=font_sm_bold, fill=(52, 211, 153), anchor="mm")
    
    courses = [
        ("09:30 AM", "CS 201: Data Structures & Algorithms", "Lab 402 • Binary Search Trees", (49, 91, 255)),
        ("11:45 AM", "CS 102: Discrete Mathematics", "Lecture Hall B • Graph Induction", (139, 92, 246)),
        ("02:15 PM", "CS 301: Operating Systems & Arch", "Lab 108 • CPU Scheduling Sim", (16, 185, 129)),
        ("04:00 PM", "CSE 211: Digital Logic Systems", "Systems Lab 3 • K-Map Design", (245, 158, 11))
    ]
    for idx, (tm, c_name, room, col) in enumerate(courses):
        ry = cy1 + 115 + idx * 88
        d.rounded_rectangle([(cx1 + 40, ry), (cx1 + cw - 40, ry + 72)], radius=18, fill=(25, 18, 50), outline=(col[0]//2, col[1]//2, col[2]//2), width=1)
        d.rounded_rectangle([(cx1 + 55, ry + 12), (cx1 + 185, ry + 60)], radius=12, fill=col)
        d.text((cx1 + 120, ry + 36), tm, font=font_bold, fill=(255, 255, 255), anchor="mm")
        d.text((cx1 + 205, ry + 22), c_name, font=font_bold, fill=(255, 255, 255))
        d.text((cx1 + 205, ry + 46), room, font=font_sm, fill=(200, 190, 225))
        
    tags = [
        (140, 260 + int(math.sin(t*2.5)*12), "CS 102", (139, 92, 246)),
        (1250, 240 + int(math.cos(t*2.8)*12), "CS 201", (49, 91, 255)),
        (150, 520 + int(math.cos(t*2.2)*12), "CS 301", (16, 185, 129)),
        (1240, 500 + int(math.sin(t*3.0)*12), "CSE 211", (245, 158, 11))
    ]
    for x, y, tag, col in tags:
        d.rounded_rectangle([(x-70, y-25), (x+70, y+25)], radius=20, fill=(20, 15, 45), outline=col, width=2)
        d.text((x, y), tag, font=font_bold, fill=(255, 255, 255), anchor="mm")
    return im

def render_stage2(frame_idx):
    im = bg_stage2.copy()
    d = ImageDraw.Draw(im)
    t = (frame_idx - 90) / FPS
    
    d.rounded_rectangle([(W//2 - 210, 40), (W//2 + 210, 80)], radius=20, fill=(240, 235, 255), outline=(160, 120, 240), width=1)
    d.text((W//2, 60), "STAGE 02 • DEADLINE VELOCITY RADAR", font=font_sm_bold, fill=(109, 40, 217), anchor="mm")
    
    d.text((W//2, 135), "Eliminate Coursework Panic & Lost Submissions", font=font_title, fill=(15, 23, 42), anchor="mm")
    d.text((W//2, 185), "Automated priority tracking for assignments, lab reports, and midterm countdowns.", font=font_bold, fill=(100, 116, 139), anchor="mm")
    
    rx, ry = 420, 470
    for r in [60, 120, 180, 240]:
        d.ellipse([(rx - r, ry - r), (rx + r, ry + r)], outline=(196, 181, 253), width=1)
    d.line([(rx - 250, ry), (rx + 250, ry)], fill=(221, 214, 254), width=1)
    d.line([(rx, ry - 250), (rx, ry + 250)], fill=(221, 214, 254), width=1)
    
    sweep_angle = int((t * 120.0) % 360)
    d.pieslice([(rx - 238, ry - 238), (rx + 238, ry + 238)], start=sweep_angle - 45, end=sweep_angle, fill=(237, 233, 254))
    d.ellipse([(rx - 10, ry - 10), (rx + 10, ry + 10)], fill=(124, 58, 237))
    
    pings = [
        (rx + 90, ry - 110, "CS 201", (239, 68, 68)),
        (rx - 120, ry - 70, "CS 301", (245, 158, 11)),
        (rx + 110, ry + 80, "CS 102", (16, 185, 129))
    ]
    for px, py, label, col in pings:
        ping_pulse = int(abs(math.sin(t * 4.0 + px)) * 4)
        d.ellipse([(px - 8 - ping_pulse, py - 8 - ping_pulse), (px + 8 + ping_pulse, py + 8 + ping_pulse)], fill=col)
        d.rounded_rectangle([(px + 12, py - 14), (px + 85, py + 14)], radius=10, fill=col)
        d.text((px + 48, py), label, font=font_sm_bold, fill=(255, 255, 255), anchor="mm")
        
    cx = 760
    cards = [
        ("CRITICAL DUE DATE • 14 HOURS LEFT", "CS 201: Binary Search Tree Lab Report", "Due: Tonight 11:59 PM • 40% Grade Weight", (239, 68, 68), (254, 242, 242)),
        ("UPCOMING MIDTERM EXAM • 3 DAYS", "CS 301: CPU Scheduling & Memory Mgmt", "Exam: Thursday 09:00 AM • Main Hall", (245, 158, 11), (255, 251, 235)),
        ("AUTO-SCHEDULED TO POMODORO", "CS 102: Mathematical Induction Proof Set", "2 Focus Blocks Reserved Today • FastTask Flow", (16, 185, 129), (240, 253, 244))
    ]
    for idx, (badge, title, subtitle, col, bg) in enumerate(cards):
        cy = 265 + idx * 135
        d.rounded_rectangle([(cx, cy), (cx + 560, cy + 115)], radius=20, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
        d.rounded_rectangle([(cx, cy), (cx + 8, cy + 115)], radius=4, fill=col)
        d.rounded_rectangle([(cx + 25, cy + 16), (cx + 340, cy + 42)], radius=12, fill=bg, outline=col, width=1)
        d.text((cx + 38, cy + 29), badge, font=font_sm_bold, fill=col, anchor="lm")
        d.text((cx + 25, cy + 56), title, font=font_bold, fill=(15, 23, 42))
        d.text((cx + 25, cy + 85), subtitle, font=font_sm, fill=(100, 116, 139))
    return im

def render_stage3(frame_idx):
    im = bg_stage3.copy()
    d = ImageDraw.Draw(im)
    t = (frame_idx - 420) / FPS
    
    rx = 590
    d.rounded_rectangle([(rx, 35), (rx + 330, 75)], radius=20, fill=(30, 41, 59), outline=(99, 102, 241), width=1)
    d.text((rx + 15, 47), "STAGE 03 • POMODORO FOCUS & KANBAN", font=font_sm_bold, fill=(165, 180, 252))
    
    py1 = 95
    d.rounded_rectangle([(rx, py1), (W - 40, py1 + 270)], radius=28, fill=(30, 41, 59), outline=(51, 65, 85), width=2)
    
    cx, cy = rx + 140, py1 + 135
    pr = 85
    d.ellipse([(cx - pr, cy - pr), (cx + pr, cy + pr)], outline=(51, 65, 85), width=8)
    
    elapsed_secs = int(t * 1.5)
    cur_secs = max(0, 1500 - elapsed_secs)
    mins = cur_secs // 60
    secs = cur_secs % 60
    timer_str = f"{mins:02d}:{secs:02d}"
    
    timer_ratio = cur_secs / 1500.0
    end_deg = -90 + int((1.0 - timer_ratio) * 360)
    d.arc([(cx - pr, cy - pr), (cx + pr, cy + pr)], start=-90, end=max(-85, end_deg), fill=(49, 91, 255), width=8)
    d.text((cx, cy - 10), timer_str, font=font_timer, fill=(255, 255, 255), anchor="mm")
    d.text((cx, cy + 35), "FOCUS INTERVAL", font=font_sm_bold, fill=(148, 163, 184), anchor="mm")
    
    tx = cx + 130
    d.rounded_rectangle([(tx, py1 + 35), (tx + 170, py1 + 65)], radius=15, fill=(16, 185, 129, 30), outline=(16, 185, 129), width=1)
    d.text((tx + 85, py1 + 50), "● 25m Focus Block Active", font=font_sm_bold, fill=(52, 211, 153), anchor="mm")
    
    # Title adjusted to fit without clipping
    d.text((tx, py1 + 90), "CS 201: Binary Trees & AVL", font=font_h2, fill=(255, 255, 255))
    d.text((tx, py1 + 135), "Task: Implement recursive balance factor and tree rotations.", font=font_sm, fill=(203, 213, 225))
    d.text((tx, py1 + 170), "Cycle: Block 2 of 4  |  Streak: 7 Days  |  Daily Score: 94%", font=font_sm_bold, fill=(165, 180, 252))
    
    ky = 390
    kw = (W - 40 - rx - 20) // 2
    
    d.rounded_rectangle([(rx, ky), (rx + kw, H - 40)], radius=20, fill=(24, 32, 47), outline=(51, 65, 85), width=1)
    d.text((rx + 20, ky + 18), "In Progress (2 Tasks)", font=font_bold, fill=(96, 165, 250))
    
    t1y = ky + 55
    d.rounded_rectangle([(rx + 15, t1y), (rx + kw - 15, t1y + 110)], radius=14, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
    d.rounded_rectangle([(rx + 25, t1y + 12), (rx + 110, t1y + 36)], radius=8, fill=(49, 91, 255, 40), outline=(49, 91, 255), width=1)
    d.text((rx + 67, t1y + 24), "CS 201", font=font_sm_bold, fill=(147, 197, 253), anchor="mm")
    d.text((rx + 25, t1y + 48), "Implement AVL Tree in C++", font=font_bold, fill=(255, 255, 255))
    
    prog_pct = min(0.95, 0.40 + t * 0.02)
    d.rounded_rectangle([(rx + 25, t1y + 82), (rx + kw - 25, t1y + 92)], radius=5, fill=(51, 65, 85))
    d.rounded_rectangle([(rx + 25, t1y + 82), (rx + int((kw - 50) * prog_pct), t1y + 92)], radius=5, fill=(49, 91, 255))
    
    k2x = rx + kw + 20
    d.rounded_rectangle([(k2x, ky), (k2x + kw, H - 40)], radius=20, fill=(24, 32, 47), outline=(51, 65, 85), width=1)
    d.text((k2x + 20, ky + 18), "Completed Today (5 Tasks)", font=font_bold, fill=(52, 211, 153))
    
    # Task 1 with clean DONE pill badge
    c1y = ky + 55
    d.rounded_rectangle([(k2x + 15, c1y), (k2x + kw - 15, c1y + 55)], radius=12, fill=(30, 41, 59))
    d.rounded_rectangle([(k2x + 25, c1y + 12), (k2x + 75, c1y + 32)], radius=6, fill=(16, 185, 129))
    d.text((k2x + 50, c1y + 22), "DONE", font=font_sm_bold, fill=(255, 255, 255), anchor="mm")
    d.text((k2x + 85, c1y + 13), "CS 102 Induction Proofs Set", font=font_bold, fill=(203, 213, 225))
    d.text((k2x + 85, c1y + 33), "Finished in 2 Focus Blocks (50m)", font=font_sm, fill=(148, 163, 184))
    
    # Task 2 with clean DONE pill badge
    c2y = ky + 125
    d.rounded_rectangle([(k2x + 15, c2y), (k2x + kw - 15, c2y + 55)], radius=12, fill=(30, 41, 59))
    d.rounded_rectangle([(k2x + 25, c2y + 12), (k2x + 75, c2y + 32)], radius=6, fill=(16, 185, 129))
    d.text((k2x + 50, c2y + 22), "DONE", font=font_sm_bold, fill=(255, 255, 255), anchor="mm")
    d.text((k2x + 85, c2y + 13), "CS 301 CPU Scheduling Sim", font=font_bold, fill=(203, 213, 225))
    d.text((k2x + 85, c2y + 33), "Finished in 3 Focus Blocks (75m)", font=font_sm, fill=(148, 163, 184))
    return im

def render_stage4(frame_idx):
    im = bg_stage4.copy()
    d = ImageDraw.Draw(im)
    t = (frame_idx - 1155) / FPS
    
    cx, cy = W//2, 230
    rot = t * 60.0
    for r, w, col in [(140, 2, (168, 85, 247)), (180, 1, (99, 102, 241)), (220, 2, (217, 70, 239))]:
        squish = 0.40 + 0.08 * math.sin(math.radians(rot))
        d.ellipse([(cx - r, cy - int(r*squish)), (cx + r, cy + int(r*squish))], outline=col, width=w)
        
    d.ellipse([(cx - 45, cy - 45), (cx + 45, cy + 45)], fill=(49, 91, 255), outline=(255, 255, 255), width=2)
    d.text((cx, cy), "FT", font=font_title, fill=(255, 255, 255), anchor="mm")
    
    d.text((W//2, 430), "Organize Your Semester & Master Every Deadline", font=font_title, fill=(255, 255, 255), anchor="mm")
    d.text((W//2, 490), "Dedicated academic study workspace for Computer Science & Engineering coursework.", font=font_bold, fill=(203, 213, 225), anchor="mm")
    
    bw, bh = 360, 68
    bx = W//2 - bw//2
    by = 540
    pulse = int(math.sin(t * 6.0) * 3)
    d.rounded_rectangle([(bx - pulse, by - pulse), (bx + bw + pulse, by + bh + pulse)], radius=34 + pulse, fill=(49, 91, 255), outline=(147, 197, 253), width=2)
    d.text((W//2, by + bh//2), "Launch FastTask Free  ->", font=font_btn, fill=(255, 255, 255), anchor="mm")
    
    d.text((W//2, 650), "• CS 102 Discrete Math • CS 201 Data Structures • CS 202 Org • CS 301 OS •", font=font_sm_bold, fill=(165, 180, 252), anchor="mm")
    d.text((W//2, 685), "Join 5,000+ CS Scholars in Deep Study Flow • FastTask.app", font=font_sm, fill=(148, 163, 184), anchor="mm")
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
