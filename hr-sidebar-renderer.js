/**
 * 智能人事助手广告位渲染脚本
 * 用于帮我吧平台动态注入HTML内容
 * 版本：v1.0
 */

(function() {
  'use strict';

  // 配置
  const CONFIG = {
    containerId: 'hr-assistant-sidebar',
    welcomeTitle: '👋 您好，我是智能人事助手',
    welcomeSubtitle: '我可以帮您查询考勤、假期、福利等员工手册相关规定，点击下方快捷问题即可开始',
    email: 'hr@gnway.com',
    version: '《金万维员工手册》2026年版'
  };

  // 热门问题列表
  const QUICK_QUESTIONS = [
    '年假有几天？',
    '怎么请假？',
    '迟到扣款？',
    '婚假几天？',
    '试用期多久？',
    '离职流程？',
    '午餐补助？',
    '高压线禁令？'
  ];

  // 分类列表
  const CATEGORIES = [
    { icon: '⏰', name: '考勤打卡', query: '考勤制度' },
    { icon: '🏖️', name: '假期福利', query: '休假制度' },
    { icon: '📝', name: '入离职', query: '员工关系' },
    { icon: '🎯', name: '企业文化', query: '企业文化' }
  ];

  // CSS样式
  const CSS_STYLES = `
    .hr-sidebar-container {
      width: 100%;
      max-width: 320px;
      padding: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      background: #f5f6f7;
      border-radius: 8px;
    }
    .hr-welcome {
      background: linear-gradient(135deg, #FF8C00 0%, #FFB347 100%);
      border-radius: 10px;
      padding: 16px 14px;
      color: #fff;
      margin-bottom: 12px;
    }
    .hr-welcome-title {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .hr-welcome-subtitle {
      font-size: 12px;
      opacity: 0.95;
      line-height: 1.4;
    }
    .hr-section {
      background: #fff;
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .hr-section-title {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .hr-section-title::before {
      content: "";
      width: 3px;
      height: 14px;
      background: #FF8C00;
      border-radius: 2px;
    }
    .hr-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .hr-tag {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      background: #FFF5E6;
      border: 1px solid #FFE4CC;
      border-radius: 16px;
      font-size: 12px;
      color: #E67300;
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
    }
    .hr-tag:hover {
      background: #FF8C00;
      color: #fff;
      border-color: #FF8C00;
    }
    .hr-category-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .hr-category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 6px;
      background: #f8f9fa;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .hr-category-item:hover {
      background: #FFF5E6;
    }
    .hr-category-icon {
      font-size: 20px;
      margin-bottom: 4px;
    }
    .hr-category-name {
      font-size: 12px;
      color: #333;
    }
    .hr-contact-item {
      display: flex;
      align-items: center;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 6px;
      margin-bottom: 6px;
    }
    .hr-contact-item:last-child {
      margin-bottom: 0;
    }
    .hr-contact-icon {
      font-size: 16px;
      margin-right: 10px;
    }
    .hr-contact-label {
      font-size: 11px;
      color: #999;
    }
    .hr-contact-value {
      font-size: 12px;
      color: #333;
      font-weight: 500;
    }
    .hr-footer {
      text-align: center;
      padding: 10px;
      font-size: 11px;
      color: #999;
    }
  `;

  // 发送消息函数 - 增强版
  function sendToChat(text) {
    console.log('[HR助手] 准备发送消息:', text);
    
    // 尝试window.parent
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage({ type: 'HRSidebarSendMessage', content: text }, '*');
        console.log('[HR助手] 已通过postMessage发送');
      } catch(e) {
        console.log('[HR助手] postMessage失败:', e);
      }
    }
    
    // 帮我吧聊天输入框的选择器
    const selectors = [
      'textarea[placeholder*="输入"]',
      'textarea[placeholder*="问题"]',
      '.chat-input textarea',
      '#messageInput',
      '.message-input',
      'textarea.chat-textarea',
      'div[contenteditable="true"]',
      '.input-box textarea',
      '.chat-footer textarea'
    ];
    
    // 尝试从window.parent.document查找输入框
    let input = null;
    if (window.parent && window.parent.document) {
      for (const selector of selectors) {
        try {
          input = window.parent.document.querySelector(selector);
          if (input) {
            console.log('[HR助手] 找到输入框:', selector);
            break;
          }
        } catch(e) {
          console.log('[HR助手] 选择器查询失败:', selector);
        }
      }
    }
    
    // 如果从父窗口找不到，在当前窗口找
    if (!input) {
      for (const selector of selectors) {
        input = document.querySelector(selector);
        if (input) {
          console.log('[HR助手] 从当前窗口找到输入框:', selector);
          break;
        }
      }
    }
    
    if (input) {
      // 设置值
      if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
        input.value = text;
      } else if (input.contentEditable === 'true') {
        input.innerText = text;
      }
      
      // 触发输入事件
      input.focus();
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
      
      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(changeEvent);
      
      // 延迟点击发送按钮
      setTimeout(() => {
        const sendBtnSelectors = [
          '.send-btn',
          '.btn-send',
          'button[type="submit"]',
          '.chat-send',
          '.message-send',
          'button.send'
        ];
        
        let sendBtn = null;
        if (window.parent && window.parent.document) {
          for (const selector of sendBtnSelectors) {
            sendBtn = window.parent.document.querySelector(selector);
            if (sendBtn && !sendBtn.disabled) break;
          }
        }
        
        if (sendBtn) {
          sendBtn.click();
          console.log('[HR助手] 已点击发送按钮');
        } else {
          // 回车发送
          const enterEvent = new KeyboardEvent('keydown', {
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
      }, 100);
      
      return true;
    } else {
      console.log('[HR助手] 未找到输入框');
    }
    
    return false;
  }

  // 注入样式
  function injectStyles() {
    if (document.getElementById('hr-sidebar-styles')) return;

    const style = document.createElement('style');
    style.id = 'hr-sidebar-styles';
    style.textContent = CSS_STYLES;
    document.head.appendChild(style);
  }

  // 生成HTML
  function generateHTML() {
    const tagsHTML = QUICK_QUESTIONS.map(q =>
      `<span class="hr-tag" onclick="sendToChat('${q}')">${q.replace(/\?$/, '')}</span>`
    ).join('');

    const categoriesHTML = CATEGORIES.map(c =>
      `<div class="hr-category-item" onclick="sendToChat('${c.query}')">
        <span class="hr-category-icon">${c.icon}</span>
        <span class="hr-category-name">${c.name}</span>
      </div>`
    ).join('');

    return `
      <div class="hr-sidebar-container">
        <div class="hr-welcome">
          <div class="hr-welcome-title">${CONFIG.welcomeTitle}</div>
          <div class="hr-welcome-subtitle">${CONFIG.welcomeSubtitle}</div>
        </div>

        <div class="hr-section">
          <div class="hr-section-title">热门问题</div>
          <div class="hr-tags">${tagsHTML}</div>
        </div>

        <div class="hr-section">
          <div class="hr-section-title">按分类查询</div>
          <div class="hr-category-grid">${categoriesHTML}</div>
        </div>

        <div class="hr-section">
          <div class="hr-section-title">联系人力运营部</div>
          <div class="hr-contact-item">
            <span class="hr-contact-icon">📧</span>
            <div>
              <div class="hr-contact-label">邮箱</div>
              <div class="hr-contact-value">${CONFIG.email}</div>
            </div>
          </div>
        </div>

        <div class="hr-footer">
          回复内容基于${CONFIG.version}
        </div>
      </div>
    `;
  }

  // 初始化
  function init() {
    injectStyles();

    // 查找目标容器
    const container = document.getElementById(CONFIG.containerId);

    if (container) {
      container.innerHTML = generateHTML();

      // 将sendToChat暴露到全局
      window.sendToChat = sendToChat;

      console.log('✅ 智能人事助手广告位渲染完成');
    }
  }

  // DOM加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 监听iframe消息
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'HRSidebarInit') {
      init();
    }
  });
})();
