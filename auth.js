// Criminal Investigation Database - Authentication Module
// This file will be obfuscated before deployment

// Base64 encoded case data (decoded at runtime)
const encodedCaseData = "eyJjYXNlcyI6W3siY2FzZU51bWJlciI6IkNJLTI4NDciLCJhdXRoQ29kZSI6Iks3TTktUFg0USIsImZvbGRlciI6ImNhc2UtY2kyODQ3In0seyJjYXNlTnVtYmVyIjoiQ0ktNTAzOSIsImF1dGhDb2RlIjoiSDNOOC1XUjZMIiwiZm9sZGVyIjoiY2FzZS1jaTUwMzkifSx7ImNhc2VOdW1iZXIiOiJDSS02MjgxIiwiYXV0aENvZGUiOiJUNVlKLTlCQzIiLCJmb2xkZXIiOiJjYXNlLWNpNjI4MSJ9XX0=";

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
