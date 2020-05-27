export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storageKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storageKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    this.setItems({[key]: value});
  }

  setItems(items) {
    const store = this.getItems();

    this._storage.setItem(
        this._storageKey,
        JSON.stringify(
            Object.assign({}, store, items)
        )
    );
  }

  setAllItems(items) {
    this._storage.setItem(
        this._storageKey,
        JSON.stringify(items)
    );
  }
}
