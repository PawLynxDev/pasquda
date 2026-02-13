import { getGradeColor } from "./utils";
import type { RoastResult } from "./utils";

export function OGReportCard({ roast }: { roast: RoastResult }) {
  const gradeColor = getGradeColor(roast.grade);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(145deg, #030305 0%, #0d0d12 50%, #1A1A1A 100%)",
        padding: "48px",
        fontFamily: "Inter",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow accent */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,20,147,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span
          style={{
            fontSize: "22px",
            color: "#FF1493",
            fontWeight: "bold",
            letterSpacing: "3px",
          }}
        >
          PASQUDA AUDIT
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "linear-gradient(90deg, rgba(255,20,147,0.3), transparent)",
            marginLeft: "8px",
          }}
        />
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "36px",
          marginTop: "28px",
        }}
      >
        {/* Left: Screenshot */}
        {roast.screenshot_url && (
          <div
            style={{
              width: "420px",
              height: "260px",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
              display: "flex",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={roast.screenshot_url}
              width="420"
              height="260"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* Right: Score + Summary */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div style={{ fontSize: "16px", color: "#666", letterSpacing: "2px" }}>
            {roast.domain.toUpperCase()}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "20px",
              marginTop: "12px",
            }}
          >
            <span
              style={{
                fontSize: "64px",
                fontFamily: "JetBrains Mono",
                color: "#FF1493",
                fontWeight: "bold",
                lineHeight: 1,
              }}
            >
              {roast.score}
            </span>
            <span
              style={{
                fontSize: "24px",
                fontFamily: "JetBrains Mono",
                color: "#555",
                fontWeight: "bold",
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              /100
            </span>
            <span
              style={{
                fontSize: "56px",
                fontFamily: "JetBrains Mono",
                fontWeight: "bold",
                transform: "rotate(-3deg)",
                color: gradeColor,
                lineHeight: 1,
                marginLeft: "12px",
              }}
            >
              {roast.grade}
            </span>
          </div>

          <div
            style={{
              fontSize: "20px",
              marginTop: "24px",
              lineHeight: 1.5,
              color: "#D0D0D0",
              borderLeft: "3px solid #FF1493",
              paddingLeft: "16px",
            }}
          >
            &ldquo;{roast.summary}&rdquo;
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          paddingTop: "20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ color: "#444", fontSize: "16px", fontWeight: "bold" }}>
          pasquda.com
        </span>
        <span style={{ color: "#FF1493", fontSize: "16px", fontWeight: "bold" }}>
          Try yours free →
        </span>
      </div>
    </div>
  );
}

export function FullReportCard({ roast }: { roast: RoastResult }) {
  const gradeColor = getGradeColor(roast.grade);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(145deg, #030305 0%, #0d0d12 50%, #1A1A1A 100%)",
        padding: "36px",
        fontFamily: "Inter",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow accents */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,20,147,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            color: "#FF1493",
            fontWeight: "bold",
            letterSpacing: "3px",
          }}
        >
          PASQUDA AUDIT
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "linear-gradient(90deg, rgba(255,20,147,0.3), transparent)",
            marginLeft: "8px",
          }}
        />
      </div>

      {/* Top row: Screenshot + Score */}
      <div style={{ display: "flex", gap: "24px" }}>
        {/* Screenshot */}
        {roast.screenshot_url && (
          <div
            style={{
              width: "300px",
              height: "188px",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
              display: "flex",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={roast.screenshot_url}
              width="300"
              height="188"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* Score + Domain */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#555",
              letterSpacing: "2px",
              fontWeight: "bold",
            }}
          >
            SITE
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "2px",
            }}
          >
            {roast.domain}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "16px",
              marginTop: "14px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "11px",
                  color: "#555",
                  letterSpacing: "2px",
                  fontWeight: "bold",
                }}
              >
                SCORE
              </span>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <span
                  style={{
                    fontSize: "44px",
                    fontFamily: "JetBrains Mono",
                    color: "#FF1493",
                    fontWeight: "bold",
                    lineHeight: 1,
                  }}
                >
                  {roast.score}
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    fontFamily: "JetBrains Mono",
                    color: "#444",
                    fontWeight: "bold",
                    marginBottom: "4px",
                    marginLeft: "2px",
                  }}
                >
                  /100
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "#555",
                  letterSpacing: "2px",
                  fontWeight: "bold",
                }}
              >
                GRADE
              </span>
              <span
                style={{
                  fontSize: "44px",
                  fontFamily: "JetBrains Mono",
                  fontWeight: "bold",
                  transform: "rotate(-3deg)",
                  color: gradeColor,
                  lineHeight: 1,
                }}
              >
                {roast.grade}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          fontSize: "15px",
          marginTop: "18px",
          color: "#D0D0D0",
          lineHeight: 1.5,
          display: "flex",
          borderLeft: "2px solid #FF1493",
          paddingLeft: "12px",
        }}
      >
        💀 &ldquo;{roast.summary}&rdquo;
      </div>

      {/* Roast bullets */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginTop: "14px",
        }}
      >
        {roast.roast_bullets.map((bullet, i) => (
          <div
            key={i}
            style={{
              fontSize: "13px",
              color: "#AAA",
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            <span style={{ marginRight: "8px", flexShrink: 0 }}>🔥</span>
            {bullet}
          </div>
        ))}
      </div>

      {/* Backhanded compliment */}
      <div
        style={{
          fontSize: "13px",
          marginTop: "10px",
          color: "#00FF88",
          lineHeight: 1.5,
          display: "flex",
          background: "rgba(0,255,136,0.04)",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid rgba(0,255,136,0.1)",
        }}
      >
        <span style={{ marginRight: "8px", flexShrink: 0 }}>🏆</span>
        &ldquo;{roast.backhanded_compliment}&rdquo;
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ color: "#444", fontSize: "13px", fontWeight: "bold" }}>
          pasquda.com
        </span>
        <span style={{ color: "#333", fontSize: "11px" }}>
          For entertainment purposes only
        </span>
        <span style={{ color: "#FF1493", fontSize: "13px", fontWeight: "bold" }}>
          Try yours free →
        </span>
      </div>
    </div>
  );
}
