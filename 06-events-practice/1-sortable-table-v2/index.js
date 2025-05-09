import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTableV1 {

  arrowElement;
  isSortLocally = true;

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);

    this.createListeners();
    this.createArrowElement();

    this.sortOnClient(sorted?.id, sorted?.order);
  }

  // Main
  createArrowElement() {
    this.arrowElement = this.createElement(this.createArrowTemplate());
  }

  // Templates
  createArrowTemplate() {
    return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
        </span>
    `;
  }

  addArrowElementForColumn(columnName, order) {
    const headerColumnNameElement = this.subElements.header.querySelector(`[data-id="${columnName}"]`);
    headerColumnNameElement.append(this.arrowElement);
    headerColumnNameElement.dataset.order = order;
  }

  // Listeners
  handleHeaderColumnClick = (event) => {
    const headerColumn = event.target.closest('[data-sortable="true"]');

    if (!headerColumn) {
      return;
    }

    const {id, order} = headerColumn.dataset;

    const columnName = id;
    const columnOrder = order === 'desc' ? 'asc' : 'desc';

    this.sortOnClient(columnName, columnOrder);
  }

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderColumnClick);
  }

  removeListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderColumnClick);
  }

  // Utils
  sortOnClient(columnName, order) {
    super.sort(columnName, order);
    this.addArrowElementForColumn(columnName, order);
  }

  sort(columnName, order) {
    if (this.isSortLocally) {
      this.sortOnClient(columnName, order);
    } else {
      // this.sortOnServer();
    }
  }

  destroy() {
    super.destroy();
    this.removeListeners();
  }

}
