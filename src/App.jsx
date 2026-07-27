import React, { useState, useMemo, useRef, useEffect } from "react";
import { AudioLines, Sparkles, Loader2, Smile, Meh, Frown, ListChecks, AlertOctagon, Eraser, RotateCcw, Tag, Mic, Square } from "lucide-react";

// ---------------------------------------------------------------------------
// DESIGN TOKENS — third identity in the portfolio family: a "studio
// console" direction, since this tool analyzes call audio/transcripts.
// Dark charcoal (not the same navy-black as project 1), warm off-white
// text, waveform-style visual motif for the signature element.
// Charcoal #1A1A18 / Panel #242320 / Text #F1EFE8 / Muted #8C8A80
// Fintech #5B8DEF / SaaS #4FBF9F / IT #E0913E
// Positive #4FBF9F / Neutral #C9A227 / Negative #E0645A
// Display: Space Grotesk. Body: Inter. Data: JetBrains Mono.
// ---------------------------------------------------------------------------

const FONT_IMPORT_URL =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap";

const CHARCOAL = "#1A1A18";
const PANEL = "#242320";
const TXT = "#F1EFE8";
const MUTED = "#8C8A80";
const BORDER = "#38362F";
const POSITIVE = "#4FBF9F";
const NEUTRAL = "#C9A227";
const NEGATIVE = "#E0645A";

const SECTORS = {
  fintech: {
    label: "Fintech / Payments",
    accent: "#5B8DEF",
    accounts: [
      {
        id: "fx1", name: "Northgate Retail Group", tier: "Enterprise",
        transcript: `CSM: Thanks for hopping on. How's the 3DS2 migration settling in on your end?
Client (Eng Lead): Honestly, rougher than expected. Our support queue is up something like 30% since we switched over.
Client (Ops Mgr): Yeah, and my team's been fielding a lot of the same questions from merchants downstream.
CSM: That's not what we want to hear. Is it mostly confusion, or actual failures?
Client (Eng Lead): Mostly confusion so far, auth rate hasn't really moved. But it's eating our team's time.
Client (Ops Mgr): We also had someone reach out to us last month — a competitor, pitching their platform. Didn't go anywhere but wanted you to know.
CSM: Appreciate the heads up. Let's get a technical deep dive on the calendar in the next two weeks to walk through the migration pain points directly with your eng team.
Client (Eng Lead): That'd help. Also curious what's on your fraud tooling roadmap while we're at it.
CSM: Can bring that too. Renewal's not until Q3 next year but let's not let this linger.`,
      },
      {
        id: "fx3", name: "Verdant Mobility", tier: "Enterprise",
        transcript: `Client (CTO): I need to be direct with you. This is the second payout failure this month, and this time it happened in front of my VP of Finance.
CSM: I hear you, and I'm sorry — that's not acceptable at your volume.
Client (CTO): If this happens again in Q3, we're going to have to formally start looking at other providers. I don't say that lightly.
CSM: Understood completely. I'm going to get engineering on this today, not next week.
Client (CTO): Our transaction volume is also down noticeably and nobody's told us why.
CSM: I'll have someone dig into that in parallel with the incident review. Can we get 30 minutes with your VP of Finance to walk through the remediation plan directly?
Client (CTO): Yes. Sooner the better.`,
      },
    ],
  },
  saas: {
    label: "SaaS Product",
    accent: "#4FBF9F",
    accounts: [
      {
        id: "sa1", name: "Wavelength Studios", tier: "Team",
        transcript: `CSM: How's the new AI editing suite working out for the team?
Client: Honestly, it's been great. Cut our post-production time almost in half.
CSM: That's fantastic to hear.
Client: We're actually thinking about growing the team next quarter. Do you have anything above our current tier?
CSM: We do have an enterprise tier — I can walk you through it.
Client: Also, would you ever be interested in featuring us as a case study? We'd be happy to talk about the workflow change.
CSM: Absolutely, I'll follow up on that this week.`,
      },
      {
        id: "sa4", name: "Fernway Learning", tier: "Business",
        transcript: `Client: We've had two tickets open for over three weeks now about export quality. Nothing's moved.
CSM: I'm sorry about that — let me check status right after this call.
Client: Renewal's coming up in 30 days and honestly, we're not sure yet if we're renewing.
CSM: I understand. Can I get a manager looped in to make sure these get resolved this week?
Client: That would help. But I'll be honest, the lack of follow-up so far hasn't left a great impression.
CSM: That's fair, and I want to make it right before your renewal date.`,
      },
    ],
  },
  it: {
    label: "Enterprise IT / ITSM",
    accent: "#E0913E",
    accounts: [
      {
        id: "it1", name: "Cardinal Health Systems", tier: "Enterprise",
        transcript: `Client (IT Director): We're planning to roll out the AI ticket triage agent to three more departments next quarter.
CSM: That's great to hear — how has adoption been so far in the first department?
Client (IT Director): Really strong. My main question is around governance — what does the audit trail look like for actions the agent takes autonomously?
CSM: Good question, I can bring in our solutions engineer to walk through that in detail.
Client (IT Director): Perfect. If that goes well, we'd be open to talking about being a reference customer.
CSM: We'd love that. I'll set up the governance walkthrough this week.`,
      },
      {
        id: "it4", name: "Bramwell School District", tier: "Mid-Market",
        transcript: `CSM: Hi, this is the second time we've had to reschedule — just wanted to check in and see if everything's okay.
[No response from client]
CSM: I'll follow up by email as well. We have quite a few open tickets on our end we'd like to review together whenever you have a moment.
[Call ends, no client attendance]`,
      },
    ],
  },
};

const FALLBACK_ANALYSIS = {
  fx1: { sentiment: "neutral", sentimentScore: 55, summary: "Northgate's engineering and ops leads raised concerns about a support volume spike since the 3DS2 migration, and mentioned a competitor made contact last month. The tone was constructive rather than adversarial, and the client proactively agreed to a technical deep dive.", topics: ["3DS2 migration friction", "Competitor outreach", "Fraud tooling roadmap"], actionItems: ["Schedule technical deep dive within two weeks", "Share fraud tooling roadmap ahead of the session", "Track support ticket volume trend post-migration"], riskSignals: ["Competitor contact mentioned, though no follow-through indicated", "Rising support ticket volume tied to a recent migration"] },
  fx3: { sentiment: "negative", sentimentScore: 22, summary: "The CTO escalated a second payout failure this month, this time in front of their VP of Finance, and gave an explicit warning that a repeat incident in Q3 would trigger a formal vendor evaluation. Tone was direct and frustrated but solution-oriented.", topics: ["Payout batch failures", "Declining transaction volume", "Vendor evaluation warning"], actionItems: ["Engineering to begin root-cause analysis immediately", "Schedule a 30-minute remediation call with the VP of Finance", "Investigate transaction volume decline in parallel"], riskSignals: ["Explicit statement that further incidents will trigger a formal vendor evaluation", "Escalation visible to a senior executive (VP of Finance)", "Unexplained transaction volume decline"] },
  sa1: { sentiment: "positive", sentimentScore: 92, summary: "Wavelength Studios expressed strong satisfaction with the new AI editing suite, citing a near 50% reduction in post-production time. The client raised a genuine growth signal by asking about enterprise tier options and offered to participate in a case study.", topics: ["AI editing suite impact", "Enterprise tier interest", "Case study opportunity"], actionItems: ["Send enterprise tier details and pricing", "Follow up this week on the case study opportunity"], riskSignals: ["None identified this call"] },
  sa4: { sentiment: "negative", sentimentScore: 28, summary: "Fernway Learning voiced real frustration over two unresolved export quality tickets open more than three weeks, and was explicit about being undecided on their renewal in 30 days. The client acknowledged the CSM's response but noted the lack of follow-up had already hurt the relationship.", topics: ["Unresolved export quality tickets", "Renewal uncertainty", "Support responsiveness"], actionItems: ["Escalate both open tickets to a manager immediately", "Provide a resolution timeline before the renewal date", "Follow up personally once tickets are closed"], riskSignals: ["Client explicitly undecided on renewal, 30 days out", "Direct statement that support follow-up has damaged the relationship"] },
  it1: { sentiment: "positive", sentimentScore: 88, summary: "Cardinal Health Systems confirmed plans to expand the AI ticket triage agent to three additional departments and asked detailed governance questions, signaling serious internal evaluation. The client also floated becoming a reference customer.", topics: ["AI agent expansion", "Governance and audit trail", "Reference customer potential"], actionItems: ["Arrange a solutions engineer to walk through governance and audit trail details", "Follow up on the reference customer conversation once the rollout proceeds"], riskSignals: ["None identified this call"] },
  it4: { sentiment: "negative", sentimentScore: 10, summary: "This was the second consecutive missed meeting with no client attendance or response. There is no direct feedback to analyze, which is itself the strongest signal — the account appears to be disengaging.", topics: ["Missed meeting", "No client response"], actionItems: ["Attempt outreach through an alternate contact", "Send a written summary of open items in case they're checking email only", "Flag account for escalation if no response within one more cycle"], riskSignals: ["Two consecutive missed meetings with no client attendance", "No response to outreach in over two months"] },
};

function SentimentBadge({ sentiment, score }) {
  const config = {
    positive: { icon: Smile, color: POSITIVE, label: "Positive" },
    neutral: { icon: Meh, color: NEUTRAL, label: "Neutral" },
    negative: { icon: Frown, color: NEGATIVE, label: "Negative" },
  }[sentiment] || { icon: Meh, color: MUTED, label: "Unknown" };
  const Icon = config.icon;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%", background: `${config.color}22`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={20} color={config.color} />
      </div>
      <div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: TXT }}>{config.label}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: MUTED }}>{score}/100</div>
      </div>
    </div>
  );
}

function Waveform({ sentiment }) {
  // Purely decorative waveform whose amplitude pattern nods to the
  // sentiment result — a visual signature tying the tool to "audio".
  const seeds = {
    positive: [8, 14, 22, 30, 24, 32, 26, 18, 28, 20, 12, 16],
    neutral: [10, 16, 12, 18, 14, 20, 15, 17, 13, 19, 11, 15],
    negative: [18, 8, 20, 6, 16, 5, 14, 7, 12, 6, 10, 8],
  }[sentiment] || [12, 14, 10, 16, 12, 15, 11, 14, 12, 13, 10, 12];
  const color = { positive: POSITIVE, neutral: NEUTRAL, negative: NEGATIVE }[sentiment] || MUTED;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 32 }}>
      {seeds.map((h, i) => (
        <div key={i} style={{ width: 3, height: h * 1.4, borderRadius: 2, background: color, opacity: 0.5 + (i % 3) * 0.15 }} />
      ))}
    </div>
  );
}

function Section({ icon: Icon, title, accent, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon size={15} color={accent} />
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600, color: TXT, letterSpacing: 0.4, textTransform: "uppercase" }}>
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items, accent }) {
  if (!items || items.length === 0 || (items.length === 1 && /none/i.test(items[0]))) {
    return <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: MUTED, fontStyle: "italic" }}>None identified this call.</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent, marginTop: 6, flexShrink: 0 }} />
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#DAD8CE", lineHeight: 1.5 }}>{item}</div>
        </div>
      ))}
    </div>
  );
}

export default function CallIntelligence() {
  const [sectorKey, setSectorKey] = useState("fintech");
  const [accountId, setAccountId] = useState(SECTORS.fintech.accounts[0].id);
  const [transcript, setTranscript] = useState(SECTORS.fintech.accounts[0].transcript);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const recognitionRef = useRef(null);
  const baseTranscriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalChunk = "";
      let interimChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalChunk += text + " ";
        else interimChunk += text;
      }
      if (finalChunk) baseTranscriptRef.current += finalChunk;
      setTranscript((baseTranscriptRef.current + interimChunk).trim());
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  function startRecording() {
    if (!recognitionRef.current) return;
    baseTranscriptRef.current = transcript ? transcript + " " : "";
    setAnalysis(null);
    setError(null);
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (e) {
      setError("Couldn't access the microphone. Check your browser's mic permissions for this site.");
    }
  }

  function stopRecording() {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsRecording(false);
  }

  const sector = SECTORS[sectorKey];
  const account = useMemo(() => sector.accounts.find((a) => a.id === accountId), [sector, accountId]);

  function handleSectorChange(key) {
    setSectorKey(key);
    const firstAccount = SECTORS[key].accounts[0];
    setAccountId(firstAccount.id);
    setTranscript(firstAccount.transcript);
    setAnalysis(null);
    setError(null);
  }

  function handleAccountChange(id) {
    setAccountId(id);
    const acc = sector.accounts.find((a) => a.id === id);
    setTranscript(acc.transcript);
    setAnalysis(null);
    setError(null);
  }

  function handleClear() {
    setTranscript("");
    setAnalysis(null);
    setError(null);
  }

  function handleRestore() {
    setTranscript(account.transcript);
    setAnalysis(null);
    setError(null);
  }

  async function analyzeCall() {
    if (!transcript.trim()) {
      setError("Add a call transcript first — type your own or restore the example.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const prompt = `You are a call intelligence assistant for customer success teams. Analyze the call transcript below and respond with ONLY valid JSON (no markdown fences, no preamble) matching this shape:
{
  "sentiment": "positive" | "neutral" | "negative",
  "sentimentScore": <integer 0-100, where 100 is extremely positive>,
  "summary": "2-3 sentences summarizing the call",
  "topics": ["short topic", "short topic", "short topic"],
  "actionItems": ["short action item", "short action item"],
  "riskSignals": ["short risk signal", "short risk signal"]
}
If there are no risk signals, use a single item stating "None identified this call".

Account: ${account.name} (${account.tier} tier, ${sector.label})
Transcript:
${transcript}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!response.ok) throw new Error("API not reachable outside Claude.ai");
      const data = await response.json();
      const text = data.content.map((b) => b.text || "").join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAnalysis(parsed);
    } catch (e) {
      const fallback = FALLBACK_ANALYSIS[account.id];
      if (fallback && transcript.trim() === account.transcript.trim()) {
        setAnalysis({ ...fallback, isFallback: true });
      } else {
        setError("Live generation isn't available outside Claude.ai for custom transcripts. Open this project inside Claude.ai to see it generated live.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100%", background: CHARCOAL, padding: "28px 24px 48px", fontFamily: "'Inter', sans-serif" }}>
      <link rel="stylesheet" href={FONT_IMPORT_URL} />
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        * { box-sizing: border-box; }
        textarea:focus, select:focus { outline: none; }
        textarea::placeholder { color: #5C5A50; }
      `}</style>

      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <AudioLines size={20} color={sector.accent} />
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: TXT }}>
            Call Intelligence
          </div>
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: MUTED, marginBottom: 22 }}>
          Extracts sentiment, key topics, action items, and risk signals from call transcripts
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {Object.entries(SECTORS).map(([key, s]) => (
            <button
              key={key}
              onClick={() => handleSectorChange(key)}
              style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13,
                padding: "9px 16px", borderRadius: 9, cursor: "pointer",
                border: sectorKey === key ? `1px solid ${s.accent}` : `1px solid ${BORDER}`,
                background: sectorKey === key ? `${s.accent}1A` : "transparent",
                color: sectorKey === key ? TXT : MUTED,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 18, marginBottom: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: MUTED, display: "block", marginBottom: 6, letterSpacing: 0.3, textTransform: "uppercase" }}>
              Account
            </label>
            <select
              value={accountId}
              onChange={(e) => handleAccountChange(e.target.value)}
              style={{
                width: "100%", background: CHARCOAL, border: `1px solid ${BORDER}`, borderRadius: 8,
                padding: "10px 12px", color: TXT, fontFamily: "'Inter', sans-serif", fontSize: 14,
              }}
            >
              {sector.accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name} — {a.tier}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: MUTED, letterSpacing: 0.3, textTransform: "uppercase" }}>
              Call transcript
            </label>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {isRecording && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: NEGATIVE }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: NEGATIVE, display: "inline-block" }} />
                  recording
                </span>
              )}
              <button onClick={handleClear} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: 11, padding: 0 }}>
                <Eraser size={12} /> Clear & write your own
              </button>
              <button onClick={handleRestore} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: MUTED, fontFamily: "'Inter', sans-serif", fontSize: 11, padding: 0 }}>
                <RotateCcw size={12} /> Restore example
              </button>
            </div>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => { setTranscript(e.target.value); baseTranscriptRef.current = e.target.value; }}
            placeholder="Paste or type a call transcript here, e.g. 'CSM: ...' / 'Client: ...' lines. Or use Record live below."
            rows={9}
            style={{
              width: "100%", background: CHARCOAL, border: isRecording ? `1px solid ${NEGATIVE}` : `1px solid ${BORDER}`, borderRadius: 8,
              padding: 12, color: "#DAD8CE", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.6, resize: "vertical",
            }}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button
              onClick={analyzeCall}
              disabled={loading}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: sector.accent, color: CHARCOAL, border: "none", borderRadius: 8,
                padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: loading ? "default" : "pointer",
                fontFamily: "'Inter', sans-serif", opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
              {loading ? "Analyzing call…" : "Analyze call"}
            </button>

            {micSupported ? (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: isRecording ? NEGATIVE : "transparent",
                  color: isRecording ? "#1A1A18" : TXT,
                  border: isRecording ? "none" : `1px solid ${BORDER}`,
                  borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'Inter', sans-serif",
                }}
              >
                {isRecording ? <Square size={14} /> : <Mic size={14} />}
                {isRecording ? "Stop recording" : "Record live"}
              </button>
            ) : (
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: MUTED, display: "flex", alignItems: "center" }}>
                Live recording needs Chrome or Edge.
              </div>
            )}
          </div>
        </div>

        {error && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: NEGATIVE, marginBottom: 20 }}>{error}</div>}

        {analysis && (
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 22 }}>
            {analysis.isFallback && (
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: MUTED, marginBottom: 16, letterSpacing: 0.3, textTransform: "uppercase" }}>
                Example output — live generation runs inside Claude.ai
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, paddingBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
              <SentimentBadge sentiment={analysis.sentiment} score={analysis.sentimentScore} />
              <Waveform sentiment={analysis.sentiment} />
            </div>

            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#DAD8CE", lineHeight: 1.6, marginBottom: 22 }}>
              {analysis.summary}
            </div>

            <Section icon={Tag} title="Key topics" accent={sector.accent}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(analysis.topics || []).map((topic, i) => (
                  <span key={i} style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 12, color: sector.accent,
                    background: `${sector.accent}1A`, padding: "4px 10px", borderRadius: 20,
                  }}>
                    {topic}
                  </span>
                ))}
              </div>
            </Section>

            <Section icon={ListChecks} title="Action items" accent={POSITIVE}>
              <BulletList items={analysis.actionItems} accent={POSITIVE} />
            </Section>

            <Section icon={AlertOctagon} title="Risk signals" accent={NEGATIVE}>
              <BulletList items={analysis.riskSignals} accent={NEGATIVE} />
            </Section>
          </div>
        )}

        {!analysis && !error && (
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: MUTED, textAlign: "center", padding: 24 }}>
            Select an account, review or edit the transcript, then analyze the call.
          </div>
        )}
      </div>
    </div>
  );
}
