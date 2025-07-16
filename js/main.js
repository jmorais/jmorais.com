class Modal {
  constructor(overlay) {
    this.overlay = overlay
    this.modal   = overlay.querySelector('.modal')
    this.closeButtons = overlay.querySelectorAll('[data-modal-close]')
    this._init()
  }

  _init() {
    this.open  = this.open.bind(this)
    this.close = this.close.bind(this)
    this._onOverlayClick = this._onOverlayClick.bind(this)
    this._onEscape       = this._onEscape.bind(this)

    this.closeButtons.forEach(btn =>
      btn.addEventListener('click', () => this.close())
    )
    this.overlay.addEventListener('click', this._onOverlayClick)
    document.addEventListener('keydown', this._onEscape)
  }

  open() {
    this.overlay.style.display = 'flex'
    // ensure no leftover exit class
    this.modal.classList.remove('animate-exit')
    // trigger enter animation
    this.modal.classList.add('animate-enter')
  }

  close() {
    // remove any enter class
    this.modal.classList.remove('animate-enter')
    // trigger exit animation
    this.modal.classList.add('animate-exit')
    // after exit animation ends, hide overlay
    const onAnimEnd = () => {
      this.modal.removeEventListener('animationend', onAnimEnd)
      this.overlay.style.display = 'none'
      this.modal.classList.remove('animate-exit')
    }
    this.modal.addEventListener('animationend', onAnimEnd)
  }

  _onOverlayClick(e) {
    if (e.target === this.overlay) this.close()
  }

  _onEscape(e) {
    if (e.key === 'Escape' && this.overlay.style.display === 'flex') {
      this.close()
    }
  }
}

// initialize all modals
document.querySelectorAll('.modal-overlay').forEach(overlayEl => {
  const modal = new Modal(overlayEl)
  document.querySelectorAll(`[data-modal-target="#${overlayEl.id}"]`)
    .forEach(btn => btn.addEventListener('click', modal.open))
})

class ClipboardButton {
  constructor(button) {
    this.button = button
    this.targetSelector = button.dataset.target
    this.button.addEventListener('click', () => this.copy())
  }

  async copy() {
    const targetEl = document.querySelector(this.targetSelector)
    if (!targetEl) {
      console.warn('No element found for', this.targetSelector)
      return
    }
    // support both <input>/<textarea> and other elements
    const text = targetEl.value ?? targetEl.textContent
    try {
      await navigator.clipboard.writeText(text)
      // console.log('Copied to clipboard:', text)
      // hide svg copy icon for 2 seconds and show checkmark
      const originalContent = this.button.innerHTML
      this.button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"></path></svg>'
      setTimeout(() => {
        this.button.innerHTML = originalContent
      }, 1500)

    } catch (err) {
      console.error('Copy failed:', err)
    }
  }
}

// Initialize on all buttons with data-target
document.querySelectorAll('button[data-target]').forEach(btn => {
  new ClipboardButton(btn)
})