(function () {
  const displayEl = document.getElementById('display');
  let expression = '';

  function updateDisplay(text) {
    displayEl.textContent = text || '0';
  }

  function sanitizeForEval(expr) {
    return expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  }

  function appendValue(v) {
    if (v === '.') {
      const parts = expression.split(/[+\-*/%]/);
      if (parts[parts.length - 1].includes('.')) return;
    }
    expression += v;
    updateDisplay(expression);
  }

  function clearAll() {
    expression = '';
    updateDisplay('0');
  }

  function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay(expression || '0');
  }

  function compute() {
    if (!expression) return;
    try {
      const exprWithPercent = expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
      const sanitized = sanitizeForEval(exprWithPercent);
      const result = Function('return (' + sanitized + ')')();
      expression = String(result);
      updateDisplay(expression);
    } catch (e) {
      updateDisplay('Error');
      expression = '';
    }
  }

  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-value');
      const fn = btn.getAttribute('data-fn');
      if (fn) {
        if (fn === 'clear') clearAll();
        else if (fn === 'back') backspace();
        else if (fn === 'equals') compute();
        return;
      }
      if (v) appendValue(v);
    });
  });

  window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') appendValue(e.key);
    else if (['+', '-', '*', '/', '%'].includes(e.key)) appendValue(e.key);
    else if (e.key === 'Enter') { e.preventDefault(); compute(); }
    else if (e.key === 'Backspace') backspace();
    else if (e.key === 'Escape') clearAll();
  });
})();
