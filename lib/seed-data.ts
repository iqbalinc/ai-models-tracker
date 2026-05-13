import type { AIModelInsert } from "./types";

export const SEED_MODELS: AIModelInsert[] = [
  // ── OpenAI ─────────────────────────────────────────────────────────────────
  { company:"OpenAI", country:"USA", model:"GPT-1",         category:"Research",    year:"2018", open_source:"MIT",         description:"First GPT proof-of-concept; introduced the pre-train → fine-tune paradigm for NLP." },
  { company:"OpenAI", country:"USA", model:"GPT-2",         category:"Text LLM",    year:"2019", open_source:"MIT",         description:"1.5B param generative model; famously withheld at first due to misuse concerns. Great for creative writing." },
  { company:"OpenAI", country:"USA", model:"GPT-3",         category:"Text LLM",    year:"2020", open_source:"Proprietary", description:"175B param few-shot learner. Demonstrated that scale alone unlocks emergent language abilities." },
  { company:"OpenAI", country:"USA", model:"GPT-4",         category:"Multimodal",  year:"2023", open_source:"Proprietary", description:"First GPT with vision. Accepts images + text; dramatically better reasoning than GPT-3.5." },
  { company:"OpenAI", country:"USA", model:"GPT-4.5",       category:"Multimodal",  year:"2025", open_source:"Proprietary", description:"OpenAI's largest non-reasoning model at its release; improved instruction following and nuance." },
  { company:"OpenAI", country:"USA", model:"o1",            category:"Reasoning",   year:"2024", open_source:"Proprietary", description:"First 'reasoning model' — spends extra compute thinking step-by-step. Excels at math and science." },
  { company:"OpenAI", country:"USA", model:"o3 / o4-mini",  category:"Reasoning",   year:"2025", open_source:"Proprietary", description:"Next-gen reasoning. o3 is frontier; o4-mini trades capacity for speed at a fraction of the cost." },
  { company:"OpenAI", country:"USA", model:"GPT-5",         category:"Multimodal",  year:"2025", open_source:"Proprietary", description:"Flagship combining strong text generation with reasoning. Available in GPT-5, mini, and nano sizes." },
  { company:"OpenAI", country:"USA", model:"GPT-5.2",       category:"Multimodal",  year:"2025", open_source:"Proprietary", description:"Science and math-focused update to GPT-5; improvements in quantitative reasoning and research tasks." },
  { company:"OpenAI", country:"USA", model:"GPT-5.3-Codex", category:"Code",        year:"2026", open_source:"Proprietary", description:"Agentic coding model; writes, runs, and iterates on code autonomously across long software tasks." },
  { company:"OpenAI", country:"USA", model:"GPT-5.5",       category:"Multimodal",  year:"2026", open_source:"Proprietary", description:"Current OpenAI flagship (April 2026). 1T+ MoE; best-in-class on most benchmarks." },
  { company:"OpenAI", country:"USA", model:"DALL-E 3",      category:"Image/Video", year:"2023", open_source:"Proprietary", description:"Text-to-image model integrated into ChatGPT. Understands complex prompts; excels at typography in images." },
  { company:"OpenAI", country:"USA", model:"Sora",          category:"Image/Video", year:"2024", open_source:"Proprietary", description:"Text-to-video model; generates realistic 1080p video clips up to 60 seconds from natural language." },
  { company:"OpenAI", country:"USA", model:"Whisper",       category:"Multilingual",year:"2022", open_source:"MIT",         description:"Speech-to-text model supporting 99 languages. Near-human accuracy; widely used for transcription." },

  // ── Anthropic ──────────────────────────────────────────────────────────────
  { company:"Anthropic", country:"USA", model:"Claude 1",         category:"Text LLM",   year:"2021", open_source:"Proprietary", description:"Trained with Constitutional AI (CAI) — rules-based RLHF to make outputs safe and helpful." },
  { company:"Anthropic", country:"USA", model:"Claude 2",         category:"Text LLM",   year:"2023", open_source:"Proprietary", description:"100K-token context window. Strong at summarizing large documents and long conversations." },
  { company:"Anthropic", country:"USA", model:"Claude 3",         category:"Multimodal", year:"2024", open_source:"Proprietary", description:"Family of three: Haiku (fast), Sonnet (balanced), Opus (powerful). First Claude with vision." },
  { company:"Anthropic", country:"USA", model:"Claude 3.5 Sonnet",category:"Multimodal", year:"2024", open_source:"Proprietary", description:"Ranked #1 on SWE-bench coding; brought computer-use (controlling desktop GUIs via screenshots)." },
  { company:"Anthropic", country:"USA", model:"Claude 3.7 Sonnet",category:"Reasoning",  year:"2025", open_source:"Proprietary", description:"Hybrid model with visible 'thinking' mode. First reasoning-capable Claude; improved code and analysis." },
  { company:"Anthropic", country:"USA", model:"Claude 4",         category:"Agentic",    year:"2025", open_source:"Proprietary", description:"Designed for autonomous long-horizon tasks; improved tool use and multi-step planning." },
  { company:"Anthropic", country:"USA", model:"Claude Opus 4.7",  category:"Agentic",    year:"2026", open_source:"Proprietary", description:"Current Anthropic flagship (April 2026). Largest Claude; top scores on agentic and reasoning benchmarks." },

  // ── Google DeepMind ────────────────────────────────────────────────────────
  { company:"Google DeepMind", country:"USA/UK", model:"BERT",        category:"Research",    year:"2018", open_source:"Apache 2.0", description:"Bidirectional encoder. Transformed NLP understanding; powers Google Search ranking to this day." },
  { company:"Google DeepMind", country:"USA/UK", model:"T5",          category:"Research",    year:"2019", open_source:"Apache 2.0", description:"Text-to-Text Transfer Transformer. Unified all NLP tasks as text-in → text-out." },
  { company:"Google DeepMind", country:"USA/UK", model:"PaLM",        category:"Text LLM",    year:"2022", open_source:"Proprietary", description:"540B Pathways Language Model; breakthrough on few-shot reasoning via chain-of-thought prompting." },
  { company:"Google DeepMind", country:"USA/UK", model:"Chinchilla",  category:"Research",    year:"2022", open_source:"Proprietary", description:"Proved models were undertrained on data. Reshaped how all labs train LLMs." },
  { company:"Google DeepMind", country:"USA/UK", model:"Gemini 1.0",  category:"Multimodal",  year:"2023", open_source:"Proprietary", description:"First natively multimodal Google model: text, image, audio, video in a single architecture." },
  { company:"Google DeepMind", country:"USA/UK", model:"Gemma",       category:"Small LLM",   year:"2024", open_source:"Gemma Terms", description:"Open lightweight models (2B–7B). Same architecture as Gemini; runs on a laptop or phone." },
  { company:"Google DeepMind", country:"USA/UK", model:"Gemini 1.5",  category:"Multimodal",  year:"2024", open_source:"Proprietary", description:"1M-token context window. Can read a whole codebase in one prompt." },
  { company:"Google DeepMind", country:"USA/UK", model:"Gemini 2.0",  category:"Agentic",     year:"2025", open_source:"Proprietary", description:"Agentic design with native tool use; Flash/Lite/Pro variants. Deep integration with Google services." },
  { company:"Google DeepMind", country:"USA/UK", model:"Gemini 2.5",  category:"Reasoning",   year:"2025", open_source:"Proprietary", description:"'Most intelligent Google model' at launch. Hybrid thinking mode; top-tier on reasoning benchmarks." },
  { company:"Google DeepMind", country:"USA/UK", model:"Gemini 3",    category:"Reasoning",   year:"2025", open_source:"Proprietary", description:"Flagship as of late 2025. Omni-modal MoE with 1M-token context and strong agentic capabilities." },
  { company:"Google DeepMind", country:"USA/UK", model:"Gemma 4",     category:"Small LLM",   year:"2026", open_source:"Apache 2.0",  description:"Apache 2.0 license. 31B model; targets Chinese open-weight models on benchmarks." },

  // ── Meta AI ────────────────────────────────────────────────────────────────
  { company:"Meta AI", country:"USA", model:"LLaMA 1",     category:"Text LLM",   year:"2023", open_source:"Non-commercial", description:"Efficient 65B model. Weights leaked; accidentally launched the open-source AI era." },
  { company:"Meta AI", country:"USA", model:"LLaMA 2",     category:"Text LLM",   year:"2023", open_source:"LLaMA 2",        description:"First commercial-use open LLM from Meta. 70B model; fine-tuned for chat. Spawned thousands of variants." },
  { company:"Meta AI", country:"USA", model:"LLaMA 3.1",   category:"Text LLM",   year:"2024", open_source:"LLaMA 3",        description:"405B open model trained on 15.6T tokens; matched GPT-4 on many benchmarks." },
  { company:"Meta AI", country:"USA", model:"LLaMA 4",     category:"Multimodal", year:"2025", open_source:"LLaMA 4",        description:"Native multimodal MoE. 17B active params from 128 experts; Maverick and Scout variants." },
  { company:"Meta AI", country:"USA", model:"Muse Spark",  category:"Agentic",    year:"2026", open_source:"Proprietary",    description:"Meta Superintelligence Labs' first model. Aimed at 'personal superintelligence'; agentic task execution." },

  // ── Microsoft ──────────────────────────────────────────────────────────────
  { company:"Microsoft", country:"USA", model:"Phi-1",     category:"Small LLM",  year:"2023", open_source:"MIT", description:"1.3B model trained on 'textbook-quality' data. Proved tiny models can reason if data quality is high." },
  { company:"Microsoft", country:"USA", model:"Phi-2",     category:"Small LLM",  year:"2023", open_source:"MIT", description:"2.7B model outperforming 7–13B models. Runs on device; showed scale isn't everything." },
  { company:"Microsoft", country:"USA", model:"Phi-3",     category:"Small LLM",  year:"2024", open_source:"MIT", description:"14B model capable of running on a phone. Best small model in its class for coding and reasoning." },
  { company:"Microsoft", country:"USA", model:"Phi-4",     category:"Small LLM",  year:"2024", open_source:"MIT", description:"14B complex reasoning model. Trained on 9.8T tokens of synthetic data; beats models 5× larger." },

  // ── xAI ────────────────────────────────────────────────────────────────────
  { company:"xAI", country:"USA", model:"Grok-1",   category:"Text LLM",   year:"2023", open_source:"Apache 2.0",  description:"314B MoE open-sourced in 2024. First model with real-time access to X (Twitter) for current knowledge." },
  { company:"xAI", country:"USA", model:"Grok-2",   category:"Multimodal", year:"2024", open_source:"Source-avail",description:"Added image understanding; integrated into X platform. Later released as Grok 2.5 open-source." },
  { company:"xAI", country:"USA", model:"Grok-3",   category:"Reasoning",  year:"2025", open_source:"Proprietary", description:"'Age of Reasoning Agents' — xAI's first reasoning model with think-before-answer capability." },
  { company:"xAI", country:"USA", model:"Grok-4",   category:"Agentic",    year:"2026", open_source:"Proprietary", description:"Frontier multimodal MoE. Solved an open math problem no human had resolved; deep agentic integration." },

  // ── Amazon ─────────────────────────────────────────────────────────────────
  { company:"Amazon", country:"USA", model:"Amazon Nova", category:"Multimodal", year:"2024", open_source:"Proprietary", description:"Three-tier family: Micro (text), Lite (multimodal), Pro (complex tasks). Powers AWS Bedrock." },

  // ── EleutherAI ─────────────────────────────────────────────────────────────
  { company:"EleutherAI", country:"USA", model:"GPT-Neo / GPT-J", category:"Text LLM", year:"2021", open_source:"MIT/Apache", description:"First credible open-source GPT-3 alternatives. Community-driven; pivotal in the open AI movement." },
  { company:"EleutherAI", country:"USA", model:"GPT-NeoX-20B",    category:"Text LLM", year:"2022", open_source:"Apache 2.0", description:"20B open model trained on The Pile dataset. Published training process enabled reproducible research." },

  // ── Allen AI ───────────────────────────────────────────────────────────────
  { company:"Allen AI (Ai2)", country:"USA", model:"OLMo 1/2/3", category:"Research", year:"2024–2025", open_source:"Apache 2.0", description:"Fully open LLM: weights, data, training code all public. Enables reproducible AI science." },

  // ── Nvidia ─────────────────────────────────────────────────────────────────
  { company:"Nvidia", country:"USA", model:"Nemotron-4 340B", category:"Text LLM", year:"2024", open_source:"NVIDIA Open", description:"340B model trained on 9T tokens of synthetic data. Excels at generating synthetic training data for other models." },

  // ── IBM ────────────────────────────────────────────────────────────────────
  { company:"IBM", country:"USA", model:"Granite",      category:"Domain", year:"2023", open_source:"Proprietary", description:"Enterprise text model trained on business documents, code, and legal data. Powers IBM Watsonx." },
  { company:"IBM", country:"USA", model:"Granite Code", category:"Code",   year:"2024", open_source:"Apache 2.0",  description:"Open code model family (3B–34B). Specialised for code completion and debugging in enterprise environments." },

  // ── Bloomberg ──────────────────────────────────────────────────────────────
  { company:"Bloomberg", country:"USA", model:"BloombergGPT", category:"Domain", year:"2023", open_source:"Unreleased", description:"50B financial LLM trained on Bloomberg's proprietary financial text. Best finance NLP model at launch." },

  // ── Cohere ─────────────────────────────────────────────────────────────────
  { company:"Cohere", country:"Canada", model:"Command R+", category:"Text LLM",    year:"2024", open_source:"Proprietary", description:"Enterprise RAG model; optimised for retrieval-augmented generation workflows and citations." },
  { company:"Cohere", country:"Canada", model:"Aya",        category:"Multilingual", year:"2024", open_source:"Research",    description:"Supports 101 languages. Community-built multilingual instruction dataset." },

  // ── DeepSeek ───────────────────────────────────────────────────────────────
  { company:"DeepSeek", country:"China", model:"DeepSeek-LLM",  category:"Text LLM",  year:"2023", open_source:"DeepSeek", description:"67B open model matching GPT-3.5; sparked China's open-source LLM wave." },
  { company:"DeepSeek", country:"China", model:"DeepSeek-V2",   category:"MoE",       year:"2024", open_source:"DeepSeek", description:"236B MoE (21B active). Same quality at 1/5 the inference cost of dense models." },
  { company:"DeepSeek", country:"China", model:"DeepSeek-V3",   category:"MoE",       year:"2024", open_source:"MIT",      description:"671B MoE trained for only $5.6M — shocked the industry on cost efficiency. GPT-4-class performance." },
  { company:"DeepSeek", country:"China", model:"DeepSeek-R1",   category:"Reasoning", year:"2025", open_source:"MIT",      description:"Pure RL-trained reasoning model — no supervised fine-tuning. Matched OpenAI o1 on math and science." },
  { company:"DeepSeek", country:"China", model:"DeepSeek-V3.2", category:"MoE",       year:"2025", open_source:"MIT",      description:"Hybrid reasoning + generation; can switch between fast response and slow thinking modes." },
  { company:"DeepSeek", country:"China", model:"DeepSeek-V4",   category:"Agentic",   year:"2026", open_source:"MIT",      description:"Flash (284B) and Pro (1.6T). Designed for agentic coding and long-horizon software engineering." },

  // ── Alibaba / Qwen ─────────────────────────────────────────────────────────
  { company:"Alibaba (Qwen)", country:"China", model:"Qwen2",              category:"Text LLM",  year:"2024", open_source:"Various",     description:"72B multilingual model trained on 3T tokens. Strong on Chinese and English; widely fine-tuned." },
  { company:"Alibaba (Qwen)", country:"China", model:"Qwen2.5",            category:"Text LLM",  year:"2024", open_source:"Various",     description:"Family of 7 dense sizes (0.5B–72B) plus MoE variants. Best open multilingual model of 2024." },
  { company:"Alibaba (Qwen)", country:"China", model:"Qwen3-Max-Thinking", category:"Reasoning", year:"2026", open_source:"Proprietary", description:"Adaptive tool-use with test-time scaling and iterative self-reflection mechanism." },
  { company:"Alibaba (Qwen)", country:"China", model:"Qwen3.6",            category:"MoE",       year:"2026", open_source:"Apache 2.0",  description:"35B total / 3B active MoE. Outperforms Gemma 4 on benchmarks at a fraction of the active compute." },

  // ── Moonshot AI ────────────────────────────────────────────────────────────
  { company:"Moonshot AI", country:"China", model:"Kimi K2",   category:"Agentic", year:"2026", open_source:"Modified MIT", description:"1T-parameter MoE (32B active). 'Agent Swarm' — coordinates up to 100 parallel sub-agents." },
  { company:"Moonshot AI", country:"China", model:"Kimi K2.5", category:"Agentic", year:"2026", open_source:"Modified MIT", description:"Visual agentic model derived from K2. Handles images in multi-step autonomous workflows." },

  // ── Baidu ──────────────────────────────────────────────────────────────────
  { company:"Baidu", country:"China", model:"Ernie 3.0 Titan", category:"Text LLM", year:"2021", open_source:"Proprietary", description:"260B knowledge-enhanced Chinese LLM. Integrates knowledge graphs to reduce hallucinations." },

  // ── Z.ai / Zhipu ───────────────────────────────────────────────────────────
  { company:"Z.ai (Zhipu)", country:"China", model:"GLM-4.5", category:"Reasoning", year:"2025", open_source:"MIT", description:"Reasoning + code model; beats early Claude 3 Opus on coding benchmarks." },
  { company:"Z.ai (Zhipu)", country:"China", model:"GLM-5",   category:"MoE",       year:"2026", open_source:"MIT", description:"754B MoE open model. Broad multilingual capability; MIT license." },
  { company:"Z.ai (Zhipu)", country:"China", model:"GLM-5.1", category:"Code",      year:"2026", open_source:"MIT", description:"Agentic coding model beating Opus 4.6 and GPT-5.4 on SWE-Bench Pro. Multi-hour software engineering." },

  // ── Xiaomi ─────────────────────────────────────────────────────────────────
  { company:"Xiaomi", country:"China", model:"MiMo-V2-Pro",   category:"Agentic", year:"2026", open_source:"Proprietary", description:"1T-param MoE with 1M-token context. Multimodal + agentic; debuted anonymously as 'Hunter Alpha'." },
  { company:"Xiaomi", country:"China", model:"MiMo-V2.5-Pro", category:"Agentic", year:"2026", open_source:"MIT",         description:"1.02T-param MIT-licensed update. Designed for long-running agentic AI with extended reasoning." },

  // ── StepFun ────────────────────────────────────────────────────────────────
  { company:"StepFun", country:"China", model:"Step-3.5-Flash", category:"MoE", year:"2026", open_source:"Apache 2.0", description:"196B MoE (11B active). Fast, cheap inference; outperformed larger rivals on reasoning tasks." },

  // ── Mistral AI ─────────────────────────────────────────────────────────────
  { company:"Mistral AI", country:"France", model:"Mistral 7B",     category:"Small LLM", year:"2023", open_source:"Apache 2.0", description:"7B model beating LLaMA 2 13B. Introduced sliding window attention for longer context at low cost." },
  { company:"Mistral AI", country:"France", model:"Mixtral 8x7B",   category:"MoE",       year:"2023", open_source:"Apache 2.0", description:"First prominent open MoE: 8 experts, 2 active per token. Beat GPT-3.5 as open-source." },
  { company:"Mistral AI", country:"France", model:"Mixtral 8x22B",  category:"MoE",       year:"2024", open_source:"Apache 2.0", description:"141B total / ~39B active. Strongest open MoE of 2024; multilingual and code-capable." },
  { company:"Mistral AI", country:"France", model:"Pixtral",        category:"Multimodal",year:"2024", open_source:"Research",   description:"123B multimodal model with image understanding. First Mistral model to handle visual inputs." },
  { company:"Mistral AI", country:"France", model:"Mistral Small 4",category:"Small LLM", year:"2026", open_source:"Apache 2.0", description:"119B MoE (6B active). Multipurpose — replaces multiple specialized models in one deployment." },

  // ── Yandex ─────────────────────────────────────────────────────────────────
  { company:"Yandex", country:"Russia", model:"YaLM 100B",     category:"Multilingual", year:"2022", open_source:"Apache 2.0",  description:"100B Russian/English bilingual model. First frontier-scale model with strong Russian capability." },
  { company:"Yandex", country:"Russia", model:"YandexGPT 1–4", category:"Text LLM",     year:"2023–2024", open_source:"Proprietary", description:"Successive proprietary models powering Yandex Search, Alice assistant, and cloud APIs." },

  // ── Sarvam AI ──────────────────────────────────────────────────────────────
  { company:"Sarvam AI", country:"India", model:"Sarvam-1",    category:"Domain", year:"2024", open_source:"Research",   description:"2B model trained on 10 Indian languages + English. Outperformed Gemma-2 on Indic language tasks." },
  { company:"Sarvam AI", country:"India", model:"Sarvam-M",    category:"Domain", year:"2025", open_source:"Apache 2.0", description:"Hybrid reasoning model fine-tuned on Mistral Small; optimized for math, coding, and Indian languages." },
  { company:"Sarvam AI", country:"India", model:"Sarvam-105B", category:"Domain", year:"2026", open_source:"Apache 2.0", description:"105B MoE (10.3B active). India's first independently-trained foundation model at frontier scale." },

  // ── BharatGen ──────────────────────────────────────────────────────────────
  { company:"BharatGen", country:"India", model:"Param-1", category:"Domain", year:"2025", open_source:"Research", description:"2.9B model supporting 22 Indic languages and Hinglish (Hindi-English code-switching)." },
  { company:"BharatGen", country:"India", model:"Param-2", category:"Domain", year:"2026", open_source:"Research", description:"17B MoE reasoning model; first LLM compliant with the EU Artificial Intelligence Act." },

  // ── TII (UAE) ──────────────────────────────────────────────────────────────
  { company:"TII", country:"UAE", model:"Falcon 7B / 40B", category:"Text LLM", year:"2023", open_source:"Apache 2.0", description:"Abu Dhabi-built open models. Falcon 40B was #1 on Open LLM Leaderboard at launch." },

  // ── Fujitsu / Japan ────────────────────────────────────────────────────────
  { company:"Fujitsu / RIKEN", country:"Japan", model:"Fugaku-LLM 13B", category:"Research", year:"2024", open_source:"Fugaku Terms", description:"Largest LLM trained entirely on CPUs; used Japan's Fugaku supercomputer. Focused on Japanese NLP." },

  // ── AI21 Labs ──────────────────────────────────────────────────────────────
  { company:"AI21 Labs", country:"Israel", model:"Jurassic-1 / 2", category:"Text LLM", year:"2021–2023", open_source:"Proprietary", description:"178B language model. Early GPT-3 rival from Israel; powers Wordtune and enterprise writing tools." },

  // ── ETH Zürich ─────────────────────────────────────────────────────────────
  { company:"ETH Zürich", country:"Switzerland", model:"Apertus", category:"Multilingual", year:"2025", open_source:"Open", description:"First LLM certified compliant with the EU AI Act. Multilingual; fully transparent training data." },

  // ── HuggingFace / LAION ────────────────────────────────────────────────────
  { company:"Hugging Face / LAION", country:"International", model:"BLOOM",         category:"Multilingual", year:"2022", open_source:"Responsible AI", description:"176B open multilingual model trained in 46 languages by a global 1,000-person collaboration." },
  { company:"Hugging Face / LAION", country:"International", model:"OpenAssistant", category:"Text LLM",     year:"2023", open_source:"Apache 2.0",    description:"Community-built open-source ChatGPT alternative; first high-quality open conversational model." },
];
