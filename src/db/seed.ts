import { db } from "./index";
import { admins, profile, experiences, projects, skillGroups, certifications, achievements } from "./schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

async function seed() {
  const now = new Date();

// --- Admin account ---
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  throw new Error(
    "ADMIN_EMAIL and ADMIN_PASSWORD must be set in the .env file."
  );
}

const passwordHash = await bcrypt.hash(adminPassword, 10);

db.insert(admins)
  .values({
    id: randomUUID(),
    email: adminEmail,
    passwordHash,
  })
  .run();
  // --- Profile ---
  db.insert(profile)
    .values({
      id: randomUUID(),
      name: "Abhay Chand",
      title: "AI Engineer",
      tagline:
        "I build AI-powered applications — retrieval systems, multi-agent workflows, and the data pipelines underneath them.",
      bio:
        "I'm an AI Engineer currently working at Wavygo, where I build GenAI features for a travel platform, alongside data analysis and a production RAG chatbot. My background spans applied machine learning, retrieval-augmented generation, agentic systems, and the data engineering that makes them reliable. Before focusing on AI, I spent time in data analytics — building dashboards and pipelines — which still shapes how I think about grounding AI systems in real, verifiable data rather than treating them as black boxes.",
      location: "Noida, India",
      photoUrl: "/uploads/profile-photo.jpg",
      resumeUrl: null,
      email: null, // placeholder — set your real email in /admin
      githubUrl: null,
      linkedinUrl: null,
      yearsActive: "2026 — Present",
      focusAreas: JSON.stringify([
        "Retrieval-Augmented Generation",
        "Multi-Agent Systems",
        "LLM Application Development",
        "Data Analysis & Pipelines",
      ]),
      updatedAt: now,
    })
    .run();

  // --- Experience ---
  db.insert(experiences)
    .values({
      id: randomUUID(),
      role: "AI Intern",
      org: "Wavygo",
      startDate: "2026-06",
      endDate: null, // present
      summary:
        "Working across AI product development, data analysis, and a production support chatbot for Wavygo's bike/scooter rental platform.",
      highlights: JSON.stringify([
        "Built and deployed GenAI features for the rental platform, including a LangGraph-orchestrated RAG chatbot serving website and app support queries",
        "Designed and maintained the retrieval pipeline — document ingestion, ChromaDB indexing, and OpenAI embeddings — to keep chatbot responses grounded in current FAQ and policy content",
        "Collected, cleaned, and analyzed data to support model development, evaluation, and performance optimization",
        "Collaborated with cross-functional teams to build, document, and deploy AI solutions using Agile practices",
      ]),
      published: true,
      sortOrder: 0,
      createdAt: now,
      updatedAt: now,
    })
    .run();

  // --- Projects: AI/GenAI ---
  db.insert(projects)
    .values([
      {
        id: randomUUID(),
        title: "Tripo — Multi-Agent AI Travel Planner",
        slug: "tripo",
        category: "ai",
        summary:
          "A multi-agent backend that generates personalized worldwide travel plans in roughly six seconds, using five specialized LangGraph agents.",
        problem:
          "Generating a genuinely personalized travel itinerary requires coordinating several distinct kinds of reasoning — destination research, budget fit, sequencing — that don't work well as a single monolithic prompt.",
        solution:
          "Split the work across five specialized LangGraph agents (including destination research and itinerary building) that collaborate to produce a complete plan.",
        architecture:
          "Backend built with FastAPI and PostgreSQL, agent orchestration via LangGraph, with LangSmith used for tracing agent behavior. The full stack is containerized with Docker for reproducible deployment.",
        outcome:
          "Produces personalized itineraries for destinations worldwide in approximately six seconds. Diagnosed and fixed a production-blocking async/MCP integration failure caused by a nest_asyncio conflict, restoring reliable agent tool-calling.",
        challenges:
          "The nest_asyncio conflict specifically broke MCP tool-calling in production — tracking it down required isolating the async event loop interaction between the agent framework and the MCP integration layer.",
        techStack: JSON.stringify([
          "Python", "FastAPI", "LangChain", "LangGraph", "LangSmith",
          "MCP", "PostgreSQL", "Docker", "Pydantic", "RAG", "Embedding Models",
        ]),
        links: JSON.stringify({}),
        coverImageUrl: null,
        featured: true,
        published: true,
        sortOrder: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        title: "JurisSense — Agentic RAG Legal Assistant",
        slug: "jurissense",
        category: "ai",
        summary:
          "A retrieval-augmented legal assistant indexing over 2,400 chunks across nine Indian legal acts, built to reduce hallucinated answers in legal Q&A.",
        problem:
          "Single-shot RAG struggles with legal questions that require cross-referencing clauses across multiple documents, and ungrounded answers are especially costly in a legal context.",
        solution:
          "A full backend rebuilt across seven independent modules powering a RAG pipeline over Indian legal acts, with re-ranking and answer verification layered on top of retrieval.",
        architecture:
          "FastAPI backend, ChromaDB vector store using all-MiniLM-L6-v2 embeddings, Groq-hosted Llama 3.1 for generation, with DuckDuckGo (filtered to Indian law) and an IndianKanoon scraper for supplementary retrieval.",
        outcome:
          "Indexed 2,409+ chunks across 9 Indian legal acts. Added an ms-marco-MiniLM cross-encoder to re-rank retrieved passages and a DeBERTa NLI model to verify generated answers against source text, reducing unsupported or hallucinated claims.",
        challenges:
          "Currently developing LangGraph-based agentic retrieval to replace the single-shot pipeline, targeting multi-step reasoning for queries that span multiple documents — this is in progress rather than finished.",
        techStack: JSON.stringify([
          "FastAPI", "ChromaDB", "Groq", "Llama 3.1", "DuckDuckGo",
          "Cross-Encoder Re-ranking", "DeBERTa NLI", "RAG",
        ]),
        links: JSON.stringify({}),
        coverImageUrl: null,
        featured: true,
        published: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        title: "WavyGo — Website & App Support Chatbot",
        slug: "wavygo-chatbot",
        category: "ai",
        summary:
          "A production RAG chatbot answering support questions for Wavygo's website and app, grounded in the company's own FAQ and policy documents.",
        problem:
          "Support queries need answers grounded in current, accurate FAQ and policy content — not generic model knowledge that can drift or fabricate policy details.",
        solution:
          "Indexed five FAQ/policy documents in ChromaDB using OpenAI embeddings, with LangGraph orchestrating multi-step retrieval and response generation.",
        architecture:
          "FastAPI backend secured with JWT authentication; LangSmith used to trace and debug retrieval and generation behavior across the pipeline.",
        outcome:
          "A production chatbot serving real support queries on Wavygo's website and app, part of the broader AI Intern role at Wavygo.",
        challenges: null,
        techStack: JSON.stringify([
          "Python", "FastAPI", "LangChain", "LangGraph", "ChromaDB", "OpenAI", "LangSmith", "JWT",
        ]),
        links: JSON.stringify({}),
        coverImageUrl: null,
        featured: false,
        published: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
      },
      // --- Projects: Data Analytics ---
      {
        id: randomUUID(),
        title: "Economic Benchmark Analysis",
        slug: "economic-benchmark-analysis",
        category: "data",
        summary:
          "An end-to-end data analysis pipeline for World Bank indicators, turning raw global economic data into structured insight for reporting.",
        problem:
          "Raw World Bank indicator data isn't directly usable for business reporting — it needs cleaning, structuring, and a repeatable pipeline rather than one-off manual analysis.",
        solution:
          "Built an automated pipeline that pulls, cleans, and transforms World Bank data, feeding into interactive dashboards for decision-making.",
        architecture:
          "Python and Pandas/NumPy for data processing, SQLite for storage, the Requests library for data pulls, with Power BI dashboards and Jupyter/Matplotlib for exploration.",
        outcome:
          "Improved data accuracy and enabled reliable, repeatable analysis through an automated pipeline and interactive dashboards. A reference figure from the analysis: $9.31K global GDP per capita.",
        challenges: null,
        techStack: JSON.stringify([
          "Python", "Pandas", "NumPy", "SQLite", "Requests", "Power BI", "Jupyter", "Matplotlib",
        ]),
        links: JSON.stringify({}),
        coverImageUrl: null,
        featured: false,
        published: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        title: "Retail Sales Intelligence",
        slug: "retail-sales-intelligence",
        category: "data",
        summary:
          "An executive-level Power BI analytics solution analyzing multi-year retail sales performance across stores and product categories.",
        problem:
          "Retail decision-makers need a self-service view of profitability, demand, and performance across stores and categories, without relying on manual analysis for every question.",
        solution:
          "Built a Power BI solution identifying the KPIs critical for profitability, demand forecasting, and business performance tracking.",
        architecture:
          "Power BI with Power Query for transformation and DAX for measures, backed by a structured data model over multi-year retail sales data.",
        outcome:
          "Delivered a self-service analytics dashboard enabling data-driven decisions for profitability optimization, demand planning, and strategic reporting — reducing reliance on manual analysis. Headline result: 142% year-over-year growth surfaced through the analysis.",
        challenges: null,
        techStack: JSON.stringify([
          "Power BI", "Power Query", "DAX", "Data Modeling", "Data Visualization",
        ]),
        links: JSON.stringify({}),
        coverImageUrl: null,
        featured: false,
        published: true,
        sortOrder: 4,
        createdAt: now,
        updatedAt: now,
      },
    ])
    .run();

  // --- Skill groups ---
  db.insert(skillGroups)
    .values([
      {
        id: randomUUID(),
        name: "GenAI & LLM Systems",
        skills: JSON.stringify([
          "LLMs (OpenAI, Gemini)", "LangChain", "LangGraph", "RAG",
          "Prompt Engineering", "Agentic / Multi-Agent Systems", "Embeddings",
          "HuggingFace Transformers", "LangSmith", "Model Context Protocol (MCP)",
        ]),
        sortOrder: 0,
        published: true,
      },
      {
        id: randomUUID(),
        name: "AI / ML Core",
        skills: JSON.stringify([
          "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
          "Model Evaluation & Fine-tuning", "Feature Engineering",
        ]),
        sortOrder: 1,
        published: true,
      },
      {
        id: randomUUID(),
        name: "Backend & APIs",
        skills: JSON.stringify([
          "FastAPI", "REST API Design", "SQLAlchemy", "Async Python", "JWT Auth",
        ]),
        sortOrder: 2,
        published: true,
      },
      {
        id: randomUUID(),
        name: "Data Analytics & BI",
        skills: JSON.stringify([
          "Data Analysis", "Exploratory Data Analysis", "Statistical Analysis",
          "Data Cleaning & Transformation", "KPI Tracking", "Trend Analysis",
          "Power BI (DAX, Power Query)", "Tableau", "Looker", "Advanced Excel",
        ]),
        sortOrder: 3,
        published: true,
      },
      {
        id: randomUUID(),
        name: "Languages & Libraries",
        skills: JSON.stringify([
          "Python", "SQL", "JavaScript", "HTML", "CSS",
          "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Seaborn", "PySpark",
        ]),
        sortOrder: 4,
        published: true,
      },
      {
        id: randomUUID(),
        name: "Databases & Cloud",
        skills: JSON.stringify([
          "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis",
          "Vector Databases (FAISS, Chroma)", "AWS (S3, RDS)", "GCP (BigQuery)",
        ]),
        sortOrder: 5,
        published: true,
      },
      {
        id: randomUUID(),
        name: "Tools & Platforms",
        skills: JSON.stringify(["Git / GitHub", "Docker", "LangSmith"]),
        sortOrder: 6,
        published: true,
      },
    ])
    .run();

  // --- Certifications (merged, de-duplicated across both resumes) ---
  db.insert(certifications)
    .values([
      { id: randomUUID(), name: "Python for Data Science, AI & Development", issuer: "IBM", dateEarned: null, url: null, published: true, sortOrder: 0 },
      { id: randomUUID(), name: "Databases and SQL for Data Science with Python", issuer: "IBM", dateEarned: null, url: null, published: true, sortOrder: 1 },
      { id: randomUUID(), name: "Excel for Data Analysis", issuer: "IBM", dateEarned: "2026-02", url: null, published: true, sortOrder: 2 },
      { id: randomUUID(), name: "Enterprise Data Science in Practice", issuer: "IBM", dateEarned: null, url: null, published: true, sortOrder: 3 },
      { id: randomUUID(), name: "Machine Learning with Apache Spark", issuer: "IBM", dateEarned: null, url: null, published: true, sortOrder: 4 },
      { id: randomUUID(), name: "Building LLM Applications With Prompt Engineering", issuer: "IBM", dateEarned: null, url: null, published: true, sortOrder: 5 },
      { id: randomUUID(), name: "Neo4j Fundamentals", issuer: "Neo4j", dateEarned: null, url: null, published: true, sortOrder: 6 },
      { id: randomUUID(), name: "Data Analytics Job Simulation", issuer: "Deloitte Australia (Forage)", dateEarned: null, url: null, published: true, sortOrder: 7 },
    ])
    .run();

  // --- Achievements ---
  db.insert(achievements)
    .values([
      {
        id: randomUUID(),
        title: "State-Level Hackathon Finalist",
        description: "EVORA — designed an environmental awareness platform using gamified learning and real-world engagement.",
        dateEarned: "2025-11",
        url: null,
        published: true,
        sortOrder: 0,
      },
    ])
    .run();

  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
