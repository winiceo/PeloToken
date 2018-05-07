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
const bignumber_js_1 = require("bignumber.js");
const chai_1 = require("chai");
const ramda_1 = require("ramda");
exports.PELO_DECIMALS = 18;
function assertNumberEqual(actual, expect, decimals = 0) {
    const actualNum = new bignumber_js_1.BigNumber(actual);
    const expectNum = new bignumber_js_1.BigNumber(expect);
    if (!actualNum.eq(expectNum)) {
        const div = decimals ? Math.pow(10, decimals) : 1;
        chai_1.assert.fail(actualNum.toFixed(), expectNum.toFixed(), `${actualNum.div(div).toFixed()} == ${expectNum.div(div).toFixed()}`, '==');
    }
}
exports.assertNumberEqual = assertNumberEqual;
function assertPeloponnesianEqual(actual, expect) {
    return assertNumberEqual(actual, expect, exports.PELO_DECIMALS);
}
exports.assertPeloponnesianEqual = assertPeloponnesianEqual;
function toPeloponnesian(num) {
    return shiftNumber(num, exports.PELO_DECIMALS);
}
exports.toPeloponnesian = toPeloponnesian;
function shiftNumber(num, decimals) {
    const factor = new bignumber_js_1.BigNumber(10).pow(decimals);
    return new bignumber_js_1.BigNumber(num).mul(factor);
}
exports.shiftNumber = shiftNumber;
function findLastLog(trans, event) {
    return ramda_1.findLast(ramda_1.propEq('event', event))(trans.logs);
}
exports.findLastLog = findLastLog;
function assertReverts(func) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield func();
        }
        catch (error) {
            assertRevertError(error);
            return;
        }
        chai_1.assert.fail({}, {}, 'Should have reverted');
    });
}
exports.assertReverts = assertReverts;
function assertRevertError(error) {
    if (error && error.message) {
        if (error.message.search('revert') === -1) {
            chai_1.assert.fail(error, {}, 'Expected revert error, instead got: ' + error.message);
        }
    }
    else {
        chai_1.assert.fail(error, {}, 'Expected revert error');
    }
}
exports.assertRevertError = assertRevertError;
