export type ModelCategory =
  | "Text LLM"
  | "Reasoning"
  | "Multimodal"
  | "Code"
  | "Small LLM"
  | "MoE"
  | "Agentic"
  | "Domain"
  | "Image/Video"
  | "Multilingual"
  | "Research";

export interface AIModel {
  id: string;
  company: string;
  country: string;
  model: string;
  category: ModelCategory;
  description: string;
  year: string;
  open_source: string;
  created_at: string;
  updated_at: string;
}

export type AIModelInsert = Omit<AIModel, "id" | "created_at" | "updated_at">;

export interface FilterState {
  country: string;
  category: string;
  company: string;
  search: string;
}

export const CATEGORY_COLORS: Record<ModelCategory, string> = {
  "Text LLM":    "#4f6bef",
  "Reasoning":   "#f59e0b",
  "Multimodal":  "#10b981",
  "Code":        "#8b5cf6",
  "Small LLM":   "#06b6d4",
  "MoE":         "#3b82f6",
  "Agentic":     "#ef4444",
  "Domain":      "#64748b",
  "Image/Video": "#ec4899",
  "Multilingual":"#14b8a6",
  "Research":    "#a1a1aa",
};

export const CATEGORY_DESCRIPTIONS: Record<ModelCategory, string> = {
  "Text LLM":    "General-purpose chat and text generation",
  "Reasoning":   "Think step-by-step before answering (slow but accurate)",
  "Multimodal":  "Handles images, audio, or video alongside text",
  "Code":        "Specialized for writing and debugging software",
  "Small LLM":   "Efficient models (<15B params) for on-device or low-cost use",
  "MoE":         "Mixture-of-Experts: huge total params, tiny active compute",
  "Agentic":     "Autonomous multi-step task execution without hand-holding",
  "Domain":      "Finance, science, specific human languages, or industries",
  "Image/Video": "Generative media — creates images or video from text",
  "Multilingual":"Trained explicitly across many human languages",
  "Research":    "Encoder/decoder models; foundational NLP infrastructure",
};
