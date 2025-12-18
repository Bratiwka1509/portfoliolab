import { NextResponse } from "next/server";

/*
  MOCK PortAI
  Free, no OpenAI, no billing
  Later this file can be replaced with real AI in 1 step
*/

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "Please ask a clear question about your portfolio." },
        { status: 200 }
      );
    }

    const text = message.toLowerCase();

    let reply = "";

    // STRUCTURE
    if (
      text.includes("structure") ||
      text.includes("layout") ||
      text.includes("sections")
    ) {
      reply = `
As an FTC judge, I first look at structure.

A strong engineering portfolio should clearly include:
• Engineering Design Process
• Robot Overview and CAD
• Programming approach
• Strategy and testing
• Awards and outreach
• Clear conclusion

Use headings, diagrams, and short explanations.
Judges should understand your story in 30–60 seconds.
      `;
    }

    // AWARDS
    else if (
      text.includes("award") ||
      text.includes("inspire") ||
      text.includes("think") ||
      text.includes("motivate")
    ) {
      reply = `
For Awards sections, judges look for evidence, not claims.

Good practice:
• Clearly state which award you target
• Explain WHY your team fits the criteria
• Show impact with examples
• Use photos, metrics, and reflections

Avoid generic statements like "we worked hard".
Show growth, leadership, and influence.
      `;
    }

    // ENGINEERING
    else if (
      text.includes("engineering") ||
      text.includes("robot") ||
      text.includes("design")
    ) {
      reply = `
In the Engineering section, judges expect depth and reasoning.

Strong portfolios explain:
• Why design decisions were made
• Trade-offs and alternatives
• Iterations and improvements
• Testing results and failures

Numbers, sketches, and CAD screenshots help a lot.
Explain your thinking, not just the final robot.
      `;
    }

    // JUDGES
    else if (
      text.includes("judge") ||
      text.includes("judging") ||
      text.includes("expect")
    ) {
      reply = `
Judges value clarity, honesty, and reflection.

They are not looking for perfection.
They want to see:
• Learning process
• Team growth
• Clear communication
• Evidence of decisions

A simple, well-explained portfolio often beats a complex but confusing one.
      `;
    }

    // DEFAULT
    else {
      reply = `
I can help you review your FTC engineering portfolio.

You can ask about:
• Portfolio structure
• Engineering section
• Awards strategy
• What judges expect
• How to improve clarity

Try asking something more specific.
      `;
    }

    // small delay to feel "AI-like"
    await new Promise((r) => setTimeout(r, 600));

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({
      reply: "Mock PortAI error. Please try again.",
    });
  }
}
