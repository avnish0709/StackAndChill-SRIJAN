import {
  AlertCircle,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  File,
  FileArchive,
  FileCheck2,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  MessageCircle,
  Paperclip,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { sendChatMessage, EvidenceItem, AttachedFile } from "@/lib/api";

type ToolKey = "files" | "photos" | "documents";
type EvidenceStatus = "Supported" | "Partly supported" | "Insufficient";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const toolItems: Array<{
  key: ToolKey;
  label: string;
  helper: string;
  icon: typeof File;
  tone: string;
  accept: string;
}> = [
  {
    key: "files",
    label: "Files",
    helper: "Browse case materials",
    icon: FolderOpen,
    tone: "tool-card--navy",
    accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  },
  {
    key: "photos",
    label: "Photos",
    helper: "Add images or scans",
    icon: ImageIcon,
    tone: "tool-card--clay",
    accept: ".jpg,.jpeg,.png",
  },
  {
    key: "documents",
    label: "Documents",
    helper: "Organise source PDFs",
    icon: FileText,
    tone: "tool-card--saffron",
    accept: ".pdf,.doc,.docx",
  },
];

const defaultEvidenceRows: EvidenceItem[] = [
  {
    title: "Security Deposit Liability",
    detail: "Statutory deposit return obligation under tenancy rules",
    status: "Supported",
  },
  {
    title: "Written Demand Notice",
    detail: "Formal notice to landlord requesting refund",
    status: "Partly supported",
  },
  {
    title: "Jurisdictional Authority",
    detail: "Rent Control Court / Small Causes Court jurisdiction",
    status: "Supported",
  },
];

function statusClasses(status: EvidenceStatus) {
  if (status === "Supported") return "evidence-pill evidence-pill--supported";
  if (status === "Partly supported") return "evidence-pill evidence-pill--partial";
  return "evidence-pill evidence-pill--insufficient";
}

function Logo() {
  return (
    <div className="brand-lockup" aria-label="ClauseIQ">
      <div>
        <p className="brand-name">CLAUSE<span>IQ</span></p>
      </div>
    </div>
  );
}

function Header({ onHelp }: { onHelp: () => void }) {
  return (
    <header className="app-header">
      <Logo />
      <nav className="top-nav" aria-label="Primary navigation">
        <a className="top-nav__link top-nav__link--active" href="#workspace">Workspace</a>
        <a className="top-nav__link" href="#how-it-works">How it works</a>
        <a className="top-nav__link" href="#responsible-use">Responsible use</a>
      </nav>
    </header>
  );
}

function SideRail() {
  return (
    <aside className="left-rail" aria-label="Workspace navigation">
      <div className="rail-kicker">Your workspace</div>
      <div className="rail-nav">
        <a className="rail-nav__item rail-nav__item--active" href="#workspace">
          <LayoutGrid size={17} />
          <span>Overview</span>
        </a>
        <a className="rail-nav__item" href="#case-file" onClick={() => toast("Case file view is active.")}>
          <FileCheck2 size={17} />
          <span>Case file</span>
        </a>
        <a className="rail-nav__item" href="#evidence" onClick={() => toast("Evidence index updated below.")}>
          <ClipboardCheck size={17} />
          <span>Evidence index</span>
        </a>
      </div>
      <div className="rail-divider" />
      <div className="rail-caption">
        <ShieldCheck size={18} />
        <div>
          <strong>Private by design</strong>
          <span>Real Multimodal Gemini AI connected.</span>
        </div>
      </div>
      <div className="rail-bottom">
        <span className="status-dot" />
        <span>Live Gemini Engine</span>
      </div>
    </aside>
  );
}

function ActionRail({ activeTool, onSelect }: { activeTool: ToolKey; onSelect: (key: ToolKey) => void }) {
  return (
    <aside className="action-rail" aria-label="File and media actions">
      <div className="action-rail__heading">
        <div>
          <p className="section-label">Quick tools</p>
          <h2>Bring in what matters.</h2>
        </div>
        <span className="utility-count">03</span>
      </div>
      <p className="action-rail__intro">Keep documents, photos, and supporting files close to the question you are asking.</p>
      <div className="tool-stack">
        {toolItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTool === item.key;
          return (
            <button
              key={item.key}
              type="button"
              className={`tool-card ${item.tone} ${isActive ? "tool-card--active" : ""}`}
              onClick={() => onSelect(item.key)}
              style={{ "--tool-delay": `${index * 45}ms` } as React.CSSProperties}
            >
              <span className="tool-card__icon"><Icon size={19} strokeWidth={1.7} /></span>
              <span className="tool-card__copy"><strong>{item.label}</strong><small>{item.helper}</small></span>
              <ArrowUpRight className="tool-card__arrow" size={16} />
            </button>
          );
        })}
      </div>
      <div className="action-rail__note">
        <Paperclip size={16} />
        <span>Supported: PDF, JPG, PNG, DOCX</span>
      </div>
      <div className="case-summary">
        <div className="case-summary__top"><span>Current case</span><span className="case-summary__status">Active</span></div>
        <strong>Tenancy & Rights</strong>
        <span>Multimodal PDF / Image Reader</span>
      </div>
    </aside>
  );
}

function UploadCard({
  attachedFile,
  onFileSelect,
  onFileRemove,
  toolAccept,
}: {
  attachedFile?: AttachedFile;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  toolAccept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const acceptFile = (file?: File) => {
    if (!file) return;
    onFileSelect(file);
  };

  const fileSizeText = attachedFile
    ? `${(attachedFile.data.length * 0.75 / 1024).toFixed(1)} KB`
    : "";

  return (
    <section className="surface-card upload-card" aria-labelledby="upload-title">
      <div className="card-heading-row">
        <div>
          <p className="section-label">Step 01 · Source</p>
          <h2 id="upload-title">Add a document to begin.</h2>
        </div>
        <div className="step-marker">1 / 3</div>
      </div>
      <p className="card-lead">Start with the file that contains the facts. Gemini will parse the text, clauses, and evidence directly from your file.</p>
      {!attachedFile ? (
        <button
          type="button"
          className={`dropzone ${dragging ? "dropzone--dragging" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); acceptFile(event.dataTransfer.files?.[0]); }}
        >
          <span className="dropzone__icon"><UploadCloud size={23} strokeWidth={1.6} /></span>
          <strong>{dragging ? "Release to add this file" : "Drop a document here"}</strong>
          <span>PDF, DOCX, JPG, PNG · up to 20 MB</span>
          <span className="dropzone__button">Choose file <ArrowUpRight size={14} /></span>
          <input
            ref={inputRef}
            hidden
            type="file"
            accept={toolAccept || ".pdf,.doc,.docx,.jpg,.jpeg,.png"}
            onChange={(event) => acceptFile(event.target.files?.[0])}
          />
        </button>
      ) : (
        <div className="uploaded-file">
          <div className="uploaded-file__icon"><FileArchive size={21} /></div>
          <div className="uploaded-file__copy">
            <strong>{attachedFile.name}</strong>
            <span>{attachedFile.mimeType} · {fileSizeText} · Ready for AI analysis</span>
          </div>
          <span className="uploaded-file__state"><Check size={14} /> Ready</span>
          <button className="icon-button icon-button--small" type="button" aria-label="Remove file" onClick={onFileRemove}>
            <X size={15} />
          </button>
        </div>
      )}
      <div className="upload-card__footer">
        <span><ShieldCheck size={14} /> Gemini Multimodal File Reader</span>
        <button type="button" onClick={() => inputRef.current?.click()}>
          {attachedFile ? "Replace file" : "Browse files"}
        </button>
      </div>
    </section>
  );
}

function QuestionCard({
  action,
  setAction,
  onAnalyze,
  options,
  analyzing,
}: {
  action: string;
  setAction: (value: string) => void;
  onAnalyze: (msg?: string) => void;
  options: string[];
  analyzing: boolean;
}) {
  return (
    <section className="surface-card question-card" aria-labelledby="question-title">
      <div className="card-heading-row">
        <div>
          <p className="section-label">Step 02 · Intention</p>
          <h2 id="question-title">What are you trying to do?</h2>
        </div>
        <div className="step-marker">2 / 3</div>
      </div>
      <p className="card-lead">The clearer the intended action, the more useful the analysis can be.</p>
      <textarea
        className="action-textarea"
        value={action}
        onChange={(event) => setAction(event.target.value)}
        placeholder="My landlord hasn't returned my security deposit."
        aria-label="Describe the action you want to take"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (action.trim() && !analyzing) onAnalyze(action);
          }
        }}
      />
      <div className="suggestion-row" aria-label="Suggested actions">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="suggestion-chip"
            onClick={() => {
              setAction(option);
              onAnalyze(option);
            }}
            disabled={analyzing}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="question-card__footer">
        <span className="privacy-note"><Info size={14} /> Real Gemini AI Engine · Not legal advice.</span>
        <button
          type="button"
          className="primary-button"
          onClick={() => onAnalyze(action)}
          disabled={analyzing || !action.trim()}
        >
          {analyzing ? <><span className="button-pulse" /> Reading Document & Brief…</> : <>Analyze my document <ArrowUpRight size={16} /></>}
        </button>
      </div>
    </section>
  );
}

function EvidenceIndex({
  visible,
  summary,
  items,
  confidenceScore,
}: {
  visible: boolean;
  summary?: string;
  items: EvidenceItem[];
  confidenceScore?: number;
}) {
  const isHighConfidence = typeof confidenceScore === "number" && confidenceScore >= 70;
  const isLowConfidence = typeof confidenceScore === "number" && confidenceScore < 50;

  return (
    <section className={`surface-card evidence-card ${visible ? "evidence-card--visible" : ""}`} id="evidence" aria-labelledby="evidence-title">
      <div className="card-heading-row evidence-heading">
        <div>
          <p className="section-label">Step 03 · Evidence</p>
          <h2 id="evidence-title">A first reading of what matters.</h2>
        </div>
        {typeof confidenceScore === "number" ? (
          <span className={`evidence-ribbon ${isLowConfidence ? "is-insufficient" : isHighConfidence ? "is-supported" : "is-partial"}`}>
            <Sparkles size={14} /> {confidenceScore}% AI Confidence
          </span>
        ) : (
          <span className="evidence-ribbon"><Sparkles size={14} /> REAL Multimodal Analysis</span>
        )}
      </div>
      <div className="analysis-summary">
        <div className="analysis-summary__copy">
          <span className="eyebrow">
            Detected action & clauses {typeof confidenceScore === "number" ? `· ${confidenceScore}% Confidence` : ""}
          </span>
          <strong>Legal Assessment & Strategy</strong>
          <p>{summary || "Legal analysis from the Gemini AI engine."}</p>
        </div>
        <div className="analysis-summary__badge">
          <FileCheck2 size={24} className="text-saffron" />
          <span>Evidence Index</span>
        </div>
      </div>
      <div className="evidence-list">
        {items.map((row, idx) => {
          const Icon = row.status === "Supported" ? Check : row.status === "Partly supported" ? AlertCircle : Info;
          return (
            <div className="evidence-row" key={`${row.title}-${idx}`}>
              <span className={`evidence-status-icon ${row.status === "Supported" ? "is-supported" : row.status === "Partly supported" ? "is-partial" : "is-insufficient"}`}>
                <Icon size={14} />
              </span>
              <div className="evidence-row__copy">
                <strong>{row.title}</strong>
                <span>{row.detail}</span>
              </div>
              <span className={statusClasses(row.status)}>{row.status}</span>
            </div>
          );
        })}
      </div>
      <div className="uncertainty-callout">
        <AlertCircle size={18} />
        <div>
          <strong>Responsible Use Notice</strong>
          <span>
            {isLowConfidence
              ? "Low AI Confidence (<50%): Gemini lacks sufficient document facts or jurisdiction clarity. Upload contract or specify details."
              : "General legal information retrieved via POST /api/chat. Does not replace professional legal counsel."}
          </span>
        </div>
      </div>
    </section>
  );
}

function ChatBot({
  open,
  onClose,
  messages,
  options,
  onSend,
  analyzing,
}: {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  options: string[];
  onSend: (text: string) => void;
  analyzing: boolean;
}) {
  const [draft, setDraft] = useState("");

  const handleSendClick = (text = draft) => {
    const clean = text.trim();
    if (!clean || analyzing) return;
    onSend(clean);
    setDraft("");
  };

  if (!open) return null;
  return (
    <div className="chat-panel" role="dialog" aria-label="Support chat">
      <div className="chat-panel__header">
        <div className="chat-agent">
          <span className="chat-agent__avatar"><MessageCircle size={16} /></span>
          <div>
            <strong>Legal AI Assistant</strong>
            <span><i /> Connected to Multimodal Gemini</span>
          </div>
        </div>
        <button type="button" className="icon-button icon-button--small" aria-label="Close support chat" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className="chat-panel__body">
        {messages.map((message, index) => (
          <div className={`chat-message chat-message--${message.role}`} key={`${message.role}-${index}`}>
            <span>{message.text}</span>
          </div>
        ))}
        {options.length > 0 && (
          <div className="chat-quick-actions">
            {options.map((topic) => (
              <button key={topic} type="button" onClick={() => handleSendClick(topic)} disabled={analyzing}>
                {topic}<ArrowUpRight size={13} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="chat-panel__composer">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") handleSendClick(); }}
          placeholder="Ask a legal question or choose an option..."
          aria-label="Describe your issue"
          disabled={analyzing}
        />
        <button type="button" aria-label="Send message" onClick={() => handleSendClick()} disabled={analyzing || !draft.trim()}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolKey>("files");
  const [action, setAction] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [jurisdiction] = useState<string>("General Legal");
  const [attachedFile, setAttachedFile] = useState<AttachedFile | undefined>(undefined);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Welcome to ClauseIQ. Upload your document or describe your legal concern to receive automated legal analysis and next steps." },
  ]);
  const [dynamicOptions, setDynamicOptions] = useState<string[]>([
    "Hospital billing dispute & patient rights",
    "Terminate rental agreement early",
    "Demand security deposit refund",
    "Employment non-compete & severance review",
  ]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(defaultEvidenceRows);
  const [analysisSummary, setAnalysisSummary] = useState<string>(
    "The agreement and statutory framework apply to security deposit return and notice obligations."
  );

  const [confidenceScore, setConfidenceScore] = useState<number | undefined>(undefined);
  const [analyzing, setAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const activeToolLabel = useMemo(() => toolItems.find((item) => item.key === activeTool)?.label ?? "Files", [activeTool]);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAttachedFile({
        name: file.name,
        mimeType: file.type || "application/pdf",
        data: result,
      });
      toast.success(`Attached ${file.name} for AI document reading.`);
    };
    reader.onerror = () => {
      toast.error("Failed to read selected file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileRemove = () => {
    setAttachedFile(undefined);
    toast("Attached file removed.");
  };

  const handleSend = async (userMsg?: string) => {
    const textToSend = userMsg || action;
    if (!textToSend.trim() || analyzing) return;

    setAnalyzing(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: attachedFile ? `[Attached File: ${attachedFile.name}]\n${textToSend}` : textToSend,
      },
    ]);

    try {
      const response = await sendChatMessage({
        conversationId,
        message: textToSend,
        jurisdiction,
        file: attachedFile,
      });

      setConversationId(response.conversationId);
      setMessages((prev) => [...prev, { role: "assistant", text: response.message }]);

      if (typeof response.confidenceScore === "number") {
        setConfidenceScore(response.confidenceScore);
      }
      if (response.options && response.options.length > 0) {
        setDynamicOptions(response.options);
      }
      if (response.evidence && response.evidence.length > 0) {
        setEvidenceList(response.evidence);
      }
      if (response.summary) {
        setAnalysisSummary(response.summary);
      }

      setHasAnalysis(true);
      toast.success(`Document analysis updated (${response.confidenceScore ?? 85}% Confidence).`);
    } catch (err: any) {
      console.error("Failed to fetch chat response:", err);
      toast.error(err.message || "Failed to reach backend service.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Error: ${err.message || "Unable to reach backend API"}` },
      ]);
    } finally {
      setAnalyzing(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToolSelect = (key: ToolKey) => {
    setActiveTool(key);
    const tool = toolItems.find((item) => item.key === key);
    toast.info(`${tool?.label} mode active: Select a file to attach.`);
    if (fileInputRef.current) {
      fileInputRef.current.accept = tool?.accept || ".pdf,.doc,.docx,.jpg,.jpeg,.png";
      fileInputRef.current.click();
    }
  };

  return (
    <div className="app-shell" id="workspace">
      <input
        ref={fileInputRef}
        hidden
        type="file"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
        }}
      />
      <Header onHelp={() => setChatOpen(true)} />
      <div className="workspace-layout">
        <SideRail />
        <main className="main-canvas">
          <div className="workspace-intro">
            <div>
              <div className="breadcrumb"><span>Workspace</span><ChevronDown size={13} /><strong>My document</strong></div>
              <h1>Understand the document.<br /><em>Choose your next move.</em></h1>
              <p>Upload a legal document and tell us what you want to do. We will focus the reading around your intended action—not just summarize the page.</p>
            </div>
          </div>
          <div className="mobile-tool-strip">
            <span className="mobile-tool-strip__label">Tools</span>
            {toolItems.map((item) => (
              <button key={item.key} className={activeTool === item.key ? "is-active" : ""} type="button" onClick={() => handleToolSelect(item.key)}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="canvas-grid">
            <div className="flow-column">
              <UploadCard
                attachedFile={attachedFile}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                toolAccept={toolItems.find((item) => item.key === activeTool)?.accept}
              />
              <QuestionCard
                action={action}
                setAction={setAction}
                onAnalyze={handleSend}
                options={dynamicOptions}
                analyzing={analyzing}
              />
              {hasAnalysis ? (
                <EvidenceIndex visible={hasAnalysis} summary={analysisSummary} items={evidenceList} confidenceScore={confidenceScore} />
              ) : (
                <div className="evidence-preview" id="how-it-works">
                  <div className="evidence-preview__icon"><Sparkles size={19} /></div>
                  <div>
                    <strong>Your evidence index will appear here.</strong>
                    <span>We will separate what the document supports from what still needs context.</span>
                  </div>
                  <span className="preview-dash" />
                </div>
              )}
              <div className="mini-disclaimer" id="responsible-use">
                <Info size={15} />
                <span><strong>Responsible use.</strong> ClauseIQ provides general legal information using Gemini AI. It does not replace a qualified attorney.</span>
              </div>
            </div>
          </div>
        </main>
        <ActionRail activeTool={activeTool} onSelect={handleToolSelect} />
      </div>
      <button className={`chat-launcher ${chatOpen ? "chat-launcher--hidden" : ""}`} type="button" onClick={() => setChatOpen(true)} aria-label="Open support chat">
        <MessageCircle size={20} />
        <span>Ask Legal Assistant</span>
        <i />
      </button>
      <ChatBot
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        options={dynamicOptions}
        onSend={handleSend}
        analyzing={analyzing}
      />
      <div className="footer-note"><span>CLAUSEIQ</span><span>General legal information · Not legal advice</span></div>
    </div>
  );
}
