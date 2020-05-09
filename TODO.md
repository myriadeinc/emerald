# TODOs

Explanation: Since there are major changes that must be made, this is a temporary file that will store the most pertinent requirements in order for Emerald to launch into production

# Background info
The `RandomX` algo is used for the PoW check in Monero, but the actual block hashing and structure still relies on `Cryptonote` and Monero-specific settings for block creation.
We can still manually check the PoW by examining the hash but this is a tedious and non-neccessary goal.

`blockhashing_blob` vs `blocktemplate_blob` : `blockhashing_blob` is the data to be sent to miners to find the nonce, this is with all transactions in the block consolidated as the use Merkle trees (or similar tree data structure) to construct transactions. In order to actually test with the nonce, we have to build from the raw data in `blocktemplate_blob` to reconstruct the block, which then uses some utilities to create them.

[`getTargetHex()`](https://en.bitcoinwiki.org/wiki/Difficulty_in_Mining)

# Major changes required 
- Add method to push new jobs to miner clients (might require heavy refactor or even rewrite due to use of third-party library)
- Add either proper `varDiff` functionality or option to change `difficulty` by API call or other on-demand configuration
- Use proper `extraNonce` field 
- Add some semblance of a banning system for invalid shares
- Add proper class for `Job` 
- Add proper `blocktemplate` validation from `pickaxe` and checking of new blocks

# Nice-to-haves
- Minimize Docker image
- Refactor node-gyp libraries for only `randomx` and Monero block constructing functions
- Have safer authentication method (or chagne after we have first-party client)