// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library StringBufferV2Lib {

    struct StringBuffer {
        bytes[] dataTab;
        uint256 position;
    }

    function initialize(uint256 length) internal pure returns (StringBuffer memory stringBuffer) {
        stringBuffer = StringBuffer(new bytes[](length), 0);
    }

    function append(StringBuffer memory stringBuffer, bytes memory data) internal pure {
        unchecked {
            stringBuffer.dataTab[stringBuffer.position ++] = data;
        }
    }

    function finalize(StringBuffer memory stringBuffer) internal pure returns (bytes memory output) {
        unchecked {
            uint256 outputLength = 0;
            for (uint256 i = 0 ; i < stringBuffer.position ; i ++) {
                outputLength += stringBuffer.dataTab[i].length;
            }
            output = new bytes(outputLength + 32);
            assembly {
                mstore(output, outputLength)
            }

            bytes memory newData;
            uint256 newDataLength;
            uint256 srcEndPointer;
            uint256 destEndPointer;
            assembly {
                destEndPointer := add(output, 0x20)
            }
            for (uint256 i = 0 ; i < stringBuffer.position ; i ++) {
                newData = stringBuffer.dataTab[i];
                newDataLength = newData.length;
                assembly {
                    srcEndPointer := add(add(newData, 0x20), newDataLength)
                }
                destEndPointer += newDataLength;
                // that is assumed that allocating a string of newDataLength 1 << 255 is impossible
                // the condition fails on underflows (newDataLength - 1 and newDataLength -= 32)
                // newDataLength - 1 filters out the case newDataLength == 0
                // note that this condition is not equal to newDataLength < (1 << 255), check the case newDataLength == 0
                // copying is safe because of 32 bytes margin
                while (newDataLength - 1 < 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff) {
                    assembly {
                        mstore(sub(destEndPointer, newDataLength), mload(sub(srcEndPointer, newDataLength)))
                    }
                    newDataLength -= 32;
                }
            }
        }
    }
}