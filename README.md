# string-buffer

Building strings in solidity in gas effective manner.

## Description

It is a counter proposal to concatenating strings with `abi.encodePacked()`.
The goal is gas efficiency.
Instead of copying around strings, one large buffer is allocated and filled in subsequent steps.

## Usage

Initialize an instance of a string buffer: `StringBufferLib.initialize(initialLength)`. 
The parameter `initialLength` is an initial length or capacity of buffer.

Then you can call multiple times functions 
`StringBufferLib.appendBytes()`,
`StringBufferLib.appendBytes32()` or
`StringBufferLib.appendBytesXX()`.

Remember to call `StringBufferLib.finalize()` to set the right length of output.

## Example

Instead of this

```solidity
string memory output = "<div>";
for (uint256 i = 0 ; i < parts.length ; i ++) {
    output = string(abi.encodePacked(output, "<p>", parts[i], "</p>"));
}
output = string(abi.encodePacked(output, "</div"));
```

you can do this

```solidity
StringBufferLib.StringBuffer memory sb = StringBufferLib.initialize(256);
StringBufferLib.appendBytesXX(sb, 0x3c6469763e, 5); // <div>
for (uint256 i = 0 ; i < parts.length ; i ++) {
    StringBufferLib.appendBytesXX(sb, 0x3c703e, 3); // <p>
    StringBufferLib.appendBytes(sb, bytes(parts[i]));
    StringBufferLib.appendBytesXX(sb, 0x3c2f703e, 4); // </p>
}
StringBufferLib.appendBytesXX(sb, 0x3c2f6469763e, 6); // </div>
StringBufferLib.finalize(sb);
string memory ouput = string(sb.data);
```

## Tests and benchmarks

The test file `StringBufferTest.test.ts` also contains benchmarks. 
Benchmarks track gas usage with `gasleft()` inside solidity test functions rather than with hardhat's gasReport.
This better captures string manipulation costs as they are.

## Recommendations and remarks

1. If an initial length of buffer is exceeded, then a buffer is extended. 
The code does not revert.
   
2. When a buffer is extended, it is actually replaced by a new buffer a bit more than two times larger.

3. It is good to set an initial length larger than expected output. To avoid extending.
On the other hand, setting an extremely large initial length is also a waste of memory.
   
4. It is better to use `appendBytesXX()` instead of `appendBytes()` when appending a short constant string, 
a string within 32 bytes.
   
5. A string buffer is a good replacement for multiple chained `abi.encodePacked()`,
it is not a good replacement for a single `abi.encodePacked()`.
   
6. A string buffer instance keeps memory pointers. 
So it cannot be stored or passed in calls to another contracts - which is putting it to calldata.
It is fly weight object.
   
7. A string buffer performs low level memory operations. Many assembly code. It uses explicit memory pointers.
Some tools like provers or smt checkers may have issues. It is good to separate code.
   
8. Implementation heavily relies on solidity memory layout. 
If it happened that future versions of solidity will modify the memory layout, implementation will be broken.
   
9. There is always allocated extra 32 bytes for a buffer. It is a margin, located at the end of a buffer.
When writing enters a margin, a buffer needs to be extended.
So it is always safe to copy 32 bytes even if you need just 2 bytes.
It is internal, improves gas efficiency, no impact on the rest of a contract.

10. It is called a string buffer, but it actually uses bytes. Not a big difference, bytes has explicit length.

11. The function `finalize()` can be called multiple times - it just sets a length of output.
But this length becomes invalid after a subsequent append.
