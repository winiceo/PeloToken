"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helpers_1 = require("./helpers");
const PeloponnesianToken = artifacts.require('./PeloponnesianToken.sol');
contract('PeloponnesianToken', accounts => {
    const owner = accounts[0];
    const nonOwner = accounts[2];
    describe('Constructor', () => {
        let token;
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            token = yield PeloponnesianToken.deployed();
        }));
        it('should set name', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.equal(yield token.name(), 'Peloponnesian');
        }));
        it('should set symbol', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.equal(yield token.symbol(), 'PELO');
        }));
        it('should set decimals', () => __awaiter(this, void 0, void 0, function* () {
            helpers_1.assertNumberEqual(yield token.decimals(), helpers_1.PELO_DECIMALS);
        }));
        it('should start with zero totalSupply', () => __awaiter(this, void 0, void 0, function* () {
            helpers_1.assertPeloponnesianEqual(yield token.totalSupply(), 0);
        }));
        it('should set owner', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.equal(yield token.owner(), accounts[0]);
        }));
        it('should set maximumSupply', () => __awaiter(this, void 0, void 0, function* () {
            helpers_1.assertPeloponnesianEqual(yield token.maximumSupply(), helpers_1.toPeloponnesian(10000000000));
        }));
        it('should be minting', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.isFalse(yield token.mintingFinished());
        }));
    });
    describe('Function mint', () => {
        const beneficiary = accounts[1];
        const amount = helpers_1.toPeloponnesian(100);
        let token;
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            token = yield PeloponnesianToken.new();
        }));
        it('should increase totalSupply', () => __awaiter(this, void 0, void 0, function* () {
            const prevSupply = yield token.totalSupply();
            yield token.mint(beneficiary, amount);
            helpers_1.assertPeloponnesianEqual(yield token.totalSupply(), prevSupply.add(amount));
        }));
        it('should increase balance', () => __awaiter(this, void 0, void 0, function* () {
            const prevBalance = yield token.balanceOf(beneficiary);
            yield token.mint(beneficiary, amount);
            helpers_1.assertPeloponnesianEqual(yield token.balanceOf(beneficiary), prevBalance.add(amount));
        }));
        it('should emit Mint event', () => __awaiter(this, void 0, void 0, function* () {
            const tx = yield token.mint(beneficiary, amount);
            const log = helpers_1.findLastLog(tx, 'Mint');
            chai_1.assert.isOk(log);
            const event = log.args;
            chai_1.assert.isOk(event);
            chai_1.assert.equal(event.to, beneficiary);
            helpers_1.assertPeloponnesianEqual(event.amount, amount);
        }));
        it('should emit Transfer event', () => __awaiter(this, void 0, void 0, function* () {
            const tx = yield token.mint(beneficiary, amount);
            const log = helpers_1.findLastLog(tx, 'Transfer');
            chai_1.assert.isOk(log);
            const event = log.args;
            chai_1.assert.isOk(event);
            chai_1.assert.equal(event.from, '0x' + '0'.repeat(40));
            chai_1.assert.equal(event.to, beneficiary);
            helpers_1.assertPeloponnesianEqual(event.value, amount);
        }));
        it('should revert when minting is finished', () => __awaiter(this, void 0, void 0, function* () {
            yield token.finishMinting();
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield token.mint(beneficiary, amount);
            }));
        }));
        it('should revert when called by non-owner', () => __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield token.mint(beneficiary, amount, {
                    from: nonOwner
                });
            }));
        }));
        it('should revert when exceeds maximumSupply', () => __awaiter(this, void 0, void 0, function* () {
            const maximumSupply = yield token.maximumSupply();
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield token.mint(beneficiary, maximumSupply.add(1));
            }));
        }));
    });
    describe('Function finishMinting', () => {
        let token;
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            token = yield PeloponnesianToken.new();
        }));
        it('should set mintingFinished', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.isFalse(yield token.mintingFinished());
            yield token.finishMinting();
            chai_1.assert.isTrue(yield token.mintingFinished());
        }));
        it('should emit MintFinished event', () => __awaiter(this, void 0, void 0, function* () {
            const tx = yield token.finishMinting();
            const log = helpers_1.findLastLog(tx, 'MintFinished');
            chai_1.assert.isOk(log);
            const event = log.args;
            chai_1.assert.isOk(event);
        }));
        it('should revert when called by non-owner', () => __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield token.finishMinting({ from: nonOwner });
            }));
        }));
        it('should revert when called after minting is finished', () => __awaiter(this, void 0, void 0, function* () {
            yield token.finishMinting();
            yield helpers_1.assertReverts(() => __awaiter(this, void 0, void 0, function* () {
                yield token.finishMinting();
            }));
        }));
    });
});
