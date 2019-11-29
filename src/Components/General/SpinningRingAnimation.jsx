import './CSS/SpinningRingAnimation.css';

const SpinningRingAnimation = props => (
    <div className="lds-ring" style={props.style}>
        <div />
        <div />
        <div />
        <div />
    </div>
);

export default SpinningRingAnimation;
