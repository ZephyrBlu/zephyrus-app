import React, { Fragment } from 'react';

const UpgradeState = (props) => {
    const upgradeTypesSeen = { 1: [], 2: [] };
    const currentUpgrades = { 1: {}, 2: {} };

    if (Object.keys(props.timelineState[1]).length > 1) {
        props.playerOrder.forEach(playerId => (
            props.timelineState[playerId].upgrade.forEach((upgradeName) => {
                const upgradeType = upgradeName.slice(0, -1);

                if (upgradeTypesSeen[playerId].indexOf(upgradeType) === -1) {
                    upgradeTypesSeen[playerId].push(upgradeType);
                }
                currentUpgrades[playerId][upgradeType] = upgradeName;
            })
        ));
    }

    return (
        <div className="timeline-state__info timeline-state__info--upgrades">
            <h2 className="state-info-title">Upgrades</h2>
            {props.playerOrder.map((playerId, index) => (
                <div
                    key={`timeline-state__unit-info-player${index + 1}`}
                    className={`timeline-state__info-player${index + 1}`}
                >
                    {Object.values(currentUpgrades[playerId]).map(upgradeName => (
                        <Fragment key={`${upgradeName}-${playerId}-frag`}>
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
            ))}
        </div>
    );
};

export default UpgradeState;
