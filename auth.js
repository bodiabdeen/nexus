// Criminal Investigation Database - Authentication Module
// This file will be obfuscated before deployment

// Base64 encoded case data with SECURE RANDOM folder names
// UNIFIED DATABASE: Contains BOTH English and Arabic cases
// Both portals can access ANY case with correct credentials
const encodedCaseData = "ewogICJjYXNlcyI6IFsKICAgIHsKICAgICAgImNhc2VOdW1iZXIiOiAiQ0ktMjg0NyIsCiAgICAgICJhdXRoQ29kZSI6ICJLN005LVBYNFEiLAogICAgICAiZm9sZGVyIjogImNhc2UtN2s5bXhwNHFoM244dyIKICAgIH0sCiAgICB7CiAgICAgICJjYXNlTnVtYmVyIjogIkNJLTUwMzkiLAogICAgICAiYXV0aENvZGUiOiAiSDNOOC1XUjZMIiwKICAgICAgImZvbGRlciI6ICJjYXNlLTJiYzl0ajV5cjZsbTQiCiAgICB9LAogICAgewogICAgICAiY2FzZU51bWJlciI6ICJDSS02MjgxIiwKICAgICAgImF1dGhDb2RlIjogIlQ1WUotOUJDMiIsCiAgICAgICJmb2xkZXIiOiAiY2FzZS04eGYzdnE3bmgyazlwIgogICAgfSwKICAgIHsKICAgICAgImNhc2VOdW1iZXIiOiAiQ0ktMTg2NyIsCiAgICAgICJhdXRoQ29kZSI6ICJVNjlLLUxCRzkiLAogICAgICAiZm9sZGVyIjogImNhc2UtaXJoYjRxc29rZTEwNiIKICAgIH0sCiAgICB7CiAgICAgICJjYXNlTnVtYmVyIjogIkNJLTI1MDQiLAogICAgICAiYXV0aENvZGUiOiAiNTNDUy1IWDMwIiwKICAgICAgImZvbGRlciI6ICJjYXNlLWt5cGx6bGt1aWYxNzUiCiAgICB9LAogICAgewogICAgICAiY2FzZU51bWJlciI6ICJDSS00NzE0IiwKICAgICAgImF1dGhDb2RlIjogIk5SMVEtNTlHNyIsCiAgICAgICJmb2xkZXIiOiAiY2FzZS04aXV6amhhNzJjM2IyIgogICAgfSwKICAgIHsKICAgICAgImNhc2VOdW1iZXIiOiAiQ0ktNzM5NSIsCiAgICAgICJhdXRoQ29kZSI6ICJNNEtQLTdYTjIiLAogICAgICAiZm9sZGVyIjogImNhc2UtM3I4eWsybTdxbDVuNiIKICAgIH0KICBdCn0K";

// Decode case data
function getCaseDatabase() {
    try {
        const decoded = atob(encodedCaseData);
        return JSON.parse(decoded);
    } catch (e) {
        console.error('Database access error');
        return { cases: [] };
    }
}

// Normalize input (remove spaces, convert to uppercase)
function normalizeInput(str) {
    return str.replace(/\s+/g, '').toUpperCase();
}

// Authenticate user
function authenticateCase(caseNumber, authCode) {
    const database = getCaseDatabase();
    const normalizedCaseNum = normalizeInput(caseNumber);
    const normalizedAuthCode = normalizeInput(authCode);
    
    // Find matching case
    const matchedCase = database.cases.find(caseData => {
        return normalizeInput(caseData.caseNumber) === normalizedCaseNum &&
               normalizeInput(caseData.authCode) === normalizedAuthCode;
    });
    
    return matchedCase ? matchedCase.folder : null;
}

// Handle form submission
function handleAuthentication(event) {
    event.preventDefault();
    
    const button = document.getElementById('accessBtn');
    const errorMessage = document.getElementById('errorMessage');
    const caseNumber = document.getElementById('caseNumber').value;
    const authCode = document.getElementById('authCode').value;
    
    // Hide previous error
    errorMessage.classList.remove('show');
    
    // Processing state
    button.classList.add('processing');
    button.innerHTML = '<div class="button-corner tl"></div><div class="button-corner br"></div>Verifying';
    
    // Log attempt (for security monitoring)
    console.log('Access attempt:', {
        timestamp: new Date().toISOString(),
        terminal: document.getElementById('terminalId').textContent
    });
    
    // Simulate authentication delay (makes it feel more secure)
    setTimeout(() => {
        const caseFolder = authenticateCase(caseNumber, authCode);
        
        if (caseFolder) {
            // Access granted
            button.classList.remove('processing');
            button.classList.add('authorized');
            button.innerHTML = '<div class="button-corner tl"></div><div class="button-corner br"></div>Access Granted';
            
            // Redirect to case folder after brief delay
            setTimeout(() => {
                window.location.href = caseFolder + '/index.html';
            }, 1500);
        } else {
            // Access denied
            button.classList.remove('processing');
            button.classList.add('denied');
            button.innerHTML = '<div class="button-corner tl"></div><div class="button-corner br"></div>Access Denied';
            errorMessage.classList.add('show');
            
            // Reset button after delay
            setTimeout(() => {
                button.classList.remove('denied');
                button.innerHTML = '<div class="button-corner tl"></div><div class="button-corner br"></div>Access Records';
            }, 2000);
        }
    }, 1800);
}

// Optional: Add brute force protection
let failedAttempts = 0;
const MAX_ATTEMPTS = 5;

function checkBruteForce() {
    if (failedAttempts >= MAX_ATTEMPTS) {
        alert('Too many failed attempts. System locked for security.');
        document.getElementById('accessBtn').disabled = true;
        return false;
    }
    return true;
}
