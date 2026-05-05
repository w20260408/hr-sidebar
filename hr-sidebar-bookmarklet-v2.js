javascript:(function(){
  var config={containerId:'hr-assistant-sidebar',email:'hr@gnway.com',version:'金万维员工手册2026年版'};
  var questions=['年假有几天？','怎么请假？','迟到怎么扣钱？','婚假几天？','试用期多久？','离职流程是什么？','午餐补助多少？','公司高压线有哪些？'];
  var categories=[{icon:'⏰',name:'考勤打卡',query:'考勤制度'},{icon:'🏖️',name:'假期福利',query:'休假制度'},{icon:'📝',name:'入离职',query:'员工关系'},{icon:'🎯',name:'企业文化',query:'企业文化'}];
  var css='.hr-sidebar-container{width:100%;max-width:320px;padding:12px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#f5f6f7;border-radius:8px}.hr-welcome{background:linear-gradient(135deg,#FF8C00 0%,#FFB347 100%);border-radius:10px;padding:16px 14px;color:#fff;margin-bottom:12px}.hr-welcome-title{font-size:15px;font-weight:600;margin-bottom:4px}.hr-welcome-subtitle{font-size:12px;opacity:0.95;line-height:1.4}.hr-section{background:#fff;border-radius:10px;padding:14px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04)}.hr-section-title{font-size:13px;font-weight:600;color:#333;margin-bottom:10px;display:flex;align-items:center;gap:6px}.hr-section-title::before{content:"";width:3px;height:14px;background:#FF8C00;border-radius:2px}.hr-tags{display:flex;flex-wrap:wrap;gap:6px}.hr-tag{display:inline-flex;align-items:center;padding:6px 12px;background:#FFF5E6;border:1px solid #FFE4CC;border-radius:16px;font-size:12px;color:#E67300;cursor:pointer;transition:all 0.2s}.hr-tag:hover{background:#FF8C00;color:#fff;border-color:#FF8C00}.hr-category-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.hr-category-item{display:flex;flex-direction:column;align-items:center;padding:12px 6px;background:#f8f9fa;border-radius:8px;cursor:pointer;transition:all 0.2s}.hr-category-item:hover{background:#FFF5E6}.hr-category-icon{font-size:20px;margin-bottom:4px}.hr-category-name{font-size:12px;color:#333}.hr-contact-item{display:flex;align-items:center;padding:10px;background:#f8f9fa;border-radius:6px;margin-bottom:6px}.hr-contact-icon{font-size:16px;margin-right:10px}.hr-contact-label{font-size:11px;color:#999}.hr-contact-value{font-size:12px;color:#333;font-weight:500}.hr-footer{text-align:center;padding:10px;font-size:11px;color:#999}';

  function sendToChat(text){
    console.log('[HR助手] 准备发送:',text);
    var selectors=['textarea','input[type="text"]','[contenteditable="true"]','.chat-input textarea','.message-input textarea','.chat-textarea','textarea.chat-input','textarea.input','textarea[placeholder*="输入"]','textarea[placeholder*="问题"]','#messageInput','#chatInput','.chat-input','.chat-input-box'];
    var input=null;
    for(var i=0;i<selectors.length;i++){try{var el=document.querySelector(selectors[i]);if(el){input=el;console.log('[HR助手] 找到输入框:',selectors[i]);break}}catch(e){}}
    if(input){
      if(input.tagName==='TEXTAREA'||input.tagName==='INPUT'){input.value=text}else if(input.contentEditable==='true'){input.innerText=text}
      input.focus();
      input.dispatchEvent(new Event('input',{bubbles:true}));
      input.dispatchEvent(new Event('change',{bubbles:true}));
      setTimeout(function(){
        var btns=['button.send','.send-btn','.btn-send','.chat-send','.message-send','button[type="submit"]','.submit-btn','.send','.chat-send-btn','.msg-send','.input-send','a.send','.bws-send'];
        var btn=null;
        for(var j=0;j<btns.length;j++){try{var b=document.querySelector(btns[j]);if(b&&!b.disabled){btn=b;break}}catch(e){}}
        if(btn){btn.click();console.log('[HR助手] 点击发送按钮')}else{input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true}));console.log('[HR助手] 回车发送')}
      },100);
      return true;
    }else{
      // 尝试模拟选择器面板触发
      var legacyInput=document.querySelector('#'+config.containerId+' input');
      if(legacyInput){legacyInput.value=text;legacyInput.dispatchEvent(new Event('input',{bubbles:true}));console.log('[HR助手] 填充legacy input');return true}
      console.log('[HR助手] 未找到输入框，请确保在聊天页面运行');
    }
    return false;
  }

  function init(){
    var style=document.createElement('style');
    style.textContent=css;
    document.head.appendChild(style);
    var container=document.getElementById(config.containerId);
    if(container){
      var tagsHTML=questions.map(function(q){return'<span class="hr-tag" onclick="sendToChat(\''+q.replace(/'/g,"\\'")+'\')">'+q.replace(/\?$/,'')+'</span>'}).join('');
      var catsHTML=categories.map(function(c){return'<div class="hr-category-item" onclick="sendToChat(\''+c.query+'\')"><span class="hr-category-icon">'+c.icon+'</span><span class="hr-category-name">'+c.name+'</span></div>'}).join('');
      container.innerHTML='<div class="hr-sidebar-container"><div class="hr-welcome"><div class="hr-welcome-title">👋 您好，我是智能人事助手</div><div class="hr-welcome-subtitle">我可以帮您查询考勤、假期、福利等员工手册相关规定，点击下方快捷问题即可开始</div></div><div class="hr-section"><div class="hr-section-title">热门问题</div><div class="hr-tags">'+tagsHTML+'</div></div><div class="hr-section"><div class="hr-section-title">按分类查询</div><div class="hr-category-grid">'+catsHTML+'</div></div><div class="hr-section"><div class="hr-section-title">联系人力运营部</div><div class="hr-contact-item"><span class="hr-contact-icon">📧</span><div><div class="hr-contact-label">邮箱</div><div class="hr-contact-value">'+config.email+'</div></div></div></div><div class="hr-footer">回复内容基于'+config.version+'</div></div>';
      window.sendToChat=sendToChat;
      console.log('✅ 智能人事助手已加载');
    }else{
      alert('未找到容器 #'+config.containerId+'\n请先在帮我吧编辑器中添加一个段落/文本模块，ID设置为: '+config.containerId);
    }
  }

  window.sendToChat=sendToChat;
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}else{init()}
})();
