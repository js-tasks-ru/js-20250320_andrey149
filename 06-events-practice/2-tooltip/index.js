class Tooltip {
  element;
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
    this.initialize();
  }


  // Templates
  createTooltipTemplate(text) {
    return `<div class="tooltip">${text}</div>`;
  }

  // Main
  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  initialize () {
    this.createListeners();
  }

  render(text = '') {
    this.element = this.createElement(this.createTooltipTemplate(text));
    document.body.append(this.element);
  }

  // Listeners
  handleTooltipShow = (event) => {
    const { tooltip } = event.target.dataset;

    if (tooltip) {
      this.render(tooltip);
      event.target.addEventListener('mousemove', this.handleTooltipMoveMouse);
    }

  }

  handleTooltipHide = (event) => {
    const { tooltip } = event.target.dataset;

    if (tooltip) {
      this.remove();
      event.target.removeEventListener('mousemove', this.handleTooltipMoveMouse);
    }
  }

  handleTooltipMoveMouse = (event) => {
    const x = event.offsetX + 20;
    const y = event.offsetY + 20;
    this.element.style.top = y + 'px';
    this.element.style.left = x + 'px';
  }

  createListeners() {
    document.addEventListener('pointerover', this.handleTooltipShow);
    document.addEventListener('pointerout', this.handleTooltipHide);

  }

  removeListeners() {
    document.removeEventListener('pointerover', this.handleTooltipShow);
    document.removeEventListener('pointerout', this.handleTooltipHide);
  }

  // Utils
  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.removeListeners();
  }
}

export default Tooltip;
