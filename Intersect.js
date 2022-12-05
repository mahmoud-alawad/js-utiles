/*
 * @Copyright (c) 2022 
 * @Author Mahmoud Alawad <awad25.ma@gmail.com>
 */

export default function (Alpine) {
    Alpine.directive(
      'intersect',
      (
        el,
        {value, expression, modifiers},
        {evaluateLater, cleanup},
      ) => {
        const evaluate = evaluateLater(expression);
  
        const options = {
          rootMargin: getRootMargin(modifiers),
          threshold: getThreshhold(modifiers),
        };
  
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            // Ignore entry if intersecting in leave mode, or not intersecting in enter mode
            if (entry.isIntersecting === (value === 'leave')) return;
  
            /**expression to be run when target in viewport*/
            evaluate();
  
            /**stops watching all of its target*/
            modifiers.includes('once') && observer.disconnect();
          });
        }, options);
  
        observer.observe(el);
  
        cleanup(() => {
          observer.disconnect();
        });
      },
    );
  }
  
  /**
   * @params half -> full #default 0
   * @param modifiers
   */
  function getThreshhold(modifiers) {
    switch (modifiers.includes) {
      case 'half':
        return 0.5;
      case 'full':
        return 0.99;
    }
    if (!modifiers.includes('threshold')) return 0;
    const threshold = modifiers[modifiers.indexOf('threshold') + 1];
  
    if (threshold === '100') return 1;
    if (threshold === '0') return 0;
  
    return Number(`.${threshold}`);
  }
  
  /**
   * Supported: -10px, -20 (implied px), 30 (implied px), 40px, 50%
   * @param rawValue
   */
  export function getLengthValue(rawValue) {
    const match = rawValue.match(/^(-?[0-9]+)(px|%)?$/);
    return match ? match[1] + (match[2] || 'px') : undefined;
  }
  
  /**
   * @param modifiers
   * @return string
   */
  export function getRootMargin(modifiers) {
    const key = 'margin';
    const fallback = '0px 0px 0px 0px';
    const index = modifiers.indexOf(key);
    // If the modifier isn't present, use the default.
    if (index === -1) return fallback;
  
    // Grab the 4 subsequent length values after it: x-intersect.margin.300px.0.50%.0
    let values = [];
    for (let i = 1; i < 5; i++) {
      values.push(getLengthValue(modifiers[index + i] || ''));
    }
    values = values.filter((v) => v !== undefined);
  
    return values.length ? values.join(' ').trim() : fallback;
  }
  