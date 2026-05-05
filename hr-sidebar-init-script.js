/**
 * HR助手 - 帮我吧页面初始化脚本
 *
 * 使用方法：
 * 1. 打开帮我吧页面
 * 2. 按 F12 打开开发者工具
 * 3. 切换到 Console（控制台）标签
 * 4. 复制以下代码并粘贴到控制台，回车执行
 *
 * 注意：每次刷新页面后需要重新执行此脚本
 */
(function() {
  console.log('[HR助手] 正在初始化通信机制...');

  // 监听来自HR助手iframe的消息
  window.addEventListener('message', function(e) {
    // 验证消息来源（可选）
    // if (e.origin !== '预期的域名') return;

    var data = e.data;
    if (!data) return;

    // 处理HR助手发送的消息
    if (data.type === 'sendChatMessage' || data.type === 'HRSidebarSendMessage' ||
        data.action === 'send' || data.from === 'hr-sidebar') {

      var text = data.content || data.message || data.text;
      if (!text) return;

      console.log('[HR助手] 收到发送请求:', text);

      // 方式1: 查找常见的聊天输入框
      var selectors = [
        'textarea[placeholder*="输入"]',
        'textarea[placeholder*="问题"]',
        'textarea[placeholder*="消息"]',
        'textarea.chat-input',
        'textarea.message-input',
        'textarea.input',
        '.chat-input textarea',
        '.message-input textarea',
        '#messageInput',
        '#chatInput',
        '#msgInput',
        '.chat-input',
        '.message-input',
        'input[type="text"].chat-input',
        'div[contenteditable="true"]'
      ];

      var input = null;
      for (var i = 0; i < selectors.length; i++) {
        input = document.querySelector(selectors[i]);
        if (input && (input.offsetWidth > 0 || input.tagName !== 'DIV')) {
          console.log('[HR助手] 找到输入框:', selectors[i]);
          break;
        }
      }

      // 方式2: 尝试通过React/Vue等框架的方式查找
      if (!input) {
        // 查找可能包含聊天组件的区域
        var chatAreas = document.querySelectorAll('.chat-container, .chat-window, .conversation, .chat-box, .message-list');
        for (var j = 0; j < chatAreas.length; j++) {
          var textarea = chatAreas[j].querySelector('textarea, input[type="text"], [contenteditable="true"]');
          if (textarea) {
            input = textarea;
            console.log('[HR助手] 从聊天区域找到输入框');
            break;
          }
        }
      }

      if (input) {
        // 填充内容
        if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
          // 模拟用户输入
          var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,
            'value'
          ).set;
          nativeInputValueSetter.call(input, text);

          input.value = text;
        } else if (input.contentEditable === 'true') {
          input.innerText = text;
        }

        // 触发必要的事件
        input.focus();

        var events = ['input', 'change', 'keyup'];
        events.forEach(function(eventType) {
          var event = new Event(eventType, { bubbles: true, cancelable: true });
          input.dispatchEvent(event);
        });

        // 尝试点击发送按钮
        setTimeout(function() {
          var btnSelectors = [
            'button.send',
            '.send-btn',
            '.btn-send',
            '.chat-send',
            '.message-send',
            'button[type="submit"]',
            '.submit-btn',
            '.send',
            '.chat-send-btn',
            '.msg-send',
            '.input-send',
            'a[role="button"].send',
            'button:contains("发送")'
          ];

          var btn = null;
          for (var k = 0; k < btnSelectors.length; k++) {
            try {
              btn = document.querySelector(btnSelectors[k]);
              if (btn && !btn.disabled) break;
            } catch(e) {}
          }

          if (btn) {
            btn.click();
            console.log('[HR助手] 已点击发送按钮');
          } else {
            // 回车发送
            var enterEvent = new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
              bubbles: true,
              cancelable: true
            });
            input.dispatchEvent(enterEvent);
            console.log('[HR助手] 已触发回车发送');
          }
        }, 150);

        console.log('[HR助手] ✅ 消息已发送:', text);
      } else {
        console.log('[HR助手] ❌ 未找到聊天输入框，请手动复制:', text);
        // 复制到剪贴板
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
          console.log('[HR助手] 已复制到剪贴板');
        }
      }
    }
  });

  // 监听HR侧边栏初始化请求
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'HRSidebarInit') {
      console.log('[HR助手] 收到初始化请求');
      e.source.postMessage({ type: 'HRSidebarReady', status: 'ok' }, e.origin);
    }
  });

  console.log('[HR助手] ✅ 通信初始化完成');
  console.log('[HR助手] 现在可以点击HR助手侧边栏的问题，它们会被发送到聊天框');
})();
