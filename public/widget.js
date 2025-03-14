(function () {
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
          button.style.borderRadius = '25px';
          button.style.padding = '12px 24px';
          button.style.cursor = 'pointer';
          button.style.zIndex = '1000';
          button.style.fontSize = '16px';
          button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          button.style.transition = 'all 0.3s ease-in-out';

          // Hover effect
          button.onmouseover = () => button.style.opacity = '0.8';
          button.onmouseleave = () => button.style.opacity = '1';

          button.onclick = () => openFeedbackForm(websiteId, color);
          document.body.appendChild(button);
      },
  };

  function openFeedbackForm(websiteId, color) {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.background = 'rgba(0, 0, 0, 0.5)';
      overlay.style.zIndex = '999';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';

      const form = document.createElement('div');
      form.style.backgroundColor = '#fff';
      form.style.padding = '20px';
      form.style.borderRadius = '12px';
      form.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
      form.style.width = '90%';
      form.style.maxWidth = '400px';
      form.style.animation = 'fadeIn 0.3s ease-in-out';

      form.innerHTML = `
          <h3 style="margin-bottom: 10px; font-size: 18px; text-align: center;">Your Feedback Matters</h3>
          <textarea id="feedback-text" placeholder="Your feedback..." style="width: 100%; height: 100px; margin-bottom: 10px; padding: 8px; border-radius: 5px; border: 1px solid #ccc;"></textarea>
          <button id="submit-feedback" style="background-color: ${color}; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Submit</button>
          <button id="close-feedback" style="background-color: #ccc; color: #000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Close</button>
      `;

      overlay.appendChild(form);
      document.body.appendChild(overlay);

      document.getElementById('submit-feedback').onclick = () => {
          const feedbackText = document.getElementById('feedback-text').value;
          if (feedbackText.trim()) {
              submitFeedback(websiteId, feedbackText);
              overlay.remove();
          } else {
              alert('Please enter your feedback.');
          }
      };

      document.getElementById('close-feedback').onclick = () => {
          overlay.remove();
      };
  }

  function submitFeedback(websiteId, feedback) {
      fetch('https://get-your-feedback.vercel.app/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ websiteId, feedback }),
      })
      .then((response) => response.json())
      .then((data) => {
          alert(data.success ? 'Thank you for your feedback!' : 'Failed to submit feedback. Please try again.');
      })
      .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
      });
  }
})();
