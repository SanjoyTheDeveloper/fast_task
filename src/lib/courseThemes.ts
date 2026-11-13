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
    cardBg: "bg-white",
    cardBorder: "border-[#DDD6FE] hover:border-[#7C3AED]",
    cardShadow: "shadow-md shadow-purple-500/10",
    cardHoverShadow: "hover:shadow-xl hover:shadow-purple-500/20",
    topBar: "bg-[#7C3AED]",
    badgeBg: "bg-[#EDE9FE]",
    badgeText: "text-[#5B21B6]",
    badgeBorder: "border-[#DDD6FE]",
    codeBadge: "bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]",
    colorDot: "bg-[#7C3AED]",
    iconBg: "bg-[#EDE9FE] text-[#7C3AED]",
    iconColor: "text-[#7C3AED]",
    primaryButton: "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs shadow-purple-600/20",
    activePill: "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm shadow-purple-600/25",
    iconType: "brain",
  },
  AP: {
    id: "ap",
    name: "AP",
    code: "0613CSE333",
    fullName: "Advanced Programming",
    cardBg: "bg-white",
    cardBorder: "border-[#BFDBFE] hover:border-[#315BFF]",
    cardShadow: "shadow-md shadow-blue-500/10",
    cardHoverShadow: "hover:shadow-xl hover:shadow-blue-500/20",
    topBar: "bg-[#315BFF]",
    badgeBg: "bg-[#EEF3FF]",
    badgeText: "text-[#1D4ED8]",
    badgeBorder: "border-[#BFDBFE]",
    codeBadge: "bg-[#EEF3FF] text-[#1D4ED8] border-[#BFDBFE]",
    colorDot: "bg-[#315BFF]",
    iconBg: "bg-[#EEF3FF] text-[#315BFF]",
    iconColor: "text-[#315BFF]",
    primaryButton: "bg-[#315BFF] hover:bg-[#254BE3] text-white shadow-xs shadow-blue-600/20",
    activePill: "bg-[#315BFF] hover:bg-[#254BE3] text-white shadow-sm shadow-blue-600/25",
    iconType: "code",
  },
  CN: {
    id: "cn",
    name: "CN",
    code: "0612CSE315",
    fullName: "Computer Networks",
    cardBg: "bg-white",
    cardBorder: "border-[#A7F3D0] hover:border-[#10B981]",
    cardShadow: "shadow-md shadow-emerald-500/10",
    cardHoverShadow: "hover:shadow-xl hover:shadow-emerald-500/20",
    topBar: "bg-[#10B981]",
    badgeBg: "bg-[#D1FAE5]",
    badgeText: "text-[#065F46]",
    badgeBorder: "border-[#A7F3D0]",
    codeBadge: "bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]",
    colorDot: "bg-[#10B981]",
    iconBg: "bg-[#D1FAE5] text-[#10B981]",
    iconColor: "text-[#10B981]",
    primaryButton: "bg-[#10B981] hover:bg-[#059669] text-white shadow-xs shadow-emerald-600/20",
    activePill: "bg-[#10B981] hover:bg-[#059669] text-white shadow-sm shadow-emerald-600/25",
    iconType: "network",
  },
  MACS: {
    id: "macs",
    name: "MACS",
    code: "0541MAT337",
    fullName: "Math & Complex Systems",
    cardBg: "bg-white",
    cardBorder: "border-[#FDE68A] hover:border-[#F59E0B]",
    cardShadow: "shadow-md shadow-amber-500/10",
    cardHoverShadow: "hover:shadow-xl hover:shadow-amber-500/20",
    topBar: "bg-[#F59E0B]",
    badgeBg: "bg-[#FEF3C7]",
    badgeText: "text-[#92400E]",
    badgeBorder: "border-[#FDE68A]",
    codeBadge: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    colorDot: "bg-[#F59E0B]",
    iconBg: "bg-[#FEF3C7] text-[#F59E0B]",
    iconColor: "text-[#F59E0B]",
    primaryButton: "bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-xs shadow-amber-600/20",
    activePill: "bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-sm shadow-amber-600/25",
    iconType: "math",
  },
  TWRM: {
    id: "twrm",
    name: "TWRM",
    code: "0031CSE320",
    fullName: "Technical Writing & Research",
    cardBg: "bg-white",
    cardBorder: "border-[#FED7AA] hover:border-[#F97316]",
    cardShadow: "shadow-md shadow-orange-500/10",
    cardHoverShadow: "hover:shadow-xl hover:shadow-orange-500/20",
    topBar: "bg-[#F97316]",
    badgeBg: "bg-[#FFEDD5]",
    badgeText: "text-[#C2410C]",
    badgeBorder: "border-[#FED7AA]",
    codeBadge: "bg-[#FFEDD5] text-[#C2410C] border-[#FED7AA]",
    colorDot: "bg-[#F97316]",
    iconBg: "bg-[#FFEDD5] text-[#F97316]",
    iconColor: "text-[#F97316]",
    primaryButton: "bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs shadow-orange-600/20",
    activePill: "bg-[#F97316] hover:bg-[#EA580C] text-white shadow-sm shadow-orange-600/25",
    iconType: "writing",
  },
  "Labs & Sessionals": {
    id: "labs",
    name: "Labs & Sessionals",
    code: "Sessionals",
    fullName: "Laboratory Experiments & Practical Guides",
    cardBg: "bg-white",
    cardBorder: "border-[#99F6E4] hover:border-[#0D9488]",
    cardShadow: "shadow-md shadow-teal-500/10",
    cardHoverShadow: "hover:shadow-xl hover:shadow-teal-500/20",
    topBar: "bg-[#0D9488]",
    badgeBg: "bg-[#CCFBF1]",
    badgeText: "text-[#0F766E]",
    badgeBorder: "border-[#99F6E4]",
    codeBadge: "bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]",
    colorDot: "bg-[#0D9488]",
    iconBg: "bg-[#CCFBF1] text-[#0D9488]",
    iconColor: "text-[#0D9488]",
    primaryButton: "bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-xs shadow-teal-600/20",
    activePill: "bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-sm shadow-teal-600/25",
    iconType: "lab",
  },
};

export const DEFAULT_THEME: CourseTheme = {
  id: "default",
  name: "General",
  code: "CSE-GEN",
  fullName: "General Academic Material",
  cardBg: "bg-white",
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
  return category
    ? `Comprehensive ${category} course study notes, reference diagrams, and preparation review.`
    : "Comprehensive course study notes, reference diagrams, and preparation review.";
}

