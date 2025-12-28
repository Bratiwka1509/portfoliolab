"use client";

import { useState } from "react";

export default function PortfolioRulesPage() {
  const [lang, setLang] = useState<"en" | "ru">("en");

  const content = {
    en: {
      title: "FTC Engineering Portfolio Rules",
      subtitle: "Based on official FIRST Tech Challenge judging documents",
      sections: [
        {
          title: "What is an Engineering Portfolio?",
          text: [
            "The Engineering Portfolio is an official judging document used by FTC Judges during the current season.",
            "It is NOT a marketing brochure or presentation.",
            "Judges only consider information from the current season and current event.",
          ],
        },
        {
          title: "Portfolio Limits and Rules",
          list: [
            "Maximum 15 pages of content (cover page not evaluated)",
            "A4 or US Letter format only",
            "PDF, max 15MB if submitted digitally",
            "Judges do NOT open links, websites, or videos",
            "Only work after January 1 of the current season is evaluated",
          ],
        },
        {
          title: "Cover Page Requirements",
          list: [
            "Team number is required",
            "Optional: team name, logo, sponsors, robot photo",
            "Cover page is NOT scored",
            "Missing cover page may result in disqualification",
          ],
        },
        {
          title: "Think Award — Core of the Portfolio",
          text: [
            "Think Award is the only award where the portfolio is the primary judging source.",
            "Judges evaluate engineering thinking, not just results.",
          ],
          list: [
            "Engineering process",
            "Trade-off / cost-benefit analysis",
            "Iterations and lessons learned",
            "Math and logic behind decisions",
          ],
        },
        {
          title: "How Judges Read Portfolios",
          list: [
            "Why was this solution chosen?",
            "What failed and how was it fixed?",
            "How was progress measured?",
            "What data supported decisions?",
          ],
        },
        {
          title: "Outreach — Official Definitions",
          list: [
            "Started — you helped create and sustain a team",
            "Mentored — ongoing support during the season",
            "Assisted — one-time help",
            "Reached — measurable number of people",
            "Advocated — engagement with decision-makers",
          ],
        },
        {
          title: "Judging Levels",
          list: [
            "Beginning",
            "Developing",
            "Accomplished",
            "Exemplary",
          ],
        },
        {
          title: "Critical Truth",
          text: [
            "A team can win Inspire Award with an average robot.",
            "A team cannot win Inspire Award without a strong portfolio.",
          ],
        },
      ],
    },

    ru: {
      title: "Правила Engineering Portfolio FTC",
      subtitle: "На основе официальных документов судейства FIRST Tech Challenge",
      sections: [
        {
          title: "Что такое Engineering Portfolio?",
          text: [
            "Engineering Portfolio — официальный документ для судей FTC.",
            "Это НЕ презентация и НЕ маркетинг.",
            "Судьи учитывают только текущий сезон.",
          ],
        },
        {
          title: "Ограничения портфолио",
          list: [
            "Максимум 15 страниц (обложка не оценивается)",
            "Формат A4 или US Letter",
            "PDF до 15MB",
            "Ссылки и сайты не открываются",
            "Учитывается только работа после 1 января",
          ],
        },
        {
          title: "Обложка",
          list: [
            "Обязателен номер команды",
            "Можно добавить логотип и фото",
            "Обложка не оценивается",
            "Без обложки портфолио могут не принять",
          ],
        },
        {
          title: "Think Award — основа портфолио",
          list: [
            "Инженерный процесс",
            "Trade-off анализ",
            "Ошибки и итерации",
            "Математика решений",
          ],
        },
        {
          title: "Как судьи читают портфолио",
          list: [
            "Почему выбрали это решение?",
            "Что не сработало?",
            "Как измеряли прогресс?",
            "Какие данные использовали?",
          ],
        },
        {
          title: "Outreach — официальные термины",
          list: [
            "Started — создание команды",
            "Mentored — регулярная поддержка",
            "Assisted — разовая помощь",
            "Reached — измеримый охват",
            "Advocated — работа с официальными лицами",
          ],
        },
        {
          title: "Уровни оценки",
          list: [
            "Beginning",
            "Developing",
            "Accomplished",
            "Exemplary",
          ],
        },
        {
          title: "Ключевая правда",
          text: [
            "Можно выиграть Inspire с обычным роботом.",
            "Нельзя выиграть Inspire без сильного портфолио.",
          ],
        },
      ],
    },
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Language switch */}
        <div className="flex justify-end gap-2">
          {["en", "ru"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l as "en" | "ru")}
              className={`px-4 py-1 text-sm border ${
                lang === l
                  ? "border-violet-500 text-white"
                  : "border-white/20 text-gray-400"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Header */}
        <section className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            {content[lang].title}
          </h1>
          <p className="text-gray-400">{content[lang].subtitle}</p>
          <div className="h-[2px] w-24 bg-violet-500" />
        </section>

        {/* Content */}
        {content[lang].sections.map((section, i) => (
          <section key={i} className="space-y-3">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            {section.text?.map((t, idx) => (
              <p key={idx} className="text-gray-300 leading-relaxed">
                {t}
              </p>
            ))}
            {section.list && (
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {section.list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <footer className="pt-10 border-t border-white/10 text-sm text-gray-500">
          PortfolioLab • FTC Judge-Oriented Documentation
        </footer>
      </div>
    </main>
  );
}
