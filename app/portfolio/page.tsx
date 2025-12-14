"use client";

import { useState } from "react";

/* ================= TYPES ================= */

type Season =
  | "all"
  | "2025 Decode"
  | "2024 Into the Deep"
  | "2023 Centerstage"
  | "2022 Power Play"
  | "2021 Freight Frenzy"
  | "2020 Ultimate Goal"
  | "2019 Skystone";

type Level = "all" | "Regional" | "Nationals" | "Worlds" | "Other";

type Award =
  | "all"
  | "Inspire"
  | "Think"
  | "Motivate"
  | "Sustain"
  | "Reach"
  | "Connect"
  | "Innovate"
  | "Design"
  | "Control"
  | "None";

type Portfolio = {
  team: string;
  number?: string;
  season: Season;
  level: Level;
  event: string;
  award: Award;
  link: string;
};

/* ================= DATA (24 PORTFOLIOS) ================= */

const portfolios: Portfolio[] = [
  {
    team: "Runtime Terror",
    number: "22105",
    season: "2024 Into the Deep",
    level: "Regional",
    event: "San Diego League Tournament",
    award: "Inspire",
    link: "https://drive.google.com/file/d/1y85KxyurTOEunz9wXi-g5uBkrVEJvyZl/view",
  },
  {
    team: "Potential Energy",
    number: "19706",
    season: "2023 Centerstage",
    level: "Worlds",
    event: "FIRST World Championship 2024",
    award: "Think",
    link: "https://drive.google.com/file/d/1kh-KArcJEEbZOGeomcb1dpfCrLS42RWa/view",
  },
  {
    team: "YAKU",
    number: "19162",
    season: "2023 Centerstage",
    level: "Nationals",
    event: "Central Asia FIRST Championship",
    award: "Inspire",
    link: "https://drive.google.com/file/d/157N-8_TDwTZW94InkHi2SPK7IpdcjMNx/view",
  },
  {
    team: "Mystery",
    number: "19213",
    season: "2023 Centerstage",
    level: "Nationals",
    event: "FIRST Chinese Taipei Championship",
    award: "Inspire",
    link: "https://drive.google.com/file/d/10CwtG7dXh_IfGMpP32qKntIOhNi7oaZU/view",
  },
  {
    team: "MLP (Mentor Learn Practice)",
    number: "19163",
    season: "2024 Into the Deep",
    level: "Nationals",
    event: "Central Asia FIRST Championship",
    award: "Innovate",
    link: "https://drive.google.com/file/d/1U0aTnROmxdMxRC58vMFjkdBZ57ajbda_/view",
  },
  {
    team: "Quantum Robotics",
    number: "14270",
    season: "2022 Power Play",
    level: "Nationals",
    event: "Romanian National Championship",
    award: "Motivate",
    link: "https://drive.google.com/file/d/1TLzACCU6QNQUAJA-uNGjbKEmSegn8Hmz/view",
  },
  {
    team: "Infinite Turtles",
    number: "16461",
    season: "2023 Centerstage",
    level: "Worlds",
    event: "FIRST World Championship",
    award: "Inspire",
    link: "https://drive.google.com/file/d/1NPgnlWqwJscEIKAM9bWTmqqLhGLCwEoo/view",
  },
  {
    team: "Steel Eels",
    number: "18317",
    season: "2022 Power Play",
    level: "Worlds",
    event: "FIRST World Championship",
    award: "Motivate",
    link: "https://drive.google.com/file/d/1_wEE4tnfyVCXOf4wWVIDNsFXKGQdb7lj/view",
  },
  {
    team: "Seattle Solvers",
    number: "23511",
    season: "2024 Into the Deep",
    level: "Regional",
    event: "Capek Semifinal",
    award: "Think",
    link: "https://drive.google.com/file/d/1xFSjWbOx_QlD1OgXiVQ3putcZd4r2AAX/view",
  },
  {
    team: "Kuriosity Robotics",
    number: "12635",
    season: "2021 Freight Frenzy",
    level: "Worlds",
    event: "FIRST World Championship",
    award: "Design",
    link: "https://drive.google.com/file/d/1Q8QDtp7H-jHgFwjI5EJesg7WHr7etFyJ/view",
  },
  {
    team: "Uran-92",
    number: "25300",
    season: "2024 Into the Deep",
    level: "Nationals",
    event: "Central Asia FIRST Championship",
    award: "Design",
    link: "https://drive.google.com/file/d/1AMscWUoCJcd3PHJbIqvWElvEMyzgoUts/view",
  },
  {
    team: "Techno Maniacs",
    number: "16021",
    season: "2024 Into the Deep",
    level: "Nationals",
    event: "Massachusetts Championship",
    award: "Think",
    link: "https://drive.google.com/file/d/1jA_ztbRMMi840tqb5Dpyf9kxmcmtcldO/view",
  },
  {
    team: "ULY DALA",
    number: "27832",
    season: "2024 Into the Deep",
    level: "Regional",
    event: "Almaty FIRST Regional",
    award: "Inspire",
    link: "https://drive.google.com/file/d/1pKjQAeSlQ0kmjJe0G35AKsETrjwZPwxP/view",
  },
  {
    team: "The Hive",
    number: "3747",
    season: "2024 Into the Deep",
    level: "Worlds",
    event: "FIRST World Championship",
    award: "Motivate",
    link: "https://drive.google.com/file/d/1Ej1oGrerX4m6rpTYWJgRbEGHpOFvNSVJ/view",
  },
  {
    team: "SANA",
    number: "24697",
    season: "2024 Into the Deep",
    level: "Nationals",
    event: "Central Asia FIRST Championship",
    award: "Inspire",
    link: "https://drive.google.com/file/d/1xCYEDG1K6snAwD5XtDSbN_fojWJpVFJA/view",
  },
  {
    team: "Team Without a Cool Acronym",
    number: "16091",
    season: "2022 Power Play",
    level: "Worlds",
    event: "FIRST World Championship",
    award: "Think",
    link: "https://drive.google.com/file/d/1qcJd5SlYUYxByHYqiFOVVqzkViauBZHz/view",
  },
  {
    team: "Raventech",
    number: "19047",
    season: "2024 Into the Deep",
    level: "Other",
    event: "Michigan Premier Event",
    award: "None",
    link: "https://drive.google.com/file/d/1ksv2owVOhEm-_NBWZF68qLLZOPyM7yW4/view",
  },
  {
    team: "Crown",
    number: "26438",
    season: "2024 Into the Deep",
    level: "Other",
    event: "—",
    award: "None",
    link: "https://drive.google.com/file/d/1hyQwDLZz_DRZrhxYAx0HY4W0MYs6OnsB/view",
  },
  {
    team: "Browncoats",
    number: "7842",
    season: "2024 Into the Deep",
    level: "Other",
    event: "—",
    award: "None",
    link: "https://drive.google.com/file/d/1L0ZvLaD_xs81phMw_DZMRTcFMc9xC2XE/view",
  },
];

/* ================= PAGE ================= */

export default function PortfolioPage() {
  const [season, setSeason] = useState<Season>("all");
  const [level, setLevel] = useState<Level>("all");
  const [award, setAward] = useState<Award>("all");

  const filtered = portfolios.filter((p) => {
    const seasonOk = season === "all" || p.season === season;
    const levelOk = level === "all" || p.level === level;
    const awardOk = award === "all" || p.award === award;
    return seasonOk && levelOk && awardOk;
  });

  return (
    <section className="px-6">
      <div className="max-w-6xl mx-auto py-24 space-y-10">
        {/* FILTERS */}
        <div className="flex flex-wrap gap-4">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value as Season)}
            className="bg-black border border-white/20 px-4 py-2 text-sm"
          >
            <option value="all">All Seasons</option>
            <option>2025 Decode</option>
            <option>2024 Into the Deep</option>
            <option>2023 Centerstage</option>
            <option>2022 Power Play</option>
            <option>2021 Freight Frenzy</option>
            <option>2020 Ultimate Goal</option>
            <option>2019 Skystone</option>
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
            className="bg-black border border-white/20 px-4 py-2 text-sm"
          >
            <option value="all">All Levels</option>
            <option>Regional</option>
            <option>Nationals</option>
            <option>Worlds</option>
            <option>Other</option>
          </select>

          <select
            value={award}
            onChange={(e) => setAward(e.target.value as Award)}
            className="bg-black border border-white/20 px-4 py-2 text-sm"
          >
            <option value="all">All Awards</option>
            <option>Inspire</option>
            <option>Think</option>
            <option>Motivate</option>
            <option>Sustain</option>
            <option>Reach</option>
            <option>Connect</option>
            <option>Innovate</option>
            <option>Design</option>
            <option>Control</option>
          </select>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <a
              key={i}
              href={p.link}
              target="_blank"
              className="block border border-white/10 p-6 space-y-2
                         hover:border-red-400/70
                         hover:shadow-[0_0_24px_rgba(239,68,68,0.25)]
                         transition"
            >
              <h3 className="font-semibold">
                {p.team}{" "}
                {p.number && (
                  <span className="text-white/40">#{p.number}</span>
                )}
              </h3>
              <p className="text-xs text-white/50">{p.season}</p>
              <p className="text-xs text-white/50">{p.event}</p>
              {p.award !== "None" && (
                <p className="text-sm text-red-400">{p.award} Award</p>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
