export interface CourseTheme {
  id: string;
  name: string;
  code: string;
  fullName: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  cardHoverShadow: string;
  topBar: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  codeBadge: string;
  colorDot: string;
  iconBg: string;
  iconColor: string;
  primaryButton: string;
  activePill: string;
  iconType: "brain" | "code" | "network" | "math" | "writing" | "lab" | "file";
}

export const COURSE_THEMES: Record<string, CourseTheme> = {
  AIES: {
    id: "aies",
    name: "AIES",
    code: "0611CSE321",
    fullName: "Artificial Intelligence & Expert Systems",
    cardBg: "bg-gradient-to-b from-indigo-50/50 via-white to-white",
    cardBorder: "border-indigo-200/90 hover:border-indigo-400",
    cardShadow: "shadow-md shadow-indigo-500/10",
    cardHoverShadow: "hover:shadow-xl hover:shadow-indigo-500/20",
    topBar: "bg-indigo-500",
    badgeBg: "bg-indigo-100/90",
    badgeText: "text-indigo-800",
    badgeBorder: "border-indigo-200",
    codeBadge: "bg-indigo-50/90 text-indigo-700 border-indigo-200/80",
    colorDot: "bg-indigo-500",
    iconBg: "bg-indigo-100 text-indigo-700",
    iconColor: "text-indigo-700",
    primaryButton: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-600/20",
    activePill: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/25",
    iconType: "brain",
  },
  AP: {
    id: "ap",
    name: "AP",
    code: "0613CSE333",
    fullName: "Advanced Programming",
    cardBg: "bg-gradient-to-b from-blue-50/50 via-white to-white",
    cardBorder: "border-blue-200/90 hover:border-blue-400",
    cardShadow: "shadow-md shadow-blue-500/10",
    cardHoverShadow: "hover:shadow-xl hover:shadow-blue-500/20",
    topBar: "bg-blue-500",
    badgeBg: "bg-blue-100/90",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-200",
    codeBadge: "bg-blue-50/90 text-blue-700 border-blue-200/80",
    colorDot: "bg-blue-500",
    iconBg: "bg-blue-100 text-blue-700",
    iconColor: "text-blue-700",
    primaryButton: "bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-600/20",
    activePill: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/25",
    iconType: "code",
  },
  CN: {
    id: "cn",
    name: "CN",
    code: "0612CSE315",
    fullName: "Computer Networks",
    cardBg: "bg-gradient-to-b from-emerald-50/50 via-white to-white",
    cardBorder: "border-emerald-200/90 hover:border-emerald-400",
    cardShadow: "shadow-md shadow-emerald-500/10",
    cardHoverShadow: "hover:shadow-xl hover:shadow-emerald-500/20",
    topBar: "bg-emerald-500",
    badgeBg: "bg-emerald-100/90",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-200",
    codeBadge: "bg-emerald-50/90 text-emerald-700 border-emerald-200/80",
    colorDot: "bg-emerald-500",
    iconBg: "bg-emerald-100 text-emerald-700",
    iconColor: "text-emerald-700",
    primaryButton: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/20",
    activePill: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/25",
    iconType: "network",
  },
  MACS: {
    id: "macs",
    name: "MACS",
    code: "0541MAT337",
    fullName: "Math & Complex Systems",
    cardBg: "bg-gradient-to-b from-amber-50/50 via-white to-white",
    cardBorder: "border-amber-200/90 hover:border-amber-400",
    cardShadow: "shadow-md shadow-amber-500/10",
    cardHoverShadow: "hover:shadow-xl hover:shadow-amber-500/20",
    topBar: "bg-amber-500",
    badgeBg: "bg-amber-100/90",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-200",
    codeBadge: "bg-amber-50/90 text-amber-700 border-amber-200/80",
    colorDot: "bg-amber-500",
    iconBg: "bg-amber-100 text-amber-700",
    iconColor: "text-amber-700",
    primaryButton: "bg-amber-600 hover:bg-amber-700 text-white shadow-xs shadow-amber-600/20",
    activePill: "bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-600/25",
    iconType: "math",
  },
  TWRM: {
    id: "twrm",
    name: "TWRM",
    code: "0031CSE320",
    fullName: "Technical Writing & Research",
    cardBg: "bg-gradient-to-b from-rose-50/50 via-white to-white",
    cardBorder: "border-rose-200/90 hover:border-rose-400",
    cardShadow: "shadow-md shadow-rose-500/10",
    cardHoverShadow: "hover:shadow-xl hover:shadow-rose-500/20",
    topBar: "bg-rose-500",
    badgeBg: "bg-rose-100/90",
    badgeText: "text-rose-800",
    badgeBorder: "border-rose-200",
    codeBadge: "bg-rose-50/90 text-rose-700 border-rose-200/80",
    colorDot: "bg-rose-500",
    iconBg: "bg-rose-100 text-rose-700",
    iconColor: "text-rose-700",
    primaryButton: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs shadow-rose-600/20",
    activePill: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/25",
    iconType: "writing",
  },
  "Labs & Sessionals": {
    id: "labs",
    name: "Labs & Sessionals",
    code: "Sessionals",
    fullName: "Laboratory Experiments & Practical Guides",
    cardBg: "bg-gradient-to-b from-purple-50/50 via-white to-white",
    cardBorder: "border-purple-200/90 hover:border-purple-400",
    cardShadow: "shadow-md shadow-purple-500/10",
    cardHoverShadow: "hover:shadow-xl hover:shadow-purple-500/20",
    topBar: "bg-purple-500",
    badgeBg: "bg-purple-100/90",
    badgeText: "text-purple-800",
    badgeBorder: "border-purple-200",
    codeBadge: "bg-purple-50/90 text-purple-700 border-purple-200/80",
    colorDot: "bg-purple-500",
    iconBg: "bg-purple-100 text-purple-700",
    iconColor: "text-purple-700",
    primaryButton: "bg-purple-600 hover:bg-purple-700 text-white shadow-xs shadow-purple-600/20",
    activePill: "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/25",
    iconType: "lab",
  },
};

export const DEFAULT_THEME: CourseTheme = {
  id: "default",
  name: "General",
  code: "CSE-GEN",
  fullName: "General Academic Material",
  cardBg: "bg-gradient-to-b from-slate-50/50 via-white to-white",
  cardBorder: "border-slate-200/90 hover:border-slate-400",
  cardShadow: "shadow-md shadow-slate-900/5",
  cardHoverShadow: "hover:shadow-xl hover:shadow-slate-900/10",
  topBar: "bg-slate-400",
  badgeBg: "bg-slate-100",
  badgeText: "text-slate-700",
  badgeBorder: "border-slate-200",
  codeBadge: "bg-slate-50 text-slate-600 border-slate-200/80",
  colorDot: "bg-slate-500",
  iconBg: "bg-slate-100 text-slate-600",
  iconColor: "text-slate-600",
  primaryButton: "bg-slate-900 hover:bg-slate-800 text-white shadow-xs",
  activePill: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm",
  iconType: "file",
};

export function getCourseTheme(key?: string): CourseTheme {
  if (!key) return DEFAULT_THEME;
  const norm = key.trim().toUpperCase();

  if (norm.includes("AIES") || norm.includes("0611CSE321") || norm.includes("0611CSE322")) {
    return COURSE_THEMES["AIES"];
  }
  if (norm.includes("AP") || norm.includes("0613CSE333") || norm.includes("0613CSE334")) {
    return COURSE_THEMES["AP"];
  }
  if (norm.includes("CN") || norm.includes("0612CSE315") || norm.includes("0612CSE316")) {
    return COURSE_THEMES["CN"];
  }
  if (norm.includes("MACS") || norm.includes("0541MAT337") || norm.includes("MATH")) {
    return COURSE_THEMES["MACS"];
  }
  if (norm.includes("TWRM") || norm.includes("0031CSE320") || norm.includes("WRITING")) {
    return COURSE_THEMES["TWRM"];
  }
  if (norm.includes("LAB") || norm.includes("SESS") || norm.includes("SESSIONAL")) {
    return COURSE_THEMES["Labs & Sessionals"];
  }

  return COURSE_THEMES[key] || DEFAULT_THEME;
}

export function cleanDocumentTitle(title: string): string {
  return title.replace(/\.pdf$/i, "").trim();
}

export function inferDocumentType(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("lab manual") || lower.includes("lab sheet") || lower.includes("lab project")) {
    return "Lab Guide";
  }
  if (lower.includes("chapter") || lower.includes("unit") || lower.includes("lecture") || lower.includes("module")) {
    return "Lecture Note";
  }
  if (lower.includes("handout")) {
    return "Handout";
  }
  return "Study Material";
}

export function getDocumentSummary(title: string, category?: string): string {
  const t = title.toLowerCase();
  if (t.includes("cisco packet tracer")) {
    return "Topology design, router & switch cabling, IPv4 assignment and ICMP connectivity.";
  }
  if (t.includes("wireshark")) {
    return "Promiscuous packet capture, protocol dissection, 3-way handshake & TCP analysis.";
  }
  if (t.includes("search algorithms in python")) {
    return "Heuristic implementation, BFS, DFS, and A* pathfinding algorithms on grid maps.";
  }
  if (t.includes("tcp chat system")) {
    return "Multithreaded socket server, non-blocking I/O, client broadcasting & mutex safety.";
  }
  if (t.includes("intro to ai")) {
    return "Rational agent taxonomy, PEAS criteria, environment dynamics & state spaces.";
  }
  if (t.includes("heuristic search")) {
    return "Informed algorithms, heuristic admissibility, consistency & branch-and-bound pruning.";
  }
  if (t.includes("knowledge representation")) {
    return "First-order predicate logic, unification algorithms, forward chaining & resolution.";
  }
  if (t.includes("expert systems")) {
    return "Rule-based systems, conflict resolution strategies, RETE matching & explanation facility.";
  }
  if (t.includes("advanced oop")) {
    return "Gang of Four creational, structural, and behavioral design patterns in C++ / Java.";
  }
  if (t.includes("multithreading")) {
    return "Thread lifecycles, race conditions, atomic operations, condition variables & async IO.";
  }
  if (t.includes("memory management")) {
    return "RAII principles, unique & shared smart pointers, heap allocation & leak detection.";
  }
  if (t.includes("socket programming")) {
    return "POSIX network sockets, bind/listen/accept workflows, TCP byte streaming & buffers.";
  }
  if (t.includes("osi vs tcp-ip")) {
    return "Seven-layer reference model comparison, PDU encapsulation & protocol responsibilities.";
  }
  if (t.includes("data link layer")) {
    return "Bit framing, sliding window flow control, CRC error checking & HDLC protocol.";
  }
  if (t.includes("subnetting")) {
    return "Variable-length subnet masks (VLSM), classless inter-domain routing & supernetting.";
  }
  if (t.includes("routing protocols")) {
    return "Interior gateway routing (OSPF, RIP) vs exterior routing (BGP) and path vectors.";
  }
  if (t.includes("linear algebra")) {
    return "Vector subspaces, matrix rank, QR decomposition, eigenvalues & SVD factorizations.";
  }
  if (t.includes("eigenvalues")) {
    return "Diagonalization, spectral theorem, Jordan canonical forms & dynamic state spaces.";
  }
  if (t.includes("complex numbers")) {
    return "Holomorphic functions, Cauchy-Riemann conditions, contour integrals & residue calculus.";
  }
  if (t.includes("nonlinear dynamics")) {
    return "Attractors, Poincaré maps, Lyapunov exponents, phase portraits & deterministic chaos.";
  }
  if (t.includes("ieee manuscript")) {
    return "Manuscript typography, standard two-column format, abstract design & figure captions.";
  }
  if (t.includes("literature review")) {
    return "Systematic literature search, PRISMA framework, BibTeX referencing & synthesis.";
  }
  return "Comprehensive course study notes, reference diagrams, and preparation review.";
}

