class ItemService {
    constructor(api_url) {
        this.api_url = api_url;
    }

    retrieveItems() {
        return fetch(this.api_url)
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    getItem(id) {
        return fetch(this.api_url + id)
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    createItem(newitem) {
        return fetch(this.api_url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newitem)
        })
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    deleteItem(id) {
        return fetch(this.api_url + id, {
            method: "DELETE",
            mode: "cors"
        })
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response);
                }
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    updateItem(item, params={}) {
        return fetch(this.api_url + item.id + '?' + new URLSearchParams(params), {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        })
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    handleResponseError(response) {
        throw new Error("HTTP error, status = " + response.status);
    }

    handleError(error) {
        console.log(error.message);
    }
}

export default ItemService;
