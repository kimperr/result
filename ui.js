export function syncFineTunePair(numberInput, rangeInput) {
  if (!numberInput || !rangeInput) return;
  const syncFromNumber = () => {
    rangeInput.value = numberInput.value || rangeInput.min || '0';
  };
  const syncFromRange = () => {
    numberInput.value = rangeInput.value;
  };
  const clearTextFocus = () => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) return;
    if (active === rangeInput || active === numberInput) return;
    if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
      active.blur();
    }
  };
  rangeInput.addEventListener('pointerdown', clearTextFocus);
  rangeInput.addEventListener('touchstart', clearTextFocus, { passive: true });
  numberInput.addEventListener('input', syncFromNumber);
  rangeInput.addEventListener('input', syncFromRange);
  syncFromNumber();
}

export function bindNudgeButtons(syncNumberRangeValues) {
  document.querySelectorAll('.nudge-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const step = Number(button.getAttribute('data-step')) || 0;
      if (!targetId || !step) return;
      const input = document.getElementById(targetId);
      const range = document.getElementById(targetId.replace('Input', 'Range'));
      if (!(input instanceof HTMLInputElement)) return;
      let nextValue = (Number(input.value) || 0) + step;
      if (range instanceof HTMLInputElement) {
        const min = Number(range.min);
        const max = Number(range.max);
        if (Number.isFinite(min)) nextValue = Math.max(min, nextValue);
        if (Number.isFinite(max)) nextValue = Math.min(max, nextValue);
        syncNumberRangeValues(input, range, nextValue);
      } else {
        input.value = String(nextValue);
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
      input.select?.();
    });
  });
}

export function updateDownloadButtonLabel(el, activeTab) {
  el.downloadBtn.textContent = activeTab === 'video' ? '영상 저장' : 'PNG 저장';
}

export function downloadFollowImage() {
  const link = document.createElement('a');
  link.href = 'assets/follow.png';
  link.download = 'follow.png';
  link.click();
}

export function showCopyToast(el, copyToastState, message) {
  if (!el.copyToast) return;
  el.copyToast.textContent = message;
  el.copyToast.classList.add('is-visible');
  window.clearTimeout(copyToastState.timer);
  copyToastState.timer = window.setTimeout(() => {
    el.copyToast?.classList.remove('is-visible');
  }, 1800);
}

export async function copyGeneratedCaption(el, getGeneratedCaptionText, showToast) {
  const text = getGeneratedCaptionText();
  if (!text) {
    showToast('복사할 문구가 없습니다.');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast('문구가 복사되었습니다.');
  } catch {
    if (el.captionOutput) {
      el.captionOutput.focus();
      el.captionOutput.select();
      const copied = document.execCommand('copy');
      showToast(copied ? '문구가 복사되었습니다.' : '문구 복사에 실패했습니다.');
    }
  }
}
