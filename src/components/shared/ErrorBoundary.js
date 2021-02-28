import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // do something with the error
        console.error(error, info);
    }
    
    render() {
        if (this.state.hasError) {
            return (
                <span>An error occurred</span>
            );
        }
        return this.props.children;
    }
};

export default ErrorBoundary;
