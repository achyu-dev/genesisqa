# Genesis QA - AI-Powered Healthcare Test Automation

An intelligent AI system that automatically converts healthcare software requirements into compliant, enterprise-ready test cases.

## Overview

Genesis QA leverages Google's multimodal AI (Gemini Pro + Vision) to understand both text and visual requirements, integrating seamlessly with existing ALM platforms (Jira, Azure DevOps, Polarion) to transform weeks of manual work into minutes of AI-powered automation.

## Problem Statement

Healthcare QA teams normally spend **60% of their time** manually converting regulatory documents following regulatory standards to test cases, thus taking away more time, slowing down critical software development lifecycles.

## Solution

Genesis QA automates this entire process while ensuring full regulatory compliance and traceability - transforming weeks of manual work to minutes of AI-powered automation.

## Key Differentiators

| Traditional Solutions | Genesis QA |
|----------------------|------------|
| Text-only processing | Multimodal AI to process diagrams, flowcharts, UI mockups |
| Generic test generation | Healthcare-specific domain intelligence |
| Compliance mapping performed manually | Built-in regulatory knowledge (FDA, HIPAA, IEC 62304) |
| Standalone tools | Enterprise ALM integration |
| Limited traceability | Complete audit trail automation |

## Core Features

- **Multimodal AI Processing**: Handles both textual and visual requirements
- **Healthcare-Native Compliance Engine**: Built-in mapping to FDA, HIPAA, IEC 62304 standards
- **Edge Case Identification**: Generates test cases for all kinds of scenarios
- **Enterprise API Layer**: Seamless bidirectional integration with ALM platforms
- **Complete Traceability**: Full audit trail automation

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: Bootstrap 5, HTML5, CSS3, JavaScript
- **AI Integration**: Ready for Google Gemini Pro + Vision
- **Standards Compliance**: FDA 21 CFR Part 11, HIPAA, IEC 62304

## Quick Start

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/genesisqa.git
cd genesisqa
```

2. Install dependencies:
```bash
pip install -r src/requirements.txt
```

3. Run the application:
```bash
cd src
python app.py
```

4. Open your browser and navigate to:
```
http://localhost:5000
```

## Usage

1. **Dashboard**: View overall system statistics and compliance metrics
2. **Upload**: Upload healthcare requirements documents (.txt format)
3. **Test Cases**: Review and export generated test cases
4. **Compliance**: Analyze compliance coverage and audit trails

### Sample Requirements Format

Create a `.txt` file with healthcare requirements like:

```
The system must authenticate users before granting access to patient records.
The application shall encrypt all patient data in transit and at rest.
Users should be able to view patient medical history securely.
The system must maintain audit logs for all patient data access.
```

## Compliance Standards

Genesis QA automatically maps requirements to:

- **FDA 21 CFR Part 11**: Electronic records and signatures
- **HIPAA**: Health information privacy and security
- **IEC 62304**: Medical device software lifecycle

## Export Options

- Export to Jira (Enterprise feature)
- Export to Azure DevOps (Enterprise feature)
- Download as CSV (Available in demo)

## Team

**Team Name**: Sangam AI  
**Team Leader**: Achyuth S S

## Project Structure

```
genesisqa/
├── src/
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── static/
│   │   ├── style.css         # Custom styles
│   │   └── script.js         # Client-side functionality
│   └── templates/
│       ├── base.html         # Base template
│       ├── index.html        # Dashboard
│       ├── upload.html       # Upload page
│       ├── test_cases.html   # Test cases view
│       └── compliance.html   # Compliance analytics
├── README.md                 # This file
└── fincont.txt              # Project documentation
```

## Features in Demo

✅ Requirements upload and processing  
✅ AI-powered test case generation  
✅ Compliance mapping and analytics  
✅ Responsive web interface  
✅ CSV export functionality  

## Enterprise Features (Full Version)

🚀 Google Gemini AI integration  
🚀 Visual requirements processing (diagrams, flowcharts)  
🚀 Jira and Azure DevOps integration  
🚀 Advanced compliance reporting  
🚀 Multi-format file support (PDF, images)  

## Estimated MVP Cost

**3-Month Implementation**: Detailed cost breakdown available at:
[Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator?dl=CjhDaVF3TUdNNE9UZ3haQzB4WWpreUxUUXhOVGN0WVRsaU5DMWtNVEpsTm1SaFlUazFZallRQVE9PRA0GiREMDA2QzdCOS03OTY4LTQxRUYtODA2My1DMjBBQTEyNjQzNUQ)

## License

This is a prototype developed for GenAI Hackathon. All rights reserved.

---

**Genesis QA** - Transforming Healthcare Test Automation with AI

*Built with ❤️ by Team Sangam AI*