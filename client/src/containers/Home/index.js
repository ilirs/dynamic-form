import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { API_URL } from 'config';
import axios from 'axios';
import './styles.css';
// import * as Yup from 'yup';

class Home extends Component {

    constructor(props) {
        super(props)
        this.validator = new SimpleReactValidator();
        this.state = {
            json: null,
        }
    }

    componentDidMount = async () => {
        const response = await axios.get(`${API_URL}/formjson`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

        await this.setState({
            json: response.data
        })

        response.data.map((inp, index) => (
            this.setState({
                [inp.name]: inp.default_value
            })
        ))
    }

    handleInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        // const type = event.target.type;
        this.setState({
            [name]: value
        });
        // await this.validateInputs(type, name);
    }

    //Custom validation method
    // validateInputs = (type, name) => {
    //     if (this.state[name] !== null) {
    //         if (this.state[name].length > 3 &&
    //             this.state[name].length < 64) {
    //             this.setState({
    //                 error: ''
    //             })
    //             return true;
    //         }
    //         else {
    //             this.setState({
    //                 error: `${name} should be greater than:3 char and smaller than: 64!`
    //             })
    //             return false;
    //         }
    //     }
    //     else {
    //         this.setState({
    //             error: `${name} is required!`
    //         })
    //         return false;
    //     }
    // }

    handleSave = async (e) => {
        e.preventDefault();
        this.setState({
            disabled: true
        })
        if (this.validator.allValid()) {
            const response = await axios.post(`${API_URL}/formjson`,
                this.state,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            if (response.status === 200) {
                this.setState({
                    response_status: response.status,
                    disabled: false
                })
            }

        } else {
            this.validator.showMessages();
            this.setState({
                disabled: false
            })
            this.forceUpdate();
        }
    }

    render() {
        const { json, disabled, response_status } = this.state;
        if (json === null) {
            return <div>Loading...</div>
        }
        return (
            <div className="container">
                <div className="header">
                    Dynamic form
                </div>
                <form>
                    {json.map((inp, index) => (
                        <div className="form-group" key={index}>
                            <label htmlFor={inp.name}>{inp.label}</label>

                            {inp.type === 'select' ?
                                <React.Fragment>
                                    <select
                                        type={inp.type}
                                        name={inp.name}
                                        disabled={disabled ? true : false}
                                        className="form-control"
                                        defaultValue={inp.default_value}
                                        onChange={this.handleInputChange}
                                        id={inp.name}>
                                        <option value="">{inp.placeholder}</option>
                                        {inp.options.map(opt => <option key={opt.label} label={opt.label} value={opt.value}></option>)}

                                    </select>
                                    {this.validator.message(inp.name, this.state[inp.name], inp.rules)}
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <input
                                        type={inp.type}
                                        name={inp.name}
                                        defaultValue={inp.default_value}
                                        placeholder={inp.placeholder}
                                        className="form-control"
                                        disabled={disabled ? true : false}
                                        onChange={this.handleInputChange}
                                        id={inp.name}></input>
                                    {this.validator.message(inp.name, this.state[inp.name], inp.rules)}
                                </React.Fragment>
                            }
                        </div>
                    ))}
                    <div className="form-group">
                        <button
                            type="submit"
                            className="btn btn-primary btn-width"
                            disabled={disabled ? true : false}
                            onClick={(event) => this.handleSave(event)}>Save</button>
                    </div>
                </form>
                {response_status ?
                    <div className="success">
                        {response_status === 200 ? "Successfully POST request" : ""}
                    </div> : null}
            </div>
        )
    }
}

export default Home;

