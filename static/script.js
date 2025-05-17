console.log(" this is js for yencryto ");
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    //document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Get DOM elements
    const tabs = document.querySelectorAll('.tab');
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const shiftSlider = document.getElementById('shift-slider');
    const shiftInput = document.getElementById('shift');
    const copyBtn = document.getElementById('copy-btn');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');
    
    // Initialize variables
    let currentMode = 'encrypt';
    
    // Function to update labels based on mode
    function updateLabels() {
        if (currentMode === 'encrypt') {
            inputLabel.textContent = 'Original Text';
            outputLabel.textContent = 'Encrypted Result';
            inputText.placeholder = 'Enter text to encrypt...';
        } else {
            inputLabel.textContent = 'Encrypted Text';
            outputLabel.textContent = 'Decrypted Result';
            inputText.placeholder = 'Enter text to decrypt...';
        }
    }
    
    // Function to process text
    function processText() {
        if (!inputText.value) {
            outputText.value = '';
            return;
        }
        
        const shift = parseInt(shiftInput.value);
        
        fetch('/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: inputText.value,
                shift: shift,
                mode: currentMode
            })
        })
        .then(response => response.json())
        .then(data => {
            outputText.value = data.result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    // Event listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            currentMode = tab.dataset.mode;
            updateLabels();
            processText();
        });
    });
    
    shiftSlider.addEventListener('input', () => {
        shiftInput.value = shiftSlider.value;
        processText();
    });
    
    shiftInput.addEventListener('change', () => {
        let value = parseInt(shiftInput.value);
        if (value < 1) value = 1;
        if (value > 25) value = 25;
        
        shiftInput.value = value;
        shiftSlider.value = value;
        processText();
    });
    
    inputText.addEventListener('input', processText);
    
    copyBtn.addEventListener('click', () => {
        if (outputText.value) {
            navigator.clipboard.writeText(outputText.value);
            alert('Text copied to clipboard!');
        }
    });
    
    // Initial setup
    updateLabels();
});
