document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen and hide it after a delay
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
    
    // Set current date for last edited
    document.getElementById('last-edited').textContent = new Date().toLocaleDateString();
    
    // Profile Image Upload
    const profileImage = document.getElementById('profile-image');
    const photoUpload = document.getElementById('photo-upload');
    
    profileImage.addEventListener('click', function() {
        photoUpload.click();
    });
    
    photoUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Remove the text inside profile image div
                profileImage.innerHTML = '';
                
                // Create and append image
                const img = document.createElement('img');
                img.src = e.target.result;
                profileImage.appendChild(img);
                
                // Update completion percentage
                updateCompletionPercentage();
                
                // Show toast notification
                showToast('Profile photo updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Add new education item
    document.getElementById('add-education').addEventListener('click', function() {
        const educationSection = document.getElementById('education-section');
        const newEducation = document.createElement('div');
        newEducation.className = 'education-item';
        newEducation.style.opacity = '0';
        newEducation.style.transform = 'translateY(20px)';
        newEducation.innerHTML = `
            <div class="editable-field" contenteditable="true" data-placeholder="Degree/Qualification">Degree/Qualification</div>
            <div class="education-meta">
                <div class="editable-field" contenteditable="true" data-placeholder="Institution Name">Institution Name</div>
                <div class="editable-field" contenteditable="true" data-placeholder="Year - Year">Year - Year</div>
            </div>
            <div class="editable-field" contenteditable="true" data-placeholder="Grade/Score">Grade/Score</div>
            <div class="item-actions">
                <button class="delete-button">Delete</button>
            </div>
        `;
        
        // Insert before the Add button
        educationSection.insertBefore(newEducation, this.parentNode.nextSibling);
        
        // Animate the new item
        setTimeout(() => {
            newEducation.style.transition = 'all 0.5s ease';
            newEducation.style.opacity = '1';
            newEducation.style.transform = 'translateY(0)';
        }, 10);
        
        addDeleteListeners();
        updateCompletionPercentage();
    });
    
    // Add new experience item
    document.getElementById('add-experience').addEventListener('click', function() {
        const experienceSection = document.getElementById('experience-section');
        const newExperience = document.createElement('div');
        newExperience.className = 'experience-item';
        newExperience.style.opacity = '0';
        newExperience.style.transform = 'translateY(20px)';
        newExperience.innerHTML = `
            <div class="editable-field" contenteditable="true" data-placeholder="Position/Role">Position/Role</div>
            <div class="experience-meta">
                <div class="editable-field" contenteditable="true" data-placeholder="Company/Organization">Company/Organization</div>
                <div class="editable-field" contenteditable="true" data-placeholder="Month Year - Month Year">Month Year - Month Year</div>
            </div>
            <div class="editable-field" contenteditable="true" data-placeholder="Description of your role and responsibilities">Description of your role and responsibilities</div>
            <div class="item-actions">
                <button class="delete-button">Delete</button>
            </div>
        `;
        
        experienceSection.insertBefore(newExperience, this.parentNode.nextSibling);
        
        // Animate the new item
        setTimeout(() => {
            newExperience.style.transition = 'all 0.5s ease';
            newExperience.style.opacity = '1';
            newExperience.style.transform = 'translateY(0)';
        }, 10);
        
        addDeleteListeners();
        updateCompletionPercentage();
    });
    
    // Add new project item
    document.getElementById('add-project').addEventListener('click', function() {
        const projectsSection = document.getElementById('projects-section');
        const newProject = document.createElement('div');
        newProject.className = 'project-item';
        newProject.style.opacity = '0';
        newProject.style.transform = 'translateY(20px)';
        newProject.innerHTML = `
            <div class="editable-field" contenteditable="true" data-placeholder="Project Title">Project Title</div>
            <div class="project-meta">
                <div class="editable-field" contenteditable="true" data-placeholder="Project Type">Project Type</div>
                <div class="editable-field" contenteditable="true" data-placeholder="Month Year - Month Year">Month Year - Month Year</div>
            </div>
            <div class="editable-field" contenteditable="true" data-placeholder="Description of the project, technologies used, and your role">Description of the project, technologies used, and your role</div>
            <div class="item-actions">
                <button class="delete-button">Delete</button>
            </div>
        `;
        
        projectsSection.insertBefore(newProject, this.parentNode.nextSibling);
        
        // Animate the new item
        setTimeout(() => {
            newProject.style.transition = 'all 0.5s ease';
            newProject.style.opacity = '1';
            newProject.style.transform = 'translateY(0)';
        }, 10);
        
        addDeleteListeners();
        updateCompletionPercentage();
    });
    
    // Add new skill
    document.getElementById('add-skill').addEventListener('click', function() {
        const skillsList = document.querySelector('.skills-list');
        const newSkill = document.createElement('div');
        newSkill.className = 'skill-tag';
        newSkill.style.opacity = '0';
        newSkill.style.transform = 'scale(0.8)';
        newSkill.innerHTML = `
            <span class="editable-field" contenteditable="true" data-placeholder="New Skill">New Skill</span>
            <button class="remove-skill">×</button>
        `;
        
        skillsList.appendChild(newSkill);
        
        // Animate the new skill
        setTimeout(() => {
            newSkill.style.transition = 'all 0.3s ease';
            newSkill.style.opacity = '1';
            newSkill.style.transform = 'scale(1)';
        }, 10);
        
        addRemoveSkillListeners();
        updateCompletionPercentage();
    });
    
    // Add new achievement
    document.getElementById('add-achievement').addEventListener('click', function() {
        const achievementsList = document.querySelector('.achievements-list');
        const newAchievement = document.createElement('li');
        newAchievement.style.opacity = '0';
        newAchievement.style.transform = 'translateX(-20px)';
        newAchievement.innerHTML = `
            <div class="editable-field" contenteditable="true" data-placeholder="New Achievement">New Achievement</div>
            <button class="remove-achievement">×</button>
        `;
        
        achievementsList.appendChild(newAchievement);
        
        // Animate the new achievement
        setTimeout(() => {
            newAchievement.style.transition = 'all 0.3s ease';
            newAchievement.style.opacity = '1';
            newAchievement.style.transform = 'translateX(0)';
        }, 10);
        
        addRemoveAchievementListeners();
        updateCompletionPercentage();
    });
    
    // Add new certification
    document.getElementById('add-certification').addEventListener('click', function() {
        const certificationsSection = document.getElementById('certifications-section');
        const newCertification = document.createElement('div');
        newCertification.className = 'certification-item';
        newCertification.style.opacity = '0';
        newCertification.style.transform = 'translateY(20px)';
        newCertification.innerHTML = `
            <div class="editable-field" contenteditable="true" data-placeholder="Certification Name">Certification Name</div>
            <div class="certification-meta">
                <div class="editable-field" contenteditable="true" data-placeholder="Issuing Organization">Issuing Organization</div>
                <div class="editable-field" contenteditable="true" data-placeholder="Month Year">Month Year</div>
            </div>
            <div class="editable-field" contenteditable="true" data-placeholder="Credential ID">Credential ID</div>
            <div class="item-actions">
                <button class="delete-button">Delete</button>
            </div>
        `;
        
        certificationsSection.insertBefore(newCertification, this.parentNode.nextSibling);
        
        // Animate the new certification
        setTimeout(() => {
            newCertification.style.transition = 'all 0.5s ease';
            newCertification.style.opacity = '1';
            newCertification.style.transform = 'translateY(0)';
        }, 10);
        
        addDeleteListeners();
        updateCompletionPercentage();
    });
    
    // Add new language
    document.getElementById('add-language').addEventListener('click', function() {
        const languagesList = document.querySelector('.languages-list');
        const newLanguage = document.createElement('div');
        newLanguage.className = 'language-item';
        newLanguage.style.opacity = '0';
        newLanguage.style.transform = 'translateY(20px)';
        newLanguage.innerHTML = `
            <div class="language-name">
                <span class="editable-field" contenteditable="true" data-placeholder="Language">Language</span>
            </div>
            <div class="language-level">
                <span class="editable-field" contenteditable="true" data-placeholder="Proficiency Level">Proficiency Level</span>
            </div>
            <div class="item-actions">
                <button class="delete-button">Delete</button>
            </div>
        `;
        
        languagesList.appendChild(newLanguage);
        
        // Animate the new language
        setTimeout(() => {
            newLanguage.style.transition = 'all 0.5s ease';
            newLanguage.style.opacity = '1';
            newLanguage.style.transform = 'translateY(0)';
        }, 10);
        
        addDeleteListeners();
        updateCompletionPercentage();
    });
    
    // Save resume button
    document.getElementById('save-resume').addEventListener('click', function() {
        saveResume();
    });
    
    // Share resume button
    document.getElementById('share-resume').addEventListener('click', function() {
        showToast('Resume link copied to clipboard!');
        // In a real app, this would generate a shareable link
    });
    
    // Preview resume button
    document.getElementById('preview-resume').addEventListener('click', function() {
        showToast('Opening resume preview...');
        // In a real app, this would open a preview mode
    });
    
    // Download resume as PDF button
    document.getElementById('download-resume').addEventListener('click', function() {
        showToast('Preparing PDF download...');
        // In a real app, this would generate and download a PDF
        setTimeout(() => {
            showToast('Resume downloaded successfully!');
        }, 2000);
    });
    
    // Initialize event listeners for delete buttons
    function addDeleteListeners() {
        document.querySelectorAll('.delete-button').forEach(button => {
            if (!button.hasListener) {
                button.addEventListener('click', function() {
                    const item = this.closest('.education-item, .experience-item, .project-item, .certification-item, .language-item');
                    
                    // Animate removal
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        item.remove();
                        updateCompletionPercentage();
                    }, 300);
                });
                button.hasListener = true;
            }
        });
    }
    
    // Initialize event listeners for remove skill buttons
    function addRemoveSkillListeners() {
        document.querySelectorAll('.remove-skill').forEach(button => {
            if (!button.hasListener) {
                button.addEventListener('click', function() {
                    const skillTag = this.closest('.skill-tag');
                    
                    // Animate removal
                    skillTag.style.transition = 'all 0.3s ease';
                    skillTag.style.opacity = '0';
                    skillTag.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        skillTag.remove();
                        updateCompletionPercentage();
                    }, 300);
                });
                button.hasListener = true;
            }
        });
    }
    
    // Initialize event listeners for remove achievement buttons
    function addRemoveAchievementListeners() {
        document.querySelectorAll('.remove-achievement').forEach(button => {
            if (!button.hasListener) {
                button.addEventListener('click', function() {
                    const achievement = this.closest('li');
                    
                    // Animate removal
                    achievement.style.transition = 'all 0.3s ease';
                    achievement.style.opacity = '0';
                    achievement.style.transform = 'translateX(20px)';
                    
                    setTimeout(() => {
                        achievement.remove();
                        updateCompletionPercentage();
                    }, 300);
                });
                button.hasListener = true;
            }
        });
    }
    
    // Function to save resume data
    function saveResume() {
        // Create an object to store all resume data
        const resumeData = {
            personalInfo: {
                fullName: document.getElementById('full-name').textContent,
                courseYear: document.getElementById('course-year').textContent,
                email: document.getElementById('email').textContent,
                phone: document.getElementById('phone').textContent,
                location: document.getElementById('location').textContent,
                linkedin: document.getElementById('linkedin').textContent,
                github: document.getElementById('github').textContent,
                aboutMe: document.getElementById('about-me').textContent,
                // Save image as base64 string if present
                photo: document.querySelector('#profile-image img') ? 
                       document.querySelector('#profile-image img').src : null
            },
            education: [],
            experience: [],
            projects: [],
            skills: [],
            achievements: [],
            certifications: [],
            languages: []
        };
        
        // Collect education items
        document.querySelectorAll('.education-item').forEach(item => {
            const eduFields = item.querySelectorAll('.editable-field');
            resumeData.education.push({
                degree: eduFields[0].textContent,
                institution: eduFields[1].textContent,
                period: eduFields[2].textContent,
                grade: eduFields[3].textContent
            });
        });
        
        // Collect experience items
        document.querySelectorAll('.experience-item').forEach(item => {
            const expFields = item.querySelectorAll('.editable-field');
            resumeData.experience.push({
                position: expFields[0].textContent,
                company: expFields[1].textContent,
                period: expFields[2].textContent,
                description: expFields[3].textContent
            });
        });
        
        // Collect project items
        document.querySelectorAll('.project-item').forEach(item => {
            const projFields = item.querySelectorAll('.editable-field');
            resumeData.projects.push({
                title: projFields[0].textContent,
                type: projFields[1].textContent,
                period: projFields[2].textContent,
                description: projFields[3].textContent
            });
        });
        
        // Collect skills
        document.querySelectorAll('.skill-tag span').forEach(skill => {
            resumeData.skills.push(skill.textContent);
        });
        
        // Collect achievements
        document.querySelectorAll('.achievements-list li .editable-field').forEach(achievement => {
            resumeData.achievements.push(achievement.textContent);
        });
        
        // Collect certifications
        document.querySelectorAll('.certification-item').forEach(item => {
            const certFields = item.querySelectorAll('.editable-field');
            resumeData.certifications.push({
                name: certFields[0].textContent,
                issuer: certFields[1].textContent,
                date: certFields[2].textContent,
                credential: certFields[3].textContent
            });
        });
        
        // Collect languages
        document.querySelectorAll('.language-item').forEach(item => {
            const langFields = item.querySelectorAll('.editable-field');
            resumeData.languages.push({
                language: langFields[0].textContent,
                level: langFields[1].textContent
            });
        });
        
        // Convert to JSON and save
        const resumeJSON = JSON.stringify(resumeData);
        
        // In a real application, you would send this to a server
        console.log("Resume saved:", resumeJSON);
        
        // Update last edited date
        document.getElementById('last-edited').textContent = new Date().toLocaleDateString();
        
        // Show toast notification
        showToast('Resume saved successfully!');
        
        // For demo purposes, we can save to localStorage
        localStorage.setItem('savedResume', resumeJSON);
    }
    
    // Load saved resume data if available (demo purpose)
    function loadSavedResume() {
        const savedData = localStorage.getItem('savedResume');
        if (savedData) {
            try {
                const resumeData = JSON.parse(savedData);
                // Implement loading logic here if needed
                console.log("Found saved resume data:", resumeData);
            } catch (e) {
                console.error("Error loading saved resume:", e);
            }
        }
    }
    
    // Function to show toast notifications
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.querySelector('.toast-message');
        
        // Set message
        toastMessage.textContent = message;
        
        // Show toast
        toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Function to calculate and update profile completion percentage
    function updateCompletionPercentage() {
        const sections = [
            { element: document.getElementById('full-name'), weight: 5 },
            { element: document.getElementById('course-year'), weight: 3 },
            { element: document.getElementById('email'), weight: 3 },
            { element: document.getElementById('phone'), weight: 3 },
            { element: document.getElementById('location'), weight: 3 },
            { element: document.getElementById('linkedin'), weight: 3 },
            { element: document.getElementById('github'), weight: 3 },
            { element: document.getElementById('about-me'), weight: 5 },
            { element: document.querySelector('#profile-image img'), weight: 10 }
        ];
        
        const itemCounts = {
            education: document.querySelectorAll('.education-item').length * 5,
            experience: document.querySelectorAll('.experience-item').length * 5,
            projects: document.querySelectorAll('.project-item').length * 5,
            skills: document.querySelectorAll('.skill-tag').length * 2,
            achievements: document.querySelectorAll('.achievements-list li').length * 2,
            certifications: document.querySelectorAll('.certification-item').length * 3,
            languages: document.querySelectorAll('.language-item').length * 2
        };
        
        let totalScore = 0;
        let maxScore = 0;
        
        // Calculate score for personal info sections
        sections.forEach(section => {
            maxScore += section.weight;
            if (section.element && section.element.textContent.trim() !== '' && 
                section.element.textContent !== section.element.getAttribute('data-placeholder')) {
                totalScore += section.weight;
            }
        });
        
        // Add scores for other sections
        Object.values(itemCounts).forEach(count => {
            totalScore += count;
            maxScore += 15; // Maximum expected items per section
        });
        
        // Calculate percentage (cap at 100%)
        let percentage = Math.min(Math.round((totalScore / maxScore) * 100), 100);
        
        // Update the DOM
        document.getElementById('completion-percentage').textContent = `${percentage}%`;
    }
    
    // Initialize all event listeners
    addDeleteListeners();
    addRemoveSkillListeners();
    addRemoveAchievementListeners();
    
    // Add focus/blur events for all editable fields to update completion percentage
    document.querySelectorAll('.editable-field').forEach(field => {
        field.addEventListener('blur', updateCompletionPercentage);
    });
    
    // Try to load any saved data
    loadSavedResume();
    
    // Calculate initial completion percentage
    updateCompletionPercentage();
});