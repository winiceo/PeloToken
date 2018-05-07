import { PeloponnesianArtifacts } from 'Peloponnesian';

import { Deployer } from 'truffle';

declare const artifacts: PeloponnesianArtifacts;

const PeloponnesianToken = artifacts.require('./PeloponnesianToken.sol');

async function deploy(deployer: Deployer) {
    await deployer.deploy(PeloponnesianToken);
}

function migrate(deployer: Deployer) {
    deployer.then(() => deploy(deployer));
}

export = migrate;
