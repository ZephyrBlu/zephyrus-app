import './CSS/SpinningRingAnimation.css';

const SpinningRingAnimation = ({ style }) => (
    <div className="lds-ring" style={style}>
        <div />
        <div />
        <div />
        <div />
    </div>
);

export default SpinningRingAnimation;
