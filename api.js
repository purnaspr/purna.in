// Add this file to your EXISTING portfolio folder (alongside index.html)
// and add <script src="api.js"></script> before </body> in index.html.
//
// It expects two elements in your HTML:
//   <span id="visit-count"></span>
//   <div id="guestbook"></div>  <!-- for message list -->
//   <form id="guestbook-form">
//     <input id="gb-name" placeholder="Name" required />
//     <input id="gb-message" placeholder="Message" required />
//     <button type="submit">Sign guestbook</button>
//   </form>
//
// In real Kubernetes, the frontend calls the backend via a relative
// "/api" path — the Ingress routes /api/* to the backend Service.
// This avoids hardcoding IPs and avoids CORS issues in production.

const API_BASE = '/api';

async function loadVisitCount() {
  try {
    const res = await fetch(`${API_BASE}/visits`);
    const data = await res.json();
    const el = document.getElementById('visit-count');
    if (el) el.textContent = data.visits;
  } catch (err) {
    console.error('Failed to load visit count:', err);
  }
}

async function loadMessages() {
  try {
    const res = await fetch(`${API_BASE}/messages`);
    const messages = await res.json();
    const container = document.getElementById('guestbook');
    if (!container) return;
    container.innerHTML = messages
      .map((m) => `<p><strong>${m.name}</strong>: ${m.message}</p>`)
      .join('');
  } catch (err) {
    console.error('Failed to load messages:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadVisitCount();
  loadMessages();

  const form = document.getElementById('guestbook-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('gb-name').value;
      const message = document.getElementById('gb-message').value;
      await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      form.reset();
      loadMessages();
    });
  }
});
