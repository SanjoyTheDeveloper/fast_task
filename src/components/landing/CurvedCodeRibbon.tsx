"use client";

import React, { useEffect, useRef } from "react";

export interface CurvedCodeRibbonProps {
  className?: string;
  opacity?: number;
}

export function CurvedCodeRibbon({
  className = "",
  opacity = 0.85,
}: CurvedCodeRibbonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / width - 0.5;
      mouseRef.current.targetY = (e.clientY - rect.top) / height - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Code lines mimicking the dense programming layer in the reference image
    const rawCodeSnippets = [
      "import { AcademicTrajectory, RoutineSync } from '@fasttask/core';",
      "const gravitationalLensing = new EventHorizon({ warpFactor: 1.414 });",
      "async function syncSemesterTimetable(userId: string): Promise<Schedule[]> {",
      "  const sessions = await db.routineSchedule.findMany({ where: { active: true } });",
      "  return sessions.map(s => computeOrbitalFocus(s.startTime, s.venue));",
      "}",
      "class QuantumStudyTimer extends StudyEmitter {",
      "  private interval: number = 25 * 60;",
      "  public startDeepFocus(): Observable<FocusState> {",
      "    return this.pipeline.pipe(throttleTime(1000));",
      "  }",
      "}",
      "export const calculateGradeVelocity = (tasks: Task[]): number => {",
      "  return tasks.filter(t => t.completed).length / Math.max(1, tasks.length);",
      "};",
      "// Symbols add up to programs, and programs add up to innovations.",
      "const eventHorizon = { radius: 68, accretionTemp: 4500 };",
      "while (student.isEnrolled) {",
      "  await knowledgeBase.synthesize(lectureNotes, pdfSlides);",
      "  render3DInteractivePipeline(ctx, { perspective: 'CurvedHorizon' });",
      "}",
      "const kanban = await db.task.create({ data: assignment });",
      "const status = isDueTomorrow ? 'URGENT_RADAR' : 'SYNCED';",
      "// Your code is your future. Programmers create visual reality.",
      "function vortexAccretion(alpha: number, distance: number) {",
      "  return Math.pow(distance / eventHorizon.radius, -1.8) * Math.sin(alpha);",
      "}",
      "export default function AcademicPipeline() { return <FastTaskEngine />; }",
      "const nextSession = routine.filter(r => r.dayOfWeek === currentDay)[0];",
    ];

    // Background floating stars / quantum particles
    const stars = Array.from({ length: 45 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2 + 0.5,
      twinkleSpeed: Math.random() * 2 + 1,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    let t = 0;

    const render = () => {
      t += 0.007;

      // Smooth mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Vortex / Black Hole focal position (center-left area)
      const vortexX = width * 0.28 + mouseRef.current.x * 25;
      const vortexY = height * 0.58 + mouseRef.current.y * 25;
      const vortexR = Math.min(width, height) * 0.09;

      // 1. Draw subtle cosmic nebula backdrop & background stars
      ctx.save();
      const nebula = ctx.createRadialGradient(
        width * 0.65,
        height * 0.45,
        40,
        width * 0.6,
        height * 0.5,
        width * 0.65
      );
      nebula.addColorStop(0, "rgba(15, 23, 42, 0.55)"); // deep slate/space
      nebula.addColorStop(0.5, "rgba(30, 27, 75, 0.25)"); // subtle indigo glow
      nebula.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      for (const star of stars) {
        const sx = star.x * width;
        const sy = star.y * height;
        const currentAlpha =
          star.alpha * (0.6 + 0.4 * Math.sin(t * star.twinkleSpeed));
        ctx.fillStyle = `rgba(226, 232, 240, ${currentAlpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 2. Draw 4-point Lens Flare Star (inspired by the bright star in reference top-left)
      ctx.save();
      const flareX = width * 0.12;
      const flareY = height * 0.16;
      const flareAlpha = 0.55 + 0.15 * Math.sin(t * 1.5);

      // Star cross spikes
      const spikeGradH = ctx.createLinearGradient(flareX - 35, flareY, flareX + 35, flareY);
      spikeGradH.addColorStop(0, "rgba(255,255,255,0)");
      spikeGradH.addColorStop(0.5, `rgba(255,255,255,${flareAlpha})`);
      spikeGradH.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = spikeGradH;
      ctx.fillRect(flareX - 35, flareY - 1, 70, 2);

      const spikeGradV = ctx.createLinearGradient(flareX, flareY - 35, flareX, flareY + 35);
      spikeGradV.addColorStop(0, "rgba(255,255,255,0)");
      spikeGradV.addColorStop(0.5, `rgba(255,255,255,${flareAlpha})`);
      spikeGradV.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = spikeGradV;
      ctx.fillRect(flareX - 1, flareY - 35, 2, 70);

      // Star central glow
      const flareRadial = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 14);
      flareRadial.addColorStop(0, `rgba(255,255,255,${flareAlpha})`);
      flareRadial.addColorStop(0.4, `rgba(186, 230, 253, ${flareAlpha * 0.7})`);
      flareRadial.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = flareRadial;
      ctx.beginPath();
      ctx.arc(flareX, flareY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Draw Gargantua-style Accretion Disk & Event Horizon Vortex
      ctx.save();
      ctx.translate(vortexX, vortexY);
      ctx.rotate(-0.28 + mouseRef.current.x * 0.1);

      // Ambient outer gravitational glow
      const outerGlow = ctx.createRadialGradient(0, 0, vortexR * 0.8, 0, 0, vortexR * 3.4);
      outerGlow.addColorStop(0, "rgba(2, 6, 23, 0.98)");
      outerGlow.addColorStop(0.35, "rgba(249, 115, 22, 0.45)"); // vibrant orange
      outerGlow.addColorStop(0.65, "rgba(234, 88, 12, 0.2)");
      outerGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(0, 0, vortexR * 3.4, 0, Math.PI * 2);
      ctx.fill();

      // Upper fiery arc (gravitational lensing over the sphere)
      ctx.beginPath();
      ctx.ellipse(0, -vortexR * 0.5, vortexR * 1.5, vortexR * 0.72, 0, Math.PI, 0);
      ctx.strokeStyle = "rgba(251, 146, 60, 0.95)";
      ctx.lineWidth = 5;
      ctx.shadowColor = "#f97316";
      ctx.shadowBlur = 20;
      ctx.stroke();

      // Lower fiery arc
      ctx.beginPath();
      ctx.ellipse(0, vortexR * 0.5, vortexR * 1.5, vortexR * 0.72, 0, 0, Math.PI);
      ctx.strokeStyle = "rgba(249, 115, 22, 0.85)";
      ctx.lineWidth = 4.5;
      ctx.shadowColor = "#ea580c";
      ctx.shadowBlur = 16;
      ctx.stroke();

      // Central black hole sphere
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#020617";
      ctx.beginPath();
      ctx.arc(0, 0, vortexR, 0, Math.PI * 2);
      ctx.fill();

      // Bright incandescent rim
      ctx.strokeStyle = "rgba(254, 215, 170, 0.95)";
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.restore();

      // 4. Dense 3D Curved Code Ribbon / Tapestry (Flowing from top-right down into the vortex)
      ctx.save();

      const trackCount = 24; // dense streams of code
      const ribbonWidth = width * 0.95;

      for (let i = 0; i < trackCount; i++) {
        const text = rawCodeSnippets[i % rawCodeSnippets.length];
        const lateralSpread = (i - trackCount / 2) * 24;

        // Animate continuous stream along curve
        const flowSpeed = 65;
        const loopDistance = ribbonWidth * 1.25;
        const streamProgress = ((t * flowSpeed + i * 42) % loopDistance) / loopDistance;

        // Path Anchor Points mimicking the reference 3D curved cylinder
        // P0: Top Right entrance (wide and angled)
        const p0x = width * 1.08;
        const p0y = -40 + i * 30;

        // P1: Mid Upper Right (bulging 3D curve)
        const p1x = width * 0.82 + lateralSpread * 0.4;
        const p1y = height * 0.16 + i * 20;

        // P2: Center Mid (tightening funnel)
        const p2x = vortexX + 170 + lateralSpread * 0.5;
        const p2y = vortexY - 80 + lateralSpread * 0.3;

        // P3: Gravitational singularity entry point
        const spiralAngle = t * 1.8 + i * 0.45;
        const p3x = vortexX + Math.cos(spiralAngle) * (vortexR * 0.85);
        const p3y = vortexY + Math.sin(spiralAngle) * (vortexR * 0.45);

        // Cubic Bezier interpolation
        const u = 1 - streamProgress;
        const tt = streamProgress;
        const curX =
          u * u * u * p0x +
          3 * u * u * tt * p1x +
          3 * u * tt * tt * p2x +
          tt * tt * tt * p3x;
        const curY =
          u * u * u * p0y +
          3 * u * u * tt * p1y +
          3 * u * tt * tt * p2y +
          tt * tt * tt * p3y;

        // Tangent direction for text orientation
        const deltaU = 0.02;
        const nextU = Math.min(1, streamProgress + deltaU);
        const nu = 1 - nextU;
        const ntt = nextU;
        const nx =
          nu * nu * nu * p0x +
          3 * nu * nu * ntt * p1x +
          3 * nu * ntt * ntt * p2x +
          ntt * ntt * ntt * p3x;
        const ny =
          nu * nu * nu * p0y +
          3 * nu * nu * ntt * p1y +
          3 * nu * ntt * ntt * p2y +
          ntt * ntt * ntt * p3y;

        const angle = Math.atan2(ny - curY, nx - curX);

        // Perspective scale: Larger at top right, foreshortened near black hole
        const scale = (1.15 - streamProgress * 0.55) * Math.max(0.65, width / 700);

        ctx.save();
        ctx.translate(curX, curY);
        ctx.rotate(angle);
        ctx.scale(scale, scale);

        // Alpha fade at start & end of path
        let alpha =
          streamProgress < 0.12
            ? streamProgress / 0.12
            : streamProgress > 0.82
            ? (1 - streamProgress) / 0.18
            : 1;
        alpha *= opacity;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        // Monospace font matching coding IDE in reference
        ctx.font = "600 11.5px 'Fira Code', 'JetBrains Mono', Consolas, Monaco, monospace";

        // Proximity coloring:
        // Top right (far): Cool high-tech slate/cyan
        // Mid tunnel: Electric sky-blue
        // Near singularity: Incandescent amber/orange with fiery glow
        if (streamProgress > 0.62) {
          ctx.fillStyle = "#fdba74"; // amber-300
          ctx.shadowColor = "#f97316";
          ctx.shadowBlur = 10;
        } else if (streamProgress > 0.32) {
          ctx.fillStyle = "#38bdf8"; // sky-400
          ctx.shadowColor = "#0284c7";
          ctx.shadowBlur = 5;
        } else {
          ctx.fillStyle = "#94a3b8"; // slate-400
          ctx.shadowColor = "rgba(148, 163, 184, 0.4)";
          ctx.shadowBlur = 2;
        }

        ctx.fillText(text, 0, 0);
        ctx.restore();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [opacity]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_98%)] ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export default CurvedCodeRibbon;
