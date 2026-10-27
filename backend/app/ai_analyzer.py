import os

from groq import Groq
from dotenv import load_dotenv

load_dotenv()


api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise RuntimeError(
        "GROQ_API_KEY is not configured."
    )


client = Groq(api_key=api_key)


def analyze_codebase(analysis):
    files = analysis["files"]
    nodes = analysis["nodes"]
    edges = analysis["edges"]

    prompt = f"""
You are CodeAtlas, an AI software architecture analyst.

Analyze the following codebase structure.

FILES:
{files}

CODE ELEMENTS:
{nodes}

DEPENDENCIES:
{edges}

Provide a concise but useful architecture analysis.

Return the analysis using this exact format.

ARCHITECTURE SUMMARY
Write 2-4 concise sentences.

MAIN COMPONENTS
- Component: description
- Component: description
- Component: description

IMPORTANT DEPENDENCIES
- source -> target: explanation
- source -> target: explanation

POTENTIAL RISKS
- Risk: explanation
- Risk: explanation

TECHNICAL DEBT
- Issue: explanation
- Issue: explanation

RECOMMENDED IMPROVEMENTS
- Recommendation
- Recommendation
- Recommendation

Rules:
- Do NOT use Markdown.
- Do NOT use tables.
- Do NOT use ** or ##.
- Use plain text headings exactly as shown.
- Keep the response concise and suitable for a developer dashboard.

Do not invent functionality that is not supported by
the provided codebase structure.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert software architect "
                    "analyzing real codebases."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content