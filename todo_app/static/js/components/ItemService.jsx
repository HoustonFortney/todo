class ItemService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  retrieveItems() {
    return fetch(this.apiUrl)
      .then((response) => {
        if (!response.ok) {
          this.handleResponseError(response);
        }
        return response.json();
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  getItem(id) {
    return fetch(this.apiUrl + id)
      .then((response) => {
        if (!response.ok) {
          this.handleResponseError(response);
        }
        return response.json();
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  createItem(newitem, params = {}) {
    return fetch(`${this.apiUrl}?${new URLSearchParams(params)}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newitem),
    })
      .then((response) => {
        if (!response.ok) {
          this.handleResponseError(response);
        }
        return response.json();
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  deleteItem(id) {
    return fetch(this.apiUrl + id, {
      method: 'DELETE',
      mode: 'cors',
    })
      .then((response) => {
        if (!response.ok) {
          this.handleResponseError(response);
        }
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  updateItem(item, params = {}) {
    return fetch(`${this.apiUrl + item.id}?${new URLSearchParams(params)}`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
      .then((response) => {
        if (!response.ok) {
          this.handleResponseError(response);
        }
        return response.json();
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  static handleResponseError(response) {
    throw new Error(`HTTP error, status = ${response.status}`);
  }

  static handleError(error) {
    throw new Error(error.message);
  }
}

export default ItemService;
