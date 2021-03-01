import { Component, Fragment } from 'react';
import DefaultResponse from './DefaultResponse';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, info) {
        console.error(error);
        this.setState({
            error: error,
            errorInfo: info,
        });
    }

    render() {
        if (this.state.error || this.state.errorInfo) {
            return (
                <Fragment>
                    <DefaultResponse content="Something went wrong" />
                    {this.state.error
                        ? this.state.error.toString()
                        : <DefaultResponse content="Can't display error" />}
                    {this.state.errorInfo
                        ? this.state.errorInfo.componentStack
                        : <DefaultResponse content="Can't display stack trace" />}
                </Fragment>
            );
        }
        return this.props.children;
    }
};

export default ErrorBoundary;
