import React from "react";
import ReactDOM from "react-dom";

import ItemService from "./ItemService.jsx"

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.itemService = new ItemService("api/v1/tasks/");
        this.onSelect = this.onSelect.bind(this);
        this.onEditItem = this.onEditItem.bind(this);
        this.onCancelEdit = this.onCancelEdit.bind(this);
        this.onCreateItem = this.onCreateItem.bind(this);
        this.onUpdateItem = this.onUpdateItem.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
        this.state = {
            showDetails: false,
            editItem: false,
            selectedItem: null
        }
    }

    componentDidMount() {
        this.getItems();
    }

    render() {
        const items = this.state.items;
        if (!items) return null;
        const showDetails = this.state.showDetails;
        const selectedItem = this.state.selectedItem;
        const editItem = this.state.editItem;
        const listItems = items.map((item) =>
            <li key={item.id} onClick={() => this.onSelect(item.id)}>
                <span className="item-name">{item.name}</span>&nbsp;|&nbsp; Created: {item.created}
            </li>
        );

        return (
            <div className="Home">
                <ul className="items">
                    {listItems}
                    <NewItem onSubmit={this.onCreateItem}/>
                </ul>
                <br/>

                {showDetails && selectedItem &&
                <ItemDetails item={selectedItem} onEdit={this.onEditItem} onDelete={this.onDeleteItem}/>}
                {editItem && selectedItem &&
                <EditItem onSubmit={this.onUpdateItem} onCancel={this.onCancelEdit} item={selectedItem}/>}
            </div>
        );
    }

    getItems() {
        this.itemService.retrieveItems().then(items => {
                this.setState({items: items});
            }
        );
    }

    onSelect(id) {
        this.clearState();
        this.itemService.getItem(id).then(item => {
                this.setState({
                    showDetails: true,
                    selectedItem: item
                });
            }
        );
    }

    onEditItem() {
        this.setState({
            showDetails: false,
            editItem: true
        });
    }

    onCancelEdit() {
        this.setState({
            showDetails: true,
            editItem: false
        });
    }

    onUpdateItem(item) {
        this.clearState();
        this.itemService.updateItem(item).then(item => {
                this.getItems();
            }
        );
    }

    onCreateItem(newItem) {
        this.clearState();
        this.itemService.createItem(newItem).then(item => {
                this.getItems();
            }
        );
    }

    onDeleteItem(id) {
        this.clearState();
        this.itemService.deleteItem(id).then(res => {
                this.getItems();
            }
        );
    }

    clearState() {
        this.setState({
            showDetails: false,
            selectedItem: null,
            editItem: false
        });
    }
}

class NewItem extends React.Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.state = {
            name: ""
        };
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleKeyDown(event) {
        if (event.key === "Enter") {
            this.onSubmit();
        }
    }

    onSubmit() {
        this.props.onSubmit(this.state);
        this.setState({name: ""})
    }

    render() {
        return (
            <li>
                <label className="field-name">Name:
                    <input value={this.state.name} name="name" maxLength="40" required onKeyDown={this.handleKeyDown}
                           onChange={this.handleInputChange} placeholder="item name"/>
                </label>
                <button onClick={() => this.onSubmit()}>Create</button>
            </li>
        );
    }
}

class ItemDetails extends React.Component {

    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    render() {
        const item = this.props.item;
        return (
            <div className="input-panel">
                <span className="form-caption">{ item.name}</span>
                <div><span className="field-name">Name:</span><br/> {item.name}</div>
                <br/>
                <button onClick={() => this.onDelete()}>Delete</button>
                &nbsp;
                <button onClick={() => this.onEdit()}>Edit</button>
            </div>
        );
    }

    onEdit() {
        this.props.onEdit();
    }

    onDelete() {
        const item = this.props.item;
        if (window.confirm("Are you sure to delete item: " + item.name + " ?")) {
            this.props.onDelete(item.id);
        }
    }

}

class EditItem extends React.Component {

    constructor(props) {
        super(props);
        this.onCancel = this.onCancel.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        const itemToEdit = props.item;
        this.state = {
            id: itemToEdit.id,
            name: itemToEdit.name
        };
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    onCancel() {
        this.props.onCancel();
    }

    onSubmit() {
        this.props.onSubmit(this.state);
    }

    render() {
        return (
            <div className="input-panel">
                <span className="form-caption">Edit item:</span>&nbsp;<span>{this.state.name}</span>
                <div>
                    <label className="field-name">Name:<br/>
                        <input value={this.state.name} name="name" maxLength="40" required
                               onChange={this.handleInputChange} placeholder="item name"/>
                    </label>
                </div>
                <br/>
                <button onClick={() => this.onCancel()}>Cancel</button>
                &nbsp;
                <button onClick={() => this.onSubmit()}>Update</button>
            </div>
        );
    }
}


const SomePage = () => {
    return <h1>Some Page abc</h1>;
};

ReactDOM.render(<Home />, document.getElementById("content"));
