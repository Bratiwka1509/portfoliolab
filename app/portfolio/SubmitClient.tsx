"use client";

import { useState } from "react";

function getDrivePreview(pdfUrl: string) {
  const match = pdfUrl.match(/\/d\/([^/]+)/);
  if (!match) return null;
  return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
}


/* ================= FILTER OPTIONS ================= */

const SEASONS = [
  "All Seasons",
  "2025 Decode",
  "2024 Into The Deep",
  "2023 Centerstage",
  "2022 Power Play",
  "2021 Freight Frenzy",
  "2020 Ultimate Goal",
  "2019 Skystone",
  "Not specified",
];

const LEVELS = ["All Levels", "Regionals", "Nationals", "Worlds", "Premier Event", "Not specified"];

const AWARDS = [
  "All Awards",
  "Inspire",
  "Think",
  "Reach",
  "Sustain",
  "Connect",
  "Design",
  "Innovate",
  "Control",
  "Motivate",
  "Not specified",
];

const STARS = ["All Stars", "★★★★★", "★★★★☆", "★★★☆☆", "★★☆☆☆", "★☆☆☆☆"];

/* ================= DATA ================= */

const portfolios = [
  {
  "id": "16091-1",
  "teamName": "Team Without a Cool Acronym",
  "teamNumber": 16091,
  "country": "USA",
  "city": "Hurricane, Utah",
  "season": "2022 Power Play",
  "level": "Worlds",
  "stars": "★★★★★",
  "score": "52 / 55",
  "award": "Inspire Award Winner",

  "cover": "/portfolios/16091-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1Z0SvCbq8ko9SF0PTQ7NV6PXNmbSGRv3Q/view?usp=sharing",

  "summary":
    "A world-class FTC engineering portfolio with exceptional outreach scale, real engineering rigor, quantified decisions, and highly mature documentation. This is a benchmark portfolio, not merely a strong one.",

  "awardsBreakdown": [
    ["Inspire", "5 / 5 – Complete dominance across all dimensions"],
    ["Reach", "5 / 5 – Massive, verified global reach"],
    ["Sustain", "5 / 5 – Long-term systems, funding, and mentorship"],
    ["Connect", "5 / 5 – Industry, academia, media, and FIRST fully integrated"],
    ["Design", "4.5 / 5 – Strong mechanisms with documented trade-offs"],
    ["Innovate", "4.5 / 5 – Thoughtful originality, not superficial novelty"],
    ["Control", "4 / 5 – Solid autonomous and safeguards, not absolute peak"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "5 / 5 – Perfect alignment"],
    ["Engineering Thinking", "5 / 5 – Iteration and learning clearly shown"],
    ["Technical Depth", "4.5 / 5 – Strong calculations, minor comparison gaps"],
    ["Outreach & Impact", "5 / 5 – Rare, world-scale impact"],
    ["Evidence & Proof", "5 / 5 – Metrics-driven and verifiable"],
    ["Clarity & Structure", "5 / 5 – Dense but judge-efficient"],
    ["Claim Realism", "5 / 5 – No exaggeration"],
    ["Design as Tool", "4.5 / 5 – Strategy-driven engineering"]
  ],

  "strengths": [
    "World-scale outreach with hard metrics",
    "Exceptional engineering documentation",
    "Clear iterative design process",
    "Deep FIRST ecosystem involvement",
    "Reusable resources influencing many teams"
  ],

  "weaknesses": [
    "High information density",
    "Some designs are complex to replicate",
    "Control systems are strong but not revolutionary"
  ],

  "improvements": [
    "Add direct A/B drivetrain comparisons",
    "Quantify autonomous consistency across events",
    "Slightly reduce visual density for faster judging"
  ],

  "benchmarkComparison":
    "This portfolio functions as the benchmark itself. It most closely matches World Inspire Finalist portfolios and exceeds the majority of Worlds submissions due to verified impact, engineering rigor, and documentation maturity."
},

{
  "id": "19047-1",
  "teamName": "RAVENTECH",
  "teamNumber": 19047,
  "country": "Romania",
  "season": "2024 Into The Deep",
  "level": "Premier Event",
  "stars": "★★★★☆",
  "score": "41 / 55",
  "award": "Not specified",

  "cover": "/portfolios/19047-1/cover.jpg",
  "pdf": "https://drive.google.com/file/d/1cPQ_DgALudChLxE2MWQyOXjvNeavnMjL/view?usp=sharing",

  "summary":
    "A strong Worlds-level engineering portfolio with exceptional technical depth, real trade-offs, calculations, and advanced software. Outreach is broad and active but lacks strict long-term impact metrics. Clearly above average FTC and competitive at Worlds, yet below Inspire-level global benchmarks.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "4 / 5"],
    ["Sustain", "3 / 5"],
    ["Connect", "4 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "3 / 5"],
    ["Control", "4 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "4 / 5"],
    ["Engineering Thinking", "4 / 5"],
    ["Technical Depth", "5 / 5"],
    ["Outreach & Impact", "4 / 5"],
    ["Evidence & Proof", "3 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "4 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Exceptional mechanical and software depth",
    "Clear engineering trade-offs and calculations",
    "Advanced autonomous and control systems",
    "Wide regional and international outreach"
  ],

  "weaknesses": [
    "Impact metrics not consistently quantified",
    "Innovations are mostly evolutionary",
    "Inspire narrative not fully integrated"
  ],

  "improvements": [
    "Introduce measurable outreach KPIs and longitudinal data",
    "Tie engineering decisions directly to community impact",
    "Develop multi-year sustainable outreach programs",
    "Build a unified Inspire-level story across engineering and impact"
  ]
},

  {
  "id": "12635-1",
  "teamName": "Kuriosity Robotics",
  "teamNumber": 12635,
  "country": "United States",
  "season": "2021 Freight Frenzy",
  "level": "Regionals",
  "stars": "★★★☆☆",
  "score": "31 / 55",
  "award": "Design Award - Winner",

  "cover": "/portfolios/12635-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1EnWguV1KVuKHBSV_nE2glaX6YrX1Yzez/view?usp=sharing",

  "summary":
    "A well-structured FTC engineering portfolio that clearly documents the robot design process and iterations. The team demonstrates solid engineering fundamentals and readable documentation, but lacks the technical depth, quantified evidence, and outreach scale required for top-tier Worlds-level recognition.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "2 / 5"],
    ["Sustain", "3 / 5"],
    ["Connect", "3 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "3 / 5"],
    ["Control", "3 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "3 / 5"],
    ["Engineering Thinking", "3 / 5"],
    ["Technical Depth", "3 / 5"],
    ["Outreach & Impact", "2 / 5"],
    ["Evidence & Proof", "2 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "4 / 5"],
    ["Design as Tool", "3 / 5"]
  ],

  "strengths": [
    "Clear and logical portfolio structure, easy to review quickly",
    "Demonstrates a real engineering process with iterations",
    "Strong CAD visuals and mechanical explanations",
    "Claims remain realistic and proportional to evidence"
  ],

  "weaknesses": [
    "Limited technical depth: few calculations and trade-off analyses",
    "Outreach activities lack scale and measurable impact",
    "Weak evidence to support impact and innovation claims",
    "Innovation is stated but not benchmarked against peers or industry"
  ],

  "improvements": [
    "Add calculations, explicit trade-offs, and quantitative decision criteria",
    "Develop long-term outreach programs with measurable outcomes",
    "Include testing data, reliability metrics, and failure analysis",
    "Explicitly map engineering work to Judging Questions and award criteria"
  ]
},
  
  {
    id: "3747-1",
    teamName: "The Hive",
    teamNumber: 3747,
    country: "USA",
    season: "2024 Into The Deep",
    level: "Worlds",
    stars: "★★★★☆",
    score: "49 / 55",
    award: "Motivate Award 3rd place",
    cover: "/portfolios/3747-1/cover.png",
    pdf: "https://drive.google.com/file/d/10x23SfD81UZaXlOqNRvrq_pbrXNv1SJQ/view?usp=sharing",

    summary:
      "A strong Worlds-level engineering portfolio with exceptional, evidence-based outreach and advocacy, solid sustainability planning, and deep engineering rigor. Demonstrates clear trade-offs, calculations, iterations, and a mature software stack.",

    awardsBreakdown: [
      ["Inspire", "4 / 5"],
      ["Reach", "5 / 5"],
      ["Sustain", "4 / 5"],
      ["Connect", "4 / 5"],
      ["Design", "4 / 5"],
      ["Innovate", "3 / 5"],
      ["Control", "4 / 5"],
    ],

    criteria: [
      ["Judging Questions Alignment", "5 / 5"],
      ["Engineering Thinking", "5 / 5"],
      ["Technical Depth", "4 / 5"],
      ["Outreach & Impact", "5 / 5"],
      ["Evidence & Proof", "5 / 5"],
      ["Clarity & Structure", "4 / 5"],
      ["Claim Realism", "5 / 5"],
      ["Design as Tool", "4 / 5"],
    ],

    strengths: [
      "Large-scale, sustainable outreach with legislative impact",
      "Excellent engineering reasoning and documentation",
      "Strong integration of strategy, hardware, and software",
    ],

    weaknesses: [
      "Innovation is incremental",
      "Long-term sustainability horizon could be clearer",
      "High information density",
    ],

    improvements: [
      "Introduce benchmark-level unique innovation",
      "Add a 3–5 year sustainability plan with KPIs",
      "Provide executive summary layer",
      "Add comparative A/B testing metrics",
    ],
  },

  {
  id: "14503-1",
  teamName: "The Robo Sapiens",
  teamNumber: 14503,
  country: "USA",
  season: "2020 Ultimate Goal",
  level: "Regionals",
  stars: "★★★★☆",
  score: "38 / 55",
  award: "Not specified",

  cover: "/portfolios/14503-1/cover.png",
  pdf: "https://drive.google.com/file/d/1woz3rS1WQ3yimncLL62FRxlt0WJYnQwk/view?usp=sharing",

  summary:
    "A technically excellent FTC engineering portfolio with real calculations, strong iteration logic, and advanced autonomous systems. Engineering depth is near Worlds level, but outreach remains local and insufficiently measured, preventing Inspire-level evaluation.",

  awardsBreakdown: [
    ["Inspire", "3 / 5"],
    ["Reach", "2 / 5"],
    ["Sustain", "2 / 5"],
    ["Connect", "3 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "4 / 5"],
    ["Control", "4 / 5"]
  ],

  criteria: [
    ["Judging Questions Alignment", "4 / 5"],
    ["Engineering Thinking", "4 / 5"],
    ["Technical Depth", "5 / 5"],
    ["Outreach & Impact", "3 / 5"],
    ["Evidence & Proof", "3 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "4 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  strengths: [
    "Exceptional technical depth with real physics and calculations",
    "Clear iteration history and trade-off analysis",
    "Advanced autonomous and teleop automation",
    "High realism and engineering credibility"
  ],

  weaknesses: [
    "Outreach limited to local scale",
    "Lack of quantitative impact metrics",
    "No long-term sustainable outreach programs"
  ],

  improvements: [
    "Develop scalable regional or national outreach initiatives",
    "Introduce clear quantitative outreach metrics",
    "Tie engineering outcomes to reusable external impact (curricula, open resources)"
  ]
},

{
  "id": "1002-1",
  "teamName": "CircuitRunners Surge",
  "teamNumber": 1002,
  "country": "USA",
  "city": "Marietta, Georgia",
  "season": "2021 Freight Frenzy",
  "level": "Worlds",
  "stars": "★★★★☆",
  "score": "44 / 55",
  "award": "Design Award 2nd place",

  "cover": "/portfolios/1002-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1cwvDL9i0-u9FlySgaa5LVqvF57re_7Cn/view?usp=sharing",

  "summary":
    "A strong Worlds-level FTC portfolio with outstanding outreach scale, long-term sustainability, and true ambassador-level impact. Engineering is solid, iterative, and calculation-backed, though slightly less tightly integrated and refined than the absolute global benchmarks.",

  "awardsBreakdown": [
    ["Inspire", "4 / 5"],
    ["Reach", "5 / 5"],
    ["Sustain", "5 / 5"],
    ["Connect", "4 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "4 / 5"],
    ["Control", "4 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "4 / 5"],
    ["Engineering Thinking", "4 / 5"],
    ["Technical Depth", "4 / 5"],
    ["Outreach & Impact", "5 / 5"],
    ["Evidence & Proof", "4 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "5 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Large-scale, systematic outreach with thousands reached and clear metrics",
    "Excellent sustainability through recruitment, knowledge transfer, and finances",
    "Strong engineering depth with iterations, calculations, and real trade-offs",
    "True FIRST ambassador role: mentoring, events, and international engagement",
    "Clear structure and fast comprehension within judge time limits"
  ],

  "weaknesses": [
    "Engineering narrative is not always explicitly tied to Inspire judging questions",
    "Some sections describe final solutions more than rejected alternatives",
    "Engineering and outreach could be more explicitly interconnected"
  ],

  "improvements": [
    "Explicitly map engineering decisions to Judging Questions",
    "Document rejected design paths and decision trade-offs more clearly",
    "Show how outreach leveraged the team’s engineering tools and expertise"
  ],

  "benchmarkComparison":
    "This portfolio is much closer to Team Without a Cool Acronym and Rebel Robotics than to Yaku or Crowns. Outreach and sustainability are benchmark-level, while engineering integration and narrative density fall slightly short of the absolute top-tier exemplars."
},

{
  "id": "22105-1",
  "teamName": "Runtime Terror",
  "teamNumber": 22105,
  "country": "USA",
  "city": "San Diego, California",
  "season": "2024 Into The Deep",
  "level": "Regionals",
  "stars": "★★★★☆",
  "score": "46 / 55",
  "award": "Inspire Award Winner",

  "cover": "/portfolios/22105-1/cover.png",
  "pdf": "https://drive.google.com/file/d/11A2khVf3LNyZF1pJ9M19dFL8jgr88xDX/view?usp=sharing",

  "summary":
    "A genuine Worlds-level FTC portfolio featuring exceptional mechanical and software engineering depth and rare policy-level outreach. Shows clear trade-offs, calculations, and risk mitigation. Slightly below absolute benchmark level due to limited long-term international sustain metrics and Inspire narrative integration.",

  "awardsBreakdown": [
    ["Inspire", "4 / 5"],
    ["Reach", "5 / 5"],
    ["Sustain", "4 / 5"],
    ["Connect", "5 / 5"],
    ["Design", "5 / 5"],
    ["Innovate", "5 / 5"],
    ["Control", "5 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "4 / 5"],
    ["Engineering Thinking", "5 / 5"],
    ["Technical Depth", "5 / 5"],
    ["Outreach & Impact", "4 / 5"],
    ["Evidence & Proof", "4 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "5 / 5"],
    ["Design as Tool", "5 / 5"]
  ],

  "strengths": [
    "Benchmark-level engineering: boxtube, PTO, swerve, current and torque calculations",
    "Uncommon FTC software rigor: feedforward, gain scheduling, S-curves, state machines",
    "Explicit trade-offs and risk management, not just polished outcomes",
    "Elite Connect performance with universities, professors, and industry experts",
    "High-impact outreach including statewide STEM advocacy exceeding $1M"
  ],

  "weaknesses": [
    "Some outreach initiatives are still short-term or pilot-stage",
    "Limited longitudinal evidence for international sustainability",
    "Inspire narrative leans more technical than values-driven"
  ],

  "improvements": [
    "Document multi-year metrics for Refugees for Robotics and global mentoring",
    "Explicitly connect engineering excellence to FIRST values in Inspire",
    "Demonstrate outreach scalability independent of direct team involvement"
  ],

  "benchmarkComparison":
    "This portfolio is far closer to Team Without a Cool Acronym and Rebel Robotics than to Yaku or Crowns. Engineering and software are benchmark-comparable, while outreach scale and sustainability fall just short of absolute Inspire/Champions-level exemplars."
},

{
  "id": "7842-1",
  "teamName": "Browncoats",
  "teamNumber": 7842,
  "country": "USA",
  "city": "North Alabama",
  "season": "2022 Power Play",
  "level": "Regionals",
  "stars": "★★★☆☆",
  "score": "33 / 55",
  "award": "Innovate Award 2nd place",

  "cover": "/portfolios/7842-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1osaSeTzO8f1DSOafO8LDdkQPiKCw0NCn/view?usp=sharing",

  "summary":
    "A solid and clearly written FTC engineering portfolio that demonstrates a mature iterative design process and sound mechanical reasoning. Competitive at the regional/state level, but lacks the technical depth, originality, and outreach scale required for Worlds-level comparison.",

  "awardsBreakdown": [
    ["Inspire", "2 / 5"],
    ["Reach", "3 / 5"],
    ["Sustain", "3 / 5"],
    ["Connect", "2 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "3 / 5"],
    ["Control", "3 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "3 / 5"],
    ["Engineering Thinking", "4 / 5"],
    ["Technical Depth", "3 / 5"],
    ["Outreach & Impact", "3 / 5"],
    ["Evidence & Proof", "4 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "5 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Very clear and honest engineering process with real iteration",
    "Well-argued mechanical trade-offs across drivetrain, lift, intake, and beacon",
    "Excellent clarity, structure, and judge readability",
    "Realistic claims with strong supporting evidence",
    "Strong alignment with Design Award expectations"
  ],

  "weaknesses": [
    "Limited technical depth: minimal calculations, control theory, or quantitative analysis",
    "Software is described functionally, not algorithmically",
    "Outreach is mostly local with limited scale or sustainability",
    "No world-class innovation or high-risk engineering shown"
  ],

  "improvements": [
    "Add quantitative engineering analysis (torque, current, CG, speed models)",
    "Compare alternative designs using measurable criteria",
    "Develop long-term outreach programs with regional or statewide impact",
    "Deepen software architecture and autonomous/control explanations"
  ],

  "benchmarkComparison":
    "This portfolio is much closer to a solid mid-level FTC standard than to Team Without a Cool Acronym or Rebel Robotics. It clearly exceeds Yaku and Crowns in structure and credibility, but falls short of Worlds/Inspire benchmarks in engineering scale and impact."
},

{
"id": "1002-2",
"teamName": "CircuitRunners Surge",
"teamNumber": 1002,
"country": "USA",
"city": "Marietta, Georgia",
"season": "2022 Power Play",
"level": "Regionals",
"stars": "★★★★☆",
"score": "38 / 55",
"award": "Innovate Award 3rd place",

"cover": "/portfolios/1002-2/cover.png",
"pdf": "https://drive.google.com/file/d/1y9zZ6EsLC1hktMMKzEwKpRmLjNO4Q__r/view?usp=sharing",

"summary":
"A high-level FTC engineering portfolio with exceptional technical depth, original mechanisms, clear iteration logic, and advanced software systems. Outreach is broad and well-documented, including national and international mentoring, but sustainability and long-term impact measurement are weaker than Inspire-level benchmarks.",

"awardsBreakdown": [
["Inspire", "3 / 5"],
["Reach", "4 / 5"],
["Sustain", "3 / 5"],
["Connect", "4 / 5"],
["Design", "4 / 5"],
["Innovate", "4 / 5"],
["Control", "5 / 5"]
],

"criteria": [
["Judging Questions Alignment", "4 / 5"],
["Engineering Thinking", "5 / 5"],
["Technical Depth", "5 / 5"],
["Outreach & Impact", "4 / 5"],
["Evidence & Proof", "4 / 5"],
["Clarity & Structure", "4 / 5"],
["Claim Realism", "4 / 5"],
["Design as Tool", "4 / 5"]
],

"strengths": [
"Worlds-level mechanical engineering with original systems (locking mecanum, belted lift, passthrough deposit) supported by iterations and trade-offs",
"Strong control systems: motion profiling, odometry, AprilTags, absolute encoders, all clearly justified",
"Large-scale outreach including FLL mentoring, FTC events, FIRST Global mentoring, and documented audience reach"
],

"weaknesses": [
"Sustainability is goal-oriented rather than evidence-based; future plans dominate over proven long-term continuity",
"Outreach impact relies heavily on reach counts rather than demonstrated outcome or transformation",
"Inspire narrative is fragmented; engineering and outreach excellence are not fully unified into a single mission-driven story"
],

"improvements": [
"Add longitudinal data showing multi-year outcomes of mentored teams, retained programs, or policy-level change",
"Strengthen Inspire positioning by explicitly connecting engineering innovation to community impact and team values",
"Quantify outreach effectiveness beyond reach (e.g., teams advancing, programs sustained, measurable skill transfer)"
],

"benchmarkComparison":
"Closer to Rebel Robotics than to baseline portfolios due to extreme technical rigor and originality, but falls short of Team Without a Cool Acronym in Inspire-level cohesion, sustainability proof, and integrated global impact."
},
{
  "id": "26438-1",
  "teamName": "CROWN",
  "teamNumber": 26438,
  "country": "India",
  "season": "2024 Into The Deep",
  "level": "Not specifies",
  "stars": "★★★☆☆",
  "score": "31 / 55",
  "award": "Not specified",

  "cover": "/portfolios/26438-1/cover.jpg",
  "pdf": "https://drive.google.com/file/d/18NReuWcn4L36J4rYIFVabCAmADhuFMdO/view?usp=sharing",

  "summary":
    "A visually strong and well-documented engineering portfolio with solid CAD work and iterative design. Technical depth is above average for FTC, but engineering thinking is often descriptive rather than analytical, with limited quantified trade-offs. Outreach is active but partially under-supported by strict FIRST definitions. Overall level: solid FTC, not Worlds-class.",

  "awardsBreakdown": [
    ["Inspire", "2 / 5"],
    ["Reach", "3 / 5"],
    ["Sustain", "3 / 5"],
    ["Connect", "3 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "3 / 5"],
    ["Control", "3 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "3 / 5"],
    ["Engineering Thinking", "3 / 5"],
    ["Technical Depth", "4 / 5"],
    ["Outreach & Impact", "3 / 5"],
    ["Evidence & Proof", "2 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "3 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Strong CAD and iterative design workflow",
    "Detailed explanation of mechanisms and evolution",
    "Clear visual structure and layout",
    "Good understanding of mechanical constraints"
  ],

  "weaknesses": [
    "Limited quantified trade-off analysis",
    "Outreach claims not always aligned with FIRST definitions",
    "Insufficient data-backed decision justification",
    "Inspire-level impact not demonstrated"
  ],

  "improvements": [
    "Add explicit trade-off matrices with metrics",
    "Strictly classify outreach using FIRST terminology",
    "Demonstrate how test data directly influenced design",
    "Reduce narrative in favor of engineering evidence"
  ]
},
{
"id": "16021-1",
"teamName": "TechnoManiacs",
"teamNumber": 16021,
"country": "USA",
"city": "Acton, Massachusetts",
"season": "2024 Into The Deep",
"level": "Regionals",
"stars": "★★★★☆",
"score": "41 / 55",
"award": "Think Award Winner",

"cover": "/portfolios/16021-1/cover.png",
"pdf": "https://drive.google.com/file/d/1a3pHSCByoilMvQz-sRVfAyqs2eZjdnYx/view?usp=sharing",

"summary":
"An elite student-driven engineering portfolio with extreme technical depth, rigorous iteration logic, advanced software architecture, and a strong open-source philosophy. Outreach is authentic and impactful within the FTC ecosystem, but broader societal scale and long-term sustainability fall slightly short of Inspire-level benchmarks.",

"awardsBreakdown": [
["Inspire", "4 / 5"],
["Reach", "3 / 5"],
["Sustain", "3 / 5"],
["Connect", "4 / 5"],
["Design", "5 / 5"],
["Innovate", "5 / 5"],
["Control", "4 / 5"]
],

"criteria": [
["Judging Questions Alignment", "4 / 5"],
["Engineering Thinking", "5 / 5"],
["Technical Depth", "5 / 5"],
["Outreach & Impact", "3 / 5"],
["Evidence & Proof", "4 / 5"],
["Clarity & Structure", "4 / 5"],
["Claim Realism", "5 / 5"],
["Design as Tool", "5 / 5"]
],

"strengths": [
"World-class engineering rigor with explicit trade-offs, cost-benefit analyses, failure modes, and iteration timelines across all subsystems",
"Advanced software systems including finite state machines, custom OpenCV pipelines, Pedro Pathing, and performance-driven architecture decisions",
"Exceptional open-source contribution culture with documented downstream impact on multiple competitive FTC teams"
],

"weaknesses": [
"Outreach impact is concentrated mainly within the existing FIRST community rather than broader external audiences",
"Sustainability relies heavily on graduating veterans, with limited proof of long-term continuity beyond this season",
"Inspire narrative is understated and framed more as legacy reflection than future-oriented transformation"
],

"improvements": [
"Expand outreach beyond FTC by translating open-source engineering into formal workshops, curricula, or regional programs",
"Demonstrate sustainability through successor training pipelines with measurable outcomes after senior graduation",
"Strengthen Inspire positioning by explicitly connecting student-led engineering excellence to long-term community change"
],

"benchmarkComparison":
"Closer to Team Without a Cool Acronym than Rebel Robotics in engineering philosophy and documentation depth, but slightly below both in Inspire-level societal scale and sustained multi-year impact."
},

{
"id": "16461-1",
"teamName": "Infinite Turtles",
"teamNumber": 16461,
"country": "USA",
"city": "Matthews, North Carolina",
"season": "2021 Freight Frenzy",
"level": "Nationals",
"stars": "★★★★★",
"score": "47 / 55",
"award": "Innovate Award Winner",

"cover": "/portfolios/16461-1/cover.png",
"pdf": "https://drive.google.com/file/d/1IZx1IDDLVcXyBYk8sxCHLSwYZe3N-ltB/view?usp=sharing",

"summary":
"A world-class FTC engineering and outreach portfolio demonstrating exceptional technical originality, deep engineering reasoning, large-scale sustainable outreach, and verified global impact. Engineering decisions are rigorously justified with simulations, calculations, and iteration histories, while outreach programs show permanence, scale, and measurable influence across the global FTC ecosystem.",

"awardsBreakdown": [
["Inspire", "5 / 5"],
["Reach", "5 / 5"],
["Sustain", "5 / 5"],
["Connect", "5 / 5"],
["Design", "5 / 5"],
["Innovate", "5 / 5"],
["Control", "4 / 5"]
],

"criteria": [
["Judging Questions Alignment", "5 / 5"],
["Engineering Thinking", "5 / 5"],
["Technical Depth", "5 / 5"],
["Outreach & Impact", "5 / 5"],
["Evidence & Proof", "5 / 5"],
["Clarity & Structure", "4 / 5"],
["Claim Realism", "5 / 5"],
["Design as Tool", "5 / 5"]
],

"strengths": [
"Benchmark-level engineering with novel mechanisms (locking mecanum, chain differential, advanced drivetrain simulation) supported by quantified performance gains",
"Massive, sustained, and global outreach impact through public resources (gm0, COREFTC, FTC Files) with independently verifiable reach and long-term value",
"Exceptional engineering thinking with explicit trade-offs, failed iterations, physics-based reasoning, and clear lessons learned"
],

"weaknesses": [
"Portfolio density is extremely high, risking cognitive overload during a 5–7 minute judging review",
"Control systems are strong but slightly less emphasized than mechanical and outreach excellence",
"Visual hierarchy could be simplified to guide judges faster to Inspire-level highlights"
],

"improvements": [
"Condense selected technical sections to highlight the most competition-critical mechanisms first",
"Explicitly summarize control performance metrics (consistency, error reduction) in fewer visuals",
"Add a one-page Inspire synthesis tying engineering, outreach, and sustainability into a single narrative arc"
],

"benchmarkComparison":
"Directly comparable to Team Without a Cool Acronym at the Inspire/Champions level due to equivalent technical originality, rigorous engineering justification, and unmatched global outreach permanence. Clearly exceeds Rebel Robotics in outreach scale and long-term informational impact."
},

{
"id": "14270-1",
"teamName": "Quantum Robotics",
"teamNumber": 14270,
"country": "Romania",
"city": "Bucharest",
"season": "2021 Power Play",
"level": "Nationals",
"stars": "★★★★☆",
"score": "41 / 55",
"award": "Motivate Award Winner",

"cover": "/portfolios/14270-1/cover.png",
"pdf": "https://drive.google.com/file/d/1dwSqUKUmMU5szriGbvFwJm2utsyf9px1/view?usp=sharing",

"summary":
"A very strong, engineering-driven FTC portfolio with deep mechanical design, real calculations, clear trade-offs, and structured documentation. Outreach is broad and sustained at national level, though impact metrics are often descriptive rather than rigorously quantified. Competitive at Worlds level, but not fully comparable to global Inspire benchmarks.",

"awardsBreakdown": [
["Inspire", "4 / 5"],
["Reach", "4 / 5"],
["Sustain", "4 / 5"],
["Connect", "4 / 5"],
["Design", "5 / 5"],
["Innovate", "4 / 5"],
["Control", "4 / 5"]
],

"criteria": [
["Judging Questions Alignment", "4 / 5"],
["Engineering Thinking", "5 / 5"],
["Technical Depth", "5 / 5"],
["Outreach & Impact", "4 / 5"],
["Evidence & Proof", "4 / 5"],
["Clarity & Structure", "4 / 5"],
["Claim Realism", "4 / 5"],
["Design as Tool", "5 / 5"]
],

"strengths": [
"Exceptional mechanical engineering depth with real calculations, force analysis, gear ratios, elasticity modeling, and clear trade-off discussions across drivetrain, intake, and outtake systems.",
"Design visuals directly support understanding of engineering decisions rather than acting as decoration; CAD, diagrams, and formulas are well integrated.",
"Large-scale, multi-year outreach and ecosystem involvement at national level, including events, workshops, refereeing, advocacy, and partnerships."
],

"weaknesses": [
"Outreach impact is often described in activities and scope but lacks consistently quantified outcomes (long-term learning results, retention, measurable regional change).",
"Sustainability and funding sections are strong structurally but rely partly on future intent rather than demonstrated multi-year outcomes.",
"Some claims of influence and reach are broad and narrative-driven rather than backed by hard comparative metrics."
],

"improvements": [
"Add quantified impact metrics for outreach (pre/post assessments, growth over years, comparative regional baselines, follow-up tracking).",
"Explicitly connect outreach outcomes to Inspire criteria using direct cause–effect evidence rather than activity lists.",
"Include clearer comparisons showing why engineering solutions outperform realistic alternatives used by other high-level FTC teams."
],

"benchmarkComparison":
"Closer to a strong Worlds-level portfolio below the Inspire benchmark. Significantly above average FTC and far from Yaku/Crowns baseline, but still not fully comparable to Team Without a Cool Acronym or Rebel Robotics due to less rigorously quantified outreach impact and Inspire-level narrative integration."
},

{
"id": "19706-1",
"teamName": "Potential Energy",
"teamNumber": 19706,
"country": "USA",
"city": "Mounds View, Minnesota",
"season": "2023 Centerstage",
"level": "Worlds",
"stars": "★★★★☆",
"score": "47 / 55",
"award": "Think Award Winner",

"cover": "/portfolios/19706-1/cover.png",
"pdf": "https://drive.google.com/file/d/1d1-wJUnh9qGTINNEUzANms6CJU3p3DCd/view?usp=sharing",

"summary":
"An exceptionally strong Worlds-level FTC engineering portfolio combining deep, well-argued mechanical and software design with rare, evidence-based advocacy and sustained outreach. Demonstrates real trade-offs, math-driven decisions, and measurable long-term impact. Falls slightly short of absolute Inspire benchmark only due to presentation density and limited global-scale replication.",

"awardsBreakdown": [
["Inspire", "4 / 5"],
["Reach", "5 / 5"],
["Sustain", "5 / 5"],
["Connect", "5 / 5"],
["Design", "5 / 5"],
["Innovate", "4 / 5"],
["Control", "4 / 5"]
],

"criteria": [
["Judging Questions Alignment", "5 / 5"],
["Engineering Thinking", "5 / 5"],
["Technical Depth", "5 / 5"],
["Outreach & Impact", "5 / 5"],
["Evidence & Proof", "5 / 5"],
["Clarity & Structure", "4 / 5"],
["Claim Realism", "5 / 5"],
["Design as Tool", "5 / 5"]
],

"strengths": [
"Rare, documented advocacy impact with verifiable policy outcomes, including legislators citing the team and a confirmed $730,000 grant benefiting the PDP.",
"Worlds-level engineering rigor with explicit calculations, stress analysis, geometry, torque math, odometry-based control, and software architecture tied directly to design decisions.",
"Sustained, multi-year outreach ecosystem (Project Momentum) integrating mentoring, community engagement, and advocacy with quantified person-hours and continuation evidence."
],

"weaknesses": [
"Portfolio is extremely dense; time-to-comprehension within a 5–7 minute judging window is borderline despite strong structure.",
"Innovate and Control aspects are strong but not uniquely differentiated relative to top 1% Worlds software leaders.",
"International impact exists but is limited in scale compared to global Inspire benchmarks."
],

"improvements": [
"Reduce narrative density by highlighting fewer but higher-impact engineering stories explicitly mapped to award criteria.",
"Strengthen Innovate and Control positioning by benchmarking algorithms and autonomy performance directly against top Worlds peers.",
"Expand Project Momentum internationally with replicated, data-tracked programs to move closer to absolute Inspire benchmark."
],

"benchmarkComparison":
"Closer to Rebel Robotics than to any mid-level or baseline portfolio. Clearly far above Yaku or Crowns and among the strongest Worlds portfolios. Slightly below Team Without a Cool Acronym level due to presentation density and marginally less global systemic reach, but firmly Inspire/Champions-tier competitive."
},

{
"id": "6165-1",
"teamName": "MSET Cuttlefish",
"teamNumber": 6165,
"country": "USA",
"city": "San Jose, California",
"season": "2021 Freight Frenzy",
"level": "Worlds",
"stars": "★★★★★",
"score": "52 / 55",
"award": "Inspire Award 2nd place",

"cover": "/portfolios/6165-1/cover.png",
"pdf": "https://drive.google.com/file/d/1Oq6fiOUk0IsToTmRHCecBNpT3_kuqOic/view?usp=sharing",

"summary":
"A world-class Inspire/Champions-level FTC portfolio demonstrating exceptional engineering rigor, original algorithms, open-source contributions, and one of the strongest documented global outreach and advocacy ecosystems in FTC. Fully comparable to top international benchmarks, with sustained, scalable, and verifiable impact far beyond competition performance.",

"awardsBreakdown": [
["Inspire", "5 / 5"],
["Reach", "5 / 5"],
["Sustain", "5 / 5"],
["Connect", "5 / 5"],
["Design", "5 / 5"],
["Innovate", "5 / 5"],
["Control", "5 / 5"]
],

"criteria": [
["Judging Questions Alignment", "5 / 5"],
["Engineering Thinking", "5 / 5"],
["Technical Depth", "5 / 5"],
["Outreach & Impact", "5 / 5"],
["Evidence & Proof", "5 / 5"],
["Clarity & Structure", "4 / 5"],
["Claim Realism", "5 / 5"],
["Design as Tool", "5 / 5"]
],

"strengths": [
"Top-tier engineering innovation including custom Ramsete controller adapted from FRC to FTC, active current limiting, independent suspension drivetrain, inertial compensation, and sensor-fusion localization, all clearly motivated by constraints and validated through iteration.",
"Extraordinary, multi-year, global outreach ecosystem (FishConnect, TeamTrack, ZippyPrints, Enable the Future, national advocacy) with measurable scale, replication, open access, and sustained adoption across dozens of teams and multiple countries.",
"Exceptional evidence quality: concrete metrics (users, countries, teams mentored), open-source code, deployed apps with real users, national-level policy advocacy, and manufacturing-quality assistive devices."
],

"weaknesses": [
"Portfolio density is extremely high; some judges may struggle to absorb full scope within limited review time.",
"Minor reduction in readability due to heavy technical and outreach breadth on individual pages.",
"Control and Innovate sections are extremely strong but compete internally for attention rather than being distilled into a single flagship narrative."
],

"improvements": [
"Further compress presentation by explicitly tagging each major section to Inspire subcriteria for faster judge navigation.",
"Highlight one or two flagship engineering breakthroughs and one flagship outreach system as primary narratives, with others clearly labeled as supporting evidence.",
"Add longitudinal outcome tracking (year-over-year continuation metrics) for legacy projects like TeamTrack and FishConnect to further strengthen sustainability proof."
],

"benchmarkComparison":
"Directly comparable to Team Without a Cool Acronym and Rebel Robotics. This portfolio meets or exceeds Inspire/Champions-level standards through original engineering contributions, global-scale outreach systems, and verifiable long-term impact. Firmly not comparable to Yaku or Crowns and sits in the absolute top tier of FTC portfolios worldwide."
},

{
"id": "18317-1",
"teamName": "Steel Eels",
"teamNumber": 18317,
"country": "USA",
"city": "Gainesville, Florida",
"season": "2022 Power Play",
"level": "Worlds",
"stars": "★★★☆☆",
"score": "34 / 55",
"award": "Motivate Award 2nd place",

"cover": "/portfolios/18317-1/cover.png",
"pdf": "https://drive.google.com/file/d/1AY8NUbjwbhh-INfcDFghtn5EvYc3quWp/view?usp=sharing",

"summary":
"A solid mid-level FTC portfolio with extensive local and state-level outreach and clear effort toward sustainability and inclusivity. Engineering is competently documented with iteration history, but technical depth and trade-off rigor are below Worlds standards. Competitive for outreach-focused awards at state level, not an Inspire contender.",

"awardsBreakdown": [
["Inspire", "2 / 5"],
["Reach", "4 / 5"],
["Sustain", "4 / 5"],
["Connect", "3 / 5"],
["Design", "3 / 5"],
["Innovate", "2 / 5"],
["Control", "3 / 5"]
],

"criteria": [
["Judging Questions Alignment", "3 / 5"],
["Engineering Thinking", "3 / 5"],
["Technical Depth", "3 / 5"],
["Outreach & Impact", "4 / 5"],
["Evidence & Proof", "4 / 5"],
["Clarity & Structure", "4 / 5"],
["Claim Realism", "4 / 5"],
["Design as Tool", "3 / 5"]
],

"strengths": [
"Large volume of documented outreach with concrete metrics (events, hours, people reached) at local and state levels.",
"Clear sustainability practices including grants, fundraising, sponsor acquisition, and structured team management.",
"Good use of iteration logs and problem/solution tables demonstrating learning and reflection over the season."
],

"weaknesses": [
"Engineering decisions are often described but not deeply justified with quantitative trade-offs or alternative comparisons.",
"Technical sections rely heavily on common FTC patterns (Road Runner, PIDF, dead wheels) without unique innovation or benchmarking.",
"Outreach impact is broad but mostly local; limited evidence of long-term regional or national systemic change."
],

"improvements": [
"Add explicit trade-off analysis comparing multiple mechanism concepts with quantified pros/cons and rejection rationale.",
"Benchmark robot performance and algorithms against high-performing peer teams to demonstrate competitive technical positioning.",
"Convert outreach volume into longitudinal impact by tracking participant retention, skill growth, and program continuation over time."
],

"benchmarkComparison":
"Closer to a solid mid-tier FTC portfolio than to Inspire benchmarks. Clearly stronger than baseline examples like Yaku or Crowns, but far below Team Without a Cool Acronym or Rebel Robotics due to limited technical originality and non-systemic outreach impact."
},

{
"id": "19213-1",
"teamName": "Mystery",
"teamNumber": 19213,
"country": "Taiwan",
"city": "Tainan",
"season": "2023 Centerstage",
"level": "Nationals",
"stars": "★★★☆☆",
"score": "33 / 55",
"award": "Inspire Award Winner",

"cover": "/portfolios/19213-1/cover.png",
"pdf": "https://drive.google.com/file/d/1yzmLqKysMR47ZeVFSSG1yIqr9F3IOlaU/view?usp=sharing",

"summary":
"A well-organized, outreach-heavy FTC portfolio with long-term local impact and clear community growth evidence. Engineering is functional and reliable but conservative, relying on modular simplicity and FTC Blocks rather than advanced algorithms or quantitative trade-offs. Strong at regional and national level for Reach, not competitive for Inspire at Worlds.",

"awardsBreakdown": [
["Inspire", "2 / 5"],
["Reach", "5 / 5"],
["Sustain", "4 / 5"],
["Connect", "3 / 5"],
["Design", "3 / 5"],
["Innovate", "2 / 5"],
["Control", "2 / 5"]
],

"criteria": [
["Judging Questions Alignment", "3 / 5"],
["Engineering Thinking", "3 / 5"],
["Technical Depth", "2 / 5"],
["Outreach & Impact", "5 / 5"],
["Evidence & Proof", "4 / 5"],
["Clarity & Structure", "4 / 5"],
["Claim Realism", "5 / 5"],
["Design as Tool", "3 / 5"]
],

"strengths": [
"Exceptionally strong, long-term outreach with measured regional impact: FTC teams in Tainan grew from 1 to 11, directly linked to team promotion and mentorship activities.",
"Clear sustainability through seven-year continuity, senior-to-junior knowledge transfer, diversified funding, and realistic financial planning.",
"Portfolio is readable, logically structured, and uses visuals to support understanding rather than hide content."
],

"weaknesses": [
"Technical depth is limited: reliance on FTC Blocks, lack of custom algorithms, minimal control theory, and no benchmarking against high-level FTC solutions.",
"Engineering trade-offs are mostly qualitative; few calculations, rejected alternatives, or quantified performance comparisons.",
"Robot design prioritizes simplicity and repairability over competitive optimization, limiting Innovate and Control potential."
],

"improvements": [
"Introduce quantitative engineering analysis: cycle-time comparisons, sensor accuracy statistics, and mechanical trade-off tables.",
"Migrate critical subsystems (auto navigation, control logic) to text-based programming with clearer algorithmic justification.",
"Explicitly connect outreach outcomes to Inspire criteria by showing how community growth feeds back into FTC ecosystem leadership."
],

"benchmarkComparison":
"Much closer to a strong Reach-focused national portfolio than to Inspire benchmarks. Far above baseline portfolios like Yaku or Crowns in outreach impact, but clearly below Team Without a Cool Acronym and Rebel Robotics due to limited technical depth and conservative engineering choices."
},

{
"id": "23511-1",
"teamName": "Seattle Solvers",
"teamNumber": 23511,
"country": "USA",
"city": "Seattle, Washington",
"season": "2024 Into the Deep",
"level": "Regionals",
"stars": "★★★★☆",
"score": "44 / 55",
"award": "Think Award Winner",

"cover": "/portfolios/23511-1/cover.png",
"pdf": "https://drive.google.com/file/d/1R4RXE7qOjKOF38JKxg0HyHTvHHyXvSUl/view?usp=sharing",

"summary":
"A very strong, engineering-heavy FTC portfolio with clear calculations, iteration history, advanced control architecture, and open-source contributions. Outreach is meaningful and sustained with some national and international elements, but impact metrics and Inspire-level synthesis are not yet fully comparable to global benchmarks.",

"awardsBreakdown": [
["Inspire", "4 / 5"],
["Reach", "4 / 5"],
["Sustain", "4 / 5"],
["Connect", "4 / 5"],
["Design", "5 / 5"],
["Innovate", "4 / 5"],
["Control", "5 / 5"]
],

"criteria": [
["Judging Questions Alignment", "4 / 5"],
["Engineering Thinking", "5 / 5"],
["Technical Depth", "5 / 5"],
["Outreach & Impact", "4 / 5"],
["Evidence & Proof", "5 / 5"],
["Clarity & Structure", "4 / 5"],
["Claim Realism", "5 / 5"],
["Design as Tool", "5 / 5"]
],

"strengths": [
"Exceptional engineering rigor with real calculations (torque, safety factors), detailed iteration logs, and explicit trade-offs across drivetrain, slides, intake, deposit, and control systems.",
"Advanced software stack including RoadRunner, custom pathing, PDF control, FSM-based architecture, and forked FTC libraries, all clearly justified and documented.",
"Strong evidence quality: diagrams, math, performance comparisons (cycle times), and open-source CAD/code adoption metrics."
],

"weaknesses": [
"Outreach impact is strong but not yet Inspire-benchmark scale; some activities emphasize participation over long-term measurable outcomes.",
"Portfolio density is high, requiring careful navigation to fully absorb within a 5–7 minute judging window.",
"Global or policy-level advocacy and large-scale ecosystem leadership are limited compared to top 1% Inspire portfolios."
],

"improvements": [
"Add clearer longitudinal impact metrics for outreach programs (retention, growth over years, replication outcomes).",
"Explicitly map major engineering achievements to Inspire subcriteria to strengthen cross-award synthesis.",
"Distill one flagship outreach system and one flagship engineering breakthrough as primary Inspire narratives."
],

"benchmarkComparison":
"Closer to Rebel Robotics than to mid-level FTC portfolios. Clearly far above baseline examples like Yaku or Crowns and competitive at Worlds level for Design and Control, but still slightly below Team Without a Cool Acronym in outreach scale and Inspire-level integration."
},



{
"id": "31445-1",
"teamName": "V-Legacy",
"teamNumber": 31445,
"country": "Brazil",
"city": "Barra dos Coqueiros / Aracaju, Sergipe",
"season": "2023 Centerstage",
"level": "Regionals",
"stars": "★★★☆☆",
"score": "31 / 55",
"award": "Not specified",

"cover": "/portfolios/31445-1/cover.png",
"pdf": "https://drive.google.com/file/d/1oFu8NF_tN4UQp7AsKFaxnStGvinGbEX_/view?usp=sharing",

"summary":
"A solid mid-level FTC portfolio with a strong technical focus and clear engineering depth. The team demonstrates a well-structured design process, supported by calculations and explicit trade-offs. Outreach activity is present and active but remains mostly local, with limited quantitative evidence of long-term or scalable impact. Visual design is strong and generally supports understanding, though the portfolio is sometimes text-heavy and leans toward storytelling over metrics.",

"awardsBreakdown": [
["Inspire", "3 / 5"],
["Reach", "3 / 5"],
["Sustain", "3 / 5"],
["Connect", "3 / 5"],
["Design", "4 / 5"],
["Innovate", "3 / 5"],
["Control", "4 / 5"]
],

"criteria": [
["Judging Questions Alignment", "3 / 5"],
["Engineering Thinking", "4 / 5"],
["Technical Depth", "4 / 5"],
["Outreach & Impact", "3 / 5"],
["Evidence & Proof", "3 / 5"],
["Clarity & Structure", "3 / 5"],
["Claim Realism", "4 / 5"],
["Design as Tool", "4 / 5"]
],

"strengths": [
"Clearly demonstrated engineering process with iterations, rejected concepts, and justified trade-offs.",
"Strong technical depth for a regional-level team, including pulley ratios, speed calculations, PID control, Limelight, and AprilTag integration.",
"Visual design effectively supports understanding of mechanisms and system architecture rather than obscuring them."
],

"weaknesses": [
"Outreach is primarily local and event-based, lacking a sustained regional or national program.",
"Limited measurable impact metrics such as repeat engagement, school coverage, or long-term outcomes.",
"Portfolio density and text volume reduce readability within the 5–7 minute judging window."
],

"improvements": [
"Transform outreach activities into a structured, repeatable program with partners and defined KPIs.",
"Add quantitative impact data: number of schools reached, recurring events, participant retention, and growth metrics.",
"Streamline narrative sections and align each page more explicitly with FTC Judging Questions."
],

"benchmarkComparison":
"The portfolio is clearly stronger than baseline examples such as Yaku or Crowns due to its engineering rigor and documented trade-offs, but it remains well below Team Without a Cool Acronym and Rebel Robotics because of limited outreach scale and the absence of sustained, evidence-backed impact. It aligns with a competitive but non-elite FTC level."
},


{
"id": "23532-1",
"teamName": "ITKAN MYCC",
"teamNumber": 23532,
"country": "USA",
"city": "Raleigh, North Carolina",
"season": "2025 Decode",
"level": "Regionals",
"stars": "★★★★☆",
"score": "41 / 55",
"award": "Not specified",

"cover": "/portfolios/23532-1/cover.png",
"pdf": "https://drive.google.com/file/d/1oLPKTkCyPpDeFcYfQJyPlRLkAv1akf_C/view?usp=sharing",

"summary":
"A strong, technically mature FTC portfolio with clear engineering rigor, explicit trade-offs, and unusually solid outreach for a regional-level team. The robot design is intentionally simple but deeply optimized, supported by detailed mechanical iterations, software architecture, and reliability systems. Outreach is structured, multi-directional, and includes mentorship, Open Alliance contributions, and inter-team collaboration, though large-scale measurable community impact is still developing.",

"awardsBreakdown": [
["Inspire", "4 / 5"],
["Reach", "4 / 5"],
["Sustain", "4 / 5"],
["Connect", "4 / 5"],
["Design", "5 / 5"],
["Innovate", "4 / 5"],
["Control", "5 / 5"]
],

"criteria": [
["Judging Questions Alignment", "4 / 5"],
["Engineering Thinking", "5 / 5"],
["Technical Depth", "5 / 5"],
["Outreach & Impact", "4 / 5"],
["Evidence & Proof", "4 / 5"],
["Clarity & Structure", "4 / 5"],
["Claim Realism", "5 / 5"],
["Design as Tool", "5 / 5"]
],

"strengths": [
"Exceptional engineering thinking: clear design alternatives, explicit pros/cons, and justified final decisions across drivetrain, intake, turret, and shooter.",
"High technical depth in both hardware and software, including PIDF control, mathematical modeling, odometry + vision fusion, autonomous optimization, and reliability fail-safes.",
"Strong outreach quality for FTC: Open Alliance with real adoption, direct mentoring of multiple FTC teams, and technical knowledge sharing beyond superficial events."
],

"weaknesses": [
"Outreach impact is strong within FTC but less demonstrated outside the robotics community (schools, districts, long-term pipelines).",
"Most outreach metrics focus on participation and collaboration, with limited quantified long-term outcomes.",
"Portfolio is long and dense; some sections exceed what is strictly needed for a 5–7 minute judging review."
],

"improvements": [
"Expand outreach beyond FTC teams into a sustained external STEM pipeline with schools or community programs and track long-term engagement metrics.",
"Add clearer quantitative impact indicators (students reached, retention, repeat workshops, year-over-year growth).",
"Condense or visually summarize parts of the software sections to improve first-pass judge readability without losing depth."
],

"benchmarkComparison":
"This portfolio is clearly far above baseline examples like Yaku or Crowns and approaches Worlds-level quality. While it does not yet match Team Without a Cool Acronym or Rebel Robotics in scale of outreach impact, its engineering depth, documentation quality, and realism are directly comparable. Overall, it aligns with a strong Worlds-contender tier just below the global gold standard."
},


{
"id": "23393-1",
"teamName": "JFK Robotics",
"teamNumber": 23393,
"country": "USA",
"city": "Sacramento, California",
"season": "2025 Decode",
"level": "Regionals",
"stars": "★★★★☆",
"score": "42 / 55",
"award": "Not Specified",

"cover": "/portfolios/23393-1/cover.png",
"pdf": "https://drive.google.com/file/d/1Ii3-_pkg4s-18752Bt0V9UI9CfhRo5Oz/view?usp=sharing",

"summary":
"A very strong engineering-focused FTC portfolio with exceptional mechanical depth, iteration rigor, and manufacturing maturity. The team demonstrates a professional-grade design process, including full pre-manufacturing CAD, extensive prototyping, in-house CNC fabrication, and well-justified system-level decisions. Outreach is broad and diverse but partially diluted by its breadth and uneven depth. Overall, this is a competitive Worlds-level engineering portfolio slightly held back by outreach structure and clarity.",

"awardsBreakdown": [
["Inspire", "4 / 5"],
["Reach", "4 / 5"],
["Sustain", "4 / 5"],
["Connect", "4 / 5"],
["Design", "5 / 5"],
["Innovate", "4 / 5"],
["Control", "5 / 5"]
],

"criteria": [
["Judging Questions Alignment", "4 / 5"],
["Engineering Thinking", "5 / 5"],
["Technical Depth", "5 / 5"],
["Outreach & Impact", "4 / 5"],
["Evidence & Proof", "4 / 5"],
["Clarity & Structure", "3 / 5"],
["Claim Realism", "5 / 5"],
["Design as Tool", "5 / 5"]
],

"strengths": [
"Elite mechanical engineering depth: clear evolution from concept to final robot with explicit failures, redesigns, and justified trade-offs.",
"Outstanding manufacturing capability for FTC: in-house CNC milling, CAM workflows, fixture design, powder coating, and DFM thinking.",
"Strong software-engineering discipline, including RoadRunner-based autonomy, Take-Back-Half shooter control, modular action architecture, and Limelight integration."
],

"weaknesses": [
"Outreach is wide but not always systematized; many activities are one-off or loosely connected under a single long-term strategy.",
"Portfolio readability suffers from density and length; several sections exceed what judges can realistically process in 5–7 minutes.",
"Impact metrics for outreach and mentoring are inconsistently quantified or tied to long-term outcomes."
],

"improvements": [
"Reframe outreach under 2–3 flagship, long-term programs with clear goals, timelines, and measurable impact.",
"Aggressively condense descriptive engineering text using diagrams, tables, and iteration summaries for faster judge comprehension.",
"Explicitly map outreach and engineering sections to specific FTC Judging Questions to strengthen Inspire and Reach alignment."
],

"benchmarkComparison":
"This portfolio is far above baseline examples such as Yaku or Crowns and sits just below the top global benchmark. In engineering rigor, manufacturing maturity, and design documentation, it is directly comparable to Worlds-level teams and approaches the standard of Team Without a Cool Acronym and Rebel Robotics. It falls short of the absolute top tier primarily due to outreach structure and judge-time efficiency, not technical quality."
},

{
  "id": "19163-1",
  "teamName": "MLP",
  "teamNumber": 19163,
  "country": "Kazakhstan",
  "city": "Almaty",
  "season": "2024 Into The Deep",
  "level": "Nationals",
  "stars": "★☆☆☆☆",
  "score": "14 / 55",
  "award": "Innovate Award Winner",

  "cover": "/portfolios/19163-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1U0aTnROmxdMxRC58vMFjkdBZ57ajbda_/view",

  "summary":
    "A weak FTC portfolio that demonstrates basic participation in the competition but lacks the depth, structure, and evidence required for meaningful award consideration. Engineering content is fragmented and overly complex without clear justification, while outreach is narrowly focused within the FTC ecosystem and does not demonstrate sustained or scalable impact. Overall, the portfolio does not meet the expectations of a competitive FTC standard.",

  "awardsBreakdown": [
    ["Inspire", "1 / 5"],
    ["Reach", "1 / 5"],
    ["Sustain", "1 / 5"],
    ["Connect", "2 / 5"],
    ["Design", "2 / 5"],
    ["Innovate", "1 / 5"],
    ["Control", "2 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "1 / 5"],
    ["Engineering Thinking", "2 / 5"],
    ["Technical Depth", "2 / 5"],
    ["Outreach & Impact", "1 / 5"],
    ["Evidence & Proof", "2 / 5"],
    ["Clarity & Structure", "1 / 5"],
    ["Claim Realism", "2 / 5"],
    ["Design as Tool", "1 / 5"]
  ],

  "strengths": [
    "Demonstrates participation in FTC with exposure to advanced concepts.",
    "Includes references to real mechanisms and control approaches.",
    "Shows intent to document engineering and outreach activities."
  ],

  "weaknesses": [
    "Engineering explanations are overly dense and poorly structured, making it difficult to understand decisions within a 5–7 minute judging window.",
    "Outreach is largely limited to FTC teams and lacks scale, sustainability, and measurable societal impact.",
    "Many claims are presented without sufficient context, prioritization, or clear evidence tied to judging criteria."
  ],

  "improvements": [
    "Rebuild the portfolio structure around FTC Judging Questions with clear, minimal, and focused explanations.",
    "Reduce engineering sections to core decisions with simple metrics instead of advanced but poorly contextualized theory.",
    "Develop a basic, sustained outreach program with measurable results outside the FTC community."
  ],

  "benchmarkComparison":
    "This portfolio is closer to baseline or weak reference examples such as Yaku or Crowns than to competitive Worlds-level portfolios. It does not approach the standard set by Team Without a Cool Acronym or Rebel Robotics and currently reflects a low-impact, poorly optimized FTC portfolio."
},

{
  "id": "24697-1",
  "teamName": "SANA",
  "teamNumber": 24697,
  "country": "Kazakhstan",
  "city": "Almaty",
  "season": "2024 Into The Deep",
  "level": "Nationals",
  "stars": "★★★☆☆",
  "score": "33 / 55",
  "award": " Inspire Award 3rd place",

  "cover": "/portfolios/24697-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1xCYEDG1K6snAwD5XtDSbN_fojWJpVFJA/view?usp=sharing",

  "summary":
    "A solid and well-developed FTC portfolio that demonstrates clear engineering competence and active outreach, but does not reach a true Worlds or Champions-level standard. The portfolio shows strong effort and ambition, yet lacks the consistency, clarity, and globally competitive depth required for higher-tier evaluations.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "3 / 5"],
    ["Sustain", "3 / 5"],
    ["Connect", "3 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "3 / 5"],
    ["Control", "4 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "3 / 5"],
    ["Engineering Thinking", "4 / 5"],
    ["Technical Depth", "3 / 5"],
    ["Outreach & Impact", "3 / 5"],
    ["Evidence & Proof", "3 / 5"],
    ["Clarity & Structure", "3 / 5"],
    ["Claim Realism", "4 / 5"],
    ["Design as Tool", "3 / 5"]
  ],

  "strengths": [
    "Demonstrates clear FTC-level engineering understanding with multiple subsystems and iterations.",
    "Active outreach presence with visible engagement in the FTC and local STEM community.",
    "Claims and achievements are generally realistic and aligned with team capabilities."
  ],

  "weaknesses": [
    "Outreach impact is not presented as a fully sustained, scalable program with long-term metrics.",
    "Engineering sections lack consistent quantitative comparison and deeper trade-off justification.",
    "Portfolio structure and density reduce clarity under a 5–7 minute judging review."
  ],

  "improvements": [
    "Strengthen outreach by focusing on fewer but long-term programs with measurable impact.",
    "Add clearer engineering metrics, testing data, and explicit comparisons between design alternatives.",
    "Improve readability by simplifying layouts and tightening explanations around Judging Questions."
  ],

  "benchmarkComparison":
    "This portfolio is clearly above baseline examples such as Yaku or Crowns, but it is not comparable to Team Without a Cool Acronym or Rebel Robotics. It aligns most closely with a typical, competent FTC portfolio that is competitive at the national level but not at the global elite tier."
},
{
  "id": "17230-1",
  "teamName": "Aluminum Falcons",
  "teamNumber": 17230,
  "country": "USA",
  "city": "Utah",
  "season": "2025 Decode",
  "level": "Regionals",
  "stars": "★★★☆☆",
  "score": "34 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/17230-1/cover.png",
  "pdf": "/https://drive.google.com/file/d/1-7aVYQ8cHMVimqEcCNoZhcnUExx-s7yd/view?usp=sharing",

  "summary":
    "A solid and well-structured FTC portfolio that demonstrates clear understanding of the engineering process, organized team management, and active local outreach. The portfolio shows good alignment with FTC judging criteria and includes mathematical analysis, iteration, and outreach evidence. However, most efforts remain local and introductory in depth, placing the portfolio firmly at a competent FTC level rather than a Worlds-competitive standard.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "3 / 5"],
    ["Sustain", "3 / 5"],
    ["Connect", "3 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "3 / 5"],
    ["Control", "4 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "4 / 5"],
    ["Engineering Thinking", "3 / 5"],
    ["Technical Depth", "3 / 5"],
    ["Outreach & Impact", "3 / 5"],
    ["Evidence & Proof", "3 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "4 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Clear application of the engineering design process with documented iterations, trade-offs, and mathematical analysis.",
    "Well-organized portfolio structure that is easy to navigate within a judging time window.",
    "Active outreach including STEM nights, founding an FLL team, and consistent local community engagement."
  ],

  "weaknesses": [
    "Outreach impact is primarily local and short-term, with limited evidence of sustained regional or national programs.",
    "Engineering depth is solid but not competitive with Worlds-level teams; many solutions follow established FTC patterns.",
    "Quantitative performance metrics and long-term impact measurements are limited."
  ],

  "improvements": [
    "Develop 1–2 long-term outreach programs with measurable outcomes tracked across multiple seasons.",
    "Add deeper quantitative engineering validation such as performance testing data, cycle time analysis, and failure rates.",
    "Condense descriptive sections and strengthen direct mapping to Judging Questions to improve Inspire alignment."
  ],

  "benchmarkComparison":
    "This portfolio is clearly stronger than baseline examples such as Yaku or Crowns, but well below Team Without a Cool Acronym and Rebel Robotics. It aligns most closely with a typical, competent FTC portfolio that performs well at regional competitions without reaching a Worlds-contender level."
},
{
  "id": "27003-1",
  "teamName": "Churchill Hawks 2.0",
  "teamNumber": 27003,
  "country": "USA",
  "city": "New York",
  "season": "2025 Decode",
  "level": "Regionals",
  "stars": "★★★☆☆",
  "score": "29 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/27003-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1xAIgO9pbqSrlXrH7iZUAcGi1-wLerVmz/view?usp=sharing",

  "summary":
    "A beginner-to-intermediate FTC engineering portfolio focused on team formation, learning process, and basic robot development. The portfolio clearly documents collaboration, reflection, and early-stage prototyping, but lacks technical depth, quantitative analysis, and structured outreach required for higher competitive tiers.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "2 / 5"],
    ["Sustain", "2 / 5"],
    ["Connect", "2 / 5"],
    ["Design", "3 / 5"],
    ["Innovate", "2 / 5"],
    ["Control", "2 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "3 / 5"],
    ["Engineering Thinking", "3 / 5"],
    ["Technical Depth", "2 / 5"],
    ["Outreach & Impact", "2 / 5"],
    ["Evidence & Proof", "2 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "4 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Clear documentation of team formation, mentoring support, and student growth in a rookie or early-stage FTC environment.",
    "Well-organized and visually clean portfolio that is easy to read within a short judging window.",
    "Demonstrates a genuine engineering process mindset through prototyping, iteration, and team reflection."
  ],

  "weaknesses": [
    "Limited technical depth: no calculations, performance metrics, or quantitative validation of design choices.",
    "Outreach is minimal and limited to internal school FLL mentoring and a single fundraising activity.",
    "Engineering decisions are described narratively without trade-off analysis or comparison to alternatives."
  ],

  "improvements": [
    "Add quantitative engineering data such as cycle times, success rates, testing results, and comparison tables.",
    "Develop a sustained outreach program beyond the school with measurable goals and repeat engagement.",
    "Explicitly document design trade-offs, failed alternatives, and reasons for final mechanism choices."
  ],

  "benchmarkComparison":
    "This portfolio is stronger than the weakest baseline examples due to clarity and honest documentation, but remains closer to the lower-mid FTC tier. It is not comparable to Team Without a Cool Acronym or Rebel Robotics and aligns with a developing team still building foundational engineering and outreach capacity."
},
{
  "id": "27832-1",
  "teamName": "Uly Dala",
  "teamNumber": 27832,
  "country": "Kazakhstan",
  "city": "Almaty",
  "season": "2024 Into The Deep",
  "level": "Regionals",
  "stars": "★★★☆☆",
  "score": "34 / 55",
  "award": "Inspire 2nd place",

  "cover": "/portfolios/27832-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1pKjQAeSlQ0kmjJe0G35AKsETrjwZPwxP/view?usp=sharing",

  "summary":
    "A solid, well-documented FTC portfolio with strong visual quality and clearly presented robot systems. The team demonstrates real engineering iteration, meaningful outreach activity, and active community engagement. However, much of the content remains descriptive rather than analytical, with limited quantitative validation and insufficient system-level trade-off justification to reach a Worlds-competitive tier.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "4 / 5"],
    ["Sustain", "3 / 5"],
    ["Connect", "4 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "3 / 5"],
    ["Control", "4 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "3 / 5"],
    ["Engineering Thinking", "3 / 5"],
    ["Technical Depth", "3 / 5"],
    ["Outreach & Impact", "4 / 5"],
    ["Evidence & Proof", "3 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "4 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Large-scale and diverse outreach activity including mentoring, workshops, camps, festivals, and partnerships, supported by hours, participant counts, and geographic reach.",
    "Clear visual presentation of robot subsystems with real iteration history, mechanical improvements, and documented failures and fixes.",
    "Good use of modern FTC technologies including odometry, LimeLight vision, Pedro Pathing, encoder-based control, and structured autonomous routines."
  ],

  "weaknesses": [
    "Engineering sections are often narrative-heavy, with limited comparative analysis between alternatives and incomplete performance metrics.",
    "Outreach impact is broad but not always framed as sustained flagship programs with long-term outcome tracking.",
    "Portfolio density is high, which reduces efficiency within a strict 5–7 minute judging review window."
  ],

  "improvements": [
    "Add explicit engineering trade-offs with numbers: cycle times, success rates, weight comparisons, and before/after performance tables.",
    "Reframe outreach into 2–3 long-term core programs with year-over-year metrics instead of listing many parallel activities.",
    "Introduce short executive summaries and decision tables to improve judge-time efficiency without losing depth."
  ],

  "benchmarkComparison":
    "This portfolio is clearly stronger than baseline examples such as Yaku or Crowns due to its scale of outreach, clean structure, and real engineering iteration. However, it is not comparable to Team Without a Cool Acronym or Rebel Robotics, as it lacks the depth of analytical engineering reasoning and tightly measured, sustained impact required for a Worlds-elite standard. It aligns with a strong national-level FTC portfolio."
},
{
  "id": "18597-1",
  "teamName": "RoboClovers – Delta",
  "teamNumber": 18597,
  "country": "USA",
  "city": "Winder, Georgia",
  "season": "2025 Decode",
  "level": "Regionals",
  "stars": "★★★☆☆",
  "score": "36 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/18597-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1U3OLbbI1Y5ndJ67QnHGeQQJ2LkZeX3Tw/view?usp=sharing",

  "summary":
    "A strong and well-rounded FTC portfolio with clear engineering process documentation, real iteration history, and solid community outreach. The team demonstrates maturity in planning, design iteration, and software architecture. However, while competitive at the regional level, the portfolio does not reach Worlds-level due to limited quantitative engineering validation and outreach impact that is primarily local rather than scalable or systemic.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "4 / 5"],
    ["Sustain", "4 / 5"],
    ["Connect", "4 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "3 / 5"],
    ["Control", "4 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "4 / 5"],
    ["Engineering Thinking", "4 / 5"],
    ["Technical Depth", "3 / 5"],
    ["Outreach & Impact", "4 / 5"],
    ["Evidence & Proof", "3 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "5 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Very clear engineering design process with documented iterations, failures, fixes, and decision rationale across drivetrain, intake, launcher, and software.",
    "Strong team organization and sustainability: annual business plan, budget planning, alumni involvement, FLL pipeline, and consistent school system support.",
    "Solid software maturity for FTC level, including modular architecture, Pedro Pathing, odometry, redundancy systems, and open-source code sharing."
  ],

  "weaknesses": [
    "Technical depth is mostly qualitative; limited hard performance metrics such as cycle times, accuracy percentages, or before/after numerical comparisons.",
    "Outreach impact, while broad and consistent, is largely local and not framed as scalable regional or national programs.",
    "Some sections rely on narrative explanations where concise tables or data summaries would improve judge-time efficiency."
  ],

  "improvements": [
    "Add quantitative engineering validation: launcher accuracy %, cycle time comparisons, autonomous consistency metrics, and weight/power trade-off tables.",
    "Reframe outreach into a small number of flagship programs with year-over-year growth metrics and clearly defined long-term goals.",
    "Condense descriptive sections using diagrams, charts, and iteration tables to improve readability within a 5–7 minute judging window."
  ],

  "benchmarkComparison":
    "This portfolio is clearly stronger than baseline examples such as Yaku or Crowns and represents a high-quality regional FTC standard. However, it is not comparable to Team Without a Cool Acronym or Rebel Robotics due to limited analytical depth and lack of large-scale, sustained outreach impact. It aligns with a solid, competitive FTC portfolio rather than a Worlds-contender tier."
},
{
  "id": "26886-1",
  "teamName": "Overchargers",
  "teamNumber": 26886,
  "country": "USA",
  "city": "Potomac, Maryland",
  "season": "2025 Decode",
  "level": "Regionals",
  "stars": "★★★☆☆",
  "score": "35 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/26886-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1GKU2DKIjYJFdshTZlZTbyTpVmm0H8z29/view?usp=sharing",

  "summary":
    "A strong second-year FTC engineering portfolio with clear structure, disciplined project management, and notable technical ambition. The team demonstrates real engineering thinking through requirements definition, probability-based decision-making, and advanced control concepts. Outreach is active and well-documented, but remains mostly regional in scope and does not yet demonstrate the scale or long-term sustainability required for a Worlds-level portfolio.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "4 / 5"],
    ["Sustain", "4 / 5"],
    ["Connect", "4 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "4 / 5"],
    ["Control", "4 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "4 / 5"],
    ["Engineering Thinking", "4 / 5"],
    ["Technical Depth", "4 / 5"],
    ["Outreach & Impact", "3 / 5"],
    ["Evidence & Proof", "4 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "5 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Clear use of a formal engineering process adapted from NASA project life cycle, including requirements reviews and design reviews.",
    "Above-average technical depth for a second-year team, including probability-based design decisions, ballistic calculations, PD control, AprilTag vision, and RoadRunner integration.",
    "Well-documented outreach with concrete numbers: 5,000+ students reached, 30+ students mentored in summer programs, multiple FTC teams mentored, and advocacy at the county education board level."
  ],

  "weaknesses": [
    "Outreach impact, while broad, is mostly regional and event-based, with limited evidence of long-term longitudinal programs.",
    "Some engineering claims are described conceptually without full quantitative validation (cycle consistency, accuracy percentages, reliability metrics).",
    "Portfolio is dense and information-heavy, which may challenge judges within a strict 5–7 minute review window."
  ],

  "improvements": [
    "Convert outreach efforts into 1–2 flagship, multi-year programs with tracked retention, growth, and downstream impact.",
    "Add hard performance metrics such as shooting accuracy %, autonomous success rates, and cycle time comparisons.",
    "Introduce brief executive summaries and decision tables to further improve judge-time efficiency."
  ],

  "benchmarkComparison":
    "This portfolio is clearly stronger than baseline examples such as Yaku or Crowns and represents a solid, competitive regional FTC standard. It does not approach the global benchmark set by Team Without a Cool Acronym or Rebel Robotics due to limited outreach scalability and incomplete quantitative validation, placing it firmly in the mid-tier FTC range."
},
{
  "id": "18658-1",
  "teamName": "Purple Rain",
  "teamNumber": 18658,
  "country": "USA",
  "city": "Hammond, Louisiana",
  "season": "2025 Decode",
  "level": "Regionals",
  "stars": "★★☆☆☆",
  "score": "24 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/18658-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1XilQy96SAXtheUBH3teCI_4ceDTUjxve/view?usp=sharing",

  "summary":
    "A beginner-level FTC portfolio that focuses primarily on team introduction, basic robot description, and internal organization. The portfolio shows honest documentation of a developing team but lacks engineering depth, analytical reasoning, structured outreach, and evidence required for higher FTC award competitiveness.",

  "awardsBreakdown": [
    ["Inspire", "2 / 5"],
    ["Reach", "2 / 5"],
    ["Sustain", "2 / 5"],
    ["Connect", "2 / 5"],
    ["Design", "2 / 5"],
    ["Innovate", "2 / 5"],
    ["Control", "2 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "2 / 5"],
    ["Engineering Thinking", "2 / 5"],
    ["Technical Depth", "2 / 5"],
    ["Outreach & Impact", "2 / 5"],
    ["Evidence & Proof", "2 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "4 / 5"],
    ["Design as Tool", "3 / 5"]
  ],

  "strengths": [
    "Clear and honest presentation of team members, roles, and internal organization.",
    "Good visual consistency and clean layout that is easy to read for judges.",
    "Realistic claims that align with the team’s experience level and resources."
  ],

  "weaknesses": [
    "Engineering sections are descriptive only, with no calculations, trade-offs, testing data, or performance metrics.",
    "Outreach is minimal, consisting of only two events with no sustained program or measurable impact.",
    "No explicit alignment to FTC Judging Questions or award criteria beyond surface-level mentions."
  ],

  "improvements": [
    "Add engineering analysis such as design alternatives, trade-offs, testing results, and quantified robot performance.",
    "Develop a sustained outreach program with clear goals, repetition, and measurable impact.",
    "Explicitly structure the portfolio around FTC Judging Questions and award requirements."
  ],

  "benchmarkComparison":
    "This portfolio is closer to baseline examples such as Yaku or Crowns than to mid- or top-tier FTC portfolios. It reflects an early-stage team still building foundational engineering, outreach, and documentation skills."
},
{
  "id": "8300-1",
  "teamName": "Pinnacle",
  "teamNumber": 8300,
  "country": "USA",
  "city": "Shelby, North Carolina",
  "season": "2021 Freight Frenzy",
  "level": "Regionals",
  "stars": "★★★☆☆",
  "score": "32 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/8300-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1selknHuGTg-Y6qY0Y7lwyKXM99RUmIVq/view?usp=sharing",

  "summary":
    "A competent mid-tier FTC portfolio that clearly documents team structure, learning process, basic engineering iteration, and consistent local outreach. The portfolio shows honest reflection, sustained FLL mentoring, and a functional robot design, but remains largely descriptive with limited analytical depth, quantitative validation, and global competitiveness.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "3 / 5"],
    ["Sustain", "3 / 5"],
    ["Connect", "3 / 5"],
    ["Design", "3 / 5"],
    ["Innovate", "2 / 5"],
    ["Control", "3 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "3 / 5"],
    ["Engineering Thinking", "3 / 5"],
    ["Technical Depth", "2 / 5"],
    ["Outreach & Impact", "3 / 5"],
    ["Evidence & Proof", "3 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "4 / 5"],
    ["Design as Tool", "3 / 5"]
  ],

  "strengths": [
    "Clear documentation of team structure, sustainability challenges, and recovery after loss of experienced members.",
    "Consistent outreach with measurable effort: FLL mentoring, Girl Scout STEM sessions, community parades, and online content creation.",
    "Honest reflection and realistic claims aligned with the team’s actual competitive and technical level."
  ],

  "weaknesses": [
    "Engineering sections are mostly narrative, with minimal quantitative analysis, performance metrics, or formal trade-off evaluation.",
    "Technical depth in programming and mechanisms remains introductory compared to Worlds-level standards.",
    "Outreach impact is largely local and not framed as scalable, long-term flagship programs."
  ],

  "improvements": [
    "Add quantitative engineering validation such as cycle times, scoring consistency, autonomous success rates, and testing tables.",
    "Formalize outreach into 1–2 sustained programs with year-over-year metrics instead of listing many isolated activities.",
    "Introduce concise decision tables and summaries to better support judge review within a 5–7 minute window."
  ],

  "benchmarkComparison":
    "This portfolio is clearly stronger than the weakest baseline examples like Yaku or Crowns due to its structure, reflection, and sustained local outreach. However, it is not comparable to Team Without a Cool Acronym or Rebel Robotics and aligns most closely with a solid, typical FTC mid-tier portfolio."
},
{
  "id": "24331-1",
  "teamName": "Caesar Circuitry",
  "teamNumber": 24331,
  "country": "USA",
  "city": "Huntsville, Alabama",
  "season": "2023 Centerstage",
  "level": "Regionals",
  "stars": "★★★★☆",
  "score": "40 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/24331-1/cover.png",
  "pdf": "https://drive.google.com/file/d/11qAy83AGB9-EMn1ImQd3YtamS8jfdO-p/view?usp=sharing",

  "summary":
    "A very strong rookie FTC portfolio with unusually high engineering rigor, explicit trade-off analysis, and well-documented outreach impact. The team demonstrates mature system-level thinking, structured design processes, and advanced software concepts rarely seen at the regional level. Outreach is broad, quantified, and sustained, making this portfolio competitive beyond a typical rookie standard.",

  "awardsBreakdown": [
    ["Inspire", "4 / 5"],
    ["Reach", "4 / 5"],
    ["Sustain", "4 / 5"],
    ["Connect", "5 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "4 / 5"],
    ["Control", "5 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "4 / 5"],
    ["Engineering Thinking", "5 / 5"],
    ["Technical Depth", "5 / 5"],
    ["Outreach & Impact", "4 / 5"],
    ["Evidence & Proof", "4 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "5 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Exceptional engineering thinking for a rookie team: clear decision matrices, iteration counts, failure analysis, and explicit trade-offs across intake, outtake, slides, and endgame mechanisms.",
    "High technical depth in software and control: RoadRunner 1.0, feedforward vs PID justification, OpenCV color detection iterations, autonomous scoring breakdowns, and sensor fusion.",
    "Strong, well-evidenced outreach with scale and credibility: 10,000+ people reached, mentor recruitment, partnerships with Boeing, NASA, Dynetics, and sustained FIRST ecosystem support."
  ],

  "weaknesses": [
    "Portfolio density is very high and may challenge judges within a strict 5–7 minute review window.",
    "Some engineering performance claims (cycle time, accuracy, consistency) could benefit from clearer numeric validation.",
    "Outreach breadth is excellent, but long-term outcome tracking per program is not always explicitly shown."
  ],

  "improvements": [
    "Add concise executive summaries and decision tables at the start of major sections to improve judge-time efficiency.",
    "Introduce explicit performance metrics such as scoring accuracy percentages, autonomous success rates, and cycle times.",
    "Group outreach results into a small number of flagship programs with year-over-year outcome tracking."
  ],

  "benchmarkComparison":
    "This portfolio is far above baseline examples such as Yaku or Crowns and clearly exceeds the typical rookie standard. While its outreach scale and engineering rigor approach Worlds-level quality, it does not yet fully match Team Without a Cool Acronym or Rebel Robotics in longitudinal impact and refinement. It aligns with a strong Worlds-contender tier just below the global benchmark."
},
{
  "id": "22581-1",
  "teamName": "Red Ring of Death",
  "teamNumber": 22581,
  "country": "USA",
  "city": "Kennesaw, Georgia",
  "season": "2024 Into The Deep",
  "level": "Regionals",
  "stars": "★★★★☆",
  "score": "42 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/22581-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1hKrUcJWOn6rZvb1b__LqAmyEsjKTg62Y/view?usp=sharing",

  "summary":
    "A very strong engineering-focused FTC portfolio with unusually high technical depth, explicit design trade-offs, and advanced control systems for a regional-level team. The portfolio clearly documents a full transition from COTS to a fully custom robot, supported by physics modeling, CAD-driven iteration, and sophisticated software architecture. Outreach and sustainability are present and genuine but remain secondary to the portfolio’s primary strength: engineering rigor.",

  "awardsBreakdown": [
    ["Inspire", "4 / 5"],
    ["Reach", "3 / 5"],
    ["Sustain", "4 / 5"],
    ["Connect", "4 / 5"],
    ["Design", "5 / 5"],
    ["Innovate", "4 / 5"],
    ["Control", "5 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "4 / 5"],
    ["Engineering Thinking", "5 / 5"],
    ["Technical Depth", "5 / 5"],
    ["Outreach & Impact", "3 / 5"],
    ["Evidence & Proof", "4 / 5"],
    ["Clarity & Structure", "3 / 5"],
    ["Claim Realism", "5 / 5"],
    ["Design as Tool", "5 / 5"]
  ],

  "strengths": [
    "Exceptional engineering depth with explicit trade-offs, lessons learned, and quantified constraints across drivetrain, intake, extendo, outtake, and control systems.",
    "Advanced mechanical and materials engineering for FTC: laser-cut POM-C frame, PPDT drivetrain, custom double extendo, herringbone gearing, and modular architecture.",
    "High-level software and controls: FSM-based automation, odometry + IMU sensor fusion, Pedro Pathing, Bézier spline planning, current sensing, and vision-assisted intake alignment."
  ],

  "weaknesses": [
    "Outreach is genuine but limited in scale and primarily local, with few long-term, high-impact flagship programs.",
    "Portfolio density and visual saturation reduce efficiency for a 5–7 minute judging review.",
    "Some performance claims (cycle time, reliability, autonomous success rates) would benefit from clearer numerical summaries."
  ],

  "improvements": [
    "Add concise performance tables summarizing cycle times, autonomous success %, and scoring consistency.",
    "Elevate outreach by formalizing 1–2 sustained programs with year-over-year metrics and broader regional reach.",
    "Introduce executive summaries and decision matrices at the start of major sections to improve judge-time efficiency."
  ],

  "benchmarkComparison":
    "This portfolio is far above baseline examples such as Yaku or Crowns and clearly exceeds the typical regional FTC standard. In pure engineering depth and design rigor, it approaches Worlds-contender quality. However, it does not fully match Team Without a Cool Acronym or Rebel Robotics due to limited outreach scale and judge-time efficiency. It aligns with a strong upper-tier FTC engineering portfolio just below the global elite."
},
{
  "id": "14855-1",
  "teamName": "Shamrocks",
  "teamNumber": 14855,
  "country": "USA",
  "city": "Yuma, Arizona",
  "season": "2024 Into The Deep",
  "level": "Regionals",
  "stars": "★★★☆☆",
  "score": "31 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/14855-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1KnU4-X8weR7H5RAzXLchN0F6pwM-aYHI/view?usp=sharing",

  "summary":
    "A well-organized mid-tier FTC portfolio that clearly documents team structure, community service, and a complete robot build cycle. The team demonstrates genuine engagement with outreach and a consistent engineering process, but most technical sections remain qualitative and lack the analytical depth, metrics, and trade-off rigor required for Worlds-level competitiveness.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "4 / 5"],
    ["Sustain", "3 / 5"],
    ["Connect", "4 / 5"],
    ["Design", "3 / 5"],
    ["Innovate", "3 / 5"],
    ["Control", "3 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "3 / 5"],
    ["Engineering Thinking", "3 / 5"],
    ["Technical Depth", "3 / 5"],
    ["Outreach & Impact", "4 / 5"],
    ["Evidence & Proof", "3 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "4 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Clear and honest documentation of team identity, sustainability planning, finances, and internal organization.",
    "Broad and genuine outreach with quantified metrics: 650+ people reached, 20 FIRST teams impacted, coding camps, FLL support, STEM expos, and civic engagement.",
    "Complete engineering process coverage from brainstorming to iteration, with real lessons learned and visible robot evolution."
  ],

  "weaknesses": [
    "Engineering depth is largely descriptive with minimal numerical validation, calculations, or explicit comparison of alternatives.",
    "Outreach activities are numerous but not framed as a small number of sustained flagship programs with long-term outcome tracking.",
    "Technical sections lack performance metrics such as cycle times, scoring consistency, autonomous success rates, or reliability data."
  ],

  "improvements": [
    "Add quantitative engineering validation including cycle times, accuracy percentages, weight comparisons, and before/after performance tables.",
    "Consolidate outreach into 2–3 long-term core programs with year-over-year metrics instead of listing many parallel activities.",
    "Introduce concise decision matrices and summaries explicitly tied to Judging Questions to improve Inspire Award competitiveness."
  ],

  "benchmarkComparison":
    "This portfolio is clearly stronger than baseline examples such as Yaku or Crowns due to its structure, outreach breadth, and complete robot documentation. However, it is not comparable to Team Without a Cool Acronym or Rebel Robotics, as it lacks the analytical engineering rigor, sustained large-scale impact, and quantitative proof required for a Worlds-elite standard. It aligns with a solid, typical national-level FTC portfolio."
},
{
  "id": "27238-1",
  "teamName": "Unity Robotics",
  "teamNumber": 27238,
  "country": "USA",
  "city": "McAllen, Texas (RGV)",
  "season": "2025 Decode",
  "level": "Regionals",
  "stars": "★★★☆☆",
  "score": "35 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/27238-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1y1FQm2Ku0lovqSaVGiQ9m95dHZFkNS1c/view?usp=sharing",

  "summary":
    "A well-structured and thoughtful FTC portfolio that demonstrates a clear engineering design process, real iteration, and strong mentor-driven development. The team shows solid outreach volume and documentation, but most engineering claims remain lightly quantified, and outreach impact—while broad—is not yet organized into long-term flagship programs with clear sustainability metrics.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "4 / 5"],
    ["Sustain", "3 / 5"],
    ["Connect", "4 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "3 / 5"],
    ["Control", "4 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "4 / 5"],
    ["Engineering Thinking", "4 / 5"],
    ["Technical Depth", "3 / 5"],
    ["Outreach & Impact", "4 / 5"],
    ["Evidence & Proof", "3 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "5 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Clear and complete documentation of the engineering design process with defined requirements, iterations, pros/cons, and trade-offs across drivetrain, intake, lift, and automation.",
    "Strong outreach volume with detailed tracking: 40,000+ people reached through showcases, media appearances, virtual outreach, community events, and alumni engagement.",
    "Excellent mentor and alumni integration, with clear evidence of skill transfer in engineering, communication, outreach, and professional development."
  ],

  "weaknesses": [
    "Technical depth is mostly qualitative; performance claims such as cycle time, scoring consistency, and reliability are not rigorously quantified.",
    "Outreach activities are numerous but not framed as a small number of sustained flagship programs with long-term outcome tracking.",
    "Portfolio density is high, which may challenge judges within a strict 5–7 minute review window."
  ],

  "improvements": [
    "Add quantitative engineering validation such as cycle times, autonomous success rates, accuracy percentages, and before/after performance tables.",
    "Consolidate outreach into 2–3 core long-term programs with year-over-year metrics instead of listing many individual events.",
    "Introduce concise executive summaries and decision tables to improve judge-time efficiency while preserving depth."
  ],

  "benchmarkComparison":
    "This portfolio is clearly stronger than baseline examples such as Yaku or Crowns due to its structure, outreach volume, and real engineering iteration. However, it is not comparable to Team Without a Cool Acronym or Rebel Robotics, as it lacks the analytical engineering depth, sustained flagship outreach programs, and quantitative rigor required for a Worlds-elite standard. It aligns with a strong, well-executed national-level FTC portfolio."
},
{
  "id": "14596-1",
  "teamName": "XLR8",
  "teamNumber": 14596,
  "country": "USA",
  "city": "Osceola, Indiana",
  "season": "2024 Into The Deep",
  "level": "Regionals",
  "stars": "★★★★☆",
  "score": "41 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/14596-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1G5UZlebf5nkazuwxD7xcIE-tzI_djdti/view?usp=sharing",

  "summary":
    "A strong, well-rounded FTC portfolio demonstrating mature engineering iteration, clear trade-off reasoning, and sustained community outreach. The team shows depth across mechanical design, programming, and reliability practices, supported by real iteration history and quantitative elements. Outreach is broad and well-documented, making this portfolio competitive above a typical regional standard, though not fully at a global elite level.",

  "awardsBreakdown": [
    ["Inspire", "4 / 5"],
    ["Reach", "4 / 5"],
    ["Sustain", "4 / 5"],
    ["Connect", "4 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "4 / 5"],
    ["Control", "4 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "4 / 5"],
    ["Engineering Thinking", "4 / 5"],
    ["Technical Depth", "4 / 5"],
    ["Outreach & Impact", "4 / 5"],
    ["Evidence & Proof", "4 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "5 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Clear engineering iteration across drivetrain, intake, scoring mechanisms, ascent, and programming, with documented failures, redesigns, and reasoning.",
    "Above-average technical depth including voltage management, PID control, autonomous tuning, reliability engineering, and structured software architecture.",
    "Sustained and quantified outreach: thousands reached through community events, mentoring multiple FTC/FLL teams, extensive volunteering, and consistent FIRST advocacy."
  ],

  "weaknesses": [
    "Some performance claims would benefit from more concise numerical summaries (cycle times, accuracy %, autonomous success rates).",
    "Portfolio density is high, requiring judges to actively navigate content within a limited review window.",
    "Outreach is broad but could be framed more clearly into a small number of flagship, multi-year programs."
  ],

  "improvements": [
    "Add compact performance tables summarizing autonomous consistency, scoring accuracy, and cycle efficiency.",
    "Consolidate outreach into 2–3 long-term programs with clear year-over-year growth metrics.",
    "Introduce short executive summaries at the start of major sections to improve 5–7 minute judge readability."
  ],

  "benchmarkComparison":
    "This portfolio is significantly stronger than baseline examples such as Yaku or Crowns and clearly exceeds a typical regional FTC standard. While it does not fully match Team Without a Cool Acronym or Rebel Robotics in analytical rigor and global outreach scale, it aligns with a strong Worlds-bubble tier portfolio that is competitive and well-executed."
},
{
  "id": "24478-1",
  "teamName": "EngiNeerds",
  "teamNumber": 24478,
  "country": "Romania",
  "city": "Slatina, Olt",
  "season": "2024 Into The Deep",
  "level": "Nationals",
  "stars": "★★★☆☆",
  "score": "34 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/24478-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1QSYQA4VxRgRxhrCj3ySxDvZgg8RMiuPH/view?usp=sharing",

  "summary":
    "A visually strong and well-documented FTC portfolio with clear robot architecture, solid iteration history, and active outreach efforts. The team demonstrates good FTC-level engineering execution and modern software usage, but the portfolio remains largely descriptive, with limited quantitative validation, trade-off analysis, and long-term impact framing required for a Worlds-competitive tier.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "4 / 5"],
    ["Sustain", "3 / 5"],
    ["Connect", "4 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "3 / 5"],
    ["Control", "4 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "3 / 5"],
    ["Engineering Thinking", "3 / 5"],
    ["Technical Depth", "4 / 5"],
    ["Outreach & Impact", "4 / 5"],
    ["Evidence & Proof", "3 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "4 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Very strong visual design that clearly explains robot architecture, subsystems, and evolution (intake, outtake, slides, drivetrain, sensors).",
    "Above-average technical implementation for FTC: odometry, Limelight vision, Pedro Pathing, RoadRunner, PID/Feedforward control, and modular software structure.",
    "Large and diverse outreach volume with quantified reach, media presence, mentoring, LEGO robotics programs, podcasts, Discord community, and public events."
  ],

  "weaknesses": [
    "Engineering reasoning is mostly narrative; explicit trade-offs, calculations, and performance comparisons are limited.",
    "Outreach impact is broad but not structured into a small number of sustained flagship programs with long-term outcome tracking.",
    "Some technical claims lack concise numerical summaries such as cycle time, accuracy percentages, or reliability metrics."
  ],

  "improvements": [
    "Add explicit engineering trade-off tables with numbers: cycle time, success rate, weight, power, and reliability comparisons.",
    "Reframe outreach into 2–3 long-term core programs with year-over-year metrics instead of listing many parallel activities.",
    "Introduce short executive summaries and decision matrices to improve judge-time efficiency in a 5–7 minute review."
  ],

  "benchmarkComparison":
    "This portfolio is clearly stronger than baseline examples such as Yaku or Crowns due to its technical completeness, visual clarity, and outreach scale. However, it is not comparable to Team Without a Cool Acronym or Rebel Robotics, as it lacks deep analytical engineering justification and tightly measured, sustained impact. It aligns with a strong national-level FTC portfolio rather than a Worlds-elite standard."
},
{
  "id": "9974-1",
  "teamName": "T.H.O.R.",
  "teamNumber": 9974,
  "country": "USA",
  "city": "Johnston, Iowa",
  "season": "2020 Ultimate Goal",
  "level": "Regionals",
  "stars": "★★★★☆",
  "score": "39 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/9974-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1x-sqHnPbrggZfTKOYNmvyUHsxA3FzY6j/view?usp=sharing",

  "summary":
    "A strong and unusually mature FTC engineering portfolio for its season, showing clear strategic thinking, deep mechanical reasoning, and explicit design trade-offs supported by calculations and testing. The portfolio combines solid outreach, transparent sustainability planning, and advanced autonomous and control concepts. While not aligned with modern Worlds-scale outreach expectations, it stands out as a high-quality portfolio for its era.",

  "awardsBreakdown": [
    ["Inspire", "4 / 5"],
    ["Reach", "4 / 5"],
    ["Sustain", "4 / 5"],
    ["Connect", "4 / 5"],
    ["Design", "5 / 5"],
    ["Innovate", "4 / 5"],
    ["Control", "5 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "4 / 5"],
    ["Engineering Thinking", "5 / 5"],
    ["Technical Depth", "5 / 5"],
    ["Outreach & Impact", "4 / 5"],
    ["Evidence & Proof", "5 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "5 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Excellent engineering rigor with explicit design matrices, failure mode analysis, and quantified decisions across intake, shooter, drivetrain, and wobble goal mechanisms.",
    "High technical depth for the era: mecanum kinematics with ~3 cm accuracy, motion profiling, custom vision pipeline with <5% failure rate, dual-motor shooter optimization, and clear autonomous goals.",
    "Well-documented outreach and sustainability with quantified hours, food drive impact (4,991 meals), mentoring, Fair Play contributions, and transparent budgeting."
  ],

  "weaknesses": [
    "Outreach scale and structure are strong for 2020 but would be considered limited by modern Worlds standards.",
    "Portfolio is text-heavy and less visually optimized compared to current elite benchmarks.",
    "Some future plans are stated aspirationally without follow-up outcome validation."
  ],

  "improvements": [
    "Condense narrative sections into summary tables to improve judge-time efficiency.",
    "Expand outreach framing into longer-term programs with multi-year outcome tracking.",
    "Add clearer performance summaries (cycle consistency, shot accuracy %) alongside calculations."
  ],

  "benchmarkComparison":
    "For its season, this portfolio sits well above average and approaches top-tier regional standards. It is significantly stronger than baseline examples like Yaku or Crowns and, within its historical context, shows engineering rigor comparable to early versions of Worlds-level portfolios. However, it does not fully match modern global benchmarks such as Team Without a Cool Acronym or Rebel Robotics in outreach scale and presentation efficiency."
},
{
  "id": "26562-1",
  "teamName": "MechTech",
  "teamNumber": 26562,
  "country": "USA",
  "city": "Fulton County, Georgia",
  "season": "2025 Decode",
  "level": "Regionals",
  "stars": "★★★☆☆",
  "score": "33 / 55",
  "award": "Not Specified",

  "cover": "/portfolios/26562-1/cover.png",
  "pdf": "https://drive.google.com/file/d/1ZVXLEJ9r2UIYNizWYd6zjA5AvHuCQFor/view?usp=sharing",

  "summary":
    "A clear and honest FTC portfolio from a small, second-year team that demonstrates real engineering learning, iteration, and decision-making. The portfolio shows explicit trade-offs, basic quantitative reasoning, and early use of math and vision concepts. However, outreach scale is limited, technical depth is uneven, and most analysis remains introductory, placing the portfolio at a solid but non-elite FTC level.",

  "awardsBreakdown": [
    ["Inspire", "3 / 5"],
    ["Reach", "2 / 5"],
    ["Sustain", "2 / 5"],
    ["Connect", "2 / 5"],
    ["Design", "4 / 5"],
    ["Innovate", "3 / 5"],
    ["Control", "4 / 5"]
  ],

  "criteria": [
    ["Judging Questions Alignment", "3 / 5"],
    ["Engineering Thinking", "4 / 5"],
    ["Technical Depth", "3 / 5"],
    ["Outreach & Impact", "2 / 5"],
    ["Evidence & Proof", "3 / 5"],
    ["Clarity & Structure", "4 / 5"],
    ["Claim Realism", "4 / 5"],
    ["Design as Tool", "4 / 5"]
  ],

  "strengths": [
    "Clear demonstration of engineering thinking with explicit alternatives, pros/cons, and justified decisions for turret, intake, and artifact handling mechanisms.",
    "Good use of quantitative reasoning for an FTC mid-tier team: RPM comparisons, Desmos-based match optimization, autonomous and teleop statistics, and AprilTag math explained from first principles.",
    "Strong clarity and readability: clean structure, logical flow, and visuals that support understanding rather than hide engineering."
  ],

  "weaknesses": [
    "Outreach is minimal and mostly event-based, with limited scale, sustainability, or long-term impact metrics.",
    "Technical depth is inconsistent: some sections show real analysis, while others remain descriptive without validation.",
    "Most performance metrics are single-event or short-term and lack longitudinal comparison or reliability analysis."
  ],

  "improvements": [
    "Develop at least one sustained outreach program with repeat engagement and quantified year-over-year impact.",
    "Add deeper technical validation such as cycle time distributions, shooting accuracy percentages, and failure-rate analysis.",
    "Expand system-level trade-offs by comparing multiple full-robot strategies, not only individual mechanisms."
  ],

  "benchmarkComparison":
    "This portfolio is clearly stronger than baseline examples such as Yaku or Crowns due to its honest engineering reasoning, visible trade-offs, and use of math and data. However, it is far below Team Without a Cool Acronym or Rebel Robotics in outreach scale, technical depth, and competitive polish. It aligns with a solid, competent FTC portfolio typical of developing teams at the regional level."
}















];

/* ================= PAGE ================= */

export default function PortfolioPage() {
  const [season, setSeason] = useState("All Seasons");
  const [level, setLevel] = useState("All Levels");
  const [award, setAward] = useState("All Awards");
  const [stars, setStars] = useState("All Stars");

  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [openPortfolio, setOpenPortfolio] = useState<any>(null);
  const [showInfo, setShowInfo] = useState(false);

  const suggestions = search.trim()
    ? portfolios.filter((p) => {
        const q = search.toLowerCase();
        return (
          p.teamName.toLowerCase().includes(q) ||
          String(p.teamNumber).includes(q)
        );
      })
    : [];

  const filtered = portfolios.filter((p) => {
    if (season !== "All Seasons" && p.season !== season) return false;
    if (level !== "All Levels" && p.level !== level) return false;
    if (award !== "All Awards" && !p.award.includes(award)) return false;
    if (stars !== "All Stars" && p.stars !== stars) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !p.teamName.toLowerCase().includes(q) &&
        !String(p.teamNumber).includes(q)
      )
        return false;
    }

    return true;
  });

  return (
    <main
      className="
        min-h-screen
        text-white
        px-6
        py-24
        bg-gradient-to-b
        from-[#0b0000]
        via-[#140404]
        to-black
      "
    >
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Engineering Portfolios</h1>
            <p className="text-gray-400 mt-2 max-w-2xl">
              FTC engineering portfolios reviewed by PortfolioLab using a strict,
              criteria-based star system.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowInfo(true)}
              className="text-sm underline underline-offset-4 text-gray-300 hover:text-white"
            >
              How portfolios are evaluated
            </button>

            <a
              href="/submit"
              className="px-4 py-2 text-sm rounded-md bg-red-700 hover:bg-red-600"
            >
              Submit portfolio
            </a>
          </div>
        </section>

        {/* FILTERS + SEARCH */}
        <section className="flex flex-wrap items-center gap-3 relative">
          {[SEASONS, LEVELS, AWARDS, STARS].map((opts, i) => (
            <select
              key={i}
              className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md text-sm"
              onChange={(e) => {
                [setSeason, setLevel, setAward, setStars][i](e.target.value);
              }}
            >
              {opts.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ))}

          <div className="ml-auto relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by team number or name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-md text-sm"
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-md max-h-72 overflow-y-auto">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSearch(`${p.teamNumber}`);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 flex justify-between gap-3"
                  >
                    <div>
                      <span className="text-gray-400"># {p.teamNumber}</span>{" "}
                      <span className="font-medium">{p.teamName}</span>
                    </div>
                    <div className="text-xs text-yellow-400 whitespace-nowrap">
                      {p.award}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* GRID */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpenPortfolio(p)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 hover:border-red-600 transition text-left overflow-hidden"
            >
              <div
  className="aspect-[210/297] bg-cover bg-center"
  style={{
    backgroundImage: `url(${getDrivePreview(p.pdf)})`,
  }}
/>

              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold">{p.teamName}</h3>
                <p className="text-xs text-gray-400">
                  #{p.teamNumber} · {p.season} · {p.level}
                </p>
                <div className="text-red-500 text-sm">{p.stars}</div>
                <p className="text-xs text-yellow-400">🏆 {p.award}</p>
              </div>
            </button>
          ))}
        </section>

        {/* ================= PORTFOLIO MODAL ================= */}
        {openPortfolio && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
            onClick={() => setOpenPortfolio(null)}
          >
            <div
              className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-4xl w-full p-6 overflow-y-auto max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-2">
                {openPortfolio.teamName} #{openPortfolio.teamNumber}
              </h2>

              <p className="text-sm text-gray-400 mb-2">
                {openPortfolio.country} · {openPortfolio.season} ·{" "}
                {openPortfolio.level}
              </p>

              <p className="text-red-500 mb-4">
                {openPortfolio.stars} · {openPortfolio.score}
              </p>

              <p className="text-sm text-gray-300 mb-6">
                {openPortfolio.summary}
              </p>

              <h3 className="font-semibold mb-2">Awards</h3>
              <ul className="grid grid-cols-2 text-sm mb-6">
                {openPortfolio.awardsBreakdown.map((a: any) => (
                  <li key={a[0]}>{a[0]} — {a[1]}</li>
                ))}
              </ul>

              <h3 className="font-semibold mb-2">Criteria</h3>
              <ul className="grid grid-cols-2 text-sm mb-6">
                {openPortfolio.criteria.map((c: any) => (
                  <li key={c[0]}>{c[0]} — {c[1]}</li>
                ))}
              </ul>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">Strengths</h4>
                  <ul className="list-disc ml-4">
                    {openPortfolio.strengths.map((s: string) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Weaknesses</h4>
                  <ul className="list-disc ml-4">
                    {openPortfolio.weaknesses.map((w: string) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Improvements</h4>
                  <ul className="list-disc ml-4">
                    {openPortfolio.improvements.map((i: string) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpenPortfolio(null)}
                  className="px-4 py-2 bg-zinc-800 rounded-md"
                >
                  Close
                </button>

                <a
                  href={openPortfolio.pdf}
                  target="_blank"
                  className="px-4 py-2 bg-red-700 rounded-md"
                >
                  Open portfolio
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ================= EVALUATION MODAL ================= */}
        {showInfo && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
            onClick={() => setShowInfo(false)}
          >
            <div
              className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-3">
                How portfolios are evaluated
              </h2>

              <p className="text-sm text-gray-300 mb-4">
                PortfolioLab uses a strict, criteria-based star evaluation
                system. Each portfolio is scored on fixed criteria from 0 to 5,
                weighted, and converted into a final star rating.
              </p>

              <table className="w-full text-sm mb-4">
                <tbody>
                  <tr><td>Awards (each)</td><td className="text-right">High weight</td></tr>
                  <tr><td>Outreach & Impact</td><td className="text-right">High weight</td></tr>
                  <tr><td>Engineering Thinking</td><td className="text-right">High weight</td></tr>
                  <tr><td>Technical Depth</td><td className="text-right">High weight</td></tr>
                  <tr><td>Evidence & Proof</td><td className="text-right">Medium</td></tr>
                  <tr><td>Clarity & Structure</td><td className="text-right">Medium</td></tr>
                  <tr><td>Design as Tool</td><td className="text-right">Medium</td></tr>
                  <tr><td>Claim Realism</td><td className="text-right">Medium</td></tr>
                </tbody>
              </table>

              <p className="text-xs text-gray-400">
                ★★★★★ is extremely rare (top ~1%). Automatic caps apply if
                outreach, engineering thinking, or technical depth are weak.
                PortfolioLab ratings are independent and not official FIRST
                scores. Portfolios evaluated using PortAI.
              </p>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowInfo(false)}
                  className="px-4 py-2 bg-zinc-800 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
