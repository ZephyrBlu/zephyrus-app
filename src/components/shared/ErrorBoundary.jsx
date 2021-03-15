import React, { Component, Fragment } from 'react';
import DefaultResponse from './DefaultResponse';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null }; // eslint-disable-line react/state-in-constructor
    }

    componentDidCatch(error, info) {
        console.error(error);
        this.setState({
            error,
            errorInfo: info,
        });
    }

    render() {
        if (this.state.error || this.state.errorInfo) {
            return (
                <Fragment>
                    <DefaultResponse content="Something went wrong" />
                    <DefaultResponse
                        style={{ whiteSpace: 'pre-wrap' }}
                        content={this.state.error
                            ? this.state.error.stack || this.state.error.toString()
                            : "Can't display error"}
                    />
                    <DefaultResponse
                        style={{ whiteSpace: 'pre-wrap' }}
                        content={this.state.errorInfo
                            ? this.state.errorInfo.componentStack
                            : "Can't display stack trace"}
                    />
                </Fragment>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
