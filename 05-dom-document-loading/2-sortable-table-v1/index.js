export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement(this.createTableTemplate());
    this.selectSubElements();
  }

  // Templates
  createTableHeaderTemplate() {
    return this.headerConfig.map((column) => `
      <div class="sortable-table__cell" data-id="${column.id}" data-sortable="${column.sortable}">
        <span>${column.title}</span>
      </div>
    `).join('');
  }

  createTableBodyTemplate() {
    return this.data.map(product =>
      `<a href="/products/${product.id}" class="sortable-table__row">${this.createTableRowTemplate(product)}</a>`)
      .join('');
  }

  createTableRowTemplate(product) {
    return this.headerConfig.map(column =>
      `${this.createTableCellTemplate(product, column)}`)
      .join('');
  }

  createTableCellTemplate(product, column) {
    if (column.template) {
      return column.template(product);
    }
    return `<div class="sortable-table__cell">${product[column.id]}</div>`;
  }

  createTableTemplate() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.createTableHeaderTemplate()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.createTableBodyTemplate()}
        </div>

        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>

      </div>
    `;
  }

  // Main
  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  // Utils
  sort(columnName, order) {
    const currentColumn = this.headerConfig.find(column => column.id === columnName);
    const sortable = currentColumn?.sortable;
    const sortType = currentColumn?.sortType;
    if (!sortable) {
      return;
    }

    const sortRatio = order === 'asc' ? 1 : -1;

    if (sortType === 'string') {
      this.data.sort((a, b) => sortRatio * a[columnName].localeCompare(b[columnName], ['ru', 'en'], { caseFirst: 'upper' }));
    }

    if (sortType === 'number') {
      this.data.sort((a, b) => sortRatio * (a[columnName] - b[columnName]));
    }

    this.subElements.body.innerHTML = this.createTableBodyTemplate();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

}

