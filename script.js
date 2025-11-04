// DOM Elements
const inputText = document.getElementById('inputText');
const simplicitySlider = document.getElementById('simplicity');
const simplicityValue = document.getElementById('simplicityValue');
const toneSlider = document.getElementById('tone');
const toneValue = document.getElementById('toneValue');
const toneChips = document.querySelectorAll('.tone-chip');
const languageButtons = document.querySelectorAll('.segment-button');
const explainBtn = document.getElementById('explainBtn');
const outputArea = document.getElementById('outputArea');
const outputText = document.getElementById('outputText');
const loadingArea = document.getElementById('loadingArea');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');

// State
let isProcessing = false;
let currentSimplicity = 0;
let currentTone = 0;
let currentLanguage = 'en';

// Simplicity labels
const simplicityLabels = {
    0: '🧒 Like I\'m 5',
    1: '👩 Like I\'m 15',
    2: '👨‍🎓 Like I\'m a Grad Student'
};

// Tone labels
const toneLabels = {
    0: '🌈 Friendly',
    1: '🤓 Teacher',
    2: '😂 Funny',
    3: '🧘 Calm'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Smooth fade-in for the main card
    const mainCard = document.getElementById('mainCard');
    mainCard.style.opacity = '0';
    mainCard.style.transform = 'scale(0.98) translateY(10px)';
    
    setTimeout(() => {
        mainCard.style.transition = 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0, 0.2, 1)';
        mainCard.style.opacity = '1';
        mainCard.style.transform = 'scale(1) translateY(0)';
    }, 100);
    
    // Initialize slider values
    updateSimplicityLabel();
    updateToneLabel();
    updateToneChips();
});

// Simplicity slider handler
simplicitySlider.addEventListener('input', (e) => {
    currentSimplicity = parseInt(e.target.value);
    updateSimplicityLabel();
});

simplicitySlider.addEventListener('change', (e) => {
    currentSimplicity = parseInt(e.target.value);
    updateSimplicityLabel();
});

function updateSimplicityLabel() {
    simplicityValue.textContent = simplicityLabels[currentSimplicity];
}

// Tone slider handler
toneSlider.addEventListener('input', (e) => {
    currentTone = parseInt(e.target.value);
    updateToneLabel();
    updateToneChips();
});

toneSlider.addEventListener('change', (e) => {
    currentTone = parseInt(e.target.value);
    updateToneLabel();
    updateToneChips();
});

function updateToneLabel() {
    toneValue.textContent = toneLabels[currentTone];
}

function updateToneChips() {
    toneChips.forEach((chip, index) => {
        if (index === currentTone) {
            chip.classList.add('active');
            chip.setAttribute('aria-pressed', 'true');
        } else {
            chip.classList.remove('active');
            chip.setAttribute('aria-pressed', 'false');
        }
    });
}

// Tone chip buttons
toneChips.forEach((chip) => {
    chip.addEventListener('click', () => {
        const value = parseInt(chip.dataset.value);
        currentTone = value;
        toneSlider.value = value;
        updateToneLabel();
        updateToneChips();
    });
    
    // Keyboard support
    chip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            chip.click();
        }
    });
});

// Language segmented control
languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
        languageButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        currentLanguage = button.dataset.value;
    });
    
    // Keyboard support
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }
    });
});

// Explain button handler
explainBtn.addEventListener('click', handleExplain);
inputText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        handleExplain();
    }
});

function handleExplain() {
    const text = inputText.value.trim();
    
    if (!text) {
        // Optional: Show validation feedback
        inputText.focus();
        inputText.style.borderColor = 'rgba(255, 100, 100, 0.5)';
        setTimeout(() => {
            inputText.style.borderColor = '';
        }, 2000);
        return;
    }
    
    if (isProcessing) return;
    
    isProcessing = true;
    explainBtn.disabled = true;
    
    // Hide output, show loading
    outputArea.classList.add('hidden');
    loadingArea.classList.remove('hidden');
    
    // Simulate API call (replace with actual API call later)
    simulateAPICall(text, currentSimplicity, currentTone, currentLanguage)
        .then(result => {
            displayResult(result);
        })
        .catch(error => {
            displayError(error);
        })
        .finally(() => {
            isProcessing = false;
            explainBtn.disabled = false;
            loadingArea.classList.add('hidden');
        });
}

// Simulate API call (placeholder for actual backend integration)
function simulateAPICall(text, simplicity, tone, language) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Placeholder responses based on simplicity level
            const responses = {
                0: {
                    0: "Imagine you're explaining to a super curious kid. This is like when you have a bunch of puzzle pieces, and you put them together to make a picture. The text you gave me is like those puzzle pieces—it's all the information, and I'm putting it together in a way that makes it super easy to understand!",
                    1: "Let me break this down step by step. Think of it like learning a new game—first you learn the rules, then you practice, and soon it becomes easy. This text is explaining something complex, but we can make it simple by looking at it piece by piece.",
                    2: "Okay, so you know how sometimes things seem super complicated? It's like trying to explain why your pet rock doesn't move. But here's the thing: once you get it, it's actually pretty cool! The text is basically saying... well, let me put it this way—it's simpler than you think!",
                    3: "Like gentle waves on a shore, let this understanding wash over you. The complexity you see is merely layers waiting to be peeled away, revealing the simple truth beneath. In essence, this is about finding clarity in the midst of information."
                },
                1: {
                    0: "So here's what's going on: the text explains a concept that might seem tricky at first, but it's actually pretty straightforward once you break it down. Think of it like learning to ride a bike—there are steps involved, but they all make sense together.",
                    1: "This text presents information about a topic. To understand it better, we need to identify the key concepts and see how they relate to each other. It's essentially explaining how different parts work together to create a whole.",
                    2: "Alright, so you've got this text that's trying to explain something, right? It's like when someone tries to explain memes to your parents—it seems complicated but it's actually not that deep. The main idea is pretty simple once you get past the fancy words!",
                    3: "In the quiet space between complexity and simplicity, this text offers understanding. It speaks of concepts that flow together, each part supporting the whole, creating a harmonious explanation of the subject at hand."
                },
                2: {
                    0: "The text presents a concise overview of the subject matter, delineating key concepts and their interconnections. It serves as an accessible entry point to understanding the topic's fundamental principles.",
                    1: "This passage articulates the core tenets of the subject, establishing a framework for comprehension through systematic presentation of information and logical progression of ideas.",
                    2: "Right, so we've got this text that's basically doing the academic equivalent of explaining why cats are liquid—it sounds serious but it's actually pretty straightforward. The core argument is that these concepts connect in ways that make sense when you look at them together.",
                    3: "Within the contemplative structure of this text lies a methodical exploration of the subject. Each element contributes to a coherent understanding, presenting complexity with clarity and precision."
                }
            };
            
            const response = responses[simplicity]?.[tone] || responses[0][0];
            
            // Simulate occasional errors (5% chance)
            if (Math.random() < 0.05) {
                reject(new Error('Something went wrong. Please try again.'));
            } else {
                resolve(response);
            }
        }, 2000 + Math.random() * 1000); // 2-3 second delay
    });
}

// Display result
function displayResult(text) {
    outputText.textContent = text;
    outputArea.classList.remove('hidden');
    
    // Smooth scroll to output
    setTimeout(() => {
        outputArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Display error
function displayError(error) {
    outputText.textContent = `Error: ${error.message}`;
    outputArea.classList.remove('hidden');
}

// Copy button handler
copyBtn.addEventListener('click', async () => {
    const text = outputText.textContent;
    
    if (!text) return;
    
    try {
        await navigator.clipboard.writeText(text);
        showToast();
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast();
    }
});

// Show toast notification
function showToast() {
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 2000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to clear output
    if (e.key === 'Escape' && !outputArea.classList.contains('hidden')) {
        outputArea.classList.add('hidden');
        outputText.textContent = '';
    }
});

// Slider keyboard navigation
[simplicitySlider, toneSlider].forEach(slider => {
    slider.addEventListener('keydown', (e) => {
        let value = parseInt(slider.value);
        const min = parseInt(slider.min);
        const max = parseInt(slider.max);
        const step = parseInt(slider.step) || 1;
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            value = Math.max(min, value - step);
            slider.value = value;
            slider.dispatchEvent(new Event('input'));
            slider.dispatchEvent(new Event('change'));
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            value = Math.min(max, value + step);
            slider.value = value;
            slider.dispatchEvent(new Event('input'));
            slider.dispatchEvent(new Event('change'));
        }
    });
});
