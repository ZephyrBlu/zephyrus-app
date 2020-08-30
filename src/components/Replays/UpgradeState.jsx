import { Fragment } from 'react';

const UpgradeState = (props) => {
    let unitsRendered = 0;
    const windowSize = window.innerWidth;
    let unitLimit;

    if (windowSize <= 1400) {
        unitLimit = 6;
    } else if (windowSize <= 1500) {
        unitLimit = 7;
    } else if (windowSize <= 1700) {
        unitLimit = 8;
    } else {
        unitLimit = 10;
    }

    const upgradeTypesSeen = { 1: [], 2: [] };
    const currentUpgrades = { 1: {}, 2: {} };

    if (Object.keys(props.timelineState[1]).length > 1) {
        Object.keys(props.timelineState).forEach(playerId => (
            props.timelineState[playerId].upgrade.forEach((upgradeName) => {
                const upgradeType = upgradeName.slice(0, -1);

                if (upgradeTypesSeen[playerId].indexOf(upgradeType) === -1) {
                    upgradeTypesSeen[playerId].push(upgradeType);
                }
                currentUpgrades[playerId][upgradeType] = upgradeName;
            })
        ));
    }

    const insertBreak = () => {
        const isBreak = (unitsRendered >= unitLimit && unitsRendered % unitLimit === 0) ?
            <br key={unitsRendered} /> : null;
        unitsRendered += 1;

        return isBreak;
    };

    return (
        <div className="timeline-state__info timeline-state__info--upgrades">
            <h2 className="state-info-title">Upgrades</h2>
            {Object.keys(props.timelineState).map((playerId) => {
                unitsRendered = 0;

                return (
                    <div
                        key={`timeline-state__unit-info-player${playerId}`}
                        className={`timeline-state__info-player${playerId}`}
                    >
                        {Object.values(currentUpgrades[playerId]).map(upgradeName => (
                            <Fragment key={`${upgradeName}-${playerId}-frag`}>
                                {insertBreak()}
                                <img
                                    key={`${upgradeName}-${playerId}-img`}
                                    alt={upgradeName}
                                    title={upgradeName}
                                    className="timeline-state__image"
                                    src={`./images/upgrade/${props.players[playerId].race}/${upgradeName}.png`}
                                />
                                {upgradeName.includes(props.players[playerId].race) && (
                                    upgradeName.includes('1') || upgradeName.includes('2') || upgradeName.includes('3')
                                ) &&
                                    <div
                                        key={`${upgradeName}-${playerId}-div`}
                                        className="timeline-state__object-label timeline-state__object-count"
                                    >
                                        {upgradeName.slice(-1)}
                                    </div>}
                            </Fragment>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default UpgradeState;
