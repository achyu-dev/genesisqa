from flask import Flask, render_template, request, jsonify, redirect, url_for
import os
import json
from datetime import datetime
import uuid
import re

app = Flask(__name__)
app.config['SECRET_KEY'] = 'genesis-qa-secret-key'
app.config['UPLOAD_FOLDER'] = 'uploads'

# Create uploads directory if it doesn't exist
if not os.path.exists('uploads'):
    os.makedirs('uploads')

# In-memory storage for demo (use database in production)
test_cases = []
uploaded_files = []
compliance_reports = []

def extract_requirements_from_text(text):
    """Extract requirements from uploaded text"""
    # Simple requirement extraction logic
    sentences = text.split('.')
    requirements = []
    
    for i, sentence in enumerate(sentences):
        sentence = sentence.strip()
        if len(sentence) > 20 and any(keyword in sentence.lower() for keyword in 
                                    ['shall', 'must', 'should', 'required', 'system', 'user']):
            requirements.append({
                'id': f'REQ-{i+1:03d}',
                'text': sentence,
                'priority': 'High' if 'must' in sentence.lower() else 'Medium'
            })
    
    return requirements

def generate_test_cases_from_requirements(requirements):
    """Generate test cases from requirements using AI simulation"""
    generated_cases = []
    
    test_case_templates = [
        "Verify that {requirement}",
        "Test that the system {requirement}",
        "Validate that {requirement}",
        "Ensure that {requirement}"
    ]
    
    for req in requirements:
        # Generate 2-3 test cases per requirement
        for i in range(2):
            test_case = {
                'id': f'TC-{len(generated_cases)+1:03d}',
                'title': f"Test Case for {req['id']}",
                'description': test_case_templates[i % len(test_case_templates)].format(
                    requirement=req['text'].lower()
                ),
                'steps': [
                    f"Step 1: Navigate to the relevant system component",
                    f"Step 2: Execute the functionality related to: {req['text'][:50]}...",
                    f"Step 3: Verify the expected behavior",
                    f"Step 4: Document the results"
                ],
                'expected_result': f"System should comply with {req['id']}",
                'priority': req['priority'],
                'compliance_tags': get_compliance_tags(req['text']),
                'requirement_id': req['id'],
                'created_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            generated_cases.append(test_case)
    
    return generated_cases

def get_compliance_tags(text):
    """Identify compliance standards based on text content"""
    tags = []
    text_lower = text.lower()
    
    if any(keyword in text_lower for keyword in ['patient', 'medical', 'health', 'clinical']):
        tags.extend(['HIPAA', 'FDA-21CFR'])
    
    if any(keyword in text_lower for keyword in ['safety', 'risk', 'hazard']):
        tags.append('IEC-62304')
    
    if any(keyword in text_lower for keyword in ['security', 'authentication', 'authorization']):
        tags.extend(['HIPAA-Security', 'GDPR'])
    
    return tags if tags else ['General-Compliance']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload')
def upload_page():
    return render_template('upload.html')

@app.route('/upload_file', methods=['POST'])
def upload_file():
    global test_cases, uploaded_files
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Read file content
        if file.filename.endswith('.txt'):
            content = file.read().decode('utf-8')
        else:
            return jsonify({'error': 'Only .txt files are supported in this demo'}), 400
        
        # Store file info
        file_info = {
            'id': str(uuid.uuid4()),
            'filename': file.filename,
            'upload_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'content': content,
            'processed': False
        }
        uploaded_files.append(file_info)
        
        # Extract requirements
        requirements = extract_requirements_from_text(content)
        
        # Generate test cases
        new_test_cases = generate_test_cases_from_requirements(requirements)
        test_cases.extend(new_test_cases)
        
        # Mark as processed
        file_info['processed'] = True
        file_info['requirements_count'] = len(requirements)
        file_info['test_cases_count'] = len(new_test_cases)
        
        # Generate compliance report
        compliance_report = generate_compliance_report(new_test_cases)
        compliance_reports.append(compliance_report)
        
        return jsonify({
            'success': True,
            'message': f'File processed successfully! Generated {len(new_test_cases)} test cases.',
            'file_id': file_info['id'],
            'requirements_count': len(requirements),
            'test_cases_count': len(new_test_cases)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/test_cases')
def test_cases_page():
    return render_template('test_cases.html', test_cases=test_cases)

@app.route('/api/test_cases')
def api_test_cases():
    return jsonify(test_cases)

@app.route('/compliance')
def compliance_page():
    return render_template('compliance.html', reports=compliance_reports)

def generate_compliance_report(test_cases_batch):
    """Generate compliance analytics report"""
    compliance_stats = {}
    
    for tc in test_cases_batch:
        for tag in tc['compliance_tags']:
            if tag not in compliance_stats:
                compliance_stats[tag] = {'count': 0, 'test_cases': []}
            compliance_stats[tag]['count'] += 1
            compliance_stats[tag]['test_cases'].append(tc['id'])
    
    report = {
        'id': str(uuid.uuid4()),
        'generated_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'total_test_cases': len(test_cases_batch),
        'compliance_coverage': compliance_stats,
        'compliance_score': calculate_compliance_score(compliance_stats)
    }
    
    return report

def calculate_compliance_score(stats):
    """Calculate overall compliance score"""
    total_standards = len(stats)
    if total_standards == 0:
        return 0
    
    # Simple scoring logic
    score = min(100, (total_standards * 20) + (sum(s['count'] for s in stats.values()) * 2))
    return round(score, 1)

@app.route('/api/upload_status')
def upload_status():
    return jsonify(uploaded_files)

if __name__ == '__main__':
    #app.run(debug=True, port=5000)
    app.run(host='0.0.0.0', port=5000, debug=False)