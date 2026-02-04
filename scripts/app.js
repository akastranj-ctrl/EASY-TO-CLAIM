// --- State ---
let currentStep = 1;

// --- Elements ---
const steps = document.querySelectorAll('.step-section');
const progressItems = document.querySelectorAll('.step-item');
const claimIdDisplay = document.getElementById('claimIdDisplay');

// Form display elements for Review
const reviewName = document.getElementById('reviewName');
const reviewPolicy = document.getElementById('reviewPolicy');
const reviewDesc = document.getElementById('reviewDesc');
const reviewFiles = document.getElementById('reviewFiles');

// Inputs
const inputName = document.getElementById('fullName');
const inputPolicy = document.getElementById('policyNumber');
const inputDesc = document.getElementById('description');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});

// --- Navigation Functions ---
function nextStep(targetStep) {
    if (!validateStep(currentStep)) return;

    // Simulate data saving
    updateReviewData();

    currentStep = targetStep;
    updateUI();
}

function prevStep(targetStep) {
    currentStep = targetStep;
    updateUI();
}

function updateUI() {
    // 1. Hide all steps
    steps.forEach(step => step.classList.remove('active'));

    // 2. Show current step
    document.getElementById(`step${currentStep}`).classList.add('active');

    // 3. Update Stepper Header
    progressItems.forEach(item => {
        const stepNum = parseInt(item.getAttribute('data-step'));
        if (stepNum <= currentStep) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Validation ---
function validateStep(step) {
    // Simple verification for Demo purposes
    const form = document.getElementById(`formStep${step}`);
    if (form) {
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }
    }
    return true;
}

// --- Specific Logic ---

// Step 2: Pills
function selectIncidentType(type) {
    const desc = document.getElementById('description');
    desc.value = `Incident Type: ${type}\nDetails: `;
    desc.focus();

    // Highlight pill
    document.querySelectorAll('.pill').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Step 3: File Upload
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('click', () => document.getElementById('fileInput').click());

// Drag & Drop Events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('drag-over');
}

function unhighlight(e) {
    dropZone.classList.remove('drag-over');
}

dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    const list = document.getElementById('fileList');
    list.innerHTML = ''; // Clear for demo

    Array.from(files).forEach(file => {
        // Create file preview item
        const item = document.createElement('div');
        item.className = 'pill'; // Reusing style
        item.innerHTML = `<i class="fa-solid fa-file"></i> ${file.name}`;
        list.appendChild(item);
    });

    if (files.length > 0) {
        reviewFiles.textContent = `${files.length} file(s) attached`;
    }
}

// Step 4: Populate Review
function updateReviewData() {
    reviewName.textContent = inputName.value || "Not provided";
    reviewPolicy.textContent = inputPolicy.value || "Not provided";
    reviewDesc.textContent = inputDesc.value || "Not provided";
}

// Step 5: Submit
function submitClaim() {
    // Simulate network delay and AI checks
    const btn = document.querySelector('.btn-success');

    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...`;

    // Go to next step immediately to show the "AI Review" animation
    nextStep(5);

    // Start the AI Status sequence
    const statusText = document.createElement('p');
    statusText.className = 'detailed-status';
    const container = document.querySelector('#step5 .glass-card');

    // Insert status text if not exists
    if (!container.querySelector('.detailed-status')) {
        container.insertBefore(statusText, container.querySelector('.tracking-timeline'));
    }

    const messages = [
        "Analyzing incident details...",
        "Verifying policy coverage...",
        "Scanning uploaded evidence...",
        "Calculating preliminary estimate...",
        "Claim Approved for Quick Process!"
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < messages.length) {
            statusText.textContent = messages[i];
            // Visual pulse on the AI bubble
            i++;
        } else {
            clearInterval(interval);
            // Finalize
            const id = Math.floor(100000 + Math.random() * 900000);
            claimIdDisplay.textContent = id;
        }
    }, 1500);
}

// --- Chatbot ---
function toggleChat() {
    const chat = document.getElementById('chatWindow');
    chat.classList.toggle('active');
}
