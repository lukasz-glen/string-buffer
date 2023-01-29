// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "../StringBufferLib.sol";

contract StringBufferTest {

    function test1(uint256 length, bytes[] memory dataTab) external pure returns (bytes memory) {
        StringBufferLib.StringBuffer memory stringBuffer = StringBufferLib.initialize(length);
        for (uint256 i = 0 ; i < dataTab.length ; i ++) {
            StringBufferLib.appendBytes(stringBuffer, dataTab[i]);
        }
        StringBufferLib.finalize(stringBuffer);
        return stringBuffer.data;
    }

    function benchmark1(uint256 length, bytes[] memory dataTab) external view returns (uint256) {
        StringBufferLib.StringBuffer memory stringBuffer = StringBufferLib.initialize(length);
        uint256 startGas = gasleft();
        for (uint256 i = 0 ; i < dataTab.length ; i ++) {
            StringBufferLib.appendBytes(stringBuffer, dataTab[i]);
        }
        uint256 finishGas = gasleft();
        StringBufferLib.finalize(stringBuffer);
        return startGas - finishGas;
    }

    function test2(uint256 length, bytes32[] memory dataTab) external pure returns (bytes memory) {
        StringBufferLib.StringBuffer memory stringBuffer = StringBufferLib.initialize(length);
        for (uint256 i = 0 ; i < dataTab.length ; i ++) {
            StringBufferLib.appendBytes32(stringBuffer, dataTab[i]);
        }
        StringBufferLib.finalize(stringBuffer);
        return stringBuffer.data;
    }

    function benchmark2(uint256 length, bytes32[] memory dataTab) external view returns (uint256) {
        StringBufferLib.StringBuffer memory stringBuffer = StringBufferLib.initialize(length);
        uint256 startGas = gasleft();
        for (uint256 i = 0 ; i < dataTab.length ; i ++) {
            StringBufferLib.appendBytes32(stringBuffer, dataTab[i]);
        }
        uint256 finishGas = gasleft();
        StringBufferLib.finalize(stringBuffer);
        return startGas - finishGas;
    }

    function test3(uint256 length, bytes32[] memory dataTab, uint256[] memory lengths) external pure returns (bytes memory) {
        StringBufferLib.StringBuffer memory stringBuffer = StringBufferLib.initialize(length);
        for (uint256 i = 0 ; i < dataTab.length ; i ++) {
            StringBufferLib.appendBytesXX(stringBuffer, dataTab[i], lengths[i]);
        }
        StringBufferLib.finalize(stringBuffer);
        return stringBuffer.data;
    }

    function benchmark3(uint256 length, bytes32[] memory dataTab, uint256[] memory lengths) external view returns (uint256) {
        StringBufferLib.StringBuffer memory stringBuffer = StringBufferLib.initialize(length);
        uint256 startGas = gasleft();
        for (uint256 i = 0 ; i < dataTab.length ; i ++) {
            StringBufferLib.appendBytesXX(stringBuffer, dataTab[i], lengths[i]);
        }
        uint256 finishGas = gasleft();
        StringBufferLib.finalize(stringBuffer);
        return startGas - finishGas;
    }

    function test4(uint256 length, bytes[] memory dataBytes, bytes32[] memory dataBytes32, bytes32[] memory dataBytesXX, uint256[] memory lengths) external pure returns (bytes memory) {
        StringBufferLib.StringBuffer memory stringBuffer = StringBufferLib.initialize(length);
        for (uint256 i = 0 ; i < dataBytes.length ; i ++) {
            StringBufferLib.appendBytes(stringBuffer, dataBytes[i]);
            StringBufferLib.appendBytes32(stringBuffer, dataBytes32[i]);
            StringBufferLib.appendBytesXX(stringBuffer, dataBytesXX[i], lengths[i]);
        }
        StringBufferLib.finalize(stringBuffer);
        return stringBuffer.data;
    }

    function benchmark4(uint256 length, bytes[] memory dataTab) external view returns (uint256, uint256) {
        uint256 startGas = gasleft();
        bytes memory str = "<div>";
        for (uint256 i = 0 ; i < dataTab.length ; i ++) {
            str = abi.encodePacked(str, "<p>", dataTab[i], "</p>");
        }
        str = abi.encodePacked(str, "</div>");
        uint256 finishGas = gasleft();
        uint256 gas1 = startGas - finishGas;

        startGas = gasleft();
        StringBufferLib.StringBuffer memory stringBuffer = StringBufferLib.initialize(length);
        StringBufferLib.appendBytesXX(stringBuffer, 0x3c6469763e000000000000000000000000000000000000000000000000000000, 5); // <div>
        for (uint256 i = 0 ; i < dataTab.length ; i ++) {
            StringBufferLib.appendBytesXX(stringBuffer, 0x3c703e0000000000000000000000000000000000000000000000000000000000, 3); // <p>
            StringBufferLib.appendBytes(stringBuffer, dataTab[i]);
            StringBufferLib.appendBytesXX(stringBuffer, 0x3c2f703e00000000000000000000000000000000000000000000000000000000, 4); // </p>
        }
        StringBufferLib.appendBytesXX(stringBuffer, 0x3c2f6469763e0000000000000000000000000000000000000000000000000000, 6); // </div>
        StringBufferLib.finalize(stringBuffer);
        finishGas = gasleft();
        uint256 gas2 = startGas - finishGas;
        return (gas1, gas2);
    }
}
