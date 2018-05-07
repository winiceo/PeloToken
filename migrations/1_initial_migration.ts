import { PeloponnesianArtifacts } from 'Peloponnesian';
import { Deployer } from 'truffle';

declare const artifacts: PeloponnesianArtifacts;

const Migrations = artifacts.require('./Migrations.sol');

async function deploy(deployer: Deployer) {
    await deployer.deploy(Migrations);
}

function migrate(deployer: Deployer) {
    deployer.then(() => deploy(deployer));
}

export = migrate;
