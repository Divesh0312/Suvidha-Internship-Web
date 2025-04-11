document.addEventListener('DOMContentLoaded', function() {
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
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Add new education item
    document.getElementById('add-education').addEventListener('click', function() {
        const educationSection = document.getElementById('education-section');
        const newEducation = document.createElement('div');
        newEducation.className = 'education-item';
        newEducation.innerHTML = `
            <div class="editable-field" contenteditable="true">Degree/Qualification</div>
            <div class="education-meta">
                <div class="editable-field" contenteditable="true">Institution Name</div>
                <div class="editable-field" contenteditable="true">Year - Year</div>
            </div>
            <div class="editable-field" contenteditable="true">Grade/Score</div>
            <div class="item-actions">
                <button class="delete-button">Delete</button>
            </div>
        `;
        
        // Insert before the Add button
        educationSection.insertBefore(newEducation, this.parentNode.nextSibling);
        addDeleteListeners();
    });
    
    // Add new experience item
    document.getElementById('add-experience').addEventListener('click', function() {
        const experienceSection = document.getElementById('experience-section');
        const newExperience = document.createElement('div');
        newExperience.className = 'experience-item';
        newExperience.innerHTML = `
            <div class="editable-field" contenteditable="true">Position/Role</div>
            <div class="experience-meta">
                <div class="editable-field" contenteditable="true">Company/Organization</div>
                <div class="editable-field" contenteditable="true">Month Year - Month Year</div>
            </div>
            <div class="editable-field" contenteditable="true">Description of your role and responsibilities</div>
            <div class="item-actions">
                <button class="delete-button">Delete</button>
            </div>
        `;
        
        experienceSection.insertBefore(newExperience, this.parentNode.nextSibling);
        addDeleteListeners();
    });
    
    // Add new project item
    document.getElementById('add-project').addEventListener('click', function() {
        const projectsSection = document.getElementById('projects-section');
        const newProject = document.createElement('div');
        newProject.className = 'project-item';
        newProject.innerHTML = `
            <div class="editable-field" contenteditable="true">Project Title</div>
            <div class="project-meta">
                <div class="editable-field" contenteditable="true">Project Type</div>
                <div class="editable-field" contenteditable="true">Month Year - Month Year</div>
            </div>
            <div class="editable-field" contenteditable="true">Description of the project, technologies used, and your role</div>
            <div class="item-actions">
                <button class="delete-button">Delete</button>
            </div>
        `;
        
        projectsSection.insertBefore(newProject, this.parentNode.nextSibling);
        addDeleteListeners();
    });
    
    // Add new skill
    document.getElementById('add-skill').addEventListener('click', function() {
        const skillsList = document.querySelector('.skills-list');
        const newSkill = document.createElement('div');
        newSkill.className = 'skill-tag';
        newSkill.innerHTML = `
            <span class="editable-field" contenteditable="true">New Skill</span>
            <button class="remove-skill">×</button>
        `;
        
        skillsList.appendChild(newSkill);
        addRemoveSkillListeners();
    });
    
    // Add new achievement
    document.getElementById('add-achievement').addEventListener('click', function() {
        const achievementsList = document.querySelector('.achievements-list');
        const newAchievement = document.createElement('li');
        newAchievement.innerHTML = `
            <div class="editable-field" contenteditable="true">New Achievement</div>
            <button class="remove-achievement">×</button>
        `;
        
        achievementsList.appendChild(newAchievement);
        addRemoveAchievementListeners();
    });
    
    // Save resume button
    document.getElementById('save-resume').addEventListener('click', function() {
        saveResume();
    });
    
    // Initialize event listeners for delete buttons
    function addDeleteListeners() {
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                this.closest('.education-item, .experience-item, .project-item').remove();
            });
        });
    }
    
    // Initialize event listeners for remove skill buttons
    function addRemoveSkillListeners() {
        document.querySelectorAll('.remove-skill').forEach(button => {
            button.addEventListener('click', function() {
                this.closest('.skill-tag').remove();
            });
        });
    }
    
    // Initialize event listeners for remove achievement buttons
    function addRemoveAchievementListeners() {
        document.querySelectorAll('.remove-achievement').forEach(button => {
            button.addEventListener('click', function() {
                this.closest('li').remove();
            });
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
                // Save image as base64 string if present
                photo: document.querySelector('#profile-image img') ? 
                       document.querySelector('#profile-image img').src : null
            },
            education: [],
            experience: [],
            projects: [],
            skills: [],
            achievements: []
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
        
        // Convert to JSON and save
        const resumeJSON = JSON.stringify(resumeData);
        
        // In a real application, you would send this to a server
        console.log("Resume saved:", resumeJSON);
        
        // Show success message
        alert("Resume saved successfully!");
        
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
    
    // Initialize all event listeners
    addDeleteListeners();
    addRemoveSkillListeners();
    addRemoveAchievementListeners();
    
    // Try to load any saved data
    loadSavedResume();
});