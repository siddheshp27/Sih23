#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

starttime=$(date +%s)

# Use absolute paths
SCRIPT_DIR="/mnt/e/Sem7/cer_gen/server/scripts"
FABRIC_SAMPLES_DIR="/mnt/e/Sem7/cer_gen/fabric-samples"
SERVER_DIR="/mnt/e/Sem7/cer_gen/server"

# clean out any old identities in the wallets
rm -rf "${SCRIPT_DIR}/wallet"/*

# Set chaincode source path
CC_SRC_PATH="${SERVER_DIR}/chaincode"

# launch network; create channel and join peer to channel
pushd "${FABRIC_SAMPLES_DIR}/test-network"
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn certificateContract -cci initLedger -ccl javascript -ccp "${CC_SRC_PATH}"
popd

# Enroll admin
node "${SERVER_DIR}/enrollAdmin.js"

# Print execution time
echo "Total setup execution time : $(($(date +%s) - starttime)) secs ..."