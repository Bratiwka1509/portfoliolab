export type PortfolioBreakdown = [string, string];

export type PortfolioReviewInput = {
  program?: string;
  teamName: string;
  teamNumber: number;
  country: string;
  season: string;
  level: string;
  eventName?: string;
  award: string;
  stars: string;
  score?: string;
  summary?: string;
  awardsBreakdown?: PortfolioBreakdown[];
  strengths?: string[];
  weaknesses?: string[];
  improvements?: string[];
};

export type PortfolioRecord = {
  id: string;
  program?: string;
  teamName: string;
  teamNumber: number;
  country: string;
  season: string;
  level: string;
  stars: string;
  award: string;
  cover?: string;
  pdf: string;
  pdfStoragePath?: string;
  summary?: string;
  score?: string;
  awardsBreakdown?: PortfolioBreakdown[];
  criteriaBreakdown?: PortfolioBreakdown[];
  criteria?: PortfolioBreakdown[];
  strengths?: string[];
  weaknesses?: string[];
  improvements?: string[];
  eventName?: string;
  source?: string;
};

export type SubmissionRecord = {
  id: string;
  program?: string;
  teamName: string;
  teamNumber: number;
  country: string;
  season: string;
  level: string;
  eventName: string;
  email: string;
  pdfUrl: string;
  pdfPath?: string;
  originalFileName?: string;
  portfolioUrl?: string;
  submittedAt: string;
};

export type AdminPortfoliosResponse = {
  pendingSubmissions: SubmissionRecord[];
  approvedPortfolios: PortfolioRecord[];
};