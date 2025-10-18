#!/usr/bin/env python3
"""
Generate a formatted code review report from findings.

Usage:
    python generate_review_report.py --format markdown > report.md
    python generate_review_report.py --format html > report.html
    python generate_review_report.py --format json > report.json

Input: Reads findings from stdin as JSON array
Output: Formatted report to stdout

Expected JSON format:
[
    {
        "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFO",
        "title": "Brief title",
        "location": "file_path:line_number",
        "description": "Detailed description",
        "impact": "What could happen",
        "recommendation": "How to fix",
        "references": ["url1", "url2"]  # optional
    },
    ...
]
"""

import argparse
import json
import sys
from datetime import datetime
from typing import List, Dict, Any


SEVERITY_ORDER = {
    'CRITICAL': 0,
    'HIGH': 1,
    'MEDIUM': 2,
    'LOW': 3,
    'INFO': 4
}

SEVERITY_EMOJI = {
    'CRITICAL': '🔴',
    'HIGH': '🟠',
    'MEDIUM': '🟡',
    'LOW': '🔵',
    'INFO': '⚪'
}


def parse_findings() -> List[Dict[str, Any]]:
    """Parse findings from stdin."""
    try:
        data = json.load(sys.stdin)
        if not isinstance(data, list):
            raise ValueError("Input must be a JSON array")
        return data
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


def sort_findings(findings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Sort findings by severity (most severe first)."""
    return sorted(findings, key=lambda x: SEVERITY_ORDER.get(x.get('severity', 'INFO'), 999))


def generate_markdown(findings: List[Dict[str, Any]]) -> str:
    """Generate Markdown report."""
    output = []

    # Header
    output.append("# Code Review Report")
    output.append(f"\n**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    # Summary
    severity_counts = {}
    for finding in findings:
        severity = finding.get('severity', 'INFO')
        severity_counts[severity] = severity_counts.get(severity, 0) + 1

    output.append("## Summary\n")
    output.append(f"**Total Findings:** {len(findings)}\n")
    for severity in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']:
        count = severity_counts.get(severity, 0)
        if count > 0:
            emoji = SEVERITY_EMOJI.get(severity, '')
            output.append(f"- {emoji} **{severity}:** {count}")
    output.append("\n---\n")

    # Findings
    output.append("## Findings\n")

    for i, finding in enumerate(findings, 1):
        severity = finding.get('severity', 'INFO')
        emoji = SEVERITY_EMOJI.get(severity, '')
        title = finding.get('title', 'Untitled Finding')
        location = finding.get('location', 'Unknown location')
        description = finding.get('description', 'No description provided')
        impact = finding.get('impact', 'No impact assessment provided')
        recommendation = finding.get('recommendation', 'No recommendation provided')
        references = finding.get('references', [])

        output.append(f"### {i}. {emoji} [{severity}] {title}\n")
        output.append(f"**Location:** `{location}`\n")
        output.append(f"**Description:** {description}\n")
        output.append(f"**Impact:** {impact}\n")
        output.append(f"**Recommendation:** {recommendation}\n")

        if references:
            output.append("\n**References:**")
            for ref in references:
                output.append(f"- {ref}")

        output.append("\n---\n")

    return "\n".join(output)


def generate_html(findings: List[Dict[str, Any]]) -> str:
    """Generate HTML report."""
    severity_counts = {}
    for finding in findings:
        severity = finding.get('severity', 'INFO')
        severity_counts[severity] = severity_counts.get(severity, 0) + 1

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Review Report</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }}
        .header {{
            background: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        h1 {{
            margin: 0 0 10px 0;
            color: #333;
        }}
        .timestamp {{
            color: #666;
            font-size: 14px;
        }}
        .summary {{
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .summary-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }}
        .severity-box {{
            padding: 15px;
            border-radius: 6px;
            text-align: center;
        }}
        .severity-box.critical {{ background: #ffebee; border-left: 4px solid #d32f2f; }}
        .severity-box.high {{ background: #fff3e0; border-left: 4px solid #f57c00; }}
        .severity-box.medium {{ background: #fffde7; border-left: 4px solid #fbc02d; }}
        .severity-box.low {{ background: #e3f2fd; border-left: 4px solid #1976d2; }}
        .severity-box.info {{ background: #f5f5f5; border-left: 4px solid #757575; }}
        .severity-label {{
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }}
        .severity-count {{
            font-size: 24px;
            font-weight: bold;
        }}
        .finding {{
            background: white;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 4px solid #ccc;
        }}
        .finding.critical {{ border-left-color: #d32f2f; }}
        .finding.high {{ border-left-color: #f57c00; }}
        .finding.medium {{ border-left-color: #fbc02d; }}
        .finding.low {{ border-left-color: #1976d2; }}
        .finding.info {{ border-left-color: #757575; }}
        .finding-header {{
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }}
        .finding-number {{
            background: #333;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 10px;
        }}
        .severity-badge {{
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            margin-right: 10px;
        }}
        .severity-badge.critical {{ background: #d32f2f; color: white; }}
        .severity-badge.high {{ background: #f57c00; color: white; }}
        .severity-badge.medium {{ background: #fbc02d; color: #333; }}
        .severity-badge.low {{ background: #1976d2; color: white; }}
        .severity-badge.info {{ background: #757575; color: white; }}
        .finding-title {{
            font-size: 18px;
            font-weight: bold;
            flex: 1;
        }}
        .location {{
            background: #f5f5f5;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            margin-bottom: 15px;
        }}
        .section {{
            margin-bottom: 15px;
        }}
        .section-label {{
            font-weight: bold;
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }}
        .section-content {{
            color: #333;
            line-height: 1.6;
        }}
        .references {{
            margin-top: 10px;
        }}
        .references a {{
            color: #1976d2;
            text-decoration: none;
            display: block;
            margin-bottom: 5px;
        }}
        .references a:hover {{
            text-decoration: underline;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Code Review Report</h1>
        <div class="timestamp">Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</div>
    </div>

    <div class="summary">
        <h2>Summary</h2>
        <div><strong>Total Findings:</strong> {len(findings)}</div>
        <div class="summary-grid">
"""

    for severity in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']:
        count = severity_counts.get(severity, 0)
        if count > 0:
            html += f"""
            <div class="severity-box {severity.lower()}">
                <div class="severity-label">{severity}</div>
                <div class="severity-count">{count}</div>
            </div>
"""

    html += """
        </div>
    </div>

    <h2>Findings</h2>
"""

    for i, finding in enumerate(findings, 1):
        severity = finding.get('severity', 'INFO').lower()
        title = finding.get('title', 'Untitled Finding')
        location = finding.get('location', 'Unknown location')
        description = finding.get('description', 'No description provided')
        impact = finding.get('impact', 'No impact assessment provided')
        recommendation = finding.get('recommendation', 'No recommendation provided')
        references = finding.get('references', [])

        html += f"""
    <div class="finding {severity}">
        <div class="finding-header">
            <div class="finding-number">{i}</div>
            <span class="severity-badge {severity}">{severity.upper()}</span>
            <span class="finding-title">{title}</span>
        </div>

        <div class="location">{location}</div>

        <div class="section">
            <div class="section-label">Description</div>
            <div class="section-content">{description}</div>
        </div>

        <div class="section">
            <div class="section-label">Impact</div>
            <div class="section-content">{impact}</div>
        </div>

        <div class="section">
            <div class="section-label">Recommendation</div>
            <div class="section-content">{recommendation}</div>
        </div>
"""

        if references:
            html += """
        <div class="section">
            <div class="section-label">References</div>
            <div class="references">
"""
            for ref in references:
                html += f'                <a href="{ref}" target="_blank">{ref}</a>\n'
            html += """
            </div>
        </div>
"""

        html += """
    </div>
"""

    html += """
</body>
</html>
"""

    return html


def generate_json(findings: List[Dict[str, Any]]) -> str:
    """Generate JSON report."""
    severity_counts = {}
    for finding in findings:
        severity = finding.get('severity', 'INFO')
        severity_counts[severity] = severity_counts.get(severity, 0) + 1

    report = {
        'generated': datetime.now().isoformat(),
        'summary': {
            'total': len(findings),
            'by_severity': severity_counts
        },
        'findings': findings
    }

    return json.dumps(report, indent=2)


def main():
    parser = argparse.ArgumentParser(
        description='Generate formatted code review reports',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument(
        '--format',
        choices=['markdown', 'html', 'json'],
        default='markdown',
        help='Output format (default: markdown)'
    )

    args = parser.parse_args()

    findings = parse_findings()
    sorted_findings = sort_findings(findings)

    if args.format == 'markdown':
        output = generate_markdown(sorted_findings)
    elif args.format == 'html':
        output = generate_html(sorted_findings)
    elif args.format == 'json':
        output = generate_json(sorted_findings)

    print(output)


if __name__ == '__main__':
    main()
