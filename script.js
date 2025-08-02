// Optimized JavaScript for CDN Uploader
// Performance-focused implementation

(function() {
    'use strict';
    
    // Cache DOM elements for better performance
    let uploadForm, uploadButton, buttonText, loadingIcon, fileInput, 
        fileInputLabel, fileInputContent, fileSelectedContent, fileName, 
        progressContainer, progressFill;
    
    // Initialize when DOM is ready
    function init() {
        // Cache all DOM elements
        uploadForm = document.getElementById('uploadForm');
        uploadButton = document.getElementById('uploadButton');
        buttonText = document.getElementById('buttonText');
        loadingIcon = document.getElementById('loadingIcon');
        fileInput = document.getElementById('fileInput');
        fileInputLabel = document.querySelector('.file-input-label');
        fileInputContent = document.getElementById('fileInputContent');
        fileSelectedContent = document.getElementById('fileSelectedContent');
        fileName = document.getElementById('fileName');
        progressContainer = document.getElementById('progressContainer');
        progressFill = document.getElementById('progressFill');
        
        // Bind events
        bindEvents();
    }
    
    function bindEvents() {
        // File input change handler
        fileInput.addEventListener('change', handleFileChange);
        
        // Drag and drop functionality
        fileInputLabel.addEventListener('dragover', handleDragOver);
        fileInputLabel.addEventListener('dragleave', handleDragLeave);
        fileInputLabel.addEventListener('drop', handleDrop);
        
        // Form submit handler
        uploadForm.addEventListener('submit', handleFormSubmit);
        
        // Keyboard accessibility
        document.addEventListener('keydown', handleKeyDown);
    }
    
    function handleFileChange(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileName.textContent = file.name;
            
            // Use classList for better performance
            fileInputContent.classList.add('hidden');
            fileSelectedContent.classList.remove('hidden');
            fileInputLabel.classList.add('file-selected');
        } else {
            resetFileInput();
        }
    }
    
    function resetFileInput() {
        fileInputContent.classList.remove('hidden');
        fileSelectedContent.classList.add('hidden');
        fileInputLabel.classList.remove('file-selected');
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        this.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        this.style.background = 'rgba(255, 255, 255, 0.3)';
    }
    
    function handleDragLeave(e) {
        e.preventDefault();
        resetDragStyles();
    }
    
    function handleDrop(e) {
        e.preventDefault();
        resetDragStyles();
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            // Trigger change event
            fileInput.dispatchEvent(new Event('change'));
        }
    }
    
    function resetDragStyles() {
        fileInputLabel.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        fileInputLabel.style.background = 'rgba(255, 255, 255, 0.1)';
    }
    
    function handleFormSubmit(e) {
        if (!fileInput.files.length) {
            e.preventDefault();
            showAlert('Silakan pilih file terlebih dahulu!');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        showProgress();
        
        // Simulate progress animation
        animateProgress();
    }
    
    function setLoadingState(loading) {
        uploadButton.disabled = loading;
        buttonText.textContent = loading ? 'Mengupload...' : 'Upload File';
        
        if (loading) {
            loadingIcon.classList.remove('hidden');
        } else {
            loadingIcon.classList.add('hidden');
        }
    }
    
    function showProgress() {
        progressContainer.style.display = 'block';
    }
    
    function animateProgress() {
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            progressFill.style.width = progress + '%';
        }, 200);
        
        // Clean up interval after 3 seconds
        setTimeout(() => {
            clearInterval(progressInterval);
            progressFill.style.width = '100%';
        }, 3000);
    }
    
    function handleKeyDown(e) {
        if (e.key === 'Enter' && e.target === fileInputLabel) {
            fileInput.click();
        }
    }
    
    function showAlert(message) {
        // Use native alert for better performance
        // Could be replaced with custom modal if needed
        alert(message);
    }
    
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

