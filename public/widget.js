(function () {
    // Initialize the Feedback Widget
    window.FeedbackWidget = {
      init: function (config) {
        const { websiteId, position = 'bottom-right', color = '#3498db' } = config;
  
        // Create the feedback button
        const button = document.createElement('button');
        button.textContent = 'Feedback';
        button.style.position = 'fixed';
        button.style[position.split('-')[0]] = '20px';
        button.style[position.split('-')[1]] = '20px';
        button.style.backgroundColor = color;
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.padding = '10px 20px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.onclick = () => openFeedbackForm(websiteId, color);
  
        document.body.appendChild(button);
      },
    };
  
    // Open the feedback form
    function openFeedbackForm(websiteId, color) {
      const form = document.createElement('div');
      form.style.position = 'fixed';
      form.style.top = '50%';
      form.style.left = '50%';
      form.style.transform = 'translate(-50%, -50%)';
      form.style.backgroundColor = '#fff';
      form.style.padding = '20px';
      form.style.borderRadius = '10px';
      form.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
      form.style.zIndex = '1000';
  
      form.innerHTML = `
        <h3 style="margin-bottom: 10px;">Leave Feedback</h3>
        <textarea id="feedback-text" placeholder="Your feedback..." style="width: 100%; height: 100px; margin-bottom: 10px;"></textarea>
        <button id="submit-feedback" style="background-color: ${color}; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Submit</button>
        <button id="close-feedback" style="background-color: #ccc; color: #000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
      `;
  
      document.body.appendChild(form);
  
      // Handle form submission
      document.getElementById('submit-feedback').onclick = () => {
        const feedbackText = document.getElementById('feedback-text').value;
        if (feedbackText.trim()) {
          submitFeedback(websiteId, feedbackText);
          form.remove();
        } else {
          alert('Please enter your feedback.');
        }
      };
  
      // Handle form close
      document.getElementById('close-feedback').onclick = () => {
        form.remove();
      };
    }
  
    // Submit feedback to the backend
    function submitFeedback(websiteId, feedback) {
      fetch('https://get-your-feedback.vercel.app/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteId, feedback }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert('Thank you for your feedback!');
          } else {
            alert('Failed to submit feedback. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        });
    }
  })();