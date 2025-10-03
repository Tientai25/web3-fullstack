// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    int256 private _value;

    event ValueChanged(address indexed caller, int256 newValue);

    function current() external view returns (int256) {
        return _value;
    }

    function increment() external {
        _value += 1;
        emit ValueChanged(msg.sender, _value);
    }

    function decrement() external {
        _value -= 1;
        emit ValueChanged(msg.sender, _value);
    }
}
