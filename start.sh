#!/bin/bash
rm -Rf /data/backup/bikini/
cd /data/html/bikini
npm stop
npm config set registry https://registry.npm.taobao.org
npm i
nodeinstall --install-alinode v5.13.0
npm run clean
npm run tsc
NODE_LOG_DIR=/data/html/logs/bikini/alinode ENABLE_NODE_LOG=YES npm start
