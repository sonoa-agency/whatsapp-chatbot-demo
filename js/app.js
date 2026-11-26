/**
 * واجهة المحادثة — Sonoa Agency
 * ربط محرك البوت (chatbot.js) بواجهة الشات: عرض الرسائل،
 * مؤشر الكتابة، والردود السريعة.
 */
(function () {
  'use strict';

  var chatBody = document.getElementById('chatBody');
  var chatForm = document.getElementById('chatForm');
  var chatInput = document.getElementById('chatInput');
  var quickReplies = document.getElementById('quickReplies');
  var presence = document.getElementById('presence');

  var engine = window.ChatbotEngine;

  /* ---------- أدوات العرض ---------- */

  // الوقت الحالي بصيغة واتساب (10:24 م)
  function now() {
    return new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' });
  }

  // يضيف رسالة للمحادثة وينزل لآخر رسالة
  function addMessage(text, side) {
    var bubble = document.createElement('div');
    bubble.className = 'msg ' + (side === 'out' ? 'msg-out' : 'msg-in');
    bubble.textContent = text;

    var time = document.createElement('span');
    time.className = 'time';
    time.textContent = now();
    bubble.appendChild(time);

    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // يظهر مؤشر "يكتب الآن…" ثم يرد البوت بعد تأخير واقعي
  function botReply(userText) {
    presence.textContent = 'يكتب الآن…';

    var typing = document.createElement('div');
    typing.className = 'msg msg-in typing';
    typing.innerHTML = '<i></i><i></i><i></i>';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;

    // تأخير يتناسب مع طول الرد ليحاكي الكتابة البشرية
    var result = engine.findReply(userText);
    var delay = Math.min(600 + result.reply.length * 12, 2200);

    setTimeout(function () {
      typing.remove();
      presence.textContent = 'متصل الآن';
      addMessage(result.reply, 'in');
    }, delay);
  }

  // إرسال رسالة من المستخدم
  function sendUserMessage(text) {
    var trimmed = text.trim();
    if (!trimmed) return;
    addMessage(trimmed, 'out');
    botReply(trimmed);
  }

  /* ---------- الردود السريعة ---------- */
  engine.quickReplies.forEach(function (label) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.addEventListener('click', function () { sendUserMessage(label); });
    quickReplies.appendChild(btn);
  });

  /* ---------- الإرسال من الصندوق ---------- */
  chatForm.addEventListener('submit', function (event) {
    event.preventDefault();
    sendUserMessage(chatInput.value);
    chatInput.value = '';
    chatInput.focus();
  });

  /* ---------- رسالة الترحيب عند الفتح ---------- */
  addMessage(engine.welcome, 'in');
})();
