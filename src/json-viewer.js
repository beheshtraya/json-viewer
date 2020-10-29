import React, {Component} from 'react';


class JsonList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: false,
            collapsedNodes: [],

        }
        this.collapse = this.collapse.bind(this);
    }

    collapse(e, i = null) {
        if (i === null) {
            this.setState({isCollapsed: !this.state.isCollapsed});
        } else {
            let index = this.state.collapsedNodes.indexOf(i);
            console.log(index);

            if (index === -1) {
                this.setState({collapsedNodes: [...this.state.collapsedNodes, i]});
            } else {
                this.state.collapsedNodes.splice(index, 1);
                this.setState({collapsedNodes: this.state.collapsedNodes});
            }
        }
    }

    render() {
        const {content} = this.props;
        let nodes = []

        if (typeof content === 'number') {
            const color = content > 0 ? 'green' : 'red';
            nodes.push(
                <ul key={this.props.parentKey}>
                    <li>
                        <span className={this.state.isCollapsed ? 'caret': 'caret caret-down'} onClick={this.collapse}/>
                        {!this.state.isCollapsed ?
                            <span style={{color}}>
                            {content}
                        </span> : null}
                    </li>
                </ul>
            );
        }
        if (typeof content === 'string') {
            nodes.push(
                <ul key={this.props.parentKey}>
                    <li>
                        <span className={this.state.isCollapsed ? 'caret': 'caret caret-down'} onClick={this.collapse}/>
                        {!this.state.isCollapsed ?
                            <span>{content}</span> : null}
                    </li>
                </ul>
            )
        }
        if (typeof content === 'object') {
            Object.keys(content).forEach(key => {
                nodes.push(
                    <li key={key}>
                        <span
                            className={this.state.collapsedNodes.includes(key) ? 'caret': 'caret caret-down'}
                            onClick={(e) => this.collapse(e, key)}/>
                        {!this.state.collapsedNodes.includes(key) ?
                            <span>
                             {key}
                                <JsonList content={content[key]} parentKey={key}/>
                         </span> : null}
                    </li>
                );
            });
        }

        return (
            <ul className={''}>
                {nodes}
            </ul>)
    }
}


export default class JsonViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jsonInput: '{}',
            parsedJSON: {}
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateViewer = this.updateViewer.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    updateViewer(event) {
        const {jsonInput} = this.state;

        try {
            const parsedJSON = JSON.parse(jsonInput);
            this.setState({parsedJSON})
        } catch(e) {
            alert('Invalid JSON');
        }
    }

    render() {
        return (
            <div>
                <div>
                    <textarea name='jsonInput' className='editor' onChange={this.handleInputChange}/>
                </div>

                <div className="vl"/>

                <div className='viewer'>
                    <JsonList content={this.state.parsedJSON} isRoot={true}/>
                </div>

                <div>
                    <button className='btn' onClick={this.updateViewer}> Update</button>
                </div>
            </div>
        );
    }
}