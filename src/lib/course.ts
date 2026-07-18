export type CourseLesson = {
  number: number;
  title: string;
  duration: string;
  description: string;
  eyebrow: string;
  videoId: string;
  learn: string[];
  resources: { name: string; type: string; detail: string; url?: string }[];
};

const resourceSet = (items: [string, string, string][]) =>
  items.map(([name, type, detail]) => ({ name, type, detail }));

export const courseLessons: CourseLesson[] = [
  {
    number: 1,
    title: "Introduction",
    duration: "8 min",
    eyebrow: "Start here",
    description: "Meet your course roadmap and build a confident foundation for creating with AI.",
    videoId: "zAFBXV2ZCEg",
    learn: ["How the course is structured", "The AI-first website workflow", "What you will publish by the end"],
    resources: resourceSet([["Course roadmap", "PDF", "Your 30-day learning plan"], ["Workspace checklist", "PDF", "Set up before lesson two"], ["Community guide", "LINK", "Get the most from support"]]),
  },
  {
    number: 2,
    title: "Mood Boarding",
    duration: "14 min",
    eyebrow: "Find your direction",
    description: "Turn scattered inspiration into a visual direction your website can actually follow.",
    videoId: "gBFYkvBfBG8",
    learn: ["Collect reference material quickly", "Define an intentional visual language", "Translate mood into UI decisions"],
    resources: resourceSet([["Mood board canvas", "FIGMA", "Editable starter board"], ["Style reference pack", "ZIP", "Curated visual inspiration"], ["Brand direction prompts", "PDF", "Questions to sharpen your taste"]]),
  },
  {
    number: 3,
    title: "AI Prompting",
    duration: "18 min",
    eyebrow: "Learn the language",
    description: "Write prompts that give AI clear context, constraints, and genuinely useful output.",
    videoId: "pRve2Z5srn4",
    learn: ["Use the Context–Goal–Constraint framework", "Iterate without losing your direction", "Create a reusable prompt system"],
    resources: [
      {
        name: "Prompt library",
        type: "DOC",
        detail: "32 copy-ready prompts",
        url: "https://docs.google.com/document/d/1CprCDcetljv9e_3LMqOD0pNnQvLci-xWyrx7sfEOp7E/edit?usp=sharing",
      },
      ...resourceSet([["Prompt anatomy", "PDF", "The formula explained"], ["Audit worksheet", "DOC", "Improve an existing prompt"]]),
    ],
  },
  {
    number: 4,
    title: "Building the Website Using AI",
    duration: "28 min",
    eyebrow: "Build in public",
    description: "Use your prompts and visual direction to generate a responsive, conversion-ready website.",
    videoId: "4lxX9Mtey7c",
    learn: ["Map a high-converting landing page", "Generate responsive sections faster", "Give AI production-ready instructions"],
    resources: resourceSet([["Starter template", "ZIP", "Responsive page foundation"], ["Build prompts", "PDF", "Section-by-section commands"], ["Final source code", "ZIP", "Reference implementation"]]),
  },
  {
    number: 5,
    title: "Debugging",
    duration: "16 min",
    eyebrow: "Polish the details",
    description: "Learn a calm, repeatable process for resolving layout, copy, and code issues.",
    videoId: "J6nP9ho58hE",
    learn: ["Read errors without panic", "Debug responsive layouts", "Ask AI for focused fixes"],
    resources: resourceSet([["Debugging checklist", "PDF", "Find the signal faster"], ["Common fixes", "PDF", "12 fixes worth bookmarking"], ["QA template", "SHEET", "Test before launch"]]),
  },
  {
    number: 6,
    title: "Pushing to GitHub",
    duration: "12 min",
    eyebrow: "Own your work",
    description: "Put your project under version control and make your work easy to share.",
    videoId: "xBQD0_7Addo",
    learn: ["Create a clean repository", "Commit with confidence", "Share a project professionally"],
    resources: resourceSet([["Git cheat sheet", "PDF", "Every command in this lesson"], ["README template", "MD", "Make your repository shine"], ["Commit guide", "PDF", "Write helpful history"]]),
  },
  {
    number: 7,
    title: "Deployment",
    duration: "17 min",
    eyebrow: "Go live",
    description: "Deploy your site to the web, connect a domain, and share it with the world.",
    videoId: "M7lc1UVf-VE",
    learn: ["Prepare a production build", "Deploy with Vercel", "Handle your launch checklist"],
    resources: resourceSet([["Deployment guide", "PDF", "Launch in an afternoon"], ["Domain checklist", "PDF", "Before you connect DNS"], ["Launch copy", "DOC", "Announce your project"]]),
  },
  {
    number: 8,
    title: "Facebook Pixel + Redeployment",
    duration: "15 min",
    eyebrow: "Measure what matters",
    description: "Add conversion tracking correctly, verify events, and redeploy without breaking momentum.",
    videoId: "M7lc1UVf-VE",
    learn: ["Plan meaningful conversion events", "Install and verify a pixel", "Ship tracking safely"],
    resources: resourceSet([["Pixel setup guide", "PDF", "Start tracking properly"], ["Event map", "SHEET", "Plan your funnel events"], ["Redeploy checklist", "PDF", "Ship safely after changes"]]),
  },
  {
    number: 9,
    title: "Bonuses",
    duration: "22 min",
    eyebrow: "Your creative vault",
    description: "Take the prompt library, templates, tools, and advanced resources into your next project.",
    videoId: "ScMzIvxBSi4",
    learn: ["Use your prompt library strategically", "Choose the right tool for the task", "Build your next project faster"],
    resources: resourceSet([["Ultimate prompt library", "PDF", "50+ expert prompts"], ["Website templates", "ZIP", "Three launch-ready directions"], ["AI tools directory", "PDF", "A curated creative stack"]]),
  },
];

export const courseStats = {
  title: "AI Website Building Course",
  instructor: "Assharof Online Academy",
  totalLessons: courseLessons.length,
  totalRuntime: "2h 30m",
};