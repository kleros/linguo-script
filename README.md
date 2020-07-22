Script to fetch additional data for Linguo disputes in Kleros Court.

## Usage

1. Copy `.env.example` to `.env`:
   ```sh
   cp .env.example .env
   ```
2. Fill in the required environment variables.
3. Build the script:
   ```sh
   yarn build
   ```
4. Host the generated target file in `dist/` directory in IPFS.
5. Update the `dynamicScriptURI` in Linguo metaEvidence file.
