// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "../StringBufferLib.sol";
import "../StringBufferV2Lib.sol";

contract StringBufferV2Test {

    function test1(uint256 length, bytes[] memory dataTab) external pure returns (bytes memory) {
        StringBufferV2Lib.StringBuffer memory stringBuffer = StringBufferV2Lib.initialize(length);
        for (uint256 i = 0 ; i < dataTab.length ; i ++) {
            StringBufferV2Lib.append(stringBuffer, dataTab[i]);
        }
        bytes memory output = StringBufferV2Lib.finalize(stringBuffer);
        return output;
    }

    function benchmark4(uint256 lengthV1, uint256 lengthV2, bytes[] memory dataTab) external view returns (uint256, uint256, uint256) {
        uint256 startGas = gasleft();
        bytes memory str = "<div>";
        for (uint256 i = 0 ; i < dataTab.length ; i ++) {
            str = abi.encodePacked(str, "<p>", dataTab[i], "</p>");
        }
        str = abi.encodePacked(str, "</div>");
        uint256 finishGas = gasleft();
        uint256 gas1 = startGas - finishGas;

        startGas = gasleft();
        StringBufferLib.StringBuffer memory stringBuffer = StringBufferLib.initialize(lengthV1);
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

        startGas = gasleft();
        StringBufferV2Lib.StringBuffer memory stringBufferV2 = StringBufferV2Lib.initialize(lengthV2);
        StringBufferV2Lib.append(stringBufferV2, "<div>");
        for (uint256 i = 0 ; i < dataTab.length ; i ++) {
            StringBufferV2Lib.append(stringBufferV2, abi.encodePacked("<p>", dataTab[i], "</p>"));
        }
        StringBufferV2Lib.append(stringBufferV2, "</div>");
        StringBufferV2Lib.finalize(stringBufferV2);
        finishGas = gasleft();
        uint256 gas3 = startGas - finishGas;

        return (gas1, gas2, gas3);

    }
}
