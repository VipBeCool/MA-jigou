/**
 * 全局统一 Toast 提示组件
 */
function showToast(msg, type = '') {
  const oldToast = document.querySelector('.toast-wrap');
  if (oldToast) oldToast.remove();

  const w = document.createElement('div');
  w.className = 'toast-wrap';
  w.innerHTML = '<div class="toast ' + type + '">' + msg + '</div>';
  document.body.appendChild(w);
  
  setTimeout(() => {
    if (document.body.contains(w)) {
      w.remove();
    }
  }, 3000);
}

window.showToast = showToast;
